import {
  PAST_SYSTEM_CHANGES,
  getPastSystemChangesByPrefecture,
  CONFIRMED_NO_CHANGE_CHECKS,
} from '../exam-system-change-history';
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

  test('群馬県の前期/後期選抜廃止エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(選抜方式の変更であり内申点計算式は不変)', () => {
    const gunma = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'gunma');
    expect(gunma).toBeDefined();
    expect(gunma?.effectiveYear).toBe('令和6年度（2024年度）入試');
    expect(gunma?.category).toBe('selection-structure');
    expect(gunma?.detail).toContain('特色型');
    expect(gunma?.detail).toContain('総合型');
    expect(gunma?.detail).toContain('変わっておらず');

    const gunmaPref = PREFECTURES.find((p) => p.code === 'gunma');
    expect(gunmaPref?.maxScore).toBe(135);
    expect(gunmaPref?.practicalMultiplier).toBe(1);
  });

  test('長崎県の3選抜制度再編エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(選抜制度の再編であり内申点計算式は不変)', () => {
    const nagasaki = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'nagasaki');
    expect(nagasaki).toBeDefined();
    expect(nagasaki?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(nagasaki?.category).toBe('selection-structure');
    expect(nagasaki?.detail).toContain('特別選抜');
    expect(nagasaki?.detail).toContain('チャレンジ選抜');

    const nagasakiPref = PREFECTURES.find((p) => p.code === 'nagasaki');
    expect(nagasakiPref?.maxScore).toBe(135);
    expect(nagasakiPref?.practicalMultiplier).toBe(1);
  });

  test('福岡県の第2志望校制度新設エントリはprefectures.tsの現行maxScore(45点満点)と矛盾しない(選抜の敗者復活制度であり内申点計算式は不変)', () => {
    const fukuoka = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'fukuoka');
    expect(fukuoka).toBeDefined();
    expect(fukuoka?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(fukuoka?.category).toBe('selection-structure');
    expect(fukuoka?.detail).toContain('第2志望校制度');
    expect(fukuoka?.detail).toContain('変わったのは');

    const fukuokaPref = PREFECTURES.find((p) => p.code === 'fukuoka');
    expect(fukuokaPref?.maxScore).toBe(45);
    expect(fukuokaPref?.targetGrades).toEqual([3]);
  });

  test('愛知県の学力検査1回化・特色選抜新設エントリはprefectures.tsの現行maxScore(90点満点)と矛盾しない(選抜方式の変更であり内申点計算式は不変)', () => {
    const aichi = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'aichi');
    expect(aichi).toBeDefined();
    expect(aichi?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(aichi?.category).toBe('selection-structure');
    expect(aichi?.detail).toContain('特色選抜');
    expect(aichi?.detail).toContain('マークシート');

    const aichiPref = PREFECTURES.find((p) => p.code === 'aichi');
    expect(aichiPref?.maxScore).toBe(90);
    expect(aichiPref?.gradeMultipliers).toEqual({ 1: 0, 2: 0, 3: 2 });
  });

  test('神奈川県の面接一律廃止・観点別評価新設エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(S値算出の要素構成変更であり調査書の計算式自体は不変)', () => {
    const kanagawa = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'kanagawa');
    expect(kanagawa).toBeDefined();
    expect(kanagawa?.effectiveYear).toBe('令和6年度（2024年度）入試');
    expect(kanagawa?.category).toBe('selection-structure');
    expect(kanagawa?.detail).toContain('主体的に学習に取り組む態度');
    expect(kanagawa?.detail).toContain('面接');

    const kanagawaPref = PREFECTURES.find((p) => p.code === 'kanagawa');
    expect(kanagawaPref?.maxScore).toBe(135);
    expect(kanagawaPref?.gradeMultipliers).toEqual({ 1: 0, 2: 1, 3: 2 });
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

describe('CONFIRMED_NO_CHANGE_CHECKS（掛-4・空振りの調査記録）', () => {
  test('全エントリはprefectures.tsに実在する都道府県コードを指す(捏造県防止)', () => {
    const codes = new Set(PREFECTURES.map((p) => p.code));
    for (const c of CONFIRMED_NO_CHANGE_CHECKS) {
      expect(codes.has(c.prefCode)).toBe(true);
    }
  });

  test('prefNameはprefectures.tsのnameと一致する(表記ゆれ防止)', () => {
    for (const c of CONFIRMED_NO_CHANGE_CHECKS) {
      const pref = PREFECTURES.find((p) => p.code === c.prefCode);
      expect(pref?.name).toBe(c.prefName);
    }
  });

  test('全エントリは確認日・調査要約を持つ(空文字なし)', () => {
    for (const c of CONFIRMED_NO_CHANGE_CHECKS) {
      expect(c.confirmedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.note.length).toBeGreaterThan(0);
      expect(c.yearRange.length).toBeGreaterThan(0);
    }
  });

  test('大阪府は対象期間内の制度変更なしと確認済み(令和10年度以降の予告は対象期間外)', () => {
    const osaka = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'osaka');
    expect(osaka).toBeDefined();
    expect(osaka?.note).toContain('令和10年度');
    expect(getPastSystemChangesByPrefecture('osaka')).toEqual([]);
  });

  test('静岡県は対象期間内の制度変更なしと確認済み(WebSearch要約の誤った180点満点説はWebFetchで否定済み)', () => {
    const shizuoka = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'shizuoka');
    expect(shizuoka).toBeDefined();
    expect(shizuoka?.note).toContain('45点満点');

    const shizuokaPref = PREFECTURES.find((p) => p.code === 'shizuoka');
    expect(shizuokaPref?.maxScore).toBe(45);
    expect(shizuokaPref?.targetGrades).toEqual([3]);
    expect(getPastSystemChangesByPrefecture('shizuoka')).toEqual([]);
  });

  test('埼玉県は対象期間内の制度変更なしと確認済み(令和9年度からの共通選抜・特色選抜再編は対象期間外)', () => {
    const saitama = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'saitama');
    expect(saitama).toBeDefined();
    expect(saitama?.note).toContain('令和9年度');

    const saitamaPref = PREFECTURES.find((p) => p.code === 'saitama');
    expect(saitamaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 2 });
    expect(saitamaPref?.maxScore).toBe(180);
    expect(getPastSystemChangesByPrefecture('saitama')).toEqual([]);
  });

  test('兵庫県は対象期間内の制度変更なしと確認済み(令和6年度の唯一の要綱変更は追検査資格の事務的追記のみ)', () => {
    const hyogo = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'hyogo');
    expect(hyogo).toBeDefined();
    expect(hyogo?.note).toContain('250点満点');

    const hyogoPref = PREFECTURES.find((p) => p.code === 'hyogo');
    expect(hyogoPref?.maxScore).toBe(250);
    expect(hyogoPref?.coreMultiplier).toBe(4);
    expect(hyogoPref?.practicalMultiplier).toBe(7.5);
    expect(getPastSystemChangesByPrefecture('hyogo')).toEqual([]);
  });

  test('京都府は対象期間内の制度変更なしと確認済み(令和9年度からの前期中期一本化は対象期間外)', () => {
    const kyoto = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'kyoto');
    expect(kyoto).toBeDefined();
    expect(kyoto?.note).toContain('令和9年度');

    const kyotoPref = PREFECTURES.find((p) => p.code === 'kyoto');
    expect(kyotoPref?.maxScore).toBe(195);
    expect(kyotoPref?.practicalMultiplier).toBe(2);
    expect(getPastSystemChangesByPrefecture('kyoto')).toEqual([]);
  });

  test('同一県がPAST_SYSTEM_CHANGESとCONFIRMED_NO_CHANGE_CHECKSの両方に重複登録されていない', () => {
    const changedPrefs = new Set(PAST_SYSTEM_CHANGES.map((c) => c.prefCode));
    for (const c of CONFIRMED_NO_CHANGE_CHECKS) {
      expect(changedPrefs.has(c.prefCode)).toBe(false);
    }
  });
});
