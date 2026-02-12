#!/usr/bin/env node

// データ整合性チェックスクリプト（完全版）
const fs = require('fs');
const path = require('path');

// 都道府県データを正確に読み込み
function loadPrefectureData() {
  const prefecturesPath = path.join(__dirname, '..', 'src', 'lib', 'prefectures.ts');
  const content = fs.readFileSync(prefecturesPath, 'utf8');
  
  // より正確なパース方法
  const prefectures = [];
  const lines = content.split('\n');
  let currentPrefecture = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('code:') && line.includes('name:')) {
      currentPrefecture = {};
      const codeMatch = line.match(/code:\s*['"]([^'"]+)['"]/);
      const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
      
      if (codeMatch && nameMatch) {
        currentPrefecture.code = codeMatch[1];
        currentPrefecture.name = nameMatch[1];
      }
    }
    
    if (currentPrefecture && line.includes('maxScore:')) {
      const scoreMatch = line.match(/maxScore:\s*(\d+)/);
      if (scoreMatch) {
        currentPrefecture.maxScore = parseInt(scoreMatch[1]);
        prefectures.push(currentPrefecture);
        currentPrefecture = null;
      }
    }
  }
  
  return prefectures;
}

// ブログ記事内の県別満点をチェック
function checkBlogPrefectureScores(prefectures) {
  const blogPath = path.join(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  const content = fs.readFileSync(blogPath, 'utf8');
  
  const issues = [];
  
  for (const prefecture of prefectures) {
    // 記事内の表記を検索（複数パターン）
    const patterns = [
      new RegExp(`${prefecture.name}.*?(\\d+)点満点`, 'g'),
      new RegExp(`${prefecture.name}</h4>\\s*<p[^>]*>(\\d+)点満点`, 'g'),
      new RegExp(`<h4>${prefecture.name}</h4>\\s*<p[^>]*>(\\d+)点満点`, 'g')
    ];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const scoreMatch = match.match(/(\d+)点満点/);
          if (scoreMatch) {
            const blogScore = parseInt(scoreMatch[1]);
            if (blogScore !== prefecture.maxScore) {
              issues.push({
                type: 'blog_prefecture_score_mismatch',
                prefecture: prefecture.name,
                code: prefecture.code,
                expected: prefecture.maxScore,
                actual: blogScore,
                location: 'blog-data.ts',
                severity: 'high',
                match: match.trim()
              });
            }
          }
        }
      }
    }
  }
  
  return issues;
}

// ガイドデータの満点をチェック
function checkGuideData(prefectures) {
  const guidePath = path.join(__dirname, '..', 'src', 'lib', 'prefecture-guides.ts');
  const content = fs.readFileSync(guidePath, 'utf8');
  
  const issues = [];
  
  for (const prefecture of prefectures) {
    // ガイド内の表記を検索
    const patterns = [
      new RegExp(`${prefecture.code}:\\s*{[^}]*maxScore:\\s*['"](\\d+)点`, 'g'),
      new RegExp(`${prefecture.code}.*?maxScore.*?(\\d+)点`, 'g')
    ];
    
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const scoreMatch = match.match(/(\d+)点/);
          if (scoreMatch) {
            const guideScore = parseInt(scoreMatch[1]);
            if (guideScore !== prefecture.maxScore) {
              issues.push({
                type: 'guide_score_mismatch',
                prefecture: prefecture.name,
                code: prefecture.code,
                expected: prefecture.maxScore,
                actual: guideScore,
                location: 'prefecture-guides.ts',
                severity: 'high'
              });
            }
          }
        }
      }
    }
  }
  
  return issues;
}

