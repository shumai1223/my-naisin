import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Bell, ExternalLink } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { SITE_URL } from '@/lib/naishin-dataset';

// 各都道府県教育委員会が公式に発表済みの入試制度変更予告を集約するトラッキングページ（∞・継続更新型）。
// 現時点の掲載内容は src/lib/total-score/registry.ts 内の source フィールドで既に出典確認済みの
// 事実のみ（新規の裏取りは伴わない）。新しい変更予告を確認するたびに UPCOMING_CHANGES に追記していく。

interface UpcomingChange {
  prefCode: string;
  prefName: string;
  effectiveYear: string;
  headline: string;
  detail: string;
  sourceUrl: string;
  sourceTitle: string;
  confirmedDate: string;
}

const UPCOMING_CHANGES: UpcomingChange[] = [
  {
    prefCode: 'kyoto',
    prefName: '京都府',
    effectiveYear: '令和9年度（2027年度）',
    headline: '前期選抜と中期選抜を一本化する予定',
    detail:
      '京都府は令和9年度入試から、現行の前期選抜・中期選抜（・後期選抜）という区分を一本化する予定です。令和8年度（2026年度）入試は従来どおりの方式で実施されます。前期・中期で内申点の満点・配点方式が異なる現行制度が変わるため、対象学年の生徒・保護者は今後の正式発表に注意が必要です。',
    sourceUrl: 'https://www.kyoto-be.ne.jp/koukyou/cms/?p=7836',
    sourceTitle: '京都府教育委員会 公立高等学校入学者選抜要項（中期選抜）',
    confirmedDate: '2026-06-13',
  },
  {
    prefCode: 'niigata',
    prefName: '新潟県',
    effectiveYear: '令和9年度（2027年度）',
    headline: '特色化選抜を廃止する予定',
    detail:
      '新潟県は令和9年度入試から特色化選抜を廃止する予定です。令和8年度（2026年度）入試では一般選抜（学力検査＋学校独自検査）と特色化選抜の両方が実施されています。特色化選抜がなくなることで、志望校選びの選抜方式の選択肢が変わる可能性があります。',
    sourceUrl: 'https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf',
    sourceTitle: '新潟県教育委員会 公立高等学校入学者選抜要項',
    confirmedDate: '2026-06-13',
  },
  {
    prefCode: 'tochigi',
    prefName: '栃木県',
    effectiveYear: '令和9年度（2027年度）',
    headline: '入試制度の変更が予告されている（詳細未発表）',
    detail:
      '栃木県は令和9年度入試から制度変更が予告されていますが、変更の具体的な内容（内申・学力検査の比率変更の有無等）は本ページ作成時点では未発表です。正式な要項が発表され次第、内容を追記します。',
    sourceUrl:
      'https://www.pref.tochigi.lg.jp/m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html',
    sourceTitle: '栃木県教育委員会 県立高等学校入学者選抜要項',
    confirmedDate: '2026-06-13',
  },
  {
    prefCode: 'aichi',
    prefName: '愛知県',
    effectiveYear: '令和9年度（2027年度）',
    headline: '調査書（内申書）から「性別」「行動の記録」「出欠の記録」の3項目が削除される予定',
    detail:
      '愛知県・名古屋市・豊橋市の各教育委員会が連名で、令和9(2027)年4月に入学する人が受検する入試から、調査書情報の登録事項のうち「性別」「行動の記録」（基本的な生活習慣・責任感等10項目）「出欠の記録」（中2・中3の欠席日数）を削除すると発表しました。**内申点の算出に使う「学習の記録（評定）」の欄自体には変更がなく、内申点の計算方法（9教科×2倍・90点満点）は従来どおりです**。削除されるのは選抜に直接使われない記載項目のみです。',
    sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
    sourceTitle: '愛知県教育委員会・名古屋市教育委員会・豊橋市教育委員会「調査書情報の変更点」（令和8年4月発行）',
    confirmedDate: '2026-07-23',
  },
  {
    prefCode: 'saitama',
    prefName: '埼玉県',
    effectiveYear: '令和9年度（2027年度）',
    headline: '調査書の記載事項を削減し、全受検生対象の面接と「自己評価資料」を新設',
    detail:
      '埼玉県教育委員会は令和9(2027)年度入試から、①調査書（内申書）の記載事項を「特別活動等の記録」「出欠の記録」等を除いた「各教科の学習の記録（9教科5段階の評定）」を基本とする形に整理、②これまで学校・学科ごとに一部でのみ実施していた面接を全ての高校・全ての受検生を対象に実施、③受検生が自分の体験や意欲を記述する「自己評価資料」（それ自体は採点せず面接の参考資料として使用）を新設する、と発表しました。**内申点の算出に使う「学習の記録（評定）」自体の項目（9教科×5段階）には変更がなく、学年比率（1年:2年:3年）を①1:1:1・②1:1:2・③1:1:3から高校が選ぶ仕組みも従来どおり維持されます**。学力検査は5教科各100点満点のまま変更ありませんが、特色選抜での傾斜配点（3教科まで）が新たに導入されます。',
    sourceUrl: 'https://www.pref.saitama.lg.jp/documents/258788/news2024092601.pdf',
    sourceTitle: '埼玉県教育委員会「令和9年度埼玉県公立高等学校入学者選抜実施基本方針」（令和6年9月26日）',
    confirmedDate: '2026-07-23',
  },
];

