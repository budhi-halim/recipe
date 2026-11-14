import fs from "node:fs";
import path from "node:path";
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const index = read("data/index.json"), rules=read("data/rounding.json");
const seen = new Set();
const required = ["slug","title","number","category","servings","prep","cook","description","groups","ingredients","steps","notes"];
for (const slug of index.recipes) {
 if(seen.has(slug))throw Error("Repeated slug: "+slug);
 seen.add(slug);
 const recipe=read(path.join("data","recipes",slug+".json"));
 for(const field of required)if(!(field in recipe))throw Error(slug+" missing "+field);
 if(recipe.slug!==slug||!Number.isInteger(recipe.servings)||recipe.servings<1)throw Error(slug+" invalid slug/servings");
 const ids=new Set();
 for(const item of recipe.ingredients){
  if(ids.has(item.id))throw Error(slug+" duplicate ingredient: "+item.id);
  ids.add(item.id);
  if(!Number.isFinite(item.amount)||item.amount<=0||!item.unit||!item.name||!recipe.groups.includes(item.group))throw Error(slug+" invalid ingredient "+item.id);
  if(!rules.ingredients[item.id])throw Error(slug+" ingredient missing global rounding: "+item.id);
 }
 if(!Array.isArray(recipe.steps)||!recipe.steps.length||recipe.steps.some(s=>!Array.isArray(s)||s.length!==2))throw Error(slug+" invalid steps");
}
console.log("Validated",seen.size,"recipes and their canonical ingredients.");
