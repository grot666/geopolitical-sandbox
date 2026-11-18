import React,{useRef,useEffect} from 'react';
import {X,Info,ArrowUpRight,AlertTriangle} from 'lucide-react';
import engine from '../data/engine.json';
import {score} from '../engine';
import {Badge,SourceLinks} from './common';
import {allFactions} from './Cockpit';
import {principles} from './LogicPanel';
export default function Drawer({node:n,rank,weights,label,onClose,openMethod,project,openLogic}){
 const ref=useRef(null);useEffect(()=>{ref.current?.focus()},[n]);
 const logics=principles.flatMap(l=>l.examples.filter(x=>x.node===n.id).map(x=>({l,x})));
 const related=allFactions.flatMap(f=>f.projections.filter(p=>p.target===n.id).map(p=>({f,p})));
 return <><div className="drawer-scrim" onClick={onClose}/>
 <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={n.name+' 深度分析'} tabIndex={-1} ref={ref}>
  <div className="drawer-top"><span>FOCUS BRIEF / 深度因果档案</span><button aria-label="关闭分析" onClick={onClose}><X size={20}/></button></div>
  <div className="drawer-heading"><div className="drawer-badges"><Badge status={n.status} user={n.user}/>{rank&&<span className="rank-pill">当前排名 #{rank}</span>}</div>
   <h2>{n.name}</h2><p>{n.subtitle}</p>
   {n.essence&&<p className="essence">“{n.essence}”</p>}
   <div className="big-score">{score(n.scores,weights).toFixed(1)}<span>综合重要性 / 100<br/>{label}</span></div></div>
  <div className="drawer-body">
   {n.user?<div className="estimate-note user-note" role="note"><AlertTriangle size={14}/><span>用户注入 · 未核实：此节点由你在本浏览器粘贴，未经本工具核实，仅保存在本机 localStorage；评分与文本均来自注入数据。资料日期 {n.asOf} · 自报信心 {n.confidence}</span></div>
   :<div className="estimate-note"><Info size={14}/><span>{n.epistemic}{n.parentEvent?' · 评分继承关联地区，非单设施风险':''}<br/>事实基线 {n.asOf} · 证据信心 {n.confidence} · 检索 2026-11-18</span></div>}
   {(n.geoTag||n.leverage)&&<div className="insight-pair">{n.geoTag&&<div><small>地理宿命</small><p>{n.geoTag}</p></div>}{n.leverage&&<div><small>核心筹码</small><p>{n.leverage}</p></div>}</div>}
   <h3>为什么它重要？<small>四维评分与依据</small></h3>
   <div className="dimension-list">{engine.dimensions.map(d=><div key={d.key}><div className="dimension-title"><span>{d.name}</span><b>{n.scores[d.key]}<small> / 100</small></b></div><div className="dimension-bar"><i style={{width:n.scores[d.key]+'%'}}/></div>{n.rationale?.[d.key]&&<p>{n.rationale[d.key]}</p>}</div>)}</div>
   <button className="formula-link" onClick={openMethod}>查看权重、锚点与计算公式 <ArrowUpRight size={13}/></button>
   <div className="causal-chain">{[['what','01','发生了什么','WHAT'],['geography','02','地理与地形约束','WHY / GEOGRAPHY'],['resources','03','资源与供应链筹码','WHY / RESOURCES'],['politics','04','大国政治推手','WHO / POLITICS']].map(([k,num,t,en])=><section key={k}><div><span>{num}</span><h4>{t}<small>{en}</small></h4></div><p>{n.analysis[k]}</p>
    {k==='politics'&&related.length>0&&<div className="related-factions"><small>派系倾向（分析判断，可在地图上投射）</small>{related.map(({f,p})=><button key={f.id} style={{'--c':f.color}} onClick={()=>project(f.id)}><b>{f.name}</b>{p.stance}</button>)}</div>}</section>)}
    {n.perspectives?.length>0&&<section className="perspectives"><div><span>05</span><h4>多方底层生存焦虑对撞<small>MULTI-PARTY PERSPECTIVES</small></h4></div>
     <p className="persp-note">对称呈现各方的安全焦虑与目标；“目标”尽量引用其公开表态，其余为分析重构，不代表本工具认同任何一方。</p>
     <div className="persp-grid">{n.perspectives.map(x=><article key={x.actor}><b>{x.actor}</b><small>底层焦虑</small><p>{x.anxiety}</p><small>核心目标</small><p>{x.goal}</p></article>)}</div></section>}
   </div>
   {logics.length>0&&<><h3>驱动逻辑<small>哪些底层逻辑在起作用（分析框架）</small></h3><div className="node-logic">{logics.map(({l,x})=><button key={l.id} onClick={()=>openLogic&&openLogic(l.id)}><b>{l.name}</b><span>{x.why}</span></button>)}</div></>}
   <h3>证据与来源</h3>
   {n.user?<SourceLinks items={n.sources}/>:<SourceLinks ids={n.sources}/>}
   <p className="small-disclaimer">{n.user?'注入来源链接未经核实，打开前请自行判断。':'事实摘要来自所列来源；因果分析、四维评分、多方视角和信心等级是本工具的分析判断。来源日期不等于实时状态。'}</p>
  </div>
 </aside></>;
}
