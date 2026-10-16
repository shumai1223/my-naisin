'use client';

import { getPrefectureByCode } from '@/lib/prefectures';

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
          { grade: '中1', ratio: 0 },
          { grade: '中2', ratio: 0 },
          { grade: '中3', ratio: 100 },
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
          { grade: '中2', ratio: 34 },
          { grade: '中3', ratio: 66 }
        ]
      },
      specialNote: 'S値方式で合否判定。内申点と当日点を標準化して合算します。',
      officialDocName: '令和8年度神奈川県立高等学校入学者選抜実施要綱'
    },
    aichi: {
      gradeRatioChart: {
        title: '愛知県の学年比率',
        description: '愛知県立高校入試では中3の成績のみが対象（全教科2倍）',
        data: [
          { grade: '中1', ratio: 0 },
          { grade: '中2', ratio: 0 },
          { grade: '中3', ratio: 100 },
        ]
      },
      specialNote: '全教科が2倍で計算され、実技教科の傾斜配点はありません。90点満点のシンプルな計算方式です。',
      officialDocName: '令和8年度愛知県立高等学校入学者選抜実施要綱'
    },
    saitama: {
      gradeRatioChart: {
        title: '埼玉県の学年比率（標準1:1:2）',
        description: '埼玉県立高校入試では中1〜中3の成績が対象。高校により比率が異なる',
        data: [
          { grade: '中1', ratio: 25 },
          { grade: '中2', ratio: 25 },
          { grade: '中3', ratio: 50 },
        ]
      },
      specialNote: '学校選択問題実施校では数学・英語の難易度が高くなります。加算点制度で部活動や資格検定が評価される場合もあります。',
      officialDocName: '令和8年度埼玉県公立高等学校入学者選抜実施要綱'
    },
    chiba: {
      gradeRatioChart: {
        title: '千葉県の学年比率',
        description: '千葉県立高校入試では中1〜中3の成績が均等に評価される',
        data: [
          { grade: '中1', ratio: 33 },
          { grade: '中2', ratio: 33 },
          { grade: '中3', ratio: 34 },
        ]
      },
      specialNote: 'K値（0.5〜2）による内申点換算制度があり、高校ごとに内申点の重みが異なります。',
      officialDocName: '令和8年度千葉県公立高等学校入学者選抜実施要綱'
    },
    hokkaido: {
      gradeRatioChart: {
        title: '北海道の学年比率（2:2:3）',
        description: '北海道立高校入試では中1〜中3の成績が対象。中3は3倍で計算',
        data: [
          { grade: '中1', ratio: 29 },
          { grade: '中2', ratio: 29 },
          { grade: '中3', ratio: 42 },
        ]
      },
      specialNote: '学区制があり、通学区域による制限があります。裁量問題を出題する高校もあります。',
      officialDocName: '令和8年度北海道立高等学校入学者選抜実施要綱'
    },
    osaka: {
      gradeRatioChart: {
        title: '大阪府の学年比率（1:2:6）',
        description: '大阪府立高校入試では中1・中2・中3の成績が対象',
        data: [
          { grade: '中1', ratio: 11 },
          { grade: '中2', ratio: 22 },
          { grade: '中3', ratio: 67 },
        ]
      },
      specialNote: 'チャレンジテストの結果が評定に影響する可能性があります。文理学科と普通科でボーダーが大きく異なります。',
      officialDocName: '令和8年度大阪府立高等学校入学者選抜実施要綱'
    },
    fukuoka: {
      gradeRatioChart: {
        title: '福岡県の学年比率',
        description: '福岡県立高校入試では中3の成績のみが対象',
        data: [
          { grade: '中1', ratio: 0 },
          { grade: '中2', ratio: 0 },
          { grade: '中3', ratio: 100 },
        ]
      },
      specialNote: '学区制があり、第1〜第13学区に分かれています。一部の高校では特定教科に傾斜配点があります。',
      officialDocName: '令和8年度福岡県立高等学校入学者選抜実施要綱'
    },
    hyogo: {
      gradeRatioChart: {
        title: '兵庫県の学年比率',
        description: '兵庫県立高校入試では中3の成績のみが対象（実技7.5倍）',
        data: [
          { grade: '中1', ratio: 0 },
          { grade: '中2', ratio: 0 },
          { grade: '中3', ratio: 100 },
        ]
      },
      specialNote: '実技4教科が7.5倍で計算され、全国トップクラスの傾斜配点です。実技教科が全体の60%を占めます。',
      officialDocName: '令和8年度兵庫県立高等学校入学者選抜実施要綱'
    },
    hiroshima: {
      gradeRatioChart: {
        title: '広島県の学年比率（1:1:3）',
        description: '広島県立高校入試では中1〜中3の成績が対象。中3は3倍で計算',
        data: [
          { grade: '中1', ratio: 20 },
          { grade: '中2', ratio: 20 },
          { grade: '中3', ratio: 60 },
        ]
      },
      specialNote: '自己表現が全校で実施されます。選抜Ⅰ（推薦）と選抜Ⅱ（一般）で評価方法が異なります。',
      officialDocName: '令和8年度広島県立高等学校入学者選抜実施要綱'
    }
  };

  const elements = uniqueElements[prefectureCode as keyof typeof uniqueElements];
  
  if (!elements) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-[17px] font-bold text-slate-900">{prefecture.name}の特徴</h3>
        <p className="text-sm text-slate-600">
          {prefecture.name}の内申点制度について、詳細な情報を提供しています。
          制度の変更に対応し、最新情報を維持しています。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 学年比率図（棒の色は全県で同じ。比率は長さと数字で読む） */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-[17px] font-bold text-slate-900">{elements.gradeRatioChart.title}</h3>
        <p className="mb-4 text-sm text-slate-600">{elements.gradeRatioChart.description}</p>

        <div className="space-y-2">
          {elements.gradeRatioChart.data.map((item) => (
            <div key={item.grade} className="flex items-center gap-4">
              <div className="w-16 text-sm text-slate-900">{item.grade}</div>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <div className="h-full bg-brand-700" style={{ width: `${item.ratio}%` }} />
              </div>
              <div className="w-12 text-right text-sm tabular-nums text-slate-900">{item.ratio}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 特記事項 */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-[17px] font-bold text-slate-900">特記事項</h3>
        <p className="text-base leading-[1.8] text-slate-900">{elements.specialNote}</p>
      </div>

      {/* 公式資料名 */}
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
        <h3 className="mb-3 text-[17px] font-bold text-slate-900">公式資料</h3>
        <p className="text-base font-bold text-slate-900">{elements.officialDocName}</p>
        <p className="mt-2 text-sm text-slate-600">
          最新の入試情報は{prefecture.name}教育委員会の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}
