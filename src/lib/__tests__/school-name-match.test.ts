import { normalizeSchoolNameForMatch, matchSchoolNameToCode, matchSchoolNames } from '../school-name-match';
import type { SchoolRecord } from '../school-master';

describe('normalizeSchoolNameForMatch', () => {
  test('都立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('東京都立日比谷高等学校')).toBe('日比谷');
  });

  test('府立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('大阪府立東淀川高等学校')).toBe('東淀川');
  });

  test('県立+高校（短縮表記）を除去する', () => {
    expect(normalizeSchoolNameForMatch('神奈川県立横浜翠嵐高校')).toBe('横浜翠嵐');
  });

  test('市立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('横浜市立東高等学校')).toBe('東');
  });

  test('接頭辞・接尾辞が無い名称はそのまま', () => {
    expect(normalizeSchoolNameForMatch('日比谷')).toBe('日比谷');
  });
});

function rec(code: string, name: string): SchoolRecord {
  return { code, name, address: '', postalCode: '', branch: false };
}

describe('matchSchoolNameToCode', () => {
  const master: SchoolRecord[] = [
    rec('A1', '東京都立日比谷高等学校'),
    rec('A2', '東京都立三田高等学校'),
    rec('A3', '東京都立東高等学校'),
    rec('A4', '東京都立東久留米総合高等学校'),
  ];

  test('完全一致すれば学校コードを返す', () => {
    const result = matchSchoolNameToCode('日比谷', master);
    expect(result.matchedCode).toBe('A1');
    expect(result.reason).toBe('matched');
  });

  test('一致しない場合はno-match(nullを返し誤マッチしない)', () => {
    const result = matchSchoolNameToCode('存在しない高校', master);
    expect(result.matchedCode).toBeNull();
    expect(result.reason).toBe('no-match');
  });

  test('似た名称でも完全一致でなければマッチしない(東 vs 東久留米総合)', () => {
    const result = matchSchoolNameToCode('東', master);
    expect(result.matchedCode).toBe('A3');
    expect(result.reason).toBe('matched');
  });

  test('正規化後に複数校が同名になる場合はambiguousでnullを返す(分校等の誤紐付け防止)', () => {
    const ambiguousMaster: SchoolRecord[] = [
      rec('B1', '東京都立大森高等学校'),
      rec('B2', '東京都立大森西高等学校（分校）大森高等学校'), // 意図的に正規化後'東京都立大森高等学校（分校）大森'と別名になる想定
    ];
    // 明示的にambiguousケースを作る: 2校が全く同じ正規化結果を持つ場合
    const collidingMaster: SchoolRecord[] = [rec('C1', '東京都立大森高等学校'), rec('C2', '東京都立大森高校')];
    const result = matchSchoolNameToCode('大森', collidingMaster);
    expect(result.matchedCode).toBeNull();
    expect(result.reason).toBe('ambiguous');
    void ambiguousMaster; // 上のコメント用ダミー(未使用警告回避)
  });
});

describe('matchSchoolNames', () => {
  const master: SchoolRecord[] = [rec('A1', '東京都立日比谷高等学校'), rec('A2', '東京都立三田高等学校')];

  test('重複したschoolName(同一校の複数学科レコード)は1回だけ突合する', () => {
    const summary = matchSchoolNames(['日比谷', '日比谷', '三田'], master);
    expect(summary.results).toHaveLength(2);
    expect(summary.matchedCount).toBe(2);
    expect(summary.noMatchCount).toBe(0);
    expect(summary.ambiguousCount).toBe(0);
  });

  test('一致しない名称が混在する場合はnoMatchCountに反映される', () => {
    const summary = matchSchoolNames(['日比谷', '存在しない高校'], master);
    expect(summary.matchedCount).toBe(1);
    expect(summary.noMatchCount).toBe(1);
  });
});
