'use client';

import * as React from 'react';

import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';
import { HensachiResultActions } from '@/components/Hensachi/HensachiResultActions';
import { HensachiGapToTarget } from '@/components/Hensachi/HensachiGapToTarget';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ShindanEntryLink } from '@/components/ShindanEntryLink';
import { StatsOptIn } from '@/components/StatsOptIn';
import { UnlockGate } from '@/components/UnlockGate';
import { NationalPercentileReveal } from '@/components/NationalPercentileReveal';

/**
 * /hensachi（全流入の約41%）の結果連動 換金フロー。
 *
 * 従来は計算機と CTA が別々に静的配置され、偏差値の実測値が CTA へ渡っていなかった
 * （＝最大流入ページで最弱のCTA・result_view→line/lead ≈0）。ここで偏差値をstateに持ち上げ、
 *  ① 結果ボックス直下に結果連動CTA（LINE相談/志望校/保存）
 *  ② 実測偏差値で見出しを個別化した保護者リード・名簿CTA
 * を出して、生徒トラフィックを名簿・保護者送客へ変換する。外部ASP非依存の導線が主。
 */
export function HensachiResultFlow() {
  const [value, setValue] = React.useState<number | null>(null);
  const [target, setTarget] = React.useState<number | null>(null);
  const [gap, setGap] = React.useState<number | null>(null);
  const v = typeof value === 'number' ? value.toFixed(1) : '';
  const has = v !== '';
  const scoreProp = typeof value === 'number' ? value : undefined;
  const handleTargetChange = React.useCallback((t: number | null, g: number | null) => {
    setTarget(t);
    setGap(g);
  }, []);

  return (
    <>
      <div id="calculator-section">
        <HensachiCalculator onResult={setValue} resultFooter={<HensachiResultActions value={value} />} />
      </div>

      {/* A-9: 偏差値+5(チャレンジ帯)を既定目標にした週次計画ジェネレータ。target/gapはLINE保存CTAへ渡す */}
      <div className="mt-6">
        <HensachiGapToTarget value={value} onTargetChange={handleTargetChange} />
      </div>

      {/* S-1: 匿名統計オプトイン。同意済みなら偏差値の実測値を匿名で自動送信 */}
      <div className="mt-6">
        <StatsOptIn metric="hensachi" value={value} />
      </div>

      {/* T-1: 紹介・解放機構。保護者に送る/LINE登録で全国統計の先行閲覧が解放される */}
      {has && (
        <div className="mt-6">
          <UnlockGate
            placement="hensachi-percentile"
            tool="hensachi"
            shareCtx={{ score: value as number, target: target ?? undefined, gap: gap ?? undefined, metricLabel: '偏差値' }}
          >
            <NationalPercentileReveal metric="hensachi" metricLabel="偏差値" value={value} />
          </UnlockGate>
        </div>
      )}

      {/* 即効レバー：最高CTRページの結果直後に保護者リード（決裁者＝保護者へ高単価送客） */}
      <div className="mt-6">
        <ParentLeadCTA
          placement="hensachi"
          heading={has ? `偏差値${v}、志望校に届きますか？保護者の方へ` : 'この偏差値で、志望校に届きますか？保護者の方へ'}
          body="偏差値は「今からの伸ばし方」で十分に動きます。お子さまにいま必要な対策を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
          affiliateId="atama-text"
          ctaText="無料で資料・体験を申し込む"
          note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
        />
      </div>

      {/* 堀A：結果を保存・LINE/メールで受け取る（受験期トラフィックの資産化）。結果連動CTAの保存ボタンの着地点。 */}
      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="hensachi"
          score={scoreProp}
          metricLabel="偏差値"
          target={target ?? undefined}
          gap={gap ?? undefined}
          heading={
            has && target !== null && gap !== null
              ? `目標偏差値${target}まであと${gap}。記録して一緒に追いかけませんか？`
              : has
                ? `偏差値${v}を記録して、伸びを追いかけませんか？`
                : undefined
          }
          body={
            has
              ? `いまの偏差値${v}を保存し、志望校まで「あと何点」を受験本番まで一緒に追いかけます。伸ばし方のコツ・志望校の最新情報をLINE/メールで無料でお届けします。`
              : undefined
          }
        />
      </div>

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：偏差値の現在地を面談へ持って行く導線 */}
      <ParentWindowBridge className="mt-6" metricLabel="偏差値" score={scoreProp} />

      {/* 結果直後の同スケール導線（生徒→保護者）：偏差値→志望校が見えたら学費/塾代を確認 */}
      <ParentCostBridge className="mt-6" />

      {/* 塾診断ファネルへの入口（結果に合う塾を無料診断） */}
      <ShindanEntryLink className="mt-6" />
    </>
  );
}
