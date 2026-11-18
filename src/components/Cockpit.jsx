import React,{useState,useEffect} from 'react';
import {ChevronDown,ChevronUp,RotateCcw,Crosshair} from 'lucide-react';
import factions from '../data/factions.json';
export const systems=factions.systems;
export const allFactions=systems.flatMap(s=>factions[s.id].map(f=>({...f,bloc:s.id})));
export const factionById=id=>allFactions.find(f=>f.id===id);
// Political cockpit: tabs per actor system; hover/focus previews a faction's projection on the map; click pins it.
export default function Cockpit({open,setOpen,preview,setPreview,pinned,setPinned,nodes}){
 const active=allFactions.find(f=>f.id===(preview||pinned));
 const [sys,setSys]=useState('US');
 useEffect(()=>{const p=factionById(pinned);if(p)setSys(p.bloc)},[pinned]);
 const name=id=>nodes.find(n=>n.id===id)?.name||id;
 const meta=systems.find(s=>s.id===sys);
 return <section className={'cockpit'+(open?' open':'')} aria-label="利益派系投射">
  <div className="cockpit-head">
   <button className="cockpit-toggle" aria-expanded={open} aria-controls="cockpit-body" onClick={()=>setOpen(!open)}><Crosshair size={14}/><b>派系投射驾驶舱</b><span>悬停预览 · 点击固定</span>{open?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>
   <p className="cockpit-status" role="status" aria-live="polite">{active?`${active.name} → ${active.projections.map(p=>name(p.target)).join('、')}`:'未投射'}</p>
   <button className="cockpit-reset" onClick={()=>{setPinned(null);setPreview(null)}} disabled={!active}><RotateCcw size={12}/> 重置投射</button>
  </div>
  {open&&<div id="cockpit-body" className="cockpit-body">
   <div className="system-tabs" role="tablist" aria-label="行为体系统">{systems.map(s=><button key={s.id} role="tab" aria-selected={sys===s.id} className={sys===s.id?'active':''} onClick={()=>setSys(s.id)}>{s.name}</button>)}</div>
   <div className="faction-col"><h4>{meta.title}<small>{factions[sys].length} 个利益联盟</small></h4>
    <div className="faction-grid">{allFactions.filter(f=>f.bloc===sys).map(f=><button key={f.id} className={'faction-card'+(pinned===f.id?' pinned':'')+(active?.id===f.id?' active':'')} style={{'--c':f.color}} aria-pressed={pinned===f.id}
      onMouseEnter={()=>setPreview(f.id)} onMouseLeave={()=>setPreview(null)} onFocus={()=>setPreview(f.id)} onBlur={()=>setPreview(null)} onClick={()=>setPinned(pinned===f.id?null:f.id)}>
      <b>{f.name}</b><small>{f.rep}</small><em>{f.projections.length} 个投射点 · 强度{f.strength.level} · 信心{f.confidence}</em></button>)}</div></div>
   {active&&<div className="faction-detail"><b style={{color:active.color}}>{active.name}</b><p>{active.summary}</p><p className="interest-line">核心利益：{active.interests.map(i=>i.text).join('；')}</p><ul>{active.projections.map(p=><li key={p.target}><strong>{name(p.target)}</strong>{p.stance}</li>)}</ul><small>注意：{active.caveat} {factions.note}</small></div>}
  </div>}
 </section>;
}
