/**
 * 都道府県データ（信頼の堀）の整合ゲート。
 *
 * PREFECTURES は内申点ツール・API・MCP・CSV・/ask の全てが参照する正準データ。
 * ここが壊れると全機能と「捏造ゼロ」の信頼が崩れるため、構造と不変条件を CI で固定する。
 */

import { PREFECTURES, getPrefectureByCode } from '../prefectures';
import { PREFECTURE_SOURCES } from '../prefecture-sources';
import { EXAM_RATIO_DATA } from '../prefecture-exam-data';
import { calculateMaxScore, calculateTotalScore } from '../utils';
import { DEFAULT_SCORES } from '../constants';
import type { Scores, SubjectKey } from '../types';

const ALL_FIVES: Scores = (Object.keys(DEFAULT_SCORES) as SubjectKey[]).reduce(
  (acc, k) => ({ ...acc, [k]: 5 }),
  {} as Scores,
);
const ALL_ONES: Scores = (Object.keys(DEFAULT_SCORES) as SubjectKey[]).reduce(
  (acc, k) => ({ ...acc, [k]: 1 }),
  {} as Scores,
);

describe('PREFECTURES（47都道府県データ）', () => {
  test('47件・コードが一意で a-z のみ', () => {
    expect(PREFECTURES).toHaveLength(47);
    const codes = PREFECTURES.map((p) => p.code);
    codes.forEach((c) => expect(c).toMatch(/^[a-z]+$/));
    expect(new Set(codes).size).toBe(47);
  });

  test('各県：名称・地域・対象学年・倍率・満点が妥当', () => {
    for (const p of PREFECTURES) {
      expect(p.name.trim().length).toBeGreaterThan(0);
      expect(p.region.trim().length).toBeGreaterThan(0);

      expect(Array.isArray(p.targetGrades)).toBe(true);
      expect(p.targetGrades.length).toBeGreaterThan(0);
      p.targetGrades.forEach((g) => expect([1, 2, 3]).toContain(g));
      // 重複なし
      expect(new Set(p.targetGrades).size).toBe(p.targetGrades.length);

      // 対象学年には正の学年倍率がある
      p.targetGrades.forEach((g) => {
        const m = p.gradeMultipliers[g];
        expect(typeof m).toBe('number');
        expect(m).toBeGreaterThan(0);
      });

      expect(p.coreMultiplier).toBeGreaterThan(0);
      expect(p.practicalMultiplier).toBeGreaterThan(0);
      expect(p.maxScore).toBeGreaterThan(0);
    }
  });

  test('満点の不変条件：保存された maxScore が倍率から導く満点と一致', () => {
    for (const p of PREFECTURES) {
      // 倍率から導出した満点（オール5＝満点）と保存値が一致すること＝データ矛盾の検出
      expect(calculateMaxScore(p.code)).toBe(p.maxScore);
      expect(calculateTotalScore(ALL_FIVES, p.code)).toBe(p.maxScore);
    }
  });

  test('計算の単調性：オール1 < オール5 で範囲内', () => {
    for (const p of PREFECTURES) {
      const lo = calculateTotalScore(ALL_ONES, p.code);
      const hi = calculateTotalScore(ALL_FIVES, p.code);
      expect(lo).toBeGreaterThan(0);
      expect(lo).toBeLessThan(hi);
      expect(hi).toBe(p.maxScore);
    }
  });

  test('出典URLは形式が正しい（あるものはhttp(s)）', () => {
    for (const p of PREFECTURES) {
      for (const url of [p.sourceUrl, p.sourceUrl2]) {
        if (url) expect(url).toMatch(/^https?:\/\//);
      }
    }
  });
});

/**
 * E-E-A-T 応急処置B（出典の一次化）の回帰ガード。
 * DDレポート最大リスク「sourceTitle＝教育委員会／sourceUrl＝二次メディア」の自己矛盾を
 * 検証済み県では恒久的に潰す。primary は教育委員会/県公式ドメイン、二次は sourceUrl2 へ。
 */
describe('E-E-A-T: 出典の一次化（応急処置B）', () => {
  // 教育委員会・県公式のドメイン（pref.*.jp / *.lg.jp / *.ed.jp / *.go.jp / metro.tokyo）。
  const OFFICIAL_DOMAIN = /(\.lg\.jp|\.go\.jp|\.ed\.jp|pref\.[a-z]+\.jp|metro\.tokyo)/;
  // 一次URLを primary に確定済みの県（流入上位＋検証済み）。
  const OFFICIAL_PRIMARY = [
    'tokyo', 'kanagawa', 'osaka', 'aichi', 'fukuoka', 'hokkaido', 'saitama',
    'chiba', 'hyogo', 'yamagata', 'tottori', 'fukui', 'kagoshima', 'aomori',
  ];

  test('検証済み県は primary sourceUrl が教育委員会/県公式（二次メディアでない）', () => {
    for (const code of OFFICIAL_PRIMARY) {
      const p = getPrefectureByCode(code);
      expect(p).toBeTruthy();
      expect(p!.sourceUrl).toBeTruthy();
      expect(p!.sourceUrl!).toMatch(OFFICIAL_DOMAIN);
    }
  });

  test('PREFECTURE_SOURCES を持つ県は primary がその一次URL集合に含まれる', () => {
    for (const [code, sources] of Object.entries(PREFECTURE_SOURCES)) {
      const p = getPrefectureByCode(code);
      expect(p).toBeTruthy();
      const officialUrls = sources.map((s) => s.sourceUrl);
      expect(officialUrls).toContain(p!.sourceUrl);
    }
  });

  test('一次化した県は二次ソースを sourceUrl2（相互検証）として保持', () => {
    for (const code of OFFICIAL_PRIMARY) {
      const p = getPrefectureByCode(code);
      // aomori は元々一次のみ＝二次任意。それ以外は相互検証の二次を残す。
      if (code === 'aomori') continue;
      expect(p!.sourceUrl2).toBeTruthy();
    }
  });
});

describe('EXAM_RATIO_DATA（配点比率データ）', () => {
  test('各エントリは実在する県を指す', () => {
    for (const e of EXAM_RATIO_DATA) {
      expect(getPrefectureByCode(e.prefectureCode)).toBeTruthy();
    }
  });

  test('一般入試の内申:学力 比率は合計100・満点は正', () => {
    for (const e of EXAM_RATIO_DATA) {
      const g = e.generalExam;
      expect(g.naishinRatio + g.examRatio).toBe(100);
      expect(g.examMaxScore).toBeGreaterThan(0);
      expect(g.totalMaxScore).toBeGreaterThan(0);
      expect(g.subjects).toBeGreaterThan(0);
    }
  });
});
