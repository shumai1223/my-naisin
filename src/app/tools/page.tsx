import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator,
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  MapPin,
  LineChart,
  MessageCircleQuestion,
} from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '高校受験の計算ツール一覧｜内申点・偏差値・評定平均・S値【無料】 | My Naishin' },
  description:
    '【無料】高校受験に必要な計算ツールを全部まとめました。内申点（47都道府県対応）・偏差値（5教科）・評定平均・都立1020点総合得点・神奈川S値・大阪総合点・北海道内申ランク・志望校からの逆算まで、登録不要で使えます。2026年度入試対応。',
  keywords: [
    '高校受験 ツール',
    '内申点 ツール',
    '偏差値 計算 ツール',
    '評定平均 計算',
    'S値 計算',
    '内申ランク 計算',
    '当日点 逆算',
  ],
  alternates: { canonical: 'https://my-naishin.com/tools' },
  openGraph: {
    title: '高校受験の計算ツール一覧｜内申点・偏差値・評定平均・S値・総合得点【無料】',
    description:
      '内申点・偏差値・評定平均・S値・1020点総合得点・逆算まで、高校受験の計算ツールを無料でまとめて提供。',
    url: 'https://my-naishin.com/tools',
  },
};

// Tailwind JIT が解決できるよう、色クラスは静的にマップする（bg-${color} のような動的生成は使わない）
const COLOR: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
};

type Tool = {
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: typeof Calculator;
  color: keyof typeof COLOR;
};

