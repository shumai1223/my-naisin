// T-Y14 tokyo: 令和8年度都立高等学校入学者選抜実施要綱 別表1(1) 普通教育を主とする学科(20250925_n2_10.pdf)の頁別転記を
// src/data/school-selection-methods/tokyo.ts の schools 配列末尾へ追記する共通ビルダー。使い方: node ops/baselines/tokyo-transcription/p2.mjs (追記は1回だけ)
// 行 = { n:校名, cs:'あり'|'なし', cho:調査書点, men:個人面接点 | null, merged:個人面接・集団討論の結合セル点 | null, rt:'作文'|'小論文', rp:点, sc:自校作成問題か, m2:第二次募集の面接点 | null, m2t:'集団'(省略時は個人) }
import fs from 'fs';
export function build(rows) {
  let ins = '';
  for (const r of rows) {
    const menDesc = r.merged != null ? `個人面接・集団討論の結合セル${r.merged}点` : `個人面接${r.men}点`;
    const tot = r.cho + (r.merged ?? r.men) + r.rp;
    const kekka = r.merged != null ? '(表では個人面接欄と集団討論欄にまたがる1つの結合セル。どちらを実施するか・併用かは表だけでは確定できないため、面接の実施有無は断定しない)' : '';
    ins += `    {\n      schoolName: '${r.n}',\n      department: '普通科',\n      selectionCategory: '推薦に基づく選抜',\n${r.merged != null ? '' : '      interviewRequired: true,\n'}      ratioType: '推薦枠割合20%',\n      note: '文化・スポーツ等特別推薦の実施${r.cs}。調査書の観点別学習状況の評価は活用せず評定のみ活用。満点は調査書${r.cho}点+${menDesc}+${r.rt}${r.rp}点(合計${tot}点)${kekka}${r.extra ? "。" + r.extra : ""}。${r.merged != null ? '実技検査・学校設定検査の実施なし' : '集団討論・実技検査・学校設定検査の実施なし'}',\n    },\n`;
    const sc = r.sc ? '(国数英は自校作成問題)' : '';
    ins += `    {\n      schoolName: '${r.n}',\n      department: '普通科',\n      selectionCategory: '第一次募集',\n      interviewRequired: false,\n      ratioType: '学力検査7:調査書3(700点:300点)+ESAT-J20点',\n      note: '学力検査は国数英社理の5教科${sc}。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。面接・小論文・実技検査の実施なし',\n    },\n`;
    ins += `    {\n      schoolName: '${r.n}',\n      department: '普通科',\n      selectionCategory: '第二次募集',\n      interviewRequired: ${r.m2 != null ? 'true' : 'false'},\n      ratioType: '学力検査6:調査書4(600点:400点)${r.m2 != null ? '+' + (r.m2t || '個人') + '面接' + r.m2 + '点' : ''}',\n      note: '学力検査は国数英の3教科。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。${r.m2 != null ? '満点は学力検査600点+調査書400点+' + (r.m2t || '個人') + '面接' + r.m2 + '点(第二次募集で' + (r.m2t || '個人') + '面接あり)。小論文・実技検査の実施なし' : '面接・小論文・実技検査の実施なし'}',\n    },\n`;
  }
  return ins;
}
export function append(ins, edits = []) {
  const p = 'src/data/school-selection-methods/tokyo.ts';
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  const end = '  ],' + (crlf ? '\r\n' : '\n') + '};';
  const idx = s.lastIndexOf(end);
  if (idx < 0) throw new Error('no end');
  s = s.slice(0, idx) + (crlf ? ins.replace(/\n/g, '\r\n') : ins) + s.slice(idx);
  for (const [a, b] of edits) { if (!s.includes(a)) throw new Error('missing ' + a.slice(0, 50)); s = s.replace(a, b); }
  fs.writeFileSync(p, s);
  console.log('records', (s.match(/schoolName: '/g) || []).length);
}
