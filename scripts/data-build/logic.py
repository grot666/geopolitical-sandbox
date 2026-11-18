# Builds src/data/logic.json and adds bibliography entries to sources.json.
import json
from pathlib import Path
from urllib.parse import quote_plus
D=Path(__file__).resolve().parents[2]/'src/data'
BIB='书目信息（经典文献，DOI已通过Crossref核对，未逐页核对内容）'
BOOK='书目信息（经典著作，WorldCat检索链接，未逐页核对）'
def doi(i,title,d,asOf):return dict(id=i,title=title,url='https://doi.org/'+d,asOf=asOf,evidence='理论文献：用于说明机制，不构成对当下事件的事实证明。',retrievedAt='2026-11-18',verification=BIB,kind='theory')
def book(i,title,q,asOf):return dict(id=i,title=title,url='https://search.worldcat.org/search?q='+quote_plus(q),asOf=asOf,evidence='理论著作：用于说明机制，不构成对当下事件的事实证明。',retrievedAt='2026-11-18',verification=BOOK,kind='theory')
bib=[
 doi('mackinder-1904','Mackinder (1904) · The Geographical Pivot of History','10.2307/1775498','1904'),
 book('spykman-1942','Spykman (1942) · America\'s Strategy in World Politics','Spykman America\'s Strategy in World Politics 1942','1942'),
 book('boulding-1962','Boulding (1962) · Conflict and Defense（实力衰减梯度）','Boulding Conflict and Defense 1962','1962'),
 book('waltz-1979','Waltz (1979) · Theory of International Politics','Waltz Theory of International Politics','1979'),
 book('mearsheimer-2001','Mearsheimer (2001) · The Tragedy of Great Power Politics','Mearsheimer The Tragedy of Great Power Politics','2001'),
 doi('jervis-1978','Jervis (1978) · Cooperation under the Security Dilemma','10.2307/2009958','1978'),
 book('walt-1987','Walt (1987) · The Origins of Alliances','Walt The Origins of Alliances 1987','1987'),
 doi('snyder-1984','Snyder (1984) · The Security Dilemma in Alliance Politics','10.2307/2010183','1984'),
 book('schelling-1966','Schelling (1966) · Arms and Influence','Schelling Arms and Influence 1966','1966'),
 book('bdm-2003','Bueno de Mesquita et al. (2003) · The Logic of Political Survival','Bueno de Mesquita The Logic of Political Survival','2003'),
 doi('putnam-1988','Putnam (1988) · Diplomacy and Domestic Politics: Two-Level Games','10.1017/S0020818300027697','1988'),
 book('keohane-nye-1977','Keohane & Nye (1977) · Power and Interdependence','Keohane Nye Power and Interdependence','1977'),
 doi('farrell-newman-2019','Farrell & Newman (2019) · Weaponized Interdependence','10.1162/isec_a_00351','2019'),
 doi('fearon-1995','Fearon (1995) · Rationalist Explanations for War','10.1017/S0020818300033324','1995'),
 doi('fearon-laitin-2003','Fearon & Laitin (2003) · Ethnicity, Insurgency, and Civil War','10.1017/S0003055403000534','2003'),
]
S=json.loads((D/'sources.json').read_text()); ids={s['id'] for s in S}
S+= [b for b in bib if b['id'] not in ids]
(D/'sources.json').write_text(json.dumps(S,ensure_ascii=False,indent=1)+'\n')
def F(text,source,asOf):return dict(text=text,source=source,asOf=asOf)
def X(node,why):return dict(node=node,why=why)
L=[
 dict(id='geography',name='地理与咽喉要道',short='地理决定成本与选项，不决定结果。',
  theory=dict(claim='海上咽喉、陆权心脏地带与边缘地带的控制影响力量投送与贸易成本；实力随距离衰减。',status='经典理论，具体推论有争议',refs=['mackinder-1904','spykman-1942','boulding-1962']),
  mechanism='少数狭窄水道与陆路走廊集中了大量贸易与能源流动；控制或威胁这些节点可以低成本地抬高对手成本。距离越远，投送与补给越昂贵。',
  indicators=['咽喉要道过境量及其变化','绕行路线容量与成本','海上保险费率','军事基地与投送距离'],
  facts=[F('霍尔木兹油流：2025上半年约2090万桶/日，2026年第三季度约910万桶/日','eia','2026Q3'),F('沙特与阿联酋旁路管线合计约470万桶/日，远低于战前霍尔木兹流量','eia-chokepoints','2025'),F('马六甲2026年第三季度约1940万桶/日','eia','2026Q3'),F('台湾海峡最窄处约160公里','britannica-taiwan-strait','长期地理基线')],
  examples=[X('iran','封锁霍尔木兹使全球油流骤降，旁路管线无法完全替代'),X('redsea','曼德海峡受威胁迫使航运绕行好望角'),X('malacca','东亚能源进口高度集中于一条海峡'),X('taiwan','海峡宽度增加跨海投送难度'),X('panama','两洋航运依赖运河通航能力')],
  counter=['地理只设定成本：技术（管线、远程打击）与制度（航行规则）能改变其意义。','巴拿马运河的通航瓶颈主要来自干旱与运营，而非军事对抗。','“心脏地带”等宏观推论难以检验，易被用于决定论叙事。']),
 dict(id='energy',name='能源与资源依赖',short='依赖创造杠杆，也催生替代。',
  theory=dict(claim='进口依赖使一方易受供应中断或胁迫影响；出口依赖使租金国家易受价格与市场冲击。',status='经验规律，强度随替代能力变化',refs=['keohane-nye-1977']),
  mechanism='进口国通过多元化、储备与替代降低脆弱性；出口国在价格与市场之间权衡。依赖是不对称的：替代越难的一方越脆弱。',
  indicators=['进口来源集中度','储备天数与替代能力','能源收入占财政比重','制裁与禁令的执行时间表'],
  facts=[F('美国2025年LNG出口约151亿立方英尺/日，同比+26%','eia-lng-2025','2025'),F('欧盟禁止俄LNG（2027年1月起）与管道气（2027年9月起）','consilium-gas','2026-01-26'),F('俄罗斯预算油气收入2026年1–10月同比-14.1%','mt-oilgas','2026-11-05'),F('印度10月进口俄油约200万桶/日','bs-india-oil','2026-10')],
  examples=[X('iran','海湾油气中断冲击进口国与租金国'),X('ukraine','欧洲去俄化重塑能源贸易流向'),X('venezuela','石油储量使其成为外部力量争夺焦点'),X('essequibo','近海油田抬高领土争端的利害'),X('mozambique','大型LNG项目使地方叛乱具有外部影响')],
  counter=['相互依赖并未阻止2022年俄乌战争爆发。','依赖会随替代而下降：欧洲在数年内大幅减少俄气进口。','资源丰富不必然导致冲突，治理与制度是中介变量。']),
 dict(id='balance',name='权力平衡与安全困境',short='一方的安全措施可能被另一方视为威胁。',
  theory=dict(claim='在无政府状态下，国家关注相对实力；防御性措施也可能引发对方军备反应。进攻性与防御性现实主义对国家是否追求最大化权力有分歧。',status='有争议的理论',refs=['waltz-1979','mearsheimer-2001','jervis-1978']),
  mechanism='国家无法确定对手意图，倾向按最坏情况准备；当进攻与防御难以区分时，军备与部署的螺旋上升更可能出现。',
  indicators=['军费增速与占GDP比重','前沿部署与演训频率','新同盟或安全安排','军备采购结构（进攻性/防御性）'],
  facts=[F('2025年全球军费2.887万亿美元，同比+2.9%','sipri-2025','2025'),F('德国2025年军费同比+24%，日本+9.7%','sipri-2025','2025'),F('中国2025年军费约3360亿美元（SIPRI估计），+7.4%','sipri-2025','2025')],
  examples=[X('taiwan','军事演训与对台军售相互强化'),X('korea','同盟演习与朝鲜核威慑相互回应'),X('ukraine','欧洲扩军回应俄罗斯威胁'),X('iran','核与导弹计划与对手打击能力的螺旋')],
  counter=['国家也会“追随强者”而非制衡。','国内政治、意识形态与领导人认知常常比实力分布更能解释具体决策。','理论预测宏观趋势，不预测具体事件的时间。']),
 dict(id='alliance',name='同盟承诺：牵连与抛弃',short='盟友既担心被抛弃，也担心被卷入。',
  theory=dict(claim='国家结盟以制衡威胁（不仅是实力）；同盟内部存在“被抛弃”与“被牵连”的两难。',status='经典理论，经验支持不一',refs=['walt-1987','snyder-1984']),
  mechanism='承诺越坚定，越可能鼓励盟友冒险（牵连）；承诺越模糊，盟友越担心被抛弃并自行扩军或对冲。',
  indicators=['条约文本与部署','盟友军费与采购变化','领导人公开表态','同盟内部负担分担争议'],
  facts=[F('美日（1960）、美韩、澳新美等集体防御条约','state-cda','长期制度基线'),F('欧盟SAFE防务贷款1500亿欧元，波兰最大份额约437亿','aa-safe','2025-09-10'),F('特朗普5月称暂缓新的对台军售，视为谈判筹码','reuters-apec','2026-05')],
  examples=[X('taiwan','对台军售被当作谈判筹码引发“被抛弃”担忧'),X('korea','延伸威慑的可信度决定韩国的对冲选择'),X('ukraine','欧洲在美国承诺变化下自建防务融资'),X('kosovo','北约维稳部队承诺抑制地区冲突')],
  counter=['同盟可信度难以直接观测。','同一承诺在不同政府下执行差异很大。','非同盟伙伴（如中俄）也能高度协调，但不承担共同防御义务。']),
 dict(id='nuclear',name='核威慑与升级控制',short='核武器抑制全面战争，但不阻止有限冲突。',
  theory=dict(claim='威慑依靠让对手相信代价不可承受；“冒险竞争”可以用升级风险作为讨价还价工具。',status='经典理论，部分推论有争议',refs=['schelling-1966']),
  mechanism='核国家之间直接全面战争风险极高，因此对抗转向代理战、灰色地带与有限冲突（常称“稳定—不稳定悖论”）。',
  indicators=['核态势与演习','导弹试射','对升级门槛的公开信号','军控对话状态'],
  facts=[F('美韩核演习后朝鲜称需要更强核威慑','korea','2026-11-02')],
  examples=[X('korea','核威慑塑造半岛对抗的边界'),X('ukraine','核国家参与使外部援助与直接参战之间存在界线'),X('iran','核门槛问题是战争与谈判的核心议题')],
  counter=['伊朗核项目不等于已拥有核武器。','威慑成功难以证明（“没发生”无法观测）。','误判与意外升级的风险无法被理论排除。']),
 dict(id='survival',name='政权生存与国内联盟',short='对外政策首先服务于维持执政联盟。',
  theory=dict(claim='领导人优先满足维持其权力的关键支持者；国际谈判同时受国内批准约束（双层博弈）。',status='有影响的理论，测量困难',refs=['bdm-2003','putnam-1988']),
  mechanism='执政联盟越窄，领导人越倾向以私人利益收买关键支持者；国内否决者越多，对外承诺越难但越可信。',
  indicators=['选举与议会席位变化','安全机构的权力份额','精英更替','财政分配向安全或民生倾斜'],
  facts=[F('民主党赢得2026年中期选举两院多数','us-midterms','2026-11'),F('伊朗战时权力向革命卫队与最高国安委集中','reuters-irgc','2026-04-28'),F('塞尔维亚学生名单获140席，武契奇阵营103席','rik-serbia','2026-11-05'),F('以色列大选后总统授权艾森科特组阁','jta-eisenkot','2026-11-08')],
  examples=[X('iran','安全机构主导战与谈的决定'),X('serbia','政权更迭可能重排对外取向'),X('venezuela','临时政府以合作换取生存'),X('mali-sahel','军政府依赖外部安全伙伴维持统治'),X('bosnia-rs','塞族共和国执政联盟以三分之二多数推动实体宪法修改'),X('south-sudan','审判政敌反映执政联盟的权力巩固')],
  counter=['“关键支持者”的边界难以界定和测量。','领导人有时违背联盟利益（意识形态、误判）。','本工具的派系分析是利益结构推断，不是内部决策记录。']),
 dict(id='interdependence',name='相互依赖与“武器化”',short='网络中心节点可以变成胁迫工具。',
  theory=dict(claim='复合相互依赖提高冲突成本；但控制金融、技术与供应链枢纽的国家可以把依赖武器化。',status='有争议的理论',refs=['keohane-nye-1977','farrell-newman-2019']),
  mechanism='全球网络呈枢纽结构；掌握枢纽的一方可以监控或切断他人（出口管制、制裁、关键矿产），被胁迫方则投资替代以降低脆弱性。',
  indicators=['出口管制与反制清单','关键矿产加工集中度','先进制程产能分布','贸易顺差与市场依赖'],
  facts=[F('2024年中国约占稀土精炼91%、烧结永磁体94%','iea-ree','2024'),F('2019年10纳米以下产能约92%在台湾、8%在韩国（历史基线）','sia-bcg','2019'),F('中国2025年出口26.99万亿元，同比+6.1%','cn-customs-2025','2025')],
  examples=[X('taiwan','先进制程集中使台海稳定成为全球利益'),X('korea','存储与设备供应链受出口管制影响'),X('malacca','航运枢纽连接全球制造网络'),X('latam','锂资源进入大国供应链竞争'),X('brazil','粮食与矿产出口在大国之间对冲')],
  counter=['相互依赖未能阻止俄乌战争。','武器化会刺激替代（如中国推动科技自立），长期削弱枢纽地位。','历史基线数据（如2019年产能）会过时。']),
 dict(id='bargaining',name='战争谈判与承诺难题',short='战争持续，往往因为信息不对称与承诺不可信。',
  theory=dict(claim='战争代价高昂，理性方本应达成协议；战争发生或延续，源于私有信息、承诺问题与不可分割的议题。',status='有影响的理论，忽略意识形态与国内因素',refs=['fearon-1995']),
  mechanism='当一方无法相信对方会遵守协议（尤其实力正在变化时），或双方对战场前景判断不同，谈判就会破裂。',
  indicators=['谈判先后顺序争议','战场态势变化','第三方担保机制','停火执行记录'],
  facts=[F('美伊谈判卡在“先解除封锁”还是“先让步”的顺序上','reuters-iran','2026-11-17'),F('乌克兰问题在阿布扎比举行会谈','un-sc','2026-11')],
  examples=[X('iran','封锁与制裁的先后顺序是承诺难题'),X('ukraine','停火担保与领土问题难以分割'),X('sudan','两支武装都无法相信对方会解除武装'),X('ethiopia-eritrea','断交后缺乏可信调解渠道'),X('drc-east','多轮协议执行失败削弱信任')],
  counter=['模型假设理性单一行为者，忽略国内政治与意识形态。','私有信息本身难以观测，事后解释容易。']),
 dict(id='state-capacity',name='国家能力与战争经济',short='国家控制不了的空间，会被武装团体按利益重新组织。',
  theory=dict(claim='叛乱更可能出现在国家能力弱、地形崎岖、可获得资源收入的地区，而不只是族群差异。',status='经验研究，结论有争议',refs=['fearon-laitin-2003']),
  mechanism='武装团体通过封锁道路、控制矿产与走私、绑架勒索获得收入；国家能力越弱，暴力越可能长期化。',
  indicators=['武装事件与死亡数','道路与燃料封锁','矿产与毒品贸易控制','外部安全伙伴'],
  facts=[F('尼日利亚10月612起事件、至少835人死亡','reliefweb-nigeria','2026-10'),F('马里11月以来1505辆油罐车经护送运抵巴马科','apa-mali','2026-11-17'),F('莫桑比克武装分子10月在九个县活动','acled-moz','2026-11-07')],
  examples=[X('mali-sahel','燃料封锁是战争经济工具'),X('burkina','武装团体相互争夺征税区'),X('haiti','帮派控制首都大片地区'),X('somalia','青年党在首都外围施压'),X('nigeria','西北匪帮设卡绑架'),X('catatumbo','毒品走廊上的武装混战'),X('mexico','贩毒集团内斗推高暴力'),X('sudan','黄金与石油支撑战争经济'),X('libya','东西分治使武装力量与外部伙伴分割国家'),X('ecuador','帮派暴力迫使政府反复宣布例外状态'),X('peru','有组织犯罪敲诈促使首都进入紧急状态')],
  counter=['弱国家并不必然爆发战争。','外部干预、地方治理与社区组织会显著改变结果。','冲突数据依赖媒体报道，偏远地区可能低估。']),
 dict(id='food',name='粮食与水',short='粮食与水影响稳定，但很少单独引发战争。',
  theory=dict(claim='粮食进口依赖与跨境水资源会成为国家间议价筹码；但“水战争”决定论缺乏经验支持（分析判断）。',status='分析框架，非单一理论',refs=[]),
  mechanism='粮食出口国在价格与市场之间获得议价能力；进口国通过多元化来源降低风险；跨境河流使上游国家拥有潜在杠杆。',
  indicators=['粮食出口与进口集中度','航线安全','跨境河流协议与争议'],
  facts=[F('巴西2026/27年度油籽出口预测1.1857亿吨，中国进口预测1.2123亿吨','usda-oilseeds','2026-11'),F('联合国安理会会议上，波兰称黑海航线遭袭威胁粮食出口','un-sc','2026-11')],
  examples=[X('brazil','巴西是最大油籽出口国，中国是最大买家'),X('ukraine','黑海航线安全影响粮食出口'),X('ethiopia-eritrea','尼罗河水资源争议放大地区对立'),X('sudan','战争造成大规模饥荒风险')],
  counter=['粮价更多受天气与市场影响。','跨境水争端多数通过谈判管理，而非战争。']),
]
for l in L:
  l['sources']=sorted(set(l['theory']['refs']+[f['source'] for f in l['facts']]))
out=dict(note='底层逻辑是分析框架：理论解释机制与倾向，不预测具体事件；事实数据标注来源与日期。避免地理或资源决定论。',principles=L)
(D/'logic.json').write_text(json.dumps(out,ensure_ascii=False,indent=1)+'\n')
print(len(L))
