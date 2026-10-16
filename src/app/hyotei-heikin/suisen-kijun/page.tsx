import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

// 推薦・併願優遇の評定平均「出願基準」の一般的な目安バンド（特定校のボーダーではない）
const HS_SUISEN_BANDS = [
  { tier: '最難関・難関の公立校', band: '4.3〜4.5以上', note: 'ほぼオール5に近い評定が前提。当日点も高水準が必要。' },
  { tier: '上位の公立校', band: '4.0〜4.3', note: '5を多めに、4以下の教科をできるだけ減らすイメージ。' },
  { tier: '中堅上位の公立校', band: '3.7〜4.0', note: '主要5教科＋実技で安定して4を取れているか。' },
  { tier: '中堅の公立校', band: '3.3〜3.7', note: '平均3.5前後が一つの目安。' },
  { tier: '私立の併願優遇（一般的な最低基準）', band: '3.0〜3.5以上', note: '学校・コースで基準が明示される。9教科か5教科かも要確認。' },
];

const UNIV_SUISEN_BANDS = [
  { tier: '早慶クラスの指定校推薦', band: '4.0〜4.5', note: '校内選考が非常に激しい。高1からの積み上げが前提。' },
  { tier: 'MARCH・関関同立クラスの指定校', band: '3.8〜4.3', note: '評定が高いほど人気学部の校内選考で有利。' },
  { tier: '中堅私大の指定校推薦', band: '3.3〜3.8', note: '専願（合格したら必ず進学）が原則。' },
  { tier: '学校推薦型選抜（公募）', band: '3.5前後〜', note: '大学・学部で「評定平均◯以上」を明示。' },
  { tier: '総合型選抜（旧AO）', band: '不問〜3.5以上', note: '評定基準を設けない大学も多いが、難関大では3.5〜4.0を求める例も。' },
];

const FAQS = [
  {
    question: '推薦入試に必要な評定平均はどのくらい？',
    answer: '高校受験の推薦では、上位校で4.0〜4.5以上、中堅校で3.3〜3.8前後が一般的な目安です。私立の併願優遇は最低3.0〜3.5以上を基準にする学校が多いです。大学受験の指定校推薦は、中堅私大で3.3〜3.8、MARCH・関関同立クラスで3.8〜4.3、早慶クラスで4.0〜4.5が目安。いずれも学校・年度で変わるため、必ず最新の募集要項で確認してください。',
  },
  {
    question: '評定平均は推薦でいつの成績が使われる？',
    answer: '高校受験の推薦は、中学3年の1学期（前期）の評定を使うのが一般的です。大学受験の指定校・総合型選抜では、高校1年の最初から高校3年1学期までの全科目の評定を平均した「学習成績の状況」を使います。つまり大学受験では高1の成績から評価対象になるため、高1から評定を積み上げる意識が重要です。',
  },
  {
    question: '評定平均を上げるにはどうすればいい？',
    answer: '①提出物を期限内に丁寧に出す、②授業中の発言・振り返りで「主体的に学習に取り組む態度」を上げる、③定期テストで安定して平均点+10点を狙う、④実技4教科で「3→4」を取りにいく、⑤分からない所を先生に質問する習慣を作る、が効果的です。評定平均は短期で大きく動きにくいので、早い学年からの積み上げが効きます。',
  },
  {
    question: '評定平均と内申点（素内申）はどう違う？',
    answer: '同じ通知表データの表し方の違いです。「評定平均」は1教科あたりの平均（例：4.2）、「内申点（素内申）」は9教科の評定の合計（例：38／45）です。推薦の出願基準は評定平均（◯.◯以上）で示されることが多く、一般入試では内申点（合計）で計算されます。当サイトの計算ツールは両方を同時に表示します。',
  },
];

