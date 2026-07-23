/**
 * 匿名統計（stats_submissions）の分布監査（ZZ-1e・週次バッチ・インライン処理にしない）。
 *
 * docs/zz-specs/zz1-quality-engine-spec.md §3を、実際に本番稼働している既存スキーマ
 * （stats_submissions: metric/prefecture_code/value/max_value/created_at。fp_hash/ip_bucket/
 * quarantineは持たない）に合わせて適用する。スパム自動除外は行わない（quarantineフラグが
 * 存在しないスキーマのため）。本モジュールは「報告のみ」——分布ドリフト・バーストは
 * 自動処理せず、worklog/週次レポートに検知結果を出すだけに留める（仕様書§3の
 * 「本物の制度変更・季節要因の可能性があるため自動処理しない」原則を踏襲）。
 *
 * 純粋関数のみ（D1非依存）。実データはscripts/stats-distribution-audit.tsが
 * wranglerエクスポートJSON（backup-d1.tsと同じ方式）から読み込んで渡す。
 */
import { STATS_VALUE_LIMITS, type StatsMetric } from '@/lib/stats-aggregation';

export interface StatsSubmissionRecord {
  metric: StatsMetric;
  prefecture_code?: string | null;
  value: number;
  max_value?: number | null;
  created_at: string;
}

/** created_at（ISO文字列や 'YYYY-MM-DD HH:MM:SS' 等）から日付部分（YYYY-MM-DD）だけを取り出す。 */
export function dateOnly(createdAt: string): string {
  return createdAt.slice(0, 10);
}

export interface DailyCount {
  date: string;
  count: number;
}

/** レコード群を日付別の件数に集計する（日付昇順）。 */
export function groupCountsByDate(records: StatsSubmissionRecord[]): DailyCount[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const d = dateOnly(r.created_at);
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
}

export interface BurstFinding extends DailyCount {
  baselineMean: number;
  baselineStdDev: number;
  /** 標準偏差0（全日同数等）でNaNを避けるためのz。baselineの日数が足りない場合はnull。 */
  z: number | null;
  flagged: boolean;
}

/**
 * 日別件数から異常なバースト（急増）日を検知する（仕様書§3のz>4基準を踏襲）。
 * 各日について、直前baselineWindowDays日間（その日自身は含まない）の平均・標準偏差を
 * ベースラインとし、当日件数のzスコアを計算する。ベースライン日数が不足する先頭の日は
 * 判定不能（z=null・flagged=false）として誤検知を避ける。
 */
export function detectBurstDays(
  dailyCounts: DailyCount[],
  options: { baselineWindowDays?: number; zThreshold?: number; minBaselineDays?: number } = {}
): BurstFinding[] {
  const baselineWindowDays = options.baselineWindowDays ?? 28;
  const zThreshold = options.zThreshold ?? 4;
  const minBaselineDays = options.minBaselineDays ?? 7;

  return dailyCounts.map((entry, i) => {
    const windowStart = Math.max(0, i - baselineWindowDays);
    const baseline = dailyCounts.slice(windowStart, i).map((d) => d.count);
    if (baseline.length < minBaselineDays) {
      return { ...entry, baselineMean: 0, baselineStdDev: 0, z: null, flagged: false };
    }
    const mean = baseline.reduce((s, v) => s + v, 0) / baseline.length;
    const variance = baseline.reduce((s, v) => s + (v - mean) ** 2, 0) / baseline.length;
    const stdDev = Math.sqrt(variance);
    let z: number | null;
    if (stdDev === 0) {
      // ベースラインが完全に横ばい（分散0）の場合、平均と異なる件数が出た時点で異常とみなす。
      z = entry.count === mean ? 0 : entry.count > mean ? Infinity : -Infinity;
    } else {
      z = (entry.count - mean) / stdDev;
    }
    const flagged = z !== null && Number.isFinite(z) ? z > zThreshold : z === Infinity;
    return { ...entry, baselineMean: mean, baselineStdDev: stdDev, z: z === Infinity || z === -Infinity ? null : z, flagged };
  });
}

export interface ExtremeValueFinding {
  metric: StatsMetric;
  count: number;
  /** 指標の理論上限（STATS_VALUE_LIMITS.max）ちょうどの提出が占める割合（0-1）。 */
  atCeilingShare: number;
  /** 指標の理論下限（STATS_VALUE_LIMITS.min）ちょうどの提出が占める割合（0-1）。 */
  atFloorShare: number;
  flagged: boolean;
}

