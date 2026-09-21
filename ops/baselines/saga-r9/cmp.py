import fitz,unicodedata,re,json,collections
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
d=fitz.open('r9.pdf')
blocks=collections.defaultdict(list)  # (school,sel)-> list of dict
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        rows=[[J(c) for c in r]+['']*(13-len(r)) for r in tb.extract()]
        school=None; sect=None; cur=None
        def flush():
            global cur
            if cur: blocks[(cur['school'],cur['sel'])].append(cur); cur=None
        for r in rows:
            if r[0] and re.search(r'(高等学校|高校|分校)$',r[0]) and not r[0].startswith(('※','併設')) and len(r[0])<20:
                flush(); school=re.sub(r'高等学校$|高校$','',r[0]); sect=None
            if r[0]=='特別選抜': flush(); sect='特別'; continue
            if r[0]=='一般選抜': flush(); sect='一般'
            if sect=='一般' and r[1].startswith('選抜の順番'):
                flush(); sel=(r[7] or '').replace('Ⅰ','I').replace('Ⅱ','II') or ('I' if '選考I' in r[1] else 'II')
                cur={'school':school,'sel':sel,'page':pi,'cho':[],'itv':[],'gaku':[],'pct':[],'n':[],'txt':''}
                continue
            if cur is not None:
                joined=''.join(r)
                cur['txt']+=joined
                for m in re.finditer(r'調査書\((\d+)\)1学習の記録(\d+)2学習の記録以外(\d+)',r[11]): cur['cho'].append(m.groups())
                if r[11]=='面接' and r[12].startswith('('): cur['itv'].append(re.sub(r'\D','',r[12]))
                m=re.match(r'^計(\d+)点$',r[8])
                if m: cur['gaku'].append(m.group(1))
                if r[6] and re.match(r'^[\d.]+$',r[6]): cur['pct'].append(r[6])
                if re.match(r'^(\d+人)+$',r[3]): cur['n'].append(r[3])
                # 学習の記録の合計が col12 に連結される場合は無視
        flush()
json.dump({f'{k[0]}|{k[1]}':v for k,v in blocks.items()},open('blocks.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(blocks), sum(len(v) for v in blocks.values()))
# DB
ts=open('../../../src/data/school-selection-methods/saga.ts',encoding='utf8').read()
db=collections.defaultdict(list)
for m in re.finditer(r"schoolName: '([^']*)',\s*department: '([^']*)',\s*selectionCategory: '一般選抜 選考(I|II)',(?:\s*interviewRequired: \w+,)?\s*ratioType: '学力検査(\d+):調査書(\d+):面接(\d+)',\s*note: '([^']*)'",ts):
    note=m.group(7)
    n=re.search(r'募集人員(\d+)人\(募集定員に対する([\d.]+)%\)',note)
    ch=re.search(r'③学習の記録(\d+)点・④学習の記録以外(\d+)点',note)
    db[(m.group(1),m.group(3))].append((m.group(4),m.group(5),ch.groups() if ch else None,m.group(6),n.groups() if n else None,m.group(2)))
diff=0
for k in sorted(set(db)|{tuple(x.split('|')) for x in map(lambda kk:f'{kk[0]}|{kk[1]}',blocks)}, key=str):
    a=db.get(k,[]); b=blocks.get(k,[])
    dbset=sorted({(x[1],x[2],x[3]) for x in a},key=str)
    r9set=sorted({(c[0],(c[1],c[2]),(b_['itv'][i] if i<len(b_['itv']) else None)) for b_ in b for i,c in enumerate(b_['cho'])},key=str)
    if not b: print('R9ブロックなし',k,[x[5] for x in a][:3]); diff+=1; continue
    if dbset!=r9set: print('DIFF',k,'DB',dbset,'R9',r9set); diff+=1
print('diff',diff)
