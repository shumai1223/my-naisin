'use client';

import { AlertTriangle, BookOpen, ExternalLink, Calendar, Calculator, TrendingUp } from 'lucide-react';
import { getPrefectureByCode } from '@/lib/prefectures';
import { PREFECTURE_TRAPS } from '@/lib/prefecture-traps';
import { PREFECTURE_SOURCES } from '@/lib/prefecture-sources';

interface PrefectureMinimumContentProps {
  prefectureCode: string;
}

export function PrefectureMinimumContent({ prefectureCode }: PrefectureMinimumContentProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  if (!prefecture) return null;
  const officialUrl = getPrefectureOfficialUrl(prefectureCode);

  // 計算例のパターン
  const calculationExamples = [
    {
      title: 'オール3の場合',
      description: '全教科で評定3を取った場合の内申点',
      scores: { 国語: 3, 数学: 3, 英語: 3, 理科: 3, 社会: 3, 音楽: 3, 美術: 3, 保体: 3, 技家: 3 },
      improvement: '主要5教科を4に上げることで+5点向上'
    },
    {
      title: 'オール4の場合',
      description: '全教科で評定4を取った場合の内申点',
      scores: { 国語: 4, 数学: 4, 英語: 4, 理科: 4, 社会: 4, 音楽: 4, 美術: 4, 保体: 4, 技家: 4 },
      improvement: '主要5教科を5に上げることで+5点向上'
    }
  ];

  // 県別の罠（データ駆動）
  const traps = PREFECTURE_TRAPS[prefectureCode as keyof typeof PREFECTURE_TRAPS] || [
    {
      title: '制度は年度によって変更される',
      description: '最新情報は教育委員会の公式サイトでご確認ください',
      impact: 'medium' as const,
      solution: '定期的に公式サイトを確認し、最新情報を入手しましょう'
    },
    {
      title: '私立高校の入試制度',
      description: '私立高校の入試制度は公立と異なる場合があります',
      impact: 'low' as const,
      solution: '私立高校を志望する場合は、各校の入試要項を確認しましょう'
    }
  ];

  // 詳細な根拠データ
  const sources = PREFECTURE_SOURCES[prefectureCode as keyof typeof PREFECTURE_SOURCES] || [];

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <BookOpen className="h-5 w-5 text-blue-500" />
          {prefecture.name}の基本情報
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="text-sm font-semibold text-blue-800">対象学年</h4>
            <p className="mt-1 text-blue-700">
              {prefecture.targetGrades.length === 1 
                ? `中${prefecture.targetGrades[0]}のみ`
                : `中${prefecture.targetGrades.join('・')}`}
            </p>
          </div>
          
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="text-sm font-semibold text-green-800">実技倍率</h4>
            <p className="mt-1 text-green-700">
              {prefecture.practicalMultiplier > 1 
                ? `${prefecture.practicalMultiplier}倍`
                : '等倍'}
            </p>
          </div>
          
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="text-sm font-semibold text-purple-800">満点</h4>
            <p className="mt-1 text-purple-700">{prefecture.maxScore}点</p>
          </div>
        </div>
      </div>

      {/* 計算例 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-green-500" />
          計算例
        </h3>
        
        <div className="space-y-4">
          {calculationExamples.map((example, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-800">{example.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{example.description}</p>
              
              <div className="mt-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-700">{example.improvement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* この県の罠 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          {prefecture.name}の注意点
        </h3>
        
        <ul className="space-y-3">
          {traps.map((trap, index) => (
            <li key={index} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  trap.impact === 'high' ? 'bg-red-500' :
                  trap.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-800">{trap.title}</h4>
                  <p className="mt-1 text-sm text-amber-700">{trap.description}</p>
                  <div className="mt-2 rounded-lg border border-amber-300 bg-amber-100 p-2">
                    <p className="text-xs text-amber-800">
                      <strong>対策：</strong>{trap.solution}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 公式資料リンク */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
          <ExternalLink className="h-5 w-5" />
          公式資料（根拠）
        </h3>
        
        {sources.length > 0 ? (
          <div className="space-y-3">
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-blue-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-blue-800">{source.pdfTitle}</h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-blue-600">
                        <strong>該当箇所：</strong>{source.pageNumber}「{source.sectionName}」
                      </p>
                      <p className="text-xs text-blue-600">{source.description}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-500">
                      <Calendar className="h-3 w-3" />
                      <span>最終確認: {source.lastChecked}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-white p-4 text-sm text-blue-700">
            <p>
              詳細な根拠PDFは現在確認中です。最新情報は
              <a 
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline"
              >
                {prefecture.name}教育委員会の公式サイト
              </a>
              （最終確認：2026年1月28日）をご覧ください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getPrefectureOfficialUrl(code: string): string {
  const urls: Record<string, string> = {
    tokyo: 'https://www.kyoiku.metro.tokyo.lg.jp/',
    kanagawa: 'https://www.pref.kanagawa.jp/',
    osaka: 'https://www.pref.osaka.lg.jp/',
    aichi: 'https://www.pref.aichi.jp/',
    fukuoka: 'https://www.pref.fukuoka.lg.jp/',
    hokkaido: 'https://www.pref.hokkaido.lg.jp/',
  };
  return urls[code] || 'https://www.mext.go.jp/';
}
