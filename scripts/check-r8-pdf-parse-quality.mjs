#!/usr/bin/env node
/**
 * T-Y11B 段階2-a: 47都道府県のR8(令和8年度)公表PDFに対し、pdftotextでの機械抽出可否を判定する。
 *
 * ⚠️2026-09-02判明の重大な罠: pdftotextはデフォルトでは出力エンコーディングがUTF-8ではないため、
 * `-enc UTF-8` を明示しないと日本語（学校名・学科名）が全て空白として出力される
 * （数字は影響を受けないため一見「数字のみ抽出できている＝ToUnicodeマッピング欠落」に見える）。
 * この罠により2026-09-01の着手前ゲートは「8県年中6県年(75%)が要ビジョン解析」と誤診断していたが、
 * `-enc UTF-8` を付けて同じPDFを再検証したところ、ibaraki(R5-R8)/nagano(R7-R8)/kagoshima(R7-R8)の
 * 8県年すべてが実際は機械抽出可能だった（2026-09-02再検証で確認）。
 * **このスクリプトは必ず `-enc UTF-8` を付けて呼び出すこと。**
 *
 * 使い方: node scripts/check-r8-pdf-parse-quality.mjs [出力先ディレクトリ]
 * 47県のsources[]から令和8年度（または最新年度）のPDF URLを抽出し、1件ずつ取得(間隔900ms・
 * カスタムUA)してpdftotext -layout -enc UTF-8で抽出、assessPdfTextExtraction相当のロジックで
 * 判定してJSON台帳を書き出す。xlsx形式（osaka）やrobots.txt遵守で対象外とする県は個別に除外する。
 * 相手サーバへの配慮: 1県1リクエスト・間隔900ms以上・UAを名乗る。
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = process.argv[2] ?? path.join(REPO_ROOT, 'ops', 'baselines', 'r8-pdf-cache');

// robots.txt等の理由で自動再取得を見送る県（既存記録から判定を補う）。
const SKIP_FETCH = {
  hyogo: 'robots.txt遵守のため再取得スキップ(www2.hyogo-c.ed.jp)。R5-R7は2026-09-02に-enc UTF-8で' +
    '再検証済みで機械抽出可能と判明したため、R8も同型の可能性が高いが未確認のまま',
};
// PDF以外の形式で配布されている県（pdftotextの対象外）。
const NON_PDF = {
  osaka: 'xlsx形式のためpdftotext対象外',
};
// sources[]のURLがハブページ等で実PDFパスがdocTitleにしか無い県の補正。
const URL_OVERRIDE = {
  fukuoka: 'https://www.pref.fukuoka.lg.jp/uploaded/life/806459_62802786_misc.pdf',
};

const CJK_RE = /[一-鿿぀-ゟ゠-ヿ]/g;
const NUMERIC_RUN_RE = /\d{3,}/g;

function assessPdfTextExtraction(rawText) {
  const cjkCharCount = (rawText.match(CJK_RE) ?? []).length;
  const numericRunCount = (rawText.match(NUMERIC_RUN_RE) ?? []).length;
  if (numericRunCount < 5) {
    return { quality: 'inconclusive', cjkCharCount, numericRunCount };
  }
  const cjkRatio = cjkCharCount / numericRunCount;
  if (cjkRatio < 0.3) {
    return { quality: 'needs-vision-fallback', cjkCharCount, numericRunCount, cjkRatio: Number(cjkRatio.toFixed(3)) };
  }
  return { quality: 'usable', cjkCharCount, numericRunCount, cjkRatio: Number(cjkRatio.toFixed(3)) };
}

function extractLatestSourceUrl(fileText) {
  const sourcesMatch = fileText.match(/sources:\s*\[([\s\S]*?)\n  \],/);
  if (!sourcesMatch) return null;
  const entries = sourcesMatch[1].split(/\{\s*\n/).slice(1);
  for (const e of entries) {
    if (e.includes('令和8年度')) {
      const m = e.match(/url:\s*'([^']+)'/);
      if (m) return m[1];
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const dataDir = path.join(REPO_ROOT, 'src', 'data', 'competition-rates');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

  const results = [];
  for (const f of files) {
    const pref = f.replace('.ts', '');
    if (NON_PDF[pref]) {
      results.push({ pref, quality: 'non-pdf', note: NON_PDF[pref] });
      continue;
    }
    if (SKIP_FETCH[pref]) {
      results.push({ pref, quality: 'skipped', note: SKIP_FETCH[pref] });
      continue;
    }
    const fileText = fs.readFileSync(path.join(dataDir, f), 'utf8');
    const url = URL_OVERRIDE[pref] ?? extractLatestSourceUrl(fileText);
    if (!url) {
      results.push({ pref, quality: 'no-source-url', note: '令和8年度のsourceUrlが見つからない' });
      continue;
    }
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyNaishinResearchBot/1.0; +https://my-naishin.com/about)' },
        redirect: 'follow',
      });
      if (!res.ok) {
        results.push({ pref, url, quality: 'fetch-error', note: `HTTP ${res.status}` });
        await sleep(900);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const pdfPath = path.join(OUT_DIR, `${pref}.pdf`);
      const txtPath = path.join(OUT_DIR, `${pref}.txt`);
      fs.writeFileSync(pdfPath, buf);
      execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, txtPath], { stdio: 'pipe' });
      const text = fs.readFileSync(txtPath, 'utf8');
      const assessment = assessPdfTextExtraction(text);
      results.push({ pref, url, bytes: buf.length, ...assessment });
    } catch (e) {
      results.push({ pref, url, quality: 'error', note: String(e?.message ?? e) });
    }
    await sleep(900);
  }

  const outFile = path.join(REPO_ROOT, 'ops', 'baselines', `r8-pdf-parse-quality-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`書き出し: ${outFile}`);
  for (const r of results) {
    console.log(r.pref, r.quality, r.cjkCharCount ?? '', r.numericRunCount ?? '', r.note ?? '');
  }
}

main();
