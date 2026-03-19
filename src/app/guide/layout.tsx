import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '内申点ガイド｜都道府県別の計算方法・対策 | My Naishin',
  description:
    '全国47都道府県の内申点計算方法を地域別に解説。各県の配点・倍率・対象学年の違いを比較し、効率的な対策方法を紹介します。',
  openGraph: {
    title: '内申点ガイド｜都道府県別の計算方法・対策 | My Naishin',
    description: '全国47都道府県の内申点計算方法を地域別に解説。配点・倍率・対象学年の違いを比較。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/guide',
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
