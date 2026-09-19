# ehime R9(令和9年度)特色入学者選抜 転記(2026-09-20)

- 元PDF: https://ehime-kyoiku.esnet.ed.jp/file/2829 (令和8年5月22日更新・67頁・5.3MB=コミットしない。`curl -k -L -o file2829.pdf <URL>` で取得)
- 再生成手順: `pdftotext -layout -enc UTF-8 file2829.pdf file2829.txt` と `pdftotext -bbox file2829.pdf bbox.html` を作り、
  `node build-r9.mjs`(data-r9.mjs生成) → `node check.mjs`(検算) → `node verify-items.mjs`(検査概要の項目と比重の突合)
  → `node diff8.mjs`(R8との差分) → リポジトリ直下から `node ops/baselines/ehime-r9/gen-r9.mjs`(src/data/school-selection-methods/ehime.ts生成)
- 列(調査書/作文/小論文/面接/集団討論/実技/プレゼン)はヘッダ語のx座標で確定(parse-bbox.mjs・pages.txtは頁別の生値)。
  R8は90dpi画像の目視転記だったが、R9は座標抽出で全頁を機械処理した(検算bad=0)。
- R8との差分: 23レコードで数値変更(定員・割合・人数・比重)、宇和島水産→宇和島南(総合学科/水産)、北条清新(定時制)を新規収録(R8は65頁で頁67を未収録)。
- 募集人員は令和9年度定員の見込みに基づく値(正式な募集定員等は令和8年10月頃に公表予定と資料に明記)。公表後に再確認すること。
