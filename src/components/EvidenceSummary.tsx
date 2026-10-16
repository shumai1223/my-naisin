'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle } from '@/components/icons';

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
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['K値方式（0.5〜2.0）', '中3のみの評定合計', '9教科5段階評価'],
      exceptions: ['特色検査を実施する学校', '専門学科・総合学科', '単位制高校']
    },
    tokyo: {
      sourceDocument: '令和8年度東京都立高等学校入学者選抜実施要綱',
      chapter: '第2章 調査書',
      pageNumber: 'p.8-12',
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['実技4教科2倍換算', '65点→300点換算', 'ESAT-J対象'],
      exceptions: ['海外帰国生徒特別選抜', '連携型中高一貫校', '英語スピーキング免除']
    },
    kanagawa: {
      sourceDocument: '令和8年度神奈川県公立高等学校入学者選抜実施要綱',
      chapter: '第3章 内申点の取扱い',
      pageNumber: 'p.20-25',
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['S値方式', '中2・中3比率f:g', '特色検査加点'],
      exceptions: ['専門学科・総合学科', 'f:g比率が学校ごとに異なる', '特色検査の有無']
    },
    osaka: {
      sourceDocument: '令和8年度大阪府公立高等学校入学者選抜実施要綱',
      chapter: '第4章 調査書の取扱い',
      pageNumber: 'p.12-16',
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['タイプⅠ〜Ⅴ分類', '内申点×10倍換算', '当日点500点満点'],
      exceptions: ['専門学科・総合学科', '単位制高校', '学校ごとのタイプ違い']
    },
    saitama: {
      sourceDocument: '令和8年度埼玉県公立高等学校入学者選抜実施要綱',
      chapter: '第3章 選抜方法',
      pageNumber: 'p.10-14',
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['標準9教科5段階評価', '中3のみ対象', '実技等倍'],
      exceptions: ['特色検査を実施する学校', '専門学科・総合学科', '単位制高校']
    },
    // デフォルト値（他の都道府県用）
    default: {
      sourceDocument: '令和8年度入学者選抜実施要綱',
      chapter: '選抜方法に関する章',
      pageNumber: '要綱参照',
      lastConfirmed: '2026年4月22日',
      pageUpdated: '2026年4月22日',
      lastTested: '2026年4月22日',
      uniqueFeatures: ['標準的な内申点計算', '9教科5段階評価'],
      exceptions: ['学校独自の配点比率', '特色検査', '専門学科・総合学科']
    }
  };

  const data = evidenceData[prefectureCode] || evidenceData.default;

  // 見た目は「やさしい学習帳」: 白い面＋罫線。内側のカードは作らず、区切りは罫線。注意だけ琥珀の注釈。
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 ${className}`}>
      <h3 className="text-[17px] font-bold text-slate-900">計算根拠の透明性</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        このツールは公式資料に基づき計算しています。根拠情報を公開することで透明性を確保しています。
      </p>

      {/* 根拠資料情報 */}
      <div className="mt-4 border-t border-slate-200 pt-4">
        <h4 className="text-sm font-bold text-slate-900">今年度の根拠資料</h4>
        <dl className="mt-2 divide-y divide-slate-200 text-sm">
          <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-3">
            <dt className="shrink-0 text-slate-600 sm:w-28">資料名:</dt>
            <dd className="min-w-0 text-slate-900">{data.sourceDocument}</dd>
          </div>
          <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-3">
            <dt className="shrink-0 text-slate-600 sm:w-28">対象箇所:</dt>
            <dd className="min-w-0 text-slate-900">{data.chapter} / {data.pageNumber}</dd>
          </div>
          <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-3">
            <dt className="shrink-0 text-slate-600 sm:w-28">最終確認日:</dt>
            <dd className="min-w-0 text-slate-900">{data.lastConfirmed}</dd>
          </div>
          <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-3">
            <dt className="shrink-0 text-slate-600 sm:w-28">ページ更新日:</dt>
            <dd className="min-w-0 text-slate-900">{data.pageUpdated}</dd>
          </div>
          <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-3">
            <dt className="shrink-0 text-slate-600 sm:w-28">テスト実行日:</dt>
            <dd className="min-w-0 text-slate-900">{data.lastTested}</dd>
          </div>
        </dl>
      </div>

      {/* 県独自の計算特徴 */}
      <div className="mt-4 border-t border-slate-200 pt-4">
        <h4 className="text-sm font-bold text-slate-900">計算のどこが県独自か</h4>
        <ul className="mt-2 space-y-1 text-sm">
          {data.uniqueFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
              <span className="text-slate-900">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 例外事項 */}
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-900" />
          <h4 className="text-sm font-bold text-amber-900">例外：学校・コースで違う可能性がある項目</h4>
        </div>
        <ul className="space-y-1 text-sm">
          {data.exceptions.map((exception, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" aria-hidden="true" />
              <span className="text-slate-900">{exception}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-amber-900">
          ※これらの例外がある場合、実際の配点とは異なる可能性があります。必ず志望校の要項を確認してください。
        </p>
      </div>

      {/* 外部リンク */}
      <div className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-600">
        <p className="mb-1">
          <strong className="text-slate-900">運営者のソース確認方針:</strong> 都道府県教育委員会の公式PDFを直接確認し、複数資料がある場合は「実施要綱＞選考基準＞学校別資料」の優先順位で採用しています。
        </p>
        <p>
          計算ロジックのテスト結果は{' '}
          <Link href="/quality" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
            品質保証ページ
          </Link>
          {' '}で公開しています。
        </p>
      </div>
    </div>
  );
}
