import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ | My Naishin',
  description:
    'My Naishinへのお問い合わせフォーム。不具合報告、情報の誤りに関するご指摘、ご質問などはこちらからご連絡ください。',
  openGraph: {
    title: 'お問い合わせ | My Naishin',
    description: 'My Naishinへのお問い合わせフォーム。不具合報告・ご質問はこちら。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
