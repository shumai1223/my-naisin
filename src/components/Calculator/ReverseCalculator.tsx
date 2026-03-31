'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Target, Calculator, Info, ArrowLeft, ChevronDown, ExternalLink, Copy, Check, HelpCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getExamRatioByCode, DEFAULT_EXAM_RATIO } from '@/lib/prefecture-exam-data';
import { RATIO_PRESETS } from '@/lib/presets';
import { SCHOOL_PRESETS } from '@/lib/school-presets';
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

// 都道府県別のよくある配点比率プリセット
const PREFECTURE_RATIO_PRESETS: Record<string, { label: string; ratio: number; examMax: number; description: string }[]> = {
  tokyo: [
    { label: '都立一般', ratio: 30, examMax: 700, description: '学力検査700点・調査書点300点の標準' },
    { label: '内申重視', ratio: 40, examMax: 600, description: '内申重視の学校・学科向け' },
    { label: '学力重視', ratio: 25, examMax: 750, description: '学力検査重視の進学校向け' },
  ],
  kanagawa: [
    { label: 'S値:A値=6:4', ratio: 40, examMax: 500, description: '一般的な比率' },
    { label: 'S値:A値=7:3', ratio: 30, examMax: 500, description: '学力検査重視' },
    { label: 'S値:A値=5:5', ratio: 50, examMax: 500, description: '内申重視' },
  ],
  osaka: [
    { label: 'Ⅰ型', ratio: 50, examMax: 500, description: '内申:学力=5:5' },
    { label: 'Ⅱ型', ratio: 40, examMax: 500, description: '内申:学力=4:6' },
    { label: 'Ⅲ型', ratio: 37.5, examMax: 500, description: '内申:学力=3:5の標準' },
    { label: 'Ⅳ型', ratio: 30, examMax: 500, description: '内申:学力=3:7（内申重視）' },
    { label: 'Ⅴ型', ratio: 25, examMax: 500, description: '内申:学力=1:3（内申最重視）' },
  ]
};

// 用語ヘルプデータ
const TERM_HELP: Record<string, { title: string; description: string }> = {
  'S値': {
    title: 'S値とは',
    description: '学力検査の得点を100点満点に換算した値です。神奈川県などで使われる用語で、内申点（A値）と合わせて合否判定に使われます。'
  },
  'K値': {
    title: 'K値とは',
    description: '内申点の重み付け係数で、0.5〜2の範囲で高校ごとに設定されます。K値が高いほど内申点が重視されます。千葉県などで使われます。'
  },
  'ESAT-J': {
    title: 'ESAT-Jとは',
    description: '東京都立高校入試で導入された英語スピーキングテストです。20点満点で、学力検査700点・調査書点300点に加算されます。'
  },
  '換算内申': {
    title: '換算内申とは',
    description: '都道府県のルールで計算し直した内申点です。東京都では実技4教科を2倍にして65点満点で計算します。'
  },
  '調査書点': {
    title: '調査書点とは',
    description: '内申点を入試の配点に換算した点数です。東京都では換算内申を300点満点に換算します。'
  }
};

