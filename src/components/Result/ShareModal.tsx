'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share2, X, Loader2, CheckCircle } from '@/components/icons';
// canvas-confetti / html2canvas は重い（html2canvas は約150KB+）。共有モーダルを開いて
// 実際に使う瞬間まで読み込まないよう、ハンドラ内の動的 import に寄せて初期バンドルから外す。

import { APP_NAME } from '@/lib/constants';
import type { ResultData, Scores } from '@/lib/types';

import { ShareCard } from '@/components/Result/ShareCard';

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  result: ResultData;
  scores: Scores;
  /** 共有先URL（橋②：保護者最適化ページ /hogosha への文脈付きリンク） */
  shareUrl: string;
  /** 共有に添える本文（「相談したい」動機のメッセージ）。未指定なら従来どおりタイトルのみ。 */
  shareText?: string;
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

// 演出は控えめにする（少量・ブランド色と緑みの灰のみ・動きを減らす設定の端末では出さない）。
async function burstConfetti() {
  const confetti = (await import('canvas-confetti')).default;
  confetti({
    particleCount: 24,
    spread: 40,
    startVelocity: 20,
    ticks: 90,
    scalar: 0.8,
    origin: { y: 0.5 },
    colors: ['#17543e', '#4f6158', '#cddad3'],
    disableForReducedMotion: true
  });
}

type SaveStatus = 'idle' | 'generating' | 'success' | 'error';

export function ShareModal({ open, onClose, result, scores, shareUrl, shareText }: ShareModalProps) {
  const captureRef = React.useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('idle');
  const [toast, setToast] = React.useState<string | null>(null);
  // ネイティブ共有用に「先回り生成」した画像。クリック時に重い処理をしないための要。
  const [preparedDataUrl, setPreparedDataUrl] = React.useState<string | null>(null);
  const [preparing, setPreparing] = React.useState(false);

  const showToast = React.useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const generatePngWithHtml2Canvas = React.useCallback(async () => {
    if (!captureRef.current) return null;
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 100));
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 375,
        height: 667,
      });
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('html2canvas error:', error);
      return null;
    }
  }, []);

  // モーダルを開いた瞬間に画像を先回り生成しておく。
  // Web Share API はユーザー操作の直後でないと共有シートを開かない（iOS/Chrome）。
  // クリック後に html2canvas を回すとアクティベーションが切れて navigator.share() が拒否されるため、
  // ここで事前に用意し、共有ハンドラ側は「重い処理ゼロで即 share」にする。
  React.useEffect(() => {
    if (!open) {
      setPreparedDataUrl(null);
      setPreparing(false);
      return;
    }
    let cancelled = false;
    setPreparing(true);
    (async () => {
      const dataUrl = await generatePngWithHtml2Canvas();
      if (!cancelled) {
        setPreparedDataUrl(dataUrl);
        setPreparing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, generatePngWithHtml2Canvas]);

  const onDownload = React.useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setSaveStatus('generating');
    try {
      const dataUrl = preparedDataUrl ?? (await generatePngWithHtml2Canvas());
      if (!dataUrl) {
        setSaveStatus('error');
        showToast('画像の生成に失敗しました。もう一度お試しください');
        return;
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `my-naishin_${result.rank.code}_${Math.round(result.percent)}.png`;
      a.click();
      burstConfetti();
      setSaveStatus('success');
      showToast('画像を保存しました');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      showToast('画像の生成に失敗しました。もう一度お試しください');
    } finally {
      setBusy(false);
    }
  }, [busy, preparedDataUrl, generatePngWithHtml2Canvas, result.rank.code, result.percent, showToast]);

  const onNativeShare = React.useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      showToast('この端末では共有機能が使えません');
      return;
    }
    // ★ここで html2canvas 等の重い非同期処理を絶対にしない。
    //   画像はモーダル展開時に preparedDataUrl へ生成済み。クリック→即 share でアクティベーションを保つ。
    try {
      const shareData: ShareData = {
        title: APP_NAME,
        text: shareText || undefined,
        url: shareUrl || undefined,
      };
      if (preparedDataUrl) {
        const file = dataUrlToFile(preparedDataUrl, `my-naishin_${result.rank.code}.png`);
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      }
      await navigator.share(shareData);
      burstConfetti();
      showToast('共有しました');
    } catch (err) {
      // AbortError＝ユーザーがキャンセル（正常）なので無視。それ以外は保存導線へ誘導。
      if ((err as Error)?.name !== 'AbortError') {
        showToast('共有できませんでした。「画像を保存」から共有してください');
      }
    }
  }, [preparedDataUrl, result.rank.code, shareUrl, shareText, showToast]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="fixed inset-0 bg-slate-900/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="relative mx-auto flex min-h-full w-full max-w-2xl items-center justify-center px-4 py-6">
            <div className="w-full" role="dialog" aria-modal="true" aria-label="おうちの人に送る">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-overlay">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">おうちの人に送る</h2>
                    <p className="mt-1 text-sm text-slate-600">結果を見せて、受験の相談をはじめよう</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-11 w-11 shrink-0 place-items-center text-slate-600 transition-colors hover:text-slate-900"
                    aria-label="閉じる"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
                    {/* Preview */}
                    <div className="mx-auto w-full max-w-[200px]">
                      <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div className="h-full w-full origin-top-left scale-[0.533]">
                          {/* プレビュー表示専用（キャプチャ対象は下部の隠し要素1つに統一） */}
                          <ShareCard result={result} scores={scores} />
                        </div>
                      </div>
                      <div className="mt-3 text-center text-xs text-slate-600">
                        スマホ縦長サイズ (9:16)
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      {/* Tips */}
                      <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                        <div className="text-sm font-bold text-slate-900">おうちの人に見せると、相談がはじめやすい</div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-900">
                          「端末の共有機能」からLINEで送ると手軽です。リンクから保護者の方が「今からできる対策」を確認できます。
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={onDownload}
                          disabled={busy}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-70"
                        >
                          {saveStatus === 'generating' ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>生成中...</span>
                            </>
                          ) : saveStatus === 'success' ? (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              <span>保存しました</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-5 w-5" />
                              <span>画像を保存</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onNativeShare}
                          disabled={preparing}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                        >
                          {preparing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>画像を準備中…</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="h-4 w-4" />
                              <span>LINEなどで送る</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Hint */}
                      <p className="text-xs text-slate-600">
                        ※ 共有機能はスマホ・タブレットで利用できます
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toast */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none fixed inset-x-4 bottom-6 flex justify-center"
                  >
                    <div className="rounded bg-slate-900 px-4 py-3 text-sm text-white shadow-overlay">
                      {toast}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hidden capture element */}
          <div className="fixed left-[-9999px] top-0 overflow-hidden">
            <div className="h-[667px] w-[375px] bg-white">
              <ShareCard ref={captureRef} result={result} scores={scores} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
