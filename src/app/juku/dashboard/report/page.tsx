import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

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
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold text-slate-800">招待トークンが必要です</h1>
      <p className="mt-2 text-sm text-slate-500">
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <nav className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/juku/dashboard?token=${encodeURIComponent(token)}`}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            ダッシュボードへ戻る
          </Link>
          <PrintButton />
        </nav>

        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg print:hidden">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{student.displayName} さんの成績帳票</h1>
            <p className="mt-1 text-sm text-slate-500">
              {account.name}
              {student.prefectureCode ? ` ・ 志望県: ${student.prefectureCode}` : ''}
            </p>
          </div>
        </header>

        <div className="space-y-6">
          {METRICS.map((metric) => {
            const points = trend[metric];
            return (
              <section key={metric} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                  {METRIC_LABEL[metric]}の推移
                  {alertMetrics.has(metric) && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">直近低下</span>
                  )}
                </h2>
                {points.length === 0 ? (
                  <p className="text-sm text-slate-400">記録がありません。</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-2 pr-4">記録日</th>
                          <th className="py-2 pr-4 text-right">値</th>
                          <th className="py-2 text-right">割合</th>
                        </tr>
                      </thead>
                      <tbody>
                        {points.map((p, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="py-2 pr-4 text-slate-600">{p.recordedAt}</td>
                            <td className="py-2 pr-4 text-right font-semibold text-slate-700">
                              {p.value}
                              {p.maxValue !== null ? `/${p.maxValue}` : ''}
                            </td>
                            <td className="py-2 text-right text-slate-600">{p.percent !== null ? `${p.percent}%` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}

          <p className="hidden text-xs text-slate-500 print:block">
            出典: My Naishin 塾ダッシュボード（{account.name}）
          </p>
        </div>
      </div>
    </div>
  );
}
