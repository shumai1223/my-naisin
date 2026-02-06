import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | My Naishin',
  description:
    'My Naishinのプライバシーポリシー。個人情報の取り扱い、Cookie・ローカルストレージの使用目的、広告配信、アクセス解析について説明しています。',
  openGraph: {
    title: 'プライバシーポリシー | My Naishin',
    description: 'My Naishinのプライバシーポリシー。個人情報の取り扱い、Cookie使用について。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
