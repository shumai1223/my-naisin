import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { OsakaResultFlow } from '@/components/Osaka/OsakaResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
const OSAKA_SOURCE_URL =
  getPrefectureByCode('osaka')?.sourceUrl ?? 'https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { AdUnit } from '@/components/AdSlot';

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const OSAKA_TOTAL_SCORE_FAQS = [
  {
    question: '大阪府の選抜タイプとは何ですか？',
    answer:
      '大阪府の公立高校入試では、学力検査と内申点の比率を志望校ごとに5パターン（タイプⅠ〜Ⅴ）から採用します。タイプⅠ（7:3）は学力検査重視、タイプⅤ（3:7）は内申重視。志望校がどのタイプかは事前に確認しましょう。',
  },
  {
    question: '大阪府の内申点はいつの成績？',
    answer:
      '大阪府の内申点は中1〜中3の3年間すべてが対象です。学年倍率は中1：中2：中3 ＝ 2：2：6で、中3の比重が最も大きいです。',
  },
  {
    question: '文理学科と普通科の違いは？',
    answer:
      '文理学科は北野・茨木・天王寺・大手前・四條畷・三国丘・豊中・高津・岸和田・生野の10校に設置され、難関大学進学を目指す高度な学習を行います。タイプⅠ（7:3）採用が多く、学力検査重視の選抜です。',
  },
];

export const metadata: Metadata = {
  title: '大阪府公立高校 タイプⅠ〜Ⅴ計算【無料・総合点シミュレーション】 | My Naishin',
  description: '【無料】大阪府公立高校入試の総合点を自動計算。学力検査450点・内申点450点をタイプⅠ（7:3）〜タイプⅤ（3:7）の選抜タイプ別に瞬時に算出。北野・茨木・天王寺など主要校の合格目安にも対応。2026年度入試対応。',
  keywords: ['大阪府公立高校 タイプ 1 計算方法', '大阪府 公立高校 タイプ', '大阪府 内申点', '大阪府 学力検査', '大阪 総合点', '北野高校', '茨木高校', '大阪 公立 合格点'],
  alternates: {
    canonical: 'https://my-naishin.com/osaka/total-score',
  },
  openGraph: {
    title: '大阪府公立高校 タイプⅠ〜Ⅴ計算【無料・総合点シミュレーション】 | My Naishin',
    description: '大阪府公立高校の総合点をタイプ別に瞬時に算出。志望校の合格目安と比較可能。',
    url: 'https://my-naishin.com/osaka/total-score',
  },
};

