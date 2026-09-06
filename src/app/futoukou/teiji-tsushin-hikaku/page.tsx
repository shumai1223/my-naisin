import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ChevronRightSquare, BarChart3, Info } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-teal-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/futoukou" className="hover:text-teal-600">
              不登校と内申点
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">定時制・通信制の倍率比較</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              定時制・通信制の入試倍率を都道府県で比較する
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              各都道府県教育委員会が公表している、公立高校の定時制・通信制課程の募集人員・出願者数・倍率を、
              都道府県別にそのまま集計しました。「どの県を選ぶべきか」を示すものではなく、
              公表されている制度の実態を確認するための資料です。
            </p>
          </header>

          <div className="mb-8 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              このページは現在<strong>{summary.prefectureCount}都道府県分</strong>のデータが収集できた時点の集計です。
              全国を網羅したものではなく、未収集の県は表に含まれていません。年度によって募集人員・実施校が変わる場合があるため、
              最新の情報は各都道府県教育委員会の公式発表でご確認ください。
            </p>
          </div>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">現在収集できている範囲</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-teal-700">{summary.prefectureCount}</div>
                <div className="mt-1 text-xs text-slate-500">都道府県</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-teal-700">{summary.totalSchoolCount}</div>
                <div className="mt-1 text-xs text-slate-500">学校数（延べ）</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-teal-700">{summary.totalTeijiCount}</div>
                <div className="mt-1 text-xs text-slate-500">定時制レコード</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-teal-700">{summary.totalTsushinCount}</div>
                <div className="mt-1 text-xs text-slate-500">通信制レコード</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              件数・平均倍率は本サイトが公表データから集計した値です（公表資料そのものの数値ではありません）。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">都道府県別の内訳</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-3 font-medium">都道府県</th>
                    <th className="py-2 pr-3 text-right font-medium">学校数</th>
                    <th className="py-2 pr-3 text-right font-medium">定時制</th>
                    <th className="py-2 pr-3 text-right font-medium">通信制</th>
                    <th className="py-2 text-right font-medium">平均倍率</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const pref = getPrefectureByCode(r.prefectureCode);
                    if (!pref) return null;
                    return (
                      <tr key={r.prefectureCode} className="border-b border-slate-100">
                        <td className="py-2 pr-3">
                          <Link
                            href={`/${r.prefectureCode}/teiji-tsushin`}
                            className="font-bold text-teal-700 underline underline-offset-2"
                          >
                            {pref.name}
                          </Link>
                        </td>
                        <td className="py-2 pr-3 text-right text-slate-600">{r.schoolCount}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{r.teijiCount}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{r.tsushinCount}</td>
                        <td className="py-2 text-right font-bold text-slate-800">{r.averageRate.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            定時制・通信制・サポート校・フリースクールの違いや選び方は
            <Link href="/futoukou/tsugaku" className="mx-1 font-bold text-teal-700 underline">
              通信制高校・フリースクールという選択肢
            </Link>
            で解説しています。
          </div>

          <Link
            href="/futoukou"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:underline"
          >
            <ChevronRightSquare className="h-4 w-4 rotate-180" />
            「不登校と内申点」の解説に戻る
          </Link>
        </div>
      </div>
    </>
  );
}
