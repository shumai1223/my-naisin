'use client';

import * as React from 'react';

import { assignVariant, getClientId, trackExperimentImpression, type Variant } from '@/lib/ab-test';

/**
 * A/Bテストのクライアントフック。
 *
 * - マウント後に端末のクライアントIDを取得し、決定論的にバリアントを割り当てる。
 * - 割当確定時に experiment_impression（experiment_id × variant）を一度だけ GA4 へ送る。
 * - SSR/初回レンダーは variants[0]（コントロール）を返し、ハイドレーション不一致を避ける。
 *   勝者集計は GA4 側で experiment_impression × cta_view/affiliate_click/lead_submit を突合する。
 */
export function useExperiment<T extends string>(
  experimentId: string,
  variants: Variant<T>[]
): T {
  const [variant, setVariant] = React.useState<T>(variants[0].id);
  const impressedRef = React.useRef(false);

  React.useEffect(() => {
    const clientId = getClientId();
    const assigned = assignVariant(experimentId, clientId, variants);
    setVariant(assigned);
    if (!impressedRef.current) {
      impressedRef.current = true;
      trackExperimentImpression(experimentId, assigned);
    }
    // experimentId のみで再実行（variants は呼び出し側で安定配列を渡す前提）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  return variant;
}
