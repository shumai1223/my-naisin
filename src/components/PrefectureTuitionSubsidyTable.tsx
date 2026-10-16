import Link from 'next/link';
import { Check, ExternalLink } from '@/components/icons';

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
    <tr className="border-b border-slate-200 last:border-0">
      <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left font-bold text-slate-900">
        <span className="flex items-center gap-1.5">
          {pref.name}
          {confirmed ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-xs font-bold text-brand-700">
              <Check className="h-4 w-4" />
              確認済み
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-600">
              未確認
            </span>
          )}
        </span>
      </th>
      {confirmed ? (
        <>
          <td className="px-3 py-2.5 text-left text-sm leading-[1.7] text-slate-900">
            {entry!.programName}
            {entry!.confidence === 'medium' && (
              <span className="ml-1.5 inline-flex items-center rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-900">
                金額は要リーフレット確認
              </span>
            )}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-center text-slate-900">
            {targetCourseLabel(entry!.targetCourse)}
          </td>
          <td className="px-3 py-2.5 text-left text-sm leading-[1.7] text-slate-900">
            {entry!.subsidyAmountNote ?? '—'}
          </td>
          <td className="whitespace-nowrap px-3 text-center">
            {entry!.source && (
              <a
                href={entry!.source.url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                公式
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </td>
        </>
      ) : (
        <td colSpan={4} className="px-3 py-2.5 text-left text-sm leading-[1.7] text-slate-600">
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
      className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 md:p-8"
    >
      <div className="mb-4">
        <div className="mb-2 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
          一次情報・都道府県別
        </div>
        <h2 id="pref-subsidy-heading" className="text-xl font-bold text-slate-900">
          都道府県独自の授業料上乗せ・軽減制度（{confirmed}都道府県で確認済み）
        </h2>
        <p className="mt-2 text-base leading-[1.8] text-slate-900">
          国の就学支援金とは別に、多くの都道府県は<strong>私立高校の授業料差額を独自に補助する制度</strong>を持っています。
          下表は各都道府県の公式サイトで一次情報を確認できたものだけを掲載し、確認できていない県は正直に「未確認」と表示しています
          （制度が無いという意味ではありません）。
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">都道府県別の独自授業料上乗せ・軽減制度の一覧（制度名・対象・金額の目安・出典）</caption>
          <thead>
            <tr className="border-b border-slate-900 text-xs text-slate-600">
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
                <th scope="colgroup" colSpan={5} className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-900">
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

      <div className="mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-brand-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 text-sm leading-[1.8] text-slate-900">
          <p className="font-bold">出典</p>
          <p className="mt-1">
            各都道府県教育委員会・私学担当課の公式ページを一次情報として作成（{latestVerifiedLabel()}確認）。金額・所得区分は年度改定されるため、
            申請前に必ず出典リンクまたはお住まいの都道府県で最新情報をご確認ください。
          </p>
        </div>
        <Link
          href="/prefectures"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1 self-start rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50 md:self-auto"
        >
          都道府県一覧へ
        </Link>
      </div>
    </section>
  );
}
