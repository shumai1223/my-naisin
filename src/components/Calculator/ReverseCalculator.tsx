'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calculator, ArrowLeft, ChevronDown, ExternalLink, Copy, Check, HelpCircle, AlertTriangle } from '@/components/icons';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getExamRatioByCode, DEFAULT_EXAM_RATIO } from '@/lib/prefecture-exam-data';
import { RATIO_PRESETS } from '@/lib/presets';
import { SCHOOL_PRESETS } from '@/lib/school-presets';
import { calculateMaxScore } from '@/lib/utils';
import { requiredExamForS1 } from '@/lib/kanagawa-s-value';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TokyoExtendedCalculator } from '@/components/Calculator/TokyoExtendedCalculator';
import { EVENTS, funnel, trackEvent } from '@/lib/track';

interface ReverseCalculatorProps {
  onBack: () => void;
  /**
   * 結果連動CTA（C-14）：必要当日点/満点と、選択中の都道府県を親へ持ち上げる。
   * 都道府県セレクタは内部stateのため、結果とあわせて渡さないと親側でCTAを県別最適化できない。
   */
  onResult?: (result: ReverseResult | null, context: { prefectureCode: string; prefectureName?: string }) => void;
}

export interface ReverseResult {
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

// フォーカスの輪郭（入力・ボタン共通。DESIGN-SYSTEM.md §3 入力）
const FOCUS_OUTLINE = 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700';
// 数値入力の見た目（高さ・幅・文字サイズは呼び出し側で足す）
const INPUT_BASE = `rounded border border-slate-300 bg-white tabular-nums text-slate-900 ${FOCUS_OUTLINE}`;
// 切り替えボタン（選択中 / それ以外）
const TOGGLE_ON = 'border-brand-700 bg-brand-700 text-white';
const TOGGLE_OFF = 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50';

export function ReverseCalculator({ onBack, onResult }: ReverseCalculatorProps) {
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
      const { totalMaxScore, examMaxScore, calcType, naishinMultiplier, kValue, osakaTypes, tokyoSettings } = prefecture.reverseCalc;
      
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

        case 'kanagawa': {
          // 神奈川県: S1値方式。式の単一ソースは src/lib/kanagawa-s-value.ts
          // （出典: 神奈川県教育委員会 入学者選抜情報。/kanagawa/s-value と同一の式）。
          const kanagawaResult = requiredExamForS1({
            targetS1: targetScoreNum,
            naishinTotal: naishinNum,
            naishinRatio,
          });
          requiredExamScore = kanagawaResult.requiredExamScore;
          examPercent = Math.round((requiredExamScore / examMaxScore) * 100);
          const rawPerSubjectScore = Math.round(requiredExamScore / 5);
          perSubjectScore = rawPerSubjectScore > 100 ? -1 : rawPerSubjectScore; // 101点以上は-1に設定
          isAchievable = kanagawaResult.isAchievable;
          break;
        }

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
        message = '現在の内申点だけで目標を達成できます。';
      }
    } else if (examPercent >= 90) {
      message = '非常に高い当日点が必要です。内申点アップも検討しましょう。';
    } else if (examPercent >= 70) {
      message = '当日点で挽回可能ですが、内申点も上げると楽になります。';
    } else {
      message = '十分達成可能な目標です。この調子で頑張りましょう。';
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

  // 最高インテント面の計装：明示的に「計算」を押した瞬間だけ reverse_calc_use を送る
  // （osaka の自動再計算では発火させない＝意図的な利用のみ計測）。これが GA4 で cta_view23 に対し
  // 換金0だった最高インテント面の「実利用」の分母になる。
  const handleCalculate = React.useCallback(() => {
    trackEvent(EVENTS.REVERSE_CALC_USE, { pref: prefectureCode, tool: 'reverse', mode });
    calculate();
  }, [calculate, prefectureCode, mode]);

  // 結果が初めて出たら result_view を一度だけ（換金ファネルの分母を /reverse でも確立）。
  const resultViewFiredRef = React.useRef(false);
  React.useEffect(() => {
    if (result && !resultViewFiredRef.current) {
      resultViewFiredRef.current = true;
      funnel.resultView({ pref: prefectureCode, tool: 'reverse', placement: 'result' });
    }
  }, [result, prefectureCode]);

  // 結果連動CTA（C-14）：必要当日点/満点と選択県を親へ持ち上げ、SaveResultCTA/ParentWindowBridgeを個別化する。
  React.useEffect(() => {
    onResult?.(result, { prefectureCode, prefectureName: prefecture?.name });
  }, [result, onResult, prefectureCode, prefecture]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="border-b border-slate-200 px-5 py-5 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">志望校から逆算</h2>
              <p className="mt-1 text-sm text-slate-600">目標点から必要な当日点を計算</p>
            </div>
            <Button variant="secondary" size="sm" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              戻る
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('general');
                if (prefectureCode === 'tokyo') setPrefectureCode('tokyo');
              }}
              aria-pressed={mode === 'general'}
              className={`min-h-11 rounded border px-4 text-sm font-bold transition-colors duration-100 ${mode === 'general' ? TOGGLE_ON : TOGGLE_OFF}`}
            >
              一般モード
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('tokyo');
                setPrefectureCode('tokyo');
              }}
              aria-pressed={mode === 'tokyo'}
              className={`min-h-11 rounded border px-4 text-sm font-bold transition-colors duration-100 ${mode === 'tokyo' ? TOGGLE_ON : TOGGLE_OFF}`}
            >
              東京都(1020)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('kanagawa');
                setPrefectureCode('kanagawa');
              }}
              aria-pressed={mode === 'kanagawa'}
              className={`min-h-11 rounded border px-4 text-sm font-bold transition-colors duration-100 ${mode === 'kanagawa' ? TOGGLE_ON : TOGGLE_OFF}`}
            >
              神奈川(S1/S2)
            </button>
          </div>

          {/* 高校別プリセット */}
          {mode === 'general' && prefectureCode && SCHOOL_PRESETS[prefectureCode as keyof typeof SCHOOL_PRESETS] && (
            <section>
              <h3 className="mb-2 text-base font-bold text-slate-900">{getPrefectureByCode(prefectureCode)?.name} 上位校の比率</h3>
              <div className="grid max-h-60 gap-2 overflow-y-auto">
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
                      className="rounded border border-slate-200 bg-white p-3 text-left transition-colors duration-100 hover:bg-brand-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-slate-900">{school.name}</div>
                          <div className="mt-1 text-xs text-slate-600">{school.description}</div>
                          <div className="mt-1 text-xs tabular-nums text-slate-600">内申{naishinRatio}%・学力{examRatio}%</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {school.features.slice(0, 2).map((feature, i) => (
                              <span key={i} className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                            {school.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 都道府県別プリセット */}
          {mode === 'general' && prefectureCode && RATIO_PRESETS[prefectureCode as keyof typeof RATIO_PRESETS] && (
            <section>
              <h3 className="mb-2 text-base font-bold text-slate-900">{getPrefectureByCode(prefectureCode)?.name}のよくある比率</h3>
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
                      className="rounded border border-slate-200 bg-white p-3 text-left transition-colors duration-100 hover:bg-brand-50"
                    >
                      <div className="text-sm font-bold text-slate-900">{preset.name}</div>
                      <div className="mt-1 text-xs text-slate-600">{preset.description}</div>
                      <div className="mt-1 text-xs tabular-nums text-slate-700">内申{naishinRatio}%・学力{examRatio}%</div>
                      <div className="mt-1 text-xs text-amber-900">{preset.note}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 従来のプリセット */}
          {mode === 'general' && prefectureCode && PREFECTURE_RATIO_PRESETS[prefectureCode] && (
            <section>
              <h3 className="mb-2 text-base font-bold text-slate-900">従来の比率プリセット</h3>
              <div className="grid gap-2">
                {PREFECTURE_RATIO_PRESETS[prefectureCode].map((preset, index) => (
                  <div key={index} className="rounded border border-slate-200 bg-white p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900">{preset.label}</div>
                        <div className="mt-1 text-xs text-slate-600">{preset.description}</div>
                        <div className="mt-1 text-xs tabular-nums text-slate-700">内申{preset.ratio}%・学力{100-preset.ratio}%</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNaishinRatio(preset.ratio);
                            setExamMaxScore(preset.examMax);
                          }}
                          className="inline-flex min-h-11 items-center rounded bg-brand-700 px-4 text-sm font-bold text-white transition-colors duration-100 hover:bg-brand-800"
                        >
                          適用
                        </button>
                        <Link
                          href={`/${prefectureCode}/naishin`}
                          className="inline-flex min-h-11 items-center rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors duration-100 hover:bg-brand-50"
                        >
                          詳細
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 用語ヘルプ */}
          <section>
            <h3 className="mb-2 text-base font-bold text-slate-900">用語ヘルプ</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(TERM_HELP).map(([term, help]) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => alert(`${help.title}\n\n${help.description}`)}
                  aria-label={help.title}
                  className="flex min-h-11 items-start gap-2 rounded border border-slate-200 bg-white p-3 text-left transition-colors duration-100 hover:bg-brand-50"
                >
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">{term}</span>
                    <span className="mt-1 block text-xs text-slate-600 line-clamp-2">{help.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {mode === 'tokyo' ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-[1.8] text-slate-900">
                都立一般（1020点満点）を自動設定しています。換算内申・学力検査・ESAT-Jで必要当日点を逆算できます。
              </div>
              <div>
                <label htmlFor="reverse-tokyo-kanso-naishin" className="mb-2 block text-sm font-bold text-slate-900">現在の換算内申</label>
                <div className="flex items-center gap-2">
                  <input
                    id="reverse-tokyo-kanso-naishin"
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
                    className={`h-11 w-32 px-3 text-center text-base font-bold ${INPUT_BASE}`}
                  />
                  <span className="text-sm text-slate-600">/65点</span>
                </div>
              </div>
              <TokyoExtendedCalculator kansoNaishin={tokyoKansoNaishin} headingLevel="h3" />
            </div>
          ) : (
          <div className="space-y-6">
            <div ref={dropdownRef}>
              <div className="mb-2">
                <h3 className="text-base font-bold text-slate-900">都道府県の選択</h3>
                <p className="text-sm text-slate-600">お住まいの地域を選んでください</p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPrefectureDropdownOpen(!isPrefectureDropdownOpen)}
                  aria-expanded={isPrefectureDropdownOpen}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded border border-slate-300 bg-white px-4 py-3 text-left transition-colors duration-100 hover:bg-slate-50 ${FOCUS_OUTLINE}`}
                >
                  <div>
                    <div className="text-base font-bold text-slate-900">
                      {prefecture?.name ?? '都道府県を選択'}
                    </div>
                    <div className="text-sm text-slate-600">
                      {prefecture?.description ?? '計算方法を選んでください'}
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-600 ${isPrefectureDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPrefectureDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-overlay">
                    <div className="max-h-80 divide-y divide-slate-200 overflow-y-auto">
                      {PREFECTURES.map((pref) => (
                        <button
                          key={pref.code}
                          type="button"
                          onClick={() => {
                            setPrefectureCode(pref.code);
                            setIsPrefectureDropdownOpen(false);
                          }}
                          aria-current={prefectureCode === pref.code ? 'true' : undefined}
                          className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-100 hover:bg-brand-50 ${
                            prefectureCode === pref.code ? 'bg-brand-50' : ''
                          }`}
                        >
                          <span className="min-w-0">
                            <span className={`block text-slate-900 ${prefectureCode === pref.code ? 'font-bold' : ''}`}>{pref.name}</span>
                            <span className="block text-xs text-slate-600">{pref.description}</span>
                          </span>
                          {prefectureCode === pref.code && <Check className="h-4 w-4 shrink-0 text-brand-700" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm text-slate-600">
                選択すると自動で配点比率が設定されます
              </div>
              {prefecture?.sourceUrl && (
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  {prefecture.name}の公式情報を見る
                </a>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="reverse-target-score" className="mb-2 block text-sm font-bold text-slate-900">
                  目標総合点
                  <span className="ml-1 text-xs font-normal text-amber-900">※必須</span>
                  <span className="ml-1 text-xs font-normal text-slate-600">（内申＋当日点の合計）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="reverse-target-score"
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
                    className={`h-12 w-full px-4 text-lg font-bold ${INPUT_BASE}`}
                    placeholder={`例: ${prefecture?.reverseCalc ? Math.round(prefecture.reverseCalc.totalMaxScore * 0.7) : "700"}`}
                  />
                  <span className="text-sm text-slate-600">点</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {prefecture?.reverseCalc
                    ? `${prefecture.name}なら${Math.round(prefecture.reverseCalc.totalMaxScore * 0.7)}点程度（${prefecture.reverseCalc.totalMaxScore}点満点中）`
                    : '合格ラインの目安（例: 東京都なら720点程度）'
                  }
                </div>
              </div>

              <div>
                <label htmlFor="reverse-current-naishin" className="mb-2 block text-sm font-bold text-slate-900">
                  {prefectureCode === 'kanagawa' ? 'A（評定合計）' : '現在の内申点'}
                  <span className="ml-1 text-xs font-normal text-amber-900">※必須</span>
                  <span className="ml-1 text-xs font-normal text-slate-600">（{naishinMax}点満点）</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="reverse-current-naishin"
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
                    className={`h-12 w-full px-4 text-lg font-bold ${INPUT_BASE}`}
                    placeholder={`例: ${Math.round(naishinMax * 0.8)}`}
                  />
                  <span className="text-sm text-slate-600">点</span>
                </div>
                {prefectureCode === 'kanagawa' && (
                  <div className="mt-2 text-sm tabular-nums text-slate-600">
                    a値（100点換算）: {currentNaishin > 0 ? Math.round((currentNaishin / naishinMax) * 100) : 0}点
                  </div>
                )}
                <div className="mt-1 text-sm text-slate-600">
                  不明な場合は先に内申点を計算 →{' '}
                  <Link href="/" className="inline-flex min-h-11 items-center text-brand-700 underline underline-offset-2 hover:text-brand-800">計算ツール</Link>
                </div>
              </div>
            </div>

            <section className="border-t border-slate-200 pt-6">
              <h3 className="mb-3 text-base font-bold text-slate-900">配点設定（学校・入試方式によって異なります）</h3>
              {prefectureCode === 'osaka' && prefecture?.reverseCalc?.osakaTypes && (
                <div className="mb-4">
                  <div className="mb-2 text-sm text-slate-700">大阪府のタイプ選択</div>
                  <div className="flex flex-wrap gap-2">
                    {prefecture.reverseCalc.osakaTypes.map((type) => (
                      <button
                        key={type.code}
                        type="button"
                        onClick={() => setOsakaType(type.code)}
                        aria-pressed={osakaType === type.code}
                        className={`min-h-11 rounded border px-3 py-2 text-left text-sm transition-colors duration-100 ${
                          osakaType === type.code
                            ? 'border-brand-700 bg-brand-50 text-slate-900'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold">{type.name}</div>
                        <div className="text-xs text-slate-600">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {prefectureCode === 'kanagawa' && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {KANAGAWA_RATIO_PRESETS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        const [naishin, exam] = ratio.split('-').map((n) => Number(n));
                        if (Number.isFinite(naishin) && Number.isFinite(exam) && naishin + exam > 0) {
                          const ratioPercent = Math.round((naishin / (naishin + exam)) * 100);
                          setNaishinRatio(ratioPercent);
                          setNaishinRatioInputValue(String(ratioPercent));
                          setExamMaxScore(500); // 神奈川の場合は当日点を500点に設定
                          setExamMaxInputValue('500');
                        }
                      }}
                      className="inline-flex min-h-11 items-center rounded border border-slate-300 bg-white px-4 text-sm font-bold tabular-nums text-slate-700 transition-colors duration-100 hover:bg-slate-50"
                    >
                      {ratio.replace('-', ':')}
                    </button>
                  ))}
                  <div className="w-full text-sm text-slate-600">
                    ※ f:g は合計10（2以上の整数）。学校・学科ごとに異なる（2:8〜8:2）。特色検査は最大5。
                  </div>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="reverse-naishin-ratio" className="mb-1 block text-sm text-slate-700">内申点の比率</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="reverse-naishin-ratio"
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
                      className={`h-11 w-20 px-3 text-center text-base ${INPUT_BASE}`}
                    />
                    <span className="text-sm tabular-nums text-slate-600">%（当日点 {100 - naishinRatio}%）</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="reverse-exam-max" className="mb-1 block text-sm text-slate-700">当日点の満点</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="reverse-exam-max"
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
                      className={`h-11 w-24 px-3 text-center text-base ${INPUT_BASE}`}
                    />
                    <span className="text-sm text-slate-600">点</span>
                  </div>
                </div>
              </div>
            </section>

            {validationError && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {validationError}
              </div>
            )}

            <Button
              onClick={handleCalculate}
              leftIcon={<Calculator className="h-4 w-4" />}
              className="w-full"
            >
              必要な当日点を計算
            </Button>
          </div>
          )}
        </div>
      </Card>

      {result && (
        <div className="motion-safe:animate-fade-in">
          <Card>
            <div className="border-b border-slate-200 px-5 py-4 md:px-6">
              <h2 className="text-xl font-bold text-slate-900">逆算結果</h2>
            </div>
            <div className="p-5 md:p-6">
              <dl className="mb-6 grid divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="flex items-baseline justify-between gap-3 py-3 md:block md:px-4 md:py-4 md:text-center">
                  <dt className="text-sm text-slate-600">必要な当日点</dt>
                  <dd className="text-2xl font-bold tabular-nums text-slate-900">
                    {result.requiredExamScore}
                    <span className="text-base font-normal text-slate-600">/{result.examMaxScore}</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-3 md:block md:px-4 md:py-4 md:text-center">
                  <dt className="text-sm text-slate-600">得点率</dt>
                  <dd className="text-2xl font-bold tabular-nums text-slate-900">
                    {result.examPercent}
                    <span className="text-base font-normal text-slate-600">%</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-3 md:block md:px-4 md:py-4 md:text-center">
                  <dt className="text-sm text-slate-600">1教科平均</dt>
                  <dd className="text-2xl font-bold tabular-nums text-slate-900">
                    {result.perSubjectScore === -1 ? 'N/A' : result.perSubjectScore}
                    <span className="text-base font-normal text-slate-600">{result.perSubjectScore === -1 ? '' : '点'}</span>
                  </dd>
                </div>
              </dl>

              <div className={`rounded-lg border p-4 ${result.isAchievable ? 'border-slate-200 bg-brand-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className={`text-base leading-[1.8] ${result.isAchievable ? 'text-slate-900' : 'text-amber-900'}`}>
                  {result.message}
                </p>
              </div>

              {/* 安全圏/標準/挑戦の3ライン表示 */}
              <section className="mt-6">
                <h3 className="mb-2 text-base font-bold text-slate-900">目標ライン別必要点数</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <th scope="row" className="px-4 py-3 text-left font-normal text-slate-900">安全圏 (+20点)</th>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <span className="font-bold text-slate-900">{Math.min(result.requiredExamScore + 20, result.examMaxScore)}点</span>
                          <span className="ml-1 text-xs text-slate-600">({Math.round(((Math.min(result.requiredExamScore + 20, result.examMaxScore) / result.examMaxScore) * 100))}%)</span>
                          {result.perSubjectScore === -1 && (
                            <span className="ml-2 text-xs text-amber-900">1教科平均: N/A</span>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <th scope="row" className="px-4 py-3 text-left font-normal text-slate-900">標準</th>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <span className="font-bold text-slate-900">{result.requiredExamScore}点</span>
                          <span className="ml-1 text-xs text-slate-600">({result.examPercent}%)</span>
                          {result.perSubjectScore === -1 && (
                            <span className="ml-2 text-xs text-amber-900">1教科平均: N/A</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 text-left font-normal text-slate-900">挑戦 (-20点)</th>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <span className="font-bold text-slate-900">{Math.max(result.requiredExamScore - 20, 0)}点</span>
                          <span className="ml-1 text-xs text-slate-600">({Math.round(((Math.max(result.requiredExamScore - 20, 0) / result.examMaxScore) * 100))}%)</span>
                          {result.perSubjectScore === -1 && (
                            <span className="ml-2 text-xs text-amber-900">1教科平均: N/A</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  ※ 安全圏は余裕を持った目標、挑戦は最低限の目標としてご活用ください
                </div>
              </section>

              {/* 3ラインの説明文（固定表示） */}
              <section className="mt-6">
                <h3 className="mb-2 text-base font-bold text-slate-900">目標ラインの意味</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-baseline gap-1">
                    <dt className="shrink-0 font-bold text-slate-900">安全圏：</dt>
                    <dd className="text-slate-600">当日のブレを吸収するライン</dd>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <dt className="shrink-0 font-bold text-slate-900">標準：</dt>
                    <dd className="text-slate-600">合格ライン目安</dd>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <dt className="shrink-0 font-bold text-slate-900">挑戦：</dt>
                    <dd className="text-slate-600">最低限ライン（要リスク管理）</dd>
                  </div>
                </dl>
                <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
                  上記の目標ラインを参考に、自分の学力や志望校に合わせた学習計画を立てましょう
                </div>
              </section>

              {/* 計算式（都道府県別） */}
              <section className="mt-6">
                <h3 className="mb-2 text-base font-bold text-slate-900">計算式</h3>
                <code className="block break-words rounded border border-slate-200 bg-slate-50 p-3 font-sans text-sm leading-relaxed text-slate-700">
                  {prefecture?.reverseCalc ? (
                    prefecture.reverseCalc.calcType === 'osaka' ? (
                      <>
                        大阪府方式（{prefecture.reverseCalc.osakaTypes?.find(t => t.code === osakaType)?.name || 'タイプⅡ'}）: 目標{targetTotalScore}点 − 内申{currentNaishin}×{prefecture.reverseCalc.osakaTypes?.find(t => t.code === osakaType)?.naishinMultiplier || 0.8} ＝ 必要当日点{result.requiredExamScore}点（450点満点中{result.examPercent}%）
                      </>
                    ) : prefecture.reverseCalc.calcType === 'tokyo' ? (
                      <>
                        東京都方式: 目標{targetTotalScore}点 − 内申{currentNaishin}×{(300/65).toFixed(2)}（実技2倍換算）＝ 必要当日点{result.requiredExamScore}点（{prefecture.reverseCalc.tokyoSettings ? (examMaxScore - prefecture.reverseCalc.tokyoSettings.esatjMaxScore) : examMaxScore}点満点中{result.examPercent}%）
                        {prefecture.reverseCalc.tokyoSettings && (
                          <span className="mt-1 block text-xs text-slate-600">
                            ※ ESAT-J（スピーキングテスト）{prefecture.reverseCalc.tokyoSettings.esatjMaxScore}点を除く
                          </span>
                        )}
                      </>
                    ) : prefecture.reverseCalc.calcType === 'kanagawa' ? (
                      <>
                        神奈川県方式（S1値）: a=A÷135×100={Math.round((currentNaishin / naishinMax) * 100)} ／ 目標S1{targetTotalScore} − a×{Math.round(naishinRatio / 10)} ＝ 必要b×{Math.round((100 - naishinRatio) / 10)} → 必要当日点{result.requiredExamScore}点（500点満点中{result.examPercent}%）
                        <span className="mt-1 block text-xs text-slate-600">
                          ※ 特色検査（S2値）は本ツール未対応。S1値のみで計算
                        </span>
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
              </section>

              {/* コピーボタン */}
              <button
                type="button"
                onClick={() => {
                  const text = `必要当日点：${result.requiredExamScore}/${result.examMaxScore}（${result.examPercent}%）／1教科平均：${result.perSubjectScore}点`;
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors duration-100 hover:bg-brand-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'コピーしました' : '結果をコピー'}
              </button>

              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  重要な注意事項
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-[1.8] text-amber-900">
                  <li>このシミュレーションは一般的な配点比率に基づいています</li>
                  <li>実技教科の換算（東京都）、学年ごとの内申比率（神奈川県）は考慮されていません</li>
                  <li><strong>傾斜配点</strong>：理数科・国際科などで特定教科（英語・数学）の点数が1.5〜2倍になる場合があります</li>
                  <li>大阪府のタイプ別倍率、東京都のESAT-J（スピーキングテスト）は含まれていません</li>
                </ul>
                <p className="mt-3 border-t border-amber-200 pt-3 text-sm font-bold text-amber-900">
                  正確な合否判定には、必ず志望校の募集要項をご確認ください
                </p>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                ※ この計算は目安です。実際の配点は志望校・入試方式によって異なります。
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
