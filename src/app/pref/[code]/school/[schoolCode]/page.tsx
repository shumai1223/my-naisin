import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, GraduationCap, MapPin, AlertTriangle } from 'lucide-react';

import { getPrefectureByCode } from '@/lib/prefectures';
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { buildSchoolPageDataForPrefecture, type SchoolPageData } from '@/lib/school-page-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

/**
 * 個別学校ページ（Λ-2・1県パイロット）。
 *
 * 👤裁定(2026-08-01・fable5-fullaccel-backlog-2026-07のΛ-2行)に基づく設計:
 *  - ①今季倍率(学校固有の一次データ)をページの主役に置く。実装済み。
 *  - ②(県内区分の多年度推移)③(近隣校リンク3本)は未実装（次のタスクで追加する）。
 *  - **初期はnoindexで建設**（親layout.tsxが既にrobots:{index:false}を設定済み・
 *    本ページのgenerateMetadataでも明示して二重に安全側へ倒す）。
 *  - **1県パイロット**: generateStaticParamsはPILOT_PREFECTURE_CODESのみ静的生成する。
 *    他県は`dynamicParams`既定(true)によりオンデマンド描画にフォールバックする
 *    （school-page-data.tsは全県で動作するため、パイロット外県でもロジック自体は機能する。
 *    横展開判断が済むまで大量の静的ページを一括生成しないための安全策）。
 */

const PILOT_PREFECTURE_CODES = ['tokyo'];

function getPrefectureSchoolPageData(code: string): { schools: SchoolPageData[] } | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) return null;
  const { schools } = buildSchoolPageDataForPrefecture(master.schools, rates.records);
  return { schools };
}

interface PageProps {
  params: Promise<{ code: string; schoolCode: string }>;
}

export function generateStaticParams() {
  return PILOT_PREFECTURE_CODES.flatMap((code) => {
    const data = getPrefectureSchoolPageData(code);
    if (!data) return [];
    return data.schools.map((s) => ({ code, schoolCode: s.schoolCode }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code, schoolCode } = await params;
  const prefecture = getPrefectureByCode(code);
  const data = getPrefectureSchoolPageData(code);
  const school = data?.schools.find((s) => s.schoolCode === schoolCode);

  if (!prefecture || !school) {
    return { title: '学校が見つかりません | My Naishin', robots: { index: false, follow: false } };
  }

  const title = `${school.schoolName}の入試倍率・募集人員 | My Naishin`;
  const description = `${school.schoolName}(${prefecture.name})の今季入試倍率${school.overallRate}倍・募集人員${school.totalQuota}名・応募者数${school.totalApplicants}名。教育委員会公表の一次データに基づく。`;

  return {
    title,
    description,
    // 建設中・品質ゲート(②多年度推移③近隣校リンク3本)未達のため明示的にnoindex。
    robots: { index: false, follow: false },
    alternates: { canonical: `https://my-naishin.com/pref/${code}/school/${schoolCode}` },
  };
}

export default async function SchoolPage({ params }: PageProps) {
  const { code, schoolCode } = await params;
  const prefecture = getPrefectureByCode(code);
  const data = getPrefectureSchoolPageData(code);
  const school = data?.schools.find((s) => s.schoolCode === schoolCode);

  if (!prefecture || !school) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: `${prefecture.name}の内申点`, url: `https://my-naishin.com/pref/${prefecture.code}` },
          { name: school.schoolName, url: `https://my-naishin.com/pref/${prefecture.code}/school/${schoolCode}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/pref/${prefecture.code}`} className="hover:text-blue-600">
            {prefecture.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">{school.schoolName}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">{school.schoolName}</h1>
              {school.address && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {school.address}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">今季の入試倍率（学校全体）</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{school.totalQuota}名</div>
                <div className="mt-1 text-xs text-blue-600">募集人員（全学科合計）</div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <div className="text-2xl font-bold text-indigo-700">{school.totalApplicants}名</div>
                <div className="mt-1 text-xs text-indigo-600">応募者数（全学科合計）</div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{school.overallRate}倍</div>
                <div className="mt-1 text-xs text-purple-600">倍率（応募者数÷募集人員）</div>
              </div>
            </div>
          </section>

          {school.departmentRates.length > 1 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">学科別の内訳</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-2 pr-4">学科</th>
                      <th className="py-2 pr-4 text-right">募集人員</th>
                      <th className="py-2 pr-4 text-right">応募者数</th>
                      <th className="py-2 text-right">倍率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {school.departmentRates.map((d, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-700">{d.department}</td>
                        <td className="py-2 pr-4 text-right text-slate-600">{d.quota}名</td>
                        <td className="py-2 pr-4 text-right text-slate-600">{d.finalApplicants}名</td>
                        <td className="py-2 text-right font-semibold text-slate-700">{d.finalRate}倍</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              このページは建設中です。今季倍率は教育委員会公表の一次データですが、複数年度の推移・近隣校情報は今後追加予定です。学校選びの最終判断は必ず各校の公式サイト・教育委員会の最新情報でご確認ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
