'use client';

import * as React from 'react';
import { Link2, Check, Quote } from 'lucide-react';

/**
 * 「引用・出典として使ってもOK」を明示し、出典リンク付きHTMLをワンクリックでコピーさせる被リンク導線。
 *
 * 戦略：当サイトの「全国47都道府県 内申点 計算方式 比較一覧」は、塾ブログ・教育系まとめ記事・保護者ブログが
 * 参照したくなる一次情報アセット。引用のたびに被リンクが自然発生するよう、コピペ用の出典クレジット（被リンク付き）を
 * 用意して引用の摩擦を下げる。data-site 系サイトが被リンクを集める王道の手法。
 */
export function CiteAssetBox() {
  const [copied, setCopied] = React.useState<'cite' | 'url' | null>(null);

  const citeSnippet =
    '出典：<a href="https://my-naishin.com/" target="_blank" rel="noopener">内申点 計算サイト「My Naishin」</a>（全国47都道府県 内申点 計算方式 比較一覧）';
  const url = 'https://my-naishin.com/';

  const copy = React.useCallback(async (text: string, which: 'cite' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // クリップボード非対応環境では無視
    }
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
        <Quote className="h-3.5 w-3.5 text-blue-500" />
        この一覧表は出典明記で自由に引用・転載できます
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
        ブログ・記事・配布資料などにご活用ください。引用時は下記のクレジット（出典リンク）の併記にご協力ください。
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
          {citeSnippet}
        </code>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => copy(citeSnippet, 'cite')}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
          >
            {copied === 'cite' ? <Check className="h-3.5 w-3.5" /> : <Quote className="h-3.5 w-3.5" />}
            {copied === 'cite' ? 'コピーしました' : '引用クレジットをコピー'}
          </button>
          <button
            type="button"
            onClick={() => copy(url, 'url')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
          >
            {copied === 'url' ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {copied === 'url' ? 'コピー済' : 'URLをコピー'}
          </button>
        </div>
      </div>
    </div>
  );
}
