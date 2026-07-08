import type { Metadata } from 'next';

import GuideClient from './GuideClient';

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '内申点の計算方法 完全ガイド｜47都道府県の入試制度をやさしく解説 | My Naishin' },
  description:
    '内申点とは何か、計算方法、都道府県ごとの違い、上げ方までをまとめた完全ガイド。換算内申と素内申の違い、実技4教科の倍率、対象学年など、高校受験で必要な内申点の基礎を中学生・保護者向けにやさしく解説します。2026年度（令和8年度）入試対応。',
  keywords: [
    '内申点 ガイド',
    '内申点 とは',
    '内申点 計算方法',
    '換算内申',
    '素内申',
    '高校受験 内申点',
    '内申点 上げ方',
  ],
  alternates: { canonical: 'https://my-naishin.com/guide' },
  openGraph: {
    title: '内申点の計算方法 完全ガイド｜47都道府県の入試制度をやさしく解説 | My Naishin',
    description:
      '内申点の仕組み・計算方法・都道府県別の違い・上げ方を中学生と保護者向けにやさしく解説した完全ガイド。',
    url: 'https://my-naishin.com/guide',
    type: 'website',
  },
};

export default function GuidePage() {
  return <GuideClient />;
}