const TOOL_GROUPS: { id: string; heading: string; tools: Tool[] }[] = [
  {
    id: 'calculation',
    heading: '内申点・成績の計算ツール',
    tools: [
      {
        title: '内申点 計算サイト（全国47都道府県）',
        description: '9教科の評定を入れるだけで、お住まいの都道府県の方式で内申点を自動計算',
        features: ['47都道府県対応', '実技倍率・学年比対応', '志望校ボーダー比較', '計算結果の保存'],
        href: '/',
        icon: Calculator,
        color: 'blue',
      },
      {
        title: '偏差値計算サイト（5教科）',
        description: '点数・平均点・標準偏差から、中学生・高校生の偏差値を瞬時に算出',
        features: ['5教科対応', '教科別偏差値', '簡易/詳細モード', '高校レベル目安'],
        href: '/hensachi',
        icon: TrendingUp,
        color: 'purple',
      },
      {
        title: '評定平均 自動計算',
        description: '通知表の評定から評定平均（4.2など）と素内申を同時に算出',
        features: ['9教科対応', 'クリック入力', '評定平均＋内申点を同時表示', '推薦入試の出願目安'],
        href: '/hyotei-heikin',
        icon: Calculator,
        color: 'green',
      },
      {
        title: '成績の記録ダッシュボード（推移グラフ）',
        description: '計算した内申点を保存して、中1→中3の伸びを推移グラフで見える化',
        features: ['中1→中3トラッキング', '学期ごとの記録', '目標ラインまでの差', '三者面談用PDF'],
        href: '/dashboard',
        icon: LineChart,
        color: 'orange',
      },
    ],
  },
  {
    id: 'prefecture',
    heading: '都道府県専用の合否判定ツール',
    tools: [
      {
        title: '都立高校 総合得点 計算（1020点満点）',
        description: '学力検査700点＋調査書点300点＋ESAT-J 20点の総合得点を一括算出',
        features: ['1020点満点対応', 'ESAT-J対応', '主要都立の合格目安', '2026年度対応'],
        href: '/tokyo/total-score',
        icon: Target,
        color: 'blue',
      },
      {
        title: '神奈川県 S値 自動計算（S1・S2／1000点）',
        description: '内申・学力検査・特色検査を志望校比率で合算したS値を算出',
        features: ['S1値・S2値対応', '志望校比率（4:6〜2:8）', '特色検査対応', '横浜翠嵐・湘南の目安'],
        href: '/kanagawa/s-value',
        icon: Target,
        color: 'rose',
      },
      {
        title: '大阪府 公立高校 総合点（タイプⅠ〜Ⅴ）',
        description: '学力検査450点・調査書450点を選抜タイプ比率で合算した総合点を算出',
        features: ['タイプⅠ〜Ⅴ対応', '7:3〜3:7比率', '北野・茨木・天王寺の目安', '2026年度対応'],
        href: '/osaka/total-score',
        icon: Target,
        color: 'rose',
      },
      {
        title: '北海道 内申ランク（A〜M）判定',
        description: '内申点315点・学力検査300点からA〜M 13ランクのどこに該当するか判定',
        features: ['A〜M 13ランク', '内申315点満点', '札幌南・札幌北の目安', '2026年度対応'],
        href: '/hokkaido/rank',
        icon: MapPin,
        color: 'rose',
      },
      {
        title: '愛知県 評価方法Ⅰ〜Ⅴ・総合得点',
        description: '内申点（評定得点90）＋学力検査（110）を評価方法Ⅰ〜Ⅴで重み付けする校内順位を解説',
        features: ['評価方法Ⅰ〜Ⅴ', '内申90＋当日110', '評定得点 換算表', '計算例つき'],
        href: '/aichi/total-score',
        icon: Target,
        color: 'rose',
      },
      {
        title: '千葉県 調査書点・K値 計算',
        description: '学力500＋評定135×係数K（0.5〜2）＋学校設定検査。K値早見表で調査書点を確認',
        features: ['K値0.5〜2対応', '評定×K 早見表', '学校設定検査', '計算例つき'],
        href: '/chiba/total-score',
        icon: Target,
        color: 'green',
      },
      {
        title: '埼玉県 調査書点・学年比率 計算',
        description: '学力500＋中1〜3の評定を学年比率（1:1:2など）で重み付けする調査書点を解説',
        features: ['学年比率対応', '各学年の比重（%）', '第1次/第2次選抜', '計算例つき'],
        href: '/saitama/total-score',
        icon: Target,
        color: 'purple',
      },
      {
        title: '福岡県 内申点（中3のみ45）・当日点',
        description: '内申（中3の9教科45点）＋学力検査（5教科×60＝300点）のA群・B群判定を解説',
        features: ['内申45点（中3のみ）', '学力300点', 'A群・B群', '早見表つき'],
        href: '/fukuoka/total-score',
        icon: Target,
        color: 'blue',
      },
    ],
  },
  {
    id: 'planning',
    heading: '逆算・比較で受験戦略を立てる',
    tools: [
      {
        title: '志望校から逆算ツール',
        description: '志望校の合格基準点と内申点から、当日に必要な学力検査の点数を逆算',
        features: ['志望校対応', '配点比率対応', '当日点を逆算', '学習計画立案'],
        href: '/reverse',
        icon: Target,
        color: 'purple',
      },
      {
        title: '都道府県の内申制度 比較',
        description: '満点・対象学年・実技倍率など、都道府県ごとの内申制度を比較・検討',
        features: ['複数県比較', '制度の違いを可視化', '転居・進路検討に', '一次情報ベース'],
        href: '/comparison',
        icon: TrendingUp,
        color: 'green',
      },
    ],
  },
  {
    id: 'guide',
    heading: '基礎から学ぶガイド',
    tools: [
      {
        title: '内申点クイックアンサー（質問する）',
        description: '「兵庫県は何点満点？」などの疑問に、47都道府県の検証済みデータで即回答',
        features: ['47都道府県対応', 'オール3/4/5の確定値', '満点・対象学年・倍率', '出典つき'],
        href: '/ask',
        icon: MessageCircleQuestion,
        color: 'green',
      },
      {
        title: '内申点ガイド（完全解説）',
        description: '内申点の仕組み・計算方法・上げ方までまとめて解説',
        features: ['基礎解説', '都道府県別の違い', 'よくある質問', '対策方法'],
        href: '/blog/naishin-guide',
        icon: BookOpen,
        color: 'orange',
      },
      {
        title: '47都道府県の入試制度ページ',
        description: '各都道府県の内申点方式・専用計算ツールへの入口',
        features: ['47都道府県', '県別の計算式', '高校ボーダー', '出典リンク付き'],
        href: '/prefectures',
        icon: MapPin,
        color: 'blue',
      },
    ],
  },
];