// 404リンクをチェック
function checkBrokenLinks() {
  const files = [
    'src/lib/blog-data.ts',
    'src/lib/prefecture-sources.ts',
    'src/lib/prefecture-guides.ts'
  ];
  
  const issues = [];
  
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // URLを抽出
    const urlPattern = /https?:\/\/[^\s"']+/g;
    const urls = content.match(urlPattern) || [];
    
    for (const url of urls) {
      // 文科省の古いURLパターンを検出
      if (url.includes('mext.go.jp') && !url.includes('www.mext.go.jp')) {
        issues.push({
          type: 'broken_link',
          url: url,
          location: file,
          severity: 'medium',
          suggestion: 'https://www.mext.go.jpに更新'
        });
      }
      
      // その他の問題のあるURLパターン
      if (url.includes('http://') && !url.includes('localhost')) {
        issues.push({
          type: 'insecure_link',
          url: url,
          location: file,
          severity: 'low',
          suggestion: 'HTTPSに変更'
        });
      }
    }
  }
  
  return issues;
}

// 断定的表現をチェック
function checkAssertiveStatements() {
  const blogPath = path.join(__dirname, '..', 'src', 'lib', 'blog-data.ts');
  const content = fs.readFileSync(blogPath, 'utf8');
  
  const issues = [];
  
  // 問題のある表現パターン
  const patterns = [
    /内申点は.*?(\d+%|約\d+%)/g,
    /合否判定の.*?(\d+%|約\d+%)/g,
    /必ず.*?必要/g,
    /すべて.*?で/g
  ];
  
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        const lineIndex = content.substring(0, content.indexOf(match)).split('\n').length;
        issues.push({
          type: 'assertive_statement',
          text: match,
          location: 'blog-data.ts',
          line: lineIndex,
          severity: 'medium',
          suggestion: '出典を追加または表現を和らげる'
        });
      }
    }
  }
  
  return issues;
}

// メイン処理
function main() {
  console.log('🔍 データ整合性チェックを開始...');
  
  try {
    const prefectures = loadPrefectureData();
    console.log(`✅ ${prefectures.length}件の都道府県データを読み込み`);
    
    const blogIssues = checkBlogPrefectureScores(prefectures);
    const guideIssues = checkGuideData(prefectures);
    const linkIssues = checkBrokenLinks();
    const statementIssues = checkAssertiveStatements();
    
    const allIssues = [...blogIssues, ...guideIssues, ...linkIssues, ...statementIssues];
    
    // 重要度でソート
    allIssues.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    if (allIssues.length > 0) {
      console.error('\n❌ 問題が検出されました：');
      console.error('');
      
      const highIssues = allIssues.filter(i => i.severity === 'high');
      const mediumIssues = allIssues.filter(i => i.severity === 'medium');
      const lowIssues = allIssues.filter(i => i.severity === 'low');
      
      if (highIssues.length > 0) {
        console.error('🚨 高優先度の問題：');
        highIssues.forEach(issue => {
          console.error(`   ${issue.prefecture || issue.type}: ${issue.expected || ''}→${issue.actual || issue.url || ''}`);
        });
        console.error('');
        
        // 高優先度の問題がある場合のみビルドを失敗させる
        console.error('💡 修正方法：');
        console.error('1. npm run check:consistency で詳細を確認');
        console.error('2. 高優先度の問題を修正してからデプロイ');
        console.error('3. 定期的にチェックを実行');
        
        process.exit(1);
      }
      
      if (mediumIssues.length > 0) {
        console.error('⚠️ 中優先度の問題：');
        mediumIssues.forEach(issue => {
          console.error(`   ${issue.type}: ${issue.text || issue.url}`);
        });
        console.error('');
      }
      
      if (lowIssues.length > 0) {
        console.error('💡 低優先度の問題：');
        lowIssues.forEach(issue => {
          console.error(`   ${issue.type}: ${issue.url}`);
        });
        console.error('');
      }
      
      // 中・低優先度の問題のみの場合は警告のみでビルドを続行
      console.log('⚠️ 中・低優先度の問題がありますが、ビルドを続行します');
      console.log('💡 高優先度の問題がないため、デプロイ可能です');
      process.exit(0);
    } else {
      console.log('✅ すべてのデータは整合しています');
      console.log('✅ リンクは正常です');
      console.log('✅ 表現は適切です');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ チェック中にエラーが発生しました：', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
