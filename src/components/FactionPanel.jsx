import React,{useState} from 'react';
import {ChevronRight,Crosshair} from 'lucide-react';
import factions from '../data/factions.json';
import politics from '../data/politics.json';
import {systems,allFactions,factionById} from './Cockpit';
import {SourceLinks} from './common';
const TYPE={fact:'事实',estimate:'估计',analysis:'分析'};
// Interest-coalition browser: systems → factions → full interest model. Text is rendered as plain React text (no HTML injection).
export default function FactionPanel({nodes,project,choose}){
 const [sys,setSys]=useState('US'),[idx,setIdx]=useState(0);
 const list=allFactions.filter(f=>f.bloc===sys),f=list[idx]||list[0],meta=systems.find(s=>s.id===sys),inst=politics[sys];
 const node=id=>nodes.find(n=>n.id===id);
 const fname=id=>factionById(id)?.name||id;
 return <section className="politics-panel"><div className="section-line"><h3>利益派系与政治力量 <span>INTEREST COALITIONS</span></h3><span className="muted">派系 = 由共同物质利益结成的政治联盟；利益存在，联盟就存在</span></div>
  <div className="segmented system-seg" role="tablist" aria-label="选择行为体系统">{systems.map(s=><button key={s.id} role="tab" aria-selected={sys===s.id} className={sys===s.id?'active':''} onClick={()=>{setSys(s.id);setIdx(0)}}>{s.name}</button>)}</div>
  <div className="politics-content"><div className="politics-intro"><h3>{meta.title}</h3><p>{meta.subtitle}</p><small>{factions.note}</small>
    {inst&&<div className="institutions"><small>制度渠道</small>{inst.groups.map(g=><p key={g[0]}><b>{g[0]}</b>{g[2]}</p>)}<SourceLinks ids={[inst.source]}/></div>}</div>
   <div className="actor-list">{list.map((x,i)=><button key={x.id} className={f.id===x.id?'active':''} onClick={()=>setIdx(i)}><span className="dot" style={{background:x.color}}/>{x.name}<ChevronRight size={13}/></button>)}</div>
   <article className="actor-detail faction-model" aria-label={f.name+' 利益模型'}>
    <div className="eyebrow">INTEREST COALITION / {meta.name} · 强度 {f.strength.level}（{f.strength.trend}）· 信心 {f.confidence}</div>
    <h4 style={{color:f.color}}>{f.name}</h4><h5>{f.rep}</h5><p>{f.definition}</p>
    <div className="model-grid">
     <section><h6>核心物质利益</h6><ul>{f.interests.map(i=><li key={i.text}><em>{i.kind}</em>{i.text}</li>)}</ul></section>
     <section><h6>利益来源与持久性 · {f.durability.horizon}</h6><p>{f.durability.source}。{f.durability.text}</p><h6>制度载体</h6><p>{f.vehicles.join('、')}</p></section>
     <section className="wide"><h6>可观测指标（带日期与来源）</h6><ul className="indicators">{f.indicators.map(i=><li key={i.label}><span className={'type '+i.type}>{TYPE[i.type]}</span><b>{i.label}</b>{i.value}<small>{i.asOf}</small><SourceLinks ids={[i.source]}/></li>)}</ul></section>
     <section><h6>由利益推出的政策偏好</h6><ul>{f.preferences.map(p=><li key={p}>{p}</li>)}</ul></section>
     <section><h6>影响的热点（分析判断）</h6><ul className="proj-list">{f.projections.map(p=>{const n=node(p.target);return <li key={p.target}><button onClick={()=>n&&choose(n)}>{n?.name||p.target}</button><b>{p.stance}</b><small>{p.why}</small></li>})}</ul></section>
     <section><h6>内部分歧</h6><p>{f.cleavages}</p><h6>伙伴 / 对手</h6><p>伙伴：{f.partners.map(fname).join('、')||'—'}<br/>对手：{f.rivals.map(fname).join('、')||'—'}</p></section>
     <section><h6>当前强度 · {f.strength.asOf}</h6><p>{f.strength.basis}</p>{f.examples.length>0&&<><h6>人物（仅作时间点载体示例）</h6>{f.examples.map(e=><p key={e.text}>{e.text}（{e.asOf}）</p>)}</>}</section>
    </div>
    <p className="caveat">注意：{f.caveat}</p>
    <button className="project-btn" style={{'--c':f.color}} onClick={()=>project(f.id)}><Crosshair size={13}/> 在地图上投射</button>
    <SourceLinks ids={f.sources}/>
   </article></div></section>;
}
