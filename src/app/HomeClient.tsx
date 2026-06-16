'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Calculator, ChevronRight, TrendingUp as TrendingUpIcon } from 'lucide-react';

import { DEFAULT_SCORES } from '@/lib/constants';
import { getPrefectureByCode, DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import {
  appendHistoryEntry,
  getSaveConsent,
  readHistory,
  setSaveConsent,
  readSavedGoal,
  type SavedGoal,
} from '@/lib/persistence';
import { buildParentShareUrl, buildParentShareMessage } from '@/lib/share';
import type { ResultData, SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';
import {
  calculateMaxScore,
  calculatePercent,
  calculateTotalScore,
  getRankForPercent,
  updateScoreValue
} from '@/lib/utils';
import { track, EVENTS } from '@/lib/track';

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
import Loader from '@/components/ui/Loader';
import { HistoryPanel } from '@/components/HistoryPanel';
import { BlogSection } from '@/components/BlogSection';
import { NaishinGuideSection } from '@/components/NaishinGuideSection';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ThreeStepGuide } from '@/components/ThreeStepGuide';

const SECTION_LOADER = (
  <div
    className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white"
    aria-busy="true"
  >
    <Loader variant="inline" message="セクションを準備しています..." />
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

async function popConfetti() {
  // 動的 import で canvas-confetti を初期バンドルから外す（演出時のみ読み込む）。
  const confetti = (await import('canvas-confetti')).default;
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
  const [shareText, setShareText] = React.useState('');
  const [navigationMode, setNavigationMode] = React.useState<NavigationMode>('select');
  const [saveEnabled, setSaveEnabled] = React.useState(true);
  const [saveMemo, setSaveMemo] = React.useState('');
  const [lastSaved, setLastSaved] = React.useState<SavedHistoryEntry | null>(null);
  const [savedGoal, setSavedGoal] = React.useState<SavedGoal | null>(null);

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
    const sg = readSavedGoal();
    setSavedGoal(sg);
    // 再訪導線が点灯する＝保存済み目標を持つリピーターが戻ってきた。継続接点のKPIとして一度だけ計測。
    if (sg) {
      track(EVENTS.SAVED_GOAL_REVISIT, { pref: sg.prefectureCode ?? 'none', gap: sg.gap });
    }

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

  // 換金ファネルの分母：ホームで結果が初めて表示された時点で1回だけ result_view を計測
  const resultViewedRef = React.useRef(false);
  React.useEffect(() => {
    if (showResult && !resultViewedRef.current) {
      resultViewedRef.current = true;
      track('result_view', { source: 'home', pref: prefectureCode });
    }
  }, [showResult, prefectureCode]);

  // 橋②（生徒→保護者バトン）：共有を開く瞬間に、結果＋保存済み目標を載せた
  // 「保護者最適化ページ（/hogosha）」への文脈付きURLとメッセージを組む。
  // これで決裁者（保護者）が、画像ではなくオファー（資料請求/無料体験）に着地する。
  const openShare = React.useCallback(() => {
    const goal = readSavedGoal();
    const matched = goal && goal.prefectureCode === prefectureCode ? goal : null;
    const ctx = {
      prefectureCode,
      prefectureName: selectedPrefecture?.name,
      score: result.total,
      max: result.max,
      target: matched?.target ?? null,
      gap: matched?.gap ?? null,
      label: matched?.targetLabel,
    };
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    setShareUrl(buildParentShareUrl(origin, ctx));
    setShareText(buildParentShareMessage(ctx));
    setShareOpen(true);
  }, [prefectureCode, selectedPrefecture, result.total, result.max]);

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

              {/* 堀A（再訪導線）：保存した目標があれば「前回の続き＝あと◯点」を出し、使い捨てを再訪に変える */}
              {savedGoal && (
                <div className="px-4 pb-4 md:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (savedGoal.prefectureCode) setPrefectureCode(savedGoal.prefectureCode);
                      setNavigationMode('calculate');
                      window.setTimeout(() => {
                        document
                          .getElementById('calculator')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 80);
                    }}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 px-5 py-4 text-left transition-all hover:border-indigo-400 hover:shadow-md"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                        <TrendingUpIcon className="h-4 w-4 shrink-0" />
                        おかえりなさい！前回の続きから
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-indigo-700">
                        {savedGoal.gap > 0
                          ? `${savedGoal.targetLabel ?? '目標'}まであと ${savedGoal.gap}点（前回の内申 ${savedGoal.score}）`
                          : `${savedGoal.targetLabel ?? '目標'}に到達（前回の内申 ${savedGoal.score}）。今の成績で再チェック`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all group-hover:bg-indigo-700">
                      続ける
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                </div>
              )}

              {/* ファーストビューのZ会CTA：select画面のみ。EPC50+の最優先素材を上部に露出 */}
              {navigationMode === 'select' && (
                <div className="px-4 pb-3 md:px-6">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-4 py-2.5 text-center text-xs text-slate-600 md:text-sm">
                    <span>内申点アップに通信教育という選択肢。</span>
                    <AffiliateAd id="zkai-text-middle" hideLabel auditHide />
                    <span className="text-slate-400">/</span>
                    <AffiliateAd id="zkai-text-request" hideLabel auditHide />
                    <span className="text-[10px] text-slate-400">[PR]</span>
                  </div>
                </div>
              )}

              {/* 人気急上昇ツール バナー（select画面のみ・/hensachi /hyotei-heikin /tokyo/total-scoreへの強誘導） */}
              {navigationMode === 'select' && (
                <div className="px-4 pb-4 md:px-6">
                  <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-md">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">
                        🔥 急上昇
                      </span>
                      <span className="text-xs font-bold text-amber-900">今、最も検索されている計算ツール</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Link
                        href="/hyotei-heikin"
                        className="group flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600">評定平均 自動計算</div>
                          <div className="text-[11px] text-slate-500">通知表から評定平均と素内申を一括算出</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/hensachi"
                        className="group flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                          <TrendingUpIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 group-hover:text-purple-600">偏差値計算（5教科）</div>
                          <div className="text-[11px] text-slate-500">点数と平均点から偏差値を瞬時に算出</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-purple-500 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/tokyo/total-score"
                        className="group flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600">都立 総合得点 計算（1020点）</div>
                          <div className="text-[11px] text-slate-500">学力検査・調査書・ESAT-Jを一括算出</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-blue-500 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 保護者導線（select画面のみ）：本命の換金クラスタ＝学費・お金のツールへ。
                  保護者＝決裁者の最大関心はお金。最大流入面（ホーム）から高CPAの学費ハブへ評価と人を流す。 */}
              {navigationMode === 'select' && (
                <div className="px-4 pb-4 md:px-6">
                  <Link
                    href="/hiyou"
                    className="group flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 text-white shadow-sm">
                      <span className="text-lg font-black">¥</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                        保護者の方へ｜教育費・学費・塾代のシミュレーター
                      </div>
                      <div className="text-[11px] text-slate-500">
                        高校〜大学の費用・高校無償化・就学支援金を文科省データで無料試算
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-indigo-500 transition-transform group-hover:translate-x-1" />
                  </Link>
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
                          onShareOpen={openShare}
                        />
                      )}

                      {/* 結果直後（＝最も志望校との距離が気になる瞬間）の保護者リード導線。審査中は休眠 */}
                      {showResult && (
                        <div className="mt-6">
                          <ParentLeadCTA
                            auditHide
                            heading="この結果、志望校の合格ラインに届いていますか？"
                            body="内申点は「今からの動き方」で十分に変えられます。お子さまに必要な対策を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
                            affiliateId="atama-text"
                            ctaText="無料で資料・体験を申し込む"
                            note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
                          />
                        </div>
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
          shareText={shareText}
        />
      )}
    </div>
  );
}
