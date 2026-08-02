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

  test('千葉県の前期/後期選抜一本化エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(選抜回数の変更であり内申点計算式は不変)', () => {
    const chiba = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'chiba');
    expect(chiba).toBeDefined();
    expect(chiba?.effectiveYear).toBe('令和3年度（2021年度）入試');
    expect(chiba?.category).toBe('selection-structure');
    expect(chiba?.detail).toContain('一般入学者選抜');
    expect(chiba?.detail).toContain('変更がなく');

    const chibaPref = PREFECTURES.find((p) => p.code === 'chiba');
    expect(chibaPref?.maxScore).toBe(135);
  });

  test('愛媛県の推薦入学者選抜→特色入学者選抜エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(出願資格の変更であり内申点計算式は不変)', () => {
    const ehime = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'ehime');
    expect(ehime).toBeDefined();
    expect(ehime?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(ehime?.category).toBe('selection-structure');
    expect(ehime?.detail).toContain('特色入学者選抜');

    const ehimePref = PREFECTURES.find((p) => p.code === 'ehime');
    expect(ehimePref?.maxScore).toBe(135);
    expect(ehimePref?.practicalMultiplier).toBe(1);
  });

  test('広島県の配点比率・学年別倍率変更エントリはprefectures.tsの現行値(学年比1:1:3・225点満点)と一致する', () => {
    const hiroshima = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'hiroshima');
    expect(hiroshima).toBeDefined();
    expect(hiroshima?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(hiroshima?.category).toBe('weighting-formula');
    expect(hiroshima?.detail).toContain('6：2：2');
    expect(hiroshima?.detail).toContain('1：1：3');

    const hiroshimaPref = PREFECTURES.find((p) => p.code === 'hiroshima');
    expect(hiroshimaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 3 });
    expect(hiroshimaPref?.maxScore).toBe(225);
  });

  test('秋田県の調査書対象学年拡大エントリはprefectures.tsの現行値(1〜3年生・195点満点)と一致する', () => {
    const akita = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'akita');
    expect(akita).toBeDefined();
    expect(akita?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(akita?.category).toBe('weighting-formula');
    expect(akita?.detail).toContain('中学3年生の評定のみ（65点満点）');
    expect(akita?.detail).toContain('195点満点');

    const akitaPref = PREFECTURES.find((p) => p.code === 'akita');
    expect(akitaPref?.targetGrades).toEqual([1, 2, 3]);
    expect(akitaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(akitaPref?.practicalMultiplier).toBe(2);
    expect(akitaPref?.maxScore).toBe(195);
  });

  test('categoryは定義済みの4種類のいずれかのみ(型崩れ防止)', () => {
    const validCategories = new Set(['scoring-input', 'selection-structure', 'weighting-formula', 'other']);
    for (const c of PAST_SYSTEM_CHANGES) {
      expect(validCategories.has(c.category)).toBe(true);
    }
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
