import type { Metadata } from 'next';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { parseWorklogEntries, type WorklogDataEntry } from '@/lib/worklog-viewer';
import worklogDataRaw from '@/generated/worklog-data.json';

/**
 * worklogビューア（管理・認証付き・I-6）。
 *
 * 無人ループ（/loop）の作業ログ（docs/worklog/*.md）を、通勤中でもスマホからトークンURLで
 * 読めるようにする（本人要望）。docs/worklog/*.mdの生ファイルはWorkersランタイムに存在しない
 * ため、内容はビルド時にnext.config.mjsが焼き込んだ src/generated/worklog-data.json を
 * 通常のstatic importで読むだけ＝fsを一切使わない（worklog-viewer.tsのコメント参照）。
 *
 * 認証：admin/report と同じ ?token=＜ADMIN_REPORT_TOKEN＞ パターン（src/lib/admin-auth.ts共有）。
 * push→Cloudflare自動デプロイのたびにworklog-data.jsonが最新化される＝常に最新の日誌が読める。
 */

export const metadata: Metadata = {
  title: 'worklogビューア（管理）| My Naishin',
  robots: { index: false, follow: false },
};

// 認証チェックのため毎回サーバーで評価する（データ自体はビルド時に焼き込み済みでfsは使わない）。
export const dynamic = 'force-dynamic';

function Gate() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-lg font-bold text-slate-800">認証が必要です</h1>
      <p className="mt-2 text-sm text-slate-500">
        このページは管理用です。<code>?token=</code> に正しいトークンを付けてアクセスしてください。
      </p>
    </div>
  );
}

export default async function AdminWorklogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;

  if (!(await isAuthorizedAdminToken(token))) {
    return <Gate />;
  }

  const days = parseWorklogEntries(worklogDataRaw as WorklogDataEntry[]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-black text-slate-900">worklogビューア</h1>
      <p className="mt-1 text-xs text-slate-400">
        docs/worklog/*.md（無人ループの作業ログ）・最新日降順・{days.length}日分。
      </p>

      {days.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">worklogがまだありません。</p>
      ) : (
        <div className="mt-6 space-y-6">
          {days.map((day) => (
            <section key={day.date} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                {day.title}
              </h2>
              <ul className="divide-y divide-slate-50">
                {day.lines.map((line, i) => (
                  <li key={i} className="flex gap-3 px-4 py-2 text-sm">
                    {line.time && (
                      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-400">{line.time}</span>
                    )}
                    <span className="whitespace-pre-wrap break-words text-slate-700">{line.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
