'use client';

import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { useExperiment } from '@/components/ab/useExperiment';
import { selectLeadOffer, programPreset, type LeadPlacement } from '@/lib/lead-config';
import { isLiveAffiliate } from '@/lib/affiliates';
import { getExperiment, type ExperimentArm } from '@/lib/experiments';

interface ParentLeadCTAExperimentProps {
  /** 実験ID（experiments.ts のレジストリと一致。GA4の experiment_impression × cta_view/affiliate_click を突合）。 */
  experimentId: string;
  placement?: LeadPlacement;
  prefectureCode?: string;
  className?: string;
  auditHide?: boolean;
}

/** レジストリに無い実験IDでも壊さないためのフォールバック（旧 control/urgent コピーA/B）。 */
const FALLBACK_ARMS: ExperimentArm[] = [
  { id: 'control', label: '既定' },
  { id: 'urgent', label: '今すぐ付与', ctaPrefix: '今すぐ' },
];

/**
 * 保護者リードCTAの A/B ラッパー（自作A/B基盤の実稼働面・H8で汎用化）。
 *
 * experiments.ts のレジストリからアームを読み、端末ごとに決定論バケットを割当て、各アームの
 * 差分（送客先 affiliateId / 見出し / 本文 / CTA接頭辞）を ParentLeadCTA に流す。
 *  - offer A/B：arm.affiliateId が live のときだけ送客先を差し替え（note/ctaText はプリセットで整合）。
 *  - copy A/B：arm.heading / arm.body / arm.ctaPrefix で文言だけを差し替え（送客先は据え置き）。
 * 勝者は GA4 で experiment_impression × cta_view/affiliate_click を見て judgeWinner（experiments.ts）で判定。
 */
export function ParentLeadCTAExperiment({
  experimentId,
  placement,
  prefectureCode,
  className,
  auditHide,
}: ParentLeadCTAExperimentProps) {
  const def = getExperiment(experimentId);
  const arms = def?.arms?.length ? def.arms : FALLBACK_ARMS;

  const variantId = useExperiment(
    experimentId,
    arms.map((a) => ({ id: a.id, weight: a.weight }))
  );
  const arm = arms.find((a) => a.id === variantId) ?? arms[0];

  // 送客先の差し替え（offer A/B）。pending は描画されないので live のみ採用。
  const swapId = arm.affiliateId && isLiveAffiliate(arm.affiliateId) ? arm.affiliateId : undefined;
  const preset = swapId ? programPreset(swapId) : undefined;

  // CTA文言：接頭辞があれば（差し替え先 or 既定の）ctaText に付与。
  const base = selectLeadOffer({ prefectureCode, placement });
  const baseCtaText = preset?.ctaText ?? base.ctaText;
  const ctaText = arm.ctaPrefix ? `${arm.ctaPrefix}${baseCtaText}` : preset?.ctaText;

  return (
    <ParentLeadCTA
      placement={placement}
      prefectureCode={prefectureCode}
      affiliateId={swapId}
      heading={arm.heading}
      body={arm.body}
      note={preset?.note}
      ctaText={ctaText}
      className={className}
      auditHide={auditHide}
    />
  );
}
