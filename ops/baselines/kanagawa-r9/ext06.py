import fitz,collections,re,json,sys
d=fitz.open('06_tokushoku.pdf')
def lines(p):
    H=[];V=[]
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0]=='l':
                a,b=it[1],it[2]
                if abs(a.y-b.y)<0.6 and abs(a.x-b.x)>15: H.append((a.y,min(a.x,b.x),max(a.x,b.x)))
                elif abs(a.x-b.x)<0.6 and abs(a.y-b.y)>30: V.append(a.x)
            elif it[0]=='re':
                r=it[1]
                if r.height<1.6 and r.width>15: H.append((r.y0,r.x0,r.x1))
                elif r.width<1.6 and r.height>30: V.append(r.x0)
    return H,V
def bands(H,x0,x1,tol=0.5):
    # y positions of lines covering >=60% of [x0,x1]
    by=collections.defaultdict(list)
    for y,a,b in H:
        if b>x0 and a<x1: by[round(y)].append((max(a,x0),min(b,x1)))
    ys=[]
    for y,segs in sorted(by.items()):
        segs.sort();cov=0;cur=x0
        for a,b in segs:
            if b>cur: cov+=b-max(a,cur);cur=b
        if cov>=0.6*(x1-x0): ys.append(y)
    return ys
if __name__=='__main__':
    for pi in range(7):
        p=d[pi];H,V=lines(p);xs=sorted(set(round(x) for x in V))
        print(pi+1,xs)
        for name,(a,b) in {'school':(xs[0],xs[1]),'dept':(xs[1],xs[2]),'kanten':(xs[2],xs[3]),'gaiyo':(xs[3],xs[4])}.items():
            print('  ',name,bands(H,a,b))

def words_in(W,x0,x1,y0,y1):
    ws=[w for w in W if x0<=(w[0]+w[2])/2<x1 and y0<=(w[1]+w[3])/2<y1]
    ws.sort(key=lambda w:(round(w[1]),w[0]))
    return ws
def linejoin(ws,sep=' '):
    # group by line (y)
    lines=[];cur=[];cy=None
    for w in ws:
        if cy is None or abs(w[1]-cy)<3: cur.append(w[4]); cy=w[1] if cy is None else cy
        else: lines.append(''.join(cur) if sep=='' else ' '.join(cur)); cur=[w[4]]; cy=w[1]
    if cur: lines.append(''.join(cur) if sep=='' else ' '.join(cur))
    return lines
def extract():
    recs=[]
    for pi in range(7):
        p=d[pi];H,V=lines(p);xs=sorted(set(round(x) for x in V));W=p.get_text('words')
        x=xs
        gb=bands(H,x[3],x[4]); 
        sb=bands(H,x[0],x[1]); db=bands(H,x[1],x[2])
        # headings
        heads=[]
        for w in W:
            if re.search(r'の概要\(|の続き',w[4]): heads.append((w[1],w[4]))
        heads.sort()
        for a,b in zip(gb,gb[1:]):
            if b-a<8: continue
            txt=' '.join(w[4] for w in words_in(W,x[0],x[1],a,b))
            if txt.startswith('学校名'): continue
            # dept bands inside [a,b)
            dbs=[y for y in db if a-1<=y<=b+1]
            drows=list(zip(dbs,dbs[1:]))
            kanten=linejoin(words_in(W,x[2],x[3],a,b))
            gaiyo=linejoin(words_in(W,x[3],x[4],a,b))
            docs=linejoin(words_in(W,x[4],x[5],a,b))
            head=[h for y,h in heads if y<=a+2]
            hd=head[-1] if head else ''
            for da,dbb in drows:
                if dbb-da<6: continue
                dept=''.join(linejoin(words_in(W,x[1],x[2],da,dbb),sep=''))
                # school: school band containing this dept band
                sbs=[y for y in sb if y<=(da+dbb)/2]; sbe=[y for y in sb if y>(da+dbb)/2]
                s0=sbs[-1] if sbs else da; s1=sbe[0] if sbe else dbb
                school=''.join(linejoin(words_in(W,x[0],x[1],s0,s1),sep=''))
                recs.append(dict(page=pi+1,head=hd,school=school,dept=dept,kanten=kanten,gaiyo=gaiyo,docs=docs,y=(round(da),round(dbb))))
    return recs
