import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { KanagawaResultFlow } from '@/components/Kanagawa/KanagawaResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
// (発見: 旧ハードコードはdc4/nyusen/という現在は存在しない別パスを指していた)
const KANAGAWA_SOURCE_URL =
  getPrefectureByCode('kanagawa')?.sourceUrl ?? 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html';

import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { StaticToolEntryLinks } from '@/components/StaticToolEntryLinks';
import { AdUnit } from '@/components/AdSlot';

// ページ冒頭のメタ行（出典名・最終確認）。値は prefectures.ts の既存データをそのまま表示するだけ。
const KANAGAWA_PREF = getPrefectureByCode('kanagawa');
const formatYearMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return y && m && !Number.isNaN(Number(m)) ? `${y}年${Number(m)}月` : iso;
};
const KANAGAWA_LAST_VERIFIED = KANAGAWA_PREF?.lastVerified ? formatYearMonth(KANAGAWA_PREF.lastVerified) : null;

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const KANAGAWA_S_VALUE_FAQS = [
  {
    question: 'S値とは何ですか？',
    answer:
      'S値とは、神奈川県公立高校入試の合否判定に使われる総合得点のことです。内申点（135点満点）と学力検査点（500点満点）をそれぞれ100点満点に換算し、志望校ごとに定められた比率（合計10）で合算した1000点満点の指標です。',
  },
  {
    question: 'S1値とS2値の違いは？',
    answer:
      'S1値は内申点＋学力検査の合計（1000点満点）、S2値はS1値に特色検査を加えた数値（特色検査実施校のみ）。横浜翠嵐・湘南など難関校はS2値で合否が決まります。',
  },
  {
    question: '神奈川の内申点はいつの成績？',
    answer:
      '神奈川県の内申点は中2の評定合計＋中3の評定合計×2で計算されます（135点満点）。中3の比重が大きいため、中3の成績アップが内申点全体に効きます。',
  },
  {
    question: '特色検査の比率は？',
    answer:
      '特色検査の比率は学校ごとに最大「5」まで設定されます。難関校（横浜翠嵐・湘南・厚木・柏陽・川和など）で実施され、S2値の合否判定に大きく影響します。',
  },
];

export const metadata: Metadata = {
  title: 'S値とは？神奈川県 自動計算【無料・S1/S2対応】公立高校入試の合否判定 | My Naishin',
  description: 'S値とは、神奈川県公立高校入試の合否判定に使われる内申点＋学力検査の総合得点（1000点満点）のこと。【無料】内申点135点・学力検査500点・志望校比率（4:6/3:7など）・特色検査を入力するだけで、S1値・S2値を瞬時に算出。横浜翠嵐・湘南など主要高校の合格目安にも対応。',
  keywords: ['S値とは', '神奈川県 S値', '神奈川県 s値 自動計算', 'S1値とは', 'S1値', 'S2値', '神奈川 公立高校', '内申点', '神奈川 内申', '横浜翠嵐', '湘南高校'],
  alternates: {
    canonical: 'https://my-naishin.com/kanagawa/s-value',
  },
  openGraph: {
    title: 'S値とは？神奈川県 自動計算【無料・S1/S2対応】公立高校入試の合否判定 | My Naishin',
    description: 'S値とは、内申点＋学力検査を合算した神奈川県公立高校入試の総合得点（1000点満点）。志望校比率に対応した合否判定ツールで瞬時に算出。',
    url: 'https://my-naishin.com/kanagawa/s-value',
  },
};

