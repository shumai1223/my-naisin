import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, NotebookPen, ChevronRightSquare, ShieldCheck } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ChousashoSimulator } from '@/components/HyoteiHeikin/ChousashoSimulator';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '調査書シミュレーターは何ができますか？',
    answer:
      '大学入学者選抜の調査書（文部科学省 別紙様式１）の「２．各教科・科目等の学習の記録」「３．各教科の学習成績の状況」「４．学習成績概評」を、実際の調査書と同じ並びで再現します。科目と評定を入力するだけで、先生が書く調査書に近い形式で内容を確認できます。',
  },
  {
    question: '生徒本人は自分の調査書を見られないと聞きました。このツールで代わりになりますか？',
    answer:
      '調査書そのものは高等学校長が作成し厳封して大学に提出するため、生徒本人が原本を見る機会は通常ありません。このツールは公式の計算方法で「学習成績の状況」がどう記載されるかを事前にシミュレーションするもので、実際の調査書に記載される総合所見・特別活動の記録・出欠の記録などは含みません。',
  },
  {
    question: '修得単位数の欄に入力できないのはなぜですか？',
    answer:
      '文部科学省の計算例では、修得単位数の大小にかかわらず、各科目を「評定数1」として数えます。単位数は計算式に一切登場しないため、誤った重み付けを防ぐ目的であえて入力欄を設けていません。',
  },
  {
    question: '複数の学年にわたって履修する科目はどう入力すればいいですか？',
    answer:
      '保健体育（体育・保健）のように複数学年で履修する科目は、学年ごとに行を分けて入力してください。文部科学省の通知は「各学年ごとの評定数をそれぞれ1科目分として取り扱う」としており、このツールも同じ扱いをします。',
  },
];

const HOWTO_STEPS = [
  { name: '科目を追加する', text: '教科・科目名・学年・評定を入力し、履修したすべての科目を追加します。' },
  { name: '調査書 様式のプレビューを確認する', text: '入力した科目が「２．各教科・科目等の学習の記録」の表として、実際の調査書と同じ並びで表示されます。' },
  { name: '学習成績の状況と概評を確認する', text: '「３．各教科の学習成績の状況」「４．学習成績概評」が自動計算され、調査書に記載される形式で確認できます。' },
];

export const metadata: Metadata = {
  title: '調査書シミュレーター【大学受験】様式１の見た目で学習成績の状況を確認 | My Naishin',
  description:
    '大学入学者選抜の調査書（文部科学省 別紙様式１）を、実際の様式と同じ見た目で再現する無料シミュレーター。科目と評定を入力するだけで、教科ごとの学習成績の状況・全体の学習成績の状況・学習成績概評A〜Eが調査書と同じ並びで確認できます。',
  keywords: ['調査書 シミュレーター', '調査書 様式1', '調査書 大学受験', '学習成績の状況 調査書', '調査書 見本'],
  alternates: { canonical: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/chousasho` },
  openGraph: {
    title: '調査書シミュレーター【大学受験】様式１の見た目で確認 | My Naishin',
    description: '大学入試の調査書（別紙様式１）を実際の見た目で再現。科目と評定を入力するだけ。',
    url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/chousasho`,
    type: 'article',
  },
};

