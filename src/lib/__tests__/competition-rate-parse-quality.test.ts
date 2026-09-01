import { assessPdfTextExtraction } from '@/lib/competition-rate-parse-quality';

describe('assessPdfTextExtraction', () => {
  it('classifies as usable when school names (CJK) and numeric columns both appear', () => {
    // ibaraki R8のpdftotext -layout成功パターンを模した合成フィクスチャ（実データそのものではない）。
    const rawText = `
      高萩清松　総合　　　120　　101　　0.84
      日立第一　普通・サイエンス　161　211　1.31
      日立第二　普通　　　160　　61　　0.38
      那珂湊　　海洋　　　120　　98　　0.82
      鉾田第二　総合　　　160　　140　　0.88
      全日制計　　　　　16647　15211　0.91
    `.repeat(20);
    const result = assessPdfTextExtraction(rawText);
    expect(result.quality).toBe('usable');
    expect(result.cjkCharCount).toBeGreaterThan(0);
    expect(result.numericRunCount).toBeGreaterThan(0);
  });

  it('classifies as needs-vision-fallback when numeric columns exist but CJK labels are missing (ToUnicode欠落パターン)', () => {
    // ibaraki R7/R6/R5・kagoshima・nagano R7等で実際に観測された「数値のみ抽出可、学校名・学科名は
    // 全て空欄」というToUnicodeマッピング欠落パターンを模した合成フィクスチャ。
    const rawText = Array.from({ length: 85 }, (_, i) => `  120  ${101 + i}  0.8${i % 10}`).join('\n');
    const result = assessPdfTextExtraction(rawText);
    expect(result.quality).toBe('needs-vision-fallback');
    expect(result.cjkCharCount).toBe(0);
  });

  it('classifies as inconclusive when there is almost no extractable numeric content', () => {
    // 取得失敗・空ページ等、テキスト抽出品質そのものの問題ではないケース。
    const result = assessPdfTextExtraction('　　　　\n\n\n');
    expect(result.quality).toBe('inconclusive');
  });

  it('classifies as inconclusive for an empty string without throwing', () => {
    const result = assessPdfTextExtraction('');
    expect(result.quality).toBe('inconclusive');
    expect(result.cjkCharCount).toBe(0);
    expect(result.numericRunCount).toBe(0);
  });

  it('never returns usable when cjkCharCount is zero (usable always requires some CJK evidence)', () => {
    const rawText = Array.from({ length: 50 }, (_, i) => `${100 + i} ${200 + i}`).join('\n');
    const result = assessPdfTextExtraction(rawText);
    expect(result.quality).not.toBe('usable');
  });
});
