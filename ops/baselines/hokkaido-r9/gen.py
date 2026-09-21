import json
R=json.load(open('hok9.json',encoding='utf8'))
def q(s):
    assert "'" not in s,s; return s
def rec(school,dept,cat,intv,ratio,note):
    r=f"    {{\n      schoolName: '{q(school)}',\n      department: '{q(dept)}',\n      selectionCategory: '{cat}',\n"
    if intv is not None: r+=f"      interviewRequired: {'true' if intv else 'false'},\n"
    if ratio: r+=f"      ratioType: '{q(ratio)}',\n"
    return r+f"      note: '{q(note)}',\n    }},\n"
out='';n=0
for r in R:
    s,dp=r['school'],r['dept']
    w=r['wakusan']
    if w not in ('-','－',''):
        star=w.startswith('*'); pct=w.lstrip('*')
        ratio=f'入学枠{pct}%程度'
        iv=[]
        if r['iv_kojin']: iv.append('個人面接')
        if r['iv_shudan']: iv.append('集団面接')
        assert iv,(s,dp)
        oth=[nm for k,nm in (('eigo_kiki','英語の聞き取りテスト'),('eigo_mondo','英語による問答'),('jitsugi','実技'),('sakubun','作文')) if r[k]]
        cho=[nm for k,nm in (('gakushu','学習の記録'),('sogo_gakushu','総合的な学習の時間'),('tokkatsu','特別活動')) if r[k]]
        sh=[nm for k,nm in (('houshi','奉仕活動'),('sports','スポーツ活動・文化活動'),('shikaku','資格・検定試験等')) if r[k]]
        if r['sonota']: sh.append('その他('+r['sonota']+')')
        if sh: cho.append('総合所見等('+'・'.join(sh)+')')
        note=('入学枠は募集人員から連携型入学者選抜による合格内定者数を減じた数のうち、推薦による入学者の範囲の程度(%)。' if star else '入学枠は募集人員のうち、推薦による入学者の範囲の程度(%)。')+f'面接:{"・".join(iv)}を実施。面接以外に実施する項目:'+('・'.join(oth) if oth else '学校裁量の実施なし')+'。個人調査書のうち評価の対象とする項目:'+('・'.join(cho) if cho else '記載なし')+f'。学区:{r["district"]}'
        out+=rec(s,dp,'推薦入学者選抜',True,ratio,note); n+=1
    else:
        pass
    ratio=f'学力:評定={r["ratio_gaku"]}(学力検査の成績を重視するグループ)、評定:学力={r["ratio_cho"]}(個人調査書等を重視するグループ)'
    ex=[]
    ex.append('学力検査の傾斜配点教科(倍率):'+r['keisha'] if r['keisha'] else '学力検査の傾斜配点の実施なし')
    if r['g_jitsugi']: ex.append('学力検査等の実施:実技')
    mm=[]
    if r['g_mensetsu_kojin']: mm.append('全員に個人面接')
    if r['g_mensetsu_shudan']: mm.append('全員に集団面接')
    if r['g_mensetsu_kanen']: mm.append('過年度卒業者のみ個人面接')
    ex.append('面接:'+'・'.join(mm) if mm else '面接の実施なし')
    cs=[nm for k,nm in (('cho_tokkatsu','特別活動の記録'),('cho_shoken','総合所見等')) if r[k]]
    if cs or r['jitsugi_nado']:
        ex.append('複数尺度による選抜で重視する項目:'+('個人調査書の'+'・'.join(cs) if cs else '')+(('・' if cs else '')+'実技等('+r['jitsugi_nado']+')' if r['jitsugi_nado'] else ''))
    note='一般入学者選抜の定員は学力検査重視/個人調査書重視/両者を同等に見る定員の3グループに分かれる(道教委凡例の標準例は15%/15%/70%・各校の配分%は資料に記載なし)。'+'。'.join(ex)+f'。学区:{r["district"]}'
    out+=rec(s,dp,'一般入学者選抜',None,ratio,note); n+=1
open('gen.ts.txt','w',encoding='utf8').write(out); print(n)
