'use client';

import * as React from 'react';
import { Target, Calculator, Info, ArrowLeft, ChevronDown, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getExamRatioByCode, DEFAULT_EXAM_RATIO } from '@/lib/prefecture-exam-data';
import { calculateMaxScore } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ReverseCalculatorProps {
  onBack: () => void;
}

interface ReverseResult {
  requiredExamScore: number;
  examMaxScore: number;
  examPercent: number;
  perSubjectScore: number;
  isAchievable: boolean;
  message: string;
}

export function ReverseCalculator({ onBack }: ReverseCalculatorProps) {
  const [prefectureCode, setPrefectureCode] = React.useState('tokyo');
  const [targetTotalScore, setTargetTotalScore] = React.useState<number>(700);
  const [currentNaishin, setCurrentNaishin] = React.useState<number>(300);
  const [naishinRatio, setNaishinRatio] = React.useState<number>(30);
  const [examMaxScore, setExamMaxScore] = React.useState<number>(500);
  const [result, setResult] = React.useState<ReverseResult | null>(null);

  const prefecture = React.useMemo(() => getPrefectureByCode(prefectureCode), [prefectureCode]);
  const naishinMax = React.useMemo(() => calculateMaxScore(prefectureCode), [prefectureCode]);

  React.useEffect(() => {
    const examData = getExamRatioByCode(prefectureCode);
    const config = examData?.generalExam ?? DEFAULT_EXAM_RATIO;
    setNaishinRatio(config.naishinRatio);
    setExamMaxScore(config.examMaxScore);
    setTargetTotalScore(Math.round(config.totalMaxScore * 0.7));
  }, [prefectureCode]);

  const calculate = React.useCallback(() => {
    const examRatio = 100 - naishinRatio;
    const totalMaxScore = (naishinMax * (naishinRatio / 100)) + (examMaxScore * (examRatio / 100));
    const naishinContribution = currentNaishin * (naishinRatio / 100);
    const requiredFromExam = targetTotalScore - naishinContribution;
    const requiredExamScore = Math.round((requiredFromExam * 100) / examRatio);
    const examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
    const perSubjectScore = Math.round(requiredExamScore / 5);
    const isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;

    let message = '';
    if (!isAchievable) {
      if (requiredExamScore > examMaxScore) {
        message = '目標点に対して内申点が不足しています。内申点を上げるか、目標を調整してください。';
      } else {
        message = '現在の内申点だけで目標を達成できます！';
      }
    } else if (examPercent >= 90) {
      message = '非常に高い当日点が必要です。内申点アップも検討しましょう。';
    } else if (examPercent >= 70) {
      message = '当日点で挽回可能ですが、内申点も上げると楽になります。';
    } else {
      message = '十分達成可能な目標です。この調子で頑張りましょう！';
    }

    setResult({
      requiredExamScore: Math.max(0, Math.min(examMaxScore, requiredExamScore)),
      examMaxScore,
      examPercent: Math.max(0, Math.min(100, examPercent)),
      perSubjectScore: Math.max(0, perSubjectScore),
      isAchievable,
      message,
    });
  }, [currentNaishin, naishinMax, targetTotalScore, naishinRatio, examMaxScore]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 px-5 py-5 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-300/40">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-800">志望校から逆算</div>
                <div className="text-sm text-slate-500">目標点から必要な当日点を計算</div>
              </div>
            </div>
            <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              戻る
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">都道府県を選択</label>
              <div className="relative">
                <select
                  value={prefectureCode}
                  onChange={(e) => setPrefectureCode(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {PREFECTURES.map((pref) => (
                    <option key={pref.code} value={pref.code}>
                      {pref.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              {prefecture?.sourceUrl && (
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {prefecture.name}の公式情報を見る
                </a>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  目標総合点
                  <span className="ml-1 text-xs font-normal text-slate-500">（内申＋当日点の合計）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={targetTotalScore}
                    onChange={(e) => setTargetTotalScore(Number(e.target.value))}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-sm text-slate-500">点</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  現在の内申点
                  <span className="ml-1 text-xs font-normal text-slate-500">（{naishinMax}点満点）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentNaishin}
                    onChange={(e) => setCurrentNaishin(Number(e.target.value))}
                    max={naishinMax}
                    min={0}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-sm text-slate-500">点</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Info className="h-4 w-4 text-slate-500" />
                配点設定（学校・入試方式によって異なります）
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">内申点の比率</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={naishinRatio}
                      onChange={(e) => setNaishinRatio(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="h-10 w-20 rounded-lg border border-slate-200 bg-white px-3 text-center text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <span className="text-sm text-slate-500">%（当日点 {100 - naishinRatio}%）</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">当日点の満点</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={examMaxScore}
                      onChange={(e) => setExamMaxScore(Number(e.target.value))}
                      min={100}
                      className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 text-center text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <span className="text-sm text-slate-500">点</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={calculate}
              leftIcon={<Calculator className="h-4 w-4" />}
              className="w-full shadow-md shadow-emerald-500/20"
            >
              必要な当日点を計算
            </Button>
          </div>
        </div>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden" variant="elevated">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-5">
              <div className="text-lg font-bold text-slate-800">📊 逆算結果</div>
            </div>
            <div className="p-6">
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center">
                  <div className="text-sm font-medium text-emerald-600">必要な当日点</div>
                  <div className="mt-1 text-3xl font-bold text-emerald-700">
                    {result.requiredExamScore}
                    <span className="text-lg text-emerald-500">/{result.examMaxScore}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
                  <div className="text-sm font-medium text-blue-600">得点率</div>
                  <div className="mt-1 text-3xl font-bold text-blue-700">
                    {result.examPercent}
                    <span className="text-lg text-blue-500">%</span>
                  </div>
                </div>
                <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-4 text-center">
                  <div className="text-sm font-medium text-violet-600">1教科平均</div>
                  <div className="mt-1 text-3xl font-bold text-violet-700">
                    {result.perSubjectScore}
                    <span className="text-lg text-violet-500">点</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 ${result.isAchievable ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className={`text-sm font-medium ${result.isAchievable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.message}
                </p>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                ※ この計算は目安です。実際の配点は志望校・入試方式によって異なります。
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
