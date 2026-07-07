'use client';

import * as React from 'react';
import { Check, Code2 } from 'lucide-react';

type WidgetKey = 'naishin' | 'hensachi';

const WIDGETS: Record<WidgetKey, { label: string; path: string; title: string }> = {
  naishin: { label: '内申点・評定平均', path: '/embed/naishin', title: '内申点・評定平均 計算ツール｜My Naishin' },
  hensachi: { label: '偏差値（5教科）', path: '/embed/hensachi', title: '偏差値 計算ツール｜My Naishin' },
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
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              active === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {WIDGETS[key].label}
          </button>
        ))}
      </div>

      <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-900 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Code2 className="h-3.5 w-3.5" />
            埋め込みコード（HTML）— {widget.label}
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
            {copied ? 'コピーしました' : 'コードをコピー'}
          </button>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-slate-950 p-3 text-[11px] leading-relaxed text-emerald-300">
          <code>{snippetFor(active)}</code>
        </pre>
      </div>
    </div>
  );
}
