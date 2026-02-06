import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '都道府県別 内申点計算一覧（47都道府県対応）| My Naishin',
  description:
    '全国47都道府県の内申点計算方法を一覧で比較。満点・対象学年・実技倍率の違いが一目でわかる。都道府県を選んですぐに内申点を計算できます。2026年度入試対応。',
  keywords: ['内申点 都道府県', '内申点 計算方法 一覧', '47都道府県 内申点', '高校受験 内申点'],
  openGraph: {
    title: '都道府県別 内申点計算一覧（47都道府県対応）| My Naishin',
    description:
      '全国47都道府県の内申点計算方法を一覧で比較。満点・対象学年・実技倍率が一目でわかる。2026年度入試対応。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  twitter: {
    card: 'summary_large_image',
    title: '都道府県別 内申点計算一覧（47都道府県対応）| My Naishin',
    description:
      '全国47都道府県の内申点計算方法を一覧で比較。満点・対象学年・実技倍率が一目でわかる。',
  },
  alternates: {
    canonical: 'https://my-naishin.com/prefectures',
  },
};

export default function PrefecturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
