import { GraduationCap, TrendingDown, Sparkles } from 'lucide-react';

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
}

export function DashboardView({ jukuName, studentViews, isDemo }: DashboardViewProps) {
  const totalAlerts = studentViews.reduce((sum, v) => sum + v.alerts.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {isDemo && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
            <Sparkles className="h-4 w-4" />
            これはデモデータです（架空の生徒・実在の教育委員会一次データに基づく計算エンジンで算出）
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{jukuName} 生徒ダッシュボード</h1>
              <p className="mt-0.5 text-xs text-slate-500">
                生徒{studentViews.length}人・低下アラート
                <span className={totalAlerts > 0 ? 'font-bold text-rose-600' : ''}> {totalAlerts}件</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {studentViews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
              まだ生徒が登録されていません。CSV一括取込で追加してください。
            </div>
          ) : (
            <div className="space-y-3">
              {studentViews.map(({ id, displayName, trend, alerts }) => {
                const alertMetrics = new Set(alerts.map((a) => a.metric));
                return (
                  <div key={id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{displayName}</span>
                      {alerts.length > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
                          <TrendingDown className="h-3 w-3" />
                          {alerts.length}件低下
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      {METRICS.map((metric) => {
                        const points = trend[metric];
                        const latest = points[points.length - 1];
                        const delta = latestTrendDelta(points);
                        const isDeclining = alertMetrics.has(metric);
                        return (
                          <div
                            key={metric}
                            className={`rounded-lg p-2 ${isDeclining ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'}`}
                          >
                            <div className="text-slate-400">{METRIC_LABEL[metric]}</div>
                            {latest ? (
                              <div className="font-bold text-slate-800">
                                {latest.value}
                                {latest.maxValue !== null ? `/${latest.maxValue}` : ''}
                                {delta !== null && (
                                  <span className={delta < 0 ? 'ml-1 text-rose-600' : 'ml-1 text-emerald-600'}>
                                    {delta >= 0 ? '+' : ''}
                                    {delta}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-slate-300">記録なし</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
