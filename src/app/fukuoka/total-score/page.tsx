import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

const FUKUOKA_FAQS = [
  {
    question: '福岡県の内申点は中1〜中3のどの学年が対象？',
    answer:
      '福岡県公立高校入試の合否判定に使う内申点（評定）は、中学3年生の9教科のみです。中1・中2の評定は調査書に記載されますが、合否判定の得点には反映されません。中3の9教科×5段階＝45点満点で計算します。',
  },
  {
    question: '福岡県の内申点は何点満点？',
    answer:
      '中3の9教科（国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭）を5段階評定し、合計した45点満点です。オール5で45点、オール4で36点、オール3で27点になります。',
  },
  {
    question: '福岡県の学力検査（当日点）は何点満点？',
    answer:
      '学力検査は国語・数学・社会・理科・英語の5教科で、各教科60点・合計300点満点です。福岡県下一斉に同一問題で行われます。',
  },
  {
    question: '福岡県のA群・B群とは？',
    answer:
      '福岡県は二段階選抜です。学力検査（300点）と調査書（内申点45点）それぞれの順位がともに合格圏に入っている受験生をまず「A群（第1群）」として合格予定者とし、残りを学力・調査書・面接などを総合してB群（第2群）として選考します。学力と内申の「両方のバランス」が重要です。',
  },
  {
    question: '加重評価とは？',
    answer:
      '一部の高校の学科・コース・系では、特定の教科の内申点を1.5倍に換算する「加重評価」があります。志望する学科が加重評価の対象かどうかを事前に確認しましょう。',
  },
];

export const metadata: Metadata = {
  title: '福岡県公立高校 内申点・当日点 計算【内申45(中3のみ)+学力300】 | My Naishin',
  description:
    '福岡県公立高校入試の内申点と当日点の計算方法を解説。内申点は中3の9教科×5＝45点満点（中1・中2は合否に不算入）、学力検査は5教科×60＝300点満点。A群・B群の二段階選抜の仕組みと早見表で確認。2026年度入試対応。',
  keywords: ['福岡県 公立高校 内申点 計算', '福岡県 内申点 何点', '福岡 内申点 中3だけ', '福岡県 学力検査 配点', '福岡 当日点 計算', '福岡県 A群 B群', '福岡県 公立高校 合格点', '福岡 内申点 45点'],
  alternates: {
    canonical: 'https://my-naishin.com/fukuoka/total-score',
  },
  openGraph: {
    title: '福岡県公立高校 内申点・当日点 計算【内申45(中3のみ)+学力300】 | My Naishin',
    description: '福岡県公立高校入試の内申点(中3のみ45点)＋学力検査(300点)とA群・B群の仕組みを早見表で解説。',
    url: 'https://my-naishin.com/fukuoka/total-score',
  },
};

