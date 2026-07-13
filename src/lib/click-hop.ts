/**
 * /go のJSホップ中間ページ（2026-07-13 無効クリック対策）。
 *
 * 背景: ブラウザUAを偽装した分散スクレイパ（iOS13.2.3・98IP・118クリック/14日）が
 * /go を直叩きし、302 でそのまま A8/もしも/AT のクリックURLへ到達 → ASP側のクリック数が
 * 実クリックの約9倍に膨張していた（D1実測: human 18 vs suspect 153）。
 *
 * 対策: 内部 referer を伴わない /go アクセス（LINE/メール経由の実ユーザー or スクレイパ）には
 * 302 の代わりにこのページを返す。遷移先URLは base64 で JS 内にのみ埋め込み、
 * <a href> としては HTML に一切現れない。
 *   - JSを実行する実ブラウザ → location.replace で即ASPへ（体感0.1秒）
 *   - HTMLを舐めるだけのボット → href 収集でもASP URLを得られず、ここで止まる
 * 自サイト面からの通常クリック（内部refererあり）は従来どおり即302で摩擦ゼロ。
 */

/** 遷移先URLはASCII前提（AFFILIATES allowlist のASP URLのみ。非ASCIIだと atob が壊れる）。 */
export function renderClickHopHtml(href: string): string {
  const b64 = Buffer.from(href, 'utf8').toString('base64');
  return (
    '<!doctype html><html lang="ja"><head><meta charset="utf-8">' +
    '<meta name="robots" content="noindex,nofollow">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>移動しています…</title></head>' +
    '<body style="font-family:sans-serif;padding:2rem;text-align:center;color:#333">' +
    '<p>ページへ移動しています…</p>' +
    '<noscript><p>JavaScriptを有効にすると自動で移動します。<a href="/">トップへ戻る</a></p></noscript>' +
    `<script>location.replace(atob("${b64}"));</script>` +
    '</body></html>'
  );
}
