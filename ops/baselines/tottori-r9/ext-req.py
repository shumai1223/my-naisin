# 鳥取 R9 一覧表(r9-ichiran.pdf・全11頁): 特色入学者選抜の『出願要件・選抜方法・出願する際の評定の目安等』の列(x=258〜505)を行帯ごとに抽出する。行帯は全幅の水平線(x0<=60)の間隔。学校名は左端(x<62)の縦書き文字。→req-rows.json
import fitz, json, re
d = fitz.open('r9-ichiran.pdf')
rows = []
for pi in range(1, len(d)):
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
    for a, b in zip(ys, ys[1:]):
        req = [w for w in ws if 258 <= w[0] < 507 and a <= w[1] < b]
        school = ''.join(w[4] for w in sorted([w for w in ws if w[0] < 62 and a <= w[1] < b], key=lambda w: w[1]))
        lines = []
        for w in sorted(req, key=lambda w: (round(w[1]), w[0])):
            if lines and abs(lines[-1][0] - w[1]) < 3: lines[-1][1].append(w[4])
            else: lines.append([w[1], [w[4]]])
        rows.append({'page': pi + 1, 'y': [a, b], 'school': school, 'lines': [''.join(l[1]) for l in lines]})
json.dump(rows, open('req-rows.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(rows))
for r in rows: print(r['page'], r['y'], r['school'], len(r['lines']), r['lines'][0][:30] if r['lines'] else None)
