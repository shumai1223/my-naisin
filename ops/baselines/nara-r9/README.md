# nara R9(令和9年度)選抜概要 一次選抜一覧・二次選抜一覧 の令和8年度版との突合(2026-09-20)

- 元資料: https://www.pref.nara.lg.jp/n167/p122015.html (令和9年度奈良県立高等学校入学者選抜概要・更新2026-07-07)
  PDF: `documents/24281/31_r9gaiyou_ichiji_ichiran_dai1.pdf`(第1希望校・5頁) / `32_..._dai2.pdf`(第2希望校・3頁) / `33_r9gaiyou_niji_ichiran.pdf`(二次選抜・3頁) / `22_r9gaiyou_nijisenbatsu.pdf`(二次選抜の説明) / `24_r9gaiyou_chousasho.pdf`。PDFはコミットしない(curl -k -L)。
- 手順: `pdftotext -bbox X.pdf X.bbox.html` → `node sig.mjs`(第1希望校)/`node sig3.mjs`(第2希望校・二次選抜)で学校別の数値集合をR8(../nara-transcription)と比較 → 差分をPDFの行座標(rows.mjs)で目視確認 → mkdata.mjs相当の修正をdata.mjs/data2.mjsに適用 → `node gen-r9.mjs`(src/data/school-selection-methods/nara.ts生成)。
- **結果(R8→R9の実差分は2点のみ)**: ①**二次選抜は令和9年度は「各高校での検査は実施しない」(22_r9gaiyou_nijisenbatsu.pdf)=R8にあった面接(20〜80点)が全79学科で無くなった** ②奈良市立一条の合格人数枠(20名・10点)が「―」に。加えて奈良北の二次選抜3教科得点はR8転記270→R9で300(第2希望校の300と一致=R8の転記誤りだった可能性)。他は数値集合が一致(sig.mjsで28/35校が完全一致・残りは名前紐づけの限界による偽陽性を頁の行座標で確認)。
- 限界: 学科名リストは行座標で目視確認したが、備考の文言・加重配点の教科の文言までは全行照合していない。合格人数枠は令和8年10月頃発表の正式な募集人員で変更されうると資料に明記。
- sig.mjs系の名前紐づけは『最寄りの学校名のy座標』で行うため、学科数の多い学校が隣接する表では誤紐づけが出る(偽陽性の主因)。差分は必ず元の頁を読んで確定すること。
