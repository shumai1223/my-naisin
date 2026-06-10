'use client';

import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { useExperiment } from '@/components/ab/useExperiment';
import type { LeadPlacement } from '@/lib/lead-config';

interface ParentLeadCTAExperimentProps {
  /** 実験ID（GA4の experiment_impression × cta_view/affiliate_click を突合するキー）。 */
  experimentId: string;
  placement?: LeadPlacement;
  prefectureCode?: string;
  className?: string;
  auditHide?: boolean;
}

/**
 * 保護者リードCTAのボタン文言を A/Bテストするクライアントラッパー（自作A/B基盤のショーケース）。
 *
 * - useExperiment が端末ごとに決定論バケットを割り当て、experiment_impression を1回送出。
 * - 送客先（affiliateId）は出し分けエンジンの既定のまま＝収益先は変えず「文言」だけを検証。
 * - 勝者は GA4 で experiment_impression × affiliate_click(=収益直前) を見て判断し、
 *   勝った文言を lead-config 側へ昇格させる運用。
 */
export function ParentLeadCTAExperiment({
  experimentId,
  placement,
  prefectureCode,
  className,
  auditHide,
}: ParentLeadCTAExperimentProps) {
  const variant = useExperiment(experimentId, [{ id: 'control' }, { id: 'action' }]);

  // control は出し分けエンジンの既定文言、action はより行動的な文言。
  const ctaText = variant === 'action' ? '無料の資料を取り寄せる' : undefined;

  return (
    <ParentLeadCTA
      placement={placement}
      prefectureCode={prefectureCode}
      ctaText={ctaText}
      className={className}
      auditHide={auditHide}
    />
  );
}
