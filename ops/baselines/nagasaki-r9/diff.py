import fitz,difflib,re
J=lambda s:(s or '').replace('\n','').replace(' ','')
def sigs(fn):
    d=fitz.open(fn); out=[]
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            for r in tb.extract():
                cells=[J(c) for i,c in enumerate(r) if i not in (3,7,17,18) ]
                s='|'.join(f'{i}:{c}' for i,c in enumerate(cells) if c and not re.match(r'^.{25,}',c))
                if s: out.append((pi,s))
    return out
a=sigs('r8.pdf'); b=sigs('r9.pdf')
print(len(a),len(b))
A=[s for p,s in a];B=[s for p,s in b]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
n=0
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    n+=1
    print(tag,'R8 p',a[i1][0] if i1<len(a) else '-',[s[:70] for s in A[i1:i2]][:4],'\n    R9 p',b[j1][0] if j1<len(b) else '-',[s[:70] for s in B[j1:j2]][:4])
print('diff blocks',n)
