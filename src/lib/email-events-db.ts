/**
 * メール開封/クリックイベント（email_events）のD1永続化＝TIER Q-4。
 * leads-db.ts/stats-db.ts/juku-reviews-db.tsと同じ安全設計（LEADS_DB既存バインディング・no-op戦略）。
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

async function getEmailEventsDb(): Promise<MinimalD1 | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { LEADS_DB?: MinimalD1 }).LEADS_DB ?? null;
  } catch {
    return null; // Workers外（テスト/ビルド）では休眠
  }
}

export interface EmailEventInput {
  eventType: string;
  resendEmailId?: string;
  recipient?: string;
  link?: string;
  tags?: { name: string; value: string }[];
}

/** イベントを1件保存する。バインディング未設定・テーブル未作成なら no-op（false）。 */
export async function insertEmailEvent(input: EmailEventInput): Promise<boolean> {
  try {
    const db = await getEmailEventsDb();
    if (!db) return false;
    await db
      .prepare(
        `INSERT INTO email_events (event_type, resend_email_id, recipient, link, tags_json, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(
        input.eventType,
        input.resendEmailId ?? null,
        input.recipient ?? null,
        input.link ?? null,
        input.tags ? JSON.stringify(input.tags) : null
      )
      .run();
    return true;
  } catch (err) {
    console.error('insertEmailEvent skipped:', err instanceof Error ? err.message : err);
    return false;
  }
}

export interface EmailEventSummaryRow {
  event_type: string;
  tag_value: string | null;
  n: number;
}

/**
 * 指定タグ名（例 'course_step'）別に、イベント種別ごとの件数を集計する（開封率/クリック率の素材）。
 * タグの値ごとの内訳はJS側で行う（SQLiteのJSON演算子はD1で使えるが、依存を増やさないため
 * 生データを取得してからJSで集計する設計に留める）。バインディング未設定・0件なら空配列。
 */
export async function getEmailEventCountsByTag(tagName: string, sinceDays = 90): Promise<EmailEventSummaryRow[]> {
  try {
    const db = await getEmailEventsDb();
    if (!db) return [];
    const since = Math.max(1, Math.min(365, Math.round(sinceDays)));
    const { results } = await db
      .prepare(`SELECT event_type, tags_json FROM email_events WHERE created_at >= datetime('now', ?)`)
      .bind(`-${since} days`)
      .all<{ event_type: string; tags_json: string | null }>();

    const counts = new Map<string, number>();
    for (const row of results ?? []) {
      let tagValue: string | null = null;
      if (row.tags_json) {
        try {
          const tags = JSON.parse(row.tags_json) as { name: string; value: string }[];
          tagValue = tags.find((t) => t.name === tagName)?.value ?? null;
        } catch {
          tagValue = null;
        }
      }
      const key = `${row.event_type}|${tagValue ?? ''}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries()).map(([key, n]) => {
      const [eventType, tagValue] = key.split('|');
      return { event_type: eventType, tag_value: tagValue || null, n };
    });
  } catch (err) {
    console.error('getEmailEventCountsByTag skipped:', err instanceof Error ? err.message : err);
    return [];
  }
}
