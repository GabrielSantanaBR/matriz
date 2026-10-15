// Create reproducible visual demonstrations. These are authored previews, not production screenshots.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'package.json'));
const sharp=require('sharp');
const source=JSON.parse(await fs.readFile(path.join(root,'content/demo-preview-data.json'),'utf8'));
const out=path.join(root,'assets/previews');
const scratch='/tmp/matriz-product-previews';
await fs.mkdir(scratch,{recursive:true});
const W=1440,H=900;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const currency=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const num=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:1});
const percent=n=>(n*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
const sum=a=>a.reduce((t,x)=>t+x,0);
let parts=[];
function begin(bg){parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8394ff" stop-opacity=".26"/><stop offset="1" stop-color="#8394ff" stop-opacity="0"/></linearGradient></defs>`];rect(0,0,W,H,bg);}
function rect(x,y,w,h,fill,stroke='none',r=0){parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`);}
function text(x,y,s,size=18,fill='#1d2939',weight=400,anchor='start'){parts.push(`<text x="${x}" y="${y}" font-family="DejaVu Sans,Arial,sans-serif" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`);}
function line(x1,y1,x2,y2,c='#dbe2e8',width=1,dash=''){parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`);}
function circle(x,y,r,c,stroke='none',width=1){parts.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${stroke}" stroke-width="${width}"/>`);}
function pathShape(d,fill='none',stroke='none',width=1,dash=''){parts.push(`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`);}
function donut(cx,cy,r,items,total,width=30){let offset=0;const length=2*Math.PI*r;items.forEach(item=>{parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${item.color}" stroke-width="${width}" stroke-dasharray="${length*item.value/total} ${length}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`);offset+=length*item.value/total;});}
function pill(x,y,s,bg,fg,w=150){rect(x,y,w,31,bg,'none',5);text(x+w/2,y+21,s,12,fg,600,'middle');}
function badge(dark=false){pill(1120,20,'DEMONSTRAÇÃO',dark?'#243345':'#e7edf3',dark?'#c9d7e5':'#43566b',190);}
function footer(s,dark=false){text(40,877,s,13,dark?'#99a9bd':'#64748b');text(1400,877,'Dados de exemplo',13,dark?'#99a9bd':'#64748b',400,'end');}
function chart(x,y,w,h,series,labels,{color='#2579ab',secondary=null,max=null,dark=false,unit='',fill=false,ticks=4}={}){
  const top=y+14,bottom=y+h-32,left=x+55,right=x+w-13;
  const peak=max??Math.ceil(Math.max(...series,...(secondary||[]))*1.15/10)*10;
  for(let i=0;i<=ticks;i++){const yy=bottom-(bottom-top)*i/ticks;line(left,yy,right,yy,dark?'#27334a':'#e0e6ed');text(left-12,yy+5,unit==='R$'?num(peak*i/ticks/1000)+'k':num(peak*i/ticks),12,dark?'#8493ac':'#6b7d8d',400,'end');}
  const coords=a=>a.map((v,i)=>[left+(right-left)*i/Math.max(1,a.length-1),bottom-(bottom-top)*v/peak]);
  const pts=coords(series);
  if(fill)parts.push(`<path d="M ${left},${bottom} L ${pts.map(p=>p.join(',')).join(' L ')} L ${right},${bottom} Z" fill="url(#fade)"/>`);
  function plot(a,c,dashed=false){parts.push(`<polyline points="${coords(a).map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="3.5" ${dashed?'stroke-dasharray="7 5"':''}/>`);coords(a).forEach(p=>circle(p[0],p[1],3.5,c));}
  plot(series,color);if(secondary)plot(secondary,dark?'#8c9ab1':'#95a2b1',true);
  labels.forEach((s,i)=>text(left+(right-left)*i/Math.max(1,labels.length-1),bottom+23,s,12,dark?'#93a2b9':'#6b7d8d',400,'middle'));
}
function table(x,y,width,headers,rows,colWidths,{dark=false,accent='#1c7253',rowHeight=39}={}){
  rect(x,y,width,36,dark?'#202d43':accent,'none',3);
  let xx=x;headers.forEach((s,i)=>{text(xx+12,y+24,s,14,'#fff',600);xx+=colWidths[i];});
  rows.forEach((row,r)=>{const yy=y+36+r*rowHeight;rect(x,yy,width,rowHeight,dark?(r%2?'#121d2e':'#162237'):(r%2?'#fff':'#f2f6f8'));let cx=x;row.forEach((s,i)=>{text(cx+12,yy+25,s,14,dark?'#c9d5e7':'#394e61',i===0?600:400);cx+=colWidths[i];});});
}
function spreadsheet(title,accent,tabs,formula='=SUM(Vendas!G2:G7)'){
 begin('#f5f7f8');rect(0,0,W,53,accent);text(26,35,'▦',26,'#fff');text(76,34,title,20,'#fff',600);pill(1196,13,'DEMONSTRAÇÃO','#ffffff','#2b5947',196);
 rect(0,53,W,40,'#fff');['Arquivo','Página inicial','Inserir','Fórmulas','Dados','Revisão','Exibir'].forEach((s,i)=>text(24+i*139,79,s,14,'#394b57',i===1?600:400));line(148,89,254,89,accent,3);
 rect(0,94,W,53,'#f9fbfc');text(23,126,'Calibri  ·  11',15,'#506371');text(197,126,'B   I   U',17,'#405764',600);text(352,126,'R$   %   0,00',16,'#405764');text(565,126,'Formatação condicional',14,'#506371');text(850,126,'Classificar e filtrar',14,'#506371');text(1110,126,'Inserir gráfico',14,'#506371');line(0,146,W,146,'#d4dce2');
 rect(0,147,W,35,'#fff');rect(13,152,87,25,'#fff','#d5dce3');text(42,170,'E7',12,'#4b5d6e');text(121,170,'fx',16,'#778694');text(167,170,formula,13,'#4b5d6e');
 rect(0,183,W,26,'#edf1f4');let columnX=43;[33,250,143,146,144,153,58,427,43].forEach((width,i)=>{line(columnX,183,columnX,209,'#d2dbe2');text(columnX+width/2,201,String.fromCharCode(65+i),12,'#69808c',400,'middle');columnX+=width;});
 rect(0,209,42,638,'#edf1f4');for(let i=1;i<27;i++)text(27,211+i*24,String(i),11,'#78909c',400,'end');
 rect(43,209,1397,639,'#fff');
 rect(0,848,W,52,'#eff3f5');text(23,881,'‹   ›',24,'#6a7e88');let tx=112;tabs.forEach((t,i)=>{const tw=t.length*9+28;if(i===0){rect(tx,854,tw,37,'#fff');line(tx,890,tx+tw,890,accent,3);}text(tx+13,879,t,13,i===0?accent:'#6d7f8a',i===0?600:400);tx+=tw;});text(1398,881,'100%',13,'#667e8b',400,'end');
}
async function save(name,description,model={}){
 parts.push('</svg>');const svg=parts.join('\n');await fs.writeFile(path.join(scratch,name+'.svg'),svg);
 const input=Buffer.from(svg);await sharp(input).png().toFile(path.join(out,name+'.png'));await sharp(input).webp({lossless:true}).toFile(path.join(out,name+'.webp'));
 const image=await sharp(path.join(out,name+'.png')).metadata();if(image.width!==W||image.height!==H)throw new Error('Incorrect canvas size');
 manifest.push({name,width:W,height:H,description,kind:'authored-demonstration',model});
}
const manifest=[];

// Pricing: ingredient costs feed production costs, suggested prices, sales and margins.
const ingredients={farinha:6.2,acucar:5.4,chocolate:39,manteiga:38,leite:7,ovos:1.15,embalagem:.85};
const productInputs=[
 ['Brownie',24,{farinha:.38,acucar:.55,chocolate:.7,manteiga:.4,ovos:6},24,8.5,168],
 ['Bolo de chocolate',12,{farinha:.75,acucar:.55,chocolate:.32,manteiga:.23,leite:.4,ovos:5},25,15,112],
 ['Cookie',30,{farinha:.6,acucar:.35,chocolate:.38,manteiga:.35,ovos:3},18,6.5,216],
 ['Torta de limão',16,{farinha:.42,acucar:.48,manteiga:.32,leite:.65,ovos:4},26,12.5,92],
 ['Muffin',24,{farinha:.55,acucar:.32,chocolate:.2,manteiga:.26,leite:.3,ovos:4},19,7.9,154],
 ['Pão de mel',24,{farinha:.48,acucar:.4,chocolate:.45,manteiga:.18,leite:.22,ovos:3},24,9.5,138]
];
const pricing=productInputs.map(([product,yieldQty,recipe,labor,price,qty])=>{const ingredientCost=sum(Object.entries(recipe).map(([k,v])=>ingredients[k]*v));const cost=(ingredientCost+labor)/yieldQty+ingredients.embalagem;const fee=.08,revenue=price*qty,directCost=cost*qty,fees=revenue*fee;return{product,cost,price,qty,fee,revenue,directCost,fees,profit:revenue-directCost-fees,suggested:cost/(1-.45-fee),margin:(price-cost-price*fee)/price};});
const revenue=sum(pricing.map(p=>p.revenue)),directCost=sum(pricing.map(p=>p.directCost)),profit=sum(pricing.map(p=>p.profit));
if(Math.abs(profit-(revenue-directCost-revenue*.08))>.000001)throw new Error('Pricing reconciliation failed');
// Pricing is a working price worksheet: a large cell grid, editable inputs and a selected-product calculator.
spreadsheet('Pricing & Sales Manager','#21664a',['Precificação','Insumos','Receitas','Vendas','Dashboard'],'=C7/(1-Config!B4-Config!B5)');
text(76,250,'PRECIFICAÇÃO DOS PRODUTOS',25,'#214c39',700);text(76,279,'Confeitaria demonstrativa · custos por unidade e preço de venda',15,'#647e6b');
pill(678,253,'Células amarelas: entradas','#fff3c7','#7e672b',268);
const pricingCols=[250,143,146,144,153],pricingX=76,pricingY=312,pricingWidth=sum(pricingCols);
rect(pricingX,pricingY,pricingWidth,45,'#21664a');
['Produto','Custo unit.','Preço atual','Preço ideal¹','Margem atual'].forEach((s,i)=>text(pricingX+sum(pricingCols.slice(0,i))+14,pricingY+29,s,16,'#fff',600));
pricing.forEach((p,i)=>{const y=pricingY+45+i*48;rect(pricingX,y,pricingWidth,48,i===0?'#eaf3eb':i%2?'#f7faf6':'#fff');rect(pricingX+393,y,146,48,'#fff3c7');let x=pricingX;[p.product,currency(p.cost),currency(p.price),currency(p.suggested),percent(p.margin)].forEach((s,j)=>{text(x+14,y+31,s,j===0?17:18,j===4?(p.margin<.45?'#af6630':'#21664a'):'#294f3b',j===0||j===3?600:400);line(x,y,x,y+48,'#dce6dc');x+=pricingCols[j];});line(pricingX,y+48,pricingX+pricingWidth,y+48,'#dce6dc');});
rect(pricingX+539,pricingY+45,144,48,'none','#26704e');rect(pricingX+679,pricingY+89,6,6,'#26704e');
text(76,684,'¹ Margem desejada: 45% · taxa do canal: 8%',14,'#58745e');
text(76,726,'COMPOSIÇÃO DO CUSTO · BROWNIE',14,'#456449',700);
const brownie=pricing[0],recipeCost=brownie.cost-1-ingredients.embalagem;
let costStart=76;[[recipeCost,'#4c8964'],[1,'#92b191'],[ingredients.embalagem,'#cfdfc3']].forEach(([v,c])=>{const w=pricingWidth*v/brownie.cost;rect(costStart,745,w,22,c);costStart+=w;});
[['Insumos',recipeCost,'#4c8964'],['Produção',1,'#92b191'],['Embalagem',ingredients.embalagem,'#cfdfc3']].forEach(([l,v,c],i)=>{circle(82+i*278,796,5,c);text(95+i*278,802,l+' · '+currency(v),15,'#456449');});
rect(970,224,427,602,'#f1f6ed','#d1dfce',6);text(996,260,'CALCULADORA DE PREÇO',14,'#4e6d50',700);text(996,306,'Brownie',33,'#214c39',700);
text(996,350,'Custo por unidade',15,'#68836a');text(1370,350,currency(brownie.cost),21,'#214c39',600,'end');line(996,371,1370,371,'#d5e2d1');
text(996,410,'Margem desejada',17,'#4c694f');rect(1256,383,114,41,'#fff3c7','#e2d5a3',3);text(1313,410,'45%',20,'#6d602c',600,'middle');
text(996,465,'Taxa de venda',17,'#4c694f');rect(1256,438,114,41,'#fff3c7','#e2d5a3',3);text(1313,465,'8%',20,'#6d602c',600,'middle');
rect(994,509,378,151,'#21664a','none',5);text(1017,543,'PREÇO SUGERIDO',14,'#b9d4bf',600);text(1017,606,currency(brownie.suggested),52,'#fff',700);text(1017,641,'Custo ÷ (1 − margem − taxa)',14,'#c8e0ca');
text(996,704,'Preço praticado',16,'#57755c');text(1370,704,currency(brownie.price),24,'#214c39',600,'end');text(996,750,'Ajuste sugerido',16,'#57755c');text(1370,750,'+ '+currency(brownie.suggested-brownie.price),24,'#8a6728',600,'end');
text(996,794,'Valores fictícios para demonstrar o cálculo',13,'#6b806b');
await save('demo-pricing-sales','Planilha de precificação com células editáveis, custos por produto e calculadora de margem.',{ingredients,products:pricing,revenue,directCost,profit,targetMargin:.45,channelFee:.08,composition:'worksheet-and-price-calculator'});

// Sales is an exportable business report, with vertical ranking columns and a category donut.
const sales=source.sales;
if(Math.abs(sum(sales.products.map(p=>p.revenue))-sales.revenue)>.000001||sum(sales.products.map(p=>p.units))!==sales.units||sum(sales.products.map(p=>p.transactions))!==sales.rows)throw new Error('Sales totals do not reconcile');
begin('#f8f7f2');rect(0,0,W,72,'#1e3a66');text(42,46,'SALES INTELLIGENCE',22,'#fff',700);text(428,45,'RELATÓRIO COMERCIAL',13,'#b1c5e1',600);pill(1180,21,'DEMONSTRAÇÃO','#e0e9f6','#32547a',215);
text(48,136,'Janeiro, em números.',37,'#193357',700);text(50,176,'02 a 31 de janeiro de 2025 · CSV de demonstração',17,'#7b8493');
text(50,242,currency(sales.revenue),57,'#193357',700);text(52,278,'FATURAMENTO DO PERÍODO',13,'#718097',700);
line(840,133,840,278,'#d5dae3');text(878,174,String(sales.units),47,'#193357',700);text(878,208,'unidades vendidas',16,'#718097');text(1154,174,String(sales.rows),47,'#193357',700);text(1154,208,'transações',16,'#718097');text(878,264,'Ticket médio: '+currency(sales.revenue/sales.rows),19,'#496586',600);
line(48,313,1392,313,'#cdd5df');text(48,358,'O que mais vendeu em valor',23,'#193357',700);text(48,389,'Faturamento por produto · seis maiores',14,'#7b8493');
const translated={'Office Chair':'Cadeira','Monitor 24"':'Monitor 24″','Headset':'Headset','Mouse':'Mouse','Webcam':'Webcam','Desk Lamp':'Luminária'};
const rank=sales.products.slice(0,6),salesBase=606,salesTop=430,rankMax=4000;
[0,2000,4000].forEach(v=>{const y=salesBase-(salesBase-salesTop)*v/rankMax;line(48,y,863,y,'#dbe1e9',1,'4 4');});
rank.forEach((p,i)=>{const x=74+i*132,h=(salesBase-salesTop)*p.revenue/rankMax;rect(x,salesBase-h,84,h,i===0?'#274b7b':i===1?'#4775aa':'#84a3c5','none',4);text(x+42,salesBase-h-16,money(p.revenue),16,'#31577e',600,'middle');text(x+42,635,translated[p.product],15,'#596e87',500,'middle');});
line(907,339,907,642,'#d3dce5');text(950,358,'Vendas por categoria',23,'#193357',700);
const catColors={Electronics:'#2e5c95',Furniture:'#80aac3',Accessories:'#e3aa57'};
const categories=Object.keys(catColors).map(label=>({label,value:sum(sales.products.filter(p=>p.category===label).map(p=>p.revenue)),color:catColors[label]}));
donut(1070,495,85,categories,sales.revenue,32);text(1070,489,'12',38,'#193357',700,'middle');text(1070,519,'produtos',14,'#718097',400,'middle');
categories.forEach((c,i)=>{const y=453+i*43;circle(1213,y-5,5,c.color);text(1229,y,{'Electronics':'Eletrônicos','Furniture':'Móveis','Accessories':'Acessórios'}[c.label],14,'#556b85');text(1229,y+20,percent(c.value/sales.revenue),16,'#193357',600);});
text(950,635,'Valores calculados a partir do CSV público',13,'#7b8493');
text(48,696,'DETALHAMENTO PARA CONFERÊNCIA',13,'#718097',700);text(1391,696,'Exportação: Excel / gráficos',14,'#4775aa',600,'end');
table(48,714,1344,['Produto','Categoria','Unidades','Faturamento','Participação'],sales.products.slice(0,3).map(p=>[p.product==='Office Chair'?'Cadeira de escritório':translated[p.product]||p.product,{'Furniture':'Móveis','Electronics':'Eletrônicos','Accessories':'Acessórios'}[p.category],String(p.units),currency(p.revenue),percent(p.revenue/sales.revenue)]),[345,312,192,266,229],{accent:'#1e3a66',rowHeight:32});
footer('Relatório demonstrativo · métricas reconciliadas com os 30 registros do arquivo de exemplo');
await save('demo-sales-intelligence','Relatório comercial com faturamento, ranking em colunas, participação por categoria e tabela de conferência.',{...sales,categories,composition:'commercial-report'});

// DecisionForge is a data exploration workbench with a cluster canvas and an assistant conversation.
const history=[32000,37000,36000,41000,45000,44000,49000,52000,55000,58000,59000,68200];
begin('#edeaf6');rect(0,0,W,91,'#312448');rect(28,23,45,45,'#bba2ee','none',10);text(50,53,'DF',19,'#312448',700,'middle');text(90,44,'DecisionForge AI',23,'#fff',600);text(91,68,'EXPLORAÇÃO DE DADOS',11,'#bba7d6',600);text(552,53,'varejo_demonstracao.csv',17,'#d4c8e7');pill(1180,29,'DEMONSTRAÇÃO','#57436d','#e7dcf5',220);
text(35,132,'01  Importação',16,'#817092');text(275,132,'02  Qualidade',16,'#817092');rect(509,100,258,51,'#dcd3ef','none',6);text(534,132,'03  Exploração',17,'#6a43a4',600);text(825,132,'04  Decisão',16,'#817092');
rect(32,173,853,530,'#fff','#d4cce2',12);text(58,215,'Segmentos de comportamento',26,'#38294c',700);text(58,246,'Frequência de compra × ticket médio · amostra visual dos grupos',15,'#8a7d97');pill(681,196,'3 grupos','#efe8f9','#754aaf',175);
const scatter={left:109,right:830,top:308,bottom:614};
[0,300,600,900,1200].forEach(v=>{const y=scatter.bottom-(scatter.bottom-scatter.top)*v/1200;line(scatter.left,y,scatter.right,y,'#eee9f3');text(scatter.left-15,y+4,String(v),13,'#8a7d97',400,'end');});
[0,3,6,9,12].forEach(v=>{const x=scatter.left+(scatter.right-scatter.left)*v/12;line(x,scatter.top,x,scatter.bottom,'#f3eff7');text(x,scatter.bottom+25,String(v),13,'#8a7d97',400,'middle');});
text(57,283,'Ticket (R$)',13,'#8a7d97');text(818,674,'Compras no período',13,'#8a7d97',400,'end');
const clusters=[{cx:230,cy:509,count:207,color:'#e5a153',label:'Em desenvolvimento',labelX:135,labelY:593},{cx:460,cy:440,count:350,color:'#af82dc',label:'Ocasionais',labelX:411,labelY:542},{cx:686,cy:373,count:430,color:'#6857bb',label:'Recorrentes',labelX:681,labelY:305}];
clusters.forEach((c,g)=>{circle(c.cx,c.cy,69,g===0?'#fff3e3':g===1?'#f3eafa':'#ede9fa');for(let i=0;i<17;i++){const a=i*2.4+g*.7,r=14+(i%5)*11;circle(c.cx+Math.cos(a)*r,c.cy+Math.sin(a)*r,5+(i%3),c.color);}text(c.labelX,c.labelY,c.label,16,c.color,600);});
[[149,377],[553,327],[786,570]].forEach(([x,y])=>circle(x,y,8,'#fff','#d06992',2));
text(60,673,'◌  Pontos isolados para inspeção',13,'#a36b89');
rect(32,725,853,120,'#e3dded','none',10);[['Importados','1.000 registros'],['Linhas completas','987 · 98,7%'],['Receita analisada',money(sum(history))]].forEach(([l,v],i)=>{const x=57+i*284;text(x,763,l,14,'#80708e');text(x,806,v,25,'#38294c',600);if(i<2)line(x+250,751,x+250,821,'#cfc4dd');});
rect(910,173,496,672,'#352747','none',12);circle(950,212,15,'#bba2ee');text(950,218,'✦',18,'#352747',600,'middle');text(979,218,'Assistente de análise',23,'#f0e8fc',600);line(935,245,1379,245,'#574567');
rect(1021,275,357,65,'#654c7d','none',10);text(1042,303,'O que devo revisar antes',17,'#fff');text(1042,326,'de tomar uma decisão?',17,'#fff');
text(935,380,'QUALIDADE DOS DADOS',12,'#bea6d8',700);text(935,417,'13 linhas estão incompletas.',23,'#f0e8fc',600);text(935,451,'Revise esses registros antes de',17,'#c4b5d6');text(935,478,'comparar os grupos da análise.',17,'#c4b5d6');
rect(935,509,443,147,'#443252','#675176',9);text(957,540,'DISTRIBUIÇÃO · 987 LINHAS',12,'#bea6d8',700);[['Recorrentes',430],['Ocasionais',350],['Em desenvolvimento',207]].forEach(([l,v],i)=>{text(957,571+i*29,l,16,'#dfd3ed');text(1358,571+i*29,String(v),18,'#f4ebfc',600,'end');});
text(935,697,'PRÓXIMO PASSO',12,'#bea6d8',700);text(935,731,'Explorar um segmento e comparar',16,'#c4b5d6');text(935,757,'seu comportamento entre períodos.',16,'#c4b5d6');rect(935,780,443,43,'#bba2ee','none',7);text(1156,808,'Explorar recorrentes →',17,'#352747',600,'middle');
footer('Demonstração de exploração e assistência · pontos representativos e dados sintéticos');
await save('demo-decisionforge','Bancada de análise com dispersão por segmentos, qualidade dos dados e conversa com assistente.',{history,segments:[430,350,207],rows:1000,completeRows:987,scatter:'Representative illustrative points, not all dataset rows',composition:'exploration-and-assistant'});

// Curtailment is an operations map and dispatch timeline, rather than another KPI dashboard.
const available=[72,81,96,112,134,151,164,158,145,121,91,66],realized=[72,81,96,106,113,124,123,129,118,108,91,66];
const loss=sum(available)-sum(realized),recovered=88;
if(available.some((v,i)=>v<realized[i])||recovered>loss)throw new Error('Energy scenario does not reconcile');
begin('#092224');rect(0,0,W,81,'#06191c');text(31,48,'CI',27,'#98e5c4',700);text(88,36,'CURTAILMENT INTELLIGENCE',21,'#e2f4ec',600);text(89,59,'OPERAÇÃO DE ENERGIA RENOVÁVEL',10,'#669e91',600);text(680,48,'REDE DEMONSTRATIVA · 22 SET 2026',14,'#87b1a4');pill(1177,25,'DEMONSTRAÇÃO','#203d3c','#b6d9c9',225);
rect(0,81,W,52,'#103133');circle(35,108,5,'#9ddd8d');text(51,114,'Monitoramento',14,'#c2ded2',600);text(255,114,'3 unidades fictícias',14,'#8caea2');text(613,114,'Mapa operacional',15,'#9ddd8d',600);text(896,114,'Geração e restrições',14,'#8caea2');text(1192,114,'Cenários',14,'#8caea2');
rect(25,154,215,482,'#102e30','#294a48',8);text(45,191,'UNIDADES',13,'#73a697',700);
[['Solar 01','Restrição ativa','#f3cb72'],['Eólica 02','Operação normal','#9ddd8d'],['Solar 03','Operação normal','#9ddd8d']].forEach(([name,status,color],i)=>{const y=215+i*111;if(i===0)rect(36,y,193,91,'#1e4140','#7bab8d',6);circle(57,y+26,5,color);text(73,y+33,name,20,'#d9ece0',600);text(49,y+65,status,13,color);});
text(45,582,'SELEÇÃO',11,'#73a697',700);text(45,609,'Solar 01 · cenário diário',13,'#bad1c4');
rect(261,154,818,482,'#123638','#315451',8);
for(let x=285;x<1060;x+=36)for(let y=177;y<620;y+=36)circle(x,y,1,'#28504a');
['M 265 249 C 355 129 463 340 552 233 S 776 123 877 256 S 1036 349 1077 239','M 263 342 C 367 173 441 464 571 352 S 756 237 883 375 S 1025 451 1078 352','M 266 481 C 392 366 488 583 601 491 S 843 364 929 477 S 1041 558 1080 491'].forEach(d=>pathShape(d,'none','#31594c',2));
pathShape('M 480 303 L 690 416 L 861 285 M 690 416 L 843 553','none','#80b88d',3,'7 7');
function solarNode(x,y,selected=false){circle(x,y,selected?46:34,selected?'#345746':'#21463e',selected?'#f3cb72':'#8bbe94',2);rect(x-21,y-15,42,27,'#2b6b62','#a0cfa6',3);[-7,7].forEach(xx=>line(x+xx,y-15,x+xx,y+12,'#a0cfa6'));line(x-21,y-2,x+21,y-2,'#a0cfa6');line(x,y+12,x,y+23,'#a0cfa6',2);line(x-15,y+23,x+15,y+23,'#a0cfa6',2);}
solarNode(480,303,true);solarNode(843,553);circle(861,285,34,'#21463e','#8bbe94',2);line(861,275,861,311,'#c4e1c8',3);[[0,-22],[-20,12],[20,12]].forEach(([dx,dy])=>line(861,275,861+dx,275+dy,'#c4e1c8',3));circle(861,275,4,'#c4e1c8');
circle(690,416,32,'#163534','#80b88d',2);text(690,424,'SE',19,'#c4e1c8',600,'middle');
text(430,235,'SOLAR 01',17,'#f3cb72',700);pill(366,361,'Corte: 164 MWh','#263f30','#f3cb72',225);text(815,232,'EÓLICA 02',15,'#c3dbc5',600);text(754,612,'SOLAR 03',15,'#c3dbc5',600);text(639,472,'Subestação',14,'#94b9a4');
pill(284,174,'Mapa esquemático','#183c3c','#8db8a2',190);text(293,611,'Cenário sintético · sem localização ou dados operacionais reais',12,'#87aa99');
rect(1100,154,315,482,'#dce7c8','none',8);text(1122,190,'RISCO ILUSTRATIVO',12,'#56724d',700);text(1120,254,'68%',62,'#28452f',700);text(1122,283,'na próxima janela simulada',14,'#6b8058');line(1122,305,1393,305,'#bccba6');
text(1122,341,'CENÁRIO DE MITIGAÇÃO',12,'#56724d',700);text(1122,383,'88 MWh',35,'#28452f',700);text(1122,412,'de aproveitamento simulado',14,'#6b8058');
[['Bateria',26],['Carga flexível',62],['Restrição restante',loss-recovered]].forEach(([l,v],i)=>{text(1122,452+i*35,l,14,'#52704c');text(1392,452+i*35,num(v)+' MWh',16,'#28452f',600,'end');});
rect(1122,559,271,9,'#bdcba3','none',4);rect(1122,559,271*recovered/loss,9,'#4f754c','none',4);text(1122,601,percent(recovered/loss)+' do corte aproveitado',17,'#28452f',600);
rect(25,657,1390,186,'#0e2a2d','#31504b',8);text(47,693,'DESPACHO DO DIA',13,'#80b19d',700);text(47,732,num(sum(available))+' MWh',33,'#d5ecde',700);text(47,760,'disponíveis',14,'#89ac9a');text(47,807,num(sum(realized))+' MWh realizados',16,'#80b19d',600);
const energyBase=811,energyTop=708,startEnergy=389,ew=77;
[0,80,160].forEach(v=>{const y=energyBase-(energyBase-energyTop)*v/180;line(365,y,1389,y,'#25453e',1,'4 4');});
available.forEach((v,i)=>{const bh=(energyBase-energyTop)*v/180,rh=(energyBase-energyTop)*realized[i]/180,x=startEnergy+i*ew;rect(x,energyBase-rh,40,rh,'#79bda0','none',2);rect(x,energyBase-bh,40,bh-rh,'#e6bc65','none',2);text(x+20,831,String(6+i).padStart(2,'0')+'h',12,'#89ac9a',400,'middle');});
circle(1170,685,4,'#79bda0');text(1181,690,'Realizada',12,'#a8c9b8');circle(1292,685,4,'#e6bc65');text(1303,690,'Restrição',12,'#a8c9b8');footer('Dados sintéticos · mapa e cenário de aproveitamento ilustrativos',true);
await save('demo-curtailment','Console operacional com mapa de unidades renováveis, restrições horárias e cenário de bateria e carga flexível.',{available,realized,loss,recovered,remaining:loss-recovered,battery:26,flexibleLoad:62,riskProbability:.68,composition:'operations-map-and-dispatch'});

// Movimento shows the actual task: prescribing a workout and logging sets on a companion phone.
begin('#eeeae3');rect(0,0,W,83,'#202422');text(37,51,'MOVIMENTO',27,'#f5eee4',700);text(333,50,'ALUNOS',14,'#aaaead',600);text(479,50,'TREINOS',14,'#ef8a54',700);text(642,50,'EXERCÍCIOS',14,'#aaaead',600);text(833,50,'AVALIAÇÕES',14,'#aaaead',600);pill(1190,26,'DEMONSTRAÇÃO','#40453f','#e3e6dc',210);
text(43,132,'Prescreva. Acompanhe. Evolua.',31,'#252c28',700);text(44,165,'Visão do professor · Aluno 01 · 22 de setembro de 2026',16,'#7d847b');
rect(40,192,935,638,'#fffdf8','#d7d6cc',8);rect(40,192,935,109,'#df693a','none',8);rect(40,274,935,27,'#df693a');text(65,233,'FICHA DE TREINO / A',13,'#ffe6cd',700);text(64,279,'Força e estabilidade',33,'#fffaf2',700);text(945,235,'4 exercícios',18,'#fff1df',600,'end');text(945,276,'35–45 min',24,'#fff1df',700,'end');
text(64,339,'EXERCÍCIO',12,'#8b8b7d',700);text(497,339,'SÉRIES',12,'#8b8b7d',700);text(601,339,'REPS',12,'#8b8b7d',700);text(709,339,'CARGA',12,'#8b8b7d',700);text(837,339,'PAUSA',12,'#8b8b7d',700);line(64,358,951,358,'#dcded3');
const exercises=[['Agachamento',4,'8','72,5 kg','90 s'],['Leg press',3,'12','120 kg','60 s'],['Remada baixa',3,'10','35 kg','60 s'],['Prancha',3,'45 s','Corporal','45 s']];
exercises.forEach(([name,sets,reps,load,rest],i)=>{const y=371+i*71;if(i===0)rect(55,y-4,905,66,'#faf0e5','none',4);circle(85,y+29,18,i===0?'#df693a':'#e8e9df');text(85,y+35,String(i+1).padStart(2,'0'),13,i===0?'#fff':'#777f70',700,'middle');text(119,y+36,name,22,'#343d31',600);text(520,y+36,String(sets),22,'#57614f',500,'middle');text(620,y+36,reps,22,'#57614f',500,'middle');text(710,y+36,load,20,'#57614f',600);text(851,y+36,rest,20,'#57614f');line(64,y+66,951,y+66,'#e6e7dc');});
text(65,704,'EVOLUÇÃO · AGACHAMENTO',13,'#8b8b7d',700);chart(49,716,449,106,[60,65,70,72.5],['01/09','08/09','15/09','22/09'],{color:'#df693a',max:80,ticks:2});
line(534,688,534,809,'#e1e2d7');text(571,717,'+12,5 kg',31,'#df693a',700);text(572,750,'de carga no período demonstrativo',16,'#87907e');text(572,789,'Observação: priorizar a execução.',16,'#65715b');
// Draw the phone as a second, deliberately different interaction surface.
rect(1040,112,351,724,'#1b201d','none',43);rect(1052,125,327,696,'#faf8f0','none',34);rect(1149,136,136,22,'#1b201d','none',11);text(1080,182,'09:41',12,'#66705e',600);text(1352,182,'100%',12,'#66705e',500,'end');
text(1076,225,'SEU TREINO',12,'#919782',700);text(1076,263,'Treino A',32,'#303b2d',700);text(1076,293,'Aluno 01 · Força',16,'#8d9580');
rect(1071,316,289,165,'#303b2d','none',14);text(1091,345,'EM ANDAMENTO',11,'#c1c9a7',700);text(1091,382,'Agachamento',23,'#fffdf4',600);text(1091,433,'72,5',42,'#ecc88e',700);text(1203,432,'kg',19,'#c1c9a7');text(1091,461,'4 séries × 8 repetições',15,'#c1c9a7');
text(1076,519,'Séries desta sessão',17,'#525e47',600);
for(let i=0;i<4;i++){const x=1083+i*71;circle(x+22,558,22,i<2?'#d86a3a':'#eeeadb',i===2?'#d86a3a':'none',2);text(x+22,565,i<2?'✓':String(i+1),19,i<2?'#fff':'#9b9e88',600,'middle');}
text(1076,614,'2 de 4 séries registradas',15,'#8b927d');rect(1071,637,289,48,'#ebe8da','none',8);text(1091,667,'Próxima série',14,'#6f785e');text(1340,667,'8 reps',18,'#414e37',600,'end');
rect(1071,708,289,60,'#d86a3a','none',10);text(1216,746,'Registrar série',20,'#fff9eb',700,'middle');text(1216,800,'TREINO   /   PROGRESSO   /   PERFIL',10,'#8b927d',600,'middle');
footer('Demonstração de prescrição e registro de treino · aluno e cargas fictícios');
await save('demo-movimento','Ficha de treino do professor com séries e cargas, ao lado de um celular para registrar a sessão do aluno.',{activeStudents:30,weeklySessions:[18,23,24,27],loadKg:[60,65,70,72.5],exercises,loggedSets:2,totalSets:4,composition:'workout-sheet-and-mobile'});

// ClientFlow is a full weekly calendar with a selected appointment and a customer detail drawer.
begin('#f3f5f0');rect(0,0,W,84,'#fff');text(34,51,'ClientFlow',27,'#234f47',700);[['Agenda',265],['Clientes',411],['Orçamentos',560],['Serviços',754]].forEach(([s,x],i)=>text(x,49,s,16,i===0?'#277a68':'#8b9690',i===0?600:400));line(263,66,321,66,'#277a68',3);pill(1187,26,'DEMONSTRAÇÃO','#e8efeb','#557468',212);
text(35,140,'Sua semana, organizada.',36,'#254b41',700);text(37,180,'12 agendamentos · 9 confirmados · 3 a confirmar · 4 orçamentos',16,'#82938a');
rect(34,207,1005,635,'#fff','#dce5dc',9);text(57,244,'12 — 16 outubro 2026',24,'#325346',600);pill(619,219,'‹    Hoje    ›','#f2f5ee','#6e8474',171);pill(813,219,'+ Agendamento','#277a68','#fff',201);
const dayLabels=['SEG · 12','TER · 13','QUA · 14','QUI · 15','SEX · 16'],x0=109,cw=182,top=318;
dayLabels.forEach((s,i)=>{if(i===2)rect(x0+i*cw,278,cw,555,'#f7fbf4');text(x0+i*cw+cw/2,303,s,15,i===2?'#277a68':'#819486',600,'middle');line(x0+i*cw,278,x0+i*cw,834,'#e4ebe1');});
const hours=['09:00','10:00','11:00','14:00','15:00','16:00'];hours.forEach((s,i)=>{const yy=top+i*84;text(52,yy+21,s,12,'#94a38f');line(104,yy,1020,yy,'#e7ede4');});
const appointments=[[0,0],[0,2],[0,4],[1,1],[1,3],[2,0],[2,2],[2,4],[3,1],[3,3],[4,0],[4,2]];
appointments.forEach(([d,t],i)=>{const x=x0+d*cw+7,y=top+t*84+8,confirmed=i<9,selected=i===5;const bg=selected?'#277a68':confirmed?'#e7f0df':'#fff0db',fg=selected?'#f5fff5':confirmed?'#557744':'#a98349';rect(x,y,cw-15,69,bg,selected?'#1d6457':'none',5);text(x+11,y+22,'Cliente '+String(i+1).padStart(2,'0'),15,fg,600);text(x+11,y+43,hours[t]+' · Atendimento',12,fg);text(x+11,y+60,confirmed?'Confirmado':'A confirmar',11,fg);});
rect(1061,207,345,635,'#fff','#dce5dc',9);text(1086,241,'DETALHE DO AGENDAMENTO',11,'#899b8a',700);text(1085,292,'Cliente 06',31,'#254b41',700);pill(1084,313,'Confirmado','#e8f1de','#597b44',160);line(1086,370,1379,370,'#e0e9de');
text(1086,405,'ATENDIMENTO',11,'#899b8a',700);text(1086,442,'Quarta-feira, 14 de outubro',16,'#4b6e58',600);text(1086,473,'09:00 — 09:50',25,'#254b41',600);text(1086,508,'50 min · Agenda demonstrativa',13,'#899b8a');
text(1086,557,'HISTÓRICO DO CLIENTE',11,'#899b8a',700);circle(1093,594,5,'#78a165');text(1110,600,'Confirmação registrada',15,'#4b6e58');line(1093,604,1093,629,'#ccd9c5',2);circle(1093,638,5,'#d4ad65');text(1110,644,'Orçamento 014 · R$ 180,00',15,'#8c7547');
rect(1084,679,299,60,'#f3f6ef','none',5);text(1101,704,'Notas do atendimento',13,'#82977a');text(1101,726,'Preferência: horário da manhã.',13,'#5d7951');rect(1084,763,299,49,'#277a68','none',7);text(1233,794,'Editar agendamento',17,'#f7fff5',600,'middle');
footer('Demonstração de agenda e histórico · clientes e atendimentos fictícios');
await save('demo-clientflow','Agenda semanal com atendimentos por horário e detalhe do cliente selecionado, incluindo confirmação e orçamento.',{appointments:12,confirmed:9,pending:3,quotes:4,selectedClient:'Cliente 06',selectedDate:'2026-10-14',selectedTime:'09:00',quote:180,composition:'weekly-calendar-and-customer-detail'});


// SICMA: reflects the new public portal rather than the retired Java scaffolding.
begin('#111c2b');rect(0,0,W,88,'#f6f4ee');rect(36,20,47,47,'#111c2b','none',3);text(60,56,'Σ',31,'#f2c77f',600,'middle');text(101,43,'SICMA',25,'#111c2b',700);text(103,65,'MATHEMA',11,'#65717a',600);['Sobre','Metodologia','Trajetória','Treino','Materiais'].forEach((s,i)=>text(450+i*139,53,s,15,'#3b4c5b',600));pill(1199,26,'Começar a treinar','#111c2b','#f2c77f',211);
text(49,143,'MATEMÁTICA OLÍMPICA',13,'#cab88e',600);pill(1198,108,'DEMONSTRAÇÃO','#223247','#d6c59a',210);
text(49,223,'Aprenda a',42,'#f2f0e6',600);text(49,277,'pensar melhor.',42,'#f2c77f',600);text(49,330,'Problemas, raciocínio e explicações',18,'#a9bac6');text(49,362,'para aprender matemática na prática.',18,'#a9bac6');
rect(49,412,386,253,'#1c3044','#415367',5);text(73,451,'Escolha seu desafio',21,'#f5efe1',600);text(73,489,'Tema',14,'#b7c6ce');rect(72,504,339,43,'#263e53','#54667b');text(87,533,'Álgebra',16,'#f4f1e7');text(72,581,'Nível',14,'#b7c6ce');rect(72,596,339,43,'#263e53','#54667b');text(87,625,'Explorador',16,'#f4f1e7');
rect(485,196,914,489,'#1a2d40','#44576d',5);text(516,239,'DESAFIO 21 / ÁLGEBRA',12,'#e8c98e',600);text(516,296,'Se x + 7 = 19, qual é o valor de x?',29,'#f5f0e4',600);
[['A','10'],['B','11'],['C','12'],['D','13']].forEach(([letter,value],i)=>{const xx=516+i%2*428,yy=333+Math.floor(i/2)*71,active=i===2;rect(xx,yy,402,55,active?'#314e54':'#233a4f',active?'#b5d0bf':'#506479',3);text(xx+21,yy+35,letter,17,active?'#d6e7d4':'#adbec8',600);text(xx+70,yy+35,value,19,'#f3f1e8',600);});
rect(516,498,851,145,'#e6eee7','none',3);text(539,535,'Resposta correta',19,'#325f49',600);text(539,573,'Subtraindo 7 dos dois lados: x = 19 − 7 = 12.',17,'#435b4d');text(539,606,'A explicação faz parte de cada desafio.',14,'#657a6b');
[['Resolvidos','8'],['Acertos','75%'],['Melhor sequência','3']].forEach(([label,value],i)=>{rect(49+i*457,720,427,115,'#1a2d40','#415367',4);text(73+i*457,757,label,16,'#adbdc6');text(73+i*457,804,value,34,'#efcf91',600);});footer('Prévia demonstrativa do portal educacional e treino interativo',true);
await save('demo-sicma','Portal educacional demonstrativo com desafio e explicação de matemática.',{question:'Se x + 7 = 19, qual é o valor de x?',answer:12,answered:8,correct:6,accuracy:.75,sourceRevision:'b3b5816e9a7d6dc4ad89f0e6550a0b7123fb190c'});
await fs.writeFile(path.join(scratch,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(`Rendered ${manifest.length} authored product previews at ${W}×${H}.`);
