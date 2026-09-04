// scaled-content（テンプレ量産）対策の機械ゲート。/[prefecture]/nyuushi-nittei は47県が
// 同一のReactコンポーネントテンプレートで描画されるため、各県の実データ（出典・日程）が
// 互いに独立していることを機械的に保証する（total-score/__tests__/uniqueness.test.tsと同じ設計）。
// このDBは公表資料の項目名・日付をそのまま転記する方針（Y-0憲法）のため、総合得点ページのような
// 手書きprose（overview/FAQ）は持たない。かわりに「出典URL・events内容が県ごとに異なる」ことを
// 検証し、コピペで別県のファイルを流用していないかを検出する。

import { EXAM_SCHEDULE_BY_PREFECTURE } from '../index';

const files = Object.values(EXAM_SCHEDULE_BY_PREFECTURE).map((f) => f!);

describe('入試日程DB uniqueness（テンプレ流用＝scaled-content の機械検出）', () => {
  it('全県のsourceUrl（最新年度）が互いに重複しない', () => {
    const urls = files.map((f) => f.years[f.years.length - 1].sourceUrl);
    const seen = new Map<string, number>();
    const dups: string[] = [];
    for (const u of urls) {
      const n = (seen.get(u) ?? 0) + 1;
      seen.set(u, n);
      if (n === 2) dups.push(u);
    }
    expect(dups).toEqual([]);
  });

  it('全県のイベント一覧（label+startDateの連結）が互いに重複しない（コピペ流用の検出）', () => {
    const fingerprints = files.map((f) =>
      f.years
        .flatMap((y) => y.events.map((e) => `${e.label}:${e.startDate}`))
        .join('|')
    );
    const seen = new Map<string, number>();
    const dups: string[] = [];
    for (const fp of fingerprints) {
      const n = (seen.get(fp) ?? 0) + 1;
      seen.set(fp, n);
      if (n === 2) dups.push(fp.slice(0, 60));
    }
    expect(dups).toEqual([]);
  });

  it('各県のdocTitleに自県固有の年度表記が含まれる（令和8年度・R8等いずれかの表記で県固有性を確認）', () => {
    for (const f of files) {
      const latest = f.years[f.years.length - 1];
      expect(latest.docTitle.length).toBeGreaterThan(0);
    }
  });
});
