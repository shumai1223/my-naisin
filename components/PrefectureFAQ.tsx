'use client';

import * as React from 'react';
import { HelpCircle, AlertTriangle, Calendar, BookOpen, TrendingUp } from 'lucide-react';

interface PrefectureFAQProps {
  prefectureCode: string;
  className?: string;
}

export function PrefectureFAQ({ prefectureCode, className = '' }: PrefectureFAQProps) {
  // 都道府県別のFAQデータ
  const faqData: Record<string, {
    commonQuestions: {
      question: string;
      answer: string;
      icon: React.ReactNode;
      priority: 'high' | 'medium' | 'low';
    }[];
    specificNotes: string[];
  }> = {
    chiba: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '千葉県の場合、中1〜中3の3年間の評定合計が対象です。全学年の合計値にK値をかけて調査書点を計算します。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: 'K値とは何ですか？',
          answer: 'K値は学校ごとに設定される内申点の重み付け係数です。0.5〜2.0の範囲で、学校によって異なります。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '千葉県では実技教科は1倍換算が基本です。5教科と同じ比重で計算されます。',
          icon: <BookOpen className="h-4 w-4" />,
          priority: 'medium'
        }
      ],
      specificNotes: [
        '全学年（中1〜中3）の評定合計にK値を乗じて計算します',
        'K値1.5が標準的な学校が多いですが、必ず確認が必要です'
      ]
    },
    tokyo: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '東京都の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技4教科は本当に2倍ですか？',
          answer: 'はい、東京都では実技4教科（音楽・美術・保健体育・技術家庭）は2倍で換算されます。65点満点→300点満点になります。',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: 'ESAT-Jとは何ですか？',
          answer: 'ESAT-Jは英語スピーキングテストです。20点満点で、当日の学力検査とは別に加算されます。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'medium'
        }
      ],
      specificNotes: [
        '換算内申は300点満点が基本です',
        'ESAT-Jは免除可能な場合があります'
      ]
    },
    kanagawa: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '神奈川県の場合、中2と中3の両方の成績が対象です。中2は1倍、中3は2倍で計算されます。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: 'S値とは何ですか？',
          answer: 'S値は神奈川県独自の内申点計算方法です。中2・中3の評定を比率f:gで重み付けして100点満点に換算します。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '神奈川県では実技教科は等倍が基本ですが、学校によっては重点化（2倍など）を行う場合があります。',
          icon: <BookOpen className="h-4 w-4" />,
          priority: 'high'
        }
      ],
      specificNotes: [
        'f:gは合計10、各2以上の整数が基本です',
        '学校ごとに実技教科の重点化が異なる場合があります'
      ]
    },
    osaka: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '大阪府の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: 'タイプⅠ〜Ⅲの違いは？',
          answer: 'タイプⅠは総合学科、タイプⅡは普通科、タイプⅢは専門学科向けです。内申点の比重が異なります。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '内申点は本当に10倍ですか？',
          answer: 'はい、大阪府では中3の9教科評定合計を10倍して計算します。45点満点→450点満点になります。',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'high'
        }
      ],
      specificNotes: [
        'タイプⅡが最も一般的です',
        '当日点は500点満点が基本です'
      ]
    },
    saitama: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '埼玉県の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '埼玉県では実技教科は1倍換算が基本です。5教科と同じ比重で計算されます。',
          icon: <BookOpen className="h-4 w-4" />,
          priority: 'medium'
        },
        {
          question: '特殊な計算はありますか？',
          answer: '埼玉県は標準的な計算方法が多いですが、一部の学校で特色検査を実施しています。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'low'
        }
      ],
      specificNotes: [
        'ほとんどの学校が標準的な計算です',
        '学校ごとの確認が重要です'
      ]
    },
    aichi: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '愛知県の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '愛知県では実技教科は1.5倍換算です。5教科より少し高い比重があります。',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '名古屋市立と県立で違いは？',
          answer: '名古屋市立高校は独自の計算方法を採用している場合があります。必ず確認が必要です。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'medium'
        }
      ],
      specificNotes: [
        '名古屋市立と県立で計算方法が異なる場合があります',
        '特色検査を実施する学校があります'
      ]
    },
    hokkaido: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '北海道の場合、中1〜中3の3年間が対象ですが、学年ごとに重み付けが異なります。中1×2、中2×2、中3×3で計算します。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '学年ごとの倍率は？',
          answer: '中1と中2は2倍、中3は3倍の重み付けです。中3の成績が最も重要になります。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '北海道では実技教科も主要5教科と同じ倍率が適用されます。',
          icon: <BookOpen className="h-4 w-4" />,
          priority: 'medium'
        }
      ],
      specificNotes: [
        '学年ごとの重み付けが特徴的（中1×2、中2×2、中3×3）',
        '合計315点満点の計算になります'
      ]
    },
    default: {
      commonQuestions: [
        {
          question: 'どの学期の成績が対象になりますか？',
          answer: '多くの都道府県の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
          icon: <Calendar className="h-4 w-4" />,
          priority: 'high'
        },
        {
          question: '実技教科の倍率は？',
          answer: '都道府県によりますが、1倍〜3倍の範囲で設定されている場合が多いです。',
          icon: <BookOpen className="h-4 w-4" />,
          priority: 'medium'
        },
        {
          question: '特殊な計算はありますか？',
          answer: '都道府県によって独自の計算方法があります。必ず公式資料で確認してください。',
          icon: <HelpCircle className="h-4 w-4" />,
          priority: 'medium'
        }
      ],
      specificNotes: [
        '学校ごとの確認が重要です',
        '公式資料の確認を推奨します'
      ]
    }
  };

  const data = faqData[prefectureCode] || faqData.default;

  return (
    <div className={`rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-rose-50/80 p-6 shadow-lg shadow-amber-100/50 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 shadow-lg shadow-amber-300/40">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            よくある質問（{prefectureCode === 'chiba' ? '千葉県' : 
                        prefectureCode === 'tokyo' ? '東京都' :
                        prefectureCode === 'kanagawa' ? '神奈川県' :
                        prefectureCode === 'osaka' ? '大阪府' :
                        prefectureCode === 'saitama' ? '埼玉県' :
                        prefectureCode === 'aichi' ? '愛知県' : '一般'}）
          </h3>
          
          <div className="space-y-4">
            {data.commonQuestions
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              })
              .map((faq, index) => (
                <div key={index} className="border-l-4 border-amber-300 bg-white/50 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-amber-600">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {data.specificNotes.length > 0 && (
            <div className="mt-6 p-4 bg-amber-100/50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <span className="text-sm font-semibold text-amber-800">特に注意が必要な点</span>
              </div>
              <ul className="space-y-1">
                {data.specificNotes.map((note, index) => (
                  <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 bg-amber-500 rounded-full flex-shrink-0" />
                    {note}
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
