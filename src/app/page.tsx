'use client';

import * as React from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Share2 } from 'lucide-react';

import { DEFAULT_SCORES, MODE_CONFIG } from '@/lib/constants';
import { appendHistoryEntry, getSaveConsent, readHistory, setSaveConsent } from '@/lib/persistence';
import type { ResultData, SavedHistoryEntry, ScoreMode, Scores, SubjectKey } from '@/lib/types';
import {
  calculateMaxScore,
  calculatePercent,
  calculateTotalScore,
  getRankForPercent,
  updateScoreValue
} from '@/lib/utils';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { SidebarAd } from '@/components/SidebarAd';
import { TipsSection } from '@/components/TipsSection';
import { StatsBar } from '@/components/StatsBar';
import { GoalSection } from '@/components/GoalSection';
import { SubjectBreakdown } from '@/components/SubjectBreakdown';
import { WelcomeBack } from '@/components/WelcomeBack';
import { InputForm } from '@/components/Calculator/InputForm';
import { RegionSwitch } from '@/components/Calculator/RegionSwitch';
import { AchievementBadges } from '@/components/Result/AchievementBadges';
import { ComparisonCard } from '@/components/Result/ComparisonCard';
import { MotivationCard } from '@/components/Result/MotivationCard';
import { RadarChart } from '@/components/Result/RadarChart';
import { ReasoningCard } from '@/components/Result/ReasoningCard';
import { RankCard } from '@/components/Result/RankCard';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { ShareModal } from '@/components/Result/ShareModal';
import { StudyAdvice } from '@/components/Result/StudyAdvice';
import { ScoreProgressChart } from '@/components/Result/ScoreProgressChart';
import { StudyStreakCard } from '@/components/Result/StudyStreakCard';
import { SubjectImprovementCard } from '@/components/Result/SubjectImprovementCard';
import { PersonalGoalCard } from '@/components/Result/PersonalGoalCard';
import { QuickStudyTimer } from '@/components/Result/QuickStudyTimer';
import { DailyQuoteCard } from '@/components/Result/DailyQuoteCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { HistoryPanel } from '@/components/HistoryPanel';
import { PrintButton } from '@/components/PrintButton';
import { BlogSection } from '@/components/BlogSection';

function popConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 38,
    ticks: 220,
    scalar: 0.95,
    origin: { y: 0.65 }
  });
}

