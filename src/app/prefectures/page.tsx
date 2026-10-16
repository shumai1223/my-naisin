import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Home,
  ArrowRight
} from '@/components/icons';

import { PREFECTURES, REGIONS } from '@/lib/prefectures';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata = {
  title: '内申点 計算サイト 47都道府県一覧｜都道府県別の高校入試・実技倍率を確認【2026年度・無料】 | My Naishin',
  description: '全国47都道府県の高校入試に対応した内申点 計算サイトの一覧。お住まいの地域を選ぶだけで、最新（令和8年度）の入試制度・満点・実技倍率に基づいた内申点を無料で正確に算出できます。総合得点・合否の仕組みの早見表へもここから。',
  alternates: {
    canonical: 'https://my-naishin.com/prefectures',
  },
};

const REGION_DESCRIPTIONS: Record<string, string> = {
  関東: '東京・神奈川・千葉・埼玉では換算内申が中心。東京は実技4教科を2倍に加重、神奈川はA値・S値が独特。茨城・栃木・群馬は素内申に近い扱い。',
  近畿: '大阪は3年間の評定をすべて使う独特の制度で内申比率も高い。兵庫は5教科と実技の傾斜が控えめ、京都・奈良・滋賀・和歌山は推薦制度が手厚いのが特徴。',
  '九州・沖縄': '福岡は3年間の評定を均等配分、熊本・鹿児島は実技を重視。長崎・佐賀・大分・宮崎・沖縄は推薦入試と一般入試で内申の扱いが大きく異なる。',
  '中部': '愛知は内申と当日点の比率が学校ごとに細かく設定される。静岡・新潟・長野は実技教科の倍率に注意。',
  '北海道・東北': '北海道は学習点300点満点という独特の制度。東北各県は3年間累計の評定を使うことが多く、副教科の扱いに差がある。',
  '中国・四国': '広島・岡山・愛媛は推薦と一般で内申基準が大きく異なる。山口・徳島・香川・高知は素内申に近い扱い。',
};

export default function PrefecturesPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' }
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">都道府県一覧</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              都道府県別の内申点・高校入試対策
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              令和8年度入試 ／ 出典：各都道府県教育委員会「入学者選抜実施要綱」
            </p>
            <p className="mt-3 max-w-3xl text-base leading-[1.8] text-slate-900">
              各都道府県の最新（令和8年度）入試制度を網羅。内申点の計算ツールから、合格に必要な当日点のシミュレーション、地域別の攻略ガイドまで、すべての情報を一箇所に集約しました。
            </p>
          </header>

          {/* Region Quick Links */}
          <div className="mb-8 flex flex-wrap gap-2">
            {REGIONS.map(region => (
              <a
                key={region}
                href={`#region-${region}`}
                className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
              >
                {region}
              </a>
            ))}
          </div>

          {/* 総合得点ハブへの導線 */}
          <Link
            href="/total-score"
            className="mb-12 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-brand-50 p-5 hover:bg-brand-100"
          >
            <div>
              <div className="font-bold text-slate-900">都道府県別 総合得点・合否の仕組み（全47県）</div>
              <p className="mt-0.5 text-sm text-slate-600">
                内申点＋当日点の合算方法・合否の決まり方を全県分まとめました。計算できる県は自動計算ツール付き。
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-brand-700" />
          </Link>

          {/* Grid of Regions */}
          <div className="space-y-12">
            {REGIONS.map(region => {
              const prefsInRegion = PREFECTURES.filter(p => p.region === region);
              const regionDescription = REGION_DESCRIPTIONS[region];
              return (
                <section key={region} id={`region-${region}`} className="scroll-mt-20">
                  <div className="mb-3 flex items-baseline gap-3 border-b border-slate-200 pb-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {region}
                    </h2>
                    <span className="text-sm tabular-nums text-slate-600">
                      {prefsInRegion.length} 都道府県
                    </span>
                  </div>
                  {regionDescription && (
                    <p className="mb-6 text-base leading-[1.8] text-slate-900">
                      {regionDescription}
                    </p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {prefsInRegion.map(pref => (
                      <div
                        key={pref.code}
                        className="rounded-lg border border-slate-200 bg-white p-5"
                      >
                        <h3 className="mb-3 text-[17px] font-bold text-slate-900">
                          {pref.name}
                        </h3>

                        <div className="divide-y divide-slate-200 border-y border-slate-200">
                          <Link
                            href={`/${pref.code}/naishin`}
                            aria-label={`${pref.name}の内申点計算`}
                            className="flex min-h-[44px] items-center justify-between gap-2 px-1 text-sm font-bold text-brand-700 hover:bg-brand-50"
                          >
                            内申点計算
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </Link>
                          <Link
                            href={`/${pref.code}`}
                            aria-label={`${pref.name}の攻略ガイド`}
                            className="flex min-h-[44px] items-center justify-between gap-2 px-1 text-sm font-bold text-brand-700 hover:bg-brand-50"
                          >
                            攻略ガイド
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </Link>
                          <Link
                            href={`/pref/${pref.code}`}
                            aria-label={`${pref.name}の高校別の倍率を見る`}
                            className="flex min-h-[44px] items-center justify-between gap-2 px-1 text-sm font-bold text-brand-700 hover:bg-brand-50"
                          >
                            高校別の倍率を見る
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm tabular-nums text-slate-600">
                          <span>満点: {pref.maxScore}点</span>
                          <span>実技: {pref.practicalMultiplier > 1 ? `${pref.practicalMultiplier}倍` : '等倍'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Bottom Info */}
          <section className="mt-12 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  内申点アップの対策コラム
                </h2>
                <p className="mb-4 text-base leading-[1.8] text-slate-900">
                  計算した後は、どうやって点数を上げるかが重要です。各教科別の対策法や、副教科で「5」を取るための具体的なアクションプランをコラムでまとめています。
                </p>
                <Link
                  href="/blog"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
                >
                  受験攻略コラムを読む
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">
                    最新年度（2026年）に対応
                  </h3>
                  <p className="text-sm leading-[1.8] text-slate-600">毎年の入試制度変更を反映。令和8年度入試に向けた正確なシミュレーションが可能です。</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">
                    公式資料に基づく算出
                  </h3>
                  <p className="text-sm leading-[1.8] text-slate-600">各都道府県教育委員会の「入学者選抜実施要綱」を根拠に、1教科ずつの重みを忠実に再現しています。</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
