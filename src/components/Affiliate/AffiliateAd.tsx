import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';

interface AffiliateAdProps {
  id: AffiliateId;
  className?: string;
  /** バナーを中央寄せにする（記事内など）。デフォルトtrue */
  centered?: boolean;
  /** PR表記を非表示にする（フッター近くなどで重複する場合のみ） */
  hideLabel?: boolean;
  /** textタイプのアンカー要素に直接付与するclass。指定するとデフォルトのスタイルを置き換える（ボタン化したいときに使う） */
  linkClassName?: string;
}

export function AffiliateAd({ id, className = '', centered = true, hideLabel = false, linkClassName }: AffiliateAdProps) {
  const ad = AFFILIATES[id];

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
        {!hideLabel && <span className="mr-1 text-[10px] font-medium text-slate-400">[PR]</span>}
        <a
          href={ad.href}
          rel="nofollow sponsored noopener"
          target="_blank"
          className={linkClassName ?? 'font-bold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700 hover:decoration-blue-500'}
        >
          {ad.text}
        </a>
        {trackingPixel}
      </span>
    );
  }

  return (
    <div className={`${centered ? 'flex flex-col items-center' : ''} ${className}`}>
      {label}
      <a href={ad.href} rel="nofollow sponsored noopener" target="_blank">
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
