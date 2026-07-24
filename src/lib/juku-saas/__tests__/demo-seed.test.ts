/**
 * 塾SaaSデモ環境(ZZ-4e)のシードデータ契約テスト。
 * 「30人分が完動」「決定論(CIで毎回同じスクリーンショットになる)」「低下/上昇の両方が混在する
 * (アラート機能のデモに使える)」の3点を固定する。
 */
import { buildDemoStudents, buildDemoStudentViews, DEMO_STUDENT_COUNT } from '../demo-seed';

describe('buildDemoStudents', () => {
  test(`${30}人ぶん生成する`, () => {
    expect(buildDemoStudents()).toHaveLength(DEMO_STUDENT_COUNT);
    expect(DEMO_STUDENT_COUNT).toBe(30);
  });

  test('表示名は全て一意', () => {
    const names = buildDemoStudents().map((s) => s.displayName);
    expect(new Set(names).size).toBe(names.length);
  });

  test('各生徒がnaishin(2件)+hensachi(2件)のスナップショットを持つ', () => {
    for (const student of buildDemoStudents()) {
      const naishin = student.snapshots.filter((s) => s.metric === 'naishin');
      const hensachi = student.snapshots.filter((s) => s.metric === 'hensachi');
      expect(naishin).toHaveLength(2);
      expect(hensachi).toHaveLength(2);
    }
  });

  test('naishinのvalueは0以上maxValue以下(既存エンジンの結果として妥当)', () => {
    for (const student of buildDemoStudents()) {
      for (const s of student.snapshots.filter((x) => x.metric === 'naishin')) {
        expect(s.value).toBeGreaterThanOrEqual(0);
        expect(s.maxValue).not.toBeNull();
        expect(s.value).toBeLessThanOrEqual(s.maxValue as number);
      }
    }
  });

  test('決定論(Math.random不使用)：2回呼んでも完全に同じ結果', () => {
    expect(buildDemoStudents()).toEqual(buildDemoStudents());
  });
});

describe('buildDemoStudentViews', () => {
  test('30人ぶんのtrend+alertsを返す', () => {
    expect(buildDemoStudentViews()).toHaveLength(DEMO_STUDENT_COUNT);
  });

  test('アラート(低下)ありの生徒と、なしの生徒の両方が混在する(デモとして両方見せられる)', () => {
    const views = buildDemoStudentViews();
    expect(views.some((v) => v.alerts.length > 0)).toBe(true);
    expect(views.some((v) => v.alerts.length === 0)).toBe(true);
  });

  test('全生徒のtrendにnaishin/hensachiの2点が含まれる(推移グラフが描ける)', () => {
    for (const v of buildDemoStudentViews()) {
      expect(v.trend.naishin.length).toBe(2);
      expect(v.trend.hensachi.length).toBe(2);
    }
  });
});
