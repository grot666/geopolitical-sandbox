# Builds src/data/verification.json: claim-level verification log + corrections; prunes unreferenced sources.
import json
from pathlib import Path
D=Path(__file__).resolve().parents[2]/'src/data'
ld=lambda n:json.loads((D/f'{n}.json').read_text())
def sv(n,o):(D/f'{n}.json').write_text(json.dumps(o,ensure_ascii=False,indent=1)+'\n')
ev,res,cp,cor,rt,al,ter,fa,lo,pol=[ld(n) for n in ['events','resources','chokepoints','corridors','routes','alliances','terrain','factions','logic','politics']]
CHECK='2026-11-18'
CORR=[
 ('node','libya','“11月的黎波里激战”实为2025年5月旧闻（转载页头部显示当日日期）。改写为东西分治结构性节点，冲突强度35→10，补充11月15日美军非洲司令部会谈、11月16日埃及情报局长会谈。',['libya-observer','lana-egypt','libya-truce']),
 ('node','somalia','巴斯拉激战发生于2026年8月底而非11月；补充11月15日青年党夺取科马德。',['sg-somalia','garowe-somalia']),
 ('node','south-sudan','马沙尔身份改为“前第一副总统”；补充庭审延至11月18日。',['tamazuj-ss']),
 ('node','kosovo','北米特罗维察集会被叫停发生在10月25日塞尔维亚选举前（来源页面日期与内容不一致）；删除“两人受伤”。能源紧急状态（11月16日）保留并核实。',['kosovo-mitrovica','kosovo-energy']),
 ('node','serbia','删除“原执政党看守政府仍在任”与“冲击电视台”等未核实说法；改用选举委员会官方结果140对103席，新议会11月17日成立。AP来源被拦截，已替换。',['rik-serbia','srb-gov-mandates','reuters-serbia-parl']),
 ('node','venezuela','删除“美方协助打击阿普雷州ELN营地/提供无人机与情报”（NYT原文未见）；改为NYT所载6月空袭击毙“阿拉瓜火车”创始人之一等事实。',['nyt-venezuela']),
 ('node','ethiopia-eritrea','“埃方未确认”改为“埃及与厄立特里亚均否认”；补充ACLED所载10月12日扎兰贝萨、11月7日拉马、约11月15日巴德梅；新增半岛电视台10月9日来源。',['acled-badme','aj-ethiopia-oct']),
 ('node','sudan','死亡与流离失所人数标注联合国与半岛电视台口径差异。',['aa-sudan','aj-sudan']),
 ('node','mali-sahel','油罐车数字限定为“11月以来1505辆”（并补充10月约4000辆）；BBC来源日期更正为2026年5月21日；新增RFI基达尔来源。',['apa-mali','bbc-mali','rfi-kidal']),
 ('node','catatumbo','AP来源被拦截，替换为哥伦比亚总统府11月12日公告。',['presidencia-catatumbo']),
 ('node','haiti','“帮派控制首都大部”改为“大片地区”；补充GSF任期延至2027年3月及10月18日伏击事件。',['haiti-brief']),
 ('node','mexico','“暂缓空袭”明确标为转述报道（未打开NYT原文）；补充截至11月未见公开承认的美方对墨领土打击。',['ef-mexico','mexico-iaw']),
 ('node','essequibo','国际法院庭审日期具体为2026年5月4–11日；判决预期改为圭方9月所称“新年初”。',['dpi-guyana']),
 ('terrain','tw-strait','台湾海峡宽度“约130–180公里”改为“最窄处约160公里（Britannica）”。',['britannica-taiwan-strait']),
 ('alliance','us-jp/us-kr/us-au','联盟连线原错误引用台湾新闻来源，改为美国国务院集体防御安排页面。',['state-cda']),
 ('alliance','cn-ru','中俄连线原错误引用台湾新闻来源，改为克里姆林宫2022年联合声明（本轮页面500错误，标为检索摘要）。',['kremlin-cn-ru']),
 ('resource','qatar-gas','卡塔尔LNG节点原误用原油数据，改为EIA LNG数据（2025上半年霍尔木兹LNG约114亿立方英尺/日）。',['eia-chokepoints']),
 ('resource','br-grain','巴西粮食节点原复制矿产文本并引用USGS，改为USDA油籽数据。',['usda-oilseeds']),
 ('resource','black-grain/fertilizer','黑海粮食与化肥原引用EIA，改为联合国安理会通报；化肥保留为定性分析。',['un-sc']),
 ('route','black','黑海粮食航线来源由EIA改为联合国安理会通报。',['un-sc']),
 ('chokepoint','suez','苏伊士节点原复制曼德海峡数字，改为苏伊士+SUMED约710万桶/日。',['eia']),
 ('source','dates','更正来源日期：索马里卫报8月30日、BBC马里5月21日、Anadolu SAFE 2025年9月10日、圭亚那DPI 9月13日等；沙特通讯社空页面改为Jadwa PDF。',['sg-somalia','bbc-mali','aa-safe','dpi-guyana','spa-saudi']),
 ('faction','US/EU','原“鹰派/MAGA/民主党/利益集团”等意识形态分类改为利益联盟模型，每个派系列出利益来源、载体、带日期的指标与来源。',[]),
]
UNVER=[
 dict(item='伊朗战时权力结构中“最高领袖为将领背书”',why='路透原文被拦截，仅检索摘要',sources=['reuters-irgc']),
 dict(item='以色列各党席位',why='Times of Israel页面本轮被拦截，席位数来自检索摘要/早前打开',sources=['toi-israel']),
 dict(item='中俄2022年联合声明',why='克里姆林宫页面返回500',sources=['kremlin-cn-ru']),
 dict(item='欧盟俄气禁令日期',why='理事会与EUR-Lex正文抓取失败，依据官方检索摘要',sources=['consilium-gas']),
 dict(item='SAFE匈牙利54亿欧元',why='Euronews被拦截',sources=['euronews-safe']),
 dict(item='美方“暂缓对墨空袭”',why='NYT原文未打开，经El Financiero转述',sources=['ef-mexico']),
 dict(item='埃塞Debre Werq等前线说法',why='CTP标注为未经证实',sources=['ctp-ethiopia']),
 dict(item='朝鲜半岛节点',why='本轮重新抓取超时，沿用上轮打开的内容',sources=['korea']),
 dict(item='塞尔维亚新议会（路透）与武契奇认输',why='转载页正文需脚本加载；以选举委员会官方结果为准',sources=['reuters-serbia-parl','aj-serbia']),
 dict(item='对台军售“筹码”说法',why='路透转载检索摘要',sources=['reuters-apec']),
 dict(item='海湾/日本出口/伊朗务实派等低信心派系',why='缺少直接的当期指标，主要为结构分析',sources=[]),
]
S={s['id']:s for s in ld('sources')}
def status(srcs):
  v=[S[s].get('verification','') for s in srcs if s in S]
  if any(x.startswith(('本轮打开','本轮下载','本轮读取')) for x in v):return 'verified-opened'
  if any('检索摘要' in x for x in v):return 'verified-snippet'
  if any(x.startswith('书目') for x in v):return 'bibliographic'
  return 'unverified'
