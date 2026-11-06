import test from 'node:test';
import assert from 'node:assert/strict';
import {publicText} from '../site-response.mjs';

test('Railway error pages and metadata use the root while static Pages files retain their prefix',()=>{
  const source=Buffer.from('<link href="/matriz/assets/css/matriz.css"><a href="/matriz/index.html">Início</a><link rel="canonical" href="https://gabrielsantanabr.github.io/matriz/404.html">');
  assert.equal(publicText(source),source);
  const result=publicText(source,true).toString();
  assert.ok(result.includes('href="/assets/css/matriz.css"'));
  assert.ok(result.includes('href="/index.html"'));
  assert.ok(result.includes('href="https://matriz.up.railway.app/404.html"'));
  assert.ok(!result.includes('/matriz/'));
});
test('Railway robots rules protect the actual root routes',()=>{
  const source=Buffer.from('Disallow: /matriz/thanks.html\nDisallow: /matriz/project.html\nSitemap: https://gabrielsantanabr.github.io/matriz/sitemap.xml\n');
  assert.equal(publicText(source,true).toString(),'Disallow: /thanks.html\nDisallow: /project.html\nSitemap: https://matriz.up.railway.app/sitemap.xml\n');
});
