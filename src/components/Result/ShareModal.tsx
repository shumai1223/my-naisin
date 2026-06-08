'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share2, X, Loader2, CheckCircle, Sparkles, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

import { APP_NAME } from '@/lib/constants';
import type { ResultData, Scores } from '@/lib/types';
import { cn } from '@/lib/utils';

import { ShareCard } from '@/components/Result/ShareCard';

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  result: ResultData;
  scores: Scores;
  shareUrl: string;
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

function burstConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 40,
    ticks: 250,
    scalar: 1,
    origin: { y: 0.5 }
  });
}

type SaveStatus = 'idle' | 'generating' | 'success' | 'error';

export function ShareModal({ open, onClose, result, scores, shareUrl }: ShareModalProps) {
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
        showToast('画像生成に失敗…もう一回試してね');
        return;
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `my-naishin_${result.rank.code}_${Math.round(result.percent)}.png`;
      a.click();
      burstConfetti();
      setSaveStatus('success');
      showToast('🎉 画像を保存しました！');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      showToast('画像生成に失敗…もう一回試してね');
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
      showToast('🎉 共有しました！');
    } catch (err) {
      // AbortError＝ユーザーがキャンセル（正常）なので無視。それ以外は保存導線へ誘導。
      if ((err as Error)?.name !== 'AbortError') {
        showToast('共有できませんでした。「画像を保存」からシェアしてね');
      }
    }
  }, [preparedDataUrl, result.rank.code, shareUrl, showToast]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const rankColors: Record<string, { gradient: string; glow: string }> = {
    S: { gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', glow: 'shadow-purple-500/25' },
    A: { gradient: 'from-blue-500 via-indigo-500 to-violet-500', glow: 'shadow-indigo-500/25' },
    B: { gradient: 'from-cyan-500 via-blue-500 to-indigo-500', glow: 'shadow-blue-500/25' },
    C: { gradient: 'from-slate-400 via-slate-500 to-slate-600', glow: 'shadow-slate-500/25' },
  };
  const colors = rankColors[result.rank.code] || rankColors.C;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header with gradient */}
                <div className={cn('relative bg-gradient-to-r p-6 text-white', colors.gradient)}>
                  <div className="absolute inset-0 bg-white/5" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">シェア画像を作成</h2>
                        <p className="mt-0.5 text-sm text-white/80">結果をSNSでシェアしよう</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
                      aria-label="閉じる"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
                    {/* Preview */}
                    <div className="mx-auto w-full max-w-[200px]">
                      <div className={cn(
                        'aspect-[9/16] w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-xl',
                        colors.glow
                      )}>
                        <div className="h-full w-full origin-top-left scale-[0.533]">
                          {/* プレビュー表示専用（キャプチャ対象は下部の隠し要素1つに統一） */}
                          <ShareCard result={result} scores={scores} />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>スマホ縦長サイズ (9:16)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      {/* Tips */}
                      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-blue-900">おすすめの使い方</div>
                            <p className="mt-1 text-xs leading-relaxed text-blue-700">
                              「画像を保存」してからSNSやLINEに貼り付けるのが一番カンタン！
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={onDownload}
                          disabled={busy}
                          className={cn(
                            'group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r py-4 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70',
                            colors.gradient,
                            colors.glow
                          )}
                        >
                          <div className="absolute inset-0 bg-white/0 transition-all group-hover:bg-white/10" />
                          <div className="relative flex items-center justify-center gap-2 font-semibold">
                            {saveStatus === 'generating' ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>生成中...</span>
                              </>
                            ) : saveStatus === 'success' ? (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                <span>保存完了！</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-5 w-5" />
                                <span>画像を保存</span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={onNativeShare}
                          disabled={preparing}
                          className="group w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-70"
                        >
                          <div className="flex items-center justify-center gap-2 font-medium">
                            {preparing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                <span>画像を準備中…</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-600" />
                                <span>端末の共有機能を使う</span>
                              </>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Hint */}
                      <p className="text-center text-xs text-slate-400">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pointer-events-none absolute inset-x-0 bottom-[-60px] flex justify-center"
                  >
                    <div className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl">
                      {toast}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
