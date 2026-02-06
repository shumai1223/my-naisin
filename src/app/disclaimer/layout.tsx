import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '免責事項 | My Naishin',
  description:
    'My Naishinの免責事項。内申点計算結果の参考値としての位置づけ、情報の正確性、外部リンク、広告について説明しています。',
  openGraph: {
    title: '免責事項 | My Naishin',
    description: 'My Naishinの免責事項。計算結果の参考値としての位置づけについて。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/disclaimer',
  },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
