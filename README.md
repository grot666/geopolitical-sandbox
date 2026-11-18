# 经纬 GRAVITY · 全球地缘决策沙盘

纯前端中文研究应用，React 19 + Tailwind CSS 4 + Leaflet + Vite。无后台、无 API 密钥、无用户数据上传。

- 在线：https://grot666.github.io/geopolitical-sandbox/
- 源码：https://github.com/grot666/geopolitical-sandbox

## 本地运行

使用 Node.js 22.12+（已在 Node 24 测试）。

```sh
npm ci
npm run dev
# 打开 http://localhost:5173/geopolitical-sandbox/
npm test
npm run build
npm run preview
```

可选无头交互测试：`npx playwright install chromium` 后 `npm run test:e2e`。配置优先使用 `CHROME_PATH` 指定的 Chrome；否则使用 Playwright 下载的 Chromium。截图保存在 `test-results/`，不提交仓库。

## 功能

- 自动 Top 5、紧迫度 / 结构影响双权重、四维自定义权重实验。
- 地图点位尺寸与置顶顺序随得分变化；现行危机红色脉冲、潜伏点琥珀静态光环、资源通道青绿色。
- 全球与区域 FlyTo、地形晕渲与海峡、战略资源、精选同盟网络、贸易路径开关。
- 所有主焦点、资源、海峡均可点击，查看四维依据与 What / Geography / Resources / Politics 四段分析。
- 美国行政/两院/党内路线/产业及外交倡议组织，欧盟机构/成员国分歧/英国/土耳其制度面板。
- 观察清单检索、状态筛选、研究 JSON 导出、来源档案、移动端布局、键盘关闭与焦点约束、减少动画偏好。
- 地图瓦片失败时显示提示，并保留本地 Natural Earth 轮廓、研究点位和全部分析数据。首次打开网页本身仍需要网络；不是完整 PWA 离线缓存。

## 架构与数据维护

```
src/main.jsx           界面、地图交互和展示组件
src/engine.js          纯函数评分 / 排序 / 尺寸
src/style.css          Tailwind 入口与响应式视觉系统
src/data/engine.json   维度、权重、锚点、状态与免责声明
src/data/events.json   9 个主焦点（独立评分与分析）
src/data/regions.json  区域视角
src/data/resources.json 战略资源点（继承关联地区评分，非单设施风险）
src/data/chokepoints.json 海峡/运河点（继承关联地区评分）
src/data/routes.json   航线示意
src/data/alliances.json 精选首都关系网络，非完整成员名册
src/data/politics.json 美欧机构与派系分析
src/data/sources.json  日期、URL、核验方式、证据摘要
public/world.geojson  本地公共领域底图轮廓
scripts/engine.test.js 评分与数据验证测试
tests/app.spec.js     桌面 / 移动 / 瓦片失败交互测试
```

数据与组件分离；新增节点只需修改 JSON。每次修改数据，更新 `asOf`（资料事实截止日期）、`retrievedAt`（检索日期）、`sources`、`confidence`、逐维 `rationale` 及分析段落，再运行测试。不要仅更新检索日期就声称事实已更新。派系和资源点也是分析简化，应保留争议与信心说明。

## 评分与认识论

`G = round(Σ(score_i × weight_i) / Σ(weight_i), 1)`，各维 0–100。全零和非法权重拒绝；同分稳定按 ID 排列。

| 模式 | 烈度 | 系统外溢 | 大国/核升级 | 地理杠杆 |
|---|---:|---:|---:|---:|
| 紧迫度 | 45 | 25 | 20 | 10 |
| 结构影响 | 10 | 40 | 25 | 25 |

尺寸 `12 + G × 0.25` 像素；置顶 `round(G × 10)`。原始评分、权重与状态互相独立：改变权重不改变事实、状态或四维评分。资源和咽喉详情明确提示其继承关联地区评分，不应误解为单个厂区的安全评估。

“Objective”指公开规则与可复算，不表示没有价值判断。四维分数、证据信心、因果链均为分析师估计，不能当作实测物理量、战争概率、道德排名、投资建议或政策效果预测。缺乏同口径数据时，系统外溢依据定性锚点，不伪造全球份额。维度存在相关性，不能用小数精度暗示统计精度。

## 事实基线与来源

检索：**2026-11-18 Asia/Singapore（SGT）**，不是实时新闻服务。

- 美以伊：Reuters 2026-11-17 报道持续战争僵局、美国暂停新一轮轰炸及海上封锁；**“现行危机”不等于此刻持续空袭**。
- 俄乌：UN News 2026-11-17 交火与能源设施受损报告。
- 油流与航道：EIA 2026-11-16，2026Q3 数据；霍尔木兹 9.1、曼德 6.3、马六甲 19.4 百万桶/日。AIS 不完整，估计会修订；不是所有贸易量。
- 台海：Reuters 2026-11-10 军演报道，同时保留两方表述；不标成全面热战。
- 半岛：Reuters 2026-11-02 军演与核威慑报道。
- 拉美：USGS 2026 年度摘要及官方锂矿 PDF，主要为 2025 年统计估计。储量、资源量、产量、精炼产能不能互换。
- 制度参考：美国国会研究处、欧盟理事会、北约官网。国会与理事会部分页面正文抓取超时，明确标为官方检索摘要而非声称逐字核验；制度分析不预测选举、议席或实际投票。

完整链接与核验方式在 `sources.json` 和应用“来源档案”。部分来源会滚动更新，请以节点 `asOf` 为准。未验证每日具体袭击、战线与部署；地图不展示实时作战数据。

## 地图与许可

瓦片 © OpenStreetMap contributors / CARTO；地形晕渲 Esri / USGS，无密钥公共图层，受第三方可用性、条款和速率限制。提供商不可达不影响本地研究数据；不是为高并发瓦片抓取设计。

本地轮廓来自 [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/)（公共领域），下载自 nvkelso/natural-earth-vector 的 ne_110m_admin_0_countries.geojson。轮廓仅为低分辨率研究参照；边界、点位、首都连接与航线不构成主权主张、势力范围、基地位置、当前部署或法律承诺。欧盟机构点位不表示欧盟整体是北约成员；图中相应关系仅表示跨大西洋成员合作。

应用原创代码采用 MIT；第三方统计、报道与地图版权归各权利人，链接不代表背书。

## GitHub Pages 部署

Vite `base` 为 `/geopolitical-sandbox/`。工作流每次推送 main 自动安装依赖、执行单元/数据测试、构建、上传 Pages artifact 并部署；无需单独 gh-pages 分支。

由已获授权的 GitHub CLI 首次配置：

```sh
gh repo create grot666/geopolitical-sandbox --public --source=. --remote=origin
# 创建站点（若已存在不重复执行）
gh api --method POST repos/grot666/geopolitical-sandbox/pages -f build_type=workflow
git push -u origin main
gh run list --repo grot666/geopolitical-sandbox
```

在 GitHub 设置中 Pages 来源应为 **GitHub Actions**。修改仓库名需同步 `vite.config.js` 的 base。静态根路由不使用 History Router，刷新无需服务端路由规则。官方依据：[Custom workflows with Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 安全检查

构建时 `npm audit --omit=dev` 为 0 漏洞（检索时）。完整审计报告存在 picomatch/tinyglobby/Vite 开发依赖 ReDoS 警告，注册表当时没有安全 picomatch 新版可用；未使用 `--force` 降级或隐藏告警。部署仅为已构建静态文件，无 Vite 开发服务、无任意 glob 输入、无后台。维护时应跟踪依赖修复；不要将开发服务暴露为生产服务。
