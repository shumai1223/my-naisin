import { checkAgainstSubtotal, sumRecords } from '@/lib/competition-rate';
import { SAITAMA_COMPETITION_RATES } from '../saitama';

/**
 * Y-2 DoD検証（埼玉県・先行8県7県目）。
 *
 * 埼玉県は241レコード全てが公式の学科群別「計」行、および全日制のグランドトータルと
 * 完全一致する（quota34,603・applicants35,976・倍率1.04）。当初あった3件の未解明差分
 * （普通科+4・農業に関する学科-40/-44・商業に関する学科+2）は、PDF全文のテキスト抽出に
 * 成功したことで実際の転記ミス（「確定数」列と「2月10日時点」列の混同3校、杉戸農業の
 * 生活技術科の丸ごと欠落）と判明し修正済み。
 */
describe('埼玉県 倍率パイプラインα（Y-2・全日制の突合テスト）', () => {
  const { records, officialSubtotals } = SAITAMA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('全日制の全レコード合計がPDF末尾のグランドトータル（quota34,603・applicants35,976・倍率1.04）と完全一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('全日制合計'), () => true);
    expect(result.matches).toBe(true);
  });

  it('総合学科の合計が公式値と完全一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('総合学科計'), (r) => r.department === '総合学科');
    expect(result.matches).toBe(true);
  });

  it('工業に関する学科（13校46レコード）の合計が公式値と完全一致する', () => {
    const kougyouSchools = new Set([
      '大宮科学技術', '春日部工業', '川口工業', '川越工業', '久喜工業', '熊谷工業',
      '越谷総合技術', '児玉', '狭山工業', '進修館', '秩父農工科学', '新座総合技術', '三郷工業技術',
    ]);
    const kougyouDepartments = new Set([
      '機械工学科', '電気工学科', 'ロボット工学科', '建築デザイン工学科', '機械科', '電気科', '建築科',
      '情報通信科', 'デザイン科', '化学科', '工業化学科', '環境科学科', '情報技術科', '土木科',
      '電子機械科', '電気システム科', '情報メディア科', 'ものづくり科', '機械システム科', '情報電子科',
    ]);
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('工業に関する学科 計'),
      (r) => kougyouSchools.has(r.schoolName) && kougyouDepartments.has(r.department)
    );
    expect(result.matches).toBe(true);
  });

  it('専門学科の各小科群（商業・家庭・看護・外国語・美術・音楽・書道・体育・理数・情報・福祉・人文・国際関係・映像芸術・舞台芸術・生物環境系）が公式値と完全一致する', () => {
    const checks: Array<[string, (r: (typeof records)[number]) => boolean]> = [
      ['家庭に関する学科 計', (r) => ['保育科', '家政科学科', '服飾デザイン科', '食物デザイン科', 'ライフデザイン科', 'フードデザイン科', '食物調理科'].includes(r.department)],
      ['看護に関する学科 計', (r) => r.department === '看護科'],
      ['外国語に関する学科 計', (r) => r.department === '外国語科'],
      ['美術に関する学科 計', (r) => r.department === '美術科' || r.department === '美術表現科'],
      ['音楽に関する学科 計', (r) => r.department === '音楽科'],
      ['書道に関する学科 計', (r) => r.department === '書道科'],
      ['体育に関する学科 計', (r) => r.department === '体育科' || r.department === 'スポーツサイエンス科'],
      ['理数に関する学科 計', (r) => r.department === '理数科'],
      ['情報に関する学科 計', (r) => r.department === '情報サイエンス科'],
      ['福祉に関する学科 計', (r) => r.department === '福祉科'],
      ['人文に関する学科 計', (r) => r.department === '人文科'],
      ['国際関係に関する学科 計', (r) => r.department === '国際教養科' || r.department === '国際科'],
      ['映像芸術に関する学科 計', (r) => r.department === '映像芸術科'],
      ['舞台芸術に関する学科 計', (r) => r.department === '舞台芸術科'],
      ['生物・環境に関する系 計', (r) => r.department === '生物系' || r.department === '環境系'],
    ];
    for (const [label, predicate] of checks) {
      const result = checkAgainstSubtotal(records, findSubtotal(label), predicate);
      expect(result.matches).toBe(true);
    }
  });

  it('商業に関する学科の合計が公式値と完全一致する（狭山経済・情報処理科の転記ミス修正済み）', () => {
    const shougyouDepartments = new Set([
      '商業科', '情報処理科', '総合ビジネス科', '流通経済科', '会計科', '国際流通科', 'ビジネス会計科',
      'ビジネス探究科', '国際経済科',
    ]);
    const shougyouSchools = new Set([
      '上尾', '岩槻商業', '浦和商業', '大宮商業', '熊谷商業', '鴻巣', '越谷総合技術', '狭山経済',
      '所沢商業', '新座総合技術', '鳩ケ谷', '羽生実業', '深谷商業', '八潮フロンティア', '市立川越',
    ]);
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('商業に関する学科 計'),
      (r) => shougyouSchools.has(r.schoolName) && shougyouDepartments.has(r.department)
    );
    expect(result.matches).toBe(true);
  });

  it('普通科の合計が公式値と完全一致する（熊谷西/越谷西/南稜/ふじみ野の転記ミス修正済み）', () => {
    const futsuka = records.filter((r) => r.department.includes('普通科') || r.department.includes('コース'));
    const sums = sumRecords(futsuka);
    const official = findSubtotal('普通科計');
    expect(sums.quota).toBe(official.quota);
    expect(sums.finalApplicants).toBe(official.finalApplicants);
  });

  it('農業に関する学科の合計が公式値と完全一致する（杉戸農業の生活技術科の欠落を修正済み）', () => {
    const nougyouSchools = ['熊谷農業', '児玉', '杉戸農業', '秩父農工科学', '鳩ケ谷', '羽生実業'];
    const nougyouDepartments = new Set([
      '食品科学科', '生物生産工学科', '生活技術科', '生物生産技術科', '生物資源科', '環境デザイン科',
      '園芸科', '造園科', '食品流通科', '農業科', '食品化学科', '森林科学科', '園芸デザイン科', '農業経済科',
    ]);
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('農業に関する学科 計'),
      (r) => nougyouSchools.includes(r.schoolName) && nougyouDepartments.has(r.department)
    );
    expect(result.matches).toBe(true);
  });

  it('「越生翔桜」が正しい学校名で収録されている（誤記「越生翔陽」からの訂正回帰防止）', () => {
    const ogoseShoo = records.filter((r) => r.schoolName === '越生翔桜');
    expect(ogoseShoo.length).toBeGreaterThan(0);
    expect(records.some((r) => r.schoolName === '越生翔陽')).toBe(false);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(SAITAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SAITAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.saitama\.lg\.jp\//);
    }
  });
});
