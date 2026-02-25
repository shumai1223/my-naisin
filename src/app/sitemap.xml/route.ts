import { PREFECTURES } from '@/lib/prefectures';

export default function sitemap() {
  const baseUrl = 'https://my-naishin.com';
  
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/tools', priority: 0.9, changefreq: 'weekly' },
    { url: '/reverse', priority: 0.9, changefreq: 'weekly' },
    { url: '/prefectures', priority: 0.9, changefreq: 'weekly' },
    { url: '/comparison', priority: 0.8, changefreq: 'weekly' },
    { url: '/glossary', priority: 0.7, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
    { url: '/contact', priority: 0.5, changefreq: 'yearly' },
  ];

  const prefecturePages = PREFECTURES.map(prefecture => ({
    url: `/${prefecture.code}/naishin`,
    priority: 0.8,
    changefreq: 'monthly'
  }));

  const blogPages = [
    { url: '/blog/naishin-guide', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog/target-grade-calculation', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog/practical-subject-importance', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog/grade-ratio-by-prefecture', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog/recommendation-vs-general', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog/tokyo-naishin-calculation', priority: 0.6, changefreq: 'monthly' },
    { url: '/blog/kanagawa-naishin-calculation-guide', priority: 0.6, changefreq: 'monthly' },
    { url: '/blog/chiba-naishin-calculation-guide', priority: 0.6, changefreq: 'monthly' },
  ];

  const allPages = [...staticPages, ...prefecturePages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