export function ReverseCalculator({ onBack }: ReverseCalculatorProps) {
  const searchParams = useSearchParams();
  const initialPref = searchParams.get('pref') ?? 'tokyo';
  const initialRatio = searchParams.get('ratio');

  const [prefectureCode, setPrefectureCode] = React.useState(initialPref);
  const [mode, setMode] = React.useState<ReverseMode>(initialPref === 'tokyo' ? 'tokyo' : initialPref === 'kanagawa' ? 'kanagawa' : 'general');
  const [targetTotalScore, setTargetTotalScore] = React.useState<number>(700);
  const [targetScoreInputValue, setTargetScoreInputValue] = React.useState<string>('700');
  const [currentNaishin, setCurrentNaishin] = React.useState<number>(300);
  const [naishinInputValue, setNaishinInputValue] = React.useState<string>('300');
  const [naishinRatio, setNaishinRatio] = React.useState<number>(30);
  const [examMaxScore, setExamMaxScore] = React.useState<number>(500);
  const [examMaxInputValue, setExamMaxInputValue] = React.useState<string>('500');
  const [naishinRatioInputValue, setNaishinRatioInputValue] = React.useState<string>('30');
  const [result, setResult] = React.useState<ReverseResult | null>(null);
  const [tokyoKansoNaishin, setTokyoKansoNaishin] = React.useState<number>(45);
  const [osakaType, setOsakaType] = React.useState<string>('II'); // デフォルトはタイプII
  const [copied, setCopied] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [isPrefectureDropdownOpen, setIsPrefectureDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const prefecture = React.useMemo(() => getPrefectureByCode(prefectureCode), [prefectureCode]);
  const naishinMax = React.useMemo(() => calculateMaxScore(prefectureCode), [prefectureCode]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPrefectureDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    // 都道府県ごとの逆算設定を反映
    if (prefecture?.reverseCalc) {
      const { defaultRatio, examMaxScore, totalMaxScore } = prefecture.reverseCalc;
      setNaishinRatio(defaultRatio.naishin);
      setNaishinRatioInputValue(String(defaultRatio.naishin));
      setExamMaxScore(examMaxScore);
      setExamMaxInputValue(String(examMaxScore));
      setTargetTotalScore(Math.round(totalMaxScore * 0.7)); // 満点の70%を目標に設定
      setTargetScoreInputValue(String(Math.round(totalMaxScore * 0.7)));
    } else {
      // 従来の設定（逆算設定がない都道府県）
      const examData = getExamRatioByCode(prefectureCode);
      const config = examData?.generalExam ?? DEFAULT_EXAM_RATIO;
      setNaishinRatio(config.naishinRatio);
      setNaishinRatioInputValue(String(config.naishinRatio));
      setExamMaxScore(config.examMaxScore);
      setExamMaxInputValue(String(config.examMaxScore));
      setTargetTotalScore(Math.round((config.examMaxScore + naishinMax) * 0.7));
      setTargetScoreInputValue(String(Math.round((config.examMaxScore + naishinMax) * 0.7)));
    }
  }, [prefectureCode, prefecture, naishinMax]);

  const calculate = React.useCallback(() => {
    setValidationError(null);

    const naishinNum = Number(currentNaishin);
    const targetScoreNum = Number(targetTotalScore);

    if (naishinNum < 0 || naishinNum > naishinMax) {
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
    if (targetScoreNum < 0) {
      setValidationError('目標合計点は0以上で入力してください。');
      return;
    }

    const examRatio = 100 - naishinRatio;
    let requiredExamScore: number;
    let examPercent: number;
    let perSubjectScore: number;
    let isAchievable: boolean;
    let message: string;

    // 都道府県別の計算ロジック
    const prefecture = getPrefectureByCode(prefectureCode);
    if (prefecture?.reverseCalc) {
      const { totalMaxScore, examMaxScore, calcType, naishinMultiplier, kValue, sValueCoefficients, osakaTypes, tokyoSettings, kanagawaSettings } = prefecture.reverseCalc;
      
      switch (calcType) {
        case 'osaka':
          // 大阪府: 900点満点方式（タイプ別）
          const selectedType = osakaTypes?.find(t => t.code === osakaType) || osakaTypes?.[1]; // デフォルトはタイプII
          const naishinContribution = naishinNum * (selectedType?.naishinMultiplier || 0.8);
          const examContributionNeeded = targetScoreNum - naishinContribution;
          requiredExamScore = Math.round(examContributionNeeded / (selectedType?.examMultiplier || 1.2));
          examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
          const osakaRawPerSubjectScore = Math.round(requiredExamScore / 5);
          perSubjectScore = osakaRawPerSubjectScore > 100 ? -1 : osakaRawPerSubjectScore; // 101点以上は-1に設定
          isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          break;

        case 'tokyo':
          // 東京都: 1020点満点方式（実技教科2倍ルール考慮）
          if (tokyoSettings) {
            // 内申点の計算：主要5教科(1倍) + 実技4教科(2倍) = 65点満点
            // これを300点満点に換算
            const naishin300 = naishinNum * tokyoSettings.naishinConversion.totalMultiplier;
            const tokyoNaishinContribution = naishin300 * (naishinRatio / 100);
            const tokyoExamNeeded = targetScoreNum - tokyoNaishinContribution;
            requiredExamScore = Math.round(tokyoExamNeeded);
            examPercent = Math.round((requiredExamScore / (examMaxScore - tokyoSettings.esatjMaxScore)) * 100);
            const rawPerSubjectScore = Math.round(requiredExamScore / 5);
            perSubjectScore = rawPerSubjectScore > 100 ? -1 : rawPerSubjectScore; // 101点以上は-1に設定
            isAchievable = requiredExamScore <= (examMaxScore - tokyoSettings.esatjMaxScore) && requiredExamScore >= 0;
          } else {
            // 従来の計算（フォールバック）
            const tokyoNaishinContribution = naishinNum * (naishinRatio / 100) * 3;
            const tokyoExamNeeded = targetScoreNum - tokyoNaishinContribution;
            requiredExamScore = Math.round(tokyoExamNeeded);
            examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
            const rawPerSubjectScore = Math.round(requiredExamScore / 5);
            perSubjectScore = rawPerSubjectScore > 100 ? -1 : rawPerSubjectScore; // 101点以上は-1に設定
            isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          }
          break;

        case 'kanagawa':
          // 神奈川県: S値方式（中2・中3比率考慮）
          if (kanagawaSettings) {
            // 注意：現在の内申点は中3のみを想定
            // 実際には中2の成績も必要だが、簡易計算として中3の成績から推定
            const estimatedGrade2Score = naishinNum * 0.8; // 中2の成績を中3の80%と仮定
            const sValueNaishin = (estimatedGrade2Score * kanagawaSettings.gradeMultipliers.grade2 + naishinNum * kanagawaSettings.gradeMultipliers.grade3);
            const kanagawaNaishinContribution = sValueNaishin * (sValueCoefficients?.academic || 0.8);
            const kanagawaExamNeeded = targetScoreNum - kanagawaNaishinContribution;
            requiredExamScore = Math.round(kanagawaExamNeeded);
            examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
            const rawPerSubjectScore = Math.round(requiredExamScore / 5);
            perSubjectScore = rawPerSubjectScore > 100 ? -1 : rawPerSubjectScore; // 101点以上は-1に設定
            isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          } else {
            // 従来の計算（フォールバック）
            const sValueCoeff = sValueCoefficients?.academic || 0.8;
            const kanagawaNaishinContribution = naishinNum * sValueCoeff;
            const kanagawaExamNeeded = targetScoreNum - kanagawaNaishinContribution;
            requiredExamScore = Math.round(kanagawaExamNeeded);
            examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
            const rawPerSubjectScore = Math.round(requiredExamScore / 5);
            perSubjectScore = rawPerSubjectScore > 100 ? -1 : rawPerSubjectScore; // 101点以上は-1に設定
            isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          }
          break;

        case 'chiba':
          // 千葉県: K値方式
          const chibaKValue = kValue || 1;
          const chibaNaishinContribution = naishinNum * chibaKValue;
          const chibaExamNeeded = targetScoreNum - chibaNaishinContribution;
          requiredExamScore = Math.round(chibaExamNeeded);
          examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
          const chibaRawPerSubjectScore = Math.round(requiredExamScore / 5);
          perSubjectScore = chibaRawPerSubjectScore > 100 ? -1 : chibaRawPerSubjectScore; // 101点以上は-1に設定
          isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          break;

        case 'saitama':
          // 埼玉県: 標準計算
          const saitamaNaishinContribution = naishinNum * (naishinRatio / 100);
          const saitamaExamNeeded = targetScoreNum - saitamaNaishinContribution;
          requiredExamScore = Math.round(saitamaExamNeeded);
          examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
          const saitamaRawPerSubjectScore = Math.round(requiredExamScore / 5);
          perSubjectScore = saitamaRawPerSubjectScore > 100 ? -1 : saitamaRawPerSubjectScore; // 101点以上は-1に設定
          isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          break;

        default:
          // 標準計算
          const standardNaishinContribution = naishinNum * (naishinRatio / 100);
          const standardExamNeeded = targetScoreNum - standardNaishinContribution;
          requiredExamScore = Math.round(standardExamNeeded);
          examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
          const standardRawPerSubjectScore = Math.round(requiredExamScore / 5);
          perSubjectScore = standardRawPerSubjectScore > 100 ? -1 : standardRawPerSubjectScore; // 101点以上は-1に設定
          isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
          break;
      }
    } else {
      // 従来の計算（逆算設定がない都道府県）
      const standardNaishinContribution = naishinNum * (naishinRatio / 100);
      const standardExamNeeded = targetScoreNum - standardNaishinContribution;
      requiredExamScore = Math.round(standardExamNeeded * 100) / examRatio;
      examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
      const legacyRawPerSubjectScore = Math.round(requiredExamScore / 5);
      perSubjectScore = legacyRawPerSubjectScore > 100 ? -1 : legacyRawPerSubjectScore; // 101点以上は-1に設定
      isAchievable = requiredExamScore <= examMaxScore && requiredExamScore >= 0;
    }

    // メッセージ生成
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
      requiredExamScore: Math.max(0, Math.min(examMaxScore, Math.round(requiredExamScore))),
      examMaxScore,
      examPercent: Math.max(0, Math.min(100, examPercent)),
      perSubjectScore: Math.max(0, perSubjectScore),
      isAchievable,
      message,
    });
  }, [prefectureCode, currentNaishin, naishinMax, targetTotalScore, naishinRatio, examMaxScore, osakaType]);

  // 大阪府のタイプが変更されたら再計算
  React.useEffect(() => {
    if (prefectureCode === 'osaka' && Number(currentNaishin) > 0 && Number(targetTotalScore) > 0) {
      calculate();
    }
  }, [osakaType, prefectureCode, currentNaishin, targetTotalScore, calculate]);

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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('general');
                if (prefectureCode === 'tokyo') setPrefectureCode('tokyo');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all transform hover:scale-105 shadow-md ${mode === 'general' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'}`}
            >
              一般モード
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('tokyo');
                setPrefectureCode('tokyo');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all transform hover:scale-105 shadow-md ${mode === 'tokyo' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300'}`}
            >
              東京都(1020)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('kanagawa');
                setPrefectureCode('kanagawa');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all transform hover:scale-105 shadow-md ${mode === 'kanagawa' ? 'bg-indigo-500 text-white shadow-indigo-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'}`}
            >
              神奈川(S1/S2)
            </button>
          </div>

          {/* 高校別プリセット */}
          {mode === 'general' && prefectureCode && SCHOOL_PRESETS[prefectureCode as keyof typeof SCHOOL_PRESETS] && (
            <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-purple-700">{getPrefectureByCode(prefectureCode)?.name} 上位校の比率</span>
                <Info className="h-4 w-4 text-purple-500" />
              </div>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {SCHOOL_PRESETS[prefectureCode as keyof typeof SCHOOL_PRESETS].map((school, index) => {
                  const totalRatio = Object.values(school.ratio).reduce((sum, val) => sum + val, 0);
                  const naishinRatio = Math.round((school.ratio.naishin / totalRatio) * 100);
                  const examRatio = Math.round((school.ratio.gakuryoku / totalRatio) * 100);
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setNaishinRatio(naishinRatio);
                        setExamMaxScore(school.examMax);
                      }}
                      className="rounded-lg border border-purple-200 bg-white p-3 text-left hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-purple-800 text-sm">{school.name}</div>
                          <div className="text-xs text-slate-600 mt-1">{school.description}</div>
                          <div className="text-xs text-purple-600 mt-1">内申{naishinRatio}%・学力{examRatio}%</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {school.features.slice(0, 2).map((feature, i) => (
                              <span key={i} className="inline-block px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            school.type === '進学校' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {school.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 都道府県別プリセット */}
          {mode === 'general' && prefectureCode && RATIO_PRESETS[prefectureCode as keyof typeof RATIO_PRESETS] && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{getPrefectureByCode(prefectureCode)?.name}のよくある比率</span>
                <Info className="h-4 w-4 text-slate-500" />
              </div>
              <div className="grid gap-2">
                {RATIO_PRESETS[prefectureCode as keyof typeof RATIO_PRESETS].map((preset, index) => {
                  const totalRatio = Object.values(preset.ratio).reduce((sum, val) => sum + val, 0);
                  const naishinRatio = Math.round((preset.ratio.naishin / totalRatio) * 100);
                  const examRatio = Math.round((preset.ratio.gakuryoku / totalRatio) * 100);
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setNaishinRatio(naishinRatio);
                        setExamMaxScore(500); // デフォルト値
                      }}
                      className="rounded-lg border border-blue-200 bg-white p-3 text-left hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-blue-700 text-sm">{preset.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{preset.description}</div>
                      <div className="text-xs text-blue-600 mt-1">内申{naishinRatio}%・学力{examRatio}%</div>
                      <div className="text-xs text-amber-600 mt-1">{preset.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 従来のプリセット */}
          {mode === 'general' && prefectureCode && PREFECTURE_RATIO_PRESETS[prefectureCode] && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">従来の比率プリセット</span>
                <Info className="h-4 w-4 text-slate-500" />
              </div>
              <div className="grid gap-2">
                {PREFECTURE_RATIO_PRESETS[prefectureCode].map((preset, index) => (
                  <div key={index} className="rounded-lg border border-blue-200 bg-white p-3 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-blue-700 text-sm">{preset.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{preset.description}</div>
                        <div className="text-xs text-blue-600 mt-1">内申{preset.ratio}%・学力{100-preset.ratio}%</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setNaishinRatio(preset.ratio);
                            setExamMaxScore(preset.examMax);
                          }}
                          className="rounded px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          適用
                        </button>
                        <Link
                          href={`/${prefectureCode}/naishin`}
                          className="rounded px-2 py-1 text-xs bg-slate-500 text-white hover:bg-slate-600 transition-colors"
                        >
                          詳細
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 用語ヘルプ */}
          <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-800">用語ヘルプ</span>
              <Info className="h-4 w-4 text-amber-600" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(TERM_HELP).map(([term, help]) => (
                <div key={term} className="rounded-lg border border-amber-200 bg-white p-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`${help.title}\n\n${help.description}`)}
                      className="rounded-full bg-amber-100 p-1 hover:bg-amber-200 transition-colors"
                    >
                      <HelpCircle className="h-3 w-3 text-amber-700" />
                    </button>
                    <div className="flex-1">
                      <div className="font-semibold text-amber-700 text-sm">{term}</div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{help.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                      const value = e.target.value;
                      if (value === '') {
                        setTokyoKansoNaishin(0);
                        if (typeof window !== 'undefined') {
                          window.localStorage.setItem('my-naishin:tokyo-kanso', '0');
                        }
                      } else {
                        const next = Math.min(65, Math.max(0, Number(value)));
                        if (!isNaN(next)) {
                          setTokyoKansoNaishin(next);
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem('my-naishin:tokyo-kanso', String(next));
                          }
                        }
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
            <div ref={dropdownRef}>
              <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-700">都道府県の選択</h3>
                <p className="text-xs text-slate-500">お住まいの地域を選んでください</p>
              </div>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPrefectureDropdownOpen(!isPrefectureDropdownOpen)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left transition-all shadow-sm hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-800">
                        {prefecture?.name ?? '都道府県を選択'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {prefecture?.description ?? '計算方法を選んでください'}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2">
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isPrefectureDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isPrefectureDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="max-h-80 overflow-y-auto">
                      {PREFECTURES.map((pref) => (
                        <button
                          key={pref.code}
                          type="button"
                          onClick={() => {
                            setPrefectureCode(pref.code);
                            setIsPrefectureDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
                            prefectureCode === pref.code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="font-medium text-slate-800">{pref.name}</div>
                          <div className="text-xs text-slate-500">{pref.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-1 text-xs text-slate-500">
                選択すると自動で配点比率が設定されます
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
                  <span className="ml-1 text-xs font-normal text-amber-500">※必須</span>
                  <span className="ml-1 text-xs font-normal text-slate-500">（内申＋当日点の合計）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={targetScoreInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[0-9]+$/.test(value)) {
                        setTargetScoreInputValue(value);
                        setTargetTotalScore(value === '' ? 0 : Number(value));
                      }
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder={`例: ${prefecture?.reverseCalc ? Math.round(prefecture.reverseCalc.totalMaxScore * 0.7) : "700"}`}
                  />
                  <span className="text-sm text-slate-500">点</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {prefecture?.reverseCalc 
                    ? `${prefecture.name}なら${Math.round(prefecture.reverseCalc.totalMaxScore * 0.7)}点程度（${prefecture.reverseCalc.totalMaxScore}点満点中）`
                    : '合格ラインの目安（例: 東京都なら720点程度）'
                  }
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {prefectureCode === 'kanagawa' ? 'A（評定合計）' : '現在の内申点'}
                  <span className="ml-1 text-xs font-normal text-amber-500">※必須</span>
                  <span className="ml-1 text-xs font-normal text-slate-500">（{naishinMax}点満点）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={naishinInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[0-9]+$/.test(value)) {
                        setNaishinInputValue(value);
                        setCurrentNaishin(value === '' ? 0 : Number(value));
                      }
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder={`例: ${Math.round(naishinMax * 0.8)}`}
                  />
                  <span className="text-sm text-slate-500">点</span>
                </div>
                {prefectureCode === 'kanagawa' && (
                  <div className="mt-2 text-xs text-slate-500">
                    a値（100点換算）: {currentNaishin > 0 ? Math.round((currentNaishin / naishinMax) * 100) : 0}点
                  </div>
                )}
                <div className="mt-1 text-xs text-slate-500">
                  不明な場合は先に内申点を計算 → 
                  <Link href="/" className="text-blue-600 hover:underline">計算ツール</Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Info className="h-4 w-4 text-slate-500" />
                配点設定（学校・入試方式によって異なります）
              </div>
              {prefectureCode === 'osaka' && prefecture?.reverseCalc?.osakaTypes && (
                <div className="mb-3">
                  <label className="mb-2 block text-xs font-medium text-slate-600">大阪府のタイプ選択</label>
                  <div className="flex flex-wrap gap-2">
                    {prefecture.reverseCalc.osakaTypes.map((type) => (
                      <button
                        key={type.code}
                        type="button"
                        onClick={() => setOsakaType(type.code)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          osakaType === type.code
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold">{type.name}</div>
                        <div className="text-[10px] text-slate-500">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {prefectureCode === 'kanagawa' && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {KANAGAWA_RATIO_PRESETS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        console.log('神奈川比率ボタンクリック:', ratio); // デバッグ用
                        const [naishin, exam] = ratio.split('-').map((n) => Number(n));
                        console.log('解析結果:', { naishin, exam }); // デバッグ用
                        if (Number.isFinite(naishin) && Number.isFinite(exam) && naishin + exam > 0) {
                          const ratioPercent = Math.round((naishin / (naishin + exam)) * 100);
                          console.log('設定する比率:', ratioPercent); // デバッグ用
                          setNaishinRatio(ratioPercent);
                          setNaishinRatioInputValue(String(ratioPercent));
                          setExamMaxScore(500); // 神奈川の場合は当日点を500点に設定
                          setExamMaxInputValue('500');
                          console.log('設定完了'); // デバッグ用
                        }
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
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
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={naishinRatioInputValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          const num = value === '' ? 0 : Number(value);
                          if (num <= 100) {
                            setNaishinRatioInputValue(value);
                            setNaishinRatio(num);
                          }
                        }
                      }}
                      className="h-10 w-20 rounded-lg border border-slate-200 bg-white px-3 text-center text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <span className="text-sm text-slate-500">%（当日点 {100 - naishinRatio}%）</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">当日点の満点</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={examMaxInputValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          setExamMaxInputValue(value);
                          setExamMaxScore(value === '' ? 0 : Number(value));
                        }
                      }}
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
                    {result.perSubjectScore === -1 ? 'N/A' : result.perSubjectScore}
                    <span className="text-lg text-violet-500">{result.perSubjectScore === -1 ? '' : '点'}</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 ${result.isAchievable ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className={`text-sm font-medium ${result.isAchievable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.message}
                </p>
              </div>

              {/* 安全圏/標準/挑戦の3ライン表示 */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-600 mb-3">目標ライン別必要点数</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-medium text-emerald-700">安全圏 (+20点)</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-800">
                      {Math.min(result.requiredExamScore + 20, result.examMaxScore)}点
                      <span className="text-xs text-emerald-600 ml-1">({Math.round(((Math.min(result.requiredExamScore + 20, result.examMaxScore) / result.examMaxScore) * 100))}%)</span>
                      {result.perSubjectScore === -1 && (
                        <span className="text-xs text-red-600 ml-2">1教科平均: N/A</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-blue-700">標準</span>
                    </div>
                    <div className="text-sm font-bold text-blue-800">
                      {result.requiredExamScore}点
                      <span className="text-xs text-blue-600 ml-1">({result.examPercent}%)</span>
                      {result.perSubjectScore === -1 && (
                        <span className="text-xs text-red-600 ml-2">1教科平均: N/A</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium text-orange-700">挑戦 (-20点)</span>
                    </div>
                    <div className="text-sm font-bold text-orange-800">
                      {Math.max(result.requiredExamScore - 20, 0)}点
                      <span className="text-xs text-orange-600 ml-1">({Math.round(((Math.max(result.requiredExamScore - 20, 0) / result.examMaxScore) * 100))}%)</span>
                      {result.perSubjectScore === -1 && (
                        <span className="text-xs text-red-600 ml-2">1教科平均: N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  ※ 安全圏は余裕を持った目標、挑戦は最低限の目標としてご活用ください
                </div>
              </div>

              {/* 3ラインの説明文（固定表示） */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <div className="text-xs font-bold text-slate-600 mb-3">目標ラインの意味</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5"></div>
                    <div>
                      <span className="text-sm font-medium text-emerald-700">安全圏：</span>
                      <span className="text-sm text-slate-600">当日のブレを吸収するライン</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div>
                      <span className="text-sm font-medium text-blue-700">標準：</span>
                      <span className="text-sm text-slate-600">合格ライン目安</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5"></div>
                    <div>
                      <span className="text-sm font-medium text-orange-700">挑戦：</span>
                      <span className="text-sm text-slate-600">最低限ライン（要リスク管理）</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 border-t border-slate-200 pt-3">
                  💡 上記の目標ラインを参考に、自分の学力や志望校に合わせた学習計画を立てましょう
                </div>
              </div>

              {/* 計算式（都道府県別） */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-600">計算式</div>
                <code className="mt-1 block text-xs leading-relaxed text-slate-500">
                  {prefecture?.reverseCalc ? (
                    prefecture.reverseCalc.calcType === 'osaka' ? (
                      <>
                        大阪府方式（{prefecture.reverseCalc.osakaTypes?.find(t => t.code === osakaType)?.name || 'タイプⅡ'}）: 目標{targetTotalScore}点 − 内申{currentNaishin}×{prefecture.reverseCalc.osakaTypes?.find(t => t.code === osakaType)?.naishinMultiplier || 0.8} ＝ 必要当日点{result.requiredExamScore}点（450点満点中{result.examPercent}%）
                      </>
                    ) : prefecture.reverseCalc.calcType === 'tokyo' ? (
                      <>
                        東京都方式: 目標{targetTotalScore}点 − 内申{currentNaishin}×{(300/65).toFixed(2)}（実技2倍換算）＝ 必要当日点{result.requiredExamScore}点（{prefecture.reverseCalc.tokyoSettings ? (examMaxScore - prefecture.reverseCalc.tokyoSettings.esatjMaxScore) : examMaxScore}点満点中{result.examPercent}%）
                        {prefecture.reverseCalc.tokyoSettings && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            ※ ESAT-J（スピーキングテスト）{prefecture.reverseCalc.tokyoSettings.esatjMaxScore}点を除く
                          </div>
                        )}
                      </>
                    ) : prefecture.reverseCalc.calcType === 'kanagawa' ? (
                      <>
                        神奈川県方式: 目標{targetTotalScore}点 − S値（中2×1 + 中3×2）×0.8 ＝ 必要当日点{result.requiredExamScore}点（500点満点中{result.examPercent}%）
                        {prefecture.reverseCalc.kanagawaSettings && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            ※ 中2成績を中3の80%と仮定して推定
                          </div>
                        )}
                      </>
                    ) : prefecture.reverseCalc.calcType === 'chiba' ? (
                      <>
                        千葉県方式: 目標{targetTotalScore}点 − 内申{currentNaishin}×K値 ＝ 必要当日点{result.requiredExamScore}点（500点満点中{result.examPercent}%）
                      </>
                    ) : (
                      <>
                        目標合計点{targetTotalScore} − 内申寄与分（{currentNaishin} × {naishinRatio}%）＝ 当日点寄与分 → 必要当日点{result.requiredExamScore}/{result.examMaxScore}（{result.examPercent}%）
                      </>
                    )
                  ) : (
                    <>
                      目標合計点{targetTotalScore} − 内申寄与分（{currentNaishin} × {naishinRatio}%）＝ 当日点寄与分 → 必要当日点{result.requiredExamScore}/{result.examMaxScore}（{result.examPercent}%）
                    </>
                  )}
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

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <div className="font-bold mb-1">⚠️ 重要な注意事項</div>
                    <div className="space-y-1 text-amber-700">
                      <div>• このシミュレーションは一般的な配点比率に基づいています</div>
                      <div>• 実技教科の換算（東京都）、学年ごとの内申比率（神奈川県）は考慮されていません</div>
                      <div>• <strong>傾斜配点</strong>：理数科・国際科などで特定教科（英語・数学）の点数が1.5〜2倍になる場合があります</div>
                      <div>• 大阪府のタイプ別倍率、東京都のESAT-J（スピーキングテスト）は含まれていません</div>
                      <div className="font-semibold mt-2 pt-2 border-t border-amber-200">
                        正確な合否判定には、必ず志望校の募集要項をご確認ください
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
