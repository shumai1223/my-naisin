// miyazaki R9: R8のgen.mjsからR9用 gen-r9.mjs を作る(置換に失敗したら止める)。
import fs from 'fs';
let s = fs.readFileSync('../miyazaki-transcription/gen.mjs', 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) throw new Error('未検出: ' + a.slice(0, 70));
  s = s.split(a).join(b);
};
rep("from './data.mjs'", "from './data-ippan-r9.mjs'");
rep("from './data-suisen.mjs'", "from './data-suisen-final-r9.mjs'");
rep('令和8年度', '令和9年度');
rep('令和7年8月4日発表資料', '令和8年8月6日発表資料');
rep('https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250731195130-1.pdf', 'https://www.pref.miyazaki.lg.jp/documents/109134/109134_20260718165834-1.pdf');
rep('https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250731195159-1.pdf', 'https://www.pref.miyazaki.lg.jp/documents/109134/109134_20260718165750-1.pdf');
rep('20250618193442.html', '20260519170532.html');
rep('2026-09-19 pdftoppm 110dpiで目視転記', '令和9年度版は2026-09-20取得しpdftotext -bboxの座標から機械抽出・検算済み');
rep('同じく110dpi目視転記', '同じく座標抽出');
rep('ops/baselines/miyazaki-transcription/ に保存', 'ops/baselines/miyazaki-r9/ に保存(令和8年度版の目視転記は ops/baselines/miyazaki-transcription/)');
rep("fiscalYear: '令和9年度（2026年度）'", "fiscalYear: '令和9年度（2027年度）'");
rep("lastChecked: '${new Date().toISOString().slice(0, 10)}'", "lastChecked: '2026-09-20'");
rep('スポーツ推薦方式46', 'スポーツ推薦方式47');
rep('自己推薦方式114行は全行で', '自己推薦方式114行は全行で');
fs.writeFileSync('gen-r9.mjs', s);
console.log('ok');
