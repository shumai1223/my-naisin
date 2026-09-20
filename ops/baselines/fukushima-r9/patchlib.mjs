// fukushima.ts の (schoolName, department, selectionCategory) で特定した1レコード内だけを置換するヘルパ。oldが0件/複数件なら例外。
import fs from 'fs';
export const FILE = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/fukushima.ts';
export function patch(list) {
  let src = rd();
  for (const { school, dept, cat, subs } of list) {
    const head = `      schoolName: '${school}',\n      department: '${dept}',\n      selectionCategory: '${cat}',\n`;
    const i = src.indexOf(head);
    if (i < 0) throw new Error(`record not found: ${school}/${dept}/${cat}`);
    if (src.indexOf(head, i + 1) >= 0) throw new Error(`record duplicated: ${school}/${dept}/${cat}`);
    const j = src.indexOf('\n    },', i);
    let blk = src.slice(i, j);
    for (const [o, n] of subs) {
      const k = blk.indexOf(o);
      if (k < 0) throw new Error(`old not found in ${school}/${dept}/${cat}: ${o.slice(0, 40)}`);
      if (blk.indexOf(o, k + 1) >= 0) throw new Error(`old ambiguous in ${school}/${dept}/${cat}: ${o.slice(0, 40)}`);
      blk = blk.replace(o, () => n);
    }
    src = src.slice(0, i) + blk + src.slice(j);
  }
  wr(src);
  console.log('patched', list.length, 'records');
}

// 校名(+任意でdept)に属する全レコード内で置換。各subは全体で最低1件ヒットしなければ例外。ヒット数を表示。
export function patchAll(school, subs, dept = null) {
  let src = rd();
  const re = /    \{\n      schoolName: '([^']*)',\n      department: '([^']*)',\n[\s\S]*?\n    \},/g;
  const hits = subs.map(() => 0);
  src = src.replace(re, (blk, s, d) => {
    if (s !== school || (dept && d !== dept)) return blk;
    subs.forEach(([o, n], i) => { if (blk.includes(o)) { hits[i] += blk.split(o).length - 1; blk = blk.split(o).join(n); } });
    return blk;
  });
  subs.forEach(([o], i) => { if (!hits[i]) throw new Error(`no hit: ${school}${dept ? '/' + dept : ''}: ${o.slice(0, 40)}`); });
  wr(src);
  console.log(school, dept ?? '*', 'hits', hits.join(','));
}

const q = (s) => "'" + s.split(String.fromCharCode(92)).join(String.fromCharCode(92, 92)).split("'").join(String.fromCharCode(92) + "'") + "'";
// 1レコード丸ごと置換(rec=null で削除)。
export function replaceRec(school, dept, cat, rec) {
  let src = rd();
  const head = `    {\n      schoolName: '${school}',\n      department: '${dept}',\n      selectionCategory: '${cat}',\n`;
  const i = src.indexOf(head);
  if (i < 0) throw new Error(`record not found: ${school}/${dept}/${cat}`);
  const j = src.indexOf('\n    },\n', i) + '\n    },\n'.length;
  const one = (rec) => `    {
      schoolName: ${q(rec.schoolName)},
      department: ${q(rec.department)},
      selectionCategory: ${q(rec.selectionCategory)},
      interviewRequired: ${rec.interviewRequired ?? true},
      ratioType: ${q(rec.ratioType)},
      note: ${q(rec.note)},
    },
`;
  const body = Array.isArray(rec) ? rec.map(one).join('') : rec
    ? `    {\n      schoolName: ${q(rec.schoolName)},\n      department: ${q(rec.department)},\n      selectionCategory: ${q(rec.selectionCategory)},\n      interviewRequired: ${rec.interviewRequired ?? true},\n      ratioType: ${q(rec.ratioType)},\n      note: ${q(rec.note)},\n    },\n`
    : '';
  src = src.slice(0, i) + body + src.slice(j);
  wr(src);
  console.log(rec ? 'replaced' : 'deleted', school, dept, cat);
}

let CRLF = false;
function rd() { const t = fs.readFileSync(FILE, 'utf8'); CRLF = t.includes('\r\n'); return t.split('\r\n').join('\n'); }
function wr(s) { fs.writeFileSync(FILE, CRLF ? s.split('\n').join('\r\n') : s); }
