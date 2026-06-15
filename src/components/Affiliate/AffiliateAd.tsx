import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';
import { CtaViewTracker } from '@/components/Affiliate/CtaViewTracker';

interface AffiliateAdProps {
  id: AffiliateId;
  className?: string;
  /** バナーを中央寄せにする（記事内など）。デフォルトtrue */
  centered?: boolean;
  /** PR表記を非表示にする（フッター近くなどで重複する場合のみ） */
  hideLabel?: boolean;
  /** textタイプのアンカー要素に直接付与するclass。指定するとデフォルトのスタイルを置き換える（ボタン化したいときに使う） */
  linkClassName?: string;
  /** AdSense審査モード（NEXT_PUBLIC_ADSENSE_AUDIT=1）時のみ非表示にする。重複配置の終盤側に付与。合格後は環境変数を消すだけで全復元される。 */
  auditHide?: boolean;
  /** textタイプのアンカー表示文言を上書き（href/トラッキングは維持）。塾の素のアンカー文「【森塾】」等を、CTAボタンとして自然な行動文にしたいときに使う。 */
  ctaText?: string;
  /** 視認時に cta_view を送る（CTR=affiliate_click÷cta_view を取得）。ParentLeadCTA経由は二重計測になるので付けない＝主要バナー面で opt-in。 */
  trackView?: boolean;
  /** trackView時の placement 名（既定 'affiliate'）。県別/blog 等の面別CTRを GA4 で分けるために渡す。 */
  viewPlacement?: string;
  /** trackView時の都道府県コード（面×県のCTR分解用）。 */
  viewPref?: string;
}

export function AffiliateAd({ id, className = '', centered = true, hideLabel = false, linkClassName, auditHide = false, ctaText, trackView = false, viewPlacement, viewPref }: AffiliateAdProps) {
  if (auditHide && process.env.NEXT_PUBLIC_ADSENSE_AUDIT === '1') return null;
  const ad = AFFILIATES[id];
  // 先回し枠（未確定案件）はリンク未確定なので描画しない＝デッドリンク/空ピクセルを出さない。
  if ((ad.status ?? 'live') === 'pending') return null;

  // 視認計測（opt-in）。描画される（pending/auditHideを通過した）ときだけ仕込むので空インプは出ない。
  const viewTracker = trackView ? (
    <CtaViewTracker placement={viewPlacement ?? 'affiliate'} pref={viewPref} program={id} />
  ) : null;

  const label = !hideLabel && (
    <div className="mb-1 text-[10px] font-medium text-slate-400">広告</div>
  );

  const trackingPixel = (
    <img
      src={ad.trackingPixel}
      width={1}
      height={1}
      alt=""
      aria-hidden="true"
      style={{ border: 0, display: 'inline-block' }}
    />
  );

  if (ad.type === 'text') {
    return (
      <span className={className}>
        {viewTracker}
        {!hideLabel && <span className="mr-1 text-[10px] font-medium text-slate-400">[PR]</span>}
        <a
          href={ad.href}
          rel="nofollow sponsored noopener"
          target="_blank"
          data-aff-id={ad.id}
          data-aff-name={ad.name}
          className={linkClassName ?? 'font-bold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700 hover:decoration-blue-500'}
        >
          {ctaText ?? ad.text}
        </a>
        {trackingPixel}
      </span>
    );
  }

  return (
    <div className={`${centered ? 'flex flex-col items-center' : ''} ${className}`}>
      {viewTracker}
      {label}
      <a href={ad.href} rel="nofollow sponsored noopener" target="_blank" data-aff-id={ad.id} data-aff-name={ad.name}>
        <img
          src={ad.imgSrc}
          width={ad.width}
          height={ad.height}
          alt={ad.name}
          loading="lazy"
          decoding="async"
          style={{ border: 0, maxWidth: '100%', height: 'auto' }}
        />
      </a>
      {trackingPixel}
    </div>
  );
}
