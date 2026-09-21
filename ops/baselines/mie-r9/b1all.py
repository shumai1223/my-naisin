import json,unicodedata,re
N=lambda s:unicodedata.normalize('NFKC',s).replace(' ','').replace('　','')
rows=json.load(open('b1-zen.json',encoding='utf8'))
KM={'mensetsu':'面接','jiko':'自己表現','sakubun':'作文','shoron':'小論文','jitsugi':'実技検査','g_kokugo':'国語','g_suugaku':'数学','g_eigo':'英語','sogo':'総合問題','sonota':'その他の検査'}
def num(v):
    if v is None: return None
    v=v.strip()
    return None if v in('―','-','') else int(v)
out=[]
for r in rows:
    school=N(r['school']); dept=N(r['dept'])
    if school=='木本校舎熊野青藍':
        school='熊野青藍(木本校舎)'
        if dept=='紀南校舎総合学科': school='熊野青藍(紀南校舎)'; dept='総合学科'
    teiin=int(r['teiin'][0]); group=int(r['teiin'][1]) if len(r['teiin'])>1 else None
    bos=r['bosyu']
    if bos in('―','-'): zen=None
    else:
        pct=int(re.search(r'(\d+)\s*%',bos).group(1))
        zen={'pct':pct,'marks':{}}
        for k,v in r['zen'].items():
            if k in('mensetsu','jiko'): zen['marks'][KM[k]]=v.split()[0]   # 個人/集団
            else: zen['marks'][KM[k]]=True if k not in('g_kokugo','g_suugaku','g_eigo') else True
        zen['gakuryoku']=[KM[k] for k in ('g_kokugo','g_suugaku','g_eigo') if k in r['zen']]
        zen['marks']={k:v for k,v in zen['marks'].items() if k not in('国語','数学','英語')}
        zen['extra']=r['free']
    k=r['koki']
    if k is None: koki=None
    else:
        koki={'国語':num(k['k_kokugo']),'数学':num(k['k_suugaku']),'社会':num(k['k_shakai']),'英語':num(k['k_eigo']),'理科':num(k['k_rika']),'実技検査':num(k['k_jitsugi']),'面接':(k['k_mensetsu'] if k['k_mensetsu'] not in('―',None) else None)}
    out.append(dict(course='全日制',school=school,dept=dept,teiin=teiin,group=group,zenki=zen,koki=koki,page=r['page']))
# manual overrides (前期の選択制)
for o in out:
    if o['school']=='いなべ総合学園':
        o['zenki']={'pct':50,'marks':{},'gakuryoku':[],'extra':'','options':'I: 面接(集団)・作文 / II: 学力検査(国語と英語、又は数学と英語のいずれかを事前に選択) / III: 面接(集団)・実技検査。I〜IIIのいずれかを事前に選択する'}
    if o['school']=='久居':
        o['zenki']={'pct':30,'marks':{},'gakuryoku':[],'extra':'','options':'I: 面接(集団)・学力検査(国語) / II: 面接(集団)・実技検査。IかIIのどちらかを事前に選択する。フレキシブル特別枠選抜は、募集枠20%で面接・学力検査を実施する'}
#json.dump(out,open('b1-zen2.json','w',encoding='utf8'),ensure_ascii=False,indent=0)

GROUPS={('桑名工業','機械科'):('機械科・材料技術科',80),('桑名工業','材料技術科'):('機械科・材料技術科',80),('桑名工業','電気科'):('電気科・電子科',80),('桑名工業','電子科'):('電気科・電子科',80),
('四日市西','普通科・比較文化・歴史コース'):('普通科・比較文化・歴史コース/普通科・数理情報コース',80),('四日市西','普通科・数理情報コース'):('普通科・比較文化・歴史コース/普通科・数理情報コース',80),
('四日市農芸','農業科学科'):('農業科学科・食品科学科・環境造園科',120),('四日市農芸','食品科学科'):('農業科学科・食品科学科・環境造園科',120),('四日市農芸','環境造園科'):('農業科学科・食品科学科・環境造園科',120),
('伊賀白鳳','機械科'):('機械科・電子機械科・建築デザイン科',105),('伊賀白鳳','電子機械科'):('機械科・電子機械科・建築デザイン科',105),('伊賀白鳳','建築デザイン科'):('機械科・電子機械科・建築デザイン科',105),
('伊賀白鳳','生物資源科'):('生物資源科・フードシステム科',70),('伊賀白鳳','フードシステム科'):('生物資源科・フードシステム科',70)}
for o in out:
    g=GROUPS.get((o['school'],o['dept']))
    o['group']=g[1] if g else None; o['groupName']=g[0] if g else None
# 定時制・通信制(頁7-8を高解像度画像で目視転記)
def K(kokugo=None,suugaku=None,shakai=None,eigo=None,rika=None,jitsugi=None): return {'国語':kokugo,'数学':suugaku,'社会':shakai,'英語':eigo,'理科':rika,'実技検査':jitsugi}
def T(school,dept,teiin,zenki,koki,menset,sakubun,saibo,page,group=None,groupName=None,extra=None):
    kk=dict(koki); kk['面接']=menset; kk['作文']=sakubun
    return dict(course='定時制',school=school,dept=dept,teiin=teiin,group=group,groupName=groupName,zenki=zenki,koki=kk,saibo=saibo,page=page,extra=extra)
