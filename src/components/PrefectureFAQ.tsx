import { HelpCircle, AlertTriangle, Calendar, BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { PREFECTURE_FAQ_DATA, type FAQIconKey } from '../lib/prefecture-faq-data';

interface PrefectureFAQProps {
  prefectureCode: string;
  className?: string;
}

const FAQ_ICONS: Record<FAQIconKey, ReactNode> = {
  calendar: <Calendar className="h-4 w-4" />,
  alert: <AlertTriangle className="h-4 w-4" />,
  help: <HelpCircle className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />
};

export function PrefectureFAQ({ prefectureCode, className = '' }: PrefectureFAQProps) {
  const data = PREFECTURE_FAQ_DATA[prefectureCode] || PREFECTURE_FAQ_DATA.default;

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
                      {FAQ_ICONS[faq.icon]}
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
