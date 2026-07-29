'use client';

import * as React from 'react';
import { Share2, Download, Loader2 } from 'lucide-react';

import { APP_NAME } from '@/lib/constants';
import type { NaishinTypeDefinition } from '@/lib/naishin-type-diagnosis';
import { EVENTS, track } from '@/lib/track';

import { NaishinTypeShareCard } from './NaishinTypeShareCard';

export interface NaishinTypeShareButtonProps {
  type: NaishinTypeDefinition;
  prefectureName?: string;
}

function dataUrlToFile(dataUrl: string, filename: string) {
  const [meta, content] = dataUrl.split(',');
  const mimeMatch = /data:(.*?);base64/.exec(meta);
  const mime = mimeMatch?.[1] ?? 'image/png';
  const binary = atob(content);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) array[i] = binary.charCodeAt(i);
  return new File([array], filename, { type: mime });
}

/**
 * 内申点タイプ診断のシェアボタン（Λ-13・生徒同士の拡散を狙う共有導線）。
 * ShareModal.tsxと同じ「開いた瞬間に画像を先回り生成→クリック即share」パターンを踏襲
 * （navigator.share()はユーザー操作の直後でないとiOS/Chromeで共有シートが開かないため）。
 * 保護者向けのShareModalとは別に、結果表示直後に軽量なボタン1つとして埋め込む設計にする
 * （モーダルを開かせる追加タップを挟まず、生徒が離脱する前に即共有できるようにする）。
 */
export function NaishinTypeShareButton({ type, prefectureName }: NaishinTypeShareButtonProps) {
  const captureRef = React.useRef<HTMLDivElement | null>(null);
  const [preparedDataUrl, setPreparedDataUrl] = React.useState<string | null>(null);
  const [preparing, setPreparing] = React.useState(true);
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = React.useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setPreparing(true);
    (async () => {
      if (!captureRef.current) return;
      try {
        await document.fonts.ready;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(captureRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        if (!cancelled) setPreparedDataUrl(canvas.toDataURL('image/png', 1.0));
      } catch {
        // 画像生成失敗時はダウンロード/共有ボタンをdisabledのままにする（エラー握りつぶしはしない）
      } finally {
        if (!cancelled) setPreparing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type.id]);

  const onShare = React.useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      showToast('この端末では共有機能が使えません。「画像を保存」からシェアしてね');
      return;
    }
    try {
      const shareData: ShareData = { title: `${APP_NAME}の内申点タイプ診断`, text: `私は「${type.label}」でした！` };
      if (preparedDataUrl) {
        const file = dataUrlToFile(preparedDataUrl, `naishin-type_${type.id}.png`);
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      }
      await navigator.share(shareData);
      track(EVENTS.NAISHIN_TYPE_SHARE, { type_id: type.id, medium: 'native' });
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        showToast('共有できませんでした。「画像を保存」からシェアしてね');
      }
    }
  }, [preparedDataUrl, showToast, type.id, type.label]);

  const onDownload = React.useCallback(() => {
    if (!preparedDataUrl) return;
    const a = document.createElement('a');
    a.href = preparedDataUrl;
    a.download = `naishin-type_${type.id}.png`;
    a.click();
    track(EVENTS.NAISHIN_TYPE_SHARE, { type_id: type.id, medium: 'download' });
    showToast('画像を保存しました！');
  }, [preparedDataUrl, showToast, type.id]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={preparing}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
        >
          {preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          友達にシェアする
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={preparing || !preparedDataUrl}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          保存
        </button>
      </div>
      {toast && <p className="text-center text-xs font-medium text-slate-500">{toast}</p>}

      {/* キャプチャ用の隠し要素（画面表示はしない） */}
      <div className="fixed left-[-9999px] top-0 overflow-hidden">
        <NaishinTypeShareCard ref={captureRef} type={type} prefectureName={prefectureName} />
      </div>
    </div>
  );
}
