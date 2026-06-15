import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import { Heart, Home, Sparkles } from 'lucide-react';

/**
 * 不登校クラスタ専用の保護者リード（もしも・審査なし live／2026-06-15結線）。
 *
 * 文脈：不登校記事の読者＝「全日制以外の選択肢」「内申を問わない学び」を探す保護者（＝決裁者）。
 * 一般の塾/通信教育CTAはこの層に刺さりにくいので、不登校に特化した2案件だけを出す：
 *  - クラスジャパン小中学園：不登校生のオンラインフリースクール（出席扱い・無料資料請求）
 *  - ティントル：不登校専門のオンライン個別指導（無料体験）
 * いずれも「無料・在宅・内申不問」で、記事の主張（不登校でも進路はある）と利益相反しない自然な導線。
 *
 * cta_view は案件ごとに計装（CtaViewTracker×2）し、blog面×不登校案件のCTRを GA4 で取得する。
 */
export function FutoukouLeadCTA({ className = '' }: { className?: string }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50/50 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-200">
        <Heart className="h-3.5 w-3.5" />
        不登校のお子さま・保護者の方へ
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        「学校に行けない」を、進路の不利にしない選択肢があります
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        在宅で学べて、出席扱い・内申を問わない学びの場が増えています。気になるものは、まず無料の資料請求・体験で雰囲気を確かめてみてください（費用はかからず、その場で契約を迫られることはありません）。
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* クラスジャパン小中学園：オンラインフリースクール（出席扱い・無料資料請求） */}
        <div className="relative rounded-xl border border-rose-100 bg-white p-4">
          <CtaViewTracker placement="blog" program="moshimo-classjapan" />
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-900">
            <Home className="h-4 w-4 text-rose-500" />
            自宅で「出席扱い」を目指す
          </div>
          <p className="mb-3 text-xs leading-relaxed text-rose-800/90">
            クラスジャパン小中学園は、自宅から参加できるオンラインのフリースクール。在籍校と連携して「出席扱い」を目指せるのが特長です。
          </p>
          <AffiliateAd
            id="moshimo-classjapan"
            hideLabel
            linkClassName="block w-full rounded-xl bg-rose-600 px-5 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-95"
          />
          <div className="mt-2 text-center text-[10px] text-slate-400">無料で資料を取り寄せる（PR）</div>
        </div>

        {/* ティントル：不登校専門オンライン個別指導（無料体験） */}
        <div className="relative rounded-xl border border-pink-100 bg-white p-4">
          <CtaViewTracker placement="blog" program="moshimo-tintoru" />
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-pink-900">
            <Sparkles className="h-4 w-4 text-pink-500" />
            一人ひとりに合わせた個別指導
          </div>
          <p className="mb-3 text-xs leading-relaxed text-pink-800/90">
            ティントルは不登校専門のオンライン個別指導。学び直しから受験対策まで、お子さまのペースに合わせて先生がマンツーマンで伴走します。
          </p>
          <AffiliateAd
            id="moshimo-tintoru"
            hideLabel
            linkClassName="block w-full rounded-xl bg-pink-600 px-5 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-pink-700 active:scale-95"
          />
          <div className="mt-2 text-center text-[10px] text-slate-400">無料体験を申し込む（PR）</div>
        </div>
      </div>
    </section>
  );
}
