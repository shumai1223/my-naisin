'use client';

import * as React from 'react';

import InteractiveCalculator from '@/components/Calculator/InteractiveCalculatorWrapper';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ShindanEntryLink } from '@/components/ShindanEntryLink';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

interface NaishinResultFlowProps {
  prefectureCode: string;
  prefectureName: string;
  maxScore: number;
}

/**
 * 47都道府県の内申ページ共通：計算ツールの実測値を結果連動で名簿/送客CTAへ配線する。
 *
 * 従来は SaveResultCTA が結果値なしの静的配置で、内申点(実測)がCTAへ渡らず
 * 成績カード（互恵の見返り）も保護者バトン（橋②）も点灯していなかった。
 * ここで total/max を持ち上げ、計算後に SaveResultCTA を個別化＝カード+保護者共有を点灯し、
 * 高intentな内申トラフィックを名簿・保護者送客へ変換する。1ファイルで全47県に効く。
 */
export function NaishinResultFlow({ prefectureCode, prefectureName, maxScore }: NaishinResultFlowProps) {
  const [result, setResult] = React.useState<{ total: number; max: number } | null>(null);

  return (
    <>
      <section id="calculator-section" className="scroll-mt-6">
        <InteractiveCalculator
          prefectureCode={prefectureCode}
          prefectureName={prefectureName}
          maxScore={maxScore}
          onResult={setResult}
        />
      </section>

      {/* 結果保存・名簿化（堀A）：内申点の実測値で個別化＝成績カード＋保護者バトンを点灯 */}
      <div id="save-result" className="scroll-mt-24">
        <SaveResultCTA
          source="prefecture"
          prefectureCode={prefectureCode}
          prefectureName={prefectureName}
          score={result?.total}
          max={result?.max}
          heading={
            result
              ? `${prefectureName}の内申点${result.total}点、志望校まで「あと何点」を受け取りませんか？`
              : `${prefectureName}の内申点と「あと何点」を、忘れないうちに受け取りませんか？`
          }
          body="内申点アップのコツ・志望校の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
        />
      </div>

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：内申点の現在地＋成績カードを面談へ持って行く導線 */}
      <ParentWindowBridge
        className="mt-6"
        metricLabel="内申点"
        score={result?.total}
        max={result?.max}
        prefectureCode={prefectureCode}
        prefectureName={prefectureName}
      />

      {/* 結果直後の同スケール導線（生徒→保護者）：権限ズレを避け、購入を迫らず学費/塾代の情報面へ */}
      <ParentCostBridge prefectureName={prefectureName} />

      {/* 塾診断ファネルへの入口（結果に合う塾を無料診断） */}
      <ShindanEntryLink className="mt-6" />

      {/* S-1: 匿名統計オプトイン。同意済みなら内申点の実測値を匿名で自動送信（1ファイルで全47県に効く） */}
      <div className="mt-6">
        <StatsOptIn metric="naishin" value={result?.total} maxValue={result?.max} prefectureCode={prefectureCode} />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される（1ファイルで全47県に効く） */}
      {result && (
        <div className="mt-6">
          <UnlockGate
            placement="naishin-percentile"
            tool="naishin"
            shareCtx={{
              score: result.total,
              max: result.max,
              prefectureCode,
              prefectureName,
              metricLabel: '内申点',
            }}
          >
            <NationalPercentileReveal
              metric="naishin"
              metricLabel="内申点"
              value={result.total}
              prefectureCode={prefectureCode}
              prefectureName={prefectureName}
            />
          </UnlockGate>
        </div>
      )}
    </>
  );
}
