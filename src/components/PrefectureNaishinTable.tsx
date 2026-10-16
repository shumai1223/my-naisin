import Link from 'next/link';
import { ChevronRight, MapPin } from '@/components/icons';

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
    <tr id={`naishin-${pref.code}`} className="scroll-mt-24 border-b border-slate-200 last:border-0 hover:bg-brand-50">
      <th scope="row" className="whitespace-nowrap p-0 text-left">
        <Link
          href={`/${pref.code}/naishin`}
          className="flex min-h-[44px] items-center gap-1 px-3 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          {pref.name}
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Link>
      </th>
      <td className="whitespace-nowrap px-3 py-2.5 text-right font-bold tabular-nums text-slate-900">
        {pref.maxScore}点
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-center text-slate-900">
        {targetGradesLabel(pref.targetGrades)}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-center">
        <span
          className={
            pref.practicalMultiplier > 1
              ? 'inline-flex items-center rounded border border-slate-200 bg-brand-50 px-2 py-0.5 text-xs font-bold tabular-nums text-brand-800'
              : 'text-slate-600'
          }
        >
          {multiplierLabel(pref.practicalMultiplier)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-left text-sm leading-relaxed text-slate-600">
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
      className="rounded-lg border border-slate-200 bg-white p-6 md:p-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="mb-4">
        <div className="mb-2 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
          一次情報・全国一覧
        </div>
        <h2 id="naishin-table-heading" className="text-xl font-bold text-slate-900">
          全国47都道府県の内申点 計算方式 比較一覧表
        </h2>
        <p className="mt-2 text-base leading-[1.8] text-slate-900">
          内申点の<strong>満点・対象学年・実技4教科の倍率・計算方式</strong>は都道府県ごとに大きく異なります。
          下表は全47都道府県の内申点 計算ルールを一覧で比較できるようにまとめたものです。
          都道府県名をタップすると、その地域専用の内申点 計算ツールで実際の点数を算出できます。
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            全国47都道府県の内申点の満点・対象学年・実技教科倍率・計算方式の比較一覧
          </caption>
          <thead>
            <tr className="border-b border-slate-900 text-xs text-slate-600">
              <th scope="col" className="px-3 py-3 text-left">都道府県</th>
              <th scope="col" className="px-3 py-3 text-right">満点</th>
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
                  className="bg-brand-50 px-3 py-2 text-left text-sm font-bold text-brand-800"
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
      <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <p className="text-sm leading-[1.8] text-slate-900">
          <strong className="font-bold">出典：</strong>
          各都道府県教育委員会の「入学者選抜実施要綱」を一次情報として作成（{latestVerifiedLabel()}）。
          満点や倍率は選抜区分で換算される場合があります。詳細は各都道府県ページの出典リンクをご確認ください。
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/prefectures"
            className="inline-flex min-h-[44px] items-center gap-2 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-100"
          >
            <MapPin className="h-4 w-4" />
            都道府県一覧へ
          </Link>
          <Link
            href="/quality"
            className="inline-flex min-h-[44px] items-center text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
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
