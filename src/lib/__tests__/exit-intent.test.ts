/**
 * 退出インテントLINEモーダルの frequency cap（純粋ロジック）の契約テスト。
 * 「出し過ぎない（10日に1回）」が回帰しないことを保証する。
 */
import { canShowExitModal, isRecentLinkClick } from '@/components/ExitIntentLineModal';

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

describe('isRecentLinkClick（別タブでリンクを開いた直後は離脱とみなさない）', () => {
  const now = 1_000_000;

  test('リンクをクリックしていなければ false', () => {
    expect(isRecentLinkClick(null, now)).toBe(false);
  });

  test('クリックの直後（5秒未満）は true', () => {
    expect(isRecentLinkClick(now, now)).toBe(true);
    expect(isRecentLinkClick(now - 500, now)).toBe(true);
    expect(isRecentLinkClick(now - 4999, now)).toBe(true);
  });

  test('5秒以上たてば false（その後の本当の離脱は捕捉する）', () => {
    expect(isRecentLinkClick(now - 5000, now)).toBe(false);
    expect(isRecentLinkClick(now - 60_000, now)).toBe(false);
  });

  test('時計が戻るなど、クリックが未来の時刻なら false', () => {
    expect(isRecentLinkClick(now + 1, now)).toBe(false);
  });
});
