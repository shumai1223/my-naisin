'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Target, Calculator, Info, ArrowLeft, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getExamRatioByCode, DEFAULT_EXAM_RATIO } from '@/lib/prefecture-exam-data';
import { calculateMaxScore } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TokyoExtendedCalculator } from '@/components/Calculator/TokyoExtendedCalculator';

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

type ReverseMode = 'general' | 'tokyo' | 'kanagawa';

const KANAGAWA_RATIO_PRESETS = ['3-7', '4-6', '5-5', '6-4', '7-3'];

export function ReverseCalculator({ onBack }: ReverseCalculatorProps) {
  const searchParams = useSearchParams();
  const initialPref = searchParams.get('pref') ?? 'tokyo';
  const initialRatio = searchParams.get('ratio');

  const [prefectureCode, setPrefectureCode] = React.useState(initialPref);
  const [mode, setMode] = React.useState<ReverseMode>(initialPref === 'tokyo' ? 'tokyo' : initialPref === 'kanagawa' ? 'kanagawa' : 'general');
  const [targetTotalScore, setTargetTotalScore] = React.useState<number>(700);
  const [currentNaishin, setCurrentNaishin] = React.useState<number>(300);
  const [naishinRatio, setNaishinRatio] = React.useState<number>(30);
  const [examMaxScore, setExamMaxScore] = React.useState<number>(500);
  const [result, setResult] = React.useState<ReverseResult | null>(null);
  const [tokyoKansoNaishin, setTokyoKansoNaishin] = React.useState<number>(45);
  const [copied, setCopied] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const prefecture = React.useMemo(() => getPrefectureByCode(prefectureCode), [prefectureCode]);
  const naishinMax = React.useMemo(() => calculateMaxScore(prefectureCode), [prefectureCode]);

  React.useEffect(() => {
    const examData = getExamRatioByCode(prefectureCode);
    const config = examData?.generalExam ?? DEFAULT_EXAM_RATIO;
    setNaishinRatio(config.naishinRatio);
    setExamMaxScore(config.examMaxScore);
    setTargetTotalScore(Math.round(config.totalMaxScore * 0.7));
  }, [prefectureCode]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTokyo = window.localStorage.getItem('my-naishin:tokyo-kanso');
    const storedKanagawa = window.localStorage.getItem('my-naishin:kanagawa-A');
    if (storedTokyo) {
      const parsed = Number(storedTokyo);
      if (Number.isFinite(parsed)) setTokyoKansoNaishin(parsed);
    }
    if (storedKanagawa) {
      const parsed = Number(storedKanagawa);
      if (Number.isFinite(parsed)) setCurrentNaishin(parsed);
    }
  }, []);

  React.useEffect(() => {
    if (!initialRatio) return;
    const [naishin, exam] = initialRatio.split('-').map((n) => Number(n));
    if (Number.isFinite(naishin) && Number.isFinite(exam) && naishin + exam > 0) {
      const ratio = Math.round((naishin / (naishin + exam)) * 100);
      setNaishinRatio(ratio);
    }
  }, [initialRatio]);

  const calculate = React.useCallback(() => {
    setValidationError(null);

    if (currentNaishin < 0 || currentNaishin > naishinMax) {
      setValidationError(`内申点は0〜${naishinMax}の範囲で入力してください。`);
      return;
    }
    if (naishinRatio < 0 || naishinRatio > 100) {
      setValidationError('内申比率は0〜100%の範囲で入力してください。');
      return;
    }
    if (examMaxScore < 1) {
      setValidationError('当日点の満点は1以上で入力してください。');
      return;
    }
    if (targetTotalScore < 0) {
      setValidationError('目標合計点は0以上で入力してください。');
      return;
    }

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
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('general');
                if (prefectureCode === 'tokyo') setPrefectureCode('tokyo');
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mode === 'general' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              一般モード
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('tokyo');
                setPrefectureCode('tokyo');
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mode === 'tokyo' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              東京都(1020)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('kanagawa');
                setPrefectureCode('kanagawa');
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${mode === 'kanagawa' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              神奈川(S1/S2)
            </button>
          </div>

          {mode === 'tokyo' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-700">
                都立一般（1020点満点）を自動設定しています。換算内申・学力検査・ESAT-Jで必要当日点を逆算できます。
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">現在の換算内申</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={65}
                    value={tokyoKansoNaishin}
                    onChange={(e) => {
                      const next = Math.min(65, Math.max(0, Number(e.target.value)));
                      setTokyoKansoNaishin(next);
                      if (typeof window !== 'undefined') {
                        window.localStorage.setItem('my-naishin:tokyo-kanso', String(next));
                      }
                    }}
                    className="h-11 w-32 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm font-bold text-slate-800 shadow-sm outline-none focus:border-rose-500"
                  />
                  <span className="text-sm text-slate-500">/65点</span>
                </div>
              </div>
              <TokyoExtendedCalculator kansoNaishin={tokyoKansoNaishin} />
            </div>
          ) : (
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
                  {prefectureCode === 'kanagawa' ? 'A（評定合計）' : '現在の内申点'}
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
                {prefectureCode === 'kanagawa' && (
                  <div className="mt-2 text-xs text-slate-500">
                    a値（100点換算）: {Math.round((currentNaishin / naishinMax) * 100)}点
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Info className="h-4 w-4 text-slate-500" />
                配点設定（学校・入試方式によって異なります）
              </div>
              {prefectureCode === 'kanagawa' && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {KANAGAWA_RATIO_PRESETS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        const [naishin, exam] = ratio.split('-').map((n) => Number(n));
                        if (Number.isFinite(naishin) && Number.isFinite(exam) && naishin + exam > 0) {
                          setNaishinRatio(Math.round((naishin / (naishin + exam)) * 100));
                        }
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
                    >
                      {ratio.replace('-', ':')}
                    </button>
                  ))}
                  <div className="w-full text-[11px] text-slate-400">
                    ※ f:g は合計10（2以上の整数）。学校・学科ごとに異なる（2:8〜8:2）。特色検査は最大5。
                  </div>
                </div>
              )}
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

            {validationError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                {validationError}
              </div>
            )}

            <Button
              onClick={calculate}
              leftIcon={<Calculator className="h-4 w-4" />}
              className="w-full shadow-md shadow-emerald-500/20"
            >
              必要な当日点を計算
            </Button>
          </div>
          )}
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

              {/* 計算式（簡易） */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-600">計算式</div>
                <code className="mt-1 block text-xs leading-relaxed text-slate-500">
                  目標合計点 {targetTotalScore} − 内申寄与分（{currentNaishin} × {naishinRatio}%）＝ 当日点寄与分 → 必要当日点 {result.requiredExamScore}/{result.examMaxScore}（{result.examPercent}%）
                </code>
              </div>

              {/* コピーボタン */}
              <button
                onClick={() => {
                  const text = `必要当日点：${result.requiredExamScore}/${result.examMaxScore}（${result.examPercent}%）／1教科平均：${result.perSubjectScore}点`;
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'コピーしました' : '結果をコピー'}
              </button>

              <div className="mt-3 text-xs text-slate-500">
                ※ この計算は目安です。実際の配点は志望校・入試方式によって異なります。
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
