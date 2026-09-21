import fitz,unicodedata,re,json
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
d=fitz.open('r9.pdf'); out=[]; sch=dai=None
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        rows=[[J(x) for x in r] for r in tb.extract()]
        if not rows or len(rows[0])<20: continue
        for r in rows:
            r=r+['']*(24-len(r))
            if r[0]=='学校名' or r[3] in ('募集生徒数',) or r[0].startswith(('※','特色入','一般')): continue
            if not any(r[3:]): 
                if r[0]: sch=r[0]
                if r[1]: dai=r[1]
                continue
            if r[0] and r[0] not in('小計',) : sch=r[0]; dai=None
            if r[1]: dai=r[1]
            if r[0]=='小計': out.append({'page':pi,'sub':True,'cells':r[3:8]}); continue
            if not re.match(r'^\d',r[3]): continue
            out.append({'page':pi,'school':sch,'dai':dai,'sho':r[2],'teiin':r[3],'kengai':r[4],'tokuN':r[5],'tokuOut':r[6],'req':r[7][:30],'juushi':r[8],'m':r[9:18],'gaku':r[18],'ratio':r[19],'other':r[20],'extra':r[21:]})
json.dump(out,open('r9.json','w',encoding='utf8'),ensure_ascii=False)
print(len(out))
for o in out[:8]: print(o)
