/**
 * 事業者情報（特商法表記・見積書の単一ソース）の不変条件テスト。
 * PIIをloopが記録しない原則（[[gate-decisions-2026-07-28]]）のガード＝
 * 実値が入るまでは全フィールドが「準備中」プレースホルダのままであることを固定する。
 */

import { BUSINESS_INFO, isBusinessInfoPending } from '../business-info';

describe('BUSINESS_INFO（loopはPIIを記録しない・実値化は👤のみ）', () => {
  test('全フィールドがプレースホルダ文言のまま（実在の氏名・住所・電話番号が紛れ込んでいない）', () => {
    for (const value of Object.values(BUSINESS_INFO)) {
      expect(value).toContain('準備中');
    }
  });

  test('isBusinessInfoPending はプレースホルダの間は true を返す', () => {
    expect(isBusinessInfoPending()).toBe(true);
  });
});

describe('isBusinessInfoPending', () => {
  test('sellerName が「準備中」で始まらなくなれば false になる（実値化後の検知）', () => {
    expect(isBusinessInfoPending('準備中（親権者名義で表記予定）')).toBe(true);
    expect(isBusinessInfoPending('株式会社サンプル')).toBe(false);
  });

  test('引数省略時は BUSINESS_INFO.sellerName を見る（デフォルト値の配線確認）', () => {
    expect(isBusinessInfoPending()).toBe(isBusinessInfoPending(BUSINESS_INFO.sellerName));
  });
});
