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

  test('北海道の学校裁量問題廃止エントリはprefectures.tsの現行maxScore(315点満点)と矛盾しない(学力検査の配点変更であり調査書計算式は不変)', () => {
    const hokkaido = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'hokkaido');
    expect(hokkaido).toBeDefined();
    expect(hokkaido?.effectiveYear).toBe('令和4年度（2022年度）入試');
    expect(hokkaido?.category).toBe('weighting-formula');
    expect(hokkaido?.detail).toContain('学校裁量問題');
    expect(hokkaido?.detail).toContain('100点満点');

    const hokkaidoPref = PREFECTURES.find((p) => p.code === 'hokkaido');
    expect(hokkaidoPref?.maxScore).toBe(315);
    expect(hokkaidoPref?.gradeMultipliers).toEqual({ 1: 2, 2: 2, 3: 3 });
  });

  test('山梨県の特別選抜新設エントリはprefectures.tsの現行maxScore(330点満点)と矛盾しない(特定生徒層向けの新選抜経路であり一般選抜の調査書計算式は不変)', () => {
    const yamanashi = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'yamanashi');
    expect(yamanashi).toBeDefined();
    expect(yamanashi?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(yamanashi?.category).toBe('selection-structure');
    expect(yamanashi?.detail).toContain('特別選抜');
    expect(yamanashi?.detail).toContain('不登校');

    const yamanashiPref = PREFECTURES.find((p) => p.code === 'yamanashi');
    expect(yamanashiPref?.maxScore).toBe(330);
    expect(yamanashiPref?.coreMultiplier).toBe(2);
    expect(yamanashiPref?.practicalMultiplier).toBe(3);
  });

  test('長野県の前期選抜学力検査新設エントリはprefectures.tsの現行maxScore(45点満点)と矛盾しない(前期選抜の構成変更であり内申点計算式は不変)', () => {
    const nagano = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'nagano');
    expect(nagano).toBeDefined();
    expect(nagano?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(nagano?.category).toBe('selection-structure');
    expect(nagano?.detail).toContain('前期選抜');
    expect(nagano?.detail).toContain('紙上面接');

    const naganoPref = PREFECTURES.find((p) => p.code === 'nagano');
    expect(naganoPref?.maxScore).toBe(45);
    expect(naganoPref?.targetGrades).toEqual([3]);
  });

  test('岩手県の推薦入試廃止・内申点圧縮先変更エントリはprefectures.tsの現行値(660点満点・500点圧縮)と矛盾しない', () => {
    const iwate = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'iwate');
    expect(iwate).toBeDefined();
    expect(iwate?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(iwate?.category).toBe('selection-structure');
    expect(iwate?.detail).toContain('推薦入試');
    expect(iwate?.detail).toContain('500点満点');

    const iwatePref = PREFECTURES.find((p) => p.code === 'iwate');
    expect(iwatePref?.maxScore).toBe(660);
    expect(iwatePref?.actualMaxScore).toBe(500);
  });

  test('佐賀県の学区制廃止エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(通学区域の変更であり内申点計算式は不変)', () => {
    const saga = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'saga');
    expect(saga).toBeDefined();
    expect(saga?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(saga?.category).toBe('selection-structure');
    expect(saga?.detail).toContain('全県1区');

    const sagaPref = PREFECTURES.find((p) => p.code === 'saga');
    expect(sagaPref?.maxScore).toBe(135);
    expect(sagaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
  });

  test('鹿児島県の推薦選抜自己推薦方式追加エントリはprefectures.tsの現行maxScore(450点満点)と矛盾しない(選抜方式の選択肢拡充であり内申点計算式は不変)', () => {
    const kagoshima = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'kagoshima');
    expect(kagoshima).toBeDefined();
    expect(kagoshima?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(kagoshima?.category).toBe('selection-structure');
    expect(kagoshima?.detail).toContain('自己推薦方式');

    const kagoshimaPref = PREFECTURES.find((p) => p.code === 'kagoshima');
    expect(kagoshimaPref?.maxScore).toBe(450);
    expect(kagoshimaPref?.practicalMultiplier).toBe(20);
  });

  test('大分県の二次試験廃止・複数校志願制度エントリはprefectures.tsの現行値(260点満点圧縮)と矛盾しない(第二志願校の選考手続き変更であり内申点計算式は不変)', () => {
    const oita = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'oita');
    expect(oita).toBeDefined();
    expect(oita?.effectiveYear).toBe('令和8年度（2026年度）入試');
    expect(oita?.category).toBe('selection-structure');
    expect(oita?.detail).toContain('複数校志願制度');
    expect(oita?.detail).toContain('二次試験');

    const oitaPref = PREFECTURES.find((p) => p.code === 'oita');
    expect(oitaPref?.actualMaxScore).toBe(260);
  });

  test('山口県の推薦入試廃止・特色選抜移行エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(出願資格の変更であり内申点計算式は不変)', () => {
    const yamaguchi = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'yamaguchi');
    expect(yamaguchi).toBeDefined();
    expect(yamaguchi?.effectiveYear).toBe('令和8年度（2026年度）入試');
    expect(yamaguchi?.category).toBe('selection-structure');
    expect(yamaguchi?.detail).toContain('特色選抜');
    expect(yamaguchi?.detail).toContain('推薦');

    const yamaguchiPref = PREFECTURES.find((p) => p.code === 'yamaguchi');
    expect(yamaguchiPref?.maxScore).toBe(135);
    expect(yamaguchiPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
  });

  test('鳥取県の推薦入試廃止・特色入学者選抜移行エントリはprefectures.tsの現行maxScore(65点満点)と矛盾しない(出願資格の変更であり内申点計算式は不変)', () => {
    const tottori = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'tottori');
    expect(tottori).toBeDefined();
    expect(tottori?.effectiveYear).toBe('令和5年度（2023年度）入試');
    expect(tottori?.category).toBe('selection-structure');
    expect(tottori?.detail).toContain('特色入学者選抜');

    const tottoriPref = PREFECTURES.find((p) => p.code === 'tottori');
    expect(tottoriPref?.maxScore).toBe(65);
    expect(tottoriPref?.targetGrades).toEqual([3]);
  });

  test('島根県の推薦入試廃止・総合入学者選抜導入エントリはprefectures.tsの現行maxScore(180点満点)と矛盾しない(出願資格の変更であり内申点計算式は不変)', () => {
    const shimane = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'shimane');
    expect(shimane).toBeDefined();
    expect(shimane?.effectiveYear).toBe('令和7年度（2025年度）入試');
    expect(shimane?.category).toBe('selection-structure');
    expect(shimane?.detail).toContain('総合入学者選抜');

    const shimanePref = PREFECTURES.find((p) => p.code === 'shimane');
    expect(shimanePref?.maxScore).toBe(180);
    expect(shimanePref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 2 });
  });

  test('山形県の推薦入学者選抜廃止・前期後期選抜移行エントリはprefectures.tsの現行maxScore(45点満点)と矛盾しない(選抜区分の変更であり内申点計算式は不変)', () => {
    const yamagata = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'yamagata');
    expect(yamagata).toBeDefined();
    expect(yamagata?.effectiveYear).toBe('令和8年度（2026年度）入試');
    expect(yamagata?.category).toBe('selection-structure');
    expect(yamagata?.detail).toContain('前期(特色)選抜');

    const yamagataPref = PREFECTURES.find((p) => p.code === 'yamagata');
    expect(yamagataPref?.maxScore).toBe(45);
    expect(yamagataPref?.targetGrades).toEqual([3]);
  });

  test('滋賀県の選抜統合・学力検査義務化エントリはprefectures.tsの現行maxScore(135点満点)と矛盾しない(選抜区分の統合であり内申点計算式は不変)', () => {
    const shiga = PAST_SYSTEM_CHANGES.find((c) => c.prefCode === 'shiga');
    expect(shiga).toBeDefined();
    expect(shiga?.effectiveYear).toBe('令和8年度（2026年度）入試');
    expect(shiga?.category).toBe('selection-structure');
    expect(shiga?.detail).toContain('学校独自型選抜');

    const shigaPref = PREFECTURES.find((p) => p.code === 'shiga');
    expect(shigaPref?.maxScore).toBe(135);
    expect(shigaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
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
    expect(getPastSystemChangesByPrefecture('wakayama')).toEqual([]);
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

  test('新潟県は対象期間内の制度変更なしと確認済み(令和8年度の調査書様式変更は算出方法に影響しないため収録基準外)', () => {
    const niigata = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'niigata');
    expect(niigata).toBeDefined();
    expect(niigata?.note).toContain('令和9年度');

    const niigataPref = PREFECTURES.find((p) => p.code === 'niigata');
    expect(niigataPref?.maxScore).toBe(135);
    expect(niigataPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(getPastSystemChangesByPrefecture('niigata')).toEqual([]);
  });

  test('岡山県は対象期間内の制度変更なしと確認済み(令和6年度の特別選抜募集割合微増・令和7年度の御津高校限定新枠は県全体の内申点計算に影響しないため収録基準外)', () => {
    const okayama = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'okayama');
    expect(okayama).toBeDefined();
    expect(okayama?.note).toContain('200点満点');

    const okayamaPref = PREFECTURES.find((p) => p.code === 'okayama');
    expect(okayamaPref?.maxScore).toBe(195);
    expect(okayamaPref?.practicalMultiplier).toBe(2);
    expect(getPastSystemChangesByPrefecture('okayama')).toEqual([]);
  });

  test('岐阜県は対象期間内の制度変更なしと確認済み(令和6年度のWeb出願化は出願手続きの変更で内申点計算に影響しないため収録基準外)', () => {
    const gifu = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'gifu');
    expect(gifu).toBeDefined();
    expect(gifu?.note).toContain('Web出願');

    const gifuPref = PREFECTURES.find((p) => p.code === 'gifu');
    expect(gifuPref?.maxScore).toBe(180);
    expect(gifuPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 2 });
    expect(getPastSystemChangesByPrefecture('gifu')).toEqual([]);
  });

  test('熊本県は対象期間内の制度変更なしと確認済み(令和9年度改革は令和8年度以降当面延期と公式発表済み)', () => {
    const kumamoto = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'kumamoto');
    expect(kumamoto).toBeDefined();
    expect(kumamoto?.note).toContain('延期');

    const kumamotoPref = PREFECTURES.find((p) => p.code === 'kumamoto');
    expect(kumamotoPref?.maxScore).toBe(180);
    expect(kumamotoPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 2 });
    expect(getPastSystemChangesByPrefecture('kumamoto')).toEqual([]);
  });

  test('三重県は対象期間内の制度変更なしと確認済み(特定学科の前期100%募集は毎年の定員配分でありDB収録基準外)', () => {
    const mie = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'mie');
    expect(mie).toBeDefined();
    expect(mie?.note).toContain('45点満点');

    const miePref = PREFECTURES.find((p) => p.code === 'mie');
    expect(miePref?.maxScore).toBe(45);
    expect(miePref?.targetGrades).toEqual([3]);
    expect(getPastSystemChangesByPrefecture('mie')).toEqual([]);
  });

  test('富山県は対象期間内の制度変更なしと確認済み(令和9年度以降の制度変更は現在未公表)', () => {
    const toyama = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'toyama');
    expect(toyama).toBeDefined();
    expect(toyama?.note).toContain('未公表');

    const toyamaPref = PREFECTURES.find((p) => p.code === 'toyama');
    expect(toyamaPref?.maxScore).toBe(135);
    expect(toyamaPref?.gradeMultipliers).toEqual({ 1: 0, 2: 1, 3: 2 });
    expect(getPastSystemChangesByPrefecture('toyama')).toEqual([]);
  });

  test('石川県は対象期間内の制度変更なしと確認済み(2026-08-05の135点均等→180点満点訂正は自己データ誤りの訂正であり実際の制度変更ではない)', () => {
    const ishikawa = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'ishikawa');
    expect(ishikawa).toBeDefined();
    expect(ishikawa?.note).toContain('自己データ誤り');

    const ishikawaPref = PREFECTURES.find((p) => p.code === 'ishikawa');
    expect(ishikawaPref?.maxScore).toBe(180);
    expect(ishikawaPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 2 });
    expect(getPastSystemChangesByPrefecture('ishikawa')).toEqual([]);
  });

  test('福井県は対象期間内の制度変更なしと確認済み(推薦一般2トラック・英数選択問題方式とも安定)', () => {
    const fukui = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'fukui');
    expect(fukui).toBeDefined();
    expect(fukui?.note).toContain('45点満点');

    const fukuiPref = PREFECTURES.find((p) => p.code === 'fukui');
    expect(fukuiPref?.maxScore).toBe(45);
    expect(fukuiPref?.targetGrades).toEqual([3]);
    expect(getPastSystemChangesByPrefecture('fukui')).toEqual([]);
  });

  test('栃木県は対象期間内の制度変更なしと確認済み(令和9年度からの特色選抜・一般選抜1本化は対象期間外)', () => {
    const tochigi = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'tochigi');
    expect(tochigi).toBeDefined();
    expect(tochigi?.note).toContain('令和9年度');

    const tochigiPref = PREFECTURES.find((p) => p.code === 'tochigi');
    expect(tochigiPref?.maxScore).toBe(135);
    expect(tochigiPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(getPastSystemChangesByPrefecture('tochigi')).toEqual([]);
  });

  test('茨城県は対象期間内の制度変更なしと確認済み(令和7年度の3変更は出願手続き・時間割・アクセシビリティ配慮でDB収録基準外)', () => {
    const ibaraki = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'ibaraki');
    expect(ibaraki).toBeDefined();
    expect(ibaraki?.note).toContain('135点満点');

    const ibarakiPref = PREFECTURES.find((p) => p.code === 'ibaraki');
    expect(ibarakiPref?.maxScore).toBe(135);
    expect(ibarakiPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(getPastSystemChangesByPrefecture('ibaraki')).toEqual([]);
  });

  test('福島県は対象期間内の制度変更なしと確認済み(令和8年度のWEB出願化は出願手続きの変更で内申点計算に影響しないため収録基準外)', () => {
    const fukushima = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'fukushima');
    expect(fukushima).toBeDefined();
    expect(fukushima?.note).toContain('WEB出願');

    const fukushimaPref = PREFECTURES.find((p) => p.code === 'fukushima');
    expect(fukushimaPref?.maxScore).toBe(195);
    expect(fukushimaPref?.practicalMultiplier).toBe(2);
    expect(getPastSystemChangesByPrefecture('fukushima')).toEqual([]);
  });

  test('青森県は対象期間内の制度変更なしと確認済み(一般選抜/特色化選抜の2区分・135点満点とも安定)', () => {
    const aomori = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'aomori');
    expect(aomori).toBeDefined();
    expect(aomori?.note).toContain('特色化選抜');

    const aomoriPref = PREFECTURES.find((p) => p.code === 'aomori');
    expect(aomoriPref?.maxScore).toBe(135);
    expect(aomoriPref?.gradeMultipliers).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(getPastSystemChangesByPrefecture('aomori')).toEqual([]);
  });

  test('宮城県は対象期間内の制度変更なしと確認済み(共通選抜/特色選抜の2本立て構成・195点満点とも安定)', () => {
    const miyagi = CONFIRMED_NO_CHANGE_CHECKS.find((c) => c.prefCode === 'miyagi');
    expect(miyagi).toBeDefined();
    expect(miyagi?.note).toContain('特色選抜');

    const miyagiPref = PREFECTURES.find((p) => p.code === 'miyagi');
    expect(miyagiPref?.maxScore).toBe(195);
    expect(miyagiPref?.practicalMultiplier).toBe(2);
    expect(getPastSystemChangesByPrefecture('miyagi')).toEqual([]);
  });

  test('同一県がPAST_SYSTEM_CHANGESとCONFIRMED_NO_CHANGE_CHECKSの両方に重複登録されていない', () => {
    const changedPrefs = new Set(PAST_SYSTEM_CHANGES.map((c) => c.prefCode));
    for (const c of CONFIRMED_NO_CHANGE_CHECKS) {
      expect(changedPrefs.has(c.prefCode)).toBe(false);
    }
  });
});
