"""R1 見本3: 栃木県 令和9(2027)年度 県立高校入学者選抜「入試情報」等(一覧)(4頁・13〜14列・見出し4段)

find_tables は「学校独自検査」の4つの小列(個人面接/集団面接/プレゼンテーション/グループ討論)を1セルにまとめて
「○ ○」のように返すため、この列だけは頁の縦罫線で小列の境界を求め、単語座標で○を小列に割り当てる。
"""
import os
import re
import sys

import fitz

sys.path.insert(0, os.path.dirname(__file__))
from pdfsvc import cell, inside, outside_blocks  # noqa: E402

SRC = 'C:/Users/E24054/my-naisin/ops/baselines/tochigi-r9/r9.pdf'

META = {
    'id': '03-tochigi-nyushi-joho',
    'title': '見本3(中程度・複数頁): 栃木県「令和9(2027)年度 県立高等学校入学者選抜に係る「入試情報」等(一覧)」 4頁・約110行',
    'pref': '栃木県',
    'publisher': '栃木県教育委員会(栃木県ホームページに掲載)',
    'doc': '令和9(2027)年度県立高等学校入学者選抜に係る「学校(学科)情報・入試情報」について（一覧）',
    'url': 'https://www.pref.tochigi.lg.jp/m04/r09/documents/20260608135817.pdf',
    'page_url': 'https://www.pref.tochigi.lg.jp/m04/r09/r09kenritukoutougakkounyuugakushasennbatunikannsuruosirase.html',
    'url_check': '2026-09-26 に掲載ページを WebFetch で読み、上記リンク文字列の href が /m04/r09/documents/20260608135817.pdf であることを確認',
    'fetched': '2026-09-22(リポジトリ内の保存ファイル ops/baselines/tochigi-r9/r9.pdf の更新日時)',
    'difficulty': '中程度(4頁にまたがる。見出しが4段。1つの見出しの下に○を付ける小列が4つある。学校名が縦に結合)',
    'visual_check': '1頁目の上から12行・4頁目の全7行。2〜3頁目は検算の結果のみで、目では見ていない',
    'method': [
        'PyMuPDF `find_tables()` で各頁の表(1頁目〜3頁目=全日制・4頁目=定時制)と各セルの矩形を取得。4段の見出しは頁ごとに除き、データ行だけを1枚のシートに続けた(全日制は3頁分を1シートに)。',
        '「学校独自検査」の列は find_tables が4つの小列を1セルにまとめて「○ ○」と返した。どの小列の○かが失われるため、この列だけは頁の縦罫線(小列の境界3本)を `get_drawings()` で取り、`get_text("rawdict")` の1文字ずつの座標で○を小列に割り当てた(単語単位だと縦に並んだ○が「○○○○○○○」のように1語にまとまり、行がずれた)。また縦に結合したセルがあると find_tables の「行の矩形」が何行分にも広がるため、行の高さはその行で最も低いセルから取った。',
        'セルに引かれた斜線(該当なし・実施なしを表す図形。文字ではない)は `get_drawings()` の斜めの線で検出し、「（斜線）」と出力した。空欄と斜線を区別できるようにするため。',
        '学校名・番号が縦に結合されたセル(1校に複数学科)は、下の行に引き継いだ。',
        '学校名や学科名の字間の空白(例: 「宇 都 宮 高 校」「普 通」)は取り除いた。',
        '4頁目・学悠館高校の「フレックス特別選抜_調査書点」は、PDFのテキスト情報では U+00AD(ソフトハイフン。画面では見えないことがある文字)になっている。頁画像では横線(「－」)に見えるので、出力は「－」にした(検算はPDF側の文字で照合)。',
        '各行に「PDFの頁」列を付けた(作業側で付けた値のため照合の対象外)。',
    ],
    'mismatch_explained': [
        '「題名と注記」シートの「別添」(1頁目右上の囲み)は、検算側の pdftotext が読み取れなかった(「Missing language pack for Adobe-Japan1」= この文字のフォントに文字コードの対応表が無く、poppler に日本語の追加データが入っていないため)。PyMuPDF は「別添」と読み、頁画像でも「別添」と書かれていることを目で確認した。表の中の文字ではこの問題は起きていない。',
    ],
    'limits': [
        '最上段の見出し「学力検査と調査書の評定等の比重」は長いため、列名では「特色選抜_学力点」のように下の段の見出しだけを使った。見出しの確認で「列名に現れない文字」として出ている字はこのため(見出しの確認の欄を参照)。',
        '空欄(4頁目で、フレックス特別選抜を実施しない学校の欄など)は空のまま出力した。「実施しない」などの意味づけはしていない。',
    ],
}

ZEN_COLS = ['番号', '学校名', '学科名(系・科)', '男女', '特色選抜_学力点', '特色選抜_調査書点', '特色選抜_独自検査点',
            '一般選抜_学力点', '一般選抜_調査書点', '特色選抜の定員の割合', '学校独自検査_個人面接', '学校独自検査_集団面接',
            '学校独自検査_プレゼンテーション', '学校独自検査_グループ討論', '自己表現シート・学校独自質問の有無',
            '一般選抜_傾斜配点', 'PDFの頁']
TEI_COLS = ['番号', '学校名', '学科名(系・科)', '男女', 'フレックス特別選抜_調査書点', 'フレックス特別選抜_面接点',
            'フレックス特別選抜_作文点', '一般選抜_学力点', '一般選抜_調査書点', '一般選抜_面接点', '特別選抜の定員の割合',
            '学校独自検査_個人面接', '学校独自検査_作文', '一般選抜_学力検査実施教科', 'PDFの頁']

SPLIT_COL = 10  # 全日制の「学校独自検査」列


