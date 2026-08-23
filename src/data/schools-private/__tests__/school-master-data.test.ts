import { PREFECTURES } from '@/lib/prefectures';
import { findDuplicateCodes } from '@/lib/school-master';
import { PRIVATE_SCHOOL_MASTER_BY_PREFECTURE, PRIVATE_SCHOOL_MASTER_FILES } from '../index';

/**
 * DW-7（DEADWIRE 2026-08-10）で指摘された欠落の是正: Λ-5私立高校マスターDBには
 * `src/data/schools`（公立）と同型の整合性テストが1本も存在しなかった。
 * 当初は公立版と同名の`SCHOOL_MASTER_BY_PREFECTURE`/`SCHOOL_MASTER_FILES`をexportしており
 * 取り違え事故の温床だったため、2026-08-24に`PRIVATE_SCHOOL_MASTER_*`へリネーム済み
 * （生成元scripts/build-school-master.tsのexportPrefix引数と同期）。
 * scripts/build-school-master.tsを再実行してデータを更新した場合も、この条件は常に成立する。
 */
describe('私立高校マスターDB（Λ-5・47県チャンクの整合性）', () => {
  it('47都道府県すべてのチャンクが存在する', () => {
    expect(PRIVATE_SCHOOL_MASTER_FILES).toHaveLength(47);
    for (const p of PREFECTURES) {
      expect(PRIVATE_SCHOOL_MASTER_BY_PREFECTURE[p.code]).toBeDefined();
      expect(PRIVATE_SCHOOL_MASTER_BY_PREFECTURE[p.code].prefectureCode).toBe(p.code);
    }
  });

  it('学校コードの重複が0件（全国横断）', () => {
    expect(findDuplicateCodes(PRIVATE_SCHOOL_MASTER_FILES)).toEqual([]);
  });

  it('全ファイルにsourceUrl・公表年度・取得日が入っている（Y-0憲法②：1データ点=1出典）', () => {
    for (const file of PRIVATE_SCHOOL_MASTER_FILES) {
      expect(file.source.url).toMatch(/^https:\/\/www\.mext\.go\.jp\//);
      expect(file.source.edition.length).toBeGreaterThan(0);
      expect(file.source.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('全レコードが学校コード・学校名・住所・郵便番号を持つ（空文字なし）', () => {
    for (const file of PRIVATE_SCHOOL_MASTER_FILES) {
      for (const s of file.schools) {
        expect(s.code.length).toBeGreaterThan(0);
        expect(s.name.length).toBeGreaterThan(0);
        expect(s.address.length).toBeGreaterThan(0);
        expect(s.postalCode.length).toBeGreaterThan(0);
      }
    }
  });

  it('学校コードは英数字のみ（余計な空白・改行の混入なし）', () => {
    for (const file of PRIVATE_SCHOOL_MASTER_FILES) {
      for (const s of file.schools) {
        expect(s.code).toMatch(/^[A-Z0-9]+$/);
      }
    }
  });

  it('branchはbooleanである（真偽値以外の混入なし）', () => {
    for (const file of PRIVATE_SCHOOL_MASTER_FILES) {
      for (const s of file.schools) {
        expect(typeof s.branch).toBe('boolean');
      }
    }
  });

  it('全国合計1,466校（2026-07-29取得のMEXT学校コード一覧・令和8年5月29日公表版の実測値・2026-07-30初収録時から不変）', () => {
    const total = PRIVATE_SCHOOL_MASTER_FILES.reduce((sum, f) => sum + f.schools.length, 0);
    expect(total).toBe(1466);
  });

  it('47都道府県すべてに少なくとも1校が入っている（0件の県があれば異常）', () => {
    for (const file of PRIVATE_SCHOOL_MASTER_FILES) {
      expect(file.schools.length).toBeGreaterThan(0);
    }
  });
});
