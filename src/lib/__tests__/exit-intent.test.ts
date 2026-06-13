/**
 * 退出インテントLINEモーダルの frequency cap（純粋ロジック）の契約テスト。
 * 「出し過ぎない（10日に1回）」が回帰しないことを保証する。
 */
import { canShowExitModal } from '@/components/ExitIntentLineModal';

const DAY = 24 * 60 * 60 * 1000;

describe('canShowExitModal', () => {
  test('未表示（null）なら表示可', () => {
    expect(canShowExitModal(null, Date.now())).toBe(true);
  });

  test('10日未満は出さない', () => {
    const now = Date.now();
    expect(canShowExitModal(now - 3 * DAY, now)).toBe(false);
    expect(canShowExitModal(now - 9 * DAY, now)).toBe(false);
  });

  test('10日以上経っていれば再表示可', () => {
    const now = Date.now();
    expect(canShowExitModal(now - 11 * DAY, now)).toBe(true);
  });
});
