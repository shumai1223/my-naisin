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

// URLの死活チェック
function checkUrl(url: string): Promise<LinkCheckResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, { 
      method: 'HEAD',
      timeout: 10000, // 10秒タイムアウト
      headers: {
        'User-Agent': 'MyNaishin-LinkMonitor/1.0 (+https://my-naishin.com)'
      }
    }, (res) => {
      resolve({
        url,
        status: res.statusCode && res.statusCode >= 200 && res.statusCode < 400 ? 'ok' : 'error',
        statusCode: res.statusCode,
        checkedAt: new Date().toISOString()
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 'error',
        error: error.message,
        checkedAt: new Date().toISOString()
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'error',
        error: 'Request timeout',
        checkedAt: new Date().toISOString()
      });
    });
    
    req.end();
  });
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
    
    console.log(`\n✅ 監視完了: ${okCount}件正常, ${errorCount}件エラー`);
    
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

export { extractPrefectureLinks, checkUrl };
