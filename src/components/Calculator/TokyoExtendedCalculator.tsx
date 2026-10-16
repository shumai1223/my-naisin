'use client';

import * as React from 'react';
import { ExternalLink } from '@/components/icons';

import { Card } from '@/components/ui/Card';

interface TokyoExtendedCalculatorProps {
  kansoNaishin: number; // 換算内申 (65点満点)
  /**
   * 見出しの階層。単独で置くときは h2（既定）。
   * 逆算ツールなど、別の見出し（h2）の下に置くときは h3 を渡す。
   * h3 のときは親のカードの中に置かれるものとして扱い、自分のカード枠は付けない（カードの中にカードを入れない）。
   */
  headingLevel?: 'h2' | 'h3';
}

const ESAT_J_GRADES = [
  { grade: 'A', points: 20, description: '最高評価' },
  { grade: 'B', points: 16, description: '優秀' },
  { grade: 'C', points: 12, description: '良好' },
  { grade: 'D', points: 8, description: '基礎的' },
  { grade: 'E', points: 4, description: '努力が必要' },
  { grade: 'F', points: 0, description: '未受験・0点' },
];

// 数値入力の見た目（DESIGN-SYSTEM.md §3 入力）
const NUMBER_INPUT =
  'h-11 rounded border border-slate-300 bg-white px-3 text-center text-base font-bold tabular-nums text-slate-900 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700';

