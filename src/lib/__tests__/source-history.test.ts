import {
  getSourceHistory,
  getAllSourceHistories,
  getAllCompetitionRateSourceHistories,
} from '../source-history';
import { PREFECTURES } from '../prefectures';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

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

describe('getAllCompetitionRateSourceHistories (S6-2 倍率データの一次ソース確認履歴)', () => {
  test('sourcesを持つ県のみを返し、件数がCOMPETITION_RATE_BY_PREFECTUREの実データと一致する(捏造防止の不変条件)', () => {
    const all = getAllCompetitionRateSourceHistories();
    for (const entry of all) {
      const raw = COMPETITION_RATE_BY_PREFECTURE[entry.code];
      expect(raw).toBeDefined();
      expect(entry.sources).toEqual(raw?.sources ?? []);
      expect(entry.sources.length).toBeGreaterThan(0);
    }
  });

  test('sourcesが空の県はCOMPETITION_RATE_BY_PREFECTUREに未収録の都道府県のみである', () => {
    const includedCodes = new Set(getAllCompetitionRateSourceHistories().map((e) => e.code));
    for (const pref of PREFECTURES) {
      if (!includedCodes.has(pref.code)) {
        expect(COMPETITION_RATE_BY_PREFECTURE[pref.code]).toBeUndefined();
      }
    }
  });

  test('都道府県コードの重複がない(一意性)', () => {
    const codes = getAllCompetitionRateSourceHistories().map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
