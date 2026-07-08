import type { Metadata } from 'next';

import GlossaryClient from './GlossaryClient';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '高校受験の用語辞典｜内申点・調査書・偏差値・換算内申をやさしく解説 | My Naishin' },
  description:
    '高校受験でよく出る用語を中学生・保護者向けにやさしく解説した用語辞典。内申点・調査書点・換算内申・素内申・評定平均・偏差値・S値・特色検査・観点別評価など、意味と使われ方をまとめて確認できます。2026年度（令和8年度）入試対応。',
  keywords: [
    '高校受験 用語',
    '内申点 用語',
    '調査書 とは',
    '換算内申 とは',
    '素内申 とは',
    '観点別評価 とは',
    '偏差値 とは',
  ],
  alternates: { canonical: 'https://my-naishin.com/glossary' },
  openGraph: {
    title: '高校受験の用語辞典｜内申点・調査書・偏差値・換算内申をやさしく解説 | My Naishin',
    description:
      '内申点・調査書・換算内申・偏差値・S値など、高校受験の用語をやさしく解説した用語辞典。',
    url: 'https://my-naishin.com/glossary',
    type: 'website',
  },
};

export default function GlossaryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '用語辞典', url: 'https://my-naishin.com/glossary' },
        ]}
      />
      <GlossaryClient />
    </>
  );
}
