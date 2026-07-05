'use client';

import * as React from 'react';
import { Share2, Check, QrCode } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { APP_NAME } from '@/lib/constants';
import {
  buildParentShareUrl,
  buildParentShareMessage,
  encodeSharePayload,
  type ParentShareContext,
} from '@/lib/share';

/**
 * 橋②（生徒→保護者バトン）の軽量な送り手ボタン。
 *
 * Web Share API ＋ クリップボードで「保護者最適化ページ /hogosha」への文脈付きリンクを共有する。
 * さらに（withImage）サーバー生成の成績レポート画像（/api/card）を Web Share に**ファイル添付**できる：
 * 視覚カードは LINE 等の開封率を大きく上げる主因。html2canvas を使う ShareModal と違い、
 * サーバーSVG→canvas→PNG で軽量に画像を作るので、総合得点・偏差値など内申点以外のツールでも
 * 画像つき共有を出せる。画像生成はベストエフォートで、失敗してもリンク共有は必ず成立する。
 *
 * metricLabel を ctx に載せると、/hogosha 着地バナーとカードが「総合得点の成績レポート」等に切り替わる。
 */

/** /api/card の SVG を取得して PNG の File に変換（同一オリジン・外部参照なしなので canvas は汚染されない）。 */
async function buildCardFile(d: string, filename: string): Promise<File | null> {
  try {
    if (typeof document === 'undefined') return null;
    const res = await fetch(`/api/card?d=${encodeURIComponent(d)}`);
    if (!res.ok) return null;
    const svgText = await res.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const objUrl = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('svg image load failed'));
        img.src = objUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!pngBlob) return null;
      return new File([pngBlob], filename, { type: 'image/png' });
    } finally {
      URL.revokeObjectURL(objUrl);
    }
  } catch {
    return null;
  }
}

export function ParentShareLinkButton({
  ctx,
  className = '',
  tool,
  label = 'おうちの人に結果を送る',
  withImage = true,
}: {
  ctx: ParentShareContext;
  className?: string;
  /** 計装用のツール識別子（例: 'total-score'）。 */
  tool?: string;
  label?: string;
  /** 成績レポート画像（/api/card）を Web Share に添付する（既定 true）。 */
  withImage?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const [qrUrl, setQrUrl] = React.useState<string | null>(null);
  // Web Share API はユーザー操作直後でないとファイル共有を拒否する（iOS/Chrome）ため、
  // クリック時に重い生成をせず、マウント時に先回りで画像を用意しておく。
  const fileRef = React.useRef<File | null>(null);
  const payload = React.useMemo(() => encodeSharePayload(ctx), [ctx]);

  React.useEffect(() => {
    if (!withImage) return;
    let cancelled = false;
    (async () => {
      const file = await buildCardFile(payload, 'my-naishin-report.png');
      if (!cancelled) fileRef.current = file;
    })();
    return () => {
      cancelled = true;
    };
  }, [payload, withImage]);

  const onShare = React.useCallback(async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const url = buildParentShareUrl(origin, ctx);
    const text = buildParentShareMessage(ctx);

    track(EVENTS.SHARE_TO_PARENT, {
      pref: ctx.prefectureCode ?? 'none',
      metric: ctx.metricLabel ?? '内申点',
      ...(tool ? { tool } : {}),
    });

    // スマホ＝ネイティブ共有シート（LINE等）。可能なら成績レポート画像も添付。
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const data: ShareData = { title: APP_NAME, text, url };
        const file = fileRef.current;
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          data.files = [file];
          track(EVENTS.SHARE_IMAGE, {
            pref: ctx.prefectureCode ?? 'none',
            metric: ctx.metricLabel ?? '内申点',
            ...(tool ? { tool } : {}),
          });
        }
        await navigator.share(data);
        return;
      } catch (err) {
        // ユーザーキャンセル（AbortError）は何もしない。それ以外はコピーへフォールバック。
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // クリップボードも不可なら何もしない（最低限ボタンは壊さない）。
    }
  }, [ctx, tool]);

  // その場（同じ部屋）にいる保護者にスマホで直接読み取ってもらうQRコード。
  // parent_landing_view がほぼ0という実測（リンク共有は後で開かれずに流れがち）への
  // 即席の打ち手＝「今、目の前で見せる」導線。外部QR生成サービス（画像のみ・データ送信なし）を使い、
  // 依存追加なしで実装する。
  const onToggleQr = React.useCallback(() => {
    if (qrUrl) {
      setQrUrl(null);
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const targetUrl = buildParentShareUrl(origin, ctx);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`);
    track(EVENTS.SHARE_QR_REVEAL, {
      pref: ctx.prefectureCode ?? 'none',
      metric: ctx.metricLabel ?? '内申点',
      ...(tool ? { tool } : {}),
    });
  }, [ctx, tool, qrUrl]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            リンクをコピーしました
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            {label}
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onToggleQr}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800"
      >
        <QrCode className="h-3.5 w-3.5" />
        {qrUrl ? 'QRコードを閉じる' : '今、そばにいるなら：QRコードで見せる'}
      </button>
      {qrUrl && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="保護者のスマホで読み取るQRコード" width={160} height={160} className="rounded-lg bg-white p-2 shadow-sm" />
          <p className="text-center text-[11px] text-slate-500">保護者のスマホのカメラで読み取ると、この結果がそのまま開きます</p>
        </div>
      )}
    </div>
  );
}
