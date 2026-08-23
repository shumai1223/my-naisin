'use client';

import * as React from 'react';

import { HyoteiHeikinCalculator } from '@/components/HyoteiHeikin/HyoteiHeikinCalculator';
import { HyoteiResultActions } from '@/components/HyoteiHeikin/HyoteiResultActions';
import { HyoteiUniversityBridge } from '@/components/HyoteiHeikin/HyoteiUniversityBridge';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ParentShareInvite } from '@/components/ParentShareInvite';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { ParentWindowBridge } from '@/components/ParentWindowBridge';
import { ShindanEntryLink } from '@/components/ShindanEntryLink';
import { useExperiment } from '@/components/ab/useExperiment';
import type { AffiliateId } from '@/lib/affiliates';

/**
 * /hyotei-heikin（CTR13.5%・高intent）の結果連動 換金フロー。
 * 評定平均を持ち上げ、結果ボックス直下の結果連動CTA＋実測値で個別化した保護者リード/名簿CTAを出す。
 */
export function HyoteiResultFlow() {
  const [value, setValue] = React.useState<number | null>(null);
  const v = typeof value === 'number' ? value.toFixed(1) : '';
  const has = v !== '';

  // TIER Σ-0: 副オファー(FP無料相談)のA/B。主(atama-text)は不変・副だけfp-soudan/findit-fp-soudan/moshimo-manecafeを切替。
  // S1-2(2026-08-24): moshimo-manecafe(live・未参照だった)を第3アームとして追加。
  const secondaryVariant = useExperiment('hyotei-heikin-fp-secondary-2026', [
    { id: 'control' },
    { id: 'findit' },
    { id: 'manecafe' },
  ]);
  const secondaryAffiliateId: AffiliateId | undefined =
    secondaryVariant === 'findit' ? 'findit-fp-soudan' : secondaryVariant === 'manecafe' ? 'moshimo-manecafe' : undefined;

  return (
    <>
      <HyoteiHeikinCalculator onResult={setValue} resultFooter={<HyoteiResultActions value={value} />} />

      {/* TIER Σ-1（2026-08-02）: 保護者への共有導線。/hensachiでは既にT-1(UnlockGate)経由で
          存在していたが、/hyotei-heikinには結果直後の常設共有CTAが1つも無かった
          （ParentWindowBridgeの共有ボタンは面談/出願期のみ点灯・現在季節外で非表示）。
          新しいCTA種別は作らず、既存のParentShareInvite（UnlockGateから抽出済み）をそのまま使う。 */}
      {has && (
        <div className="mt-6">
          <ParentShareInvite
            placement="hyotei-heikin"
            tool="hyotei-heikin"
            shareCtx={{ score: value as number, metricLabel: '評定平均' }}
          />
        </div>
      )}

      {/* 即効レバー：最高CTRページの結果直後に保護者リード（決裁者＝保護者へ高単価送客） */}
      <div className="mt-6">
        <ParentLeadCTA
          placement="hyotei-heikin"
          heading={has ? `評定平均${v}、志望校の出願基準に届きますか？` : 'この評定平均で、志望校の出願基準に届きますか？'}
          body="評定平均は残りの定期テストと提出物で十分に動きます。お子さまにいま必要な対策を、AI個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
          affiliateId="atama-text"
          ctaText="無料で資料・体験を申し込む"
          note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
          secondaryAffiliateId={secondaryAffiliateId}
          secondaryVariant={secondaryVariant}
        />
      </div>

      {/* 堀A：結果を保存・LINE/メールで受け取る。結果連動CTAの保存ボタンの着地点。 */}
      <div id="save-result" className="mt-6 scroll-mt-24">
        <SaveResultCTA
          source="hyotei-heikin"
          score={typeof value === 'number' ? value : undefined}
          metricLabel="評定平均"
          heading={has ? `評定平均${v}を記録して、推薦・出願の基準を追いかけませんか？` : undefined}
          body={
            has
              ? `評定平均${v}で狙える推薦・私立併願優遇の基準と、評定を上げるコツ・出願スケジュールを受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。`
              : undefined
          }
        />
      </div>

      {/* TIER Σ-7（2026-08-03）: Σ-6の実測診断で対象は「高校生専用ではなく中学生/高校生の混在」と
          確定したため、ページ本体は作り替えず学年自己申告で高校生のみに大学受験導線を追加する。
          自己申告なし（大多数）はここは表示されるが選択されるまで既存導線に影響しない。 */}
      {has && <HyoteiUniversityBridge value={value} />}

      {/* 保護者ウィンドウ（三者面談・出願期だけ点灯）：評定平均の現在地を面談へ持って行く導線 */}
      <ParentWindowBridge className="mt-6" metricLabel="評定平均" score={typeof value === 'number' ? value : undefined} />

      {/* 塾診断ファネルへの入口（結果に合う塾を無料診断） */}
      <ShindanEntryLink className="mt-6" />
    </>
  );
}
