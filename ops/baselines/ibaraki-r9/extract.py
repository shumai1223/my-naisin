import fitz, json, unicodedata, re
N=lambda s: unicodedata.normalize('NFKC',s or '').replace('\n','')
d=fitz.open('tokushoku.pdf')
out=[];cur=[None,None,None]
for pn,p in enumerate(d,1):
    txt=p.get_text()
    course='全日制課程' if '全日制課程' in txt[:80] else ('定時制課程' if '定時制' in txt[:80] else '?')
    tabs=p.find_tables().tables
    for t in tabs:
        for r in t.extract():
            if len(r)<11: continue
            if r[0] in ('学校名',) or (r[5] or '').startswith('学力') : continue
            if not any(r[5:11]) and not r[3]: 
                # 注記行
                if r[0] and r[0].startswith('注'): out.append({'page':pn,'note':N(r[0])})
                continue
            s,dp,ra=N(r[0]),N(r[1]),N(r[2])
            if s: cur=[s,dp,ra]
            else:
                if dp: cur[1]=dp
                if ra: cur[2]=ra
            out.append({'page':pn,'course':course,'school':cur[0],'dept':cur[1],'ratio':cur[2],'field':N(r[3]),'req':N(r[4])[:60],'gaku':N(r[5]),'cho':N(r[6]),'men':N(r[7]),'saku':N(r[8]),'jitsu':N(r[9]),'total':N(r[10]),'rawschool':N(r[0])})
json.dump(out,open('tk.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(out))
for o in out[:14]: print({k:v for k,v in o.items() if k not in('req',)})