corrected={(t,i) for t,i,_,_ in CORR}
claims=[]
def C(cid,target,tid,field,text,typ,srcs,note=''):
  st='analysis' if typ=='analysis' else status(srcs)
  if typ!='analysis' and (target,tid) in corrected:st='corrected'
  claims.append(dict(id=cid,target=target,targetId=tid,field=field,text=text,type=typ,sources=srcs,status=st,checkedAt=CHECK,**({'note':note} if note else {})))
for e in ev:
  C(f'ev-{e["id"]}-what','node',e['id'],'analysis.what',e['analysis']['what'],'fact',e['sources'])
  C(f'ev-{e["id"]}-kinetic','node',e['id'],'rationale.kineticIntensity',e['rationale']['kineticIntensity'],'fact',e['sources'])
  C(f'ev-{e["id"]}-analysis','node',e['id'],'scores/rationale/perspectives','四维评分、地理与资源解读、多方视角','analysis',[])
for kind,arr in [('resource',res),('chokepoint',cp)]:
  for r in arr:
    C(f'{kind}-{r["id"]}-fact',kind,r['id'],'rationale.systemicSpillover',r['rationale']['systemicSpillover'],'fact',r['sources'])
    C(f'{kind}-{r["id"]}-analysis',kind,r['id'],'scores','评分继承关联地区（分析估计）','analysis',[])
