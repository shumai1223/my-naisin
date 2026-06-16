/**
 * total-score（総合得点） ↔ prefectures（内申）の整合ゲート＝二重管理の事故防止（信頼の堀）。
 *
 * total-score の県データ（registry の計算機13県＋explainers の解説34県）は、内申の正準データ
 * PREFECTURES とは別ファイルで管理している。コード/県名がドリフトすると「存在しない県の総合得点ページ」や
 * 「県名の食い違い」が生まれ、捏造ゼロの信頼が崩れる。ここで不変条件を CI に固定する。
 */

import { PREFECTURES, getPrefectureByCode } from '../../prefectures';
import { VERIFIED_TOTAL_SCORE_CODES, getTotalScoreSystem } from '../registry';
import { EXPLAINER_CODES, getExplainer } from '../explainers';

const VALID_CODES = new Set(PREFECTURES.map((p) => p.code));

describe('total-score ↔ prefectures 整合', () => {
  test('計算機の県コードはすべて実在する47県を指す', () => {
    expect(VERIFIED_TOTAL_SCORE_CODES.length).toBeGreaterThan(0);
    for (const code of VERIFIED_TOTAL_SCORE_CODES) {
      expect(VALID_CODES.has(code)).toBe(true);
    }
  });

  test('解説の県コードはすべて実在する47県を指す', () => {
    expect(EXPLAINER_CODES.length).toBeGreaterThan(0);
    for (const code of EXPLAINER_CODES) {
      expect(VALID_CODES.has(code)).toBe(true);
    }
  });

  test('計算機と解説は排他（同一県を二重管理しない）', () => {
    const calc = new Set(VERIFIED_TOTAL_SCORE_CODES);
    for (const code of EXPLAINER_CODES) {
      expect(calc.has(code)).toBe(false);
    }
  });

  test('計算機＋解説で重複コードがない', () => {
    const all = [...VERIFIED_TOTAL_SCORE_CODES, ...EXPLAINER_CODES];
    expect(new Set(all).size).toBe(all.length);
  });

  test('計算機の県名は PREFECTURES の県名と一致（ドリフト検出）', () => {
    for (const code of VERIFIED_TOTAL_SCORE_CODES) {
      const sys = getTotalScoreSystem(code);
      const pref = getPrefectureByCode(code);
      expect(sys?.name).toBe(pref?.name);
    }
  });

  test('解説の県名は PREFECTURES の県名と一致（ドリフト検出）', () => {
    for (const code of EXPLAINER_CODES) {
      const exp = getExplainer(code);
      const pref = getPrefectureByCode(code);
      expect(exp?.name).toBe(pref?.name);
    }
  });
});
