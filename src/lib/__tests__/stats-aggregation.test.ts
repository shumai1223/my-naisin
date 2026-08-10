/**
 * 匿名統計の集計ロジック（TIER N-2）。k-匿名性のしきい値と純粋な集計関数の契約テスト。
 */
import {
  STATS_MIN_SAMPLE_SIZE,
  STATS_METRICS,
  isStatsMetric,
  shouldSuppressCell,
  computeAggregate,
  buildSuppressedAggregate,
  buildPrefectureAggregates,
  isValidStatsSubmission,
  buildStatsCsv,
  computePercentileRank,
  buildSuppressedPercentile,
  formatStatValue,
  metricLabelToStatsMetric,
  checkAggregateInvariants,
  buildPublishableAggregate,
  buildPublishablePercentile,
  STATS_PUBLICATION,
  STATS_AGGREGATE_INVARIANTS,
} from '../stats-aggregation';

describe('formatStatValue（統計ページのmin/max表示丸め・2026-07-19: 生の浮動小数点(21.333333333333332)が本番表示されていた事故の再発防止）', () => {
  it('整数はそのまま文字列化する', () => {
    expect(formatStatValue(270)).toBe('270');
    expect(formatStatValue(0)).toBe('0');
  });
  it('小数は小数第1位に丸める', () => {
    expect(formatStatValue(21.333333333333332)).toBe('21.3');
    expect(formatStatValue(78.66666666666666)).toBe('78.7');
  });
});

describe('metricLabelToStatsMetric（ZZ-5a・結果カードv2の県内位置フック用マッピング）', () => {
  it('対応するラベルはStatsMetricへ変換する', () => {
    expect(metricLabelToStatsMetric('内申点')).toBe('naishin');
    expect(metricLabelToStatsMetric('偏差値')).toBe('hensachi');
    expect(metricLabelToStatsMetric('総合得点')).toBe('total-score');
  });

  it('未対応のラベル(評定平均等)・未指定はnull', () => {
    expect(metricLabelToStatsMetric('評定平均')).toBeNull();
    expect(metricLabelToStatsMetric(undefined)).toBeNull();
    expect(metricLabelToStatsMetric('')).toBeNull();
  });
});

describe('isStatsMetric', () => {
  it('登録済みの指標のみtrue', () => {
    for (const m of STATS_METRICS) {
      expect(isStatsMetric(m)).toBe(true);
    }
    expect(isStatsMetric('unknown-metric')).toBe(false);
    expect(isStatsMetric(123)).toBe(false);
    expect(isStatsMetric(undefined)).toBe(false);
  });
});

describe('shouldSuppressCell（k-匿名性）', () => {
  it('しきい値未満は抑制対象', () => {
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE - 1)).toBe(true);
  });

  it('しきい値ちょうど・超過は抑制しない', () => {
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE)).toBe(false);
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE + 1)).toBe(false);
  });

  it('しきい値は上書き可能', () => {
    expect(shouldSuppressCell(10, 5)).toBe(false);
    expect(shouldSuppressCell(3, 5)).toBe(true);
  });
});

describe('computeAggregate', () => {
  it('件数・平均・最小・最大を計算する', () => {
    const agg = computeAggregate([30, 35, 40]);
    expect(agg).toEqual({ count: 3, mean: 35, min: 30, max: 40 });
  });

  it('非有限値は除外して計算する', () => {
    const agg = computeAggregate([30, NaN, 40, Infinity]);
    expect(agg).toEqual({ count: 2, mean: 35, min: 30, max: 40 });
  });

  it('空配列・全て非有限ならnull', () => {
    expect(computeAggregate([])).toBeNull();
    expect(computeAggregate([NaN, Infinity])).toBeNull();
  });
});

describe('buildSuppressedAggregate（k-匿名性を適用した公開用集計）', () => {
  it('サンプルサイズが閾値以上なら集計結果を返す', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE }, (_, i) => 30 + i);
    const agg = buildSuppressedAggregate(values);
    expect(agg).not.toBeNull();
    expect(agg?.count).toBe(STATS_MIN_SAMPLE_SIZE);
  });

  it('サンプルサイズが閾値未満ならnull（非表示）', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE - 1 }, (_, i) => 30 + i);
    expect(buildSuppressedAggregate(values)).toBeNull();
  });

  it('空配列はnull', () => {
    expect(buildSuppressedAggregate([])).toBeNull();
  });
});

