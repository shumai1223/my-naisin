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

  it('全日制の全レコード合計がPDF末尾のグランドトータル（公立合計・quota16,954・applicants16,895・倍率1.00）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '公立合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(SHIZUOKA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('162レコード・90校が収録されている（PDF1〜9ページ目・下田〜浜松市立＝全日制全校）', () => {
    expect(records.length).toBe(162);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(90);
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
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIZUOKA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shizuoka\.jp\//);
    }
  });
});
