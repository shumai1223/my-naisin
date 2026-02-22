import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

import { CookieConsent } from '@/components/CookieConsent';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
  description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。成績推移グラフ、教科別アドバイス、目標設定、勉強タイマー、高校受験に役立つ学習記事をワンストップで提供。',
  keywords: ['内申点', '内申点計算', '高校受験', '成績', '中学生', '内申書', '調査書', '成績管理', '学習アドバイス', '47都道府県'],
  authors: [{ name: 'My Naishin' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
    description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
    description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${notoSansJp.className} min-h-screen mesh-gradient text-slate-900 antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force scroll behavior for Cloudflare Workers
              if (typeof window !== 'undefined') {
                document.body.style.overflowY = 'auto';
                document.documentElement.style.overflowY = 'auto';
                document.body.style.touchAction = 'pan-y';
                
                // Override any scroll prevention
                const originalPreventDefault = Event.prototype.preventDefault;
                Event.prototype.preventDefault = function() {
                  if (this.type === 'touchmove' || this.type === 'wheel') {
                    return; // Allow scroll events
                  }
                  return originalPreventDefault.call(this);
                };
              }
            `,
          }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
