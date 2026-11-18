import React,{useEffect,useMemo,useRef,useState} from 'react';
import {MapContainer,Marker,Polyline,Tooltip,GeoJSON,Pane,CircleMarker,TileLayer,useMap,useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import resources from '../data/resources.json';import chokepoints from '../data/chokepoints.json';import routes from '../data/routes.json';import alliances from '../data/alliances.json';import terrain from '../data/terrain.json';import mapLabels from '../data/mapLabels.json';import corridors from '../data/corridors.json';import watermarks from '../data/watermarks.json';
import {orderLabels,placeLabels,labelStyle,charWidth} from '../labels';
export const corridorPills=corridors.map(c=>({id:c.id,label:c.label,color:c.color,position:c.positions[Math.floor(c.positions.length/2)]}));
import {score,markerSize} from '../engine';
import {linesNear,GROUPS} from '../lines';
import sources from '../data/sources.json';
const NONE=[];
const graticule=[...[-60,-30,0,30,60].map(lat=>Array.from({length:37},(_,i)=>[lat,-180+i*10])),...Array.from({length:13},(_,i)=>-180+i*30).map(lon=>Array.from({length:17},(_,i)=>[-80+i*10,lon]))];
const _unusedTerrainStyle={mountain:{color:'#c4a676',weight:2,opacity:.8,dashArray:'6 4',lineCap:'butt'},plain:{color:'#7fa37a',weight:7,opacity:.22,lineCap:'round'},sea:{color:'#5fb2d1',weight:2,opacity:.7,dashArray:'8 6'},line:{color:'#e2876f',weight:2.5,opacity:.85,dashArray:'4 4'}};
const resourceLabels={oil:'油',gas:'气',chips:'芯',minerals:'矿',grain:'粮',fertilizer:'肥'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const OSM={url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',host:'tile.openstreetmap.org'};
// Gentle arc between two points (lat/lon space) so overlapping projections stay readable.
export {arc} from '../lines';
function Fly({target}){const map=useMap();useEffect(()=>{if(!target||target.id==='world'){map.fitBounds([[-56,-170],[74,180]],{padding:[12,30],maxZoom:2,animate:!!target});}else if(target.bounds)map.flyToBounds(target.bounds,{padding:[16,16],duration:1.2,maxZoom:target.maxZoom||5});else map.flyTo(target.center,target.zoom,{duration:1.2});},[target,map]);return null;}
function LabelLayer({markers,pills=[],bilingual,showWatermarks,layoutKey}){const map=useMap();useEffect(()=>{if(!map.getPane('labels')){const pane=map.createPane('labels');pane.style.zIndex=450;pane.style.pointerEvents='none';}
 const group=L.layerGroup().addTo(map);let frame;
 const draw=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{group.clearLayers();const z=map.getZoom(),size=map.getSize();const proj=ll=>map.latLngToContainerPoint(ll);
  const c=map.getContainer(),cr=c.getBoundingClientRect();const reserved=[...c.parentElement.querySelectorAll('.map-label,.map-legend,.terrain-legend,.resource-legend,.map-attribution,.tile-warning,.leaflet-control-zoom')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x-cr.x-4,y:r.y-cr.y-4,w:r.width+8,h:r.height+8}}).filter(b=>b.w>8);
  const placed=placeLabels(orderLabels(mapLabels.countries,mapLabels.geo,z,showWatermarks?watermarks:[]),proj,size,[...markers.map(m=>({...proj(m.position),r:m.r*(z<1.25?.68:1),top:12,right:14})),...(z>=PILL_ZOOM?pills:[]).map(q=>({...proj(q.position),w:charWidth(q.label,9)+18,h:18}))],3,reserved,bilingual);
  c.dataset.labelCount=placed.length;c.dataset.zoomBand=z<1.25?'low':z<3?'wide':'normal';c.dataset.watermarks=placed.filter(p=>p.kind==='watermark').length;c.dataset.bilingual=placed.filter(p=>p.sub&&p.kind==='country').length;
  for(const it of placed){const st=labelStyle(it);const sub=it.sub?`<small>${esc(it.sub)}</small>`:'';const el=`<span class="${st.cls}${it.sub?' has-sub':''}" style="font-size:${st.fs}px;letter-spacing:${st.ls}px;transform:translate(calc(-50% + ${it.dx}px),calc(-50% + ${it.dy}px))" data-label="${esc(it.name)}"${it.disputed?` title="${esc(it.disputed)}"`:''}>${esc(it.name)}${sub}</span>`;
   L.marker(it.position,{pane:'labels',interactive:false,keyboard:false,icon:L.divIcon({className:'label-anchor',html:el,iconSize:[0,0]})}).addTo(group);}
 });};
 draw();map.on('zoomend moveend resize',draw);return()=>{cancelAnimationFrame(frame);map.off('zoomend moveend resize',draw);group.remove();};},[map,markers,pills,bilingual,showWatermarks,layoutKey]);return null;}
