/**
 * @testing-library未導入のためreact-dom/clientの生API+actで最小限に描画・検証する
 * （InputForm.test.tsxと同じパターン）。
 *
 * BUSINESS_INFOが「準備中」のプレースホルダのままである現在、見積書ページが
 * 送付不可の警告バナーを出し続けることと、プラン切り替えで表示価格が正しく
 * 追従することを固定する。
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { QuoteGenerator } from '../QuoteGenerator';
import { QUOTE_PLANS } from '@/lib/quote-plans';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

function yen(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`;
}

describe('QuoteGenerator', () => {
  it('BUSINESS_INFOが準備中の間は送付不可の警告バナーを表示する（実PII未設定のガード）', () => {
    act(() => {
      root.render(<QuoteGenerator />);
    });
    expect(container.textContent).toContain('まだ先方へ送付できる状態ではありません');
  });

  it('既定プランはbusinessで、その年額が見積書本体に表示される', () => {
    act(() => {
      root.render(<QuoteGenerator />);
    });
    const business = QUOTE_PLANS.find((p) => p.id === 'business')!;
    // 合計行・品目行の両方にbusinessの年額が出る（複数箇所ヒットでよい）
    expect(container.textContent).toContain(yen(business.annualPriceJpy));
    expect(container.textContent).toContain(business.label);
  });

  it('プランを切り替えると表示金額がそのプランの年額に変わる', () => {
    act(() => {
      root.render(<QuoteGenerator />);
    });
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).not.toBeNull();

    const full = QUOTE_PLANS.find((p) => p.id === 'enterprise-full')!;
    act(() => {
      select.value = 'enterprise-full';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain(yen(full.annualPriceJpy));
  });

  it('宛先の会社名を入力すると見積書本体に「◯◯ 御中」が反映される', () => {
    act(() => {
      root.render(<QuoteGenerator />);
    });
    const companyInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(companyInput).not.toBeNull();

    // Reactは<input>のvalueプロパティのネイティブsetterを上書きしているため、
    // 単純な `.value = ...` + dispatchEvent ではonChangeが発火しない。
    // プロトタイプ側のネイティブsetterを直接呼び出してReactの追跡を回避する。
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    act(() => {
      nativeSetter.call(companyInput, 'テスト株式会社');
      companyInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.textContent).toContain('テスト株式会社 御中');
  });
});
