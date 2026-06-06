import type { MetadataRoute } from 'next';

// AIクローラ方針：回答/検索エンジン(出典引用＋送客あり)は歓迎、学習専用クローラ(見返り無し)は拒否。
// ※ public/robots.txt と整合（静的ファイルが優先される構成のため両方を同一方針に保つ）。
// 検索/回答エンジン(出典引用＋送客あり)=歓迎。
// Anthropicは3分割: Claude-User(質問時取得)/Claude-SearchBot(検索引用)は送客ありで許可、学習用ClaudeBotのみ拒否。
// GooglebotがAI Overview/AI Modeを担うため、別途明示せず下の '*' 許可を維持(クエリURL除外も継承させる)。
const AI_CITATION_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'DuckAssistBot',
  'Meta-ExternalFetcher',
];
// 学習専用クローラ(見返り無し)=拒否。
// Google-Extended拒否はGeminiの学習/グラウンディングのみを止め、AI Overview/AI Mode(Googlebot経由)には影響しない。
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Applebot-Extended',
  'Amazonbot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'AI2Bot',
  'Diffbot',
  'ImagesiftBot',
  'PanguBot',
  'Timpibot',
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
