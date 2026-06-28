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
  // Cloudflare の「build cache 復元」が webpack の永続FSキャッシュと衝突し、
  // 復元されたパックが欠けると本番ビルドが `ENOENT … client-production/*.pack` で落ちる
  // （Cloudflare側のキャッシュ不整合・コードとは無関係の既知症状）。
  // 本番ビルドでは webpack の永続FSキャッシュを無効化し、壊れたキャッシュを読まないようにする。
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
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
      // 【2026-06-06】自動生成の県別ブログ記事（テンプレ大量生成＝AdSense「有用性の低いコンテンツ」主因）を
      // 同一意図のツールページへ301統合。手書きが残る tokyo/kanagawa/chiba は除外（リダイレクトしない）。
      ...PREFECTURE_CODES
        .filter((code) => !['tokyo', 'kanagawa', 'chiba'].includes(code))
        .map((code) => ({
          source: `/blog/${code}-naishin-calculation-guide`,
          destination: `/${code}/naishin`,
          permanent: true,
        })),
      // 実技オール5戦略の3バージョン重複を -2026-update に統合
      {
        source: '/blog/practical-subjects-all-5-strategy',
        destination: '/blog/practical-subjects-all-5-strategy-2026-update',
        permanent: true,
      },
      {
        source: '/blog/practical-subjects-all-5-strategy-2026',
        destination: '/blog/practical-subjects-all-5-strategy-2026-update',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
