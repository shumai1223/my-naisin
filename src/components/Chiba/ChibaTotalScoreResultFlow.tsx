'use client';

import * as React from 'react';

import { ChibaKValueCalculator, type ChibaKValueResult } from '@/components/Chiba/ChibaKValueCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

/**
 * 千葉K値ページの結果連動フロー（B-4）。
 * 総合得点(概算)をstateに持ち上げ、SaveResultCTAへ実測値を渡す（成績カード・保護者バトン点灯）。
 * 他県のTotalScoreResultFlow/HensachiResultFlowと同じ「結果を渡す→CTAを個別化する」パターン。
 */
export function ChibaTotalScoreResultFlow() {
  const [result, setResult] = React.useState<ChibaKValueResult | null>(null);

  return (
    <>
      <ChibaKValueCalculator onResult={setResult} />

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：総合得点の現在地＋成績カードを面談へ持って行く導線（C-10） */}
      <ParentWindowBridge
        className="mt-6"
        metricLabel="総合得点"
        score={result?.total}
        max={result?.max}
        prefectureCode="chiba"
        prefectureName="千葉県"
      />

      <ParentCostBridge prefectureName="千葉県" className="mt-6" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="chiba"
          prefectureName="千葉県"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `千葉の総合得点${result.total}点、志望校のK値に合っていますか？`
              : '千葉のK値別「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="調査書点・学力検査の伸ばし方、千葉・船橋など志望校のK値と最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="chiba" />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{ score: result.total, max: result.max, prefectureCode: 'chiba', prefectureName: '千葉県', metricLabel: '総合得点' }}
          >
            <NationalPercentileReveal metric="total-score" metricLabel="総合得点" value={result.total} prefectureCode="chiba" />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
