import {test,expect} from '@playwright/test';
// Screen point on a line's hit path at fraction f, pushed `off` px along the normal (i.e. beside the thin visible line).
async function besideLine(page,id,f=.5,off=8){return page.evaluate(([id,f,off])=>{const e=document.querySelector(`path.hit-${id}`);if(!e)return null;const L=e.getTotalLength(),m=e.getScreenCTM();const sc=q=>({x:q.x*m.a+q.y*m.c+m.e,y:q.x*m.b+q.y*m.d+m.f});const a=sc(e.getPointAtLength(L*f-2)),b=sc(e.getPointAtLength(L*f+2)),p=sc(e.getPointAtLength(L*f));const dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;return {x:p.x-dy/n*off,y:p.y+dx/n*off};},[id,f,off]);}
async function openMap(page){await page.goto('./');await expect(page.locator('.leaflet-fallback-land-pane path')).not.toHaveCount(0);await page.locator('.map-panel').scrollIntoViewIfNeeded();await page.waitForTimeout(400);}
test.describe('desktop line hover',()=>{test.use({viewport:{width:1440,height:1000}});
 test('hovering ~8px beside every line type shows its quick card; click pins; markers stay on top; panning works',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));await openMap(page);
  await page.getByRole('button',{name:'全球运输航线 能源 · 贸易 · 替代路线'}).click();await page.getByRole('button',{name:'大国与安全网络 精选同盟 · 伙伴关系'}).click();await page.waitForTimeout(300);
  const cases=[['c-cor-chips',.5,'台湾先进晶圆'],['c-cor-lithium',.55,'南美锂资源'],['r-cape',.45,null],['t-andes',.8,'安第斯'],['a-0',.4,null]];
  for(const [id,f,name] of cases){const exists=await page.locator(`path.hit-${id}`).count();if(!exists){const ids=await page.locator('path.line-hit').evaluateAll(es=>es.map(e=>[...e.classList].find(c=>c.startsWith('hit-'))));throw Error('missing '+id+' have '+ids.join(','));}
   const pt=await besideLine(page,id,f,8);await page.mouse.move(2,2);await expect(page.locator('.leaflet-tooltip.line-tooltip')).toHaveCount(0);await page.mouse.move(pt.x,pt.y);const tip=page.locator('.leaflet-tooltip.line-tooltip');await expect(tip,id).toBeVisible();if(name)await expect(tip).toContainText(name);await expect(page.locator('.line-vis.is-hot').first()).toBeVisible();}
  // 16px away from a thin line is outside the 18px hit corridor.
  const far=await besideLine(page,'c-cor-chips',.5,16);await page.mouse.move(far.x,far.y);await expect(page.locator('.leaflet-tooltip.line-tooltip')).toHaveCount(0);
  const pt=await besideLine(page,'c-cor-chips',.5,8);await page.mouse.move(pt.x,pt.y);await page.waitForTimeout(150);await page.locator('.map-wrap').screenshot({path:'test-results/line-hover.png'});
  await page.mouse.click(pt.x,pt.y);await expect(page.locator('.line-card')).toContainText('SIA/BCG');await page.getByRole('button',{name:'关闭线路说明'}).click();await expect(page.locator('.line-card')).toHaveCount(0);
  // Red Sea corridor passes right by the Red Sea marker: the marker must still win.
  await page.locator('.gravity-marker.crisis[title="红海与曼德海峡"]').click();await expect(page.getByRole('dialog')).toContainText('红海');await page.getByRole('button',{name:'关闭分析'}).click();
  // Dragging that starts on a line still pans the map.
  const before=await page.locator('path.hit-c-cor-chips').boundingBox();const s=await besideLine(page,'c-cor-lithium',.5,4);await page.mouse.move(s.x,s.y);await page.mouse.down();await page.mouse.move(s.x+120,s.y+40,{steps:8});await page.mouse.up();const after=await page.locator('path.hit-c-cor-chips').boundingBox();expect(Math.abs(after.x-before.x)).toBeGreaterThan(60);
  expect(errors).toEqual([]);});
 test('faction projection arcs are hoverable and overlap list resolves; keyboard index pins lines',async({page})=>{await openMap(page);await page.locator('.faction-card',{hasText:'传统安全鹰派'}).click();await page.mouse.move(2,2);
  const id=await page.locator('path.line-hit[class*="hit-p-us-hawks-taiwan"]').first().evaluate(e=>[...e.classList].find(c=>c.startsWith('hit-')).slice(4));const pt=await besideLine(page,id,.35,7);await page.mouse.move(pt.x,pt.y);await expect(page.locator('.leaflet-tooltip.line-tooltip')).toContainText('派系投射');
  // Near the shared origin several arcs overlap: click lists them all.
  const o=await besideLine(page,id,.04,2);await page.mouse.click(o.x,o.y);await expect(page.locator('.line-overlaps button')).not.toHaveCount(0);expect(await page.locator('.line-overlaps button').count()).toBeGreaterThanOrEqual(2);await page.locator('.line-overlaps button').nth(1).click();await expect(page.locator('.line-overlaps button').nth(1)).toHaveAttribute('aria-pressed','true');await page.keyboard.press('Escape');await expect(page.locator('.line-card')).toHaveCount(0);
  await page.getByRole('button',{name:'重置投射'}).click();
  await page.locator('.line-index summary').click();const btn=page.locator('.line-index button',{hasText:'红海—苏伊士'});await btn.focus();await page.keyboard.press('Enter');await expect(page.locator('.line-card')).toContainText('曼德海峡');await expect(btn).toHaveAttribute('aria-pressed','true');await expect(page.locator('.line-vis.is-hot').first()).toBeVisible();});
});
test.describe('mobile tap',()=>{test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 test('tapping ~10px beside a line opens the pinned card; markers still tappable',async({page})=>{await openMap(page);await page.getByRole('button',{name:'中东双海峡',exact:true}).click();await page.waitForTimeout(1600);
  const pt=await besideLine(page,'c-cor-redsea',.3,10);await page.touchscreen.tap(pt.x,pt.y);await expect(page.locator('.line-card')).toContainText('红海—苏伊士');await page.screenshot({path:'test-results/line-tap-mobile.png'});
  await page.getByRole('button',{name:'关闭线路说明'}).click();await page.locator('.gravity-marker.crisis[title="红海与曼德海峡"]').tap();await expect(page.getByRole('dialog')).toContainText('红海');});
});
