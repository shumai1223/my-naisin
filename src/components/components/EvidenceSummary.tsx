'use client';

import * as React from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';

interface EvidenceSummaryProps {
  prefectureCode: string;
  className?: string;
}

export function EvidenceSummary({ prefectureCode, className = '' }: EvidenceSummaryProps) {
  // 各都道府県の根拠情報（実際のデータに基づいて設定）
  const evidenceData: Record<string, {
    sourceDocument: string;
    chapter: string;
    pageNumber: string;
    lastConfirmed: string;
    pageUpdated: string;
    lastTested: string;
    uniqueFeatures: string[];
    exceptions: string[];
  }> = {
    chiba: {
      sourceDocument: '令和8年度千葉県公立高等学校入学者選抜実施要綱',
      chapter: '第3章 選抜方法',
      pageNumber: 'p.15-18',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['K値方式（0.5〜2.0）', '中3のみの評定合計', '9教科5段階評価'],
      exceptions: ['特色検査を実施する学校', '専門学科・総合学科', '単位制高校']
    },
    tokyo: {
      sourceDocument: '令和8年度東京都立高等学校入学者選抜実施要綱',
      chapter: '第2章 調査書',
      pageNumber: 'p.8-12',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['実技4教科2倍換算', '65点→300点換算', 'ESAT-J対象'],
      exceptions: ['海外帰国生徒特別選抜', '連携型中高一貫校', '英語スピーキング免除']
    },
    kanagawa: {
      sourceDocument: '令和8年度神奈川県公立高等学校入学者選抜実施要綱',
      chapter: '第3章 内申点の取扱い',
      pageNumber: 'p.20-25',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['S値方式', '中2・中3比率f:g', '特色検査加点'],
      exceptions: ['専門学科・総合学科', 'f:g比率が学校ごとに異なる', '特色検査の有無']
    },
    osaka: {
      sourceDocument: '令和8年度大阪府公立高等学校入学者選抜実施要綱',
      chapter: '第4章 調査書の取扱い',
      pageNumber: 'p.12-16',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['タイプⅠ〜Ⅴ分類', '内申点×10倍換算', '当日点500点満点'],
      exceptions: ['専門学科・総合学科', '単位制高校', '学校ごとのタイプ違い']
    },
    saitama: {
      sourceDocument: '令和8年度埼玉県公立高等学校入学者選抜実施要綱',
      chapter: '第3章 選抜方法',
      pageNumber: 'p.10-14',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['標準9教科5段階評価', '中3のみ対象', '実技等倍'],
      exceptions: ['特色検査を実施する学校', '専門学科・総合学科', '単位制高校']
    },
    // デフォルト値（他の都道府県用）
    default: {
      sourceDocument: '令和8年度入学者選抜実施要綱',
      chapter: '選抜方法に関する章',
      pageNumber: '要綱参照',
      lastConfirmed: '2026年1月30日',
      pageUpdated: '2026年2月11日',
      lastTested: '2026年2月11日',
      uniqueFeatures: ['標準的な内申点計算', '9教科5段階評価'],
      exceptions: ['学校独自の配点比率', '特色検査', '専門学科・総合学科']
    }
  };

  const data = evidenceData[prefectureCode] || evidenceData.default;

  return (
    <div className={`rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80 p-6 shadow-lg shadow-emerald-100/50 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-300/40">
          <FileText className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-800 mb-2">計算根拠の透明性</h3>
            <p className="text-sm text-emerald-700">
              このツールは公式資料に基づき計算しています。根拠情報を公開することで透明性を確保しています。
            </p>
          </div>

          {/* 根拠資料情報 */}
          <div className="rounded-xl border border-emerald-200/50 bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">今年度の根拠資料</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-700">資料名:</span>
                <span className="text-slate-700">{data.sourceDocument}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-700">対象箇所:</span>
                <span className="text-slate-700">{data.chapter} / {data.pageNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-700">最終確認日:</span>
                <span className="text-slate-700">{data.lastConfirmed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-700">ページ更新日:</span>
                <span className="text-slate-700">{data.pageUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-700">テスト実行日:</span>
                <span className="text-slate-700">{data.lastTested}</span>
              </div>
            </div>
          </div>

          {/* 県独自の計算特徴 */}
          <div className="rounded-xl border border-emerald-200/50 bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">計算のどこが県独自か</h4>
            </div>
            <ul className="space-y-1 text-sm">
              {data.uniqueFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 例外事項 */}
          <div className="rounded-xl border border-amber-200/50 bg-amber-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="font-semibold text-amber-800">例外：学校・コースで違う可能性がある項目</h4>
            </div>
            <ul className="space-y-1 text-sm">
              {data.exceptions.map((exception, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700">{exception}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-700 mt-2">
              ※これらの例外がある場合、実際の配点とは異なる可能性があります。必ず志望校の要項を確認してください。
            </p>
          </div>

          {/* 外部リンク */}
          <div className="text-xs text-emerald-600">
            <p className="mb-1">
              <strong>運営者のソース確認方針:</strong> 都道府県教育委員会の公式PDFを直接確認し、複数資料がある場合は「実施要綱＞選考基準＞学校別資料」の優先順位で採用しています。
            </p>
            <p>
              計算ロジックのテスト結果は{' '}
              <a href="/quality" className="underline hover:text-emerald-700">
                品質保証ページ
              </a>
              {' '}で公開しています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
