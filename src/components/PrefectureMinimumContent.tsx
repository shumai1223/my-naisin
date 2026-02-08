'use client';

import { AlertTriangle, BookOpen, ExternalLink, Calendar, Calculator, TrendingUp } from 'lucide-react';
import { getPrefectureByCode } from '@/lib/prefectures';

interface PrefectureMinimumContentProps {
  prefectureCode: string;
}

export function PrefectureMinimumContent({ prefectureCode }: PrefectureMinimumContentProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  if (!prefecture) return null;

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

  // 県別の罠
  const prefectureTraps = {
    tokyo: [
      '実技4教科は評定が2倍で計算される（音楽・美術・保体・技家）',
      'ESAT-J（英語スピーキングテスト）が20点満点で加算される場合がある',
      '中3の成績のみが対象（中1・中2は無関係）',
      '満点が高い（390点）ため、他県との比較には注意が必要'
    ],
    kanagawa: [
      'S値方式で合否判定（内申点と当日点を標準化）',
      '特色検査がある学校があり、当日点に加算される',
      '換算内申の計算が複雑（素内申×係数）',
      '実技教科は等倍だが、配点が高い傾向'
    ],
    osaka: [
      'A方式（内申重視）とB方式（当日重視）の選択がある',
      '実技教科の配点が比較的高め',
      '中1・中2・中3の成績が対象（均等配分）',
      'S値ではなく素点で合否判定'
    ],
    aichi: [
      '実技4教科は2倍で計算される',
      '中1・中2・中3の成績が対象',
      '満点が90点と他県より低め',
      '私立併願者が多く、競争率が高い傾向'
    ],
    fukuoka: [
      '実技4教科は2倍で計算される',
      '中1・中2・中3の成績が対象',
      '満点が45点と非常に低い',
      '当日点の比重が高い傾向'
    ]
  };

  const traps = prefectureTraps[prefectureCode as keyof typeof prefectureTraps] || [
    '制度は年度によって変更される場合があります',
    '最新情報は教育委員会の公式サイトでご確認ください',
    '私立高校の入試制度は公立と異なる場合があります'
  ];

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
        
        <ul className="space-y-2">
          {traps.map((trap, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500">•</span>
              <span className="text-sm text-amber-700">{trap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 公式資料リンク */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
          <ExternalLink className="h-5 w-5" />
          公式資料
        </h3>
        
        <div className="space-y-3">
          <a
            href={getPrefectureOfficialUrl(prefectureCode)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-blue-200 bg-white p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                {prefecture.name}教育委員会 - 入学者選抜要綱
              </h4>
              <p className="text-xs text-blue-600">令和8年度入学者選抜の公式要綱</p>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-500" />
          </a>
        </div>
        
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-100 p-3">
          <Calendar className="h-4 w-4 text-blue-700" />
          <p className="text-xs text-blue-700">
            最終確認: {prefecture.lastVerified || '未確認'}
          </p>
        </div>
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
