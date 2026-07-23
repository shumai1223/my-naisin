/**
 * 採用レーダー（ZZ-6e・Ω-4実行層）＝どのサイトが既に自分（/embedウィジェット・無キーAPI）を
 * 組み込んでいるかをReferer/Originドメインから毎週自動検出する。
 *
 * なぜ：既存製品（/embed・公開API）の配布実績は現状どこにも可視化されておらず営業資産として
 * 死んでいた。検出ドメイン＝①既に価値を認めている温かいB2Bリード ②クレジットリンク未設置なら
 * リンク依頼の最優先対象になる（連絡は👤・本モジュールは検出・集計のみ）。
 *
 * 安全設計（clicks-db.tsと同じ思想・push=本番デプロイなので壊さない）：
 *  - 名簿と同じ `LEADS_DB` バインディングを共用。バインディングが無ければ完全no-op。
 *  - 生IPは一切扱わない（引数にも列にも存在しない）。保存するのは「registrable domain」のみ。
 *  - 自ドメイン（my-naishin.com・www.my-naishin.com）とlocalhost系はノイズなので記録前に除外する。
 *
 * 点火手順（本人操作・👤専用）：
 *  wrangler d1 execute my-naishin-leads --remote --file=migrations/0011_create_adoption_domains.sql
 */

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
interface MinimalD1 {
  prepare(query: string): D1PreparedStatement;
}

async function getDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

/** 自ドメイン・ローカル開発ドメインの一覧（記録対象から除外）。 */
const OWN_HOSTNAMES = new Set(['my-naishin.com', 'www.my-naishin.com', 'localhost', '127.0.0.1']);

export type AdoptionSource = 'embed_naishin' | 'embed_hensachi' | 'api_anonymous';

/**
 * Referer または Origin ヘッダの値から「外部の」registrable domainを抽出する純関数。
 * 自ドメイン・不正URL・値なしは null（＝記録しない）。
 */
export function extractExternalDomain(headerValue: string | null | undefined): string | null {
  if (!headerValue) return null;
  try {
    const u = new URL(headerValue);
    const host = u.hostname.toLowerCase();
    if (!host) return null;
    if (OWN_HOSTNAMES.has(host)) return null;
    return host;
  } catch {
    return null;
  }
}

/**
 * 採用ヒットをD1に記録する。バインディング未設定・domain無しはno-op（false）。
 * 呼び出し側の応答を絶対に止めない＝例外は握りつぶす（fire-and-forgetを想定）。
 */
export async function persistAdoptionHit(input: {
  domain: string | null;
  source: AdoptionSource;
  path?: string;
}): Promise<boolean> {
  if (!input.domain) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO adoption_domains (domain, source, path, created_at)
         VALUES (?, ?, ?, datetime('now'))`
      )
      .bind(input.domain, input.source, input.path ?? null)
      .run();
    return true;
  } catch (err) {
    console.error('persistAdoptionHit skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface AdoptionDomainRow {
  domain: string;
  source: string;
  hits: number;
  first_seen: string;
  last_seen: string;
}

/**
 * 直近N日の採用ドメインサマリー（週次レポート/管理ダッシュボード用）。
 * ドメイン×source別のヒット数・初検出日・最終検出日を返す。バインディング未設定なら空配列。
 */
export async function getAdoptionDomainSummary(days = 7): Promise<AdoptionDomainRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(days)));
    const { results } = await db
      .prepare(
        `SELECT domain, source, COUNT(*) AS hits, MIN(created_at) AS first_seen, MAX(created_at) AS last_seen
         FROM adoption_domains
         WHERE created_at >= datetime('now', ?)
         GROUP BY domain, source
         ORDER BY hits DESC
         LIMIT 100`
      )
      .bind(`-${since} days`)
      .all<AdoptionDomainRow>();
    return results ?? [];
  } catch (err) {
    console.error('getAdoptionDomainSummary skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
