# 埼玉 R9 個票(kohyo/*.pdf・154本・187頁=概要一覧の共通109+特色69+両方9頁): 各頁は同じ書式の表。全幅の水平線で行帯(目指す学校像/入学者の受入れに関する方針/募集学科等/選抜の種類/学力検査/調査書/面接/特色検査/選抜資料配点/第2志望/その他)に分け、
# 行帯の見出し(x<108)で種別を確定し、値の本文(x>=110、面接・特色検査の小項目は x>=155)を抽出する。→kohyo-pages.json
import fitz, glob, json, re, os
FW = '０１２３４５６７８９'
def fullwidth_lines(p):
    H = set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0] == 'l':
                a, b = it[1], it[2]
                if abs(a.y - b.y) < 0.6: H.add((round(a.y, 1), min(a.x, b.x), max(a.x, b.x)))
            elif it[0] == 're':
                r = it[1]
                if r.height < 1.6: H.add((round(r.y0, 1), r.x0, r.x1))
                elif r.width > 20 and r.height > 8: H.add((round(r.y0, 1), r.x0, r.x1)); H.add((round(r.y1, 1), r.x0, r.x1))
    return H
def lines_of(ws):
    rows = []
    for w in sorted(ws, key=lambda w: (round(w[1]), w[0])):
        for r in rows:
            if abs(r['y'] - w[1]) < 3: r['w'].append(w); break
        else: rows.append({'y': w[1], 'w': [w]})
    return [(r['y'], ''.join(w[4] for w in sorted(r['w'], key=lambda w: w[0]))) for r in sorted(rows, key=lambda r: r['y'])]
def text_of(ws, joiner=''):
    ls = [t for y, t in lines_of(ws)]
    out = []
    for t in ls:
        if not out or t[0] in '・①②③④⑤⑥⑦⑧⑨●○※＜': out.append(t)
        else: out[-1] += t
    return out
