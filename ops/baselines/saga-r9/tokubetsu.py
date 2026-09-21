import fitz,unicodedata,re,json
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
d=fitz.open('r9.pdf'); out=[]; issues=[]
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        raw=[list(r)+['']*(13-len(r)) for r in tb.extract()]
        rows=[[J(c) for c in r] for r in raw]
        school=None; sect=None; cur=None
        def flush():
            global cur
            if cur: out.append(cur); cur=None
        for ri,r in enumerate(rows):
            rr=raw[ri]
            if r[0] and re.search(r'(高等学校|高校)$',r[0]) and not r[0].startswith(('※','併設')) and len(r[0])<20:
                flush(); school=re.sub(r'高等学校$|高校$','',r[0]); sect=None
            if r[0]=='一般選抜': flush(); sect=None
            if r[0]=='特別選抜': sect='特'
            if sect and r[1] and re.search(r'推進指定校',r[1]) :
                flush(); cur={'page':pi,'school':school,'title':r[1],'items':[],'gaku':None,'jitsu':None,'cho':None,'ch3':None,'ch4':None,'itv':None,'gsum':None,'csum':None,'subj':[]}
                continue
            if cur is None: continue
            if r[1].startswith('指定学科'): continue
            ns=re.findall(r'\d+人',r[7])
            if ns and re.match(r'^(\d+人)+$',r[7]):
                sp=lambda t:[l.strip() for l in (t or '').split(chr(10)) if l.strip()]
                names=sp(rr[3]); depts=sp(rr[1]); sexes=sp(rr[6]) or ['']
                if len(ns)>1:
                    # 複数行結合セル
                    if len(names)==len(ns) or not names: pass
                    else: issues.append(('分割不能',school,cur['title'],names,ns))
                    for k,n in enumerate(ns):
                        cur['items'].append({'dept':depts[k] if len(depts)==len(ns) else (depts[0] if depts else ''),'name':names[k] if k<len(names) else '','sex':(sexes[k] if len(sexes)==len(ns) else sexes[0]),'n':int(n[:-1])})
                else:
                    cur['items'].append({'dept':' '.join(depts) if depts else r[1],'name':' '.join(names) if names else r[3],'sex':r[6],'n':int(ns[0][:-1])})
            if r[8].startswith('国語'): cur['subjtxt']=r[8]
            m=re.match(r'^\((\d+)\)\((\d+)\)\((\d+)\)$',r[8]); 
            if m: cur['subj']=[int(x) for x in m.groups()]
            m=re.match(r'^\((\d+)\)$',r[9])
            if m: cur['jitsu']=int(m.group(1))
            if r[9] and not r[9].startswith('(') and 'jitsuname' not in cur and re.search(r'実技等',r[9]): cur['jitsuname']=r[9]
            m=re.search(r'調査書\((\d+)\)1学習の記録(\d+)2学習の記録以外(\d+)',r[11])
            if m: cur['cho'],cur['ch3'],cur['ch4']=[int(x) for x in m.groups()]
            if r[11]=='面接': cur['seen']=True
            if cur.get('seen') and re.match(r'^\(\d+\)$',r[12]) and cur['itv'] is None: cur['itv']=int(r[12][1:-1])
            m=re.match(r'^計(\d+)点$',r[8]);  
            if m: cur['gsum']=int(m.group(1))
            m=re.match(r'^計(\d+)点$',r[11])
            if m: cur['csum']=int(m.group(1))
        flush()
# 検算
for c in out:
    ok=c['gsum']==sum(c['subj'])+(c['jitsu'] or 0) and c['csum']==(c['cho'] or 0)+(c['itv'] or 0) and c['cho']==(c['ch3'] or 0)+(c['ch4'] or 0)
    if not ok or not c['items']: issues.append((c['school'],c['title'],c['gsum'],c['subj'],c['jitsu'],c['csum'],c['cho'],c['itv'],len(c['items'])))
json.dump(out,open('tokubetsu.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(out),'sections', sum(len(c['items']) for c in out),'items', len(issues),'issues')
for i in issues: print(i)
