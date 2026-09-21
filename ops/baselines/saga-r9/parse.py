import fitz,unicodedata,re,json
def J(s): return unicodedata.normalize('NFKC',(s or '').replace('\n','').replace(' ','').replace('　',''))
d=fitz.open('r9.pdf')
ent=[]
for pi,p in enumerate(d,1):
    for tb in p.find_tables().tables:
        rows=[[J(c) for c in r]+['']*(13-len(r)) for r in tb.extract()]
        school=None; sect=None; sel=None; cur=None; part=None
        def flush():
            global cur
            if cur: ent.append(cur); cur=None
        for r in rows:
            if r[0] and re.search(r'(高等学校|高校|分校)$',r[0]) and not r[0].startswith(('※','併設')) and len(r[0])<20:
                flush(); school=re.sub(r'高等学校$|高校$','',r[0]); sect=None; sel=None
            if r[0]=='特別選抜': flush(); sect='特別'; continue
            if r[0]=='一般選抜': flush(); sect='一般'
            if sect=='一般' and re.match(r'^選抜の順番',r[1]):
                flush(); sel=r[7] or ''  # I / II / −
                if not sel:
                    mm=re.search(r'選考(I+|Ⅰ+|Ⅱ+)',r[1]); sel=mm.group(1) if mm else ''
                continue
            if sect=='一般' and r[1]=='学科': continue
            if sect=='一般' and r[1] and not r[1].startswith(('(','選抜')) and (r[3] or r[8].startswith(('国語','作文','数学','英語','学力'))):
                flush(); cur={'page':pi,'school':school,'sel':sel,'dept':r[1],'n':r[3],'pct':(r[6]+r[7]) if r[6] else '','subj':r[8],'jitsugi':r[10],'gaku':None,'cho':None,'ch3':None,'ch4':None,'itv':None,'cho_sum':None}
                # 同一行に調査書が入る場合
            if cur:
                m=re.search(r'調査書\(([\d−-]+)\)1学習の記録([\d−-]+)2学習の記録以外([\d−-]+)',r[11])
                if m: cur['cho'],cur['ch3'],cur['ch4']=m.groups()
                if re.match(r'^面接$',r[11]) and re.match(r'^\(',r[12]): cur['itv']=r[12]
                m=re.match(r'^計(\d+)点$',r[8]); 
                if m: cur['gaku']=m.group(1)
                m=re.match(r'^計(\d+)点$',r[11])
                if m: cur['cho_sum']=m.group(1)
                if r[8].startswith('(') and 'gpts' not in cur: cur['gpts']=r[8]
        flush()
json.dump(ent,open('r9-general.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(ent))
import collections
print(collections.Counter(e['sel'] for e in ent))
for e in ent[:6]: print(e)
