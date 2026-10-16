import { ArrowRight, ChevronRight, Home } from '@/components/icons';
import Link from 'next/link';
import { Metadata } from 'next';

import { APP_NAME } from '@/lib/constants';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '運営者情報・監修プロセス | My Naishin - 内申点シミュレーター',
  description: '内申点シミュレーターMy Naishinの運営者情報と、情報の正確性を担保する厳格な検証プロセスについて。現役中学生エンジニアが、各都道府県教育委員会の一次資料を直接解析し、2026年度入試に完全対応したツールを開発・運営しています。',
  alternates: {
    canonical: 'https://my-naishin.com/about',
  },
};

export default function AboutPage() {
  const dataLastVerified = '2026年4月22日';
  const featureLastUpdated = '2026年4月22日';
  const version = 'v2026.4.21';

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '運営者情報', url: 'https://my-naishin.com/about' }
        ]}
      />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        {/* パンくず */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">運営者情報</span>
        </nav>

        {/* ページの頭: 見出し → 最終確認（メタ行）→ 運営の立場 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">運営者情報・信頼性への取り組み</h1>
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
            <div className="flex gap-1">
              <dt className="font-bold">全47都道府県データ検証日:</dt>
              <dd>{dataLastVerified}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-bold">システム・アルゴリズム更新:</dt>
              <dd>{featureLastUpdated}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-bold">バージョン:</dt>
              <dd>{version}</dd>
            </div>
          </dl>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            当サイトは個人による運営であり、各都道府県教育委員会とは直接の関係はありません。<br />
            計算結果はあくまで目安として利用し、最終的な出願判断は必ず公式資料および在籍校の先生にご確認ください。
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10">

          {/* 編集長・開発者へのリンク (E-E-A-T強化) */}
          <Link href="/about/editor-profile" className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50 md:p-6">
            <div className="text-sm font-bold text-slate-600">編集長プロフィール</div>
            <h2 className="mt-1 text-xl font-bold text-slate-900 group-hover:text-brand-700">ないしんパンダ（現役中学生エンジニア）が全データを直接解析</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">
              2026年度（令和8年度）に受験を控える開発者・ないしんパンダが、47都道府県すべての教育委員会資料を読み込み、1点1点の計算式をコードに反映。当事者だからこその「正確さ」と「使いやすさ」を追求しています。
            </p>
            <div className="mt-3 inline-flex min-h-[44px] items-center gap-1 font-bold text-brand-700 underline underline-offset-2">
              詳細なプロフィールを見る <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* 信頼の証拠 */}
          <dl className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-4">
              <dt className="text-xs text-slate-600">教育委員会資料 解析済</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">47都道府県</dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-xs text-slate-600">累計利用者数</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">集計中</dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-xs text-slate-600">最新入試制度を反映</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">月次更新</dd>
            </div>
          </dl>

          <section>
            <h2 className="text-xl font-bold text-slate-900">情報の正確性を担保する3つの「徹底」</h2>
            <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5">
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">1. 教育委員会一次資料の直接解析</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  巷のまとめサイト情報を鵜呑みにせず、各都道府県教育委員会が発表する「令和8年度入学者選抜実施要綱」等の一次資料を直接読み込んでいます。計算ロジックは、すべての県で公式PDFの記述と照合済みです。
                </p>
              </div>

              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">2. 毎月のデータ整合性チェック</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  入試制度は急に変更されることがあります。当サイトでは、主要都道府県の発表を毎月モニタリングし、変更があれば即座に計算ロジックへ反映する体制を整えています。
                </p>
              </div>

              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">3. 誤り報告への「即時」対応</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  ユーザー様からの誤り指摘については、24時間以内に運営が確認し、事実関係を調査した上で修正・反映を行います。「常に最新・正確であること」をサイト運営の最優先事項としています。
                </p>
              </div>
            </div>
          </section>

          {/* お問い合わせへの誘導 */}
          <section className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">制度の変更に気づかれたら</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              各都道府県の入試制度は非常に細かく、稀に特定の学校のみ独自の計算を行うケース等があります。
              もし「自分の志望校と計算が違う」「制度が変わっているようだ」とお気づきの場合は、ぜひ下記よりお知らせください。
              <strong>受験生全員の情報の正確性を守るため、即座に調査・反映いたします。</strong>
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
              >
                誤り報告・お問い合わせ
              </Link>
              <Link
                href="/press"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
              >
                取材・プレスキットはこちら
              </Link>
            </div>
          </section>
        </div>
      </div>
      </div>
    </>
  );
}
