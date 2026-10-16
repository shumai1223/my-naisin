import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Home } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { FukuokaResultFlow } from '@/components/Fukuoka/FukuokaResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';
import { AdUnit } from '@/components/AdSlot';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
const FUKUOKA_SOURCE_URL = getPrefectureByCode('fukuoka')?.sourceUrl ?? 'https://www.pref.fukuoka.lg.jp/';

// ページ冒頭のメタ行の「制度の最終確認」。値は prefectures.ts の既存データをそのまま表示するだけ（新しい日付は作らない）。
const FUKUOKA_PREF = getPrefectureByCode('fukuoka');
const formatYearMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return y && m && !Number.isNaN(Number(m)) ? `${y}年${Number(m)}月` : iso;
};
const FUKUOKA_LAST_VERIFIED = FUKUOKA_PREF?.lastVerified ? formatYearMonth(FUKUOKA_PREF.lastVerified) : null;

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
      <DatasetSchema
        name="福岡県 内申点・総合得点算出方式データ（A群・B群）"
        description="福岡県公立高校入試の内申点(中3のみ45点満点)・学力検査(300点満点)の算出方式と、学力・内申の両方が合格圏内の受験生を先に選ぶA群、残りを総合判断するB群の二段階選抜方式。福岡県教育委員会の入試情報に基づくデータ。"
        url="https://my-naishin.com/fukuoka/total-score"
        variableMeasured={['内申点', '学力検査点', 'A群B群選抜区分', '総合得点満点']}
        keywords={['内申点', '福岡県', 'A群B群', '入試制度']}
      />
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/fukuoka" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">福岡県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">内申点・当日点計算</span>
          </nav>

          {/* ページの頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              福岡県公立高校 内申点・当日点 計算
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              内申45点（中3のみ）＋学力300点・2026年度入試対応 ／ 出典：
              <a href={FUKUOKA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">福岡県教育委員会の公式情報</a>
              {FUKUOKA_LAST_VERIFIED && <> ／ 制度の最終確認 {FUKUOKA_LAST_VERIFIED}</>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              福岡県公立高校入試は、内申点（中3の9教科＝45点）と学力検査（5教科×60＝300点）の「両方の順位」で合否（A群・B群）が決まります。仕組みを早見表で整理しました。
            </p>
          </header>

          {/* 中1中2は不算入の強調（注釈の型: 薄い面＋太字の見出し。この1か所だけ bg-brand-50） */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-brand-50 p-4 md:p-5">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              福岡県の内申点は「中3のみ」45点満点
            </h2>
            <p className="text-base leading-[1.8] text-slate-900">
              よくある誤解ですが、<strong>福岡県の合否判定に使う内申点は中3の9教科だけ</strong>です。中1・中2の評定は調査書に記載されますが、得点には反映されません。だからこそ<strong>中3の成績が直接合否に効きます</strong>。
            </p>
          </section>

          {/* 仕組み */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              福岡県の合否は「学力300点＋内申45点」の2軸
            </h2>
            <dl className="grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
              <div className="px-4 py-4">
                <dt className="text-xs text-slate-600">学力検査（当日点）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">300<span className="text-base font-bold">点</span></dd>
                <dd className="mt-1 text-xs text-slate-600">5教科 × 60点</dd>
              </div>
              <div className="px-4 py-4">
                <dt className="text-xs text-slate-600">内申点（調査書）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">45<span className="text-base font-bold">点</span></dd>
                <dd className="mt-1 text-xs text-slate-600">中3の9教科 × 5段階</dd>
              </div>
            </dl>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              福岡県は二段階選抜です。学力検査（300点）と内申点（45点）の<strong>どちらの順位も合格圏に入る受験生を「A群」</strong>として先に合格予定とし、残りを総合的に判断して「B群」で選考します。学力と内申の<strong>両方のバランス</strong>が鍵です。
            </p>
          </section>

          {/* 内申点 早見表 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              内申点（45点満点）早見表＋学力検査の換算
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 内申点 */}
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">① 中3の評定パターン → 内申点（／45）</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th className="px-3 py-2 font-bold">評定の目安</th>
                        <th className="px-3 py-2 text-right font-bold">内申点</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-900">
                      {[
                        ['オール5', '45'],
                        ['5と4が中心', '40'],
                        ['オール4', '36'],
                        ['4と3が中心', '32'],
                        ['オール3', '27'],
                        ['3と2が中心', '23'],
                        ['オール2', '18'],
                      ].map(([pattern, score]) => (
                        <tr key={pattern}>
                          <td className="px-3 py-2">{pattern}</td>
                          <td className="px-3 py-2 text-right font-bold tabular-nums">{score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">内申点 ＝ 中3の9教科の評定合計</p>
              </div>
              {/* 学力検査 */}
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">② 学力検査 5教科の合計 → 300点満点</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th className="px-3 py-2 font-bold">1教科平均（／60）</th>
                        <th className="px-3 py-2 text-right font-bold">5教科合計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-900">
                      {[
                        ['54', '270'],
                        ['48', '240'],
                        ['42', '210'],
                        ['36', '180'],
                        ['30', '150'],
                        ['24', '120'],
                      ].map(([avg, total]) => (
                        <tr key={avg}>
                          <td className="px-3 py-2 font-bold tabular-nums">{avg}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">学力検査 ＝ 5教科 × 各60点（最大300）</p>
              </div>
            </div>
          </section>

          {/* B-5: 実数入力の計算機（結果連動の名簿導線つき） */}
          <div className="mb-10">
            <FukuokaResultFlow />
          </div>

          {/* 保護者向けリード（旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mb-10"
            placement="prefecture"
            heading="福岡の志望校、内申と当日点の両方が届いていますか？"
            body="福岡はA群でまず合否が決まるため、学力と内申の両立がカギ。お子さまにいま必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-5">
              {FUKUOKA_FAQS.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-[17px] font-bold text-slate-900">Q. {faq.question}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意 */}
          <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              合否判定の詳細・加重評価の対象学科・各高校の選考方法は年度により異なります。最新の情報は<a href={FUKUOKA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">福岡県教育委員会の公式情報</a>でご確認ください。
            </p>
          </div>

          {/* 関連リンク */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/fukuoka/naishin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">福岡県の内申点を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/fukuoka" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">福岡県の入試制度ガイド</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">5教科の偏差値を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse?pref=fukuoka" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">志望校から逆算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。保護者リードCTAより後ろ。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
