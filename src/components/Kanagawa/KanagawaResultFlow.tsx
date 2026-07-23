'use client';

import * as React from 'react';

import { KanagawaSValueCalculator, type KanagawaSValueResult } from '@/components/Kanagawa/KanagawaSValueCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

/**
 * 神奈川S値ページの結果連動フロー（S-1④）。
 * 従来はSaveResultCTA/ParentCostBridgeが結果値なしの静的配置で、
 * ParentWindowBridge自体も未配線だった（他12県と揃っていなかった穴）。
 */
export function KanagawaResultFlow() {
  const [result, setResult] = React.useState<KanagawaSValueResult | null>(null);

  return (
    <>
      <KanagawaSValueCalculator onResult={setResult} />

      <ParentWindowBridge
        className="mt-6"
        metricLabel="S1値"
        score={result?.total}
        max={result?.max}
        prefectureCode="kanagawa"
        prefectureName="神奈川県"
      />

      <ParentCostBridge prefectureName="神奈川県" className="mb-6" />

      <div id="save-result" className="scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="kanagawa"
          prefectureName="神奈川県"
          className="mt-6"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `神奈川S値${result.total}点、横浜翠嵐や湘南の目安に届いていますか？`
              : 'この神奈川S値と「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="S値アップのコツ・横浜翠嵐や湘南など志望校の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="kanagawa" />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{ score: result.total, max: result.max, prefectureCode: 'kanagawa', prefectureName: '神奈川県', metricLabel: 'S1値' }}
          >
            <NationalPercentileReveal metric="total-score" metricLabel="S1値" value={result.total} prefectureCode="kanagawa" prefectureName="神奈川県" />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
