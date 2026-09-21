import fitz,unicodedata,re,json
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
sp=lambda t:[l.strip() for l in (t or '').split(chr(10)) if l.strip()]
d=fitz.open('r9.pdf'); out=[]; issues=[]
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        raw=[list(r)+['']*(14-len(r)) for r in tb.extract()]
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
            if sect and r[1] and re.search(r'推進指定校',r[1]):
                flush(); cur={'page':pi,'school':school,'title':r[1],'items':[],'cho':[],'itv':[],'gsum':[],'csum':[],'subj':None,'jitsu':None,'cols':None,'seen':False}
                continue
            if cur is None: continue
            if r[1].startswith('指定学科'):
                a=next((i for i,x in enumerate(r) if x=='学力検査'),None); b=next((i for i,x in enumerate(r) if x.startswith('実技検査')),None); c=next((i for i,x in enumerate(r) if x=='調査書等'),None)
                cur['cols']=(a,b,c); continue
            if not cur['cols']: continue
            a,b,c=cur['cols']
            ns=re.findall(r'\d+人',r[a-1])
            if ns and re.match(r'^(\d+人)+$',r[a-1]):
                names=sp(rr[3]); depts=sp(rr[1]); sexes=sp(rr[a-2]) or ['']
                if len(ns)>1:
                    if names and len(names)!=len(ns): issues.append(('分割不能',school,cur['title'],names,ns))
                    for k,n in enumerate(ns):
                        cur['items'].append({'dept':depts[k] if len(depts)==len(ns) else (depts[0] if depts else ''),'name':names[k] if k<len(names) else '','sex':(sexes[k] if len(sexes)==len(ns) else sexes[0]),'n':int(n[:-1])})
                else:
                    cur['items'].append({'dept':' '.join(depts),'name':' '.join(names),'sex':r[a-2],'n':int(ns[0][:-1])})
            m=re.match(r'^\((\d+)\)\((\d+)\)\((\d+)\)$',r[a])
            if m: cur['subj']=[int(x) for x in m.groups()]
            m=re.match(r'^\((\d+)\)$',r[b])
            if m: cur['jitsu']=int(m.group(1))
            m=re.search(r'調査書\((\d+)\)1学習の記録(\d+)2学習の記録以外(\d+)?',r[c])
            if m: cur['cho'].append((int(m.group(1)),m.group(2),m.group(3)))
            if r[c]=='面接': cur['seen']=True
            if cur['seen'] and re.match(r'^\(\d+\)$',r[c+1]): cur['itv'].append(int(r[c+1][1:-1]))
            if cur['seen'] and not cur['itv'] and re.match(r'^\d+$',r[c+1]) and school=='白石': cur['itv'].append(int(r[c+1]))
            m=re.match(r'^計(\d+)点$',r[a]); 
            if m: cur['gsum'].append(int(m.group(1)))
            m=re.match(r'^計(\d+)点$',r[c])
            if m: cur['csum'].append(int(m.group(1)))
        flush()
res=[];multi=[]
for s in out:
    single=len(s['cho'])<=1 and len(s['itv'])<=1 and len(s['gsum'])<=1 and len(s['csum'])<=1
    ok=single and s['cho'] and s['itv'] and s['gsum'] and s['csum'] and s['subj'] and s['jitsu'] is not None and s['gsum'][0]==sum(s['subj'])+s['jitsu'] and s['csum'][0]==s['cho'][0][0]+s['itv'][0] and s['items']
    if ok: res.append(s)
    else: multi.append((s['school'],s['title'],len(s['cho']),s['itv'],s['gsum'],s['csum'],len(s['items'])))
json.dump(res,open('tokubetsu.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(out),'sections; ok',len(res),'items',sum(len(s['items']) for s in res),'; non-single/failed',len(multi))
for m in multi: print(m)
print(issues)
