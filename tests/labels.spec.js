import {test,expect} from '@playwright/test';
const views=[['world',null],['mideast','中东双海峡'],['eastasia','第一岛链 / 台海'],['europe','东欧大平原'],['balkans','巴尔干'],['africa','非洲 · 萨赫勒与之角'],['southamerica','南美']];
async function labels(page){return page.evaluate(()=>[...document.querySelectorAll('.map-text')].map(e=>{const r=e.getBoundingClientRect();return {t:e.dataset.label,sub:e.querySelector('small')?.textContent||'',x:r.x,y:r.y,w:r.width,h:r.height,pe:getComputedStyle(e).pointerEvents}}));}
function overlaps(ls){const o=[];for(let i=0;i<ls.length;i++)for(let j=i+1;j<ls.length;j++){const a=ls[i],b=ls[j];if(a.x<b.x+b.w-1&&a.x+a.w-1>b.x&&a.y<b.y+b.h-1&&a.y+a.h-1>b.y)o.push(a.t+'/'+b.t)}return o;}
for(const [device,vp] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
 test(`country labels ${device}`,async({page})=>{await page.setViewportSize(vp);const ext=[];page.on('request',r=>{const h=new URL(r.url()).hostname;if(!['127.0.0.1','localhost','grot666.github.io'].includes(h))ext.push(r.url())});await page.goto('./');await expect(page.locator('.leaflet-fallback-land-pane path')).not.toHaveCount(0);
  const counts={};
  for(const [name,btn] of views){if(btn){await page.getByRole('button',{name:btn,exact:true}).click();await page.waitForTimeout(1700);}else await page.waitForTimeout(600);
   await page.locator('.map-wrap').screenshot({path:`test-results/labels-${device}-${name}.png`});const ls=await labels(page);counts[name]=ls.length;expect(overlaps(ls),name).toEqual([]);expect(ls.every(l=>l.pe==='none')).toBeTruthy();
   const t=new Set(ls.map(l=>l.t));
   if(name==='world'){expect(ls.find(l=>l.t==='中国').sub).toBe('China');for(const n of (device==='desktop'?['中国','美国','俄罗斯','巴西','印度']:['中国','美国','俄罗斯']))expect(t.has(n),n).toBeTruthy();}
   if(name==='mideast'){for(const n of ['伊朗','以色列','沙特阿拉伯','伊拉克'])expect(t.has(n),n).toBeTruthy();expect([...t].some(n=>/海峡|红海|波斯湾/.test(n))).toBeTruthy();}
   if(name==='europe'){for(const n of ['乌克兰','波兰'])expect(t.has(n),n).toBeTruthy();if(device==='desktop')expect(t.has('东欧大平原')).toBeTruthy();}
   if(name==='balkans'){for(const n of ['塞尔维亚','科索沃'])expect(t.has(n),n).toBeTruthy();}
   if(name==='africa'){for(const n of (device==='desktop'?['苏丹','马里','埃塞俄比亚','尼日利亚']:['苏丹','马里']))expect(t.has(n),n).toBeTruthy();}
   if(name==='southamerica'){for(const n of (device==='desktop'?['委内瑞拉','哥伦比亚','秘鲁','巴西']:['委内瑞拉','巴西']))expect(t.has(n),n).toBeTruthy();}
   if(name==='eastasia'){for(const n of (device==='desktop'?['中国','朝鲜','韩国','日本','台湾']:['朝鲜','韩国','台湾']))expect(t.has(n),n).toBeTruthy();}}
  expect(counts.mideast).toBeGreaterThanOrEqual(8);expect(ext).toEqual([]);
  // markers stay clickable under labels
  await page.getByRole('button',{name:'全球总览',exact:true}).click();await page.waitForTimeout(1500);await page.locator('.gravity-marker.latent').first().click({force:true});await expect(page.getByRole('dialog')).toBeVisible();
 });
}
