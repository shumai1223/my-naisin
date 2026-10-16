"use client";

import * as React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTAExperiment } from '@/components/ParentLeadCTAExperiment';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { StatsOptIn } from '@/components/StatsOptIn';
import { AnswerBox } from '@/components/AnswerBox';
import Loader from '@/components/ui/Loader';
import type { ReverseResult } from '@/components/Calculator/ReverseCalculator';

const ReverseCalculator = nextDynamic(
  () => import('@/components/Calculator/ReverseCalculator').then((mod) => mod.ReverseCalculator),
  { ssr: false }
);

const REVERSE_FAQS = [
  {
    question: '当日点（学力検査点）はどうやって逆算するの？',
    answer: '「志望校の合格基準点 −（あなたの内申点を入試方式で点数化した値）＝当日に必要な学力検査点」で逆算します。内申比率が高い地域は内申点が高いほど必要な当日点が下がり、当日点比率が高い地域はその逆です。当ツールは都道府県の満点・配点比率を読み込み、この差を自動で計算します。',
  },
  {
    question: '合格基準点（ボーダー）が分からないときは？',
    answer: '模試の判定資料、進学塾・学校の進路指導資料、合格者平均点の公開データなどを目安にします。当ツールは特定校のボーダーを断定しませんが、合格基準点を入力すれば「あと何点必要か」を即座に逆算できます。志望校レベルの目安は偏差値→志望校レンジ逆引きでも確認できます。',
  },
  {
    question: '東京都の1020点満点や神奈川のS値でも逆算できる？',
    answer: 'できます。東京都（学力700＋調査書300＋ESAT-J20＝1020点）や神奈川県のS値など、地域固有の総合得点方式に対応しています。各都道府県の専用ページで満点と配点比率を確認しながら逆算してください。',
  },
  {
    question: '当日点と内申点、どちらを優先して上げるべき？',
    answer: '都道府県の配点比率で決まります。内申比率が高い地域（東京・神奈川など）は内申点の1点が当日点の数点分に相当することがあり、内申対策が効率的。当日点比率が高い地域は学力検査の得点力が優先です。逆算結果の「必要な当日点」と現状の差を見て、現実的な方を優先しましょう。',
  },
];

function ReversePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasPrefParam = searchParams?.has('pref');
  const [result, setResult] = React.useState<ReverseResult | null>(null);
  const [prefCtx, setPrefCtx] = React.useState<{ prefectureCode: string; prefectureName?: string }>({ prefectureCode: '' });

  return (
    <div className="min-h-screen bg-slate-50">
      <WebApplicationSchema
        name="志望校から逆算｜内申点シミュレーター | My Naishin"
        description="志望校に合格するには当日何点必要？内申点と配点比率から必要な学力検査点を逆算。東京都1020点・神奈川S値にも対応。"
        url="https://my-naishin.com/reverse"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '志望校から逆算', url: 'https://my-naishin.com/reverse' },
        ]}
      />
      <HowToSchema
        id="howto-reverse"
        name="志望校から必要な当日点を逆算する方法"
        description="志望校の合格基準点と現在の内申点・配点比率から、入試当日に取るべき学力検査の点数を逆算する手順。"
        totalTime="PT2M"
        steps={[
          { name: '都道府県を選ぶ', text: '受験する都道府県を選び、その地域の内申点満点と配点比率を読み込みます。' },
          { name: '内申点を入力', text: '現在の内申点（自動計算ツールで算出した数値）を入力します。' },
          { name: '志望校の合格基準点を入力', text: '志望校の合格者平均点や合格基準点（模試判定資料や進路指導の資料に基づく）を入力します。' },
          { name: '必要な当日点を確認', text: '内申点と合格基準点の差から、入試当日の学力検査で取るべき点数が瞬時に逆算されます。' },
        ]}
      />
      <FAQPageSchema faqItems={REVERSE_FAQS} />
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">志望校から逆算</span>
        </nav>

        {/* SSR説明セクション */}
        <header className="mb-8">
          <h1 className="text-balance text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">内申点シミュレーター｜志望校から逆算</h1>
          <p className="mt-2 text-sm text-slate-600">2026年度入試対応（令和8年度入学者選抜）</p>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            「この高校に受かるには、当日の試験で何点取ればいい？」——そんな疑問に答える逆算ツールです。
            現在の内申点と志望校の配点比率を入力するだけで、合格に必要な当日点の目安がわかります。
          </p>
        </header>

        <div className="mb-8">
          <AnswerBox question="志望校に受かるには当日何点必要？どう逆算する？">
            必要な当日点は<strong>「志望校の合格基準点 −（あなたの内申点を入試方式で点数化した値）」</strong>で逆算します。
            内申比率が高い地域は内申点が高いほど必要な当日点が下がり、当日点比率が高い地域はその逆です。
            下のツールは都道府県の満点・配点比率（東京1020点・神奈川S値にも対応）を読み込み、「あと何点必要か」を自動計算します。
          </AnswerBox>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-[17px] font-bold text-slate-900">何を入力するの？</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>都道府県を選択</li>
              <li>現在の内申点を入力</li>
              <li>志望校の内申:学力の配点比率を設定</li>
              <li>当日点の満点を設定（例：500点）</li>
            </ul>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-[17px] font-bold text-slate-900">何がわかるの？</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>合格に必要な当日点の目安</li>
              <li>必要得点率（何%取ればよいか）</li>
              <li>内申点のカバー率</li>
              <li>東京都1020点満点・神奈川S値にも対応</li>
            </ul>
          </section>
        </div>

        <section className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            結果の見方と注意点
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-amber-900">
            <li>配点比率は高校・学科・入試方式ごとに異なります。志望校の募集要項で必ず確認してください。</li>
            <li>計算結果はあくまで目安です。実際の合否は面接・調査書・特色検査なども影響します。</li>
            <li>最新の入試情報は各都道府県教育委員会の公式サイトでご確認ください。</li>
          </ul>
        </section>

        {/* ツールの使い方説明 */}
        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-900">逆算ツールの使い方</h2>
          <ol className="divide-y divide-slate-200 border-y border-slate-200">
            <li className="py-4">
              <h3 className="text-[17px] font-bold text-slate-900">ステップ1：都道府県を選択</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">あなたの受験する都道府県を選択します。東京都・神奈川県・大阪府など主要な都道府県に対応しています。</p>
            </li>
            <li className="py-4">
              <h3 className="text-[17px] font-bold text-slate-900">ステップ2：現在の内申点を入力</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">現在の内申点を入力します。東京都の場合は「換算内申（65点満点）」、神奈川県の場合は「評定合計（135点満点）」を入力してください。</p>
            </li>
            <li className="py-4">
              <h3 className="text-[17px] font-bold text-slate-900">ステップ3：配点比率を設定</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">志望校の内申点と学力検査の配点比率を設定します。よくある比率のプリセットボタンもあるので、参考にしてください。</p>
            </li>
            <li className="py-4">
              <h3 className="text-[17px] font-bold text-slate-900">ステップ4：目標点を設定して計算</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">志望校の合格ラインや目標点を入力し、「計算する」ボタンをクリック。必要な当日点がすぐにわかります。</p>
            </li>
          </ol>
        </section>

        {/* サンプル計算結果（SSR表示） */}
        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">計算例：東京都立高校を目指す場合</h2>

          <div className="space-y-6">
            {/* 満点の枠組み */}
            <div>
              <h3 className="text-[17px] font-bold text-slate-900">満点の枠組み</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">
                学力検査(700点) + 調査書点(300点) + ESAT-J(20点) = 1020点満点
              </p>
              <p className="mt-1 text-sm text-slate-600">※ESAT-J対象外の学校・コースもあります</p>
            </div>

            <div>
              <h3 className="mb-1 text-[17px] font-bold text-slate-900">入力例</h3>
              {/* G-5：AI引用/構造化抽出しやすいよう、div疑似テーブルから意味論的なtableへ */}
              <table className="w-full border-t border-slate-200 text-base">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">換算内申</th>
                    <td className="py-2 text-right tabular-nums text-slate-900">50 / 65</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">目標総合点</th>
                    <td className="py-2 text-right tabular-nums text-slate-900">931 / 1020</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">ESAT-J見込み</th>
                    <td className="py-2 text-right tabular-nums text-slate-900">20 / 20</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="mb-1 text-[17px] font-bold text-slate-900">計算</h3>
              <table className="w-full border-t border-slate-200 text-base">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">調査書点（推定）</th>
                    <td className="py-2 text-right font-bold tabular-nums text-slate-900">round(50 ÷ 65 × 300) = 231点</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">必要学力検査点</th>
                    <td className="py-2 text-right font-bold tabular-nums text-slate-900">931 - 231 - 20 = 680点 / 700点</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">必要得点率</th>
                    <td className="py-2 text-right font-bold tabular-nums text-slate-900">約97%</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th scope="row" className="whitespace-nowrap py-2 pr-3 text-left font-normal text-slate-600">5教科平均</th>
                    <td className="py-2 text-right font-bold tabular-nums text-slate-900">約136点 / 140点</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-[17px] font-bold text-slate-900">解説</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">
                この計算例では、換算内申50点（65点満点中）が調査書点231点に変換され、
                目標総合点931点から調査書点231点とESAT-J 20点を引いた680点が当日の学力検査で必要な点数となります。
                これにより「何点取れば合格できるか」が具体的にわかります。
              </p>
            </div>
          </div>
        </section>

        <ReverseCalculator
          onBack={() => router.push('/')}
          onResult={(r, ctx) => {
            setResult(r);
            setPrefCtx(ctx);
          }}
        />

        {/* 結果直後の同スケール導線（生徒→保護者）：購入を迫らず、必要点が見えたいま学費/塾代を確認 */}
        <ParentCostBridge prefectureName={prefCtx.prefectureName} className="mt-8" />

        {/* 保護者向けリード（換金の本命：志望校が見えた保護者を無料資料請求へ） */}
        <ParentLeadCTAExperiment
          experimentId="result-offer-2026"
          placement="result"
          prefectureCode={prefCtx.prefectureCode || undefined}
          className="mt-8"
        />

        {/* 結果の保存（名簿化：再訪の燃料）。必要当日点/満点が出たら実測値で個別化する（C-14）。 */}
        <SaveResultCTA
          source="gap-target"
          prefectureCode={prefCtx.prefectureCode || undefined}
          prefectureName={prefCtx.prefectureName}
          score={result?.requiredExamScore}
          max={result?.examMaxScore}
          heading={
            result
              ? `必要な当日点${result.requiredExamScore}/${result.examMaxScore}点を、受験本番まで無料で受け取りませんか？`
              : '必要点と志望校を、受験本番まで無料で受け取りませんか？'
          }
          body="目標までの差・出願スケジュール・対策のコツを、LINEまたはメールでお届けします。いつでも解除できます。"
          className="mt-6"
        />

        {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：必要当日点の現在地＋成績カードを面談へ持って行く導線（C-14） */}
        <ParentWindowBridge
          className="mt-6"
          metricLabel="必要な当日点"
          score={result?.requiredExamScore}
          max={result?.examMaxScore}
          prefectureCode={prefCtx.prefectureCode || undefined}
          prefectureName={prefCtx.prefectureName}
        />

        {/* S-1: 匿名統計オプトイン */}
        <div className="mt-6">
          <StatsOptIn
            metric="total-score"
            value={result?.requiredExamScore}
            maxValue={result?.examMaxScore}
            prefectureCode={prefCtx.prefectureCode || undefined}
          />
        </div>

        {/* 2026-07 AdSense撤退＝アフィリ一本化：ここにあった Z会/スタサプの表示バナー群
            （推定EV ¥1.5〜29/click）は、上の保護者リード(塾無料体験 ¥84〜)＋LINE名簿と
            同じクリックを奪う低EVの重複だったため撤去。プライム面を高EVオファーに集中させる。 */}

        {/* 当日点逆算の考え方（本文・検索意図の網羅で順位を底上げ） */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-900">当日点の逆算とは？合格点から必要点数を出す考え方</h2>
          <p className="text-base leading-[1.8] text-slate-900">
            高校入試の合否は、多くの都道府県で<strong>「内申点（調査書点）＋ 当日の学力検査点」の合計</strong>で決まります。
            だから「志望校に受かるには、当日に何点取ればいいか」は<strong>合格基準点 −（点数化した内申点）</strong>で逆算できます。
            内申点がすでに高ければ必要な当日点は下がり、内申点が低ければその分を当日点で取り返す必要がある、というシンプルな関係です。
          </p>
          <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-bold text-slate-900 sm:w-48">① 合格基準点</dt>
              <dd className="text-base leading-[1.8] text-slate-900">模試判定・進路資料・合格者平均から目安を把握。</dd>
            </div>
            <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-bold text-slate-900 sm:w-48">② 点数化した内申点</dt>
              <dd className="text-base leading-[1.8] text-slate-900">都道府県の方式で内申を点数に換算（満点・比率は地域差大）。</dd>
            </div>
            <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-bold text-slate-900 sm:w-48">③ 必要な当日点</dt>
              <dd className="text-base leading-[1.8] text-slate-900">①−②＝当日に取るべき点数。配点比率で重みが変わる。</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-[1.8] text-slate-600">
            まだ自分の内申点を把握していない場合は<Link href="/" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">内申点 計算サイト（47都道府県）</Link>で先に算出を。
            志望校レベルの当たりをつけるなら<Link href="/hensachi/shiboukou" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">偏差値→志望校レンジ逆引き</Link>が便利です。
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
          <div className="space-y-4">
            {REVERSE_FAQS.map((f) => (
              <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                <h3 className="mb-1 text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900">関連コンテンツ</h2>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            <li>
              <Link href="/" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">内申点を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">評定平均を自動計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/prefectures" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">都道府県別の計算方法を見る</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/tokyo/total-score" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">都立1020点 総合得点を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/kanagawa/s-value" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">神奈川S値を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link href="/tarinai-taisaku" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                <span className="underline underline-offset-2">内申点・当日点が足りない冬の緊急対策</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function ReverseClient() {
  return (
    <Suspense fallback={<Loader variant="fullscreen" message="逆算ツールを準備しています..." />}>
      <ReversePageContent />
    </Suspense>
  );
}
