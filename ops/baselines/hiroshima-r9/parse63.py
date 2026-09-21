import fitz,json,re,sys
J=lambda s:(s or '').replace('\n','').replace(' ','')
def cell(r,i): return J(r[i]) if i<len(r) else ''
d=fitz.open('r9.pdf')
ents=[];skipped=[]
for pi in (4,5,6,7):
    for ti,tb in enumerate(d[pi].find_tables().tables):
        t=tb.extract()
        if len(t[0])<63: continue
        city=None;sect=None;i=4
        while i<len(t):
            r=t[i]
            if cell(r,0): city=cell(r,0)
            isA=bool(cell(r,1) or cell(r,2)) and bool(cell(r,3)) 
            if isA:
                B=t[i+1] if i+1<len(t) and not (cell(t[i+1],1) or cell(t[i+1],2) or cell(t[i+1],3)) else None
                ents.append({'page':pi+1,'city':city,'school':cell(r,1),'dept':cell(r,2),'A':[cell(r,k) for k in range(63)],'B':[cell(B,k) for k in range(63)] if B else None})
                i+=2 if B else 1
            else:
                if any(J(c) for c in r): skipped.append((pi+1,i,[(k,J(c)[:20]) for k,c in enumerate(r) if J(c)][:8]))
                i+=1
json.dump(ents,open('hiro63.json','w',encoding='utf8'),ensure_ascii=False)
print(len(ents),'skipped',len(skipped))
import collections
print(collections.Counter(e['page'] for e in ents))
for s in skipped[:40]: print(s)
