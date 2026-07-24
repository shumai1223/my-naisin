import { isJukuSaasEnabled } from '../flag';

describe('isJukuSaasEnabled（ZZ-4d・旗のデフォルトoff）', () => {
  it('"1"のときのみtrue', () => {
    expect(isJukuSaasEnabled('1')).toBe(true);
  });

  it('未設定・空文字・"0"・"true"等はfalse（デフォルトoff）', () => {
    expect(isJukuSaasEnabled(undefined)).toBe(false);
    expect(isJukuSaasEnabled('')).toBe(false);
    expect(isJukuSaasEnabled('0')).toBe(false);
    expect(isJukuSaasEnabled('true')).toBe(false);
  });
});
