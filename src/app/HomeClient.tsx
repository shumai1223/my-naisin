'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw } from 'lucide-react';

import { DEFAULT_SCORES } from '@/lib/constants';
import { getPrefectureByCode, DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { appendHistoryEntry, getSaveConsent, readHistory, setSaveConsent } from '@/lib/persistence';
import type { ResultData, SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';
import {
  calculateMaxScore,
  calculatePercent,
  calculateTotalScore,
  getRankForPercent,
  updateScoreValue
} from '@/lib/utils';

import { Header } from '@/components/Header';
import { HeroNavigation, NavigationMode } from '@/components/HeroNavigation';
import { TipsSection } from '@/components/TipsSection';
import { StatsBar } from '@/components/StatsBar';
import { InputForm } from '@/components/Calculator/InputForm';
import { PrefectureSelector } from '@/components/Calculator/PrefectureSelector';
import { ReverseCalculator } from '@/components/Calculator/ReverseCalculator';
import { ResultSection } from '@/components/ResultSection';
import { ChangeLogSection } from '@/components/ChangeLogSection';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HistoryPanel } from '@/components/HistoryPanel';
import { BlogSection } from '@/components/BlogSection';
import { NaishinGuideSection } from '@/components/NaishinGuideSection';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ThreeStepGuide } from '@/components/ThreeStepGuide';

const SECTION_LOADER = (
  <div
    className="flex h-32 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-400"
    aria-busy="true"
  >
    読み込み中...
  </div>
);

const TokyoExtendedCalculator = dynamic(
  () =>
    import('@/components/Calculator/TokyoExtendedCalculator').then((m) => ({
      default: m.TokyoExtendedCalculator
    })),
  { ssr: false, loading: () => SECTION_LOADER }
);

const HomeLearnSection = dynamic(
  () => import('@/components/HomeLearnSection').then((m) => ({ default: m.HomeLearnSection })),
  { ssr: false, loading: () => SECTION_LOADER }
);

const ShareModal = dynamic(
  () => import('@/components/Result/ShareModal').then((m) => ({ default: m.ShareModal })),
  { ssr: false }
);

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

function scoresDifferFromDefault(scores: Scores): boolean {
  return (Object.keys(scores) as SubjectKey[]).some((key) => scores[key] !== DEFAULT_SCORES[key]);
}

