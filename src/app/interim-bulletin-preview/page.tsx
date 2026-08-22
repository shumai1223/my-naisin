import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isInterimBulletinPreviewEnabled } from '@/lib/interim-bulletin/flag';
import { ingestInterimBulletin, InterimRateSubmission } from '@/lib/interim-rate-ingest';
import { INTERIM_BULLETIN_REGISTRY } from '@/data/interim-rate-bulletin-registry';

/**
 * Y-11（冬の倍率速報体制）速報面の内部プレビュー（build-not-launch）。
 * NEXT_PUBLIC_INTERIM_BULLETIN_ENABLED='1'（既定off）のときだけ公開する内部確認用ページ。
 * 実際のライブ速報データはまだ存在しない（出願シーズンにならないと取得できない）ため、
 * 表示するのは完全に架空の学校名・数値によるサンプルデータのみ（Y-0憲法「捏造ゼロ」——
 * 実在校のデータとして誤認され得るものは一切使わない）。ナビゲーション・サイトマップ・
 * page-registry等からは意図的にリンクしない（内部プレビューのため）。
 */
export const metadata: Metadata = {
  title: '速報面プレビュー（内部確認用・サンプルデータ） | My Naishin',
  description: 'Y-11 冬の倍率速報体制の表示イメージを示す内部確認用プレビュー（サンプルデータのみ・非公開）。',
  robots: { index: false, follow: false },
};

// 架空の学校名によるサンプル入力（interimIncludesRate:trueの県=chibaを想定）。
const SAMPLE_SUBMISSIONS_RATE_SHOWN: InterimRateSubmission[] = [
  { schoolName: 'サンプル第一高等学校', department: '普通科', quota: 200, interimApplicants: 230, interimRate: 1.15, observedAt: '2027-02-05' },
  { schoolName: 'サンプル第二高等学校', department: '理数科', quota: 40, interimApplicants: 52, interimRate: 1.3, observedAt: '2027-02-05' },
];

// 架空の学校名によるサンプル入力（interimIncludesRate:falseの県=kumamotoを想定・倍率は非公表のため渡さない）。
const SAMPLE_SUBMISSIONS_RATE_HIDDEN: InterimRateSubmission[] = [
  { schoolName: 'サンプル南高等学校', department: '普通科', quota: 160, interimApplicants: 175, observedAt: '2027-02-05' },
];

export default function InterimBulletinPreviewPage() {
  if (!isInterimBulletinPreviewEnabled(process.env.NEXT_PUBLIC_INTERIM_BULLETIN_ENABLED)) {
    notFound();
  }

  const rateShown = ingestInterimBulletin('chiba', SAMPLE_SUBMISSIONS_RATE_SHOWN, INTERIM_BULLETIN_REGISTRY);
  const rateHidden = ingestInterimBulletin('kumamoto', SAMPLE_SUBMISSIONS_RATE_HIDDEN, INTERIM_BULLETIN_REGISTRY);
  const rows = [...(rateShown ?? []), ...(rateHidden ?? [])];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">速報面プレビュー（内部確認用）</h1>
          <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
            ⚠️ このページに表示されているデータは<strong>すべて架空のサンプル</strong>です。実在の学校・数値ではありません。
            実際のライブ速報データが取得できるようになるまでの表示イメージ確認用（非公開・noindex）です。
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2">学校名（サンプル）</th>
                <th className="px-3 py-2">学科</th>
                <th className="px-3 py-2">募集人員</th>
                <th className="px-3 py-2">速報出願者数</th>
                <th className="px-3 py-2">速報倍率</th>
                <th className="px-3 py-2">状態</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-3 py-2">{r.schoolName}</td>
                  <td className="px-3 py-2">{r.department}</td>
                  <td className="px-3 py-2">{r.quota}</td>
                  <td className="px-3 py-2">{r.interimApplicants}</td>
                  <td className="px-3 py-2">{r.interimRate !== null ? r.interimRate.toFixed(2) : '非公表（未確定・参考値のみ）'}</td>
                  <td className="px-3 py-2 text-xs text-amber-700">{r.status === 'preliminary' ? '未確定・参考値' : r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="mt-4 text-xs text-slate-500">
          `interimIncludesRate: false`の都道府県（例: 熊本）では、速報段階では出願者数のみが公表され倍率は非公表のため、
          このプレビューでも倍率欄を独自計算せず「非公表」と表示している（`src/lib/interim-rate-ingest.ts`の設計どおり）。
        </p>
      </div>
    </div>
  );
}
