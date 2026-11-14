import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {requiredWidth,chooseTier,WIDTHS} from "../progressive-images.mjs";
const slugs=JSON.parse(readFileSync(new URL("../data/index.json",import.meta.url),"utf8")).recipes;
test("tiers ordered and tiny preview available",()=>{
 assert.deepEqual(WIDTHS,[24,320,640,960,1440]);
 assert.equal(chooseTier(24),24);
 assert.equal(chooseTier(320),320);
 assert.equal(chooseTier(321),640);
 assert.equal(chooseTier(2500),1440);
});
test("DPR and zoom influence required resolution",()=>{
 assert.equal(requiredWidth({width:300,height:150},2,1),600);
 assert.equal(chooseTier(requiredWidth({width:300,height:150},2,2)),1440);
 assert.equal(requiredWidth({width:200,height:300},1,1),400);
});
test("all recipes have five individual image tiers",()=>{
 for(const slug of slugs)for(const width of WIDTHS){
  assert.ok(existsSync(new URL("../assets/responsive/"+slug+"-"+width+".webp",import.meta.url)),slug+" "+width);
 }
});
