import {test,expect} from '@playwright/test';
const views=[['world',null],['mideast','中东 / 红海'],['eastasia','东亚 / 印太']];
async function labels(page){return page.evaluate(()=>[...document.querySelectorAll('.map-text')].map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent,x:r.x,y:r.y,w:r.width,h:r.height,pe:getComputedStyle(e).pointerEvents}}));}
function overlaps(ls){const o=[];for(let i=0;i<ls.length;i++)for(let j=i+1;j<ls.length;j++){const a=ls[i],b=ls[j];if(a.x<b.x+b.w-1&&a.x+a.w-1>b.x&&a.y<b.y+b.h-1&&a.y+a.h-1>b.y)o.push(a.t+'/'+b.t)}return o;}
for(const [device,vp] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
 test(`country labels ${device}`,async({page})=>{await page.setViewportSize(vp);const ext=[];page.on('request',r=>{const h=new URL(r.url()).hostname;if(!['127.0.0.1','localhost','grot666.github.io'].includes(h))ext.push(r.url())});await page.goto('./');await expect(page.locator('.leaflet-fallback-land-pane path')).not.toHaveCount(0);
  const counts={};
  for(const [name,btn] of views){if(btn){await page.getByRole('button',{name:btn,exact:true}).click();await page.waitForTimeout(1700);}else await page.waitForTimeout(600);
   await page.locator('.map-wrap').screenshot({path:`test-results/labels-${device}-${name}.png`});const ls=await labels(page);counts[name]=ls.length;expect(overlaps(ls),name).toEqual([]);expect(ls.every(l=>l.pe==='none')).toBeTruthy();
   const t=new Set(ls.map(l=>l.t));
   if(name==='world'){for(const n of (device==='desktop'?['中国','美国','俄罗斯','巴西','印度']:['中国','美国','俄罗斯']))expect(t.has(n),n).toBeTruthy();}
   if(name==='mideast'){for(const n of ['伊朗','以色列','沙特阿拉伯','伊拉克'])expect(t.has(n),n).toBeTruthy();expect([...t].some(n=>/海峡|红海|波斯湾/.test(n))).toBeTruthy();}
   if(name==='eastasia'){for(const n of (device==='desktop'?['中国','朝鲜','韩国','日本','台湾']:['朝鲜','韩国','台湾']))expect(t.has(n),n).toBeTruthy();}}
  expect(counts.mideast).toBeGreaterThanOrEqual(8);expect(ext).toEqual([]);
  // markers stay clickable under labels
  await page.locator('.gravity-marker.latent').first().click();await expect(page.getByRole('dialog')).toBeVisible();
 });
}
