import React from 'react';
import {Compass} from 'lucide-react';
import logic from '../data/logic.json';
import sources from '../data/sources.json';
import {SourceLinks} from './common';
export const principles=logic.principles;
const title=id=>sources.find(s=>s.id===id)?.title||id;
export default function LogicPanel({nodes,choose,active,setActive}){
 const l=principles.find(p=>p.id===active)||principles[0];
 const node=id=>nodes.find(n=>n.id===id);
 return <section className="logic-panel" id="logic"><div className="section-line"><h3><Compass size={16}/> 地缘政治底层逻辑 <span>FIRST PRINCIPLES</span></h3><span className="muted">{logic.note}</span></div>
  <div className="logic-content"><div className="logic-list" role="tablist" aria-label="底层逻辑">{principles.map((p,i)=><button key={p.id} role="tab" aria-selected={l.id===p.id} className={l.id===p.id?'active':''} onClick={()=>setActive(p.id)}><span>{String(i+1).padStart(2,'0')}</span><b>{p.name}</b><small>{p.short}</small></button>)}</div>
   <article className="logic-detail" aria-label={l.name}>
    <h4>{l.name}</h4><p className="logic-short">{l.short}</p>
    <div className="logic-theory"><span className="theory-tag">理论 · {l.theory.status}</span><p>{l.theory.claim}</p>{l.theory.refs.length>0&&<small>文献：{l.theory.refs.map(title).join('；')}</small>}</div>
    <h6>机制</h6><p>{l.mechanism}</p>
    <h6>可观测指标</h6><div className="driver-tags">{l.indicators.map(t=><b key={t}>{t}</b>)}</div>
    <h6>数据事实（带来源与日期）</h6><ul className="logic-facts">{l.facts.map(x=><li key={x.text}><span className="type fact">事实</span>{x.text}<small>{x.asOf} · {title(x.source)}</small></li>)}</ul>
    <h6>与地图节点的联系（点击飞往）</h6><div className="logic-nodes">{l.examples.map(x=>{const n=node(x.node);return n&&<button key={x.node} onClick={()=>choose(n)}><b>{n.name}</b><small>{x.why}</small></button>})}</div>
    <h6>反例与局限</h6><ul className="logic-counter">{l.counter.map(c=><li key={c}>{c}</li>)}</ul>
    <SourceLinks ids={l.sources}/>
   </article></div></section>;
}
