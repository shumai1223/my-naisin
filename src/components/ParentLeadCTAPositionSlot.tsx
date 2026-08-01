'use client';

import * as React from 'react';

import { useExperiment } from '@/components/ab/useExperiment';
import { ParentLeadCTAExperiment } from '@/components/ParentLeadCTAExperiment';
import { getExperiment } from '@/lib/experiments';
import type { LeadPlacement } from '@/lib/lead-config';

/**
 * 配置順A/B（parent-lp-order-2026・2026-08-01活性化）。
 *
 * hogosha-cta-text-2026（コピーA/B・parent-lp面）とは直交する別軸の実験で、
 * 「ファーストビュー(above-fold) vs 記事末(article-end)」のどちらにCTAを置くかを検証する。
 * ParentLeadCTAExperimentは汎用のheading/body/ctaPrefix差し替えは持つが「DOM上の位置」を
 * 切り替える機能を持たないため、本ファイルで専用の配置スイッチを実装する。
 *
 * **重複計装を避ける設計**: 2箇所(above-fold/article-end)にスロットを置くが、variant判定
 * (useExperiment呼び出し)は`ParentLeadCTAPositionProvider`で1回だけ行い、Contextで共有する。
 * 各スロットはvariantに応じてどちらか一方だけが実際にParentLeadCTAExperimentをマウントする
 * ため、内包するコピー実験(hogosha-cta-text-2026等)のimpression計装も重複しない。
 */

const POSITION_EXPERIMENT_ID = 'parent-lp-order-2026';
/** レジストリに未登録の場合の安全なフォールバック（既定=記事末のみ表示）。 */
const FALLBACK_POSITION_VARIANTS = [{ id: 'control' as const }, { id: 'above-fold' as const }];

const PositionVariantContext = React.createContext<string>('control');

export function ParentLeadCTAPositionProvider({ children }: { children: React.ReactNode }) {
  const def = getExperiment(POSITION_EXPERIMENT_ID);
  const variants = def?.arms?.length ? def.arms.map((a) => ({ id: a.id, weight: a.weight })) : FALLBACK_POSITION_VARIANTS;
  const variant = useExperiment(POSITION_EXPERIMENT_ID, variants);
  return <PositionVariantContext.Provider value={variant}>{children}</PositionVariantContext.Provider>;
}

interface ParentLeadCTAPositionSlotProps {
  /** このスロットがページ内のどの位置に置かれているか。 */
  slot: 'above-fold' | 'article-end';
  /** 内包するコピーA/B実験のID（例: hogosha-cta-text-2026）。position実験とは独立に動作する。 */
  copyExperimentId: string;
  placement?: LeadPlacement;
  prefectureCode?: string;
  className?: string;
  auditHide?: boolean;
}

export function ParentLeadCTAPositionSlot({
  slot,
  copyExperimentId,
  placement,
  prefectureCode,
  className,
  auditHide,
}: ParentLeadCTAPositionSlotProps) {
  const variant = React.useContext(PositionVariantContext);
  const shouldRenderHere = variant === 'above-fold' ? slot === 'above-fold' : slot === 'article-end';
  if (!shouldRenderHere) return null;

  return (
    <ParentLeadCTAExperiment
      experimentId={copyExperimentId}
      placement={placement}
      prefectureCode={prefectureCode}
      className={className}
      auditHide={auditHide}
    />
  );
}
