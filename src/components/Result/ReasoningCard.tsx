'use client';

import * as React from 'react';

import { RANK_DEFINITIONS, SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { ResultData, Scores } from '@/lib/types';
import { cn, getSubjectWeight } from '@/lib/utils';

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
}

const TABS: TabConfig[] = [
  { id: 'formula', label: '計算式', shortLabel: '計算式' },
  { id: 'rank', label: 'ランク', shortLabel: 'ランク' },
  { id: 'breakdown', label: '内訳', shortLabel: '内訳' }
];

export function ReasoningCard({ result, scores }: ReasoningCardProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>('formula');
  const prefecture = getPrefectureByCode(result.prefectureCode);
  const coreWeight = getSubjectWeight(result.prefectureCode, 'core');
  const practicalWeight = getSubjectWeight(result.prefectureCode, 'practical');

  const breakdown = React.useMemo(() => {
    return SUBJECTS.map((subject) => {
      const raw = scores[subject.key];
      const safe = Math.min(5, Math.max(1, Math.round(raw)));
      const weight = subject.category === 'core' ? coreWeight : practicalWeight;
      return {
        key: subject.key,
        label: subject.label,
        category: subject.category,
        score: safe,
        weight,
        points: safe * weight
      };
    });
  }, [scores, coreWeight, practicalWeight]);

  const totalComputed = React.useMemo(() => breakdown.reduce((sum, row) => sum + row.points, 0), [breakdown]);

  const minPossibleTotal = React.useMemo(() => {
    return SUBJECTS.reduce((sum, subject) => {
      const weight = subject.category === 'core' ? coreWeight : practicalWeight;
      return sum + 1 * weight;
    }, 0);
  }, [coreWeight, practicalWeight]);

  const prefectureLabel = prefecture?.name ?? '都道府県別方式';

  return (
    <Card className="p-5">
      {/* Header */}
      <h3 className="text-[17px] font-bold text-slate-900">計算の根拠</h3>
      <p className="mt-1 text-sm text-slate-600">スコアがどのように計算されたかを確認できます</p>

      {/* Tab Navigation */}
      <div className="mt-4 border-b border-slate-200">
        <nav className="-mb-px flex gap-1" aria-label="計算根拠タブ">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex min-h-11 shrink-0 items-center border-b-2 px-4 text-sm font-bold transition-colors duration-100',
                  isActive
                    ? 'border-brand-700 text-brand-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                )}
                aria-selected={isActive}
                role="tab"
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-5">
        {activeTab === 'formula' && (
          <div className="motion-safe:animate-fade-in">
            {/* Mode Badge */}
            <div className="mb-5 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-1 text-sm font-bold text-slate-900">
              {prefectureLabel}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Formula */}
              <section>
                <h4 className="text-sm font-bold text-slate-900">計算式</h4>
                <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 font-mono text-sm font-bold text-slate-900">
                  <div>合計 = (5教科 × {coreWeight})</div>
                  <div className="mt-1 pl-8">+ (実技4教科 × {practicalWeight})</div>
                </div>
                <dl className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-sm text-slate-600">満点</dt>
                    <dd className="text-sm font-bold tabular-nums text-slate-900">{result.max}点</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-sm text-slate-600">5教科の重み</dt>
                    <dd className="text-sm font-bold tabular-nums text-slate-900">× {coreWeight}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-sm text-slate-600">実技4教科の重み</dt>
                    <dd className="text-sm font-bold tabular-nums text-slate-900">× {practicalWeight}</dd>
                  </div>
                </dl>
              </section>

              {/* Percent Formula */}
              <section>
                <h4 className="text-sm font-bold text-slate-900">達成率の計算</h4>
                <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 font-mono text-sm font-bold text-slate-900">
                  達成率 = floor(合計 ÷ 満点 × 100)
                </div>
                <div className="mt-3">
                  <div className="text-sm text-slate-600">あなたの計算:</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-slate-50 p-3 font-mono text-sm font-bold text-slate-900">
                    <span>floor({totalComputed} ÷ {result.max} × 100)</span>
                    <span className="text-slate-600">=</span>
                    <span className="tabular-nums text-brand-700">{result.percent}%</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  達成率は小数点以下を切り捨て。表示・ランク判定・バッジ判定すべてで同じ値を使用しています。
                </p>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'rank' && (
          <div className="motion-safe:animate-fade-in">
            <p className="text-sm text-slate-600">
              達成率に応じて4段階のランクが決定されます。あなたは現在 <strong className="text-slate-900">{result.rank.code}ランク</strong> です。
            </p>

            <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {RANK_DEFINITIONS.map((r) => {
                const minTotal = Math.max(minPossibleTotal, Math.ceil((result.max * r.minPercent) / 100));
                const maxTotal = Math.floor((result.max * r.maxPercent) / 100);
                const isCurrent = r.code === result.rank.code;

                return (
                  <li
                    key={r.code}
                    className={cn(
                      'flex items-center gap-4 px-3 py-3',
                      isCurrent && 'bg-brand-50'
                    )}
                  >
                    <div
                      className={cn(
                        'grid h-10 w-10 shrink-0 place-items-center rounded border text-lg font-bold',
                        isCurrent
                          ? 'border-brand-700 text-brand-700'
                          : 'border-slate-300 text-slate-900'
                      )}
                    >
                      {r.code}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{r.title}</span>
                        {isCurrent && (
                          <span className="inline-flex items-center rounded border border-brand-700 bg-white px-2 py-0.5 text-xs font-bold text-brand-700">
                            現在のランク
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs tabular-nums text-slate-600">
                        達成率 {r.minPercent}% 〜 {r.maxPercent}%
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-600">必要スコア</div>
                      <div className="text-sm font-bold tabular-nums text-slate-900">
                        {minTotal}〜{maxTotal} / {result.max}点
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="motion-safe:animate-fade-in">
            <p className="mb-4 text-sm text-slate-600">
              各教科の評定と重みをかけて合計スコアを算出しています。
            </p>

            {/* Subject breakdown table */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              {/* Header */}
              <div className="grid grid-cols-[1fr_44px_44px_56px] gap-2 border-b border-slate-900 px-3 py-2 text-xs text-slate-600">
                <div>教科</div>
                <div className="text-center">評定</div>
                <div className="text-center">重み</div>
                <div className="text-right">得点</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-200">
                {breakdown.map((row) => (
                  <div
                    key={row.key}
                    className="grid grid-cols-[1fr_44px_44px_56px] items-center gap-2 px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm text-slate-900">{row.label}</span>
                      <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                        {row.category === 'core' ? '5教科' : '実技'}
                      </span>
                    </div>
                    <div className="text-center text-sm font-bold tabular-nums text-slate-900">
                      {row.score}
                    </div>
                    <div className="text-center text-sm tabular-nums text-slate-600">×{row.weight}</div>
                    <div className="text-right text-sm font-bold tabular-nums text-slate-900">{row.points}点</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between gap-4 border-t border-slate-900 bg-brand-50 px-3 py-3">
                <span className="text-sm font-bold text-slate-900">合計スコア</span>
                <span className="text-base font-bold tabular-nums text-slate-900">
                  {totalComputed} / {result.max}点
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
