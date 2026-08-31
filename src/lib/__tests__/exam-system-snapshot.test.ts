import snapshot from '@/data/snapshots/2026-r8/exam-system.json';
import { PREFECTURES } from '../prefectures';

describe('2026-r8 exam-system snapshot（T-N1-1 凍結スナップショットの完全性）', () => {
  test('47都道府県すべてが揃っている', () => {
    expect(snapshot.entries).toHaveLength(47);
    expect(snapshot.meta.prefectureCount).toBe(47);
  });

  test('都道府県コードに重複がなく、PREFECTURESの集合と完全一致する(捏造・欠落防止の不変条件)', () => {
    const snapshotCodes = snapshot.entries.map((e) => e.code);
    expect(new Set(snapshotCodes).size).toBe(snapshotCodes.length);
    expect(new Set(snapshotCodes)).toEqual(new Set(PREFECTURES.map((p) => p.code)));
  });

  test('各県にfiscalYearとsourceUrlが存在する(未確認を隠さない・網羅を主張する前提条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.fiscalYear).toBeTruthy();
      expect(entry.sourceUrl).toBeTruthy();
    }
  });

  test('maxScoreは正の数であり、reverseCalcを持つ県はtotalMaxScoreも正の数(値域の不変条件)', () => {
    for (const entry of snapshot.entries) {
      expect(entry.maxScore).toBeGreaterThan(0);
      if (entry.reverseCalc) {
        expect(entry.reverseCalc.totalMaxScore).toBeGreaterThan(0);
        expect(entry.reverseCalc.examMaxScore).toBeGreaterThan(0);
      }
    }
  });

  test('pdfHashは取得済みの県のみ・64桁16進のSHA-256形式で、ハッシュ元PDFのURLが特定できる(未収集を偽らない)', () => {
    expect(snapshot.meta.pdfHashStatus).toBe('partial_32_of_47');
    const withHash = snapshot.entries.filter((e) => e.pdfHash !== null);
    expect(withHash).toHaveLength(32);
    // 拡張子なしでPDFを配信する文書管理CMS(東京都metro.tokyo.lg.jp等)向けの既知例外。
    // 個別に実ファイルをダウンロードしfile/content-typeでPDFと確認済みのURLのみ追加すること。
    const NO_EXTENSION_PDF_CMS_PATTERNS = [/^https:\/\/www\.kyoiku\.metro\.tokyo\.lg\.jp\/documents\/d\/kyoiku\//];
    for (const entry of withHash) {
      expect(entry.pdfHash).toMatch(/^[0-9a-f]{64}$/);
      // sourceUrlが直接PDFの場合はそれ自体がハッシュ元。ポータルページの場合はpdfHashSourceUrlに
      // 実際にハッシュを取得したPDFのURLを記録する(1差分1出典の原則・N1-0と同思想)。
      const hashSourceUrl = entry.pdfHashSourceUrl ?? entry.sourceUrl;
      const isKnownNoExtensionCms = NO_EXTENSION_PDF_CMS_PATTERNS.some((p) => p.test(hashSourceUrl));
      expect(hashSourceUrl.toLowerCase().endsWith('.pdf') || isKnownNoExtensionCms).toBe(true);
    }
    const withoutHash = snapshot.entries.filter((e) => e.pdfHash === null);
    expect(withoutHash).toHaveLength(15);
  });

  test('凍結メタデータに生成日・凍結ポリシーが明記されている', () => {
    expect(snapshot.meta.frozenAt).toBe('2026-08-30');
    expect(snapshot.meta.freezePolicy).toContain('書き換え禁止');
  });
});
