import { HelpCircle, AlertTriangle, Calendar, BookOpen } from '@/components/icons';
import type { ReactNode } from 'react';
import { PREFECTURE_FAQ_DATA, type FAQIconKey } from '../lib/prefecture-faq-data';

interface PrefectureFAQProps {
  prefectureCode: string;
  className?: string;
}

// 質問の種類を示す小さな単色アイコン（色では区別しない）。
const FAQ_ICONS: Record<FAQIconKey, ReactNode> = {
  calendar: <Calendar className="h-4 w-4" />,
  alert: <AlertTriangle className="h-4 w-4" />,
  help: <HelpCircle className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />
};

export function PrefectureFAQ({ prefectureCode, className = '' }: PrefectureFAQProps) {
  const data = PREFECTURE_FAQ_DATA[prefectureCode] || PREFECTURE_FAQ_DATA.default;

  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 md:p-6 ${className}`}>
      <h3 className="mb-3 text-[17px] font-bold text-slate-900">
        よくある質問（{prefectureCode === 'chiba' ? '千葉県' :
                    prefectureCode === 'tokyo' ? '東京都' :
                    prefectureCode === 'kanagawa' ? '神奈川県' :
                    prefectureCode === 'osaka' ? '大阪府' :
                    prefectureCode === 'saitama' ? '埼玉県' :
                    prefectureCode === 'aichi' ? '愛知県' : '一般'}）
      </h3>

      <div className="divide-y divide-slate-200 border-t border-slate-200">
        {data.commonQuestions
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          })
          .map((faq, index) => (
            <div key={index} className="flex items-start gap-3 py-4">
              <div className="mt-1 shrink-0 text-slate-600">
                {FAQ_ICONS[faq.icon]}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 text-base font-bold text-slate-900">
                  {faq.question}
                </h4>
                <p className="text-base leading-[1.8] text-slate-900">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
      </div>

      {data.specificNotes.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-900" />
            <span className="text-sm font-bold text-amber-900">特に注意が必要な点</span>
          </div>
          <ul className="space-y-1">
            {data.specificNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-amber-900">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-900" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
