// line.ts: 生徒/保護者LINE友だち追加URLの単一ソース。ExitIntentLineModal/StickyConvertBar等
// 主要な換金導線9箇所以上から呼ばれる収益直結の設定ゲートだが無テストだった。
// env未設定時の既定値・保護者URL未設定時の生徒URLへのフォールバックという契約を固定する。
// STUDENT_LINE_URL/PARENT_LINE_URLはモジュール読み込み時に一度だけ評価されるため、
// env切り替えごとにjest.resetModules()で再読み込みする。

describe('lineAddUrl', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_LINE_ADD_URL;
    delete process.env.NEXT_PUBLIC_LINE_ADD_URL_PARENT;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('env未設定時はハードコードの既定URLを返す(ビルド変数事故でも消灯しない)', () => {
    const { lineAddUrl } = require('../line');
    expect(lineAddUrl('student')).toBe('https://lin.ee/8tQMAxX');
  });

  it('audience未指定時はstudentとして扱われる', () => {
    const { lineAddUrl } = require('../line');
    expect(lineAddUrl()).toBe(lineAddUrl('student'));
  });

  it('保護者URL未設定時、parentはstudentのURLにフォールバックする', () => {
    const { lineAddUrl } = require('../line');
    expect(lineAddUrl('parent')).toBe(lineAddUrl('student'));
  });

  it('NEXT_PUBLIC_LINE_ADD_URLを設定すると生徒側の既定値を上書きする', () => {
    process.env.NEXT_PUBLIC_LINE_ADD_URL = 'https://lin.ee/student-override';
    const { lineAddUrl } = require('../line');
    expect(lineAddUrl('student')).toBe('https://lin.ee/student-override');
  });

  it('NEXT_PUBLIC_LINE_ADD_URL_PARENTを設定すると保護者側だけ独立したURLになる(生徒側は不変)', () => {
    process.env.NEXT_PUBLIC_LINE_ADD_URL = 'https://lin.ee/student-override';
    process.env.NEXT_PUBLIC_LINE_ADD_URL_PARENT = 'https://lin.ee/parent-override';
    const { lineAddUrl } = require('../line');
    expect(lineAddUrl('student')).toBe('https://lin.ee/student-override');
    expect(lineAddUrl('parent')).toBe('https://lin.ee/parent-override');
    expect(lineAddUrl('parent')).not.toBe(lineAddUrl('student'));
  });
});

describe('LINE_UNFRIEND_HELP_TEXT', () => {
  it('ブロックと友だち削除の両方の解除手順に言及している', () => {
    const { LINE_UNFRIEND_HELP_TEXT } = require('../line');
    expect(LINE_UNFRIEND_HELP_TEXT).toContain('ブロック');
    expect(LINE_UNFRIEND_HELP_TEXT).toContain('削除');
    expect(LINE_UNFRIEND_HELP_TEXT.length).toBeGreaterThan(0);
  });
});
