import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaitamaResultFlow } from '@/components/Saitama/SaitamaResultFlow';

const SAITAMA_FAQS = [
  {
    question: '埼玉県の調査書点（内申点）は中1〜中3のどれが対象？',
    answer:
      '埼玉県は中1〜中3の3年間すべての評定が対象です。各学年とも9教科×5段階＝45点満点。ただし学年の比重（中1：中2：中3）は高校ごとに「1：1：2」「1：1：3」「1：2：3」などと定められ、多くの高校で中3の比重が最も大きくなります。',
  },
  {
    question: '埼玉県公立高校入試の総合得点はどう決まる？',
    answer:
      '基本は「学力検査（5教科×100＝500点）＋調査書点（評定の学年比率換算＋特別活動等＋その他）」で構成され、合計は900点前後（高校により異なる）が一般的です。学力検査と調査書の比率、各項目の配点は高校・学科ごとに設定されます。',
  },
  {
    question: '第1次選抜と第2次選抜の違いは？',
    answer:
      '埼玉県は1回の入試の中で、学力検査点と調査書点の比率を変えて2段階で選抜します。第1次選抜と第2次選抜で「学力：調査書」の比率が変わるため、学力型・内申型どちらの受験生にもチャンスがある仕組みです。比率は高校ごとに公表されます。',
  },
  {
    question: '内申点（調査書）には評定以外も入りますか？',
    answer:
      'はい。「各教科の学習の記録（評定）」に加えて、「特別活動等の記録（生徒会・部活動・学校行事など）」「その他（英検などの資格・特技）」「出欠の記録」も点数化されます。配点は高校・学科ごとに異なります。',
  },
];

export const metadata: Metadata = {
  title: '埼玉県公立高校 調査書点・学年比率 計算【学力500+調査書(1:1:2など)】 | My Naishin',
  description:
    '埼玉県公立高校入試の調査書点（内申点）の計算方法を解説。中1〜中3の評定（各45点）を学年比率1:1:2・1:1:3・1:2:3で重み付けする仕組みと、各学年の比重（％）を早見表で確認。学力検査500点・第1次/第2次選抜も解説。2026年度入試対応。',
  keywords: ['埼玉県 公立高校 内申点 計算', '埼玉県 調査書点 計算方法', '埼玉 内申 学年比率', '埼玉県 1:1:2 1:1:3', '埼玉 第1次選抜 第2次選抜', '埼玉県 公立高校 合格点', '埼玉 内申点 比率'],
  alternates: {
    canonical: 'https://my-naishin.com/saitama/total-score',
  },
  openGraph: {
    title: '埼玉県公立高校 調査書点・学年比率 計算【学力500+調査書(1:1:2など)】 | My Naishin',
    description: '埼玉県公立高校入試の調査書点を学年比率1:1:2/1:1:3/1:2:3でどう重み付けするか、各学年の比重を早見表で解説。',
    url: 'https://my-naishin.com/saitama/total-score',
  },
};

// 学年比率パターン → 各学年の比重(%)。weight/合計で算出（数学的に正確）。
const RATIO_PATTERNS: { ratio: string; w: [number, number, number] }[] = [
  { ratio: '1：1：1', w: [1, 1, 1] },
  { ratio: '1：1：2', w: [1, 1, 2] },
  { ratio: '1：1：3', w: [1, 1, 3] },
  { ratio: '1：2：3', w: [1, 2, 3] },
];

function pct(part: number, total: number) {
  return `${Math.round((part / total) * 1000) / 10}%`;
}

