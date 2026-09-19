// T-Y14 tokyo: n2_12以降(専門教育を主とする学科ほか・別表1の続き)用ビルダー。行 = 学科単位。
// 行: { n:校名, d:学科名, w:推薦枠割合(%), cs:'あり'|'なし', cho, men, rt?:'作文'|'小論文', rp?, jitsu?:推薦の実技検査点, kt?:'集団討論点', pr?:推薦のnote追記,
//       f1?/f1n?:第一次のratio/note, f2?/f2n?:第二次のratio/note, f1j?:第一次の実技検査点, f2j?:第二次の実技検査点, m1?:第一次の面接点(m1n?:補足), m2?:第二次の面接点, m2t?:'集団', sc?:自校作成, keisha?:傾斜配点の説明, cat?: 追加note }
import { append } from './lib.mjs';
const q = (s) => { if (s.includes("'")) throw new Error('apos: ' + s.slice(0, 30)); return s; };
const rec = (n, dept, cat, itv, ratio, note) => `    {\n      schoolName: '${q(n)}',\n      department: '${q(dept)}',\n      selectionCategory: '${cat}',\n      interviewRequired: ${itv},\n      ratioType: '${q(ratio)}',\n      note: '${q(note)}',\n    },\n`;
export function buildSenmon(group, rows) {
  let ins = '';
  for (const r of rows) {
    const dept = `${r.d}(${group})`;
    const parts = [`調査書${r.cho}点`];
    let tot = r.cho;
    if (r.men != null) { parts.push(`個人面接${r.men}点`); tot += r.men; }
    if (r.kt != null) { parts.push(`集団討論${r.kt}点`); tot += r.kt; }
    if (r.rt) { parts.push(`${r.rt}${r.rp}点`); tot += r.rp; }
    if (r.jitsu != null) { parts.push(`実技検査${r.jitsu}点`); tot += r.jitsu; }
    ins += rec(r.n, dept, '推薦に基づく選抜', r.men != null || r.kt != null, `推薦枠割合${r.w}%`, `文化・スポーツ等特別推薦の実施${r.cs}。${r.kanten ? '調査書は観点別学習状況の評価を活用(評定は活用しない)' : '調査書の観点別学習状況の評価は活用せず評定のみ活用'}。満点は${parts.join('+')}(合計${tot}点)${r.pr ? '。' + r.pr : ''}。${r.jitsu != null ? '' : '実技検査・'}学校設定検査の実施なし`);
    const sc = r.sc ? '(国数英は自校作成問題)' : '';
    const k = r.keisha ? `。${r.keisha}` : '';
    ins += rec(r.n, dept, '第一次募集', r.m1 != null, (r.f1 || '学力検査7:調査書3(700点:300点)+ESAT-J20点') + (r.m1 != null ? `+個人面接${r.m1}点` : '') + (r.f1j ? `+実技検査${r.f1j}点` : ''), r.f1n || `学力検査は国数英社理の5教科${sc}${k}。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。${r.f1j ? '実技検査' + r.f1j + '点を課す。' : ''}${r.m1 != null ? '満点は学力検査700点+調査書300点+個人面接' + r.m1 + '点。' + (r.m1n || '') + '小論文の実施なし' : '面接・小論文の実施なし'}`.replace('。。', '。'));
    const m2 = r.m2 != null;
    const m2t = r.m2t || '個人';
    ins += rec(r.n, dept, '第二次募集', m2, (r.f2 || '学力検査6:調査書4(600点:400点)') + (m2 ? `+${m2t}面接${r.m2}点` : '') + (r.f2j ? `+実技検査${r.f2j}点` : ''), (r.f2n || `学力検査は国数英の3教科${r.keisha2 ? "。" + r.keisha2 : ""}。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。`) + (m2 ? `満点は学力検査600点+調査書400点+${m2t}面接${r.m2}点${r.f2j ? '+実技検査' + r.f2j + '点' : ''}。` : '') + (r.f2j ? '' : m2 ? '小論文・実技検査の実施なし' : '面接・小論文・実技検査の実施なし'));
  }
  return ins;
}
export { append };
