import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '内申点シミュレーター｜志望校から逆算 | My Naishin',
  description:
    '志望校に合格するには当日何点必要？内申点と配点比率から必要な学力検査点を逆算。東京都1020点満点・神奈川S値にも対応。2026年度入試対応。',
  keywords: ['内申点 逆算', '志望校 内申点', '当日点 計算', '高校受験 逆算', '内申点シミュレーター'],
  openGraph: {
    title: '内申点シミュレーター｜志望校から逆算 | My Naishin',
    description:
      '志望校に合格するには当日何点必要？内申点と配点比率から必要な学力検査点を逆算。東京都1020点・神奈川S値にも対応。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  twitter: {
    card: 'summary_large_image',
    title: '志望校から逆算｜内申点シミュレーター | My Naishin',
    description:
      '志望校に合格するには当日何点必要？内申点と配点比率から逆算。東京1020点・神奈川S値対応。',
  },
  alternates: {
    canonical: 'https://my-naishin.com/reverse',
  },
};

export default function ReverseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
