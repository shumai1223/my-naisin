/**
 * 無料APIキー自己発行UIの最小契約テスト。
 * @testing-library未導入のためreact-dom/client+act直書き(InputForm.test.tsxと同方針)。
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { ApiKeyIssuer } from '../ApiKeyIssuer';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let fetchMock: jest.Mock;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  fetchMock = jest.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('ApiKeyIssuer（クリックラップ）', () => {
  it('利用規約チェック前は発行ボタンがdisabledで、fetchは一切呼ばれない', () => {
    act(() => {
      root.render(<ApiKeyIssuer />);
    });
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    act(() => {
      button.click();
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('同意後にクリックすると tosAgreedAt を含めて/api/keysへPOSTする', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ apiKey: 'mnsk_live_dummy', tier: 'free' }),
    });

    act(() => {
      root.render(<ApiKeyIssuer />);
    });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    act(() => {
      checkbox.click();
    });
    await act(async () => {
      button.click();
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/keys', expect.objectContaining({ method: 'POST' }));
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(typeof body.tosAgreedAt).toBe('string');
    expect(Number.isNaN(Date.parse(body.tosAgreedAt))).toBe(false);
  });

  it('発行成功後は平文キーを一度だけ表示する画面に切り替わる', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ apiKey: 'mnsk_live_abcdef', tier: 'free' }),
    });

    act(() => {
      root.render(<ApiKeyIssuer />);
    });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    act(() => {
      checkbox.click();
    });
    await act(async () => {
      button.click();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('mnsk_live_abcdef');
    expect(container.textContent).toContain('この一度きりの表示です');
    // 発行フォームの同意チェックボックスはもう存在しない(成功画面に切り替わっている)
    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
  });

  it('D1未接続(503)時は準備中メッセージを表示する', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'not_enabled', message: 'キーの自己発行は準備中です。' }),
    });

    act(() => {
      root.render(<ApiKeyIssuer />);
    });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    act(() => {
      checkbox.click();
    });
    await act(async () => {
      button.click();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('キーの自己発行は準備中です。');
  });

  it('ラベル・メールを入力すると/api/keysへのリクエストボディに含まれる', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ apiKey: 'mnsk_live_dummy', tier: 'free' }),
    });

    act(() => {
      root.render(<ApiKeyIssuer />);
    });
    const [labelInput, emailInput] = Array.from(
      container.querySelectorAll('input[type="text"], input[type="email"]')
    ) as HTMLInputElement[];
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    act(() => {
      nativeSetter.call(labelInput, '進路アプリ');
      labelInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeSetter.call(emailInput, 'dev@example.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      checkbox.click();
    });
    await act(async () => {
      button.click();
      await Promise.resolve();
    });

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.label).toBe('進路アプリ');
    expect(body.email).toBe('dev@example.com');
  });
});
