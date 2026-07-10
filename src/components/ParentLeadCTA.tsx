import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import type { AffiliateId } from '@/lib/affiliates';
import { selectLeadOffer, selectSecondaryLeadOffer, type LeadPlacement } from '@/lib/lead-config';
import { ShieldCheck, FileText, Plus } from 'lucide-react';

interface ParentLeadCTAProps {
  /** 見出し（未指定なら出し分けエンジンの解決値）。都道府県名などで文脈最適化できる */
  heading?: string;
  /** 本文（未指定なら出し分けエンジンの解決値） */
  body?: string;
  className?: string;
  /** @deprecated AdSense撤退で無効化（常に表示）。後方互換のため受けるだけ。 */
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
  /** A/Bバリアント（ParentLeadCTAExperiment経由のとき）。cta_view/affiliate_clickに載せてGA4で勝敗分解する（S-6）。 */
  variant?: string;
}

/**
 * 保護者向けリード導線（収益化の本命：広告表示→資料請求の送客）。
 *
 * 子ども向けの「偏差値を上げよう」系CTAとは意図的に分離し、
 * 「契約の意思決定者＝保護者」に向けて、無料資料請求（高単価リード）へ誘導する。
 * 実リンク・トラッキング・rel/PR表記は AffiliateAd に集約してコンプラを担保。
 */
export function ParentLeadCTA({ heading, body, className = '', auditHide = false, affiliateId, note, ctaText, prefectureCode, placement, variant }: ParentLeadCTAProps) {
  // AdSense撤退（2026-07）で審査モードは廃止。auditHide は後方互換で受けるが、もう隠さない
  // （＝これまで NEXT_PUBLIC_ADSENSE_AUDIT=1 で休眠していた保護者リードCTAを全面点灯＝換金導線の解凍）。
  void auditHide;

  // 県×面の出し分けエンジンで既定を解決。明示propは常に最優先（後方互換）。
  const offer = selectLeadOffer({ prefectureCode, placement });
  const resolvedHeading = heading ?? offer.heading;
  const resolvedBody = body ?? offer.body;
  const resolvedAffiliateId = affiliateId ?? offer.affiliateId;
  const resolvedNote = note ?? offer.note;
  const resolvedCtaText = ctaText ?? offer.ctaText;

  // 副オファー（1ページの換金機会を増やす相補ペア）。主と被る／pending のときは null。
  // 明示 affiliateId で主を差し替えている場合は、副が主と重複しうるので出さない（安全側）。
  const secondary = affiliateId ? null : selectSecondaryLeadOffer({ prefectureCode, placement });

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <CtaViewTracker placement={placement ?? 'parent-lead'} pref={prefectureCode} program={resolvedAffiliateId} variant={variant} />
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
          variant={variant}
          linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:scale-95 sm:w-auto"
        />
        <span className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          {resolvedNote}
        </span>
      </div>

      {secondary && (
        <div className="mt-4 flex flex-col items-stretch gap-1.5 border-t border-emerald-100 pt-4 sm:flex-row sm:items-center sm:gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Plus className="h-3.5 w-3.5 text-emerald-600" />
            あわせて検討したい方はこちら
          </span>
          <AffiliateAd
            id={secondary.affiliateId}
            hideLabel
            ctaText={secondary.ctaText}
            pref={prefectureCode}
            placement={placement}
            linkClassName="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-800"
          />
          <span className="text-xs text-slate-400">{secondary.note}</span>
        </div>
      )}
    </section>
  );
}
