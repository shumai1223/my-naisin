"""R1 見本1: 三重県 令和9年度 資料5〈別表3〉(1頁・3列・結合セルあり・点線の列区切りあり)

find_tables だけでは点線の列区切り(高等学校名|学科・コース名)を拾えず「神戸 普通科」が1セルに潰れるため、
行は PyMuPDF の単語座標(x で列・y で行)から作り、結合セル(選ぶ人数)の範囲は find_tables のセル矩形を使う。
"""
import json
import os
import sys

import fitz

sys.path.insert(0, os.path.dirname(__file__))
from pdfsvc import cell, inside, outside_blocks, strip_ws  # noqa: E402

SRC = 'C:/Users/E24054/my-naisin/ops/baselines/mie-r9/b001264583.pdf'

META = {
    'id': '01-mie-beppyo3',
    'title': '見本1(単純): 三重県「令和9年度 資料5〈別表3〉」 1頁・3列',
    'pref': '三重県',
    'publisher': '三重県教育委員会(三重県ホームページに掲載)',
    'doc': '令和９年度資料５＜別表３＞ 後期選抜の選抜方法の(1)において調査書の「各教科の学習の記録」等により選ぶ人数を募集定員の110%又は120%に設定する高等学校、学科・コースの一覧',
    'url': 'https://www.pref.mie.lg.jp/common/content/001264583.pdf',
    'page_url': 'https://www.pref.mie.lg.jp/TOPICS/m0045100512.htm',
    'url_check': '2026-09-26 に掲載ページを WebFetch で読み、リンク文字列「令和９年度資料５＜別表３＞」の href が /common/content/001264583.pdf であることを確認',
    'fetched': '2026-09-21(リポジトリ内の保存ファイル ops/baselines/mie-r9/b001264583.pdf の更新日時)',
    'difficulty': '単純(3列。ただし縦の結合セル2か所と、点線の列区切りがある)',
    'visual_check': '全18行と題名・注記',
    'method': [
        'PyMuPDF `find_tables()` で表の外枠・見出し行・結合セルの矩形を取得。',
        '`find_tables()` の行データは点線の列区切りを拾えず「神戸 普通科」「四日市 普通科・国際科学コース」が1セルに潰れた(見出し行以外の18行中3行)。そのため行は `get_text("words")` の単語座標から作り直した: 見出しセルのx範囲で列を決め、「学科・コース名」列の1語=1行とした。',
        '「選ぶ人数」列は find_tables の結合セル矩形(縦に6行・12行)に入る行へ値を引き継いだ。「四日市西」は2行分の結合セルなので、2行目に引き継いだ。',
        '表の外の文字(題名・※の注記)は「題名と注記」シートにそのまま入れた。',
    ],
    'limits': [
        '縦の結合セルは「全行に値を入れる」形で平らにした(Excelで絞り込み・並べ替えができるように)。引き継いだセルは灰色の斜体で区別し、検算の対象からは外している(PDFに1回しか書かれていない文字のため)。',
    ],
}


def build():
    d = fitz.open(SRC)
    p = d[0]
    t = p.find_tables().tables[0]
    hdr = t.rows[0]
    colb = [c for c in hdr.cells]  # 3列の見出しセル矩形 → 列のx範囲
    header_bbox = hdr.bbox
    columns = [strip_ws(x) for x in t.extract()[0]]
    words = [w for w in p.get_text('words') if inside(t.bbox, (w[0] + w[2]) / 2, (w[1] + w[3]) / 2, tol=0)
             and (w[1] + w[3]) / 2 > header_bbox[3]]

    def col_of(w):
        cx = (w[0] + w[2]) / 2
        for i, b in enumerate(colb):
            if b[0] <= cx <= b[2]:
                return i
        return None
    by = {0: [], 1: [], 2: []}
    for w in words:
        by[col_of(w)].append(w)
    # 列3(学科・コース名)の1行=1レコード
    recs = sorted(by[2], key=lambda w: w[1])
    # 列1の結合セル矩形(見出しより下で、列1のx範囲に左端があるセル)
    c1 = [b for b in t.cells if abs(b[0] - colb[0][0]) < 1 and b[1] >= header_bbox[3] - 0.5]
    c1_words = sorted(by[0], key=lambda w: w[1])
    used_school = set()
    used_group = set()
    rows = []
    for w in recs:
        cy = (w[1] + w[3]) / 2
        # 選ぶ人数: このレコードのyを含む列1の結合セル → その中の単語(複数語なら連結)
        gb = next(b for b in c1 if b[1] <= cy <= b[3])
        gws = [x for x in c1_words if gb[1] <= (x[1] + x[3]) / 2 <= gb[3]]
        gtext = ''.join(x[4] for x in gws)
        gbbox = (min(x[0] for x in gws), min(x[1] for x in gws), max(x[2] for x in gws), max(x[3] for x in gws))
        g_inh = gb in used_group
        used_group.add(gb)
        # 高等学校名: 同じ行にあればそれ、無ければyが最も近い単語(=縦に結合したセル)
        same = [s for s in by[1] if abs((s[1] + s[3]) / 2 - cy) < 2.5]
        s = same[0] if same else min(by[1], key=lambda s: abs((s[1] + s[3]) / 2 - cy))
        key = tuple(s[:4])
        s_inh = key in used_school
        used_school.add(key)
        rows.append([
            cell(gtext, 0, gbbox, inh=g_inh),
            cell(s[4], 0, s[:4], inh=s_inh),
            cell(w[4], 0, w[:4]),
        ])
    notes = {'name': '題名と注記', 'columns': ['頁', '本文(PDFの表の外にある文字。改行はPDFの折り返し位置)'],
             'rows': outside_blocks(p, [t.bbox], 0)}
    unused = [s[4] for s in by[1] if tuple(s[:4]) not in used_school]
    sheets = [{'name': '別表3', 'columns': columns, 'rows': rows}]
    return {'sheets': sheets, 'notes': notes, 'header_areas': [(0, header_bbox)], 'unused_school_words': unused,
            'table_bbox': t.bbox}


if __name__ == '__main__':
    r = build()
    print(json.dumps({'rows': len(r['sheets'][0]['rows']), 'unused': r['unused_school_words']}, ensure_ascii=False))
    for row in r['sheets'][0]['rows']:
        print([('*' if c['inh'] else '') + c['v'] for c in row])
