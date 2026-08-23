import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, GraduationCap, MapPin, AlertTriangle } from 'lucide-react';

import { getPrefectureByCode } from '@/lib/prefectures';
import { COMPETITION_RATE_HISTORY_BY_PREFECTURE } from '@/data/competition-rate-history';
import { selectNearbySchools, getSchoolCategoryTrends, groupSchoolHistoryByDepartment } from '@/lib/school-page-data';
import { getPrefectureSchoolPageData, INDEXED_SCHOOL_PAGE_PREFECTURE_CODES } from '@/lib/school-page-lookup';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { SchoolPageConvertCTA } from '@/components/SchoolPageConvertCTA';
import { SchoolPageParentBridge } from '@/components/SchoolPageParentBridge';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SchoolPageNaishinNote } from '@/components/SchoolPageNaishinNote';

/**
 * 個別学校ページ（Λ-2・分割公開の波ごとにインデックス解禁）。
 *
 * 👤裁定(2026-08-01・fable5-fullaccel-backlog-2026-07のΛ-2行/loop-question-note)に基づく設計:
 *  - ①今季倍率(学校固有の一次データ)をページの主役に置く。実装済み。
 *  - ②(県内区分の多年度推移)③(近隣校リンク3本・本数が学区の実態より少なくても正直に公開してよい=A案採用)実装済み。
 *  - **INDEXED_SCHOOL_PAGE_PREFECTURE_CODES(school-page-lookup.ts)に載っている県のみindex解禁**。それ以外はdynamicParams
 *    フォールバックで描画はされるがnoindexのまま（横展開判断前に検索露出しない安全策）。
 *  - **分割公開**: 1波5県ずつ。波を出したら次の波を出す前にGSCで登録数・手動対策を確認する
 *    ([[fable5-loop-protocol]]のΛ-2運用ルール)。
 *  - **wave1(2026-08-01)**: tokyo(パイロット済み)+kanagawa/saitama/chiba/hyogo
 *    （いずれもΛ-4多年度データ・Y-6今季倍率データとも揃っている大市場県）。
 */

const PILOT_PREFECTURE_CODES = INDEXED_SCHOOL_PAGE_PREFECTURE_CODES;

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

  const isIndexed = INDEXED_SCHOOL_PAGE_PREFECTURE_CODES.includes(code);

  return {
    title,
    description,
    // 👤裁定(2026-08-01)で品質ゲート①②③は決着済み。INDEXED_PREFECTURE_CODESに
    // 載っている波(wave)のみindex解禁し、未展開の県はdynamicParamsフォールバックで
    // 描画はされてもnoindexのまま維持する。
    robots: { index: isIndexed, follow: isIndexed },
    alternates: { canonical: `https://my-naishin.com/pref/${code}/school/${schoolCode}` },
  };
}