for c in cor:C(f'corridor-{c["id"]}','corridor',c['id'],'fact',c['fact'],'fact',c['sources'])
for r in rt:C(f'route-{r["id"]}','route',r['id'],'positions','示意航线：'+r['name'],'analysis',[r['source']],'示意走向，非AIS航迹')
for i,e in enumerate(al['edges']):C(f'alliance-{e["from"]}-{e["to"]}','alliance',f'{e["from"]}-{e["to"]}','label',e['label'],'fact',[e['source']])
for f in ter['features']:
  if f.get('source'):C(f'terrain-{f["id"]}','terrain',f['id'],'note',f['note'],'fact',[f['source']])
  else:C(f'terrain-{f["id"]}','terrain',f['id'],'note',f['note'],'analysis',[],'手工简化示意')
for sy in fa['systems']:
  for f in fa[sy['id']]:
    for j,ind in enumerate(f['indicators']):C(f'faction-{f["id"]}-ind{j}','faction',f['id'],'indicators',f'{ind["label"]}：{ind["value"]}',ind['type'],[ind['source']])
    C(f'faction-{f["id"]}-model','faction',f['id'],'interests/projections/strength','利益来源、偏好、投射与强度判断','analysis',[],'利益结构推断')
for l in lo['principles']:
  for j,x in enumerate(l['facts']):C(f'logic-{l["id"]}-fact{j}','logic',l['id'],'facts',x['text'],'fact',[x['source']])
  C(f'logic-{l["id"]}-theory','logic',l['id'],'theory',l['theory']['claim'],'analysis',l['theory']['refs'],l['theory']['status'])
C('labels','label','mapLabels','name/position','国家中文名称与标注位置','analysis',[],'Natural Earth公共领域轮廓，人工校订中文简称；争议地区为中性地理标注')
C('politics-institutions','politics','US/EU','groups','美欧制度渠道说明','analysis',['us','eu'])
from collections import Counter
out=dict(asOf=CHECK,method='逐条核对：优先打开原文；被Cloudflare等拦截的页面不绕过，标为检索摘要；无法核实的删除或降级为分析判断。状态：verified-opened 本轮打开正文；verified-snippet 仅检索摘要；corrected 本轮已更正；analysis 分析判断（不作事实声明）；bibliographic 经典文献书目。',
 summary=dict(Counter(c['status'] for c in claims)),corrections=[dict(target=t,id=i,change=c,sources=s) for t,i,c,s in CORR],unverified=UNVER,claims=claims)
sv('verification',out)
# prune unreferenced sources
used=set()
for c in claims:used|=set(c['sources'])
for t,i,c,s in CORR:used|=set(s)
for u in UNVER:used|=set(u['sources'])
for sy in fa['systems']:
  for f in fa[sy['id']]:used|=set(f['sources'])
for e in ev:used|=set(e['sources'])
for l in lo['principles']:used|=set(l['sources'])
used|={'osm-policy','us','eu'}
src=ld('sources');drop=[s['id'] for s in src if s['id'] not in used]
sv('sources',[s for s in src if s['id'] in used])
missing=used-{s['id'] for s in src}
print('claims',len(claims),out['summary'],'dropped',drop,'missing',missing)
