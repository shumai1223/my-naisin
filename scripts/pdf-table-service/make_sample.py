"""見本(または納品物)の3点セットを作る: 頁画像PNG・Excel(+CSV)・検算レポート(.md)

python scripts/pdf-table-service/make_sample.py build_sample_mie <出力先フォルダ>
builder モジュールは SRC・META・build() を持つこと(build_sample_*.py を参照)。
"""
import importlib
import os
import shutil
import sys
import tempfile
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fitz  # noqa: E402
from pdfsvc import (render_pages, report_md, sha256, strip_ws, verify, write_csvs,  # noqa: E402
                    write_xlsx)


def main(modname, outdir):
    t0 = time.time()
    mod = importlib.import_module(modname)
    M = mod.META
    os.makedirs(outdir, exist_ok=True)
    r = mod.build()
    sheets, notes = r['sheets'], r['notes']
    work = tempfile.mkdtemp(prefix='pdfsvc-')
    res = verify(mod.SRC, sheets, r['header_areas'], work, notes_sheet=notes)
    # 陰性対照: わざと誤りを入れた出力で検算が食い違いを出すか(検算が「何でも0件」になっていないことの確認)
    import copy
    mut_results = []
    data_cells = [(si, ri, ci) for si, s in enumerate(sheets) for ri, row in enumerate(s['rows'])
                  for ci, ce in enumerate(row) if not ce['inh'] and ce['bbox'] and len(strip_ws(ce['v'])) >= 1]
    if data_cells:
        pick = data_cells[len(data_cells) // 2]
        kinds = []
        s2 = copy.deepcopy(sheets); ce = s2[pick[0]]['rows'][pick[1]][pick[2]]
        v = ce['verify_as'] if ce['verify_as'] is not None else ce['v']
        ce['verify_as'] = None; ce['v'] = v[:-1] + ('0' if v[-1] != '0' else '1')
        kinds.append(('1文字を別の文字に置き換え', s2))
        s3 = copy.deepcopy(sheets); ce = s3[pick[0]]['rows'][pick[1]][pick[2]]
        v = ce['verify_as'] if ce['verify_as'] is not None else ce['v']
        ce['verify_as'] = None; ce['v'] = v + v[-1]
        kinds.append(('1文字を重複させる', s3))
        # 同じ行で中身の違う2セルの値を入れ替え
        row = sheets[pick[0]]['rows'][pick[1]]
        pair = [ci for ci, c in enumerate(row) if not c['inh'] and c['bbox'] and strip_ws(c['v'])]
        pair2 = [(a, b) for a in pair for b in pair if a < b and strip_ws(row[a]['v']) != strip_ws(row[b]['v'])]
        if pair2:
            a, b = pair2[0]
            s4 = copy.deepcopy(sheets); rr = s4[pick[0]]['rows'][pick[1]]
            rr[a]['v'], rr[b]['v'] = rr[b]['v'], rr[a]['v']
            rr[a]['verify_as'] = rr[b]['verify_as'] = None
            kinds.append(('同じ行の2セルの値を入れ替え', s4))
        for name, sx in kinds:
            rx = verify(mod.SRC, sx, r['header_areas'], work, notes_sheet=notes)
            mut_results.append((name, len(rx['mismatch']) - len(res['mismatch'])))
    pngs = render_pages(mod.SRC, outdir, dpi=100, prefix='pdf-page')
    npages = len(fitz.open(mod.SRC))
    src_lines = [
        f"出典: {M['publisher']}「{M['doc']}」",
        f"URL: {M['url']}",
        f"掲載ページ: {M['page_url']}",
        f"取得日: {M['fetched']}",
        '作成: My Naishin 運営(PDFの文字をプログラムで取り出し、別のプログラムで1セルずつ照合)',
        '凡例: 灰色の斜体のセル = PDFでは縦に結合されたセルの値を、下の行にも引き継いで入れたもの',
        '注意: 値は公表PDFの文字をそのまま写したもので、内容の正しさ(入試制度の解釈)は保証しません。最新の情報は必ず元のPDFで確認してください。',
    ]
    xlsx = M['id'] + '.xlsx'
    write_xlsx(os.path.join(outdir, xlsx), sheets, notes, src_lines)
    csvs = write_csvs(outdir, sheets)
    elapsed = time.time() - t0
    shutil.copy(res['bbox_file'], os.path.join(work, 'keep.bbox.html'))

    L = []
    L.append(f"# {M['title']}")
    L.append('')
    L.append('## 出典')
    L.append('')
    L.append('| 項目 | 内容 |')
    L.append('|---|---|')
    L.append(f"| 県 | {M['pref']} |")
    L.append(f"| 発行元 | {M['publisher']} |")
    L.append(f"| 資料名 | {M['doc']} |")
    L.append(f"| PDFのURL | {M['url']} |")
    L.append(f"| 掲載ページ | {M['page_url']} |")
    L.append(f"| URLの確認 | {M['url_check']} |")
    L.append(f"| 取得日 | {M['fetched']} |")
    L.append(f"| 頁数 | {npages}頁 |")
    L.append(f"| PDFのSHA-256 | `{sha256(mod.SRC)}` |")
    L.append(f"| 難しさ | {M['difficulty']} |")
    L.append('')
    L.append('元のPDFは改変していない(読み取りのみ)。このフォルダには元PDFのコピーを置かず、頁画像(100dpi)だけを置いた。')
    L.append('')
    L.append('## このフォルダの3点セット')
    L.append('')
    L.append('| 種類 | ファイル |')
    L.append('|---|---|')
    L.append('| 変換前(PDFの頁画像) | ' + '・'.join(f'`{p}`' for p in pngs) + ' |')
    L.append(f'| 変換後(Excel) | `{xlsx}`(シート: ' + '・'.join(s['name'] for s in sheets) + f"・{notes['name']}・出典と凡例) |")
    L.append('| 変換後(CSV・UTF-8 BOM付き) | ' + '・'.join(f'`{c}`' for c in csvs) + ' |')
    L.append('| 検算レポート | `REPORT.md`(このファイル) |')
    L.append('')
    L.append('## 変換の結果')
    L.append('')
    for s in sheets:
        L.append(f"- シート「{s['name']}」: {len(s['rows'])}行 × {len(s['columns'])}列(見出し行を除く)")
        L.append(f"  - 列: " + ' / '.join(s['columns']))
    L.append(f"- シート「{notes['name']}」: 表の外の文字 {len(notes['rows'])}ブロック")
    L.append('')
    L.append('## 変換の方法')
    L.append('')
    for m in M['method']:
        L.append(f'- {m}')
    L.append('')
    L.append('## 検算: 何を何と照合したか')
    L.append('')
    L.append('- **照合の相手**: 変換に使った PyMuPDF とは別のプログラム **poppler の `pdftotext -bbox`(version 23.13.0)** がPDFから読み取った全単語と、その座標。単語は1文字ずつに割り、各文字の中心座標を求めた。')
    L.append('- **(1) セルごとの照合**: 出力したセル1つ1つについて、そのセルを取り出したPDF上の矩形に入る文字を集め、出力セルの文字と**文字の種類と個数**(空白・改行は無視)が一致するかを調べた。')
    L.append('- **(2) 取りこぼしの確認**: 見出し領域にも、どのセルの矩形にも入らなかったPDFの文字を数えた(0なら、頁の文字はすべて出力のどこかに入っている)。')
    L.append('- **(3) 見出しの確認**: 見出し領域の文字が、出力の列名のどこかに現れるかを調べた(列名は複数段の見出しを1行にまとめたため、文字の種類だけを確認)。')
    L.append('- **照合しなかったもの**: 縦の結合セルを下の行に引き継いだ値(PDFには1回しか書かれていないため)。件数は下に書いた。')
    L.append('')
    L.append('## 検算の結果')
    L.append('')
    L.append(report_md(res))
    L.append('')
    L.append(f"- 照合したセル: {res['total_cells']}(表の外の題名・注記ブロックを含む)")
    L.append(f"- 結合セルの引き継ぎで照合から外したセル: {res['inherited']}")
    mism = res['mismatch']
    L.append(f"- **食い違い: {len(mism)}件**")
    for sn, rr, cc, ce, want, got in mism[:40]:
        L.append(f"  - シート「{sn}」{rr + 2}行目 {cc + 1}列目: 出力=`{want}` / PDF(pdftotext)=`{got}`")
    for ex in M.get('mismatch_explained', []):
        L.append(f"  - 説明: {ex}")
    L.append(f"- **どのセルにも入らなかったPDFの文字: {len(res['unassigned'])}字**" +
             (' — ' + ' '.join(f"{ch}(頁{pi + 1})" for pi, ch, x, y in res['unassigned'][:40]) if res['unassigned'] else ''))
    L.append(f"- 見出し領域の文字のうち列名に現れない文字: {len(res['header_missing'])}種" +
             (' — ' + ' '.join(res['header_missing']) if res['header_missing'] else ''))
    if res['converted']:
        L.append(f"- PDFの文字と違う表記で出力したセル: {len(res['converted'])}件(照合はPDF側の文字で行った)")
        groups = {}
        for x in res['converted']:
            groups.setdefault((x[3]['v'], x[3]['verify_as'], x[3]['note']), []).append(x)
        for (v, va, note), xs in groups.items():
            pdfside = f"`{va}`(U+{ord(va[0]):04X})" if va else '文字なし'
            where = '、'.join(f"「{sn}」{rr + 2}行目{cc + 1}列目" for sn, rr, cc, ce in xs[:3]) + (' ほか' if len(xs) > 3 else '')
            L.append(f"  - 出力=`{v}` / PDF側={pdfside}: {len(xs)}件({where})。{note or ''}")
    for name, ok, detail in r.get('self_checks', []):
        L.append(f"- 追加の確認「{name}」: {'一致' if ok else '不一致'} — {detail}")
    if mut_results:
        L.append('- 陰性対照(検算が誤りを見逃さないかの試験。出力の1セルにわざと誤りを入れて同じ検算を実行): ' +
                 ' / '.join(f'{n} → 食い違いが{k}件増えた' for n, k in mut_results))
    L.append('')
    L.append('## この検算で分かること・分からないこと')
    L.append('')
    L.append('- 分かること: 出力の各セルの文字が、PDFの同じ場所に書かれている文字と同じであること(写し間違い・欠け・余分・別の行や列への入れ違いの検出)。頁の文字がすべて出力のどこかに入っていること。')
    L.append('- 分からないこと: PDFのテキスト情報そのものが誤っている場合(文字化けしたPDF・画像だけのPDFなど)。この見本では、頁画像と出力を見比べて、テキスト情報が見た目と同じであることを確認した(作業したAIが頁画像を見て行った。見た範囲:' + M.get('visual_check', '未記入') + ')。')
    L.append('- 同じ行の中で文字の並び順だけが入れ替わる誤りは、文字の種類と個数の照合では検出できない(セルの中身が1語か数字の表では起こりにくい)。')
    L.append('')
    L.append('## できなかったこと・限界')
    L.append('')
    for m in M['limits']:
        L.append(f'- {m}')
    L.append('')
    L.append(f'## 処理時間(実測)')
    L.append('')
    L.append(f'- 抽出・画像化・Excel/CSV書き出し・検算の実行: {elapsed:.1f}秒(スクリプト `scripts/pdf-table-service/{modname}.py` + `make_sample.py`)。スクリプトを書く時間は含まない。')
    L.append('')
    L.append('---')
    L.append('作成: My Naishin 運営 / 生成: `python scripts/pdf-table-service/make_sample.py ' + modname + ' ' + outdir.replace('\\', '/') + '`')
    with open(os.path.join(outdir, 'REPORT.md'), 'w', encoding='utf8') as f:
        f.write('\n'.join(L) + '\n')
    print(outdir, 'cells', res['total_cells'], 'mismatch', len(mism), 'unassigned', len(res['unassigned']),
          'hdr_missing', res['header_missing'], 'inh', res['inherited'], f'{elapsed:.1f}s', 'mut', mut_results)
    for sn, rr, cc, ce, want, got in mism[:60]:
        print('  MISMATCH', sn, rr + 2, cc + 1, repr(want), repr(got))
    for u in res['unassigned'][:60]:
        print('  UNASSIGNED', u)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
