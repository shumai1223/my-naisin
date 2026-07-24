/**
 * 最小限のRFC4180準拠CSVパーサー（Y-1・政府公開データの取込基盤）。
 *
 * なぜ自前実装か：この時点でプロジェクトにCSVパースライブラリの直接依存が無く、
 * loop運転中は`npm install`による依存追加が禁止（[[fable5-loop-protocol]]）のため、
 * 文科省の学校コード一覧のような「ダブルクォートで囲まれた項目内に改行・カンマを含む」
 * 実データを正しく読むための最小実装をここに置く。単純な`split(',')`では
 * 引用符内の改行・カンマを誤って別行・別列に割ってしまう（実際にヘッダー行や
 * 一部の異動履歴セルで発生することを2026-07-24の実データ調査で確認済み）。
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  const pushField = () => {
    row.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      pushField();
      i += 1;
      continue;
    }
    if (ch === '\r') {
      // \r\n または \r 単独どちらも改行として扱う（\nは次のifで処理）
      if (text[i + 1] === '\n') i += 1;
      pushRow();
      i += 1;
      continue;
    }
    if (ch === '\n') {
      pushRow();
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  // 末尾に改行が無い最終行を回収（空文字だけの残骸は捨てる）
  if (field.length > 0 || row.length > 0) pushRow();

  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}
