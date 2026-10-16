import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, MapPin, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from '@/components/icons';

import { getPrefectureByCode } from '@/lib/prefectures';
import { COMPETITION_RATE_HISTORY_BY_PREFECTURE } from '@/data/competition-rate-history';
import { selectNearbySchools, getSchoolCategoryTrends, groupSchoolHistoryByDepartment, computeSchoolHistoryYoy } from '@/lib/school-page-data';
import { getPrefectureSchoolPageData, INDEXED_SCHOOL_PAGE_PREFECTURE_CODES } from '@/lib/school-page-lookup';
import { getSchoolTeijiRecords } from '@/lib/school-teiji-lookup';
import { shortenSchoolName } from '@/lib/school-name-short-form';
import { buildSchoolFaqItems } from '@/lib/school-page-faq';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HighSchoolSchema } from '@/components/StructuredData/HighSchoolSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SchoolPageConvertCTA } from '@/components/SchoolPageConvertCTA';
import { SchoolPageParentBridge } from '@/components/SchoolPageParentBridge';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SchoolParentLeadForm } from '@/components/SchoolParentLeadForm';
import { isSchoolLeadFormReleased } from '@/lib/school-lead-release';
import { SchoolPageNaishinNote } from '@/components/SchoolPageNaishinNote';
import { AdUnit } from '@/components/AdSlot';

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

/**
 * S3-3（ops/PROPOSALS.md・BAR.md V-6）: 学校名短縮形の併記パイロット。
 * GSCの実クエリでは短縮形（例:「一宮商業高校」）が正式名（「〜高等学校」）の23倍表示・76倍クリック
 * だが、このページは正式名しか出していなかった（BAR.md §0-6）。まず1県（aichi＝実測の例示県）に
 * 限定してtitle/meta description/h1に短縮形を併記し、GSCで4週間CTRを追跡してから展開県を広げる。
 *
 * 2026-09-24 全県へ展開（👤裁定・W-8判定 ops/baselines/gsc-review-2026-09-24.md）:
 * JP×MOBILE・9/7-20窓で条件①が+0.29pt（閾値+0.30ptとの差0.01ptは誤差と判定）、条件②は+4.1ptで合格。
 * ⚠️ 全デバイスでは条件②が−17.9〜−32.6ptで不合格、消えたクエリ上位が「○○高校 倍率」だった点は
 * 未解消の懸念として同ファイルに記録済み。展開後は W-8 と同じ方法で全県のクリックを追跡すること。
 */
