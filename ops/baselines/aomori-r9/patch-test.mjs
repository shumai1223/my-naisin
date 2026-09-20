import fs from 'fs';
const F = 'C:/Users/E24054/my-naisin/src/lib/school-selection-method/__tests__/school-selection-method.test.ts';
let s = fs.readFileSync(F, 'utf8');
const crlf = s.includes('\r\n');
s = s.replace(/\r\n/g, '\n');
const rep = (o, n) => { if (!s.includes(o)) throw new Error('nf: ' + o.slice(0, 50)); s = s.replace(o, () => n); };
rep("(46校180レコード)', () => {\n    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori');\n    expect(record?.schools?.length).toBe(180);\n    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));\n    expect(schoolNames.size).toBe(46);",
  "(44校177レコード・令和9年度版)', () => {\n    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori');\n    expect(record?.fiscalYear).toContain('令和9年度');\n    expect(record?.schools?.length).toBe(177);\n    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));\n    expect(schoolNames.size).toBe(44);\n    expect(schoolNames.has('青森西ヶ丘')).toBe(true);\n    expect(schoolNames.has('むつ大湊')).toBe(true);\n    for (const gone of ['青森西', '浪岡', 'むつ工業', '大湊']) expect(schoolNames.has(gone)).toBe(false);");
rep("  it('aomori: 田名部は全日制(普通科)と定時制単位制",
`  it('aomori: 令和9年度版で青森東(普通科)の特色化選抜は学力検査600点+面接のみ(調査書を配点に含まない)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森東', '特色化選抜', '普通科');
    expect(record?.ratioType).toBe('学力検査600点:面接(合計600点)');
    expect(record?.note).toContain('最も得点の高い科目を2倍');
  });

  it('aomori: 令和9年度版の配点変更(青森北スポーツ科学科の面接60点・大間の調査書165点・北斗の作文50点・木造の調査書385点)を反映している', () => {
    const sports = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森北', '特色化選抜', 'スポーツ科学科');
    expect(sports?.ratioType).toBe('学力検査500点:調査書310点:実技検査120点:面接60点(合計990点)');
    const oma = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '大間', '特色化選抜', '普通科');
    expect(oma?.ratioType).toBe('学力検査500点:調査書165点:面接(合計665点)');
    const hokuto = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '北斗', '再募集', '普通科');
    expect(hokuto?.ratioType).toBe('学力検査200点:調査書100点:面接300点:作文50点(合計650点)');
    const kizukuri = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '木造', '特色化選抜', '総合学科');
    expect(kizukuri?.ratioType).toBe('学力検査500点:調査書385点:面接50点(合計935点)');
  });

  it('aomori: 青森西ヶ丘・むつ大湊は令和9年度版の新掲載校で、むつ大湊は機械科・電気・エネルギー科と総合学科の特色化選抜がともに合計795点', () => {
    const nishi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森西ヶ丘', '特色化選抜', '普通科');
    expect(nishi?.ratioType).toBe('学力検査500点:調査書250点:面接(合計750点)');
    for (const dept of ['機械科・電気・エネルギー科', '総合学科']) {
      const r = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', 'むつ大湊', '特色化選抜', dept);
      expect(r?.ratioType).toBe('学力検査500点:調査書195点:面接100点(合計795点)');
    }
  });

  it('aomori: 黒石は令和9年度版で情報デザイン科志望者への実技検査の注記が消え、集団面接は1組5名程度', () => {
    const futsuu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '黒石', '一般選抜', '普通科');
    expect(futsuu?.note).not.toContain('実技検査');
    expect(futsuu?.note).toContain('1組5名程度');
  });

  it('aomori: 田名部は全日制(普通科)と定時制単位制`);
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(F, s);
console.log('ok crlf=', crlf);
