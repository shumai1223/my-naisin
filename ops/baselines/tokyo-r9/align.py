import re,unicodedata,difflib,json,subprocess
r8=json.loads(subprocess.check_output(['node','-e',"import('./loadr8.mjs').then(m=>console.log(JSON.stringify(m.loadR8())))"]).decode('utf8'))
pages=open('r9_16.bbox.html',encoding='utf8').read().split('<page ')[1:]
r9=[]
for pi,pg in enumerate(pages,1):
    ws=[(float(m[0]),float(m[1]),unicodedata.normalize('NFKC',m[2])) for m in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>',pg)]
    for y,t in sorted((y,t) for x,y,t in ws if 205<=x<245 and re.match(r'^(男女|男|女)・\d+$',t)): r9.append((pi,round(y),t))
A=[r['n'] for r in r8]; B=[t for p,y,t in r9]
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    print(tag,'R8[%d:%d]'%(i1,i2),[f"{r['s']}/{r['k']}/{r['n']}" for r in r8[i1:i2]],'| R9',[f"p{p}:{t}" for p,y,t in r9[j1:j2]])
