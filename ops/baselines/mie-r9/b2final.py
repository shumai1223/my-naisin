import json,re,unicodedata,collections
B=json.load(open('b2-tab.json',encoding='utf8'))
N=lambda s:unicodedata.normalize('NFKC',s)
def flow(t,sep=''):
    lines=[l.strip() for l in t.split('\n') if l.strip()]
    out=''
    for l in lines:
        if not out: out=l
        elif re.match(r'^([(（][0-9０-９]+[)）]|[0-9０-９] |[・○〇◎]|[ア-ン]\s)',l) or re.match(r'^[１２３４５６７８９][ 　]',l): out+=' '+l
        else: out+=sep+l
    r=N(out)
    r=re.sub(r'^([12]) (選抜資料の取扱い|選抜方法)',lambda m:m.group(1)+' '+m.group(2)+': ',r)
    r=re.sub(r' ([12]) (選抜方法)(?=[^:])',lambda m:' '+m.group(1)+' '+m.group(2)+': ',r)
    return r
def dept_key(c):
    lines=[l.strip() for l in c.split('\n') if l.strip()]
    out=''
    for l in lines:
        l=re.sub(r'\s+','',l)
        if not out: out=l
        elif out.endswith('・') or out.endswith('、'): out+=l
        elif re.match(r'^(コース|科)$',l): out+=l
        else: out+='・'+l
    return N(out)
def garbage(c):
    ls=[l for l in c.split('\n') if l.strip()]
    return len(ls)>=3 and all(len(l.strip())<=2 for l in ls)
recs=[]
for b in B:
    school=b['school'].replace('高等学校','')
    course=b['course'].replace('課程','')
    if b['school']=='北星高等学校' and b.get('page')==69: course='通信制'
    req=flow(b['req'].replace('選抜において重視する要件',''))
    groups=collections.OrderedDict()
    cur=None
    for r in b['kensa']:
        if r[0].strip(): cur=dept_key(r[0]); groups.setdefault(cur,dict(kensa=[],method=[]))
        if cur is None: continue
        cells=[c for c in r[1:] if c.strip() and not garbage(c)]
        if cells:
            name=re.sub(r'\s+','',flow(cells[0])) if len(cells)>1 else ''
            body=flow(cells[-1],' ')
            groups[cur]['kensa'].append((name+'='+body) if name else body)
    cur=None
    for r in b['senbatsu']:
        if r[0].strip(): cur=dept_key(r[0]); groups.setdefault(cur,dict(kensa=[],method=[]))
        if cur is None: continue
        cells=[c for c in r[1:] if c.strip()]
        groups[cur]['method'].append(' '.join(flow(c,' ') for c in cells))
    toks=lambda k:set(t for t in re.split(r'[・/]',k) if t)
    left=[k for k,g in groups.items() if not g['kensa'] and g['method']]
    for k in left:
        tk=toks(k); hit=[k2 for k2,g2 in groups.items() if g2['kensa'] and not g2['method'] and toks(k2)&tk]
        if hit:
            for k2 in hit: groups[k2]['method']=groups[k]['method']
            del groups[k]
    for dept,g in groups.items():
        dp=dept
        if course=='定時制': dp=(dept[:-1]+'・定時制)') if dept.endswith(')') else dept+'(定時制)'
        if course=='通信制': dp=dept+'(通信制)'
        recs.append(dict(school=school,dept=dp,course=course,req=req,kensa=g['kensa'],method=g['method'],page=b['page']))
json.dump(recs,open('b2-recs.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
print(len(recs),collections.Counter(r['course'] for r in recs))
dup=collections.Counter((r['school'],r['dept']) for r in recs); print([k for k,v in dup.items() if v>1])
for r in recs[:3]+recs[40:42]:
    print(r['school'],r['dept'],'\n REQ',r['req'][:150],'\n KENSA',r['kensa'],'\n METHOD',[m[:150] for m in r['method']])
