import type { Metadata } from 'next';
import Link from 'next/link';
import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import { getAllPosts } from '@/lib/blog-data';
import { HOME_FAQS } from '@/lib/home-faq-content';
import HomeClient from './HomeClient';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { PrefectureNaishinTable } from '@/components/PrefectureNaishinTable';
import { KantenHyokaOfficial } from '@/components/KantenHyokaOfficial';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { Check, ChevronRight, Calendar, Clock, ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  // pos3.4まで上昇したが「内申点 計算」CTRは8.6%で身内の高CTR面（14〜16%）の半分止まり。
  // /hyotei-heikin・/tokyo/total-score・/kanagawa/s-value等の高CTR面と同じ「【無料/対象】+具体的な速さ訴求」の型に
  // 揃えるため、トップ固有のtitleを新設（親layoutのdefaultタイトルは他ページのフォールバックとして維持）。
  // 2026-08-01(改善モードL-1): GSC実測(6/30-7/28・28日)で「換算内申 計算」等の「換算内申」クラスタが
  // imp計約2000・CTR2〜5%台とメインクラスタ(内申点 計算=CTR9.26%)より弱いと判明。titleは主力語(内申点 計算)を
  // 維持したまま変更せず、descriptionに用語「換算内申」を明示追加(従来は「換算方式」という言い換えのみで
  // 検索語との完全一致が無かった)。FAQにも「換算内申とは」を新設(home-faq-content.ts)。
  title: '内申点 計算サイト【全国47都道府県・無料】評定から30秒で自動算出 | My Naishin',
  description:
    '【完全無料】内申点 計算サイト。9教科の評定を入れるだけで、全国47都道府県の換算内申（東京都の実技4教科倍率等の換算方式・対象学年も反映）に対応した内申点を30秒で自動計算。志望校のボーダー比較・評定平均・偏差値も同時にチェック。登録不要・2026年度（令和8年度）入試対応。',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '内申点 計算サイト【全国47都道府県・無料】評定から30秒で自動算出 | My Naishin',
    description: '全国47都道府県の内申点計算に対応。9教科の評定を入れるだけで自動計算、志望校からの逆算機能つき。',
  },
  twitter: {
    title: '内申点 計算サイト【全国47都道府県・無料】評定から30秒で自動算出 | My Naishin',
  },
};

