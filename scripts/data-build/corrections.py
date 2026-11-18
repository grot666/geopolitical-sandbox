# One-off fact-check corrections applied 2026-11-18. Idempotent.
import json
from pathlib import Path
D=Path(__file__).resolve().parents[2]/'src/data'
def load(n):return json.loads((D/f'{n}.json').read_text())
def save(n,o):(D/f'{n}.json').write_text(json.dumps(o,ensure_ascii=False,indent=1)+'\n')
OPEN='本轮打开正文'
src=load('sources'); S={s['id']:s for s in src}
def upd(i,**k):S[i].update(k)
def add(i,title,url,asOf,evidence,ver=OPEN):
  S[i]=dict(id=i,title=title,url=url,asOf=asOf,evidence=evidence,retrievedAt='2026-11-18',verification=ver)
# --- source date / status fixes
upd('sg-somalia',asOf='2026-08-30',evidence='8月底摩加迪沙西北巴斯拉一带政府军与青年党战斗进入第二周（8月报道，非11月）。',verification=OPEN)
upd('garowe-somalia',asOf='2026-11-15',verification=OPEN)
upd('tamazuj-ss',asOf='2026-11-11',evidence='前第一副总统马沙尔等人因2025年3月纳西尔袭击受审，检方称257名士兵死亡；庭审延期至11月18日。',verification=OPEN)
upd('kosovo-energy',asOf='2026-11-16',verification=OPEN)
upd('kosovo-mitrovica',asOf='2026-10（页面日期与内容不一致）',evidence='科索沃警方在10月25日塞尔维亚选举前叫停北米特罗维察竞选集会。页面标注11月14日，但内容属选举前事件；本工具不再引用其伤亡说法。',verification='本轮打开正文；页面日期存疑')
upd('dpi-guyana',asOf='2026-09-13',evidence='国际法院庭审于2026年5月11日结束；阿里总统预计判决在“新年初”公布。',verification=OPEN)
upd('bbc-mali',asOf='2026-05-21',verification=OPEN)
upd('apa-mali',asOf='2026-11-17',evidence='11月以来护送运抵巴马科油罐车1505辆（11月7日665辆，随后840辆）；10月约4000辆，9月3796辆。',verification=OPEN)
upd('andina-peru',asOf='2026-10-25',verification=OPEN)
upd('acled-badme',asOf='2026-11-17',evidence='ACLED：厄立特里亚国防军约11月15日重新进入巴德梅；埃塞国防军11月7日夺回拉马、10月12日夺回扎兰贝萨；“生存联盟”与联邦军对立。',verification=OPEN)
upd('aa-ethiopia',asOf='2026-11-14',verification=OPEN)
for i in ['aj-drc','aj-rs','dw-rs','ecuador-emergency','nyt-venezuela','haiti-brief','mexico-iaw','reliefweb-nigeria','reuters-nigeria','acled-moz','aj-burkina','aj-sudan','aa-sudan','sudanspost-map','ctp-ethiopia','un-sc','un-ukraine','reuters-iran','taiwan']:
  if i in S and S[i].get('verification','').startswith('检索摘要'): S[i]['verification']=OPEN
