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
    slug: 'naishinten-calculation-by-prefecture',
    title: '【完全保存版】内申点の計算方法を都道府県別に徹底解説！',
    category: '内申点の基礎',
  },
  {
    slug: 'tokyo-kansan-naishin-guide',
    title: '【東京都】換算内申の計算方法と都立高校入試の完全ガイド',
    category: '都道府県別対策',
  },
  {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？',
    category: '内申点の基礎',
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
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-lg shadow-amber-300/40">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-800">都道府県別の制度を理解</div>
              <div className="text-sm text-slate-500">計算方法や特徴を詳しく解説</div>
            </div>
          </div>
        </div>
        <div className="p-5 md:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">地域から選ぶ</h3>
              <div className="grid gap-2">
                {LEARN_REGIONS.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedRegion === region.name
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-medium text-slate-800">{region.name}</div>
                    <div className="text-sm text-slate-500">{region.codes.length}都道府県</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedRegion && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {selectedRegion}の都道府県
                </h3>
                <div className="grid gap-2">
                  {LEARN_REGIONS.find(r => r.name === selectedRegion)?.codes.map((code) => {
                    const prefecture = getPrefectureByCode(code);
                    return prefecture ? (
                      <Link
                        key={code}
                        href={`/${code}/naishin`}
                        className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-800">{prefecture.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">人気の記事</h3>
              <div className="space-y-2">
                {LEARN_POPULAR_ARTICLES.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{article.title}</div>
                      <div className="text-sm text-slate-500">{article.category}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 制度理解のポイント</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 内申点の計算方法は都道府県で異なります</li>
                  <li>• 中1・中2の成績が影響する地域と中3のみの地域があります</li>
                  <li>• 実技4教科の配点が高い地域が多いです</li>
                  <li>• 最新の入試情報は各都道府県教育委員会で確認しましょう</li>
                </ul>
              </div>
            </div>
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

export default function Page() {
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
  }, []);

  const max = React.useMemo(
    () => calculateMaxScore(prefectureCode, use10PointScale),
    [prefectureCode, use10PointScale]
  );
  const total = React.useMemo(
    () => calculateTotalScore(scores, prefectureCode, use10PointScale),
    [scores, prefectureCode, use10PointScale]
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
              </div>

              {/* 3ステップガイド */}
              <ThreeStepGuide />

              {/* Stats Bar */}
              <div className="px-4 pb-4 md:px-6">
                <StatsBar />
              </div>

              {/* 3導線ナビゲーション */}
              <HeroNavigation onModeChange={setNavigationMode} currentMode={navigationMode} />

              {/* Blog Section */}
              <div className="px-4 pb-10 md:px-6">
                <BlogSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
