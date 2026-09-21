import re, unicodedata, difflib, sys
def dec(t):
    return ''.join(chr(ord(c)+29) if 0x10<=ord(c)<=0x1c else c for c in t) if t and all(0x10<=ord(c)<=0x1c for c in t) else t
def load(fn,dx=0):
    pages = open(fn, encoding='utf8').read().split('<page ')[1:]
    out=[]
    for pi,pg in enumerate(pages,1):
        ws=[(float(m[0]),float(m[1]),dec(unicodedata.normalize('NFKC',m[4]))) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>',pg)]
        ws=[(x+dx,y,t) for x,y,t in ws]
        anchors=sorted([(y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t)])
        nums=sorted([(round(y),x,t) for x,y,t in ws if 500<=x<700 and re.match(r'^\d+$',t)])
        out.append((anchors,nums))
    return out
a=load('r8_16.bbox.html',39.45); b=load('r9_16.bbox.html')
mode=sys.argv[1]
def seq(d,mode):
    s=[]
    for pi,(an,nu) in enumerate(d,1):
        if mode=='anchor': s+= [f'p{pi}:{t}' for y,t in an]
        elif mode=='blocks':
            g=[];cur=[]
            for y,x,t in sorted(nu):
                if cur and y-cur[-1][0]>6: g.append(cur);cur=[]
                cur.append((y,x,t))
            if cur:g.append(cur)
            for c in g: s.append(f'p{pi}:'+'/'.join(f'{t}' for y,x,t in sorted(c,key=lambda q:q[1])))
        else: s+= [f'p{pi}:{t}@{int(x)}' for y,x,t in nu]
    return s
sa=seq(a,mode); sb=seq(b,mode)
print(len(sa),len(sb))
# compare without page prefix to be robust to page shift
strip=lambda s:[re.sub(r'^p\d+:','',x) for x in s]
A=strip(sa);B=strip(sb)
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag!='equal': print(tag,'R8',sa[i1:i2],'R9',sb[j1:j2])

if mode=='blocks':
    pass
