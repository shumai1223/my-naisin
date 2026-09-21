import re,unicodedata,sys
from collections import Counter
def dec(t):
    return ''.join(chr(ord(c)+29) if 0x10<=ord(c)<=0x1c else c for c in t) if t and all(0x10<=ord(c)<=0x1c for c in t) else t
def load(fn,dx):
    pages=open(fn,encoding='utf8').read().split('<page ')[1:]
    out=[]
    for pg in pages:
        ws=[(float(m[0])+dx,float(m[1]),dec(unicodedata.normalize('NFKC',m[2]))) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
        out.append(ws)
    return out
a=load('r8_16.bbox.html',39.45); b=load('r9_16.bbox.html',0)
cols={'school':(0,128),'kind':(128,205),'crit':(255,500),'pts':(500,700),'g':(720,900)}
name=sys.argv[1]; lo,hi=cols[name]
def cnt(ws):
    return Counter(c for x,y,t in ws if lo<=x<hi for c in t if not c.isspace() and c not in '　○〇')
ca=Counter();cb=Counter()
for i,(pa,pb) in enumerate(zip(a,b),1):
    x=cnt(pa);y=cnt(pb)
    d=(y-x)+Counter({k:-v for k,v in (x-y).items()})
    if d: print('p%d'%i, ''.join(f'{k}{v:+d} ' for k,v in sorted(d.items())))
