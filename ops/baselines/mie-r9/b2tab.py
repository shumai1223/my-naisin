import fitz,re,json,unicodedata,collections
d=fitz.open('b001264582.pdf')
def cl(s): return re.sub(r'\s+','',s or '')
def cell(s): return '\n'.join(l.strip() for l in (s or '').split('\n') if l.strip())
blocks=[];cur=None;course='全日制';lastkind=None;inreq=False
for pi in range(len(d)):
    p=d[pi]
    tabs=[t for t in p.find_tables().tables]
    def intab(b):
        cy=(b[1]+b[3])/2; cx=(b[0]+b[2])/2
        return any(t.bbox[0]<=cx<=t.bbox[2] and t.bbox[1]<=cy<=t.bbox[3] for t in tabs)
    ev=[]
    for b in p.get_text('blocks'):
        t=b[4]
        if intab(b): continue
        for m in re.finditer(r'《(.+?)》',t): ev.append(('h',b[1],m.group(1)))
        for m in re.finditer(r'^\s*(定時制課程|通信制課程)\s*$',t,re.M): ev.append(('c',b[1]+0.001,m.group(1)))
        if '選抜において重視する要件' in t: ev.append(('rq',b[1],t))
        elif ev==[] or ev[-1][0] not in('h',) : ev.append(('x',b[1],t))
        else: ev.append(('x',b[1],t))
    ev+= [('t',t.bbox[1],t) for t in tabs]
    ev.sort(key=lambda e:e[1])
    for kind,y,obj in ev:
        if kind=='h':
            cur=dict(school=obj,course=course,page=pi+1,kensa=[],senbatsu=[],req=''); blocks.append(cur); inreq=False; lastkind=None
        elif kind=='c': course=obj
        elif kind=='rq':
            inreq=True
            if cur is not None: cur['req']+=obj+'\n'
        elif kind=='x':
            if inreq and cur is not None and '《' not in obj and '資料４' not in obj: cur['req']+=obj+'\n'
        else:
            inreq=False
            for r in obj.extract():
                h0=cl(r[0]); h1=cl(r[1]) if len(r)>1 else ''
                if h0 in('学科名','学科・コース名') and (h1.startswith('検査') or h1.startswith('選抜方法')):
                    lastkind='kensa' if h1.startswith('検査') else 'senbatsu'; continue
                if lastkind is None or cur is None: continue
                cur[lastkind].append([cell(c) for c in r])
merged=[]
for b in blocks:
    if merged and merged[-1]['school']==b['school'] and merged[-1]['course']==b['course']:
        m=merged[-1]; m['kensa']+=b['kensa']; m['senbatsu']+=b['senbatsu']; m['req']+=b['req']; m['page2']=b['page']
    else: merged.append(b)
blocks=merged
if __name__=='__main__':
    print(len(blocks))
    for b in blocks: print(b['school'],b['course'],b['page'],len(b['kensa']),len(b['senbatsu']),len(b['req']))
    json.dump(blocks,open('b2-tab.json','w',encoding='utf8'),ensure_ascii=False)
