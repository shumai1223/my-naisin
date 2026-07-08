'use client';

import * as React from 'react';

import { HyoteiHeikinGyakusanCalculator, type HyoteiHeikinGyakusanResult } from '@/components/HyoteiHeikin/HyoteiHeikinGyakusanCalculator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ParentCostBridge } from '@/components/ParentCostBridge';

/**
 * /hyotei-heikin/gyakusan の結果連動フロー（TIER K-4）。
 * placement="suisen" で結線＝推薦・総合型選抜を見据えた保護者面（学費/奨学金のFP相談）に接続する。
 */
export function HyoteiHeikinGyakusanResultFlow() {
  const [result, setResult] = React.useState<HyoteiHeikinGyakusanResult | null>(null);
  const has = result !== null;

  return (
    <>
      <HyoteiHeikinGyakusanCalculator onResult={setResult} />

      {/* 保護者リード（推薦・総合型選抜文脈＝学費の見通し） */}
      <div className="mt-6">
        <ParentLeadCTA
          placement="suisen"
          heading={has ? `評定平均${result.currentAverage}、目標${result.targetAverage}に届きますか？保護者の方へ` : '推薦・総合型選抜の評定平均、届きますか？保護者の方へ'}
        />
      </div>

      {/* 堀A：結果連動（現在/目標/残り必要平均が出たら実測値で個別化） */}
      <div className="mt-6">
        <SaveResultCTA
          source="hyotei-heikin"
          score={result?.currentAverage}
          target={result?.targetAverage}
          gap={result?.gap}
          metricLabel="評定平均"
          heading={has ? `目標評定平均${result.targetAverage}まで、あと${Math.round(Math.max(0, result.gap) * 100) / 100}。記録して一緒に追いかけませんか？` : undefined}
          body={has ? `いまの評定平均${result.currentAverage}を保存し、目標まで「残りで平均いくつ必要か」を出願まで一緒に追いかけます。伸ばし方のコツをLINE/メールで無料でお届けします。` : undefined}
        />
      </div>

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯） */}
      <ParentWindowBridge className="mt-6" metricLabel="評定平均" score={result?.currentAverage} target={result?.targetAverage} gap={result?.gap} />

      {/* 結果直後の同スケール導線（生徒→保護者）：学費/塾代の情報導線 */}
      <ParentCostBridge className="mt-6" />
    </>
  );
}
