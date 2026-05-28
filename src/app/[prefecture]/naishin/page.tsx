import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronRight, 
  GraduationCap,
  BookOpen,
  Info,
  Sparkles,
  ExternalLink,
  Target,
  FileText,
  AlertCircle,
  Shield,
} from 'lucide-react';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getPrefectureGuide, generateDynamicFAQ } from '@/lib/prefecture-guides';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ErrorReportForm } from '@/components/ErrorReportForm';
import { PrefectureMinimumContent } from '@/components/PrefectureMinimumContent';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import InteractiveCalculator from '@/components/Calculator/InteractiveCalculatorWrapper';
import { HighSchoolBorderlineTable } from '@/components/HighSchoolBorderlineTable';
import { TrustInfo } from '@/components/TrustInfo';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { prefecture: prefectureCode } = await params;
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return {};

  // モバイルSERPの先頭24文字に「{県名}の内申点 計算」を必ず含め、descriptionは「無料」「30秒」「2026年最新」を120字以内に圧縮（モバイル表示2行に収める）
  const title = `${prefecture.name}の内申点 計算サイト【無料・${prefecture.maxScore}点満点】2026年最新 | My Naishin`;
  const description = `【無料】${prefecture.name}の内申点を30秒で自動計算。9教科の評定を入れるだけで${prefecture.maxScore}点満点で瞬時に算出。実技倍率・対象学年・志望校ボーダー比較も対応。2026年最新版。`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://my-naishin.com/${prefectureCode}/naishin`,
    },
    openGraph: {
      title,
      description,
      url: `https://my-naishin.com/${prefectureCode}/naishin`,
    }
  };
}

function getFormulaExplanation(prefecture: { targetGrades: number[]; gradeMultipliers: Record<number, number>; practicalMultiplier: number; maxScore: number; coreMultiplier: number }) {
  const parts: string[] = [];
  prefecture.targetGrades.forEach(grade => {
    const multiplier = prefecture.gradeMultipliers[grade];
    if (multiplier > 0) {
      parts.push(`中${grade}${multiplier > 1 ? `×${multiplier}` : ''}`);
    }
  });
  let formula = parts.join(' ＋ ');
  if (prefecture.practicalMultiplier > prefecture.coreMultiplier) {
    formula += `（実技${prefecture.practicalMultiplier}倍）`;
  }
  return formula;
}