export default function FukuokaTotalScorePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '福岡県', url: 'https://my-naishin.com/fukuoka' },
          { name: '内申点・当日点計算', url: 'https://my-naishin.com/fukuoka/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-fukuoka-total-score"
        name="福岡県公立高校 内申点・当日点を計算する方法"
        description="福岡県公立高校入試で使う内申点（中3の9教科45点）と学力検査（300点）を算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '内申点（45点満点）を求める', text: '中3の9教科の5段階評定を合計します（最大45）。中1・中2は合否に算入されません。' },
          { name: '学力検査点（300点満点）を求める', text: '5教科×60点の合計（最大300）を算出します。' },
          { name: 'A群・B群を意識する', text: '学力300点と内申45点のどちらの順位も合格圏に入るとA群（合格予定）。両方のバランスが重要です。' },
          { name: '加重評価を確認', text: '志望学科に特定教科を1.5倍する加重評価があるか確認します。' },
        ]}
      />
      <FAQPageSchema faqItems={FUKUOKA_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/fukuoka" className="hover:text-blue-600">福岡県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点・当日点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              福岡県公立高校 内申点・当日点 計算
            </h1>
            <div className="mt-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
              内申45点（中3のみ）＋学力300点・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              福岡県公立高校入試は、内申点（中3の9教科＝45点）と学力検査（5教科×60＝300点）の<br />
              「両方の順位」で合否（A群・B群）が決まります。仕組みを早見表で整理しました。
            </p>
          </header>

          {/* 中1中2は不算入の強調 */}
          <section className="mb-8 rounded-2xl border-2 border-sky-200 bg-sky-50 p-6 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-sky-900">
              <AlertCircle className="h-5 w-5 text-sky-600" />
              福岡県の内申点は「中3のみ」45点満点
            </h2>
            <p className="text-sm leading-relaxed text-sky-900">
              よくある誤解ですが、<strong>福岡県の合否判定に使う内申点は中3の9教科だけ</strong>です。中1・中2の評定は調査書に記載されますが、得点には反映されません。だからこそ<strong>中3の成績が直接合否に効きます</strong>。
            </p>
          </section>

          {/* 仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-sky-500" />
              福岡県の合否は「学力300点＋内申45点」の2軸
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <div className="text-xs font-bold text-blue-600 mb-1">学力検査（当日点）</div>
                <div className="text-3xl font-black text-blue-700">300<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-blue-600 mt-1">5教科 × 60点</div>
              </div>
              <div className="rounded-xl border-2 border-sky-200 bg-sky-50 p-4 text-center">
                <div className="text-xs font-bold text-sky-600 mb-1">内申点（調査書）</div>
                <div className="text-3xl font-black text-sky-700">45<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-sky-600 mt-1">中3の9教科 × 5段階</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              福岡県は二段階選抜です。学力検査（300点）と内申点（45点）の<strong>どちらの順位も合格圏に入る受験生を「A群」</strong>として先に合格予定とし、残りを総合的に判断して「B群」で選考します。学力と内申の<strong>両方のバランス</strong>が鍵です。
            </p>
          </section>

          {/* 内申点 早見表 */}
          <section className="mb-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-sky-500" />
              内申点（45点満点）早見表＋学力検査の換算
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {/* 内申点 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-sky-900">① 中3の評定パターン → 内申点（／45）</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-sky-600 text-white text-left">
                        <th className="border border-sky-400 px-3 py-1.5 font-bold">評定の目安</th>
                        <th className="border border-sky-400 px-3 py-1.5 font-bold text-right">内申点</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['オール5', '45'],
                        ['5と4が中心', '40'],
                        ['オール4', '36'],
                        ['4と3が中心', '32'],
                        ['オール3', '27'],
                        ['3と2が中心', '23'],
                        ['オール2', '18'],
                      ].map(([pattern, score]) => (
                        <tr key={pattern} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5">{pattern}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right font-bold">{score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">内申点 ＝ 中3の9教科の評定合計</p>
              </div>
              {/* 学力検査 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-blue-900">② 学力検査 5教科の合計 → 300点満点</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white text-left">
                        <th className="border border-blue-400 px-3 py-1.5 font-bold">1教科平均（／60）</th>
                        <th className="border border-blue-400 px-3 py-1.5 font-bold text-right">5教科合計</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['54', '270'],
                        ['48', '240'],
                        ['42', '210'],
                        ['36', '180'],
                        ['30', '150'],
                        ['24', '120'],
                      ].map(([avg, total]) => (
                        <tr key={avg} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-bold">{avg}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right">{total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">学力検査 ＝ 5教科 × 各60点（最大300）</p>
              </div>
            </div>
          </section>

          {/* 結果保存・名簿化（堀A） */}
          <SaveResultCTA
            source="prefecture"
            prefectureCode="fukuoka"
            prefectureName="福岡県"
            className="mb-8"
            heading="福岡の「内申＋当日点」のバランスと志望校情報を受け取りませんか？"
            body="内申(中3)・当日点の伸ばし方、修猷館・福岡など志望校の最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* アフィリエイト */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              目標点まであと一歩のあなたへ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              福岡県公立高校の対策には<AffiliateAd id="zkai-text-middle" hideLabel auditHide />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </section>

          {/* 保護者向けリード */}
          <ParentLeadCTA
            className="mb-8"
            heading="福岡の志望校、内申と当日点の両方が届いていますか？"
            body="福岡はA群でまず合否が決まるため、学力と内申の両立がカギ。お子さまにいま必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FUKUOKA_FAQS.map((faq, i) => (
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
                合否判定の詳細・加重評価の対象学科・各高校の選考方法は年度により異なります。最新の情報は<a href="https://www.pref.fukuoka.lg.jp/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">福岡県教育委員会の公式情報</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/fukuoka/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">福岡県の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/fukuoka" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">福岡県の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">5教科の偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=fukuoka" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
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
