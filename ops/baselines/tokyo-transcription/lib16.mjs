// T-Y14 tokyo: n2_16(20250925_n2_16.pdf・別表5-1「令和8年度文化・スポーツ等特別推薦実施校の選抜方法等一覧」全39頁・印刷頁137〜)の共通ビルダー。
// 行: { s:学校名, k:種目, n:'男・3'等(性別・募集人数), c:調査書点, m:面接点, mt:'個人'|'集団', j:実技検査点, g:[今後3年間の数値目標等], memo? }
// 収録項目: 学校・種目・募集人数・満点(調査書/面接/実技検査)・今後3年間の数値目標等。「文化・スポーツ等特別推薦の基準」の長文(○で始まる要件)は転記していない(未収録)。
// 満点の3列は学校ごとの結合セルで、同一結合セル内の全種目に共通(種目ごとに値が分かれる学校は行ごとに別値)。
export { append } from './lib.mjs';
const q = (s) => { if (s.includes("'")) throw new Error('apos: ' + s.slice(0, 30)); return s; };
export function build16(rows) {
  let ins = '';
  for (const r of rows) {
    const noC = r.c == null;
    const total = (r.c ?? 0) + r.m + r.j;
    ins += `    {\n      schoolName: '${q(r.s)}',\n      department: '${q(r.k)}(${q(r.n)})',\n      selectionCategory: '文化・スポーツ等特別推薦',\n      interviewRequired: true,\n      ratioType: '${noC ? '' : '調査書' + r.c + '点+'}${r.mt}面接${r.m}点+実技検査${r.j}点',\n      note: '別表5-1「文化・スポーツ等特別推薦実施校の選抜方法等一覧」。種目: ${q(r.k)}・募集人数: ${q(r.n)}。満点は${noC ? '' : '調査書' + r.c + '点+'}${r.mt}面接${r.m}点+実技検査${r.j}点(合計${total}点・同一校の結合セルで種目共通の場合あり)。${noC ? '調査書の活用欄・調査書の満点欄は「—」(調査書点を選考に用いない)' : '調査書は評定を活用(観点別学習状況の評価は活用しない)'}。今後3年間の数値目標等: ${r.g.map(q).join('/')}${r.memo ? '。' + q(r.memo) : ''}。推薦の基準(要件の長文)は本DBでは未収録'\n    },\n`;
  }
  return ins;
}
