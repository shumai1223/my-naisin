/**
 * 最小限のxlsx（Excel）読み取り（Y-2・政府公開データの取込基盤・csv-parse.tsの姉妹モジュール）。
 *
 * なぜ自前実装か：xlsxパースライブラリの直接依存がプロジェクトに無く、loop運転中は
 * `npm install`による依存追加が禁止されているため。xlsxファイルの実体はZIPアーカイブで、
 * シート内容は`xl/worksheets/sheetN.xml`、テキストは`xl/sharedStrings.xml`にプレーンな
 * XMLとして格納されている（画像やPDFのビジョン解析と違い、文字を機械が直接読むため
 * OCR誤読が原理的に起こらない）。Node標準の`zlib`（DEFLATE展開）だけでZIPの
 * central directory・ローカルファイルヘッダを手書きパースし、xlsxを読む。
 *
 * 実例（2026-07-24・大阪府Y-2）: 同じ公表資料のPDF版をRead toolのビジョン解析で転記した
 * 際に「1校まるごと転記漏れ」「志願者数の取り違え」「募集人員の誤読」という3件の実害ある
 * 誤りが発生し、一旦commitせず撤退した。xlsx版に切り替えて本モジュールで読み直したところ
 * 全165レコード・6表すべてが公式合計と1件の誤差もなく一致した。**表形式の政府公開データは
 * xlsx版が存在する限り、PDFのビジョン解析より優先してこちらを使うこと**。
 */
import fs from 'node:fs';
import zlib from 'node:zlib';

interface ZipEntry {
  name: string;
  compMethod: number;
  compSize: number;
  localHeaderOffset: number;
}

const EOCD_SIG = 0x06054b50;
const CENTRAL_DIR_SIG = 0x02014b50;
const LOCAL_HEADER_SIG = 0x04034b50;