describe('buildPrefectureAggregates（ZZ-1d・/stats v2の県別分布・k-匿名性を都道府県単位でも適用）', () => {
  it('しきい値以上の県は集計結果を返す', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE }, (_, i) => 30 + i);
    const cells = buildPrefectureAggregates({ tokyo: values });
    expect(cells).toHaveLength(1);
    expect(cells[0].prefectureCode).toBe('tokyo');
    expect(cells[0].count).toBe(STATS_MIN_SAMPLE_SIZE);
    expect(cells[0].aggregate).not.toBeNull();
  });

  it('しきい値未満の県はaggregate=nullだがcountは実数を返す（存在を隠さない）', () => {
    const cells = buildPrefectureAggregates({ osaka: [40, 42, 45] });
    expect(cells[0].count).toBe(3);
    expect(cells[0].aggregate).toBeNull();
  });

  it('複数県を独立して判定する', () => {
    const sufficient = Array.from({ length: STATS_MIN_SAMPLE_SIZE }, (_, i) => 30 + i);
    const cells = buildPrefectureAggregates({ tokyo: sufficient, osaka: [40, 42] });
    const byCode = Object.fromEntries(cells.map((c) => [c.prefectureCode, c]));
    expect(byCode.tokyo.aggregate).not.toBeNull();
    expect(byCode.osaka.aggregate).toBeNull();
    expect(byCode.osaka.count).toBe(2);
  });

  it('空のマップは空配列を返す', () => {
    expect(buildPrefectureAggregates({})).toEqual([]);
  });
});

describe('buildStatsCsv（TIER N-7・CSV配布）', () => {
  it('ヘッダ行+指標数ぶんの行を出力する', () => {
    const csv = buildStatsCsv(
      [
        { metric: 'naishin', count: 40, aggregate: { count: 40, mean: 35.5, min: 20, max: 45 } },
        { metric: 'hensachi', count: 5, aggregate: null },
        { metric: 'total-score', count: 0, aggregate: null },
      ],
      '2026-07-11T00:00:00.000Z',
    );
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(4); // header + 3 metrics
    expect(lines[0]).toBe('metric,metric_label,sample_count,insufficient_data,mean,min,max,min_sample_size,generated_at');
  });

  it('サンプル不足の行はinsufficient_data=Trueでmean/min/maxが空欄', () => {
    const csv = buildStatsCsv([{ metric: 'hensachi', count: 5, aggregate: null }], '2026-07-11T00:00:00.000Z');
    const dataLine = csv.trim().split('\n')[1];
    expect(dataLine).toBe('hensachi,偏差値,5,true,,,,30,2026-07-11T00:00:00.000Z');
  });

  it('十分なサンプルの行はmean/min/maxを含む', () => {
    const csv = buildStatsCsv(
      [{ metric: 'naishin', count: 40, aggregate: { count: 40, mean: 35.5, min: 20, max: 45 } }],
      '2026-07-11T00:00:00.000Z',
    );
    const dataLine = csv.trim().split('\n')[1];
    expect(dataLine).toBe('naishin,内申点,40,false,35.50,20,45,30,2026-07-11T00:00:00.000Z');
  });
});

describe('computePercentileRank（T-1：解放機構の中身＝全国統計パーセンタイル）', () => {
  it('自分以下（同値含む）の割合を返す', () => {
    // [10,20,30,40,50] のうち target=30 以下は 10,20,30 の3件/5件=60%
    expect(computePercentileRank([10, 20, 30, 40, 50], 30)).toBe(60);
  });

  it('全員より高いなら100', () => {
    expect(computePercentileRank([10, 20, 30], 100)).toBe(100);
  });

  it('全員より低いなら0未満にはならない（自分以下0件）', () => {
    expect(computePercentileRank([10, 20, 30], 5)).toBe(0);
  });

  it('非有限値は除外して計算する', () => {
    expect(computePercentileRank([10, NaN, 20, Infinity], 10)).toBe(50);
  });

  it('空配列・非有限targetはnull', () => {
    expect(computePercentileRank([], 10)).toBeNull();
    expect(computePercentileRank([10, 20], NaN)).toBeNull();
  });
});

describe('buildSuppressedPercentile（k-匿名性を適用したパーセンタイル）', () => {
  it('サンプルサイズが閾値以上ならcount/percentileを返す', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE }, (_, i) => i + 1); // 1..30
    const result = buildSuppressedPercentile(values, 30);
    expect(result).not.toBeNull();
    expect(result?.count).toBe(STATS_MIN_SAMPLE_SIZE);
    expect(result?.percentile).toBe(100);
  });

  it('サンプルサイズが閾値未満ならnull（非表示・捏造しない）', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE - 1 }, (_, i) => i + 1);
    expect(buildSuppressedPercentile(values, 15)).toBeNull();
  });

  it('空配列はnull', () => {
    expect(buildSuppressedPercentile([], 10)).toBeNull();
  });
});

