// Strict, offline validator for user-pasted intelligence nodes. Never evaluates code, never fetches.
export const STORAGE_KEY='gravity.userNodes.v1';
export const LIMITS={chars:30000,nodes:12,sources:8,perspectives:4};
const KEYS=['kineticIntensity','systemicSpillover','greatPowerInvolvement','geographicLeverage'];
const ANALYSIS=['what','geography','resources','politics'];
const TOP={id:1,name:1,subtitle:0,position:1,status:1,scores:1,essence:0,geoTag:0,leverage:0,analysis:1,rationale:0,perspectives:0,sources:1,asOf:1,confidence:0};
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const isObj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function str(v,path,max,errs,req=true){
 if(v===undefined){if(req)errs.push(`${path}：缺少字段`);return;}
 if(typeof v!=='string'){errs.push(`${path}：必须是字符串`);return;}
 const t=v.trim();if(req&&!t)errs.push(`${path}：不能为空`);
 if(t.length>max)errs.push(`${path}：超过 ${max} 字符`);
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(t))errs.push(`${path}：包含控制字符`);
}
function exact(o,allowed,path,errs){for(const k of Object.keys(o))if(!Object.hasOwn(allowed,k))errs.push(`${path}：不允许的字段 “${k.slice(0,40)}”`);}
export function validateNode(n,i=0){
 const errs=[],p=`节点${i+1}`;
 if(!isObj(n))return [`${p}：必须是 JSON 对象`];
 exact(n,TOP,p,errs);
 for(const [k,req] of Object.entries(TOP))if(req&&!Object.hasOwn(n,k))errs.push(`${p}.${k}：缺少必填字段`);
 if(typeof n.id!=='string'||!/^[a-z0-9][a-z0-9-]{2,40}$/.test(n.id))errs.push(`${p}.id：仅限小写字母、数字、连字符，3–41 位`);
 str(n.name,`${p}.name`,40,errs);str(n.subtitle,`${p}.subtitle`,80,errs,false);
 for(const k of ['essence','geoTag','leverage'])str(n[k],`${p}.${k}`,140,errs,false);
 if(!Array.isArray(n.position)||n.position.length!==2||!n.position.every(Number.isFinite))errs.push(`${p}.position：必须是 [纬度, 经度] 数字数组`);
 else{const [la,lo]=n.position;if(la<-85||la>85)errs.push(`${p}.position：纬度须在 -85 到 85`);if(lo<-180||lo>180)errs.push(`${p}.position：经度须在 -180 到 180`);}
 if(!['crisis','latent','structural'].includes(n.status))errs.push(`${p}.status：只能是 crisis / latent / structural`);
 if(!isObj(n.scores))errs.push(`${p}.scores：必须是对象`);
 else{exact(n.scores,Object.fromEntries(KEYS.map(k=>[k,1])),`${p}.scores`,errs);for(const k of KEYS){const v=n.scores[k];if(!Number.isInteger(v)||v<0||v>100)errs.push(`${p}.scores.${k}：须为 0–100 的整数`);}}
 for(const [field,max,req] of [['analysis',1200,true],['rationale',400,false]]){
  const o=n[field];if(o===undefined&&!req)continue;
  if(!isObj(o)){errs.push(`${p}.${field}：必须是对象`);continue;}
  exact(o,Object.fromEntries(ANALYSIS.map(k=>[k,1])),`${p}.${field}`,errs);for(const k of ANALYSIS)str(o[k],`${p}.${field}.${k}`,max,errs,req);
 }
 if(n.perspectives!==undefined){
  if(!Array.isArray(n.perspectives)||n.perspectives.length>LIMITS.perspectives)errs.push(`${p}.perspectives：最多 ${LIMITS.perspectives} 项的数组`);
  else n.perspectives.forEach((x,j)=>{const q=`${p}.perspectives[${j}]`;if(!isObj(x))return errs.push(`${q}：必须是对象`);exact(x,{actor:1,anxiety:1,goal:1},q,errs);str(x.actor,`${q}.actor`,40,errs);str(x.anxiety,`${q}.anxiety`,240,errs);str(x.goal,`${q}.goal`,240,errs);});
 }
 if(!Array.isArray(n.sources)||n.sources.length<1||n.sources.length>LIMITS.sources)errs.push(`${p}.sources：须为 1–${LIMITS.sources} 条来源`);
 else n.sources.forEach((s,j)=>{const q=`${p}.sources[${j}]`;if(!isObj(s))return errs.push(`${q}：必须是对象`);exact(s,{title:1,url:1,date:1},q,errs);str(s.title,`${q}.title`,120,errs);
  let ok=false;if(typeof s.url==='string'&&s.url.length<=500){try{const u=new URL(s.url);ok=u.protocol==='https:'&&!u.username&&!u.password;}catch{}}
  if(!ok)errs.push(`${q}.url：必须是 https:// 链接（不超过 500 字符、不含账号）`);
  if(s.date!==undefined&&(typeof s.date!=='string'||!DATE.test(s.date)))errs.push(`${q}.date：格式须为 YYYY-MM-DD`);});
 if(typeof n.asOf!=='string'||!DATE.test(n.asOf)||Number.isNaN(Date.parse(n.asOf)))errs.push(`${p}.asOf：格式须为有效的 YYYY-MM-DD`);
 if(n.confidence!==undefined&&!['低','中','高'].includes(n.confidence))errs.push(`${p}.confidence：只能是 低 / 中 / 高`);
 return errs;
}
const clean=s=>typeof s==='string'?s.trim():s;
function normalize(n){
 const o={id:'user-'+n.id,name:clean(n.name),subtitle:clean(n.subtitle)||'用户注入节点',position:[...n.position],status:n.status,scores:{...n.scores},
  analysis:Object.fromEntries(ANALYSIS.map(k=>[k,clean(n.analysis[k])])),sources:n.sources.map(s=>({title:clean(s.title),url:s.url,...(s.date?{date:s.date}:{})})),asOf:n.asOf,
  confidence:n.confidence||'未评估',user:true};
 for(const k of ['essence','geoTag','leverage'])if(n[k])o[k]=clean(n[k]);
 if(n.rationale)o.rationale=Object.fromEntries(ANALYSIS.map(k=>[k,clean(n.rationale[k])]));
 if(n.perspectives)o.perspectives=n.perspectives.map(x=>({actor:clean(x.actor),anxiety:clean(x.anxiety),goal:clean(x.goal)}));
 return o;
}
// Parse pasted text (JSON object or array only). existing = currently stored user nodes.
export function parseInjection(text,existing=[],reserved=[]){
 if(typeof text!=='string'||!text.trim())return {ok:false,errors:['请粘贴 JSON 文本']};
 if(text.length>LIMITS.chars)return {ok:false,errors:[`文本超过 ${LIMITS.chars} 字符上限`]};
 let data;try{data=JSON.parse(text);}catch(e){return {ok:false,errors:['不是合法 JSON：'+String(e.message).slice(0,120)]};}
 const list=Array.isArray(data)?data:[data];
 if(!list.length)return {ok:false,errors:['数组为空']};
 const errors=list.flatMap((n,i)=>validateNode(n,i));
 const ids=list.map(n=>n&&n.id);if(new Set(ids).size!==ids.length)errors.push('同一批次中 id 重复');
 for(const id of ids)if(reserved.includes(id)||reserved.includes('user-'+id))errors.push(`id “${String(id).slice(0,41)}” 与已核实节点冲突（注入数据不能覆盖已核实数据）`);
 if(errors.length)return {ok:false,errors:errors.slice(0,20)};
 const nodes=list.map(normalize);const merged=[...existing.filter(e=>!nodes.some(n=>n.id===e.id)),...nodes];
 if(merged.length>LIMITS.nodes)return {ok:false,errors:[`本地最多保存 ${LIMITS.nodes} 个注入节点`]};
 return {ok:true,nodes:merged,added:nodes.length};
}
// Re-validate whatever is in storage; drop anything invalid.
export function loadStored(raw,reserved=[]){
 if(!raw)return [];
 try{const arr=JSON.parse(raw);if(!Array.isArray(arr)||arr.length>LIMITS.nodes)return [];
  return arr.filter(n=>{if(!isObj(n)||typeof n.id!=='string'||!n.id.startsWith('user-')||n.user!==true)return false;const {user,confidence,...rest}=n;const raw={...rest,id:n.id.slice(5),...(['低','中','高'].includes(confidence)?{confidence}:{})};if(raw.subtitle==='用户注入节点')delete raw.subtitle;return validateNode(raw).length===0&&!reserved.includes(raw.id);});}catch{return [];}
}
export const EXAMPLE={id:'arctic-demo',name:'北极航道（示例）',subtitle:'演示注入格式，不是核实情报',position:[74,40],status:'latent',
 scores:{kineticIntensity:10,systemicSpillover:40,greatPowerInvolvement:55,geographicLeverage:60},
 essence:'示例文本：演示如何描述一个节点的一句话本质。',geoTag:'示例文本：地理约束描述。',leverage:'示例文本：核心筹码描述，应附来源与日期。',
 analysis:{what:'示例：此处应写发生了什么，并标明信息日期。',geography:'示例：地理为何重要。',resources:'示例：涉及哪些资源。',politics:'示例：相关政治力量。'},
 perspectives:[{actor:'示例行为者A',anxiety:'示例焦虑',goal:'示例目标'},{actor:'示例行为者B',anxiety:'示例焦虑',goal:'示例目标'}],
 sources:[{title:'示例来源（请替换为真实来源）',url:'https://example.org/',date:'2026-11-18'}],asOf:'2026-11-18',confidence:'低'};
