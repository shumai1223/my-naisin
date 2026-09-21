import fitz,unicodedata,re
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
def rows(fn):
    d=fitz.open(fn); out={}; sch=None; dai=None
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            for r in tb.extract():
                c=[J(x) for x in r]
                if len(c)<8: continue
                if c[0] in ('学校名',) or c[0].startswith(('募集','特色','一般','●','※')): continue
                if c[0]: sch=c[0]; dai=None
                if c[1]: dai=c[1]
                if not sch: continue
                key=(sch,dai,c[2])
                if not any(c[3:]): continue
                sig=[x for x in c[3:] if x and len(x)<40 and not x.startswith('<')]
                if key in out: key=key+(pi,)
                out[key]=sig
    return out
a=rows('r8.pdf'); b=rows('r9.pdf')
print(len(a),len(b))
n=0
for k in sorted(set(a)|set(b),key=str):
    if a.get(k)!=b.get(k):
        n+=1; print(k); print('  R8',a.get(k)); print('  R9',b.get(k))
print('diffs',n)
