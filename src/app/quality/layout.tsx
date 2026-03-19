import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '計算精度・品質保証 | My Naishin',
  description:
    'My Naishinの内申点計算精度を検証。都道府県別のテストケース結果、公式資料との照合、品質保証プロセスを公開しています。',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '計算精度・品質保証 | My Naishin',
    description: 'My Naishinの内申点計算精度を検証。テストケース結果と品質保証プロセスを公開。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/quality',
  },
};

export default function QualityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
