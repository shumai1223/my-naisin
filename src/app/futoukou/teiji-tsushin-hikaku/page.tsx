import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ArrowLeft, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { getAlternativeTrackNationalSummary } from '@/lib/teiji-tsushin-options';
import { getPrefectureByCode } from '@/lib/prefectures';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * T-P1 P1-5（第1期・ステージング）: 「47都道府県の制度差を公表データで並べられる」という、
 * このクラスタで唯一競合が持っていない差別化ポイントをハブ化したページ。
 *
 * `/futoukou`（不登校と内申点・既存の指名ページ）から内部リンクするための着地点。
 * 個々の学校名・倍率は`src/data/teiji-competition-rates/`の公表値そのまま、都道府県ごとの
 * 件数・平均倍率は本サイトの単純集計であることを明記する（naishin-kakusaと同じ扱い）。
 *
 * 🔴 T-P1第1期の裁定により本番反映（検索エンジンへの公開）は👤が9/23以降に決める。
 * このページは収益化CTAを一切置かず、robots noindexかつsitemap未登録のステージング状態。
 */

const BASE = SITE_URL;

export const metadata: Metadata = {
  title: '都道府県別 定時制・通信制の入試倍率比較（公表データ）| My Naishin',
  description:
    '各都道府県教育委員会が公表している、公立高校の定時制・通信制課程の募集人員・出願者数・倍率を都道府県別に比較。独自の推定は行わず、公表資料の数値をそのまま集計しています。',
  alternates: { canonical: `${BASE}/futoukou/teiji-tsushin-hikaku` },
  // T-P1第1期の裁定「本番反映（公開）は👤が9/23以降に決める」により、ビルドはするが
  // 検索エンジンには意図的に見せない（/[prefecture]/teiji-tsushinと同じ扱い・2026-09-06）。
  robots: { index: false, follow: false },
};

export default function TeijiTsushinHikakuPage() {
  const summary = getAlternativeTrackNationalSummary();
  const url = `${BASE}/futoukou/teiji-tsushin-hikaku`;
  const rows = [...summary.rows].sort((a, b) => b.schoolCount - a.schoolCount);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: '不登校と内申点', url: `${BASE}/futoukou` },
          { name: '定時制・通信制の倍率比較', url },
        ]}
      />
      <DatasetSchema
        name="都道府県別 定時制・通信制 入試倍率データ"
        description="公立高校の定時制・通信制課程について、都道府県教育委員会が公表した募集人員・出願者数・倍率を都道府県別に集計したデータ。"
        url={url}
        variableMeasured={['募集人員', '出願者数', '倍率']}
        dateModified="2026-09-06"
        keywords={['定時制', '通信制', '倍率', '都道府県別', '公立高校入試']}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/futoukou" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              不登校と内申点
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">定時制・通信制の倍率比較</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              定時制・通信制の入試倍率を都道府県で比較する
            </h1>
            {/* 更新日は上のDatasetSchemaのdateModifiedと同じ値に揃える */}
            <p className="mt-2 text-sm text-slate-600">
              出典：各都道府県教育委員会の公表資料（本サイトで集計） ／ 2026年9月6日更新
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              各都道府県教育委員会が公表している、公立高校の定時制・通信制課程の募集人員・出願者数・倍率を、
              都道府県別にそのまま集計しました。「どの県を選ぶべきか」を示すものではなく、
              公表されている制度の実態を確認するための資料です。
            </p>
          </header>

          <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              このページは現在<strong>{summary.prefectureCount}都道府県分</strong>のデータが収集できた時点の集計です。
              全国を網羅したものではなく、未収集の県は表に含まれていません。年度によって募集人員・実施校が変わる場合があるため、
              最新の情報は各都道府県教育委員会の公式発表でご確認ください。
            </p>
          </div>

          <section className="mb-10">
            <h2 className="mb-3 text-xl font-bold text-slate-900">現在収集できている範囲</h2>
            <dl className="grid grid-cols-2 gap-px border-y border-slate-200 bg-slate-200 sm:grid-cols-4">
              <div className="bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-600">都道府県</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{summary.prefectureCount}</dd>
              </div>
              <div className="bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-600">学校数（延べ）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{summary.totalSchoolCount}</dd>
              </div>
              <div className="bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-600">定時制レコード</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{summary.totalTeijiCount}</dd>
              </div>
              <div className="bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-600">通信制レコード</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{summary.totalTsushinCount}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              件数・平均倍率は本サイトが公表データから集計した値です（公表資料そのものの数値ではありません）。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 text-xl font-bold text-slate-900">都道府県別の内訳</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th className="px-4 py-3">都道府県</th>
                    <th className="px-4 py-3 text-right">学校数</th>
                    <th className="px-4 py-3 text-right">定時制</th>
                    <th className="px-4 py-3 text-right">通信制</th>
                    <th className="px-4 py-3 text-right">平均倍率</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const pref = getPrefectureByCode(r.prefectureCode);
                    if (!pref) return null;
                    return (
                      <tr key={r.prefectureCode} className="border-b border-slate-200 last:border-b-0">
                        <td className="px-4 py-0">
                          <Link
                            href={`/${r.prefectureCode}/teiji-tsushin`}
                            className="inline-flex min-h-[44px] items-center font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                          >
                            {pref.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-900">{r.schoolCount}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-900">{r.teijiCount}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-900">{r.tsushinCount}</td>
                        <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">{r.averageRate.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mb-8 text-base leading-[1.8] text-slate-900">
            定時制・通信制・サポート校・フリースクールの違いや選び方は
            <Link href="/futoukou/tsugaku" className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              通信制高校・フリースクールという選択肢
            </Link>
            で解説しています。
          </p>

          <Link
            href="/futoukou"
            className="inline-flex min-h-[44px] items-center gap-1 text-base font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            <ArrowLeft className="h-4 w-4" />
            「不登校と内申点」の解説に戻る
          </Link>
        </div>
      </div>
    </>
  );
}
