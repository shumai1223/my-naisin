'use client';

import * as React from 'react';
import { AlertTriangle, HelpCircle, Calendar, BookOpen, TrendingUp } from 'lucide-react';

interface PrefectureSearchIntentProps {
  prefectureCode: string;
  className?: string;
}

export function PrefectureSearchIntent({ prefectureCode, className = '' }: PrefectureSearchIntentProps) {
  // 都道府県名のマッピング
  const prefectureNames: Record<string, string> = {
    chiba: '千葉県',
    tokyo: '東京都',
    kanagawa: '神奈川県',
    osaka: '大阪府',
    saitama: '埼玉県'
  };

  // 各都道府県の検索意図データ
  const searchIntents: Record<string, {
    commonMistakes: string[];
    targetGrades: string;
    ratioDifferences: string[];
    specialNotes: string[];
  }> = {
    chiba: {
      commonMistakes: [
        'K値は学校ごとに違うと思っている',
        '中1・中2の成績も影響すると勘違い',
        '実技教科の倍率を忘れている',
        '内申点と調査書点を混同している',
        'K値1.5が標準だと思い込んでいる'
      ],
      targetGrades: '中3のみの評定合計が対象です。中1・中2の成績は直接影響しません。',
      ratioDifferences: [
        '推薦入試と一般入試で内申点の比率が異なる場合があります。特に専門学科で注意が必要です。'
      ],
      specialNotes: ['K値は0.5〜2.0の範囲で学校ごとに設定されます', '特色検査を実施する学校では加点があります']
    },
    tokyo: {
      commonMistakes: [
        '実技4教科が2倍換算なのを知らない',
        'ESAT-Jを忘れている',
        '換算内申と素内申を混同している',
        '65点満点をそのまま使っていると思っている',
        '英語スピーキングが必須だと思い込んでいる'
      ],
      targetGrades: '中3の評定を基に、実技4教科は2倍して65点満点→300点満点に換算します。',
      ratioDifferences: [
        '都立一般：学力検査700点＋調査書点300点＋ESAT-J20点',
        '海外帰国生徒特別選抜：配点が異なる場合があります',
        '連携型中高一貫校：独自の選抜方法があります'
      ],
      specialNotes: ['ESAT-Jは免除可能な場合があります', '換算内申は300点満点が基本です']
    },
    kanagawa: {
      commonMistakes: [
        'S値とA値を混同している',
        '中2・中3の比率f:gを理解していない',
        '特色検査を忘れている',
        '学校ごとの比率が全て同じだと思っている',
        'S値計算が複雑すぎて諦めている'
      ],
      targetGrades: '中2・中3の評定合計を基準に、比率f:gで重み付けしてS値を計算します。',
      ratioDifferences: [
        '内申:学力の比率は学校ごとに異なります（4:6/5:5/3:7など）',
        '特色検査を実施する学校では加点があります',
        '専門学科・総合学科は別の計算方法です'
      ],
      specialNotes: ['f:gは合計10、各2以上の整数が基本です', 'S値は100点満点換算です']
    },
    osaka: {
      commonMistakes: [
        'タイプⅠ〜Ⅴの違いを理解していない',
        '内申点×10倍換算を知らない',
        '当日点500点満点を忘れている',
        '自分のタイプがどれか分からない',
        'すべての学校が同じタイプだと思っている'
      ],
      targetGrades: '中3の評定合計を10倍に換算して計算します。',
      ratioDifferences: [
        'タイプⅠ〜Ⅴで内申:当日点の比率が異なります',
        '専門学科・総合学科は独自の配点です',
        '単位制高校は評定ではなく単位数で評価します'
      ],
      specialNotes: ['タイプⅢ型が最も一般的です', '当日点は500点満点が基本です']
    },
    saitama: {
      commonMistakes: [
        '特殊な計算方法があると思い込んでいる',
        '実技教科の倍率があると勘違い',
        '中1・中2の成績も影響すると思っている',
        '学校ごとの独自ルールが多いと思っている',
        'K値方式と混同している'
      ],
      targetGrades: '中3のみの9教科5段階評価を標準計算します。',
      ratioDifferences: [
        'ほとんどの学校が標準的な計算方法です',
        '特色検査を実施する学校があります',
        '専門学科・総合学科で配点が異なる場合があります'
      ],
      specialNotes: ['埼玉県は標準的な計算が多いです', '学校ごとの確認が重要です']
    },
    default: {
      commonMistakes: [
        '実技教科の倍率があると勘違い',
        '中1・中2の成績も影響すると思っている',
        '学校ごとの独自ルールを忘れている',
        'すべての県で同じ計算方法だと思っている'
      ],
      targetGrades: '中3の成績が主に対象です。中1・中2の成績は影響しない県が多いです。',
      ratioDifferences: [
        'ほとんどの県が標準的な9教科5段階評価です',
        '特色検査を実施する学校があります',
        '専門学科・総合学科で配点が異なる場合があります'
      ],
      specialNotes: ['学校ごとの確認が重要です', '公式資料の確認を推奨します']
    }
  };

  const intent = searchIntents[prefectureCode] || searchIntents.default;

  return (
    <div className={`rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-slate-50/80 p-6 shadow-lg shadow-blue-100/50 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-600 shadow-lg shadow-blue-300/40">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-blue-800 mb-3">この県の検索意図</h3>
            <p className="text-sm text-blue-700">
              {prefectureNames[prefectureCode] || 'この都道府県'}の内申点計算に関するよくある検索意図と注意点をまとめました。
            </p>
          </div>

          {/* よくある勘違い */}
          <div className="rounded-xl border border-blue-200/50 bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="font-semibold text-blue-800">よくある勘違い（この県あるある）</h4>
            </div>
            <ul className="space-y-2 text-sm">
              {intent.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                  <span className="text-slate-700">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* いつの成績が使われるか */}
          <div className="rounded-xl border border-blue-200/50 bg-white/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">この県はいつの成績が使われる？</h4>
            </div>
            <p className="text-sm text-slate-700">{intent.targetGrades}</p>
            <p className="text-xs text-slate-500 mt-2">
              ※例外：学校・コースによっては異なる場合があります。必ず志望校の要項を確認してください。
            </p>
          </div>

          {/* 比率の違い */}
          <div className="rounded-xl border border-purple-200/50 bg-purple-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-purple-800">推薦/一般で比率が違う場合</h4>
            </div>
            <ul className="space-y-2 text-sm">
              {intent.ratioDifferences.map((difference, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                  <span className="text-slate-700">{difference}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 特記事項 */}
          {intent.specialNotes.length > 0 && (
            <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <h4 className="font-semibold text-emerald-800">特記事項</h4>
              </div>
              <ul className="space-y-1 text-sm">
                {intent.specialNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5" />
                    <span className="text-slate-700">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
