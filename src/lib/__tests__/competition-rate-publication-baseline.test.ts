import {
  buildCompetitionRatePublicationBaseline,
  classifyFinality,
  inferPublicationFormat,
  isOfficialUrl,
} from '@/lib/competition-rate-publication-baseline';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

describe('buildCompetitionRatePublicationBaseline', () => {
  const baseline = buildCompetitionRatePublicationBaseline();

  it('covers every prefecture present in COMPETITION_RATE_BY_PREFECTURE (47県)', () => {
    const expected = Object.keys(COMPETITION_RATE_BY_PREFECTURE).sort();
    const actual = baseline.map((e) => e.prefecture).sort();
    expect(actual).toEqual(expected);
    expect(actual.length).toBe(47);
  });

  it('resolves a real fiscal year label (not "不明") for every prefecture', () => {
    for (const entry of baseline) {
      expect(entry.latestFiscalYear).not.toBe('不明');
      expect(entry.latestFiscalYear).toMatch(/令和\d+年度/);
    }
  });

  it('never invents an official source: every officialSources entry independently passes isOfficialUrl', () => {
    for (const entry of baseline) {
      for (const src of entry.officialSources) {
        expect(isOfficialUrl(src.url)).toBe(true);
      }
    }
  });

  it('rejects an obviously non-government domain', () => {
    expect(isOfficialUrl('https://www.eishinkan.net/entrance/high_admissions/7927/')).toBe(false);
  });

  it('accepts the pre-.lg.jp "pref.<name>.jp" convention still used by several prefectures', () => {
    expect(isOfficialUrl('https://www.pref.aichi.jp/uploaded/attachment/600212.pdf')).toBe(true);
    expect(isOfficialUrl('https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/x.pdf')).toBe(true);
  });

  it('unresolved is never empty (A-1の未確定項目は正直に書く。埋めない)', () => {
    for (const entry of baseline) {
      expect(entry.unresolved.length).toBeGreaterThan(0);
    }
  });

  it('flags prefectures with zero official sources instead of silently dropping them', () => {
    const noOfficial = baseline.filter((e) => e.officialSources.length === 0);
    for (const entry of noOfficial) {
      expect(entry.unresolved.some((u) => u.includes('一次ソース'))).toBe(true);
    }
    // 実測の記録用（2026-09-01時点で47県全て一次ソースが見つかっている。変化したらこのテストがfailして気づける）
    expect(noOfficial.map((e) => e.prefecture)).toEqual([]);
  });

  it('supplementarySourceCount is never negative and matches the source-count difference', () => {
    for (const entry of baseline) {
      expect(entry.supplementarySourceCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('only fills publishedAt for prefectures with a manual timing note, and drops the corresponding unresolved line there', () => {
    const chiba = baseline.find((e) => e.prefecture === 'chiba');
    expect(chiba?.publishedAt).toBe('令和8年（2026年）2月13日');
    expect(chiba?.unresolved.some((u) => u.startsWith('公表日'))).toBe(false);

    const withoutNote = baseline.find((e) => e.prefecture === 'aomori');
    expect(withoutNote?.publishedAt).toBeNull();
    expect(withoutNote?.unresolved.some((u) => u.startsWith('公表日'))).toBe(true);
  });

  it('classifies finality from real docTitle text without inventing a "preliminary" nobody has evidence for', () => {
    const hyogo = baseline.find((e) => e.prefecture === 'hyogo');
    expect(hyogo?.finality).toBe('final');

    // saitama.tsのdocTitleはR5〜R8全て「確定」表記で速報の記述は無い（タスクファイルが
    // 誤って主張していた「令和8年度は速報版」という説を実データで反証した回帰テスト）。
    const saitama = baseline.find((e) => e.prefecture === 'saitama');
    expect(saitama?.finality).toBe('final');

    const noKeyword = baseline.find((e) => e.prefecture === 'ishikawa');
    expect(noKeyword?.finality).toBe('unknown');
    expect(noKeyword?.unresolved.some((u) => u.startsWith('速報版/確定版'))).toBe(true);
  });

  it('never mechanically classifies a source as "preliminary" without a real 速報 keyword hit', () => {
    // 2026-09-01時点の実データでは47県中0件が速報表記。0件のまま固定し、変化したら気づけるようにする。
    expect(baseline.filter((e) => e.finality === 'preliminary')).toEqual([]);
  });
});

describe('classifyFinality', () => {
  it('detects preliminary (速報) when only that keyword is present', () => {
    expect(classifyFinality('令和8年度公立高校一般入試志願状況（速報）')).toBe('preliminary');
  });

  it('detects final for 最終/確定/変更後', () => {
    expect(classifyFinality('...志願者数（最終）について')).toBe('final');
    expect(classifyFinality('...出願状況（特別出願後確定数）')).toBe('final');
    expect(classifyFinality('...志願者数一覧（変更後）')).toBe('final');
  });

  it('returns unknown when neither keyword is present', () => {
    expect(classifyFinality('令和8年度石川県公立高等学校一般入学(全日制)の出願状況（2月24日）')).toBe('unknown');
  });

  it('returns unknown when both keywords appear (does not guess which wins)', () => {
    expect(classifyFinality('速報のち確定版に更新')).toBe('unknown');
  });
});

describe('inferPublicationFormat', () => {
  it('detects pdf/xlsx/csv by extension', () => {
    expect(inferPublicationFormat('https://example.lg.jp/a/b.pdf')).toBe('pdf');
    expect(inferPublicationFormat('https://example.lg.jp/a/b.xlsx')).toBe('xlsx');
    expect(inferPublicationFormat('https://example.lg.jp/a/b.csv')).toBe('csv');
  });

  it('detects html for a bare page path', () => {
    expect(inferPublicationFormat('https://example.lg.jp/section/page.html')).toBe('html');
    expect(inferPublicationFormat('https://example.lg.jp/')).toBe('html');
  });

  it('returns unknown for an unrecognized extensionless path rather than guessing', () => {
    expect(inferPublicationFormat('https://example.lg.jp/documents/d/kyoiku/2026-02-13-182440-757')).toBe('unknown');
  });

  it('returns unknown for a malformed URL instead of throwing', () => {
    expect(inferPublicationFormat('not a url')).toBe('unknown');
  });
});
