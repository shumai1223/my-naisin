'use client';

import * as React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

import { InputForm } from '@/components/Calculator/InputForm';
import { PrefectureSelector } from '@/components/Calculator/PrefectureSelector';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { DEFAULT_SCORES } from '@/lib/constants';
import { diagnoseNaishinType, type NaishinTypeResult } from '@/lib/naishin-type-diagnosis';
import { getPrefectureByCode, DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { EVENTS, track } from '@/lib/track';
import type { Scores } from '@/lib/types';

/**
 * 内申点タイプ診断（ZZ-5c・診断プロダクト1本）。
 * 9教科評定→決定論マッピングのみ（優劣・ランクを含まない4タイプ）。
 * 撤退基準はdocs/naishin-type-shindan-retirement-criteria.mdに明文化済み。
 */
export function NaishinTypeShindanClient() {
  const [prefectureCode, setPrefectureCode] = React.useState(DEFAULT_PREFECTURE_CODE);
  const [use10PointScale, setUse10PointScale] = React.useState(false);
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [result, setResult] = React.useState<NaishinTypeResult | null>(null);
  const viewTracked = React.useRef(false);

  const prefectureName = getPrefectureByCode(prefectureCode)?.name;

  const onScoreChange = React.useCallback((key: keyof Scores, next: number) => {
    setScores((prev) => ({ ...prev, [key]: next }));
  }, []);

  const onDiagnose = React.useCallback(() => {
    const r = diagnoseNaishinType(scores, prefectureCode);
    setResult(r);
    if (!viewTracked.current) {
      viewTracked.current = true;
      track(EVENTS.NAISHIN_TYPE_RESULT, { type_id: r.type.id, pref: prefectureCode });
    }
    window.requestAnimationFrame(() => {
      document.getElementById('naishin-type-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [scores, prefectureCode]);

  const onRetry = React.useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="space-y-6">
      <PrefectureSelector
        selectedCode={prefectureCode}
        onChange={setPrefectureCode}
        use10PointScale={use10PointScale}
        onScale10Change={setUse10PointScale}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-700">9教科の評定を入力してください</h2>
        <InputForm prefectureCode={prefectureCode} scores={scores} onChange={onScoreChange} maxGrade={use10PointScale ? 10 : 5} />
      </div>

      <button
        type="button"
        onClick={onDiagnose}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl"
      >
        <Sparkles className="h-5 w-5" />
        タイプを診断する
      </button>

      {result && (
        <div id="naishin-type-result" className="scroll-mt-24 space-y-6">
          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
            <div className="text-xs font-bold text-blue-600">あなたの内申点タイプ</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{result.type.label}</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{result.type.basis}</p>
            {result.prefectureNote && (
              <p className="mt-3 rounded-xl border border-blue-100 bg-white/70 p-3 text-xs leading-relaxed text-slate-600">
                {result.prefectureNote}
              </p>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              ※タイプに優劣はありません。9教科の評定パターンと、お住まいの都道府県の制度（検証済みデータ）から機械的に分類したものです。
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              評定を入力し直す
            </button>
          </div>

          <SaveResultCTA
            source="naishin-type-shindan"
            score={Math.round(result.coreAverage * 5 + result.practicalAverage * 4)}
            max={45}
            prefectureCode={prefectureCode}
            prefectureName={prefectureName}
            metricLabel="内申点タイプ診断"
            heading="診断結果を記録しませんか？"
            body="今回の診断結果と入力した評定を保存し、内申点対策のコツを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
          />
        </div>
      )}
    </div>
  );
}