export default function HomeClient() {
  const [prefectureCode, setPrefectureCode] = React.useState<string>(DEFAULT_PREFECTURE_CODE);
  const [use10PointScale, setUse10PointScale] = React.useState(false);
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [showResult, setShowResult] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [navigationMode, setNavigationMode] = React.useState<NavigationMode>('select');
  const [saveEnabled, setSaveEnabled] = React.useState(true);
  const [saveMemo, setSaveMemo] = React.useState('');
  const [lastSaved, setLastSaved] = React.useState<SavedHistoryEntry | null>(null);

  const selectedPrefecture = React.useMemo(
    () => getPrefectureByCode(prefectureCode),
    [prefectureCode]
  );

  const maxGrade = use10PointScale && selectedPrefecture?.supports10PointScale ? 10 : 5;

  React.useEffect(() => {
    setShareUrl(window.location.origin);
  }, []);

  React.useEffect(() => {
    setSaveEnabled(getSaveConsent());

    let restoredScores: Scores | null = null;
    let restoredPrefecture: string | null = null;
    try {
      const savedScores = window.localStorage.getItem('my-naishin:scores');
      const savedPrefecture = window.localStorage.getItem('my-naishin:prefecture');
      if (savedScores) {
        const parsed = JSON.parse(savedScores) as Partial<Record<SubjectKey, unknown>>;
        const next: Scores = { ...DEFAULT_SCORES };
        (Object.keys(next) as SubjectKey[]).forEach((key) => {
          const raw = parsed?.[key];
          const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
          if (!Number.isFinite(n)) return;
          next[key] = Math.min(5, Math.max(1, Math.round(n)));
        });
        restoredScores = next;
        setScores(next);
      }
      if (savedPrefecture) {
        restoredPrefecture = savedPrefecture;
        setPrefectureCode(savedPrefecture);
      }
    } catch {
      // ignore
    }

    const history = readHistory();
    setLastSaved(history[0] ?? null);

    // 履歴があり、かつ scores が初期値から変更されている場合のみ計算モードに遷移。
    // 初回ユーザーや空の入力では「目的を選ぶ」画面を維持して、空の結果画面を防ぐ。
    const hasMeaningfulHistory =
      history.length > 0 && (restoredScores ? scoresDifferFromDefault(restoredScores) : false);
    if (hasMeaningfulHistory) {
      setNavigationMode('calculate');
    }
    // 自動で showResult=true にはしない（結果はユーザーが「結果を見る」を押すと表示）
    // restoredPrefecture は副作用ですでに反映済み
    void restoredPrefecture;
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('my-naishin:scores', JSON.stringify(scores));
      window.localStorage.setItem('my-naishin:prefecture', prefectureCode);
    } catch {
      // ignore
    }
  }, [scores, prefectureCode]);

  const total = React.useMemo(
    () => calculateTotalScore(scores, prefectureCode, use10PointScale),
    [scores, prefectureCode, use10PointScale]
  );
  const max = React.useMemo(
    () => calculateMaxScore(prefectureCode, use10PointScale),
    [prefectureCode, use10PointScale]
  );
  const percent = React.useMemo(() => calculatePercent(total, max), [total, max]);
  const rank = React.useMemo(() => getRankForPercent(percent), [percent]);

  const result: ResultData = React.useMemo(
    () => ({
      prefectureCode,
      total,
      max,
      percent,
      rank
    }),
    [prefectureCode, total, max, percent, rank]
  );

  React.useEffect(() => {
    if (!showResult || typeof window === 'undefined') return;
    if (prefectureCode === 'tokyo') {
      window.localStorage.setItem('my-naishin:tokyo-kanso', String(result.total));
    }
    if (prefectureCode === 'kanagawa') {
      window.localStorage.setItem('my-naishin:kanagawa-A', String(result.total));
    }
  }, [prefectureCode, result.total, showResult]);

  const onScoreChange = React.useCallback((key: SubjectKey, nextValue: number) => {
    setScores((prev) => updateScoreValue(prev, key, nextValue));
  }, []);

  const onSaveEnabledChange = React.useCallback(
    (checked: boolean) => {
      setSaveEnabled(checked);
      setSaveConsent(checked);

      if (checked && showResult) {
        const entry = appendHistoryEntry({ scores, memo: saveMemo, prefectureCode });
        if (entry) setLastSaved(entry);
      }
    },
    [prefectureCode, saveMemo, scores, showResult]
  );

  const onSaveNow = React.useCallback(() => {
    if (!saveEnabled) return;
    const entry = appendHistoryEntry({ scores, memo: saveMemo, prefectureCode });
    if (entry) setLastSaved(entry);
  }, [prefectureCode, saveEnabled, saveMemo, scores]);

  const onReveal = React.useCallback(() => {
    setShowResult(true);

    if (saveEnabled) {
      const entry = appendHistoryEntry({ scores, memo: saveMemo, prefectureCode });
      if (entry) setLastSaved(entry);
    }

    window.setTimeout(() => {
      popConfetti();
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [prefectureCode, saveEnabled, saveMemo, scores]);

  const onReset = React.useCallback(() => {
    setScores(DEFAULT_SCORES);
    setShowResult(false);
    window.setTimeout(() => {
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  const onLoadHistory = React.useCallback((entry: SavedHistoryEntry) => {
    if (entry.prefectureCode) {
      setPrefectureCode(entry.prefectureCode);
    }
    setScores(entry.scores);
    setShowResult(true);
    window.setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  return (
    <div id="top" className="min-h-screen">
      <WebApplicationSchema
        name="内申点シミュレーター | My Naishin"
        description="全国47都道府県の内申点計算に対応。成績を入力するだけで内申点を自動計算。志望校からの逆算機能つき。"
        url="https://my-naishin.com"
      />
      <BreadcrumbSchema items={[{ name: 'ホーム', url: 'https://my-naishin.com/' }]} />
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <Header />
              <div className="px-4 pb-4 md:px-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  2026年度入試対応（令和8年度入学者選抜）
                </div>
                <ThreeStepGuide />
              </div>

              <div className="px-4 pb-4 md:px-6">
                <StatsBar />
              </div>

              {/* ファーストビューのZ会CTA：select画面のみ。EPC50+の最優先素材を上部に露出 */}
              {navigationMode === 'select' && (
                <div className="px-4 pb-3 md:px-6">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-4 py-2.5 text-center text-xs text-slate-600 md:text-sm">
                    <span>内申点アップに通信教育という選択肢。</span>
                    <AffiliateAd id="zkai-text-middle" hideLabel />
                    <span className="text-slate-400">/</span>
                    <AffiliateAd id="zkai-text-request" hideLabel />
                    <span className="text-[10px] text-slate-400">[PR]</span>
                  </div>
                </div>
              )}

              <HeroNavigation onModeChange={setNavigationMode} currentMode={navigationMode} />

              <main id="calculator" className="px-4 pb-10 md:px-6">
                <div className="space-y-6">
                  {navigationMode === 'reverse' && (
                    <ReverseCalculator onBack={() => setNavigationMode('select')} />
                  )}

                  {navigationMode === 'learn' && (
                    <HomeLearnSection onBack={() => setNavigationMode('select')} />
                  )}

                  {navigationMode === 'calculate' && (
                    <>
                      <Card className="overflow-hidden">
                        <div className="border-b border-slate-100/80 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-violet-50/80 px-5 py-5 md:px-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 shadow-lg shadow-indigo-300/40">
                                <ArrowRight className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="text-xl font-bold tracking-tight text-slate-800">内申点を入力</div>
                                <div className="text-sm text-slate-500">スライダーまたは数値入力で成績を選択</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setNavigationMode('select')}
                                className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                              >
                                目的を変更
                              </button>
                              <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 via-blue-50/80 to-violet-50/90 px-5 py-3 shadow-sm backdrop-blur-sm">
                                <div className="text-sm font-bold text-indigo-700">
                                  {selectedPrefecture?.name ?? '都道府県を選択'}
                                </div>
                                <div className="mt-0.5 text-xs text-indigo-600/70">満点：{max}点</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 md:p-6">
                          <div className="mt-4">
                            <PrefectureSelector
                              selectedCode={prefectureCode}
                              onChange={setPrefectureCode}
                              use10PointScale={use10PointScale}
                              onScale10Change={setUse10PointScale}
                            />
                          </div>

                          <div className="mt-5">
                            <InputForm
                              prefectureCode={prefectureCode}
                              scores={scores}
                              onChange={onScoreChange}
                              maxGrade={maxGrade}
                            />
                          </div>

                          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                              onClick={onReveal}
                              leftIcon={<ArrowRight className="h-4 w-4" />}
                              className="w-full sm:w-auto shadow-md shadow-blue-500/20"
                            >
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

                      {/* 東京都専用：ESAT-J入力（結果表示時のみマウント） */}
                      {showResult && prefectureCode === 'tokyo' && (
                        <TokyoExtendedCalculator kansoNaishin={result.total} />
                      )}

                      {showResult && (
                        <ResultSection
                          result={result}
                          scores={scores}
                          prefectureCode={prefectureCode}
                          selectedPrefecture={selectedPrefecture}
                          saveEnabled={saveEnabled}
                          onSaveEnabledChange={onSaveEnabledChange}
                          saveMemo={saveMemo}
                          onSaveMemoChange={setSaveMemo}
                          onSaveNow={onSaveNow}
                          lastSaved={lastSaved}
                          onShareOpen={() => setShareOpen(true)}
                        />
                      )}
                    </>
                  )}

                  {navigationMode === 'calculate' && <HistoryPanel onLoadEntry={onLoadHistory} />}

                  <TipsSection />

                  <BlogSection />
                </div>
              </main>

              <div className="mx-auto max-w-4xl px-4 pb-8">
                <NaishinGuideSection />
              </div>

              <div className="mx-auto max-w-4xl px-4 pb-8">
                <ChangeLogSection limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {shareOpen && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          result={result}
          scores={scores}
          shareUrl={shareUrl}
        />
      )}
    </div>
  );
}
