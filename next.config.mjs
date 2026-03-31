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
    // 都道府県ページのリダイレクト（/{code} → /{code}/naishin）
    const prefectureRedirects = PREFECTURE_CODES.map((code) => ({
      source: `/${code}`,
      destination: `/${code}/naishin`,
      permanent: true,
    }));

    // 都道府県リバースページのリダイレクト（/{code}/reverse → /reverse?pref={code}）
    const prefectureReverseRedirects = PREFECTURE_CODES.map((code) => ({
      source: `/${code}/reverse`,
      destination: `/reverse?pref=${code}`,
      permanent: true,
    }));

    return [
      ...prefectureRedirects,
      ...prefectureReverseRedirects,
      {
        source: '/blog/suisen-vs-ippan-naishin',
        destination: '/blog/naishin-guide#制度編',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
