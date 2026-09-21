import fitz,re,unicodedata
d=fitz.open('r9.pdf'); p=d[3]
tbs=p.find_tables().tables
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
def q(s):
    assert "'" not in s,s; return s
def rec(school,dept,cat,intv,note):
    return f"    {{\n      schoolName: '{q(school)}',\n      department: '{q(dept)}',\n      selectionCategory: '{q(cat)}',\n      interviewRequired: {'true' if intv else 'false'},\n      note: '{q(note)}',\n    }},\n"
out='';n=0
SUBJ=['国語','数学','英語','理科','社会']
def marks(cells,names): return [nm for c,nm in zip(cells,names) if '○' in (c or '')]
# --- 連携型 (tbs[0])
t=tbs[0].extract(); school=None
for r in t[2:]:
    if J(r[1]): school=J(r[1])
    dept=J(r[2]); sub=marks(r[4:9],SUBJ); ren='○' in (r[9] or ''); ron='○' in (r[10] or '')
    note='全日制連携型選抜。面接:出願者全員に実施。第一次選抜学力検査:'+'・'.join(sub)+f'の{len(sub)}教科'+('。連携型学校に関する検査(作成する検査)を実施' if ren else '')+('。小論文を実施' if ron else '')
    out+=rec(school,dept,'連携型選抜(全日制)',True,note); n+=1
# --- 定時制 (tbs[1])
t=tbs[1].extract(); school=None
for r in t[3:]:
    if J(r[0]): school=J(r[1]); 
    dept=J(r[2]); 
    first=marks(r[5:10],SUBJ)
    fl=[]
    if '○' in (r[10] or ''): fl.append('学力検査は基礎的学力を測る検査のみ')
    if '○' in (r[11] or ''): fl.append('小論文')
    if '○' in (r[12] or ''): fl.append('実技検査')
    if '○' in (r[13] or ''): fl.append('自己表現')
    note=f'定時制。志望できる学科・部数{J(r[3])}。面接:出願者全員に実施。第一次選抜学力検査:'+('・'.join(first) if first else '実施教科の記載なし')+('。その他の検査:'+'・'.join(fl) if fl else '')
    out+=rec(school,dept,'定時制 第一次選抜',True,note); n+=1
    sec=marks(r[16:19],['国語','数学','英語']); sec_ron='○' in (r[19] or '') if len(r)>19 else False
    note2=f'定時制。志望できる学科・部数{J(r[14])}。面接:出願者全員に実施。第二次選抜学力検査:'+('・'.join(sec) if sec else '実施教科の記載なし')+('。小論文を実施' if sec_ron else '')
    out+=rec(school,dept,'定時制 第二次選抜',True,note2); n+=1
# --- 通信制 (tbs[2])
t=tbs[2].extract()
for r in t[2:]:
    out+=rec(J(r[1]),J(r[2]),'通信制 前期・後期選抜',True,'通信制。前期選抜・後期選抜とも面接・自己表現の欄に「出願者全員に実施」と記載(2列にまたがる記載のため面接と自己表現のどちらを実施するかは表だけでは確定できない)'); n+=1
# --- 帰国生徒等・外国人生徒等 (加納 音楽/美術)
for cat,label in (('帰国生徒等に係る入学者の選抜','帰国生徒等'),('外国人生徒等に係る入学者の選抜','外国人生徒等')):
    for dept in ('音楽','美術'):
        out+=rec('加納',dept,cat,True,f'{label}に係る入学者の選抜。「国語」「数学」「英語」の3教科と面接、小論文に加え、実技検査を実施する学校・学科(表の①)'); n+=1
# --- 県外募集 (tbs[5])
t=tbs[5].extract(); block=None; school=None
for r in t[2:]:
    if r[0] and not J(r[1]) and '【' in r[0]: block=J(r[0]).replace('での募集校','').replace('【','').replace('】',''); continue
    if not J(r[0]) and not J(r[1]): continue
    school=J(r[1]); field=J(r[2]); dept=J(r[3]); num=J(r[4])
    std=[]; 
    std.append('学力検査(出願者全員に実施)')
    if '○' in (r[6] or ''): std.append('面接')
    if '○' in (r[7] or ''): std.append('実技検査')
    ex=[nm for c,nm in zip(r[8:12],['面接','小論文','実技検査','自己表現']) if '○' in (c or '')]
    note=f'県外募集実施校に係る入学者の選抜({block})。分野:{field}。募集する学科(群):{dept}。募集人員:{num}。標準検査:'+'・'.join(std)+('。標準検査に加えて実施する検査:'+'・'.join(ex) if ex else '。標準検査に加えて実施する検査の記載なし')
    out+=rec(school,dept,'県外募集実施校に係る入学者の選抜',any('面接' in x for x in std+ex),note); n+=1
open('gen4.ts.txt','w',encoding='utf8').write(out)
print(n)