export default function SaitamaTotalScorePage() {
  return (
    <>
      <DatasetSchema
        name="埼玉県 調査書点算出方式データ（学年比率）"
        description="埼玉県公立高校入試の調査書点算出における一般的な学年比率(1:1:2・1:1:3・1:2:3等)のパターン。県内統一の換算式は存在せず高校・学科ごとに異なるため、志望校の募集要項の確認を前提としたデータ。埼玉県教育委員会の入試情報に基づく。"
        url="https://my-naishin.com/saitama/total-score"
        variableMeasured={['学年別評定', '学年比率パターン', '学力検査点']}
        keywords={['調査書点', '埼玉県', '学年比率', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '埼玉県', url: 'https://my-naishin.com/saitama' },
          { name: '調査書点・学年比率計算', url: 'https://my-naishin.com/saitama/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-saitama-total-score"
        name="埼玉県公立高校 調査書点（学年比率）・総合得点を計算する方法"
        description="埼玉県公立高校入試の調査書点を、中1〜中3の評定と学年比率、学力検査から算出する考え方の手順。"
        totalTime="PT2M"
        steps={[
          { name: '各学年の評定合計（各45点）を出す', text: '中1・中2・中3それぞれ9教科の5段階評定を合計します（各最大45）。' },
          { name: '志望校の学年比率を確認', text: '志望校の中1：中2：中3の比率（1:1:2・1:1:3・1:2:3など）を確認します。' },
          { name: '学年比率で重み付け', text: '中3の比重が大きい高校が多いです。下の早見表で各学年の比重（％）を確認できます。' },
          { name: '学力検査・特別活動等と合算', text: '学力検査（500点）＋調査書点（評定＋特別活動＋その他）で総合得点（約900点）を求めます。比率は第1次/第2次で変わります。' },
        ]}
      />
      <FAQPageSchema faqItems={SAITAMA_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/saitama" className="hover:text-blue-600">埼玉県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">調査書点・学年比率計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              埼玉県公立高校 調査書点・学年比率 計算
            </h1>
            <div className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              学力500点＋調査書（学年比率）・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              埼玉県公立高校入試は、学力検査（500点）と調査書点（中1〜中3の評定を学年比率で重み付け）の合計で決まります。<br />
              わかりにくい「学年比率」と各学年の比重を早見表で整理しました。
            </p>
          </header>

          {/* 仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-violet-500" />
              埼玉県の総合得点の内訳（約900点）
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                <span className="font-bold text-violet-800">① 学力検査（5教科×100）</span>
                <span className="font-black text-violet-700">500点</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
                <span className="font-bold text-purple-800">② 調査書点（評定の学年比率換算）</span>
                <span className="font-black text-purple-700">高校が設定</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-700">③ 特別活動等の記録（生徒会・部活・行事）</span>
                <span className="font-black text-slate-600">高校が設定</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-700">④ その他（英検などの資格・特技）・出欠</span>
                <span className="font-black text-slate-600">高校が設定</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              特徴は<strong>調査書の「学年比率」</strong>。中1〜中3の評定（各9教科×5＝45点）を、中1：中2：中3＝「1：1：2」「1：1：3」「1：2：3」などの比率で重み付けします。<strong>多くの高校で中3の比重が最大</strong>です。
            </p>
          </section>

          {/* 学年比率 早見表 */}
          <section className="mb-8 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-purple-500" />
              学年比率 → 各学年の比重（％）早見表
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              「中3はどれくらい重いの？」を比重（％）で示しました。志望校の学年比率を当てはめると、どの学年の評定が合否に効くかが一目でわかります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-purple-600 text-white text-left">
                    <th className="border border-purple-400 px-3 py-2 font-bold">学年比率（中1:中2:中3）</th>
                    <th className="border border-purple-400 px-3 py-2 font-bold text-right">中1の比重</th>
                    <th className="border border-purple-400 px-3 py-2 font-bold text-right">中2の比重</th>
                    <th className="border border-purple-400 px-3 py-2 font-bold text-right">中3の比重</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {RATIO_PATTERNS.map((p) => {
                    const total = p.w[0] + p.w[1] + p.w[2];
                    return (
                      <tr key={p.ratio} className="odd:bg-white even:bg-slate-50">
                        <td className="border border-slate-200 px-3 py-2 font-bold">{p.ratio}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right">{pct(p.w[0], total)}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right">{pct(p.w[1], total)}</td>
                        <td className="border border-slate-200 px-3 py-2 text-right font-bold text-purple-700">{pct(p.w[2], total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 比重＝その学年の重み÷重みの合計。例：1:1:3なら中3が60%を占めます。実際の調査書満点・配点は高校ごとに異なります。
            </p>
          </section>

          {/* 総合得点計算機・結果連動（S-3①） */}
          <div className="mb-8">
            <SaitamaResultFlow />
          </div>

          {/* 計算例 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-violet-500" />
              評定の重み付けイメージ
            </h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <h3 className="font-bold text-violet-900 mb-1">例：中1=32・中2=34・中3=40（各45満点）</h3>
                <ul className="text-violet-900 text-xs space-y-1 ml-4 list-disc">
                  <li>学年比率1:1:2：(32×1 ＋ 34×1 ＋ 40×2) ＝ <strong>146</strong>（重み合計4）→ 中3が約55%を占める</li>
                  <li>学年比率1:1:3：(32×1 ＋ 34×1 ＋ 40×3) ＝ <strong>186</strong>（重み合計5）→ 中3が約65%を占める</li>
                </ul>
                <p className="mt-2 text-[11px] text-violet-700">※ この加重合計を各高校が定める調査書満点に換算します（換算方法は高校により異なる）。</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                ポイントは「中3の伸びが最も効く」こと。学年比率が中3重視の高校ほど、中3での挽回が合否に直結します。
              </p>
            </div>
          </section>

          {/* 2タッチ目：AI個別指導（下のParentLeadCTAとは別プログラムで多様性確保。旧Z会/サプリ¥1.5-5.4/clickの代替） */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              AIが弱点を自動分析する個別指導
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              <AffiliateAd id="atama-text" hideLabel />（PR）の無料体験で、今の学力に必要な対策を確認できます。
            </div>
            <AffiliateAd id="atama-banner" />
          </section>

          {/* 保護者向けリード（旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mb-8"
            heading="埼玉の志望校、学年比率に合った対策ができていますか？"
            body="志望校の学年比率で、どの学年の成績が効くかは変わります。お子さまに合った対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* よくある質問 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {SAITAMA_FAQS.map((faq, i) => (
                <div key={i}>
                  <div className="font-bold text-slate-800 text-sm">Q. {faq.question}</div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意 */}
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                埼玉県は学年比率・調査書の各項目の配点・学力検査と調査書の比率・第1次/第2次選抜の比率が高校・学科ごとに異なります。志望校の正確な選抜基準は<a href="https://www.pref.saitama.lg.jp/f2208/r7nyuushi-jouhou.html" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">埼玉県教育委員会の公式情報</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/saitama/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">埼玉県の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/saitama" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">埼玉県の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">5教科の偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=saitama" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
