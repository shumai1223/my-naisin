import json,unicodedata,collections
d=json.load(open('tokubetsu.json',encoding='utf8'))
N=lambda s:unicodedata.normalize('NFKC',s)
recs=[]
for s in d:
    for it in s['items']:
        if s['school']=='佐賀商業' and s['title'].startswith('特色'):
            it=dict(it,dept='商業科・グローバルビジネス科(一括してくくり募集)' if it['n']==40 else '情報処理科')
        dept=it['dept'].replace('※一括してくくり募集','').strip()
        kukuri='一括してくくり募集' in it['dept']
        dept=N(dept).replace(' ','・')
        if dept in ('なし',''): dept='学科指定なし'
        if kukuri and '一括' not in dept: dept+='(一括してくくり募集)'
        name=N(it['name']); sex=it['sex'] if it['sex'] in ('男','女') else ''
        lab=name+(('・'+sex) if sex and sex not in name else '')
        department=dept+(f'({lab})' if lab else '')
        g=sum(s['subj']); j=s['jitsu']; c,c1,c2=s['cho'][0]; itv=s['itv'][0]
        cat='特別選抜 '+s['title']
        ratio=f'学力検査{g}:実技{j}:調査書{c}:面接{itv}'
        note=f'【令和9年度 評価基準の概要・学校別ページ(PDF{s["page"]}頁)】{s["title"]}。{lab or dept}の募集人員{it["n"]}人。学力検査{g}点(国語・英語・数学各{s["subj"][0]})、実技検査及び実績評価表{j}点、調査書{c}点(学習の記録{c1}点・学習の記録以外{c2}点)、面接{itv}点。学力検査+実技={s["gsum"][0]}点、調査書+面接={s["csum"][0]}点。'
        recs.append(dict(school=s['school'],department=department,cat=cat,ratio=ratio,note=note,n=it['n']))
c=collections.Counter((r['school'],r['cat'],r['department']) for r in recs)
print(len(recs),[k for k,v in c.items() if v>1])
json.dump(recs,open('tokubetsu-recs.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(recs[0]); print(sum(r['n'] for r in recs))
