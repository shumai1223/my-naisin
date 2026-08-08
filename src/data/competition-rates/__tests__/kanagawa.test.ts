import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KANAGAWA_COMPETITION_RATES } from '../kanagawa';

/**
 * Y-2 DoD検証（神奈川県・先行8県2県目）: 手入力した全レコードの合計が、
 * 神奈川県教育委員会公表の「一般募集共通選抜（志願変更締切時）」の全体値
 * （報道各社が伝える募集定員39,431人・志願者数43,821人・倍率1.11倍）と一致することを
 * 機械的に突合する。1件でもズレれば転記ミスの可能性が高い＝信頼の堀の生命線。
 */
describe('神奈川県 倍率パイプラインα（Y-2・全日制の突合テスト）', () => {
  const { records, officialSubtotals } = KANAGAWA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('普通科（共通選抜）県立87校+市立5校=92校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('普通科（共通選抜）合計'), (r) => r.department === '普通科' && !r.fiscalYear);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBeGreaterThan(0);
  });

  it('普通科（クリエイティブスクール）4校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('普通科（クリエイティブスクール）合計'),
      (r) => r.department === '普通科（クリエイティブスクール）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('専門学科（農業/工業/商業/水産/福祉/体育/美術/国際）の各合計が公式値と一致する', () => {
    const checks: Array<[string, string]> = [
      ['専門学科（農業）合計', '農業科'],
      ['専門学科（工業）合計', '工業科'],
      ['専門学科（商業）合計', '商業科'],
      ['専門学科（水産）計', '水産科'],
      ['専門学科（福祉）合計', '福祉科'],
      ['専門学科（体育）合計', '体育科'],
      ['専門学科（美術）合計', '美術科'],
      ['専門学科（国際）合計', '国際科'],
    ];
    for (const [label, department] of checks) {
      const result = checkAgainstSubtotal(records, findSubtotal(label), (r) => r.department === department && !r.fiscalYear);
      expect(result.matches).toBe(true);
    }
  });

  it('単位制普通科16校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制普通科合計'),
      (r) => (r.department === '普通科（単位制）' || r.department === '普通科（単位制・一般コース）') && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制総合学科（クリエイティブ除く）7校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制総合学科（クリエイティブ除く）合計'),
      (r) => r.department === '総合学科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制専門学科（農業）2校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制専門学科（農業）合計'),
      (r) => r.department === '農業科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制専門学科（国際関係）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制専門学科（国際関係）計'),
      (r) => r.department === '国際科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計が公式「一般募集共通選抜(全日制)+連携募集 全体」39,431/43,821と完全一致する（Y-2神奈川県の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('一般募集共通選抜（全日制）+連携募集 全体'), (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(39431);
    expect(result.actualApplicants).toBe(43821);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが168件収録され(bessi3.xlsx sheet1〜3完結)、普通科(県立+市立)の合計が印字済み「合計」27,066/32,929と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(168);
    const futsuka = r7.filter((r) => r.department === '普通科');
    const sumQuota = futsuka.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = futsuka.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(27066);
    expect(sumApplicants).toBe(32929);
    const creative = r7.filter((r) => r.department === '普通科（クリエイティブスクール）');
    expect(creative.length).toBe(5);
    expect(creative.reduce((a, r) => a + r.quota, 0)).toBe(832);
    expect(creative.reduce((a, r) => a + r.finalApplicants, 0)).toBe(732);
    const senmon = r7.filter(
      (r) => r.department !== '普通科' && r.department !== '普通科（クリエイティブスクール）'
    );
    // sheet2(専門学科・全日制) 33件 + sheet3(単位制・連携募集を含む) 37件
    expect(senmon.length).toBe(70);
    expect(senmon.reduce((a, r) => a + r.quota, 0)).toBe(4356 + 7141);
    expect(senmon.reduce((a, r) => a + r.finalApplicants, 0)).toBe(4273 + 8141);
    const seen = new Set<string>();
    for (const r of r7) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('掛-1(学校別×多年度・R6第1弾): 令和6年度(R6)分に普通科(県立88+市立6=94校)+クリエイティブ5校=99レコードが収録され、区市町村+学校名+学科の重複が無い。印字済み小計と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）' && r.department.startsWith('普通科') && !r.department.includes('単位制') && !r.department.includes('連携募集'));
    expect(r6.length).toBe(99);

    const futsuka = r6.filter((r) => r.department === '普通科');
    expect(futsuka.length).toBe(94);
    expect(futsuka.reduce((a, r) => a + r.quota, 0)).toBe(27316);
    expect(futsuka.reduce((a, r) => a + r.finalApplicants, 0)).toBe(33815);

    const kenritsu = futsuka.filter((r) => r.area !== '横浜市立' && r.area !== '川崎市立');
    expect(kenritsu.length).toBe(88);
    expect(kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(26048);
    expect(kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(32058);

    const shiritsu = futsuka.filter((r) => r.area === '横浜市立' || r.area === '川崎市立');
    expect(shiritsu.length).toBe(6);
    expect(shiritsu.reduce((a, r) => a + r.quota, 0)).toBe(1268);
    expect(shiritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(1757);

    const creative = r6.filter((r) => r.department === '普通科（クリエイティブスクール）');
    expect(creative.length).toBe(5);
    expect(creative.reduce((a, r) => a + r.quota, 0)).toBe(835);
    expect(creative.reduce((a, r) => a + r.finalApplicants, 0)).toBe(685);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('掛-1(学校別×多年度・R6第2弾): 令和6年度(R6)分に専門学科11学科27校=34レコードを追加した合計133件が収録され、区市町村+学校名+学科の重複が無い。11学科全ての印字済み小計と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）' && !r.department.includes('単位制') && !r.department.includes('連携募集'));
    expect(r6.length).toBe(133);

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

    expect(sumOf('農業科')).toEqual({ count: 3, quota: 470, applicants: 496 });
    expect(sumOf('工業科')).toEqual({ count: 10, quota: 2212, applicants: 1939 });
    expect(sumOf('商業科')).toEqual({ count: 7, quota: 1031, applicants: 1112 });
    expect(sumOf('水産科')).toEqual({ count: 1, quota: 156, applicants: 131 });
    expect(sumOf('家庭科')).toEqual({ count: 1, quota: 39, applicants: 44 });
    expect(sumOf('看護科')).toEqual({ count: 1, quota: 79, applicants: 69 });
    expect(sumOf('福祉科')).toEqual({ count: 4, quota: 236, applicants: 129 });
    expect(sumOf('理数科')).toEqual({ count: 1, quota: 39, applicants: 42 });
    expect(sumOf('体育科')).toEqual({ count: 2, quota: 78, applicants: 92 });
    expect(sumOf('美術科')).toEqual({ count: 2, quota: 78, applicants: 91 });
    expect(sumOf('国際科')).toEqual({ count: 2, quota: 74, applicants: 117 });
  });

  it('掛-1(学校別×多年度・R6第3弾・kanagawa完結): 令和6年度(R6)分に単位制38レコードを追加した合計171件が収録され、区市町村+学校名+学科の重複が無い。単位制の各区分小計と完全一致する。横浜旭陵はR7以降募集停止(旭高校と再編統合)のためR7には存在しない', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(171);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    const futsukaTanni = r6.filter((r) => r.department === '普通科（単位制）' || r.department === '普通科（単位制・一般コース）');
    expect(futsukaTanni.length).toBe(17);
    expect(futsukaTanni.reduce((a, r) => a + r.quota, 0)).toBe(4262);
    expect(futsukaTanni.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5050);

    const sougouTanni = r6.filter((r) => r.department === '総合学科（単位制）');
    expect(sougouTanni.length).toBe(8);
    expect(sougouTanni.reduce((a, r) => a + r.quota, 0)).toBe(1980);
    expect(sougouTanni.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2289);

    const nougyoTanni = r6.filter((r) => r.department === '農業科（単位制）');
    expect(nougyoTanni.length).toBe(2);
    expect(nougyoTanni.reduce((a, r) => a + r.quota, 0)).toBe(156);
    expect(nougyoTanni.reduce((a, r) => a + r.finalApplicants, 0)).toBe(109);

    const renkei = r6.filter((r) => r.department === '普通科（連携募集）');
    expect(renkei.length).toBe(2);
    expect(renkei.reduce((a, r) => a + r.quota, 0)).toBe(85);
    expect(renkei.reduce((a, r) => a + r.finalApplicants, 0)).toBe(77);

    expect(r6.find((r) => r.schoolName === '横浜旭陵')).toEqual({
      schoolName: '横浜旭陵',
      area: '横浜市',
      department: '普通科（単位制）',
      quota: 232,
      finalApplicants: 210,
      finalRate: 0.91,
      fiscalYear: '令和6年度（2024年度）',
    });
  });

  it('掛-1(学校別×多年度・R5第1弾・4年度目): 令和5年度(R5)分に普通科(県立88+市立6=94校)+クリエイティブ5校=99レコードが収録され、区市町村+学校名+学科の重複が無い。印字済み小計と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(99);

    const futsuka = r5.filter((r) => r.department === '普通科');
    expect(futsuka.length).toBe(94);
    expect(futsuka.reduce((a, r) => a + r.quota, 0)).toBe(28029);
    expect(futsuka.reduce((a, r) => a + r.finalApplicants, 0)).toBe(34481);

    const kenritsu = futsuka.filter((r) => r.area !== '横浜市立' && r.area !== '川崎市立');
    expect(kenritsu.length).toBe(88);
    expect(kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(26761);
    expect(kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(32784);

    const shiritsu = futsuka.filter((r) => r.area === '横浜市立' || r.area === '川崎市立');
    expect(shiritsu.length).toBe(6);
    expect(shiritsu.reduce((a, r) => a + r.quota, 0)).toBe(1268);
    expect(shiritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(1697);

    const creative = r5.filter((r) => r.department === '普通科（クリエイティブスクール）');
    expect(creative.length).toBe(5);
    expect(creative.reduce((a, r) => a + r.quota, 0)).toBe(910);
    expect(creative.reduce((a, r) => a + r.finalApplicants, 0)).toBe(676);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.01);
    }
  });

  it('coverageが全日制の完了を示している', () => {
    expect(KANAGAWA_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(KANAGAWA_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが公式URLを正しく記録している', () => {
    for (const s of KANAGAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kanagawa\.jp\//);
    }
  });
});
