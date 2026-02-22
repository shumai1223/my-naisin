'use client';

import * as React from 'react';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getPrefectureByCode } from '@/lib/prefectures';

interface PDFExportButtonProps {
  prefectureCode: string;
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  className?: string;
}

export function PDFExportButton({ 
  prefectureCode, 
  scores, 
  totalScore, 
  maxScore, 
  className = '' 
}: PDFExportButtonProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  const handlePDFExport = () => {
    // PDF出力用のHTMLを生成
    const printContent = `
      <html>
        <head>
          <title>内申点計算結果 - ${prefecture?.name}</title>
          <style>
            body { 
              font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1e40af; 
              margin-bottom: 10px; 
            }
            .subtitle { 
              font-size: 14px; 
              color: #6b7280; 
              margin-bottom: 5px; 
            }
            .section { 
              margin-bottom: 30px; 
              padding: 20px; 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              color: #1f2937; 
              margin-bottom: 15px; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 10px; 
            }
            .scores-grid { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 10px; 
              margin-bottom: 20px; 
            }
            .score-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 12px; 
              background: #f9fafb; 
              border-radius: 4px; 
              font-size: 14px; 
            }
            .score-label { 
              font-weight: 500; 
              color: #374151; 
            }
            .score-value { 
              font-weight: bold; 
              color: #1f2937; 
            }
            .result-highlight { 
              font-size: 20px; 
              font-weight: bold; 
              color: #059669; 
              text-align: center; 
              margin: 20px 0; 
              padding: 15px; 
              background: #ecfdf5; 
              border-radius: 8px; 
            }
            .evidence { 
              font-size: 12px; 
              color: #6b7280; 
              margin-top: 20px; 
              padding: 15px; 
              background: #f9fafb; 
              border-radius: 8px; 
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              font-size: 12px; 
              color: #6b7280; 
              text-align: center; 
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">内申点計算結果</div>
            <div class="subtitle">${prefecture?.name} - ${new Date().toLocaleDateString('ja-JP')}</div>
          </div>

          <div class="section">
            <div class="section-title">入力した成績</div>
            <div class="scores-grid">
              <div class="score-item">
                <span class="score-label">国語</span>
                <span class="score-value">${scores.japanese || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">数学</span>
                <span class="score-value">${scores.math || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">英語</span>
                <span class="score-value">${scores.english || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">理科</span>
                <span class="score-value">${scores.science || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">社会</span>
                <span class="score-value">${scores.social || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">音楽</span>
                <span class="score-value">${scores.music || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">美術</span>
                <span class="score-value">${scores.art || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">保健体育</span>
                <span class="score-value">${scores.pe || 3}点</span>
              </div>
              <div class="score-item">
                <span class="score-label">技術家庭</span>
                <span class="score-value">${scores.tech || 3}点</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">計算結果</div>
            <div class="result-highlight">
              内申点: ${totalScore}点 / ${maxScore}点満点
              <div style="font-size: 16px; font-weight: normal; color: #6b7280; margin-top: 5px;">
                達成率: ${Math.round((totalScore / maxScore) * 100)}%
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">計算式</div>
            <div style="font-size: 14px; line-height: 1.8;">
              <p><strong>基本計算式:</strong> 各教科の評定を合計して内申点を算出</p>
              <p><strong>対象学年:</strong> 中${prefecture?.targetGrades?.join('・') || '3'}年生</p>
              <p><strong>実技扱い:</strong> ${prefecture?.practicalMultiplier === 2 ? '実技4教科は2倍換算' : '等倍で計算'}</p>
              <p><strong>満点:</strong> ${maxScore}点満点</p>
            </div>
          </div>

          <div class="evidence">
            <div class="section-title">根拠情報</div>
            <p><strong>根拠資料:</strong> ${prefecture?.name}教育委員会「令和8年度入学者選抜実施要綱」</p>
            <p><strong>最終確認日:</strong> 2025年2月1日</p>
            <p><strong>計算根拠:</strong> 公式資料に基づき9教科5段階評価で計算</p>
            <p><strong>注意事項:</strong> 学校・コースによって配点が異なる場合があります。必ず志望校の要項を確認してください。</p>
            <p><strong>URL:</strong> ${typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com'}/${prefectureCode}/naishin</p>
          </div>

          <div class="footer">
            <p>この計算結果は My Naishin (https://my-naishin.com) で生成されました。</p>
            <p>※これは自動生成された資料です。公式情報とは異なる場合があります。</p>
          </div>
        </body>
      </html>
    `;

    // 新しいウィンドウで開いて印刷
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // 印刷ダイアログを開く
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handlePDFExport}
      className={`w-full h-12 text-sm font-medium ${className}`}
      leftIcon={<FileText className="h-4 w-4" />}
    >
      結果をPDFで保存（印刷）
    </Button>
  );
}
