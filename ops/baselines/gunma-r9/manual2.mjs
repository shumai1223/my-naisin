import fs from 'fs';
const F = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/gunma.ts';
let s = fs.readFileSync(F, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
const D = '商業科・情報処理科';
const line = (cat, ratio, note) => `    { schoolName: '桐生市立商業', department: '${D}', selectionCategory: '${cat}', interviewRequired: true, ratioType: '${ratio}', note: '${note}(令和9年度版)' },`;
const lines = [
  line('特色型選抜①', '学力検査42%:面接等8%:調査書50%', '桐生市立高校。募集人員200(男女・2学科共通の選抜方法)。特色型選抜①25%(第1次選抜・令和8年度は特色型選抜と総合型選抜の2段階)。学力検査の結果と調査書を重視。学力検査計500(各100点)・面接等(集団面接)100点・調査書600点'),
  line('特色型選抜②', '学力検査20%:面接等10%:調査書70%', '特色型選抜②25%(第2次選抜)。第1次選抜合格者以外を対象に、面接の結果及び調査書の特別活動の記録を重視。学力検査計500・面接等(集団面接)250点・調査書1750点'),
  line('総合型選抜', '学力検査63%:面接等13%:調査書25%', '総合型選抜50%(第3次選抜)。第1・第2次選抜合格者以外を対象に、学力検査を重視。学力検査計500(各100点)・面接等(集団面接)100点・調査書200点'),
];
const re = /^ *\{ schoolName: '桐生市立商業', .*\n/gm;
const hits = [...s.matchAll(re)]; if (hits.length !== 2) throw new Error('hits ' + hits.length);
const span = s.slice(hits[0].index, hits[1].index + hits[1][0].length);
s = s.slice(0, hits[0].index) + lines.join('\n') + '\n' + s.slice(hits[0].index + span.length);
fs.writeFileSync(F, crlf ? s.split('\n').join('\r\n') : s);
console.log('ok');
