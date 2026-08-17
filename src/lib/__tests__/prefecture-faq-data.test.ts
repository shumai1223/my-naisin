import { PREFECTURE_FAQ_DATA } from '../prefecture-faq-data';
import { PREFECTURES, PrefectureConfig } from '../prefectures';

// 2026-08-17: PrefectureFAQ.tsxに手書きされていた回答文言が、大阪府・埼玉県で
// 「中3のみ対象」(実際は全学年対象)、愛知県で「実技1.5倍」(実際は傾斜なし)という
// prefectures.tsからのドリフトを起こしていたのを発見・修正した。同じ事故の再発を
// 機械的に検知する不変条件テスト(prefecture-pitfalls-data.test.tsと同型)。

function getPref(code: string): PrefectureConfig {
  const p = PREFECTURES.find((x) => x.code === code);
  if (!p) throw new Error(`prefectures.tsに${code}が見つからない`);
  return p;
}

function allText(code: string): string {
  const entry = PREFECTURE_FAQ_DATA[code];
  return entry.commonQuestions.map((q) => q.answer).join('') + entry.specificNotes.join('');
}

describe('PREFECTURE_FAQ_DATA: 「中3のみの成績が対象」と書く県は実際にtargetGrades=[3]', () => {
  for (const code of Object.keys(PREFECTURE_FAQ_DATA)) {
    if (code === 'default') continue;
    const text = allText(code);
    if (!text.includes('中3のみの成績が対象')) continue;

    test(`${code}: 記載どおりtargetGradesが[3]のみ`, () => {
      const pref = getPref(code);
      expect(pref.targetGrades).toEqual([3]);
    });
  }
});

describe('PREFECTURE_FAQ_DATA: 「中1〜中3の3年間」「全学年」を謳う県は実際にtargetGradesが3学年とも含む', () => {
  for (const code of Object.keys(PREFECTURE_FAQ_DATA)) {
    if (code === 'default') continue;
    const text = allText(code);
    if (!text.includes('中1〜中3') && !text.includes('全学年')) continue;

    test(`${code}: 記載どおりtargetGradesが[1,2,3]`, () => {
      const pref = getPref(code);
      expect(pref.targetGrades).toEqual([1, 2, 3]);
    });
  }
});

describe('PREFECTURE_FAQ_DATA: 実技教科を「等倍」「傾斜なし」「同じ倍率」と謳う県はcoreMultiplier=practicalMultiplier', () => {
  for (const code of Object.keys(PREFECTURE_FAQ_DATA)) {
    if (code === 'default') continue;
    const text = allText(code);
    if (!text.includes('等倍') && !text.includes('傾斜なし') && !text.includes('同じ倍率')) continue;

    test(`${code}: 記載どおりcoreMultiplierとpracticalMultiplierが同値`, () => {
      const pref = getPref(code);
      expect(pref.practicalMultiplier).toBe(pref.coreMultiplier);
    });
  }
});

describe('PREFECTURE_FAQ_DATA: 個別プレフィクチャの数値主張とprefectures.tsの突合', () => {
  test('chiba: 学年比が等倍(1:1:1)', () => {
    const pref = getPref('chiba');
    expect(pref.targetGrades).toEqual([1, 2, 3]);
    expect(pref.gradeMultipliers[1]).toBe(pref.gradeMultipliers[2]);
    expect(pref.gradeMultipliers[2]).toBe(pref.gradeMultipliers[3]);
  });

  test('tokyo: 実技4教科2倍・65点満点の主張が一致', () => {
    const pref = getPref('tokyo');
    const text = allText('tokyo');
    expect(pref.targetGrades).toEqual([3]);
    expect(pref.practicalMultiplier).toBe(2);
    expect(text).toContain(`実技4教科（音楽・美術・保健体育・技術家庭）は${pref.practicalMultiplier}倍`);
    expect(text).toContain(`${pref.maxScore}点満点`);
  });

  test('kanagawa: targetGrades=[2,3]・中3が中2のちょうど2倍の主張が一致', () => {
    const pref = getPref('kanagawa');
    expect(pref.targetGrades).toEqual([2, 3]);
    expect(pref.gradeMultipliers[3]).toBe(pref.gradeMultipliers[2] * 2);
    expect(pref.maxScore).toBe(135);
  });

  test('osaka: 学年比1:1:3(中1×2倍・中2×2倍・中3×6倍)・450点満点の主張が一致', () => {
    const pref = getPref('osaka');
    const text = allText('osaka');
    expect(pref.gradeMultipliers[1]).toBe(2);
    expect(pref.gradeMultipliers[2]).toBe(2);
    expect(pref.gradeMultipliers[3]).toBe(6);
    expect(pref.gradeMultipliers[3]).toBe(pref.gradeMultipliers[1] * 3);
    expect(text).toContain(`中1×${pref.gradeMultipliers[1]}倍・中2×${pref.gradeMultipliers[2]}倍・中3×${pref.gradeMultipliers[3]}倍`);
    expect(text).toContain(`${pref.maxScore}点満点になります`);
  });

  test('saitama: 学年比1:1:2(中3が2倍)・180点満点の主張が一致', () => {
    const pref = getPref('saitama');
    expect(pref.gradeMultipliers[1]).toBe(pref.gradeMultipliers[2]);
    expect(pref.gradeMultipliers[3]).toBe(pref.gradeMultipliers[1] * 2);
    expect(pref.maxScore).toBe(180);
  });

  test('aichi: targetGrades=[3]・傾斜なし・90点満点(45点×2倍)の主張が一致', () => {
    const pref = getPref('aichi');
    const text = allText('aichi');
    expect(pref.targetGrades).toEqual([3]);
    expect(pref.practicalMultiplier).toBe(pref.coreMultiplier);
    expect(pref.gradeMultipliers[3]).toBe(2);
    expect(text).toContain(`45点満点を${pref.gradeMultipliers[3]}倍した${pref.maxScore}点満点`);
  });

  test('hokkaido: 中1×2・中2×2・中3×3・315点満点の主張が一致', () => {
    const pref = getPref('hokkaido');
    const text = allText('hokkaido');
    expect(pref.gradeMultipliers[1]).toBe(2);
    expect(pref.gradeMultipliers[2]).toBe(2);
    expect(pref.gradeMultipliers[3]).toBe(3);
    expect(text).toContain(`中1×${pref.gradeMultipliers[1]}、中2×${pref.gradeMultipliers[2]}、中3×${pref.gradeMultipliers[3]}`);
    expect(text).toContain(`${pref.maxScore}点満点`);
  });
});

describe('PREFECTURE_FAQ_DATA: 全エントリがprefectures.tsに実在するcodeを持つ(defaultを除く)', () => {
  for (const code of Object.keys(PREFECTURE_FAQ_DATA)) {
    if (code === 'default') continue;
    test(`${code}: prefectures.tsに存在する`, () => {
      expect(() => getPref(code)).not.toThrow();
    });
  }
});
