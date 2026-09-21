import sys,json,re,unicodedata
sys.argv=['x']
from ext04b import *
def fw(s):
    out=[]
    for ch in s:
        o=ord(ch)
        if 0xFF01<=o<=0xFF5E: out.append(chr(o-0xFEE0))
        elif ch=='　': out.append(' ')
        else: out.append(ch)
    return ''.join(out)
SEC={1:'連携募集',4:'インクルーシブ教育実践推進校特別募集'}
rows=[];sec=None;school=None
for pi in range(1,6):
    if pi in SEC: sec=SEC[pi]
    sc,out=dump(pi-1)
    for a,b,c in out:
        dept=c.get('dept','');sch=c.get('school','')
        if dept.startswith('【'):
            m=re.match(r'【(.+?)】',dept); sec=m.group(1) if m else sec
            continue
        if sch=='【別科': sec='別科'; continue
        if sch=='学校名': continue
        if sch: school=sch
        if pi==5 and sec=='別科':
            school='横浜市立横浜商業'
        rows.append(dict(page=pi,section=sec,school=school,dept=dept,kensa=c.get('kensa',''),method=fw(re.sub(r'\s+',' ',c.get('method',''))).strip(),docs=re.sub(r'\s+','',c.get('docs',''))))
for r in rows:
    r['school']=fw(r['school']).replace('（','(')
json.dump(rows,open('tokubetsu04.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(rows))
import collections
print(collections.Counter(r['section'] for r in rows))
for r in rows: print(r['page'],r['section'][:6],r['school'],r['dept'],'|',r['docs'],'|',r['method'][:0])
