import fitz,difflib,re,unicodedata,sys
def J(s):
    s=unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
    return s
def sigs(fn):
    d=fitz.open(fn); out=[]
    for pi,p in enumerate(d,1):
        tabs=p.find_tables().tables
        for tb in tabs:
            for r in tb.extract():
                s='|'.join(f'{i}:{J(c)}' for i,c in enumerate(r) if J(c))
                if s: out.append((pi,s))
        if not tabs:
            out.append((pi,'TEXT:'+J(p.get_text())[:2000]))
    return out
names={'1':'20_beppyo1','2':'21_beppyo2','3':'22_beppyo3','4':'23_beppyo4','5':'24_beppyo5','6':'25_beppyo6','7':'26_beppyo7'}
for k,n in names.items():
    a=sigs(f'r8_b{k}.pdf'); b=sigs(f'r9_{n}.pdf')
    A=[s for p,s in a];B=[s for p,s in b]
    sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
    blocks=[(t,i1,i2,j1,j2) for t,i1,i2,j1,j2 in sm.get_opcodes() if t!='equal']
    print(f'=== 別表{k}: R8 {len(a)}行 R9 {len(b)}行 差分ブロック{len(blocks)}')
    for t,i1,i2,j1,j2 in blocks[:60]:
        print(' ',t,'R9p',b[j1][0] if j1<len(b) else '-'); print('    R8',' // '.join(A[i1:i2])[:260]); print('    R9',' // '.join(B[j1:j2])[:260])
