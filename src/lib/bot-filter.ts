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
  /bot|crawl|spider|slurp|mediapartners|googlebot|bing|yandex|baidu|duckduck|sogou|exabot|facebookexternalhit|facebot|ia_archiver|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|headless|phantom|puppeteer|playwright|selenium|lighthouse|gtmetrix|pingdom|uptime|statuscake|monitor|python|curl|wget|libwww|okhttp|java(\/| )|go-http|scrapy|node-fetch|axios|postman|insomnia|scraper|scan|preview|embed|feedfetcher|apache-httpclient/i;

/**
 * UA がボット/スクリプトらしいか。空 UA も bot 扱い（true）。
 * /go ルートで true のときは ASP に飛ばさず・記録もしない。
 */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || !ua.trim()) return true;
  return BOT_UA_RE.test(ua);
}
