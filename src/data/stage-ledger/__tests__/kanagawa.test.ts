import { sumStageLedger } from '@/lib/stage-ledger';
import { KANAGAWA_STAGE_LEDGER } from '../kanagawa';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { TEIJI_COMPETITION_RATE_BY_PREFECTURE } from '@/data/teiji-competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（神奈川県・段階台帳6県目・「普通科」96レコード＋「専門学科」
 * 33レコード＋「単位制」35レコード＋「定時制・通信制」20レコード＝計184レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（普通科/専門学科/単位制は
 * competition-rates/kanagawa.ts、定時制・通信制はteiji-competition-rates/kanagawa.ts）の
 * quota・applicantsConfirmedと段階台帳が全件完全一致すること（本資料には志願者数列が存在
 * しないため両方とも既存パイプラインを再利用する設計）③finalPassersがquotaを超える既知の
 * 13件・applicantsConfirmedを超える既知の1件を明示的に許容する④公式小計（普通科4段階＋
 * 専門学科7区分＋単位制3区分＋定時制通信制4区分）との完全一致。
 */
describe('神奈川県 段階台帳（T-Y11F §5順序#7・6県目・「普通科」＋「専門学科」＋「単位制」＋「定時制・通信制」計184レコード）', () => {
  const { records, officialSubtotals } = KANAGAWA_STAGE_LEDGER;

  it('取り込み件数は普通科96レコード＋専門学科33レコード＋単位制35レコード＋定時制通信制20レコード＝計184レコード', () => {
    expect(records).toHaveLength(184);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/kanagawa.ts）と164件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
    const kanagawaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.kanagawa;
    if (!kanagawaCompetitionFile) throw new Error('competition-rates/kanagawa.ts が見つかりません');
    const r8Records = kanagawaCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(164);
  });

  it('定時制・通信制20レコードのquota・applicantsConfirmedは既存の倍率パイプライン（teiji-competition-rates/kanagawa.ts）と全件完全一致する', () => {
    const teijiFile = TEIJI_COMPETITION_RATE_BY_PREFECTURE.kanagawa;
    if (!teijiFile) throw new Error('teiji-competition-rates/kanagawa.ts が見つかりません');
    const r8Records = teijiFile.records.filter((r) => r.fiscalYear === undefined);
    const teijiRecords = records.filter((r) => r.department.includes('['));

    let matched = 0;
    for (const stageRecord of teijiRecords) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(teijiRecords).toHaveLength(20);
    expect(matched).toBe(20);
  });

  it('testTakersConfirmedは「計（A）＋（B）」列（本検査受検者＋追検査受検者の合計）のためquotaの1.5倍を超えることはない（極端な誤読の防止・粗いガード）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThan(r.quota * 3);
    }
  });

  it('finalPassersがquotaを超えるのは既知の13件のみ（合格ボーダー同点者の全員合格と推測）', () => {
    const KNOWN_OVERFLOW = new Map<string, number>([
      ['横浜立野|普通科', 279],
      ['湘南|普通科', 360],
      ['藤沢西|普通科', 319],
      ['海老名|普通科', 399],
      ['綾瀬|普通科', 319],
      ['伊志田|普通科', 311],
      ['上溝|普通科', 242],
      ['相原|農業科', 115],
      ['相原|商業科', 119],
      ['神奈川工業|工業科', 319],
      ['藤沢総合|総合学科（単位制）', 269],
      ['相模原弥栄|体育科（単位制）', 80],
      ['横浜国際|国際科（単位制）', 160],
    ]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(KNOWN_OVERFLOW.get(key));
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.quota);
    }
  });

  it('finalPassersがapplicantsConfirmedを超えるのは既知の1件のみ（横浜市立横浜総合・総合学科Ⅲ部＝第2希望による合格者を含むと資料脚注に明記）', () => {
    const KNOWN_APPLICANTS_OVERFLOW = new Map<string, number>([['横浜市立横浜総合|総合学科Ⅲ部 [単位制総合学科・定時制]', 40]]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_APPLICANTS_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(KNOWN_APPLICANTS_OVERFLOW.get(key));
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('普通科96レコードの機械集計が資料本文の4段階の公式小計（県立計・市立計・合計・クリエイティブ合計）とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kenritsu = officialSubtotals.find((s) => s.label === '県立計（普通科・共通選抜）');
    const shiritsu = officialSubtotals.find((s) => s.label === '市立計（普通科・共通選抜）');
    const goukei = officialSubtotals.find((s) => s.label === '合計（普通科・共通選抜）');
    const creative = officialSubtotals.find((s) => s.label === '合計（普通科クリエイティブスクール）');
    if (!kenritsu || !shiritsu || !goukei || !creative) throw new Error('officialSubtotals の一部が見つかりません');

    // 県立計＋市立計＝合計（資料内部の整合性）
    expect(kenritsu.quota + shiritsu.quota).toBe(goukei.quota);
    expect(kenritsu.testTakersConfirmed + shiritsu.testTakersConfirmed).toBe(goukei.testTakersConfirmed);
    expect(kenritsu.finalPassers + shiritsu.finalPassers).toBe(goukei.finalPassers);

    const kyoutsuu = records.filter((r) => r.department === '普通科');
    const creativeRecords = records.filter((r) => r.department === '普通科（クリエイティブスクール）');
    const kyoutsuuSums = sumStageLedger(kyoutsuu);
    const creativeSums = sumStageLedger(creativeRecords);

    expect(kyoutsuu).toHaveLength(92);
    expect(creativeRecords).toHaveLength(4);

    expect(kyoutsuuSums.quota).toBe(goukei.quota);
    expect(kyoutsuuSums.testTakersConfirmed).toBe(goukei.testTakersConfirmed);
    expect(kyoutsuuSums.finalPassers).toBe(goukei.finalPassers);
    expect(kyoutsuuSums.applicantsConfirmed).toBe(goukei.applicantsConfirmed);

    expect(creativeSums.quota).toBe(creative.quota);
    expect(creativeSums.testTakersConfirmed).toBe(creative.testTakersConfirmed);
    expect(creativeSums.finalPassers).toBe(creative.finalPassers);
    expect(creativeSums.applicantsConfirmed).toBe(creative.applicantsConfirmed);

    const futsuukaTotal = sumStageLedger([...kyoutsuu, ...creativeRecords]);
    expect(futsuukaTotal.quota).toBe(goukei.quota + creative.quota);
    expect(futsuukaTotal.testTakersConfirmed).toBe(goukei.testTakersConfirmed + creative.testTakersConfirmed);
    expect(futsuukaTotal.finalPassers).toBe(goukei.finalPassers + creative.finalPassers);
  });

  it('専門学科33レコードは10区分（農業3・工業10・商業7・水産1・家庭1・福祉4・理数1・体育2・美術2・国際2）で、7区分の公式小計とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する（水産・家庭・理数は学校数1のため区分合計行が印字されず対象外）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const SENMON_DEPARTMENTS: Record<string, number> = {
      農業科: 3,
      工業科: 10,
      商業科: 7,
      水産科: 1,
      家庭科: 1,
      福祉科: 4,
      理数科: 1,
      体育科: 2,
      美術科: 2,
      国際科: 2,
    };
    let senmonTotal = 0;
    for (const [dept, count] of Object.entries(SENMON_DEPARTMENTS)) {
      const deptRecords = records.filter((r) => r.department === dept);
      expect(deptRecords).toHaveLength(count);
      senmonTotal += deptRecords.length;

      const subtotalLabel = `合計（専門学科・${dept.replace('科', '')}）`;
      const subtotal = officialSubtotals.find((s) => s.label === subtotalLabel);
      if (!subtotal) continue; // 水産・家庭・理数は区分合計行が資料に印字されていないため対象外
      const sums = sumStageLedger(deptRecords);
      expect(sums.quota).toBe(subtotal.quota);
      expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
      expect(sums.finalPassers).toBe(subtotal.finalPassers);
    }
    expect(senmonTotal).toBe(33);
  });

  it('単位制35レコードは13区分で、3区分（普通科・総合学科・専門学科農業）の公式小計とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する（他10区分は学校数1のため区分合計行が印字されず対象外）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const TANICHI_DEPARTMENTS: Record<string, number> = {
      '普通科（単位制）': 15,
      '普通科（単位制・一般コース）': 1,
      '普通科（単位制・音楽コース）': 1,
      '総合学科（単位制）': 7,
      '総合学科（単位制・クリエイティブスクール）': 1,
      '農業科（単位制）': 2,
      '家庭科（単位制）': 1,
      '理数科（単位制）': 1,
      '体育科（単位制）': 1,
      '音楽科（単位制）': 1,
      '美術科（単位制）': 1,
      '国際科（単位制）': 1,
      '総合産業科（単位制）': 1,
      '舞台芸術科（単位制）': 1,
    };
    let tanichiTotal = 0;
    for (const [dept, count] of Object.entries(TANICHI_DEPARTMENTS)) {
      const deptRecords = records.filter((r) => r.department === dept);
      expect(deptRecords).toHaveLength(count);
      tanichiTotal += deptRecords.length;
    }
    expect(tanichiTotal).toBe(35);

    // 「普通科（単位制）」と「普通科（単位制・一般コース）」を合わせて資料の
    // 「単位制 普通科」区分16校（横浜市立戸塚の一般コースを含む）に対応する
    const futsuukaTanichi = [
      ...records.filter((r) => r.department === '普通科（単位制）'),
      ...records.filter((r) => r.department === '普通科（単位制・一般コース）'),
    ];
    expect(futsuukaTanichi).toHaveLength(16);
    const futsuukaSubtotal = officialSubtotals.find((s) => s.label === '合計（単位制・普通科）');
    if (!futsuukaSubtotal) throw new Error('officialSubtotals に「合計（単位制・普通科）」が見つかりません');
    const futsuukaSums = sumStageLedger(futsuukaTanichi);
    expect(futsuukaSums.quota).toBe(futsuukaSubtotal.quota);
    expect(futsuukaSums.testTakersConfirmed).toBe(futsuukaSubtotal.testTakersConfirmed);
    expect(futsuukaSums.finalPassers).toBe(futsuukaSubtotal.finalPassers);
    expect(futsuukaSums.applicantsConfirmed).toBe(futsuukaSubtotal.applicantsConfirmed);

    const sougouSubtotal = officialSubtotals.find((s) => s.label === '合計（単位制・総合学科）');
    if (!sougouSubtotal) throw new Error('officialSubtotals に「合計（単位制・総合学科）」が見つかりません');
    const sougouSums = sumStageLedger(records.filter((r) => r.department === '総合学科（単位制）'));
    expect(sougouSums.quota).toBe(sougouSubtotal.quota);
    expect(sougouSums.testTakersConfirmed).toBe(sougouSubtotal.testTakersConfirmed);
    expect(sougouSums.finalPassers).toBe(sougouSubtotal.finalPassers);
    expect(sougouSums.applicantsConfirmed).toBe(sougouSubtotal.applicantsConfirmed);

    const nougyouSubtotal = officialSubtotals.find((s) => s.label === '合計（単位制・専門学科農業）');
    if (!nougyouSubtotal) throw new Error('officialSubtotals に「合計（単位制・専門学科農業）」が見つかりません');
    const nougyouSums = sumStageLedger(records.filter((r) => r.department === '農業科（単位制）'));
    expect(nougyouSums.quota).toBe(nougyouSubtotal.quota);
    expect(nougyouSums.testTakersConfirmed).toBe(nougyouSubtotal.testTakersConfirmed);
    expect(nougyouSums.finalPassers).toBe(nougyouSubtotal.finalPassers);
    expect(nougyouSums.applicantsConfirmed).toBe(nougyouSubtotal.applicantsConfirmed);
  });

  it('定時制・通信制20レコードは4区分（単位制普通科11・単位制総合学科4・単位制専門学科工業3・通信制単位制普通科2）で、4区分すべての公式小計とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const TEIJI_TSUSHIN_SECTIONS: Record<string, number> = {
      '[単位制普通科・定時制]': 11,
      '[単位制総合学科・定時制]': 4,
      '[単位制専門学科(工業)・定時制]': 3,
      '[単位制普通科・通信制]': 2,
    };
    const LABELS: Record<string, string> = {
      '[単位制普通科・定時制]': '合計（定時制・単位制普通科）',
      '[単位制総合学科・定時制]': '合計（定時制・単位制総合学科）',
      '[単位制専門学科(工業)・定時制]': '合計（定時制・単位制専門学科工業）',
      '[単位制普通科・通信制]': '合計（通信制・単位制普通科）',
    };
    let teijiTotal = 0;
    for (const [tag, count] of Object.entries(TEIJI_TSUSHIN_SECTIONS)) {
      const sectionRecords = records.filter((r) => r.department.endsWith(tag));
      expect(sectionRecords).toHaveLength(count);
      teijiTotal += sectionRecords.length;

      const subtotal = officialSubtotals.find((s) => s.label === LABELS[tag]);
      if (!subtotal) throw new Error(`officialSubtotals に「${LABELS[tag]}」が見つかりません`);
      const sums = sumStageLedger(sectionRecords);
      expect(sums.quota).toBe(subtotal.quota);
      expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
      expect(sums.finalPassers).toBe(subtotal.finalPassers);
      expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    }
    expect(teijiTotal).toBe(20);
  });
});
