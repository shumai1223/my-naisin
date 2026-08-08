import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { OKAYAMA_COMPETITION_RATES } from '../okayama';

/**
 * Y-6 DoD検証（岡山県・7県目・全日制完全達成／掛-1・R7多年度対応済）。
 *
 * 県立全日制（49校106レコード）と市立全日制（岡山後楽館・玉野商工の2校3レコード）の両方が
 * PDF1ページ目「総括表（全国募集を除く）」記載のグランドトータルと完全一致する。くくり募集
 * （複数学科が一般入学募集人員を共有する9組）は（２）（３）の比率ランキング表と突合済み。
 */
const OKAYAMA_MUNICIPAL_SCHOOLS = ['岡山後楽館', '玉野商工'];

describe('岡山県 倍率パイプラインα（Y-6・全日制49校+2校＝109レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = OKAYAMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('県立全日制の合計が総括表記載のグランドトータル（quota5,698・applicants5,650・倍率0.99）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '県立全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear && !OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
    expect(result.matches).toBe(true);
  });

  it('市立全日制の合計が総括表記載のグランドトータル（quota63・applicants54・倍率0.86）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '市立全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear && OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(OKAYAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('109レコード・51校が収録されている（県立49校＋市立2校）', () => {
    expect(r8.length).toBe(109);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(51);
  });

  it('くくり募集（複数学科が一般入学募集人員を共有）が（２）（３）の比率ランキング表と一致する値で収録されている', () => {
    const cases: Array<{ schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }> = [
      { schoolName: '岡山一宮', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 320, finalRate: 1.14 },
      { schoolName: '西大寺', department: '普通・国際情報（くくり募集）', quota: 180, finalApplicants: 243, finalRate: 1.35 },
      { schoolName: '東岡山工業', department: '機械・電子機械・電気（くくり募集）', quota: 40, finalApplicants: 51, finalRate: 1.28 },
      { schoolName: '岡山東商業', department: 'ビジネス創造・情報ビジネス（くくり募集）', quota: 64, finalApplicants: 143, finalRate: 2.23 },
      { schoolName: '倉敷商業', department: '商業・国際経済・情報処理（くくり募集）', quota: 64, finalApplicants: 122, finalRate: 1.91 },
      { schoolName: '玉島', department: '普通・理数（くくり募集）', quota: 220, finalApplicants: 191, finalRate: 0.87 },
      { schoolName: '津山', department: '普通・理数（くくり募集）', quota: 148, finalApplicants: 131, finalRate: 0.89 },
      { schoolName: '津山商業', department: '地域ビジネス・情報ビジネス（くくり募集）', quota: 37, finalApplicants: 29, finalRate: 0.78 },
    ];
    for (const c of cases) {
      const rec = r8.find((r) => r.schoolName === c.schoolName && r.department === c.department);
      expect(rec).toEqual(c);
    }
  });

  it('学校名なしで出現しやすい罠のあった津山東・玉野光南の学科が正しく収録されている', () => {
    expect(r8.filter((r) => r.schoolName === '津山東')).toHaveLength(3);
    expect(r8.filter((r) => r.schoolName === '玉野光南')).toHaveLength(2);
    const tsuyamaHigashiFutsu = r8.find((r) => r.schoolName === '津山東' && r.department === '普通');
    expect(tsuyamaHigashiFutsu).toEqual({ schoolName: '津山東', department: '普通', quota: 120, finalApplicants: 118, finalRate: 0.98 });
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      西大寺: 2,
      高松農業: 5,
      興陽: 4,
      瀬戸南: 3,
      岡山工業: 7,
      東岡山工業: 3,
      岡山南: 5,
      倉敷中央: 4,
      倉敷鷲羽: 2,
      倉敷工業: 5,
      水島工業: 5,
      津山東: 3,
      津山工業: 6,
      玉野光南: 2,
      笠岡工業: 3,
      井原: 2,
      総社: 2,
      高梁: 2,
      高梁城南: 3,
      新見: 3,
      邑久: 2,
      勝山: 2,
      真庭: 3,
      和気閑谷: 2,
      矢掛: 2,
      玉野商工: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが112件・52校収録され、県立全日制/市立全日制それぞれ公式グランドトータル(5,729/5,968・73/42)と完全一致する。岡山御津・井原グリーンライフ(R7のみ実在)・津山理数(R7は0で除外)・興陽家政+被服デザイン(R8でライフデザインへ統合)の5件を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(112);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(52);

    const r7Pref = r7.filter((r) => !OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
    const r7City = r7.filter((r) => OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
    expect(r7Pref.reduce((a, r) => a + r.quota, 0)).toBe(5729);
    expect(r7Pref.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5968);
    expect(r7City.reduce((a, r) => a + r.quota, 0)).toBe(73);
    expect(r7City.reduce((a, r) => a + r.finalApplicants, 0)).toBe(42);

    const r7OnlyKeys = new Set(['興陽|家政', '興陽|被服デザイン', '岡山御津|キャリアデザイン', '津山|普通', '井原|地域生活＜グリーンライフ＞']);
    const r8OnlyKeys = new Set(['興陽|ライフデザイン', '津山|普通・理数（くくり募集）']);
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r8OnlyKeys.has(k)));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r7OnlyKeys.has(k)));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが110件・52校収録され、県立全日制/市立全日制それぞれ公式グランドトータル(5,750/6,263・68/53)と完全一致する。R7のschoolName一覧との差分は井原の地域生活＜グリーンライフ＞＜ヒューマンライフ＞2件のみ(R6はquota0で除外・R7はquota5/1で実在)で、年度ごとの実際の募集枠変動と確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(110);
    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(52);

    const r6Pref = r6.filter((r) => !OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
    const r6City = r6.filter((r) => OKAYAMA_MUNICIPAL_SCHOOLS.includes(r.schoolName));
    expect(r6Pref.reduce((a, r) => a + r.quota, 0)).toBe(5750);
    expect(r6Pref.reduce((a, r) => a + r.finalApplicants, 0)).toBe(6263);
    expect(r6City.reduce((a, r) => a + r.quota, 0)).toBe(68);
    expect(r6City.reduce((a, r) => a + r.finalApplicants, 0)).toBe(53);

    const r7OnlyKeys = new Set(['井原|地域生活＜グリーンライフ＞', '井原|地域生活＜ヒューマンライフ＞']);
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r7OnlyKeys.has(k)));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys).toEqual(r7Keys);
  });

  it('sourcesが公式PDF URLを正しく記録している（R6分は原本削除のため教育委員会公式ミラーサイトを許容）', () => {
    for (const s of OKAYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.(pref\.okayama\.jp|okayama-kenritsukoukou\.jp)\//);
    }
  });
});
