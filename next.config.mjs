const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/blog/suisen-vs-ippan-naishin',
        destination: '/blog/naishin-guide#制度編',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