export default async function PrefectureNaishinPage({ params }: PageProps) {
  const { prefecture: prefectureCode } = await params;
  const prefecture = getPrefectureByCode(prefectureCode);

  if (!prefecture) {
    notFound();
  }

  const guide = getPrefectureGuide(prefectureCode);
  const formulaText = getFormulaExplanation(prefecture);

  // 構造化データのFAQ：PrefectureMinimumContent内で可視表示されているFAQと完全一致させる
  // （Googleは構造化データと可視テキストの一致を要求）
  const faqItems = generateDynamicFAQ(prefectureCode, prefecture);

  // 計算手順のHowTo構造化データ
  const howToSteps = [
    {
      name: '都道府県を選ぶ',
      text: `${prefecture.name}を選択して、${prefecture.name}専用の計算式に切り替えます。`
    },
    {
      name: '9教科の評定を入力',
      text: `中${prefecture.targetGrades.join('・')}の主要5教科と実技4教科の評定（1〜5）をスライダーで入力します。`
    },
    {
      name: '計算ボタンを押す',
      text: `${prefecture.name}方式の倍率（5教科×${prefecture.coreMultiplier}倍／実技×${prefecture.practicalMultiplier}倍）が自動適用され、${prefecture.maxScore}点満点で内申点が表示されます。`
    },
    {
      name: '志望校ボーダーと比較',
      text: '同ページの高校別ボーダーライン一覧と照らし合わせて、目標との差を確認します。'
    }
  ];

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' },
          { name: `${prefecture.name}の内申点計算`, url: `https://my-naishin.com/${prefectureCode}/naishin` }
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />
      <HowToSchema
        name={`${prefecture.name}の内申点を計算する方法`}
        description={`${prefecture.name}の公立高校入試で使われる${prefecture.maxScore}点満点の内申点を、9教科の評定から計算する手順。`}
        steps={howToSteps}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/prefectures" className="hover:text-blue-600">都道府県一覧</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}の内申点 計算サイト</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl tracking-tight">
                  {prefecture.name}の内申点 計算サイト【2026年最新・無料】
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">{prefecture.region}</span>
                  <span>令和8年度（2026年度）入試対応済</span>
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="space-y-8">
            {/* 概要カード（E-E-A-T: 信頼の強調） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                 <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                   <Shield className="h-3 w-3" />
                   公式PDF検証済
                 </div>
              </div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <Info className="h-5 w-5 text-blue-500" />
                {prefecture.name}公立高校入試の内申制度
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {prefecture.name}の公立高校入試では、学力検査（当日点）とあわせて、中学校での成績を点数化した「内申点（調査書点）」が合否判定に大きく関わります。本ページは、{prefecture.name}に対応した<strong>内申点 計算 サイト</strong>として、{prefecture.name}教育委員会が発表する最新の選抜基準に基づき、9教科の評定からあなたの内申点を瞬時に算出します。会員登録・ダウンロード不要、スマホ・PCどちらでも30秒で完了します。
              </p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-blue-700">{prefecture.maxScore}点</div>
                  <div className="mt-1 text-xs font-bold text-blue-600 uppercase tracking-wider">合計満点</div>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-indigo-700">
                    中{prefecture.targetGrades.join('・')}
                  </div>
                  <div className="mt-1 text-xs font-bold text-indigo-600 uppercase tracking-wider">対象学年</div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-purple-700">
                    {prefecture.practicalMultiplier > prefecture.coreMultiplier ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                  </div>
                  <div className="mt-1 text-xs font-bold text-purple-600 uppercase tracking-wider">実技教科</div>
                </div>
              </div>
            </section>

            {/* 埋め込み計算ツール */}
            <section id="calculator-section" className="scroll-mt-6">
              <InteractiveCalculator
                prefectureCode={prefectureCode}
                prefectureName={prefecture.name}
                maxScore={prefecture.maxScore}
              />
            </section>

            {/* 計算後・最高エンゲージ位置の Z会 CTA */}
            <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
              <div className="text-center">
                <div className="mb-2 text-sm font-bold text-slate-700">
                  内申点アップに通信教育という選択肢
                </div>
                <div className="mb-4 text-xs text-slate-500">
                  {prefecture.name}の高校入試に向けて、定期テスト対策と受験対策を両立
                </div>
                {/* Desktop: 728×90 */}
                <div className="hidden md:block">
                  <AffiliateAd id="zkai-banner" />
                </div>
                {/* Mobile: フルワイドCTAボタン */}
                <div className="md:hidden">
                  <div className="rounded-xl bg-white border border-blue-100 p-4 text-left">
                    <div className="mb-2 text-sm font-bold text-blue-900">
                      中学生のためのＺ会の通信教育
                    </div>
                    <div className="mb-3 text-xs text-blue-700 leading-relaxed">
                      テキスト＋添削で内申＋偏差値を伸ばす定番教材。
                    </div>
                    <AffiliateAd
                      id="zkai-text-request"
                      hideLabel
                      linkClassName="block w-full rounded-xl bg-blue-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-md shadow-blue-500/30 active:bg-blue-700"
                    />
                    <div className="mt-2 text-center text-[10px] text-slate-400">[PR]</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 東京限定：1020点満点 総合得点計算ツールへの誘導 */}
            {prefectureCode === 'tokyo' && (
              <section className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                    <Calculator className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-blue-900">
                      都立高校の総合得点（1020点満点）も計算する
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-blue-800">
                      内申点（調査書点300点）に学力検査700点・ESAT-J 20点を加えた<strong>1020点満点の総合得点</strong>を一括で算出できます。日比谷・西・国立など主要都立高校の合格ラインとも比較可能。
                    </p>
                  </div>
                  <Link
                    href="/tokyo/total-score"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                  >
                    総合得点を計算する
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )}

            {/* 高校別ボーダーライン一覧 */}
            <HighSchoolBorderlineTable prefectureCode={prefectureCode} prefectureName={prefecture.name} />

            {/* 志望校検討モードのユーザーへ：スタサプ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    志望校レベルに合わせた学習を始める
                  </div>
                  <div className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {prefecture.name}の高校別ボーダーラインを見て志望校が見えてきたら、いまの学力との差を埋める準備を。スタディサプリ中学講座なら全教科のプロ講師の映像授業を月額料金で受けられます。
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <AffiliateAd id="sapuri-banner-300" />
                </div>
              </div>
            </section>

            {/* 都道府県別詳細解説（SSRでGooglebotに情報を与える） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800">
                <Target className="h-6 w-6 text-red-500" />
                {prefecture.name}入試を攻略する「内申」のポイント
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 3行要約 */}
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-100 shadow-inner">
                  <h3 className="mb-4 font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    この県の重要指標
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">1</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.target }} />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">2</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.practical }} />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">3</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.maxScore }} />
                    </div>
                  </div>
                </div>

                {/* 具体的な点数目安 */}
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
                  <h3 className="mb-4 font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-blue-100">
                    <FileText className="h-4 w-4" />
                    内申点（合計）の目安
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs text-blue-100">オール3の場合</span>
                      <span className="font-bold">{guide.examples.all3}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs text-blue-100">オール4の場合</span>
                      <span className="font-bold">{guide.examples.all4}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-100">実技を1つ上げると</span>
                      <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white">{guide.examples.practicalPlus1}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-blue-200 leading-tight">
                    ※志望校のレベル（偏差値）により必要点数は大きく異なります。詳細は逆算ツールをご活用ください。
                  </p>
                </div>
              </div>

              {/* 注意点と罠 */}
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                   <AlertCircle className="h-5 w-5 text-red-500" />
                   <h3 className="font-bold text-slate-800">{guide.pitfalls.title}</h3>
                </div>
                <div className="space-y-4">
                  {guide.pitfalls.items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-50/30 border border-red-100/50">
                      <div className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 最低ライン・注意点・FAQを統合した詳細コンテンツ */}
            <PrefectureMinimumContent prefectureCode={prefectureCode} />

            {/* 根拠情報（一次情報へのリンクを強調） */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <BookOpen className="h-5 w-5 text-slate-500" />
                データの信頼性と算出根拠
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    当ツールの計算アルゴリズムは、{prefecture.name}教育委員会が公開する「令和8年度入学者選抜実施要綱」を当サイトの運営チーム（現役中学生エンジニア）が直接解析し、プログラム化したものです。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prefecture.sourceUrl && (
                      <a 
                        href={prefecture.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        公式発表資料(1)を見る
                      </a>
                    )}
                    {prefecture.sourceUrl2 && (
                      <a 
                        href={prefecture.sourceUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        公式発表資料(2)を見る
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <Calculator className="h-3.5 w-3.5 text-blue-500" />
                    計算式
                  </div>
                  <code className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded block overflow-x-auto whitespace-nowrap">
                    {formulaText} ＝ {prefecture.maxScore}点満点
                  </code>
                  <p className="mt-2 text-[10px] text-slate-500">
                    ※端数処理や特別活動の加点等、学校独自の選抜基準については各校の募集要項を必ずご確認ください。
                  </p>
                </div>
              </div>
            </section>

            <TrustInfo />

            {/* 回遊性アップ：関連ブログ・地域リンク */}
            <div className="grid gap-6 md:grid-cols-2">
              <BlogRelatedArticles prefectureCode={prefectureCode} limit={4} />

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <h3 className="mb-4 text-lg font-bold text-slate-800">近隣都道府県の計算ツール</h3>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {PREFECTURES
                    .filter(p => p.region === prefecture.region && p.code !== prefectureCode)
                    .slice(0, 6)
                    .map(p => (
                      <Link
                        key={p.code}
                        href={`/${p.code}/naishin`}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100"
                      >
                        {p.name}
                        <ChevronRight className="h-3 w-3 opacity-50" />
                      </Link>
                    ))}
                </div>
              </section>
            </div>

            {/* 学習方法の提案：通信教育・個別指導の選択肢 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-800">学習方法を選ぶ</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="mb-2 text-sm font-bold text-blue-900">難関校を狙うなら</div>
                  <p className="mb-3 text-xs text-blue-700 leading-relaxed">
                    トップ校を志望する場合、内申点だけでなく当日点の実力も鍵。Z会の通信教育は難関校受験対策で実績ある教材です。
                  </p>
                  <div className="text-sm">
                    <AffiliateAd id="zkai-text-advanced" hideLabel />（PR）
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="mb-2 text-sm font-bold text-emerald-900">個別指導で内申を底上げ</div>
                  <p className="mb-3 text-xs text-emerald-700 leading-relaxed">
                    自宅でマンツーマンの個別指導を受けたいなら、ネット松陰塾の自立学習スタイルが選択肢になります。
                  </p>
                  <div className="flex justify-start">
                    <AffiliateAd id="shoin-banner" centered={false} />
                  </div>
                </div>
              </div>
            </section>

            {/* 誤り報告フォーム */}
            <ErrorReportForm 
              prefectureCode={prefectureCode}
              prefectureName={prefecture.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