export const metadata: Metadata = {
  title: '推薦に必要な評定平均はいくつ？高校・大学の出願基準 早見表【2026年】 | My Naishin',
  description: '推薦入試に必要な評定平均の目安を早見表でまとめました。高校受験の推薦・私立併願優遇（最低3.0〜3.5以上）、大学の指定校推薦（中堅3.3〜/MARCH3.8〜/早慶4.0〜）・総合型選抜まで。評定平均の出し方・上げ方、内申点との違いも解説。無料の評定平均計算ツール付き。',
  keywords: ['評定平均 推薦', '推薦 評定平均', '評定平均 推薦 基準', '指定校推薦 評定平均', '評定平均 目安', '評定平均 出願基準', '併願優遇 評定平均', '総合型選抜 評定平均', '評定平均 何点', '推薦 内申'],
  alternates: { canonical: 'https://my-naishin.com/hyotei-heikin/suisen-kijun' },
  openGraph: {
    title: '推薦に必要な評定平均はいくつ？高校・大学の出願基準 早見表【2026年】 | My Naishin',
    description: '推薦・指定校・総合型選抜で必要な評定平均の目安を早見表で解説。出し方・上げ方・内申点との違いも。',
    url: 'https://my-naishin.com/hyotei-heikin/suisen-kijun',
  },
};

export default function HyoteiSuisenKijunPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '評定平均 計算', url: 'https://my-naishin.com/hyotei-heikin' },
          { name: '推薦の評定平均 基準', url: 'https://my-naishin.com/hyotei-heikin/suisen-kijun' },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />
      <DatasetSchema
        name="推薦・併願優遇の評定平均 出願基準（一般的な目安バンド）"
        description="高校受験の推薦・私立併願優遇、大学の指定校推薦・総合型選抜で必要となる評定平均の一般的な目安バンド。特定校のボーダーではなく、広く公開された区分に基づく参照データ。"
        url="https://my-naishin.com/hyotei-heikin/suisen-kijun#hs-table"
        variableMeasured={['進路区分', '評定平均の出願基準の目安']}
        keywords={['評定平均 推薦 基準', '指定校推薦 評定平均', '併願優遇 評定平均', '総合型選抜 評定平均']}
        citation="各高校・大学の募集要項で広く公開されている一般的な出願基準の区分。"
        dateModified="2026-06-12"
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくずリスト" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">評定平均 計算</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">推薦の評定平均 基準</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">推薦に必要な評定平均は？早見表</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>最終更新：2026年6月12日</span>
              <span>出典：各校募集要項の一般的な区分</span>
            </div>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              高校受験の推薦・私立併願優遇、大学の指定校推薦・総合型選抜で必要な<strong>評定平均の目安</strong>を早見表にまとめました。
              いまの評定平均は<Link href="/hyotei-heikin" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">計算ツール</Link>で30秒で確認できます。
            </p>
          </header>

          {/* E-E-A-T カード */}
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 md:p-5">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="font-bold text-slate-900">監修・運営：ないしんパンダ</div>
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                2026年度受験生
              </span>
            </div>
            <p className="text-base leading-[1.8] text-slate-900">
              掲載の基準は<strong>一般的な目安バンド</strong>です。特定校のボーダーは扱いません。実際の出願基準は必ず各校の最新募集要項で確認してください。
            </p>
          </div>

          {/* 高校推薦の早見表 */}
          <section id="hs-table" className="mt-10 scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">
              高校受験｜推薦・併願優遇の評定平均 目安
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              公立高校の推薦入試では「評定平均◯以上」が出願基準として示されることが多く、私立の併願優遇でも評定平均が基準になります。一般的な目安は次のとおりです。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-normal">進路の目安</th>
                    <th className="whitespace-nowrap px-3 py-2 text-center font-normal">評定平均</th>
                    <th className="px-3 py-2 font-normal">ポイント</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  {HS_SUISEN_BANDS.map((r) => (
                    <tr key={r.tier} className="border-b border-slate-200">
                      <td className="px-3 py-2 font-bold">{r.tier}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-center font-bold tabular-nums text-brand-700">{r.band}</td>
                      <td className="px-3 py-2">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 大学推薦の早見表 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">
              大学受験｜指定校推薦・総合型選抜の評定平均 目安
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              大学受験で使う評定平均（学習成績の状況）は、<strong>高1〜高3前期の全科目</strong>を平均します。高1の成績から対象になるのがポイントです。
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-normal">入試区分</th>
                    <th className="whitespace-nowrap px-3 py-2 text-center font-normal">評定平均</th>
                    <th className="px-3 py-2 font-normal">ポイント</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  {UNIV_SUISEN_BANDS.map((r) => (
                    <tr key={r.tier} className="border-b border-slate-200">
                      <td className="px-3 py-2 font-bold">{r.tier}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-center font-bold tabular-nums text-brand-700">{r.band}</td>
                      <td className="px-3 py-2">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 大学進学の橋渡し（姉妹サイト My Shingaku へ） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold leading-snug text-slate-900">
              大学受験の指定校推薦・総合型選抜を詳しく調べるなら
            </h2>
            <p className="text-base leading-[1.8] text-slate-900">
              指定校推薦・総合型選抜の仕組みや、大学の学費・奨学金の目安まで詳しく知りたい方は、
              大学受験に特化した姉妹サイト「My Shingaku」もあわせてご覧ください。
            </p>
            <Link
              href="https://my-shingaku.com/gakuhi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              大学進学の費用を詳しく見る（姉妹サイト My Shingaku）
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          {/* 注意 */}
          <section className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-900" />
              <div>
                <h2 className="text-[17px] font-bold text-amber-900">早見表を使うときの注意</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-amber-900">
                  <li>数値は一般的な目安です。実際の出願基準は学校・コース・年度で変わるため、必ず最新の募集要項で確認してください。</li>
                  <li>評定平均の対象学年・対象教科（9教科か主要5教科か）は学校により異なります。</li>
                  <li>推薦は「出願できるか」の基準。合否は面接・小論文・調査書全体で総合的に判断されます。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 出し方・上げ方クイック */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">
              評定平均の出し方・上げ方
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">出し方（計算方法）</h3>
                <p className="text-base leading-[1.8] text-slate-900">
                  評定平均＝<strong>9教科の評定の合計 ÷ 9</strong>。たとえば合計38なら 38÷9＝約4.2。素内申（合計）と評定平均（1教科あたり）は同じデータの別表現です。
                  <Link href="/hyotei-heikin" className="ml-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">計算ツールで自動算出 →</Link>
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">上げ方（5つの基本）</h3>
                <ul className="space-y-0.5 text-base leading-[1.8] text-slate-900">
                  <li>① 提出物を期限内＋丁寧に</li>
                  <li>② 授業の発言・振り返りで主体性評価UP</li>
                  <li>③ 定期テストで平均点+10点を安定</li>
                  <li>④ 実技4教科の「3→4」を狙う</li>
                  <li>⑤ 先生に質問する習慣をつくる</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mt-10">
            <ParentLeadCTA
              placement="hyotei-heikin"
              heading="推薦の評定基準に届く？保護者の方へ"
              body="評定平均は早い学年からの積み上げが効きます。お子さまにいま必要な対策を、個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
              affiliateId="atama-text"
              ctaText="無料で資料・体験を申し込む"
              note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
            />
          </div>

          {/* 関連ツール */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold leading-snug text-slate-900">次の一手・関連ツール</h2>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-3 text-base text-slate-900 hover:text-brand-700">
                評定平均を計算する
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/hyotei-heikin/gyakusan" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-3 text-base text-slate-900 hover:text-brand-700">
                残りで必要な平均を逆算する
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-3 text-base text-slate-900 hover:text-brand-700">
                内申点を計算する（47都道府県）
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/hensachi/shiboukou" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-3 text-base text-slate-900 hover:text-brand-700">
                偏差値から行ける高校を見る
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
              <Link href="/blog/parent-hyotei-heikin-suisen-guide" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-3 text-base text-slate-900 hover:text-brand-700">
                保護者向け・推薦と評定平均の完全ガイド
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
