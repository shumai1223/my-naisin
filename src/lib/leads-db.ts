/**
 * 名簿の永続化（堀A／配信母数）＝Cloudflare D1 への同意ベース保存。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：名簿velocity が KPI。Webhook通知／歓迎メールだけでは
 * 「誰が登録したか」を後から再収穫できない。同意済みリードを D1 に保存して初めて
 * 「受験本番に向けた一斉配信（ステップメール／季節配信）」の母数になる。
 *
 * 安全設計（push=本番デプロイなので壊さない）：
 *  - D1 バインディング `LEADS_DB` が無ければ完全 no-op（現状は未バインドなので何も起きない）。
 *  - 例外は握りつぶし、リード受付（/api/lead の成否）に一切影響させない。
 *  - 保存は consent:true のリードのみ（呼び出し側で検証済み）。PII最小・配信目的限定。
 *
 * 点火手順（ユーザー操作・MONETIZATION.md にも記載）：
 *  1) `wrangler d1 create my-naishin-leads` でDB作成 → 出力の database_id を控える。
 *  2) wrangler.jsonc に d1_databases バインディング（binding: "LEADS_DB"）を追加。
 *  3) `wrangler d1 execute my-naishin-leads --file=migrations/0001_create_leads.sql` でスキーマ適用。
 *  4) 再デプロイ。以降、同意リードが自動でD1に蓄積される。
 */

/**
 * 使う分だけの最小 D1 型（@cloudflare/workers-types を依存に足さずに済ませる）。
 * prepare→bind→run のみ使用。バインディングが無い環境では参照しないので安全。
 */
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}
interface MinimalD1 {
  prepare(query: string): D1PreparedStatement;
}

export interface PersistLeadInput {
  email: string;
  source: string;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  target?: number;
  gap?: number;
  note?: string;
}

/** undefined を D1 がバインドできる null に変換。 */
function n(v: number | undefined): number | null {
  return typeof v === 'number' ? v : null;
}
function s(v: string | undefined): string | null {
  return v ? v : null;
}

/**
 * 同意済みリードを D1 に保存する。バインディング未設定なら no-op（false）。
 * 返り値：保存に成功したか（計測・delivered判定の補助に使える）。
 */
export async function persistLead(input: PersistLeadInput): Promise<boolean> {
  try {
    // 動的 import：@opennextjs/cloudflare は Workers ランタイム前提。静的 import すると
    // jest/ビルドの非Workers環境でモジュール読込が落ちるため、実行時にのみ読み込む。
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB;
    if (!db) return false; // 未バインド＝休眠（現状）
    await db
      .prepare(
        `INSERT INTO leads (email, source, prefecture_code, prefecture_name, score, target, gap, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(email) DO UPDATE SET
           source = excluded.source,
           prefecture_code = excluded.prefecture_code,
           prefecture_name = excluded.prefecture_name,
           score = excluded.score,
           target = excluded.target,
           gap = excluded.gap,
           note = excluded.note`
      )
      .bind(
        input.email,
        input.source || null,
        s(input.prefectureCode),
        s(input.prefectureName),
        n(input.score),
        n(input.target),
        n(input.gap),
        s(input.note)
      )
      .run();
    return true;
  } catch (err) {
    // Workers外（テスト/ビルド）や未バインドでは静かに無効化＝受付フローに影響させない。
    console.error('persistLead skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * 配信停止：該当メールの unsubscribed フラグを立てる。バインディング未設定なら no-op（false）。
 * 一斉配信ジョブは unsubscribed=0 のみを対象にする運用。
 */
export async function markUnsubscribed(email: string): Promise<boolean> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB;
    if (!db) return false;
    await db.prepare('UPDATE leads SET unsubscribed = 1 WHERE email = ?').bind(email.trim().toLowerCase()).run();
    return true;
  } catch (err) {
    console.error('markUnsubscribed skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}
