import { sumRecords } from '@/lib/competition-rate';
import { HOKKAIDO_TEIJI_COMPETITION_RATES } from '../hokkaido';

/**
 * T-P1 P1-3 DoD検証（北海道・石狩地区の定時制13校＋有朋単位制2レコード＋後志地区の定時制4校＋
 * 胆振地区の定時制3校＋日高地区の定時制1校＋渡島地区の定時制3校＝coverage='partial'）: ページ内
 * に公式「計」行が無いため、個票の機械集計値が自己検算どおりであることを検証する。北海道は
 * 15地域区分あるうち5区分のみ着手済みで、coverage.status==='partial'であることも明示的に
 * 検証する（次回セッションが誤って「完了」と誤認しないため）。
 */
describe('北海道 定時制・有朋単位制 倍率パイプライン（T-P1 P1-3・partial・石狩+後志+胆振+日高+渡島地区のみ）', () => {
  const { records, coverage } = HOKKAIDO_TEIJI_COMPETITION_RATES;

  const ISHIKARI_SCHOOLS = ['札幌東', '札幌西', '札幌南', '札幌北', '札幌月寒', '江別', '千歳', '恵庭南', '札幌工業', '札幌琴似工業'];
  const SHIRIBESHI_SCHOOLS = ['小樽潮陵', '真狩', '留寿都', '小樽未来創造'];
  const IBURI_SCHOOLS = ['室蘭栄', '苫小牧東', '苫小牧工業'];
  const HIDAKA_SCHOOLS = ['日高'];
  const OSHIMA_SCHOOLS = ['函館中部', '函館工業', '函館商業'];

  const yuho = records.filter((r) => r.department.includes('有朋'));
  const ishikariTeiji = records.filter((r) => ISHIKARI_SCHOOLS.includes(r.schoolName));
  const shiribeshiTeiji = records.filter((r) => SHIRIBESHI_SCHOOLS.includes(r.schoolName));
  const iburiTeiji = records.filter((r) => IBURI_SCHOOLS.includes(r.schoolName));
  const hidakaTeiji = records.filter((r) => HIDAKA_SCHOOLS.includes(r.schoolName));
  const oshimaTeiji = records.filter((r) => OSHIMA_SCHOOLS.includes(r.schoolName));

  it('coverage.statusはpartial（15地域区分中、石狩+後志+胆振+日高+渡島の5区分のみ着手のため）', () => {
    expect(coverage.status).toBe('partial');
    expect(coverage.pendingDepartments.length).toBe(10);
  });

  it('取り込み件数は石狩定時制13＋有朋単位制2＋後志定時制4＋胆振定時制3＋日高定時制1＋渡島定時制3=計26レコード', () => {
    expect(records).toHaveLength(26);
    expect(ishikariTeiji).toHaveLength(13);
    expect(yuho).toHaveLength(2);
    expect(shiribeshiTeiji).toHaveLength(4);
    expect(iburiTeiji).toHaveLength(3);
    expect(hidakaTeiji).toHaveLength(1);
    expect(oshimaTeiji).toHaveLength(3);
  });

  it('学校数は石狩10・後志4・胆振3・日高1・渡島3校（複数学科を持つ学校は学科ごとに別レコード）', () => {
    expect(new Set(ishikariTeiji.map((r) => r.schoolName)).size).toBe(10);
    expect(new Set(shiribeshiTeiji.map((r) => r.schoolName)).size).toBe(4);
    expect(new Set(iburiTeiji.map((r) => r.schoolName)).size).toBe(3);
    expect(new Set(hidakaTeiji.map((r) => r.schoolName)).size).toBe(1);
    expect(new Set(oshimaTeiji.map((r) => r.schoolName)).size).toBe(3);
  });

  it('個票の機械集計値が自己検算値と一致する（公式「計」行が無いため）', () => {
    const ishikariSum = sumRecords(ishikariTeiji);
    expect(ishikariSum.quota).toBe(520);
    expect(ishikariSum.finalApplicants).toBe(184);

    const yuhoSum = sumRecords(yuho);
    expect(yuhoSum.quota).toBe(160);
    expect(yuhoSum.finalApplicants).toBe(36);

    const shiribeshiSum = sumRecords(shiribeshiTeiji);
    expect(shiribeshiSum.quota).toBe(160);
    expect(shiribeshiSum.finalApplicants).toBe(43);

    const iburiSum = sumRecords(iburiTeiji);
    expect(iburiSum.quota).toBe(120);
    expect(iburiSum.finalApplicants).toBe(41);

    const hidakaSum = sumRecords(hidakaTeiji);
    expect(hidakaSum.quota).toBe(40);
    expect(hidakaSum.finalApplicants).toBe(15);

    const oshimaSum = sumRecords(oshimaTeiji);
    expect(oshimaSum.quota).toBe(120);
    expect(oshimaSum.finalApplicants).toBe(61);
  });

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
