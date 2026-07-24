import { isPartnerDemoEnabled } from '../flag';

describe('isPartnerDemoEnabled（AA-2・旗のデフォルトoff）', () => {
  it('"1"のときのみtrue', () => {
    expect(isPartnerDemoEnabled('1')).toBe(true);
  });

  it('未設定・空文字・"0"・"true"等はfalse（デフォルトoff）', () => {
    expect(isPartnerDemoEnabled(undefined)).toBe(false);
    expect(isPartnerDemoEnabled('')).toBe(false);
    expect(isPartnerDemoEnabled('0')).toBe(false);
    expect(isPartnerDemoEnabled('true')).toBe(false);
  });
});
