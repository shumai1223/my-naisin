"use client";

import * as React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Home, ChevronRight, Target, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import Loader from '@/components/ui/Loader';

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
  
  return (
    <div className="min-h-screen">
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
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="px-4 pb-10 md:px-6 pt-8">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
                  <Home className="h-4 w-4" />
                  ホーム
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-700">志望校から逆算</span>
              </nav>

              {/* SSR説明セクション */}
              <section className="mb-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">内申点シミュレーター｜志望校から逆算</h1>
                    <p className="mt-1 text-sm text-slate-500">2026年度入試対応（令和8年度入学者選抜）</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  「この高校に受かるには、当日の試験で何点取ればいい？」——そんな疑問に答える逆算ツールです。
                  現在の内申点と志望校の配点比率を入力するだけで、合格に必要な当日点の目安がわかります。
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      何を入力するの？
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-blue-700">
                      <li>• 都道府県を選択</li>
                      <li>• 現在の内申点を入力</li>
                      <li>• 志望校の内申:学力の配点比率を設定</li>
                      <li>• 当日点の満点を設定（例：500点）</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <HelpCircle className="h-4 w-4" />
                      何がわかるの？
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-emerald-700">
                      <li>• 合格に必要な当日点の目安</li>
                      <li>• 必要得点率（何%取ればよいか）</li>
                      <li>• 内申点のカバー率</li>
                      <li>• 東京都1020点満点・神奈川S値にも対応</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-800">結果の見方と注意点</h3>
                      <ul className="mt-1 space-y-1 text-xs text-amber-700">
                        <li>• 配点比率は高校・学科・入試方式ごとに異なります。志望校の募集要項で必ず確認してください。</li>
                        <li>• 計算結果はあくまで目安です。実際の合否は面接・調査書・特色検査なども影響します。</li>
                        <li>• 最新の入試情報は各都道府県教育委員会の公式サイトでご確認ください。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* ツールの使い方説明 */}
              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">🛠️ 逆算ツールの使い方</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-blue-800">ステップ1：都道府県を選択</h3>
                    <p className="text-sm text-blue-700">あなたの受験する都道府県を選択します。東京都・神奈川県・大阪府など主要な都道府県に対応しています。</p>
                  </div>
                  
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-green-800">ステップ2：現在の内申点を入力</h3>
                    <p className="text-sm text-green-700">現在の内申点を入力します。東京都の場合は「換算内申（65点満点）」、神奈川県の場合は「評定合計（135点満点）」を入力してください。</p>
                  </div>
                  
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-purple-800">ステップ3：配点比率を設定</h3>
                    <p className="text-sm text-purple-700">志望校の内申点と学力検査の配点比率を設定します。よくある比率のプリセットボタンもあるので、参考にしてください。</p>
                  </div>
                  
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-amber-800">ステップ4：目標点を設定して計算</h3>
                    <p className="text-sm text-amber-700">志望校の合格ラインや目標点を入力し、「計算する」ボタンをクリック。必要な当日点がすぐにわかります。</p>
                  </div>
                </div>
              </section>

              {/* サンプル計算結果（SSR表示） */}
              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">計算例：東京都立高校を目指す場合</h2>
                
                {/* 満点の枠組み */}
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h3 className="mb-2 text-sm font-bold text-blue-800">満点の枠組み</h3>
                  <div className="text-sm text-blue-700">
                    学力検査(700点) + 調査書点(300点) + ESAT-J(20点) = 1020点満点
                    <div className="text-xs text-blue-600 mt-1">※ESAT-J対象外の学校・コースもあります</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-slate-700">入力例</h3>
                    <div className="grid gap-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>換算内申：</span>
                        <span className="font-medium">50 / 65</span>
                      </div>
                      <div className="flex justify-between">
                        <span>目標総合点：</span>
                        <span className="font-medium">931 / 1020</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESAT-J見込み：</span>
                        <span className="font-medium">20 / 20</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-emerald-700">計算</h3>
                    <div className="space-y-2 text-sm text-emerald-600">
                      <div className="flex justify-between">
                        <span>調査書点（推定）：</span>
                        <span className="font-bold text-emerald-800">round(50 ÷ 65 × 300) = 231点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>必要学力検査点：</span>
                        <span className="font-bold text-emerald-800">931 - 231 - 20 = 680点 / 700点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>必要得点率：</span>
                        <span className="font-bold text-emerald-800">約97%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5教科平均：</span>
                        <span className="font-bold text-emerald-800">約136点 / 140点</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 text-sm font-bold text-blue-700">解説</h3>
                    <p className="text-xs text-blue-600">
                      この計算例では、換算内申50点（65点満点中）が調査書点231点に変換され、
                      目標総合点931点から調査書点231点とESAT-J 20点を引いた680点が当日の学力検査で必要な点数となります。
                      これにより「何点取れば合格できるか」が具体的にわかります。
                    </p>
                  </div>
                </div>
              </section>

              <ReverseCalculator
                onBack={() => router.push('/')}
              />

              {/* 保護者向けリード（換金の本命：志望校が見えた保護者を無料資料請求へ） */}
              <ParentLeadCTA placement="result" auditHide className="mt-8" />

              {/* 結果の保存（名簿化：再訪の燃料） */}
              <SaveResultCTA
                source="gap-target"
                heading="必要点と志望校を、受験本番まで無料で受け取りませんか？"
                body="目標までの差・出願スケジュール・対策のコツを、LINEまたはメールでお届けします。いつでも解除できます。"
                className="mt-6"
              />

              {/* 計算後のZ会CTA - 志望校が決まった人向け */}
              <section className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-6 text-center shadow-sm">
                <div className="text-sm font-bold text-slate-800 mb-1">
                  必要な得点が分かったあなたへ
                </div>
                <div className="text-xs text-slate-600 mb-4 leading-relaxed">
                  目標点まであと一歩。<AffiliateAd id="zkai-text-advanced" hideLabel auditHide />（PR）なら、添削指導で「本当の得点力」が身につきます。
                </div>
                <div className="hidden md:block">
                  <AffiliateAd id="zkai-banner" trackView viewPlacement="reverse" />
                </div>
                <div className="md:hidden">
                  <AffiliateAd id="sapuri-banner-300" trackView viewPlacement="reverse" />
                </div>
                <div className="mt-3 text-xs">
                  <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel auditHide />（PR）で詳細をチェック
                </div>
              </section>

              {/* 当日点逆算の考え方（本文・検索意図の網羅で順位を底上げ） */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-slate-800">当日点の逆算とは？合格点から必要点数を出す考え方</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  高校入試の合否は、多くの都道府県で<strong>「内申点（調査書点）＋ 当日の学力検査点」の合計</strong>で決まります。
                  だから「志望校に受かるには、当日に何点取ればいいか」は<strong>合格基準点 −（点数化した内申点）</strong>で逆算できます。
                  内申点がすでに高ければ必要な当日点は下がり、内申点が低ければその分を当日点で取り返す必要がある、というシンプルな関係です。
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="text-xs font-bold text-blue-900">① 合格基準点</div>
                    <p className="mt-1 text-xs leading-relaxed text-blue-800">模試判定・進路資料・合格者平均から目安を把握。</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="text-xs font-bold text-emerald-900">② 点数化した内申点</div>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-800">都道府県の方式で内申を点数に換算（満点・比率は地域差大）。</p>
                  </div>
                  <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                    <div className="text-xs font-bold text-purple-900">③ 必要な当日点</div>
                    <p className="mt-1 text-xs leading-relaxed text-purple-800">①−②＝当日に取るべき点数。配点比率で重みが変わる。</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  まだ自分の内申点を把握していない場合は<Link href="/" className="font-bold text-blue-600 hover:underline">内申点 計算サイト（47都道府県）</Link>で先に算出を。
                  志望校レベルの当たりをつけるなら<Link href="/hensachi/shiboukou" className="font-bold text-blue-600 hover:underline">偏差値→志望校レンジ逆引き</Link>が便利です。
                </p>
              </section>

              {/* FAQ */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
                <div className="space-y-4">
                  {REVERSE_FAQS.map((f) => (
                    <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 関連リンク */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-800">関連コンテンツ</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">内申点を計算する</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/hensachi"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/hyotei-heikin"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">評定平均を自動計算する</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/prefectures"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を見る</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/tokyo/total-score"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">都立1020点 総合得点を計算する</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/kanagawa/s-value"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">神奈川S値を計算する</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
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
