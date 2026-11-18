// Pure helpers for zoom-dependent, collision-avoiding map labels (unit-tested).
export function charWidth(name,fs){let w=0;for(const c of name)w+=/[\u0000-\u00ff]/.test(c)?fs*.58:fs*1.02;return w;}
export function labelStyle(item){const k=item.scale||1;const r=labelStyleBase(item);return {...r,fs:Math.round(r.fs*k*10)/10};}
function labelStyleBase(item){
 if(item.kind==='watermark')return {fs:15,ls:3,cls:'map-text watermark'};
 if(item.kind==='region')return {fs:11,ls:4,cls:'map-text region'};
 if(item.kind==='ocean')return {fs:12,ls:3,cls:'map-text ocean'};
 if(item.kind==='sea')return {fs:10,ls:1,cls:'map-text sea'};
 if(item.kind==='strait')return {fs:10,ls:0,cls:'map-text strait'};
 return item.major?{fs:12.5,ls:.5,cls:'map-text country major'}:{fs:10.5,ls:0,cls:'map-text country'+(item.disputed?' disputed':'')};
}
// Bilingual: secondary English line for countries (majors always, others from zoom 3).
export const showEn=(it,bi)=>bi&&it.kind==='country'&&it.en&&it.en!==it.name&&(it.major||(it.zoom??9)>=3);
export function measure(it,pad=3,bi=false){
 const st=labelStyle(it);let w=charWidth(it.name,st.fs)+st.ls*[...it.name].length,h=st.fs;
 const sub=it.kind==='watermark'?it.sub:showEn(it,bi)?it.en:null;
 if(sub){const sf=it.kind==='watermark'?9.5:Math.max(8,st.fs*.72);w=Math.max(w,charWidth(sub,sf)+(it.kind==='watermark'?0:.3*sub.length));h+=sf+2;}
 return {st,w:w+pad*2,h:h+pad*2,sub};
}
// Countries hosting research hotspots are placed early so they win space next to their markers.
export const FOCUS=new Set(['UKR','IRN','ISR','PRK','KOR','TWN','YEM','SAU','PAN','VEN','POL','SRB','KOS','BIH','SDN','SDS','MLI','SOM','ERI','LBY','MOZ','HTI','COL','ECU','GUY']);
export function orderLabels(countries,geo,zoom,watermarks=[]){
 const rank=x=>x.kind==='strait'?(zoom>=3.25?15:40):x.kind==='ocean'?18:x.kind==='sea'?32:x.kind==='region'?60:0;
 const c=countries.map(x=>{const focus=FOCUS.has(x.id);return {...x,kind:'country',focus,order:x.major?x.priority/10:focus?5+x.priority/100:22+x.priority/10};});
 const g=geo.filter(x=>x.kind!=='region'||zoom<2.75).map(x=>({...x,order:rank(x)+x.minZoom}));
 const wm=watermarks.filter(x=>zoom>=x.minZoom&&zoom<=x.maxZoom).map(x=>({...x,kind:'watermark',name:x.title,order:40}));
 const scale=zoom<1.25?.82:1;return [...c,...g,...wm].filter(x=>zoom>=x.minZoom).map(x=>({...x,scale,zoom})).sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
}
const ANCHORS=new Set(['USA','CHN','RUS','CAN','BRA','AUS','IND']);
const GAP=4;const hit=(a,b)=>a.x<b.x+b.w+GAP&&a.x+a.w+GAP>b.x&&a.y<b.y+b.h+1&&a.y+a.h+1>b.y;
// project: [lat,lon] -> {x,y}; size: {x:w,y:h}; avoid: marker centres to keep visible.
export function placeLabels(items,project,size,avoid=[],pad=3,reserved=[],bi=false){
 const placed=[],boxes=[];
 const fits=b=>!(b.x<2||b.y<2||b.x+b.w>size.x-2||b.y+b.h>size.y-2)&&!boxes.some(o=>hit(o,b))&&!reserved.some(o=>hit(o,b));
 const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
 // Avoid items: markers {x,y,r,top,right} or rectangles {x,y,w,h} centred on x,y (e.g. corridor pills).
 const markerBoxes=avoid.map(p=>p.w?{x:p.x-p.w/2,y:p.y-p.h/2,w:p.w,h:p.h}:{x:p.x-(p.r||14),y:p.y-(p.r||14)-(p.top||0),w:2*(p.r||14)+(p.right||0),h:2*(p.r||14)+(p.top||0)});
 for(const it of items){
  const p=project(it.position);const {w,h,sub}=measure(it,pad,bi);
  // Small vertical nudges only (large shifts drift into neighbouring countries).
  const offsets=[[0,0],[0,Math.round(h*.6)],[0,-Math.round(h*.6)]];
  // If a marker sits on the label point itself, the label may go just below/above that marker.
  if((it.zoom??9)>=3)for(const m of markerBoxes)if(p.x>=m.x&&p.x<=m.x+m.w&&p.y>=m.y&&p.y<=m.y+m.h){offsets.push([0,m.y+m.h-p.y+h/2+1],[0,m.y-p.y-h/2-1]);}
  let done=false;
  for(const [dx,dy] of offsets){
   const b={x:p.x-w/2+dx,y:p.y-h/2+dy,w,h};
   if(!fits(b)||markerBoxes.some(o=>hit(o,b)))continue;
   boxes.push(b);placed.push({...it,sub,dx,dy,box:b});done=true;break;
  }
  // Major countries (and contested areas) must stay visible: accept the nudge with least marker overlap.
  if(!done&&(it.major||it.disputed||it.focus)){
   let best=null;
   for(const [dx,dy] of [...offsets,[w*.25,0],[-w*.25,0]]){const b={x:p.x-w/2+dx,y:p.y-h/2+dy,w,h};if(!fits(b))continue;const ov=markerBoxes.reduce((a,o)=>a+overlap(o,b),0);if(!best||ov<best.ov)best={dx,dy,b,ov};}
   // On the tiny world view, drop heavily covered secondary labels instead of showing a half-hidden word.
   if(best&&(it.zoom??9)<1.25&&!ANCHORS.has(it.id)&&best.ov>.3*w*h)best=null;
   // Below zoom 2.5 dense marker clusters (Balkans, Andes) would half-cover small hotspot names; drop those too.
   if(best&&(it.zoom??9)<2.5&&!it.major&&best.ov>.3*w*h)best=null;
   if(best){boxes.push(best.b);placed.push({...it,sub,dx:best.dx,dy:best.dy,box:best.b});}
  }
 }
 return placed;
}
