'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

interface BlogShareButtonsProps {
  title: string;
  url: string;
  variant?: 'card' | 'inline';
}

export function BlogShareButtons({ title, url, variant = 'card' }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  // LINE share supports URL parameter; including title in url-encoded path
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        <ShareButtons xUrl={xUrl} lineUrl={lineUrl} facebookUrl={facebookUrl} onCopy={handleCopy} copied={copied} size="sm" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-bold text-gray-800">この記事をシェア</h3>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ShareButtons xUrl={xUrl} lineUrl={lineUrl} facebookUrl={facebookUrl} onCopy={handleCopy} copied={copied} />
      </div>
    </div>
  );
}

function ShareButtons({
  xUrl,
  lineUrl,
  facebookUrl,
  onCopy,
  copied,
  size = 'md',
}: {
  xUrl: string;
  lineUrl: string;
  facebookUrl: string;
  onCopy: () => void;
  copied: boolean;
  size?: 'sm' | 'md';
}) {
  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  const iconCls = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Xでシェア"
        className={`inline-flex items-center gap-1.5 rounded-full bg-black text-white font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${padding}`}
      >
        <XIcon className={iconCls} />
        <span>Xでポスト</span>
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINEで送る"
        className={`inline-flex items-center gap-1.5 rounded-full bg-[#06C755] text-white font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${padding}`}
      >
        <LineIcon className={iconCls} />
        <span>LINEで送る</span>
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebookでシェア"
        className={`inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] text-white font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${padding}`}
      >
        <FbIcon className={iconCls} />
        <span>Facebook</span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label="リンクをコピー"
        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-700 font-bold ring-1 ring-gray-200 transition-all hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow ${padding}`}
      >
        {copied ? (
          <>
            <Check className={`${iconCls} text-emerald-600`} />
            <span className="text-emerald-700">コピーしました</span>
          </>
        ) : (
          <>
            <Copy className={iconCls} />
            <span>リンクをコピー</span>
          </>
        )}
      </button>
    </>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.477 3 2 6.7 2 11.262c0 4.09 3.59 7.521 8.435 8.165.328.07.776.215.89.494.103.253.067.65.033.906l-.144.86c-.045.253-.205.99.866.54 1.071-.45 5.78-3.403 7.886-5.83C21.49 14.78 22 13.078 22 11.262 22 6.7 17.523 3 12 3zM8.077 13.96H6.054c-.295 0-.534-.24-.534-.534V9.4c0-.295.24-.534.534-.534.296 0 .535.24.535.534v3.49h1.488c.296 0 .535.24.535.534s-.24.535-.535.535zm2.084-.535c0 .295-.24.535-.534.535-.295 0-.535-.24-.535-.535V9.4c0-.295.24-.534.535-.534.295 0 .534.24.534.534zm5.103 0c0 .23-.147.435-.367.508-.055.018-.113.027-.17.027-.165 0-.323-.077-.426-.21l-2.069-2.815v2.49c0 .295-.24.535-.535.535-.295 0-.535-.24-.535-.535V9.4c0-.23.148-.435.367-.508.055-.019.113-.028.17-.028.166 0 .324.077.427.21l2.07 2.815V9.4c0-.295.239-.534.534-.534.295 0 .534.24.534.534zm3.51-2.602c.296 0 .535.24.535.535s-.24.535-.534.535h-1.488v.99h1.488c.295 0 .534.24.534.535s-.24.534-.534.534h-2.023c-.295 0-.534-.24-.534-.534v-4.03c0-.296.24-.535.534-.535h2.023c.295 0 .534.24.534.535s-.24.535-.534.535h-1.488v.9z" />
    </svg>
  );
}

function FbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}
