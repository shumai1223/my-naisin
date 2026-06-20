import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, BookOpen, AlertCircle, Award, Target } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { TokyoTotalScoreCalculator } from '@/components/TokyoTotalScore/TokyoTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/tokyo" className="hover:text-blue-600">東京都</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">総合得点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              都立高校 総合得点 計算サイト
            </h1>
            <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              1020点満点・2026年度入試対応
            </div>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              東京都立高校入試の総合得点（1020点満点）を瞬時に算出。<br />
              学力検査・調査書点・ESAT-Jの3つの要素を一括で計算できます。
            </p>
          </header>

          {/* 1020点満点の仕組み */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              都立高校 1020点満点の内訳
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <div className="text-xs font-bold text-blue-600 mb-1">学力検査</div>
                <div className="text-3xl font-black text-blue-700">700<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-blue-600 mt-1">5教科 × 100点を換算</div>
              </div>
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="text-xs font-bold text-emerald-600 mb-1">調査書点（内申）</div>
                <div className="text-3xl font-black text-emerald-700">300<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-emerald-600 mt-1">換算内申65点を換算</div>
              </div>
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center">
                <div className="text-xs font-bold text-amber-600 mb-1">ESAT-J</div>
                <div className="text-3xl font-black text-amber-700">20<span className="text-base font-bold">点</span></div>
                <div className="text-xs text-amber-600 mt-1">英語スピーキングテスト</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 border border-slate-100 p-3 text-center">
              <span className="text-sm text-slate-600">合計：</span>
              <span className="text-2xl font-black text-slate-800">1020点満点</span>
            </div>
          </section>

          {/* Calculator */}
          <TokyoTotalScoreCalculator />

          {/* 結果保存・名簿化（堀A） */}
          <ParentCostBridge prefectureName="東京都" className="mb-6" />

          <SaveResultCTA
            source="prefecture"
            prefectureCode="tokyo"
            prefectureName="東京都"
            className="mt-6"
            heading="この総合得点と「あと何点」を、忘れないうちに受け取りませんか？"
            body="総合得点アップのコツ・日比谷や西など志望校の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />

          {/* 計算式の解説 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-blue-500" />
              総合得点の計算式
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">学力検査（700点満点）の換算式</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    学力検査700点 = (5教科合計500点 ÷ 500) × 700
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 自校作成問題校（日比谷・西・国立など）は独自配点。エンタイア校でも傾斜配点を実施する学校あり。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">調査書点（300点満点）の換算式</h3>
                <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
                  <div className="font-mono text-xs md:text-sm">
                    調査書点300点 = (換算内申 ÷ 65) × 300
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  ※ 換算内申は主要5教科×1倍 + 実技4教科×2倍 = 最大65点。<Link href="/tokyo/naishin" className="text-blue-600 underline">東京都の内申点計算</Link>もご利用ください。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">ESAT-J（20点満点）</h3>
                <div className="text-slate-700 leading-relaxed">
                  英語スピーキングテストの結果を6段階（A〜F）で評価し、A=20点、B=16点、C=12点、D=8点、E=4点、F=0点で換算します。
                </div>
              </div>
            </div>
          </section>

          {/* 当日点・換算内申の換算早見表（SEO: 当日点計算 サイト / 1000点換算 サイト / 都立 換算 早見表 / 都立高校 1000点満点 計算） */}
          <section id="kansan-hayami" className="mt-8 scroll-mt-20 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-blue-500" />
              当日点・換算内申の換算早見表（手計算用）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              「5教科の素点合計（500点満点）が700点換算で何点になるか」「換算内申（65点満点）が300点換算で何点か」を一覧にした早見表です。
              都立入試はかつての1000点満点から<strong>ESAT-J 20点を加えた現行1020点満点</strong>になりましたが、学力検査700点＋調査書点300点の換算は共通。当日点・調査書点を素早く確認できます。
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {/* 当日点 → 700点換算 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-blue-900">① 5教科の素点合計 → 学力検査700点換算</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white text-left">
                        <th className="border border-blue-400 px-3 py-1.5 font-bold">素点（／500）</th>
                        <th className="border border-blue-400 px-3 py-1.5 font-bold text-right">700点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['500', '700'], ['450', '630'], ['400', '560'], ['350', '490'],
                        ['300', '420'], ['250', '350'], ['200', '280'], ['150', '210'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-bold">{raw}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">換算式：素点 ÷ 500 × 700</p>
              </div>
              {/* 換算内申 → 300点換算 */}
              <div>
                <h3 className="mb-2 text-sm font-bold text-emerald-900">② 換算内申 → 調査書点300点換算</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-emerald-600 text-white text-left">
                        <th className="border border-emerald-400 px-3 py-1.5 font-bold">換算内申（／65）</th>
                        <th className="border border-emerald-400 px-3 py-1.5 font-bold text-right">300点換算</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {[
                        ['65', '300'], ['60', '277'], ['55', '254'], ['50', '231'],
                        ['45', '208'], ['40', '185'], ['35', '162'], ['30', '138'],
                      ].map(([raw, conv]) => (
                        <tr key={raw} className="odd:bg-white even:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-bold">{raw}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-right">{conv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">換算式：換算内申 ÷ 65 × 300（四捨五入）</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              ※ ①の700点換算＋②の300点換算＋ESAT-J（最大20点）＝総合得点（1020点満点）。換算内申がわからない場合は
              <Link href="/tokyo/naishin" className="text-blue-600 underline font-bold">東京都の内申点計算ツール</Link>で先に算出してから、上のツールに入力してください。
            </p>
          </section>

          {/* 主要都立高校の合格ライン目安 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              主要都立高校の合格ライン目安【2026年最新】
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">高校</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">合格目安</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">偏差値</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">日比谷（自校作成）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">880点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">73</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">西（自校作成）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">875点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">72</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">国立（自校作成）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">860点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">72</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">戸山（自校作成）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">840点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">70</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">青山（自校作成）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">830点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">69</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">新宿</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">800点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">66</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">駒場</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">780点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">65</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">小山台</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">750点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">63</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">三田</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">720点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">62</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">城東</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-blue-700 font-bold">680点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">60</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">広尾</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-blue-700 font-bold">640点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">58</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 合格目安は過去の入試データに基づく推定値です。年度・倍率により変動します。各校の正確な情報は東京都教育委員会の公式発表をご確認ください。
            </p>
          </section>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              目標点まであと一歩のあなたへ
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              内申点・当日点の両方を伸ばす学習なら<AffiliateAd id="zkai-text-middle" hideLabel auditHide />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-3 text-xs">
              <AffiliateAd id="zkai-text-request" hideLabel auditHide />（PR）から詳細をチェック
            </div>
          </section>

          {/* 合格基準点シミュレーション（SEO: 都立高校 合格基準点 シュミレーション / 都立 点数 計算） */}
          <section className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Target className="h-5 w-5 text-blue-500" />
              都立高校 合格基準点 シミュレーション（点数計算の早見表）
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              都立高校の合否は<strong>1020点満点中、何点取れば合格できるか</strong>がすべて。志望校レベル別に、当日点・換算内申・ESAT-Jの組み合わせをパターン別にシミュレーションしました。「自分の点数が合格ラインに届くか」を素早く判定できます。
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">志望校レベル</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">合格目安</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">当日点5教科</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">換算内申</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold text-right">ESAT-J</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">日比谷・西・国立クラス</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-red-700 font-bold">870点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">450点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">60+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">A〜B</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">戸山・青山クラス</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-orange-700 font-bold">830点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">430点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">58+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">A〜B</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">新宿・駒場クラス</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-amber-700 font-bold">780点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">400点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">55+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">B〜C</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">小山台・三田クラス</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-emerald-700 font-bold">730点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">370点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">52+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">B〜C</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">城東・広尾クラス</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-blue-700 font-bold">660点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">330点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">48+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">C〜D</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">中堅校（偏差値55前後）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-slate-700 font-bold">580点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">290点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">42+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">D〜E</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">中堅下位校（偏差値50前後）</td>
                    <td className="border border-slate-200 px-3 py-2 text-right text-slate-700 font-bold">500点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">250点+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">36+</td>
                    <td className="border border-slate-200 px-3 py-2 text-right">D〜F</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl bg-white border border-blue-100 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">点数計算のシミュレーション例</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                例：<strong>新宿高校（合格目安780点+）志望、当日点400点・換算内申55・ESAT-J「B」</strong>の場合
              </p>
              <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc">
                <li>学力検査700点換算：400 ÷ 500 × 700 ≒ <strong>560点</strong></li>
                <li>調査書点300点換算：55 ÷ 65 × 300 ≒ <strong>254点</strong></li>
                <li>ESAT-J：B評価 → <strong>16点</strong></li>
                <li>合計：560 + 254 + 16 ＝ <strong className="text-blue-700">830点</strong>（新宿の合格目安780を超過）</li>
              </ul>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              ※ シミュレーション結果は過去の入試データに基づく目安です。年度・倍率・他受験者の得点状況により変動します。
            </p>
          </section>

          {/* 保護者向けリード（換金の本命：資料請求送客） */}
          <ParentLeadCTA
            className="mt-8"
            heading="都立の志望校、総合得点はあと何点で届きますか？"
            body="総合得点は当日点と内申の伸ばし方で変わります。お子さまにいま必要な対策を、塾の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="morijuku-text"
            ctaText="無料体験を申し込む（森塾）"
            note="【森塾】の無料体験授業（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 自校作成問題校（日比谷・西・国立）はこの計算式で使える？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  自校作成問題校でも、満点配分は1020点で同じです。ただし、各校が独自に難易度の高い問題を出題するため、同じ「学力検査700点」でも難易度の差で実際の難易度は大きく異なります。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. ESAT-Jを受けていない場合はどうなる？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  ESAT-J対象外の学校・コースでは、20点をそのまま除いた1000点満点で計算します。当ツールでは「ESAT-J: 0」または該当項目を空欄にすることで対応できます。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 当日点・調査書点の換算結果は四捨五入？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  はい、東京都教育委員会の規定では、各換算後の点数は小数点以下を四捨五入して整数化します。当ツールも同じ処理をしています。
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Q. 換算内申はどう計算する？</div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  東京都の換算内申は「主要5教科の評定 ×1倍 + 実技4教科の評定 ×2倍」で最大65点になります。詳しくは<Link href="/tokyo/naishin" className="text-blue-600 underline font-bold">東京都の内申点計算ツール</Link>と<Link href="/blog/tokyo-kansan-naishin-guide" className="text-blue-600 underline font-bold">換算内申の徹底ガイド</Link>をご覧ください。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-800 leading-relaxed">
                本ツールの計算結果は東京都教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/" target="_blank" rel="noopener noreferrer" className="text-amber-900 underline font-bold">東京都教育委員会の公式サイト</a>でご確認ください。
              </p>
            </div>
          </div>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/tokyo/naishin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">東京都の内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/tokyo" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">東京都の入試制度ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse?pref=tokyo" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から必要な当日点を逆算</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">評定平均を自動計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/blog/tokyo-kansan-naishin-guide" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">換算内申の徹底ガイド</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
