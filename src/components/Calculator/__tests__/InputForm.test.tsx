/**
 * 2026-08-08 👤裁定(loop-question-note): localStorage復元・URL引き継ぎで復元した教科は
 * 「確認済み」として扱い「未確認」バッジを出さない(A案)。initiallyTouchedの合流を検証する。
 *
 * @testing-library未導入のためreact-dom/clientの生API+actで最小限に描画・検証する。
 */
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { DEFAULT_SCORES } from '@/lib/constants';

import { InputForm } from '../InputForm';

// @testing-library未導入で生のreact-dom/client+actを使うため、actの対象環境であることを明示する
// (無いとconsole.errorで「not configured to support act」という無害だが煩雑な警告が出続ける)。
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const BADGE_TEXT = '未確認';

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

describe('InputForm', () => {
  it('initiallyTouchedが無い場合は全教科に未確認バッジが出る(既存挙動の回帰防止)', () => {
    act(() => {
      root.render(
        <InputForm prefectureCode="tokyo" scores={DEFAULT_SCORES} onChange={() => {}} />
      );
    });

    const badges = container.querySelectorAll('span');
    const badgeTexts = Array.from(badges)
      .map((el) => el.textContent)
      .filter((text) => text === BADGE_TEXT);
    expect(badgeTexts.length).toBe(9);
  });

  it('initiallyTouchedで指定した教科はバッジが出ず、それ以外は出続ける(localStorage復元時の誤点灯修正)', () => {
    act(() => {
      root.render(
        <InputForm
          prefectureCode="tokyo"
          scores={DEFAULT_SCORES}
          onChange={() => {}}
          initiallyTouched={{ japanese: true, math: true }}
        />
      );
    });

    expect(container.textContent).not.toBeNull();
    // カード見出しの隣に付くバッジ数 = 未確認のまま残る7教科分のみ
    const badges = Array.from(container.querySelectorAll('span')).filter(
      (el) => el.textContent === BADGE_TEXT
    );
    expect(badges.length).toBe(7);
  });

  it('initiallyTouchedで確認済みにした教科でも、その後ユーザーが実際に操作すればtouchedのまま維持される', () => {
    let latestScores = { ...DEFAULT_SCORES };
    const handleChange = (key: keyof typeof DEFAULT_SCORES, next: number) => {
      latestScores = { ...latestScores, [key]: next };
    };

    act(() => {
      root.render(
        <InputForm
          prefectureCode="tokyo"
          scores={latestScores}
          onChange={handleChange}
          initiallyTouched={{ japanese: true }}
        />
      );
    });

    const badgesBefore = Array.from(container.querySelectorAll('span')).filter(
      (el) => el.textContent === BADGE_TEXT
    );
    expect(badgesBefore.length).toBe(8);

    // 未操作の理科カードを1つ操作 -> そのカードのバッジだけ消える
    const plusButtons = Array.from(container.querySelectorAll('button')).filter((btn) =>
      (btn.getAttribute('aria-label') ?? '').includes('を1上げる')
    );
    expect(plusButtons.length).toBe(9);

    act(() => {
      plusButtons[1].click(); // japanese の次(math)のボタン
    });

    act(() => {
      root.render(
        <InputForm
          prefectureCode="tokyo"
          scores={latestScores}
          onChange={handleChange}
          initiallyTouched={{ japanese: true }}
        />
      );
    });

    const badgesAfter = Array.from(container.querySelectorAll('span')).filter(
      (el) => el.textContent === BADGE_TEXT
    );
    expect(badgesAfter.length).toBe(7);
  });
});
