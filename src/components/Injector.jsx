import React,{useState} from 'react';
import {X,Copy,FileJson,Trash2,ShieldCheck,AlertTriangle} from 'lucide-react';
import {parseInjection,EXAMPLE,PROMPT,LIMITS} from '../injector';
export default function Injector({onClose,userNodes,setUserNodes,reserved,includeUser,setIncludeUser}){
 const [text,setText]=useState(''),[errors,setErrors]=useState([]),[msg,setMsg]=useState('');
 const copy=async()=>{try{await navigator.clipboard.writeText(PROMPT);setMsg('提示词已复制到剪贴板。');}catch{setText(PROMPT);setMsg('无法访问剪贴板，已将提示词放入文本框，请手动复制。');}};
 const inject=()=>{const r=parseInjection(text,userNodes,reserved);if(!r.ok){setErrors(r.errors);setMsg('');return;}setErrors([]);setUserNodes(r.nodes);setMsg(`已注入 ${r.added} 个节点（仅保存在本浏览器）。`);setText('');};
 return <div className="modal-backdrop" onClick={onClose}><section className="modal injector" role="dialog" aria-modal="true" aria-labelledby="inj-title" onClick={e=>e.stopPropagation()}>
  <div className="drawer-top"><span>AI INTEL EXTENSION / 本地情报扩展</span><button aria-label="关闭" onClick={onClose}><X size={20}/></button></div>
  <h2 id="inj-title">AI 情报扩展</h2>
  <p>把外部 AI 或你自己整理的 JSON 粘贴进来，在本浏览器中作为<strong>“用户注入·未核实”</strong>节点显示。本页不调用任何 AI 或网络接口，不执行粘贴的代码，所有文本按纯文本显示。</p>
  <div className="injector-safety"><ShieldCheck size={15}/><span>严格校验：仅允许规定字段；坐标、0–100 整数评分、日期、https 来源链接、长度均有上限（≤{LIMITS.chars} 字符、本地最多 {LIMITS.nodes} 个节点）；不能覆盖已核实节点。</span></div>
  <div className="modal-buttons"><button onClick={copy}><Copy size={13}/> 复制提示词</button><button onClick={()=>{setText(JSON.stringify([EXAMPLE],null,2));setErrors([]);setMsg('已载入示例（演示格式，非事实情报）。');}}><FileJson size={13}/> 载入示例</button></div>
  <label className="inj-label" htmlFor="inj-text">粘贴 JSON（对象或数组）</label>
  <textarea id="inj-text" value={text} onChange={e=>setText(e.target.value)} spellCheck={false} placeholder='[{"id":"arctic-route", ...}]' rows={10} maxLength={LIMITS.chars+1}/>
  {errors.length>0&&<div className="inj-errors" role="alert"><AlertTriangle size={14}/><ul>{errors.map((e,i)=><li key={i}>{e}</li>)}</ul></div>}
  {msg&&<p className="inj-msg" role="status">{msg}</p>}
  <div className="modal-buttons"><button className="primary" onClick={inject}>校验并注入</button>
   <button onClick={()=>{setUserNodes([]);setMsg('已清除全部注入节点。');}} disabled={!userNodes.length}><Trash2 size={13}/> 清除全部注入</button></div>
  <label className="inj-check"><input type="checkbox" checked={includeUser} onChange={e=>setIncludeUser(e.target.checked)}/> 让注入节点参与 Top 5 与摘要排名（默认关闭）</label>
  {userNodes.length>0&&<><h3>本机已注入（{userNodes.length}）</h3><ul className="inj-list">{userNodes.map(n=><li key={n.id}><span>{n.name}</span><small>{n.asOf}</small><button aria-label={'移除 '+n.name} onClick={()=>setUserNodes(userNodes.filter(x=>x.id!==n.id))}><X size={12}/></button></li>)}</ul></>}
  <p className="small-disclaimer">注入数据只存在于本浏览器的 localStorage，不会上传；清除浏览器数据或点击“清除全部注入”即删除。外部 AI 可能编造事实与链接，请逐条核对来源。</p>
 </section></div>;
}
