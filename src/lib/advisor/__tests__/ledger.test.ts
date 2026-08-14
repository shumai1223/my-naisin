// ledger.ts: グラウンデッドAIアドバイザー(ZZ-3)の数値台帳。render.test.ts/adversarial.test.ts
// はrender.ts経由の間接呼び出ししかカバーしておらず、addEntry自身の「破壊的変更なし」という
// 明記された契約(不変条件)とADVISOR_STRUCTURAL_CONSTANTSのデータ整合性は無テストだった。

import { addEntry, ADVISOR_STRUCTURAL_CONSTANTS, type GroundingLedger } from '../ledger';

describe('addEntry', () => {
  it('新しいエントリを末尾に追加した配列を返す', () => {
    const empty: GroundingLedger = [];
    const result = addEntry(empty, '65点', 'naishin-engine', 'tokyo');
    expect(result).toEqual([{ value: '65点', source: 'naishin-engine', context: 'tokyo' }]);
  });

  it('元の配列を破壊的変更しない（純粋関数の契約）', () => {
    const original: GroundingLedger = [{ value: '10点', source: 'system', context: 'none' }];
    const originalCopy = [...original];
    const result = addEntry(original, '20点', 'hensachi-engine', 'none');
    expect(original).toEqual(originalCopy);
    expect(result).not.toBe(original);
    expect(result.length).toBe(2);
  });

  it('複数回の呼び出しで既存エントリの順序を保ったまま追加される', () => {
    let ledger: GroundingLedger = [];
    ledger = addEntry(ledger, '1個目', 'naishin-engine', 'osaka');
    ledger = addEntry(ledger, '2個目', 'total-score-engine', 'osaka');
    ledger = addEntry(ledger, '3個目', 'prefectures', 'osaka');
    expect(ledger.map((e) => e.value)).toEqual(['1個目', '2個目', '3個目']);
  });

  it('各フィールド(value/source/context)がそのまま格納される', () => {
    const result = addEntry([], '450点', 'total-score-engine', 'osaka');
    expect(result[0].value).toBe('450点');
    expect(result[0].source).toBe('total-score-engine');
    expect(result[0].context).toBe('osaka');
  });
});

describe('ADVISOR_STRUCTURAL_CONSTANTS', () => {
  it('空でない', () => {
    expect(ADVISOR_STRUCTURAL_CONSTANTS.length).toBeGreaterThan(0);
  });

  it('重複する語彙がない（検証器の無断追加防止の趣旨を保つ）', () => {
    expect(new Set(ADVISOR_STRUCTURAL_CONSTANTS).size).toBe(ADVISOR_STRUCTURAL_CONSTANTS.length);
  });

  it('全ての語彙が空文字でない', () => {
    for (const phrase of ADVISOR_STRUCTURAL_CONSTANTS) {
      expect(phrase.length).toBeGreaterThan(0);
    }
  });
});
