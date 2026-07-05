/**
 * 偏差値ライブラリ（src/lib/hensachi.ts）の決定論契約テスト。
 *
 * 偏差値クラスタの全ページ・全ツールがこの数式に依存する。値がズレると
 * 「偏差値60＝上位16%」のような引用される一次データが壊れるため、回帰を強く守る。
 */
import {
  standardNormalCdf,
  standardNormalInv,
  calcHensachi,
  hensachiToUpperPercent,
  hensachiToRank,
  upperPercentToHensachi,
  rankToHensachi,
  tierForHensachi,
  reachBandsForHensachi,
  combinedHensachi,
  naishinToHensachiGuide,
  buildPercentileTable,
  HIGH_SCHOOL_TIERS,
  SUBJECTS,
} from '@/lib/hensachi';

describe('standardNormalCdf', () => {
  test('Φ(0)=0.5', () => {
    expect(standardNormalCdf(0)).toBeCloseTo(0.5, 6);
  });
  test('Φ(1)≈0.8413, Φ(2)≈0.9772', () => {
    expect(standardNormalCdf(1)).toBeCloseTo(0.8413, 3);
    expect(standardNormalCdf(2)).toBeCloseTo(0.9772, 3);
  });
  test('対称性 Φ(-z)=1-Φ(z)', () => {
    expect(standardNormalCdf(-1.3)).toBeCloseTo(1 - standardNormalCdf(1.3), 5);
  });
});

describe('standardNormalInv', () => {
  test('逆関数：CDFと往復で一致する', () => {
    for (const z of [-2, -1, -0.4, 0.7, 1.5]) {
      const p = standardNormalCdf(z);
      expect(standardNormalInv(p)).toBeCloseTo(z, 3);
    }
  });
  test('中央値 p=0.5 → z=0', () => {
    expect(standardNormalInv(0.5)).toBeCloseTo(0, 6);
  });
});

describe('calcHensachi', () => {
  test('平均点ちょうど → 偏差値50', () => {
    expect(calcHensachi(50, 50, 15)).toBe(50);
  });
  test('平均+1σ → 偏差値60', () => {
    expect(calcHensachi(65, 50, 15)).toBe(60);
  });
  test('標準偏差0や不正値は null', () => {
    expect(calcHensachi(60, 50, 0)).toBeNull();
    expect(calcHensachi(NaN, 50, 15)).toBeNull();
  });
});

describe('hensachiToUpperPercent（引用される一次データ）', () => {
  test('偏差値50 = 上位50%', () => {
    expect(hensachiToUpperPercent(50)).toBeCloseTo(50, 4);
  });
  test('偏差値60 = 上位約15.9%（≒16%）', () => {
    expect(hensachiToUpperPercent(60)).toBeCloseTo(15.87, 1);
  });
  test('偏差値65 = 上位約6.7%', () => {
    expect(hensachiToUpperPercent(65)).toBeCloseTo(6.68, 1);
  });
  test('偏差値70 = 上位約2.3%', () => {
    expect(hensachiToUpperPercent(70)).toBeCloseTo(2.28, 1);
  });
});

describe('hensachiToRank', () => {
  test('偏差値50・300人 → 150位', () => {
    expect(hensachiToRank(50, 300)).toBe(150);
  });
  test('偏差値60・300人 → 約48位', () => {
    expect(hensachiToRank(60, 300)).toBe(48);
  });
  test('偏差値70・1000人 → 約23位', () => {
    expect(hensachiToRank(70, 1000)).toBe(23);
  });
  test('順位は1以上 population 以下にクランプ', () => {
    expect(hensachiToRank(120, 300)).toBe(1);
    expect(hensachiToRank(-10, 300)).toBe(300);
  });
});

describe('upperPercentToHensachi（逆引き）', () => {
  test('上位50% → 偏差値50', () => {
    expect(upperPercentToHensachi(50)).toBeCloseTo(50, 4);
  });
  test('hensachiToUpperPercent と往復で一致', () => {
    for (const h of [40, 48, 55, 62, 68]) {
      const pct = hensachiToUpperPercent(h);
      expect(upperPercentToHensachi(pct)).toBeCloseTo(h, 2);
    }
  });
});

describe('rankToHensachi（順位からの逆引き）', () => {
  test('300人中150位 → 偏差値50', () => {
    expect(rankToHensachi(150, 300)).toBeCloseTo(50, 4);
  });
  test('hensachiToRank と往復でおおむね一致（順位は整数量子化のため近似）', () => {
    for (const h of [45, 50, 55, 60, 65]) {
      const rank = hensachiToRank(h, 300);
      expect(rankToHensachi(rank, 300)).toBeCloseTo(h, 0);
    }
  });
  test('順位が母集団を超える場合は母集団人数にクランプ', () => {
    expect(rankToHensachi(500, 300)).toBe(rankToHensachi(300, 300));
  });
  test('無効入力は null', () => {
    expect(rankToHensachi(0, 300)).toBeNull();
    expect(rankToHensachi(50, 0)).toBeNull();
    expect(rankToHensachi(NaN, 300)).toBeNull();
  });
});

describe('tierForHensachi（高校レベル目安）', () => {
  test('境界値が正しいバンドに入る', () => {
    expect(tierForHensachi(72).id).toBe('top');
    expect(tierForHensachi(70).id).toBe('top');
    expect(tierForHensachi(69.9).id).toBe('advanced');
    expect(tierForHensachi(50).id).toBe('mid');
    expect(tierForHensachi(49.9).id).toBe('standard');
    expect(tierForHensachi(10).id).toBe('foundation');
  });
  test('全バンドが隙間なく連続している', () => {
    const sorted = [...HIGH_SCHOOL_TIERS].sort((a, b) => b.min - a.min);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].min).toBe(sorted[i + 1].max);
    }
  });
});

describe('reachBandsForHensachi', () => {
  test('安全圏 ≤ 実力相応 ≤ チャレンジ の順に難しくなる', () => {
    const b = reachBandsForHensachi(58);
    expect(b.safe.min).toBeLessThanOrEqual(b.match.min);
    expect(b.match.min).toBeLessThanOrEqual(b.challenge.min);
  });
});

describe('combinedHensachi', () => {
  test('空欄を除いた平均を返す', () => {
    expect(combinedHensachi([50, 60, null, 70])).toBeCloseTo(60, 6);
  });
  test('全て空欄なら null', () => {
    expect(combinedHensachi([null, null])).toBeNull();
  });
});

describe('naishinToHensachiGuide（並置：換算ではない）', () => {
  test('オール3(27) は最も近い代表点 27 を返す', () => {
    expect(naishinToHensachiGuide(27).naishin45).toBe(27);
  });
  test('近接値は最寄り代表点に寄せる', () => {
    expect(naishinToHensachiGuide(37).naishin45).toBe(36);
  });
});

describe('SUBJECTS / buildPercentileTable', () => {
  test('3教科フラグは英数国のみ true', () => {
    const in3 = SUBJECTS.filter((s) => s.in3).map((s) => s.key).sort();
    expect(in3).toEqual(['eigo', 'kokugo', 'sugaku']);
  });
  test('対応表の偏差値50行は上位50%・300人中150位', () => {
    const row = buildPercentileTable().find((r) => r.h === 50)!;
    expect(row.upperPercent).toBeCloseTo(50, 4);
    expect(row.rank300).toBe(150);
  });
});
