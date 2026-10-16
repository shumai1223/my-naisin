import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { TokyoTotalScoreResultFlow } from '@/components/TokyoTotalScore/TokyoTotalScoreResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
const TOKYO_SOURCE_URL =
  getPrefectureByCode('tokyo')?.sourceUrl ?? 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { StaticToolEntryLinks } from '@/components/StaticToolEntryLinks';
import { AdUnit } from '@/components/AdSlot';

// ページ冒頭のメタ行（出典名・最終確認）。値は prefectures.ts の既存データをそのまま表示するだけ。
const TOKYO_PREF = getPrefectureByCode('tokyo');
const formatYearMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return y && m && !Number.isNaN(Number(m)) ? `${y}年${Number(m)}月` : iso;
};
const TOKYO_LAST_VERIFIED = TOKYO_PREF?.lastVerified ? formatYearMonth(TOKYO_PREF.lastVerified) : null;

export const metadata: Metadata = {
  title: '都立高校 総合得点 計算サイト【1020点満点】学力検査・調査書点・ESAT-J | My Naishin',
  description: '東京都立高校入試の総合得点（1020点満点）を自動計算する無料サイト。5教科の当日点を700点換算、換算内申を300点換算、ESAT-J 20点を合算して合計点と志望校合格ラインまでの距離を瞬時に算出。当日点・換算内申の換算早見表（旧1000点満点対応）と、日比谷・西・国立・戸山など主要都立高校の合格目安も掲載。',
  alternates: {
    canonical: 'https://my-naishin.com/tokyo/total-score',
  },
};

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const TOKYO_TOTAL_SCORE_FAQS = [
  {
    question: '自校作成問題校（日比谷・西・国立）はこの計算式で使える？',
    answer:
      '自校作成問題校でも、満点配分は1020点で同じです。ただし、各校が独自に難易度の高い問題を出題するため、同じ「学力検査700点」でも難易度の差で実際の難易度は大きく異なります。',
  },
  {
    question: 'ESAT-Jを受けていない場合はどうなる？',
    answer:
      'ESAT-J対象外の学校・コースでは、20点をそのまま除いた1000点満点で計算します。当ツールでは「ESAT-J: 0」または該当項目を空欄にすることで対応できます。',
  },
  {
    question: '当日点・調査書点の換算結果は四捨五入？',
    answer:
      'はい、東京都教育委員会の規定では、各換算後の点数は小数点以下を四捨五入して整数化します。当ツールも同じ処理をしています。',
  },
  {
    question: '換算内申はどう計算する？',
    answer:
      '東京都の換算内申は「主要5教科の評定 ×1倍 + 実技4教科の評定 ×2倍」で最大65点になります。詳しくは東京都の内申点計算ツールと換算内申の徹底ガイドをご覧ください。',
  },
];

