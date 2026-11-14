// Progressive image loader. A 24 px preview is visible immediately, even before
// the IntersectionObserver fires. Each tier is decoded before being swapped in.
// Resolution is computed from the rendered box, DPR and viewport zoom; upgrades
// never downgrade the displayed image. This module is also reusable by future recipes.
export const WIDTHS=[24,320,640,960,1440];
export function requiredWidth(rect,dpr=1,zoom=1){
 const width=Math.max(rect?.width||0,(rect?.height||0)*4/3);
 return Math.max(1,Math.ceil(width*Math.max(1,dpr)*Math.max(1,zoom)));
}
export function chooseTier(width,tiers=WIDTHS){
 return tiers.find(x=>x>=width)||tiers[tiers.length-1];
}
export class ProgressiveImages{
 constructor(){
  this.states=new WeakMap();this.elements=new Set();
  this.observer=typeof IntersectionObserver==="undefined"?null:new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){this.observer.unobserve(e.target);const s=this.states.get(e.target);if(s){s.visible=true;this.upgrade(e.target);}}
  },{rootMargin:"250px"});
  this.resize=typeof ResizeObserver==="undefined"?null:new ResizeObserver(entries=>{for(const e of entries)this.upgrade(e.target);});
  const update=()=>this.updateVisible();
  window.addEventListener("resize",update,{passive:true});
  window.visualViewport?.addEventListener("resize",update,{passive:true});
  window.visualViewport?.addEventListener("scroll",update,{passive:true});
  document.addEventListener("fullscreenchange",update);
 }
 observe(el){
  if(!el||this.states.has(el))return;
  const slug=el.dataset.recipeImage;if(!/^[a-z0-9-]+$/.test(slug||""))return;
  const state={slug,loaded:24,requested:24,visible:false,serial:0};
  this.states.set(el,state);this.elements.add(el);
  el.style.backgroundImage="url('"+this.src(slug,24)+"')";
  if(this.resize)this.resize.observe(el);
  if(this.observer)this.observer.observe(el);
  else{state.visible=true;this.upgrade(el);}
 }
 src(slug,width){return "./assets/responsive/"+slug+"-"+width+".webp";}
 updateVisible(){
  for(const el of this.elements){
   if(!el.isConnected){this.resize?.unobserve(el);this.observer?.unobserve(el);this.elements.delete(el);continue;}
   this.upgrade(el);
  }
 }
 upgrade(el){
  const s=this.states.get(el);if(!s?.visible)return;
  const rect=el.getBoundingClientRect();
  if(rect.width<=0||rect.height<=0)return;
  const zoom=window.visualViewport?.scale||1;
  const needed=requiredWidth(rect,window.devicePixelRatio||1,zoom);
  const tier=chooseTier(needed);
  if(tier<=s.loaded||tier<=s.requested)return;
  s.requested=tier;const serial=++s.serial;
  const url=this.src(s.slug,tier);
  const image=new Image();
  image.onload=async()=>{
   try{if(image.decode)await image.decode();}catch{}
   if(!el.isConnected||serial!==s.serial)return;
   if(tier>s.loaded){el.style.backgroundImage="url('"+url+"')";s.loaded=tier;}
  };
  image.onerror=()=>{if(serial===s.serial)s.requested=s.loaded;};
  image.src=url;
 }
}
