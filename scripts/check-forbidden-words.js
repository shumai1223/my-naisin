#!/usr/bin/env node

// 禁止ワードチェックスクリプト
const fs = require('fs');
const path = require('path');

const FORBIDDEN_WORDS = [
  '米沢地区',
  '倉吉地区', 
  '中1・中2・中3の均等配分',
  '都道府県や計算方式によって異なります'
];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    FORBIDDEN_WORDS.forEach(word => {
      if (content.includes(word)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(word)) {
            issues.push({
              word,
              line: index + 1,
              text: line.trim()
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function checkDirectory(dirPath) {
  let allIssues = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        const issues = checkFile(fullPath);
        if (issues.length > 0) {
          allIssues.push({
            file: fullPath,
            issues
          });
        }
      }
    }
  }
  
  traverse(dirPath);
  return allIssues;
}

// メイン処理
const srcPath = path.join(__dirname, '..', 'src');
const allIssues = checkDirectory(srcPath);

if (allIssues.length > 0) {
  console.error('🚫 禁止ワードが検出されました:');
  console.error('');
  
  allIssues.forEach(fileIssue => {
    console.error(`📁 ${fileIssue.file}`);
    fileIssue.issues.forEach(issue => {
      console.error(`   Line ${issue.line}: "${issue.word}"`);
      console.error(`   ${issue.text}`);
      console.error('');
    });
  });
  
  console.error('ビルドを失敗させます。禁止ワードを削除してください。');
  process.exit(1);
} else {
  console.log('✅ 禁止ワードは検出されませんでした');
  process.exit(0);
}
