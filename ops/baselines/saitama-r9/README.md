# saitama R9(令和9年度)各高等学校の選抜実施内容(概要一覧) の抽出と再構築(2026-09-20)

- 元資料: https://www.pref.saitama.lg.jp/f2208/r9nyuushi-senbatsuzisshinaiyou.html (令和9年度 各高等学校の選抜実施内容・確定版・2026-05-29掲載)
  概要一覧: `documents/277139/1_r9_kyoutsuu.pdf`(共通選抜のみ・8頁) / `2_r9_tokusyoku.pdf`(特色選抜のみ・5頁) / `3_r9_tokusyoku_kyoutsuu.pdf`(両方・1頁)。PDFはコミットしない(`curl -k -L`)。学校別の個票(約165PDF)は未取得。
- **令和8年度からの差分ではなく全面置換**: R8の`saitama.ts`は『選抜基準』(第1〜3次選抜の割合・調査書の基本方針・特別活動等の記録)だが、R9は入試制度が変わり全校で面接・共通選抜/特色選抜・第1次/第2次の選抜資料配点の表構成。R8レコード(159)はgit履歴に残し、R9は196レコード(136校)で置換した。
- 手順: `pdftotext -bbox X.pdf N.bbox.html`(1/2/3) → `node build-kyoutsuu.mjs`(rows-kyoutsuu.json) / `node build-tokusyoku.mjs`(rows-tokusyoku.json) / `node build-ryouhou.mjs`(rows-ryouhou.json) → リポジトリ直下から `node ops/baselines/saitama-r9/gen-r9.mjs`(src/data/school-selection-methods/saitama.ts)。
  各学校は『第1次募集割合(NN%)』を持つ主行を1つ持ち、列はx範囲(表ごとに別)で確定。学校名は『名前の中心yと各群の行y平均を合わせる連続分割DP』、学科は『最寄りの主行へ割当(複数行に折り返す学科名の全体を取る)』。
- 検算: 全行・全段階で 学力(空欄=500)+調査書+面接(+特色検査)=合計 が一致(109+69+9行)。調査書の学年比率×45点=合計点(1:1:1=135/1:1:2=180/1:1:3=225/1:2:3=270/2:2:3=315…)も一致。
- 限界: 学校別の個票(調査書の基本点の内訳・自己評価資料の項目・特色検査の内容・学校選択問題の詳細)は未収録。傾斜配点の文言は行内の連結テキストのまま。
