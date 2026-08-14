// utils.ts: buildShareText/getSubjectWeight/updateScoreValueは
// calculateTotalScore等と違いprefecture-calculation.test.ts等の間接カバーが無く無テストだった。
// buildShareText(SNSシェア文言生成)・getSubjectWeight(倍率表示)・updateScoreValue(入力ゲート)の契約を固定する。

import { buildShareText, getSubjectWeight, updateScoreValue } from '../utils';
import type { Scores } from '../types';

function baseScores(overrides: Partial<Scores> = {}): Scores {
  return {
    japanese: 3,
    math: 3,
    english: 3,
    science: 3,
    social: 3,
    music: 3,
    art: 3,
    pe: 3,
    tech: 3,
    ...overrides,
  };
}

describe('buildShareText', () => {
  const base = {
    appName: 'My Naishin',
    rankCode: 'A',
    title: 'エース',
    total: 36,
    max: 45,
    percent: 80,
    url: 'https://my-naishin.com/',
  };

  it('アプリ名・ランクコード・タイトル・スコア・URLを全て含む', () => {
    const text = buildShareText(base);
    expect(text).toContain(base.appName);
    expect(text).toContain(base.rankCode);
    expect(text).toContain(base.title);
    expect(text).toContain(`${base.total}/${base.max}`);
    expect(text).toContain(base.url);
  });

  it('percentは整数%として埋め込まれる(小数は切り捨て)', () => {
    const text = buildShareText({ ...base, percent: 79.999 });
    expect(text).toContain('79%');
    expect(text).not.toContain('80%');
  });

  it('percentが100超・負値でも0-100にクランプされて表示される', () => {
    expect(buildShareText({ ...base, percent: 150 })).toContain('100%');
    expect(buildShareText({ ...base, percent: -10 })).toContain('0%');
  });
});

describe('getSubjectWeight', () => {
  it('実在する県コードで実技科目の倍率がcore倍率と異なる(東京都=1倍/2倍)', () => {
    expect(getSubjectWeight('tokyo', 'core')).toBe(1);
    expect(getSubjectWeight('tokyo', 'practical')).toBe(2);
  });

  it('coreとpracticalが同倍率の県(大阪府=1倍/1倍)', () => {
    expect(getSubjectWeight('osaka', 'core')).toBe(1);
    expect(getSubjectWeight('osaka', 'practical')).toBe(1);
  });

  it('未知の県コードはcore/practicalとも1を返す(デフォルト計算式=45点満点相当)', () => {
    expect(getSubjectWeight('not-a-real-prefecture', 'core')).toBe(1);
    expect(getSubjectWeight('not-a-real-prefecture', 'practical')).toBe(1);
  });
});

describe('updateScoreValue', () => {
  it('指定キーのみ更新し他のキーは不変', () => {
    const scores = baseScores();
    const next = updateScoreValue(scores, 'math', 5);
    expect(next.math).toBe(5);
    expect(next.japanese).toBe(scores.japanese);
  });

  it('元のオブジェクトを破壊しない(非破壊)', () => {
    const scores = baseScores();
    const snapshot = { ...scores };
    updateScoreValue(scores, 'english', 5);
    expect(scores).toEqual(snapshot);
  });

  it('1-5の範囲外は1-5にクランプされる(0以下は1・6以上は5)', () => {
    expect(updateScoreValue(baseScores(), 'science', 0).science).toBe(1);
    expect(updateScoreValue(baseScores(), 'science', -3).science).toBe(1);
    expect(updateScoreValue(baseScores(), 'science', 6).science).toBe(5);
    expect(updateScoreValue(baseScores(), 'science', 100).science).toBe(5);
  });

  it('小数は丸められてからクランプされる', () => {
    expect(updateScoreValue(baseScores(), 'social', 3.6).social).toBe(4);
    expect(updateScoreValue(baseScores(), 'social', 3.4).social).toBe(3);
  });
});
