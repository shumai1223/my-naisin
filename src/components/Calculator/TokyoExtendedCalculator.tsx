'use client';

import * as React from 'react';
import { Calculator, Target, Info, ExternalLink } from 'lucide-react';

import { Card } from '@/components/ui/Card';

interface TokyoExtendedCalculatorProps {
  kansoNaishin: number; // 換算内申 (65点満点)
}

const ESAT_J_GRADES = [
  { grade: 'A', points: 20, description: '最高評価' },
  { grade: 'B', points: 16, description: '優秀' },
  { grade: 'C', points: 12, description: '良好' },
  { grade: 'D', points: 8, description: '基礎的' },
  { grade: 'E', points: 4, description: '努力が必要' },
  { grade: 'F', points: 0, description: '未受験・0点' },
];

export function TokyoExtendedCalculator({ kansoNaishin }: TokyoExtendedCalculatorProps) {
  const [examScore, setExamScore] = React.useState<number>(350); // 学力検査点 (500点満点)
  const [esatJGrade, setEsatJGrade] = React.useState<string>('C');
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

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-200/50">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-800">🗼 東京都 総合得点シミュレーター</div>
            <div className="text-xs text-slate-500">1020点満点（内申300点＋学力検査700点＋ESAT-J 20点）</div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* 現在の換算内申表示 */}
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-600">あなたの換算内申</div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-800">{kansoNaishin}</span>
              <span className="text-sm text-slate-500">/65点</span>
              <div className="text-xs text-slate-400">→ 300点換算: {naishinConverted}点</div>
            </div>
          </div>
        </div>

        {/* 学力検査点入力 */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>📝 学力検査（当日点）</span>
            <span className="text-xs text-slate-400">500点満点</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={examScore}
              onChange={(e) => setExamScore(Number(e.target.value))}
              className="flex-1 h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-rose-500"
            />
            <input
              type="number"
              min={0}
              max={500}
              value={examScore}
              onChange={(e) => setExamScore(Math.min(500, Math.max(0, Number(e.target.value))))}
              className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-bold"
            />
          </div>
          <div className="mt-1 text-xs text-slate-400 text-right">→ 700点換算: {examConverted}点</div>
        </div>

        {/* ESAT-J選択 */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>🎤 ESAT-J（スピーキングテスト）</span>
            <span className="text-xs text-slate-400">20点満点</span>
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ESAT_J_GRADES.map((grade) => (
              <button
                key={grade.grade}
                type="button"
                onClick={() => setEsatJGrade(grade.grade)}
                className={`rounded-xl border-2 p-3 text-center transition-all ${
                  esatJGrade === grade.grade
                    ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`text-lg font-bold ${esatJGrade === grade.grade ? 'text-rose-600' : 'text-slate-700'}`}>
                  {grade.grade}
                </div>
                <div className="text-xs text-slate-500">{grade.points}点</div>
              </button>
            ))}
          </div>
        </div>

        {/* 総合得点表示 */}
        <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-5 text-white">
          <div className="text-sm font-medium text-white/80">総合得点</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{totalScore}</span>
            <span className="text-lg text-white/70">/1020点</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-white/20 px-2 py-1.5 text-center">
              <div className="text-white/70">内申</div>
              <div className="font-bold">{naishinConverted}点</div>
            </div>
            <div className="rounded-lg bg-white/20 px-2 py-1.5 text-center">
              <div className="text-white/70">学力検査</div>
              <div className="font-bold">{examConverted}点</div>
            </div>
            <div className="rounded-lg bg-white/20 px-2 py-1.5 text-center">
              <div className="text-white/70">ESAT-J</div>
              <div className="font-bold">{esatJPoints}点</div>
            </div>
          </div>
        </div>

        {/* 目標設定と逆算 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-bold text-slate-700">目標から逆算</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-slate-600">目標総合得点:</label>
            <input
              type="number"
              min={0}
              max={1020}
              value={targetScore}
              onChange={(e) => setTargetScore(Math.min(1020, Math.max(0, Number(e.target.value))))}
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-bold"
            />
            <span className="text-sm text-slate-400">/1020点</span>
          </div>
          <div className={`rounded-lg p-3 ${gap <= 0 ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            {gap <= 0 ? (
              <p className="text-sm text-emerald-700">
                🎉 <strong>目標達成！</strong> 現在の点数で目標をクリアしています。
              </p>
            ) : (
              <p className="text-sm text-amber-700">
                目標まであと <strong>{gap}点</strong>。
                現在の内申・ESAT-Jのまま達成するには、学力検査で <strong>{requiredExamScore}点</strong>（{Math.round((requiredExamScore / 500) * 100)}%）が必要です。
              </p>
            )}
          </div>
        </div>

        {/* 情報源 */}
        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
          <Info className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div className="text-xs text-slate-500">
            <p>東京都立高校一般入試の総合得点は「調査書点300点＋学力検査700点＋ESAT-J 20点」の1020点満点で計算されます。</p>
            <a 
              href="https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              東京都教育委員会
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
