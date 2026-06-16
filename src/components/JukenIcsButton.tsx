'use client';

import * as React from 'react';
import { CalendarPlus, Check } from 'lucide-react';

import { buildJukenIcs, currentAcademicStartYear } from '@/lib/juken-schedule';
import { track } from '@/lib/track';

/**
 * 「受験準備カレンダーをカレンダーに追加（ICS）」ダウンロードボタン。
 *
 * 名簿（堀A）に与える“商品”の一つ＝継続接点。中3の月別準備ToDoを終日イベントのICSで配り、
 * Googleカレンダー/Appleカレンダー等に取り込んでもらう。県別の確定日程は含めない（準備リマインダー）。
 * 生成は純関数（lib）・ダウンロードはBlobでクライアント完結（サーバー不要）。
 */
export function JukenIcsButton() {
  const [done, setDone] = React.useState(false);

  const onDownload = () => {
    const year = currentAcademicStartYear();
    const ics = buildJukenIcs(year);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `juken-schedule-${year}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    track('ics_download', { tool: 'juken-schedule', year });
    setDone(true);
    window.setTimeout(() => setDone(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={onDownload}
      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-sky-700 active:scale-95"
    >
      {done ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
      {done ? 'ダウンロードしました' : '受験準備カレンダーを追加（無料・ICS）'}
    </button>
  );
}
