import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('portfolio filters show the right projects, update the count and restore all projects',()=>{
  const buttons=[['Todos','Todos os exemplos'],['financeiro','Sistema financeiro'],['sites','Sites'],['sistemas','Sistemas para negócios'],['planilhas','Planilhas de controle']].map(([key,label])=>({
    dataset:{projectFilter:key},textContent:label,attributes:{},
    setAttribute(key,value){this.attributes[key]=value;},
    addEventListener(_,listener){this.click=listener;}
  }));
  const groups=['financeiro','sites','sites','sites','sistemas','sistemas','planilhas','planilhas'];
  const cards=groups.map(group=>({dataset:{projectGroup:group},hidden:false,classList:{remove(){},add(){}}}));
  const status={textContent:'8 exemplos'};
  const document={
    body:{classList:{toggle(){}}},documentElement:{scrollHeight:2000},
    querySelector(){return null;},
    querySelectorAll(selector){
      if(selector==='[data-project-filter]')return buttons;
      if(selector==='#portfolio-projects [data-project-group]')return cards;
      return [];
    },
    getElementById(id){return id==='project-count'?status:null;},
    addEventListener(){}
  };
  runInNewContext(readFileSync(new URL('../assets/js/site.js',import.meta.url),'utf8'),{
    document,window:{},
    matchMedia:query=>({matches:query.includes('prefers-reduced-motion'),addEventListener(){}}),
    addEventListener(){},innerHeight:800,scrollY:0
  });
  for(const [index,count] of [[1,1],[2,3],[3,2],[4,2],[0,8]]){
    buttons[index].click();
    assert.equal(cards.filter(card=>!card.hidden).length,count);
    assert.equal(status.textContent,`${count} ${count === 1 ? 'exemplo' : 'exemplos'}${index?` · ${buttons[index].textContent}`:''}`);
    assert.deepEqual(buttons.map(button=>button.attributes['aria-pressed']),buttons.map((_,i)=>String(index===i)));
    for(const card of cards)assert.equal(card.hidden,index!==0&&card.dataset.projectGroup!==buttons[index].dataset.projectFilter);
  }
});
