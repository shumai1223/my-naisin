import type { Metadata } from 'next';

import ComparisonClient from './ComparisonClient';

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '都道府県別 内申点制度の比較｜満点・対象学年・実技倍率を一覧で比較 | My Naishin' },
  description:
    '全国の都道府県で内申点の計算方式はどう違う？満点・対象学年（中1〜中3）・実技4教科の倍率・換算方法を都道府県ごとに比較できます。転居予定や進路検討、地域差の把握に。各都道府県教育委員会の一次情報にもとづく2026年度（令和8年度）入試対応。',
  keywords: [
    '内申点 都道府県 比較',
    '内申点 違い 都道府県',
    '内申点 満点 一覧',
    '内申点 対象学年',
    '実技 倍率 都道府県',
  ],
  alternates: { canonical: 'https://my-naishin.com/comparison' },
  openGraph: {
    title: '都道府県別 内申点制度の比較｜満点・対象学年・実技倍率を一覧で比較 | My Naishin',
    description:
      '都道府県ごとの内申点の満点・対象学年・実技倍率・換算方法を比較。地域差の把握や進路検討に。',
    url: 'https://my-naishin.com/comparison',
    type: 'website',
  },
};

export default function ComparisonPage() {
  return <ComparisonClient />;
}
