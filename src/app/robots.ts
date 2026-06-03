import type { MetadataRoute } from 'next';

// AIクローラ方針：回答/検索エンジン(出典引用＋送客あり)は歓迎、学習専用クローラ(見返り無し)は拒否。
// ※ public/robots.txt と整合（静的ファイルが優先される構成のため両方を同一方針に保つ）。
const AI_CITATION_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User'];
const AI_TRAINING_BOTS = [
  'GPTBot',
  'CCBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Bytespider',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_CITATION_BOTS, allow: '/' },
      { userAgent: AI_TRAINING_BOTS, disallow: '/' },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*?*'],
      },
    ],
    sitemap: 'https://my-naishin.com/sitemap.xml',
  };
}
