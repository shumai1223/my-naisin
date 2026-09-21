import re,unicodedata,json,sys
norm=lambda s: unicodedata.normalize('NFKC',s)
rows=json.load(open('r9rows.json',encoding='utf8'))
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
anch=[]
for pi,pg in enumerate(pages,1):
    ws=[(float(m[0]),float(m[1]),norm(m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    anch+=[pi for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t))]
for p in map(int,sys.argv[1:]):
    print('=== p',p,'bbox g lines')
    ws=[(float(m[1]),float(m[0]),norm(m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pages[p-1])]
    for y,x,t in sorted(ws):
        if x>=720 and '今後' not in t and '数値' not in t: print(round(y),t)
    print('--- mine')
    for r,pp in zip(rows,anch):
        if pp==p: print(r['s'],r['k'],'|','/'.join(r['g']))
