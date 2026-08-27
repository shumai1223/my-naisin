import { calcOverallStatus, calcKyokaStatus, type Kamoku } from '@/lib/gakushu-seiseki';

// src/app/hyotei-heikin/gakushu-seiseki/yokuaru-machigai/page.tsx のERROR_CASESに掲載した
// 3つの具体例（自作・文科省の公式計算例そのものではない）の数値が、実際に正しい方法/誤った方法の
// 計算結果と一致しているかを固定するテスト（プローズに手書きした数値のドリフト防止）。

describe('よくある誤り①: 単位数で重み付けする', () => {
  it('保健(評定2・2単位)/家庭総合(評定5・4単位) → 正しい3.5 / 誤り(単位数加重)4.0', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '保健体育', kamoku: '保健', gakunen: 1, hyotei: 2 },
      { kyoka: '家庭', kamoku: '家庭総合', gakunen: 1, hyotei: 5 },
    ];
    expect(calcOverallStatus(kamoku)).toBe(3.5);

    // ページには存在しない「単位数加重平均」という誤った式を、単位数を別途持たせて手計算で再現。
    const withUnits = [
      { hyotei: 2, tanni: 2 },
      { hyotei: 5, tanni: 4 },
    ];
    const weighted =
      withUnits.reduce((a, k) => a + k.hyotei * k.tanni, 0) / withUnits.reduce((a, k) => a + k.tanni, 0);
    expect(weighted).toBe(4.0);
  });
});

describe('よくある誤り②: 教科ごとの平均をさらに平均する', () => {
  it('国語(評定5×1)/数学(評定1×3) → 正しい2.0 / 誤り(教科平均の平均)3.0', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '国語', kamoku: '現代の国語', gakunen: 1, hyotei: 5 },
      { kyoka: '数学', kamoku: '数学I', gakunen: 1, hyotei: 1 },
      { kyoka: '数学', kamoku: '数学II', gakunen: 2, hyotei: 1 },
      { kyoka: '数学', kamoku: '数学III', gakunen: 3, hyotei: 1 },
    ];
    expect(calcOverallStatus(kamoku)).toBe(2.0);

    const kyokaStatus = calcKyokaStatus(kamoku);
    const averageOfKyokaAverages = (kyokaStatus['国語'] + kyokaStatus['数学']) / 2;
    expect(averageOfKyokaAverages).toBe(3.0);
  });
});

describe('よくある誤り③: 3年生の成績だけで計算する', () => {
  it('体育(1年3/2年4/3年5) → 正しい(3か年間)4.0 / 誤り(3年のみ)5.0', () => {
    const kamoku: Kamoku[] = [
      { kyoka: '保健体育', kamoku: '体育', gakunen: 1, hyotei: 3 },
      { kyoka: '保健体育', kamoku: '体育', gakunen: 2, hyotei: 4 },
      { kyoka: '保健体育', kamoku: '体育', gakunen: 3, hyotei: 5 },
    ];
    expect(calcOverallStatus(kamoku)).toBe(4.0);

    const thirdGradeOnly = kamoku.filter((k) => k.gakunen === 3);
    expect(calcOverallStatus(thirdGradeOnly)).toBe(5.0);
  });
});
