// push-db.ts: isValidSubscription()は/api/push/subscribeの入力ゲート(D1書き込み前の最終防衛線)
// だが無テストだった。endpointがhttps限定・1000文字以内、p256dh/authが非空という契約を固定する。

import { isValidSubscription, type PushSubscriptionInput } from '../push-db';

function validInput(overrides: Partial<PushSubscriptionInput> = {}): PushSubscriptionInput {
  return {
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    p256dh: 'valid-p256dh-key',
    auth: 'valid-auth-secret',
    ...overrides,
  };
}

describe('isValidSubscription', () => {
  it('正しい形の購読は true', () => {
    expect(isValidSubscription(validInput())).toBe(true);
  });

  it('prefecture/audience/userAgent等の任意フィールドがあってもtrue', () => {
    expect(isValidSubscription(validInput({ prefecture: 'tokyo', audience: 'parent', userAgent: 'Mozilla/5.0' }))).toBe(true);
  });

  it('null/undefinedは false', () => {
    expect(isValidSubscription(null)).toBe(false);
    expect(isValidSubscription(undefined)).toBe(false);
  });

  it('空オブジェクトは false', () => {
    expect(isValidSubscription({})).toBe(false);
  });

  it('endpointがhttps://で始まらない場合は false（http/相対パス/プロトコル無し）', () => {
    expect(isValidSubscription(validInput({ endpoint: 'http://fcm.googleapis.com/fcm/send/abc123' }))).toBe(false);
    expect(isValidSubscription(validInput({ endpoint: 'fcm.googleapis.com/fcm/send/abc123' }))).toBe(false);
    expect(isValidSubscription(validInput({ endpoint: '' }))).toBe(false);
  });

  it('endpointが1000文字を超える場合は false', () => {
    const longEndpoint = 'https://fcm.googleapis.com/fcm/send/' + 'a'.repeat(1000);
    expect(isValidSubscription(validInput({ endpoint: longEndpoint }))).toBe(false);
  });

  it('endpointがちょうど1000文字なら true（境界値）', () => {
    const endpoint = 'https://' + 'a'.repeat(992); // 8 + 992 = 1000
    expect(endpoint.length).toBe(1000);
    expect(isValidSubscription(validInput({ endpoint }))).toBe(true);
  });

  it('p256dhが空文字または欠落している場合は false', () => {
    expect(isValidSubscription(validInput({ p256dh: '' }))).toBe(false);
    expect(isValidSubscription({ endpoint: validInput().endpoint, auth: validInput().auth })).toBe(false);
  });

  it('authが空文字または欠落している場合は false', () => {
    expect(isValidSubscription(validInput({ auth: '' }))).toBe(false);
    expect(isValidSubscription({ endpoint: validInput().endpoint, p256dh: validInput().p256dh })).toBe(false);
  });

  it('p256dh/authが文字列型でない場合は false（型不正な入力の防御）', () => {
    expect(isValidSubscription({ ...validInput(), p256dh: 123 as unknown as string })).toBe(false);
    expect(isValidSubscription({ ...validInput(), auth: {} as unknown as string })).toBe(false);
  });
});
