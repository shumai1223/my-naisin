/**
 * User-Agent ベースのボット判定（/go の無効クリック・D1データ汚染を防ぐ二重防御）。
 *
 * 背景（2026-06-20）：robots.txt / robots.ts は両方とも /go/ を disallow 済みだが、
 * 規約を無視するクローラ・スクレイパ・スキャナ・リンクプレビューbotが /go を直接踏み、
 * 1時間で37県×13案件を総当たりする“偽クリック”が D1 に流入した（referer 98%が空）。
 * これを放置すると ①ダッシュボードの数字が幻になる ②勝者分析が汚れる
 * ③ASPリダイレクト先に無効クリックが計上され EPC悪化/アカウントリスク、になる。
 *
 * 実ブラウザの UA（Mozilla/AppleWebKit/Chrome/Safari/Gecko 等）には下記トークンが含まれないため、
 * 誤検出しにくい。UA が空＝スクリプト直叩きとみなして bot 扱いする（実ブラウザは必ず UA を送る）。
 */
const BOT_UA_RE =
  /bot|crawl|spider|slurp|mediapartners|googlebot|bing|yandex|baidu|duckduck|sogou|exabot|facebookexternalhit|facebot|ia_archiver|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|headless|phantom|puppeteer|playwright|selenium|lighthouse|gtmetrix|pingdom|uptime|statuscake|monitor|python|curl|wget|libwww|okhttp|java(\/| )|go-http|scrapy|node-fetch|axios|postman|insomnia|scraper|scan|preview|embed|feedfetcher|apache-httpclient|gptbot|chatgpt|oai-searchbot|claudebot|claude-web|anthropic|ccbot|amazonbot|applebot|perplexity|google-extended|cohere|diffbot|dataforseo|serpstat|screaming|httpx|zgrab|masscan|nuclei|censys|nikto|wpscan|fasthttp|httpclient|guzzle|colly|dalvik|electron|crawler|fetch\b/i;

/**
 * 化石UA＝実ブラウザ集団がもう存在しない古さのUAを名乗る既知ボット。
 * 2026-07-13実測: 「iPhone OS 13_2_3」(2019年11月のiOS)を名乗る分散スクレイパが
 * 98IP・118クリックで/goを総当たりしASPへ到達していた。2026年にこのUAで
 * アフィリンクを踏む実ユーザー集団は統計的に存在しないため丸ごとbot扱いする。
 */
const FROZEN_UA_RE = /iPhone OS 13_2_3/;

/**
 * UA がボット/スクリプトらしいか。空 UA も bot 扱い（true）。
 * /go ルートで true のときは ASP に飛ばさず・記録もしない。
 */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || !ua.trim()) return true;
  return BOT_UA_RE.test(ua) || FROZEN_UA_RE.test(ua);
}

/**
 * prefetch/prerender（ブラウザやアプリの先読み）リクエストか。
 * クリック意図が無いままASPへ転送するとA8等に無効クリックが計上されるため、/go では 204 で止める。
 * Chrome/Edge は Sec-Purpose、旧仕様は Purpose、Firefox は X-Moz を送る。
 */
export function isPrefetchRequest(headers: { get(name: string): string | null }): boolean {
  const purpose = `${headers.get('sec-purpose') ?? ''} ${headers.get('purpose') ?? ''} ${headers.get('x-moz') ?? ''}`.toLowerCase();
  return /prefetch|prerender|preview/.test(purpose);
}

/**
 * referer が自サイト（my-naishin.com）由来か。
 * 重要：CTA→/go は同一オリジン遷移で、リンクに noreferrer を付けておらず
 * Referrer-Policy=strict-origin-when-cross-origin のため、実ブラウザのクリックは
 * 必ず my-naishin.com の referer を伴う。よって「内部refererの有無」が人/botの強い分離軸になる。
 */
export function isInternalReferer(referer: string | null | undefined): boolean {
  if (!referer) return false;
  try {
    const h = new URL(referer).hostname;
    return h === 'my-naishin.com' || h.endsWith('.my-naishin.com');
  } catch {
    return false;
  }
}

export type ClickTrust = 'human' | 'suspect' | 'bot' | 'unknown';

/**
 * クリックの信頼度を1か所で判定（ダッシュボードの正準ロジック）。
 *  - unknown … UA未記録の旧データ（判定不能）
 *  - bot     … UAがbot/スクリプト（または空UA）
 *  - human   … ブラウザUA かつ 自サイト referer あり（＝実際に当サイトの面から押された）
 *  - suspect … ブラウザUAだが 内部referer無し（/go直叩きのスクレイパが大半。privacyブラウザや外部embedも稀に含む）
 *
 * /go ルートは bot-UA・空UA・IPバーストを取り込み時点で弾くので、新規データの大半は human / suspect に分かれる。
 */
export function classifyClick(c: { userAgent?: string | null; referer?: string | null }): ClickTrust {
  if (c.userAgent === undefined || c.userAgent === null) return 'unknown';
  if (isBotUserAgent(c.userAgent)) return 'bot';
  return isInternalReferer(c.referer) ? 'human' : 'suspect';
}
