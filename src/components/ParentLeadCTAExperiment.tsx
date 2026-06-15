'use client';

import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { useExperiment } from '@/components/ab/useExperiment';
import { selectLeadOffer, type LeadPlacement } from '@/lib/lead-config';

interface ParentLeadCTAExperimentProps {
  /** 実験ID（GA4の experiment_impression × cta_view/affiliate_click を突合するキー）。 */
  experimentId: string;
  placement?: LeadPlacement;
  prefectureCode?: string;
  className?: string;
  auditHide?: boolean;
}

/**
 * 保護者リードCTAの「コピー（CTA文言）」を A/Bテストするクライアントラッパー（自作A/B基盤の実稼働面）。
 *
 * 設計のキモ：
 *  - 送客先（affiliateId）は出し分けエンジン（lead-config）の既定のまま＝収益先は変えず「文言」だけを検証。
 *    → 勝敗が「案件の良し悪し」ではなく純粋に「コピーの効き」で測れる。
 *  - challenger は各プログラムの文脈ctaText（資料請求/無料体験）を尊重しつつ「今すぐ」で緊急性を足す。
 *    汎用の固定文言で塾の「無料体験」と通信教育の「資料請求」を潰さない（プログラム別の自然さを維持）。
 *  - useExperiment が端末ごとに決定論バケットを割当て、experiment_impression を1回送出。
 *    勝者は GA4 で experiment_impression × cta_view/affiliate_click を見て判断し、勝った文言を lead-config へ昇格。
 *
 * これを最大流入面（県別 /[pref]/naishin 47面）に置くことで、experiment_impression が母数レベルで貯まり、
 * 「11日で1回」だった死蔵A/B基盤が初めて意思決定可能な統計量を持つ。
 */
export function ParentLeadCTAExperiment({
  experimentId,
  placement,
  prefectureCode,
  className,
  auditHide,
}: ParentLeadCTAExperimentProps) {
  const variant = useExperiment(experimentId, [{ id: 'control' }, { id: 'urgent' }]);

  // control は出し分けエンジンの既定文言。urgent は同じ送客先の文脈ctaTextに「今すぐ」で緊急性を付与。
  const baseCtaText = selectLeadOffer({ prefectureCode, placement }).ctaText;
  const ctaText = variant === 'urgent' ? `今すぐ${baseCtaText}` : undefined;

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
