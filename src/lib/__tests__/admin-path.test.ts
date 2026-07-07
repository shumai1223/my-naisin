import { isAdminPath } from '../admin-path';

describe('isAdminPath', () => {
  it('/admin配下を判定する', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/report')).toBe(true);
    expect(isAdminPath('/admin/worklog')).toBe(true);
  });

  it('/admin配下でないパスはfalse', () => {
    expect(isAdminPath('/')).toBe(false);
    expect(isAdminPath('/hensachi')).toBe(false);
    expect(isAdminPath('/administrator')).toBe(false);
  });

  it('null/undefinedはfalse', () => {
    expect(isAdminPath(null)).toBe(false);
    expect(isAdminPath(undefined)).toBe(false);
  });
});
