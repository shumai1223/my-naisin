import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '都道府県別 内申点比較ツール | My Naishin',
  description:
    '47都道府県の内申点計算方法を比較。満点・実技倍率・対象学年・当日点比率の違いを一目で確認。引っ越しや受験先の検討に便利。',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '都道府県別 内申点比較ツール | My Naishin',
    description: '47都道府県の内申点計算方法を比較。満点・実技倍率・対象学年の違いを一目で確認。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/comparison',
  },
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
