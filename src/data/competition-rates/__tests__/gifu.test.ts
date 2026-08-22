import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { GIFU_COMPETITION_RATES } from '../gifu';

/**
 * Y-6 DoD検証（岐阜県・6県目）。
 *
 * 岐阜県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した。各学科(群)の
 * 本体行には独自検査を含む選抜（Ⅰ/Ⅱ）・特色選抜等（－）・連携型選抜（連携）の内訳行が付随するが、
 * PDF冒頭の注記通りこれらは本体行の内数のため除外している（除外漏れがあると集計が水増しされる
 * ため回帰的に重要）。機械集計（quota12,925・applicants12,009・倍率0.93）が総括表記載の全日制計
 * と完全一致する。定時制・通信制課程は他県と同じ理由でスコープ外。
 */
describe('岐阜県 倍率パイプラインα（Y-6・全日制63校134レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = GIFU_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が総括表記載の全日制計（quota12,925・applicants12,009・倍率0.93）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
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

  it('coverageがcompleteを示している（定時制・通信制課程のみ意図的にスコープ外）', () => {
    expect(GIFU_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('134レコード・63校が収録されている（総括表の県立61校＋市立2校と一致）', () => {
    expect(r8.length).toBe(134);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(63);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが137件収録され、総括表記載の全日制計(quota12,885・applicants12,376)と完全一致する。高山工業のくくり募集構成の変化(R7=機械工学・電子機械工学・電気工学・建築インテリア工学の4学科独立定員→R8=総合工学科群という単一くくり募集に統合)を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(137);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(12885);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(12376);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(63);

    expect(r7.filter((r) => r.schoolName === '高山工業')).toHaveLength(4);
    expect(r8.filter((r) => r.schoolName === '高山工業')).toHaveLength(1);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが138件・63校収録され、総括表記載の全日制計(quota13,121・applicants12,829・倍率0.98)と完全一致する。高山工業はR6時点でも機械工学・電子機械工学・電気工学・建築インテリア工学の4学科独立定員のままで、R8のくくり募集化はまだ行われていなかった', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(138);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(13121);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(12829);

    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(63);

    expect(r6.filter((r) => r.schoolName === '高山工業')).toHaveLength(4);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが138件・63校収録され、総括表記載の全日制計(quota13,121・applicants12,729・倍率0.97)と完全一致する。高山工業はR5時点でも機械工学・電子機械工学・電気工学・建築インテリア工学の4学科独立定員のままで、加茂も「普通」「理数」の2学科制のまま（R7の文理探究統合はまだ行われていない）', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(138);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(13121);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(12729);

    const distinctSchools5 = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools5.size).toBe(63);

    expect(r5.filter((r) => r.schoolName === '高山工業')).toHaveLength(4);
    expect(r5.filter((r) => r.schoolName === '加茂')).toHaveLength(2);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      岐山: 2,
      加納: 3,
      岐阜城北: 2,
      岐阜商業: 4,
      岐南工業: 6,
      岐阜各務野: 3,
      岐阜農林: 7,
      岐阜工業: 4,
      揖斐: 2,
      大垣東: 2,
      大垣養老: 3,
      大垣商業: 2,
      大垣工業: 4,
      大垣桜: 4,
      海津明誠: 3,
      郡上: 2,
      武義: 2,
      関有知: 2,
      加茂農林: 5,
      東濃実業: 3,
      可児工業: 4,
      多治見工業: 4,
      瑞浪: 2,
      土岐商業: 2,
      恵那: 2,
      恵那農業: 2,
      坂下: 2,
      中津商業: 2,
      中津川工業: 3,
      益田清風: 3,
      飛騨高山: 6,
      吉城: 2,
      市立岐阜商業: 2,
      関商工: 4,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of GIFU_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.gifu\.lg\.jp\//);
    }
  });
});
