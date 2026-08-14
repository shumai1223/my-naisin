// changelog-data.ts: E-E-A-T向けの更新履歴データ+3つの純関数(無テストと判明)。
// getRecentChanges()はCHANGELOGが新しい順にソート済みであることを前提にslice(0, limit)する
// だけの実装のため、CHANGELOG自体が降順を崩すとホームの「最新の更新」表示が静かに古い情報を
// 出し続ける事故になる(値の取りうる範囲・前提条件が検証されていない典型パターン)。

import { CHANGELOG, getRecentChanges, getChangesByPrefecture, getChangesByCategory } from '../changelog-data';
import { getPrefectureByCode } from '../prefectures';

const VALID_TYPES = ['add', 'update', 'fix', 'remove'];
const VALID_CATEGORIES = ['calculation', 'data', 'feature', 'ui', 'content', 'seo'];

describe('CHANGELOG data integrity', () => {
  it('1件以上のエントリを持つ', () => {
    expect(CHANGELOG.length).toBeGreaterThan(0);
  });

  it('全エントリがYYYY-MM-DD形式の有効な日付を持つ', () => {
    for (const entry of CHANGELOG) {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(entry.date).getTime())).toBe(false);
    }
  });

  it('全エントリのtype/categoryが定義済みの値のいずれかである', () => {
    for (const entry of CHANGELOG) {
      expect(VALID_TYPES).toContain(entry.type);
      expect(VALID_CATEGORIES).toContain(entry.category);
    }
  });

  it('全エントリのtitle/descriptionが空でない', () => {
    for (const entry of CHANGELOG) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it('prefectureCodeを持つエントリは全てprefectures.tsの実在するcodeである', () => {
    for (const entry of CHANGELOG) {
      if (entry.prefectureCode === undefined) continue;
      expect(getPrefectureByCode(entry.prefectureCode)).toBeDefined();
    }
  });

  it('日付の新しい順(降順)に並んでいる（getRecentChangesの前提条件）', () => {
    for (let i = 0; i < CHANGELOG.length - 1; i++) {
      const current = new Date(CHANGELOG[i].date).getTime();
      const next = new Date(CHANGELOG[i + 1].date).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});

describe('getRecentChanges', () => {
  it('既定(limit省略)では先頭5件を返す', () => {
    const result = getRecentChanges();
    expect(result.length).toBe(Math.min(5, CHANGELOG.length));
    expect(result).toEqual(CHANGELOG.slice(0, 5));
  });

  it('limitを指定するとその件数を返す', () => {
    expect(getRecentChanges(2)).toEqual(CHANGELOG.slice(0, 2));
    expect(getRecentChanges(10)).toEqual(CHANGELOG.slice(0, 10));
  });

  it('limitがCHANGELOG全体を超えても全件を返す(エラーにならない)', () => {
    const result = getRecentChanges(CHANGELOG.length + 100);
    expect(result.length).toBe(CHANGELOG.length);
  });

  it('limit=0は空配列を返す', () => {
    expect(getRecentChanges(0)).toEqual([]);
  });

  it('返す配列は常にCHANGELOGの先頭からの連続した順序を保つ（新しい順）', () => {
    const result = getRecentChanges(3);
    for (let i = 0; i < result.length - 1; i++) {
      expect(new Date(result[i].date).getTime()).toBeGreaterThanOrEqual(new Date(result[i + 1].date).getTime());
    }
  });
});

describe('getChangesByPrefecture', () => {
  it('prefectureCodeが一致するエントリのみを返す', () => {
    const withCode = CHANGELOG.find((e) => e.prefectureCode !== undefined);
    expect(withCode).toBeDefined();
    if (!withCode?.prefectureCode) return;
    const result = getChangesByPrefecture(withCode.prefectureCode);
    expect(result.length).toBeGreaterThan(0);
    for (const entry of result) {
      expect(entry.prefectureCode).toBe(withCode.prefectureCode);
    }
  });

  it('存在しない県コードは空配列を返す', () => {
    expect(getChangesByPrefecture('not-a-real-prefecture')).toEqual([]);
  });
});

describe('getChangesByCategory', () => {
  it.each(VALID_CATEGORIES)('category=%sで絞り込んだ結果は全て同一categoryである', (category) => {
    const result = getChangesByCategory(category as ChangeLogEntryCategory);
    for (const entry of result) {
      expect(entry.category).toBe(category);
    }
  });

  it('全カテゴリの絞り込み結果の合計件数はCHANGELOG全体と一致する（漏れ・重複がない）', () => {
    const total = VALID_CATEGORIES.reduce(
      (sum, cat) => sum + getChangesByCategory(cat as ChangeLogEntryCategory).length,
      0
    );
    expect(total).toBe(CHANGELOG.length);
  });
});

type ChangeLogEntryCategory = 'calculation' | 'data' | 'feature' | 'ui' | 'content' | 'seo';