export default function ChousashoSimulatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '評定平均計算', url: `${SITE_URL}/hyotei-heikin` },
          { name: '学習成績の状況（大学受験）', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki` },
          { name: '調査書シミュレーター', url: `${SITE_URL}/hyotei-heikin/gakushu-seiseki/chousasho` },
        ]}
      />
      <WebApplicationSchema
        name="調査書シミュレーター（大学受験）"
        description="大学入学者選抜の調査書（別紙様式１）を実際の様式と同じ見た目で再現する無料シミュレーター"
        url={`${SITE_URL}/hyotei-heikin/gakushu-seiseki/chousasho`}
      />
      <FAQPageSchema faqItems={FAQS} />
      <HowToSchema
        id="howto-chousasho-simulator"
        name="調査書シミュレーターの使い方"
        description="科目と評定を入力し、調査書 様式１と同じ形式で学習成績の状況・概評を確認する手順"
        totalTime="PT2M"
        steps={HOWTO_STEPS}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-emerald-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin" className="hover:text-emerald-600">評定平均計算</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hyotei-heikin/gakushu-seiseki" className="hover:text-emerald-600">学習成績の状況</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">調査書シミュレーター</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
              <NotebookPen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              調査書シミュレーター【大学受験】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              科目と評定を入力すると、実際の<strong className="text-emerald-700">調査書 様式１</strong>と同じ並びで
              「あなたの調査書はこう書かれる」を確認できます。生徒本人は原本を見る機会がないため、事前に仕組みを知る目的で作りました。
            </p>
          </header>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-600">
                <div className="mb-1 font-bold text-slate-800">計算根拠と注意</div>
                文部科学省「令和９年度大学入学者選抜実施要項について（通知）」別紙様式１の記載どおりに計算します。
                実際の調査書には総合所見・特別活動の記録・出欠の記録なども記載されますが、このツールでは
                「学習の記録」「学習成績の状況」「学習成績概評」のみを再現しています。入力内容は保存されません。
              </div>
            </div>
          </div>

          <div id="simulator-section">
            <ChousashoSimulator />
          </div>

          {/* このシミュレーターに映らない残りの記載欄 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              大学に届く調査書1枚には、あと何が書かれているか
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              このシミュレーターが再現するのは調査書（別紙様式1）9区分のうち「学習の記録」「学習成績の状況」
              「学習成績概評」の3区分だけです。実際に高等学校長が作成して大学に提出する調査書には、以下の項目も
              同じ1枚に記載されます。数値の計算には一切関係しませんが、大学側は調査書全体を見て評価するため、
              「自分の調査書に何が書かれるか」を知っておいて損はありません。
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm leading-relaxed text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">総合的な探究の時間の記録</div>
                学習活動・観点・評価の3列。専門学科で「課題研究」等に、理数科で「理数探究」等に代替した場合は
                斜線が引かれ空欄になる。
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">特別活動の記録</div>
                ホームルーム活動・生徒会活動・学校行事の3項目について、各学校が設定した観点で十分満足できる
                活動状況と判断された学年に○印。
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">指導上参考となる諸事項</div>
                部活動・資格取得・表彰歴・留学経験など、学習指導を進める上で必要な情報として学校が精選して
                記入する自由記述欄。記入する内容が無ければその旨が明示される。
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 font-bold text-slate-800">出欠の記録</div>
                授業日数・出席停止や忌引き等の日数・欠席日数・出席日数などを学年ごとに記載。指導要録の記載を
                そのまま転記するもので、学校側の解釈や要約は入らない。
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              出典：文部科学省「令和9年度大学入学者選抜実施要項」（令和8年5月27日付け8文科高第318号）
              別紙様式1・調査書記入上の注意事項等について10〜12・14
              <a
                href="https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-emerald-700 underline"
              >
                原文PDF
              </a>
              。残る「ふりがな・氏名等の基本情報」「備考」の2区分は個人情報や個別事情の記載欄のため割愛しています。
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
              あわせて確認したいツール
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/hyotei-heikin/gakushu-seiseki"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                学習成績の状況 計算ツール（一覧表示）
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gyakusan"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                目標に必要な評定を逆算する
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/kyoka-betsu"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                教科ごとの学習成績の状況を計算
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/gaihyou"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                概評A〜Eまであと何点？境界チェック
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/yokuaru-machigai"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                計算でよくある3つの誤りを検証
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
              <Link
                href="/hyotei-heikin/gakushu-seiseki/tousei-han-i"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                到達可能範囲をチェック（高1・高2向け）
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