describe('isValidStatsSubmission', () => {
  it('妥当な提出データはtrue', () => {
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, maxValue: 45, prefectureCode: 'tokyo' })).toBe(true);
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 55 })).toBe(true);
  });

  it('不正な指標・数値・型は全てfalse', () => {
    expect(isValidStatsSubmission({ metric: 'unknown', value: 40 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 'not-a-number' })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: NaN })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, maxValue: 'bad' })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, prefectureCode: 123 })).toBe(false);
    expect(isValidStatsSubmission(null)).toBe(false);
    expect(isValidStatsSubmission('string')).toBe(false);
  });

  it('指標ごとの妥当域の外は拒否する(偏差値790混入事故 2026-07-19 の再発防止)', () => {
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 790 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 19.3 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 20 })).toBe(true);
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 90 })).toBe(true);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 501 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: -1 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'total-score', value: 1020, maxValue: 1020 })).toBe(true);
    expect(isValidStatsSubmission({ metric: 'total-score', value: 1101 })).toBe(false);
  });

  it('満点付きの提出は満点超えを拒否する', () => {
    expect(isValidStatsSubmission({ metric: 'naishin', value: 46, maxValue: 45 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 45, maxValue: 45 })).toBe(true);
  });
});

/**
 * DW-1（2026-08-10）の再発防止テスト。
 *
 * 事故: 本番の /api/stats/* ・/stats ・/report/2026 ・/api/mcp が
 *   「偏差値の全国平均 = 63.16」（n=263）を配信していた。偏差値は定義上、母集団平均が50。
 *   既存の isValidStatsSubmission は「1件ずつ」しか見ないため、1件ずつは妥当域(20〜90)でも
 *   集団としてあり得ない分布を素通しした。宮崎県の avgNaishin 425（満点135）を
 *   3,826件のテストが全greenのまま通したのと同じ穴。
 *
 * ここで守る契約:
 *   (1) 集計レベルの不変条件を持つ指標は、外れた集合を「公開できない」と判定する
 *   (2) 出所を検証できない指標は、件数が足りていても公開しない（fail-closed）
 *   (3) 公開できない分布から作ったパーセンタイルも公開しない
 */