const ALL_TOOLS = TOOL_GROUPS.flatMap((g) => g.tools);

export default function ToolsPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '高校受験の計算ツール一覧（My Naishin）',
    numberOfItems: ALL_TOOLS.length,
    itemListElement: ALL_TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      url: `https://my-naishin.com${tool.href === '/' ? '' : tool.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'ツール一覧', url: 'https://my-naishin.com/tools' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* ヒーローセクション */}
          <section className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
              高校受験の計算ツール一覧【無料】
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
              内申点・偏差値・評定平均・S値・1020点総合得点・志望校からの逆算まで。
              高校入試で必要な計算を、会員登録なし・すべて無料で行えます。
            </p>
          </section>

          {/* ツール一覧（カテゴリ別セクション＝内部リンクハブ） */}
          {TOOL_GROUPS.map((group) => (
            <section key={group.id} className="mb-10">
              <h2 className="mb-4 border-l-4 border-blue-500 pl-3 text-xl font-bold text-slate-800">
                {group.heading}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {group.tools.map((tool) => {
                  const Icon = tool.icon;
                  const c = COLOR[tool.color];
                  return (
                    <div
                      key={tool.href + tool.title}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className={`rounded-xl ${c.bg} p-3`}>
                          <Icon className={`h-6 w-6 ${c.text}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800">{tool.title}</h3>
                          <p className="mt-0.5 text-sm text-slate-600">{tool.description}</p>
                        </div>
                      </div>

                      <div className="mb-5 grid grid-cols-2 gap-1.5">
                        {tool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={tool.href}
                        className="mt-auto inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        ツールを使う
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* アフィリエイト広告 */}
          <section className="mb-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="mb-1 text-sm font-bold text-slate-700">
              ツールを使ったあとの「次の一歩」
            </div>
            <div className="mb-4 text-xs leading-relaxed text-slate-500">
              現状把握ができたら、実際の学習へ。<AffiliateAd id="sapuri-text" hideLabel auditHide />（月額2,178円・無料体験あり）でスマホ学習を始める人が増えています。
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="sapuri-banner-468" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </section>

          {/* 使い方ガイド */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-blue-800">ツールの使い方ガイド</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">はじめての方へ</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li>1. まず「内申点ガイド」で基本を学ぶ</li>
                  <li>2. 「内申点 計算サイト」で現在の内申点を確認</li>
                  <li>3. 「偏差値計算」で学力の立ち位置を把握</li>
                  <li>4. 「逆算ツール」で目標と当日点を設定</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">志望校が決まってきたら</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li>1. 都道府県専用ツール（S値・1020点・ランク）で精密に判定</li>
                  <li>2. 学年ごとの目標評定を設定</li>
                  <li>3. 実技と主要教科のバランスを最適化</li>
                  <li>4. 志望校の入試方式に合わせて対策</li>
                </ol>
              </div>
            </div>
          </section>

          {/* サイト運営者向け：埋め込みウィジェット導線 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">ブログ・サイト運営者の方へ</h2>
                <p className="mt-1 text-sm text-slate-600">
                  内申点・評定平均の計算ツールを、あなたのサイトに無料で埋め込めます（コピペで設置）。
                </p>
              </div>
              <Link
                href="/embed"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                埋め込みコードを取得
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* 次の一手・関連 */}
          <RelatedToolsSection
            className="mt-8"
            links={[
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・内申の上げ方を保護者向けに解説' },
              { href: '/guide', title: '高校受験の進め方ガイド', desc: '内申点・偏差値・出願までの全体像' },
              { href: '/prefectures', title: '47都道府県の内申点ページ', desc: 'お住まいの地域の方式で正確に計算' },
              { href: '/developers', title: 'データAPI / MCP（開発者・AI向け）', desc: '内申点の一次データを機械可読で提供' },
              { href: 'https://my-shingaku.com', title: '大学進学の費用（姉妹サイト）', desc: '一人暮らし・学費・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}