const SHORT_FORM_ENABLED = true;

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

  const shortName = SHORT_FORM_ENABLED ? shortenSchoolName(school.schoolName) : null;
  const displayName = shortName ? `${school.schoolName}（${shortName}）` : school.schoolName;

  const title = `${displayName}の入試倍率・募集人員 | My Naishin`;
  const description = `${displayName}(${prefecture.name})の今季入試倍率${school.overallRate}倍・募集人員${school.totalQuota}名・応募者数${school.totalApplicants}名。教育委員会公表の一次データに基づく。`;

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
  const teijiRecords = getSchoolTeijiRecords(code, schoolCode);
  const schoolHistoryByDepartment = groupSchoolHistoryByDepartment(school.history);
  // S3-3（2026-09-24 全県展開・BAR.md V-6）: 検索ユーザーが実際に打つ短縮形をh1に併記する。
  const shortName = SHORT_FORM_ENABLED ? shortenSchoolName(school.schoolName) : null;
  const canonicalUrl = `https://my-naishin.com/pref/${prefecture.code}/school/${schoolCode}`;
  // S3-4（ops/PROPOSALS.md）: HighSchool + FAQPage 構造化データ。実数のみ・AggregateRatingは作らない。
  const faqItems = buildSchoolFaqItems(school, prefecture.name);

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: `${prefecture.name}の内申点`, url: `https://my-naishin.com/pref/${prefecture.code}` },
          { name: school.schoolName, url: canonicalUrl },
        ]}
      />
      <HighSchoolSchema name={school.schoolName} url={canonicalUrl} address={school.address || undefined} />
      <FAQPageSchema faqItems={faqItems} />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline"
          >
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/pref/${prefecture.code}`}
            className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline"
          >
            {prefecture.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{school.schoolName}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
            {school.schoolName}
            {shortName && <span className="ml-2 inline-block text-lg font-bold text-slate-600 md:text-xl">（{shortName}）</span>}
          </h1>
          {school.address && (
            <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="h-4 w-4 shrink-0" />
              {school.address}
            </p>
          )}
          <p className="mt-1 text-sm text-slate-600">出典：教育委員会公表の一次データ</p>
        </header>

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">今季の入試倍率（学校全体）</h2>
            <dl className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">募集人員（全学科合計）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{school.totalQuota}名</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">応募者数（全学科合計）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{school.totalApplicants}名</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-slate-600">倍率（応募者数÷募集人員）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{school.overallRate}倍</dd>
              </div>
            </dl>
          </section>

          <SchoolPageParentBridge schoolName={school.schoolName} prefectureCode={prefecture.code} />

          {/* G7（保護者到達を押し下げない・ResultSection.tsx:295-298の規約）: 換金導線
              (SchoolPageConvertCTA＝主食②-1)は必ずSchoolPageParentBridgeより下に置く。 */}
          <SchoolPageConvertCTA schoolName={school.schoolName} prefectureCode={prefecture.code} schoolCode={schoolCode} />

          {/* S3-2（PROPOSALS.md 2026-08-10）: 学校ページに換金導線が1つも配線されていなかった欠落を是正。
              既存の県面オファー(lead-config.ts)をplacement="prefecture"で解決するだけの最小配線。 */}
          <ParentLeadCTA prefectureCode={prefecture.code} placement="prefecture" />

          {/* T-N1-N4 C10-2: 保護者向けリードフォーム。倍率データ(上記)より下に配置（データが先・CTAは後の原則）。
              C10-1(M1-2)投入から2週間の単独効果測定を終えるまで非表示（日付ゲート・[[school-lead-release]]）。 */}
          {isSchoolLeadFormReleased() && (
            <SchoolParentLeadForm
              prefectureCode={prefecture.code}
              prefectureName={prefecture.name}
              schoolName={school.schoolName}
            />
          )}

          {/* T-ADS1 AdSense 1枠目: 倍率データ・保護者CTA・リードフォームより下（CTAを押し下げない・データが先）。
              NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。枠は3つ以内（IN_CONTENT×2＋PAGE_BOTTOM）。 */}
          <AdUnit unit="IN_CONTENT" />

          {school.departmentRates.length > 1 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-xl font-bold text-slate-900">学科別の内訳</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                      <th className="py-2 pr-4 font-bold">学科</th>
                      <th className="py-2 pr-4 text-right font-bold">募集人員</th>
                      <th className="py-2 pr-4 text-right font-bold">応募者数</th>
                      <th className="py-2 text-right font-bold">倍率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {school.departmentRates.map((d, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="py-2 pr-4 text-slate-900">{d.department}</td>
                        <td className="py-2 pr-4 text-right tabular-nums text-slate-900">{d.quota}名</td>
                        <td className="py-2 pr-4 text-right tabular-nums text-slate-900">{d.finalApplicants}名</td>
                        <td className="py-2 text-right font-bold tabular-nums text-slate-900">{d.finalRate}倍</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {schoolHistoryByDepartment.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-1 text-xl font-bold text-slate-900">この学校の募集人員・応募者数・倍率の推移</h2>
              <p className="mb-4 text-sm text-slate-600">
                {school.schoolName}固有の一次データです（下記の「県全体の傾向」とは別物）。
              </p>
              <div className="space-y-6">
                {schoolHistoryByDepartment.map((group) => {
                  const yoy = computeSchoolHistoryYoy(group);
                  return (
                  <div key={group.department}>
                    {schoolHistoryByDepartment.length > 1 && (
                      <h3 className="mb-2 text-[17px] font-bold text-slate-900">{group.department}</h3>
                    )}
                    {yoy && (
                      <p className="mb-2 flex items-start gap-1.5 text-sm font-bold text-slate-900">
                        {yoy.direction === 'up' ? (
                          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : yoy.direction === 'down' ? (
                          <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : (
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                        )}
                        <span>
                          前年比
                          {yoy.rateDelta > 0 ? `+${yoy.rateDelta}` : yoy.rateDelta}倍（{yoy.previousFiscalYear}の{yoy.previousRate}倍
                          →{yoy.currentFiscalYear}の{yoy.currentRate}倍）
                        </span>
                      </p>
                    )}
                    {/* スマホでは年度の列が多く、文字が1字ずつ折り返して読めなくなるため、折り返しを止めて表の中だけ横に動かす。
                        先頭の項目名の列は固定し、スクロールしても見える。年度は「（」の前で2段に分ける（文字は同じ）。 */}
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                          <th className="sticky left-0 whitespace-nowrap bg-white py-2 pr-4 align-bottom font-bold">年度</th>
                          {group.entries.map((e) => (
                            <th key={e.fiscalYear} className="whitespace-nowrap py-2 pr-4 text-right align-bottom font-bold">
                              {e.fiscalYear.split(/(?=[（(])/).map((part, i) => (
                                <span key={i} className="block">{part}</span>
                              ))}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="sticky left-0 whitespace-nowrap bg-white py-2 pr-4 text-slate-600">募集人員</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="whitespace-nowrap py-2 pr-4 text-right tabular-nums text-slate-900">
                              {e.quota}名
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="sticky left-0 whitespace-nowrap bg-white py-2 pr-4 text-slate-600">応募者数</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="whitespace-nowrap py-2 pr-4 text-right tabular-nums text-slate-900">
                              {e.applicants}名
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="sticky left-0 whitespace-nowrap bg-white py-2 pr-4 text-slate-600">倍率</td>
                          {group.entries.map((e) => (
                            <td key={e.fiscalYear} className="whitespace-nowrap py-2 pr-4 text-right font-bold tabular-nums text-slate-900">
                              {e.rate}倍
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    </div>
                    {/* S6-1(2026-08-24): 1データ点1出典(Y-0憲法②)。数値の直下に年度ごとの一次資料を明示する。
                        resolveRecordSourceIndexで一意に解決できた年度のみ表示(捏造ゼロ＝断定できない出典は出さない)。 */}
                    {group.entries.some((e) => e.source) && (
                      <ul className="mt-2 space-y-0.5 text-sm leading-[1.8] text-slate-600">
                        {group.entries
                          .filter((e) => e.source)
                          .map((e) => (
                            <li key={e.fiscalYear}>
                              出典（{e.fiscalYear}）：
                              <a href={e.source!.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
                                {e.source!.docTitle}
                              </a>
                              （取得日: {e.source!.fetchedAt}）
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* T-ADS1 AdSense 2枠目: 多年度推移の後。推移が無い学校では出さない（1枠目と近接して1画面あけられないため） */}
          {schoolHistoryByDepartment.length > 0 && <AdUnit unit="IN_CONTENT" />}

          {categoryTrends.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-1 text-xl font-bold text-slate-900">
                {categoryTrends.some((t) => t.granularity === 'grand-total-only')
                  ? '県内公立高校全体の倍率の推移'
                  : '学科の県内区分別・倍率の推移'}
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                {categoryTrends.some((t) => t.granularity === 'grand-total-only')
                  ? `この学校固有の推移ではなく、${prefecture.name}の公立高校全体を合算した「県全体の傾向」です(この県は学科区分別の集計が公表されていないため全体合計のみを掲載)。`
                  : `この学校固有の推移ではなく、同じ学科区分に属する${prefecture.name}内の高校をまとめた「県全体の傾向」です。`}
              </p>
              <div className="space-y-6">
                {categoryTrends.map((trend) => (
                  <div key={trend.categoryLabel} className="overflow-x-auto">
                    <h3 className="mb-2 text-[17px] font-bold text-slate-900">{trend.categoryLabel}</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                          {trend.points.map((p) => (
                            <th key={p.fiscalYear} className="py-2 pr-4 text-right font-bold">
                              {p.fiscalYear}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          {trend.points.map((p) => (
                            <td key={p.fiscalYear} className="py-2 pr-4 text-right font-bold tabular-nums text-slate-900">
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

          {/* T-S1 S1-4（2026-09-06投入）: この学校が定時制・通信制課程を持つ場合のみ表示する
              追加セクション。全日制の今季倍率・多年度推移パイプラインには一切触れず、
              school-teiji-lookup.ts経由でT-P1のteiji-competition-ratesデータを引くだけの
              完全に独立した追加（該当データが無い学校では何も表示されない）。 */}
          {teijiRecords.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-1 text-xl font-bold text-slate-900">定時制・通信制課程</h2>
              <p className="mb-4 text-sm text-slate-600">
                全日制とは別に、{prefecture.name}教育委員会が公表している定時制・通信制課程の募集人員・出願者数・倍率です。
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-900 text-xs text-slate-600">
                      <th className="py-2 pr-3 font-bold">学科</th>
                      <th className="py-2 pr-3 text-right font-bold">募集人員</th>
                      <th className="py-2 pr-3 text-right font-bold">出願者数</th>
                      <th className="py-2 text-right font-bold">倍率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teijiRecords.map((r, i) => (
                      <tr key={`${r.department}-${i}`} className="border-b border-slate-200">
                        <td className="py-2 pr-3 text-slate-900">{r.department}</td>
                        <td className="py-2 pr-3 text-right tabular-nums text-slate-900">{r.quota}</td>
                        <td className="py-2 pr-3 text-right tabular-nums text-slate-900">{r.finalApplicants}</td>
                        <td className="py-2 text-right font-bold tabular-nums text-slate-900">{r.finalRate.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href={`/${prefecture.code}/teiji-tsushin`}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {prefecture.name}の定時制・通信制高校一覧を見る
              </Link>
            </section>
          )}

          <SchoolPageNaishinNote schoolName={school.schoolName} prefecture={prefecture} />

          {nearbySchools.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                {school.area ? `同じ学区（${school.area}）の高校` : '近隣の高校'}
              </h2>
              <ul className="border-t border-slate-200">
                {nearbySchools.map((n) => (
                  <li key={n.schoolCode}>
                    <Link
                      href={`/pref/${prefecture.code}/school/${n.schoolCode}`}
                      className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 px-1 py-2 text-base hover:bg-brand-50"
                    >
                      <span className="text-slate-900">{n.schoolName}</span>
                      <span className="shrink-0 tabular-nums text-slate-600">倍率 {n.overallRate}倍</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
              <span>
                <strong>注意：</strong>
                現在は募集人員・応募者数・倍率と、この学校固有の多年度推移・学科区分の県内推移を掲載しています（いずれも教育委員会公表の一次データに基づく）。近隣校リンクは学区によって表示件数が少ない場合があります。偏差値・合格最低点は掲載していません。学校選びの最終判断は必ず各校の公式サイト・教育委員会の最新情報でご確認ください。
              </span>
            </p>
          </section>
          {/* T-ADS1 AdSense 3枠目: ページ最下部（フッターの前）の関連コンテンツ型ユニット */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </div>
  );
}