/**
 * 指標の理論上限・下限ちょうどの値が不自然に集中していないかを監視する
 * （仕様書§3「オール5/オール1率の監視」を、9教科スコアでなく単一value+理論値域の
 * 現行スキーマに適用した版。実在する層なので自動除外はせず監視のみ・報告に留める）。
 * n(count)が小さいと偶然の偏りをflagged扱いしてしまうため、minSample未満は判定しない。
 */
export function detectExtremeValueShare(
  metric: StatsMetric,
  values: number[],
  options: { shareThreshold?: number; minSample?: number } = {}
): ExtremeValueFinding {
  const shareThreshold = options.shareThreshold ?? 0.5;
  const minSample = options.minSample ?? 20;
  const { min, max } = STATS_VALUE_LIMITS[metric];
  const count = values.length;
  const atCeiling = values.filter((v) => v === max).length;
  const atFloor = values.filter((v) => v === min).length;
  const atCeilingShare = count > 0 ? atCeiling / count : 0;
  const atFloorShare = count > 0 ? atFloor / count : 0;
  const flagged = count >= minSample && (atCeilingShare > shareThreshold || atFloorShare > shareThreshold);
  return { metric, count, atCeilingShare, atFloorShare, flagged };
}

export interface DistributionAuditReport {
  generatedAt: string;
  totalRecords: number;
  burstFindings: BurstFinding[];
  extremeValueFindings: ExtremeValueFinding[];
  hasFlags: boolean;
}

/**
 * 分布監査のオーケストレーション（純粋関数）。全指標横断でバースト検知＋極値監視を行い、
 * 1件のレポートオブジェクトにまとめる（scripts側がworklog/コンソール出力に整形する）。
 */
export function runDistributionAudit(
  records: StatsSubmissionRecord[],
  metrics: readonly StatsMetric[],
  generatedAtIso: string = new Date().toISOString()
): DistributionAuditReport {
  const dailyCounts = groupCountsByDate(records);
  const burstFindings = detectBurstDays(dailyCounts).filter((f) => f.flagged);

  const extremeValueFindings = metrics.map((metric) => {
    const values = records.filter((r) => r.metric === metric).map((r) => r.value);
    return detectExtremeValueShare(metric, values);
  });

  return {
    generatedAt: generatedAtIso,
    totalRecords: records.length,
    burstFindings,
    extremeValueFindings,
    hasFlags: burstFindings.length > 0 || extremeValueFindings.some((f) => f.flagged),
  };
}

/** レポートを人間可読な日本語テキストに整形する（worklog/コンソール出力向け）。 */
export function formatDistributionAuditReport(report: DistributionAuditReport): string {
  const lines: string[] = [];
  lines.push(`■ 統計分布監査（ZZ-1e）  ${report.generatedAt}`);
  lines.push(`  総レコード数: ${report.totalRecords.toLocaleString('ja-JP')}件`);
  lines.push('');
  lines.push(`■ バースト検知（過去28日ベースライン比・z>4）`);
  if (report.burstFindings.length === 0) {
    lines.push('  ✅ 異常な急増日は検知されませんでした。');
  } else {
    for (const f of report.burstFindings) {
      lines.push(`  🚨 ${f.date}: ${f.count}件（ベースライン平均${f.baselineMean.toFixed(1)}件・z=${f.z === null ? '算出不能(分散0)' : f.z.toFixed(1)}）`);
    }
  }
  lines.push('');
  lines.push('■ 極値集中の監視（理論上限・下限ちょうどの値の割合）');
  for (const f of report.extremeValueFindings) {
    const icon = f.flagged ? '🚨' : f.count === 0 ? '⚪' : '✅';
    lines.push(
      `  ${icon} ${f.metric}: n=${f.count}件・上限一致${(f.atCeilingShare * 100).toFixed(1)}%・下限一致${(f.atFloorShare * 100).toFixed(1)}%`
    );
  }
  lines.push('');
  lines.push(
    report.hasFlags
      ? '⚠️ 自動除外は行っていません（quarantineフラグ非対応スキーマのため）。上記の検知結果は報告のみ・判断は👤が行ってください。'
      : '✅ 今回の監査で自動処理が必要な異常は検知されませんでした。'
  );
  return lines.join('\n');
}
