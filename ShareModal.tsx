'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, Share2, X, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

import { APP_NAME, MODE_CONFIG, SUBJECTS } from '@/lib/constants';
import type { ResultData, Scores } from '@/lib/types';
import { buildShareText, cn } from '@/lib/utils';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShareCard } from './ShareCard';

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
    particleCount: 90,
    spread: 65,
    startVelocity: 35,
    ticks: 220,
    scalar: 0.95,
    origin: { y: 0.6 }
  });
}

type SaveStatus = 'idle' | 'generating' | 'success' | 'error';

export function ShareModal({ open, onClose, result, scores, shareUrl }: ShareModalProps) {
  const captureRef = React.useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('idle');
  const [toast, setToast] = React.useState<string | null>(null);

  const shareText = React.useMemo(() => {
    return buildShareText({
      appName: APP_NAME,
      rankCode: result.rank.code,
      title: result.rank.title,
      total: result.total,
      max: result.max,
      percent: result.percent,
      url: shareUrl || 'https://example.com'
    });
  }, [result, shareUrl]);

  const showToast = React.useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('テキストをコピーした');
    } catch {
      showToast('コピーできなかった…ブラウザ設定を確認してね');
    }
  }, [shareText, showToast]);

  const generatePngWithHtml2Canvas = React.useCallback(async () => {
    if (!captureRef.current) return null;
    
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(captureRef.current, {
        scale: 2, // High resolution for mobile/SNS
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

  const onDownload = React.useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setSaveStatus('generating');
    try {
      const dataUrl = await generatePngWithHtml2Canvas();
      if (!dataUrl) {
        setSaveStatus('error');
        showToast('画像生成に失敗…もう一回やってみて');
        return;
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `my-naishin_${result.rank.code}_${Math.round(result.percent)}.png`;
      a.click();
      burstConfetti();
      setSaveStatus('success');
      showToast('画像を保存した！');
      // Reset status after a delay
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      showToast('画像生成に失敗…もう一回やってみて');
    } finally {
      setBusy(false);
    }
  }, [busy, generatePngWithHtml2Canvas, result.rank.code, result.percent, showToast]);

  const onNativeShare = React.useCallback(async () => {
    if (busy) return;

    if (typeof navigator === 'undefined' || !navigator.share) {
      showToast('この端末では共有が使えないみたい…');
      return;
    }

    setBusy(true);
    setSaveStatus('generating');
    try {
      const dataUrl = await generatePngWithHtml2Canvas();
      if (!dataUrl) {
        setSaveStatus('error');
        return;
      }

      const file = dataUrlToFile(dataUrl, `my-naishin_${result.rank.code}.png`);
      const shareData: ShareData = {
        title: APP_NAME,
        text: shareText,
        url: shareUrl || undefined
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }

      await navigator.share(shareData);
      burstConfetti();
      setSaveStatus('success');
      showToast('共有した！');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
      showToast('共有がキャンセルされたかも');
    } finally {
      setBusy(false);
    }
  }, [busy, generatePngWithHtml2Canvas, result.rank.code, shareText, shareUrl, showToast]);

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
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            role="button"
            tabIndex={-1}
            aria-label="閉じる"
          />

          <div className="relative mx-auto flex min-h-screen w-full max-w-3xl items-end p-4 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="w-full"
            >
              <Card className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-bold text-slate-800">シェア用の画像を作る</div>
                    <div className="mt-1 text-xs text-slate-500">PCでもスマホ縦長(9:16)で保存できる</div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="閉じる"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[240px_1fr] md:items-start">
                  <div className="mx-auto w-full max-w-[240px]">
                    <div className="aspect-[9/16] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="h-full w-full scale-[0.64] origin-top-left">
                        <ShareCard ref={captureRef} result={result} scores={scores} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-500">
                      <ImageIcon className="h-3 w-3" />
                      プレビュー（縮小表示）
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="text-xs font-semibold text-blue-700">おすすめ</div>
                      <div className="mt-1 text-xs leading-relaxed text-blue-600">
                        まず「画像を保存」→SNS/LINEに貼るのが最速。
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        variant="primary"
                        loading={busy && saveStatus === 'generating'}
                        onClick={onDownload}
                        leftIcon={
                          saveStatus === 'generating' ? <Loader2 className="h-4 w-4 animate-spin" /> :
                          saveStatus === 'success' ? <CheckCircle className="h-4 w-4" /> :
                          <Download className="h-4 w-4" />
                        }
                      >
                        {saveStatus === 'generating' ? '生成中...' : saveStatus === 'success' ? '保存完了！' : '画像を保存'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={onCopy}
                        leftIcon={<Copy className="h-4 w-4" />}
                      >
                        テキストをコピー
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={onNativeShare}
                        leftIcon={<Share2 className="h-4 w-4" />}
                        className="sm:col-span-2"
                      >
                        共有（対応端末）
                      </Button>
                    </div>

                  </div>
                </div>

                {toast ? (
                  <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
                    <div className="rounded-full bg-slate-800 px-4 py-2 text-xs text-white shadow-lg">
                      {toast}
                    </div>
                  </div>
                ) : null}

                {/* Hidden capture element for html2canvas */}
                <div className="fixed left-[-9999px] top-0 overflow-hidden">
                  <div className="h-[667px] w-[375px] bg-white">
                    <ShareCard ref={captureRef} result={result} scores={scores} />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
