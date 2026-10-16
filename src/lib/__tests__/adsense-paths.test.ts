import { isAdSenseExcludedPath } from '../adsense-paths';

describe('isAdSenseExcludedPath（URLにトークン・成績が載るページでは AdSense を読み込まない）', () => {
  it.each([
    '/admin',
    '/admin/report',
    '/juku/dashboard',
    '/juku/matching/dashboard',
    '/hogosha',
    '/privacy',
    '/contact',
    '/api/unsubscribe',
  ])('%s は除外する', (p) => {
    expect(isAdSenseExcludedPath(p)).toBe(true);
  });

  it.each([
    '/',
    '/hensachi',
    '/tokyo/total-score',
    '/pref/tokyo/school/D113299901022',
    '/blog/naishin-guide',
    '/juku-shindan',
    '/juku-hiyou',
    '/hogosha-guide',
    '/contacts',
    '/administrator',
  ])('%s は除外しない（前方一致の取り違えがない）', (p) => {
    expect(isAdSenseExcludedPath(p)).toBe(false);
  });

  it('null・undefined・空文字は除外しない', () => {
    expect(isAdSenseExcludedPath(null)).toBe(false);
    expect(isAdSenseExcludedPath(undefined)).toBe(false);
    expect(isAdSenseExcludedPath('')).toBe(false);
  });
});