/** ZIPアーカイブ（xlsxファイル本体）からエントリ一覧を読み取る。 */
function readZipEntries(buf: Buffer): ZipEntry[] {
  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) throw new Error('xlsx-parse: ZIP End Of Central Directory record not found（壊れたファイルの可能性）');

  const cdEntries = buf.readUInt16LE(eocdOffset + 10);
  const cdOffset = buf.readUInt32LE(eocdOffset + 16);

  const entries: ZipEntry[] = [];
  let p = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (buf.readUInt32LE(p) !== CENTRAL_DIR_SIG) {
      throw new Error(`xlsx-parse: 不正なcentral directory署名（offset ${p}）`);
    }
    const compMethod = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localHeaderOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    entries.push({ name, compMethod, compSize, localHeaderOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

/** 指定エントリの展開済みバイト列を返す（method 0=無圧縮／8=DEFLATE のみ対応）。 */
function extractZipEntry(buf: Buffer, entries: ZipEntry[], name: string): Buffer {
  const entry = entries.find((e) => e.name === name);
  if (!entry) throw new Error(`xlsx-parse: ZIP内にファイルが見つかりません: ${name}`);
  const lp = entry.localHeaderOffset;
  if (buf.readUInt32LE(lp) !== LOCAL_HEADER_SIG) throw new Error(`xlsx-parse: 不正なlocal file header署名（${name}）`);
  const nameLen = buf.readUInt16LE(lp + 26);
  const extraLen = buf.readUInt16LE(lp + 28);
  const dataStart = lp + 30 + nameLen + extraLen;
  const raw = buf.subarray(dataStart, dataStart + entry.compSize);
  if (entry.compMethod === 0) return Buffer.from(raw);
  if (entry.compMethod === 8) return zlib.inflateRawSync(raw);
  throw new Error(`xlsx-parse: 未対応の圧縮方式 method=${entry.compMethod}（${name}）`);
}

function decodeXmlEntities(s: string): string {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

/** xl/sharedStrings.xml をパースし、インデックス配列として返す（<si>内の<t>群を連結）。 */
function parseSharedStrings(xml: string): string[] {
  const siRegex = /<si[^>]*>([\s\S]*?)<\/si>/g;
  const tRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
  const result: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = siRegex.exec(xml))) {
    let text = '';
    let tm: RegExpExecArray | null;
    tRegex.lastIndex = 0;
    while ((tm = tRegex.exec(m[1]))) text += tm[1];
    result.push(decodeXmlEntities(text));
  }
  return result;
}

/** 'A'→0, 'B'→1, ... 'AA'→26 のように列アルファベットを0始まりindexへ変換。 */
function columnLetterToIndex(col: string): number {
  let idx = 0;
  for (const ch of col) idx = idx * 26 + (ch.charCodeAt(0) - 64);
  return idx - 1;
}

export type XlsxCell = string | number | null;

export interface ParsedXlsxWorkbook {
  /** シート名（xl/worksheets/sheetN.xml）→ 2次元配列（行番号1始まり）。 */
  sheets: Record<string, XlsxCell[][]>;
}

/**
 * xlsxファイルを読み、全シートを2次元配列として返す唯一の公開関数。
 * 使い方: `const wb = parseXlsxFile('foo.xlsx'); const rows = wb.sheets['sheet1'];`
 */
export function parseXlsxFile(filePath: string): ParsedXlsxWorkbook {
  const buf = fs.readFileSync(filePath);
  const entries = readZipEntries(buf);
  const hasSharedStrings = entries.some((e) => e.name === 'xl/sharedStrings.xml');
  const sharedStrings = hasSharedStrings ? parseSharedStrings(extractZipEntry(buf, entries, 'xl/sharedStrings.xml').toString('utf8')) : [];

  const sheets: Record<string, XlsxCell[][]> = {};
  for (const entry of entries) {
    const m = /^xl\/worksheets\/(sheet\d+)\.xml$/.exec(entry.name);
    if (!m) continue;
    const xml = extractZipEntry(buf, entries, entry.name).toString('utf8');
    sheets[m[1]] = parseSheetRows(xml, sharedStrings);
  }
  return { sheets };
}

/** parseSheetXmlの実装本体（セルのt属性・v値を正しく解釈する版）。 */
function parseSheetRows(xml: string, sharedStrings: string[]): XlsxCell[][] {
  const rowRegex = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  const cellRegex = /<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g;
  const typeRegex = /\st="([^"]+)"/;
  const valueRegex = /<v>([\s\S]*?)<\/v>/;
  const inlineStrRegex = /<is>([\s\S]*?)<\/is>/;

  const rows: XlsxCell[][] = [];
  let rm: RegExpExecArray | null;
  while ((rm = rowRegex.exec(xml))) {
    const rowNum = parseInt(rm[1], 10);
    const rowXml = rm[2];
    const rowData: XlsxCell[] = [];
    let cm: RegExpExecArray | null;
    cellRegex.lastIndex = 0;
    while ((cm = cellRegex.exec(rowXml))) {
      const colIdx = columnLetterToIndex(cm[1]);
      const attrs = cm[2];
      const inner = cm[3];
      const typeMatch = typeRegex.exec(attrs);
      const type = typeMatch ? typeMatch[1] : 'n';

      if (type === 's') {
        const vMatch = valueRegex.exec(inner);
        rowData[colIdx] = vMatch ? (sharedStrings[parseInt(vMatch[1], 10)] ?? null) : null;
      } else if (type === 'str') {
        const isMatch = inlineStrRegex.exec(inner);
        rowData[colIdx] = isMatch ? decodeXmlEntities(isMatch[1].replace(/<[^>]+>/g, '')) : null;
      } else {
        const vMatch = valueRegex.exec(inner);
        rowData[colIdx] = vMatch ? Number(vMatch[1]) : null;
      }
    }
    rows[rowNum] = rowData;
  }
  return rows;
}