export default async function SchoolPage({ params }: PageProps) {
  const { code, schoolCode } = await params;
  const prefecture = getPrefectureByCode(code);
  const data = getPrefectureSchoolPageData(code);
  const school = data?.schools.find((s) => s.schoolCode === schoolCode);

  if (!prefecture || !school || !data) {
    notFound();
  }

  const nearbySchools = selectNearbySchools(school, data.schools, 3);
  const categoryTrends = getSchoolCategoryTrends(code, school, COMPETITION_RATE_HISTORY_BY_PREFECTURE[code]);
  const schoolHistoryByDepartment = groupSchoolHistoryByDepartment(school.history);

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

          <SchoolPageParentBridge schoolName={school.schoolName} prefectureCode={prefecture.code} />

          {/* G7（保護者到達を押し下げない・ResultSection.tsx:295-298の規約）: 換金導線
              (SchoolPageConvertCTA＝主食②-1)は必ずSchoolPageParentBridgeより下に置く。 */}
          <SchoolPageConvertCTA schoolName={school.schoolName} prefectureCode={prefecture.code} schoolCode={schoolCode} />

          {/* S3-2（PROPOSALS.md 2026-08-10）: 学校ページに換金導線が1つも配線されていなかった欠落を是正。
              既存の県面オファー(lead-config.ts)をplacement="prefecture"で解決するだけの最小配線。 */}
          <ParentLeadCTA prefectureCode={prefecture.code} placement="prefecture" />

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

          {schoolHistoryByDepartment.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-slate-800">この学校の募集人員・応募者数・倍率の推移</h2>
              <p className="mb-4 text-xs text-slate-500">
                {school.schoolName}固有の一次データです（下記の「県全体の傾向」とは別物）。
              </p>
              <div className="space-y-4">
                {schoolHistoryByDepartment.map((group) => (
                  <div key={group.department} className="overflow-x-auto">
                    {schoolHistoryByDepartment.length > 1 && (
                      <h3 className="mb-2 text-sm font-semibold text-slate-600">{group.department}</h3>
                    )}
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-2 pr-4 font-normal">年度</th>
                          {group.entries.map((e) => (
                            <th key={e.fiscalYear} className="py-2 pr-4 text-right font-normal">
                              {e.fiscalYear}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 pr-4 text-slate-500">募集人員</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="py-2 pr-4 text-right text-slate-600">
                              {e.quota}名
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 pr-4 text-slate-500">応募者数</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="py-2 pr-4 text-right text-slate-600">
                              {e.applicants}名
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 text-slate-500">倍率</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="py-2 pr-4 text-right font-semibold text-slate-700">
                              {e.rate}倍
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    {/* S6-1(2026-08-24): 1データ点1出典(Y-0憲法②)。数値の直下に年度ごとの一次資料を明示する。
                        resolveRecordSourceIndexで一意に解決できた年度のみ表示(捏造ゼロ＝断定できない出典は出さない)。 */}
                    {group.entries.some((e) => e.source) && (
                      <ul className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-slate-400">
                        {group.entries
                          .filter((e) => e.source)
                          .map((e) => (
                            <li key={e.fiscalYear}>
                              出典（{e.fiscalYear}）：
                              <a href={e.source!.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                                {e.source!.docTitle}
                              </a>
                              （取得日: {e.source!.fetchedAt}）
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {categoryTrends.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-slate-800">
                {categoryTrends.some((t) => t.granularity === 'grand-total-only')
                  ? '県内公立高校全体の倍率の推移'
                  : '学科の県内区分別・倍率の推移'}
              </h2>
              <p className="mb-4 text-xs text-slate-500">
                {categoryTrends.some((t) => t.granularity === 'grand-total-only')
                  ? `この学校固有の推移ではなく、${prefecture.name}の公立高校全体を合算した「県全体の傾向」です(この県は学科区分別の集計が公表されていないため全体合計のみを掲載)。`
                  : `この学校固有の推移ではなく、同じ学科区分に属する${prefecture.name}内の高校をまとめた「県全体の傾向」です。`}
              </p>
              <div className="space-y-4">
                {categoryTrends.map((trend) => (
                  <div key={trend.categoryLabel} className="overflow-x-auto">
                    <h3 className="mb-2 text-sm font-semibold text-slate-600">{trend.categoryLabel}</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          {trend.points.map((p) => (
                            <th key={p.fiscalYear} className="py-2 pr-4 text-right font-normal">
                              {p.fiscalYear}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {trend.points.map((p) => (
                            <td key={p.fiscalYear} className="py-2 pr-4 text-right font-semibold text-slate-700">
                              {p.rate}倍
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>
          )}

          <SchoolPageNaishinNote schoolName={school.schoolName} prefecture={prefecture} />

          {nearbySchools.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                {school.area ? `同じ学区（${school.area}）の高校` : '近隣の高校'}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-1">
                {nearbySchools.map((n) => (
                  <li key={n.schoolCode}>
                    <Link
                      href={`/pref/${prefecture.code}/school/${n.schoolCode}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100"
                    >
                      <span className="font-medium text-slate-700">{n.schoolName}</span>
                      <span className="text-slate-500">倍率 {n.overallRate}倍</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
現在は募集人員・応募者数・倍率と、この学校固有の多年度推移・学科区分の県内推移を掲載しています（いずれも教育委員会公表の一次データに基づく）。近隣校リンクは学区によって表示件数が少ない場合があります。偏差値・合格最低点は掲載していません。学校選びの最終判断は必ず各校の公式サイト・教育委員会の最新情報でご確認ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
