"""Release gates. Python 3.12+ and Node 22+, without third-party packages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
import hashlib, json, re, struct, subprocess, sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'dist' if '--dist' in sys.argv else ROOT
BASE = 'https://gabrielsantanabr.github.io/matriz/'
failures = []
def require(condition, message):
    if not condition: failures.append(message)

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.nodes, self.text = path, set(), [], []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.nodes.append((tag, a))
        if a.get('id'):
            require(a['id'] not in self.ids, f'{self.path.name}: duplicate ID {a["id"]}')
            self.ids.add(a['id'])
        require('style' not in a and not any(k.lower().startswith('on') for k in a), f'{self.path.name}: inline executable markup')
        if tag == 'script': require(bool(a.get('src')), f'{self.path.name}: inline script')
        if tag == 'a' and a.get('target') == '_blank':
            require({'noopener','noreferrer'} <= set(a.get('rel','').split()), f'{self.path.name}: unprotected external link')
        if tag == 'img': require(all(k in a for k in ['alt','width','height']), f'{self.path.name}: image needs alt/dimensions')
    def handle_startendtag(self, tag, attrs): self.handle_starttag(tag, attrs)
    def handle_data(self, text): self.text.append(text)
    def matching(self, tag, **attrs):
        return [a for t,a in self.nodes if t == tag and all(a.get(k) == v for k,v in attrs.items())]

pages = {p.name: Page(p) for p in sorted(PUBLIC.glob('*.html'))}
require(len(pages) == 22, 'Expected all 22 public HTML pages')
for required in ['index.html','prices.html','contact.html','thanks.html','404.html','project.html','privacy.html','security.html','repertoire.html','sicma.html']:
    require(required in pages, f'Missing required route {required}')

def local_target(source, value):
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        if not value.startswith(BASE): return None, parsed.fragment
        path = PUBLIC / unquote(parsed.path.removeprefix('/matriz/'))
    else:
        raw = unquote(parsed.path)
        if raw.startswith('/matriz/'): path = PUBLIC / raw.removeprefix('/matriz/')
        elif raw.startswith('/'): path = PUBLIC / raw.lstrip('/')
        else: path = source.parent / raw if raw else source
    if path.is_dir(): path /= 'index.html'
    return path, unquote(parsed.fragment)

for name, page in pages.items():
    for tag, attrs in [('html',{'lang':'pt-BR'}),('h1',{}),('main',{'id':'main-content'}),('title',{})]:
        require(len(page.matching(tag,**attrs)) == 1, f'{name}: semantic {tag}')
    require(page.matching('a',href='#main-content'), f'{name}: skip link')
    expected = BASE + ('' if name == 'index.html' else name)
    require(page.matching('link',rel='canonical',href=expected), f'{name}: canonical')
    for key in ['description','twitter:title','twitter:description','twitter:image','twitter:card']:
        require(any(a.get('content') for a in page.matching('meta',name=key)), f'{name}: {key}')
    for key in ['og:title','og:description','og:image','og:image:alt','og:site_name']:
        require(any(a.get('content') for a in page.matching('meta',property=key)), f'{name}: {key}')
    require(page.matching('meta',property='og:url',content=expected), f'{name}: OG URL')
    require(not re.search(r'\bDataForge\b',' '.join(page.text),re.I), f'{name}: obsolete visible brand')
    require(page.matching('link',rel='icon',type='image/png'), f'{name}: PNG favicon')
    csp_nodes = page.matching('meta',**{'http-equiv':'Content-Security-Policy'})
    csp = csp_nodes[0].get('content','') if csp_nodes else ''
    directives = dict((tokens[0],' '.join(tokens[1:])) for part in csp.split(';') if (tokens := part.strip().split()))
    for key,value in {'default-src':"'self'",'base-uri':"'none'",'object-src':"'none'",'frame-src':"'none'",'script-src':"'self'",'style-src':"'self'",'font-src':"'self'",'img-src':"'self'",'worker-src':"'none'"}.items():
        require(directives.get(key) == value, f'{name}: restrictive CSP {key}')
    for key in ['connect-src','form-action']:
        require(directives.get(key) == ('https://api.web3forms.com' if name == 'contact.html' else "'none'"), f'{name}: CSP {key}')
    require('upgrade-insecure-requests' in directives, f'{name}: HTTPS policy')
    for tag,a in page.nodes:
        for attribute in ['href','src','action']:
            value = a.get(attribute)
            if value is None: continue
            require(bool(value) and not value.startswith(('javascript:','http:','data:')), f'{name}: unsafe/empty {attribute}')
            target,fragment = local_target(page.path,value)
            if target:
                require(target.exists(), f'{name}: broken {attribute}={value}')
                if fragment and target.name in pages: require(fragment in pages[target.name].ids, f'{name}: broken fragment {value}')
            if tag == 'script': require(target is not None, f'{name}: remote script')
        for attribute in ['aria-controls','aria-describedby','aria-labelledby']:
            for ref in a.get(attribute,'').split(): require(ref in page.ids, f'{name}: invalid {attribute}={ref}')

home = pages['index.html']
repertoire = pages['repertoire.html']
for anchor in ['inicio','solucoes','cases','repositorios','processo','proof-title','cta-title','year']:
    require(anchor in home.ids, f'Legacy home anchor missing: {anchor}')
all_projects = json.loads((ROOT/'content/projects.json').read_text())
projects = [p for p in all_projects if p.get('listed',True)]
audit = json.loads((ROOT/'docs/repository-audit.json').read_text())
require(len(projects) == len(repertoire.matching('a',**{'class':'repo-row'})) == 11, 'Curated portfolio requires 11 entries')
require(sum(bool(p.get('featured')) for p in projects) == 10, 'Expected 10 featured cases')
require(not any(p.get('fork') or p['category']=='Estudos' for p in projects), 'Course exercises and forks must not appear in the commercial portfolio')
require(audit['public_count'] == 26 and audit['repertoire_count'] == 25, 'Research counts must match evidence')
require(not repertoire.matching('a',**{'data-kind':'fork'}), 'Forks must not appear in the selected HTML')
require(not any(p['repo'] == 'GabrielSantanaBR' for p in projects), 'Profile repository is not a project')
for p in projects:
    require(repertoire.matching('a',**{'data-repo':p['repo']}), f'Missing repertoire entry {p["repo"]}')
    if p.get('page'):
        require(p['page'] in pages and p.get('evidence'), f'Missing case/evidence {p["repo"]}')
require(next(p for p in projects if p['repo'] == 'projeto_academia').get('branch') == 'feat/mvp', 'Movimento evidence belongs to feat/mvp')

form = pages['contact.html']
fields = {a.get('name'):a for t,a in form.nodes if t in ['input','textarea','select']}
for key in ['name','email','service','message']: require(key in fields and 'required' in fields[key], f'Required field {key}')
for key in ['phone','company','budget']: require(key in fields and 'required' not in fields[key], f'Field must remain optional: {key}')
for key,a in fields.items():
    if a.get('type') == 'hidden': continue
    require(form.matching('label',**{'for':a.get('id')}), f'Unlabeled field {key}')
    if key not in ['service','botcheck']: require(a.get('maxlength'), f'Unbounded field {key}')
require('botcheck' in fields and fields['botcheck'].get('tabindex') == '-1', 'Honeypot missing or keyboard accessible')
require(form.matching('p',id='form-status',role='status'), 'Accessible form status missing')
service_values = {a.get('value') for a in form.matching('option')}
for page in pages.values():
    for a in page.matching('a'):
        url = urlsplit(a.get('href',''))
        if url.path.endswith('contact.html') and 'service' in parse_qs(url.query):
            require(parse_qs(url.query)['service'][0] in service_values, f'{page.path.name}: unknown service CTA')

for css in (PUBLIC/'assets/css').glob('*.css'):
    text = css.read_text()
    for value in re.findall(r'url\([\'"]?([^\)\'\"]+)',text):
        target,_ = local_target(css,value)
        require(target is not None and target.exists(), f'{css.name}: external or missing asset {value}')
    require('prefers-reduced-motion:reduce' in text, 'Reduced motion CSS missing')
require('prefers-reduced-motion: reduce' in (PUBLIC/'assets/js/site.js').read_text(), 'Reduced motion JS missing')
for js in [*(PUBLIC/'assets/js').glob('*.js'), ROOT/'server.mjs']:
    result = subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
    require(result.returncode == 0, f'{js.name}: syntax {result.stderr}')
    require(not re.search(r'\.innerHTML\s*=|\beval\s*\(',js.read_text()), f'{js.name}: unsafe dynamic HTML/eval')

provenance = json.loads((ROOT/'docs/brand-provenance.json').read_text())
logo=PUBLIC/provenance['file']
data=logo.read_bytes()
require(hashlib.sha256(data).hexdigest()==provenance['sha256'], 'The supplied logo must be preserved byte-for-byte')
require(data[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',data[16:24])==tuple(provenance['dimensions']), 'Logo dimensions')
for page in pages.values():
    require(page.matching('meta',property='og:image',content=BASE+provenance['file']), 'Sharing image must use the supplied logo')
for old in ['logo-matriz.svg','favicon.svg','social-matriz.png']:
    require(not (PUBLIC/'assets/brand'/old).exists(), 'Obsolete brand asset remains: '+old)
for font in (PUBLIC/'assets/fonts').glob('*.woff2'): require(font.read_bytes()[:4] == b'wOF2', f'{font.name}: invalid WOFF2')
locs = {n.text for n in ET.parse(PUBLIC/'sitemap.xml').getroot().iter() if n.tag.endswith('}loc')}
expected = {BASE+('' if name == 'index.html' else name) for name,page in pages.items() if not page.matching('meta',name='robots',content='noindex,follow')}
require(locs == expected and len(locs) == 17, 'Sitemap must contain all 17 indexable routes')
require(f'Sitemap: {BASE}sitemap.xml' in (PUBLIC/'robots.txt').read_text(), 'Wrong robots sitemap')
require(f'Contact: {BASE}contact.html' in (PUBLIC/'.well-known/security.txt').read_text(), 'security.txt contact')
secret = re.compile(r'(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)')
scan = [*ROOT.glob('*.md'),*ROOT.glob('*.html'),*ROOT.glob('*.mjs'),*ROOT.glob('*.json')]
for folder in ['assets/js','assets/css','scripts','content','docs','.github','.openai']:
    scan.extend(p for p in (ROOT/folder).rglob('*') if p.suffix in ['.js','.css','.py','.json','.md','.yml','.yaml'])
for path in scan: require(not secret.search(path.read_text()), f'Potential privileged credential in {path.relative_to(ROOT)}')
if '--dist' in sys.argv:
    for forbidden in ['tests','scripts','docs','content','.git','.env','server.mjs','package.json','README.md']:
        require(not (PUBLIC/forbidden).exists(), f'Source included in public output: {forbidden}')
    require((PUBLIC/'dataforge-portfolio/assets/brand/logo-matriz.png').exists(), 'Deep 404 compatibility assets missing')
    require((PUBLIC/'matriz/assets/brand/logo-matriz.png').exists(), 'Current Pages 404 compatibility assets missing')
if failures: raise SystemExit('Release audit failed:\n'+'\n'.join(failures))
print(f'Release audit passed: {len(pages)} pages, 11 selected repositories, 10 featured cases, 17 sitemap URLs; links, anchors, SEO, CSP, form, original logo and assets verified.')