def Z(pct,marks,txt): return {'pct':pct,'marks':marks,'gakuryoku':[],'extra':txt}
T5=lambda a,b,c,d=None: None
tei=[
 T('桑名','普通科',40,None,K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集=当該実施校作成の学力検査(国語・数学・英語)・面接(個人)・作文',7),
 T('四日市工業','機械交通工学科',40,Z(20,{'面接':'個人','実技検査':True},'特別選抜は、募集枠10%で面接・作文・実技検査を実施する。'),K(50,50,None,None,None,50),'個人',False,'再募集・追加募集=面接(個人)・実技検査(学力検査なし)',7),
 T('四日市工業','住システム工学科',40,Z(20,{'面接':'個人','実技検査':True},'特別選抜は、募集枠10%で面接・作文・実技検査を実施する。'),K(50,50,None,None,None,50),'個人',False,'再募集・追加募集=面接(個人)・実技検査(学力検査なし)',7),
 T('北星','普通科(昼間部)',40,Z(50,{'自己表現':'個人'},'特別選抜は、募集枠5%で自己表現を実施する。'),K(),'個人',True,'再募集=面接(個人)・作文/追加募集は実施しない',7,80,'普通科(昼間部)・情報ビジネス科(昼間部)','秋期入学者選抜10人(北星定時制課程の入学定員130人のうち)'),
 T('北星','情報ビジネス科(昼間部)',40,Z(50,{'自己表現':'個人'},'特別選抜は、募集枠5%で自己表現を実施する。'),K(),'個人',True,'再募集=面接(個人)・作文/追加募集は実施しない',7,80,'普通科(昼間部)・情報ビジネス科(昼間部)','秋期入学者選抜10人(北星定時制課程の入学定員130人のうち)'),
 T('北星','普通科(夜間部)',40,Z(20,{'自己表現':'個人'},'特別選抜は、募集枠10%で自己表現を実施する。'),K(),'個人',True,'再募集=面接(個人)・作文/追加募集は実施しない(注3)',7,None,None,'うち秋期入学者選抜10人'),
 T('飯野','普通科',80,Z(30,{'面接':'個人','作文':True},'特別選抜は、募集枠5%で面接・作文を実施する。'),K(50,50),'個人',True,'再募集=面接(個人)・作文(追加募集の記載なし)',7),
 T('みえ夢学園','総合学科(午前の部)',40,Z(50,{'面接':'個人','作文':True,'総合問題':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集は実施しない',7),
 T('みえ夢学園','総合学科(午後の部)',40,Z(50,{'面接':'個人','作文':True,'総合問題':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集は実施しない',7),
 T('みえ夢学園','総合学科(夜間部)',40,Z(50,{'面接':'個人','作文':True,'総合問題':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集=面接(個人)・作文(学力検査なし。注2)',7),
 T('上野','普通科',40,None,K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集=当該実施校作成の学力検査(国語・数学・英語)・面接(個人)・作文',8),
 T('名張','普通科',40,None,K(50,50,None,50),'個人',True,'再募集・追加募集=当該実施校作成の学力検査(国語・数学・英語)・面接(個人)・作文(資料は再募集/追加募集を区別しない1行)',8),
 T('松阪工業','普通科',40,Z(20,{'面接':'個人','作文':True},''),K(50,50,None,50),'個人',True,'再募集=県作成の学力検査(国語・数学・英語)・面接(個人)・作文/追加募集=面接(個人)・作文(学力検査なし。注2)',8),
 T('伊勢まなび','普通科(午前の部)',40,Z(50,{'面接':'個人','作文':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50),'個人',True,'再募集=県作成の学力検査(国語・数学)・面接(個人)・作文/追加募集は実施しない',8),
 T('伊勢まなび','普通科(午後の部)',40,Z(50,{'面接':'個人','作文':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50),'個人',True,'再募集=県作成の学力検査(国語・数学)・面接(個人)・作文/追加募集は実施しない',8),
 T('伊勢まなび','ものづくり工学科(夜間部)',40,Z(50,{'面接':'個人','作文':True},'特別選抜は、募集枠10%で面接・作文を実施する。'),K(50,50),'個人',True,'再募集=県作成の学力検査(国語・数学)・面接(個人)・作文/追加募集=当該実施校作成の学力検査(国語・数学)・面接(個人)・作文',8),
 T('尾鷲','普通科',40,None,K(50,50),'個人',True,'再募集・追加募集=当該実施校作成の学力検査(国語・数学)・面接(個人)・作文(資料は再募集/追加募集を区別しない1行)',8),
 T('熊野青藍(木本校舎)','普通科',40,None,K(50,50),'個人',True,'再募集・追加募集=当該実施校作成の学力検査(国語・数学)・面接(個人)・作文(資料は再募集/追加募集を区別しない1行)',8),
]
tsu=[
 dict(course='通信制',school='北星',dept='普通科',teiin=240,group=None,groupName=None,zenki=Z(20,{'自己表現':'個人'},''),koki={'面接':'個人','作文':True},saibo='再募集=面接(個人)・作文',page=8,extra='入学定員240人のうち60人は秋期入学者選抜(注4)'),
 dict(course='通信制',school='松阪',dept='普通科',teiin=200,group=None,groupName=None,zenki=None,koki={'面接':'個人','作文':True},saibo='再募集=面接(個人)・作文',page=8,extra=None),
]
out+=tei+tsu
json.dump(out,open('b1-all.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print('total',len(out),len(tei),len(tsu))
