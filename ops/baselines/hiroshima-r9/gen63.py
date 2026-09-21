import json,re,sys
E=json.load(open('hiro63.json',encoding='utf8'))
GN=['国語','社会','数学','理科','英語']; CN=['国','社','数','理','音','美','保体','技・家','外']
DN=['面接','作文','小論文','実技検査','自校作成問題による学力検査','その他']
def mult(s):
    if s=='●': return 1.0
    m=re.match(r'^([\d.]+)倍$',s); return float(m.group(1)) if m else None
def num(s):
    m=re.match(r'^(\d+)',s or ''); return int(m.group(1)) if m else None
def marks(A,cols,names,base,total,label,unit_names_join='・'):
    if any(A[c]=='' for c in cols):
        bd=re.search(r'[（(]([\d+]+)[）)]',total or '')
        pres=[(n,A[c]) for n,c in zip(names,cols) if A[c]]
        assert bd and all(m=='●' for n,m in pres),(label,[A[c] for c in cols],total)
        pts=[int(x) for x in bd.group(1).split('+')]
        assert len(pts)==len(pres) and sum(pts)==num(total),(label,pts,total)
        return f'{label}:'+'・'.join(f'{n}{p}点' for (n,_),p in zip(pres,pts))+f'(実施教科のみ・他の教科は実施なし)=合計{num(total)}点'
    ms=[mult(A[c]) for c in cols]
    assert all(m is not None for m in ms),(label,[A[c] for c in cols])
    exp=sum(ms)*base; t=num(total)
    assert t is not None and abs(exp-t)<1e-6,(label,exp,total)
    dev=[(n,m) for n,m in zip(names,ms) if m!=1.0]
    if not dev: return f'{label}:{"・".join(names)}とも{base}点(傾斜なし)=合計{t}点'
    return f'{label}:'+'・'.join(f'{n}{base*m:g}点({m:g}倍傾斜)' for n,m in dev)+f'・他は各{base}点=合計{t}点'
def dokuji(A,B,cols):
    fl=[(DN[i],A[c],B[c]) for i,c in enumerate(cols) if A[c]]
    if not fl: return '学校独自検査の実施なし'
    parts=[]
    for n,a,b in fl:
        p=num(b); parts.append(f'{n}{p}点' if p is not None else f'{n}(点数の記載なし)')
    return '学校独自検査:'+'・'.join(parts)
def waku(r,c): 
    return f'定員枠{r}%(人数は令和9年度資料では未定「-」)' if True else ''
def fmtpt(b):
    m=re.match(r'^(\d+)[（(]([\d+]+)[）)]$',b)
    return f'(合計{m.group(1)}点・内訳{m.group(2)}=記載順)' if m else f'(点数:{b})'
def q(s): 
    assert "'" not in s,s
    return s
def rec(school,dept,cat,intv,ratio,note):
    r=f"    {{\n      schoolName: '{q(school)}',\n      department: '{q(dept)}',\n      selectionCategory: '{cat}',\n      interviewRequired: {'true' if intv else 'false'},\n"
    if ratio: r+=f"      ratioType: '{q(ratio)}',\n"
    r+=f"      note: '{q(note)}',\n    }},\n"
    return r
def gen(e,suffix):
    A=e['A'];B=e['B'] or ['']*63
    school=e['school'];dept=e['dept']+suffix
    out='';extra=[]
    if A[60]: extra.append('独自の提出書類の欄に●')
    if A[61]: extra.append('「その他」欄に●(意味は資料に明記なし)')
    if A[62]: extra.append('備考: '+A[62])
    ex=('。'+'。'.join(extra)) if extra else ''
    if A[4]:
        w=[num(A[c]) for c in (27,28,29,30)]
        assert all(x is not None for x in w[:3]),(school,dept,A[27:31])
        dk=A[30]!=''
        ratio=f'学力{w[0]}:調査{w[1]}:表現{w[2]}'+(f':独自{w[3]}' if dk else '(独自検査なし)')
        note=f'定員枠{A[4]}%(人数は令和9年度資料では未定「-」)。'+(('学力検査:国語・社会・数学・理科・英語(各50点)のうち最高得点の教科を4倍=合計'+str(num(B[6]))+'点(資料の注記『最高得点教科を4倍』)') if e.get('gaku_special') else marks(A,range(6,11),GN,50,B[6],'学力検査'))+'。'+marks(A,range(11,20),CN,25,B[11],'調査書')+f'。自己表現{A[20]}点。'+dokuji(A,B,range(21,27))+ex
        out+=rec(school,dept,'特色枠による選抜',bool(A[21]),ratio,note)
    if A[31]:
        w=[num(A[c]) for c in (46,47,48,49)]
        if w[0] is not None:
            dk=A[49]!=''
            ratio=f'学力{w[0]}:調査{w[1]}:表現{w[2]}'+(f':独自{w[3]}' if dk else '(独自検査なし)')
        else: ratio='学力:調査書:自己表現=6:2:2(独自検査なし・換算後点数は資料に明記なし)'
        cho=A[38]
        note=f'定員枠{A[31]}%(人数は令和9年度資料では未定「-」)。'+marks(A,range(33,38),GN,50,B[33],'学力検査')+'。調査書:'+((cho+'点') if cho.isdigit() else cho if cho else '標準(傾斜配点なし・欄は空欄)')+f'。自己表現{A[39]}点。'+dokuji(A,B,range(40,46))+ex
        out+=rec(school,dept,'一般枠による選抜',bool(A[40]),ratio,note)
    if any(A[50:60]):
        w=[num(A[c]) for c in (57,58,59)]
        ratio=f'調査書{w[0]}:表現{w[1]}:独自{w[2]}' if all(x is not None for x in w) else None
        fl=[DN[i if i<4 else 5] for i,c in enumerate(range(52,57)) if A[c]]
        dk='学校独自検査:'+('・'.join(fl)+(fmtpt(B[52]) if B[52] else '')) if fl else '学校独自検査の実施なし'
        note='二次選抜。調査書:'+(A[50] if A[50] else '標準(傾斜配点なし・欄は空欄)')+f'。自己表現{A[51]}点。'+dk+ex
        out+=rec(school,dept,'二次選抜',bool(A[52]),ratio,note)
    return out
if __name__=='__main__':
    idx=[int(x) for x in sys.argv[1:]]
    prev=None
    for i,e in enumerate(E):
        if not e['school']: e['school']=prev
        else: prev=e['school']
    for i in idx: print(gen(E[i],''))
