'use client';

import * as React from 'react';

import type { TotalScoreSystem } from '@/lib/total-score/types';
import { TotalScoreCalculator } from '@/components/TotalScore/TotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

interface TotalScoreResultFlowProps {
  system: TotalScoreSystem;
  saveHeading: string;
  saveBody: string;
}

/**
 * 総合得点クラスタ（買い意図が最も濃い）の結果連動 換金フロー。
 * 総合得点の実測値(total/max)を持ち上げ、計算後に SaveResultCTA を個別化＝成績カード＋保護者バトンを点灯。
 * 汎用 TotalScoreCalculator を使う全 [prefecture]/total-score 県を1ファイルでカバー。
 */
export function TotalScoreResultFlow({ system, saveHeading, saveBody }: TotalScoreResultFlowProps) {
  const [result, setResult] = React.useState<{ total: number; max: number } | null>(null);

  return (
    <>
      <TotalScoreCalculator system={system} onResult={setResult} />

      <ParentCostBridge prefectureName={system.name} className="mb-6" />

      <div id="save-result" className="scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode={system.code}
          prefectureName={system.name}
          className="mt-6"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `${system.name}の総合得点${result.total}点、志望校まで「あと何点」を受け取りませんか？`
              : saveHeading
          }
          body={saveBody}
        />
      </div>
    </>
  );
}