export default function KanagawaSValuePage() {
  return (
    <>
      <WebApplicationSchema
        name="神奈川県 S値 自動計算 | My Naishin"
        description="神奈川県公立高校入試のS1値・S2値（1000点満点）を瞬時に算出。志望校比率に対応。"
        url="https://my-naishin.com/kanagawa/s-value"
      />
      <DatasetSchema
        name="神奈川県 S値算出方式データ（1000点満点）"
        description="神奈川県公立高校入試のS1値・S2値の算出方式（内申点135点・学力検査500点を志望校が選ぶ比率(4:6〜7:3)で換算し合算する方法）。神奈川県教育委員会の入学者選抜情報に基づくデータ。"
        url="https://my-naishin.com/kanagawa/s-value"
        variableMeasured={['内申点換算値', '学力検査換算値', 'S1値', 'S2値', '志望校比率']}
        keywords={['S値', '神奈川県', '総合得点', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '神奈川県', url: 'https://my-naishin.com/kanagawa' },
          { name: 'S値計算', url: 'https://my-naishin.com/kanagawa/s-value' },
        ]}
      />
      <HowToSchema
        id="howto-kanagawa-s-value"
        name="神奈川県 S値（S1・S2）を計算する方法"
        description="神奈川県公立高校入試の合否判定に使われるS値を、内申点・学力検査点・志望校比率から自動算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '内申点（135点満点）を入力', text: '中2の評定合計＋中3の評定合計×2で算出した内申点（135点満点）を入力します。' },
          { name: '学力検査点（500点満点）を入力', text: '5教科×100点の合計点（500点満点）を入力します。' },
          { name: '志望校の比率を選ぶ', text: '志望校の内申：学力の比率（4:6/3:7/5:5など）をボタンで選択します。' },
          { name: '特色検査点を入力（任意）', text: '難関校で実施される特色検査の点数（最大100点）があれば入力します。S2値が自動算出されます。' },
          { name: 'S値と志望校比較', text: '1000点満点のS1値（S2値）が瞬時に算出され、横浜翠嵐・湘南・柏陽など主要高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={KANAGAWA_S_VALUE_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/kanagawa" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              神奈川県
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">S値計算</span>
          </nav>

          {/* 頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              神奈川県 S値 自動計算ツール
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>S1値・S2値対応・1000点満点・2026年度入試対応</span>
              <span>
                出典：
                <a
                  href={KANAGAWA_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {KANAGAWA_PREF?.sourceTitle ?? '神奈川県教育委員会'}
                </a>
              </span>
              {KANAGAWA_LAST_VERIFIED && <span>制度の最終確認 {KANAGAWA_LAST_VERIFIED}</span>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              神奈川県公立高校入試の合否判定に使われる「S値」を瞬時に算出。<br />
              内申点・学力検査・志望校比率・特色検査の組み合わせを一括で計算できます。
            </p>
          </header>

          {/* S値の仕組み */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">神奈川県S値の仕組み</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              神奈川県の公立高校入試は、内申点（135点満点）と学力検査点（500点満点）を志望校ごとに定められた比率で合計したS値（1000点満点）で合否が判定されます。制度上の許容範囲は<strong>2:8〜8:2</strong>ですが、実際に採用されている比率は<strong>3:7〜7:3</strong>の5種のみです。
            </p>
            <dl className="mt-4 grid border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-slate-200">
              <div className="border-b border-slate-200 py-3 sm:border-b-0 sm:pr-4">
                <dt className="text-sm text-slate-600">S1値</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">1000<span className="text-base">点満点</span></dd>
                <dd className="mt-1 text-sm text-slate-600">内申点＋学力検査の合計</dd>
              </div>
              <div className="py-3 sm:pl-4">
                <dt className="text-sm text-slate-600">S2値</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">最大1500<span className="text-base">点</span></dd>
                <dd className="mt-1 text-sm text-slate-600">S1＋特色検査（最大500点換算）</dd>
              </div>
            </dl>
          </section>

          {/* S4-1: /juku-shindan・/hogoshaへの静的（計算前）内部リンク。GSC表示0・クリック0なのに
              内部リンク経由の実アフィリクリックの37%を生む/hogoshaへ、サイト最大流入面から到達距離を短縮する。 */}
          <div className="mb-6 mt-10">
            <StaticToolEntryLinks />
          </div>

          {/* Calculator・結果連動（S-1④） */}
          <KanagawaResultFlow />

          {/* S値の計算式 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">S値の計算式</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">S1値の計算式</h3>
                <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 md:text-base">
                  S1 = (内申/135 × 100 × 内申比率) + (学力検査/500 × 100 × 学力比率)
                </div>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 比率の合計は10。内申比率と学力比率は学校ごとに「4:6」「3:7」「5:5」「6:4」「7:3」のいずれかが設定されます（制度上は2:8〜8:2まで許容されますが、実際に採用されているのはこの5種のみです）。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">S2値の計算式（特色検査実施校）</h3>
                <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 md:text-base">
                  S2 = S1 + (特色検査の素点 × 特色検査比率)
                </div>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 特色検査の比率は最大5（横浜翠嵐・湘南などの最難関校で適用）。
                </p>
              </div>
            </div>
          </section>

          {/* S値 換算早見表（SEO: 神奈川 内申 100点換算 / s値 早見表 / 学力検査 換算） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">S値の換算早見表（手計算用）</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              S値は「内申点（135満点）と学力検査（500満点）をそれぞれ<strong>100点満点に換算</strong>し、志望校の比率（合計10）で合算」します。下の早見表で自分の換算値をすぐ確認できます。
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* 内申135 → 100換算 */}
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">① 内申点（135満点）→ 100点換算</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th scope="col" className="py-2 pr-3 font-bold">内申（／135）</th>
                        <th scope="col" className="py-2 text-right font-bold">100点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-900">
                      {[
                        ['135', '100.0'], ['125', '92.6'], ['115', '85.2'], ['105', '77.8'],
                        ['95', '70.4'], ['85', '63.0'], ['75', '55.6'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="border-b border-slate-200">
                          <td className="py-2 pr-3 font-bold tabular-nums">{raw}</td>
                          <td className="py-2 text-right tabular-nums">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">換算式：内申 ÷ 135 × 100</p>
              </div>
              {/* 学力500 → 100換算 */}
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">② 学力検査（500満点）→ 100点換算</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th scope="col" className="py-2 pr-3 font-bold">学力（／500）</th>
                        <th scope="col" className="py-2 text-right font-bold">100点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-900">
                      {[
                        ['500', '100'], ['450', '90'], ['400', '80'], ['350', '70'],
                        ['300', '60'], ['250', '50'], ['200', '40'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="border-b border-slate-200">
                          <td className="py-2 pr-3 font-bold tabular-nums">{raw}</td>
                          <td className="py-2 text-right tabular-nums">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">換算式：学力 ÷ 500 × 100</p>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <h3 className="text-[17px] font-bold text-slate-900">S1の計算例（比率4:6の高校）</h3>
              <p className="mt-2 text-base leading-[1.8] text-slate-900">
                内申115（換算85.2）・学力400点（換算80）・比率<strong>内申4:学力6</strong>の場合：<br />
                S1 ＝ 85.2 × 4 ＋ 80 × 6 ＝ 340.8 ＋ 480 ＝ <strong>約821点</strong>（川和の目安S1 830にあと一歩）
              </p>
            </div>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              ※ 比率は学校ごとに異なります（合計10）。特色検査実施校はS2値も必要。正確な値は上の計算ツールでご確認ください。
            </p>
          </section>

          {/* 主要校の比率と合格ライン */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">主要神奈川公立高校の比率と合格目安【2026年最新】</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 font-bold">高校</th>
                    <th scope="col" className="px-3 py-2 text-center font-bold">比率（内申:学力:特色）</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">S値合格目安</th>
                    <th scope="col" className="py-2 pl-3 text-right font-bold">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">横浜翠嵐</td>
                    <td className="px-3 py-2 text-center tabular-nums">2:6:2</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S2 1300+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">75</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">湘南</td>
                    <td className="px-3 py-2 text-center tabular-nums">3:5:2</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S2 1250+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">73</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">柏陽</td>
                    <td className="px-3 py-2 text-center tabular-nums">3:5:2</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S2 1180+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">71</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">厚木</td>
                    <td className="px-3 py-2 text-center tabular-nums">3:5:2</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S2 1150+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">70</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">川和</td>
                    <td className="px-3 py-2 text-center tabular-nums">4:6</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S1 830+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">68</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">光陵</td>
                    <td className="px-3 py-2 text-center tabular-nums">4:6</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S1 780+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">65</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">希望ヶ丘</td>
                    <td className="px-3 py-2 text-center tabular-nums">4:6</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S1 750+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">63</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">小田原</td>
                    <td className="px-3 py-2 text-center tabular-nums">4:6</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S1 740+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">63</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">鎌倉</td>
                    <td className="px-3 py-2 text-center tabular-nums">4:6</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S1 700+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">61</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">市立横浜サイエンスフロンティア</td>
                    <td className="px-3 py-2 text-center tabular-nums">3:5:2</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">S2 1100+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">68</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。最新情報は神奈川県教育委員会の公式発表をご確認ください。
            </p>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客。旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            heading="神奈川の志望校、S値はあと何点で届きますか？"
            body="S値は内申と当日点の伸ばし方で変わります。お子さまにいま必要な対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. S値とは何ですか？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  S値とは、神奈川県公立高校入試の合否判定に使われる総合得点のことです。内申点（135点満点）と学力検査点（500点満点）をそれぞれ100点満点に換算し、志望校ごとに定められた比率（合計10）で合算した1000点満点の指標です。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. S1値とS2値の違いは？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  S1値は内申点＋学力検査の合計（1000点満点）、S2値はS1値に特色検査を加えた数値（特色検査実施校のみ）。横浜翠嵐・湘南など難関校はS2値で合否が決まります。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. 神奈川の内申点はいつの成績？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  神奈川県の内申点は<strong>中2の評定合計＋中3の評定合計×2</strong>で計算されます（135点満点）。中3の比重が大きいため、中3の成績アップが内申点全体に効きます。詳しくは<Link href="/kanagawa/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">神奈川県の内申点計算ツール</Link>もご覧ください。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. 特色検査の比率は？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  特色検査の比率は学校ごとに最大「5」まで設定されます。難関校（横浜翠嵐・湘南・厚木・柏陽・川和など）で実施され、S2値の合否判定に大きく影響します。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              本ツールの計算結果は神奈川県教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href={KANAGAWA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">神奈川県教育委員会の公式サイト</a>でご確認ください。
              なお、クリエイティブスクール（釜利谷・横須賀南・田奈・大楠など）は学力検査を実施しないため本ツールの比率の概念が当てはまりません。横浜国際高校は独自の算出式（S1＝学力検査×4＋調査書×6＋面接等×1）を用いるため、こちらも本ツールの結果とは異なります。
            </p>
          </div>

          {/* 関連リンク */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              <li>
                <Link href="/kanagawa/naishin" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  神奈川県の内申点を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/kanagawa" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  神奈川県の入試制度ガイド
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse?pref=kanagawa" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  志望校から逆算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/blog/kanagawa-naishin-calculation-guide" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  神奈川県の内申点ガイド
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
