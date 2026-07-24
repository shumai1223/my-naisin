#!/usr/bin/env node

/**
 * リンク切れ監視スクリプト
 * 一次情報リンク（都道府県教育委員会等）の死活監視を自動化
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

interface LinkCheckResult {
  url: string;
  status: 'ok' | 'error';
  statusCode?: number;
  error?: string;
  /** 到達はしているが通常でない応答（bot弾き・一時障害等）。status='ok'のまま参考情報として残す。 */
  warn?: string;
  checkedAt: string;
}

interface PrefectureLink {
  prefecture: string;
  code: string;
  url: string;
  title: string;
}

// 都道府県データから一次情報リンクを抽出
function extractPrefectureLinks(): PrefectureLink[] {
  const prefecturesPath = path.join(process.cwd(), 'src', 'lib', 'prefectures.ts');
  const content = fs.readFileSync(prefecturesPath, 'utf-8');
  
  const links: PrefectureLink[] = [];
  
  // 都道府県データをパース（簡易的な正規表現ベース）
  const prefectureBlocks = content.split(/\s*{\s*code:\s*['"]/);
  
  for (let i = 1; i < prefectureBlocks.length; i++) {
    const block = prefectureBlocks[i];
    const codeMatch = block.match(/^([^'"]+)/);
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const urlMatch = block.match(/sourceUrl:\s*['"]([^'"]+)['"]/);
    const titleMatch = block.match(/sourceTitle:\s*['"]([^'"]+)['"]/);
    
    if (codeMatch && nameMatch && urlMatch && titleMatch) {
      links.push({
        prefecture: nameMatch[1],
        code: codeMatch[1],
        url: urlMatch[1],
        title: titleMatch[1]
      });
    }
  }
  
  return links;
}

/** DNS不明・接続拒否など「本当に到達不能」を示すエラーメッセージか判定する。 */
function isUnreachableError(message: string): boolean {
  return /ENOTFOUND|getaddrinfo|ECONNREFUSED|ERR_NAME_NOT_RESOLVED/i.test(message);
}

/** 単発リクエストのステータスコードを取得（例外はrejectで返す）。 */
function requestStatus(url: string, method: 'HEAD' | 'GET'): Promise<number> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.request(
      url,
      {
        method,
        timeout: 10000, // 10秒タイムアウト
        headers: { 'User-Agent': 'MyNaishin-LinkMonitor/1.0 (+https://my-naishin.com)' },
      },
      (res) => {
        resolve(res.statusCode ?? 0);
      }
    );
    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

/**
 * URLの死活チェック。
 * 「壊れ」とみなすのは404/410（消滅）とDNS/接続不能だけ（scripts/check-source-links.mjsと同一方針）。
 * 403/405/429/5xx・タイムアウトは「bot弾き／HEAD非対応／一時障害」で到達自体はしているので警告に
 * 留める（教育委員会等の公的サイトはHEAD拒否・bot拒否・低速が多く、それを毎日errorにすると
 * 偽陽性でGitHub issueが乱発するため）。
 */
async function checkUrl(url: string): Promise<LinkCheckResult> {
  const checkedAt = new Date().toISOString();
  try {
    let status: number;
    try {
      status = await requestStatus(url, 'HEAD');
      if (status === 403 || status === 405 || status === 429 || status >= 500) {
        status = await requestStatus(url, 'GET');
      }
    } catch {
      status = await requestStatus(url, 'GET');
    }
    if (status === 404 || status === 410) {
      return { url, status: 'error', statusCode: status, error: `HTTP ${status}`, checkedAt };
    }
    if (status >= 400) {
      return {
        url,
        status: 'ok',
        statusCode: status,
        warn: `HTTP ${status}（bot弾き/一時障害の可能性・到達はしている）`,
        checkedAt,
      };
    }
    return { url, status: 'ok', statusCode: status, checkedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (isUnreachableError(message)) {
      return { url, status: 'error', error: message, checkedAt };
    }
    return { url, status: 'ok', warn: `到達確認できず（${message}）`, checkedAt };
  }
}

// メイン処理
async function main() {
  console.log('🔍 一次情報リンク監視を開始します...');
  
  try {
    // 都道府県リンクを抽出
    const links = extractPrefectureLinks();
    console.log(`📋 ${links.length}件のリンクを検出しました`);
    
    // リンクチェックを並列実行
    const results: LinkCheckResult[] = [];
    const batchSize = 5; // 同時にチェックする数
    
    for (let i = 0; i < links.length; i += batchSize) {
      const batch = links.slice(i, i + batchSize);
      console.log(`🔄 チェック中... ${Math.min(i + batchSize, links.length)}/${links.length}`);
      
      const batchResults = await Promise.all(
        batch.map(link => checkUrl(link.url))
      );
      
      results.push(...batchResults);
      
      // レートリミット回避のための待機
      if (i + batchSize < links.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 結果の集計
    const okCount = results.filter(r => r.status === 'ok').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const warnCount = results.filter(r => r.status === 'ok' && r.warn).length;

    console.log(`\n✅ 監視完了: ${okCount}件正常, ${errorCount}件エラー（うち${warnCount}件は到達済みだが応答が通常でない警告）`);

    if (warnCount > 0) {
      console.log('\n⚠ 到達は確認できたが応答が通常でないURL（CIは落としません）:');
      results
        .filter(r => r.status === 'ok' && r.warn)
        .forEach(result => {
          const link = links.find(l => l.url === result.url);
          console.log(`  ${link?.prefecture} (${link?.code}): ${result.url} — ${result.warn}`);
        });
    }

    // エラーがある場合は詳細を表示
    if (errorCount > 0) {
      console.log('\n❌ エラー詳細:');
      results
        .filter(r => r.status === 'error')
        .forEach(result => {
          const link = links.find(l => l.url === result.url);
          console.log(`  ${link?.prefecture} (${link?.code}): ${result.url}`);
          console.log(`    状態: ${result.statusCode || 'N/A'}`);
          console.log(`    エラー: ${result.error || 'Unknown'}`);
          console.log(`    時刻: ${result.checkedAt}`);
          console.log('');
        });
    }
    
    // 結果をJSONファイルに保存
    const reportPath = path.join(process.cwd(), 'link-monitor-report.json');
    const report = {
      checkedAt: new Date().toISOString(),
      summary: {
        total: results.length,
        ok: okCount,
        error: errorCount
      },
      results: results.map(result => {
        const link = links.find(l => l.url === result.url);
        return {
          ...result,
          prefecture: link?.prefecture,
          code: link?.code,
          title: link?.title
        };
      })
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 レポートを保存: ${reportPath}`);
    
    // GitHub Actions用の出力
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::set-output name=error_count::${errorCount}`);
      if (errorCount > 0) {
        console.log(`::warning::リンク切れが${errorCount}件検出されました`);
      }
    }
    
    // エラーがある場合は終了コード1で終了
    if (errorCount > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 監視中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

export { extractPrefectureLinks, checkUrl, isUnreachableError };
