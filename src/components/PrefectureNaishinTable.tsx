import Link from 'next/link';
import { Calculator, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';

import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import type { PrefectureConfig } from '@/lib/prefectures';
import { CiteAssetBox } from '@/components/CiteAssetBox';

/** 対象学年の配列を人が読みやすいラベルに変換 */
function targetGradesLabel(grades: number[]): string {
  const sorted = [...grades].sort((a, b) => a - b);
  if (sorted.length === 0) return '—';
  if (sorted.length === 1) return `中${sorted[0]}のみ`;
  // 連続している場合は範囲表記（中1〜中3）、そうでなければ中点で連結（中2・中3）
  const isContiguous = sorted.every((g, i) => i === 0 || g === sorted[i - 1] + 1);
  return isContiguous
    ? `中${sorted[0]}〜中${sorted[sorted.length - 1]}`
    : sorted.map((g) => `中${g}`).join('・');
}

/** 倍率を「×2」「等倍」表記に */
function multiplierLabel(m: number): string {
  return m > 1 ? `×${m}` : '等倍';
}

/** 「最終確認日」のうち最も新しいものを取得（E-E-A-T 用の鮮度表示） */
function latestVerifiedLabel(): string {
  const dates = PREFECTURES.map((p) => p.lastVerified).filter(Boolean) as string[];
  if (dates.length === 0) return '2026年度入試';
  const latest = dates.sort().at(-1)!;
  const [y, m] = latest.split('-');
  return `${y}年${Number(m)}月時点`;
}

function PrefectureRow({ pref }: { pref: PrefectureConfig }) {
  return (
    <tr id={`naishin-${pref.code}`} className="scroll-mt-24 border-b border-slate-100 last:border-0 even:bg-slate-50/40 hover:bg-blue-50/50">
      <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left">
        <Link
          href={`/${pref.code}/naishin`}
          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline"
        >
          {pref.name}
          <ChevronRight className="h-3 w-3 opacity-50" />
        </Link>
      </th>
      <td className="whitespace-nowrap px-3 py-2.5 text-center font-semibold tabular-nums text-slate-800">
        {pref.maxScore}点
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-center text-slate-700">
        {targetGradesLabel(pref.targetGrades)}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-center">
        <span
          className={
            pref.practicalMultiplier > 1
              ? 'rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 ring-1 ring-rose-100'
              : 'text-slate-500'
          }
        >
          {multiplierLabel(pref.practicalMultiplier)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-left text-xs leading-relaxed text-slate-600">
        {pref.description}
      </td>
    </tr>
  );
}

/**
 * 全国47都道府県の内申点計算方式を1つの表にまとめた、サーバーレンダリングの一次情報アセット。
 * 「内申点 計算」「内申点 満点 一覧」等の検索意図に対する被引用・スニペット獲得を狙う。
 * 各行は /[code]/naishin へ内部リンクし、都道府県ページへ評価を分配する。
 */
export function PrefectureNaishinTable() {
  // 47都道府県の内申点計算ツールを ItemList として構造化（「内申点 計算」の意図補強・リッチリザルト対象化）
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '全国47都道府県の内申点 計算方式 比較一覧',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: PREFECTURES.length,
    itemListElement: PREFECTURES.map((pref, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${pref.name}の内申点 計算（${pref.maxScore}点満点）`,
      url: `https://my-naishin.com/${pref.code}/naishin`,
    })),
  };

  return (
    <section
      aria-labelledby="naishin-table-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="mb-4">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
          <MapPin className="h-3 w-3" />
          一次情報・全国一覧
        </div>
        <h2 id="naishin-table-heading" className="text-xl font-bold text-slate-900 md:text-2xl">
          全国47都道府県の内申点 計算方式 比較一覧表
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          内申点の<strong>満点・対象学年・実技4教科の倍率・計算方式</strong>は都道府県ごとに大きく異なります。
          下表は全47都道府県の内申点 計算ルールを一覧で比較できるようにまとめたものです。
          都道府県名をタップすると、その地域専用の内申点 計算ツールで実際の点数を算出できます。
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            全国47都道府県の内申点の満点・対象学年・実技教科倍率・計算方式の比較一覧
          </caption>
          <thead>
            <tr className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <th scope="col" className="px-3 py-3 text-left">都道府県</th>
              <th scope="col" className="px-3 py-3 text-center">満点</th>
              <th scope="col" className="px-3 py-3 text-center">対象学年</th>
              <th scope="col" className="px-3 py-3 text-center">実技倍率</th>
              <th scope="col" className="px-3 py-3 text-left">計算方式の特徴</th>
            </tr>
          </thead>
          {REGIONS.map((region) => (
            <tbody key={region}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={5}
                  className="bg-blue-600/5 px-3 py-2 text-left text-xs font-bold text-blue-800"
                >
                  {region}
                </th>
              </tr>
              {getPrefecturesByRegion(region).map((pref) => (
                <PrefectureRow key={pref.code} pref={pref} />
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* E-E-A-T：出典・鮮度の明示 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-900">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            各都道府県教育委員会の「入学者選抜実施要綱」を一次情報として作成（{latestVerifiedLabel()}）。
            満点や倍率は選抜区分で換算される場合があります。詳細は各都道府県ページの出典リンクをご確認ください。
          </span>
        </p>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/prefectures"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200 transition-all hover:bg-blue-50"
          >
            <Calculator className="h-3 w-3" />
            都道府県一覧へ
          </Link>
          <Link
            href="/quality"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-50"
          >
            情報の信頼性
          </Link>
        </div>
      </div>

      {/* 引用・出典クレジット（被リンク導線：引用されやすい一次情報アセット化） */}
      <CiteAssetBox />
    </section>
  );
}
