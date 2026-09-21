import fitz,re,unicodedata
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
def rows(fn):
    d=fitz.open(fn); out=[]; sch=None
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            for r in tb.extract():
                if len(r)<8: continue
                if J(r[0]) and not re.match(r'^(※|令和|学校名|割合|\(その)',J(r[0])): sch=J(r[0])
                dept=J(r[1])
                if not dept or dept in ('学科名',): continue
                vals=[J(c) for c in r[3:]]
                vals=[v for v in vals if v]
                out.append((sch,dept,'|'.join(vals)))
    return out
a=rows('r8_b1.pdf'); b=rows('r9_20_beppyo1.pdf')
print(len(a),len(b))
da={}
for s,d,v in a: da.setdefault((s,d),[]).append(v)
db={}
for s,d,v in b: db.setdefault((s,d),[]).append(v)
for k in sorted(set(da)|set(db),key=lambda x:(str(x[0]),x[1])):
    if da.get(k)!=db.get(k): print(k,'\n  R8',da.get(k),'\n  R9',db.get(k))
