import fitz,difflib,unicodedata,re,sys
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
def sigs(fn,pages):
    d=fitz.open(fn); out=[]
    for pi in pages:
        for tb in d[pi-1].find_tables().tables:
            for r in tb.extract():
                s='|'.join(f'{i}:{J(c)}' for i,c in enumerate(r) if J(c))
                if s: out.append((pi,s))
    return out
pages=[int(x) for x in sys.argv[1:]]
a=sigs('r8b.pdf',pages); b=sigs('r9g.pdf',pages)
A=[s for p,s in a];B=[s for p,s in b]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
n=0
for t,i1,i2,j1,j2 in sm.get_opcodes():
    if t=='equal': continue
    n+=1; print(t,'R9p',b[j1][0] if j1<len(b) else '-'); print('  R8',' // '.join(A[i1:i2])[:300]); print('  R9',' // '.join(B[j1:j2])[:300])
print('blocks',n,len(a),len(b))
