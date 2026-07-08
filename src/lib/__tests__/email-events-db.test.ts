/**
 * @jest-environment node
 *
 * メール開封/クリックイベント（email_events）D1ラッパーの契約テスト（TIER Q-4）。
 * D1バインディング未設定（テスト環境）を前提に、no-opフォールバック契約を固定する。
 */
import { insertEmailEvent, getEmailEventCountsByTag } from '../email-events-db';

describe('insertEmailEvent', () => {
  it('D1未バインドではfalse（no-op・例外を投げない）', async () => {
    const ok = await insertEmailEvent({ eventType: 'email.opened', resendEmailId: 'em_1', recipient: 'a@b.com' });
    expect(ok).toBe(false);
  });
});

describe('getEmailEventCountsByTag', () => {
  it('D1未バインドでは空配列', async () => {
    const rows = await getEmailEventCountsByTag('course_step');
    expect(rows).toEqual([]);
  });
});
