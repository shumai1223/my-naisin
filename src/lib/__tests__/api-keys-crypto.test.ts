/**
 * @jest-environment node
 */
// api-keys.ts: hashApiKey/generateApiKeyPlaintext/keyPrefixOfはAPI課金ゲートの鍵生成・
// 照合を担う純粋関数(D1に依存しない)だが、api-monetization.test.tsではissueApiKey/
// lookupApiKey/computeFreemiumFunnelのみがカバーされ、この3関数自体は無テストだった。
// 平文キーは保存されずハッシュのみが保存される設計(コメントに明記)のため、hashApiKeyの
// 決定論性・衝突しないことは課金ゲートの安全性そのもの。

import crypto from 'node:crypto';
import { hashApiKey, generateApiKeyPlaintext, keyPrefixOf } from '../api-keys';

describe('hashApiKey', () => {
  it('同じ平文からは常に同じハッシュを返す(決定論)', async () => {
    const a = await hashApiKey('mnsk_live_abcdef1234567890');
    const b = await hashApiKey('mnsk_live_abcdef1234567890');
    expect(a).toBe(b);
  });

  it('異なる平文からは異なるハッシュを返す', async () => {
    const a = await hashApiKey('mnsk_live_key-one');
    const b = await hashApiKey('mnsk_live_key-two');
    expect(a).not.toBe(b);
  });

  it('64文字の16進文字列を返す(SHA-256)', async () => {
    const hash = await hashApiKey('mnsk_live_sample');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('Node標準cryptoのSHA-256計算結果と一致する(独立実装によるクロスチェック)', async () => {
    const plaintext = 'mnsk_live_cross-check-value';
    const expected = crypto.createHash('sha256').update(plaintext, 'utf8').digest('hex');
    const actual = await hashApiKey(plaintext);
    expect(actual).toBe(expected);
  });
});

describe('generateApiKeyPlaintext', () => {
  it('mnsk_live_ プレフィックスで始まる', () => {
    expect(generateApiKeyPlaintext()).toMatch(/^mnsk_live_/);
  });

  it('プレフィックス+40桁16進(20バイト)の長さになる', () => {
    const key = generateApiKeyPlaintext();
    expect(key.length).toBe('mnsk_live_'.length + 40);
    expect(key.slice('mnsk_live_'.length)).toMatch(/^[0-9a-f]{40}$/);
  });

  it('毎回異なるキーを生成する(暗号乱数)', () => {
    const keys = new Set(Array.from({ length: 20 }, () => generateApiKeyPlaintext()));
    expect(keys.size).toBe(20);
  });
});

describe('keyPrefixOf', () => {
  it('mnsk_live_ + 先頭8桁のみを返す(ダッシュボード表示用の頭出し識別子)', () => {
    const plaintext = 'mnsk_live_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0';
    expect(keyPrefixOf(plaintext)).toBe('mnsk_live_a1b2c3d4');
    expect(keyPrefixOf(plaintext).length).toBe(18);
  });

  it('generateApiKeyPlaintextの実出力に対しても18文字を返す', () => {
    const key = generateApiKeyPlaintext();
    expect(keyPrefixOf(key).length).toBe(18);
    expect(key.startsWith(keyPrefixOf(key))).toBe(true);
  });

  it('短い文字列を渡しても例外を投げず、あるだけの文字列を返す', () => {
    expect(keyPrefixOf('short')).toBe('short');
  });
});