const PILL_ZOOM=1.5;
function CorridorPills(){const map=useMap();const [z,setZ]=useState(map.getZoom());useEffect(()=>{const f=()=>setZ(map.getZoom());map.on('zoomend',f);return()=>map.off('zoomend',f)},[map]);
 if(z<PILL_ZOOM)return null;return corridorPills.map(c=><Marker key={c.id+'l'} position={c.position} interactive={false} keyboard={false} icon={L.divIcon({className:'corridor-anchor',iconSize:[0,0],html:`<span class="corridor-pill" style="--c:${c.color}">${esc(c.label)}</span>`})}/>);}
export const COARSE=typeof window!=='undefined'&&!!window.matchMedia?.('(pointer: coarse)').matches;
const srcName=id=>sources.find(s=>s.id===id)?.title||id;
export function LineCard({line}){return <div className="line-quick"><b style={{color:line.color}}>{line.name}</b><small>{GROUPS[line.group].name} · {line.type}</small><p>{line.carries}</p>{line.why&&<p className="why">{line.why}</p>}<small>{line.sources.length?line.sources.map(srcName).join('；')+' · ':''}{line.asOf}</small><small className="note">{line.note}</small></div>;}
// Each visible thin line gets a transparent wide twin in a pane above lines but below node hit areas and markers.
function LineLayer({lines,hot,setHot,pick}){
 const map=useMap();useMapEvents({click:()=>pick(null)});
 const W=COARSE?26:18;
 return <>{lines.map(l=>{const on=hot===l.id||(Array.isArray(hot)&&hot.includes(l.id));const s=l.style;
   return <React.Fragment key={l.id}>
    {on&&l.paths.map((p,j)=><Polyline key={'g'+j} positions={p} interactive={false} pathOptions={{color:l.color,weight:(s.weight||2)+9,opacity:.28,lineCap:'round',dashArray:null}}/>)}
    {l.paths.map((p,j)=><Polyline key={'v'+j+(on?'h':'')} className={'line-vis line-'+l.group+(on?' is-hot':'')} positions={p} interactive={false} pathOptions={on?{...s,weight:(s.weight||2)+2,opacity:1}:s}/>)}
   </React.Fragment>;})}
  <Pane name="line-hits" style={{zIndex:420}}>{lines.map(l=>l.paths.map((p,j)=><Polyline key={l.id+'h'+j} pane="line-hits" className={'line-hit hit-'+l.id} positions={p} bubblingMouseEvents={false} pathOptions={{color:'#000',opacity:0,weight:W,lineCap:'round',lineJoin:'round'}}
    eventHandlers={{mouseover:()=>setHot(l.id),mouseout:()=>setHot(null),click:e=>{const near=linesNear(e.containerPoint,lines,ll=>map.latLngToContainerPoint(ll),W/2+2);pick(near.length?near.map(x=>x.id):[l.id]);}}}>
    {!COARSE&&<Tooltip pane="tooltipPane" sticky direction="auto" offset={[14,0]} opacity={1} className="line-tooltip"><LineCard line={l}/><small className="hint">点击固定 · 可查看重叠线路</small></Tooltip>}</Polyline>))}</Pane>
 </>;
}
function Resize({k}){const map=useMap();useEffect(()=>{const t=setTimeout(()=>map.invalidateSize(),60);return()=>clearTimeout(t)},[k,map]);return null;}
// Screen-space placement of stance pills so pills for nearby targets do not cover each other.
export function placePills(items,gap=4){const out=[];for(const it of items){const cands=[-it.h-14,14,-2*it.h-20,it.h+20,-3*it.h-26,2*it.h+26];let best=null;
 for(const dy of cands){const b={x:it.x-it.w/2,y:it.y+dy,w:it.w,h:it.h};const ov=out.reduce((a,o)=>a+Math.max(0,Math.min(b.x+b.w,o.b.x+o.b.w)-Math.max(b.x,o.b.x)+gap)*Math.max(0,Math.min(b.y+b.h,o.b.y+o.b.h)-Math.max(b.y,o.b.y)+gap),0);if(!best||ov<best.ov)best={dy,b,ov};if(!ov)break;}
 out.push({...it,dy:best.dy,b:best.b});}return out;}