export default function Page() {
  const latestPosts = getAllPosts().slice(0, 5);
  const sidebarPosts = latestPosts.slice(0, 3);

  return (
    <>
      <FAQPageSchema faqItems={HOME_FAQS} />
      <HowToSchema
        id="howto-naishin"
        name="内申点を計算する方法"
        description="都道府県を選んで9教科の評定を入力するだけで、その都道府県の計算方式に従った内申点を自動計算する手順。"
        totalTime="PT1M"
        steps={[
          { name: '都道府県を選ぶ', text: '内申点の計算方式（満点・対象学年・実技教科の倍率）は都道府県ごとに異なるため、まず自分の都道府県を選択します。' },
          { name: '9教科の評定を入力する', text: '国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭の評定（1〜5）を入力します。' },
          { name: '結果を確認する', text: '選択した都道府県の方式に従って内申点が自動計算され、満点に対する達成率や目標との差も同時に表示されます。' },
        ]}
      />
      {/* GEO: AIに「出典として引用される」ためのデータセット定義 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: '全国47都道府県 内申点 計算方式データ',
            description:
              '全国47都道府県の内申点（調査書点）の計算方式・満点・対象学年・実技4教科の倍率。各都道府県教育委員会の入学者選抜要綱に基づく一次データ。',
            inLanguage: 'ja',
            creator: { '@type': 'Organization', name: 'My Naishin', url: 'https://my-naishin.com/' },
            publisher: {
              '@type': 'Organization',
              name: 'My Naishin',
              url: 'https://my-naishin.com/',
              logo: { '@type': 'ImageObject', url: 'https://my-naishin.com/favicon.svg' },
            },
            spatialCoverage: '日本（47都道府県）',
            variableMeasured: ['内申点満点', '対象学年', '実技4教科の倍率'],
            url: 'https://my-naishin.com/',
            isAccessibleForFree: true,
            license: 'https://my-naishin.com/developers',
            distribution: [
              {
                '@type': 'DataDownload',
                encodingFormat: 'application/json',
                contentUrl: 'https://my-naishin.com/api/naishin',
              },
            ],
          }),
        }}
      />
      <HomeClient />

      {/* Latest Articles — homepage funnel */}
      <section className="mx-auto max-w-5xl px-4 pt-12">
        {/* 外側は枠で囲まない（カードの中にカードを入れない）。枠を持つのは記事カードだけ。 */}
        <div>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">最新の受験コラム</h2>
              <p className="mt-1 text-sm text-slate-600">
                内申点アップ・志望校選び・実技対策など、最新の入試情報を発信中。
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              すべての記事
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:border-brand-700 hover:bg-brand-50"
              >
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-slate-700">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="flex-1 text-base font-bold leading-snug text-slate-900 line-clamp-3">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Optimized Content Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column（min-w-0: gridトラックが内部の広い要素で押し広げられ右が見切れるのを防ぐ） */}
          <div className="min-w-0 lg:col-span-2 space-y-12">
            <div>
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                2026年度（令和8年度）入試対応の内申点計算
              </h2>
              <div className="space-y-4 text-base leading-[1.8] text-slate-900">
                <p>
                  My Naishinは、現役の中学生とその保護者のために開発された、<strong>全国47都道府県の最新計算方式に完全対応</strong>した内申点計算サイトです。
                  高校受験において、内申点（調査書点）は当日の学力検査と同様に、あるいはそれ以上に合否を分ける重要な要素です。
                </p>
                <p>
                  自分の地域のルールを正確に把握していなければ、効率的な受験戦略を立てることはできません。当サイトでは、各都道府県教育委員会が発表した最新の選抜基準に基づき、正確な計算機能と詳細な解説を提供しています。
                </p>
              </div>
            </div>

            {/* 5教科 偏差値計算サイトへの内部リンク強化（SEO: 偏差値計算サイト 5教科 / 中学生） */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <span className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                内申点と合わせて使う
              </span>
              <h3 className="mb-3 text-[17px] font-bold leading-snug text-slate-900">
                5教科の偏差値・評定平均も無料で算出（中学生・高校生対応）
              </h3>
              <p className="mb-4 text-base leading-[1.8] text-slate-900">
                内申点と並んで合否を左右するのが <strong>5教科の偏差値</strong>。
                <Link href="/hensachi" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  偏差値計算サイト（5教科対応・中学生/高校生）
                </Link>
                では、点数・平均点・標準偏差から自分の偏差値を瞬時に算出。教科別の偏差値や、平均点しか分からない場合の簡易モードにも対応しています。通知表からそのまま入力できる
                <Link href="/hyotei-heikin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  評定平均の自動計算ツール
                </Link>
                と組み合わせれば、内申点・評定平均・偏差値を一気通貫で把握でき、志望校との距離をひと目で確認できます。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/hensachi"
                  className="inline-flex min-h-12 items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
                >
                  5教科の偏差値を計算する
                </Link>
                <Link
                  href="/hyotei-heikin"
                  className="inline-flex min-h-12 items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
                >
                  評定平均を計算する
                </Link>
              </div>
            </div>

            {/* 都立高校 総合得点（1020点）計算ツールへの内部リンク強化 */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <span className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                東京都の受験生向け
              </span>
              <h3 className="mb-3 text-[17px] font-bold leading-snug text-slate-900">
                都立高校 総合得点（1020点満点）計算サイト ─ 学力検査・調査書点・ESAT-Jを一括算出
              </h3>
              <p className="mb-4 text-base leading-[1.8] text-slate-900">
                都立高校の一般入試は、<strong>学力検査700点＋調査書点300点＋ESAT-J 20点＝1020点満点</strong>の総合得点で合否が決まります。「都立高校 総合得点 計算サイト」では、3つの要素を入力するだけで合計点と志望校の合格目安までの距離を瞬時に算出。日比谷・西・国立・戸山など主要都立高校のボーダー比較にも対応しています。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tokyo/total-score"
                  className="inline-flex min-h-12 items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
                >
                  都立 総合得点を計算する（1020点）
                </Link>
                <Link
                  href="/tokyo/naishin"
                  className="inline-flex min-h-12 items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
                >
                  東京都の内申点だけ計算する
                </Link>
              </div>
            </div>

            {/* 都道府県別の合否判定ツール（新設の種火ページへ評価を流す内部リンクハブ） */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <span className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                総合得点・合否判定
              </span>
              <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">
                都道府県別の「総合得点・合否判定」計算ツール
              </h3>
              <p className="mb-4 text-base leading-[1.8] text-slate-900">
                内申点だけでなく、当日点を合わせた総合得点や合否判定の方式は都道府県で大きく異なります（S値・タイプ・K値・評価方法・学年比率など）。主要県の専用ツール・早見表はこちら。
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: '/tokyo/total-score', label: '東京 総合得点（1020点）' },
                  { href: '/kanagawa/s-value', label: '神奈川 S値' },
                  { href: '/osaka/total-score', label: '大阪 タイプⅠ〜Ⅴ' },
                  { href: '/aichi/total-score', label: '愛知 評価方法Ⅰ〜Ⅴ' },
                  { href: '/chiba/total-score', label: '千葉 K値' },
                  { href: '/saitama/total-score', label: '埼玉 学年比率' },
                  { href: '/fukuoka/total-score', label: '福岡 内申45＋当日300' },
                  { href: '/hokkaido/rank', label: '北海道 内申ランク' },
                ].map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="inline-flex min-h-11 items-center gap-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 hover:border-brand-700 hover:bg-brand-50"
                  >
                    {t.label}
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-bold text-slate-900">
                都道府県別の入試対策・計算ツール
              </h3>
              <div className="grid gap-6">
                {REGIONS.map(region => (
                  <div key={region}>
                    <h4 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-900">{region}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {getPrefecturesByRegion(region).map(pref => (
                        <Link
                          key={pref.code}
                          href={`/${pref.code}`}
                          className="flex min-h-11 items-center rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:border-brand-700 hover:bg-brand-50"
                        >
                          {pref.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 新ツールの発見動線：質問で即回答／成績の継続トラッキング */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/ask"
                  className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-brand-700 hover:bg-brand-50"
                >
                  <span className="block text-base font-bold text-slate-900">内申点クイックアンサー</span>
                  <span className="mt-1 block text-sm leading-[1.8] text-slate-600">
                    「兵庫県は何点満点？」など、47都道府県の検証済みデータで即回答
                  </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-brand-700 hover:bg-brand-50"
                >
                  <span className="block text-base font-bold text-slate-900">成績の記録ダッシュボード</span>
                  <span className="mt-1 block text-sm leading-[1.8] text-slate-600">
                    計算した内申点を保存して、中1→中3の伸びを推移グラフで管理
                  </span>
                </Link>
              </div>
            </div>

            {/* 全国47都道府県の内申点計算方式 比較一覧表（被引用・スニペット獲得用の一次情報アセット） */}
            <PrefectureNaishinTable />

            {/* 「内申点 計算」semantic enrichment：GSCで pos 7 → 3 を狙うためのキーワード密度UP */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                内申点 計算サイトとしてのMy Naishinの強み
              </h2>
              <div className="space-y-3 text-base leading-[1.8] text-slate-900">
                <p>
                  <strong>内申点 計算</strong>を正確に行うには、お住まいの都道府県の最新の換算方式を把握する必要があります。My Naishinは<strong>47都道府県すべての内申点 計算方式</strong>を実装しており、9教科の評定を入力するだけで瞬時に正確な内申点を算出できる無料ツールです。
                </p>
                <p>
                  たとえば<strong>東京都の内申点 計算</strong>は中3のみが対象で、実技4教科を2倍にした「換算内申」65点満点で評価されます。<strong>神奈川県の内申点 計算</strong>は中2＋中3×2で135点満点、<strong>北海道の内申点 計算</strong>は中1〜中3の3年間で315点満点（A〜Mランク）と、地域によって全く異なります。手計算では間違いやすい複雑な計算も、当サイトなら<strong>30秒で正確に算出</strong>できます。
                </p>
                <p>
                  <strong>内申点 計算結果</strong>と志望校のボーダーラインを比較する機能、<strong>志望校から必要な当日点を逆算</strong>する機能、<strong>評定平均・偏差値の同時算出</strong>機能も完備。高校受験で合否を分ける内申点を「計算するだけ」で終わらせず、戦略立案までサポートします。
                </p>
                <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">
                    内申点 計算におけるMy Naishinの5つの特徴
                  </h3>
                  <ul className="space-y-1.5 text-base text-slate-900">
                    <li className="flex items-start gap-2">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-700" />
                      <span><strong>47都道府県完全対応</strong>：各都道府県教育委員会の公式入試要綱を直接読み込んで実装</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-700" />
                      <span><strong>会員登録・課金不要</strong>：完全無料・広告のみで運営</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-700" />
                      <span><strong>30秒で算出</strong>：9教科の評定を入力するだけ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-700" />
                      <span><strong>計算結果の保存</strong>：履歴管理で評定変化を追跡可能</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-700" />
                      <span><strong>志望校との比較</strong>：高校別ボーダーラインを同時表示</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 文科省一次情報ベースの権威コンテンツ（独自性・E-E-A-T・外部権威リンク） */}
            <KantenHyokaOfficial />

            {/* 保護者向けリード導線（収益化の本命：高単価＝オンライン個別の無料体験へ送客） */}
            <ParentLeadCTA
              placement="home"
              heading="お子さまの内申点、志望校に届いていますか？"
              body="内申点は「今からの動き方」で大きく変わります。お子さまに必要な対策を、オンライン個別指導の無料体験で確認できます。全国どこからでも受講でき、費用はかかりません。"
              affiliateId="sora-juku-text"
              ctaText="無料体験を申し込む（そら塾）"
              note="【そら塾】オンライン個別指導の無料体験（PR）"
            />

            <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                内申点を1点でも上げるための3つの鉄則
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-base font-bold tabular-nums text-slate-900">1</span>
                  <p className="min-w-0 text-base leading-[1.8] text-slate-900"><strong>実技教科（副教科）を捨てない：</strong> 多くの県で実技教科は1.5倍〜2倍の配点になります。主要5教科で「5」を取るより、実技で「3」を「4」に上げる方が遥かに効率的です。</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-base font-bold tabular-nums text-slate-900">2</span>
                  <p className="min-w-0 text-base leading-[1.8] text-slate-900"><strong>「主体的な態度」を軽視しない：</strong> 2021年度の学習指導要領改訂以降、テストの点数以上に授業への参加姿勢や振り返りシートの記述が評価に直結します。</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-base font-bold tabular-nums text-slate-900">3</span>
                  <p className="min-w-0 text-base leading-[1.8] text-slate-900"><strong>志望校の「計算比率」を知る：</strong> 内申と当日点の比率が3:7の学校と7:3の学校では、対策が全く異なります。自分の持ち点に合わせた学校選びが逆転合格の鍵です。</p>
                </li>
              </ol>
            </div>

            {/* 内申点 計算 関連 FAQ（FAQPageSchema と一致した可視テキスト） */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                内申点 計算サイトのよくある質問
              </h2>
              {/* 質問は枠で囲まず、罫線で区切った行にする（カードの中にカードを入れない） */}
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {HOME_FAQS.map((faq, i) => (
                  <details key={i} className="group open:bg-brand-50">
                    <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 px-3 py-3 hover:bg-brand-50 [&::-webkit-details-marker]:hidden">
                      <span className="font-bold text-brand-700">Q.</span>
                      <span className="flex-1 text-base font-bold text-slate-900">{faq.question}</span>
                      <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-slate-600 group-open:rotate-90" />
                    </summary>
                    <div className="px-3 pb-4">
                      <div className="flex items-start gap-3">
                        <span className="font-bold text-slate-900">A.</span>
                        <p className="flex-1 text-base leading-[1.8] text-slate-900">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4">
                <p className="text-sm leading-[1.8] text-slate-900">
                  もっと詳しく知りたい方は <Link href="/blog/naishin-guide" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">内申点ガイド</Link>・<Link href="/blog/how-to-raise-naishinten" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">内申点の上げ方</Link>・<Link href="/blog/naishinten-average-score" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">内申点の平均は何点？</Link>・<Link href="/naishin-kakusa" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">都道府県別 内申点格差レポート</Link>・<Link href="/koukou-hiyou" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">高校の費用シミュレーター</Link>・<Link href="/blog" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">受験コラム一覧</Link>へ
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar/Right Column（PC: stickyで本文が長くても右側が空かないよう追従＋回遊モジュール増設） */}
          <div className="min-w-0">
            <div className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
              <h3 className="mb-3 font-bold text-slate-900">
                情報の正確性について
              </h3>
              <p className="text-sm text-slate-900 leading-[1.8]">
                当サイトの情報は、全国47都道府県の教育委員会が発表した2026年度（令和8年度）入学者選抜の最新実施要綱を元に作成されています。
              </p>
              <div className="mt-3 border-t border-slate-200 pt-2">
                <Link href="/quality" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  情報の信頼性への取り組み <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 回遊モジュール：無料の計算ツール（内部リンク強化＋右側を埋める） */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-2 font-bold text-slate-900">
                無料の計算ツール
              </h3>
              <ul className="divide-y divide-slate-200">
                {[
                  { href: '/hensachi', label: '偏差値計算（5教科）' },
                  { href: '/hyotei-heikin', label: '評定平均 計算' },
                  { href: '/reverse', label: '志望校から逆算' },
                  { href: '/kyouiku-hi', label: '教育費シミュレーター' },
                  { href: '/koukou-hiyou/kokoroze', label: '公立vs私立 3年総額の比較' },
                  { href: '/hiyou', label: 'お金・費用まとめ' },
                ].map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="flex min-h-11 items-center justify-between gap-2 py-2 text-sm text-slate-900 hover:text-brand-800 hover:underline"
                    >
                      {tool.label}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 回遊モジュール：よく見られる都道府県（高トラフィック県への内部リンク） */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-slate-900">
                よく見られる都道府県
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'tokyo', name: '東京都' },
                  { code: 'kanagawa', name: '神奈川県' },
                  { code: 'osaka', name: '大阪府' },
                  { code: 'hyogo', name: '兵庫県' },
                  { code: 'hokkaido', name: '北海道' },
                  { code: 'aichi', name: '愛知県' },
                  { code: 'saitama', name: '埼玉県' },
                  { code: 'fukuoka', name: '福岡県' },
                ].map((pref) => (
                  <Link
                    key={pref.code}
                    href={`/${pref.code}/naishin`}
                    className="flex min-h-11 items-center rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:border-brand-700 hover:bg-brand-50"
                  >
                    {pref.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/prefectures"
                className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                47都道府県すべて見る
              </Link>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-4 font-bold text-slate-900">
                最新の受験コラム
              </h3>
              <div className="space-y-4">
                {sidebarPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                    <p className="text-sm text-slate-900 group-hover:text-brand-800 group-hover:underline line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(post.lastUpdated ?? post.date).toLocaleDateString('ja-JP')}更新
                    </p>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                記事一覧を見る
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
