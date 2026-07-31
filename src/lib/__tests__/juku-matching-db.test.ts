/**
 * @jest-environment node
 *
 * 直接マッチング市場バックエンド試作(Λ-7)のスキーマ層契約テスト。
 * 成果計上の純粋計算(computeCommissionYen等)と、D1未バインド環境(jest)での
 * 全関数のno-op安全性(例外を投げない・入力バリデーションが先に効く)を固定する。
 */
import {
  isValidCommissionRateBps,
  computeCommissionYen,
  isValidBillingPeriod,
  createJukuPartner,
  getJukuPartner,
  recordReferral,
  updateReferralStatus,
  recordCommissionEntry,
  getPartnerLedger,
  listJukuPartners,
  listReferrals,
} from '../juku-matching-db';

describe('isValidCommissionRateBps', () => {
  test('0〜10000(0%〜100%)は妥当', () => {
    expect(isValidCommissionRateBps(0)).toBe(true);
    expect(isValidCommissionRateBps(1000)).toBe(true);
    expect(isValidCommissionRateBps(10000)).toBe(true);
  });

  test('範囲外・非整数は不正', () => {
    expect(isValidCommissionRateBps(-1)).toBe(false);
    expect(isValidCommissionRateBps(10001)).toBe(false);
    expect(isValidCommissionRateBps(10.5)).toBe(false);
    expect(isValidCommissionRateBps(NaN)).toBe(false);
  });
});

describe('computeCommissionYen', () => {
  test('50,000円の10%(1000bps)は5,000円', () => {
    expect(computeCommissionYen(50000, 1000)).toBe(5000);
  });

  test('丸め誤差が出る組み合わせは四捨五入する', () => {
    // 33333円の10%=3333.3 → 3333
    expect(computeCommissionYen(33333, 1000)).toBe(3333);
    // 33335円の10%=3333.5 → 3334(四捨五入)
    expect(computeCommissionYen(33335, 1000)).toBe(3334);
  });

  test('rateが0なら0円', () => {
    expect(computeCommissionYen(100000, 0)).toBe(0);
  });

  test('rateが100%(10000bps)なら全額', () => {
    expect(computeCommissionYen(80000, 10000)).toBe(80000);
  });

  test('負の金額・不正なrateは0を返す(例外を投げない)', () => {
    expect(computeCommissionYen(-100, 1000)).toBe(0);
    expect(computeCommissionYen(100000, -1)).toBe(0);
    expect(computeCommissionYen(100000, 10001)).toBe(0);
    expect(computeCommissionYen(NaN, 1000)).toBe(0);
  });
});

describe('isValidBillingPeriod', () => {
  test('YYYY-MM形式(01〜12月)は妥当', () => {
    expect(isValidBillingPeriod('2026-01')).toBe(true);
    expect(isValidBillingPeriod('2026-12')).toBe(true);
  });

  test('不正な形式・月は拒否', () => {
    expect(isValidBillingPeriod('2026-00')).toBe(false);
    expect(isValidBillingPeriod('2026-13')).toBe(false);
    expect(isValidBillingPeriod('2026/01')).toBe(false);
    expect(isValidBillingPeriod('26-01')).toBe(false);
    expect(isValidBillingPeriod('')).toBe(false);
  });
});

describe('createJukuPartner（D1未バインド環境=jest）', () => {
  test('空文字・空白のみの塾名はD1に触れず即null', async () => {
    expect(await createJukuPartner('', 1000)).toBeNull();
    expect(await createJukuPartner('   ', 1000)).toBeNull();
  });

  test('不正なcommissionRateBpsはnull', async () => {
    expect(await createJukuPartner('提携塾A', -1)).toBeNull();
    expect(await createJukuPartner('提携塾A', 10001)).toBeNull();
  });

  test('正当な入力でもD1未バインドならnull(例外を投げない)', async () => {
    expect(await createJukuPartner('提携塾A', 1000)).toBeNull();
  });
});

describe('getJukuPartner（D1未バインド環境=jest）', () => {
  test('D1未バインドならnull', async () => {
    expect(await getJukuPartner(1)).toBeNull();
  });
});

describe('recordReferral（D1未バインド環境=jest）', () => {
  test('studentRefが空ならD1に触れず即null', async () => {
    expect(await recordReferral({ jukuPartnerId: 1, studentRef: '' })).toBeNull();
  });

  test('jukuPartnerIdが不正(NaN)ならnull', async () => {
    expect(await recordReferral({ jukuPartnerId: NaN, studentRef: 'ref-abc' })).toBeNull();
  });

  test('正当な入力でもD1未バインドならnull(例外を投げない)', async () => {
    expect(
      await recordReferral({ jukuPartnerId: 1, studentRef: 'ref-abc', prefectureCode: 'tokyo', format: 'online' })
    ).toBeNull();
  });
});

describe('updateReferralStatus（D1未バインド環境=jest）', () => {
  test('D1未バインドならfalse(例外を投げない)', async () => {
    expect(await updateReferralStatus(1, 'converted')).toBe(false);
  });
});

describe('recordCommissionEntry（D1未バインド環境=jest）', () => {
  test('金額が負・請求月が不正ならD1に触れず即null', async () => {
    expect(await recordCommissionEntry({ referralId: 1, grossAmountYen: -1, billingPeriod: '2026-11' })).toBeNull();
    expect(await recordCommissionEntry({ referralId: 1, grossAmountYen: 50000, billingPeriod: 'bad' })).toBeNull();
  });

  test('正当な入力でもD1未バインドならnull(例外を投げない)', async () => {
    expect(
      await recordCommissionEntry({ referralId: 1, grossAmountYen: 50000, billingPeriod: '2026-11' })
    ).toBeNull();
  });
});

describe('getPartnerLedger（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列', async () => {
    await expect(getPartnerLedger(1)).resolves.toEqual([]);
  });
});

describe('listJukuPartners（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列(例外を投げない)', async () => {
    await expect(listJukuPartners()).resolves.toEqual([]);
  });
});

describe('listReferrals（D1未バインド環境=jest）', () => {
  test('D1未バインドなら空配列(status指定あり・例外を投げない)', async () => {
    await expect(listReferrals('sent')).resolves.toEqual([]);
  });

  test('D1未バインドなら空配列(status未指定・例外を投げない)', async () => {
    await expect(listReferrals()).resolves.toEqual([]);
  });
});