export const PROMPT=`你是地缘政治研究助理。请只输出一个 JSON 数组（不要 Markdown、不要解释），每个元素严格符合以下结构，不得增加其他字段：
{
 "id": "小写字母数字连字符，如 arctic-route",
 "name": "≤40字",
 "subtitle": "可选，≤80字",
 "position": [纬度, 经度],
 "status": "crisis | latent | structural",
 "scores": {"kineticIntensity":0-100整数,"systemicSpillover":0-100整数,"greatPowerInvolvement":0-100整数,"geographicLeverage":0-100整数},
 "essence": "可选，一句话本质",
 "geoTag": "可选，地理宿命",
 "leverage": "可选，核心筹码（含数字时须有来源）",
 "analysis": {"what":"…","geography":"…","resources":"…","politics":"…"},
 "perspectives": [{"actor":"…","anxiety":"…","goal":"…"}]（可选，最多4项，各方对称呈现）,
 "sources": [{"title":"…","url":"https://…","date":"YYYY-MM-DD"}]（1–8条可公开访问的来源）,
 "asOf": "YYYY-MM-DD",
 "confidence": "低 | 中 | 高"
}
要求：只使用可核实的公开来源；每个数字都要能在来源中找到；不确定时写明“未核实”；区分事实、各方表态与分析判断；不要编造链接。`;
