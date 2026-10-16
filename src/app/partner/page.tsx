import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

export const metadata: Metadata = {
  title: '塾・個別指導の集客パートナー募集｜内申点計算サイトからの送客 | My Naishin',
  description:
    '全国47都道府県の中学生・保護者が使う内申点・偏差値の計算サイト「My Naishin」から、貴塾・貴教室へ受験意欲の高い見込み客を送客します。地域・面を指定した送客、無料体験への動線、ウィジェット提供まで。資料請求・無料体験のCPA提携、または直接送客契約をご相談ください。',
  keywords: ['塾 集客', '塾 送客', '個別指導 集客', '塾 提携', '教育 アフィリエイト 塾', '塾 リード獲得'],
  alternates: { canonical: `${SITE_URL}/partner` },
  openGraph: {
    title: '塾・個別指導の集客パートナー募集｜内申点計算サイトからの送客 | My Naishin',
    description: '受験意欲の高い中学生・保護者を、地域・面を指定して貴塾へ送客。CPA提携／直接送客契約をご相談ください。',
    url: `${SITE_URL}/partner`,
    type: 'website',
  },
};

const VALUE = [
  {
    title: '受験意欲の高い見込み客',
    body: '内申点・偏差値・志望校との差を「自分で計算しに来る」生徒・保護者。今まさに対策を探している層なので、無料体験・資料請求への転換が見込めます。',
  },
  {
    title: '地域・面を指定した送客',
    body: '都道府県別・ページ種別（計算結果・偏差値・学費など）で出し分け可能。貴塾の商圏に絞った送客や、保護者向け／生徒向けの出し分けに対応します。',
  },
  {
    title: '一次データに基づく実績レポート',
    body: 'クリックは自社ドメインの計測（/go・D1）で記録するため、欠測の少ない実数で「どの地域・面から何クリック送ったか」を月次レポートでご提示できます。',
  },
  {
    title: '無料ウィジェットの提供',
    body: '内申点・評定平均の計算ツールを貴塾サイトに無料で埋め込めます。コンテンツSEOの強化と、自然な無料体験への導線づくりに使えます。',
  },
];

const STEPS = [
  { n: '1', t: 'お問い合わせ', d: '下のフォームから、塾名・対応地域・希望（CPA提携／直接送客／ウィジェット）をお知らせください。' },
  { n: '2', t: '送客プランのご相談', d: '商圏（都道府県）・出し分ける面・成果地点（無料体験／資料請求／入塾）をすり合わせます。' },
  { n: '3', t: '計測して送客開始', d: '専用の計測リンクを設定し、地域・面別のクリック実数を記録。月次でレポートをご提供します。' },
  { n: '4', t: '実績で最適化', d: '効いた地域・面に送客を寄せ、CPA・条件を実績ベースで見直します。' },
];

