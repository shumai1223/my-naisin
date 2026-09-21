import re,unicodedata,json,sys
from collections import Counter
rows=json.load(open('r9rows.json',encoding='utf8'))
norm=lambda s: unicodedata.normalize('NFKC',s)
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
anch=[];W=[]
for pi,pg in enumerate(pages,1):
    ws=[(float(m[0]),float(m[1]),norm(m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    W.append(ws)
    anch+=[pi for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t))]
def ch(s): return Counter(c for c in s if not c.isspace() and c not in '()（）')
HDR=set('学校名（学科名等）内容種目等')
for p in range(1,len(pages)+1):
    rs=[r for r,pp in zip(rows,anch) if pp==p]
    # kind: consecutive dedupe on (s,k)
    ks='';prev=None
    for r in rs:
        key=(r['s'],r['k'])
        if key!=prev: ks+=r['k']
        prev=key
    ss='';prev=None
    for r in rs:
        if r['s']!=prev: ss+=r['s']
        prev=r['s']
    wk=ch(''.join(t for x,y,t in W[p-1] if 128<=x<205 and y>135 and t not in ('内','容','種','目','等')))
    wk2=ch(''.join(t for x,y,t in W[p-1] if 128<=x<205 and y>120 and not re.match(r'^[内容種目等]$',t)))
    ws_=ch(''.join(t for x,y,t in W[p-1] if x<128 and y>135))
    dk=Counter(ch(ks)); dk.subtract(wk); dk={k:v for k,v in dk.items() if v}
    ds=Counter(ch(ss)); ds.subtract(ws_); ds={k:v for k,v in ds.items() if v}
    if dk or ds: print('p%d'%p,'kind',dk,'school',ds)
print('done')
