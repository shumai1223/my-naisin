import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Calculator,
  TrendingUp,
  Percent,
  Target,
  MapPin,
} from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentLeadCTAPositionProvider, ParentLeadCTAPositionSlot } from '@/components/ParentLeadCTAPositionSlot';
import { ParentShareBanner } from '@/components/ParentShareBanner';
import { HogoshaLeadCTA } from '@/components/HogoshaLeadCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { SITE_URL } from '@/lib/naishin-dataset';
import { parseParentShare, encodeSharePayload } from '@/lib/share';

const PARENT_FAQS = [
  {
    question: '塾はいつから通わせるべきですか？',
    answer:
      '一般的には中2の冬〜中3の春が一つの目安ですが、内申点は中1から評価対象になる地域が多いため、内申を重視する地域（東京・神奈川など）では早めの対策が有利です。まずはお子さまの現状の内申点・偏差値を把握し、志望校との差を確認してから判断するのがおすすめです。多くの塾は無料体験・無料の資料請求ができるので、複数を比較してから決めると失敗しにくいです。',
  },
  {
    question: '内申点は親が見て上げる手助けはできますか？',
    answer:
      'できます。内申点は定期テストの点数だけでなく、提出物・授業態度・小テストなど日々の積み重ねで決まります。家庭では「提出物の期限管理」「苦手教科の早期発見」「テスト2週間前からの計画づくり」を支えるだけでも効果があります。当サイトの内申点計算ツールで、どの教科を上げると内申が伸びやすいか（実技の倍率が高い地域もあります）を数値で確認できます。',
  },
  {
    question: '内申点と偏差値、どちらを優先して対策すべき？',
    answer:
      '地域によります。東京・神奈川など内申比率の高い地域では内申点を、当日点（学力検査）比率の高い地域では模試偏差値を優先します。当サイトの都道府県別ページで、お住まいの地域の配点比率を確認できます。多くの場合は両方をバランスよく伸ばすのが合格への近道です。',
  },
  {
    question: '受験対策にかかる費用の目安は？',
    answer:
      '通信教育は月数千円〜、集団塾・個別指導は月1〜4万円程度が一般的な目安です（地域・学年・コマ数で変動）。費用は家計に直結するので、無料体験や無料の資料請求でカリキュラム・費用・通いやすさを比較してから決めると納得感があります。当サイトはご家庭の比較検討を後押しする情報を無料で提供しています。',
  },
  {
    question: 'このサイトは無料で使えますか？保護者でも使えますか？',
    answer:
      'はい、すべて無料・会員登録不要でご利用いただけます。保護者の方がお子さまの成績を入力して内申点・偏差値・志望校との差を確認するのにそのままお使いいただけます。結果はLINEやメールで受け取って保存することもできます。',
  },
];

const BASE_METADATA: Metadata = {
  title: '保護者の方へ｜高校受験で親ができること・塾はいつから・費用の目安 | My Naishin',
  description:
    '高校受験は保護者のサポートで結果が変わります。内申点の上げ方、塾はいつから通うべきか、費用の目安、内申点と偏差値どちらを優先するかを、当事者目線でわかりやすく解説。お子さまの内申点・偏差値・志望校との差を無料ツールで今すぐ確認できます。',
  keywords: [
    '高校受験 親ができること',
    '内申点 上げ方 親',
    '塾 いつから 中学生',
    '高校受験 塾 費用',
    '内申点 偏差値 どっち',
    '中学生 保護者',
    '高校受験 サポート',
    '資料請求 塾',
  ],
  alternates: { canonical: `${SITE_URL}/hogosha` },
  openGraph: {
    title: '保護者の方へ｜高校受験で親ができること・塾はいつから・費用の目安 | My Naishin',
    description:
      '内申点の上げ方・塾はいつから・費用の目安を当事者目線で解説。お子さまの成績と志望校との差を無料ツールで確認。',
    url: `${SITE_URL}/hogosha`,
    type: 'website',
  },
};

