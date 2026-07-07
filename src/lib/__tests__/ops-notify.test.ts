/**
 * 運用通知(H-3)のメッセージ整形テスト。PIIを含めないこと・必要情報が揃うことを固定する。
 */
import { formatRequestErrorMessage } from '@/lib/ops-notify';

describe('formatRequestErrorMessage', () => {
  it('Errorインスタンスからメッセージ・パス・ルート情報を整形する', () => {
    const msg = formatRequestErrorMessage(
      new Error('boom'),
      { path: '/hensachi', method: 'GET' },
      { routerKind: 'App Router', routePath: '/hensachi', routeType: 'render' }
    );
    expect(msg).toContain('GET /hensachi');
    expect(msg).toContain('boom');
    expect(msg).toContain('App Router');
    expect(msg).toContain('render');
  });

  it('Error以外(文字列等)が投げられても落ちずにString化する', () => {
    const msg = formatRequestErrorMessage(
      'plain string error',
      { path: '/api/lead', method: 'POST' },
      { routerKind: 'App Router', routePath: '/api/lead', routeType: 'route' }
    );
    expect(msg).toContain('plain string error');
    expect(msg).toContain('POST /api/lead');
  });

  it('スタックトレースはError時のみ先頭数行を含める', () => {
    const withStack = formatRequestErrorMessage(
      new Error('has stack'),
      { path: '/', method: 'GET' },
      { routerKind: 'App Router', routePath: '/', routeType: 'render' }
    );
    expect(withStack).toContain('スタック');

    const withoutStack = formatRequestErrorMessage(
      'no stack here',
      { path: '/', method: 'GET' },
      { routerKind: 'App Router', routePath: '/', routeType: 'render' }
    );
    expect(withoutStack).not.toContain('スタック');
  });
});