export default function OsakaTotalScorePage() {
  return (
    <>
      <WebApplicationSchema
        name="大阪府公立高校 総合点計算 | My Naishin"
        description="大阪府公立高校入試の総合点をタイプⅠ〜Ⅴ別に瞬時に算出。志望校の合格目安と比較。"
        url="https://my-naishin.com/osaka/total-score"
      />
      <DatasetSchema
        name="大阪府 総合点算出方式データ（タイプⅠ〜Ⅴ）"
        description="大阪府公立高校入試の総合点算出方式（学力検査450点・内申点450点をタイプⅠ〜Ⅴの選抜タイプ別に重み付けする方法）。大阪府教育庁の入試情報に基づくデータ。"
        url="https://my-naishin.com/osaka/total-score"
        variableMeasured={['学力検査点', '内申点', '選抜タイプ', '総合点満点']}
        keywords={['総合点', '大阪府', 'タイプⅠ〜Ⅴ', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '大阪府', url: 'https://my-naishin.com/osaka' },
          { name: '総合点計算', url: 'https://my-naishin.com/osaka/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-osaka-total-score"
        name="大阪府公立高校 総合点を計算する方法"
        description="大阪府公立高校入試の合否判定に使われる総合点を、内申点・学力検査・選抜タイプから自動算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '内申点（450点満点）を入力', text: '3年間の評定合計から算出された内申点（450点満点）を入力します。' },
          { name: '学力検査点（450点満点）を入力', text: '5教科×90点の合計点（450点満点）を入力します。' },
          { name: '志望校の選抜タイプを選ぶ', text: 'タイプⅠ（7:3 学力最重視）〜タイプⅤ（3:7 内申最重視）から志望校のタイプを選択します。' },
          { name: '総合点と志望校比較', text: '450点満点の総合点が瞬時に算出され、北野・茨木・天王寺など主要府立高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={OSAKA_TOTAL_SCORE_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
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
            <Link
              href="/osaka"
              className="inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              大阪府
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">総合点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              大阪府公立高校 総合点計算ツール
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              タイプⅠ〜Ⅴ対応・450点満点・2026年度入試対応 ／ 出典：
              <a
                href={OSAKA_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                大阪府教育委員会
              </a>
            </p>
            <p className="mt-3 max-w-2xl text-base leading-[1.8] text-slate-900">
              大阪府公立高校入試の総合点を瞬時に算出。<br />
              内申点・学力検査・選抜タイプ（タイプⅠ〜Ⅴ）を一括で計算できます。
            </p>
          </header>

          {/* タイプの仕組み */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">大阪府の選抜タイプⅠ〜Ⅴとは？</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              大阪府公立高校の一般選抜では、学力検査と調査書（内申点）の比率を志望校ごとに「<strong>タイプⅠ〜タイプⅤ</strong>」の5パターンから選択します。学力検査重視の高校はタイプⅠ、内申重視の高校はタイプⅤを採用しています。
            </p>
            <dl className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
              <div className="flex items-baseline justify-between gap-3 px-3 py-3 sm:block sm:text-center">
                <dt className="text-sm font-bold text-slate-900">タイプⅠ</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 sm:mt-1">7:3</dd>
                <dd className="text-xs text-slate-600 sm:mt-1">学力最重視</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-3 py-3 sm:block sm:text-center">
                <dt className="text-sm font-bold text-slate-900">タイプⅡ</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 sm:mt-1">6:4</dd>
                <dd className="text-xs text-slate-600 sm:mt-1">学力重視</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-3 py-3 sm:block sm:text-center">
                <dt className="text-sm font-bold text-slate-900">タイプⅢ</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 sm:mt-1">5:5</dd>
                <dd className="text-xs text-slate-600 sm:mt-1">標準</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-3 py-3 sm:block sm:text-center">
                <dt className="text-sm font-bold text-slate-900">タイプⅣ</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 sm:mt-1">4:6</dd>
                <dd className="text-xs text-slate-600 sm:mt-1">内申重視</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-3 py-3 sm:block sm:text-center">
                <dt className="text-sm font-bold text-slate-900">タイプⅤ</dt>
                <dd className="text-lg font-bold tabular-nums text-slate-900 sm:mt-1">3:7</dd>
                <dd className="text-xs text-slate-600 sm:mt-1">内申最重視</dd>
              </div>
            </dl>
          </section>

          {/* Calculator・結果連動（S-1④） */}
          <OsakaResultFlow />

          {/* 計算式の解説 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">総合点の計算式</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">総合点の計算式（タイプ別共通）</h3>
                <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-slate-900">
                  <div className="font-mono text-sm md:text-base">
                    総合点 ＝ 学力検査点 × 学力比率 ＋ 内申点 × 内申比率
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  ※ 学力検査450点・内申点450点をそれぞれの比率（タイプⅠ〜Ⅴ）で重み付けして合算します。
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">内申点（450点満点）の計算</h3>
                <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-slate-900">
                  <div className="font-mono text-sm md:text-base">
                    内申点 ＝ 中1〜中3 各9教科の評定合計 × 学年倍率
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  ※ 学年倍率は中1：中2：中3 ＝ 2：2：6（合計10）。中3の比重が最も大きいです。詳細は<Link href="/osaka/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">大阪府の内申点計算</Link>もご利用ください。
                </p>
              </div>
            </div>
          </section>

          {/* タイプ別 総合点 早見表（SEO: 大阪 タイプ1 計算方法 / 大阪 総合点 計算 / タイプ別 満点） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">タイプⅠ〜Ⅴ 総合点の早見表（満点内訳）</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              大阪府の総合点は<strong>学力検査（450満点）と内申点（450満点）を、志望校のタイプ比率で重み付け</strong>して合算（総合450点満点）します。タイプごとの満点内訳は下のとおり。「学力で何点・内申で何点とれば総合何点か」を素早く把握できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-bold">タイプ</th>
                    <th className="px-3 py-2 text-center font-bold">比率(学力:内申)</th>
                    <th className="px-3 py-2 text-right font-bold">学力の満点寄与</th>
                    <th className="px-3 py-2 text-right font-bold">内申の満点寄与</th>
                    <th className="px-3 py-2 text-right font-bold">総合満点</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  {[
                    ['Ⅰ', '7 : 3', '315', '135'],
                    ['Ⅱ', '6 : 4', '270', '180'],
                    ['Ⅲ', '5 : 5', '225', '225'],
                    ['Ⅳ', '4 : 6', '180', '270'],
                    ['Ⅴ', '3 : 7', '135', '315'],
                  ].map(([type, ratio, gakuryoku, naishin]) => (
                    <tr key={type} className="border-b border-slate-200">
                      <td className="px-3 py-2 font-bold">タイプ{type}</td>
                      <td className="px-3 py-2 text-center tabular-nums">{ratio}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{gakuryoku}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{naishin}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">450</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <h3 className="mb-2 text-[17px] font-bold text-slate-900">総合点の計算例（タイプⅠ＝7:3 の文理学科）</h3>
              <p className="text-sm leading-[1.8] text-slate-900">
                学力360点・内申380点・<strong>タイプⅠ（学力0.7／内申0.3）</strong>の場合：<br />
                総合 ＝ 360 × 0.7 ＋ 380 × 0.3 ＝ 252 ＋ 114 ＝ <strong>366点</strong>（大手前の目安370にあと一歩）
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ※ 学力・内申はいずれも450点満点。正確な総合点は上の計算ツールでご確認ください。
            </p>
          </section>

          {/* 主要校のタイプと合格ライン */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">主要大阪府立高校のタイプと合格目安【2026年最新】</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-bold">高校</th>
                    <th className="px-3 py-2 text-center font-bold">タイプ</th>
                    <th className="px-3 py-2 text-right font-bold">合格目安</th>
                    <th className="px-3 py-2 text-right font-bold">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  {[
                    ['北野（文理学科）', 'Ⅰ（7:3）', '395+', '76'],
                    ['茨木（文理学科）', 'Ⅰ（7:3）', '385+', '75'],
                    ['天王寺（文理学科）', 'Ⅰ（7:3）', '385+', '75'],
                    ['大手前（文理学科）', 'Ⅰ（7:3）', '370+', '73'],
                    ['四條畷（文理学科）', 'Ⅰ（7:3）', '355+', '72'],
                    ['三国丘（文理学科）', 'Ⅰ（7:3）', '370+', '73'],
                    ['豊中（文理学科）', 'Ⅰ（7:3）', '355+', '71'],
                    ['高津（文理学科）', 'Ⅰ（7:3）', '350+', '70'],
                    ['春日丘', 'Ⅱ（6:4）', '320+', '67'],
                    ['寝屋川', 'Ⅱ（6:4）', '315+', '66'],
                    ['池田', 'Ⅱ（6:4）', '305+', '65'],
                    ['千里', 'Ⅱ（6:4）', '300+', '64'],
                  ].map(([school, type, target, hensachi]) => (
                    <tr key={school} className="border-b border-slate-200">
                      <td className="px-3 py-2 font-bold">{school}</td>
                      <td className="px-3 py-2 text-center">{type}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">{target}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{hensachi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。最新情報は大阪府教育委員会の公式発表をご確認ください。
            </p>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客。旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            heading="大阪の志望校、総合点はあと何点で届きますか？"
            body="総合点は学力と内申の伸ばし方で変わります。お子さまにいま必要な対策を、個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="campus-text"
            ctaText="無料体験を申し込む（個別指導キャンパス）"
            note="個別指導キャンパスの無料体験（PR）"
          />

          {/* T-ADS1 AdSense IN_CONTENT: 保護者リードCTAの後ろ（CTAを押し下げない）。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="IN_CONTENT" />

          {/* よくある質問 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-900">Q. 大阪府の選抜タイプとは何ですか？</div>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  大阪府の公立高校入試では、学力検査と内申点の比率を志望校ごとに5パターン（タイプⅠ〜Ⅴ）から採用します。タイプⅠ（7:3）は学力検査重視、タイプⅤ（3:7）は内申重視。志望校がどのタイプかは事前に確認しましょう。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900">Q. 大阪府の内申点はいつの成績？</div>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  大阪府の内申点は<strong>中1〜中3の3年間</strong>すべてが対象です。学年倍率は中1：中2：中3 ＝ 2：2：6で、中3の比重が最も大きいです。詳しくは<Link href="/osaka/naishin" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">大阪府の内申点計算ツール</Link>もご覧ください。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900">Q. 文理学科と普通科の違いは？</div>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  文理学科は北野・茨木・天王寺・大手前・四條畷・三国丘・豊中・高津・岸和田・生野の10校に設置され、難関大学進学を目指す高度な学習を行います。タイプⅠ（7:3）採用が多く、学力検査重視の選抜です。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-900" />
              <p className="text-sm leading-[1.8] text-amber-900">
                <strong>注意：</strong>
                本ツールの計算結果は大阪府教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href={OSAKA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 underline underline-offset-2">大阪府教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/osaka/naishin" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50">
                <span className="text-base text-slate-900">大阪府の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
              <Link href="/osaka" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50">
                <span className="text-base text-slate-900">大阪府の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
              <Link href="/reverse?pref=osaka" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50">
                <span className="text-base text-slate-900">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
              <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50">
                <span className="text-base text-slate-900">評定平均を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
            </div>
          </section>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。保護者リードCTAより後ろ。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
