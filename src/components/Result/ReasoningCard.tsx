'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, BookOpen, Trophy, ListChecks, ChevronRight, Info } from 'lucide-react';

import { MODE_CONFIG, RANK_DEFINITIONS, SUBJECTS } from '@/lib/constants';
import type { ResultData, Scores } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Card } from '@/components/ui/Card';

export interface ReasoningCardProps {
  result: ResultData;
  scores: Scores;
}

type TabId = 'formula' | 'rank' | 'breakdown';

interface TabConfig {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: 'formula', label: '計算式・方式', shortLabel: '計算式', icon: <Calculator className="h-4 w-4" /> },
  { id: 'rank', label: 'ランク基準', shortLabel: 'ランク', icon: <Trophy className="h-4 w-4" /> },
  { id: 'breakdown', label: '教科別内訳', shortLabel: '内訳', icon: <ListChecks className="h-4 w-4" /> }
];

export function ReasoningCard({ result, scores }: ReasoningCardProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>('formula');
  const weights = MODE_CONFIG[result.mode].weights;

  const breakdown = React.useMemo(() => {
    return SUBJECTS.map((subject) => {
      const raw = scores[subject.key];
      const safe = Math.min(5, Math.max(1, Math.round(raw)));
      const weight = subject.category === 'core' ? weights.core : weights.practical;
      return {
        key: subject.key,
        label: subject.label,
        category: subject.category,
        score: safe,
        weight,
        points: safe * weight
      };
    });
  }, [scores, weights.core, weights.practical]);

  const totalComputed = React.useMemo(() => breakdown.reduce((sum, row) => sum + row.points, 0), [breakdown]);

  const minPossibleTotal = React.useMemo(() => {
    return SUBJECTS.reduce((sum, subject) => {
      const weight = subject.category === 'core' ? weights.core : weights.practical;
      return sum + 1 * weight;
    }, 0);
  }, [weights.core, weights.practical]);

  const modeLabel = result.mode === 'tokyo' ? '東京都方式' : '標準方式';

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-200">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">計算の根拠</h3>
            <p className="mt-0.5 text-sm text-slate-600">スコアがどのように計算されたかを確認できます</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-100 bg-white px-4 sm:px-6">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="計算根拠タブ">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'group relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors',
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                )}
                aria-selected={isActive}
                role="tab"
              >
                <span className={cn(
                  'grid h-8 w-8 place-items-center rounded-xl transition-colors',
                  isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                )}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="reasoning-tab-indicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'formula' && (
            <motion.div
              key="formula"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Mode Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-200">
                <Calculator className="h-4 w-4" />
                {modeLabel}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Formula Card */}
                <div className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-blue-800">
                    <ChevronRight className="h-4 w-4" />
                    計算式
                  </div>
                  <div className="mt-3 rounded-xl bg-white/80 p-4 font-mono text-sm font-semibold text-slate-800 shadow-sm">
                    {result.mode === 'tokyo' ? (
                      <>
                        <div>合計 = (5教科 × 1)</div>
                        <div className="mt-1 pl-8">+ (実技4教科 × 2)</div>
                      </>
                    ) : (
                      <div>合計 = (9教科 × 1)</div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                      <span className="text-xs font-medium text-slate-600">満点</span>
                      <span className="text-sm font-black text-slate-800">{result.max}点</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                      <span className="text-xs font-medium text-slate-600">5教科の重み</span>
                      <span className="text-sm font-bold text-slate-800">× {weights.core}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                      <span className="text-xs font-medium text-slate-600">実技4教科の重み</span>
                      <span className="text-sm font-bold text-slate-800">× {weights.practical}</span>
                    </div>
                  </div>
                </div>

                {/* Percent Formula Card */}
                <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-emerald-800">
                    <ChevronRight className="h-4 w-4" />
                    達成率の計算
                  </div>
                  <div className="mt-3 rounded-xl bg-white/80 p-4 font-mono text-sm font-semibold text-slate-800 shadow-sm">
                    達成率 = floor(合計 ÷ 満点 × 100)
                  </div>
                  <div className="mt-4 rounded-xl bg-white/60 p-4">
                    <div className="text-xs font-medium text-slate-600">あなたの計算:</div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="font-mono font-bold text-slate-800">floor({totalComputed} ÷ {result.max} × 100)</span>
                      <span className="text-slate-400">=</span>
                      <span className="rounded-lg bg-emerald-100 px-3 py-1 font-black text-emerald-700">{result.percent}%</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-xs leading-relaxed text-amber-800">
                      達成率は小数点以下を切り捨て。表示・ランク判定・バッジ判定すべてで同じ値を使用しています。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rank' && (
            <motion.div
              key="rank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-4 text-sm text-slate-600">
                達成率に応じて4段階のランクが決定されます。あなたは現在 <strong className="text-blue-600">{result.rank.code}ランク</strong> です。
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {RANK_DEFINITIONS.map((r) => {
                  const minTotal = Math.max(minPossibleTotal, Math.ceil((result.max * r.minPercent) / 100));
                  const maxTotal = Math.floor((result.max * r.maxPercent) / 100);
                  const isCurrent = r.code === result.rank.code;

                  return (
                    <div
                      key={r.code}
                      className={cn(
                        'relative overflow-hidden rounded-2xl border-2 p-4 transition-all',
                        isCurrent
                          ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      {isCurrent && (
                        <div className="absolute right-3 top-3 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          現在のランク
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'grid h-12 w-12 place-items-center rounded-xl text-lg font-black',
                            isCurrent
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {r.code}
                        </div>
                        <div>
                          <div className={cn('text-sm font-bold', isCurrent ? 'text-blue-800' : 'text-slate-800')}>
                            {r.title}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            達成率 {r.minPercent}% 〜 {r.maxPercent}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                        <span className="text-xs text-slate-500">必要スコア</span>
                        <span className={cn('text-sm font-bold', isCurrent ? 'text-blue-700' : 'text-slate-700')}>
                          {minTotal}〜{maxTotal} / {result.max}点
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'breakdown' && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-4 text-sm text-slate-600">
                各教科の評定と重みをかけて合計スコアを算出しています。
              </p>

              {/* Subject breakdown table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* Header */}
                <div className="grid grid-cols-[1fr_60px_60px_70px] gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600">
                  <div>教科</div>
                  <div className="text-center">評定</div>
                  <div className="text-center">重み</div>
                  <div className="text-right">得点</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  {breakdown.map((row, index) => (
                    <motion.div
                      key={row.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="grid grid-cols-[1fr_60px_60px_70px] items-center gap-2 px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{row.label}</span>
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                            row.category === 'core'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {row.category === 'core' ? '5教科' : '実技'}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-800">
                          {row.score}
                        </span>
                      </div>
                      <div className="text-center text-sm text-slate-600">×{row.weight}</div>
                      <div className="text-right text-sm font-bold text-slate-800">{row.points}点</div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t-2 border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-700">合計スコア</span>
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-base font-black text-white shadow-md shadow-blue-200"
                    >
                      {totalComputed} / {result.max}点
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
