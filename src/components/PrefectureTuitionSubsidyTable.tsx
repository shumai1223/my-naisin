import Link from 'next/link';
import { HandCoins, ExternalLink, ShieldCheck } from 'lucide-react';

import { REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import type { PrefectureConfig } from '@/lib/prefectures';
import {
  PREFECTURE_TUITION_SUBSIDY_REGISTRY,
  type PrefectureTuitionSubsidyEntry,
  type SubsidyTargetCourse,
} from '@/data/prefecture-tuition-subsidy';

function targetCourseLabel(course?: SubsidyTargetCourse): string {
  if (course === 'public') return '公立';
  if (course === 'private') return '私立';
  if (course === 'both') return '公立・私立';
  return '—';
}

function entryFor(code: string): PrefectureTuitionSubsidyEntry | undefined {
  return PREFECTURE_TUITION_SUBSIDY_REGISTRY.find((e) => e.prefectureCode === code);
}

/** confirmed件数（見出しの実数表示用・ハードコード禁止） */
function confirmedCount(): number {
  return PREFECTURE_TUITION_SUBSIDY_REGISTRY.filter((e) => e.status === 'confirmed').length;
}

/** 最終確認日のうち最も新しいものを取得（E-E-A-T用の鮮度表示・PrefectureNaishinTableと同型） */
function latestVerifiedLabel(): string {
  const dates = PREFECTURE_TUITION_SUBSIDY_REGISTRY.map((e) => e.source?.lastChecked ?? e.investigatedAt).filter(Boolean) as string[];
  if (dates.length === 0) return '2026年度';
  const latest = dates.sort().at(-1)!;
  const [y, m] = latest.split('-');
  return `${y}年${Number(m)}月時点`;
}

function SubsidyRow({ pref }: { pref: PrefectureConfig }) {
  const entry = entryFor(pref.code);
  const confirmed = entry?.status === 'confirmed';

  return (
    <tr className="border-b border-slate-100 last:border-0 even:bg-slate-50/40 hover:bg-emerald-50/50">
      <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left font-bold text-slate-800">
        <span className="flex items-center gap-1.5">
          {pref.name}
          {confirmed ? (
            <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
              確認済み
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
              未確認
            </span>
          )}
        </span>
      </th>
      {confirmed ? (
        <>
          <td className="px-3 py-2.5 text-left text-xs leading-relaxed text-slate-700">
            {entry!.programName}
            {entry!.confidence === 'medium' && (
              <span className="ml-1.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
                金額は要リーフレット確認
              </span>
            )}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-center text-slate-700">
            {targetCourseLabel(entry!.targetCourse)}
          </td>
          <td className="px-3 py-2.5 text-left text-xs leading-relaxed text-slate-600">
            {entry!.subsidyAmountNote ?? '—'}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-center">
            {entry!.source && (
              <a
                href={entry!.source.url}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                公式
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </td>
        </>
      ) : (
        <td colSpan={4} className="px-3 py-2.5 text-left text-xs text-slate-400">
          本サイトでは独自上乗せ制度の一次情報を未確認です（国の就学支援金とは別に、制度がある場合があります。お住まいの都道府県教育委員会でご確認ください）。
        </td>
      )}
    </tr>
  );
}

/**
 * Y-9: 都道府県独自の就学支援上乗せ制度を一覧化する、サーバーレンダリングの一次情報テーブル。
 * confirmed（一次ソースで実在・内容を直接確認済み）の県のみ具体的な制度名・金額を表示し、
 * unconfirmed（本サイトで未確認）の県は正直に「未確認」と示す（Y-0憲法「捏造ゼロ」のUI側担保）。
 */
export function PrefectureTuitionSubsidyTable() {
  const confirmed = confirmedCount();

  return (
    <section
      id="pref-subsidy"
      aria-labelledby="pref-subsidy-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-4">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
          <HandCoins className="h-3 w-3" />
          一次情報・都道府県別
        </div>
        <h2 id="pref-subsidy-heading" className="text-xl font-bold text-slate-900 md:text-2xl">
          都道府県独自の授業料上乗せ・軽減制度（{confirmed}都道府県で確認済み）
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          国の就学支援金とは別に、多くの都道府県は<strong>私立高校の授業料差額を独自に補助する制度</strong>を持っています。
          下表は各都道府県の公式サイトで一次情報を確認できたものだけを掲載し、確認できていない県は正直に「未確認」と表示しています
          （制度が無いという意味ではありません）。
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">都道府県別の独自授業料上乗せ・軽減制度の一覧（制度名・対象・金額の目安・出典）</caption>
          <thead>
            <tr className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <th scope="col" className="px-3 py-3 text-left">都道府県</th>
              <th scope="col" className="px-3 py-3 text-left">制度名 / 対象</th>
              <th scope="col" className="px-3 py-3 text-center">対象課程</th>
              <th scope="col" className="px-3 py-3 text-left">金額の目安</th>
              <th scope="col" className="px-3 py-3 text-center">出典</th>
            </tr>
          </thead>
          {REGIONS.map((region) => (
            <tbody key={region}>
              <tr>
                <th scope="colgroup" colSpan={5} className="bg-emerald-600/5 px-3 py-2 text-left text-xs font-bold text-emerald-800">
                  {region}
                </th>
              </tr>
              {getPrefecturesByRegion(region).map((pref) => (
                <SubsidyRow key={pref.code} pref={pref} />
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-900">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            各都道府県教育委員会・私学担当課の公式ページを一次情報として作成（{latestVerifiedLabel()}確認）。金額・所得区分は年度改定されるため、
            申請前に必ず出典リンクまたはお住まいの都道府県で最新情報をご確認ください。
          </span>
        </p>
        <Link
          href="/prefectures"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 transition-all hover:bg-emerald-50"
        >
          都道府県一覧へ
        </Link>
      </div>
    </section>
  );
}
