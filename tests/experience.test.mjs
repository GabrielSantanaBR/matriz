import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Event fixtures exercise DOM-facing behavior without a browser or external requests.
class Element {
  constructor(document, id='') {
    this.document=document;this.id=id;this.dataset={};this.attributes={};this.listeners={};
    this.value='';this.textContent='';this.hidden=false;this.disabled=false;this.scrollTop=0;this.scrollLeft=0;
    const classes=new Set();
    this.classList={add:(...xs)=>xs.forEach(x=>classes.add(x)),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),contains:x=>classes.has(x),toggle:(x,state)=>{const on=state??!classes.has(x);on?classes.add(x):classes.delete(x);return on;}};
  }
  setAttribute(name,value){this.attributes[name]=String(value);}
  getAttribute(name){return this.attributes[name]??null;}
  removeAttribute(name){delete this.attributes[name];if(name==='src')delete this.src;}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  emit(type,event={}){return Promise.all((this.listeners[type]||[]).map(fn=>fn({target:this,...event})));}
  focus(){this.document.activeElement=this;}
  closest(){return null;}
  replaceChildren(...children){this.childNodes=children;}
}
function documentFixture(){
  const elements=new Map();
  const document={activeElement:null,listeners:{},getElementById:id=>elements.get(id)||null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:Element.prototype.addEventListener,emit:Element.prototype.emit,documentElement:{scrollHeight:2000}};
  document.body=new Element(document);
  const element=id=>{const el=new Element(document,id);elements.set(id,el);return el;};
  return {document,element};
}
const file=name=>readFileSync(new URL(`../assets/js/${name}`,import.meta.url),'utf8');

function previewFixture(supported=true){
  const {document,element}=documentFixture();
  for(const id of ['preview-dialog','preview-image','preview-title','preview-caption','preview-load-status','preview-original','preview-stage','preview-zoom','preview-close'])element(id);
  const dialog=document.getElementById('preview-dialog');
  if(supported)dialog.showModal=()=>{dialog.open=true;};
  dialog.close=()=>{dialog.open=false;dialog.emit('close');};
  dialog.getBoundingClientRect=()=>({left:16,top:16,right:1000,bottom:700});
  const link=element('link');link.href='https://example.com/assets/previews/product.png';
  link.dataset={previewTitle:'Produto de teste',previewCaption:'Dados de demonstração',previewAlt:'Planilha com preços e margens'};
  link.closest=selector=>selector==='a[data-preview]'?link:null;
  runInNewContext(file('preview.js'),{document,URL,location:{href:'https://example.com/repertoire.html',origin:'https://example.com'}});
  const click=async extra=>{const event={target:link,button:0,preventDefault(){event.prevented=true;},...extra};await document.emit('click',event);return event;};
  return {document,dialog,link,click,get:id=>document.getElementById(id)};
}
test('preview preserves modified-click and unsupported-browser image navigation',async()=>{
  const f=previewFixture();
  assert.equal((await f.click({ctrlKey:true})).prevented,undefined);
  assert.ok(!f.dialog.open);
  const unsupported=previewFixture(false);
  assert.equal((await unsupported.click()).prevented,undefined);
  assert.equal(unsupported.link.href,'https://example.com/assets/previews/product.png');
});
test('preview opens, zooms, restores focus and leaves a working original link after image failure',async()=>{
  const f=previewFixture(),image=f.get('preview-image'),stage=f.get('preview-stage'),zoom=f.get('preview-zoom');
  assert.equal((await f.click()).prevented,true);
  assert.equal(f.dialog.open,true);
  assert.equal(f.get('preview-title').textContent,'Produto de teste');
  assert.equal(image.alt,'Planilha com preços e margens');
  assert.equal(f.get('preview-original').href,f.link.href);
  image.naturalWidth=1440;image.naturalHeight=900;await image.emit('load');
  assert.equal(image.hidden,false);assert.equal(zoom.disabled,false);
  await zoom.emit('click');assert.equal(stage.classList.contains('is-zoomed'),true);
  assert.equal(zoom.getAttribute('aria-pressed'),'true');
  await f.get('preview-close').emit('click');
  assert.equal(f.dialog.open,false);assert.equal(f.document.activeElement,f.link);
  assert.equal(f.document.body.classList.contains('preview-open'),false);
  assert.equal(image.src,undefined);
  await f.click();await image.emit('error');
  assert.equal(image.hidden,true);assert.equal(zoom.disabled,true);
  assert.match(f.get('preview-load-status').textContent,/Abrir original/);
  assert.equal(f.get('preview-original').href,f.link.href);
  await f.dialog.emit('click',{target:f.dialog,clientX:2,clientY:2});
  assert.equal(f.dialog.open,false);
});

