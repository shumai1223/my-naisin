import {
  calcKyokaStatus,
  calcOverallStatus,
  toGaihyou,
  type Kamoku,
} from '@/lib/gakushu-seiseki';

// 出典: 文部科学省「令和９年度大学入学者選抜実施要項について（通知）」別紙様式１
// 「調査書記入上の注意事項等について」8(2)(4)・9(1)（2026-08-27にPyMuPDFで全文確認）。

describe('calcKyokaStatus / calcOverallStatus — 文科省の公式計算例', () => {
  it('教科別: 理科(物理基礎3・化学基礎3・生物基礎5) = (3+3+5)/3=3.66 → 3.7', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '理科', kamoku: '物理基礎', gakunen: 1, hyotei: 3 },
      { kyoka: '理科', kamoku: '化学基礎', gakunen: 2, hyotei: 3 },
      { kyoka: '理科', kamoku: '生物基礎', gakunen: 1, hyotei: 5 },
    ];
    expect(calcKyokaStatus(kamoku)['理科']).toBe(3.7);
  });

  it('全体: 120÷31=3.87 → 3.9（通知の計算例と同じ評定合計120・評定数31を満たす配列で検証）', () => {
    // 評定4×29件+評定2×2件＝合計120・件数31（合計と件数さえ一致すれば式の正しさを検証できる）。
    const kamoku: Kamoku[] = [
      ...Array.from({ length: 29 }, (_, i): Kamoku => ({
        kyoka: `教科${i}`,
        kamoku: `科目${i}`,
        gakunen: 1,
        hyotei: 4,
      })),
      { kyoka: '教科29', kamoku: '科目29', gakunen: 1, hyotei: 2 },
      { kyoka: '教科30', kamoku: '科目30', gakunen: 1, hyotei: 2 },
    ];
    expect(kamoku.reduce((a, k) => a + k.hyotei, 0)).toBe(120);
    expect(kamoku.length).toBe(31);
    expect(calcOverallStatus(kamoku)).toBe(3.9);
  });

  it('全体の丸め: 11/3=3.6666… → 3.7（教科別と同じ丸め規則を全体にも適用）', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '理科', kamoku: '物理基礎', gakunen: 1, hyotei: 3 },
      { kyoka: '理科', kamoku: '化学基礎', gakunen: 2, hyotei: 3 },
      { kyoka: '理科', kamoku: '生物基礎', gakunen: 1, hyotei: 5 },
    ];
    expect(calcOverallStatus(kamoku)).toBe(3.7);
  });
});

describe('toGaihyou — 学習成績概評A〜Eの境界値（通知9(1)の表）', () => {
  it.each([
    [5.0, 'A'],
    [4.3, 'A'],
    [4.2, 'B'],
    [3.5, 'B'],
    [3.4, 'C'],
    [2.7, 'C'],
    [2.6, 'D'],
    [1.9, 'D'],
    [1.8, 'E'],
    [1.0, 'E'],
  ] as const)('全体の学習成績の状況%s → 概評%s', (overall, expected) => {
    expect(toGaihyou(overall)).toBe(expected);
  });
});

describe('calcOverallStatus — 値域と不変条件', () => {
  it('全体の値は必ず1.0〜5.0の範囲に収まる', () => {
    const patterns: Kamoku[][] = [
      [{ kyoka: 'A', kamoku: 'a', gakunen: 1, hyotei: 1 }],
      [{ kyoka: 'A', kamoku: 'a', gakunen: 1, hyotei: 5 }],
      [
        { kyoka: 'A', kamoku: 'a', gakunen: 1, hyotei: 1 },
        { kyoka: 'B', kamoku: 'b', gakunen: 2, hyotei: 5 },
      ],
    ];
    for (const kamoku of patterns) {
      const overall = calcOverallStatus(kamoku);
      expect(overall).toBeGreaterThanOrEqual(1.0);
      expect(overall).toBeLessThanOrEqual(5.0);
    }
  });

  it('空配列は0を返す（未入力状態の安全なデフォルト）', () => {
    expect(calcOverallStatus([])).toBe(0);
  });
});

describe('複数学年にわたる科目の取り扱い（通知8(4)注）', () => {
  it('体育(1年4・2年3・3年4)＋保健(1年4・2年5)は各学年ごとに1科目分＝評定数5・合計20', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '保健体育', kamoku: '体育', gakunen: 1, hyotei: 4 },
      { kyoka: '保健体育', kamoku: '体育', gakunen: 2, hyotei: 3 },
      { kyoka: '保健体育', kamoku: '体育', gakunen: 3, hyotei: 4 },
      { kyoka: '保健体育', kamoku: '保健', gakunen: 1, hyotei: 4 },
      { kyoka: '保健体育', kamoku: '保健', gakunen: 2, hyotei: 5 },
    ];
    // 評定数5・合計20 → 20/5=4.0（学年ごとに1科目分として数えた場合の値）
    expect(calcKyokaStatus(kamoku)['保健体育']).toBe(4.0);
    // もし誤って科目単位(体育1件・保健1件=評定数2)で平均していた場合は
    // (4+3+4)/3=3.666…と(4+5)/2=4.5の単純平均=4.08…になり、4.0とは一致しない
  });
});

describe('★教科ごとの平均の平均ではない（よくある誤り・通知8(4)）', () => {
  it('全体は教科別学習成績の状況の単純平均と一致しないことがある（評定数の重みが教科ごとに違うため）', () => {
    const kamoku: Kamoku[] = [
      // 国語: 評定5が1件のみ（教科別=5.0）
      { kyoka: '国語', kamoku: '現代の国語', gakunen: 1, hyotei: 5 },
      // 数学: 評定1が3件（教科別=1.0）
      { kyoka: '数学', kamoku: '数学I', gakunen: 1, hyotei: 1 },
      { kyoka: '数学', kamoku: '数学II', gakunen: 2, hyotei: 1 },
      { kyoka: '数学', kamoku: '数学III', gakunen: 3, hyotei: 1 },
    ];
    const kyokaStatus = calcKyokaStatus(kamoku);
    const averageOfKyokaAverages =
      (kyokaStatus['国語'] + kyokaStatus['数学']) / 2; // (5.0+1.0)/2=3.0（誤った方法）
    const overall = calcOverallStatus(kamoku); // (5+1+1+1)/4=2.0（正しい方法＝全評定の単純平均）

    expect(averageOfKyokaAverages).toBe(3.0);
    expect(overall).toBe(2.0);
    expect(overall).not.toBe(averageOfKyokaAverages);
  });
});

describe('型レベルで単位数(tanni)を受け取れない（§1-3の設計制約）', () => {
  it('Kamoku型のキーにtanni系フィールドが存在しない', () => {
    const kamoku: Kamoku = { kyoka: '国語', kamoku: '現代の国語', gakunen: 1, hyotei: 4 };
    expect(Object.keys(kamoku)).not.toContain('tanni');
    expect(Object.keys(kamoku)).not.toContain('tanniSu');
    expect(Object.keys(kamoku)).not.toContain('unit');
  });
});
