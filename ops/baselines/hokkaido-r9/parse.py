import fitz,json,re,unicodedata
J=lambda s:unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
d=fitz.open('r9.pdf')
NAMES=['wakusan','iv_kojin','iv_shudan','eigo_kiki','eigo_mondo','jitsugi','sakubun','gakushu','sogo_gakushu','tokkatsu','houshi','sports','shikaku','sonota','keisha','g_jitsugi','g_mensetsu_kojin','g_mensetsu_shudan','g_mensetsu_kanen','ratio_gaku','ratio_cho','cho_tokkatsu','cho_shoken','jitsugi_nado']
rows=[];dist=school=None
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        t=tb.extract()
        # A0: '入学枠'列
        A0=None
        for r in t[:6]:
            for c,x in enumerate(r):
                if '入学枠' in J(x): A0=c
        if A0 is None: continue
        c0=A0-3 if A0>=3 else 0  # 学区列
        for r in t:
            def g(c): return J(r[c]) if 0<=c<len(r) else ''
            sc=g(A0-2); dp=g(A0-1)
            if g(0) and not g(0).startswith('（') : 
                if '学区' not in g(0) and len(g(0))<12: dist=g(0)
            if not dp or dp in ('学科名',): continue
            if sc: school=sc
            row={'page':pi,'district':dist,'school':school,'dept':dp}
            for k,n in enumerate(NAMES): row[n]=g(A0+k)
            rows.append(row)
json.dump(rows,open('hok9.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(rows))
import collections
print(collections.Counter(r['page'] for r in rows))
for r in rows[:6]+rows[-4:]: print({k:v for k,v in r.items() if v})
print(sorted(set(r['wakusan'] for r in rows))[:40])
print(sorted(set(r['keisha'] for r in rows))[:40])
print(sorted(set(r['ratio_gaku'] for r in rows))); print(sorted(set(r['jitsugi_nado'] for r in rows)))
