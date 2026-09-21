import re,unicodedata,json,sys
from collections import Counter
rows=json.load(open('r9rows.json',encoding='utf8'))
def dec(t): return t
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
W=[]
for pg in pages:
    W+= [(float(m[0]),float(m[1]),unicodedata.normalize('NFKC',m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
def cnt(lo,hi):
    return Counter(c for x,y,t in W if lo<=x<hi for c in t if not c.isspace() and c not in '　○〇')
def cmp(name,a,b):
    d=Counter(a); d.subtract(b)
    diff={k:v for k,v in d.items() if v}
    print(name,'OK' if not diff else diff)
def norm(s): return unicodedata.normalize('NFKC',s)
# 行数・anchors
anch=[]
for pg in pages:
    ws=[(float(m[0]),float(m[1]),unicodedata.normalize('NFKC',m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    anch+= [t for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t))]
mine=[r['n'] for r in rows]
print('rows',len(rows),'anchors',len(anch),'seq equal',mine==anch)
# g column
g=''.join(norm(''.join(r['g'])) for r in rows)
cmp('g', Counter(c for c in g if not c.isspace() and c not in '　○〇'), cnt(720,900))
# 種目
k=''.join(norm(r['k']) for r in rows)
cmp('kind', Counter(c for c in k if not c.isspace()), cnt(128,205))
# school
sc=''.join(norm(r['s']) for r in rows)
cmp('school', Counter(c for c in sc if not c.isspace()), cnt(0,128))
