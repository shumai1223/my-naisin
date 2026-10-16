import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Home } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { AichiTotalScoreResultFlow } from '@/components/Aichi/AichiTotalScoreResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';
import { AdUnit } from '@/components/AdSlot';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
const AICHI_SOURCE_URL =
  getPrefectureByCode('aichi')?.sourceUrl ?? 'https://www.pref.aichi.jp/soshiki/kotogakko/';

// ページ冒頭のメタ行の「制度の最終確認」。値は prefectures.ts の既存データをそのまま表示するだけ（新しい日付は作らない）。
const AICHI_PREF = getPrefectureByCode('aichi');
const formatYearMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return y && m && !Number.isNaN(Number(m)) ? `${y}年${Number(m)}月` : iso;
};
const AICHI_LAST_VERIFIED = AICHI_PREF?.lastVerified ? formatYearMonth(AICHI_PREF.lastVerified) : null;

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const AICHI_FAQS = [
  {
    question: '愛知県の内申点（評定得点）は何点満点？',
    answer:
      '愛知県公立高校入試の内申点は、中3の9教科の評定合計（最大45）を2倍した「評定得点」で、最大90点満点です。中3の成績のみが対象です。',
  },
  {
    question: '愛知県の当日点（学力検査）は何点満点？',
    answer:
      '学力検査は国語・数学・社会・理科・英語の5教科で、各教科22点・合計110点満点です（令和5年度入試以降のマークシート方式）。全日制単位制高校では、得点の高い3教科を2倍にする傾斜配点を行う場合があります。',
  },
  {
    question: '愛知県の評価方法Ⅰ〜Ⅴとは？',
    answer:
      '校内順位を決めるとき、内申点（評定得点）と当日点（学力検査）のどちらを重視するかを、各高校が5つの方法（Ⅰ〜Ⅴ）から選びます。Ⅰは等倍、Ⅱ・Ⅳは内申重視、Ⅲ・Ⅴは当日点重視です。志望校がどの方法かで、必要な得点配分が変わります。',
  },
  {
    question: '愛知県は内申と当日点どちらが重要？',
    answer:
      '志望校が選ぶ評価方法によります。評価方法Ⅳ（内申×2）の高校は内申点が重く、評価方法Ⅴ（当日点×2）の高校は当日点が重くなります。難関校では当日点を重視する評価方法Ⅲ・Ⅴを採用する学校が多い傾向です。志望校の評価方法を必ず確認しましょう。',
  },
];

export const metadata: Metadata = {
  title: '愛知県公立高校 総合得点 計算【評価方法Ⅰ〜Ⅴ・内申90+当日110】 | My Naishin',
  description:
    '愛知県公立高校入試の総合得点（校内順位）の計算方法を解説。内申点（評定得点・最大90点）＋当日点（学力検査・110点）を、志望校の評価方法Ⅰ〜Ⅴでどう重み付けするかを早見表で確認。評定合計→評定得点の換算表・計算例つき。2026年度入試対応。',
  keywords: ['愛知県 公立高校 内申点 当日点 計算', '愛知県 評価方法', '愛知 内申点 計算方法', '愛知県 校内順位', '愛知 当日点 計算', '愛知 評定得点', '愛知県 公立高校 総合得点', '評価方法 1 2 3 4 5 愛知'],
  alternates: {
    canonical: 'https://my-naishin.com/aichi/total-score',
  },
  openGraph: {
    title: '愛知県公立高校 総合得点 計算【評価方法Ⅰ〜Ⅴ・内申90+当日110】 | My Naishin',
    description: '愛知県公立高校入試の内申点（90点）＋当日点（110点）と評価方法Ⅰ〜Ⅴの計算を早見表で解説。',
    url: 'https://my-naishin.com/aichi/total-score',
  },
};

// 評価方法ごとの満点は「式」から再計算した確定値（内申最大90・当日最大110）。
// Ⅰ:90+110=200 / Ⅱ:135+110=245 / Ⅲ:90+165=255 / Ⅳ:180+110=290 / Ⅴ:90+220=310
const HYOKA_METHODS = [
  { type: 'Ⅰ', formula: '評定得点 ＋ 学力検査', naishinMax: 90, gakuryokuMax: 110, total: 200, note: '内申と当日点を等倍。標準的な配点。' },
  { type: 'Ⅱ', formula: '評定得点 ×1.5 ＋ 学力検査', naishinMax: 135, gakuryokuMax: 110, total: 245, note: 'やや内申重視。' },
  { type: 'Ⅲ', formula: '評定得点 ＋ 学力検査 ×1.5', naishinMax: 90, gakuryokuMax: 165, total: 255, note: 'やや当日点重視。進学校に多い。' },
  { type: 'Ⅳ', formula: '評定得点 ×2 ＋ 学力検査', naishinMax: 180, gakuryokuMax: 110, total: 290, note: '内申を最も重視。' },
  { type: 'Ⅴ', formula: '評定得点 ＋ 学力検査 ×2', naishinMax: 90, gakuryokuMax: 220, total: 310, note: '当日点を最も重視。難関校に多い。' },
];

