import fitz,collections,json,sys
d=fitz.open('b001264581.pdf')
def lines(p):
    V=[];H=[];D=[]
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0]=='l':
                a,b=it[1],it[2]
                if abs(a.x-b.x)<0.6 and abs(a.y-b.y)>6: V.append((a.x,min(a.y,b.y),max(a.y,b.y)))
                elif abs(a.y-b.y)<0.6 and abs(a.x-b.x)>6: H.append((a.y,min(a.x,b.x),max(a.x,b.x)))
                elif abs(a.x-b.x)>6 and abs(a.y-b.y)>6: D.append((a,b))
            elif it[0]=='re':
                r=it[1]
                if r.width<1.6 and r.height>6: V.append((r.x0,r.y0,r.y1))
                elif r.height<1.6 and r.width>6: H.append((r.y0,r.x0,r.x1))
    return V,H,D
if __name__=='__main__':
    pi=int(sys.argv[1]); p=d[pi-1]; V,H,D=lines(p)
    ys=sorted(set(round(h[0]) for h in H if h[1]<230 and h[2]>200))
    print('rows by lines covering 学科col:',ys)
    print('diag',[(round(a.x),round(a.y),round(b.x),round(b.y)) for a,b in D][:20])

def page_rows(pi):
    p=d[pi-1]; V,H,D=lines(p)
    W=[w for w in p.get_text('words')]
    # header bottom: y of first data row line = smallest H y > header where covers 学科col; use table top region
    byy=collections.defaultdict(list)
    for h in H:
        if h[2]>150 and h[1]<253: byy[round(h[0])].append((max(h[1],150),min(h[2],253)))
    ys=[]
    for y,segs in sorted(byy.items()):
        segs.sort(); cov=0;cur=150
        for a,b in segs:
            if b>cur: cov+=b-max(a,cur); cur=b
        if cov>=0.25*(253-150): ys.append(y)
    return p,V,H,D,W,ys

COLS=[('school',73,148),('dept',148,255),('teiin',255,302),('bosyu',302,335),('mensetsu',335,358),('jiko',358,381),('sakubun',381,405),('shoron',405,429),('jitsugi',429,453),('g_kokugo',453,474),('g_suugaku',474,494),('g_eigo',494,514),('sogo',514,536),('sonota',536,560),('k_kokugo',560,590),('k_suugaku',590,617),('k_shakai',617,645),('k_eigo',645,672),('k_rika',672,699),('k_jitsugi',699,727),('k_mensetsu',727,760)]
def colof(xc):
    for n,a,b in COLS:
        if a<=xc<b: return n
    return None
def bands(pi):
    p,V,H,D,W,ys=page_rows(pi)
    # data rows begin after header: first y where a band has words in dept col & header bottom ~ 166 (p1) ; detect header bottom = max y of word '国語' in header
    hdr=max(w[3] for w in W if w[4] in('国語',) and w[0]>555 and w[1]<200 and w[1]<170) if pi==1 else ys[0]
    return p,W,[y for y in ys if y>=hdr-2],D
def dump(pi):
    p,W,ys,D=bands(pi)
    out=[]
    for a,b in zip(ys,ys[1:]):
        if b-a<8: continue
        cells=collections.defaultdict(list)
        for w in sorted(W,key=lambda w:(round(w[1]),w[0])):
            yc=(w[1]+w[3])/2
            if a<=yc<b:
                c=colof((w[0]+w[2])/2)
                if c: cells[c].append(w[4].replace('〇','○'))
        diag=any(a-1<=min(x[0].y,x[1].y) and max(x[0].y,x[1].y)<=b+1 for x in D)
        out.append((round(a),round(b),{k:' '.join(v) for k,v in cells.items()},diag))
    return out
if __name__=='__main__' and len(sys.argv)>2:
    for r in dump(int(sys.argv[1])): print(r)

MARK={'mensetsu':'面接','jiko':'自己表現','sakubun':'作文','shoron':'小論文','jitsugi':'実技検査','g_kokugo':'学力検査(国語)','g_suugaku':'学力検査(数学)','g_eigo':'学力検査(英語)','sogo':'総合問題','sonota':'その他の検査'}
def parse(pi):
    p,W,ys,D=bands(pi); V,H,_=lines(p)[0],lines(p)[1],None
    sy=sorted(set(round(h[0],1) for h in H if h[1]<80 and h[2]>140 and h[2]<200 or (h[1]<80 and h[2]>140)))
    sy=[y for y in sy if y>=ys[0]-2]
    rows=dump(pi)
    def school_at(a,b):
        # school text: words in x<148 whose centre lies between the school-band containing this band
        lo=max([y for y in sy if y<=a+1],default=ys[0]); hi=min([y for y in sy if y>=b-1],default=ys[-1])
        t=[w for w in W if w[2]<150 and lo<= (w[1]+w[3])/2 <hi and w[0]>70]
        t.sort(key=lambda w:(round(w[1]),w[0]))
        return ''.join(w[4] for w in t)
    out=[]
    for (a,b,c,_) in rows:
        dk=any(a-1<=min(x[0].y,x[1].y) and max(x[0].y,x[1].y)<=b+1 and min(x[0].x,x[1].x)>=562 for x in D)
        dz=any(a-1<=min(x[0].y,x[1].y) and max(x[0].y,x[1].y)<=b+1 and max(x[0].x,x[1].x)<=562 for x in D)
        out.append(dict(page=pi,y=(a,b),school=school_at(a,b),cells=c,diag_koki=dk,diag_zenki=dz))
    return out
if __name__=='__main__' and len(sys.argv)>2 and sys.argv[2]=='parse':
    for r in parse(int(sys.argv[1])): print(r['y'],r['school'],'|',r['cells'].get('dept'),'|',r['diag_zenki'],r['diag_koki'])
