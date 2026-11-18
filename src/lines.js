// Interactive map lines: one normalized record per visible line (pure, unit-tested).
import routes from './data/routes.json' with {type:'json'};import corridors from './data/corridors.json' with {type:'json'};import alliances from './data/alliances.json' with {type:'json'};import terrain from './data/terrain.json' with {type:'json'};
export function arc(a,b,bend=.18,n=24){const [y1,x1]=a,[y2,x2]=b,dx=x2-x1,dy=y2-y1,cx=(x1+x2)/2-dy*bend,cy=(y1+y2)/2+dx*bend;return Array.from({length:n+1},(_,i)=>{const t=i/n,u=1-t;return [u*u*y1+2*u*t*cy+t*t*y2,u*u*x1+2*u*t*cx+t*t*x2];});}
// Higher priority = drawn on top and preferred when lines overlap.
export const GROUPS={terrain:{p:1,name:'地形约束'},alliance:{p:2,name:'安全网络'},route:{p:3,name:'运输航线'},corridor:{p:4,name:'供应链走廊'},projection:{p:5,name:'派系投射'}};
const TERRAIN={mountain:['山脉屏障','#c4a676',{weight:2,opacity:.8,dashArray:'6 4',lineCap:'butt'}],plain:['平原走廊','#7fa37a',{weight:7,opacity:.22,lineCap:'round'}],sea:['海峡 / 岛链','#5fb2d1',{weight:2,opacity:.7,dashArray:'8 6'}],line:['军事分界线','#e2876f',{weight:2.5,opacity:.85,dashArray:'4 4'}]};
const CORR={energy:'能源走廊',chips:'芯片供应链',minerals:'关键矿产链'};
export function buildLines({layers,faction,nodes}){
 const out=[];
 if(layers.terrain)for(const f of terrain.features){const [type,color,style]=TERRAIN[f.kind];out.push({id:'t-'+f.id,group:'terrain',name:f.name,type,carries:f.note,why:'自然地理如何约束行动与通道。',sources:[],asOf:'本地示意（terrain.json）',note:'手工简化示意，非高程或精确边界',color,style:{color,...style},paths:[f.positions]});}
 if(layers.alliances){const pos=id=>alliances.nodes.find(n=>n.id===id);alliances.edges.forEach((e,i)=>{const a=pos(e.from),b=pos(e.to),color=e.from==='cn'?'#c395dd':'#7b96df';out.push({id:'a-'+i,group:'alliance',name:`${a.name} — ${b.name}`,type:'安全 / 伙伴关系（示意）',carries:e.label,why:'大国之间的安全承诺与合作网络。',sources:[e.source].filter(Boolean),asOf:'研究快照 2026-11-18',note:'首都示意连线，不代表部署或自动参战承诺',color,style:{color,weight:1.8,dashArray:'3 6',opacity:1},paths:[[a.position,b.position]]});});}
 if(layers.routes)for(const r of routes)out.push({id:'r-'+r.id,group:'route',name:r.name,type:'运输航线（示意）',carries:r.note,why:'能源与贸易的主要海上通道及替代路线。',sources:[r.source].filter(Boolean),asOf:'研究快照 2026-11-18',note:'示意走向，非精确航迹',color:'#4e939b',style:{color:'#6fb3bb',weight:1.6,dashArray:'5 7',opacity:.7},paths:[r.positions]});
 if(layers.corridors)for(const c of corridors)out.push({id:'c-'+c.id,group:'corridor',name:c.name,type:CORR[c.kind]||'供应链走廊',carries:c.fact,why:c.label,sources:c.sources,asOf:c.asOf,note:'示意走向，非精确航迹',color:c.color,style:{color:c.color,weight:2.6,opacity:.8,dashArray:c.kind==='energy'?null:'2 7',lineCap:'round'},paths:[c.positions]});
 if(faction){const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));faction.projections.forEach((p,i)=>{const t=byId[p.target];if(!t)return;out.push({id:`p-${faction.id}-${p.target}`,group:'projection',name:`${faction.name} → ${t.name}`,type:'派系投射（分析判断）',carries:p.stance,why:faction.summary,sources:faction.sources||[],asOf:'研究快照 2026-11-18',note:faction.caveat,color:faction.color,style:{color:faction.color,weight:2.4,opacity:.95,dashArray:'7 6'},paths:faction.origins.map(o=>arc(o,t.position,(i%2?-1:1)*.16)),target:t.id});});}
 return out.sort((a,b)=>GROUPS[a.group].p-GROUPS[b.group].p);
}
export function segDist(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;let t=l?((p.x-a.x)*dx+(p.y-a.y)*dy)/l:0;t=Math.max(0,Math.min(1,t));const x=a.x+t*dx-p.x,y=a.y+t*dy-p.y;return Math.sqrt(x*x+y*y);}
// All lines within tol px of a screen point, nearest first; ties go to the higher-priority group.
export function linesNear(point,lines,project,tol=14){
 const res=[];for(const l of lines){let d=Infinity;for(const path of l.paths){const pts=path.map(project);for(let i=1;i<pts.length;i++)d=Math.min(d,segDist(point,pts[i-1],pts[i]));}if(d<=tol)res.push({line:l,d});}
 return res.sort((a,b)=>Math.round(a.d/4)-Math.round(b.d/4)||GROUPS[b.line.group].p-GROUPS[a.line.group].p).map(r=>r.line);
}
