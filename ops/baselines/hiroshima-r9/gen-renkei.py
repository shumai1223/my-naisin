import fitz,re
J=lambda s:(s or '').replace('\n','').replace(' ','')
d=fitz.open('r9.pdf')
def q(s):
    assert "'" not in s; return s
def rec(school,dept,cat,intv,ratio,note):
    return f"    {{\n      schoolName: '{q(school)}',\n      department: '{q(dept)}',\n      selectionCategory: '{cat}',\n      interviewRequired: {'true' if intv else 'false'},\n      ratioType: '{q(ratio)}',\n      note: '{q(note)}',\n    }},\n"
out=''
t=d[6].find_tables().tables[0].extract()
school=None;n=0
for ri in range(35,41):
    r=t[ri]; c=lambda i:J(r[i]) if i<len(r) else ''
    if c(1): school=c(1)
    dept=c(2)
    matome,cho,jiko=c(6),c(8),c(10)
    dk=[(nm,c(col)) for nm,col in (('面接',12),('作文',14),('小論文',16),('その他',18)) if c(col)]
    w=[c(20),c(22),c(24),c(26)]
    assert matome and cho and jiko and all(w[:3])
    assert sum(int(x) for x in w if x)==900 or sum(int(x) for x in w if x)==900,(school,dept,w)
    ratio=f'まとめ{w[0]}:調査{w[1]}:表現{w[2]}'+(f':独自{w[3]}' if w[3] else '(独自検査なし)')
    note=f'連携型中高一貫教育に関する選抜(定員は令和9年度資料では未定「-」)。中高連携した学習のまとめ{matome}点。調査書{cho}点(傾斜配点なし)。自己表現{jiko}点。'+('学校独自検査:'+'・'.join(f'{a}{b}点' for a,b in dk) if dk else '学校独自検査の実施なし')+f'。比重(換算後・合計900点):まとめ{w[0]}・調査書{w[1]}・自己表現{w[2]}'+(f'・独自検査{w[3]}' if w[3] else '')
    out+=rec(school,dept+'(連携型中高一貫教育)','連携型中高一貫教育に関する選抜',any(a=='面接' for a,b in dk),ratio,note); n+=1
t=d[7].find_tables().tables[0].extract()
r=t[45]; c=lambda i:J(r[i]) if i<len(r) else ''
assert c(1)=='東' and c(2)=='普通'
note=f'通信制課程の選抜(定員は令和9年度資料では未定「-」)。志望理由書の欄に「{c(4)}」と記載。調査書{c(6)}点。自己表現{c(8)}点。学校独自検査の実施なし。比重(換算後・合計900点):志望理由書{c(18)}・調査書{c(20)}・自己表現{c(22)}'
assert int(c(18))+int(c(20))+int(c(22))==900
out+=rec('福山東','普通(通信制課程)','通信制課程の選抜',False,f'志望理由書{c(18)}:調査{c(20)}:表現{c(22)}',note); n+=1
open('gen-renkei.ts.txt','w',encoding='utf8').write(out)
print(n)
