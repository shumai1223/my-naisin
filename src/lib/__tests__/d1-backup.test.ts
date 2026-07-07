/**
 * D1定期バックアップ（H-4）のマニフェスト組み立て純関数テスト。
 */
import { buildBackupManifest, countRowsFromD1Json, D1_BACKUP_TABLES } from '../d1-backup';

describe('D1_BACKUP_TABLES', () => {
  it('migrations 0001-0006で作られる5テーブルが揃っている', () => {
    expect([...D1_BACKUP_TABLES].sort()).toEqual(
      ['api_keys', 'api_usage', 'clicks', 'leads', 'push_subscriptions'].sort()
    );
  });
});

describe('countRowsFromD1Json（wrangler --json 出力のパース）', () => {
  it('results配列の長さを返す', () => {
    expect(countRowsFromD1Json([{ results: [{ id: 1 }, { id: 2 }, { id: 3 }] }])).toBe(3);
  });

  it('resultsが空でも0', () => {
    expect(countRowsFromD1Json([{ results: [] }])).toBe(0);
  });

  it('配列でない・空配列・resultsキー無しは0（壊れず安全側）', () => {
    expect(countRowsFromD1Json(null)).toBe(0);
    expect(countRowsFromD1Json([])).toBe(0);
    expect(countRowsFromD1Json([{}])).toBe(0);
    expect(countRowsFromD1Json('not json')).toBe(0);
  });
});

describe('buildBackupManifest', () => {
  it('全テーブルが件数ありなら警告は出ない', () => {
    const m = buildBackupManifest(
      D1_BACKUP_TABLES.map((table) => ({ table, file: `${table}.json`, rowCount: 10, bytes: 1000 }))
    );
    expect(m.warnings).toHaveLength(0);
    expect(m.totalRows).toBe(50);
    expect(m.totalBytes).toBe(5000);
  });

  it('0件テーブルは警告に出る', () => {
    const m = buildBackupManifest([{ table: 'leads', file: 'leads.json', rowCount: 0, bytes: 20 }]);
    expect(m.warnings.some((w) => w.includes('leads') && w.includes('0件'))).toBe(true);
  });

  it('欠落テーブル（渡されなかったもの）は「未バックアップ」警告に出る', () => {
    const m = buildBackupManifest([{ table: 'leads', file: 'leads.json', rowCount: 5, bytes: 100 }]);
    expect(m.warnings.some((w) => w.includes('api_keys') && w.includes('未バックアップ'))).toBe(true);
    expect(m.warnings.some((w) => w.includes('clicks') && w.includes('未バックアップ'))).toBe(true);
  });

  it('exportedAtはISO形式のタイムスタンプ（DI可能）', () => {
    const now = new Date('2026-07-07T12:00:00Z');
    const m = buildBackupManifest([], now);
    expect(m.exportedAt).toBe('2026-07-07T12:00:00.000Z');
  });
});
