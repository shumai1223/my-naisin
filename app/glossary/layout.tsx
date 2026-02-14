import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '内申点 用語辞典（素内申・換算内申・K値・S値…）| My Naishin',
  description:
    '素内申・換算内申・調査書点・K値・S値・観点別評価・傾斜配点・特色検査・ESAT-Jなど、高校入試の内申点に関する重要用語を具体例・注意点・都道府県差とともに解説。',
  keywords: ['内申点 用語', '素内申', '換算内申', 'K値', 'S値', '観点別評価', '調査書点', '内申点 辞典'],
  openGraph: {
    title: '内申点 用語辞典（素内申・換算内申・K値・S値…）| My Naishin',
    description:
      '素内申・換算内申・K値・S値・観点別評価など、高校入試の内申点用語を具体例と県差つきで解説。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点 用語辞典 | My Naishin',
    description:
      '素内申・換算内申・K値・S値・観点別評価など、高校入試の内申点用語を具体例と県差つきで解説。',
  },
  alternates: {
    canonical: 'https://my-naishin.com/glossary',
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
