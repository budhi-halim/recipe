export function ruleFor(ingredient,rules,overrides={}){
  return {...(rules.defaults[ingredient.unit]||{step:1,minimum:1}),...(rules.ingredients[ingredient.id]||{}),...(overrides[ingredient.id]||{})};
}
export function positiveRound(value,rule){
  const step=Number(rule.step)>0?Number(rule.step):1;
  const minimum=Number(rule.minimum)>0?Number(rule.minimum):step;
  return Number(Math.max(minimum,Math.round((value+Number.EPSILON)/step)*step).toFixed(8));
}
export function digits(step){
  const value=String(step);
  if(value.includes("e-"))return Math.min(8,Number(value.split("e-")[1]));
  return Math.min(8,(value.split(".")[1]||"").length);
}
export function formatAmount(value,rule){
  return new Intl.NumberFormat("en-US",{maximumFractionDigits:digits(rule.step)}).format(value);
}
export function calculate(recipe,rules,anchor="servings",target=recipe.servings){
  const chosen=recipe.ingredients.find(x=>x.id===anchor);
  if(anchor!=="servings"&&!chosen)throw Error("Unknown scaling anchor");
  const entered=Number(target);
  if(!Number.isFinite(entered)||entered<=0)throw Error("Anchor quantity must be positive");
  const servingsRule=rules.servings||{step:1,minimum:1};
  const actual=anchor==="servings"?positiveRound(entered,servingsRule):entered;
  const factor=anchor==="servings"?actual/recipe.servings:actual/chosen.amount;
  const servings=anchor==="servings"?actual:positiveRound(recipe.servings*factor,servingsRule);
  const ingredients=recipe.ingredients.map(item=>{
    const rule=ruleFor(item,rules,recipe.rounding||{});
    return {...item,rule,value:item.id===anchor?actual:positiveRound(item.amount*factor,rule),exact:item.amount*factor};
  });
  return {factor,servings,ingredients,anchor,anchorValue:actual};
}