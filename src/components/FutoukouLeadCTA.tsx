import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';
import { selectLeadOffer } from '@/lib/lead-config';

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
 *
 * S1-4(2026-08-24): 主枠（ティントル）は従来`moshimo-tintoru`をハードコードしplacement="blog"で
 * 計測していたためauditPlacementOffers()の監査対象から漏れていた。selectLeadOffer({placement:'futoukou'})
 * 経由に切り替え、EVランキングが変わった際に自動追従＋監査カバレッジ対象化する（表示は現状不変＝
 * futoukou placementの解決先は既にmoshimo-tintoruと一致）。副枠（クラスジャパン）は文言差異が大きいため
 * 据え置きのAffiliateAdハードコードのまま残す（完全統合は別タスク）。
 *
 * 見た目（やさしい学習帳）: 薄いブランド面＋罫線の1枠。2案件は同じ見た目の主ボタンで並べ、内側にカードは作らない
 * （PCは縦罫線、スマホは横罫線で区切る）。赤・丸薬・拡大縮小は使わない。
 */
export function FutoukouLeadCTA({ className = '' }: { className?: string }) {
  const tintoruOffer = selectLeadOffer({ placement: 'futoukou' });

  return (
    <section
      className={`overflow-hidden rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6 ${className}`}
    >
      <div className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
        不登校のお子さま・保護者の方へ
      </div>

      <h3 className="mb-2 text-[17px] font-bold leading-snug text-slate-900 md:text-xl">
        「学校に行けない」を、進路の不利にしない選択肢があります
      </h3>
      <p className="mb-5 text-base leading-[1.8] text-slate-900">
        在宅で学べて、出席扱い・内申を問わない学びの場が増えています。気になるものは、まず無料の資料請求・体験で雰囲気を確かめてみてください（費用はかからず、その場で契約を迫られることはありません）。
      </p>

      <div className="grid gap-5 md:grid-cols-2 md:gap-0">
        {/* クラスジャパン小中学園：オンラインフリースクール（出席扱い・無料資料請求） */}
        <div className="relative md:pr-6">
          <CtaViewTracker placement="blog" program="moshimo-classjapan" />
          <h4 className="mb-2 text-base font-bold text-slate-900">
            自宅で「出席扱い」を目指す
          </h4>
          <p className="mb-3 text-sm leading-[1.8] text-slate-900">
            クラスジャパン小中学園は、自宅から参加できるオンラインのフリースクール。在籍校と連携して「出席扱い」を目指せるのが特長です。
          </p>
          <AffiliateAd placement="blog"
            id="moshimo-classjapan"
            hideLabel
            linkClassName="block w-full rounded bg-brand-700 px-5 py-3 text-center text-base font-bold text-white transition-colors hover:bg-brand-800"
          />
          <div className="mt-2 text-center text-sm text-slate-600">無料で資料を取り寄せる（PR）</div>
        </div>

        {/* 主枠（S1-4: selectLeadOffer({placement:'futoukou'})経由・現状はティントルに解決） */}
        <div className="relative border-t border-slate-200 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <CtaViewTracker placement="futoukou" program={tintoruOffer.affiliateId} />
          <h4 className="mb-2 text-base font-bold text-slate-900">
            一人ひとりに合わせた個別指導
          </h4>
          <p className="mb-3 text-sm leading-[1.8] text-slate-900">
            ティントルは不登校専門のオンライン個別指導。学び直しから受験対策まで、お子さまのペースに合わせて先生がマンツーマンで伴走します。
          </p>
          <AffiliateAd placement="futoukou"
            id={tintoruOffer.affiliateId}
            hideLabel
            linkClassName="block w-full rounded bg-brand-700 px-5 py-3 text-center text-base font-bold text-white transition-colors hover:bg-brand-800"
          />
          <div className="mt-2 text-center text-sm text-slate-600">無料体験を申し込む（PR）</div>
        </div>
      </div>
    </section>
  );
}
