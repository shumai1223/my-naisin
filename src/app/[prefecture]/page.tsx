import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Home,
} from '@/components/icons';

import { getPrefectureByCode, PREFECTURES } from '@/lib/prefectures';
import { getPrefectureGuide, PREFECTURES_WITH_GUIDE } from '@/lib/prefecture-guides';
import { ALTERNATIVE_TRACK_PREFECTURE_CODES } from '@/lib/teiji-tsushin-options';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import { PrefecturePillarLinks } from '@/components/PrefecturePillarLinks';
import { TrustInfo } from '@/components/TrustInfo';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

interface PrefecturePageProps {
  params: Promise<{
    prefecture: string;
  }>;
}

// 手書きguideのある県（本文が重い県トップ）をビルド時に静的生成し、毎リクエストSSRをなくす（Error 1102対策）。
// guideの無い県は naishin への軽量リダイレクトのみなのでオンデマンドでも低コスト（dynamicParams は既定の true のまま）。
export function generateStaticParams() {
  return PREFECTURES
    .filter((p) => PREFECTURES_WITH_GUIDE.has(p.code))
    .map((p) => ({ prefecture: p.code }));
}

export async function generateMetadata({ params }: PrefecturePageProps) {
  const { prefecture: code } = await params;
  const pref = getPrefectureByCode(code);
  if (!pref) return {};

  return {
    title: `${pref.name}公立高校入試の内申点対策・計算ガイド【2026年最新】 | My Naishin`,
    description: `${pref.name}の高校入試における内申点の計算方法、換算内申、実技教科の倍率、対象学年を徹底解説。${pref.description}。志望校合格に向けた内申点アップの戦略も掲載。`,
    alternates: {
      canonical: `https://my-naishin.com/${code}`,
    },
  };
}

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { prefecture: code } = await params;
  const pref = getPrefectureByCode(code);

  if (!pref) {
    notFound();
  }

  // 手書きguideのない県はツールページへリダイレクト（薄いコンテンツ回避）
  if (!PREFECTURES_WITH_GUIDE.has(code)) {
    redirect(`/${code}/naishin`);
  }

  const guide = getPrefectureGuide(code);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' },
          { name: pref.name, url: `https://my-naishin.com/${code}` }
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/prefectures" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              都道府県一覧
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{pref.name}</span>
          </nav>

          {/* 頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 → 主な導線 */}
          <header className="max-w-3xl">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              {pref.name}公立高校入試<br className="md:hidden" />
              内申点ガイド
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>{pref.region}エリア</span>
              <span>令和8年度（2026年度）入学者選抜に対応</span>
              {pref.sourceUrl && (
                <span>
                  出典：
                  <a
                    href={pref.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {pref.sourceTitle ?? `${pref.name}教育委員会`}
                  </a>
                </span>
              )}
              {pref.lastVerified && <span>最終確認 {pref.lastVerified}</span>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              {pref.name}特有の計算ルール、実技倍率、合否判定における内申の重みを解説します。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${code}/naishin`}
                className="inline-flex min-h-[44px] items-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
              >
                内申点を今すぐ計算
              </Link>
              <Link
                href={`/reverse?pref=${code}`}
                className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 hover:bg-brand-50"
              >
                合格目標から逆算
              </Link>
            </div>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-10 lg:col-span-2">

              {/* 3つのポイント */}
              <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                  {pref.name}入試の要点まとめ
                </h2>
                <div className="divide-y divide-slate-200">
                  <div className="py-4">
                    <h3 className="text-[17px] font-bold text-slate-900">対象学年と配点</h3>
                    <p className="mt-2 text-base leading-[1.8] text-slate-900" dangerouslySetInnerHTML={{ __html: guide.summary3lines.target }} />
                  </div>
                  <div className="py-4">
                    <h3 className="text-[17px] font-bold text-slate-900">実技教科の重要度</h3>
                    <p className="mt-2 text-base leading-[1.8] text-slate-900" dangerouslySetInnerHTML={{ __html: guide.summary3lines.practical }} />
                  </div>
                  <div className="py-4 last:pb-0">
                    <h3 className="text-[17px] font-bold text-slate-900">合計満点と換算方式</h3>
                    <p className="mt-2 text-base leading-[1.8] text-slate-900" dangerouslySetInnerHTML={{ __html: guide.summary3lines.maxScore }} />
                  </div>
                </div>
              </section>

              {/* ⛔ E-0（2026-08-11）: 高校別ボーダーライン一覧の掲載を停止した。
                  掲載していた値は PREFECTURE_HIGH_SCHOOL_DATA で、source: 400行のうち
                  教委を出典に持つ行は0・226行は「推計 2026年度」＝自社推定だった。
                  Y-0憲法が永久禁止する「学校別の合格ボーダーの独自推定」に該当する。
                  復活の条件と経緯: ops/tasks/T-E0-borderline-y0-violation.md */}

              {/* 関連ナビゲーション */}
              <section className="grid gap-4 sm:grid-cols-2">
                <h2 className="sr-only">{pref.name}の計算ツール・関連ページ</h2>
                <Link href={`/${code}/naishin`} className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                  <h3 className="text-[17px] font-bold text-slate-900">{pref.name}用計算ツール</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-slate-600">あなたの今の内申点が何点になるか瞬時に算出します。</p>
                  <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                    ツールを開く <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <Link href={`/reverse?pref=${code}`} className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                  <h3 className="text-[17px] font-bold text-slate-900">合格点シミュレーター</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-slate-600">志望校合格に必要な当日点と内申点の比率を逆算します。</p>
                  <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                    シミュレーションする <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <Link href="/hensachi" className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                  <h3 className="text-[17px] font-bold text-slate-900">偏差値計算ツール</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-slate-600">5教科の点数から偏差値を瞬時に算出。志望校レベルと比較できます。</p>
                  <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                    偏差値を計算する <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <Link href="/hyotei-heikin" className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                  <h3 className="text-[17px] font-bold text-slate-900">評定平均 自動計算</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-slate-600">通知表の評定から平均値と素内申を同時表示。推薦入試の確認に。</p>
                  <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                    評定平均を計算する <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <Link href={`/${code}/nyuushi-nittei`} className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                  <h3 className="text-[17px] font-bold text-slate-900">{pref.name}公立高校 入試日程</h3>
                  <p className="mt-2 text-sm leading-[1.8] text-slate-600">出願期間・学力検査日・合格発表日を教育委員会公表資料のとおり掲載。</p>
                  <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                    入試日程を確認する <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                {ALTERNATIVE_TRACK_PREFECTURE_CODES.includes(code) && (
                  <Link href={`/${code}/teiji-tsushin`} className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50">
                    <h3 className="text-[17px] font-bold text-slate-900">{pref.name}の定時制・通信制高校一覧</h3>
                    <p className="mt-2 text-sm leading-[1.8] text-slate-600">全日制以外に公表されている選抜区分を、募集人員・出願者数・倍率とあわせて掲載。</p>
                    <div className="mt-3 flex items-center font-bold text-brand-700 group-hover:underline">
                      一覧を確認する <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                )}
              </section>

              {/* 保護者リード（県×面エンジンで自動解決：関東=森塾/関西=キャンパス/他=全国オンライン塾。旧Z会/サプリ¥1.5-28.8/clickは撤去） */}
              <ParentLeadCTA prefectureCode={code} placement="prefecture" />

              {/* 関連コラム */}
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    {pref.name}の受験お役立ち情報
                  </h2>
                  <Link href="/blog" className="inline-flex min-h-[44px] shrink-0 items-center text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    一覧を見る
                  </Link>
                </div>
                <BlogRelatedArticles prefectureCode={code} limit={6} />
              </section>

              <TrustInfo />

              {/* 信頼性と根拠 */}
              <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="text-xl font-bold text-slate-900">情報の信頼性について</h2>
                <p className="mt-3 text-base leading-[1.8] text-slate-900">
                  当サイトの情報は、{pref.name}教育委員会が公式に発表している「令和8年度（2026年度）入学者選抜実施要綱」等の一次資料を元に、現役のエンジニアと受験専門チームが1点1点の計算ロジックを検証しています。
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  <li className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">2026年4月最終更新済</li>
                  <li className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">一次資料検証済</li>
                  <li className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">2026年度入試結果反映</li>
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* 地域別リンク */}
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold text-slate-900">近隣の都道府県</h2>
                <ul className="mt-2 divide-y divide-slate-200">
                  {PREFECTURES
                    .filter(p => p.region === pref.region && p.code !== code)
                    .map(p => (
                      <li key={p.code}>
                        <Link
                          href={`/${p.code}`}
                          className="flex min-h-[44px] items-center justify-between gap-2 py-2 text-brand-700 transition-colors hover:text-brand-800 hover:underline"
                        >
                          {p.name}の対策
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* お問い合わせ */}
              <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
                <h2 className="text-xl font-bold text-slate-900">相談・誤り報告</h2>
                <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                  {pref.name}の入試制度変更や、計算結果の相違にお気づきの場合は、こちらからお知らせください。
                </p>
                <Link
                  href="/contact"
                  className="mt-4 block rounded border border-brand-700 bg-white px-5 py-3 text-center font-bold text-brand-700 hover:bg-brand-50"
                >
                  報告・連絡する
                </Link>
              </div>

              {/* 内部リンクピラー */}
              <PrefecturePillarLinks prefectureCode={code} prefectureName={pref.name} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
