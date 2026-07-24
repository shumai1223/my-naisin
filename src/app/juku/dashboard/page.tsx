import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { verifyInviteToken, listJukuStudents, getStudentSnapshots } from '@/lib/juku-saas-db';
import { buildStudentTrend, computeDeclineAlerts } from '@/lib/juku-student-progress';
import { DashboardView } from '@/components/JukuSaas/DashboardView';

/**
 * 塾ダッシュボード（ZZ-4d・build-not-launch）。
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED='1'（既定off）のときだけ公開する（旗off時はnotFound()）。
 * 招待トークン（?token=）で塾アカウントを一意に判定する（ZZ-4aのverifyInviteToken・
 * admin/reportのADMIN_REPORT_TOKENと同じ思想だがテナントごとにトークンが異なる多テナント版）。
 * 生徒一覧・成績推移・評定低下アラートはいずれも既存エンジン（ZZ-4c）の結果をそのまま表示するのみ。
 * 表示自体はDashboardView（ZZ-4eでデモ環境と共有するため抽出済み）に委譲する。
 */
export const metadata: Metadata = {
  title: '塾ダッシュボード（β）| My Naishin',
  robots: { index: false, follow: false },
};

// 認証（招待トークン）＋D1読み取りのため毎回サーバーで評価する。
export const dynamic = 'force-dynamic';

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
      return { id: student.id, displayName: student.displayName, trend, alerts };
    })
  );

  return <DashboardView jukuName={account.name} studentViews={studentViews} />;
}
