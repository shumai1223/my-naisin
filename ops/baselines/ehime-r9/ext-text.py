# 愛媛 R9(file2829.pdf・全67頁・各頁=1行[学校×学科]): 出願資格・検査概要・備考の列(x=345〜640)と『入学時に求める生徒像』の列(x=95〜250)の本文を頁ごとに抽出する。→ pages-text.json
import fitz, re, json
d = fitz.open('file2829.pdf')
FW = '０１２３４５６７８９'
def lines_of(ws):
    rows = []
    for w in sorted(ws, key=lambda w: (round(w[1]), w[0])):
        for r in rows:
            if abs(r['y'] - w[1]) < 3.5: r['w'].append(w); break
        else: rows.append({'y': w[1], 'w': [w]})
    out = []
    for r in sorted(rows, key=lambda r: r['y']):
        ww = sorted(r['w'], key=lambda w: w[0])
        first = ww[0][4]
        sep = ' ' if len(first) <= 2 and first[0] in FW and len(ww) > 1 else ''
        out.append((ww[0][0], first + sep + ''.join(w[4] for w in ww[1:]), first))
    return out
def newitem(first, txt):
    return first[0] in '○＜・※⑴⑵⑶⑷⑸⑹⑺' or (first[0] in FW and len(first) <= 2) or first.startswith('（') and first[1:2] in FW or txt.startswith('文化・スポーツ活動の取組・成果等を重視した選抜')
def join_items(lines):
    items = []
    for x0, txt, first in lines:
        if not items or newitem(first, txt): items.append(txt)
        else: items[-1] += txt
    return items
res = {}
for pi in range(2, len(d)):
    p = d[pi]
    ws = [w for w in p.get_text('words') if w[1] > 120 and w[1] < 560]
    main = [w for w in ws if 338 <= w[0] < 645]
    seito = [w for w in ws if 95 <= w[0] < 250]
    res[pi + 1] = {'main': join_items(lines_of(main)), 'seito': join_items(lines_of(seito))}
json.dump(res, open('pages-text.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for k in (3, 16, 40):
    print('== p', k); 
    for l in res[k]['main']: print(l)
    print('-- seito'); 
    for l in res[k]['seito']: print(l)

# ---- 行帯(学校×学科)ごとの分割: 『入学時に求める生徒像』列の水平線(x=95〜250)を行の境界とする(頁内に複数行ある頁がある) ----
def hlines(p):
    H = set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0] == 'l':
                a, b = it[1], it[2]
                if abs(a.y - b.y) < 0.6 and abs(a.x - b.x) > 150: H.add((round(a.y), round(min(a.x, b.x)), round(max(a.x, b.x))))
            elif it[0] == 're':
                r = it[1]
                if r.height < 1.6 and r.width > 150: H.add((round(r.y0), round(r.x0), round(r.x1)))
    return H
rowsout = []
for pi in range(2, len(d)):
    p = d[pi]
    ys = sorted(set(y for y, a, b in hlines(p) if a == 95 and b == 250 and y > 100))
    bands = list(zip(ys, ys[1:])) or [(100, 560)]  # 境界線が取れない16頁は1頁1行(data-r9.mjsのコメントp番号と件数一致を検査)
    ws = p.get_text('words')
    hx = [w[0] for w in ws if w[4] == '＜出願資格＞']
    lo = (min(hx) - 3) if hx else 338  # 頁により本文列の左端が違う(宇和島東等はx=325)
    for a, b in bands:
        main = [w for w in ws if lo <= w[0] < 645 and a <= w[1] < b]
        seito = [w for w in ws if 95 <= w[0] < 250 and a <= w[1] < b and not (w[4].isdigit() and w[0] > 235)]
        mi = join_items(lines_of(main)); si = join_items(lines_of(seito))
        # 文化・スポーツ選抜の見出し行(末尾)は比重・人数が別に収録済みなので落とす
        mi = [x for x in mi if not x.startswith('文化・スポーツ活動の取組・成果等を重視した選抜') or len(x) > 60]
        rowsout.append({'page': pi + 1, 'main': mi, 'seito': si})
json.dump(rowsout, open('rows-text.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
import collections
print(len(rowsout), collections.Counter(r['page'] for r in rowsout).most_common(4))
print([r['page'] for r in rowsout if not r['main'] or not r['seito']])
