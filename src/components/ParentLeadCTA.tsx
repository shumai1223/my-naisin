import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import { isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';
import { programPreset, selectLeadOffer, selectSecondaryLeadOffer, type LeadPlacement } from '@/lib/lead-config';
import { FileText, Plus } from '@/components/icons';

interface ParentLeadCTAProps {
  /** 見出し（未指定なら出し分けエンジンの解決値）。都道府県名などで文脈最適化できる */
  heading?: string;
  /** 本文（未指定なら出し分けエンジンの解決値） */
  body?: string;
  className?: string;
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
  /** 副オファーの送客先を明示指定（副オファー専用A/B用）。未指定なら面ごとの既定値（PLACEMENT_SECONDARY_OFFER）を使う。 */
  secondaryAffiliateId?: AffiliateId;
  /** 副オファーのA/Bバリアント。副オファーのAffiliateAdにdata-variantとして載せ、affiliate_clickの勝敗分解に使う。 */
  secondaryVariant?: string;
  /** 見出しのレベル（既定 h3）。置かれるページの見出し階層に合わせて呼び出し側が選ぶ。 */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

/**
 * 保護者向けリード導線（収益化の本命：広告表示→資料請求の送客）。
 *
 * 子ども向けの「偏差値を上げよう」系CTAとは意図的に分離し、
 * 「契約の意思決定者＝保護者」に向けて、無料資料請求（高単価リード）へ誘導する。
 * 実リンク・トラッキング・rel/PR表記は AffiliateAd に集約してコンプラを担保。
 */
export function ParentLeadCTA({ heading, body, className = '', affiliateId, note, ctaText, prefectureCode, placement, variant, secondaryAffiliateId, secondaryVariant, headingLevel = 'h3' }: ParentLeadCTAProps) {
  // 県×面の出し分けエンジンで既定を解決。明示propは常に最優先（後方互換）。
  const offer = selectLeadOffer({ prefectureCode, placement });
  const resolvedHeading = heading ?? offer.heading;
  const resolvedBody = body ?? offer.body;
  const resolvedAffiliateId = affiliateId ?? offer.affiliateId;
  const resolvedNote = note ?? offer.note;
  const resolvedCtaText = ctaText ?? offer.ctaText;

  // 副オファー（1ページの換金機会を増やす相補ペア）。主と同一プログラムのときだけ出さない（重複回避）。
  // secondaryAffiliateId明示時（副オファー専用A/B用）はそれを優先し、未指定なら面ごとの既定値を解決する。
  // 2026-08-02修正: 従来は「主をaffiliateIdで明示差替え中は副を一律非表示」だったが、これは
  // hensachi/hyotei-heikin（主=atama-text固定）で副(fp-soudan)が一度も描画されない死んだ設定に
  // なっていた（[[loop-question-note]]TIER Σ-0参照）。実際に同一プログラムになる場合のみ抑止する。
  const secondaryOverride =
    secondaryAffiliateId && isLiveAffiliate(secondaryAffiliateId)
      ? {
          affiliateId: secondaryAffiliateId,
          note: programPreset(secondaryAffiliateId)?.note ?? '',
          ctaText: programPreset(secondaryAffiliateId)?.ctaText ?? 'くわしく見る',
        }
      : undefined;
  const secondaryBase = secondaryOverride ?? selectSecondaryLeadOffer({ prefectureCode, placement });
  const secondary = secondaryBase && secondaryBase.affiliateId !== resolvedAffiliateId ? secondaryBase : null;

  // 見出しのレベルは呼び出し側が選ぶ（既定 h3）。見た目はレベルに依らず設計書の h2 / h3 の型。
  const Heading = headingLevel;
  const headingSize = headingLevel === 'h2' ? 'text-xl' : 'text-[17px]';

  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white p-5 md:p-6 ${className}`}
    >
      <CtaViewTracker placement={placement ?? 'parent-lead'} pref={prefectureCode} program={resolvedAffiliateId} variant={variant} />
      <div className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
        保護者の方へ
      </div>

      <Heading className={`mb-2 ${headingSize} font-bold leading-snug text-slate-900`}>
        {resolvedHeading}
      </Heading>
      <p className="mb-5 text-base leading-[1.8] text-slate-900">
        {resolvedBody}
      </p>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <AffiliateAd
          id={resolvedAffiliateId}
          ctaText={resolvedCtaText}
          pref={prefectureCode}
          placement={placement}
          variant={variant}
          linkClassName="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 sm:w-auto"
        />
        <span className="inline-flex items-center justify-center gap-1.5 text-sm text-slate-600">
          <FileText className="h-4 w-4 shrink-0" />
          {resolvedNote}
        </span>
      </div>

      {secondary && (
        <div className="mt-4 flex flex-col items-stretch gap-1 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <Plus className="h-4 w-4 shrink-0" />
            あわせて検討したい方はこちら
          </span>
          <AffiliateAd
            id={secondary.affiliateId}
            ctaText={secondary.ctaText}
            pref={prefectureCode}
            placement={placement}
            variant={secondaryVariant}
            linkClassName="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-2 transition-colors hover:text-brand-800"
          />
          <span className="text-sm text-slate-600">{secondary.note}</span>
        </div>
      )}
    </section>
  );
}
