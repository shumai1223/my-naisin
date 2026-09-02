#!/usr/bin/env python
"""T-Y11B 段階2-b: 倍率PDFの表構造をページ単位で抽出する（PyMuPDF使用）。

⚠️2026-09-02判明: この環境の`pdftotext`（xpdf 4.00・poppler ではない）には`-bbox`相当の
座標出力モードが無い。`-table`モードは学校名セルが複数学科行にまたがる「結合セル」を
含む表で、学校名ラベルが実際の行と異なる行に出力される（罫線の垂直中央に寄せて配置される
PDF側の仕様のため）。この結合セルの範囲はテキストストリームだけからは復元できない
（学科数から逆算する数式アプローチも試したが、境界が曖昧なケースで失敗する）。

一方、PDFの罫線は`page.get_drawings()`でベクタ図形として取得でき、学校名セルが結合されて
いる箇所は「行区切り線がx0=学科名列より右からしか引かれていない（学校名列をまたがない）」
という形で機械的に判別できる。この罫線情報と文字単位のbbox（`get_text("rawdict")`の
`chars`）を組み合わせることで、結合セルの実際の範囲を罫線から機械的に決定し、
学校名ラベルをそのセル内の全行へ正しく展開できる（ibarakiのR8で149/149件・完全一致で検証済み）。

**文字単位（words単位ではない）で抽出する理由**: `get_text("words")`はスペース区切りで
単語分割するため、学校名と学科名の間に実際のスペース文字が無いPDF（例:
「水戸桜ノ牧常北校」+「普通」が1つのwordとして結合される）で列の取り違えが起きる
（2026-09-02にibarakiで実際に発生・原因特定済み）。文字単位のbboxを列のx範囲で
振り分ける方式なら、単語境界に依存せず正しく列を分離できる。

使い方: python extract-pdf-geometry.py <PDFファイル> <ページ番号(0始まり)>
標準出力にJSON（{chars: [...], hlines: [...]}）を書き出す。
"""
import fitz
import sys
import json


def extract(pdf_path, page_no):
    doc = fitz.open(pdf_path)
    page = doc[page_no]
    raw = page.get_text("rawdict")
    chars = []
    for block in raw["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                for ch in span.get("chars", []):
                    bbox = ch["bbox"]
                    chars.append({
                        "x0": round(bbox[0], 2), "y0": round(bbox[1], 2),
                        "x1": round(bbox[2], 2), "y1": round(bbox[3], 2),
                        "c": ch["c"],
                    })
    # 水平の罫線（行区切り）をベクタ図形（直線・幅の薄い矩形の両方に対応）から集める。
    # x0（開始x座標）が小さいほど「学校名列を含む＝結合セルではない完全な行区切り」であり、
    # x0が学科名列以降にしか伸びていない線は「学校名セルが結合されている内部の区切り」。
    drawings = page.get_drawings()
    hlines = []
    for d in drawings:
        for item in d["items"]:
            if item[0] == "l":
                p1, p2 = item[1], item[2]
                if abs(p1.y - p2.y) < 0.5 and abs(p1.x - p2.x) > 20:
                    hlines.append({"y": round(p1.y, 2), "x0": round(min(p1.x, p2.x), 2), "x1": round(max(p1.x, p2.x), 2)})
            elif item[0] == "re":
                r = item[1]
                # ⚠️2026-09-02判明(ishikawa): 閾値`height < 1.0`は厳しすぎて実在する罫線を
                # 取りこぼす（height=1.2の罫線が複数見つかった）。表内容のセル背景矩形は
                # 幅と高さが同オーダー（例: height=11.76・63.6）なのに対し、罫線は幅に比べ
                # 高さが極端に薄い（height/width が1%未満）。この比率で判定する方が安全。
                if r.height < 3.0 and r.width > 20:
                    hlines.append({"y": round(r.y0, 2), "x0": round(r.x0, 2), "x1": round(r.x1, 2)})
    hlines.sort(key=lambda h: h["y"])
    return {"chars": chars, "hlines": hlines}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python extract-pdf-geometry.py <PDFファイル> [ページ番号]", file=sys.stderr)
        sys.exit(1)
    pdf_path = sys.argv[1]
    page_no = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    out = extract(pdf_path, page_no)
    print(json.dumps(out, ensure_ascii=False))
