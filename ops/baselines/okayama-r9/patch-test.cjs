// okayama R9更新に伴い、school-selection-method.test.ts の期待値を更新する(旧R8前提のテストを置換)
const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/lib/school-selection-method/__tests__/school-selection-method.test.ts';
let s = fs.readFileSync(f, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');
const rep = (from, to) => {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`一致数 ${n} != 1: ${from.slice(0, 70)}`);
  s = s.split(from).join(to);
};
rep("it('okayama: schoolsは全7頁を完全収録している(51校259レコード)', () => {", "it('okayama: schoolsは令和9年度版の全7頁を収録している(51校261レコード)', () => {");
rep("expect(record?.schools?.length).toBe(259);\n    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));\n    expect(schoolNames.size).toBe(51);", "expect(record?.fiscalYear).toBe('令和9年度（2027年度）');\n    expect(record?.schools?.length).toBe(261);\n    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));\n    expect(schoolNames.size).toBe(51);");
// 玉野・笠岡
const a = s.indexOf("  it('okayama: 玉野・笠岡の普通科は特別入学者選抜が全て「ー」のため一般入学者選抜のみ収録される(頁5)', () => {");
const b = s.indexOf("  it('okayama: 井原は普通+地域生活");
if (a < 0 || b < 0 || b < a) throw new Error('玉野・笠岡テストの範囲が特定できない');
const nw = [
  "  it('okayama: 玉野・笠岡の普通科は令和9年度から特別入学者選抜(募集人員50%)が新設され特別・一般の2レコードを持つ(頁5)', () => {",
  "    const tamano = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '玉野', '特別入学者選抜', '普通');",
  "    expect(tamano?.note).toContain('募集人員50%');",
  "    expect(tamano?.note).toContain('10人程度');",
  "    expect(tamano?.note).toContain('英語検定準2級以上合格');",
  "    const kasaoka = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '笠岡', '特別入学者選抜', '普通');",
  "    expect(kasaoka?.note).toContain('募集人員50%');",
  "    expect(kasaoka?.note).toContain('8人程度');",
  "    expect(kasaoka?.note).toContain('数学検定準2級以上');",
  "    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');",
  "    for (const name of ['玉野', '笠岡']) {",
  "      const rows = record?.schools?.filter((s) => s.schoolName === name);",
  "      expect(rows).toHaveLength(2);",
  "      expect(rows?.map((r) => r.selectionCategory).sort()).toEqual(['一般入学者選抜', '特別入学者選抜']);",
  "    }",
  "  });",
  "",
  "",
].join('\n');
s = s.slice(0, a) + nw + s.slice(b);
// 勝間田
rep("it('okayama: 勝間田は総合学科の5系列に同一内容(募集人員50%・剣道5人程度・一般選抜比率10%)を複製して収録している(頁7)', () => {", "it('okayama: 勝間田は総合学科の5系列に同一内容(募集人員80%・剣道5人程度・一般選抜比率10%)を複製して収録している(頁7・令和9年度で特別の募集人員50→80%)', () => {");
rep("expect(jidosha?.note).toContain('討論、発表');", "expect(jidosha?.note).toContain('討論、発表');\n    expect(jidosha?.note).toContain('募集人員80%');");
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(f, s);
console.log('patched test');
