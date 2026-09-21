import re,unicodedata,json
rows=json.load(open('r9rows.json',encoding='utf8'))
norm=lambda s: unicodedata.normalize('NFKC',s)
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
anch=[];W=[]
for pi,pg in enumerate(pages,1):
    ws=[(float(m[0]),float(m[1]),norm(m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    W.append(ws)
    anch+=[pi for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t))]
def colvals(ws,lo,hi,pat):
    return [t for x,y,t in sorted(ws,key=lambda w:w[1]) if lo<=x<hi and re.match(pat,t)]
def dedupe(rs,f):
    out=[];prev=None
    for r in rs:
        k=(r['s'],f(r))
        if k!=prev: out.append(f(r))
        prev=k
    return out
bad=0
for p in range(1,len(pages)+1):
    rs=[r for r,pp in zip(rows,anch) if pp==p]
    ws=W[p-1]
    chk={
     'c':(colvals(ws,528,545,r'^\d+$'), dedupe(rs,lambda r:str(r['c']) if r.get('c') is not None else None)),
     'm':(colvals(ws,553,566,r'^\d+$'), dedupe(rs,lambda r:str(r['m'])+r['mt'])),
     'mt':(colvals(ws,548,566,r'^(個人|集団)$'), dedupe(rs,lambda r:str(r['m'])+r['mt'])),
     'j':(colvals(ws,598,612,r'^\d+$'), dedupe(rs,lambda r:str(r['j']))),
    }
    a,b=chk['c']; b=[x for x in b if x is not None]
    if a!=b: print('p%d c bbox'%p,a,'mine',b)
    a,b=chk['m']; b=[re.match(r'\d+',x).group() for x in b]
    ma=chk['mt'][0]; mb=[re.search(r'(個人|集団)',x).group() for x in chk['mt'][1]]
    # 面接値: dedupe by (s, m+mt) so 値と種別が一致
    if a!=b: print('p%d m bbox'%p,a,'mine',b)
    if ma!=mb: print('p%d mt bbox'%p,ma,'mine',mb)
    a,b=chk['j']
    if a!=b: print('p%d j bbox'%p,a,'mine',b)
print('done')
