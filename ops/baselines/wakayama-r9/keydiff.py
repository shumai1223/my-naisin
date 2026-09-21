import fitz,re,unicodedata,sys
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
def rows(fn):
    d=fitz.open(fn); out={}; sch=None; cat=None
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            for r in tb.extract():
                c=[J(x) for x in r]
                if len(c)<3: continue
                if re.match(r'^【',c[0]) or re.match(r'^【',c[1]): cat=(c[0] or c[1]); continue
                if c[0] and re.match(r'^(別表|令和|学校名|\(その)',c[0]): continue
                if c[0]: sch=c[0]
                if not sch or not any(c[1:]): continue
                key=(cat,sch,c[1] if len(c)>1 else '')
                if key in out: key=key+(pi,)
                out[key]='|'.join(x for x in c[2:] if x)
    return out
for k in sys.argv[1:]:
    fn9={'2':'21_beppyo2','3':'22_beppyo3','4':'23_beppyo4','5':'24_beppyo5','6':'25_beppyo6','7':'26_beppyo7'}[k]
    a=rows(f'r8_b{k}.pdf'); b=rows(f'r9_{fn9}.pdf')
    print('=== 別表',k,len(a),len(b))
    for key in sorted(set(a)|set(b),key=str):
        x=a.get(key); y=b.get(key)
        if x!=y:
            print(key); print('  R8',(x or '')[:300]); print('  R9',(y or '')[:300])
