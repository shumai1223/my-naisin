/**
 * 学校ページの保護者ブリッジ（2026-08-08 loop-question-note【A】④）の最小契約テスト。
 * @testing-library未導入のためreact-dom/client+act直書き（InputForm.test.tsxと同方針）。
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { SchoolPageParentBridge } from '../SchoolPageParentBridge';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let fetchMock: jest.Mock;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 204 });
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  // @ts-expect-error テスト用に付与したnavigator.shareを毎回リセットする
  delete (navigator as { share?: unknown }).share;
});

describe('SchoolPageParentBridge', () => {
  it('学校名を含む「おうちの人に送る」ボタンを表示する', () => {
    act(() => {
      root.render(<SchoolPageParentBridge schoolName="日比谷" prefectureCode="tokyo" />);
    });
    expect(container.textContent).toContain('おうちの人に送る');
    expect(container.textContent).toContain('日比谷');
  });

  it('navigator.shareが使える環境ではWeb Share APIを呼び、保護者ファネルAPIへビーコン送信する', async () => {
    const shareMock = jest.fn().mockResolvedValue(undefined);
    (navigator as unknown as { share: typeof shareMock }).share = shareMock;

    act(() => {
      root.render(<SchoolPageParentBridge schoolName="日比谷" prefectureCode="tokyo" />);
    });

    const button = container.querySelector('button') as HTMLButtonElement;
    await act(async () => {
      button.click();
      await Promise.resolve();
    });

    expect(shareMock).toHaveBeenCalledTimes(1);
    const shareArg = shareMock.mock.calls[0][0];
    expect(shareArg.text).toContain('日比谷');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/parent-funnel',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({ event: 'share_to_parent', medium: 'native', prefectureCode: 'tokyo' });
  });

  it('navigator.shareが無い環境ではクリップボードへコピーし「コピーしました」表示に切り替わる', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeTextMock } });

    act(() => {
      root.render(<SchoolPageParentBridge schoolName="日比谷" prefectureCode="tokyo" />);
    });

    const button = container.querySelector('button') as HTMLButtonElement;
    await act(async () => {
      button.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain('リンクをコピーしました');
  });
});
