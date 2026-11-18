import React from 'react';
import {ExternalLink} from 'lucide-react';
import engine from '../data/engine.json';
import sources from '../data/sources.json';
export function Badge({status,user}){return <><span className={'badge '+status}><i/>{engine.status[status].name}</span>{user&&<span className="badge user-badge">用户注入·未核实</span>}</>}
const host=u=>{try{return new URL(u).hostname}catch{return ''}};
// Verified nodes reference source ids; injected nodes carry their own (https-only, validated) links.
export function SourceLinks({ids,items}){
 if(items)return <div className="source-links">{items.map((s,i)=><a key={i} href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.title}<em>{host(s.url)}{s.date?' · '+s.date:''}</em><ExternalLink size={11}/></a>)}</div>;
 return <div className="source-links">{(ids||[]).map(id=>{const s=sources.find(x=>x.id===id);return s&&<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.title}<ExternalLink size={11}/></a>})}</div>;
}
