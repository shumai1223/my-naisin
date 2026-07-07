'use client';

import * as React from 'react';

import { HensachiGyakusanCalculator, type HensachiGyakusanResult } from '@/components/Hensachi/HensachiGyakusanCalculator';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ParentCostBridge } from '@/components/ParentCostBridge';

/**
 * /hensachi/gyakusan の結果連動フロー（C-15）。
 * ページに一切のCTA（SaveResultCTA/ParentLeadCTA/ParentWindowBridge）が無かった穴を埋める。
 * 他の/hensachi系スポーク（kyoka-betsu/shiboukou）と同じ静的コピー+atama-textの構成に、
 * 計算結果（偏差値/目標/差）が出たら実測値で個別化する結果連動を追加する。
 */
export function HensachiGyakusanResultFlow() {
  const [result, setResult] = React.useState<HensachiGyakusanResult | null>(null);
  const has = result !== null;

  return (
    <>
      <HensachiGyakusanCalculator onResult={setResult} />

      {/* 保護者リード */}
      <div className="mt-6">
        <ParentLeadCTA
          heading={has ? `偏差値${result.currentHensachi}、目標まで届きますか？保護者の方へ` : '目標の偏差値、どう伸ばす？保護者の方へ'}
          body="偏差値は「今からの伸ばし方」で十分に動きます。お子さまにいま必要な対策を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
          affiliateId="atama-text"
          ctaText="無料で資料・体験を申し込む"
          note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
        />
      </div>

      {/* 堀A：結果連動（偏差値・目標・差が出たら実測値で個別化） */}
      <div className="mt-6">
        <SaveResultCTA
          source="hensachi-gyakusan"
          score={result?.currentHensachi}
          target={result?.targetHensachi}
          gap={result?.gap}
          metricLabel="偏差値"
          heading={has ? `目標偏差値${result.targetHensachi}まであと${result.gap}。記録して一緒に追いかけませんか？` : undefined}
          body={has ? `いまの偏差値${result.currentHensachi}を保存し、目標まで「あと何点」を受験本番まで一緒に追いかけます。伸ばし方のコツをLINE/メールで無料でお届けします。` : undefined}
        />
      </div>

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯） */}
      <ParentWindowBridge className="mt-6" metricLabel="偏差値" score={result?.currentHensachi} target={result?.targetHensachi} gap={result?.gap} />

      {/* 結果直後の同スケール導線（生徒→保護者） */}
      <ParentCostBridge className="mt-6" />
    </>
  );
}
