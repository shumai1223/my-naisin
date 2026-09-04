import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Home, AlertCircle, ExternalLink, Info } from 'lucide-react';

import { EXAM_SCHEDULE_BY_PREFECTURE, EXAM_SCHEDULE_PREFECTURE_CODES } from '@/data/exam-schedules';
import { PREFECTURES } from '@/lib/prefectures';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebPageSchema } from '@/components/StructuredData/WebPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${pref.code}`} className="hover:text-blue-600">
              {pref.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">入試日程</span>
          </nav>

          {/* Header */}
          <header className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {pref.name}公立高校 入試日程
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              {pref.name}教育委員会が公表する公立高等学校入学者選抜の日程を、そのまま掲載しています。
            </p>
          </header>

          {/* ファーストビュー内の注記（公表資料のとおり・非公式の参考情報） */}
          <div className="mb-8 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              このページは{pref.name}教育委員会が公表した資料をもとにした<strong>非公式の参考情報</strong>です。項目名・日付は公表資料の記載をそのまま転記しており、独自の解釈・言い換え・推定は一切行っていません。学校ごとに個別の日程が定められる場合があります。出願前に必ず
              <a href={file.years[file.years.length - 1].sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 underline">
                {pref.name}教育委員会の公式発表
              </a>
              でご確認ください。
            </p>
          </div>

          {/* 年度ごとの日程 */}
          {file.years.map((year) => (
            <section key={year.fiscalYear} className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                {year.fiscalYear} 入学者選抜日程
              </h2>
              <ol className="space-y-3">
                {year.events.map((event, i) => (
                  <li key={`${event.label}-${i}`} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800">{event.label}</div>
                      <div className="mt-0.5 text-sm text-slate-600">
                        {event.startDate}
                        {event.endDate && event.endDate !== event.startDate ? `〜${event.endDate}` : ''}
                        {event.note ? <span className="ml-2 text-xs text-slate-400">（{event.note}）</span> : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                出典: {year.docTitle}（確認日: {year.fetchedAt}）
              </p>
            </section>
          ))}

          {/* 全国共通の目安（/juken-schedule）への内部リンク */}
          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            全国的な入試シーズンの流れは
            <Link href="/juken-schedule" className="mx-1 font-bold text-blue-600 underline">
              受験スケジュール（全国共通の目安）
            </Link>
            もあわせてご覧ください。
          </div>

          {/* 保護者向けリード */}
          <ParentLeadCTA
            className="mt-2"
            placement="prefecture"
            prefectureCode={pref.code}
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* 出典（詳細） */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-800">
                本ページの日程は{pref.name}教育委員会が公表した資料に基づく参考情報です。学校・課程（全日制／定時制／通信制）により日程が異なる場合があります。最新の情報は
                <a href={file.years[file.years.length - 1].sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-amber-900 underline">
                  {pref.name}教育委員会の公式情報
                  <ExternalLink className="h-3 w-3" />
                </a>
                でご確認ください（確認日：{file.years[file.years.length - 1].fetchedAt}）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
