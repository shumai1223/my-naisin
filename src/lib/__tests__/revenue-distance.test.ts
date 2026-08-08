/**
 * @jest-environment node
 */
import path from 'path';
import {
  computeDistancesFromGraph,
  extractInternalRouteLinks,
  fileHasRevenueCtaMarker,
  computeSiteRevenueDistances,
  medianDistance,
  REVENUE_MARKER_ROUTES,
} from '@/lib/revenue-distance';

describe('掛-5 収益距離: computeDistancesFromGraph（純粋関数・BFS）', () => {
  it('収益ノード自身の距離は1', () => {
    const dist = computeDistancesFromGraph({}, ['/hiyou']);
    expect(dist['/hiyou']).toBe(1);
  });

  it('収益ノードへ1クリックでリンクしているページは距離2', () => {
    const dist = computeDistancesFromGraph({ '/a': ['/hiyou'] }, ['/hiyou']);
    expect(dist['/a']).toBe(2);
  });

  it('2クリック先は距離3（連鎖）', () => {
    const dist = computeDistancesFromGraph({ '/a': ['/b'], '/b': ['/hiyou'] }, ['/hiyou']);
    expect(dist['/a']).toBe(3);
    expect(dist['/b']).toBe(2);
  });

  it('複数経路がある場合は最短距離を採用する', () => {
    const dist = computeDistancesFromGraph(
      { '/a': ['/b', '/hiyou'], '/b': ['/c'], '/c': ['/hiyou'] },
      ['/hiyou']
    );
    expect(dist['/a']).toBe(2);
  });

  it('収益面へ到達できないページは距離が付かない（∞として扱う）', () => {
    const dist = computeDistancesFromGraph({ '/orphan': ['/other-orphan'] }, ['/hiyou']);
    expect(dist['/orphan']).toBeUndefined();
  });

  it('循環グラフでも無限ループせず正しく終了する', () => {
    const dist = computeDistancesFromGraph(
      { '/a': ['/b'], '/b': ['/a', '/hiyou'] },
      ['/hiyou']
    );
    expect(dist['/a']).toBe(3);
    expect(dist['/b']).toBe(2);
  });
});

describe('掛-5 収益距離: extractInternalRouteLinks（純粋関数）', () => {
  it('href="/xxx"形式を抽出する', () => {
    expect(extractInternalRouteLinks('<a href="/hiyou">費用</a>')).toEqual(['/hiyou']);
  });

  it("href='/xxx'・href={'/xxx'}・href={`/xxx`}のいずれも抽出する", () => {
    expect(extractInternalRouteLinks(`<a href='/mendan'>x</a>`)).toEqual(['/mendan']);
    expect(extractInternalRouteLinks(`<Link href={'/juku-shindan'}>x</Link>`)).toEqual(['/juku-shindan']);
    expect(extractInternalRouteLinks('<Link href={`/hogosha`}>x</Link>')).toEqual(['/hogosha']);
  });

  it('クエリ・ハッシュ・末尾スラッシュを正規化する', () => {
    expect(extractInternalRouteLinks('<a href="/hiyou?ref=top">x</a>')).toEqual(['/hiyou']);
    expect(extractInternalRouteLinks('<a href="/hiyou#section">x</a>')).toEqual(['/hiyou']);
    expect(extractInternalRouteLinks('<a href="/hiyou/">x</a>')).toEqual(['/hiyou']);
  });

  it('ルート("/")自体は保持する', () => {
    expect(extractInternalRouteLinks('<a href="/">ホーム</a>')).toEqual(['/']);
  });

  it('外部URL(https://)やmailto等は抽出しない', () => {
    expect(extractInternalRouteLinks('<a href="https://example.com/foo">x</a>')).toEqual([]);
    expect(extractInternalRouteLinks('<a href="mailto:test@example.com">x</a>')).toEqual([]);
  });

  it('重複するhrefは1件に集約する', () => {
    expect(extractInternalRouteLinks('<a href="/hiyou">1</a><a href="/hiyou">2</a>')).toEqual(['/hiyou']);
  });
});

