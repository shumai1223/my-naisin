import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseXlsxFile } from '../xlsx-parse';

/**
 * xlsx-parse.tsのテスト用に、実物のExcelファイルを使わず最小限のZIPアーカイブを
 * その場で組み立てる（STORED=無圧縮方式・ZIP仕様上有効。テストの独立性のため
 * 外部ファイルに依存しない）。
 */
function buildMinimalXlsx(entries: { name: string; content: string }[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const { name, content } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const dataBuf = Buffer.from(content, 'utf8');

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // method = stored
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(0, 14); // crc32 (unchecked by our reader)
    localHeader.writeUInt32LE(dataBuf.length, 18); // compressed size
    localHeader.writeUInt32LE(dataBuf.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra len

    const localEntry = Buffer.concat([localHeader, nameBuf, dataBuf]);
    localParts.push(localEntry);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4); // version made by
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(0, 8); // flags
    centralHeader.writeUInt16LE(0, 10); // method = stored
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(0, 16); // crc32
    centralHeader.writeUInt32LE(dataBuf.length, 20);
    centralHeader.writeUInt32LE(dataBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30); // extra len
    centralHeader.writeUInt16LE(0, 32); // comment len
    centralHeader.writeUInt16LE(0, 34); // disk number
    centralHeader.writeUInt16LE(0, 36); // internal attrs
    centralHeader.writeUInt32LE(0, 38); // external attrs
    centralHeader.writeUInt32LE(offset, 42); // local header offset

    centralParts.push(Buffer.concat([centralHeader, nameBuf]));
    offset += localEntry.length;
  }

  const localSection = Buffer.concat(localParts);
  const centralSection = Buffer.concat(centralParts);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSection.length, 12);
  eocd.writeUInt32LE(localSection.length, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([localSection, centralSection, eocd]);
}

describe('parseXlsxFile（自前ZIP+xlsxリーダー）', () => {
  let tmpFile: string;

  afterEach(() => {
    if (tmpFile && fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  });

  it('sharedStringsセル・数値セル・複数行を正しく読む', () => {
    const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">
<si><t>東淀川</t></si><si><t>普通科</t></si>
</sst>`;
    const sheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>
<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1"><v>264</v></c></row>
<row r="2"><c r="A2" t="str"><is><t>直接文字列</t></is></c></row>
</sheetData>
</worksheet>`;

    tmpFile = path.join(os.tmpdir(), `xlsx-parse-test-${Date.now()}.xlsx`);
    fs.writeFileSync(
      tmpFile,
      buildMinimalXlsx([
        { name: 'xl/sharedStrings.xml', content: sharedStringsXml },
        { name: 'xl/worksheets/sheet1.xml', content: sheetXml },
      ])
    );

    const wb = parseXlsxFile(tmpFile);
    expect(wb.sheets.sheet1[1]).toEqual(['東淀川', '普通科', 264]);
    expect(wb.sheets.sheet1[2]).toEqual(['直接文字列']);
  });

  it('<rPh>ふりがな注釈は本文に混ざらない（大阪府志願状況xlsxで実際に発生した不具合の再現）', () => {
    const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="1" uniqueCount="1">
<si><t>桜宮</t><rPh sb="0" eb="2"><t>サクラノミヤ</t></rPh><phoneticPr fontId="5"/></si>
</sst>`;
    const sheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>
<row r="1"><c r="A1" t="s"><v>0</v></c></row>
</sheetData>
</worksheet>`;
    tmpFile = path.join(os.tmpdir(), `xlsx-parse-test-ruby-${Date.now()}.xlsx`);
    fs.writeFileSync(
      tmpFile,
      buildMinimalXlsx([
        { name: 'xl/sharedStrings.xml', content: sharedStringsXml },
        { name: 'xl/worksheets/sheet1.xml', content: sheetXml },
      ])
    );

    const wb = parseXlsxFile(tmpFile);
    expect(wb.sheets.sheet1[1]).toEqual(['桜宮']);
  });

  it('sharedStrings.xmlが存在しない（数値のみの）xlsxも読める', () => {
    const sheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>
<row r="1"><c r="A1"><v>42</v></c></row>
</sheetData>
</worksheet>`;
    tmpFile = path.join(os.tmpdir(), `xlsx-parse-test-nostrings-${Date.now()}.xlsx`);
    fs.writeFileSync(tmpFile, buildMinimalXlsx([{ name: 'xl/worksheets/sheet1.xml', content: sheetXml }]));

    const wb = parseXlsxFile(tmpFile);
    expect(wb.sheets.sheet1[1]).toEqual([42]);
  });

  it('自己終端セル(<c .../>)の直後にあるセルの値・列位置を正しく読む（神奈川県公表xlsxで実際に発生した不具合の再現）', () => {
    const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="1" uniqueCount="1">
<si><t>県立鶴見</t></si>
</sst>`;
    // B11・C11が値を持たない自己終端セル、D11がsharedStrings参照のセル、という実物の
    // 神奈川県公表xlsx(令和8年度公立高校合格状況・別紙4)の行構造をそのまま再現する。
    const sheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>
<row r="11"><c r="B11" s="416"/><c r="C11" s="293"/><c r="D11" s="2" t="s"><v>0</v></c><c r="E11" s="294"><v>318</v></c></row>
</sheetData>
</worksheet>`;
    tmpFile = path.join(os.tmpdir(), `xlsx-parse-test-selfclosing-${Date.now()}.xlsx`);
    fs.writeFileSync(
      tmpFile,
      buildMinimalXlsx([
        { name: 'xl/sharedStrings.xml', content: sharedStringsXml },
        { name: 'xl/worksheets/sheet1.xml', content: sheetXml },
      ])
    );

    const wb = parseXlsxFile(tmpFile);
    const row = wb.sheets.sheet1[11];
    // B(index1)・C(index2)は自己終端セルのため値なし、D(index3)がsharedStrings参照の
    // 「県立鶴見」、E(index4)が318であるべき（修正前はB(index1)に333が誤って入り、
    // D自体は取りこぼされていた）。
    expect(row[1]).toBeNull();
    expect(row[2]).toBeNull();
    expect(row[3]).toBe('県立鶴見');
    expect(row[4]).toBe(318);
  });

  it('存在しないファイルパスはエラーを投げる（fsの標準エラーがそのまま伝播）', () => {
    expect(() => parseXlsxFile(path.join(os.tmpdir(), 'does-not-exist-12345.xlsx'))).toThrow();
  });
});