upd('nyt-venezuela',evidence='NYT（经Inquirer转载）：1月3日美军行动抓获马杜罗；国务院主导SOFA谈判，基地问题“还很遥远”；6月地震约2000名南方司令部人员救援；6月空袭击毙“阿拉瓜火车”创始人之一（中情局情报，委军参与）；罗德里格斯任临时总统，马查多10月底回国，尚无选举日期。')
upd('libya-truce',title='Khaleej Times（转载）· 2025年5月的黎波里停火（历史基线）',asOf='2025-05',evidence='2025年5月的黎波里亲德贝巴力量与威慑部队（Rada）激战后停火。转载页面头部显示当日日期，但正文为2025年5月旧闻；本工具已不再将其作为2026年11月事件。',verification='本轮打开正文；发现日期误标')
upd('spa-saudi',title='Jadwa投资 · 沙特2027财年预算前声明解读',url='https://www.jadwa.com/sites/default/files/2026-10/Jadwa%20-%202027%20Preliminary%20Budget%20Statement%20-%20EN%20-%20Oct%202026.pdf',asOf='2026-10',evidence='2027年收入12020亿里亚尔、支出13920亿，赤字1910亿（GDP 3.6%）；2026年赤字估计2450亿（4.9%）；2025年2770亿。',verification='本轮下载PDF核对（沙特通讯社原页面为空）')
upd('aa-safe',asOf='2025-09-10')
upd('britannica-taiwan-strait',evidence='Britannica：海峡最窄处约100英里（约160公里），平均水深约70米。旧版数据写“约130公里”，已按来源差异修正。')
upd('kremlin-cn-ru',verification='检索摘要；官方页面本轮返回500错误')
for i in ['euronews-safe','toi-israel']: upd(i,verification='检索摘要（页面被拦截，未绕过）')
upd('consilium-gas',verification='官方检索摘要；理事会与EUR-Lex正文抓取失败')
upd('ef-mexico',evidence='报道（引NYT，未打开原文）称因墨方加强打击，美方暂缓计划中的空袭。',verification='检索摘要；NYT原文未打开')
# --- replacements for blocked AP pages
add('rik-serbia','塞尔维亚共和国选举委员会 · 第75次会议（最终结果）','https://www.rik.parlament.gov.rs/vest/en/4523/75th-session-of-the-republic-electoral-commission-.php','2026-11-05','学生名单获2354417票、140席；“统一塞尔维亚”（武契奇）获1731323票、103席；少数民族名单7席。')
add('srb-gov-mandates','塞尔维亚政府 · 新一届议会席位分配','https://www.srbija.gov.rs/vest/en/290895/mandates-allocated-to-members-of-the-new-parliamentary-convocation.php','2026-11-06','选举委员会分配新一届议会议员席位。')
add('reuters-serbia-parl','Reuters（Internazionale转载）· 学生名单议员进入议会','https://www.internazionale.it/ultime-notizie-reuters/2026/11/17/serbia-s-student-list-deputies-take-seats-in-parliament-after-landmark-election-win','2026-11-17','新议会11月17日成立。注意：路透写进步党104席，官方结果为103席，本工具采用官方数字。','检索摘要（转载页正文需脚本加载）')
add('aj-serbia','Al Jazeera · 武契奇承认败选','https://www.aljazeera.com/news/2026/10/25/serbia-voter-turnout-highest-in-decades-as-students-oppose-longtime-leader','2026-10-25','武契奇承认学生名单胜选（当晚预测学生名单135–140席）；投票率为数十年来最高。','检索摘要（链接已核对可访问）')
add('presidencia-catatumbo','哥伦比亚总统府 · 总统下令追击无人机袭击责任人','https://www.presidencia.gov.co/prensa/Paginas/Presidente-De-La-Espriella-ordeno-ofensiva-contra-responsables-del-ataque-con-drones-que-dejo-cuatro-militares-261112.aspx','2026-11-12','蒂布无人机袭击致四名军人死亡，德拉埃斯普列拉总统下令发动攻势。','本轮打开（标题与摘要核对）')
add('rfi-kidal','RFI · 重夺基达尔一个月后','https://www.rfi.fr/fr/afrique/20261106-mali-un-mois-apr%C3%A8s-la-reprise-de-kidal-pourquoi-l-arm%C3%A9e-n-a-plus-progress%C3%A9-dans-la-r%C3%A9gion','2026-11-06','10月6日马里军队与“非洲军团”重夺基达尔，FLA与JNIM未战撤离；此后军方未再推进。')
add('libya-observer','Libya Observer · 美军非洲司令部司令与德贝巴会谈','https://libyaobserver.ly/news/africom-commander-holds-talks-dbeibah-tripoli-military-cooperation','2026-11-15','美军非洲司令部司令在的黎波里与德贝巴讨论军事机构统一与“燧发枪2027”演习合作。')
add('lana-egypt','利比亚通讯社LANA · 德贝巴会见埃及情报局长','https://lana.gov.ly/post.php?id=370196&lang=en','2026-11-16','LANA标题：德贝巴与埃及情报局长讨论联合合作，特别是安全事务。','本轮打开（标题核对，日期据检索摘要）')
add('aj-ethiopia-oct','Al Jazeera · 埃塞与厄立特里亚互指对方挑起战争','https://www.aljazeera.com/news/2026/10/9/ethiopia-and-eritrea-accuse-one-another-of-launching-war','2026-10-09','10月初两国断交；埃塞致信称厄军深入提格雷约60公里，厄方否认。')
for i in ['ap-serbia','ap-serbia-parl','ap-catatumbo']: S.pop(i,None)
# --- events
ev=load('events'); E={e['id']:e for e in ev}
L=E['libya']
L.update(name='利比亚：东西分治与军事整合',status='structural',asOf='2026-11-16',confidence='中',sources=['libya-observer','lana-egypt','libya-truce'],
 essence='东西两套政权并立的结构性分裂，外部力量通过安全合作争取影响。',leverage='油气出口、地中海移民通道与外部安全合作。')
