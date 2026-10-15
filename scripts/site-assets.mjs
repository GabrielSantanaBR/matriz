// Responsive encodings and share artwork; the supplied logo and previews remain untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'package.json'));
const sharp=require('sharp');
const original='assets/brand/logo-matriz.png';
const logo=await fs.readFile(path.join(root,original));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const brand=JSON.parse(await fs.readFile(path.join(root,'docs/brand-provenance.json'),'utf8'));
if(hash(logo)!==brand.sha256)throw new Error('The supplied logo changed');
const assets=[];
async function record(file,source,description){
 const bytes=await fs.readFile(path.join(root,file)),meta=await sharp(bytes).metadata();
 assets.push({file,source,description,width:meta.width,height:meta.height,bytes:bytes.length,sha256:hash(bytes)});
}
for(const width of [96,800]){
 const file=`assets/brand/logo-matriz-${width}.webp`;
 await sharp(logo).resize(width).webp({lossless:true}).toFile(path.join(root,file));
 await record(file,original,'Logo oficial redimensionada, com transparência e codificação lossless.');
}
for(const size of [32,180,192]){
 const file=`assets/brand/icon-${size}.png`;
 await sharp(logo).resize(size).png().toFile(path.join(root,file));
 await record(file,original,'Ícone derivado da logo oficial, sem redesenho.');
}
const image=await sharp(logo).resize(374).png().toBuffer();
const share=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#0A0B0D"/>
<rect x="64" y="65" width="7" height="30" fill="#FF402E"/>
<text x="89" y="91" font-family="DejaVu Sans,Arial,sans-serif" font-size="27" font-weight="600" letter-spacing="5" fill="#F2F1ED">MATRIZ</text>
<text x="64" y="240" font-family="DejaVu Sans,Arial,sans-serif" font-size="60" font-weight="600" letter-spacing="-2" fill="#F2F1ED">Seu negócio.</text>
<text x="64" y="318" font-family="DejaVu Sans,Arial,sans-serif" font-size="60" font-weight="600" letter-spacing="-2" fill="#FF8A45">Próximo nível.</text>
<text x="66" y="406" font-family="DejaVu Sans,Arial,sans-serif" font-size="23" fill="#ABB1B8">Sites personalizados, sistemas financeiros</text>
<text x="66" y="442" font-family="DejaVu Sans,Arial,sans-serif" font-size="23" fill="#ABB1B8">e automação para sua rotina.</text>
<image x="750" y="111" width="374" height="374" href="data:image/png;base64,${image.toString('base64')}"/>
<path d="M64 531H1136" stroke="#303237"/>
<text x="66" y="579" font-family="DejaVu Sans,Arial,sans-serif" font-size="19" fill="#ABB1B8">Conheça os projetos. Vamos conversar sobre o seu negócio.</text>
</svg>`);
const shareFile='assets/brand/matriz-share.png';
await sharp(share).png().toFile(path.join(root,shareFile));
await record(shareFile,original,'Arte de compartilhamento composta por código, com a logo oficial e mensagem do site.');
for(const name of ['finance-manager-anon','nossas-delicias','pata-companhia']){
 const source=`assets/previews/${name}.webp`,meta=await sharp(path.join(root,source)).metadata();
 for(const width of [480,960]){
  if(width>=meta.width)continue;
  const file=`assets/previews/${name}-${width}.webp`;
  await sharp(path.join(root,source)).resize(width).webp({lossless:true}).toFile(path.join(root,file));
  if((await fs.stat(path.join(root,file))).size>=(await fs.stat(path.join(root,source))).size){await fs.unlink(path.join(root,file));continue;}
  await record(file,source,'Prévia responsiva redimensionada com codificação lossless; original preservado.');
 }
}
await fs.writeFile(path.join(root,'docs/site-asset-provenance.json'),JSON.stringify({builder:'scripts/site-assets.mjs',originalLogo:original,originalLogoSha256:hash(logo),method:'Redimensionamento e codificação lossless. Arte social nativa composta com a logo original, sem geração por IA.',assets},null,2)+'\n');
console.log(JSON.stringify({assets:assets.map(({file,bytes,width,height})=>({file,bytes,width,height})),logoUnchanged:true}));
