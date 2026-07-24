import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOKYO_COMPETITION_RATES } from '../tokyo';

const TOKYO_23_WARDS = new Set([
  '千代田', '港', '新宿', '文京', '台東', '墨田', '江東', '品川', '目黒', '大田',
  '世田谷', '渋谷', '中野', '杉並', '豊島', '荒川', '板橋', '練馬', '足立', '葛飾', '江戸川',
]);
const ISLAND_AREAS = new Set(['大島', '新島', '神津島', '三宅', '八丈', '小笠原']);

/**
 * Y-2 DoD検証（東京都・普通科119校が完了）: 手入力した各グループの合計が、
 * 東京都教育委員会公表の「計」行（officialSubtotals）と一致することを機械的に突合する。
 * 1件でもズレれば転記ミスの可能性が高い＝信頼の堀の生命線。
 */
describe('東京都 倍率パイプラインα（Y-2・普通科119校の突合テスト）', () => {
  const { records, officialSubtotals } = TOKYO_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('取り込み件数は189レコード（普通科129 + 専門学科50 + 総合学科10）', () => {
    expect(records).toHaveLength(189);
  });

  it('区部57校（department=普通科）の合計が公式「区部計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('区部計'), (r) => r.department === '普通科' && TOKYO_23_WARDS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => r.department === '普通科' && TOKYO_23_WARDS.has(r.area ?? ''))).schoolCount).toBe(57);
  });

  it('島しょ6校（department=普通科）の合計が公式「島しょ計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('島しょ計'), (r) => r.department === '普通科' && ISLAND_AREAS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
  });

  it('多摩部44校（department=普通科・区部島しょ以外）の合計が公式「多摩部計」と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('多摩部計'),
      (r) => r.department === '普通科' && !TOKYO_23_WARDS.has(r.area ?? '') && !ISLAND_AREAS.has(r.area ?? '')
    );
    expect(result.matches).toBe(true);
  });

  it('基本107校（区部+多摩部+島しょ）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('普通科（コース、単位制、海外帰国生徒対象以外）計＋普通科（島しょ）計'),
      (r) => r.department === '普通科'
    );
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => r.department === '普通科')).schoolCount).toBe(107);
  });

  it('コース制4校の合計が公式「コース制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('コース制計'), (r) => r.department.startsWith('普通科（コース制'));
    expect(result.matches).toBe(true);
  });

  it('単位制12校の合計が公式「単位制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('単位制計'), (r) => r.department === '普通科（単位制）');
    expect(result.matches).toBe(true);
  });

  it('海外帰国生徒対象6校（帰国3+引揚3）の合計が公式「海外帰国生徒対象計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('海外帰国生徒対象計'), (r) => r.department.startsWith('普通科（海外帰国生徒対象'));
    expect(result.matches).toBe(true);
  });

  it('帰国対象3校・引揚対象3校それぞれの内訳も公式値と一致する', () => {
    const kikoku = checkAgainstSubtotal(records, findSubtotal('帰国対象計'), (r) => r.department === '普通科（海外帰国生徒対象・帰国生）');
    const hikiage = checkAgainstSubtotal(records, findSubtotal('引揚対象計'), (r) => r.department === '普通科（海外帰国生徒対象・引揚者）');
    expect(kikoku.matches).toBe(true);
    expect(hikiage.matches).toBe(true);
  });

  it('普通科119校（department先頭が"普通科"の129レコード）が公式「普通科計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('普通科計'), (r) => r.department.startsWith('普通科'));
    expect(result.matches).toBe(true);
  });

  it('専門学科13学科・合計38校の各カテゴリが公式の「計」行と一致する', () => {
    const checks: Array<[string, (r: (typeof records)[number]) => boolean]> = [
      ['商業計', (r) => r.department === '商業科'],
      ['ビジネスコミュニケーション科計', (r) => r.department === 'ビジネスコミュニケーション科'],
      ['科学技術科計', (r) => r.department === '科学技術科'],
      ['農業計', (r) => r.department === '農業科'],
      ['水産計', (r) => r.department === '水産科'],
      ['福祉計', (r) => r.department === '福祉科'],
      ['理数計', (r) => r.department === '理数科'],
      ['芸術計', (r) => r.department === '芸術科'],
      ['体育計', (r) => r.department === '体育科'],
      ['国際計', (r) => r.department === '国際科'],
      ['併合科計', (r) => r.department.startsWith('併合科')],
      ['産業科計', (r) => r.department === '産業科'],
    ];
    for (const [label, predicate] of checks) {
      const result = checkAgainstSubtotal(records, findSubtotal(label), predicate);
      expect(result.matches).toBe(true);
    }
  });

  it('工業科（単位制以外15校+単位制1校=16校）の合計が公式「工業計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('工業計'), (r) => r.department === '工業科' || r.department === '工業科（単位制）');
    expect(result.matches).toBe(true);
  });

  it('家庭科（単位制以外3校+単位制1校=4校）の合計が公式「家庭合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('家庭合計'), (r) => r.department === '家庭科' || r.department === '家庭科（単位制）');
    expect(result.matches).toBe(true);
  });

  it('専門学科38校（13学科の全レコード）の合計が公式「専門学科合計」と一致する', () => {
    const SENMON_DEPARTMENTS = new Set([
      '商業科', 'ビジネスコミュニケーション科', '工業科', '工業科（単位制）', '科学技術科', '農業科',
      '水産科', '家庭科', '家庭科（単位制）', '福祉科', '理数科', '芸術科', '体育科', '国際科', '産業科',
    ]);
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('専門学科合計'),
      (r) => SENMON_DEPARTMENTS.has(r.department) || r.department.startsWith('併合科')
    );
    expect(result.matches).toBe(true);
  });

  it('総合学科10校の合計が公式「総合学科計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('総合学科計'), (r) => r.department === '総合学科');
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => r.department === '総合学科')).schoolCount).toBe(10);
  });

  it('全189レコードの合計が公式「全日制合計」167校・30,439・38,148と完全一致する（Y-2東京都の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('全日制合計'), () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(30439);
    expect(result.actualApplicants).toBe(38148);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      if (r.finalApplicants === 0) {
        expect(r.finalRate).toBe(0);
        continue;
      }
      // 倍率は小数第3位で丸められている場合があるため誤差0.01を許容
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.01);
    }
  });

  it('coverageが全日制167校の完了を示している（専門学科・総合学科まで完了・pendingは空）', () => {
    expect(TOKYO_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(TOKYO_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが複数の公表資料をそれぞれ正しく記録している', () => {
    expect(TOKYO_COMPETITION_RATES.sources.length).toBeGreaterThanOrEqual(3);
    for (const s of TOKYO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.kyoiku\.metro\.tokyo\.lg\.jp\//);
    }
  });
});