L['scores']['kineticIntensity']=10
L['rationale']['kineticIntensity']='本轮未核实到2026年11月的大规模武装冲突；此前所列“的黎波里激战”实为2025年5月旧闻，已更正。'
L['analysis'].update(what='利比亚仍处于东西分治：的黎波里德贝巴政府与东部哈夫塔尔阵营并立。11月15日美军非洲司令部司令与德贝巴讨论军事机构统一与2027年联合演习；11月16日德贝巴会见埃及情报局长。2025年5月的黎波里民兵激战后停火，可作为首都安全格局的历史基线。',politics='东西两政府并立，外部势力分别支持；美国、埃及、土耳其等通过安全合作争取影响（分析判断）。')
L['perspectives'][0]=dict(actor='的黎波里政府（德贝巴）',anxiety='民兵割据与东部竞争。',goal='借外部安全合作整合武装、巩固地位。')
L['subtitle']='AFRICA · NORTH · TRIPOLI / BENGHAZI'
Sm=E['somalia']
Sm['rationale']['kineticIntensity']='8月底巴斯拉曾爆发持续两周以上的战斗；11月15日青年党夺取科马德（Coomaad）等地（Garowe Online）。尚无直接进攻首都的报道。'
Sm['analysis']['what']='2026年8月底政府军与青年党在摩加迪沙西北巴斯拉激战两周以上；11月中旬青年党在中部推进，11月15日据报夺取科马德（Coomaad）。'
Ss=E['south-sudan']
Ss['rationale']['kineticIntensity']='前第一副总统马沙尔因纳西尔袭击案受审（庭审延至11月18日）；本快照未核实当前大规模战斗，故标为潜伏。'
Ss['analysis']['what']='前第一副总统马沙尔与七名SPLM/A-IO被告因2025年3月纳西尔驻地袭击受审（检方称257名士兵死亡），庭审延期至11月18日。政治危机可能危及2018年和平协议。'
Ss['asOf']='2026-11-11'
K=E['kosovo']
K['rationale']['kineticIntensity']='10月塞尔维亚选举前北米特罗维察竞选集会被叫停；未见武装冲突。'
K['analysis']['what']='10月25日塞尔维亚选举前，科索沃警方叫停塞尔维亚在北部的竞选集会。11月16日，库尔蒂政府称塞尔维亚阻断400千伏跨境输电线路，宣布能源紧急状态并限制与塞关联企业的电力交易。'
K['asOf']='2026-11-16'
Sr=E['serbia']
Sr['rationale']['kineticIntensity']='选举后总体为和平的政治转型，未见武装冲突。'
Sr['analysis']['what']='10月25日议会选举中学生名单赢得250席中的140席（2354417票），武契奇的“统一塞尔维亚”获103席，武契奇承认失败。新议会11月17日成立，正在组建政府。'
Sr['sources']=['rik-serbia','srb-gov-mandates','reuters-serbia-parl','aj-serbia']; Sr['asOf']='2026-11-17'
V=E['venezuela']
V['rationale']['kineticIntensity']='1月美军行动抓获马杜罗后，以谈判与有限行动为主；6月一次空袭击毙“阿拉瓜火车”创始人之一（中情局情报，委军参与）。'
V['analysis']['what']='2026年1月3日美军行动抓获马杜罗，罗德里格斯任临时总统。美国务院主导驻军地位协定（SOFA）谈判，美方称基地问题“还很遥远”；美使馆已重开。马查多10月底回国，尚无选举日期。'
EE=E['ethiopia-eritrea']
EE['rationale']['greatPowerInvolvement']='目前未见大国直接军事介入；埃塞指控埃及支持叛军，埃及与厄立特里亚均否认相关指控。'
EE['rationale']['kineticIntensity']='ACLED：约11月15日厄军重新进入巴德梅；埃塞军11月7日夺回拉马、10月12日夺回扎兰贝萨。多线作战，尚未确认两国全面战争。'
EE['analysis']['what']='9月下旬重启的北部战争已成多战线冲突；10月初两国断交。埃塞军10月12日夺回扎兰贝萨、11月7日夺回拉马，厄军约11月15日重占巴德梅；阿姆哈拉法诺与联邦军持续交战。埃塞指控厄立特里亚主导叛军攻势、埃及提供支持，两国均否认。'
if 'aj-ethiopia-oct' not in EE['sources']: EE['sources'].append('aj-ethiopia-oct')
Su=E['sudan']
Su['rationale']['systemicSpillover']='联合国称数万人死亡、近1300万人流离失所（AA）；半岛电视台给出约15万人死亡、逾1400万人流离失所，口径不同。外溢至乍得、南苏丹、埃及与红海沿岸。'
Su['analysis']['resources']='纳胡德一带有金矿；半岛电视台称黑格里格与巴利拉油田占苏丹石油产量九成。黄金、石油与人道通道是战争经济的一部分。'
M=E['mali-sahel']
M['rationale']['kineticIntensity']='JNIM对巴马科实施燃料封锁超过一年，2026年4月与FLA协同进攻（BBC 5月报道）；10月6日军政府与“非洲军团”重夺基达尔（RFI）。'
M['analysis']['what']='基地组织关联的JNIM自2025年9月起封锁运往马里的燃料，2026年4月与图阿雷格FLA协同袭击多地。燃料在军队护送下成批运入巴马科（11月以来1505辆油罐车，10月约4000辆），但首都并未完全被围。10月6日军队重夺基达尔，FLA与JNIM未战撤离。'
if 'rfi-kidal' not in M['sources']: M['sources'].append('rfi-kidal')
M['leverage']='运油车队与跨境公路（11月以来1505辆油罐车经护送抵达）。'
C=E['catatumbo']
C['sources']=['presidencia-catatumbo','caracol-catatumbo']; C['asOf']='2026-11-16'
C['rationale']['kineticIntensity']='ELN与FARC异见团体交战第22个月；11月12日蒂布无人机袭击致4名军人死亡，总统下令发动攻势。'
C['rationale']['greatPowerInvolvement']='美国禁毒合作；委内瑞拉政局变化影响边境（分析判断）。'
H=E['haiti']
H['rationale']['kineticIntensity']='帮派控制首都大片地区；联合国授权的打击帮派部队（GSF，任期9月29日延至2027年3月）持续行动。'
H['analysis']['what']='联合国授权的打击帮派部队（GSF）11月在太阳城、贝尔艾尔等地行动并缴获武器；10月18日伏击事件中四名萨尔瓦多技术人员失踪或遇害；帮派仍控制太子港大片地区。'
Mx=E['mexico']
Mx['rationale']['greatPowerInvolvement']='美国以制裁、起诉与军事威胁施压（特朗普1月9日称将“打击陆地”）；据报曾计划空袭后暂缓（NYT，经El Financiero转述）。截至11月未见公开承认的美国对墨领土打击。'
Mx['analysis']['what']='锡那罗亚集团内斗导致暴力回升（10月锡那罗亚191起凶杀），马萨特兰再遭袭击。美方以制裁、起诉与打击威胁施压；据报因墨方加强打击而暂缓空袭（转述报道，未打开原文）。'
Es=E['essequibo']
Es['analysis']['what']='国际法院“1899年仲裁裁决”案实体庭审于2026年5月4–11日举行，判决日期未公布；圭亚那总统阿里9月称预计在新年初宣判。'
Es['rationale']['kineticIntensity']='未见武装冲突；国际法院判决待发布。'
Es['asOf']='2026-09-13'
N=E['nigeria']
N['rationale']['kineticIntensity']='东北部ISWAP与博科圣地袭击军营，空袭持续；西北部匪帮设卡绑架。ReliefWeb：10月612起事件、至少835人死亡。'
Mz=E['mozambique']
Mz['analysis']['what']='11月德尔加杜角省多地遭袭击、劫掠与绑架。ACLED：10月武装分子在九个县活动，并有约5.3万美元赎金案例。'
B=E['burkina']
B['analysis']['what']='布基纳法索北部与东部大片地区处于武装团体压力之下；吉博长期被围。自9月初起JNIM与“伊斯兰国萨赫勒省”相互交战（半岛电视台11月13日），国家控制范围收缩。'
save('events',ev)
# --- resources
R=load('resources'); RR={r['id']:r for r in R}
q=RR['qatar-gas']
q['rationale'].update(systemicSpillover='EIA：2025上半年经霍尔木兹的LNG约114亿立方英尺/日，超过全球LNG贸易两成，其中近三分之一运往中国；卡塔尔LNG没有绕开霍尔木兹的出口路线。',geographicLeverage='卡塔尔与阿联酋LNG必须经霍尔木兹出口；阿曼半岛与伊朗沿岸夹持出海口。')
q['analysis'].update(resources=q['rationale']['systemicSpillover'],geography=q['rationale']['geographicLeverage'])
q['sources']=['reuters-iran','eia-chokepoints','eia-lng-2025']
g=RR['br-grain']
txt=dict(kineticIntensity='此节点不表示军事危机，是粮食贸易的结构锚点。',systemicSpillover='USDA：2026/27年度巴西主要油籽出口预测1.1857亿吨（全球2.2276亿吨），中国进口预测1.2123亿吨。',greatPowerInvolvement='中国是最大买家，美国是主要竞争出口国；巴西保持多元贸易伙伴（分析判断）。',geographicLeverage='内陆农区依赖长距离公路、铁路与港口，运输距离影响出口成本。')
g['rationale']=dict(txt); g['analysis']=dict(what='巴西是全球最大的油籽（大豆为主）出口国，对华出口占重要份额。',geography=txt['geographicLeverage'],resources=txt['systemicSpillover'],politics=txt['greatPowerInvolvement'])
g['sources']=['usda-oilseeds']; g['asOf']='2026-11'
for rid in ['black-grain','fertilizer']:
  r=RR[rid]; r['sources']=['un-sc','un-ukraine']
  r['rationale']['systemicSpillover']=('联合国安理会会议上波兰代表称对黑海贸易航线的袭击威胁粮食出口；' if rid=='black-grain' else '化肥与天然气、黑海物流相关，此处为定性分析，未引用具体产量。')+'欧洲能源结构调整并未消除冲击。'
  r['analysis']['resources']=r['rationale']['systemicSpillover']
