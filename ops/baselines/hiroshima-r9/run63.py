import json,sys
sys.path.insert(0,'.')
import gen63
E=gen63.E
prev=None
for e in E:
    if not e['school']: e['school']=prev
    else: prev=e['school']
groups=[(range(0,71),'','本校'),(range(72,73),'(全日制課程・分校)','分校'),(range(74,77),'(併設型高等学校)','併設型'),(range(84,103),'(定時制課程)','定時制'),([105,106],'(フレキシブル課程)','フレキシブル')]
E25=json.load(open('hiro25.json',encoding='utf8'))
out='';n=0;errs=[]
for e in E25:
    try:
        g=gen63.gen(e,''); out+=g; n+=g.count('selectionCategory')
    except AssertionError as ex: errs.append((e['school'],e['dept'],str(ex)[:150]))

for rg,suf,name in groups:
    for i in rg:
        try:
            g=gen63.gen(E[i],suf); out+=g; n+=g.count('selectionCategory')
        except AssertionError as ex: errs.append((i,name,E[i]['school'],E[i]['dept'],str(ex)[:150]))
open('gen63.ts.txt','w',encoding='utf8').write(out)
print(n,'records',len(errs),'errors')
for e in errs: print(e)
