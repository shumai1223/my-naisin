// okayama.ts の年度表記・出典・注記をR9へ更新する(頁別のデータパッチ patch-p2/4/5/6/7 の後に実行)
const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/okayama.ts';
let s = fs.readFileSync(f, 'utf8');
const rep = (from, to, expect = 1) => {
  const n = s.split(from).length - 1;
  if (n !== expect) throw new Error(`一致数 ${n} != ${expect}: ${from.slice(0, 70)}`);
  s = s.split(from).join(to);
};
rep("// 岡山県: 令和8年度岡山県立高等学校入学者選抜における「学校別実施内容一覧」(別表1)の", "// 岡山県: 令和9年度岡山県立高等学校入学者選抜における「学校別実施内容一覧」(別表1)の");
rep("// 一次ソース: 岡山県教育委員会「令和8年度岡山県立高等学校入学者選抜における学校別実施内容一覧」PDF\n// (`https://www.pref.okayama.jp/uploaded/life/1054600_10219031_misc.pdf`・全7頁・\n// 2026-09-18 curl+pdftoppm(150dpi)で目視確認)。",
  "// 一次ソース: 岡山県教育委員会「令和9年度岡山県立高等学校入学者選抜における学校別実施内容一覧」PDF\n// (`https://www.pref.okayama.jp/uploaded/life/1054574_10218770_misc.pdf`・全7頁・掲載元\n// `https://www.pref.okayama.jp/site/255/1044713.html`・2026-08-31更新)。\n// ✅2026-09-20 令和8年度版(`1054600_10219031_misc.pdf`)から更新: 両年度のPDFを頁別にpdftotext -rawで\n// 空白除去の行比較→差分行の学校を300dpi/130dpi画像で目視確認しデータをパッチした(玉野・笠岡の普通に\n// 特別入学者選抜が新設された等・変更点は ops/baselines/okayama-r9/ の patch-p*.cjs に記録)。\n// 以下は令和8年度版の収録時(2026-09-18)の記録: curl+pdftoppm(150dpi)で目視確認。");
rep("  fiscalYear: '令和8年度（2026年度）',", "  fiscalYear: '令和9年度（2027年度）',");
rep("    url: 'https://www.pref.okayama.jp/uploaded/life/1054600_10219031_misc.pdf',\n    docTitle: '令和8年度岡山県立高等学校入学者選抜における学校別実施内容一覧(別表1)',\n    lastChecked: '2026-09-19',",
  "    url: 'https://www.pref.okayama.jp/uploaded/life/1054574_10218770_misc.pdf',\n    docTitle: '令和9年度岡山県立高等学校入学者選抜における学校別実施内容一覧(別表1)',\n    lastChecked: '2026-09-20',");
rep("  note: '全7頁のうち頁7(6校16学科・32レコード)を追加し累計51校141学科259レコード=岡山県は全7頁を完全収録。",
  "  note: '【2026-09-20 令和9年度版へ更新】令和8年度版(259レコード)との頁別差分を目視確認してパッチし261レコード(玉野普通・笠岡普通に特別入学者選抜を新設=+2)。変更点: 津山工業 工業化学の検査文言・津山商業/倉敷商業/玉島商業/水島工業の重視する実績・水島工業の一般面接(集団→個人)・造園デザインの作文(2つのテーマ・各200字)・井原/備前緑陽の一般の重視する事項・林野の重視する実績と募集人員・勝間田の特別募集人員(50→80%)と一般の重視する事項。割合(%)欄(学区外受入枠)は本DBの対象外。以下は令和8年度版収録時の記録: 全7頁のうち頁7(6校16学科・32レコード)を追加し累計51校141学科259レコード=岡山県は全7頁を完全収録。");
fs.writeFileSync(f, s);
console.log('patched head');
