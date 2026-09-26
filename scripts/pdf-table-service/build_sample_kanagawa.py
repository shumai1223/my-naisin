"""R1 見本2: 神奈川県 令和9年度 選考基準「定通分割選抜(定時制・通信制)」(1頁・小さな表6つ+文章の表1つ)

表が区分(定時制 普通科/専門学科…)ごとに6つに分かれ、区分名は表の外(直上)に書かれている。
→ 6つの表を1枚のシートにまとめ、直上の区分名を「区分」列に入れる。
通信制の表はセルの中身が文章(選考方法・評価の観点)なので、改行はPDFの折り返し位置のまま残す。
"""
import os
import sys

import fitz

sys.path.insert(0, os.path.dirname(__file__))
from pdfsvc import cell, inside, strip_ws  # noqa: E402

SRC = 'C:/Users/E24054/my-naisin/ops/baselines/kanagawa-r9/05_bunkatsu.pdf'

META = {
    'id': '02-kanagawa-bunkatsu',
    'title': '見本2(中程度): 神奈川県「令和9年度 定通分割選抜(定時制・通信制)」 1頁・区分ごとに分かれた表7つ',
    'pref': '神奈川県',
    'publisher': '神奈川県教育委員会(神奈川県ホームページに掲載)',
    'doc': '令和9年度神奈川県公立高等学校入学者選抜 選考基準「定通分割選抜（定時制・通信制）」',
    'url': 'https://www.pref.kanagawa.jp/documents/63368/05_bunkatsu.pdf',
    'page_url': 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/senko_kijun.html',
    'url_check': 'リポジトリに保存した掲載ページ(ops/baselines/kanagawa-r9/hub.html・ページの更新日 2026年6月5日)のリンク「定通分割選抜（定時制・通信制）（PDF：136KB）」の href が /documents/63368/05_bunkatsu.pdf',
    'fetched': '2026-09-22(リポジトリ内の保存ファイル ops/baselines/kanagawa-r9/05_bunkatsu.pdf の更新日時)',
    'difficulty': '中程度(区分ごとに表が6つに分かれ、区分名が表の外にある。見出しが2段で縦書き。通信制の表はセルが文章)',
    'visual_check': '定時制19行・通信制2行の全行',
    'method': [
        'PyMuPDF `find_tables()` で頁の表7つを検出(定時制6・通信制1)。各セルの矩形も一緒に取得。',
        '定時制の6つの表は列が同じなので1枚のシート「定時制」にまとめ、各表の直上にある区分名(例: 「単位制による定時制　普通科」)を「区分」列に入れた。区分名は各区分の最初の行だけがPDFの文字で、2行目以降は引き継ぎ。',
        '2段の見出し(「比率」の下に縦書きの「学習の記録(評定)」「学力検査」「特色検査」)は「比率_学習の記録(評定)」のように1行の列名にまとめた。',
        '学校名が縦に結合されたセル(神奈川工業の3学科)は、下の行に学校名を引き継いだ。',
        '定時制の学校名・学科名のセル内改行(例: 「川崎市立／川崎総合科学」)は取り除いて1行にした。通信制の文章セルは改行を残した(Excelではセル内改行として表示)。',
    ],
    'limits': [
        '通信制の「選考方法」などの文章セルの改行は、PDFの折り返し位置そのままで、文の区切りとは一致しない(例: 「(W－24」で改行)。意味の区切りで改行し直す作業はしていない。',
        '見出しの「〔 〕」の括弧はPDFでは文字ではなく図形で描かれているため、列名には入れていない。',
    ],
}

TEIJI_COLS = ['区分', '学校名', '学科名等', '学力検査', '特色検査',
              '比率_学習の記録(評定)', '比率_学力検査', '比率_特色検査', '重点化([調]は調査書・[学]は学力検査)']
TSUSHIN_COLS = ['区分', '学校名', '学科名等', '実施する検査', '選考方法', '評価の観点', '検査の概要', '提出書類']


