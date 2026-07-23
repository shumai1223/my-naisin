import { isAdvisorEnabled } from '../flag';

describe('isAdvisorEnabled（ZZ-3c・旗のデフォルトoff）', () => {
  it('"1"のときのみtrue', () => {
    expect(isAdvisorEnabled('1')).toBe(true);
  });

  it('未設定・空文字・"0"・"true"等はfalse（デフォルトoff）', () => {
    expect(isAdvisorEnabled(undefined)).toBe(false);
    expect(isAdvisorEnabled('')).toBe(false);
    expect(isAdvisorEnabled('0')).toBe(false);
    expect(isAdvisorEnabled('true')).toBe(false);
  });
});
