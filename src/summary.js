// Builds the "一眼看穿当前世界" banner from data + scores. Returns plain text parts (rendered as React text).
import {score} from './engine.js';
const STRUCT=[0,1,1,1];
export function buildSummary(events,weights,includeUser=false){
 const rows=events.filter(e=>includeUser||!e.user).map(e=>({e,v:score(e.scores,weights)})).sort((a,b)=>b.v-a.v||a.e.id.localeCompare(b.e.id));
 const crisis=rows.filter(r=>r.e.status==='crisis'),latent=rows.filter(r=>r.e.status==='latent'),structural=rows.filter(r=>r.e.status==='structural');
 const top=rows[0];const struct=[...latent,...structural].sort((a,b)=>score(b.e.scores,STRUCT)-score(a.e.scores,STRUCT)||a.e.id.localeCompare(b.e.id))[0];
 const parts=[];
 if(crisis.length)parts.push({t:`${crisis.length} 个现行危机：`},...crisis.flatMap((r,i)=>[{t:r.e.name,strong:true,id:r.e.id},{t:i<crisis.length-1?'、':'；'}]));
 if(struct)parts.push({t:'结构性风险最高的未爆点：'},{t:struct.e.name,strong:true,id:struct.e.id},{t:'（不代表战争概率）；'});
 if(top)parts.push({t:'按当前权重综合第一：'},{t:`${top.e.name} ${top.v}`,strong:true,id:top.e.id},{t:'。'});
 return {parts,top:top?.e,counts:{crisis:crisis.length,latent:latent.length,structural:structural.length}};
}
