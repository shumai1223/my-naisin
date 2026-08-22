import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIZUOKA_COMPETITION_RATES } from '../shizuoka';

/**
 * Y-6 DoD検証（静岡県・2県目）。
 *
 * 静岡県は学科ごとに選抜枠（Ⅰ/Ⅱ/Ⅲ）の割合内訳が付随する独自の表構造を持つため、
 * 学科の総定員行のみを1レコードとして採用している（詳細はshizuoka.tsのファイル冒頭
 * コメント参照）。PDF1〜9ページ目の全日制90校162レコードを完全収録した。機械集計
 * （quota16,954・applicants16,895・倍率1.00）はPDF9ページ目末尾のグランドトータル
 * （公立合計）と完全一致する。10ページ目は特別選抜の内訳詳細（既に本体の総定員行に
 * 含まれる内数）、11〜12ページ目は定時制（東京都・神奈川県・千葉県・埼玉県・福岡県・
 * 兵庫県と同じ理由で意図的にスコープ外）だったため、9ページ目で全日制が完結すると
 * 確認できた。
 */
describe('静岡県 倍率パイプラインα（Y-6・全日制90校162レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SHIZUOKA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾のグランドトータル（公立合計・quota16,954・applicants16,895・倍率1.00）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '公立合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(SHIZUOKA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('162レコード・90校が収録されている（PDF1〜9ページ目・下田〜浜松市立＝全日制全校）', () => {
    expect(r8.length).toBe(162);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(90);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが162件収録され、90校・PDF末尾の公立合計(quota17,084・applicants18,183)と完全一致する。学科名の印字表記がR7「普通」「理数」→R8「普通科」「理数科」で全面的に異なる(内容変更ではなく印字差)。沼津工業・吉原工業のくくり学科群名の変更(内容改編)も確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(162);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(17084);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(18183);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(90);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが162件・90校収録され、公式「公立合計」(quota17,699・applicants18,702・倍率1.06)と完全一致する。学科名の印字表記・沼津工業/吉原工業のくくり学科群名ともR7と完全一致(R8のみ表記が異なる)。学校名+学科名のキー集合もR7と完全一致(統廃合なし)', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(162);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(17699);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(18702);

    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(90);

    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys.size).toBe(r7Keys.size);
    for (const key of r6Keys) {
      expect(r7Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが163件(90校)収録され、PDF末尾の合計行(quota18,598・applicants19,284・倍率1.04)と完全一致する。学科名の印字表記はR6/R7と同じ「科」を付けない形式で完全一致するが、掛川工業のみ学科構成が異なる(R5「機械・電子機械・電子電気・情報技術・環境設備」の5学科・総定員200 → R6以降「機械工学・電気電子工学・情報工学・建築設備工学」の4学科・総定員160に再編、というR5→R6間の実データ差分をR6以降のキー集合との比較で検出できる)。それ以外の89校はR6と学校名+学科名のキー集合が完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(163);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(18598);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(19284);

    const distinctSchools5 = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools5.size).toBe(90);

    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));

    // 掛川工業のみR5→R6で学科再編（5学科→4学科）。それ以外の89校・160レコードのキーは完全一致する。
    const r5Only = [...r5Keys].filter((k) => !r6Keys.has(k));
    const r6Only = [...r6Keys].filter((k) => !r5Keys.has(k));
    expect(r5Only.sort()).toEqual([
      '掛川工業|情報技術',
      '掛川工業|環境設備',
      '掛川工業|機械',
      '掛川工業|電子機械',
      '掛川工業|電子電気',
    ].sort());
    expect(r6Only.sort()).toEqual([
      '掛川工業|建築設備工学',
      '掛川工業|情報工学',
      '掛川工業|機械工学',
      '掛川工業|電気電子工学',
    ].sort());

    const kakegawaR5 = r5.filter((r) => r.schoolName === '掛川工業');
    expect(kakegawaR5.length).toBe(5);
    expect(kakegawaR5.reduce((a, r) => a + r.quota, 0)).toBe(200);
    const kakegawaR6 = r6.filter((r) => r.schoolName === '掛川工業');
    expect(kakegawaR6.length).toBe(4);
    expect(kakegawaR6.reduce((a, r) => a + r.quota, 0)).toBe(160);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      下田: 2,
      伊豆伊東: 2,
      伊豆総合: 2,
      韮山: 2,
      田方農業: 3,
      御殿場: 3,
      沼津東: 2,
      沼津西: 2,
      沼津商業: 2,
      吉原: 2,
      富士: 2,
      富士宮東: 2,
      富士宮北: 2,
      富士市立: 3,
      清水東: 2,
      清水南: 2,
      静岡市立清水桜が丘: 2,
      静岡城北: 2,
      静岡農業: 3,
      科学技術: 8,
      静岡商業: 2,
      静岡市立: 2,
      焼津水産: 4,
      清流館: 2,
      島田工業: 2,
      榛原: 2,
      相良: 2,
      掛川西: 2,
      掛川工業: 4,
      磐田南: 2,
      磐田北: 2,
      磐田農業: 5,
      磐田西: 2,
      天竜: 3,
      浜松北: 2,
      浜松南: 2,
      浜松湖南: 2,
      浜松江之島: 2,
      浜松東: 3,
      浜松工業: 8,
      浜松城北工業: 4,
      浜松商業: 2,
      浜松湖北: 4,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIZUOKA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shizuoka\.jp\//);
    }
  });
});
