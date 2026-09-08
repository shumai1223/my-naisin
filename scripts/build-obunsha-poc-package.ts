#!/usr/bin/env node
/**
 * T-Y11F §5順序#5: 旺文社PoC納品物v0を組み立てる。
 *
 * `src/lib/obunsha-poc-export.ts`の純関数群（jestで件数固定済み）を使い、以下を
 * `ops/deliverables/obunsha-poc-v0/`（非公開ディレクトリ・ページ/APIへの露出なし）へ書き出す:
 *   - r8-full.json / r8-full.csv     : 配布可能な全レコード（licensableRecords）
 *   - r7-r8-diff.json                : R7→R8の学校×学科別倍率差分（T-N1-4エンジンを再利用）
 *   - chiba-sample.json / .csv       : 千葉県のみの抜粋（掛-1・多年度データの見本）
 *   - format-spec.md                 : 列定義・ライセンス範囲・利用条件を1枚にまとめた仕様書
 *
 * 使い方: npx tsx scripts/build-obunsha-poc-package.ts
 *
 * 送信・対外公開は一切行わない（👤が9/23以降に判断）。noindex/sitemap除外の対象は
 * このディレクトリ自体が非公開（Next.jsのpublic/配下でもapp/配下でもない）ため構造的に不要。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFullExportRecords, buildYearOverYearDiff, toCsv } from '../src/lib/obunsha-poc-export';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'ops', 'deliverables', 'obunsha-poc-v0');

function writeFile(name: string, content: string) {
  fs.writeFileSync(path.join(OUT_DIR, name), content, 'utf8');
  console.log(`wrote ${name} (${content.length.toLocaleString('en-US')} bytes)`);
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const fullRecords = buildFullExportRecords();
  const diff = buildYearOverYearDiff();
  const chibaRecords = fullRecords.filter((r) => r.prefectureCode === 'chiba');
  const chibaDiff = diff.filter((e) => e.prefectureCode === 'chiba');
  const generatedAt = new Date().toISOString();

  writeFile(
    'r8-full.json',
    JSON.stringify(
      {
        generatedAt,
        totalRecords: fullRecords.length,
        source: 'my-naishin 学校別入試競争率データセット（配布可能レコードのみ）',
        records: fullRecords,
      },
      null,
      2
    )
  );
  writeFile('r8-full.csv', toCsv(fullRecords));

  writeFile(
    'r7-r8-diff.json',
    JSON.stringify(
      {
        generatedAt,
        totalEntries: diff.length,
        note: '前年度=令和7年度・当年度=令和8年度が両方収録されている学校×学科のみ（掛-1データ）。公表値どうしの単純差分で独自の倍率計算はしない（Y-0）。',
        entries: diff,
      },
      null,
      2
    )
  );

  writeFile(
    'chiba-sample.json',
    JSON.stringify(
      {
        generatedAt,
        note: '千葉型サンプル: 掛-1（学校別×多年度）データの見本として千葉県のみを抜粋。',
        recordCount: chibaRecords.length,
        records: chibaRecords,
        yearOverYearDiff: chibaDiff,
      },
      null,
      2
    )
  );
  writeFile('chiba-sample.csv', toCsv(chibaRecords));

  const prefCount = new Set(fullRecords.map((r) => r.prefectureCode)).size;
  const schoolCount = new Set(fullRecords.map((r) => `${r.prefectureCode}::${r.schoolName}`)).size;
  const diffPrefCount = new Set(diff.map((e) => e.prefectureCode)).size;

  writeFile(
    'format-spec.md',
    `# my-naishin 学校別入試競争率データ 形式仕様（PoC v0）

生成日時: ${generatedAt}

## 収録範囲

- 対象: 公立高等学校 入学者選抜（一般選抜・全日制課程）の学校×学科別 募集人員・最終応募者数・倍率
- 都道府県数: ${prefCount}／47
- レコード数（配布可能分のみ）: ${fullRecords.length.toLocaleString('en-US')}件
- 学校数（延べ・都道府県×学校名の組で重複排除）: ${schoolCount.toLocaleString('en-US')}校
- 出典: 各都道府県教育委員会が公表する一次資料（PDF/xlsx/HTML）。1レコード=1出典を厳守（Y-0憲法）
- 除外: 商用第三者資料のみを唯一の出典とするレコード（\`commercialSourceOnly: true\`）は
  無断再配布を避けるため本パッケージから機械的に除外済み

## ファイル構成

| ファイル | 内容 |
|---|---|
| \`r8-full.json\` / \`.csv\` | 配布可能な全${fullRecords.length.toLocaleString('en-US')}レコード |
| \`r7-r8-diff.json\` | 令和7年度→令和8年度の学校×学科別倍率差分（${diff.length.toLocaleString('en-US')}件・${diffPrefCount}都道府県で両年度収録済み） |
| \`chiba-sample.json\` / \`.csv\` | 千葉県のみの抜粋（多年度データの構造見本） |

## 列定義（r8-full.json / .csv）

| 列名 | 型 | 説明 |
|---|---|---|
| prefectureCode | string | 都道府県コード（例: 'chiba'） |
| prefectureName | string | 都道府県名（例: '千葉県'） |
| schoolName | string | 学校名（公表資料の記載どおり） |
| area | string | 区市町村等のグルーピング単位（資料に無ければ空文字） |
| department | string | 学科名 |
| fiscalYear | string | 年度（例: '令和8年度（2026年度）'） |
| quota | number | 募集人員 |
| finalApplicants | number | 最終応募人員 |
| finalRate | number | 最終応募倍率（公表値をそのまま転記。独自計算はしない） |
| sourceUrl | string | 一次資料のURL（出典が一意に解決できない場合は空文字） |
| docTitle | string | 一次資料のタイトル |
| fetchedAt | string | 取得日 |

## 列定義（r7-r8-diff.json）

| 列名 | 型 | 説明 |
|---|---|---|
| prefectureCode / schoolName / department | string | 対象の特定 |
| previousFiscalYear / currentFiscalYear | string | 比較対象年度 |
| previousRate / currentRate | number | 各年度の最終応募倍率（公表値） |
| rateDelta | number | currentRate − previousRate（符号付き） |
| direction | 'up' \\| 'down' \\| 'unchanged' | 倍率の変動方向 |
| previousSourceUrl / currentSourceUrl | string \\| null | 各年度の一次資料URL |

## 利用条件（案・価格等は👤が別途提示）

- Y-0憲法「公表値のみ」を厳守: 学校別偏差値・ボーダーの独自推定は一切含まない
- 1データ点=1出典: 全レコードがsourceUrl/docTitle/fetchedAtで出典を追跡可能
- 商用第三者資料のみを出典とするレコードは配布対象外（上記「除外」参照）
- 本ファイル自体は非公開ディレクトリで管理し、対外送信・公開URL化は👤の判断を待つ
`
  );

  console.log('\n--- summary ---');
  console.log(`full records: ${fullRecords.length}`);
  console.log(`diff entries: ${diff.length} (${diffPrefCount} prefectures)`);
  console.log(`chiba records: ${chibaRecords.length}, chiba diff: ${chibaDiff.length}`);
}

main();