export default function AichiTotalScorePage() {
  return (
    <>
      <DatasetSchema
        name="愛知県 総合得点算出方式データ（評価方法Ⅰ〜Ⅴ）"
        description="愛知県公立高校入試の総合得点算出方式（内申点・評定得点90点満点＋当日点110点満点を志望校の評価方法Ⅰ〜Ⅴで重み付けする方法）。愛知県教育委員会の入学者選抜情報に基づくデータ。"
        url="https://my-naishin.com/aichi/total-score"
        variableMeasured={['評定得点', '当日点', '評価方法Ⅰ〜Ⅴ', '総合得点満点']}
        keywords={['総合得点', '愛知県', '評価方法', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '愛知県', url: 'https://my-naishin.com/aichi' },
          { name: '総合得点・評価方法計算', url: 'https://my-naishin.com/aichi/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-aichi-total-score"
        name="愛知県公立高校 総合得点（校内順位）を計算する方法"
        description="愛知県公立高校入試の校内順位を、内申点（評定得点）・学力検査点・志望校の評価方法Ⅰ〜Ⅴから算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '評定得点（90点満点）を求める', text: '中3の9教科の評定合計（最大45）を2倍して評定得点（最大90点）を算出します。' },
          { name: '学力検査点（110点満点）を求める', text: '5教科×22点の合計（最大110点）を算出します。' },
          { name: '志望校の評価方法を確認', text: '志望校が採用する評価方法Ⅰ〜Ⅴを確認します。内申重視か当日点重視かが変わります。' },
          { name: '評価方法の式で総合得点を計算', text: '例：評価方法Ⅲなら「評定得点 ＋ 学力検査×1.5」。校内順位はこの合計が高い順に決まります。' },
        ]}
      />
      <FAQPageSchema faqItems={AICHI_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/aichi" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">愛知県</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">総合得点・評価方法計算</span>
          </nav>

          {/* ページの頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              愛知県公立高校 総合得点・評価方法 計算
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              内申90点＋当日110点・評価方法Ⅰ〜Ⅴ・2026年度入試対応 ／ 出典：
              <a href={AICHI_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">愛知県教育委員会の公式サイト</a>
              {AICHI_LAST_VERIFIED && <> ／ 制度の最終確認 {AICHI_LAST_VERIFIED}</>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              愛知県公立高校入試の校内順位は、内申点（評定得点・最大90点）と当日点（学力検査・110点）を志望校が選ぶ「評価方法Ⅰ〜Ⅴ」で重み付けして決まります。仕組みと早見表をまとめました。
            </p>
          </header>

          {/* 仕組み */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              愛知県の合否は「内申点＋当日点」を評価方法で重み付け
            </h2>
            <dl className="grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
              <div className="px-4 py-4">
                <dt className="text-xs text-slate-600">内申点（評定得点）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">90<span className="text-base font-bold">点</span></dd>
                <dd className="mt-1 text-xs text-slate-600">中3の9教科評定合計(最大45)×2</dd>
              </div>
              <div className="px-4 py-4">
                <dt className="text-xs text-slate-600">当日点（学力検査）</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">110<span className="text-base font-bold">点</span></dd>
                <dd className="mt-1 text-xs text-slate-600">5教科 × 22点</dd>
              </div>
            </dl>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              愛知県の特徴は、内申と当日点の比重を志望校ごとに<strong>「評価方法Ⅰ〜Ⅴ」</strong>の5パターンから選ぶ点です。同じ得点でも、志望校がどの評価方法かによって校内順位が変わります。
            </p>
          </section>

          {/* B-5: 実数入力の総合得点計算機（結果連動の名簿導線つき） */}
          <div className="mb-10">
            <AichiTotalScoreResultFlow />
          </div>

          {/* 評定得点 早見表 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              評定合計 → 評定得点（90点満点）換算早見表
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              内申点（評定得点）は<strong>中3の9教科の評定合計を2倍</strong>するだけ。下の早見表で自分の評定得点をすぐ確認できます。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-bold">9教科の評定合計（／45）</th>
                    <th className="px-3 py-2 text-right font-bold">評定得点（×2・／90）</th>
                    <th className="px-3 py-2 font-bold">目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-900">
                  {[
                    ['45', '90', 'オール5'],
                    ['40', '80', '5と4が中心'],
                    ['36', '72', 'オール4'],
                    ['32', '64', '4と3が中心'],
                    ['27', '54', 'オール3'],
                    ['23', '46', '3と2が中心'],
                    ['18', '36', 'オール2'],
                  ].map(([sum, score, note]) => (
                    <tr key={sum}>
                      <td className="px-3 py-2 font-bold tabular-nums">{sum}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">{score}</td>
                      <td className="px-3 py-2">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ※ 評定は中3のみが対象。9教科の評定を入れて合計を出すなら<Link href="/aichi/naishin" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">愛知県の内申点計算ツール</Link>が便利です。
            </p>
          </section>

          {/* 評価方法Ⅰ〜Ⅴ 早見表 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              評価方法Ⅰ〜Ⅴ 早見表（計算式・満点・特徴）
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              校内順位は、志望校が選んだ評価方法の式で出した合計点が高い順に決まります。内申（最大90）と当日点（最大110）をどう重み付けするかで、満点も変わります。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="whitespace-nowrap px-3 py-2 font-bold">評価方法</th>
                    <th className="px-3 py-2 font-bold">計算式</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-bold">満点</th>
                    <th className="px-3 py-2 font-bold">特徴</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-900">
                  {HYOKA_METHODS.map((m) => (
                    <tr key={m.type}>
                      <td className="px-3 py-2 font-bold">{m.type}</td>
                      <td className="whitespace-nowrap px-3 py-2">{m.formula}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-bold tabular-nums">{m.total}</td>
                      <td className="px-3 py-2">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              ※ 満点＝内申(最大90)・当日(最大110)を各式に当てはめた理論上の最大値。Ⅱ＝135+110、Ⅲ＝90+165、Ⅳ＝180+110、Ⅴ＝90+220。
            </p>
          </section>

          {/* 計算例 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              総合得点の計算例
            </h2>
            <h3 className="mb-2 text-[17px] font-bold text-slate-900">例：評定合計38・当日点95点</h3>
            <ul className="list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>評定得点 ＝ 38 × 2 ＝ <strong className="whitespace-nowrap">76点</strong></li>
              <li>評価方法Ⅰ（等倍）：76 ＋ 95 ＝ <strong className="whitespace-nowrap">171点</strong>（／200）</li>
              <li>評価方法Ⅲ（当日×1.5）：76 ＋ 95×1.5 ＝ 76 ＋ 142.5 ＝ <strong className="whitespace-nowrap">218.5点</strong>（／255）</li>
              <li>評価方法Ⅳ（内申×2）：76×2 ＋ 95 ＝ 152 ＋ 95 ＝ <strong className="whitespace-nowrap">247点</strong>（／290）</li>
            </ul>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              同じ生徒でも、志望校の評価方法によって有利・不利が変わります。当日点が強い人は評価方法Ⅲ・Ⅴの高校、内申が強い人は評価方法Ⅱ・Ⅳの高校が相対的に有利になりやすいです。
            </p>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客。愛知は関東/関西の地盤塾が無いため全国オンライン対応のそら塾へ。
              旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去。旧affiliateId=morijuku-textは関東限定チェーンで
              愛知に校舎が無い地域ミスマッチだったため是正） */}
          <ParentLeadCTA
            className="mb-10"
            placement="prefecture"
            heading="愛知の志望校、評価方法に合った対策ができていますか？"
            body="評価方法Ⅰ〜Ⅴで必要な得点配分は変わります。お子さまに合った対策を、全国オンライン対応の個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-5">
              {AICHI_FAQS.map((faq, i) => (
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
              本ページの計算方法は令和5年度入試以降の愛知県公立高校入学者選抜実施要項に基づく解説です。各高校が採用する評価方法・面接の有無・傾斜配点は学校により異なります。最新の情報は<a href={AICHI_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">愛知県教育委員会の公式サイト</a>でご確認ください。
            </p>
          </div>

          {/* 関連リンク */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/aichi/naishin" className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 font-bold text-brand-700 hover:text-brand-800">
                  <span className="group-hover:underline group-hover:underline-offset-2">愛知県の内申点を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/aichi" className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 font-bold text-brand-700 hover:text-brand-800">
                  <span className="group-hover:underline group-hover:underline-offset-2">愛知県の入試制度ガイド</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi" className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 font-bold text-brand-700 hover:text-brand-800">
                  <span className="group-hover:underline group-hover:underline-offset-2">5教科の偏差値を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse?pref=aichi" className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 font-bold text-brand-700 hover:text-brand-800">
                  <span className="group-hover:underline group-hover:underline-offset-2">志望校から逆算する</span>
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
