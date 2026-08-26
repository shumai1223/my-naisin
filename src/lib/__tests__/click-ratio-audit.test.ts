import { auditClickRatios, CLICK_RATIO_THRESHOLDS, type ClickRatioAuditRow } from '../click-ratio-audit';
import { classifyClick } from '../bot-filter';

const CHROME_DESKTOP =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SAFARI_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const BOT_UA = 'python-requests/2.31';

function humanMobileRow(): ClickRatioAuditRow {
  return { userAgent: SAFARI_IOS, referer: 'https://my-naishin.com/hensachi', placement: 'hensachi' };
}
function humanDesktopRow(): ClickRatioAuditRow {
  return { userAgent: CHROME_DESKTOP, referer: 'https://my-naishin.com/hensachi', placement: 'hensachi' };
}
function botRow(): ClickRatioAuditRow {
  return { userAgent: BOT_UA, referer: null, placement: null };
}

describe('auditClickRatios（DW-7 #10・不変条件）', () => {
  test('ratio系の値は常に0〜1', () => {
    const rows = [...Array(5).fill(0).map(humanMobileRow), ...Array(3).fill(0).map(humanDesktopRow), ...Array(4).fill(0).map(botRow)];
    const report = auditClickRatios(rows, classifyClick);
    expect(report.humanRatio).toBeGreaterThanOrEqual(0);
    expect(report.humanRatio).toBeLessThanOrEqual(1);
    expect(report.mobileAmongHuman?.ratio).toBeGreaterThanOrEqual(0);
    expect(report.mobileAmongHuman?.ratio).toBeLessThanOrEqual(1);
  });

  test('件数の内訳合計はtotalと一致する（分類漏れ・二重計上の防止）', () => {
    const rows = [...Array(5).fill(0).map(humanMobileRow), ...Array(3).fill(0).map(humanDesktopRow), ...Array(4).fill(0).map(botRow)];
    const report = auditClickRatios(rows, classifyClick);
    expect(report.human + report.bot + report.suspect + report.unknown).toBe(report.total);
  });

  test('モバイル比率が実サイト水準(74%相当)なら平常時としてflaggedしない', () => {
    // human 10件・うち8件モバイル(80%) → 閾値0.30を大きく上回るため平常
    const rows = [...Array(8).fill(0).map(humanMobileRow), ...Array(2).fill(0).map(humanDesktopRow)];
    const report = auditClickRatios(rows, classifyClick);
    expect(report.human).toBe(10);
    expect(report.flagged).toBe(false);
  });

  test('human判定が全てdesktopで十分なサンプル数がある場合はflaggedする（DW-3型の自己矛盾）', () => {
    // 実測(DW-3)を模した desktop 327 / mobile 21 相当の比率をサンプル20件で再現
    const rows = [...Array(19).fill(0).map(humanDesktopRow), ...Array(1).fill(0).map(humanMobileRow)];
    const report = auditClickRatios(rows, classifyClick);
    expect(report.human).toBe(20);
    expect(report.flagged).toBe(true);
    expect(report.reasons[0]).toMatch(/モバイル比率/);
  });

  test('human件数がminHumanSampleForMobileCheck未満なら比率が偏っていてもflaggedしない（オオカミ少年防止）', () => {
    const rows = Array(CLICK_RATIO_THRESHOLDS.minHumanSampleForMobileCheck - 1)
      .fill(0)
      .map(humanDesktopRow);
    const report = auditClickRatios(rows, classifyClick);
    expect(report.human).toBeLessThan(CLICK_RATIO_THRESHOLDS.minHumanSampleForMobileCheck);
    expect(report.flagged).toBe(false);
  });

  test('human件数0件ならmobileAmongHumanはnull・flaggedもfalse', () => {
    const rows = Array(5).fill(0).map(botRow);
    const report = auditClickRatios(rows, classifyClick);
    expect(report.human).toBe(0);
    expect(report.mobileAmongHuman).toBeNull();
    expect(report.flagged).toBe(false);
  });

  test('空配列でも例外を投げない', () => {
    const report = auditClickRatios([], classifyClick);
    expect(report.total).toBe(0);
    expect(report.humanRatio).toBe(0);
    expect(report.flagged).toBe(false);
  });
});