describe('掛-5 収益距離: fileHasRevenueCtaMarker（純粋関数）', () => {
  it('ParentLeadCTAタグがあればtrue', () => {
    expect(fileHasRevenueCtaMarker('<ParentLeadCTA placement="hiyou" />')).toBe(true);
  });

  it('自己終了タグ・子要素ありタグのどちらでも検知する', () => {
    expect(fileHasRevenueCtaMarker('<StickyConvertBar/>')).toBe(true);
    expect(fileHasRevenueCtaMarker('<ExitIntentLineModal>\n  x\n</ExitIntentLineModal>')).toBe(true);
  });

  it('関係ないコンポーネント名だけならfalse', () => {
    expect(fileHasRevenueCtaMarker('<HensachiResultFlow />')).toBe(false);
  });

  it('部分文字列一致による誤検知をしない(例: ParentLeadCTAExperimentが無いのにParentLeadCTAとしてマッチしない類の逆パターンではなく、末尾が英数字で続くタグ名を誤検知しない)', () => {
    expect(fileHasRevenueCtaMarker('<ParentLeadCTAFooBar />')).toBe(false);
  });
});

describe('掛-5 収益距離: medianDistance（純粋関数）', () => {
  it('奇数件は中央の値', () => {
    expect(medianDistance([{ route: '/a', distance: 1, hasDirectCta: true, outboundLinks: [] }, { route: '/b', distance: 3, hasDirectCta: false, outboundLinks: [] }, { route: '/c', distance: 2, hasDirectCta: false, outboundLinks: [] }])).toBe(2);
  });

  it('空配列はInfinity', () => {
    expect(medianDistance([])).toBe(Infinity);
  });

  it('Infinityを含む配列でもソートが破綻しない', () => {
    const entries = [
      { route: '/a', distance: 1, hasDirectCta: true, outboundLinks: [] },
      { route: '/b', distance: Infinity, hasDirectCta: false, outboundLinks: [] },
    ];
    expect(medianDistance(entries)).toBe(1);
  });
});

describe('掛-5 収益距離: computeSiteRevenueDistances（実リポジトリでのスモークテスト）', () => {
  const appDir = path.join(__dirname, '..', '..', 'app');
  const srcDir = path.join(__dirname, '..', '..');
  const entries = computeSiteRevenueDistances(appDir, srcDir);

  it('全ページについて1件ずつエントリを返す(空にならない)', () => {
    // 掛-5の定義上の「378ページ」はGSC実測に流入があった具体URL数（/pref/[code]/school/[id]のような
    // 動的ルートの個別インスタンスを多数含む）であり、ここでの107件はpage.tsxテンプレート数（動的
    // ルートは1テンプレート=1件として数える）。テンプレート単位のグラフ計算はGSC実測の粒度と別軸。
    expect(entries.length).toBeGreaterThan(80);
  });

  it('収益面自身(REVENUE_MARKER_ROUTES)は全て距離1と判定される', () => {
    for (const route of REVENUE_MARKER_ROUTES) {
      const entry = entries.find((e) => e.route === route);
      expect(entry).toBeDefined();
      expect(entry!.distance).toBe(1);
      expect(entry!.hasDirectCta).toBe(true);
    }
  });

  it('ホームページ(/)は収益面への距離が有限(∞ではない)', () => {
    const home = entries.find((e) => e.route === '/');
    expect(home).toBeDefined();
    expect(home!.distance).toBeLessThan(Infinity);
  });

  it('Λ-2の学校ページ(/pref/[code]/school/[schoolCode])はSchoolPageConvertCTAのjuku-shindan導線経由で距離2以下(∞ではない)', () => {
    const schoolPage = entries.find((e) => e.route === '/pref/[code]/school/[schoolCode]');
    expect(schoolPage).toBeDefined();
    expect(schoolPage!.distance).toBeLessThanOrEqual(2);
  });

  it('各エントリのdistanceは1以上の整数またはInfinity', () => {
    for (const e of entries) {
      if (e.distance !== Infinity) {
        expect(Number.isInteger(e.distance)).toBe(true);
        expect(e.distance).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