export function TokyoExtendedCalculator({ kansoNaishin, headingLevel = 'h2' }: TokyoExtendedCalculatorProps) {
  const [examScore, setExamScore] = React.useState<number>(350); // 学力検査点 (500点満点)
  const [esatJGrade, setEsatJGrade] = React.useState<string>(''); // 空文字列 = 未入力（任意）
  const [targetScore, setTargetScore] = React.useState<number>(700);

  // 換算内申を300点満点に換算
  const naishinConverted = Math.round((kansoNaishin / 65) * 300);

  // 学力検査を700点満点に換算
  const examConverted = Math.round((examScore / 500) * 700);

  // ESAT-J得点
  const esatJPoints = ESAT_J_GRADES.find(g => g.grade === esatJGrade)?.points ?? 0;

  // 総合得点 (1020点満点)
  const totalScore = naishinConverted + examConverted + esatJPoints;

  // 目標までの差
  const gap = targetScore - totalScore;

  // 目標達成に必要な学力検査点を逆算
  const requiredExamScore = Math.max(0, Math.min(500,
    Math.round(((targetScore - naishinConverted - esatJPoints) / 700) * 500)
  ));

  const nested = headingLevel === 'h3';
  const Heading = headingLevel;

  const intro = (
    <div className={nested ? undefined : 'border-b border-slate-200 px-5 py-4'}>
      <Heading className="text-lg font-bold text-slate-900">東京都専用：1020点満点シミュレーター</Heading>
      <p className="mt-1 text-sm text-slate-600">内申300点＋学力検査700点＋ESAT-J 20点＝1020点</p>
      <div className="mt-3 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <p className="text-sm leading-[1.8] text-slate-900">
          <strong>このツールについて：</strong>東京都立高校の入試では、内申点・学力検査・ESAT-Jの3つを合計した1020点満点で合否判定されます。下記で当日点やESAT-Jの成績を入力すると、合計点や目標達成に必要な点数が分かります。
        </p>
      </div>
    </div>
  );

  const body = (
    <div className={nested ? 'mt-5 space-y-6' : 'space-y-6 p-5'}>
      {/* 現在の換算内申表示 */}
      <div className="flex items-center justify-between gap-3 border-y border-slate-200 py-3">
        <div className="text-sm text-slate-600">あなたの換算内申</div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums text-slate-900">{kansoNaishin}</span>
          <span className="text-sm text-slate-600">/65点</span>
          <div className="text-xs tabular-nums text-slate-600">→ 300点換算: {naishinConverted}点</div>
        </div>
      </div>

      {/* 学力検査点入力 */}
      <div>
        <label htmlFor="tokyo-exam-score" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm font-bold text-slate-900">
          <span>学力検査（当日点）</span>
          <span className="text-xs font-normal text-slate-600">500点満点</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={examScore}
            onChange={(e) => setExamScore(Number(e.target.value))}
            aria-label="学力検査（当日点）"
            className="naishin-range min-w-0 flex-1"
          />
          <input
            id="tokyo-exam-score"
            type="number"
            min={0}
            max={500}
            value={examScore}
            onChange={(e) => setExamScore(Math.min(500, Math.max(0, Number(e.target.value))))}
            className={`w-20 ${NUMBER_INPUT}`}
          />
        </div>
        <div className="mt-1 text-right text-xs tabular-nums text-slate-600">→ 700点換算: {examConverted}点</div>
      </div>

      {/* ESAT-J選択 */}
      <div>
        <div className="mb-2 flex flex-col gap-1 text-sm text-slate-900">
          <span className="flex flex-wrap items-center gap-x-2">
            <span className="font-bold">ESAT-J（スピーキングテスト）の成績</span>
            <span className="text-xs text-slate-600">任意入力・20点満点</span>
          </span>
          <span className="text-xs text-slate-600">※まだ受験していない場合は「未入力」を選択してください</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
          <button
            type="button"
            onClick={() => setEsatJGrade('')}
            aria-pressed={esatJGrade === ''}
            className={`min-h-11 rounded border p-3 text-center transition-colors duration-100 ${
              esatJGrade === ''
                ? 'border-brand-700 bg-brand-50'
                : 'border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`text-sm font-bold ${esatJGrade === '' ? 'text-brand-800' : 'text-slate-900'}`}>
              未入力
            </div>
            <div className="text-xs text-slate-600">0点</div>
          </button>
          {ESAT_J_GRADES.map((grade) => (
            <button
              key={grade.grade}
              type="button"
              onClick={() => setEsatJGrade(grade.grade)}
              aria-pressed={esatJGrade === grade.grade}
              className={`min-h-11 rounded border p-3 text-center transition-colors duration-100 ${
                esatJGrade === grade.grade
                  ? 'border-brand-700 bg-brand-50'
                  : 'border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className={`text-lg font-bold ${esatJGrade === grade.grade ? 'text-brand-800' : 'text-slate-900'}`}>
                {grade.grade}
              </div>
              <div className="text-xs tabular-nums text-slate-600">{grade.points}点</div>
            </button>
          ))}
        </div>
      </div>

      {/* 総合得点表示 */}
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
        <div className="text-sm text-slate-600">総合得点</div>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-4xl font-bold tabular-nums text-slate-900">{totalScore}</span>
          <span className="pb-1 text-lg text-slate-600">/1020点</span>
        </div>
        <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 text-center">
          <div className="px-2 py-2">
            <dt className="text-xs text-slate-600">内申</dt>
            <dd className="text-base font-bold tabular-nums text-slate-900">{naishinConverted}点</dd>
          </div>
          <div className="px-2 py-2">
            <dt className="text-xs text-slate-600">学力検査</dt>
            <dd className="text-base font-bold tabular-nums text-slate-900">{examConverted}点</dd>
          </div>
          <div className="px-2 py-2">
            <dt className="text-xs text-slate-600">ESAT-J</dt>
            <dd className="text-base font-bold tabular-nums text-slate-900">{esatJPoints}点</dd>
          </div>
        </dl>
      </div>

      {/* 目標設定と逆算 */}
      <div className="border-t border-slate-200 pt-5">
        <div className="mb-3 text-sm font-bold text-slate-900">目標から逆算</div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label htmlFor="tokyo-target-score" className="text-sm text-slate-900">目標総合得点:</label>
          <input
            id="tokyo-target-score"
            type="number"
            min={0}
            max={1020}
            value={targetScore}
            onChange={(e) => setTargetScore(Math.min(1020, Math.max(0, Number(e.target.value))))}
            className={`w-24 ${NUMBER_INPUT}`}
          />
          <span className="text-sm text-slate-600">/1020点</span>
        </div>
        <div className={`rounded-lg border p-4 ${gap <= 0 ? 'border-slate-200 bg-brand-50' : 'border-amber-200 bg-amber-50'}`}>
          {gap <= 0 ? (
            <p className="text-sm leading-[1.8] text-slate-900">
              <strong>目標に到達しています。</strong>現在の点数で目標を満たしています。
            </p>
          ) : (
            <p className="text-sm leading-[1.8] text-amber-900">
              目標まであと <strong>{gap}点</strong>。
              現在の内申・ESAT-Jのまま達成するには、学力検査で <strong>{requiredExamScore}点</strong>（{Math.round((requiredExamScore / 500) * 100)}%）が必要です。
            </p>
          )}
        </div>
      </div>

      {/* 情報源 */}
      <div className="border-t border-slate-200 pt-4 text-sm text-slate-600">
        <p>東京都立高校一般入試の総合得点は「調査書点300点＋学力検査700点＋ESAT-J 20点」の1020点満点で計算されます。</p>
        <div className="mt-1 flex min-h-[44px] flex-wrap items-center gap-1">
          <span>出典：</span>
          <a
            href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            東京都教育委員会
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );

  if (nested) {
    return (
      <section className="border-t border-slate-200 pt-5">
        {intro}
        {body}
      </section>
    );
  }

  return (
    <Card>
      {intro}
      {body}
    </Card>
  );
}
