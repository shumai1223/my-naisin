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
 *
 * 追記（DW-3・DEADWIRE 2026-08-10監査→2026-08-23対応）：`GoogleOther`（`googlebot`とは別名の
 * Google製クローラ）が"bot"を含まない文字列のため既存の`bot`トークンをすり抜けていた
 * （本番D1 clicksの実測で1件確認済み）。個別トークンとして追加した。
 */
const BOT_UA_RE =
  /bot|googleother|crawl|spider|slurp|mediapartners|googlebot|bing|yandex|baidu|duckduck|sogou|exabot|facebookexternalhit|facebot|ia_archiver|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|headless|phantom|puppeteer|playwright|selenium|lighthouse|gtmetrix|pingdom|uptime|statuscake|monitor|python|curl|wget|libwww|okhttp|java(\/| )|go-http|scrapy|node-fetch|axios|postman|insomnia|scraper|scan|preview|embed|feedfetcher|apache-httpclient|gptbot|chatgpt|oai-searchbot|claudebot|claude-web|anthropic|ccbot|amazonbot|applebot|perplexity|google-extended|cohere|diffbot|dataforseo|serpstat|screaming|httpx|zgrab|masscan|nuclei|censys|nikto|wpscan|fasthttp|httpclient|guzzle|colly|dalvik|electron|crawler|fetch\b/i;

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
 * root_only referer（`https://my-naishin.com/` ちょうど・パス無し）か。
 * `ops/CORRECTIONS.md` §2実測: 全期間33件中17件が`placement=parent-lp`を名乗るが、
 * `parent-lp`は`/hogosha`等でしか実際に使われずトップページには存在しない＝自己矛盾。
 * 「毎日04:1x・11:2x UTCに全desktopで発生するスケジュール実行の指紋」（`ops/DEADWIRE.md:259-278`）
 * と一致する既知のbotパターン。
 */
export function isRootOnlyReferer(referer: string | null | undefined): boolean {
  return referer === 'https://my-naishin.com/';
}

/**
 * root_only referer で実際に観測される正当なplacement値（ホームページ自身が発行するもの）。
 * `src/app/HomeClient.tsx`が明示的に付与する`home`/`home-percentile`に加え、
 * `/go/[id]/route.ts`の`placementFromReferer`旧版（2026-08-23のS9-2是正前）がroot refererから
 * 生成していた`/`（`ops/CORRECTIONS.md`§2の実測表が「整合」と判定した過去データ）も後方互換で許容する。
 * 他のplacement値（`parent-lp`/`naishin-up`/`prefecture`/`hensachi`等）はホームページに実在しないため、
 * root_only referer とともに観測されると内部整合性の矛盾＝bot と確定できる（S9-4）。
 */
const HOME_PAGE_PLACEMENTS = new Set(['home', 'home-percentile', '/']);

/**
 * refererのパスと、そのplacement値が実際に設定されているページが矛盾していないかを判定する。
 * 現状はroot_only referer（トップページ由来）についてのみ検証材料が揃っている
 * （`ops/CORRECTIONS.md`§2）。root_only以外のreferer・placement未設定の呼び出しは
 * 判定材料が無いため常にtrue（矛盾なし）を返し、既存の分類結果を変えない。
 */
export function isPlacementConsistentWithReferer(
  referer: string | null | undefined,
  placement: string | null | undefined
): boolean {
  if (!isRootOnlyReferer(referer)) return true;
  if (!placement) return true;
  return HOME_PAGE_PLACEMENTS.has(placement);
}

/**
 * クリックの信頼度を1か所で判定（ダッシュボードの正準ロジック）。
 *  - unknown … UA未記録の旧データ（判定不能）
 *  - bot     … UAがbot/スクリプト（または空UA）、または root_only referer × 実在しないplacement の自己矛盾（S9-4）
 *  - human   … ブラウザUA かつ 自サイト referer あり（＝実際に当サイトの面から押された）
 *  - suspect … ブラウザUAだが 内部referer無し（/go直叩きのスクレイパが大半。privacyブラウザや外部embedも稀に含む）
 *
 * /go ルートは bot-UA・空UA・IPバーストを取り込み時点で弾くので、新規データの大半は human / suspect に分かれる。
 */
export function classifyClick(c: {
  userAgent?: string | null;
  referer?: string | null;
  placement?: string | null;
}): ClickTrust {
  if (c.userAgent === undefined || c.userAgent === null) return 'unknown';
  if (isBotUserAgent(c.userAgent)) return 'bot';
  if (!isInternalReferer(c.referer)) return 'suspect';
  if (!isPlacementConsistentWithReferer(c.referer, c.placement)) return 'bot';
  return 'human';
}
