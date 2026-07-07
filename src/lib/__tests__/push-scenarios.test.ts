/**
 * Web Pushシナリオ（C-3）のテスト。境界（窓前日ちょうど/1日ずれ）と日数許容誤差を固定する。
 */
import {
  daysSince,
  isAroundDaysAgo,
  isParentWindowEve,
  activeParentWindowEveScenario,
  PUSH_SCENARIOS,
} from '@/lib/push-scenarios';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('daysSince', () => {
  it('D1のスペース区切りdatetime文字列を正しく解釈する', () => {
    const d = daysSince('2026-06-08 00:00:00', D('2026-07-08'));
    expect(d).toBeCloseTo(30, 0);
  });

  it('null/undefined/不正値はnull', () => {
    expect(daysSince(null)).toBeNull();
    expect(daysSince(undefined)).toBeNull();
    expect(daysSince('not-a-date')).toBeNull();
  });
});

describe('isAroundDaysAgo', () => {
  it('目標日数±許容誤差の範囲内はtrue', () => {
    expect(isAroundDaysAgo('2026-06-08 00:00:00', 30, 1, D('2026-07-08'))).toBe(true);
    expect(isAroundDaysAgo('2026-06-08 00:00:00', 30, 1, D('2026-07-09'))).toBe(true); // +1日
    expect(isAroundDaysAgo('2026-06-08 00:00:00', 30, 1, D('2026-07-07'))).toBe(true); // -1日
  });

  it('許容誤差を超えるとfalse', () => {
    expect(isAroundDaysAgo('2026-06-08 00:00:00', 30, 1, D('2026-07-11'))).toBe(false); // +3日
  });

  it('createdAtが無ければfalse（誤送信より取りこぼしを優先）', () => {
    expect(isAroundDaysAgo(null, 30)).toBe(false);
  });
});

describe('isParentWindowEve / activeParentWindowEveScenario', () => {
  it('7/1開始の窓は6/30が前日=true、7/1・6/29はfalse', () => {
    expect(isParentWindowEve('mendan-july', D('2026-06-30'))).toBe(true);
    expect(isParentWindowEve('mendan-july', D('2026-07-01'))).toBe(false);
    expect(isParentWindowEve('mendan-july', D('2026-06-29'))).toBe(false);
  });

  it('11/15開始の窓は11/14が前日=true、11/15・11/13はfalse', () => {
    expect(isParentWindowEve('winter', D('2026-11-14'))).toBe(true);
    expect(isParentWindowEve('winter', D('2026-11-15'))).toBe(false);
    expect(isParentWindowEve('winter', D('2026-11-13'))).toBe(false);
  });

  it('activeParentWindowEveScenarioは窓前日以外はnull、前日は該当シナリオを返す', () => {
    expect(activeParentWindowEveScenario(D('2026-07-08'))).toBeNull();
    expect(activeParentWindowEveScenario(D('2026-06-30'))?.id).toBe('parent-window-eve-july');
    expect(activeParentWindowEveScenario(D('2026-11-14'))?.id).toBe('parent-window-eve-winter');
  });
});

describe('PUSH_SCENARIOS', () => {
  it('3シナリオとも購入を迫らず断定日付を含まない文面を持つ', () => {
    for (const scenario of Object.values(PUSH_SCENARIOS)) {
      expect(scenario.title.length).toBeGreaterThan(0);
      expect(scenario.body.length).toBeGreaterThan(0);
      expect(scenario.url.startsWith('/')).toBe(true);
    }
  });
});