function Projection({faction,nodes}){
 const map=useMap();const [,tick]=useState(0);useEffect(()=>{const f=()=>tick(x=>x+1);map.on('zoomend moveend',f);return()=>map.off('zoomend moveend',f)},[map]);
 if(!faction)return null;const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));const compact=map.getSize().x<560;
 const pills=placePills(faction.projections.filter(p=>byId[p.target]).map(p=>{const t=byId[p.target],pt=map.latLngToContainerPoint(t.position);return {p,t,x:pt.x,y:pt.y,w:compact?charWidth(t.name,10)+20:Math.min(240,charWidth(t.name,10)+charWidth(p.stance,10)+24),h:22};}));
 return <>
 {faction.origins.map((o,j)=><CircleMarker key={'o'+j} center={o} radius={6} interactive={false} pathOptions={{color:faction.color,fillColor:faction.color,fillOpacity:.9,weight:2}}/>)}
 {pills.map(({p,t,dy})=><Marker key={'pill'+p.target+dy} position={t.position} interactive={false} keyboard={false} zIndexOffset={5000} icon={L.divIcon({className:'stance-anchor',iconSize:[0,0],html:`<span class="stance-pill" style="--c:${faction.color};transform:translate(-50%,${dy}px)"><b>${esc(t.name)}</b>${compact?'':esc(p.stance)}</span>`})}/>)}</>;
}
export default function MapView({nodes,weights,selected,choose,target,layers,display,basemap,onBasemapError,land,setHover,faction,layoutKey,lines=[],lineHot,setLineHot,pickLines,children}){
 const errors=useRef(0);useEffect(()=>{errors.current=0},[basemap]);
 const markerPoints=useMemo(()=>nodes.map(e=>({position:e.position,r:Math.max(13,markerSize(score(e.scores,weights))/2+3)})),[nodes,weights]);
 const targets=new Set(faction?faction.projections.map(p=>p.target):[]);
 const osm=basemap==='osm';
 return <MapContainer attributionControl={false} center={[22,25]} zoom={2} minZoom={0} zoomSnap={0.25} maxZoom={9} scrollWheelZoom={true} worldCopyJump={false} maxBounds={[[-80,-200],[85,200]]} zoomControl={true}>
  <Fly target={target}/><Resize k={layoutKey}/>
  <LabelLayer markers={markerPoints} pills={layers.corridors?corridorPills:NONE} bilingual={display.bilingual} showWatermarks={display.watermarks} layoutKey={layoutKey}/>
  {osm&&<TileLayer url={OSM.url} className="osm-tiles" maxNativeZoom={19} eventHandlers={{tileerror:()=>{errors.current++;if(errors.current>=4)onBasemapError();}}}/>}
  {land&&<Pane name="fallback-land" style={{zIndex:150}}><GeoJSON key={basemap} pane="fallback-land" data={land} interactive={false} style={{color:osm?'#6f8ea3':'#3b5568',weight:osm?.6:.8,fillColor:'#17262f',fillOpacity:osm?0:1}}/></Pane>}
  {!osm&&graticule.map((g,i)=><Polyline key={'g'+i} positions={g} interactive={false} pathOptions={{color:'#1d3344',weight:.6,opacity:.7}}/>)}
  {layers.corridors&&<CorridorPills/>}
  {layers.alliances&&alliances.nodes.map(n=><Marker key={n.id} position={n.position} icon={L.divIcon({className:'power-marker',html:'<span>◆</span>',iconSize:[20,20]})}><Tooltip>{n.name} · 首都示意点</Tooltip></Marker>)}
  {layers.terrain&&chokepoints.map(n=><Marker key={n.id} position={n.position} icon={L.divIcon({className:'choke-marker',html:'<span>⌁</span>',iconSize:[22,22]})} eventHandlers={{click:()=>choose(n)}}><Tooltip>{n.name} · 地理咽喉</Tooltip></Marker>)}
  {layers.resources&&resources.map(n=><Marker key={n.id} position={n.position} zIndexOffset={1000} icon={L.divIcon({className:'resource-marker',html:`<span>${resourceLabels[n.category]}</span>`,iconSize:[25,25]})} eventHandlers={{click:()=>choose(n)}}><Tooltip>{n.name}</Tooltip></Marker>)}
  <LineLayer lines={lines} hot={lineHot} setHot={setLineHot} pick={pickLines}/>
  <Projection faction={faction} nodes={nodes}/>
  {/* Large invisible sensing radius: easier hover/tap than the small visual dot. */}
  <Pane name="node-hits" style={{zIndex:430}}>{nodes.map(n=><CircleMarker key={'hit'+n.id} pane="node-hits" bubblingMouseEvents={false} className="hit-area" center={n.position} radius={Math.min(26,markerSize(score(n.scores,weights))/2+10)} pathOptions={{stroke:false,fillColor:'#fff',fillOpacity:0}} eventHandlers={{mouseover:()=>setHover(n),mouseout:()=>setHover(null),click:()=>choose(n)}}/>)}</Pane>
  {nodes.map(n=>{const val=score(n.scores,weights),size=markerSize(val);const cls='gravity-marker '+n.status+(val<50?' minor':'')+(n.user?' user':'')+(selected?.id===n.id?' is-selected':'')+(targets.has(n.id)?' is-projected':'')+(faction&&!targets.has(n.id)?' is-dimmed':'');
   return <Marker key={n.id} position={n.position} title={n.name+(n.user?'（用户注入·未核实）':'')} alt={n.name} zIndexOffset={Math.round(val*10)} icon={L.divIcon({className:cls,html:`<span style="--size:${size}px"><i></i><b>${Math.round(val)}</b></span>`,iconSize:[size,size],iconAnchor:[size/2,size/2]})} eventHandlers={{click:()=>choose(n),mouseover:()=>setHover(n),mouseout:()=>setHover(null)}}/>})}
  {children}
 </MapContainer>;
}
