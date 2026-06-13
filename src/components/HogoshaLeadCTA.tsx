'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { parseParentShare } from '@/lib/share';

/**
 * /hogosha の保護者リードCTAを「共有元の都道府県」で地域最適化するクライアントラッパー。
 *
 * 橋②の核心：生徒が大阪の結果を共有 → 着地した保護者には関西地盤の無料体験（個別指導キャンパス）を、
 * 関東なら森塾を出す（lead-config の県オーバーライド）。共有でない通常訪問は prefectureCode 無し＝既定。
 *
 * useSearchParams を内包するため <Suspense> 必須。fallback には素の ParentLeadCTA を置けば
 * 静的HTML（SSG/SEO）にもCTAが残り、クライアントで地域版に差し替わる。
 */
export function HogoshaLeadCTA({ className }: { className?: string }) {
  const sp = useSearchParams();
  const share = React.useMemo(() => {
    const raw: Record<string, string> = {};
    sp.forEach((value, key) => {
      raw[key] = value;
    });
    return parseParentShare(raw);
  }, [sp]);

  return (
    <ParentLeadCTA placement="parent-lp" prefectureCode={share.prefectureCode} className={className} />
  );
}
