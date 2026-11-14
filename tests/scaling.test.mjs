import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";import{calculate,positiveRound,ruleFor}from"../scaling.mjs";
const load=(p)=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const rules=load("data/rounding.json"),slugs=load("data/index.json").recipes;
const get=(slug)=>load("data/recipes/"+slug+".json");
test("approved recipes, six servings and global policies",()=>{
 assert.ok(slugs.length>=4);
 for(const slug of slugs){const r=get(slug);assert.equal(r.servings,6);assert.ok(r.steps.length>=3);assert.ok(r.ingredients.length>=4);
  const ids=new Set();
  for(const i of r.ingredients){assert.ok(i.amount>0);assert.ok(!ids.has(i.id));ids.add(i.id);
   assert.ok(rules.ingredients[i.id],"missing policy for "+i.id);
   const policy=ruleFor(i,rules,r.rounding);assert.ok(policy.step>0&&policy.minimum>0);
  }
 }
});
test("serving anchor scales noodles from original baseline",()=>{
 const view=calculate(get("five-spice-pork-mazemen"),rules,"servings",2);
 assert.equal(view.servings,2);
 assert.equal(view.ingredients.find(x=>x.id==="dried_ramen").value,200);
});
test("1000 g pork anchors everything, including servings",()=>{
 const view=calculate(get("five-spice-pork-mazemen"),rules,"ground_pork",1000);
 assert.equal(view.servings,9);
 assert.equal(view.ingredients.find(x=>x.id==="ground_pork").value,1000);
 assert.equal(view.ingredients.find(x=>x.id==="dried_ramen").value,925);
});
test("small quantities never disappear and recipe overrides remain local",()=>{
 const r=get("miso-coriander-wings"),view=calculate(r,rules,"servings",1);
 assert.ok(view.ingredients.find(x=>x.id==="white_pepper").value>0);
 assert.equal(positiveRound(.001,{step:1,minimum:1}),1);
 assert.equal(rules.ingredients.white_pepper.step,.1);
 assert.equal(ruleFor(r.ingredients.find(x=>x.id==="white_pepper"),rules,r.rounding).step,.05);
});