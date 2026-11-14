import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const all=json('data/index.json').recipes.map(s=>json('data/recipes/'+s+'.json'));
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('four old recipes, 34 sushi varieties, two independent essentials',()=>{
 assert.equal(all.length,40);
 assert.equal(all.filter(r=>r.category==='Sushi').length,34);
 assert.ok(all.some(r=>r.slug==='sushi-rice'));
 assert.ok(all.some(r=>r.slug==='sushi-white-miso-sauce'));
 assert.match(app,/function sushiHome\(/);
 assert.match(app,/function drawSushiCards\(/);
 assert.match(app,/#\/sushi/);
});
test('sushi rice and honey-free miso sauce have approved baseline',()=>{
 const rice=all.find(r=>r.slug==='sushi-rice');
 const sauce=all.find(r=>r.slug==='sushi-white-miso-sauce');
 assert.equal(rice.ingredients.find(i=>i.id==='hoshihikari_japonica_rice').amount,300);
 assert.equal(rice.ingredients.find(i=>i.id==='water').amount,340);
 assert.equal(sauce.ingredients.find(i=>i.id==='white_miso').amount,25);
 assert.equal(sauce.ingredients.find(i=>i.id==='mirin').amount,18);
 assert.equal(sauce.ingredients.find(i=>i.id==='rice_vinegar').amount,5);
 assert.ok(!sauce.ingredients.some(i=>['honey','sugar'].includes(i.id)));
});
test('all recipes retain ingredient rounding and positive unrounded baseline',()=>{
 const rules=json('data/rounding.json');
 for(const r of all){assert.equal(r.servings,6);assert.ok(r.steps.length>=3);
  const ids=new Set();for(const i of r.ingredients){assert.ok(i.amount>0);assert.ok(!ids.has(i.id));ids.add(i.id);assert.ok(rules.ingredients[i.id],`${r.slug}: ${i.id}`);}}
});
test('sushi photo atlas includes exactly 36 unique images and every sushi slug',()=>{
 const photo=json('assets/sushi/positions.json');
 assert.equal(photo.slugs.length,36);
 assert.equal(new Set(photo.slugs).size,36);
 const recipeSlugs=new Set(all.filter(r=>r.category==='Sushi'||['sushi-rice','sushi-white-miso-sauce'].includes(r.slug)).map(r=>r.slug));
 assert.deepEqual(new Set(photo.slugs),recipeSlugs);
});
