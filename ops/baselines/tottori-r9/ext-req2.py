# 鳥取 R9 一覧表(r9-ichiran.pdf): 特色入学者選抜の『出願要件・選抜方法・出願する際の評定の目安等』の列(x=258〜507)のテキストブロックを学校ごとに集め、ブロック単位の項目リストにする。→req-blocks.json
import fitz, json, re
d = fitz.open('r9-ichiran.pdf')
FW = '０１２３４５６７８９'
def items_of(text):
    out = []
    for l in [x.strip() for x in text.split('\n') if x.strip()]:
        new = l[0] in '＜○' or (l[0] in FW and len(l) > 1 and l[1] in '　 ') or l.startswith('(') or l.startswith('（') and l[1:2] in FW or l[0] in '※・'
        if not out or new: out.append(l)
        else: out[-1] += l
    return out
res = []  # {page, school, blocks:[{x0,y0,items}]}
for pi in range(1, 10):  # 頁2〜10=全日制・定時制(頁11=定時制・通信制の別書式)
    p = d[pi]
    H = set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0] == 'l':
                a, b = it[1], it[2]
                if abs(a.y - b.y) < 0.6 and abs(a.x - b.x) > 50: H.add((round(a.y), round(min(a.x, b.x)), round(max(a.x, b.x))))
            elif it[0] == 're':
                r = it[1]
                if r.height < 1.6 and r.width > 50: H.add((round(r.y0), round(r.x0), round(r.x1)))
    ys = sorted(set(y for y, a, b in H if a <= 60 and y > 100))
    ws = p.get_text('words')
    blocks = [b for b in p.get_text('blocks') if 258 <= b[0] < 507 and b[1] > 100 and b[4].lstrip().startswith('＜')]
    for a, b in zip(ys, ys[1:]):
        school = ''.join(w[4] for w in sorted([w for w in ws if w[0] < 62 and a <= w[1] < b], key=lambda w: w[1]))
        bl = [{'x0': round(k[0]), 'y0': round(k[1]), 'items': items_of(k[4])} for k in sorted(blocks, key=lambda k: (k[0] > 300, k[1])) if a <= k[1] < b]
        res.append({'page': pi + 1, 'school': school, 'blocks': bl})
json.dump(res, open('req-blocks.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for r in res: print(r['page'], r['school'], [(b['x0'], b['y0'], b['items'][0][:8] + ('…' + b['items'][1][:14] if len(b['items']) > 1 else '')) for b in r['blocks']])

# 頁11(定時制)の特色入学者選抜の出願要件ブロック(鳥取緑風: 午前部・午後部・夜間部共通の1ブロック)
p = d[10]
tl = [b for b in p.get_text('blocks') if b[4].lstrip().startswith('＜出願要件＞')]
assert len(tl) == 1
res.append({'page': 11, 'school': '鳥取緑風(定時制)', 'blocks': [{'x0': round(tl[0][0]), 'y0': round(tl[0][1]), 'items': items_of(tl[0][4])}]})
json.dump(res, open('req-blocks.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(res[-1])
