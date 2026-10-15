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
function pill(x,y,s,bg,fg,w=150){rect(x,y,w,31,bg,'none',5);text(x+w/2,y+21,s,12,fg,600,'middle');}
function panel(x,y,w,h,title,bg='#fff',stroke='#dde3e9',fg='#253044'){rect(x,y,w,h,bg,stroke,10);text(x+24,y+37,title,20,fg,600);}
function badge(dark=false){pill(1120,20,'DEMONSTRAÇÃO',dark?'#243345':'#e7edf3',dark?'#c9d7e5':'#43566b',190);}
function footer(s,dark=false){text(40,877,s,13,dark?'#99a9bd':'#64748b');text(1400,877,'Dados de exemplo',13,dark?'#99a9bd':'#64748b',400,'end');}
function kpi(x,y,w,label,value,note,accent='#247755',dark=false){rect(x,y,w,109,dark?'#111b2c':'#fff',dark?'#243149':'#dbe3e9',8);rect(x,y,4,109,accent);text(x+19,y+29,label,16,dark?'#9aacbf':'#64748b');text(x+19,y+65,value,29,dark?'#f0f5ff':'#182c3c',600);text(x+19,y+91,note,12,dark?'#91a2b8':'#6b7b88');}
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
function bars(x,y,w,h,items,{color='#217a58',dark=false,format=money}={}){
  const max=Math.max(...items.map(v=>v.value))*1.15;
  const row=h/items.length;
  items.forEach((v,i)=>{const yy=y+i*row;text(x,yy+18,v.label,14,dark?'#a6b4c9':'#526378');rect(x+145,yy+2,w-255,21,dark?'#233049':'#e9eef2','none',3);rect(x+145,yy+2,(w-255)*v.value/max,21,color,'none',3);text(x+w-4,yy+18,format(v.value),14,dark?'#d9e3f2':'#294358',600,'end');});
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
 rect(0,147,W,35,'#fff');rect(13,152,87,25,'#fff','#d5dce3');text(42,170,'B4',12,'#4b5d6e');text(121,170,'fx',16,'#778694');text(167,170,formula,13,'#4b5d6e');
 rect(0,183,W,26,'#edf1f4');const columns=14,colWidth=(W-43)/columns;for(let i=0;i<columns;i++){line(43+i*colWidth,183,43+i*colWidth,209,'#d2dbe2');text(43+(i+.5)*colWidth,201,String.fromCharCode(65+i),12,'#69808c',400,'middle');}
 rect(0,209,42,638,'#edf1f4');for(let i=1;i<27;i++)text(27,211+i*24,String(i),11,'#78909c',400,'end');
 rect(43,209,1397,639,'#fff');
 rect(0,848,W,52,'#eff3f5');text(23,881,'‹   ›',24,'#6a7e88');let tx=112;tabs.forEach((t,i)=>{const tw=t.length*9+28;if(i===0){rect(tx,854,tw,37,'#fff');line(tx,890,tx+tw,890,accent,3);}text(tx+13,879,t,13,i===0?accent:'#6d7f8a',i===0?600:400);tx+=tw;});text(1398,881,'100%',13,'#667e8b',400,'end');
}
function appShell({title,mark,subtitle,nav,accent='#758cff',dark=false,bg='#f4f7fa'}){
 begin(dark?'#080f1c':bg);rect(0,0,228,H,dark?'#080d17':'#fff',dark?'#243047':'#dce3e9');rect(25,30,42,42,accent,'none',8);text(46,58,mark,17,dark?'#0b1830':'#fff',700,'middle');text(82,49,title,18,dark?'#e8f0ff':'#1c3146',600);text(82,69,subtitle,10,dark?'#7788a2':'#7a8b9a');
 nav.forEach((s,i)=>{const yy=121+i*58;if(i===0)rect(18,yy-26,192,45,dark?'#192542':'#edf2fb','none',7);rect(32,yy-8,10,10,i===0?accent:(dark?'#4e607b':'#a6b1bc'),'none',2);text(56,yy+2,s,15,i===0?accent:(dark?'#91a1b9':'#64788b'),i===0?600:400);});
 line(23,783,205,783,dark?'#26344b':'#e0e7ed');text(26,814,'AMBIENTE DEMONSTRATIVO',10,dark?'#97a7bd':'#8393a1',600);text(26,839,'Exemplos para o portfólio',12,dark?'#7d8ba4':'#7b8d9f');
 rect(228,0,1212,79,dark?'#0d1423':'#fff');line(228,79,W,79,dark?'#243047':'#dce3e9');text(262,49,'Visão geral',17,dark?'#96a9c2':'#728597');badge(dark);
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
spreadsheet('Pricing & Sales Manager','#21734b',['Dashboard','Config','Insumos','Receitas','Precificação','Vendas']);
text(78,246,'Custos, preços e resultado',27,'#1a3c32',600);text(78,273,'Setembro de 2026 · Confeitaria demonstrativa',14,'#74897f');
const cardX=[78,415,752,1089];[['Receita',money(revenue),'880 unidades vendidas'],['Custos diretos',money(directCost),'Insumos, produção e embalagem'],['Resultado após taxas',money(profit),'Receita − custos − taxas'],['Margem de contribuição',percent(profit/revenue),'Taxa do canal: 8%']].forEach(([l,v,n],i)=>kpi(cardX[i],294,308,l,v,n,'#21734b'));
text(78,444,'Receita e resultado por mês',18,'#234b3c',600);pill(1138,420,'Valores fictícios','#eaf4ed','#3f7659',230);
const months=['Abr','Mai','Jun','Jul','Ago','Set'];const trend=[.55,.67,.73,.82,.91,1].map(f=>revenue*f);chart(70,460,656,184,trend,months,{color:'#279166',secondary:trend.map(v=>v*profit/revenue),unit:'R$'});text(117,462,'Receita',12,'#279166');text(214,462,'Resultado após taxas',12,'#7f9295');
bars(792,464,570,179,pricing.slice(0,5).map(p=>({label:p.product,value:p.profit})),{color:'#47906b'});text(792,444,'Resultado por produto',18,'#234b3c',600);
table(78,670,1280,['Produto','Custo unit.','Preço sugerido','Preço praticado','Quantidade','Margem'],pricing.slice(0,4).map(p=>[p.product,currency(p.cost),currency(p.suggested),currency(p.price),String(p.qty),percent(p.margin)]),[260,180,205,220,200,215],{accent:'#21734b',rowHeight:33});
await save('demo-pricing-sales','Planilha demonstrativa de custos, precificação, vendas e resultado.',{ingredients,products:pricing,revenue,directCost,profit,targetMargin:.45,channelFee:.08});

// Sales: the report uses the existing public sample CSV and reconciles to its metrics.
const sales=source.sales;
if(Math.abs(sum(sales.products.map(p=>p.revenue))-sales.revenue)>.000001||sum(sales.products.map(p=>p.units))!==sales.units||sum(sales.products.map(p=>p.transactions))!==sales.rows)throw new Error('Sales totals do not reconcile');
spreadsheet('Sales Intelligence — Relatório de vendas','#245d99',['Dashboard','Produtos','Categorias','Vendas','Relatório'],'=SUM(Vendas!F2:F31)');
text(78,246,'Vendas em uma visão completa',27,'#254b73',600);text(78,272,'Janeiro de 2025 · Dados demonstrativos do projeto',14,'#73859b');
[['Faturamento',money(sales.revenue),'Total das vendas do período'],['Unidades vendidas',String(sales.units),'12 produtos no catálogo'],['Transações',String(sales.rows),'Registros do CSV de exemplo'],['Ticket médio',currency(sales.revenue/sales.rows),'Faturamento ÷ transações']].forEach(([l,v,n],i)=>kpi(cardX[i],294,308,l,v,n,'#245d99'));
text(80,444,'Produtos com maior faturamento',19,'#294b70',600);bars(80,474,702,194,sales.products.slice(0,6).map(p=>({label:p.product.replace('Monitor 24"','Monitor 24 pol.'),value:p.revenue})),{color:'#448ccc'});
panel(836,427,548,225,'Qualidade e origem dos dados');text(860,495,'30 registros',30,'#245d99',600);text(860,525,'Período: 02 a 31 de janeiro de 2025',15,'#607c98');text(860,555,'Fonte: arquivo público de demonstração',14,'#607c98');text(860,595,'Indicadores, ranking e exportação em Excel',14,'#516c86');
table(78,690,1306,['Produto','Categoria','Unidades','Faturamento','Transações'],sales.products.slice(0,3).map(p=>[p.product,p.category,String(p.units),currency(p.revenue),String(p.transactions)]),[335,335,210,225,201],{accent:'#245d99',rowHeight:37});
await save('demo-sales-intelligence','Relatório demonstrativo em planilha, com métricas e gráficos de vendas.',sales);

// DecisionForge: an illustrative executive view consistent with its documented analysis flow.
const history=[32000,37000,36000,41000,45000,44000,49000,52000,55000,58000,59000,68200];
appShell({title:'DecisionForge',mark:'DF',subtitle:'AI INTELLIGENCE',nav:['Visão geral','Inteligência','Qualidade','Modelos'],accent:'#8394ff',dark:true});
text(263,129,'Dados que ajudam a decidir',31,'#edf2ff',600);text(263,159,'varejo_demonstracao.csv · Visão executiva',16,'#8798b3');
rect(264,186,1138,67,'#121d30','#29354d',8);text(286,213,'DATASET ATIVO',10,'#8193b1',600);text(286,235,'Varejo · 2025',17,'#dce7fa',600);text(610,218,'1.000 registros',18,'#dce7fa',600);text(844,218,'987 linhas completas',18,'#dce7fa',600);pill(1152,203,'Dados sintéticos','#243451','#aabbef',220);
[['Receita analisada',money(sum(history)),'Soma do histórico ilustrativo'],['Linhas completas','98,7%','987 de 1.000 registros'],['Segmentos','3','Distribuição demonstrativa'],['Anomalias','13','Registros destacados no exemplo']].forEach(([l,v,n],i)=>kpi(264+i*286,275,266,l,v,n,'#8394ff',true));
panel(264,410,717,267,'Receita ao longo do ano','#111b2c','#28354b','#e4ecff');
chart(279,455,686,198,history,['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],{dark:true,color:'#879aff',unit:'R$',fill:true});
panel(1003,410,399,267,'Perfil dos segmentos','#111b2c','#28354b','#e4ecff');
[['Recorrentes',430,'#8f9fff'],['Ocasionais',350,'#a277ef'],['Em desenvolvimento',207,'#55cde4']].forEach(([label,v,c],i)=>{text(1027,489+i*58,label,15,'#a8b7cf');text(1375,489+i*58,String(v),17,'#dde7fb',600,'end');rect(1027,503+i*58,350,8,'#24324b','none',4);rect(1027,503+i*58,350*v/987,8,c,'none',4);});
panel(264,697,1138,140,'Leitura executiva','#111b2c','#28354b','#e4ecff');text(290,769,'Qualidade',14,'#879aff',600);text(290,802,'13 registros precisam de revisão.',15,'#a5b5cc');text(668,769,'Segmentação',14,'#ae8eff',600);text(668,802,'3 grupos para explorar comportamentos.',15,'#a5b5cc');text(1100,769,'Próximo passo',14,'#63d3e3',600);text(1100,802,'Comparar períodos.',15,'#a5b5cc');footer('Prévia visual do fluxo de análise · valores e segmentos ilustrativos',true);
await save('demo-decisionforge','Painel demonstrativo de análise, qualidade, segmentos e indicadores.',{history,segments:[430,350,207],rows:1000,completeRows:987});

// Curtailment: physical quantities are explicitly synthetic and scenario results reconcile.
appShell({title:'Curtailment',mark:'CI',subtitle:'INTELLIGENCE',nav:['Visão geral','Predição','Mitigação','Padrões','Modelo'],accent:'#6adbc0',dark:true});
text(264,132,'Energia, risco e possibilidades',30,'#eef8f6',600);text(264,161,'Usina solar demonstrativa · Cenário sintético',16,'#8ca9a7');
panel(264,190,736,194,'Risco nas próximas horas','#0e2127','#244048','#c5ece1');text(290,309,'68%',75,'#eff9f5',600);pill(485,270,'Cenário ilustrativo','#3c3030','#ffcc7a',218);text(290,350,'Probabilidade usada no exemplo de apresentação',14,'#93b2b0');
circle(882,288,58,'none','#253d43',12);parts.push('<circle cx="882" cy="288" r="58" fill="none" stroke="#6adbc0" stroke-width="12" stroke-dasharray="248 365" transform="rotate(-90 882 288)"/>');text(882,297,'68%',26,'#c4f3e7',600,'middle');
panel(1024,190,378,194,'Energia em risco','#0e2127','#244048','#c5ece1');text(1048,280,'126 MWh',40,'#b7f58b',600);text(1048,323,'Quantidade definida para o cenário',13,'#93b2b0');
const available=[72,81,96,112,134,151,164,158,145,121,91,66];const realized=[72,81,96,106,113,124,123,129,118,108,91,66];const loss=sum(available)-sum(realized),recovered=88;
if(available.some((v,i)=>v<realized[i])||recovered>loss)throw new Error('Energy scenario does not reconcile');
[['Geração disponível',num(sum(available))+' MWh','12 intervalos simulados'],['Energia restringida',num(loss)+' MWh','Disponível − realizada'],['Aproveitamento simulado',num(recovered)+' MWh','Exemplo: bateria + carga flexível'],['Energia restante',num(loss-recovered)+' MWh','Corte − aproveitamento']].forEach(([l,v,n],i)=>kpi(264+i*286,407,266,l,v,n,'#6adbc0',true));
panel(264,542,712,288,'Geração disponível e realizada','#0e2127','#244048','#e0f4ee');chart(277,594,685,220,available,['06h','07h','08h','09h','10h','11h','12h','13h','14h','15h','16h','17h'],{dark:true,color:'#6adbc0',secondary:realized});
panel(1000,542,402,288,'Cenário de aproveitamento','#0e2127','#244048','#e0f4ee');text(1025,645,percent(recovered/loss),46,'#b7f58b',600);text(1025,674,'da energia restringida no exemplo',13,'#9ab8b4');rect(1025,692,352,19,'#273e44','none',4);rect(1025,692,352*recovered/loss,19,'#b7f58b','none',4);text(1025,753,'Recuperada',14,'#9ab8b4');text(1374,753,num(recovered)+' MWh',16,'#d3ede5',600,'end');text(1025,789,'Restante',14,'#9ab8b4');text(1374,789,num(loss-recovered)+' MWh',16,'#d3ede5',600,'end');footer('Demonstração com dados sintéticos · não representa dados ou resultados do ONS',true);
await save('demo-curtailment','Painel demonstrativo de geração, energia restringida e cenário de mitigação.',{available,realized,loss,recovered,remaining:loss-recovered});

// Movimento: coaching view, student records and load tracking.
appShell({title:'MOVIMENTO',mark:'M',subtitle:'GESTÃO DE TREINOS',nav:['Painel','Alunos','Treinos','Exercícios','Avaliações'],accent:'#c84411'});
text(264,130,'Um olhar sobre cada aluno',31,'#20303d',600);text(264,160,'Visão do professor · 22 de setembro de 2026',16,'#82909c');
[['Alunos ativos','30','Turma demonstrativa'],['Treinos na semana','27','Participação do período'],['Planos em revisão','4','Atualização de treinamento'],['Avaliações agendadas','6','Próximos 7 dias']].forEach(([l,v,n],i)=>kpi(264+i*286,192,266,l,v,n,'#c84411'));
panel(264,330,697,276,'Participação nos treinos');chart(274,388,676,200,[18,23,24,27],['Semana 1','Semana 2','Semana 3','Semana 4'],{color:'#cc5928',max:30,ticks:3});
panel(985,330,417,276,'Evolução de carga (kg)');text(1010,406,'Agachamento · Aluno 01',15,'#748597');chart(997,424,390,159,[60,65,70,72.5],['01/09','08/09','15/09','22/09'],{color:'#9d663a',max:80});
panel(264,632,1138,205,'Alunos em acompanhamento · amostra');
table(287,684,1091,['Aluno','Plano atual','Último treino','Avaliação','Situação'],[['Aluno 01','Força · A/B','Hoje, 08h40','24/09/2026','Em dia'],['Aluno 02','Hipertrofia · A/B/C','Ontem, 17h15','26/09/2026','Em dia'],['Aluno 03','Condicionamento','Há 3 dias','28/09/2026','Revisar plano']],[215,310,220,190,156],{accent:'#b95428',rowHeight:32});footer('Prévia demonstrativa de gestão de alunos, treinos, séries e progresso');
await save('demo-movimento','Painel demonstrativo do professor com alunos, treinos e progresso de cargas.',{activeStudents:30,weeklySessions:[18,23,24,27],loadKg:[60,65,70,72.5]});

// ClientFlow: replace the unrelated bakery reference with its own scheduling preview.
appShell({title:'ClientFlow',mark:'CF',subtitle:'AGENDA E CLIENTES',nav:['Agenda','Clientes','Serviços','Orçamentos','Configurações'],accent:'#3865bd'});
text(264,131,'Sua semana, organizada',31,'#203449',600);text(264,161,'12 a 16 de outubro de 2026 · Agenda demonstrativa',16,'#8191a3');
[['Agendamentos','12','Nesta semana'],['Confirmados','9','Com confirmação registrada'],['A confirmar','3','Aguardando retorno'],['Orçamentos','4','Exemplos em acompanhamento']].forEach(([l,v,n],i)=>kpi(264+i*286,192,266,l,v,n,'#3865bd'));
rect(264,332,1138,494,'#fff','#dce3e9',10);text(288,368,'Agenda da semana',20,'#294568',600);pill(1218,344,'+ Agendar','#3865bd','#fff',155);
const dayLabels=['SEG · 12','TER · 13','QUA · 14','QUI · 15','SEX · 16'];const x0=331,cw=209,top=436;
dayLabels.forEach((s,i)=>{text(x0+i*cw+cw/2,414,s,13,i===2?'#3865bd':'#688199',600,'middle');if(i===2)line(x0+i*cw+13,424,x0+(i+1)*cw-13,424,'#3865bd',3);line(x0+i*cw,433,x0+i*cw,805,'#e2e9ef');});
['09h','10h','11h','14h','15h'].forEach((s,i)=>{const yy=top+i*72;text(286,yy+21,s,13,'#8193a4');line(327,yy+28,1377,yy+28,'#eef2f6');});
const appointments=[[0,0],[0,2],[0,4],[1,1],[1,3],[2,0],[2,2],[2,4],[3,1],[3,3],[4,0],[4,2]];
appointments.forEach(([d,t],i)=>{const xx=x0+d*cw+10,yy=top+t*72+1;const confirmed=i<9;rect(xx,yy,cw-20,57,confirmed?'#ecf2ff':'#fff5e4','none',5);rect(xx,yy,3,57,confirmed?'#6389ce':'#d8aa51');text(xx+10,yy+21,'Cliente '+String(i+1).padStart(2,'0'),13,'#35516f',600);text(xx+10,yy+43,confirmed?'Atendimento confirmado':'A confirmar',10,confirmed?'#6986a8':'#a18653');});footer('Prévia demonstrativa de agenda, clientes e orçamentos');
await save('demo-clientflow','Agenda demonstrativa própria do ClientFlow, com clientes e confirmações.',{appointments:12,confirmed:9,pending:3,quotes:4});

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
