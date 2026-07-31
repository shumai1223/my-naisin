import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { verifyInviteToken } from '@/lib/juku-saas-db';
import { NaishinSimulator } from '@/components/JukuSaas/NaishinSimulator';

/**
 * 塾ダッシュボードの内申点シミュレーター画面（Λ-8・build-not-launch）。
 * dashboard/page.tsxと同じ招待トークン認証(?token=)・旗(NEXT_PUBLIC_JUKU_SAAS_ENABLED)を共有する。
 * 生徒の保存済みスナップショットとは独立した「今すぐ試す」用の一時計算のみ（D1書き込みなし）。
 */
export const metadata: Metadata = {
  title: '内申点シミュレーター（塾ダッシュボードβ）| My Naishin',
  robots: { index: false, follow: false },
};

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

export default async function JukuNaishinSimulatorPage({
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
  if (!account || !token) {
    return <Gate />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href={`/juku/dashboard?token=${encodeURIComponent(token)}`}
          className="mb-4 flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          ダッシュボードへ戻る
        </Link>
        <h1 className="text-xl font-black text-slate-900">{account.name} 内申点シミュレーター</h1>
        <p className="mt-1 text-xs text-slate-500">
          9教科の評定を入力し、志望県を切り替えて内申点を比較できます（この画面の計算は保存されません）。
        </p>
        <div className="mt-6">
          <NaishinSimulator />
        </div>
      </div>
    </div>
  );
}
