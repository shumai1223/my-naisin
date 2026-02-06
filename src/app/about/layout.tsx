import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営者情報・更新方針 | My Naishin',
  description:
    'My Naishinの運営目的・情報更新方針・参考資料を掲載。全国47都道府県の教育委員会公式資料に基づく内申点計算ツールの運営情報です。',
  openGraph: {
    title: '運営者情報・更新方針 | My Naishin',
    description: 'My Naishinの運営目的・情報更新方針・参考資料を掲載。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
