import { buildAffiliateClickParams } from '@/components/Affiliate/AffiliateClickTracker';

describe('buildAffiliateClickParams（S-6：affiliate_clickにplacement/pref/variantを載せる）', () => {
  it('全属性が揃っているとき、全てtrackパラメータへ載る', () => {
    expect(
      buildAffiliateClickParams(
        { affId: 'sora-juku-text', affName: 'そら塾', placement: 'result', pref: 'tokyo', variant: 'elive' },
        '/tokyo/total-score'
      )
    ).toEqual({
      program: 'sora-juku-text',
      name: 'そら塾',
      page: '/tokyo/total-score',
      placement: 'result',
      pref: 'tokyo',
      variant: 'elive',
    });
  });

  it('placement/pref/variant未指定（data属性が付いていない）ときはキー自体を送らない（"undefined"文字列の混入防止）', () => {
    expect(buildAffiliateClickParams({ affId: 'zkai-text-middle', affName: 'Z会' }, '/blog/example')).toEqual({
      program: 'zkai-text-middle',
      name: 'Z会',
      page: '/blog/example',
    });
  });

  it('affId/affNameが無いときはunknown/空文字にフォールバックする（既存挙動の維持）', () => {
    expect(buildAffiliateClickParams({}, '/')).toEqual({
      program: 'unknown',
      name: '',
      page: '/',
    });
  });
});
