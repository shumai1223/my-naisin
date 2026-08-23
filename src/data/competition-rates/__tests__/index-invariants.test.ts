import { COMPETITION_RATE_BY_PREFECTURE, COMPETITION_RATE_FILES } from '../index';

/**
 * DW-7（DEADWIRE 2026-08-10）で指摘された欠落の是正: 個別県ファイルのテストは各県固有の
 * 固定値を検証するが、全都道府県に共通する構造的な整合性を機械的にチェックする横断テストが
 * 存在しなかった（新県追加時にテスト自体を書き忘れれば無検査で通ってしまう）。
 * `competition-rate-history`（多年度アーカイブ）の同名テストと同じ設計思想。
 */
describe('倍率パイプラインα index 横断不変条件（本命資産の最終防衛線）', () => {
  it('マップのキーとprefectureCodeが一致する', () => {
    for (const [code, file] of Object.entries(COMPETITION_RATE_BY_PREFECTURE)) {
      expect(file?.prefectureCode).toBe(code);
    }
  });

  it('全ファイルで少なくとも1件はレコードを収録している', () => {
    for (const file of COMPETITION_RATE_FILES) {
      expect(file.records.length).toBeGreaterThan(0);
    }
  });

  it('全レコードでquotaが正の数値・finalApplicantsが非負である', () => {
    for (const file of COMPETITION_RATE_FILES) {
      for (const r of file.records) {
        expect(r.quota).toBeGreaterThan(0);
        expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      }
    }
  });

  /**
   * 許容誤差0.10: 個別県テストで既に確認済みの最も緩い許容誤差(yamaguchi 0.09・小数第1位公表)
   * に安全マージンを足した値。これより粗い誤差（桁違い・転記ミス）だけを機械的に検出する
   * 粗いネットであり、個別県テストの厳密な許容誤差（大半は0.02）を置き換えるものではない。
   */
  it('全レコードで志願者数÷募集人員が公表倍率とおおむね一致する(誤差0.10未満・桁違いの転記ミス検出用の粗いネット)', () => {
    for (const file of COMPETITION_RATE_FILES) {
      for (const r of file.records) {
        const computed = r.finalApplicants / r.quota;
        expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.1);
      }
    }
  });

  it('学校名+学科名+年度の重複がファイル内に無い(全県横断)', () => {
    for (const file of COMPETITION_RATE_FILES) {
      const seen = new Set<string>();
      const dupes: string[] = [];
      for (const r of file.records) {
        const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
        if (seen.has(key)) dupes.push(key);
        seen.add(key);
      }
      expect(dupes).toEqual([]);
    }
  });

  it('sourceUrl/docTitle/fiscalYear/fetchedAtが全ファイル全出典で空文字でない(1データ点1出典の機械的担保)', () => {
    for (const file of COMPETITION_RATE_FILES) {
      expect(file.sources.length).toBeGreaterThan(0);
      for (const s of file.sources) {
        expect(s.url.length).toBeGreaterThan(0);
        expect(s.docTitle.length).toBeGreaterThan(0);
        expect(s.fiscalYear.length).toBeGreaterThan(0);
        expect(s.fetchedAt.length).toBeGreaterThan(0);
      }
    }
  });

  it('coverage.statusがpartialまたはcompleteのいずれかである', () => {
    for (const file of COMPETITION_RATE_FILES) {
      expect(['partial', 'complete']).toContain(file.coverage.status);
    }
  });

  it('目標(47都道府県)に対する現在の収録県数とレコード総数を記録する', () => {
    const totalRecords = COMPETITION_RATE_FILES.reduce((sum, f) => sum + f.records.length, 0);
    expect(COMPETITION_RATE_FILES.length).toBeGreaterThan(0);
    // eslint-disable-next-line no-console
    console.log(`倍率パイプラインα 収録合計: ${COMPETITION_RATE_FILES.length}県 / ${totalRecords}レコード`);
  });
});
