import sys,json,re,unicodedata
CJK='぀-ヿ㐀-鿿。、（）()0-9%'
def tidy(t):
    t=re.sub('(?<=['+CJK+r'])\s+(?=['+CJK+'])','',t)
    return t
def gj(lines):
    out='';
    for l in lines:
        l=l.strip()
        if not out: out=l
        elif re.match(r'^[・○〇]',l) or out.endswith('。'): out+=' '+l
        else: out+=l
    return out
sys.argv=['x']
from ext06 import *
def fw(s):
    o=[]
    for ch in s:
        c=ord(ch)
        if 0xFF01<=c<=0xFF5E: o.append(chr(c-0xFEE0))
        elif ch=='　': o.append(' ')
        else: o.append(ch)
    return ''.join(o)
r=extract()
# footnote of the first table (p1)
foot=None
for x in r:
    if x['page']==1 and x['school']=='' and '共通問題' in x['dept']:
        foot=None
p=d[0];W=p.get_text('words')
fl=[w for w in W if 395<w[1]<425 and w[0]<520]
fl.sort(key=lambda w:(round(w[1]),w[0]))
foot=''.join(w[4] for w in fl if w[4] not in('※',))
foot=fw(foot)
foot='令和9年度神奈川県公立高等学校入学者選抜における特色検査について、すべての学力向上進学重点校とすべての学力向上進学重点校エントリー校の県立高等学校において、共通問題と共通選択問題を用いて実施する(資料の注記)。'
out=[]
for x in r:
    if not x['dept'] or not x['school']: continue
    dept=x['dept']; kan=list(x['kanten'])
    if '・' in dept and dept.startswith('単位制総合学科'):
        dept='単位制総合学科'; kan=['・事前準備','・高校生活に対する意欲と積極性']
    head=re.sub('続き$','',x['head']).replace('の続き','')
    head=unicodedata.normalize('NFKC',x['head']).replace('の概要','').replace('(','・').replace(')','').replace('続き','').replace('の','').replace(' ','・')
    out.append(dict(page=x['page'],head=head,school=unicodedata.normalize('NFKC',x['school']).replace('*',''),dept=fw(dept),kanten=[re.sub(r'\s+','',fw(k)) for k in kan],gaiyo=re.sub(r'\s+(?![・○〇])','',gj([fw(g) for g in x['gaiyo']])).rstrip('。'),docs=fw(''.join(x['docs'])),note=foot if x['page']==1 and x['school'] in('横浜翠嵐','川和','希望ケ丘','横浜平沼','光陵','柏陽','横浜国際','横浜緑ケ丘','多摩','横須賀','鎌倉','湘南','茅ケ崎北陵','平塚江南','小田原','厚木','大和','相模原') else ''))
json.dump(out,open('tokushoku06-final.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
import collections
print(len(out),collections.Counter(o['head'] for o in out))
print(out[0]); print(out[20]); print([o for o in out if o['school']=='青葉総合'][0])
