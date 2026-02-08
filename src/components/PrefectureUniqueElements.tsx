'use client';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';

interface PrefectureUniqueElementsProps {
  prefectureCode: string;
}

export function PrefectureUniqueElements({ prefectureCode }: PrefectureUniqueElementsProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  if (!prefecture) return null;

  // 都道府県別の固有要素
  const uniqueElements = {
    tokyo: {
      gradeRatioChart: {
        title: '東京都の学年比率',
        description: '東京都立高校入試では中3の成績のみが対象',
        data: [
          { grade: '中1', ratio: 0, color: 'bg-slate-300' },
          { grade: '中2', ratio: 0, color: 'bg-slate-300' },
          { grade: '中3', ratio: 100, color: 'bg-blue-500' },
        ]
      },
      specialNote: 'ESAT-J（英語スピーキングテスト）が20点満点で加算されますが、実施しない学校・コースもあります。',
      officialDocName: '令和8年度東京都立高等学校入学者選抜実施要綱'
    },
    kanagawa: {
      gradeRatioChart: {
        title: '神奈川県の学年比率',
        description: '神奈川県立高校入試では中2・中3の成績が対象',
        data: [
          { grade: '中2', ratio: 33, color: 'bg-green-500' },
          { grade: '中3', ratio: 67, color: 'bg-blue-500' }
        ]
      },
      specialNote: 'S値方式で合否判定。内申点と当日点を標準化して合算します。',
      officialDocName: '令和8年度神奈川県立高等学校入学者選抜実施要綱'
    },
    osaka: {
      gradeRatioChart: {
        title: '大阪府の学年比率',
        description: '大阪府立高校入試では中1・中2・中3の成績が対象',
        data: [
          { grade: '中1', ratio: 33, color: 'bg-orange-500' },
          { grade: '中2', ratio: 33, color: 'bg-orange-500' },
          { grade: '中3', ratio: 34, color: 'bg-orange-600' },
        ]
      },
      specialNote: 'A方式（内申重視）とB方式（当日重視）の選択があります。',
      officialDocName: '令和8年度大阪府立高等学校入学者選抜実施要綱'
    }
  };

  const elements = uniqueElements[prefectureCode as keyof typeof uniqueElements];
  
  if (!elements) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">{prefecture.name}の特徴</h3>
        <p className="text-sm text-slate-600">
          {prefecture.name}の内申点制度について、詳細な情報を提供しています。
          制度の変更に対応し、最新情報を維持しています。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 学年比率図 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">{elements.gradeRatioChart.title}</h3>
        <p className="mb-4 text-sm text-slate-600">{elements.gradeRatioChart.description}</p>
        
        <div className="space-y-2">
          {elements.gradeRatioChart.data.map((item) => (
            <div key={item.grade} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-700">{item.grade}</div>
              <div className="flex-1 rounded-full bg-slate-200 h-6 overflow-hidden">
                <div 
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.ratio}%` }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-slate-700">{item.ratio}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 特殊な注意点 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-amber-800">特記事項</h3>
        <p className="text-sm text-amber-700">{elements.specialNote}</p>
      </div>

      {/* 公式資料名 */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-blue-800">公式資料</h3>
        <p className="text-sm text-blue-700 font-medium">{elements.officialDocName}</p>
        <p className="mt-2 text-xs text-blue-600">
          最新の入試情報は{prefecture.name}教育委員会の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}
