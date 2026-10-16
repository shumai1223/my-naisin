import type { Metadata, Viewport } from 'next';
import { BIZ_UDPGothic, Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

import { AdSenseScript } from '@/components/AdSenseScript';
import { CookieConsent } from '@/components/CookieConsent';
import { GlobalHeaderBridge } from '@/components/GlobalHeaderBridge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SiteSchema } from '@/components/StructuredData/SiteSchema';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { AffiliateClickTracker } from '@/components/Affiliate/AffiliateClickTracker';
import { SiteEngagementTracker } from '@/components/SiteEngagementTracker';
import { ExitIntentLineModal } from '@/components/ExitIntentLineModal';
import { StickyConvertBar } from '@/components/StickyConvertBar';

// 本文・見出しの書体: BIZ UDPゴシック（ユニバーサルデザインの書体）。太さは400と700だけ。
// 日本語フォントは巨大なので preload しない（LCP を悪化させない）。
const bizUd = BIZ_UDPGothic({
  variable: '--font-biz-ud',
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
  fallback: ['Noto Sans JP', 'system-ui', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
});

// 予備の書体（BIZ UDPゴシックに無い字を補う）。
const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  display: 'swap',
  // 日本語フォントは巨大なので preload しない（フルfontのpreloadはLCPを悪化させる）。
  preload: false,
  // スワップ中は端末標準の日本語フォントで描画＝字形が近くCLS（レイアウトずれ）を抑える。
  fallback: ['system-ui', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-naishin.com'),
  title: '内申点 計算サイト｜全国47都道府県・無料【2026年度入試対応】| My Naishin',
  description: '中学生向けの無料内申点計算サイト。全国47都道府県の最新方式に対応し、9教科（5教科＋実技4教科）の評定を入れるだけで内申点を瞬時に自動計算。志望校からの逆算機能や、偏差値・評定平均の専用ツールも別ページに用意。2026年度（令和8年度）入試対策に最適です。',
  keywords: ['内申点', '内申点 計算', '内申点 計算サイト', '内申点 自動計算', '内申点 シミュレーション', '内申点 計算 中学生', '高校受験', '中学生', '47都道府県', '2026年度入試', '令和8年度入試'],
  authors: [{ name: 'My Naishin' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: '内申点 計算サイト｜全国47都道府県・無料【2026年度入試対応】| My Naishin',
    description: '全国47都道府県の内申点計算に対応。9教科の評定を入れるだけで自動計算、志望校からの逆算機能つき。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
    url: 'https://my-naishin.com',
    images: [{ url: '/og-image.png', alt: '内申点 計算サイト My Naishin｜全国47都道府県対応・無料' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点 計算サイト｜全国47都道府県・無料【2026年度入試対応】| My Naishin',
    description: '全国47都道府県の内申点計算に対応。9教科の評定を入れるだけで自動計算、志望校からの逆算機能つき。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // サイト所有確認（env を入れた瞬間に <meta> が出る）。
  //  - Google Search Console: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  //  - Bing Webmaster Tools: NEXT_PUBLIC_BING_SITE_VERIFICATION（msvalidate.01 の content 値）
  //    ※ ChatGPT検索は Bing インデックスが母体＝Bing WMT 登録＋サイトマップ提出で AI 送客経路を開通させる。
  ...(() => {
    const verification: NonNullable<Metadata['verification']> = {};
    if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
      verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
    }
    if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
      verification.other = { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION };
    }
    return Object.keys(verification).length ? { verification } : {};
  })(),
};

export const viewport: Viewport = {
  themeColor: '#17543e',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`h-full ${bizUd.variable} ${notoSansJp.variable}`}>
      <head>
        {/* 第三者オリジンへの接続を前倒し（CWV：LCP/INP改善）。フォントは next/font が自己ホストするため
            fonts.gstatic.com への preconnect は不要（むしろアンチパターン）。計測/広告のみ前倒しする。 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://i.moshimo.com" />
      </head>
      <body className="min-h-screen bg-paper font-sans text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:border focus:border-brand-700 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-700"
        >
          本文へスキップ
        </a>
        <GoogleAnalytics />
        <AffiliateClickTracker />
        <SiteEngagementTracker />
        <SiteSchema />
        <div className="print:hidden">
          <GlobalHeaderBridge>
            <Header />
          </GlobalHeaderBridge>
        </div>
        <main id="main-content">{children}</main>
        <div className="print:hidden">
          <Footer />
          <CookieConsent />
          <ExitIntentLineModal />
          <StickyConvertBar />
        </div>
        {/* AdSense撤退（2026-07）：adsbygoogle.js の常時ロードを撤去していた。
            2026-09-24 再開（👤指示）: AdSenseが承認された（pub-7817682248719138・public/ads.txt一致）。
            支払いの住所確認PINは収益$10到達で届くため、自動広告（アンカー・Vignette）を先に動かす目的で読み込む。
            どの形式を出すかはAdSense管理画面の「自動広告」設定で決まる（👤: アンカーON・位置は上／VignetteON／ページ内広告OFF）。
            本文中の手動ユニットは AdSlot（NEXT_PUBLIC_ADSENSE_ENABLED=1 かつ実ユニットID）で別途点火＝ops/tasks/T-ADS1。
            afterInteractive: 本文の描画後に読み込み、LCPを邪魔しない。
            2026-10-16: URLにトークン・成績が載るページ（/admin・/juku/・/hogosha など）では読み込まない（AdSenseScript・lib/adsense-paths.ts）。
            Cookie同意画面の選択に連動する（AdSenseScript.tsx・lib/adsense-consent.ts）: 「すべて許可」のときだけパーソナライズ広告を求め、
            それ以外（必須のみ・未選択・保存領域なし）は非パーソナライズ広告を求める。広告そのものはこの選択にかかわらず表示される。
            GA4はConsent Modeで別途制御。プライバシーポリシーにもその旨を書いてある。 */}
        <AdSenseScript />
      </body>
    </html>
  );
}