const FAQS = [
  {
    question: 'このページはどのように更新されますか？',
    answer:
      '各都道府県教育委員会が公式に発表した入試制度の変更予告を確認でき次第、随時追記していく継続更新型のページです。「令和◯年度から変わる予定」という未確定情報も、教育委員会が公式に発表している場合のみ掲載し、噂・推測は掲載しません。',
  },
  {
    question: '自分の県が載っていない場合、変更はないということですか？',
    answer:
      '必ずしもそうとは限りません。本ページは「本サイトが把握している範囲で、教育委員会が既に公式発表している変更予告」のみを掲載しています。未確認・未発表の変更が今後発表される可能性は常にあります。志望校の最新情報は必ず各都道府県教育委員会の公式サイトでもご確認ください。',
  },
  {
    question: '掲載されている情報の正確性はどう担保されていますか？',
    answer:
      '各項目に一次ソース（都道府県教育委員会が公表する入学者選抜実施要項等）のURLと確認日を明記しています。要項の記載内容をそのまま要約したものであり、推測・断定を含む記述は行っていません。',
  },
];

export const metadata: Metadata = {
  title: '公立高校入試 制度変更点まとめ【都道府県別・随時更新】| My Naishin',
  description:
    '各都道府県教育委員会が公式発表した公立高校入試の制度変更予告を都道府県別にまとめた、随時更新のトラッキングページです。一次ソースを明記し、噂・推測は掲載しません。',
  keywords: ['入試 制度変更', '高校入試 変更点', '選抜方式 変更', '内申点 制度改定'],
  alternates: { canonical: `${SITE_URL}/nyushi-seido-henkou` },
  openGraph: {
    title: '公立高校入試 制度変更点まとめ | My Naishin',
    description: '都道府県教育委員会が公式発表した入試制度の変更予告を随時更新でまとめています。',
    url: `${SITE_URL}/nyushi-seido-henkou`,
    type: 'article',
  },
};

export default function NyushiSeidoHenkouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '入試制度変更点まとめ', url: `${SITE_URL}/nyushi-seido-henkou` },
        ]}
      />
      <ArticleSchema
        title="公立高校入試 制度変更点まとめ"
        description="各都道府県教育委員会が公式発表した公立高校入試の制度変更予告を都道府県別にまとめた継続更新ページ"
        datePublished="2026-07-23"
        dateModified="2026-07-23"
        author="しゅうまい"
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">入試制度変更点まとめ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
              <Bell className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              公立高校入試 制度変更点まとめ
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              各都道府県教育委員会が公式発表した入試制度の変更予告を集約した、随時更新のページです。
              一次ソースを明記し、噂・推測は掲載しません。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
            <p className="text-sm leading-relaxed text-amber-900">
              現時点で本サイトが把握している変更予告は{UPCOMING_CHANGES.length}件です。教育委員会の新しい
              発表を確認でき次第、追記していきます。掲載していない都道府県に変更がないとは限りません。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            {UPCOMING_CHANGES.map((c) => (
              <div key={c.prefCode} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                    {c.prefName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {c.effectiveYear}〜
                  </span>
                </div>
                <h2 className="mb-2 text-lg font-bold text-slate-800">{c.headline}</h2>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">{c.detail}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    出典: {c.sourceTitle} <ExternalLink className="h-3 w-3" />
                  </a>
                  <span>確認日: {c.confirmedDate}</span>
                </div>
                <Link
                  href={`/${c.prefCode}/naishin`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  {c.prefName}の現行制度を確認する <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="mb-3 text-sm text-slate-600">
              都道府県別の内申点計算方法や制度の違いをもっと詳しく知りたい方はこちら
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/naishin-kakusa"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                内申点格差レポート
              </Link>
              <Link
                href="/report/2026"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                内申点白書2026
              </Link>
              <Link
                href="/"
                className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
              >
                内申点を計算する
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
