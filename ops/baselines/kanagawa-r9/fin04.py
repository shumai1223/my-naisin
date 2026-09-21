import json,re
rows=json.load(open('tokubetsu04.json',encoding='utf8'))
CJK='぀-ヿ㐀-鿿。、）)（('
def tidy(s):
    s=re.sub('(?<=['+CJK+r'])\s+(?=['+CJK+'])','',s)
    s=re.sub(r'(?<=[0-9A-Za-z=])\s+(?=点満)','',s)
    return s
CAT={'連携募集':'特別募集(連携募集)','海外帰国生徒特別募集':'特別募集(海外帰国生徒)','在県外国人等特別募集':'特別募集(在県外国人等)','インクルーシブ教育実践推進校特別募集':'特別募集(インクルーシブ教育実践推進校)','中途退学者募集':'特別募集(中途退学者)','別科':'別科'}
out=[]
for r in rows:
    school=r['school'];dept=r['dept']
    if school.endswith('(定時制)'):
        school=school[:-5]; dept=dept+'(定時制)'
    dept=dept.replace('（','(').replace('）',')')
    if school=='磯子工業': dept='機械科・電気科・建設科・化学科'
    if school in('横浜明朋','相模向陽館'): dept='単位制普通科午前部・午後部(定時制)'
    kensa=r['kensa'].replace('（','(').replace('）',')').replace('・(','(').replace('プレゼン・テーション','プレゼンテーション')
    m=tidy(r['method'])
    out.append(dict(school=school,dept=dept,cat=CAT[r['section']],kensa=kensa,method=m,docs=r['docs'],page=r['page']))
json.dump(out,open('tokubetsu04-final.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
import collections
print(len(out),collections.Counter(o['cat'] for o in out))
print(out[0]['method'][:120]); print(out[27])
