import { sumRecords } from '@/lib/competition-rate';
import { HOKKAIDO_TEIJI_COMPETITION_RATES } from '../hokkaido';

/**
 * T-P1 P1-3 DoD検証（北海道・coverage='partial'）: 北海道は15地域区分に定時制セクションが
 * 分散しており、ページ内に公式「計」行が無いため、地域区分ごとの機械集計値が自己検算どおり
 * であることを検証する。データ駆動（it.each）にして、区分追加のたびにDISTRICTS配列へ1行
 * 足すだけで済むようにしてある。
 */
describe('北海道 定時制・有朋単位制 倍率パイプライン（T-P1 P1-3・partial）', () => {
  const { records, coverage } = HOKKAIDO_TEIJI_COMPETITION_RATES;

  const DISTRICTS: Array<{
    name: string;
    match: (r: (typeof records)[number]) => boolean;
    recordCount: number;
    schoolCount: number;
    quota: number;
    applicants: number;
  }> = [
    {
      name: '石狩・定時制',
      match: (r) =>
        ['札幌東', '札幌西', '札幌南', '札幌北', '札幌月寒', '江別', '千歳', '恵庭南', '札幌工業', '札幌琴似工業'].includes(r.schoolName),
      recordCount: 13,
      schoolCount: 10,
      quota: 520,
      applicants: 184,
    },
    {
      name: '石狩・有朋単位制',
      match: (r) => r.department.includes('有朋'),
      recordCount: 2,
      schoolCount: 1,
      quota: 160,
      applicants: 36,
    },
    {
      name: '後志・定時制',
      match: (r) => ['小樽潮陵', '真狩', '留寿都', '小樽未来創造'].includes(r.schoolName),
      recordCount: 4,
      schoolCount: 4,
      quota: 160,
      applicants: 43,
    },
    {
      name: '胆振・定時制',
      match: (r) => ['室蘭栄', '苫小牧東', '苫小牧工業'].includes(r.schoolName),
      recordCount: 3,
      schoolCount: 3,
      quota: 120,
      applicants: 41,
    },
    {
      name: '日高・定時制',
      match: (r) => r.schoolName === '日高',
      recordCount: 1,
      schoolCount: 1,
      quota: 40,
      applicants: 15,
    },
    {
      name: '渡島・定時制',
      match: (r) => ['函館中部', '函館工業', '函館商業'].includes(r.schoolName),
      recordCount: 3,
      schoolCount: 3,
      quota: 120,
      applicants: 61,
    },
    {
      name: '上川・定時制',
      match: (r) => ['旭川東', '旭川北', '士別東', '幌加内', '旭川工業', '旭川商業'].includes(r.schoolName),
      recordCount: 7,
      schoolCount: 6,
      quota: 280,
      applicants: 82,
    },
    {
      name: '留萌・定時制',
      match: (r) => r.schoolName === '天売',
      recordCount: 1,
      schoolCount: 1,
      quota: 40,
      applicants: 1,
    },
    {
      name: '宗谷・定時制',
      match: (r) => r.schoolName === '稚内',
      recordCount: 1,
      schoolCount: 1,
      quota: 40,
      applicants: 14,
    },
  ];

  it('coverage.statusはpartial（15地域区分中、DISTRICTSに列挙した区分のみ着手のため）', () => {
    expect(coverage.status).toBe('partial');
    expect(coverage.pendingDepartments.length).toBe(6);
  });

  it('全レコードがDISTRICTSのいずれか1つにのみ一致する（重複・漏れが無いことの検証）', () => {
    for (const r of records) {
      const matches = DISTRICTS.filter((d) => d.match(r));
      expect(matches).toHaveLength(1);
    }
    const totalExpected = DISTRICTS.reduce((sum, d) => sum + d.recordCount, 0);
    expect(records).toHaveLength(totalExpected);
  });

  it.each(DISTRICTS.map((d) => [d.name, d] as const))(
    '%s: レコード数・学校数・自己集計値が一致する（公式「計」行が無いため）',
    (_name, d) => {
      const group = records.filter(d.match);
      expect(group).toHaveLength(d.recordCount);
      expect(new Set(group.map((r) => r.schoolName)).size).toBe(d.schoolCount);
      const sum = sumRecords(group);
      expect(sum.quota).toBe(d.quota);
      expect(sum.finalApplicants).toBe(d.applicants);
    }
  );

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateはfinalApplicants/quotaの自前算出値と一致する（小数点2桁丸め・±0.005の誤差内）', () => {
    for (const r of records) {
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.006);
    }
  });
});
