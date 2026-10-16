'use client';

import * as React from 'react';
import { Link2, Check, Quote } from '@/components/icons';

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
    <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
      <div className="mb-2 text-sm font-bold text-slate-900">
        この一覧表は出典明記で自由に引用・転載できます
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        ブログ・記事・配布資料などにご活用ください。引用時は下記のクレジット（出典リンク）の併記にご協力ください。
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="flex min-h-[44px] min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
          {citeSnippet}
        </code>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(citeSnippet, 'cite')}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            {copied === 'cite' ? <Check className="h-4 w-4" /> : <Quote className="h-4 w-4" />}
            {copied === 'cite' ? 'コピーしました' : '引用クレジットをコピー'}
          </button>
          <button
            type="button"
            onClick={() => copy(url, 'url')}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
          >
            {copied === 'url' ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied === 'url' ? 'コピー済' : 'URLをコピー'}
          </button>
        </div>
      </div>
    </div>
  );
}