def vlines_in(p, x0, x1):
    xs = set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0] == 'l' and abs(it[1].x - it[2].x) < 0.5 and x0 + 1 < it[1].x < x1 - 1:
                xs.add(round(it[1].x, 1))
            elif it[0] == 're' and it[1].width < 1.5 and x0 + 1 < it[1].x0 < x1 - 1:
                xs.add(round(it[1].x0, 1))
    return sorted(xs)


def clean(v):
    return re.sub(r'\s+', '', v or '')


def build():
    d = fitz.open(SRC)
    zen, tei, header_areas, table_bbs = [], [], [], {}
    for pi, p in enumerate(d):
        t = p.find_tables().tables[0]
        table_bbs[pi] = t.bbox
        data = t.extract()
        header_areas.append((pi, tuple(fitz.Rect(t.rows[0].bbox) | fitz.Rect(t.rows[3].bbox))))
        # 単語単位だと縦に並んだ○が1語(『○○○○○○○』)にまとまることがあるため、1文字ずつの座標を使う
        chars = [(ch['bbox'], ch['c']) for b in p.get_text('rawdict')['blocks'] for l in b.get('lines', [])
                 for sp in l['spans'] for ch in sp['chars'] if ch['c'].strip()]
        split = None
        if pi < 3:
            c = t.rows[4].cells[SPLIT_COL]
            xs = vlines_in(p, c[0], c[2])
            assert len(xs) == 3, (pi, xs)
            split = [c[0]] + xs + [c[2]]
        # 斜線(セルを斜めに横切る線)= PDFでは文字ではなく図形。セルごとに有無を調べる
        diags = []
        for dr in p.get_drawings():
            for it in dr['items']:
                if it[0] == 'l' and abs(it[1].x - it[2].x) > 3 and abs(it[1].y - it[2].y) > 3:
                    diags.append(fitz.Rect(it[1], it[2]).normalize())

        def has_diag(bb):
            r = fitz.Rect(bb)
            return any(r.contains(fitz.Point((g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2)) and g.width > r.width * 0.5 for g in diags)
        prev = None
        for ri in range(4, len(t.rows)):
            row = []
            # 行の高さ: 縦に結合したセルがあると rows[ri].bbox が何行分にも広がるため、最も低いセルの高さを使う
            hs = [c for c in t.rows[ri].cells if c is not None]
            ymin = min(hs, key=lambda c: c[3] - c[1])
            ry0, ry1 = ymin[1], ymin[3]
            for ci, bb in enumerate(t.rows[ri].cells):
                v = data[ri][ci]
                if ci == SPLIT_COL and split:
                    y0, y1 = ry0, ry1
                    for k in range(4):
                        sb = (split[k], y0, split[k + 1], y1)
                        cs = [c for bb2, c in sorted(chars, key=lambda z: z[0][0])
                              if inside(sb, (bb2[0] + bb2[2]) / 2, (bb2[1] + bb2[3]) / 2, tol=0)]
                        row.append(cell(''.join(cs), pi, sb))
                    continue
                if bb is None or v is None:
                    k = len(row)
                    row.append(cell(prev[k]['v'] if prev else '', pi, None, inh=True))
                    continue
                if not clean(v) and has_diag(bb):
                    row.append(cell('（斜線）', pi, bb, verify_as='',
                                    note='PDFではセルに斜線が引かれている(文字ではなく図形)'))
                elif v == '\xad':
                    row.append(cell('－', pi, bb, verify_as='\xad',
                                    note='頁画像では横線に見えるため「－」で出力'))
                else:
                    row.append(cell(clean(v), pi, bb))
            row.append(cell(str(pi + 1), meta=True))
            (zen if pi < 3 else tei).append(row)
            prev = row
    notes_rows = []
    for pi, p in enumerate(d):
        notes_rows += outside_blocks(p, [table_bbs[pi]], pi)
    notes = {'name': '題名と注記', 'columns': ['頁', '本文(PDFの表の外にある文字)'], 'rows': notes_rows}
    sheets = [{'name': '全日制', 'columns': ZEN_COLS, 'rows': zen},
              {'name': '定時制', 'columns': TEI_COLS, 'rows': tei}]
    # 自己整合: 番号が 1 から欠けずに続くか
    checks = []
    for s in sheets:
        nums = [int(r[0]['v']) for r in s['rows'] if not r[0]['inh']]
        ok = nums == list(range(1, len(nums) + 1))
        checks.append((f'シート「{s["name"]}」の番号が1から欠けずに続く', ok, f'学校数 {len(nums)}(1〜{max(nums)})・行数 {len(s["rows"])}'))
    # 自己整合: 「特色選抜の定員の割合」が入っている行は、学校独自検査のどれかに○がある(全日制)
    bad = [r[1]['v'] + r[2]['v'] for r in zen if r[9]['v'] and not any(r[k]['v'] for k in range(10, 14))]
    kei = [r[15]['v'] for r in zen]
    checks.append(('全日制: 一般選抜_傾斜配点は全行が「（斜線）」か教科名(空欄の行が無い)', all(kei),
                   f"斜線 {kei.count('（斜線）')}行・教科名 {sum(1 for k in kei if k and k != '（斜線）')}行"))
    checks.append(('全日制: 特色選抜の定員の割合がある行には学校独自検査の○が1つ以上ある', not bad,
                   f'{len(zen)}行を確認' + (f'・該当しない行 {bad}' if bad else '')))
    return {'sheets': sheets, 'notes': notes, 'header_areas': header_areas, 'self_checks': checks}


if __name__ == '__main__':
    r = build()
    for s in r['sheets']:
        print('==', s['name'], len(s['rows']))
        for row in s['rows'][:12]:
            print([('*' if c['inh'] else '') + c['v'] for c in row])
    print(r['self_checks'])