test('mobile menu isolates background, cycles focus and restores it on Escape or section navigation',async()=>{
  const {document,element}=documentFixture();
  const button=element('menu-button'),nav=element('main-nav'),main=element('main-content'),section=element('solucoes'),footer=element('footer');
  const links=[element('solution-link'),element('contact-link')];
  links[0].href='https://example.com/index.html#solucoes';links[1].href='https://example.com/contact.html';
  nav.querySelectorAll=()=>links;
  document.querySelector=selector=>selector==='.menu-toggle'?button:selector==='.site-footer'?footer:null;
  const mobile={matches:true,addEventListener(type,fn){this.changed=fn;}};
  runInNewContext(file('site.js'),{document,window:{},URL,location:{href:'https://example.com/',origin:'https://example.com',pathname:'/'},matchMedia:q=>q.includes('max-width')?mobile:{matches:true,addEventListener(){}},addEventListener(){},innerHeight:800,scrollY:0});
  await button.emit('click');
  assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(main.inert,true);assert.equal(footer.inert,true);
  links[1].focus();await document.emit('keydown',{key:'Tab',preventDefault(){}});
  assert.equal(document.activeElement,button);
  await document.emit('keydown',{key:'Escape',preventDefault(){}});
  assert.equal(main.inert,false);assert.equal(document.activeElement,button);
  await button.emit('click');await nav.emit('click',{target:{closest:()=>links[0]}});
  assert.equal(document.activeElement,section);assert.equal(main.inert,false);
  await button.emit('click');mobile.matches=false;mobile.changed();
  assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(footer.inert,false);
});

function contactFixture({online=true,phone='',search='',message='Preciso de um site para apresentar os produtos da minha loja.',service='financeiro'}={}){
  const {document,element}=documentFixture(),form=element('secure-contact-form');
  const fields={name:'Pessoa de teste',email:'teste@example.com',service,message,phone,company:'',budget:'',access_key:'public-form-id'};
  form.elements={};
  for(const [name,value] of Object.entries(fields)){const input=element(name);input.name=name;input.value=value;form.elements[name]=input;const error=element(name+'-error');error.hidden=true;}
  form.elements.service.selectedOptions=[{textContent:'Sistema financeiro'}];
  form.elements.botcheck={checked:false};
  for(const id of ['form-status','message-length','contact-interest'])element(id);
  const optional=element('optional');optional.open=false;
  form.elements.phone.closest=selector=>selector==='details'?optional:null;
  const button=element('submit');button.childNodes=[{textContent:'Começar a conversa',cloneNode(){return {...this};}}];
  form.querySelector=()=>button;
  form.querySelectorAll=()=>Object.values(form.elements).filter(input=>input.attributes?.['aria-invalid']);
  form.reportValidity=()=>true;
  const requests=[],destinations=[],storage=new Map(),globalEvents={};let now=100000;
  const navigator={onLine:online};
  const context={document,navigator,URLSearchParams,AbortController,setTimeout,clearTimeout,Date:class extends Date{static now(){return now;}},location:{search,assign:x=>destinations.push(x)},sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},addEventListener:(type,fn)=>{globalEvents[type]=fn;},FormData:class{constructor(){return Object.entries(form.elements).filter(([,x])=>'value' in x).map(([k,x])=>[k,x.value]);}},fetch:async(url,options)=>{requests.push({url,payload:JSON.parse(options.body)});if(requests.length===1)throw new TypeError('Offline');return {ok:true,status:200,json:async()=>({success:true})};}};
  runInNewContext(file('contact-bundle.js'),context);
  return {form,document,button,optional,navigator,requests,destinations,storage,globalEvents,advance:ms=>{now+=ms;},submit:()=>form.emit('submit',{preventDefault(){}})};
}
test('contact preserves written content, reveals invalid optional fields and explains offline state without sending',async()=>{
  const f=contactFixture({online:false,phone:'123',search:'?service=web&project=Novo%20produto'});
  assert.equal(f.form.noValidate,true);
  assert.equal(f.form.elements.service.value,'financeiro');
  assert.match(f.form.elements.message.value,/minha loja/);
  await f.submit();assert.equal(f.optional.open,true);assert.equal(f.document.activeElement,f.form.elements.phone);
  assert.equal(f.form.elements.phone.getAttribute('aria-invalid'),'true');assert.equal(f.requests.length,0);
  f.form.elements.phone.value='';await f.submit();
  assert.match(f.document.getElementById('form-status').textContent,/sem conexão/);
  assert.equal(f.requests.length,0);assert.equal(f.storage.size,0);
  f.navigator.onLine=true;f.globalEvents.online();
  assert.match(f.document.getElementById('form-status').textContent,/conexão voltou/);
});
test('failed contact remains editable, explains retry cooldown and redirects only after a confirmed successful retry',async()=>{
  const f=contactFixture(),original=f.form.elements.message.value;
  await f.submit();
  assert.equal(f.requests.length,1);assert.equal(f.destinations.length,0);
  assert.equal(f.form.elements.message.value,original);assert.equal(f.button.disabled,false);
  assert.equal(f.form.getAttribute('aria-busy'),null);
  assert.match(f.document.getElementById('form-status').textContent,/campos foram preservados/);
  assert.deepEqual([...f.storage.keys()],['matriz-contact-attempt']);
  await f.submit();assert.equal(f.requests.length,1);
  assert.match(f.document.getElementById('form-status').textContent,/15 segundos/);
  f.advance(15000);await f.submit();
  assert.equal(f.requests.length,2);assert.deepEqual(f.destinations,['thanks.html']);
  assert.equal(f.requests[1].payload.Projeto,'Sistema financeiro');
  assert.equal(f.button.disabled,false);
});