save('resources',R)
# --- chokepoints
CP=load('chokepoints')
for c in CP:
  if c['id']=='suez':
    c['rationale']['systemicSpillover']='EIA 2026Q3苏伊士运河+SUMED管道油流约710万桶/日；仅为油流，不代表全部集装箱贸易。'
    c['analysis']['resources']=c['rationale']['systemicSpillover']
  if c['id']=='bosporus':
    c['rationale']['systemicSpillover']='EIA 2026Q3土耳其海峡油流约340万桶/日；粮食、化肥与黑海物流构成主要外溢渠道。'
    c['analysis']['resources']=c['rationale']['systemicSpillover']
    c['sources']=['un-ukraine','eia','un-sc']
save('chokepoints',CP)
A=load('alliances')
for e in A['edges']:
  if e['source']=='taiwan': e['source']='kremlin-cn-ru' if e['to']=='ru' else 'state-cda'
save('alliances',A)
RT=load('routes')
for r in RT:
  if r['id']=='black': r['source']='un-sc'
save('routes',RT)
T=load('terrain')
for f in T['features']:
  if f['id']=='tw-strait': f['note']='最窄处约160公里（Britannica），各来源测量口径不同；海上屏障增加跨海投送难度。'; f['source']='britannica-taiwan-strait'
save('terrain',T)
save('sources',list(S.values()))
print('ok',len(S))
