'use client';

import { CalendarPlus } from 'lucide-react';

import { track } from '@/lib/track';

/**
 * 「入試日程をカレンダーに追加（ICS）」リンク（T-Y12段階3）。
 *
 * JukenIcsButton（全国共通・準備リマインダー）とは別物。こちらは/api/calendar/{prefecture}が
 * サーバー側で生成した確定日程のICSをそのままダウンロードさせる（データセットをクライアントに
 * 持たせる必要が無いため、生成ロジックはpropsで受け取らずAPIルートへ委譲する軽量な設計）。
 */
export function ExamScheduleIcsLink({
  prefectureCode,
  prefectureName,
}: {
  prefectureCode: string;
  prefectureName: string;
}) {
  return (
    <a
      href={`/api/calendar/${prefectureCode}`}
      download={`my-naishin-nyuushi-nittei-${prefectureCode}.ics`}
      onClick={() => track('ics_download', { tool: 'exam-schedule', prefecture: prefectureCode })}
      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-sky-700 active:scale-95"
    >
      <CalendarPlus className="h-4 w-4" />
      {prefectureName}の入試日程をカレンダーに追加（無料・ICS）
    </a>
  );
}
