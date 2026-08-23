#!/usr/bin/env node
/**
 * Y-1/Λ-5 学校マスター基盤: 文科省「学校コード一覧」CSVを取り込み、公立（Y-1）・私立（Λ-5）
 * それぞれの県別チャンク（`src/data/schools/{code}.ts` / `src/data/schools-private/{code}.ts`）
 * + 集約indexを1回のCSV取得から生成する。
 *
 * 一次ソース: https://www.mext.go.jp/b_menu/toukei/mext_01087.html
 *   東日本CSV: https://www.mext.go.jp/content/20260529-mxt_chousa01-000011635_2.csv
 *   西日本CSV: https://www.mext.go.jp/content/20260529-mxt_chousa01-000011635_4.csv
 *   （令和8年5月29日公表・令和8年5月1日時点の暫定版。文字コードはShift_JIS）
 *
 * 使い方:
 *   npx tsx scripts/build-school-master.ts                # MEXTへ直接fetch（CI向け）
 *   npx tsx scripts/build-school-master.ts --east <path> --west <path>
 *       # ローカルにキャッシュ済みのCSVファイルを使う（社内ネットワークのTLS傍受等でfetchが
 *       # 通らない環境向け。事前に `curl --ssl-no-revoke -o east.csv <URL>` 等で取得しておく）
 *
 * Y-0憲法を機械的に担保する設計:
 *   ①公表値のみ＝生CSVの列をそのまま転記するのみ（独自推定を挟まない）
 *   ②1データ点=1出典＝チャンクファイル単位でsource（URL・公表日・取得日）を持つ
 *      （全行に同一文字列を反復するとバンドルが無駄に膨らむため、ファイルレベルで代表させる。
 *       全レコードが同一の一次資料に由来するため、この粒度で出典の追跡可能性は損なわれない）
 *   ③機械可読不能は正直にスキップ＝列数が合わない行はparseMextRowがnullを返し自動除外
 *   ④現存校のみ＝公立(Y-1)はisPublicActiveHighSchool・私立(Λ-5)はisPrivateActiveHighSchoolで
 *     フィルタ（本ファイルが生成するのは学校コード・名称・住所のみ。私立校の定員・偏差値等の
 *     募集要項データはΛ-5の別タスクとして学校ごとに個別収集し、この一覧はその参照台帳となる）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCsv } from '../src/lib/csv-parse';
import {
  parseMextRow,
  isPublicActiveHighSchool,
  isPrivateActiveHighSchool,
  extractPrefectureNumber,
  buildPrefectureNumberMap,
  toSchoolRecord,
  type SchoolRecord,
  type RawMextRow,
} from '../src/lib/school-master';
import { PREFECTURES } from '../src/lib/prefectures';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'schools');
const OUT_DIR_PRIVATE = path.join(ROOT, 'src', 'data', 'schools-private');

const EAST_URL = 'https://www.mext.go.jp/content/20260529-mxt_chousa01-000011635_2.csv';
const WEST_URL = 'https://www.mext.go.jp/content/20260529-mxt_chousa01-000011635_4.csv';
const DOC_TITLE = '文部科学省 学校コード一覧（高等学校等・東日本/西日本）';
const EDITION = '令和8年5月29日公表（令和8年5月1日時点・暫定版）';

function parseArgs(argv: string[]) {
  const a: { east?: string; west?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--east') { a.east = argv[i + 1]; i++; }
    if (argv[i] === '--west') { a.west = argv[i + 1]; i++; }
  }
  return a;
}

async function loadCsvText(url: string, localPath?: string): Promise<string> {
  if (localPath) {
    const buf = fs.readFileSync(localPath);
    return new TextDecoder('shift_jis').decode(buf);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  return new TextDecoder('shift_jis').decode(buf);
}

/**
 * east/west行データからフィルタ条件(公立/私立)に合うレコードを都道府県別チャンクに書き出す
 * （公立=Y-1、私立=Λ-5で共通の生成ロジック。設置区分の絞り込みだけが異なる）。
 */
