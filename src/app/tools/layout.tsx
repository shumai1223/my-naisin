import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '内申点ツール一覧｜計算・逆算・比較 | My Naishin',
  description:
    '内申点計算ツール、志望校からの逆算ツール、都道府県別比較ツールなど、高校受験に役立つ無料ツールを一覧で紹介。47都道府県対応。',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '内申点ツール一覧｜計算・逆算・比較 | My Naishin',
    description: '内申点計算・逆算・都道府県比較など、高校受験に役立つ無料ツール一覧。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/tools',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
