// 都道府県コード一覧（ビルド時に静的生成するためハードコード）
const PREFECTURE_CODES = [
  'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
  'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
  'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi',
  'mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
  'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
  'tokushima', 'kagawa', 'ehime', 'kochi',
  'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa',
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // 都道府県リバースページのリダイレクト（/{code}/reverse → /reverse?pref={code}）
      // /reverse?pref={code}に統一したため、不要なリダイレクトを削除
      ...PREFECTURE_CODES.map((code) => ({
        source: `/${code}/reverse`,
        destination: `/reverse?pref=${code}`,
        permanent: true,
      })),
      {
        source: '/blog/suisen-vs-ippan-naishin',
        destination: '/blog/naishin-guide#制度編',
        permanent: true
      },
      // 旧 all-3-high-school-options ページを2026年最新版に統合（authority集約）
      {
        source: '/blog/all-3-high-school-options',
        destination: '/blog/all-3-high-school-options-2026-update',
        permanent: true
      },
    ];
  },
};

export default nextConfig;