export default function PartnerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '塾・個別指導の集客パートナー募集', url: `${SITE_URL}/partner` },
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline"><Home className="h-4 w-4" />ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">集客パートナー募集</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">受験意欲の高い中学生・保護者を、貴塾へ。</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「My Naishin」は、全国47都道府県の中学生・保護者が<strong>内申点・偏差値・志望校との差</strong>を計算しに来るサイトです。
              いままさに受験対策を探している層を、<strong>地域・面を指定して</strong>貴塾・貴教室へ送客します。
            </p>
          </header>

          {/* 信頼の数値（捏造しない・定性表現） */}
          <dl className="mb-10 grid grid-cols-2 gap-px border-y border-slate-200 bg-slate-200 sm:grid-cols-4">
            {[
              { k: '対応エリア', v: '全国47都道府県' },
              { k: '主な利用者', v: '中学生・保護者' },
              { k: '送客の成果地点', v: '無料体験・資料請求' },
              { k: '計測', v: '一次データ（実数）' },
            ].map((s) => (
              <div key={s.k} className="bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-600">{s.k}</dt>
                <dd className="mt-1 text-base font-bold text-slate-900">{s.v}</dd>
              </div>
            ))}
          </dl>

          {/* 価値 */}
          <section className="mb-10 grid gap-4 sm:grid-cols-2">
            {VALUE.map((v) => (
              <div key={v.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">{v.title}</h2>
                <p className="text-sm leading-[1.8] text-slate-600">{v.body}</p>
              </div>
            ))}
          </section>

          {/* 提携の形 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">提携の形</h2>
            <ul className="list-disc space-y-3 pl-5 text-base leading-[1.8] text-slate-900">
              <li><strong>CPA提携</strong>：無料体験・資料請求などの成果1件ごとの成果報酬。ASP経由でも、直接でも可。</li>
              <li><strong>直接送客契約</strong>：商圏（都道府県）を指定した独占的な送客。実績に応じてCPA・条件を設計。</li>
              <li><strong>ウィジェット提供</strong>：内申点・評定平均の計算ツールを貴塾サイトへ無料で埋め込み（SEO・回遊強化）。</li>
              <li><strong>掲載枠スポンサー（県×面）</strong>：都道府県・ページ種別を指定した月額固定の掲載枠。成果報酬ではなく定額でのご出稿をご希望の場合はこちらをご相談ください（「広告」表記込み・商圏の独占可）。</li>
            </ul>
          </section>

          {/* 生徒配布資料・データ提供 */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">生徒配布資料・データ提供</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">生徒配布用の印刷資料</h3>
                <p className="mb-3 text-sm leading-[1.8] text-slate-600">
                  都道府県別の内申点計算方法・注意点・出典をまとめたA4印刷対応ページを、入塾説明・体験授業時の配布資料としてそのままご利用いただけます。無料・出典明記済みです。
                </p>
                <Link href="/pref/tokyo" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  印刷対応ページの例（東京都）を見る<ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">データ提供メニュー</h3>
                <p className="mb-3 text-sm leading-[1.8] text-slate-600">
                  47都道府県の内申点・総合得点・偏差値対応表をCSV・APIで提供しています。塾内システムへの組み込みや、自社の指導資料・コンテンツ制作の基礎データとしてご利用いただけます。
                </p>
                <Link href="/developers" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  データ提供・APIの詳細を見る<ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* 模試会社・EdTech SaaS向け（データ連携・V-5） */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">模試会社・教育SaaS運営者様へ（データ連携）</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              内申点×合否判定は貴社の本業そのものかと思います。全国47都道府県の公立高校入試における
              <strong>内申点（調査書点）・総合得点（内申×当日点）・偏差値</strong>の計算方式を機械可読データ化し、
              REST API・MCP（AIエージェント向け）の両方で提供しています。貴社の模試成績帳票・塾管理SaaS・進路指導システムに
              都道府県ごとに異なる計算ロジックを組み込むことで、開発コストをかけずに47都道府県対応の合否判定・内申点表示を実現できます。
            </p>
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              <li className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                <code className="text-sm text-slate-900 sm:w-72 sm:shrink-0">GET /api/naishin/{'{code}'}</code>
                <span className="text-sm text-slate-600">都道府県別の内申点計算</span>
              </li>
              <li className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                <code className="text-sm text-slate-900 sm:w-72 sm:shrink-0">GET /api/total-score/{'{code}'}</code>
                <span className="text-sm text-slate-600">内申×当日点の総合得点（S値・K値等）</span>
              </li>
              <li className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                <code className="text-sm text-slate-900 sm:w-72 sm:shrink-0">GET /api/hensachi</code>
                <span className="text-sm text-slate-600">偏差値・上位パーセンタイル計算</span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              データ連携・API組み込みではなく、成績帳票・Webサイトへの掲載枠（スポンサー掲載）にご興味があれば、そちらの形でのご相談も可能です。
              媒体資料（トラフィック・カバレッジ実績）は<Link href="/contact" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">お問い合わせ</Link>いただければ個別にお送りします。
            </p>
            <div className="mt-2">
              <Link href="/developers" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                API/MCPの詳細仕様を見る（/developers）<ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* 流れ */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">提携までの流れ</h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">
                    <span className="tabular-nums">{s.n}.</span> {s.t}
                  </h3>
                  <p className="text-sm leading-[1.8] text-slate-600">{s.d}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">まずはお気軽にご相談ください</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">
              塾名・対応地域・ご希望（CPA提携／直接送客／ウィジェット）をお書き添えのうえ、お問い合わせフォームよりご連絡ください。担当より折り返しご連絡します。
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
                お問い合わせフォームへ
              </Link>
              <Link href="/embed" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                ウィジェットを見る
              </Link>
            </div>
          </section>

          <p className="mt-8 text-sm leading-[1.8] text-slate-600">
            ※ 送客実績はクリック実数（一次データ）でご提示します。成果の確定・報酬条件は提携形態により異なります。
          </p>
          <p className="mt-2 text-sm leading-[1.8] text-slate-600">
            学校・進路指導のご担当者様は<Link href="/for-teachers" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">先生・進路指導のご担当者様へ</Link>のページもご覧ください。
          </p>
        </div>
      </div>
    </>
  );
}
