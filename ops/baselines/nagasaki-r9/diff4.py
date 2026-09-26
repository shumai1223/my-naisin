import fitz,difflib,re,unicodedata
def J(s):
    s=unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ',''))
    s=re.sub(r'※\d+','',s)
    s=s.replace('－','-').replace('―','-').replace('ー','-').replace('～','~').replace('ー','-')
    s=s.replace('(','(').replace('（','(').replace('）',')')
    return s
def sigs(fn):
    d=fitz.open(fn); out=[]; ctx=['','']
    for pi,p in enumerate(d,1):
        for tb in p.find_tables().tables:
            for r in tb.extract():
                if J(r[0]) and not J(r[0]).startswith('学校名'): ctx[0]=J(r[0])
                if J(r[1]) and not J(r[1]).startswith('学科名'): ctx[1]=J(r[1])
                cells=[J(c) for i,c in enumerate(r) if i not in (3,7,17,18)]
                s='['+ctx[0]+'/'+ctx[1]+']'+'|'.join(f'{i}:{c}' for i,c in enumerate(cells) if c and len(c)<25)
                if s: out.append((pi,s))
    return out
a=sigs('r8.pdf'); b=sigs('r9.pdf')
strip=lambda x:re.sub(r'^\[[^\]]*\]','',x)
A=[strip(s) for p,s in a];B=[strip(s) for p,s in b]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
n=0
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    n+=1
    print(tag,'R8 p',a[i1][0] if i1<len(a) else '-','|'.join(A[i1:i2])[:230],'\n    R9 p',b[j1][0] if j1<len(b) else '-','|'.join(B[j1:j2])[:230])
print('diff blocks',n)
