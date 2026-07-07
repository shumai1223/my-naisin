'use client';

import { getSponsorForSlot } from '@/lib/sponsor-slots';
import { track, EVENTS } from '@/lib/track';

interface SponsorSlotProps {
  /** 設置面（例 'naishin' 'total-score'）。 */
  placement: string;
  /** 県指定枠を優先させたい場合の都道府県コード。 */
  prefectureCode?: string;
  className?: string;
}

/**
 * 掲載枠スポンサー（D-3）の表示コンポーネント。AdSlot(AdSense)と同じ「未契約時は描画0」設計だが、
 * こちらはASP/AdSenseを介さない直販の固定枠（広告表記込み）。
 */
export function SponsorSlot({ placement, prefectureCode, className = '' }: SponsorSlotProps) {
  const sponsor = getSponsorForSlot(placement, prefectureCode);
  if (!sponsor) return null;

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 ${className}`}>
      <div className="mb-1 text-[10px] font-medium text-slate-400">広告</div>
      <a
        href={sponsor.href}
        rel="nofollow sponsored noopener"
        target="_blank"
        data-sponsor-id={sponsor.id}
        className="font-bold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700"
        onClick={() => track(EVENTS.SPONSOR_CLICK, { placement, pref: prefectureCode ?? 'none', program: sponsor.id })}
      >
        {sponsor.text}
      </a>
    </div>
  );
}
