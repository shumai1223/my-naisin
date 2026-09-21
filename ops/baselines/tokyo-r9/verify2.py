import re,unicodedata,json
from collections import Counter
rows=json.load(open('r9rows.json',encoding='utf8'))
norm=lambda s: unicodedata.normalize('NFKC',s)
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
anch=[]; G=[]
for pi,pg in enumerate(pages,1):
    ws=[(float(m[0]),float(m[1]),norm(m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    anch+=[pi for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t))]
    G.append(Counter(c for x,y,t in ws if 720<=x<900 and '今後' not in t and '数値' not in t for c in t if not c.isspace() and c not in '　○〇'))
bypage=[Counter() for _ in pages]
for r,p in zip(rows,anch):
    bypage[p-1].update(c for c in norm(''.join(r['g'])) if not c.isspace() and c not in '　○〇')
for i,(a,b) in enumerate(zip(bypage,G),1):
    d=Counter(a); d.subtract(b); d={k:v for k,v in d.items() if v}
    if d: print('p%d'%i,d)
print('done')
