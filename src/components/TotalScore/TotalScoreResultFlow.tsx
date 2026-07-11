'use client';

import * as React from 'react';

import type { TotalScoreSystem } from '@/lib/total-score/types';
import { TotalScoreCalculator } from '@/components/TotalScore/TotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ShindanEntryLink } from '@/components/ShindanEntryLink';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

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

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：総合得点の現在地＋成績カードを面談へ持って行く導線 */}
      <ParentWindowBridge
        className="mb-6"
        metricLabel="総合得点"
        score={result?.total}
        max={result?.max}
        prefectureCode={system.code}
        prefectureName={system.name}
      />

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

      {/* 塾診断ファネルへの入口（結果に合う塾を無料診断） */}
      <ShindanEntryLink className="mt-6" />

      {/* S-1: 匿名統計オプトイン。同意済みなら総合得点の実測値を匿名で自動送信 */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode={system.code} />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{
              score: result.total,
              max: result.max,
              prefectureCode: system.code,
              prefectureName: system.name,
              metricLabel: '総合得点',
            }}
          >
            <NationalPercentileReveal
              metric="total-score"
              metricLabel="総合得点"
              value={result.total}
              prefectureCode={system.code}
            />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
