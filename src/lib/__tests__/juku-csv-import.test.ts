/**
 * @jest-environment node
 *
 * 塾SaaS MVP(ZZ-4b)のCSV一括取込：決定論バリデーションの契約テスト。
 * パース自体はDB非依存の純関数なので、正常系・異常系を網羅的に固定する。
 */
import { parseCsvLine, parseJukuCsv, importJukuCsvRows } from '../juku-csv-import';

describe('parseCsvLine', () => {
  test('単純なカンマ区切り', () => {
    expect(parseCsvLine('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  test('ダブルクォート囲みの中のカンマは分割しない', () => {
    expect(parseCsvLine('"田中,太郎",tokyo,52')).toEqual(['田中,太郎', 'tokyo', '52']);
  });

  test('エスケープされたダブルクォート("")を1文字の"に戻す', () => {
    expect(parseCsvLine('"say ""hi""",tokyo')).toEqual(['say "hi"', 'tokyo']);
  });

  test('前後の空白をtrimする', () => {
    expect(parseCsvLine(' a , b ,c ')).toEqual(['a', 'b', 'c']);
  });
});

const HEADER = 'display_name,prefecture_code,metric,value,max_value,recorded_at';

describe('parseJukuCsv（ヘッダ検証）', () => {
  test('空文字はheaderError', () => {
    const result = parseJukuCsv('');
    expect(result.headerError).toBeDefined();
    expect(result.rows).toHaveLength(0);
  });

  test('必須列(display_name)が欠けているとheaderError', () => {
    const csv = 'metric,value,recorded_at\nnaishin,52,2026-07-24';
    const result = parseJukuCsv(csv);
    expect(result.headerError).toContain('display_name');
  });

  test('必須列が全て揃っていればheaderErrorは出ない(任意列は無くてもよい)', () => {
    const csv = 'display_name,metric,value,recorded_at\n生徒A,naishin,52,2026-07-24';
    const result = parseJukuCsv(csv);
    expect(result.headerError).toBeUndefined();
    expect(result.validRows).toHaveLength(1);
  });

  test('ヘッダの大文字小文字・前後空白は無視する', () => {
    const csv = ' Display_Name , Metric , Value , Recorded_At \n生徒A,naishin,52,2026-07-24';
    const result = parseJukuCsv(csv);
    expect(result.headerError).toBeUndefined();
  });
});

describe('parseJukuCsv（データ行の決定論バリデーション）', () => {
  test('全て正しい行はvalidRowsに入る', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.validRows).toHaveLength(1);
    expect(result.errorRows).toHaveLength(0);
    expect(result.validRows[0].data).toEqual({
      displayName: '生徒A',
      prefectureCode: 'tokyo',
      metric: 'naishin',
      value: 52,
      maxValue: 65,
      recordedAt: '2026-07-24',
    });
  });

  test('任意列(prefecture_code/max_value)が空でも有効', () => {
    const csv = `${HEADER}\n生徒B,,hensachi,58,,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.validRows).toHaveLength(1);
    expect(result.validRows[0].data?.prefectureCode).toBeUndefined();
    expect(result.validRows[0].data?.maxValue).toBeUndefined();
  });

  test('display_nameが空はエラー行', () => {
    const csv = `${HEADER}\n,tokyo,naishin,52,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('display_name');
  });

  test('未知のprefecture_codeはエラー行', () => {
    const csv = `${HEADER}\n生徒A,narnia,naishin,52,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('prefecture_code');
  });

  test('metricが未知の値はエラー行', () => {
    const csv = `${HEADER}\n生徒A,tokyo,not-a-metric,52,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('metric');
  });

  test('valueが数値でなければエラー行', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,五十二,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('value');
  });

  test('max_valueが数値でなければエラー行(未指定は許容と区別)', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,満点,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('max_value');
  });

  test('recorded_atが不正な形式はエラー行', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026/07/24`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('recorded_at');
  });

  test('存在しない暦日(2月30日)はエラー行', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026-02-30`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('recorded_at');
  });

  test('カラム数が不足している行はエラー行', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin`;
    const result = parseJukuCsv(csv);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].error).toContain('カラム数');
  });

  test('複数行のうち一部だけ不正でも、正しい行は取り込む(1行の不正で全体を止めない)', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026-07-24\n生徒B,tokyo,naishin,不正,65,2026-07-24\n生徒C,osaka,hensachi,60,,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.validRows).toHaveLength(2);
    expect(result.errorRows).toHaveLength(1);
    expect(result.errorRows[0].rowNumber).toBe(3);
  });

  test('rowNumberはヘッダを1行目として2行目から採番する', () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026-07-24`;
    const result = parseJukuCsv(csv);
    expect(result.validRows[0].rowNumber).toBe(2);
  });
});

describe('importJukuCsvRows（D1未バインド環境=jest）', () => {
  test('headerErrorがあればD1に一切触れずheaderErrorを返す', async () => {
    const outcome = await importJukuCsvRows(1, 'metric,value,recorded_at\nnaishin,52,2026-07-24');
    expect(outcome.headerError).toBeDefined();
    expect(outcome.importedCount).toBe(0);
  });

  test('バリデーションエラー行はerrorRowsに残り書込は試みない', async () => {
    const csv = `${HEADER}\n生徒A,tokyo,不正metric,52,65,2026-07-24`;
    const outcome = await importJukuCsvRows(1, csv);
    expect(outcome.errorRows).toHaveLength(1);
    expect(outcome.importedCount).toBe(0);
  });

  test('有効行はD1未バインドのため書込失敗としてwriteFailedRowsに積まれる(例外を投げない)', async () => {
    const csv = `${HEADER}\n生徒A,tokyo,naishin,52,65,2026-07-24`;
    const outcome = await importJukuCsvRows(1, csv);
    expect(outcome.importedCount).toBe(0);
    expect(outcome.writeFailedRows).toHaveLength(1);
  });
});
