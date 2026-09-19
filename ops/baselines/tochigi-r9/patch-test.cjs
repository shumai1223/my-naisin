// tochigi R9更新に伴う school-selection-method.test.ts のtochigiテスト(旧R8前提の4本)を置換する
const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/lib/school-selection-method/__tests__/school-selection-method.test.ts';
let s = fs.readFileSync(f, 'utf8');
const crlf = s.includes('\r\n');
if (crlf) s = s.replace(/\r\n/g, '\n');
const a = s.indexOf("  it('tochigi: 全日制58校108学科を特色選抜・一般選抜の各1レコード(計216)で収録している', () => {");
const b = s.indexOf("  it('niigata: 令和9年度の全日制(県立+新潟市立)73校93学科");
if (a < 0 || b < 0 || b < a) throw new Error('tochigiテストの範囲が特定できない');
const nw = `  it('tochigi: 令和9年度版の全日制54校101学科を特色選抜・一般選抜の各1レコード(計202)で収録している', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi');
    expect(record?.status).toBe('structured');
    expect(record?.fiscalYear).toBe('令和9年度（2027年度）');
    expect(record?.schools?.length).toBe(202);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(54);
    expect(record?.source.url).toContain('/m04/r09/');
  });

  it('tochigi: 宇都宮(普通)は特色選抜の比重が学力500:調査書100:独自100・定員10%・グループ討論と自己表現シート、一般選抜は学力500:調査書50・傾斜配点国数英', () => {
    const toku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '宇都宮', '特色選抜', '普通');
    expect(toku?.ratioType).toBe('学力検査500:調査書100:学校独自検査100');
    expect(toku?.note).toContain('特色選抜の定員の割合10%');
    expect(toku?.note).toContain('グループ討論');
    expect(toku?.note).toContain('自己表現シート(学校独自質問):あり');
    expect(toku?.interviewRequired).toBe(false);
    const ippan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '宇都宮', '一般選抜', '普通');
    expect(ippan?.ratioType).toBe('学力検査500:調査書50');
    expect(ippan?.note).toContain('国数英');
    expect(ippan?.interviewRequired).toBe(false);
  });

  it('tochigi: 鹿沼華陵(農林科学)は特色選抜で個人面接・比重学力500:調査書300:独自200、宇都宮東はプレゼンテーション・小山西の独自検査点は最大の1000', () => {
    const kanuma = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '鹿沼華陵', '特色選抜', '農林科学');
    expect(kanuma?.interviewRequired).toBe(true);
    expect(kanuma?.ratioType).toBe('学力検査500:調査書300:学校独自検査200');
    expect(kanuma?.note).toContain('個人面接');
    const east = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '宇都宮東', '特色選抜', '普通');
    expect(east?.note).toContain('特色選抜の定員の割合20%');
    expect(east?.note).toContain('プレゼンテーション');
    const koyamaNishi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '小山西', '特色選抜', '普通');
    expect(koyamaNishi?.ratioType).toBe('学力検査500:調査書500:学校独自検査1000');
  });

  it('tochigi: 全レコードは学力検査500点固定・特色選抜の定員の割合は上限50%以下・一般選抜は面接を含まない(令和9年度制度)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi');
    for (const s of record?.schools ?? []) {
      expect(s.ratioType ?? '').toMatch(/^学力検査500:/);
      if (s.selectionCategory === '特色選抜') {
        const m = (s.note ?? '').match(/特色選抜の定員の割合(\\d+)%/);
        expect(m).not.toBeNull();
        if (m) expect(Number(m[1])).toBeLessThanOrEqual(50);
      } else {
        expect(s.interviewRequired).toBe(false);
      }
    }
  });

`;
s = s.slice(0, a) + nw + s.slice(b);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(f, s);
console.log('patched tochigi tests');
