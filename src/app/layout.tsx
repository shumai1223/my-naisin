import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

import { APP_DESCRIPTION, APP_NAME, APP_NAME_JA } from '@/lib/constants';
import { CookieConsent } from '@/components/CookieConsent';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: `${APP_NAME} | ${APP_NAME_JA}`,
  description: APP_DESCRIPTION
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${notoSansJp.className} min-h-screen mesh-gradient text-slate-900 antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