function buildMaster(
  eastRows: string[][],
  westRows: string[][],
  fetchedAt: string,
  filterFn: (row: RawMextRow) => boolean,
  outDir: string,
  varPrefix: string,
  ownerLabel: string,
  exportPrefix: string
): { total: number; emptyPrefectures: string[] } {
  const prefNumberMap = buildPrefectureNumberMap(PREFECTURES.map((p) => p.code));

  type Bucket = { code: string; sourceUrl: string; records: SchoolRecord[] };
  const buckets = new Map<string, Bucket>();
  for (const p of PREFECTURES) buckets.set(p.code, { code: p.code, sourceUrl: '', records: [] });

  let skippedMalformed = 0;
  let skippedUnmappedPref = 0;

  function ingest(rows: string[][], sourceUrl: string) {
    for (const cols of rows) {
      const row = parseMextRow(cols);
      if (!row) {
        // ヘッダ行(列数不一致)・注記行等。学校コード列が数字で始まらない行は元々データ行でないため無視。
        if (/^[A-Z0-9]{10,}/.test(cols[0] ?? '')) skippedMalformed++;
        continue;
      }
      if (!filterFn(row)) continue;

      const prefNum = extractPrefectureNumber(row.prefectureNumberField);
      const prefCode = prefNum ? prefNumberMap[prefNum] : undefined;
      if (!prefCode) {
        skippedUnmappedPref++;
        continue;
      }

      const bucket = buckets.get(prefCode)!;
      bucket.sourceUrl = sourceUrl;
      bucket.records.push(toSchoolRecord(row));
    }
  }

  ingest(eastRows, EAST_URL);
  ingest(westRows, WEST_URL);

  if (skippedMalformed > 0) console.log(`⚠️ [${ownerLabel}] 列数不整合でスキップした行: ${skippedMalformed}件`);
  if (skippedUnmappedPref > 0) console.log(`⚠️ [${ownerLabel}] 都道府県番号を対応付けできずスキップした行: ${skippedUnmappedPref}件`);

  fs.mkdirSync(outDir, { recursive: true });

  let total = 0;
  const indexLines: string[] = [];
  indexLines.push('/**');
  indexLines.push(` * ${ownerLabel}: 47都道府県分のチャンクを集約するindex（生成物・手編集禁止）。`);
  indexLines.push(' * 生成: scripts/build-school-master.ts。再生成すると内容は上書きされる。');
  indexLines.push(' */');
  indexLines.push("import type { SchoolMasterFile } from '@/lib/school-master';");
  indexLines.push('');

  const emptyPrefectures: string[] = [];
  const prefNumberByCode = new Map(PREFECTURES.map((p, i) => [p.code, i + 1]));

  for (const p of PREFECTURES) {
    const bucket = buckets.get(p.code)!;
    total += bucket.records.length;
    if (bucket.records.length === 0) emptyPrefectures.push(p.code);

    // 通常はingest()内でヒットしたファイルのURLが入る。0件だった県のみ、
    // 東日本/西日本の区切り(愛知=23までが東・滋賀=25からが西)で機械的に補う。
    const sourceUrl = bucket.sourceUrl || ((prefNumberByCode.get(p.code) ?? 0) <= 24 ? EAST_URL : WEST_URL);

    const varName = `${varPrefix}_${p.code.toUpperCase().replace(/-/g, '_')}`;
    const fileContent = `/**
 * ${p.name}の${ownerLabel}（生成物・手編集禁止）。
 * 一次ソース: ${DOC_TITLE}
 * ${EDITION}
 * 取得日: ${fetchedAt}
 * 生成: scripts/build-school-master.ts（再生成すると上書きされる）
 */
import type { SchoolMasterFile } from '@/lib/school-master';

export const ${varName}: SchoolMasterFile = ${JSON.stringify(
      {
        prefectureCode: p.code,
        source: {
          url: sourceUrl,
          docTitle: DOC_TITLE,
          edition: EDITION,
          fetchedAt,
        },
        schools: bucket.records,
      },
      null,
      2
    )};
`;
    fs.writeFileSync(path.join(outDir, `${p.code}.ts`), fileContent, 'utf8');

    indexLines.push(`import { ${varName} } from './${p.code}';`);
  }

  indexLines.push('');
  indexLines.push(`export const ${exportPrefix}_BY_PREFECTURE: Record<string, SchoolMasterFile> = {`);
  for (const p of PREFECTURES) {
    const varName = `${varPrefix}_${p.code.toUpperCase().replace(/-/g, '_')}`;
    indexLines.push(`  ${p.code}: ${varName},`);
  }
  indexLines.push('};');
  indexLines.push('');
  indexLines.push(`export const ${exportPrefix}_FILES: SchoolMasterFile[] = Object.values(${exportPrefix}_BY_PREFECTURE);`);
  indexLines.push('');

  fs.writeFileSync(path.join(outDir, 'index.ts'), indexLines.join('\n'), 'utf8');

  return { total, emptyPrefectures };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fetchedAt = new Date().toISOString().slice(0, 10);

  console.log('CSVを読み込み中...');
  const [eastText, westText] = await Promise.all([
    loadCsvText(EAST_URL, args.east),
    loadCsvText(WEST_URL, args.west),
  ]);

  const eastRows = parseCsv(eastText);
  const westRows = parseCsv(westText);
  console.log(`east行数(ヘッダ込み): ${eastRows.length} / west行数: ${westRows.length}`);

  const pub = buildMaster(
    eastRows,
    westRows,
    fetchedAt,
    isPublicActiveHighSchool,
    OUT_DIR,
    'SCHOOLS',
    'Y-1 公立高等学校マスター',
    'SCHOOL_MASTER'
  );
  console.log(`\n✅ 公立: 47都道府県・合計${pub.total}校を書き出しました（${OUT_DIR}）`);
  if (pub.emptyPrefectures.length > 0) {
    console.log(`⚠️ 0件だった都道府県(公立): ${pub.emptyPrefectures.join(', ')}（要確認・本来は全県1校以上あるはず）`);
  }

  const priv = buildMaster(
    eastRows,
    westRows,
    fetchedAt,
    isPrivateActiveHighSchool,
    OUT_DIR_PRIVATE,
    'SCHOOLS_PRIVATE',
    'Λ-5 私立高等学校マスター',
    'PRIVATE_SCHOOL_MASTER'
  );
  console.log(`\n✅ 私立: 47都道府県・合計${priv.total}校を書き出しました（${OUT_DIR_PRIVATE}）`);
  if (priv.emptyPrefectures.length > 0) {
    console.log(`⚠️ 0件だった都道府県(私立): ${priv.emptyPrefectures.join(', ')}（私立高校が存在しない県もあり得るため必ずしも異常ではない）`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
