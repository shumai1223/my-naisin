import sys,json,unicodedata
sys.argv=[sys.argv[0]]
from b1x import *
N=lambda s:unicodedata.normalize('NFKC',s)
MK={'○','●','集団','個人','Ⅰ','Ⅱ','Ⅲ'}

def koki_intervals(pi):
    p,V,H,D,W,ys=page_rows(pi)
    byy=collections.defaultdict(list)
    for h in H:
        if h[2]>562 and h[1]<755: byy[round(h[0])].append((max(h[1],565),min(h[2],750)))
    ky=[]
    for y,segs in sorted(byy.items()):
        segs.sort(); cov=0;cur=565
        for a,b in segs:
            if b>cur: cov+=b-max(a,cur); cur=b
        if cov>=0.9*(750-565): ky.append(y)
    ky=[y for y in ky if y>=ys[0]-2]
    out=[]
    for a,b in zip(ky,ky[1:]):
        if b-a<8: continue
        cells=collections.defaultdict(list)
        for w in sorted(W,key=lambda w:(round(w[1]),w[0])):
            yc=(w[1]+w[3])/2
            if a<=yc<b and w[0]>=562:
                c=colof((w[0]+w[2])/2)
                if c: cells[c].append(w[4])
        out.append((a,b,{k:' '.join(v) for k,v in cells.items()}))
    return out
def clean_rows(pi):
    KI=koki_intervals(pi)
    res=[];prev=None
    for r in parse(pi):
        c=r['cells']
        if c.get('dept','').startswith('学科・') or c.get('dept','')=='入学定員': continue
        dept=N(''.join(t for t in c.get('dept','').split(' ') if t not in('くくり','募集')))
        te=c.get('teiin','').split()
        mid=(r['y'][0]+r['y'][1])/2
        ki=next((x for x in KI if x[0]<=mid<x[1]),None)
        kk={k:(ki[2].get(k) if ki else None) for k in ('k_kokugo','k_suugaku','k_shakai','k_eigo','k_rika','k_jitsugi','k_mensetsu')}
        haskoki=any(v for v in kk.values())
        zen={}
        free=[]
        for k in MARK:
            pass
        for k in ('mensetsu','jiko','sakubun','shoron','jitsugi','g_kokugo','g_suugaku','g_eigo','sogo','sonota'):
            v=c.get(k)
            if not v: continue
            toks=v.split()
            marks=[t for t in toks if t in MK]
            rest=[t for t in toks if t not in MK]
            if marks: zen[k]=' '.join(marks)
            free+=rest
        row=dict(page=pi,y=r['y'],school=r['school'],dept=dept,teiin=te,bosyu=N(c.get('bosyu','')),zen=zen,free=N(''.join(free)),koki=kk if haskoki else None,diag_koki=r['diag_koki'],diag_zenki=r['diag_zenki'],inherited=False)
        row['koki_span']=(ki[0],ki[1]) if ki else None
        res.append(row)
    return res
if __name__=='__main__':
    allr=[]
    for pi in range(1,7): allr+=clean_rows(pi)
    json.dump(allr,open('b1-zen.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
    print(len(allr))
    for r in allr:
        k=r['koki']
        ks=' '.join((k[x] or '-') for x in ('k_kokugo','k_suugaku','k_shakai','k_eigo','k_rika','k_jitsugi','k_mensetsu')) if k else ('×後期なし' if r['diag_koki'] else '??')
        print(r['page'],r['school'],'|',r['dept'],r['teiin'],'|前',r['bosyu'],r['zen'],r['free'][:20],'|後',ks,'(継承)' if r['inherited'] else '')