describe('DW-1 公開ゲート（集計レベルの不変条件・出所検証）', () => {
  const many = (v: number, n = 60) => Array.from({ length: n }, () => v);

  describe('checkAggregateInvariants', () => {
    it('偏差値の標本平均が50±5を外れたら違反として検出する（本番で起きた 63.16 の再現）', () => {
      const violation = checkAggregateInvariants('hensachi', { count: 263, mean: 63.16, min: 20, max: 85 });
      expect(violation).not.toBeNull();
      expect(violation!.code).toBe('aggregate_invariant_violation');
      // 実測値を理由文に含めること（黙って隠さない）。
      expect(violation!.message).toContain('63.16');
    });

    it('偏差値の標本平均が50±5の中なら違反にしない', () => {
      expect(checkAggregateInvariants('hensachi', { count: 100, mean: 50, min: 20, max: 80 })).toBeNull();
      expect(checkAggregateInvariants('hensachi', { count: 100, mean: 55, min: 20, max: 80 })).toBeNull();
      expect(checkAggregateInvariants('hensachi', { count: 100, mean: 45, min: 20, max: 80 })).toBeNull();
    });

    it('境界: ちょうど±5は許容し、それを超えたら違反', () => {
      expect(checkAggregateInvariants('hensachi', { count: 100, mean: 55.0, min: 20, max: 80 })).toBeNull();
      expect(checkAggregateInvariants('hensachi', { count: 100, mean: 55.01, min: 20, max: 80 })).not.toBeNull();
    });

    it('理論上のアンカーが無い指標には不変条件を課さない（恣意的な検閲をしない）', () => {
      expect(checkAggregateInvariants('naishin', { count: 100, mean: 300, min: 0, max: 450 })).toBeNull();
      expect(checkAggregateInvariants('total-score', { count: 100, mean: 508, min: 24, max: 838 })).toBeNull();
    });
  });

  describe('buildPublishableAggregate（公開用集計の唯一の入口・fail-closed）', () => {
    it('件数がしきい値未満なら insufficient_sample で止める', () => {
      const r = buildPublishableAggregate('hensachi', many(50, 5));
      expect(r.aggregate).toBeNull();
      expect(r.count).toBe(5);
      expect(r.suppressed!.code).toBe('insufficient_sample');
    });

    it('STATS_PUBLICATION で withheld にした指標は、件数が足りていても公開しない', () => {
      // 実際の運用値ではなく、ゲートの契約そのものを検証する（運用値は別テストで確認）。
      const original = STATS_PUBLICATION.hensachi;
      try {
        STATS_PUBLICATION.hensachi = { publishable: false, withheldReason: 'テスト用の停止' };
        const r = buildPublishableAggregate('hensachi', many(50, 100));
        expect(r.aggregate).toBeNull();
        expect(r.count).toBe(100);
        expect(r.suppressed!.code).toBe('provenance_unverified');
      } finally {
        STATS_PUBLICATION.hensachi = original;
      }
    });

    it('★本番で起きた汚染データ（n=263・平均63.16相当）を公開しない', () => {
      // 20〜85の範囲で平均が63前後になる集合＝1件ずつは全て妥当域内で、
      // 既存の isValidStatsSubmission では1件も弾けない形。
      const contaminated = [...many(75, 150), ...many(45, 113)];
      const r = buildPublishableAggregate('hensachi', contaminated);
      expect(r.aggregate).toBeNull();
      expect(r.count).toBe(263);
      // Layer B を通す運用値に戻したあとも、Layer A の不変条件で必ず止まること。
      expect(r.suppressed!.code).toBe('aggregate_invariant_violation');
    });

    it('検査を通った十分な件数で、不変条件も満たす集合は公開される（＝復帰できる状態であること）', () => {
      const clean = [...many(45, 50), ...many(55, 50)]; // 平均50・n=100
      const r = buildPublishableAggregate('hensachi', clean);
      expect(r.aggregate).not.toBeNull();
      expect(r.aggregate!.mean).toBe(50);
      expect(r.suppressed).toBeNull();
    });

    it('公開可否に関わらず件数だけは返す（件数を隠すと「収集中」の表示が嘘になる）', () => {
      expect(buildPublishableAggregate('hensachi', many(50, 263)).count).toBe(263);
    });
  });

  describe('buildPublishablePercentile', () => {
    it('★公開できない分布から作ったパーセンタイルは返さない（汚染された分母で自己比較させない）', () => {
      // 本番で起きた形（平均63前後・n=263）。件数は足りているが不変条件を満たさない。
      const contaminated = [...many(75, 150), ...many(45, 113)];
      const r = buildPublishablePercentile('hensachi', contaminated, 55);
      expect(r.percentile).toBeNull();
      expect(r.suppressed!.code).toBe('aggregate_invariant_violation');
    });

    it('公開できる分布ならパーセンタイルを返す', () => {
      const clean = [...many(45, 50), ...many(55, 50)]; // 平均50・n=100
      const r = buildPublishablePercentile('hensachi', clean, 55);
      expect(r.percentile).not.toBeNull();
      expect(r.percentile!.count).toBe(100);
    });

    it('件数不足のときも返さない', () => {
      const r = buildPublishablePercentile('hensachi', many(50, 3), 55);
      expect(r.percentile).toBeNull();
      expect(r.suppressed!.code).toBe('insufficient_sample');
    });
  });

  describe('公開面がゲートを迂回していないこと（回帰の入口を塞ぐ）', () => {
    it('STATS_PUBLICATION は全 StatsMetric を網羅する（指標を足したら公開可否の明示が必須）', () => {
      for (const metric of STATS_METRICS) {
        expect(STATS_PUBLICATION[metric]).toBeDefined();
        expect(typeof STATS_PUBLICATION[metric].publishable).toBe('boolean');
      }
    });

    it('publishable:false の指標には必ず理由文が付く（黙って隠さない）', () => {
      for (const metric of STATS_METRICS) {
        if (!STATS_PUBLICATION[metric].publishable) {
          expect(STATS_PUBLICATION[metric].withheldReason).toBeTruthy();
        }
      }
    });

    it('偏差値には集計レベルの不変条件が必ず設定されている（DW-1の再発防止線を外させない）', () => {
      const inv = STATS_AGGREGATE_INVARIANTS.hensachi;
      expect(inv).toBeDefined();
      expect(inv!.meanCenter).toBe(50);
      // 許容幅を広げすぎると事故値63.16を通してしまう。13以上に緩めたらこのテストが落ちる。
      expect(inv!.meanTolerance).toBeLessThan(13);
    });
  });
});
