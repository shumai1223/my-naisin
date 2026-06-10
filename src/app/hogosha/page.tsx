import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Heart,
  Calculator,
  TrendingUp,
  Percent,
  Target,
  MapPin,
  ShieldCheck,
  Clock,
  Wallet,
  MessageCircleQuestion,
} from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentLeadCTAExperiment } from '@/components/ParentLeadCTAExperiment';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { SITE_URL } from '@/lib/naishin-dataset';

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

export const metadata: Metadata = {
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

const TOOLS = [
  {
    href: '/',
    icon: Calculator,
    title: '内申点を計算する',
    desc: '9教科の評定を入れるだけ。全国47都道府県の最新方式に対応。',
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    href: '/hensachi',
    icon: TrendingUp,
    title: '偏差値を計算する',
    desc: '点数と平均点から偏差値を30秒で算出。上位何%かもわかる。',
    accent: 'from-purple-500 to-indigo-600',
  },
  {
    href: '/hyotei-heikin',
    icon: Percent,
    title: '評定平均を計算する',
    desc: '推薦のカギになる評定平均を計算。基準早見表つき。',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    href: '/reverse',
    icon: Target,
    title: '志望校から逆算する',
    desc: '目標校から必要な内申点・当日点を逆算。今の現在地がわかる。',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    href: '/prefectures',
    icon: MapPin,
    title: '都道府県別の入試制度',
    desc: 'お住まいの地域の配点比率・内申の比重を確認できる。',
    accent: 'from-rose-500 to-pink-600',
  },
];

const PARENT_ACTIONS = [
  {
    icon: Calculator,
    title: '① 現在地を「数値」で把握する',
    body: 'まずはお子さまの内申点・偏差値を計算し、志望校との差を確認します。感覚ではなく数値で見ると、家庭での声かけも具体的になります。',
  },
  {
    icon: Clock,
    title: '② 早めに動く（内申は中1から）',
    body: '内申点は中1から評価される地域が多く、提出物・授業態度・定期テストの積み重ねで決まります。早く現状を知るほど、打てる手が増えます。',
  },
  {
    icon: Wallet,
    title: '③ 無料で比較してから決める',
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">保護者の方へ</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">保護者の方へ</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校受験は、ご家庭のサポートで結果が大きく変わります。<br />
              <strong>内申点の上げ方</strong>・<strong>塾はいつから</strong>・<strong>費用の目安</strong>を当事者目線で整理しました。
              まずはお子さまの「現在地」を無料の計算ツールで確認してみませんか。
            </p>
          </header>

          {/* 保護者向けリード（最上部・最高インテント） */}
          <ParentLeadCTA placement="parent-lp" className="mb-10" />

          {/* 保護者ができる3つのこと */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">保護者ができる3つのこと</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {PARENT_ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-bold text-slate-800">{a.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{a.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ツール導線 */}
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-slate-800">無料で使えるツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div
                      className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        {t.title}
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.desc}</p>
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
          />

          {/* 次の一手（評価を稼ぎ頭・姉妹サイトへ流す） */}
          <RelatedToolsSection
            className="mb-10"
            links={[
              { href: '/guide', title: '高校受験の進め方ガイド', desc: '内申点・偏差値・出願までの全体像を保護者向けに整理' },
              { href: '/comparison', title: '都道府県の入試制度を比較', desc: '内申比率・配点方式を地域ごとに比較' },
              { href: '/koukou-hiyou', title: '高校の費用シミュレーター', desc: '公立・私立の3年間の費用目安を試算' },
              { href: '/blog', title: '受験攻略コラム', desc: '内申点の上げ方・副教科で5を取る戦略など' },
              {
                href: 'https://my-shingaku.com',
                title: '大学進学の費用を調べる（姉妹サイト）',
                desc: '一人暮らし・学費・奨学金の目安（My Shingaku）',
                external: true,
              },
            ]}
          />

          {/* 保護者FAQ */}
          <section className="mb-10">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
              <MessageCircleQuestion className="h-5 w-5 text-emerald-600" />
              保護者の方からよくある質問
            </h2>
            <div className="space-y-3">
              {PARENT_FAQS.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800 marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 保護者向けリード（最下部・読了者）。CTA文言をA/Bテスト（自作A/B基盤） */}
          <ParentLeadCTAExperiment experimentId="hogosha-cta-text-2026" placement="parent-lp" auditHide />

          <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            掲載の塾・通信教育情報には広告（PR）を含みます。費用や内容は各社の公式サイトでご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
