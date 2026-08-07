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

  // ⚠️2026-08-07(掛-1横展開): 全predicateに`!r.fiscalYear`を追加し、officialSubtotals(R8のみを
  // 集計した公式資料の「計」行)と、新規追加されたfiscalYear付きR7レコードが混ざらないようにする。
  const isR8 = (r: (typeof records)[number]) => !r.fiscalYear;

  it('R8(令和8年度・fiscalYear省略)の取り込み件数は189レコード（普通科129 + 専門学科50 + 総合学科10）', () => {
    expect(records.filter(isR8)).toHaveLength(189);
  });

  it('区部57校（department=普通科）の合計が公式「区部計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('区部計'), (r) => isR8(r) && r.department === '普通科' && TOKYO_23_WARDS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => isR8(r) && r.department === '普通科' && TOKYO_23_WARDS.has(r.area ?? ''))).schoolCount).toBe(57);
  });

  it('島しょ6校（department=普通科）の合計が公式「島しょ計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('島しょ計'), (r) => isR8(r) && r.department === '普通科' && ISLAND_AREAS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
  });

  it('多摩部44校（department=普通科・区部島しょ以外）の合計が公式「多摩部計」と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('多摩部計'),
      (r) => isR8(r) && r.department === '普通科' && !TOKYO_23_WARDS.has(r.area ?? '') && !ISLAND_AREAS.has(r.area ?? '')
    );
    expect(result.matches).toBe(true);
  });

  it('基本107校（区部+多摩部+島しょ）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('普通科（コース、単位制、海外帰国生徒対象以外）計＋普通科（島しょ）計'),
      (r) => isR8(r) && r.department === '普通科'
    );
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => isR8(r) && r.department === '普通科')).schoolCount).toBe(107);
  });

  it('コース制4校の合計が公式「コース制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('コース制計'), (r) => isR8(r) && r.department.startsWith('普通科（コース制'));
    expect(result.matches).toBe(true);
  });

  it('単位制12校の合計が公式「単位制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('単位制計'), (r) => isR8(r) && r.department === '普通科（単位制）');
    expect(result.matches).toBe(true);
  });

  it('海外帰国生徒対象6校（帰国3+引揚3）の合計が公式「海外帰国生徒対象計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('海外帰国生徒対象計'), (r) => isR8(r) && r.department.startsWith('普通科（海外帰国生徒対象'));
    expect(result.matches).toBe(true);
  });

  it('帰国対象3校・引揚対象3校それぞれの内訳も公式値と一致する', () => {
    const kikoku = checkAgainstSubtotal(records, findSubtotal('帰国対象計'), (r) => isR8(r) && r.department === '普通科（海外帰国生徒対象・帰国生）');
    const hikiage = checkAgainstSubtotal(records, findSubtotal('引揚対象計'), (r) => isR8(r) && r.department === '普通科（海外帰国生徒対象・引揚者）');
    expect(kikoku.matches).toBe(true);
    expect(hikiage.matches).toBe(true);
  });

  it('普通科119校（department先頭が"普通科"の129レコード）が公式「普通科計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('普通科計'), (r) => isR8(r) && r.department.startsWith('普通科'));
    expect(result.matches).toBe(true);
  });

  it('専門学科13学科・合計38校の各カテゴリが公式の「計」行と一致する', () => {
    const checks: Array<[string, (r: (typeof records)[number]) => boolean]> = [
      ['商業計', (r) => isR8(r) && r.department === '商業科'],
      ['ビジネスコミュニケーション科計', (r) => isR8(r) && r.department === 'ビジネスコミュニケーション科'],
      ['科学技術科計', (r) => isR8(r) && r.department === '科学技術科'],
      ['農業計', (r) => isR8(r) && r.department === '農業科'],
      ['水産計', (r) => isR8(r) && r.department === '水産科'],
      ['福祉計', (r) => isR8(r) && r.department === '福祉科'],
      ['理数計', (r) => isR8(r) && r.department === '理数科'],
      ['芸術計', (r) => isR8(r) && r.department === '芸術科'],
      ['体育計', (r) => isR8(r) && r.department === '体育科'],
      ['国際計', (r) => isR8(r) && r.department === '国際科'],
      ['併合科計', (r) => isR8(r) && r.department.startsWith('併合科')],
      ['産業科計', (r) => isR8(r) && r.department === '産業科'],
    ];
    for (const [label, predicate] of checks) {
      const result = checkAgainstSubtotal(records, findSubtotal(label), predicate);
      expect(result.matches).toBe(true);
    }
  });

  it('工業科（単位制以外15校+単位制1校=16校）の合計が公式「工業計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('工業計'), (r) => isR8(r) && (r.department === '工業科' || r.department === '工業科（単位制）'));
    expect(result.matches).toBe(true);
  });

  it('家庭科（単位制以外3校+単位制1校=4校）の合計が公式「家庭合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('家庭合計'), (r) => isR8(r) && (r.department === '家庭科' || r.department === '家庭科（単位制）'));
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
      (r) => isR8(r) && (SENMON_DEPARTMENTS.has(r.department) || r.department.startsWith('併合科'))
    );
    expect(result.matches).toBe(true);
  });

  it('総合学科10校の合計が公式「総合学科計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('総合学科計'), (r) => isR8(r) && r.department === '総合学科');
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => isR8(r) && r.department === '総合学科')).schoolCount).toBe(10);
  });

  it('R8の全189レコードの合計が公式「全日制合計」167校・30,439・38,148と完全一致する（Y-2東京都の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('全日制合計'), isR8);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(30439);
    expect(result.actualApplicants).toBe(38148);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが189件収録され、区市町村+学校名+学科の重複が無い', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(189);
    const seen = new Set<string>();
    for (const r of r7) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('掛-1(学校別×多年度・R6第1〜3弾・個票PDF1完結): 令和6年度(R6)分の普通科(コース単位制以外+島しょ)108校が収録され、区市町村+学校名+学科の重複が無い。世田谷「深沢」はR7と同様まだ単位制へ分類変更される前の通常表に含まれる', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）' && r.department === '普通科');
    expect(r6.length).toBe(108);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(21787);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(31642);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    expect(r6.find((r) => r.schoolName === '深沢')).toEqual({
      schoolName: '深沢',
      area: '世田谷',
      department: '普通科',
      quota: 142,
      finalApplicants: 124,
      finalRate: 0.87,
      fiscalYear: '令和6年度（2024年度）',
    });

    const kuBu = r6.filter((r) => TOKYO_23_WARDS.has(r.area ?? ''));
    expect(kuBu.length).toBe(58);
    expect(kuBu.reduce((a, r) => a + r.quota, 0)).toBe(12172);
    expect(kuBu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(18828);

    const tamaBu = r6.filter((r) => !TOKYO_23_WARDS.has(r.area ?? '') && !ISLAND_AREAS.has(r.area ?? ''));
    expect(tamaBu.length).toBe(44);
    expect(tamaBu.reduce((a, r) => a + r.quota, 0)).toBe(9309);
    expect(tamaBu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(12723);

    const shimasho = r6.filter((r) => ISLAND_AREAS.has(r.area ?? ''));
    expect(shimasho.length).toBe(6);
    expect(shimasho.reduce((a, r) => a + r.quota, 0)).toBe(306);
    expect(shimasho.reduce((a, r) => a + r.finalApplicants, 0)).toBe(91);
  });

  it('掛-1(学校別×多年度・R6第4弾・普通科119校完結): 令和6年度(R6)分に「3[コース制]・4[単位制]・5[海外帰国生徒対象]」21件を追加した合計129件が収録され、区市町村+学校名+学科の重複が無い。普通科計(quota24,219・applicants35,204)がコース単位制以外+島しょ+コース制+単位制+海外帰国生徒対象の5区分合計と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）' && r.department.startsWith('普通科'));
    expect(r6.length).toBe(129);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(24219);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(35204);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    const kousei = r6.filter((r) => r.department.startsWith('普通科（コース制'));
    expect(kousei.length).toBe(4);
    expect(kousei.reduce((a, r) => a + r.quota, 0)).toBe(224);
    expect(kousei.reduce((a, r) => a + r.finalApplicants, 0)).toBe(364);

    const tannisei = r6.filter((r) => r.department === '普通科（単位制）');
    expect(tannisei.length).toBe(11);
    expect(tannisei.reduce((a, r) => a + r.quota, 0)).toBe(2146);
    expect(tannisei.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3131);

    const kaigai = r6.filter((r) => r.department.startsWith('普通科（海外帰国生徒対象'));
    expect(kaigai.length).toBe(6);
    expect(kaigai.reduce((a, r) => a + r.quota, 0)).toBe(62);
    expect(kaigai.reduce((a, r) => a + r.finalApplicants, 0)).toBe(67);
  });

  it('掛-1(学校別×多年度・R6第5弾・tokyo R6(167校)完結): 令和6年度(R6)分に専門学科13学科・総合学科60件を追加した合計189件が収録され、区市町村+学校名+学科の重複が無い。17区分の印字小計と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(189);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    const sumOf = (dept: string) => {
      const rs = r6.filter((r) => r.department === dept);
      return { count: rs.length, quota: rs.reduce((a, r) => a + r.quota, 0), applicants: rs.reduce((a, r) => a + r.finalApplicants, 0) };
    };

    expect(sumOf('商業科')).toEqual({ count: 7, quota: 795, applicants: 812 });
    expect(sumOf('ビジネスコミュニケーション科')).toEqual({ count: 2, quota: 231, applicants: 256 });
    expect(sumOf('工業科')).toEqual({ count: 15, quota: 1584, applicants: 1252 });
    expect(sumOf('工業科（単位制）')).toEqual({ count: 1, quota: 108, applicants: 87 });
    expect(sumOf('科学技術科')).toEqual({ count: 2, quota: 252, applicants: 383 });
    expect(sumOf('農業科')).toEqual({ count: 5, quota: 413, applicants: 477 });
    expect(sumOf('水産科')).toEqual({ count: 1, quota: 42, applicants: 45 });
    expect(sumOf('家庭科')).toEqual({ count: 3, quota: 222, applicants: 216 });
    expect(sumOf('家庭科（単位制）')).toEqual({ count: 1, quota: 49, applicants: 55 });
    expect(sumOf('福祉科')).toEqual({ count: 2, quota: 53, applicants: 14 });
    expect(sumOf('理数科')).toEqual({ count: 2, quota: 68, applicants: 169 });
    expect(sumOf('芸術科')).toEqual({ count: 1, quota: 112, applicants: 219 });
    expect(sumOf('体育科')).toEqual({ count: 2, quota: 52, applicants: 59 });
    expect(sumOf('国際科')).toEqual({ count: 1, quota: 138, applicants: 302 });
    expect(sumOf('産業科')).toEqual({ count: 2, quota: 274, applicants: 294 });
    expect(sumOf('総合学科')).toEqual({ count: 10, quota: 1626, applicants: 2155 });

    const heigou = r6.filter((r) => r.department.startsWith('併合科'));
    expect(heigou.length).toBe(3);
    expect(heigou.reduce((a, r) => a + r.quota, 0)).toBe(105);
    expect(heigou.reduce((a, r) => a + r.finalApplicants, 0)).toBe(18);
  });

  it('掛-1(学校別×多年度・R5第1弾): 令和5年度(R5)分の普通科(区部)58校が収録され、区市町村+学校名+学科の重複が無い。杉並「西」は令和5年2月21日訂正後の値(女230・計463)を採用', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）' && r.department === '普通科' && TOKYO_23_WARDS.has(r.area ?? ''));
    expect(r5.length).toBe(58);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(12531);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(19195);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    expect(r5.find((r) => r.schoolName === '西' && r.area === '杉並')).toEqual({
      schoolName: '西',
      area: '杉並',
      department: '普通科',
      quota: 253,
      finalApplicants: 463,
      finalRate: 1.83,
      fiscalYear: '令和5年度（2023年度）',
    });
  });

  it('掛-1(学校別×多年度・R5第2弾・個票PDF1完結): 令和5年度(R5)分の普通科(コース単位制以外+島しょ)108校が収録され、区市町村+学校名+学科の重複が無い。新島は令和5年2月21日訂正後の値(計10・倍率0.25)を採用', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）' && r.department === '普通科');
    expect(r5.length).toBe(108);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(22226);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(32103);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    expect(r5.find((r) => r.schoolName === '新島')).toEqual({
      schoolName: '新島',
      area: '新島',
      department: '普通科',
      quota: 40,
      finalApplicants: 10,
      finalRate: 0.25,
      fiscalYear: '令和5年度（2023年度）',
    });

    const tamaBu = r5.filter((r) => !TOKYO_23_WARDS.has(r.area ?? '') && !ISLAND_AREAS.has(r.area ?? ''));
    expect(tamaBu.length).toBe(44);
    expect(tamaBu.reduce((a, r) => a + r.quota, 0)).toBe(9388);
    expect(tamaBu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(12778);

    const shimasho = r5.filter((r) => ISLAND_AREAS.has(r.area ?? ''));
    expect(shimasho.length).toBe(6);
    expect(shimasho.reduce((a, r) => a + r.quota, 0)).toBe(307);
    expect(shimasho.reduce((a, r) => a + r.finalApplicants, 0)).toBe(130);
  });

  it('掛-1(学校別×多年度・R5第3弾・普通科129校完結): 令和5年度(R5)分に「3[コース制]・4[単位制]・5[海外帰国生徒対象]」21件を追加した合計129件が収録され、区市町村+学校名+学科の重複が無い。新宿(単位制)は令和5年2月21日訂正後の値(女337・計637)を採用。普通科計(quota24,658・applicants35,530)がコース単位制以外+島しょ+コース制+単位制+海外帰国生徒対象の5区分合計と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）' && r.department.startsWith('普通科'));
    expect(r5.length).toBe(129);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(24658);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(35530);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    expect(r5.find((r) => r.schoolName === '新宿' && r.department === '普通科（単位制）')).toEqual({
      schoolName: '新宿',
      area: '新宿',
      department: '普通科（単位制）',
      quota: 284,
      finalApplicants: 637,
      finalRate: 2.24,
      fiscalYear: '令和5年度（2023年度）',
    });

    const kousei = r5.filter((r) => r.department.startsWith('普通科（コース制'));
    expect(kousei.length).toBe(4);
    expect(kousei.reduce((a, r) => a + r.quota, 0)).toBe(224);
    expect(kousei.reduce((a, r) => a + r.finalApplicants, 0)).toBe(328);

    const tannisei = r5.filter((r) => r.department === '普通科（単位制）');
    expect(tannisei.length).toBe(11);
    expect(tannisei.reduce((a, r) => a + r.quota, 0)).toBe(2146);
    expect(tannisei.reduce((a, r) => a + r.finalApplicants, 0)).toBe(3048);

    const kaigai = r5.filter((r) => r.department.startsWith('普通科（海外帰国生徒対象'));
    expect(kaigai.length).toBe(6);
    expect(kaigai.reduce((a, r) => a + r.quota, 0)).toBe(62);
    expect(kaigai.reduce((a, r) => a + r.finalApplicants, 0)).toBe(51);
  });

  it('掛-1(学校別×多年度・R5第4弾・tokyo R5(167校)完結): 令和5年度(R5)分に専門学科13学科・総合学科59件を追加した合計188件が収録され、区市町村+学校名+学科の重複が無い。17区分の印字小計と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(188);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    const sumOf = (dept: string) => {
      const rs = r5.filter((r) => r.department === dept);
      return { count: rs.length, quota: rs.reduce((a, r) => a + r.quota, 0), applicants: rs.reduce((a, r) => a + r.finalApplicants, 0) };
    };

    expect(sumOf('商業科')).toEqual({ count: 7, quota: 829, applicants: 798 });
    expect(sumOf('ビジネスコミュニケーション科')).toEqual({ count: 2, quota: 233, applicants: 227 });
    expect(sumOf('工業科')).toEqual({ count: 15, quota: 1568, applicants: 1159 });
    expect(sumOf('工業科（単位制）')).toEqual({ count: 1, quota: 118, applicants: 67 });
    expect(sumOf('科学技術科')).toEqual({ count: 2, quota: 273, applicants: 502 });
    expect(sumOf('農業科')).toEqual({ count: 5, quota: 419, applicants: 490 });
    expect(sumOf('水産科')).toEqual({ count: 1, quota: 42, applicants: 28 });
    expect(sumOf('家庭科')).toEqual({ count: 3, quota: 222, applicants: 223 });
    expect(sumOf('家庭科（単位制）')).toEqual({ count: 1, quota: 49, applicants: 46 });
    expect(sumOf('福祉科')).toEqual({ count: 2, quota: 51, applicants: 31 });
    expect(sumOf('理数科')).toEqual({ count: 1, quota: 35, applicants: 128 });
    expect(sumOf('芸術科')).toEqual({ count: 1, quota: 112, applicants: 193 });
    expect(sumOf('体育科')).toEqual({ count: 2, quota: 52, applicants: 70 });
    expect(sumOf('国際科')).toEqual({ count: 1, quota: 138, applicants: 338 });
    expect(sumOf('産業科')).toEqual({ count: 2, quota: 295, applicants: 298 });
    expect(sumOf('総合学科')).toEqual({ count: 10, quota: 1626, applicants: 2088 });

    const heigou = r5.filter((r) => r.department.startsWith('併合科'));
    expect(heigou.length).toBe(3);
    expect(heigou.reduce((a, r) => a + r.quota, 0)).toBe(105);
    expect(heigou.reduce((a, r) => a + r.finalApplicants, 0)).toBe(22);
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
