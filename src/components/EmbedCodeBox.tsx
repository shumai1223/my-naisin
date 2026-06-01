'use client';

import * as React from 'react';
import { Check, Code2 } from 'lucide-react';

/**
 * 埋め込みウィジェットのiframeコードをワンクリックでコピーさせる被リンク導線。
 * ブロガー・塾サイトが貼るたびに my-naishin.com への被リンクが増える。
 *
 * 重要：iframe内のリンクは別ドキュメント＝埋め込み元からの被リンクにならない。
 * そのため iframe の「外（ホストページ側）」に必ず表示クレジットの <a href> を入れる。
 * これが埋め込み元ドメインからの実被リンクになる（widget backlinkの定石）。
 */
const SNIPPET = `<iframe src="https://my-naishin.com/embed/naishin" width="100%" height="640" style="border:1px solid #e5e7eb;border-radius:16px;max-width:480px" title="内申点・評定平均 計算ツール｜My Naishin" loading="lazy"></iframe>
<p style="max-width:480px;margin:6px auto 0;font-size:12px;color:#64748b;text-align:center">内申点・評定平均の計算ツール by <a href="https://my-naishin.com/" target="_blank" rel="noopener">My Naishin（内申点 計算サイト）</a></p>`;

export function EmbedCodeBox() {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボード非対応環境では無視
    }
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Code2 className="h-3.5 w-3.5" />
          埋め込みコード（HTML）
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
        <code>{SNIPPET}</code>
      </pre>
    </div>
  );
}
