import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, TrendingDown } from '@/components/icons';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { verifyInviteToken, listJukuStudents, getStudentSnapshots, type SnapshotMetric } from '@/lib/juku-saas-db';
import { buildStudentTrend, computeDeclineAlerts } from '@/lib/juku-student-progress';
import { PrintButton } from '@/components/PrintButton';

/**
 * 生徒別の印刷用帳票（Λ-8・build-not-launch）。塾内で保護者面談に持っていける
 * 紙の資料を想定（/pref/[code]のA4印刷パターンを踏襲）。
 *
 * 招待トークン(?token=)で塾アカウントを判定した上で、studentIdがその塾アカウントに
 * 属する生徒かをlistJukuStudents(account.id)の結果と突合して確認する
 * （テナント分離＝他塾のstudentIdを推測しても閲覧できない設計）。
 */
export const metadata: Metadata = {
  title: '生徒別帳票（塾ダッシュボードβ）| My Naishin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const METRIC_LABEL: Record<SnapshotMetric, string> = {
  naishin: '内申点',
  hensachi: '偏差値',
  'total-score': '総合得点',
};
const METRICS: SnapshotMetric[] = ['naishin', 'hensachi', 'total-score'];

function Gate() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">招待トークンが必要です</h1>
      <p className="mt-3 text-base leading-[1.8] text-slate-900">
        このページは招待された塾専用です。<code>?token=</code>と<code>studentId</code>を指定してアクセスしてください。
      </p>
    </div>
  );
}

export default async function JukuStudentReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    notFound();
  }

  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;
  const studentIdRaw = typeof sp.studentId === 'string' ? sp.studentId : undefined;
  const account = token ? await verifyInviteToken(token) : null;
  if (!account || !token || !studentIdRaw) {
    return <Gate />;
  }

  const studentId = Number(studentIdRaw);
  const students = await listJukuStudents(account.id);
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    notFound();
  }

  const snapshots = await getStudentSnapshots(student.id);
  const trend = buildStudentTrend(snapshots);
  const alerts = computeDeclineAlerts(trend);
  const alertMetrics = new Set(alerts.map((a) => a.metric));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <nav className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/juku/dashboard?token=${encodeURIComponent(token)}`}
            className="inline-flex min-h-[44px] items-center gap-1 text-sm text-slate-600 hover:text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードへ戻る
          </Link>
          <PrintButton />
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">{student.displayName} さんの成績帳票</h1>
          <p className="mt-1 text-sm text-slate-600">
            {account.name}
            {student.prefectureCode ? ` ・ 志望県: ${student.prefectureCode}` : ''}
          </p>
        </header>

        <div className="space-y-6">
          {METRICS.map((metric) => {
            const points = trend[metric];
            return (
              <section key={metric} className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="mb-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-900">
                  {METRIC_LABEL[metric]}の推移
                  {alertMetrics.has(metric) && (
                    <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-bold text-red-800">
                      <TrendingDown className="h-4 w-4" />
                      直近低下
                    </span>
                  )}
                </h2>
                {points.length === 0 ? (
                  <p className="text-sm text-slate-600">記録がありません。</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                          <th className="py-2 pr-4">記録日</th>
                          <th className="py-2 pr-4 text-right">値</th>
                          <th className="py-2 text-right">割合</th>
                        </tr>
                      </thead>
                      <tbody>
                        {points.map((p, i) => (
                          <tr key={i} className="border-b border-slate-200">
                            <td className="py-2 pr-4 text-slate-900">{p.recordedAt}</td>
                            <td className="py-2 pr-4 text-right font-bold tabular-nums text-slate-900">
                              {p.value}
                              {p.maxValue !== null ? `/${p.maxValue}` : ''}
                            </td>
                            <td className="py-2 text-right tabular-nums text-slate-900">{p.percent !== null ? `${p.percent}%` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}

          <p className="hidden text-xs text-slate-600 print:block">
            出典: My Naishin 塾ダッシュボード（{account.name}）
          </p>
        </div>
      </div>
    </div>
  );
}
