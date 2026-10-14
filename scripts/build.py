from pathlib import Path
import shutil, subprocess, sys
root=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(root/'scripts/render.py')],check=True)
dist=root/'dist'
if dist.exists():shutil.rmtree(dist)
dist.mkdir()
for p in root.glob('*.html'):shutil.copy2(p,dist/p.name)
for name in ['assets','.well-known'] :shutil.copytree(root/name,dist/name)
for name in ['robots.txt','sitemap.xml','site.webmanifest','.nojekyll']:shutil.copy2(root/name,dist/name)
# Root-relative fallback paths preserve deep-link 404 rendering on project Pages.
# The private preview also accepts these same public asset paths.
for prefix in ['matriz','dataforge-portfolio']:
    compat=dist/prefix;compat.mkdir()
    shutil.copytree(root/'assets',compat/'assets')
    for p in root.glob('*.html'):shutil.copy2(p,compat/p.name)
    shutil.copy2(root/'site.webmanifest',compat/'site.webmanifest')
print('Static site built in dist/. No source, tests, configuration or credentials are published.')
