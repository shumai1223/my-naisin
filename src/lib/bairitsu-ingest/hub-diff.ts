/**
 * T-Y11F F-2: ハブ監視の純関数部分。
 *
 * A-2（`competition-rate-watch.ts`）は「去年のPDFのURL」を見張っており、URLに年度が
 * 埋まる県（22県）は年度が変わると恒久的に検知不能になる。このモジュールが見張るのは
 * それとは別の対象──**年度をまたいで生き続ける一覧ページ（ハブ）**で、そのHTML内に新しく
 * 出現した募集・志願・出願・倍率・進路希望・合格関連のPDF/xlsxリンクを差分として拾う。
 *
 * I/O（fetch）は `scripts/bairitsu-ingest/watch-hubs.mjs` 側が担い、このファイルは
 * 「HTML文字列→関連リンク抽出」「前回スナップショット→今回→新規/消失」の純関数のみ持つ
 * （check-competition-rate-updates.mjsと同じくNode単体実行のスクリプトはTSを直接importできない
 * ため、抽出ロジック自体は watch-hubs.mjs 側に同型のコードとして複製する。ロジックを変える際は
 * 両方を同時に直すこと）。
 */

export interface HubLink {
  href: string;
  text: string;
}

export interface HubDiffResult {
  newLinks: HubLink[];
  removedLinks: HubLink[];
  unchangedCount: number;
}

// ⚠️2026-09-07実測（chiba/saitama/miyagi/kagoshima）: 実際のハブページは.pdf/.xlsxへ直接
// リンクせず、まず「令和9年度」の年度ページ（.html）へリンクし、その先にPDFがある2段構成が
// 4県中4県で共通していた。「令和9年度」はR8→R9移行専用の季節限定キーワードのため、来年の
// R9→R10移行では書き換えが必要（このハーベスタ自体が季節限定ツールであるためこれで許容する）。
const RELEVANT_LINK_KEYWORDS = ['募集', '志願', '出願', '倍率', '進路希望', '合格', '令和9年度'];
const RELEVANT_EXTENSION_RE = /\.(pdf|xlsx|html?)$/i;

function stripQueryAndHash(url: string): string {
  return url.split('?')[0].split('#')[0];
}

function safeDecodeUriComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * ハブページのHTMLから、募集/志願/出願/倍率/進路希望/合格のいずれかを含む
 * .pdf/.xlsxリンクだけを抽出する（リンクテキスト・URL本体のどちらかに含まれていればよい）。
 * hrefは`baseUrl`を基準に絶対URLへ正規化する。相対パス解決に失敗したリンクは無視する。
 */
export function extractRelevantLinks(html: string, baseUrl: string): HubLink[] {
  const results: HubLink[] = [];
  const seen = new Set<string>();
  const linkRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(html)) !== null) {
    const hrefRaw = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const pathOnly = stripQueryAndHash(hrefRaw);
    if (!RELEVANT_EXTENSION_RE.test(pathOnly)) continue;

    const hrefDecoded = safeDecodeUriComponent(hrefRaw);
    const hasKeyword = RELEVANT_LINK_KEYWORDS.some((k) => text.includes(k) || hrefDecoded.includes(k));
    if (!hasKeyword) continue;

    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(hrefRaw, baseUrl).toString();
    } catch {
      continue;
    }
    if (seen.has(absoluteUrl)) continue;
    seen.add(absoluteUrl);
    results.push({ href: absoluteUrl, text });
  }
  return results;
}

/** 前回スナップショットと今回抽出結果を突き合わせ、新規/消失/変化なしを分類する（hrefの完全一致で判定）。 */
export function diffHubLinks(previous: HubLink[], current: HubLink[]): HubDiffResult {
  const prevHrefs = new Set(previous.map((l) => l.href));
  const currHrefs = new Set(current.map((l) => l.href));
  const newLinks = current.filter((l) => !prevHrefs.has(l.href));
  const removedLinks = previous.filter((l) => !currHrefs.has(l.href));
  const unchangedCount = current.filter((l) => prevHrefs.has(l.href)).length;
  return { newLinks, removedLinks, unchangedCount };
}
