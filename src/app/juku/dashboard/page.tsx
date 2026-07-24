import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GraduationCap, TrendingDown } from 'lucide-react';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { verifyInviteToken, listJukuStudents, getStudentSnapshots, type SnapshotMetric } from '@/lib/juku-saas-db';
import { buildStudentTrend, computeDeclineAlerts, latestTrendDelta } from '@/lib/juku-student-progress';

/**
 * 塾ダッシュボード（ZZ-4d・build-not-launch）。
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED='1'（既定off）のときだけ公開する（旗off時はnotFound()）。
 * 招待トークン（?token=）で塾アカウントを一意に判定する（ZZ-4aのverifyInviteToken・
 * admin/reportのADMIN_REPORT_TOKENと同じ思想だがテナントごとにトークンが異なる多テナント版）。
 * 生徒一覧・成績推移・評定低下アラートはいずれも既存エンジン（ZZ-4c）の結果をそのまま表示するのみ。
 */
export const metadata: Metadata = {
  title: '塾ダッシュボード（β）| My Naishin',
  robots: { index: false, follow: false },
};

// 認証（招待トークン）＋D1読み取りのため毎回サーバーで評価する。
export const dynamic = 'force-dynamic';

const METRIC_LABEL: Record<SnapshotMetric, string> = {
  naishin: '内申点',
  hensachi: '偏差値',
  'total-score': '総合得点',
};
const METRICS: SnapshotMetric[] = ['naishin', 'hensachi', 'total-score'];

function Gate() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold text-slate-800">招待トークンが必要です</h1>
      <p className="mt-2 text-sm text-slate-500">
        このページは招待された塾専用です。<code>?token=</code> に正しい招待トークンを付けてアクセスしてください。
      </p>
    </div>
  );
}

export default async function JukuDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    notFound();
  }

  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;
  const account = token ? await verifyInviteToken(token) : null;
  if (!account) {
    return <Gate />;
  }

  const students = await listJukuStudents(account.id);
  const studentViews = await Promise.all(
    students.map(async (student) => {
      const snapshots = await getStudentSnapshots(student.id);
      const trend = buildStudentTrend(snapshots);
      const alerts = computeDeclineAlerts(trend);
      return { student, trend, alerts };
    })
  );
  const totalAlerts = studentViews.reduce((sum, v) => sum + v.alerts.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{account.name} 生徒ダッシュボード</h1>
              <p className="mt-0.5 text-xs text-slate-500">
                生徒{students.length}人・低下アラート
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
              {studentViews.map(({ student, trend, alerts }) => {
                const alertMetrics = new Set(alerts.map((a) => a.metric));
                return (
                  <div key={student.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{student.displayName}</span>
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
