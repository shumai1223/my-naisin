'use client';

import * as React from 'react';

import { OsakaTotalScoreCalculator, type OsakaTotalScoreResult } from '@/components/Osaka/OsakaTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';

/**
 * 大阪府総合点ページの結果連動フロー（S-1④）。
 * 従来はSaveResultCTA/ParentCostBridgeが結果値なしの静的配置で、
 * ParentWindowBridge自体も未配線だった（他12県と揃っていなかった穴）。
 */
export function OsakaResultFlow() {
  const [result, setResult] = React.useState<OsakaTotalScoreResult | null>(null);

  return (
    <>
      <OsakaTotalScoreCalculator onResult={setResult} />

      <ParentWindowBridge
        className="mt-6"
        metricLabel="総合点"
        score={result?.total}
        max={result?.max}
        prefectureCode="osaka"
        prefectureName="大阪府"
      />

      <ParentCostBridge prefectureName="大阪府" className="mb-6" />

      <div id="save-result" className="scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="osaka"
          prefectureName="大阪府"
          className="mt-6"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `大阪の総合点${result.total}点、北野や茨木の目安に届いていますか？`
              : 'この総合点と「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="総合点アップのコツ・北野や茨木など文理学科の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="osaka" />
      </div>
    </>
  );
}
