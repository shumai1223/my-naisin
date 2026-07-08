import type { Metadata } from 'next';

import ReverseClient from './ReverseClient';

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '志望校から逆算｜合格に必要な当日点 計算ツール【無料】 | My Naishin' },
  description:
    '【無料】志望校に合格するには当日何点必要？現在の内申点と配点比率を入れるだけで、入試本番で取るべき学力検査の点数（当日点）を逆算。東京都1020点満点・神奈川S値にも対応。2026年度（令和8年度）入試対応。',
  keywords: [
    '当日点 計算',
    '当日点 逆算',
    '志望校 逆算',
    '内申点 当日点 計算',
    '都立入試 得点計算',
    '1020点 換算',
    '必要点数 計算',
  ],
  alternates: { canonical: 'https://my-naishin.com/reverse' },
  openGraph: {
    title: '志望校から逆算｜合格に必要な当日点 計算ツール【無料】 | My Naishin',
    description:
      '現在の内申点と配点比率から、入試当日に取るべき学力検査の点数を逆算。東京都1020点・神奈川S値にも対応した無料ツール。',
    url: 'https://my-naishin.com/reverse',
    type: 'website',
  },
};

export default function ReversePage() {
  return <ReverseClient />;
}
