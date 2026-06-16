import { buildJukenIcs, currentAcademicStartYear, JUKEN_SCHEDULE } from '../juken-schedule';

describe('受験準備カレンダー（ICS）', () => {
  test('スケジュールは12ヶ月', () => {
    expect(JUKEN_SCHEDULE).toHaveLength(12);
  });

  test('VCALENDAR枠と12件のVEVENTを持つ', () => {
    const ics = buildJukenIcs(2026);
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trim().endsWith('END:VCALENDAR')).toBe(true);
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(12);
    expect((ics.match(/END:VEVENT/g) || []).length).toBe(12);
  });

  test('学年度マッピング：4月=開始年・1〜3月=翌年', () => {
    const ics = buildJukenIcs(2026);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260401'); // 4月
    expect(ics).toContain('DTSTART;VALUE=DATE:20261201'); // 12月
    expect(ics).toContain('DTSTART;VALUE=DATE:20270101'); // 1月→翌年
    expect(ics).toContain('DTSTART;VALUE=DATE:20270301'); // 3月→翌年
  });

  test('終日イベントのDTENDは翌日（排他）', () => {
    const ics = buildJukenIcs(2026);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260401');
    expect(ics).toContain('DTEND;VALUE=DATE:20260402');
  });

  test('現在日→学年度開始年（4月以降=当年・1〜3月=前年）', () => {
    expect(currentAcademicStartYear(new Date(2026, 5, 15))).toBe(2026); // 6月
    expect(currentAcademicStartYear(new Date(2026, 1, 15))).toBe(2025); // 2月
    expect(currentAcademicStartYear(new Date(2026, 3, 1))).toBe(2026); // 4月
  });
});
