import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | My Naishin',
  description:
    'My Naishinの利用規約。サービス内容、データの端末内保存、免責事項、禁止行為について説明しています。',
  openGraph: {
    title: '利用規約 | My Naishin',
    description: 'My Naishinの利用規約。サービス内容、端末内データ保存、免責事項について。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
