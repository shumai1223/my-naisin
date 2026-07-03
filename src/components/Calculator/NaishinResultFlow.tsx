'use client';

import * as React from 'react';

import InteractiveCalculator from '@/components/Calculator/InteractiveCalculatorWrapper';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';

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

      {/* 結果直後の同スケール導線（生徒→保護者）：権限ズレを避け、購入を迫らず学費/塾代の情報面へ */}
      <ParentCostBridge prefectureName={prefectureName} />
    </>
  );
}