LABELS = ['目指す学校像', '入学者の受入れ', '募集学科等', '選抜の種類', '学力検査', '調査書', '面接', '特色検査', '選抜資料', '第２志望', 'その他']
def parse(path, pi):
    d = fitz.open(path); p = d[pi]
    ws = p.get_text('words')
    Hh = fullwidth_lines(p)
    xs0 = sorted(x0 for y, x0, x1 in Hh if 60 < x0 < 130 and x1 >= 540)
    LB0 = xs0[len(xs0) // 2]
    full = sorted(set(y for y, a, b in Hh if a <= 55 and b >= 540))
    kind = re.search(r'実施内容（(.+?)）', p.get_text()).group(1)
    # 行帯: 全幅線の間。見出し語(x<108)を含む帯にラベルを付ける
    bands = []
    for a, b in zip(full, full[1:]):
        if b - a < 8: continue
        labw = [w for w in ws if w[0] < LB0 - 3 and a <= w[1] < b]
        lab = ''.join(w[4] for w in sorted(labw, key=lambda w: (round(w[1]), w[0])))
        name = next((L for L in LABELS if lab.startswith(L) or L in lab), None)
        bands.append({'a': a, 'b': b, 'label': name, 'raw': lab})
    return kind, ws, bands, p
if __name__ == '__main__':
    import sys
    for path, pi in (('012_iwatsuki_r9.pdf', 1), ('001_ageo_zen_r9.pdf', 0)):
        kind, ws, bands, p = parse('kohyo/' + path, pi)
        print(path, kind)
        for b in bands: print('  ', round(b['a']), round(b['b']), b['label'], b['raw'][:20])

def labcol(H):
    xs = sorted(x0 for y, x0, x1 in H if 60 < x0 < 130 and x1 >= 540)
    return xs[len(xs) // 2]  # ラベル列の右端(行の見出し列の幅)
def subrows(ws, H, a, b, LB):
    seps = sorted(set(y for y, x0, x1 in H if a + 4 < y < b - 4 and LB - 4 <= x0 <= LB + 4 and x1 >= 540))
    cuts = [a] + seps + [b]
    out = []
    for c0, c1 in zip(cuts, cuts[1:]):
        lab = ''.join(w[4] for w in sorted([w for w in ws if LB - 4 <= w[0] < LB + 30 and c0 <= w[1] < c1], key=lambda w: (round(w[1]), w[0])))
        out.append((lab, c0, c1))
    return out
def extract(path, pi):
    kind, ws, bands, p = parse(path, pi)
    H = fullwidth_lines(p)
    both = kind == '特色・共通'
    LB = labcol(H)
    MID = (min(x0 for y, x0, x1 in H if x1 >= 540 and x0 < 60) + max(x1 for y, x0, x1 in H)) / 2  # 表の左右中央(第1次/第2次の列境界)
    rec = {'kind': kind}
    # 表題行: 課程・学校名・学科
    t = [w for w in ws if 62 <= w[1] < 86]
    VX = set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0] == 'l':
                a, b = it[1], it[2]
                if abs(a.x - b.x) < 0.6 and 60 < min(a.y, b.y) < 70 and abs(a.y - b.y) > 12: VX.add(round(a.x))
            elif it[0] == 're':
                r = it[1]
                if r.width < 1.6 and 60 < r.y0 < 70 and r.height > 12: VX.add(round(r.x0))
    VX = sorted(VX)
    cx1, cx2 = (VX[1], VX[2]) if len(VX) >= 4 else (130, 400)  # 表題行の縦線: 課程|学校名|学科
    rec['course'] = ''.join(w[4] for w in sorted([w for w in t if w[0] < cx1], key=lambda w: w[0]))
    rec['school'] = ''.join(w[4] for w in sorted([w for w in t if cx1 <= w[0] < cx2], key=lambda w: w[0]))
    rec['dept'] = ''.join(w[4] for w in sorted([w for w in t if w[0] >= cx2], key=lambda w: (round(w[1] / 4), w[0])))
    for b in bands:
        L = b['label']
        if L in ('目指す学校像', '入学者の受入れ'):
            rec['gakkozo' if L == '目指す学校像' else 'ap'] = text_of([w for w in ws if w[0] >= LB - 2 and b['a'] <= w[1] < b['b']])
        elif L == '面接':
            for lab, c0, c1 in subrows(ws, H, b['a'], b['b'], LB):
                key = 'itv_method' if lab.startswith('実施方法') else 'itv_self' if lab.startswith('自己評価') else 'itv_kanten' if lab.startswith('評価の観点') else 'itv_kijun' if lab.startswith('評価規準') else 'itv_' + lab
                rec[key] = text_of([w for w in ws if w[0] >= LB + 30 and c0 <= w[1] < c1])
                # ラベル語と値の先頭が1語に連結して出る頁(『学校独自項目設定なし』『学校独自項目生物・環境系…』): ラベルを除いた残りを値の先頭に戻す
                extra = lab
                for kw in ('実施方法', '自己評価資料', '学校独自項目', '評価の観点', '評価規準', '実施内容'):
                    extra = extra.replace(kw, '')
                extra = extra.replace('　', '').strip()
                if extra:
                    if rec[key] and rec[key][0][0] not in '・①②③④⑤⑥⑦⑧⑨●○※＜': rec[key][0] = extra + rec[key][0]
                    else: rec[key].insert(0, extra)
        elif L == '特色検査':
            for lab, c0, c1 in subrows(ws, H, b['a'], b['b'], LB):
                key = 'toku_content' if lab.startswith('実施内容') else 'toku_kanten' if lab.startswith('評価の観点') else 'toku_' + lab
                hi = MID if both else 9999
                rec[key] = text_of([w for w in ws if LB + 30 <= w[0] < hi and c0 <= w[1] < c1])
        elif L == '第２志望':
            rec['second'] = text_of([w for w in ws if w[0] >= LB - 2 and b['a'] <= w[1] < b['b']])
        elif L == 'その他':
            rec['other'] = text_of([w for w in ws if w[0] >= LB - 2 and b['a'] <= w[1] < b['b']])
    return rec
if __name__ == '__main__' and len(sys.argv) > 1:
    pass
