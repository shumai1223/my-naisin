import { staticSegmentsOf, segmentsAppearIn, segmentsAppearInText } from '@/lib/dynamic-route-audit';

describe('staticSegmentsOf', () => {
  it('[param]を除いた静的セグメントを返す', () => {
    expect(staticSegmentsOf('/pref/[code]')).toEqual(['pref']);
    expect(staticSegmentsOf('/hensachi/kyoka-betsu/[subject]')).toEqual(['hensachi', 'kyoka-betsu']);
  });

  it('先頭が[param]のルートは空配列', () => {
    expect(staticSegmentsOf('/[prefecture]')).toEqual([]);
  });

  it('[param]が中間にあるルートは前後の静的セグメントを両方返す', () => {
    expect(staticSegmentsOf('/[prefecture]/naishin')).toEqual(['naishin']);
  });
});

describe('segmentsAppearInText（sitemap.ts等の単一ファイル向け）', () => {
  it('文字列リテラルとして現れれば true', () => {
    expect(segmentsAppearInText(['pref'], "url: `${baseUrl}/pref/${code}`")).toBe(true);
  });

  it('無関係な単語の部分文字列としては誤検知しない（pref ≠ prefecture）', () => {
    expect(segmentsAppearInText(['pref'], "import { PREFECTURES } from '@/lib/prefectures';")).toBe(false);
  });

  it('現れなければ false', () => {
    expect(segmentsAppearInText(['juku-shindan'], "url: `${baseUrl}/hensachi`")).toBe(false);
  });

  it('セグメントが空配列なら常にtrue（対象外ルート）', () => {
    expect(segmentsAppearInText([], 'anything')).toBe(true);
  });
});

describe('segmentsAppearIn（複数ファイル向け・自己ファイル除外）', () => {
  const files = [
    { path: 'src/app/pref/[code]/page.tsx', content: "const route = '/pref/${code}';" },
    { path: 'src/app/prefectures/page.tsx', content: "href={`/pref/${pref.code}`}" },
    { path: 'src/lib/prefectures.ts', content: "export const PREFECTURES = [];" },
  ];

  it('自己ファイルを除外しても他ファイルに現れればtrue', () => {
    const result = segmentsAppearIn(['pref'], files, ['src/app/pref/[code]/page.tsx']);
    expect(result).toBe(true);
  });

  it('自己ファイルのみに現れる場合は除外するとfalse', () => {
    const onlySelf = [{ path: 'src/app/pref/[code]/page.tsx', content: "const route = '/pref/${code}';" }];
    const result = segmentsAppearIn(['pref'], onlySelf, ['src/app/pref/[code]/page.tsx']);
    expect(result).toBe(false);
  });

  it('無関係な単語（prefecture等）には誤反応しない', () => {
    const onlyUnrelated = [{ path: 'src/lib/prefectures.ts', content: "export const PREFECTURES = [];" }];
    const result = segmentsAppearIn(['pref'], onlyUnrelated, []);
    expect(result).toBe(false);
  });
});
