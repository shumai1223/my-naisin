'use client';

import * as React from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Share2, BookOpen, ChevronRight, ArrowLeft, MapPin, FileText, ExternalLink } from 'lucide-react';

import { DEFAULT_SCORES } from '@/lib/constants';
import { getPrefectureByCode, DEFAULT_PREFECTURE_CODE, PREFECTURES } from '@/lib/prefectures';
import { appendHistoryEntry, getSaveConsent, readHistory, setSaveConsent } from '@/lib/persistence';
import type { ResultData, SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';
import {
  calculateMaxScore,
  calculatePercent,
  calculateTotalScore,
  getRankForPercent,
  updateScoreValue
} from '@/lib/utils';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroNavigation, NavigationMode } from '@/components/HeroNavigation';
import { TipsSection } from '@/components/TipsSection';
import { StatsBar } from '@/components/StatsBar';
import { GoalSection } from '@/components/GoalSection';
import { SubjectBreakdown } from '@/components/SubjectBreakdown';
import { InputForm } from '@/components/Calculator/InputForm';
import { PrefectureSelector } from '@/components/Calculator/PrefectureSelector';
import { ReverseCalculator } from '@/components/Calculator/ReverseCalculator';
import { CalculationBasis } from '@/components/Result/CalculationBasis';
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
import { ScoreImprovementAnalysis } from '@/components/Result/ScoreImprovementAnalysis';
import { ChangeLogSection } from '@/components/ChangeLogSection';
import { SubjectImprovementCard } from '@/components/Result/SubjectImprovementCard';
import { PersonalGoalCard } from '@/components/Result/PersonalGoalCard';
import { PointValueCard } from '@/components/Result/PointValueCard';
import { QuickStudyTimer } from '@/components/Result/QuickStudyTimer';
import { DailyQuoteCard } from '@/components/Result/DailyQuoteCard';
import { ImprovementAdvisor } from '@/components/Result/ImprovementAdvisor';
import { PrefectureComparison } from '@/components/Result/PrefectureComparison';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { HistoryPanel } from '@/components/HistoryPanel';
import { PrintButton } from '@/components/PrintButton';
import { BlogSection } from '@/components/BlogSection';
import { NaishinGuideSection } from '@/components/NaishinGuideSection';
import { TokyoExtendedCalculator } from '@/components/Calculator/TokyoExtendedCalculator';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ThreeStepGuide } from '@/components/ThreeStepGuide';

