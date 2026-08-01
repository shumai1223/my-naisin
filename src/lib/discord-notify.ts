/**
 * Λ-21（留守番モード・第1層＝自動停止と並ぶ2つの安全網の1つ）向けのDiscord webhook通知。
 *
 * OAuth不要の薄い実装（webhook URLへJSON POSTするだけ）。
 * 👤がDiscord側でwebhook URLを発行し、環境変数 DISCORD_WEBHOOK_URL に設定するまでは
 * webhookUrlが未設定のまま渡ってくる想定＝その場合はfetchすら試みずskipを返す
 * （D1未バインド時に全関数がno-opする既存パターンを踏襲・本番挙動への影響ゼロ）。
 */

export interface DiscordPostResult {
  ok: boolean;
  /** webhook URL未設定のため送信自体を試みなかった場合true。 */
  skipped: boolean;
  error?: string;
}

export async function postDiscordWebhook(
  webhookUrl: string | undefined | null,
  content: string
): Promise<DiscordPostResult> {
  if (!webhookUrl) {
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      return { ok: false, skipped: false, error: `Discord webhook returned ${res.status}` };
    }
    return { ok: true, skipped: false };
  } catch (e) {
    return { ok: false, skipped: false, error: e instanceof Error ? e.message : String(e) };
  }
}
