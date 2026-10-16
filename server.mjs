import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, relative } from 'node:path';

const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json'};
const research = resolve(root, 'tests/browser/fixtures');
const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT_ID);
const port = Number(process.env.PORT) || 4173;
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (isProduction && /^\/(?:__qa|__research)(?:\/|$)/.test(pathname)) {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('Not found');
      return;
    }
    pathname = pathname.replace(/^\/dataforge-portfolio(?=\/)/, '');
    let directory = root, name = pathname.replace(/^\/+/, '') || 'index.html';
    let mock = false;
    if (name === '__qa/' || name === '__qa/index.html') name = 'tests/browser/index.html';
    else if (name === '__qa/harness.js') name = 'tests/browser/harness.js';
    else if (name === '__qa/harness.css') name = 'tests/browser/harness.css';
    else if (name === '__qa/mock-contact.js') name = 'tests/browser/mock-contact.js';
    else if (name === '__qa/contact.html') { name = 'contact.html'; mock = true; }
    else if (name === '__qa/thanks.html') name = 'thanks.html';
    else if (name.startsWith('__research/') && research) {
      const match = name.match(/^__research\/(clientflow|coffee_five_site)\/(.*)$/);
      if (!match) throw new Error('Unavailable fixture');
      directory = resolve(research, match[1]); name = match[2] || 'index.html';
    } else if (!(/^(assets\/|\.well-known\/)/.test(name) || /^[a-z0-9-]+\.(html|xml|txt|webmanifest)$/.test(name))) {
      res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end(await readFile(resolve(root, '404.html'))); return;
    }
    let file = resolve(directory, name);
    if (relative(directory, file).startsWith('..') || name.split('/').some(part => part === '.git' || part === '.env')) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    let body = await readFile(file);
    if (pathname === '/__qa/thanks.html') body = Buffer.from(body.toString().replace(/((?:href|src)=")(?!(?:https?:|#))([^"]+)/g, '$1/$2'));
    if (mock) {
      body = Buffer.from(body.toString()
        .replaceAll('href="assets/', 'href="/assets/')
        .replaceAll('src="assets/', 'src="/assets/')
        .replace('connect-src https://api.web3forms.com', "connect-src 'none'")
        .replace('form-action https://api.web3forms.com', "form-action 'none'")
        .replace('action="https://api.web3forms.com/submit"', 'action="/__qa/disabled"')
        .replace(/name="access_key" value="[^"]+"/, 'name="access_key" value="matriz-local-test"')
        .replace('<script src="/assets/js/site.js', '<script src="/__qa/mock-contact.js"></script><script src="/assets/js/site.js')
        .replace('<main id="main-content" tabindex="-1">', '<main id="main-content" tabindex="-1"><p id="qa-mode" role="note">Teste local: envio externo bloqueado.</p>'));
    }
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(resolve(root, '404.html')).catch(() => 'Not found'));
  }
}).listen(port, '0.0.0.0', () => console.log(`MATRIZ server ready on port ${port}`));
