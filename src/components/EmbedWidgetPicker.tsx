'use client';

import * as React from 'react';
import { Check, Copy } from '@/components/icons';

type WidgetKey = 'naishin' | 'hensachi' | 'gakushu_seiseki';

const WIDGETS: Record<WidgetKey, { label: string; path: string; title: string }> = {
  naishin: { label: '内申点・評定平均', path: '/embed/naishin', title: '内申点・評定平均 計算ツール｜My Naishin' },
  hensachi: { label: '偏差値（5教科）', path: '/embed/hensachi', title: '偏差値 計算ツール｜My Naishin' },
  gakushu_seiseki: {
    label: '学習成績の状況（大学受験）',
    path: '/embed/gakushu-seiseki',
    title: '学習成績の状況 計算ツール｜My Naishin',
  },
};

function snippetFor(key: WidgetKey): string {
  const w = WIDGETS[key];
  return `<iframe src="https://my-naishin.com${w.path}" width="100%" height="640" style="border:1px solid #e5e7eb;border-radius:16px;max-width:480px" title="${w.title}" loading="lazy"></iframe>
<p style="max-width:480px;margin:6px auto 0;font-size:12px;color:#64748b;text-align:center">${w.label} 計算ツール by <a href="https://my-naishin.com/" target="_blank" rel="noopener">My Naishin（内申点 計算サイト）</a></p>`;
}

/**
 * 埋め込みウィジェットの種類選択＋プレビュー＋コピー用コードを1つにまとめたコンポーネント（E-7）。
 * ウィジェットを増やしても WIDGETS に1件足すだけで選択肢・プレビュー・コードが揃う。
 */
export function EmbedWidgetPicker() {
  const [active, setActive] = React.useState<WidgetKey>('naishin');
  const [copied, setCopied] = React.useState(false);
  const widget = WIDGETS[active];

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippetFor(active));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボード非対応環境では無視 */
    }
  }, [active]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(WIDGETS) as WidgetKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            aria-pressed={active === key}
            className={`min-h-[44px] rounded border px-4 py-2 text-sm font-bold transition-colors ${
              active === key
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
            }`}
          >
            {WIDGETS[key].label}
          </button>
        ))}
      </div>

      <div className="flex justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
        <iframe
          key={widget.path}
          src={widget.path}
          width="100%"
          height={640}
          style={{ border: '1px solid #e5e7eb', borderRadius: 16, maxWidth: 480, background: '#fff' }}
          title={widget.title}
          loading="lazy"
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-900">
            埋め込みコード（HTML）— {widget.label}
          </p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'コピーしました' : 'コードをコピー'}
          </button>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-900">
          <code>{snippetFor(active)}</code>
        </pre>
      </div>
    </div>
  );
}