/**
 * 動的OGP（P2-4）：共有リンク（?from=share&...）で来たときは、お子さまの成績レポート画像
 * （/api/card）を og:image / twitter:image に差す。LINE 等のプレビューが「数値入りの成績カード」
 * になり、保護者の開封率が上がる＝橋②バトンの受け手到達率を底上げする。
 * 共有文脈が無い通常アクセスでは BASE_METADATA をそのまま返す（=従来どおり）。
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const share = parseParentShare(sp);
  if (!share.isShare || typeof share.score !== 'number') return BASE_METADATA;

  const d = encodeSharePayload({
    score: share.score,
    max: typeof share.max === 'number' ? share.max : 45,
    target: typeof share.target === 'number' ? share.target : null,
    gap: typeof share.gap === 'number' ? share.gap : null,
    prefectureCode: share.prefectureCode,
    prefectureName: share.prefectureName,
    grade: typeof share.grade === 'number' ? share.grade : null,
    label: share.label,
    metricLabel: share.metricLabel,
    // ZZ-5b修正：percentile/percentileScopeが抜けていたため、LINE/X等でリンクを共有し
    // OGPが再生成される経路(このgenerateMetadata)では「県内位置」チップが消えていた
    // (クライアント側の<img>直接表示は正しく表示されていた＝この経路のみのバグ)。
    percentile: typeof share.percentile === 'number' ? share.percentile : null,
    percentileScope: share.percentileScope ?? null,
  });
  const cardUrl = `${SITE_URL}/api/card?d=${encodeURIComponent(d)}`;
  const alt = `${share.prefectureName ?? ''}${share.metricLabel ?? '内申点'}の成績レポート`;

  return {
    ...BASE_METADATA,
    openGraph: {
      ...BASE_METADATA.openGraph,
      images: [{ url: cardUrl, width: 1200, height: 630, alt }],
    },
    twitter: { card: 'summary_large_image', images: [cardUrl] },
  };
}

const TOOLS = [
  {
    href: '/',
    icon: Calculator,
    title: '内申点を計算する',
    desc: '9教科の評定を入れるだけ。全国47都道府県の最新方式に対応。',
  },
  {
    href: '/hensachi',
    icon: TrendingUp,
    title: '偏差値を計算する',
    desc: '点数と平均点から偏差値を30秒で算出。上位何%かもわかる。',
  },
  {
    href: '/hyotei-heikin',
    icon: Percent,
    title: '評定平均を計算する',
    desc: '推薦のカギになる評定平均を計算。基準早見表つき。',
  },
  {
    href: '/reverse',
    icon: Target,
    title: '志望校から逆算する',
    desc: '目標校から必要な内申点・当日点を逆算。今の現在地がわかる。',
  },
  {
    href: '/prefectures',
    icon: MapPin,
    title: '都道府県別の入試制度',
    desc: 'お住まいの地域の配点比率・内申の比重を確認できる。',
  },
];

const PARENT_ACTIONS = [
  {
    title: '1. 現在地を「数値」で把握する',
    body: 'まずはお子さまの内申点・偏差値を計算し、志望校との差を確認します。感覚ではなく数値で見ると、家庭での声かけも具体的になります。',
  },
  {
    title: '2. 早めに動く（内申は中1から）',
    body: '内申点は中1から評価される地域が多く、提出物・授業態度・定期テストの積み重ねで決まります。早く現状を知るほど、打てる手が増えます。',
  },
  {
    title: '3. 無料で比較してから決める',
    body: '塾・通信教育は無料体験や無料の資料請求ができます。費用・カリキュラム・通いやすさを比較してから選ぶと、ミスマッチを避けられます。',
  },
];

export default function HogoshaPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '保護者の方へ', url: `${SITE_URL}/hogosha` },
        ]}
      />
      <FAQPageSchema faqItems={PARENT_FAQS} />

      <ParentLeadCTAPositionProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">保護者の方へ</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">保護者の方へ</h1>
            {/* 橋②バトンの着地：生徒が共有したリンク（?from=share）で来た保護者に、結果を文脈付きで提示。
                useSearchParams を内包するため Suspense で包み、/hogosha は静的（SSG）のまま維持する。
                見出しの順（h1 → h2）を保つため、h1 の直後に置く（以前は h1 より前で、h2 が先に来ていた）。 */}
            <Suspense fallback={null}>
              <ParentShareBanner />
            </Suspense>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              高校受験は、ご家庭のサポートで結果が大きく変わります。<br />
              <strong>内申点の上げ方</strong>・<strong>塾はいつから</strong>・<strong>費用の目安</strong>を当事者目線で整理しました。
              まずはお子さまの「現在地」を無料の計算ツールで確認してみませんか。
            </p>
          </header>

          {/* 保護者向けリード（最上部・最高インテント）。
              共有元の県で地域最適化（関西=個別指導キャンパス／関東=森塾）。
              SSG静的HTMLには素のCTA（fallback）が残り、クライアントで地域版に差し替わる＝SEOも担保。 */}
          <Suspense fallback={<ParentLeadCTA placement="parent-lp" className="mb-10" headingLevel="h2" />}>
            <HogoshaLeadCTA className="mb-10" />
          </Suspense>

          {/* 配置順A/B(parent-lp-order-2026)がabove-foldを選んだクライアントのみ、ここに
              コピーA/B(hogosha-cta-text-2026)のCTAをもう1つ表示する（controlは記事末に表示）。 */}
          <ParentLeadCTAPositionSlot
            slot="above-fold"
            copyExperimentId="hogosha-cta-text-2026"
            placement="parent-lp"
            className="mb-10"
          />

          {/* 保護者ができる3つのこと */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">保護者ができる3つのこと</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {PARENT_ACTIONS.map((a) => (
                <div
                  key={a.title}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900">{a.title}</h3>
                  <p className="text-sm leading-[1.8] text-slate-600">{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TIER Σ-2（2026-08-02）: 「①結果 ②意味 ③次にやること ④費用の現実」の④に当たる
              費用リンク集を、従来の「ツール/保存」の後(6番目)からここ(③の直後)へ前倒し。
              保護者は子の結果を見に来るのであって塾を探しに来るのではない＝費用の現実を
              早めに見せる方が「次にやること」の文脈と繋がる。新規リンクは足していない。 */}
          <RelatedToolsSection
            className="mb-10"
            links={[
              { href: '/hiyou', title: 'お金・費用まとめ', desc: '教育費・高校学費・塾代・高校無償化を一括で把握' },
              { href: '/kyouiku-hi', title: '教育費シミュレーター', desc: '中学〜高校卒業までの総額を内訳つきで試算' },
              { href: '/shougakukin', title: '高校無償化・就学支援金ガイド', desc: '公立・私立別の支援額と世帯年収の目安' },
              { href: '/comparison', title: '都道府県の入試制度を比較', desc: '内申比率・配点方式を地域ごとに比較' },
              { href: '/mendan', title: '三者面談の準備チェックリスト', desc: '先生に聞くこと・持ち物・面談前に確認する数値' },
              { href: '/blog', title: '受験攻略コラム', desc: '内申点の上げ方・副教科で5を取る戦略など' },
              {
                href: 'https://my-shingaku.com',
                title: '大学進学の費用を調べる（姉妹サイト）',
                desc: '一人暮らし・学費・奨学金の目安（My Shingaku）',
                external: true,
              },
            ]}
          />

          {/* ツール導線 */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">無料で使えるツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group flex min-h-[44px] items-start gap-3 rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-base font-bold text-brand-700 group-hover:underline">
                        {t.title}
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </div>
                      <p className="mt-1 text-sm leading-[1.8] text-slate-600">{t.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 結果の保存（名簿化） */}
          <SaveResultCTA
            source="home"
            heading="お子さまの受験情報を、受験本番まで無料で受け取りませんか？"
            body="内申点アップのコツ・出願スケジュール・志望校の最新情報を、保護者の方へお届けします。LINEまたはメールで、いつでも解除できます。"
            className="mb-10"
            headingLevel="h2"
          />

          {/* 保護者FAQ */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">保護者の方からよくある質問</h2>
            <div className="space-y-3">
              {PARENT_FAQS.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-lg border border-slate-200 bg-white px-5"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-slate-900 marker:hidden">
                    <span className="flex min-h-[44px] items-center justify-between gap-3 py-2">
                      {f.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="pb-5 text-base leading-[1.8] text-slate-900">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 保護者向けリード（記事末・読了者向け既定位置）。位置A/B(parent-lp-order-2026)がabove-foldを
              選んだクライアントではここには出さずヘッダー直後に表示する（重複防止はProviderで排他制御済み）。 */}
          <ParentLeadCTAPositionSlot
            slot="article-end"
            copyExperimentId="hogosha-cta-text-2026"
            placement="parent-lp"
          />

          <p className="mt-8 text-sm leading-[1.8] text-slate-600">
            掲載の塾・通信教育情報には広告（PR）を含みます。費用や内容は各社の公式サイトでご確認ください。
          </p>
        </div>
      </div>
      </ParentLeadCTAPositionProvider>
    </>
  );
}
