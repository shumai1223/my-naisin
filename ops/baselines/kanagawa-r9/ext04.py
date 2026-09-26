import fitz,collections,sys,json,re
d=fitz.open('04_tokubetsuboshuu.pdf')
def hl(p):
    H=[]
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0]=='l':
                a,b=it[1],it[2]
                if abs(a.y-b.y)<0.6 and abs(a.x-b.x)>20: H.append((a.y,min(a.x,b.x),max(a.x,b.x)))
            elif it[0]=='re':
                r=it[1]
                if r.height<1.6 and r.width>20: H.append((r.y0,r.x0,r.x1))
    return H
for pi in range(5):
    p=d[pi]; H=hl(p)
    # lines that cover school col (x 62..118)
    ys=sorted(set(round(y) for y,x0,x1 in H if x0<70 and x1>110))
    print(pi+1,ys)
    ws=[w for w in p.get_text('words') if w[4] in('学校名','学科名等','実施する','選考方法','評価の観点','提出書類','検査')]
    print('  hdr',[(w[4],round(w[0]),round(w[1])) for w in ws][:12])
