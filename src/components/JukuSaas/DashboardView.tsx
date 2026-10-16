import Link from 'next/link';
import { TrendingDown, Info, Calculator, FileText } from '@/components/icons';

import type { SnapshotMetric } from '@/lib/juku-saas-db';
import { latestTrendDelta, type StudentTrendByMetric, type DeclineAlert } from '@/lib/juku-student-progress';

/**
 * 塾ダッシュボードの表示コンポーネント（ZZ-4d本体から抽出・ZZ-4eでデモ環境と共有するため分離）。
 * D1接続の有無（本番の招待トークン経由 or デモの静的シード）を一切知らない純粋な表示専用コンポーネント。
 */

const METRIC_LABEL: Record<SnapshotMetric, string> = {
  naishin: '内申点',
  hensachi: '偏差値',
  'total-score': '総合得点',
};
const METRICS: SnapshotMetric[] = ['naishin', 'hensachi', 'total-score'];

export interface DashboardStudentView {
  id: number | string;
  displayName: string;
  trend: StudentTrendByMetric;
  alerts: DeclineAlert[];
}

export interface DashboardViewProps {
  jukuName: string;
  studentViews: DashboardStudentView[];
  /** デモ環境(ZZ-4e)であることを示すバナーを表示する。 */
  isDemo?: boolean;
  /** 内申点シミュレーターへのリンク(Λ-8・招待トークン込みのURL)。無ければボタンを表示しない。 */
  simulatorHref?: string;
  /** 生徒別の帳票ページへのリンクを生成する関数(Λ-8・招待トークン込み)。無ければリンクを表示しない。 */
  reportHrefForStudent?: (studentId: number | string) => string;
}

export function DashboardView({ jukuName, studentViews, isDemo, simulatorHref, reportHrefForStudent }: DashboardViewProps) {
  const totalAlerts = studentViews.reduce((sum, v) => sum + v.alerts.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {isDemo && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm font-bold leading-[1.8] text-slate-900">
            <Info className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
            これはデモデータです（架空の生徒・実在の教育委員会一次データに基づく計算エンジンで算出）
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">{jukuName} 生徒ダッシュボード</h1>
            <p className="mt-1 text-sm text-slate-600">
              生徒{studentViews.length}人・低下アラート
              <span className={totalAlerts > 0 ? 'font-bold text-red-800' : ''}> {totalAlerts}件</span>
            </p>
          </div>
          {simulatorHref && (
            <Link
              href={simulatorHref}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-4 py-2 text-sm font-bold text-white hover:bg-brand-800"
            >
              <Calculator className="h-4 w-4" />
              内申点シミュレーター
            </Link>
          )}
        </div>

        <div className="mt-8">
          {studentViews.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              まだ生徒が登録されていません。CSV一括取込で追加してください。
            </div>
          ) : (
            <div className="space-y-4">
              {studentViews.map(({ id, displayName, trend, alerts }) => {
                const alertMetrics = new Set(alerts.map((a) => a.metric));
                return (
                  <div key={id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{displayName}</span>
                      <div className="flex items-center gap-3">
                        {alerts.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-bold text-red-800">
                            <TrendingDown className="h-4 w-4" />
                            {alerts.length}件低下
                          </span>
                        )}
                        {reportHrefForStudent && (
                          <Link
                            href={reportHrefForStudent(id)}
                            className="inline-flex min-h-[44px] items-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
                          >
                            <FileText className="h-4 w-4" />
                            帳票
                          </Link>
                        )}
                      </div>
                    </div>
                    <dl className="mt-2 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
                      {METRICS.map((metric) => {
                        const points = trend[metric];
                        const latest = points[points.length - 1];
                        const delta = latestTrendDelta(points);
                        const isDeclining = alertMetrics.has(metric);
                        return (
                          <div key={metric} className={`px-3 py-2 ${isDeclining ? 'bg-red-50' : ''}`}>
                            <dt className="text-xs text-slate-600">
                              {METRIC_LABEL[metric]}
                              {isDeclining && <span className="ml-1 font-bold text-red-800">低下</span>}
                            </dt>
                            {latest ? (
                              <dd className="flex flex-wrap items-baseline gap-x-1 font-bold tabular-nums text-slate-900">
                                {latest.value}
                                {latest.maxValue !== null ? `/${latest.maxValue}` : ''}
                                {delta !== null && (
                                  <span className={delta < 0 ? 'text-red-800' : 'text-brand-700'}>
                                    {delta >= 0 ? '+' : ''}
                                    {delta}
                                  </span>
                                )}
                              </dd>
                            ) : (
                              <dd className="text-slate-600">記録なし</dd>
                            )}
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
