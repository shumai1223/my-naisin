'use client';

import * as React from 'react';

import { HokkaidoRankCalculator, type HokkaidoRankResult } from '@/components/Hokkaido/HokkaidoRankCalculator';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

/**
 * 北海道内申ランクページの結果連動フロー（B-5）。
 * 既存のHokkaidoRankCalculatorには結果連動のSaveResultCTA(LINE保存)自体が無かった。
 */
export function HokkaidoRankResultFlow() {
  const [result, setResult] = React.useState<HokkaidoRankResult | null>(null);

  return (
    <>
      <HokkaidoRankCalculator onResult={setResult} />

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：総合得点の現在地＋成績カードを面談へ持って行く導線（C-10） */}
      <ParentWindowBridge
        className="mt-8"
        metricLabel="総合得点"
        score={result?.total}
        max={result?.max}
        prefectureCode="hokkaido"
        prefectureName="北海道"
      />

      <ParentCostBridge prefectureName="北海道" className="mt-8" />

      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode="hokkaido"
          prefectureName="北海道"
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `北海道の総合点${result.total}点、志望校のランクに届いていますか？`
              : '北海道の内申ランクと「あと何点」を、忘れないうちに受け取りませんか？'
          }
          body="内申・当日点の伸ばし方、札幌南・札幌北など志望校の最新ランクとボーダー、出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* S-1: 匿名統計オプトイン */}
      <div className="mt-6">
        <StatsOptIn metric="total-score" value={result?.total} maxValue={result?.max} prefectureCode="hokkaido" />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="total-score-percentile"
            tool="total-score"
            shareCtx={{ score: result.total, max: result.max, prefectureCode: 'hokkaido', prefectureName: '北海道', metricLabel: '総合点' }}
          >
            <NationalPercentileReveal metric="total-score" metricLabel="総合点" value={result.total} prefectureCode="hokkaido" prefectureName="北海道" />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
