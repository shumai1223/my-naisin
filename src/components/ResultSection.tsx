'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BookOpen, ChevronRight, ExternalLink, FileText, RotateCcw, Share2, Sparkles, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { PrintButton } from '@/components/PrintButton';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { RankCard } from '@/components/Result/RankCard';
import { CalculationBasis } from '@/components/Result/CalculationBasis';
import { PointValueCard } from '@/components/Result/PointValueCard';
import { getPrefectureByCode, type PrefectureConfig } from '@/lib/prefectures';
import type { ResultData, SavedHistoryEntry, Scores } from '@/lib/types';

const CARD_LOADER = (
  <div
    className="flex h-28 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-white text-xs text-slate-400"
    aria-busy="true"
  >
    読み込み中...
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

            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
              <Button
                onClick={onShareOpen}
                leftIcon={<Share2 className="h-4 w-4" />}
                className="w-full md:w-auto"
              >
                シェア画像を作る
              </Button>
              <PrintButton />
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
          <RankCard result={result} />
          <PointValueCard scores={scores} prefectureCode={prefectureCode} />
          <CalculationBasis prefectureCode={prefectureCode} total={result.total} max={result.max} />

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
        </div>
      )}
    </section>
  );
}
