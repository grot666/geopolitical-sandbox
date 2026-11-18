"""Generate src/data/mapLabels.json from local Natural Earth (public domain) attributes.
Run: python3 scripts/build-labels.py  (re-run after replacing public/world.geojson)."""
import json, pathlib
R = pathlib.Path(__file__).resolve().parents[1]
geo = json.loads((R/'public/world.geojson').read_text())
# Vetted short standard Simplified Chinese names; neutral geographic wording for contested areas.
SHORT = {'CHN':'中国','PRK':'朝鲜','KOR':'韩国','TWN':'台湾','ARE':'阿联酋','COD':'刚果（金）','COG':'刚果（布）',
 'BIH':'波黑','CAF':'中非','ATF':'法属南部领地','MNG':'蒙古','SWZ':'埃斯瓦蒂尼','DOM':'多米尼加','USA':'美国',
 'GBR':'英国','RUS':'俄罗斯','CYN':'北塞浦路斯','FLK':'福克兰群岛（马尔维纳斯）','TTO':'特立尼达和多巴哥','SDS':'南苏丹','GNQ':'赤道几内亚'}
DISPUTED = {'TWN':'两岸政治地位存在分歧；此处仅作地理地区标注','CYN':'仅土耳其承认；地理标注不代表承认','SOL':'自我宣布，未获广泛承认；地理标注',
 'SAH':'领土地位未决；地理标注','KOS':'承认情况不一；地理标注','PSX':'地位与边界存在争议；地理标注','FLK':'英阿主权争议；中性并列名称'}
out=[]
for f in geo['features']:
    p=f['properties']; code=p['ADM0_A3']
    name = SHORT.get(code) or p.get('NAME_ZH') or p['NAME']
    m=float(p['MIN_LABEL'])
    out.append({'id':code,'name':name,'en':p['NAME'],'position':[round(p['LABEL_Y'],3),round(p['LABEL_X'],3)],
      'minZoom':round(max(0,m-2.2),2),'priority':round(m*10+p['LABELRANK'],1),'major':m<=2,
      **({'disputed':DISPUTED[code]} if code in DISPUTED else {})})
out.sort(key=lambda x:(x['priority'],x['id']))
SEAS=[('太平洋',[5,-150],0,'ocean'),('太平洋',[20,160],0.5,'ocean'),('大西洋',[25,-40],0,'ocean'),('南大西洋',[-25,-15],1,'ocean'),('印度洋',[-15,78],0,'ocean'),('北冰洋',[80,0],1.5,'ocean'),('南大洋',[-62,60],1.5,'ocean'),
 ('地中海',[35.2,18],2.5,'sea'),('黑海',[43.3,34.5],3,'sea'),('红海',[20,38.6],3.5,'sea'),('波斯湾',[27.3,51.2],3.75,'sea'),('阿拉伯海',[15,63],2.5,'sea'),('孟加拉湾',[14,88],2.5,'sea'),('南海',[13,114],2.5,'sea'),('东海',[29,125.5],3.25,'sea'),('黄海',[35.5,123.5],3.75,'sea'),('日本海',[40.5,134.5],3,'sea'),('菲律宾海',[20,133],2.75,'sea'),('加勒比海',[15,-75],2.5,'sea'),('墨西哥湾',[25,-90],2.75,'sea'),('波罗的海',[57.5,19.5],3.5,'sea'),('北海',[56,3],3.5,'sea'),('里海',[42,50.7],3.25,'sea'),('亚丁湾',[12.4,48],4,'sea'),('阿曼湾',[24.6,58.6],4.25,'sea'),('爱琴海',[38.5,25],4.5,'sea'),
 ('霍尔木兹海峡',[26.3,56.6],3.5,'strait'),('曼德海峡',[12.5,43.3],3.5,'strait'),('马六甲海峡',[3.6,99.5],3.5,'strait'),('台湾海峡',[24.3,119.5],3.75,'strait'),('苏伊士运河',[30.2,32.55],3.75,'strait'),('巴拿马运河',[9.2,-79.8],3.75,'strait'),('土耳其海峡',[40.6,27.4],4,'strait'),('直布罗陀海峡',[35.95,-5.6],4,'strait'),('朝鲜海峡',[34.4,129.2],4.5,'strait'),('好望角',[-34.6,18.4],3.5,'strait'),
 ('中东',[30,44],0,'region'),('东欧',[52,32],0,'region'),('东亚',[38,112],0,'region'),('东南亚',[8,105],0.5,'region'),('拉丁美洲',[-12,-60],0,'region'),('萨赫勒',[15,4],1,'region'),('北美洲',[48,-102],0,'region'),('非洲',[3,22],0,'region'),('西欧',[47,4],0.5,'region'),('南亚',[22,78],0.5,'region'),('中亚',[43,64],0.75,'region'),('大洋洲',[-26,134],0,'region')]
seas=[{'id':f'{k}-{i}','name':n,'position':pos,'minZoom':z,'kind':k} for i,(n,pos,z,k) in enumerate(SEAS)]
(R/'src/data/mapLabels.json').write_text(json.dumps({'note':'国家/地区名称来自 Natural Earth NAME_ZH（公共领域），经人工校订为常用简体简称；争议地区使用中性地理名称并附说明，标注不构成主权认定。标注点使用 Natural Earth LABEL_X/LABEL_Y 内部标注点。','source':'Natural Earth 1:110m Admin 0 Countries','countries':out,'geo':seas},ensure_ascii=False,indent=1)+'\n')
print(len(out),'countries',len(seas),'geo labels')
