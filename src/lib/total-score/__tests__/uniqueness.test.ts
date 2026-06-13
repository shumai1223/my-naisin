// scaled-content（テンプレ量産）対策の機械ゲート。
// total-score の全県（計算機13＋解説34）で overview・FAQ・本文が互いに重複していない＝
// 各ページが実体として独自であることを保証する。AdSense/索引の「使い回しコンテンツ」判定を未然に防ぐ。

import { TOTAL_SCORE_SYSTEMS } from '../registry';
import { TOTAL_SCORE_EXPLAINERS } from '../explainers';

const systems = Object.values(TOTAL_SCORE_SYSTEMS);
const explainers = Object.values(TOTAL_SCORE_EXPLAINERS);

function expectAllUnique(label: string, values: string[]) {
  const seen = new Map<string, number>();
  const dups: string[] = [];
  for (const v of values) {
    const n = (seen.get(v) ?? 0) + 1;
    seen.set(v, n);
    if (n === 2) dups.push(v.slice(0, 40));
  }
  expect({ label, dups }).toEqual({ label, dups: [] });
}

describe('total-score uniqueness（テンプレ流用＝scaled-content の機械検出）', () => {
  it('全県の overview が互いに重複しない', () => {
    expectAllUnique('overview', [
      ...systems.map((s) => s.overview),
      ...explainers.map((e) => e.overview),
    ]);
  });

  it('全県の FAQ 回答が互いに重複しない（使い回しゼロ）', () => {
    const answers = [
      ...systems.flatMap((s) => s.faqs.map((f) => f.a)),
      ...explainers.flatMap((e) => e.faqs.map((f) => f.a)),
    ];
    expectAllUnique('faq.answer', answers);
  });

  it('解説県の composition / flow が互いに重複しない', () => {
    expectAllUnique('composition', explainers.map((e) => e.composition));
    expectAllUnique('flow', explainers.map((e) => e.flow.join('｜')));
  });

  it('各県の overview に自県名が含まれる（県固有である証明）', () => {
    for (const s of systems) expect(s.overview).toContain(s.name);
    for (const e of explainers) expect(e.overview).toContain(e.name);
  });

  it('計算機県の computeSteps が互いに重複しない', () => {
    expectAllUnique('computeSteps', systems.map((s) => s.computeSteps.join('｜')));
  });
});