export default function Page() {
  const [mode, setMode] = React.useState<ScoreMode>('normal');
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [showResult, setShowResult] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [saveEnabled, setSaveEnabled] = React.useState(false);
  const [saveMemo, setSaveMemo] = React.useState('');
  const [lastSaved, setLastSaved] = React.useState<SavedHistoryEntry | null>(null);

  React.useEffect(() => {
    setShareUrl(window.location.origin);
  }, []);

  React.useEffect(() => {
    setSaveEnabled(getSaveConsent());
    const history = readHistory();
    setLastSaved(history[0] ?? null);
  }, []);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem('my-naishin:scores');
      const savedMode = window.localStorage.getItem('my-naishin:mode');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<SubjectKey, unknown>>;
        setScores((prev) => {
          const next = { ...prev };
          (Object.keys(next) as SubjectKey[]).forEach((key) => {
            const raw = parsed?.[key];
            const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
            if (!Number.isFinite(n)) return;
            next[key] = Math.min(5, Math.max(1, Math.round(n)));
          });
          return next;
        });
      }
      if (savedMode === 'normal' || savedMode === 'tokyo') {
        setMode(savedMode);
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('my-naishin:scores', JSON.stringify(scores));
      window.localStorage.setItem('my-naishin:mode', mode);
    } catch {
      // ignore
    }
  }, [scores, mode]);

  const total = React.useMemo(() => calculateTotalScore(scores, mode), [scores, mode]);
  const max = React.useMemo(() => calculateMaxScore(mode), [mode]);
  const percent = React.useMemo(() => calculatePercent(total, max), [total, max]);
  const rank = React.useMemo(() => getRankForPercent(percent), [percent]);

  const result: ResultData = React.useMemo(
    () => ({
      mode,
      total,
      max,
      percent,
      rank
    }),
    [mode, total, max, percent, rank]
  );

  const onScoreChange = React.useCallback((key: SubjectKey, nextValue: number) => {
    setScores((prev) => updateScoreValue(prev, key, nextValue));
  }, []);

  const onSaveEnabledChange = React.useCallback(
    (checked: boolean) => {
      setSaveEnabled(checked);
      setSaveConsent(checked);

      if (checked && showResult) {
        const entry = appendHistoryEntry({ mode, scores, memo: saveMemo });
        if (entry) setLastSaved(entry);
      }
    },
    [mode, saveMemo, scores, showResult]
  );

  const onSaveNow = React.useCallback(() => {
    if (!saveEnabled) return;
    const entry = appendHistoryEntry({ mode, scores, memo: saveMemo });
    if (entry) setLastSaved(entry);
  }, [mode, saveEnabled, saveMemo, scores]);

  const onReveal = React.useCallback(() => {
    setShowResult(true);

    if (saveEnabled) {
      const entry = appendHistoryEntry({ mode, scores, memo: saveMemo });
      if (entry) setLastSaved(entry);
    }

    window.setTimeout(() => {
      popConfetti();
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [mode, saveEnabled, saveMemo, scores]);

  const onReset = React.useCallback(() => {
    setScores(DEFAULT_SCORES);
    setShowResult(false);
    window.setTimeout(() => {
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  const onLoadHistory = React.useCallback((entry: SavedHistoryEntry) => {
    setMode(entry.mode);
    setScores(entry.scores);
    setShowResult(true);
    window.setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  const modeInfo = MODE_CONFIG[mode];

  return (
    <div id="top" className="min-h-screen">
      {/* Welcome back notification for returning visitors */}
      <WelcomeBack />
      
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr_200px]">
          {/* Left Sidebar - Desktop only */}
          <aside className="hidden lg:flex lg:items-start lg:justify-center lg:pt-20">
            <div className="sticky top-20">
              <SidebarAd variant="vertical" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <Header />

              {/* Stats Bar */}
              <div className="px-4 pb-4 md:px-6">
                <StatsBar />
              </div>

              <main className="px-4 pb-10 md:px-6">
                <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-violet-50/80 px-5 py-5 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 shadow-lg shadow-indigo-300/40">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold tracking-tight text-slate-800">内申点を入力</div>
                    <div className="text-sm text-slate-500">各教科の成績をスライダーで選択</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 via-blue-50/80 to-violet-50/90 px-5 py-3 shadow-sm backdrop-blur-sm">
                  <div className="text-sm font-bold text-indigo-700">{modeInfo.label}</div>
                  <div className="mt-0.5 text-xs text-indigo-600/70">満点：{modeInfo.max}点</div>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6">

            <div className="mt-4">
              <RegionSwitch mode={mode} onChange={setMode} />
            </div>

            <div className="mt-5">
              <InputForm mode={mode} scores={scores} onChange={onScoreChange} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button onClick={onReveal} leftIcon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto shadow-md shadow-blue-500/20">
                結果を見る
              </Button>
              <Button
                variant="secondary"
                onClick={onReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                リセット
              </Button>
            </div>
            </div>
          </Card>

          {showResult && (
              <section
                id="result"
                className="space-y-4"
              >
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
                          <div className="mt-2 text-sm text-slate-500">{modeInfo.description}</div>
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                        <Button
                          onClick={() => setShareOpen(true)}
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
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <div className="text-xs font-bold text-slate-700">メモ（任意）</div>
                        <input
                          value={saveMemo}
                          onChange={(e) => setSaveMemo(e.target.value)}
                          disabled={!saveEnabled}
                          placeholder="例：1学期中間、模試前 など"
                          className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      </div>
                      <Button variant="secondary" onClick={onSaveNow} disabled={!saveEnabled} className="h-11 w-full md:w-auto">
                        保存
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

                <ComparisonCard result={result} scores={scores} saveEnabled={saveEnabled} lastSavedId={lastSaved?.id} />

                <ReasoningCard result={result} scores={scores} />

                <RankCard result={result} />

                {/* 今日の名言 */}
                <DailyQuoteCard />

                {/* 動機付けメッセージ */}
                <MotivationCard result={result} />

                {/* レーダーチャート */}
                <RadarChart scores={scores} mode={mode} />

                {/* 学習ストリーク */}
                <StudyStreakCard />

                {/* 達成バッジ */}
                <AchievementBadges scores={scores} result={result} />

                {/* 成績推移グラフ */}
                <ScoreProgressChart 
                  currentTotal={result.total} 
                  currentMax={result.max} 
                  currentMode={mode} 
                />

                {/* 教科別変化 */}
                <SubjectImprovementCard currentScores={scores} />

                {/* 勉強アドバイス */}
                <StudyAdvice scores={scores} result={result} />

                {/* マイ目標 */}
                <PersonalGoalCard />

                {/* クイック勉強タイマー */}
                <QuickStudyTimer />

                {/* 教科別分析 */}
                <SubjectBreakdown scores={scores} mode={mode} />

                {/* 目標設定 */}
                <GoalSection currentScore={result.total} maxScore={result.max} />

                {/* 広告（結果後） */}
                <AdPlaceholder />

              </section>
            )}

          {/* 📚 ブログセクション - 目立つ位置に配置 */}
          <BlogSection />

          {/* 計算履歴 */}
          <HistoryPanel onLoadEntry={onLoadHistory} />

          {/* ヒント・FAQ セクション */}
          <TipsSection />
        </div>
      </main>

      {/* フッター上広告 */}
      <div className="px-4 pb-6 md:px-6">
        <AdPlaceholder />
      </div>

      <Footer />
            </div>
          </div>

          {/* Right Sidebar - Desktop only */}
          <aside className="hidden lg:flex lg:items-start lg:justify-center lg:pt-20">
            <div className="sticky top-20">
              <SidebarAd variant="vertical" />
            </div>
          </aside>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        result={result}
        scores={scores}
        shareUrl={shareUrl}
      />
    </div>
  );
}
