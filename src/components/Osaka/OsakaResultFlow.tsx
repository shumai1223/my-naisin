'use client';

import * as React from 'react';

import { OsakaTotalScoreCalculator, type OsakaTotalScoreResult } from '@/components/Osaka/OsakaTotalScoreCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

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

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{ score: result.total, max: result.max, prefectureCode: 'osaka', prefectureName: '大阪府', metricLabel: '総合点' }}
          >
            <NationalPercentileReveal metric="total-score" metricLabel="総合点" value={result.total} prefectureCode="osaka" prefectureName="大阪府" />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
