import { PAST_SYSTEM_CHANGES, getPastSystemChangesByPrefecture } from '../exam-system-change-history';
import { PREFECTURES } from '../prefectures';

describe('PAST_SYSTEM_CHANGES（Λ+5・過去の制度変更履歴DB）', () => {
  test('全エントリはprefectures.tsに実在する都道府県コードを指す(捏造県防止)', () => {
    const codes = new Set(PREFECTURES.map((p) => p.code));
    for (const c of PAST_SYSTEM_CHANGES) {
      expect(codes.has(c.prefCode)).toBe(true);
    }
  });

  test('全エントリは一次ソースURL(https)・出典名・確認日を持つ(空文字なし)', () => {
    for (const c of PAST_SYSTEM_CHANGES) {
      expect(c.sourceUrl.startsWith('https://')).toBe(true);
      expect(c.sourceTitle.length).toBeGreaterThan(0);
      expect(c.confirmedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('prefNameはprefectures.tsのnameと一致する(表記ゆれ防止)', () => {
    for (const c of PAST_SYSTEM_CHANGES) {
      const pref = PREFECTURES.find((p) => p.code === c.prefCode);
      expect(pref?.name).toBe(c.prefName);
    }
  });

  test('東京都ESAT-Jエントリのスコア言及がprefectures.tsの現行値(1020点満点中20点)と整合する', () => {
    const tokyo = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'tokyo');
    expect(tokyo).toBeDefined();
    expect(tokyo?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(tokyo?.category).toBe('scoring-input');
    expect(tokyo?.detail).toContain('1020点満点');
    expect(tokyo?.detail).toContain('20点');

    const tokyoPref = PREFECTURES.find((p) => p.code === 'tokyo');
    expect(tokyoPref?.reverseCalc?.totalMaxScore).toBe(1020);
    expect(tokyoPref?.reverseCalc?.tokyoSettings?.esatjMaxScore).toBe(20);
  });
});

describe('getPastSystemChangesByPrefecture', () => {
  test('該当県の変更のみを返す', () => {
    expect(getPastSystemChangesByPrefecture('tokyo').every((c) => c.prefCode === 'tokyo')).toBe(true);
  });

  test('変更が無い県は空配列を返す(存在しない変更を捏造しない)', () => {
    expect(getPastSystemChangesByPrefecture('shimane')).toEqual([]);
  });
});
