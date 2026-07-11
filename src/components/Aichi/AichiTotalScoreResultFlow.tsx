'use client';

import * as React from 'react';

import { AichiHyokaCalculator, type AichiHyokaResult } from '@/components/Aichi/AichiHyokaCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

/** 愛知評価方法ページの結果連動フロー（B-5）。 */
export function AichiTotalScoreResultFlow() {
  const [result, setResult] = React.useState<AichiHyokaResult | null>(null);

  return (
    <>
      <AichiHyokaCalculator onResult={setResult} />

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：総合得点の現在地＋成績カードを面談へ持って行く導線（C-10） */}
      <ParentWindowBridge
        className="mt-6"
        metricLabel="総合得点"
        score={result?.total}
        max={result?.max}
        prefectureCode="aichi"
        prefectureName="愛知県"
      />

      <ParentCostBridge prefectureName="愛知県" className="mt-6" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="aichi"
          prefectureName="愛知県"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `愛知の総合得点${result.total}点、志望校の評価方法に合っていますか？`
              : '愛知の評価方法別「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="内申・当日点の伸ばし方、旭丘・明和など志望校の評価方法と最新ボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="aichi" />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{ score: result.total, max: result.max, prefectureCode: 'aichi', prefectureName: '愛知県', metricLabel: '総合得点' }}
          >
            <NationalPercentileReveal metric="total-score" metricLabel="総合得点" value={result.total} prefectureCode="aichi" />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
