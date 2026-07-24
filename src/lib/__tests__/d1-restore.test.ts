/**
 * D1リストアSQL生成（ZZ-10d）の契約テスト。
 * DB非依存の純関数のみを扱うため、実際のD1/wranglerには一切触れない。
 */
import { extractRowsFromD1Json, escapeSqlValue, buildInsertStatements, buildRestoreSqlFile } from '../d1-restore';

describe('extractRowsFromD1Json', () => {
  test('wrangler --json の標準形状から行データを取り出す', () => {
    const raw = [{ results: [{ id: 1, email: 'a@example.com' }, { id: 2, email: 'b@example.com' }] }];
    expect(extractRowsFromD1Json(raw)).toEqual([
      { id: 1, email: 'a@example.com' },
      { id: 2, email: 'b@example.com' },
    ]);
  });

  test('配列でない・空配列・resultsキー無しは空配列(例外を投げない)', () => {
    expect(extractRowsFromD1Json(null)).toEqual([]);
    expect(extractRowsFromD1Json([])).toEqual([]);
    expect(extractRowsFromD1Json([{}])).toEqual([]);
    expect(extractRowsFromD1Json('not json')).toEqual([]);
  });
});

describe('escapeSqlValue', () => {
  test('null/undefinedはNULL', () => {
    expect(escapeSqlValue(null)).toBe('NULL');
    expect(escapeSqlValue(undefined)).toBe('NULL');
  });

  test('真偽値は0/1(SQLite慣習)', () => {
    expect(escapeSqlValue(true)).toBe('1');
    expect(escapeSqlValue(false)).toBe('0');
  });

  test('数値はそのまま(NaN/Infinityは NULL)', () => {
    expect(escapeSqlValue(42)).toBe('42');
    expect(escapeSqlValue(3.14)).toBe('3.14');
    expect(escapeSqlValue(NaN)).toBe('NULL');
    expect(escapeSqlValue(Infinity)).toBe('NULL');
  });

  test('文字列はシングルクォート囲み', () => {
    expect(escapeSqlValue('hello')).toBe("'hello'");
  });

  test("文字列内のシングルクォートは''にエスケープする(SQLインジェクション対策)", () => {
    expect(escapeSqlValue("O'Brien's data")).toBe("'O''Brien''s data'");
  });

  test('オブジェクト等の想定外の型はJSON文字列化してから囲む(構文を壊さない保険)', () => {
    expect(escapeSqlValue({ a: 1 })).toBe(`'${JSON.stringify({ a: 1 })}'`);
  });
});

describe('buildInsertStatements', () => {
  test('空配列は空配列を返す', () => {
    expect(buildInsertStatements('leads', [])).toEqual([]);
  });

  test('列名は先頭行のキー順で固定し、全行を1つのINSERT文に含める(batchSize以内)', () => {
    const rows = [
      { id: 1, email: 'a@example.com', prefecture: null },
      { id: 2, email: 'b@example.com', prefecture: 'tokyo' },
    ];
    const stmts = buildInsertStatements('leads', rows, 50);
    expect(stmts).toHaveLength(1);
    expect(stmts[0]).toContain('INSERT INTO "leads" ("id", "email", "prefecture") VALUES');
    expect(stmts[0]).toContain("(1, 'a@example.com', NULL)");
    expect(stmts[0]).toContain("(2, 'b@example.com', 'tokyo')");
  });

  test('batchSizeを超える行数は複数のINSERT文に分割する', () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
    const stmts = buildInsertStatements('leads', rows, 2);
    expect(stmts).toHaveLength(3); // 2+2+1
    expect(stmts[0]).toContain('(1)');
    expect(stmts[0]).toContain('(2)');
    expect(stmts[2]).toContain('(5)');
  });
});

describe('buildRestoreSqlFile', () => {
  test('0件の場合は「リストア対象なし」のコメントのみ', () => {
    const sql = buildRestoreSqlFile('leads', []);
    expect(sql).toContain('0件・リストア対象なし');
  });

  test('DELETE文はコメントアウトされている(自動実行されない安全設計)', () => {
    const sql = buildRestoreSqlFile('leads', [{ id: 1 }]);
    expect(sql).toContain('-- DELETE FROM "leads";');
    expect(sql).not.toMatch(/^DELETE FROM/m);
  });

  test('wranglerへの適用コマンドがヘッダコメントに含まれる', () => {
    const sql = buildRestoreSqlFile('leads', [{ id: 1 }]);
    expect(sql).toContain('wrangler d1 execute my-naishin-leads --remote --file=');
  });
});

describe('ZZ-10d 初回リストア演習(合成データによるローカル実証)', () => {
  test('backup-d1.ts形式の合成JSONエクスポート(架空の3件)から、5テーブル分の妥当なリストアSQLが生成できる', () => {
    // 実データは一切使わない(捏造ゼロ・PII非利用)。wrangler --json の形状を模した架空フィクスチャ。
    const syntheticExport = [
      {
        results: [
          { id: 1, email: 'demo1@example.test', prefecture_name: '東京都', created_at: '2026-07-01T00:00:00Z' },
          { id: 2, email: 'demo2@example.test', prefecture_name: null, created_at: '2026-07-02T00:00:00Z' },
          { id: 3, email: "o'brien@example.test", prefecture_name: '大阪府', created_at: '2026-07-03T00:00:00Z' },
        ],
      },
    ];
    const rows = extractRowsFromD1Json(syntheticExport);
    expect(rows).toHaveLength(3);

    const sql = buildRestoreSqlFile('leads', rows);
    // 3件とも取り込まれている
    expect(sql).toContain("'demo1@example.test'");
    expect(sql).toContain("'demo2@example.test'");
    // シングルクォートを含む値が壊れずエスケープされている(構文が壊れない証明)
    expect(sql).toContain("'o''brien@example.test'");
    // NULL値が正しく変換されている
    expect(sql).toContain('NULL');
    // INSERT文の基本構造が妥当
    expect(sql).toMatch(/INSERT INTO "leads" \(.+\) VALUES/);
  });
});
