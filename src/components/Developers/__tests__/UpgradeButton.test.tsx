/**
 * 2026-08-13クリックラップ必須化(ops/PRICING_OPTIONS.md #5)の最小契約テスト。
 * @testing-library未導入のためreact-dom/client+act直書き(InputForm.test.tsxと同方針)。
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { UpgradeButton } from '../UpgradeButton';

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

describe('UpgradeButton（クリックラップ）', () => {
  it('利用規約チェック前はボタンがdisabledで、fetchは一切呼ばれない', () => {
    act(() => {
      root.render(<UpgradeButton tier="pro" />);
    });
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    act(() => {
      button.click();
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('チェックボックスをONにするとボタンが有効化される', () => {
    act(() => {
      root.render(<UpgradeButton tier="pro" />);
    });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    act(() => {
      checkbox.click();
    });
    expect(button.disabled).toBe(false);
  });

  it('同意後にクリックすると tosAgreedAt を含めて/api/billing/checkoutへPOSTする', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/session123' }),
    });

    act(() => {
      root.render(<UpgradeButton tier="pro" />);
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

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/billing/checkout',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.tier).toBe('pro');
    expect(typeof body.tosAgreedAt).toBe('string');
    expect(Number.isNaN(Date.parse(body.tosAgreedAt))).toBe(false);
  });

  it('未接続(not_enabled)時はメッセージとお問い合わせ導線を表示する', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'not_enabled', message: 'オンライン決済は現在準備中です。' }),
    });

    act(() => {
      root.render(<UpgradeButton tier="pro" />);
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

    expect(container.textContent).toContain('オンライン決済は現在準備中です。');
    expect(container.textContent).toContain('お問い合わせ');
  });
});
