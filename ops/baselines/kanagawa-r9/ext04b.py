import fitz,collections,sys,json,re
d=fitz.open('04_tokubetsuboshuu.pdf')
def lines(p):
    H=[];V=[]
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0]=='l':
                a,b=it[1],it[2]
                if abs(a.y-b.y)<0.6 and abs(a.x-b.x)>20: H.append((a.y,min(a.x,b.x),max(a.x,b.x)))
                elif abs(a.x-b.x)<0.6 and abs(a.y-b.y)>30: V.append(a.x)
            elif it[0]=='re':
                r=it[1]
                if r.height<1.6 and r.width>20: H.append((r.y0,r.x0,r.x1))
                elif r.width<1.6 and r.height>30: V.append(r.x0)
    return H,V
def cols(V):
    xs=sorted(set(round(x) for x in V))
    return xs
def dump(pi):
    p=d[pi]; H,V=lines(p); xs=cols(V)
    x0=xs[0]; sc=[xs[0],xs[1],xs[2],xs[3],xs[4],xs[5],xs[6]] if len(xs)>=7 else xs
    names=['school','dept','kensa','method','kanten','docs']
    def col(xc):
        for i in range(6):
            if sc[i]<=xc<sc[i+1]: return names[i]
        return None
    # row bands: horizontal lines covering school+dept columns
    ys=sorted(set(round(y,1) for y,a,b in H if a<sc[1]+5 and b>sc[3]-5))
    W=p.get_text('words')
    out=[]
    for a,b in zip(ys,ys[1:]):
        if b-a<6: continue
        cells=collections.defaultdict(list)
        for w in sorted(W,key=lambda w:(round(w[1]/2),w[0])):
            yc=(w[1]+w[3])/2
            if a<=yc<b:
                c=col((w[0]+w[2])/2)
                if c: cells[c].append(w[4])
        out.append((round(a),round(b),{k:''.join(v) if k in('school','dept') else ('・'.join(v) if k=='kensa' else ' '.join(v)) for k,v in cells.items()}))
    return sc,out
if __name__=='__main__':
    pi=int(sys.argv[1])
    sc,out=dump(pi-1); print(sc)
    for a,b,c in out:
        print(a,b,{k:(v[:70]) for k,v in c.items() if k!='kanten'})