const LEARN_REGIONS = [
  { name: '北海道・東北', codes: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] },
  { name: '関東', codes: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'] },
  { name: '中部', codes: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi'] },
  { name: '近畿', codes: ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'] },
  { name: '中国・四国', codes: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima', 'kagawa', 'ehime', 'kochi'] },
  { name: '九州・沖縄', codes: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'] },
];

const LEARN_POPULAR_ARTICLES = [
  {
    slug: 'naishin-guide',
    title: '内申点の基本から都道府県別対策まで完全ガイド',
    category: '基本を理解して対策を立てよう',
  },
  {
    slug: 'tokyo-kansan-naishin-guide',
    title: '【東京都】換算内申の計算方法と都立高校入試の完全ガイド',
    category: '東京都特有の計算方法を解説',
  },
  {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？',
    category: '違いを理解して活用しよう',
  },
];

interface LearnSectionProps {
  onBack: () => void;
}

function LearnSection({ onBack }: LearnSectionProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100/80 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 px-5 py-5 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-amber-300/40">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-800">制度を理解する</div>
                <div className="text-sm text-slate-500">都道府県別の計算方法・コラム</div>
              </div>
            </div>
            <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              戻る
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <MapPin className="h-5 w-5 text-amber-500" />
              都道府県から探す
            </h3>
            <div className="flex flex-wrap gap-2">
              {LEARN_REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedRegion === region.name
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            {selectedRegion && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {LEARN_REGIONS.find((r) => r.name === selectedRegion)?.codes.map((code) => {
                    const pref = PREFECTURES.find((p) => p.code === code);
                    if (!pref) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${code}/naishin`}
                        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-amber-50 hover:shadow-md"
                      >
                        <span>{pref.name}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <FileText className="h-5 w-5 text-blue-500" />
              人気のコラム
            </h3>
            <div className="space-y-2">
              {LEARN_POPULAR_ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
                >
                  <div>
                    <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {article.category}
                    </span>
                    <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{article.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              すべてのコラムを見る
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
            <h3 className="mb-2 text-base font-bold text-emerald-800">📌 ポイント</h3>
            <ul className="space-y-2 text-sm text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                内申点の計算方法は都道府県によって大きく異なります
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                実技4教科の配点が高い地域が多いです
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                最新の入試情報は各都道府県教育委員会で確認しましょう
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

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

  const maxGrade = (use10PointScale && selectedPrefecture?.supports10PointScale) ? 10 : 5;

  React.useEffect(() => {
    setShareUrl(window.location.origin);
  }, []);

  React.useEffect(() => {
    setSaveEnabled(getSaveConsent());
    const history = readHistory();
    setLastSaved(history[0] ?? null);
    
    // 履歴がある場合は自動的に計算モードで結果を表示
    if (history.length > 0) {
      setNavigationMode('calculate');
      setShowResult(true);
    }
  }, []);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem('my-naishin:scores');
      const savedPrefecture = window.localStorage.getItem('my-naishin:prefecture');
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
      if (savedPrefecture) {
        setPrefectureCode(savedPrefecture);
      }
    } catch {
      // ignore
    }
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
          {/* Main Content */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <Header />

          <div className="px-4 pb-4 md:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              2026年度入試対応（令和8年度入学者選抜）
            </div>

            {/* 3ステップガイド */}
            <ThreeStepGuide />
          </div>

              {/* Stats Bar */}
              <div className="px-4 pb-4 md:px-6">
                <StatsBar />
              </div>

              {/* 3導線ナビゲーション */}
              <HeroNavigation onModeChange={setNavigationMode} currentMode={navigationMode} />

              <main id="calculator" className="px-4 pb-10 md:px-6">
                <div className="space-y-6">

          {/* 逆算モード */}
          {navigationMode === 'reverse' && (
            <ReverseCalculator onBack={() => setNavigationMode('select')} />
          )}

          {/* 制度理解モード */}
          {navigationMode === 'learn' && (
            <LearnSection onBack={() => setNavigationMode('select')} />
          )}

          {/* 計算モード */}
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
              <InputForm prefectureCode={prefectureCode} scores={scores} onChange={onScoreChange} maxGrade={maxGrade} />
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

          {/* 東京都専用：ESAT-J入力（結果表示前・後両方で表示） */}
          {prefectureCode === 'tokyo' && (
            <TokyoExtendedCalculator kansoNaishin={result.total} />
          )}

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
                          <div className="mt-2 text-sm text-slate-500">
                            {selectedPrefecture?.description ?? '9教科 × 5点 = 45点満点'}
                          </div>
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

                <RankCard result={result} />

                {/* 1点アップの価値 */}
                <PointValueCard scores={scores} prefectureCode={prefectureCode} />

                {/* 計算根拠表示 */}
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
                          onChange={(e) => setSaveMemo(e.target.value)}
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

                {/* 成績推移グラフ */}
                <ScoreProgressChart 
                  currentTotal={result.total} 
                  currentMax={result.max} 
                  currentPrefecture={prefectureCode} 
                />

                {/* 現在の都道府県への導線 */}
                <Card className="overflow-hidden">
                  <div className="border-b border-slate-100/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-violet-50/80 px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-bold text-slate-800">📍 {getPrefectureByCode(prefectureCode)?.name}の詳しい情報</div>
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

                {/* 成績分析・改善提案 */}
                <ScoreImprovementAnalysis 
                  currentScores={scores} 
                  prefectureCode={prefectureCode} 
                />

                <ComparisonCard result={result} scores={scores} saveEnabled={saveEnabled} lastSavedId={lastSaved?.id} />

                <ReasoningCard result={result} scores={scores} />

                {/* 今日の名言 */}
                <DailyQuoteCard />

                {/* 動機付けメッセージ */}
                <MotivationCard result={result} />

                {/* レーダーチャート */}
                <RadarChart scores={scores} prefectureCode={prefectureCode} />

                {/* 達成バッジ */}
                <AchievementBadges scores={scores} result={result} />

                {/* 教科別変化 */}
                <SubjectImprovementCard currentScores={scores} />

                {/* 成績アップ優先度アドバイス */}
                <ImprovementAdvisor scores={scores} prefectureCode={prefectureCode} />

                {/* 都道府県別スコア比較 */}
                <PrefectureComparison scores={scores} currentPrefectureCode={prefectureCode} />

                {/* 勉強アドバイス */}
                <StudyAdvice scores={scores} result={result} />

                {/* マイ目標 */}
                <PersonalGoalCard />

                {/* クイック勉強タイマー */}
                <QuickStudyTimer />

                {/* 教科別分析 */}
                <SubjectBreakdown scores={scores} prefectureCode={prefectureCode} />

                {/* 目標設定 */}
                <GoalSection currentScore={result.total} maxScore={result.max} />

              </section>
            )}
          </>
          )}

          {/* 計算履歴 - 計算モードのみ表示 */}
          {navigationMode === 'calculate' && (
          <HistoryPanel onLoadEntry={onLoadHistory} />
          )}

          {/* ヒント・FAQ セクション */}
          <TipsSection />

          {/* 📚 ブログセクション */}
          <BlogSection />
        </div>
      </main>

      {/* 内申点ガイドセクション - SEO対策用コンテンツ */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <NaishinGuideSection />
      </div>

      {/* 更新履歴 - E-E-A-T対応 */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <ChangeLogSection limit={5} />
      </div>

      <Footer />
            </div>
          </div>

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
