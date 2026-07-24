import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { buildDemoStudentViews, DEMO_JUKU_NAME } from '@/lib/juku-saas/demo-seed';
import { DashboardView } from '@/components/JukuSaas/DashboardView';

/**
 * 塾ダッシュボード・デモ環境（ZZ-4e・build-not-launch）。
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED='1'（既定off）のときだけ公開する（旗off時はnotFound()）。
 * D1接続・招待トークンを一切必要としない（demo-seed.tsの決定論的シードデータのみで完動）。
 * B2B商談での「デモできる実物」提示と、CI Playwrightのスクリーンショット素材化に使う。
 */
export const metadata: Metadata = {
  title: '塾ダッシュボード デモ | My Naishin',
  robots: { index: false, follow: false },
};

export default function JukuDashboardDemoPage() {
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    notFound();
  }

  const studentViews = buildDemoStudentViews();
  return <DashboardView jukuName={DEMO_JUKU_NAME} studentViews={studentViews} isDemo />;
}
