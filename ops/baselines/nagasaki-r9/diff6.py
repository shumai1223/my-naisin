import fitz,difflib,re,unicodedata
def J(s):
    s=unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ',''))
    s=re.sub(r'※\d+','',s)
    s=s.replace('－','-').replace('―','-').replace('ー','-').replace('～','~').replace('（','(').replace('）',')').replace('名','')
    return s
def sigs(fn):
    d=fitz.open(fn); out=[]; ctx=['','']
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            rr=tb.extract(); skip=set()
            for r0 in rr[:3]:
                for ci,c in enumerate(r0):
                    if '出願要件' in J(c) or '育成したい' in J(c): skip.add(ci)
            for r in rr:
                if J(r[0]) and not J(r[0]).startswith('学校'): ctx[0]=J(r[0])
                if J(r[1]) and not J(r[1]).startswith('学科'): ctx[1]=J(r[1])
                cells=[J(c) for i,c in enumerate(r) if i not in skip]
                s='|'.join(f'{i}:{c}' for i,c in enumerate(cells) if c and len(c)<80)
                if s: out.append((pi,ctx[0]+'/'+ctx[1],s))
    return out
a=sigs('r8.pdf'); b=sigs('r9.pdf')
A=[s for p,c,s in a];B=[s for p,c,s in b]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
n=0
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    n+=1
    print(tag,'R9 p',b[j1][0] if j1<len(b) else '-','ctx',b[j1][1] if j1<len(b) else ''); print('  R8','|'.join(A[i1:i2])[:210]); print('  R9','|'.join(B[j1:j2])[:210])
print('diff blocks',n)
