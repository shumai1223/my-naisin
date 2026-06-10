import type { MetadataRoute } from 'next';

/**
 * PWAマニフェスト（§11 溶けないプロダクト化：ホーム追加でリピート利用＝再訪の燃料）。
 * アイコンは既存の favicon.svg（ベクタ・サイズ非依存）を流用。env不要で確実に点灯。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Naishin｜内申点・偏差値 計算サイト',
    short_name: 'My Naishin',
    description:
      '全国47都道府県の内申点・偏差値・評定平均を無料で計算。志望校からの逆算・学習計画にも対応。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    lang: 'ja',
    categories: ['education', 'utilities'],
    icons: [
      { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
