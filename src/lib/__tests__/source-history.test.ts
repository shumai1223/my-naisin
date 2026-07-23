import { getSourceHistory, getAllSourceHistories } from '../source-history';
import { PREFECTURES } from '../prefectures';

describe('source-history (X-14 一次ソース確認履歴アーカイブ)', () => {
  test('全47都道府県ぶんの履歴が取得できる', () => {
    const all = getAllSourceHistories();
    expect(all).toHaveLength(47);
  });

  test('各都道府県の最初のエントリはprefectures.tsのlastVerified/sourceUrl/sourceTitleと完全一致する(捏造防止の不変条件)', () => {
    for (const pref of PREFECTURES) {
      const history = getSourceHistory(pref.code);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].date).toBe(pref.lastVerified);
      expect(history[0].sourceUrl).toBe(pref.sourceUrl);
      expect(history[0].sourceTitle).toBe(pref.sourceTitle);
    }
  });

  test('履歴は日付の昇順でソートされている', () => {
    const tokyo = getSourceHistory('tokyo');
    const dates = tokyo.map((h) => h.date);
    const sorted = [...dates].sort((a, b) => a.localeCompare(b));
    expect(dates).toEqual(sorted);
  });

  test('存在しない都道府県コードは空配列を返す', () => {
    expect(getSourceHistory('not-a-real-prefecture')).toEqual([]);
  });

  test('都道府県コードの重複がない(一意性)', () => {
    const codes = getAllSourceHistories().map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
