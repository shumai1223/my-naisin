import fitz,json,re
J=lambda s:(s or '').replace('\n','').replace(' ','')
d=fitz.open('r9.pdf'); p=d[3]
tb=p.find_tables().tables[0]; t=tb.extract(); rows=tb.rows
ws=p.get_text('words')
def inbox(b): return [w for w in ws if w[0]>=b[0]-1 and w[2]<=b[2]+1 and w[1]>=b[1]-1 and w[3]<=b[3]+1]
# ヘッダのx: 特色/一般独自(面接,作文,小論,実技,学力,他) 二次(面接,作文,小論,実技,他)
hx=lambda cell: {ch: w[0] for w in inbox(rows[2].cells[cell]) for ch in [w[4]]}
H9=hx(9); H20=hx(20)
L9=rows[2].cells[9][0];L20=rows[2].cells[20][0]
sixx=[H9[k]-L9 for k in '面作小実学他']
fivex=[H20[k]-L20 for k in '面作小実他']
def flags(ri,ci,xs):
    c=rows[ri].cells[ci]
    if not c: return [],''
    inb=inbox(c); out=[]
    for w in inb:
        if w[4]=='●':
            rx=w[0]-c[0]; k=min(range(len(xs)),key=lambda i:abs(xs[i]-rx)); assert abs(xs[k]-rx)<=4,(ri,ci,rx,xs)
            out.append(k)
    txt=''.join(w[4] for w in sorted(inb,key=lambda w:(round(w[1]),w[0])) if w[4]!='●')
    return sorted(set(out)),txt
def toks(s): return re.findall(r'●※?|[0-9.]+倍',J((s or '').split(chr(10))[0]))
ents=[];city=school=None
for ri in range(3,len(t)):
    r=t[ri]
    if J(r[0]): city=J(r[0])
    if J(r[1]): school=J(r[1])
    A=['']*63;B=['']*63
    c=lambda i:J(r[i]) if i<len(r) else ''
    A[4],A[5]=c(4),c(5); A[31],A[32]=c(11),c(12)
    g=c(6)
    special=None
    if g:
        m=toks(r[6]); assert len(m)==5,(ri,g)
        tot=re.search(r'\|?(\d+)',(r[6] or '').split('\n')[-1]) 
        totnum=re.findall(r'(\d+)',g.split('●')[-1].split('倍')[-1])
        if '※' in g:
            special=g; m=['●']*5
        for k in range(5): A[6+k]=m[k]
        B[6]=re.search(r'(\d+)',re.sub(r'^[●※\d.倍]*?(?=\d{3})','',g)).group(1) if False else None
    # 合計点: セル末尾の数値(改行区切りの最終行の先頭数字)
    def total(cell):
        ln=(cell or '').split('\n')[-1].strip(); m=re.match(r'^(\d+)',ln); return m.group(1) if m else ''
    if g: B[6]=total(r[6])
    if c(7): 
        m=toks(r[7]); assert len(m)==9,(ri,c(7))
        for k in range(9): A[11+k]=m[k]
        B[11]=total(r[7])
    A[20]=c(8)
    # 特色独自
    fl,txt=flags(ri,9,sixx)
    for k in fl: A[21+k]='●'
    if fl:
        assert len(fl)==1,(ri,fl); B[21+fl[0]]=re.sub(r'\D','',txt)
    w=re.findall(r'\d+',(r[10] or '').replace('\n',' '))
    for k,x in enumerate(w[:4]): A[27+k]=x
    # 一般
    m=toks(r[13]) if c(13) else []
    if m:
        assert len(m)==5,(ri,c(13)); 
        for k in range(5): A[33+k]=m[k]
        B[33]=total(r[13])
    A[38]='225(傾斜配点なし)' if '傾' in J(r[14]) else ''
    A[39]=c(15)
    fl,txt=flags(ri,16,sixx)
    for k in fl: A[40+k]='●'
    if fl:
        assert len(fl)==1,(ri,fl); B[40+fl[0]]=re.sub(r'\D','',txt)
    w17=(r[17] or '').replace('\n',' ')
    nums=re.findall(r'\d+',w17)
    if ri==3: A[46],A[47],A[48]='600','200','200'   # 可部: 縦書き『6 2 2/0 0 0/0 0 0』=600/200/200
    else:
        for k,x in enumerate(nums[:4]): A[46+k]=x
    A[50]='225(傾斜配点なし)' if '傾' in J(r[18]) else ''
    A[51]=c(19)
    fl,txt=flags(ri,20,fivex)
    for k in fl: A[52+k]='●'
    B[52]=re.sub(r'\s','',txt)
    w=re.findall(r'\d+',(r[21] or '').replace('\n',' '))
    for k,x in enumerate(w[:3]): A[57+k]=x
    A[60]=c(22);A[61]=c(23);A[62]=c(24)
    e={'page':4,'city':city,'school':school,'dept':c(2),'A':A,'B':B}
    if special: e['gaku_special']=special
    ents.append(e)
json.dump(ents,open('hiro25.json','w',encoding='utf8'),ensure_ascii=False)
print(len(ents))
for e in ents[:3]+ents[6:7]+ents[-1:]: print(e['school'],e['dept'],[ (i,x) for i,x in enumerate(e['A']) if x][:40],[(i,x) for i,x in enumerate(e['B']) if x])
print([e['school']+e['dept'] for e in ents if 'gaku_special' in e])
