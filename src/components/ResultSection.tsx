'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BookOpen, ChevronRight, ExternalLink, FileText, RotateCcw, Send, Share2, Sparkles, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { Switch } from '@/components/ui/Switch';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { PrintButton } from '@/components/PrintButton';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { GapToTarget } from '@/components/Result/GapToTarget';
import { RankCard } from '@/components/Result/RankCard';
import { CalculationBasis } from '@/components/Result/CalculationBasis';
import { PointValueCard } from '@/components/Result/PointValueCard';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { getPrefectureByCode, type PrefectureConfig } from '@/lib/prefectures';
import { track, EVENTS } from '@/lib/track';
import type { ResultData, SavedHistoryEntry, Scores } from '@/lib/types';

const CARD_LOADER = (
  <div
    className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white"
    aria-busy="true"
  >
    <Loader variant="spinner" size="md" message="読み込み中..." />
  </div>
);

const ScoreProgressChart = dynamic(
  () => import('@/components/Result/ScoreProgressChart').then((m) => ({ default: m.ScoreProgressChart })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ScoreImprovementAnalysis = dynamic(
  () =>
    import('@/components/Result/ScoreImprovementAnalysis').then((m) => ({
      default: m.ScoreImprovementAnalysis
    })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ComparisonCard = dynamic(
  () => import('@/components/Result/ComparisonCard').then((m) => ({ default: m.ComparisonCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ReasoningCard = dynamic(
  () => import('@/components/Result/ReasoningCard').then((m) => ({ default: m.ReasoningCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const DailyQuoteCard = dynamic(
  () => import('@/components/Result/DailyQuoteCard').then((m) => ({ default: m.DailyQuoteCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const MotivationCard = dynamic(
  () => import('@/components/Result/MotivationCard').then((m) => ({ default: m.MotivationCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const RadarChart = dynamic(
  () => import('@/components/Result/RadarChart').then((m) => ({ default: m.RadarChart })),
  { ssr: false, loading: () => CARD_LOADER }
);
const AchievementBadges = dynamic(
  () => import('@/components/Result/AchievementBadges').then((m) => ({ default: m.AchievementBadges })),
  { ssr: false, loading: () => CARD_LOADER }
);
const SubjectImprovementCard = dynamic(
  () =>
    import('@/components/Result/SubjectImprovementCard').then((m) => ({
      default: m.SubjectImprovementCard
    })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ImprovementAdvisor = dynamic(
  () => import('@/components/Result/ImprovementAdvisor').then((m) => ({ default: m.ImprovementAdvisor })),
  { ssr: false, loading: () => CARD_LOADER }
);
const PrefectureComparison = dynamic(
  () => import('@/components/Result/PrefectureComparison').then((m) => ({ default: m.PrefectureComparison })),
  { ssr: false, loading: () => CARD_LOADER }
);
const StudyAdvice = dynamic(
  () => import('@/components/Result/StudyAdvice').then((m) => ({ default: m.StudyAdvice })),
  { ssr: false, loading: () => CARD_LOADER }
);
const PersonalGoalCard = dynamic(
  () => import('@/components/Result/PersonalGoalCard').then((m) => ({ default: m.PersonalGoalCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const QuickStudyTimer = dynamic(
  () => import('@/components/Result/QuickStudyTimer').then((m) => ({ default: m.QuickStudyTimer })),
  { ssr: false, loading: () => CARD_LOADER }
);
const SubjectBreakdown = dynamic(
  () => import('@/components/SubjectBreakdown').then((m) => ({ default: m.SubjectBreakdown })),
  { ssr: false, loading: () => CARD_LOADER }
);
const GoalSection = dynamic(
  () => import('@/components/GoalSection').then((m) => ({ default: m.GoalSection })),
  { ssr: false, loading: () => CARD_LOADER }
);

export type ResultTabId = 'key' | 'detail';

interface ResultSectionProps {
  result: ResultData;
  scores: Scores;
  prefectureCode: string;
  selectedPrefecture: PrefectureConfig | undefined;
  saveEnabled: boolean;
  onSaveEnabledChange: (checked: boolean) => void;
  saveMemo: string;
  onSaveMemoChange: (memo: string) => void;
  onSaveNow: () => void;
  lastSaved: SavedHistoryEntry | null;
  onShareOpen: () => void;
}

export function ResultSection({
  result,
  scores,
  prefectureCode,
  selectedPrefecture,
  saveEnabled,
  onSaveEnabledChange,
  saveMemo,
  onSaveMemoChange,
  onSaveNow,
  lastSaved,
  onShareOpen
}: ResultSectionProps) {
  const [activeTab, setActiveTab] = React.useState<ResultTabId>('key');

  // 橋②バトン（生徒→保護者）：最高インテントの瞬間（スコア表示直後）に押される送り手側の計装。
  // GapToTarget 内の同イベントとは source で区別する。決裁者（保護者）へオファーを届ける唯一の動線。
  const onSendToParent = React.useCallback(() => {
    track(EVENTS.SHARE_TO_PARENT, {
      pref: prefectureCode,
      source: 'result-top',
      percent: Math.round(result.percent),
    });
    onShareOpen();
  }, [prefectureCode, result.percent, onShareOpen]);

  const tabs: TabItem[] = React.useMemo(
    () => [
      {
        id: 'key',
        label: '重要な情報',
        icon: <Sparkles className="h-5 w-5" />,
        description: 'スコア・計算根拠・保存'
      },
      {
        id: 'detail',
        label: '詳しく分析',
        icon: <BarChart3 className="h-5 w-5" />,
        badge: '15+',
        description: 'グラフ・アドバイス・目標設定'
      }
    ],
    []
  );

  return (
    <section id="result" className="space-y-4" aria-label="計算結果">
      {/* スコア概要は常にトップに表示 */}
      <Card className="overflow-hidden" variant="elevated">
        <div className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 px-6 py-5">
          <div className="text-lg font-bold text-slate-800">🎉 あなたの内申点</div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <ScoreGauge percent={result.percent} total={result.total} max={result.max} />
              <div>
                <div className="mt-1 text-4xl font-bold tracking-tight text-slate-800">
                  {result.total}
                  <span className="text-xl font-semibold text-slate-400">/{result.max}</span>
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {selectedPrefecture?.description ?? '9教科 × 5点 = 45点満点'}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
              {/* 橋②バトン：最上部＝感情ピークに「おうちの人に送る」を主役配置（目標設定の後ろに隠さない）。
                  共有先は保護者最適化ページ（/hogosha）への文脈付きリンク＝決裁者がオファーに着地する。 */}
              <button
                type="button"
                onClick={onSendToParent}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 md:w-auto"
              >
                <Send className="h-4 w-4" />
                この結果をおうちの人に送る
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <div className="flex w-full gap-2 md:w-auto">
                <Button
                  variant="secondary"
                  onClick={onShareOpen}
                  leftIcon={<Share2 className="h-4 w-4" />}
                  className="w-full md:w-auto"
                >
                  シェア画像
                </Button>
                <PrintButton />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as ResultTabId)} />

      {activeTab === 'key' ? (
        <div
          id="tabpanel-key"
          role="tabpanel"
          aria-labelledby="tab-key"
          className="space-y-4"
        >
          {/* 橋①：取引の発火点。目標内申とのギャップを生成し、状態別に保護者向け成果報酬CTA＋保護者バトンを出す。
              最高インテントの瞬間なので最上部に単独配置（散らさない）。 */}
          <GapToTarget
            result={result}
            prefectureCode={prefectureCode}
            prefectureName={selectedPrefecture?.name}
            onShareOpen={onShareOpen}
          />

          {/* 子ども向け第2選択肢（クリックアフィリ）：内申点レベル別の動的訴求。
              観客=生徒に向けた教材導線。橋①（保護者・成果報酬）の下に置く。 */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 px-6 py-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div className="text-base font-bold text-slate-800">
                  あなたの内申点レベルに合った学習サポート
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                計算結果（満点比 {result.percent.toFixed(0)}%）から、今のあなたに最適な学習方法を提案します
              </div>
            </div>
            <div className="p-6">
              {result.percent >= 80 ? (
                // 高内申層（80%+）：難関対策・上位志望校
                <div className="space-y-3">
                  <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-black text-white">
                        難関校志望者へ
                      </span>
                      <div className="text-sm font-bold text-purple-900">
                        Z会の通信教育（難関校受験コース）
                      </div>
                    </div>
                    <p className="text-xs text-purple-800 leading-relaxed mb-3">
                      内申点が高い層は、当日点の取り切りで合否が決まります。Z会の難関校受験コースは、応用問題対策・記述力育成・添削指導で、トップ校合格者の定番教材。
                    </p>
                    <div className="text-xs">
                      <AffiliateAd id="zkai-text-advanced" hideLabel />（PR）
                    </div>
                  </div>
                </div>
              ) : result.percent >= 60 ? (
                // 中位層（60〜80%）：通信教育で安定上昇
                <div className="space-y-3">
                  <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                        中堅上位を狙うなら
                      </span>
                      <div className="text-sm font-bold text-blue-900">
                        Z会の通信教育 ＋ スタディサプリ
                      </div>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed mb-3">
                      あと一押しで上位校が見える層。テキスト＋添削で定期テスト対策が万全のZ会と、月額2,178円で映像授業見放題のスタディサプリの組み合わせがコスパ最高。
                    </p>
                    <div className="text-xs space-y-1">
                      <div><AffiliateAd id="zkai-text-middle" hideLabel />（PR）── テキスト＋添削で内申＋偏差値を伸ばす</div>
                      <div><AffiliateAd id="sapuri-text" hideLabel /> ── 月額2,178円で5教科＋実技の映像授業</div>
                    </div>
                  </div>
                </div>
              ) : result.percent >= 40 ? (
                // 中堅層（40〜60%）：基礎固め
                <div className="space-y-3">
                  <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                        基礎固めで底上げ
                      </span>
                      <div className="text-sm font-bold text-emerald-900">
                        スタディサプリ中学講座 ＋ ネット松陰塾
                      </div>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      苦手教科の理解不足が原因で評定が伸び悩んでいる層。映像授業で「分からない」を解消し、個別指導で学習習慣を作るのが最短ルート。
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <AffiliateAd id="sapuri-banner-300" />
                      <AffiliateAd id="shoin-banner" />
                    </div>
                  </div>
                </div>
              ) : (
                // 下位層（〜40%）：個別指導で学習習慣
                <div className="space-y-3">
                  <div className="rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white">
                        まず学習習慣から
                      </span>
                      <div className="text-sm font-bold text-rose-900">
                        ネット松陰塾の個別指導 ＋ スタディサプリ
                      </div>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed mb-3">
                      学習習慣が確立していない層は、まず「毎日机に向かう」を作ることが最優先。個別指導でつまずきポイントを潰しながら、映像授業で基礎を理解する2段構えが効果的。
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <AffiliateAd id="shoin-banner" />
                      <AffiliateAd id="sapuri-banner-300" />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 text-center text-[10px] text-slate-400">
                ※ 上記は内申点レベルから推定した一般的なおすすめです。実際の学習プランは志望校や個人の特性に合わせて選んでください。
              </div>
            </div>
          </Card>

          {/* 計算結果直後の最高エンゲージ位置：Z会CTA（モバイルは大きめタップ領域） */}
          <Card className="overflow-hidden">
            <div className="px-5 py-5 text-center md:px-6">
              <div className="mb-2 text-sm font-bold text-slate-700">
                内申点アップに通信教育という選択肢
              </div>
              <div className="mb-4 text-xs text-slate-500">
                定期テスト対策に強い教材で、毎学期の評定を底上げ
              </div>
              {/* Desktop: 728x90バナー */}
              <div className="hidden md:block">
                <AffiliateAd id="zkai-banner" />
              </div>
              {/* Mobile: ボタン化したCTA（タップしやすい44px以上） */}
              <div className="md:hidden">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-left">
                  <div className="mb-2 text-sm font-bold text-blue-900">
                    中学生のためのＺ会の通信教育
                  </div>
                  <div className="mb-3 text-xs text-blue-700 leading-relaxed">
                    難関校対策にも対応。テキスト＋添削で内申＋偏差値を伸ばす定番教材。
                  </div>
                  <AffiliateAd
                    id="zkai-text-request"
                    hideLabel
                    linkClassName="block w-full rounded-xl bg-blue-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-md shadow-blue-500/30 active:bg-blue-700"
                  />
                  <div className="mt-2 text-center text-[10px] text-slate-400">[PR]</div>
                </div>
              </div>
              <div className="mt-3 hidden text-xs md:block">
                <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）から始められます
              </div>
            </div>
          </Card>

          <RankCard result={result} />
          <PointValueCard scores={scores} prefectureCode={prefectureCode} />

          {/* スコア解釈後の中間CTA：スタディサプリ */}
          <Card className="overflow-hidden">
            <div className="px-5 py-5 md:px-6">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    定期テスト対策ならスタディサプリ
                  </div>
                  <div className="mt-1 text-xs text-slate-500 leading-relaxed">
                    プロ講師の映像授業で全教科の単元別講義。月額料金で見放題。
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <AffiliateAd id="sapuri-banner-300" />
                </div>
              </div>
            </div>
          </Card>

          <CalculationBasis prefectureCode={prefectureCode} total={result.total} max={result.max} />

          {/* 内申点計算後の関連ツール導線（/hyotei-heikin・/hensachi の被リンク強化＋ユーザー回遊性アップ） */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 px-6 py-5">
              <div className="text-base font-bold text-slate-800">🧮 関連する無料ツール</div>
              <div className="mt-1 text-sm text-slate-500">
                内申点と合わせて確認しておきたい指標を、専用ツールで瞬時に算出できます。
              </div>
            </div>
            <div className="grid gap-3 p-6 md:grid-cols-2">
              <Link
                href="/hyotei-heikin"
                className="group flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-4 transition-all hover:border-emerald-400 hover:shadow-md"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                    評定平均 計算サイト
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    通知表の評定（1〜5）から評定平均と素内申を瞬時に算出。私立併願優遇・推薦入試の基準確認に。
                  </p>
                </div>
                <ChevronRight className="mt-3 h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/hensachi"
                className="group flex items-start gap-3 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-white p-4 transition-all hover:border-purple-400 hover:shadow-md"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700">
                    偏差値計算サイト（5教科）
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    模試・定期テストの点数と平均点から偏差値を瞬時に算出。志望校との距離を確認できます。
                  </p>
                </div>
                <ChevronRight className="mt-3 h-4 w-4 text-purple-500 transition-transform group-hover:translate-x-1" />
              </Link>

              {prefectureCode === 'tokyo' && (
                <Link
                  href="/tokyo/total-score"
                  className="group flex items-start gap-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-4 transition-all hover:border-blue-400 hover:shadow-md md:col-span-2"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                      都立高校 総合得点計算（1020点満点）
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      学力検査700点・調査書点300点・ESAT-J 20点の3要素から、都立入試の総合得点を算出。志望校の合格目安と比較できます。
                    </p>
                  </div>
                  <ChevronRight className="mt-3 h-4 w-4 text-blue-500 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </Card>

          {prefectureCode === 'kanagawa' && (
            <Card className="overflow-hidden">
              <div className="border-b border-slate-100/80 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-sky-50/80 px-6 py-5">
                <div className="text-base font-bold text-slate-800">神奈川は学校別比率で決まる</div>
                <div className="mt-1 text-sm text-slate-500">
                  内申:学力の比率は 4:6 / 5:5 / 3:7 など学校ごとに異なります。
                  <span className="text-xs text-slate-400">（よくある例）</span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  学校・学科ごとに異なる（2:8〜8:2）。各2以上・合計10、特色検査は最大5。
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {['4-6', '5-5', '3-7'].map((ratio) => (
                    <Link
                      key={ratio}
                      href={`/reverse?pref=kanagawa&ratio=${ratio}`}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
                    >
                      {ratio.replace('-', ':')}
                    </Link>
                  ))}
                  <Link
                    href="/reverse?pref=kanagawa"
                    className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    S1値を計算する
                  </Link>
                </div>
                <p className="mt-2 text-xs text-slate-400">比率は合計10、各2以上の整数が基本です。</p>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-violet-50/80 via-purple-50/60 to-fuchsia-50/80 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-slate-800">📁 記録を保存</div>
                  <div className="mt-1 text-sm text-slate-500">この端末のみに保存（外部に送信されません）</div>
                </div>
                <Switch checked={saveEnabled} onCheckedChange={onSaveEnabledChange} />
              </div>
            </div>
            <div className="p-6">
              <div className="mb-3 text-sm text-slate-600">
                成績は自動的に保存されています。任意で名前を付けることができます。
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <div className="text-xs font-bold text-slate-700">記録に名前を付ける（任意）</div>
                  <input
                    value={saveMemo}
                    onChange={(e) => onSaveMemoChange(e.target.value)}
                    disabled={!saveEnabled}
                    placeholder="例：1学期中間、模試前 など"
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <Button variant="secondary" onClick={onSaveNow} disabled={!saveEnabled} className="h-11 w-full md:w-auto">
                  名前を追加
                </Button>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {lastSaved ? (
                  <>最終保存：{new Date(lastSaved.savedAt).toLocaleString('ja-JP')}</>
                ) : (
                  <>まだ保存がありません</>
                )}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-violet-50/80 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-slate-800">
                    📍 {getPrefectureByCode(prefectureCode)?.name}の詳しい情報
                  </div>
                  <div className="mt-1 text-sm text-slate-500">計算根拠・FAQ・公式資料</div>
                </div>
                <Link
                  href={`/${prefectureCode}/naishin`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4" />
                  計算根拠ページへ
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className="group flex w-full items-center justify-between rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-blue-50 px-5 py-4 text-left transition-all duration-200 hover:border-indigo-400 hover:shadow-md"
          >
            <div>
              <div className="text-sm font-bold text-indigo-800">
                📊 もっと詳しく分析する
              </div>
              <div className="mt-0.5 text-xs text-indigo-600">
                レーダーチャート・成績推移・アドバイスなど15項目以上
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition-all group-hover:bg-indigo-700 group-hover:shadow-md">
              詳しく見る
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>
      ) : (
        <div
          id="tabpanel-detail"
          role="tabpanel"
          aria-labelledby="tab-detail"
          className="space-y-4"
        >
          <ScoreProgressChart
            currentTotal={result.total}
            currentMax={result.max}
            currentPrefecture={prefectureCode}
          />

          {/* 詳細分析を開く高インテント層へ：Z会難関校 */}
          <Card className="overflow-hidden">
            <div className="px-5 py-5 md:px-6">
              <div className="text-sm font-bold text-slate-800 mb-2">
                難関校を狙うなら、当日点の実力も伸ばす
              </div>
              <div className="text-xs text-slate-500 leading-relaxed mb-3">
                内申点を最大化したら、次は当日点。トップ校受験で実績ある通信教育の選択肢があります。
              </div>
              <div className="text-sm">
                <AffiliateAd id="zkai-text-advanced" hideLabel />（PR）／
                <AffiliateAd id="zkai-text-request" hideLabel />（PR）
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-green-50/80 px-6 py-5">
              <div className="text-base font-bold text-slate-800 mb-4">🎯 受験対策の完全ガイド</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/blog"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md hover:bg-emerald-50"
                >
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-800">内申点コラム</div>
                    <div className="text-xs text-slate-500">基礎知識から実践まで</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
                <Link
                  href="/guide"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md hover:bg-emerald-50"
                >
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-800">制度を理解する</div>
                    <div className="text-xs text-slate-500">都道府県別の違い</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
                <Link
                  href="/tools"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md hover:bg-emerald-50"
                >
                  <RotateCcw className="h-5 w-5 text-emerald-600" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-800">ツール一覧</div>
                    <div className="text-xs text-slate-500">計算・逆算・比較</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md hover:bg-emerald-50"
                >
                  <ExternalLink className="h-5 w-5 text-emerald-600" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-800">運営者情報</div>
                    <div className="text-xs text-slate-500">信頼性と透明性</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>
          </Card>

          <ScoreImprovementAnalysis currentScores={scores} prefectureCode={prefectureCode} />
          <ComparisonCard
            result={result}
            scores={scores}
            saveEnabled={saveEnabled}
            lastSavedId={lastSaved?.id}
          />
          <ReasoningCard result={result} scores={scores} />
          <DailyQuoteCard />
          <MotivationCard result={result} />
          <RadarChart scores={scores} prefectureCode={prefectureCode} />
          <AchievementBadges scores={scores} result={result} />
          <SubjectImprovementCard currentScores={scores} />
          <ImprovementAdvisor scores={scores} prefectureCode={prefectureCode} />
          <PrefectureComparison scores={scores} currentPrefectureCode={prefectureCode} />
          <StudyAdvice scores={scores} result={result} />
          <PersonalGoalCard />
          <QuickStudyTimer />
          <SubjectBreakdown scores={scores} prefectureCode={prefectureCode} />
          <GoalSection currentScore={result.total} maxScore={result.max} />

          <Card className="overflow-hidden">
            <div className="px-6 py-6 text-center">
              <div className="mb-2 text-sm font-bold text-slate-700">
                月額2,178円で全教科見放題
              </div>
              <div className="mb-4 text-xs text-slate-500">
                スマホ・タブレットで学べる定番のオンライン学習サービス
              </div>
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
