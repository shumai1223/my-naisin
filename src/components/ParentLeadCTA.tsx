import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import type { AffiliateId } from '@/lib/affiliates';
import { selectLeadOffer, type LeadPlacement } from '@/lib/lead-config';
import { ShieldCheck, FileText } from 'lucide-react';

interface ParentLeadCTAProps {
  /** 見出し（未指定なら出し分けエンジンの解決値）。都道府県名などで文脈最適化できる */
  heading?: string;
  /** 本文（未指定なら出し分けエンジンの解決値） */
  body?: string;
  className?: string;
  /** AdSense審査モード時に隠す（重複配置の終盤側に付与） */
  auditHide?: boolean;
  /** 送客先プログラム。明示時は最優先。未指定なら県×面エンジンが解決（既定=Z会資料請求） */
  affiliateId?: AffiliateId;
  /** ボタン下の補足表記（PR/無料など）。affiliateIdを差し替えたら送客先名に合わせる */
  note?: string;
  /** CTAボタンの文言。塾系（アンカーが「【森塾】」等）を送客先にしたとき、行動を促す文に上書きする。 */
  ctaText?: string;
  /** 都道府県コード。出し分けエンジンの解決＋cta_viewの計装に使う。 */
  prefectureCode?: string;
  /** 設置面。出し分けエンジンの解決＋cta_viewの計装に使う。 */
  placement?: LeadPlacement;
}

/**
 * 保護者向けリード導線（収益化の本命：広告表示→資料請求の送客）。
 *
 * 子ども向けの「偏差値を上げよう」系CTAとは意図的に分離し、
 * 「契約の意思決定者＝保護者」に向けて、無料資料請求（高単価リード）へ誘導する。
 * 実リンク・トラッキング・rel/PR表記は AffiliateAd に集約してコンプラを担保。
 */
export function ParentLeadCTA({ heading, body, className = '', auditHide = false, affiliateId, note, ctaText, prefectureCode, placement }: ParentLeadCTAProps) {
  if (auditHide && process.env.NEXT_PUBLIC_ADSENSE_AUDIT === '1') return null;

  // 県×面の出し分けエンジンで既定を解決。明示propは常に最優先（後方互換）。
  const offer = selectLeadOffer({ prefectureCode, placement });
  const resolvedHeading = heading ?? offer.heading;
  const resolvedBody = body ?? offer.body;
  const resolvedAffiliateId = affiliateId ?? offer.affiliateId;
  const resolvedNote = note ?? offer.note;
  const resolvedCtaText = ctaText ?? offer.ctaText;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <CtaViewTracker placement={placement ?? 'parent-lead'} pref={prefectureCode} program={resolvedAffiliateId} />
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        保護者の方へ
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        {resolvedHeading}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        {resolvedBody}
      </p>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <AffiliateAd
          id={resolvedAffiliateId}
          hideLabel
          ctaText={resolvedCtaText}
          pref={prefectureCode}
          placement={placement}
          linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:scale-95 sm:w-auto"
        />
        <span className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          {resolvedNote}
        </span>
      </div>
    </section>
  );
}
