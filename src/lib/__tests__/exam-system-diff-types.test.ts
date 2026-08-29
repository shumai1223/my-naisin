import {
  validateDiffEntry,
  isUnconfirmedChange,
  findOverclaimPhrases,
  type DiffEntry,
} from '../exam-system-diff-types';

function baseEntry(overrides: Partial<DiffEntry> = {}): DiffEntry {
  return {
    prefectureCode: 'tokyo',
    field: 'maxScore',
    status: 'changed',
    previousValue: 1000,
    currentValue: 1020,
    previousSourceUrl: 'https://example.jp/r7.pdf',
    currentSourceUrl: 'https://example.jp/r8.pdf',
    detectionMethod: 'machine',
    ...overrides,
  };
}

describe('exam-system-diff-types（T-N1-0 正確性の設計の型契約）', () => {
  test('changed/unchangedは両方のsourceUrlが揃っていれば問題なし(1差分1出典)', () => {
    expect(validateDiffEntry(baseEntry({ status: 'changed' }))).toEqual([]);
    expect(validateDiffEntry(baseEntry({ status: 'unchanged' }))).toEqual([]);
  });

  test('changedなのにsourceUrlが欠けていると問題として検出される', () => {
    const problems = validateDiffEntry(baseEntry({ previousSourceUrl: null }));
    expect(problems.length).toBeGreaterThan(0);
  });

  test('unverifiableはunverifiableReasonが無いと問題として検出される(取得不能を隠さない)', () => {
    const problems = validateDiffEntry(
      baseEntry({ status: 'unverifiable', previousSourceUrl: null, currentSourceUrl: null })
    );
    expect(problems.length).toBeGreaterThan(0);
  });

  test('unverifiableでもunverifiableReasonがあれば問題なし', () => {
    const problems = validateDiffEntry(
      baseEntry({
        status: 'unverifiable',
        previousSourceUrl: null,
        currentSourceUrl: null,
        unverifiableReason: 'PDFが画像のみでOCR不可',
      })
    );
    expect(problems).toEqual([]);
  });

  test('unverifiableはsourceUrlが無くても(理由さえあれば)問題にならない＝2値化していない不変条件', () => {
    const statuses: DiffEntry['status'][] = ['changed', 'unchanged', 'unverifiable'];
    expect(statuses).toHaveLength(3);
  });

  test('機械検出のみ(手動確認未了)は未確認の変更候補として判定される', () => {
    expect(isUnconfirmedChange(baseEntry({ detectionMethod: 'machine' }))).toBe(true);
    expect(
      isUnconfirmedChange(baseEntry({ detectionMethod: 'machine', manuallyVerifiedAt: '2026-09-01' }))
    ).toBe(false);
    expect(isUnconfirmedChange(baseEntry({ status: 'unchanged' }))).toBe(false);
  });

  test('「網羅」等の証明不可能な主張はfindOverclaimPhrasesで検出される', () => {
    expect(findOverclaimPhrases('47県すべての変更を網羅しました')).toContain('網羅');
    expect(findOverclaimPhrases('各項目に出典URLを付けています。30秒で検証できます')).toEqual([]);
  });
});