export default function TokyoTotalScorePage() {
  return (
    <>
      <WebApplicationSchema
        name="都立高校 総合得点 計算サイト | My Naishin"
        description="東京都立高校入試の1020点満点総合得点を自動計算。学力検査・調査書点・ESAT-Jから合計点を算出。"
        url="https://my-naishin.com/tokyo/total-score"
      />
      <DatasetSchema
        name="東京都 総合得点算出方式データ（1020点満点）"
        description="都立高校入試の総合得点算出方式（学力検査700点・調査書点300点・ESAT-J 20点の内訳と換算方法）。東京都教育委員会の入学者選抜実施要綱に基づくデータ。"
        url="https://my-naishin.com/tokyo/total-score"
        variableMeasured={['学力検査換算点', '調査書点換算点', 'ESAT-J評価点', '総合得点満点']}
        keywords={['総合得点', '東京都', '都立高校', 'ESAT-J', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '東京都', url: 'https://my-naishin.com/tokyo' },
          { name: '都立高校 総合得点計算', url: 'https://my-naishin.com/tokyo/total-score' },
        ]}
      />
      <HowToSchema
        id="howto-tokyo-total-score"
        name="都立高校 総合得点（1020点満点）を計算する方法"
        description="学力検査700点・調査書点300点・ESAT-J 20点の3要素から、都立高校入試の総合得点を1020点満点で算出する手順。"
        totalTime="PT2M"
        steps={[
          { name: '学力検査の点数を入力', text: '5教科（国数英理社）の合計点を入力します。500点満点が自動的に1.4倍され、700点満点に換算されます。' },
          { name: '換算内申を入力', text: '主要5教科＋実技4教科×2の換算内申（65点満点）を入力します。当サイトの東京都内申点計算ツールで自動算出した値を使えます。' },
          { name: 'ESAT-J評価を選ぶ', text: 'A〜F評価から自分の評価を選択します。A=20点・B=16点・C=12点・D=8点・E=4点・F=0点が自動換算されます。' },
          { name: '総合得点と志望校比較', text: '1020点満点中の総合得点が瞬時に算出され、日比谷・西・国立・戸山など主要都立高校の合格目安との距離も確認できます。' },
        ]}
      />
      <FAQPageSchema faqItems={TOKYO_TOTAL_SCORE_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/tokyo" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">東京都</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">総合得点計算</span>
          </nav>

          {/* 頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              都立高校 総合得点 計算サイト
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>1020点満点・2026年度入試対応</span>
              <span>
                出典：
                <a
                  href={TOKYO_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {TOKYO_PREF?.sourceTitle ?? '東京都教育委員会'}
                </a>
              </span>
              {TOKYO_LAST_VERIFIED && <span>制度の最終確認 {TOKYO_LAST_VERIFIED}</span>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              東京都立高校入試の総合得点（1020点満点）を瞬時に算出。<br />
              学力検査・調査書点・ESAT-Jの3つの要素を一括で計算できます。
            </p>
          </header>

          {/* 1020点満点の仕組み */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">都立高校 1020点満点の内訳</h2>
            <div className="mt-4 border-y border-slate-200">
              <dl className="grid grid-cols-3 divide-x divide-slate-200">
                <div className="px-2 py-4 text-center">
                  <dt className="text-xs text-slate-600">学力検査</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">700<span className="text-base font-bold">点</span></dd>
                  <dd className="mt-1 text-xs text-slate-600">5教科 × 100点を換算</dd>
                </div>
                <div className="px-2 py-4 text-center">
                  <dt className="text-xs text-slate-600">調査書点（内申）</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">300<span className="text-base font-bold">点</span></dd>
                  <dd className="mt-1 text-xs text-slate-600">換算内申65点を換算</dd>
                </div>
                <div className="px-2 py-4 text-center">
                  <dt className="text-xs text-slate-600">ESAT-J</dt>
                  <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">20<span className="text-base font-bold">点</span></dd>
                  <dd className="mt-1 text-xs text-slate-600">英語スピーキングテスト</dd>
                </div>
              </dl>
              <p className="border-t border-slate-200 py-3 text-center">
                <span className="text-sm text-slate-600">合計：</span>
                <span className="text-2xl font-bold tabular-nums text-slate-900">1020点満点</span>
              </p>
            </div>
          </section>

          {/* S4-1: /juku-shindan・/hogoshaへの静的（計算前）内部リンク。GSC表示0・クリック0なのに
              内部リンク経由の実アフィリクリックの37%を生む/hogoshaへ、サイト最大流入面から到達距離を短縮する。 */}
          <div className="mb-6 mt-10">
            <StaticToolEntryLinks />
          </div>

          {/* Calculator＋結果連動の名簿/送客導線（総合得点の実測値をCTAへ配線＝成績カード/保護者バトン点灯） */}
          <TokyoTotalScoreResultFlow />

          {/* 計算式の解説 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">総合得点の計算式</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">学力検査（700点満点）の換算式</h3>
                <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm tabular-nums text-slate-900 md:text-base">
                  学力検査700点 = (5教科合計500点 ÷ 500) × 700
                </div>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 自校作成問題校（日比谷・西・国立など）は独自配点。エンタイア校でも傾斜配点を実施する学校あり。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">調査書点（300点満点）の換算式</h3>
                <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm tabular-nums text-slate-900 md:text-base">
                  調査書点300点 = (換算内申 ÷ 65) × 300
                </div>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 換算内申は主要5教科×1倍 + 実技4教科×2倍 = 最大65点。<Link href="/tokyo/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">東京都の内申点計算</Link>もご利用ください。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">ESAT-J（20点満点）</h3>
                <p className="mt-2 text-base leading-[1.8] text-slate-900">
                  英語スピーキングテストの結果を6段階（A〜F）で評価し、A=20点、B=16点、C=12点、D=8点、E=4点、F=0点で換算します。
                </p>
              </div>
            </div>
          </section>

          {/* 当日点・換算内申の換算早見表（SEO: 当日点計算 サイト / 1000点換算 サイト / 都立 換算 早見表 / 都立高校 1000点満点 計算） */}
          <section id="kansan-hayami" className="mt-10 scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">当日点・換算内申の換算早見表（手計算用）</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              「5教科の素点合計（500点満点）が700点換算で何点になるか」「換算内申（65点満点）が300点換算で何点か」を一覧にした早見表です。
              都立入試はかつての1000点満点から<strong>ESAT-J 20点を加えた現行1020点満点</strong>になりましたが、学力検査700点＋調査書点300点の換算は共通。当日点・調査書点を素早く確認できます。
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* 当日点 → 700点換算 */}
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">① 5教科の素点合計 → 学力検査700点換算</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th scope="col" className="py-2 pr-3 font-bold">素点（／500）</th>
                        <th scope="col" className="py-2 text-right font-bold">700点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-900">
                      {[
                        ['500', '700'], ['450', '630'], ['400', '560'], ['350', '490'],
                        ['300', '420'], ['250', '350'], ['200', '280'], ['150', '210'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="border-b border-slate-200">
                          <td className="py-2 pr-3 font-bold tabular-nums">{raw}</td>
                          <td className="py-2 text-right tabular-nums">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">換算式：素点 ÷ 500 × 700</p>
              </div>
              {/* 換算内申 → 300点換算 */}
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">② 換算内申 → 調査書点300点換算</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                        <th scope="col" className="py-2 pr-3 font-bold">換算内申（／65）</th>
                        <th scope="col" className="py-2 text-right font-bold">300点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-900">
                      {[
                        ['65', '300'], ['60', '277'], ['55', '254'], ['50', '231'],
                        ['45', '208'], ['40', '185'], ['35', '162'], ['30', '138'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="border-b border-slate-200">
                          <td className="py-2 pr-3 font-bold tabular-nums">{raw}</td>
                          <td className="py-2 text-right tabular-nums">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-sm text-slate-600">換算式：換算内申 ÷ 65 × 300（四捨五入）</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              ※ ①の700点換算＋②の300点換算＋ESAT-J（最大20点）＝総合得点（1020点満点）。換算内申がわからない場合は
              <Link href="/tokyo/naishin" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">東京都の内申点計算ツール</Link>で先に算出してから、上のツールに入力してください。
            </p>
          </section>

          {/* 主要都立高校の合格ライン目安 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">主要都立高校の合格ライン目安【2026年最新】</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 font-bold">高校</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">合格目安</th>
                    <th scope="col" className="py-2 pl-3 text-right font-bold">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">日比谷（自校作成）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">880点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">73</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">西（自校作成）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">875点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">72</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">国立（自校作成）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">860点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">72</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">戸山（自校作成）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">840点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">70</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">青山（自校作成）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">830点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">69</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">新宿</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">800点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">66</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">駒場</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">780点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">65</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">小山台</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">750点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">63</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">三田</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">720点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">62</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">城東</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">680点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">60</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">広尾</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">640点+</td>
                    <td className="py-2 pl-3 text-right tabular-nums">58</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-[1.8] text-slate-600">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。各校の正確な情報は東京都教育委員会の公式発表をご確認ください。
            </p>
          </section>

          {/* 合格基準点シミュレーション（SEO: 都立高校 合格基準点 シュミレーション / 都立 点数 計算） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">都立高校 合格基準点 シミュレーション（点数計算の早見表）</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              都立高校の合否は<strong>1020点満点中、何点取れば合格できるか</strong>がすべて。志望校レベル別に、当日点・換算内申・ESAT-Jの組み合わせをパターン別にシミュレーションしました。「自分の点数が合格ラインに届くか」を素早く判定できます。
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 font-bold">志望校レベル</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">合格目安</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">当日点5教科</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">換算内申</th>
                    <th scope="col" className="py-2 pl-3 text-right font-bold">ESAT-J</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">日比谷・西・国立クラス</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">870点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">450点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">60+</td>
                    <td className="py-2 pl-3 text-right">A〜B</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">戸山・青山クラス</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">830点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">430点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">58+</td>
                    <td className="py-2 pl-3 text-right">A〜B</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">新宿・駒場クラス</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">780点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">400点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">55+</td>
                    <td className="py-2 pl-3 text-right">B〜C</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">小山台・三田クラス</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">730点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">370点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">52+</td>
                    <td className="py-2 pl-3 text-right">B〜C</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">城東・広尾クラス</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">660点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">330点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">48+</td>
                    <td className="py-2 pl-3 text-right">C〜D</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">中堅校（偏差値55前後）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">580点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">290点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">42+</td>
                    <td className="py-2 pl-3 text-right">D〜E</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 pr-3 font-bold">中堅下位校（偏差値50前後）</td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">500点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">250点+</td>
                    <td className="px-3 py-2 text-right tabular-nums">36+</td>
                    <td className="py-2 pl-3 text-right">D〜F</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <h3 className="text-[17px] font-bold text-slate-900">点数計算のシミュレーション例</h3>
              <p className="mt-2 text-base leading-[1.8] text-slate-900">
                例：<strong>新宿高校（合格目安780点+）志望、当日点400点・換算内申55・ESAT-J「B」</strong>の場合
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
                <li>学力検査700点換算：400 ÷ 500 × 700 ≒ <strong className="whitespace-nowrap">560点</strong></li>
                <li>調査書点300点換算：55 ÷ 65 × 300 ≒ <strong className="whitespace-nowrap">254点</strong></li>
                <li>ESAT-J：B評価 → <strong className="whitespace-nowrap">16点</strong></li>
                <li>合計：560 + 254 + 16 ＝ <strong className="whitespace-nowrap">830点</strong>（新宿の合格目安780を超過）</li>
              </ul>
            </div>

            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              ※ シミュレーション結果は過去の入試データに基づく目安です。年度・倍率・他受験者の得点状況により変動します。
            </p>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客） */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            heading="都立の志望校、総合得点はあと何点で届きますか？"
            body="総合得点は当日点と内申の伸ばし方で変わります。お子さまにいま必要な対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* T-ADS1 AdSense IN_CONTENT: 保護者リードCTAの後ろ（CTAを押し下げない）。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="IN_CONTENT" />

          {/* よくある質問 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. 自校作成問題校（日比谷・西・国立）はこの計算式で使える？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  自校作成問題校でも、満点配分は1020点で同じです。ただし、各校が独自に難易度の高い問題を出題するため、同じ「学力検査700点」でも難易度の差で実際の難易度は大きく異なります。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. ESAT-Jを受けていない場合はどうなる？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  ESAT-J対象外の学校・コースでは、20点をそのまま除いた1000点満点で計算します。当ツールでは「ESAT-J: 0」または該当項目を空欄にすることで対応できます。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. 当日点・調査書点の換算結果は四捨五入？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  はい、東京都教育委員会の規定では、各換算後の点数は小数点以下を四捨五入して整数化します。当ツールも同じ処理をしています。
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">Q. 換算内申はどう計算する？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  東京都の換算内申は「主要5教科の評定 ×1倍 + 実技4教科の評定 ×2倍」で最大65点になります。詳しくは<Link href="/tokyo/naishin" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">東京都の内申点計算ツール</Link>と<Link href="/blog/tokyo-kansan-naishin-guide" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">換算内申の徹底ガイド</Link>をご覧ください。
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
              本ツールの計算結果は東京都教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href={TOKYO_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">東京都教育委員会の公式サイト</a>でご確認ください。
            </p>
          </div>

          {/* 関連リンク */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="mt-2 grid sm:grid-cols-2 sm:gap-x-8">
              <li className="border-b border-slate-200">
                <Link href="/tokyo/naishin" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  東京都の内申点を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/tokyo" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  東京都の入試制度ガイド
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/reverse?pref=tokyo" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  志望校から必要な当日点を逆算
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  偏差値を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  評定平均を自動計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/blog/tokyo-kansan-naishin-guide" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  換算内申の徹底ガイド
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
