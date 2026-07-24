import { PREFECTURES } from '@/lib/prefectures';
import { findDuplicateCodes } from '@/lib/school-master';
import { SCHOOL_MASTER_BY_PREFECTURE, SCHOOL_MASTER_FILES } from '../index';

/**
 * Y-1 DoD検証: 生成済み47県チャンクの整合性ゲート。
 * scripts/build-school-master.ts を再実行してデータを更新した場合も、この4条件は
 * 常に成立していなければならない（成立しなければ生成物または一次ソースに異常がある）。
 */
describe('学校マスターDB（Y-1・47県チャンクの整合性）', () => {
  it('47都道府県すべてのチャンクが存在する', () => {
    expect(SCHOOL_MASTER_FILES).toHaveLength(47);
    for (const p of PREFECTURES) {
      expect(SCHOOL_MASTER_BY_PREFECTURE[p.code]).toBeDefined();
      expect(SCHOOL_MASTER_BY_PREFECTURE[p.code].prefectureCode).toBe(p.code);
    }
  });

  it('学校コードの重複が0件（全国横断）', () => {
    expect(findDuplicateCodes(SCHOOL_MASTER_FILES)).toEqual([]);
  });

  it('全ファイルにsourceUrl・公表年度・取得日が入っている（Y-0②：1データ点=1出典）', () => {
    for (const file of SCHOOL_MASTER_FILES) {
      expect(file.source.url).toMatch(/^https:\/\/www\.mext\.go\.jp\//);
      expect(file.source.edition.length).toBeGreaterThan(0);
      expect(file.source.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('47都道府県すべてに最低1校の公立高校が入っている（0件の県は無いはず）', () => {
    for (const file of SCHOOL_MASTER_FILES) {
      expect(file.schools.length).toBeGreaterThan(0);
    }
  });

  it('全国合計3,422校（2026-07-24取得のMEXT学校コード一覧・令和8年5月29日公表版の実測値）', () => {
    const total = SCHOOL_MASTER_FILES.reduce((sum, f) => sum + f.schools.length, 0);
    expect(total).toBe(3422);
  });

  it('全レコードが学校コード・学校名・住所を持つ（空文字なし）', () => {
    for (const file of SCHOOL_MASTER_FILES) {
      for (const s of file.schools) {
        expect(s.code.length).toBeGreaterThan(0);
        expect(s.name.length).toBeGreaterThan(0);
        expect(s.address.length).toBeGreaterThan(0);
      }
    }
  });

  it('学校コードは英数字のみ（余計な空白・改行の混入なし）', () => {
    for (const file of SCHOOL_MASTER_FILES) {
      for (const s of file.schools) {
        expect(s.code).toMatch(/^[A-Z0-9]+$/);
      }
    }
  });
});
