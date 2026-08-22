import { isInterimBulletinPreviewEnabled } from '../flag';

describe('isInterimBulletinPreviewEnabled（Y-11・旗のデフォルトoff）', () => {
  it('"1"のときのみtrue', () => {
    expect(isInterimBulletinPreviewEnabled('1')).toBe(true);
  });

  it('未設定・空文字・"0"・"true"等はfalse（デフォルトoff）', () => {
    expect(isInterimBulletinPreviewEnabled(undefined)).toBe(false);
    expect(isInterimBulletinPreviewEnabled('')).toBe(false);
    expect(isInterimBulletinPreviewEnabled('0')).toBe(false);
    expect(isInterimBulletinPreviewEnabled('true')).toBe(false);
  });
});
