import { PREFECTURE_PITFALLS } from '../prefecture-pitfalls-data';
import { PREFECTURES, PrefectureConfig } from '../prefectures';

// 2026-08-17: 岩手県教育委員会からの指摘で、PREFECTURE_PITFALLS内の手書き文言が
// prefectures.tsの実際の設定値からドリフトしていることが発覚した（実技倍率1.5倍→誤り、
// 圧縮後点数440点→旧基準の書き忘れ）。同じ調査で石川県のpitfallsが「学年差なし均等評価・
// 135点満点」という別県向けの定型文をそのままコピーしており、実際は中3のみ2倍・180点満点
// だったという第2の誤りも見つかった。この2パターンの再発を機械的に検知する不変条件テスト。

function getPref(code: string): PrefectureConfig {
  const p = PREFECTURES.find((x) => x.code === code);
  if (!p) throw new Error(`prefectures.tsに${code}が見つからない`);
  return p;
}

describe('PREFECTURE_PITFALLS: 「均等評価」を謳う県は実際にgradeMultipliersが全学年同一', () => {
  for (const [code, entry] of Object.entries(PREFECTURE_PITFALLS)) {
    const allText = entry.items.join('');
    if (!allText.includes('均等評価')) continue;

    test(`${code}: 均等評価の記載どおりgradeMultipliersが対象学年で全て同じ`, () => {
      const pref = getPref(code);
      const values = pref.targetGrades.map((g) => pref.gradeMultipliers[g]);
      const allEqual = values.every((v) => v === values[0]);
      expect(allEqual).toBe(true);
    });
  }
});

describe('PREFECTURE_PITFALLS: 「9教科×5段階×3学年＝135点満点」の定型文を使う県は実際にmaxScore=135', () => {
  for (const [code, entry] of Object.entries(PREFECTURE_PITFALLS)) {
    const allText = entry.items.join('');
    if (!allText.includes('9教科×5段階×3学年＝135点満点')) continue;

    test(`${code}: 定型文どおりmaxScoreが135`, () => {
      const pref = getPref(code);
      expect(pref.maxScore).toBe(135);
    });
  }
});

describe('PREFECTURE_PITFALLS: 「中1・中2は等倍、中3のみ2倍」を謳う県はgradeMultipliers[3]が[1]・[2]のちょうど2倍', () => {
  for (const [code, entry] of Object.entries(PREFECTURE_PITFALLS)) {
    const allText = entry.items.join('');
    if (!allText.includes('中1・中2は等倍、中3のみ2倍')) continue;

    test(`${code}: 記載どおりgradeMultipliers[3] = 2 × gradeMultipliers[1,2]`, () => {
      const pref = getPref(code);
      expect(pref.gradeMultipliers[3]).toBe(pref.gradeMultipliers[1] * 2);
      expect(pref.gradeMultipliers[1]).toBe(pref.gradeMultipliers[2]);
    });
  }
});
