import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import type { AffiliateId } from '@/lib/affiliates';
import { ShieldCheck, FileText } from 'lucide-react';

interface ParentLeadCTAProps {
  /** 見出し（未指定なら汎用の保護者向けコピー）。都道府県名などで文脈最適化できる */
  heading?: string;
  /** 本文（未指定なら汎用コピー） */
  body?: string;
  className?: string;
  /** AdSense審査モード時に隠す（重複配置の終盤側に付与） */
  auditHide?: boolean;
  /** 送客先プログラム。高単価の塾資料請求を追加したら差し替える（既定=Z会資料請求） */
  affiliateId?: AffiliateId;
}

/**
 * 保護者向けリード導線（収益化の本命：広告表示→資料請求の送客）。
 *
 * 子ども向けの「偏差値を上げよう」系CTAとは意図的に分離し、
 * 「契約の意思決定者＝保護者」に向けて、無料資料請求（高単価リード）へ誘導する。
 * 実リンク・トラッキング・rel/PR表記は AffiliateAd に集約してコンプラを担保。
 */
export function ParentLeadCTA({ heading, body, className = '', auditHide = false, affiliateId = 'zkai-text-request' }: ParentLeadCTAProps) {
  if (auditHide && process.env.NEXT_PUBLIC_ADSENSE_AUDIT === '1') return null;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        保護者の方へ
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        {heading ?? 'お子さまの成績、このままで志望校に届きますか？'}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        {body ??
          '内申点・偏差値は「今からの伸ばし方」で大きく変わります。ご家庭でできる対策を、まずは無料の資料で確認してみませんか。費用はかからず、請求は数分で完了します。'}
      </p>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <AffiliateAd
          id={affiliateId}
          hideLabel
          linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:scale-95 sm:w-auto"
        />
        <span className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          Z会の通信教育の資料請求（PR）／無料
        </span>
      </div>
    </section>
  );
}
