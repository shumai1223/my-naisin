import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, AlertCircle, ExternalLink } from '@/components/icons';

import { EXAM_SCHEDULE_BY_PREFECTURE, EXAM_SCHEDULE_PREFECTURE_CODES } from '@/data/exam-schedules';
import { PREFECTURES } from '@/lib/prefectures';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebPageSchema } from '@/components/StructuredData/WebPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ExamScheduleIcsLink } from '@/components/ExamScheduleIcsLink';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

const BASE = 'https://my-naishin.com';

// T-Y12: 47都道府県すべての入試日程データが揃っているため一括SSG（total-scoreと同じ設計）。
export function generateStaticParams() {
  return EXAM_SCHEDULE_PREFECTURE_CODES.map((code) => ({ prefecture: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture } = await params;
  const file = EXAM_SCHEDULE_BY_PREFECTURE[prefecture];
  const pref = PREFECTURES.find((p) => p.code === prefecture);
  if (!file || !pref) return { title: '公立高校 入試日程 | My Naishin' };

  const latestYear = file.years[file.years.length - 1];
  const title = `${pref.name}公立高校 入試日程 ${latestYear.fiscalYear} | 出願期間・学力検査日・合格発表日 | My Naishin`;
  const description = `${pref.name}公立高等学校入学者選抜の${latestYear.fiscalYear}日程を、${latestYear.docTitle}（教育委員会公式発表）のとおり掲載。出願期間・学力検査日・合格発表日など全${latestYear.events.length}項目。独自の解釈・言い換えは一切していません。`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${pref.code}/nyuushi-nittei` },
  };
}

export default async function PrefectureNyuushiNitteiPage({ params }: PageProps) {
  const { prefecture } = await params;
  const file = EXAM_SCHEDULE_BY_PREFECTURE[prefecture];
  const pref = PREFECTURES.find((p) => p.code === prefecture);
  if (!file || !pref) notFound();

  const url = `${BASE}/${pref.code}/nyuushi-nittei`;
  const offer = selectLeadOffer({ prefectureCode: pref.code, placement: 'prefecture' });
  const latestYear = file.years[file.years.length - 1];

  return (
    <>
      <WebPageSchema
        title={`${pref.name}公立高校 入試日程`}
        description={`${pref.name}公立高等学校入学者選抜の日程（出願期間・学力検査日・合格発表日等）を教育委員会公表資料のとおり掲載。`}
        url={url}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: pref.name, url: `${BASE}/${pref.code}` },
          { name: '入試日程', url },
        ]}
      />
      <DatasetSchema
        name={`${pref.name}公立高校 入試日程`}
        description={`${pref.name}公立高等学校入学者選抜の出願期間・学力検査日・合格発表日等（${file.years[file.years.length - 1].fiscalYear}）。${file.years[file.years.length - 1].docTitle}に基づく。`}
        url={url}
        variableMeasured={['出願期間', '学力検査日', '合格発表日']}
        dateModified={file.years[file.years.length - 1].fetchedAt}
        citation={file.years[file.years.length - 1].sourceUrl}
        keywords={[pref.name, '入試日程', '出願期間', '学力検査日', '合格発表日', '公立高校入試']}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${pref.code}`} className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              {pref.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">入試日程</span>
          </nav>

          {/* 頭: h1 → メタ行（年度・出典・確認日）→ 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {pref.name}公立高校 入試日程
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>{latestYear.fiscalYear} 入学者選抜</span>
              <span>
                出典：
                <a
                  href={latestYear.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {latestYear.docTitle}
                </a>
              </span>
              <span>確認日 {latestYear.fetchedAt}</span>
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              {pref.name}教育委員会が公表する公立高等学校入学者選抜の日程を、そのまま掲載しています。
            </p>
          </header>

          {/* ファーストビュー内の注記（公表資料のとおり・非公式の参考情報） */}
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8]">
              このページは{pref.name}教育委員会が公表した資料をもとにした<strong>非公式の参考情報</strong>です。項目名・日付は公表資料の記載をそのまま転記しており、独自の解釈・言い換え・推定は一切行っていません。学校ごとに個別の日程が定められる場合があります。出願前に必ず
              <a href={latestYear.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                {pref.name}教育委員会の公式発表
              </a>
              でご確認ください。
            </p>
          </div>

          {/* 年度ごとの日程 */}
          {file.years.map((year) => (
            <section key={year.fiscalYear} className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-2 text-xl font-bold text-slate-900">
                {year.fiscalYear} 入学者選抜日程
              </h2>
              <ol className="divide-y divide-slate-200">
                {year.events.map((event, i) => (
                  <li
                    key={`${event.label}-${i}`}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <div className="font-bold text-slate-900">{event.label}</div>
                    <div className="tabular-nums text-slate-900 sm:text-right">
                      {event.startDate}
                      {event.endDate && event.endDate !== event.startDate ? `〜${event.endDate}` : ''}
                      {event.note ? <span className="ml-2 text-xs text-slate-600">（{event.note}）</span> : null}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-[1.8] text-slate-600">
                出典: {year.docTitle}（確認日: {year.fetchedAt}）
              </p>
            </section>
          ))}

          {/* ICSカレンダー追加（T-Y12段階3・堀A） */}
          <div className="mt-8">
            <ExamScheduleIcsLink prefectureCode={pref.code} prefectureName={pref.name} />
          </div>

          {/* 全国共通の目安（/juken-schedule）への内部リンク */}
          <p className="mt-8 text-sm leading-[1.8] text-slate-600">
            全国的な入試シーズンの流れは
            <Link href="/juken-schedule" className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              受験スケジュール（全国共通の目安）
            </Link>
            もあわせてご覧ください。
          </p>

          {/* 保護者向けリード */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            prefectureCode={pref.code}
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* 出典（詳細） */}
          <div className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-4">
            <p className="text-sm font-bold text-slate-900">出典</p>
            <p className="mt-1 text-sm leading-[1.8] text-slate-900">
              本ページの日程は{pref.name}教育委員会が公表した資料に基づく参考情報です。学校・課程（全日制／定時制／通信制）により日程が異なる場合があります。最新の情報は
              <a href={latestYear.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                {pref.name}教育委員会の公式情報
                <ExternalLink className="h-4 w-4" />
              </a>
              でご確認ください（確認日：{latestYear.fetchedAt}）。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
