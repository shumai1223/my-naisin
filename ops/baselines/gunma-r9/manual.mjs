// 段階数が変わった校(R9で特色型①②→特色型の1段階へ等)を学校単位で置換する
import fs from 'fs';
const F = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/gunma.ts';
let s = fs.readFileSync(F, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
const q = (x) => "'" + x.split("'").join("\\'") + "'";
const line = (school, department, selectionCategory, ratioType, note) => `    { schoolName: ${q(school)}, department: ${q(department)}, selectionCategory: ${q(selectionCategory)}, interviewRequired: true, ratioType: ${q(ratioType)}, note: ${q(note + '(令和9年度版)')} },`;
function replaceSchool(school, lines) {
  const esc = school.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp("^ *\\{ schoolName: '" + esc + "', .*\\n", 'gm');
  const hits = [...s.matchAll(re)]; if (!hits.length) throw new Error('no ' + school);
  const first = hits[0].index;
  // 途中に別校が挟まっていないか
  const span = s.slice(first, hits[hits.length - 1].index + hits[hits.length - 1][0].length);
  if (span.split('\n').filter((l) => /^ *\{ schoolName:/.test(l)).length !== hits.length) throw new Error('interleaved ' + school);
  s = s.slice(0, first) + lines.join('\n') + '\n' + s.slice(first + span.length);
  console.log(school, hits.length, '->', lines.length);
}
replaceSchool('前橋商業', [
  line('前橋商業', '商業科', '特色型選抜', '学力検査25%:面接等5%:調査書70%', '募集人員280(男女)。特色型選抜40%(第1次選抜・令和8年度は特色型選抜①②の2段階)。調査書の部活動等や特別活動の記録及び学力検査の結果を重視。学力検査計500(各100点)・面接等(集団面接)100点・調査書1400点'),
  line('前橋商業', '商業科', '総合型選抜', '学力検査75%:面接等5%:調査書20%', '総合型選抜60%(第2次選抜)。第1次選抜合格者以外を対象に、学力検査の結果及び調査書の評定等を重視。学力検査計500・面接等(集団面接)35点・調査書135点'),
]);
replaceSchool('桐生工業', [
  line('桐生工業', '機械科・建設科・創造技術科(電気コース・染織デザインコース)', '特色型選抜', '学力検査20%:面接等30%:調査書50%', '募集人員120(男女・4区分共通の選抜方法・令和8年度は160)。特色型選抜50%(第1次選抜・令和8年度は特色型選抜①②の2段階)。面接の結果、調査書の評定等及び特別活動や部活動等の記録を重視。学力検査計500(各100点)・面接等(集団面接)750点・調査書1250点。第2志望は全ての募集区分において相互に認める'),
  line('桐生工業', '機械科・建設科・創造技術科(電気コース・染織デザインコース)', '総合型選抜', '学力検査60%:面接等10%:調査書30%', '総合型選抜50%(第2次選抜)。第1次選抜合格者以外を対象に、学力検査の結果を重視。学力検査計500・面接等(集団面接)83点・調査書250点'),
]);
replaceSchool('玉村', [
  line('玉村', '普通科', '総合型選抜', '学力検査63%:面接等13%:調査書25%', '募集人員80(男女)。総合型選抜50%(第1次選抜)。学力検査の結果を重視。学力検査計500(各100点)・面接等(個人面接)100点・調査書200点'),
  line('玉村', '普通科', '特色型選抜', '学力検査25%:面接等50%:調査書25%', '特色型選抜50%(第2次選抜・令和8年度は特色型選抜①②の2段階)。第1次選抜合格者以外を対象に、面接を重視。学力検査計500・面接等(個人面接)1000点・調査書500点'),
]);
fs.writeFileSync(F, crlf ? s.split('\n').join('\r\n') : s);