def page_lines(p, table_bboxes):
    out = []
    for b in p.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            x0, y0, x1, y1 = l['bbox']
            t = ''.join(s['text'] for s in l['spans'])
            if not strip_ws(t):
                continue
            if any(inside(B, (x0 + x1) / 2, (y0 + y1) / 2, tol=0) for B in table_bboxes):
                continue
            out.append((x0, y0, x1, y1, t))
    return out


def rows_of(t, first_data_row, keep_newline):
    """find_tables の表 → [[cell]]。結合セルの続き(None)は上の値を引き継ぐ。"""
    data = t.extract()
    rows = []
    prev = None
    for ri in range(first_data_row, len(t.rows)):
        bbs = t.rows[ri].cells
        row = []
        for ci, bb in enumerate(bbs):
            v = data[ri][ci]
            if bb is None or v is None:
                pv = prev[ci]['v'] if prev else ''
                row.append(cell(pv, 0, None, inh=True))
            else:
                v = v if keep_newline else v.replace('\n', '')
                row.append(cell(v.strip(), 0, bb))
        rows.append(row)
        prev = row
    return rows


def build():
    d = fitz.open(SRC)
    p = d[0]
    tabs = p.find_tables().tables
    assert len(tabs) == 7, len(tabs)
    tb = [t.bbox for t in tabs]
    lines = page_lines(p, tb)
    titles = [l for l in lines if l[4].startswith('【')]
    heads = [l for l in lines if not l[4].startswith('【')]

    def heading_for(t):
        cands = [h for h in heads if h[3] <= t.bbox[1] + 0.5]
        return max(cands, key=lambda h: h[3])

    teiji = []
    header_areas = []
    for i, t in enumerate(tabs[:6]):
        first = 2 if i == 0 else 0
        if i == 0:
            hb = fitz.Rect(t.rows[0].bbox) | fitz.Rect(t.rows[1].bbox)
            header_areas.append((0, tuple(hb)))
        h = heading_for(t)
        for k, row in enumerate(rows_of(t, first, keep_newline=False)):
            kubun = cell(h[4].replace('\u3000', '　'), 0, h[:4], inh=(k > 0))
            teiji.append([kubun] + row)
    t = tabs[6]
    header_areas.append((0, tuple(t.rows[0].bbox)))
    h = heading_for(t)
    tsushin = []
    for k, row in enumerate(rows_of(t, 1, keep_newline=True)):
        tsushin.append([cell(h[4], 0, h[:4], inh=(k > 0))] + row)
    notes = {'name': '題名', 'columns': ['頁', '本文(PDFの表の外にある題名)'],
             'rows': [[cell('1', meta=True), cell(l[4], 0, l[:4])] for l in titles]}
    sheets = [{'name': '定時制', 'columns': TEIJI_COLS, 'rows': teiji},
              {'name': '通信制', 'columns': TSUSHIN_COLS, 'rows': tsushin}]
    # 自己整合: 比率の「学習の記録」+「学力検査」= 10(神奈川の比率は合計10で表す)
    bad = []
    for r in teiji:
        a, b = r[5]['v'], r[6]['v']
        if not (a.isdigit() and b.isdigit() and int(a) + int(b) == 10):
            bad.append((r[1]['v'], a, b))
    checks = [('比率「学習の記録(評定)」+「学力検査」=10(定時制の全行)', not bad,
               f'{len(teiji)}行中 {len(teiji) - len(bad)}行が10' + (f'・合わない行 {bad}' if bad else ''))]
    return {'sheets': sheets, 'notes': notes, 'header_areas': header_areas, 'self_checks': checks}


if __name__ == '__main__':
    r = build()
    for s in r['sheets']:
        print('==', s['name'], len(s['rows']))
        for row in s['rows']:
            print([('*' if c['inh'] else '') + c['v'].replace('\n', '/') for c in row])
    print(r['self_checks'])
