import { buildExamScheduleIcs, isValidDateString, findScheduleEvent } from '../exam-schedule';
import type { PrefectureExamScheduleFile } from '../exam-schedule';

const SAMPLE: PrefectureExamScheduleFile = {
  prefectureCode: 'ibaraki',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/schedule2026/',
      docTitle: '入学者選抜の日程（茨城県教育委員会）',
      fetchedAt: '2026-09-04',
      events: [
        { label: '一般入学出願期間', startDate: '2026-02-05', endDate: '2026-02-09' },
        { label: '一般入学学力検査', startDate: '2026-02-26' },
        { label: '合格者発表', startDate: '2026-03-11', note: '9:00' },
      ],
    },
  ],
};

describe('isValidDateString', () => {
  test('YYYY-MM-DD形式かつ実在の日付ならtrue', () => {
    expect(isValidDateString('2026-02-26')).toBe(true);
  });
  test('形式が違う・実在しない日付はfalse', () => {
    expect(isValidDateString('2026/02/26')).toBe(false);
    expect(isValidDateString('not-a-date')).toBe(false);
  });
});

describe('findScheduleEvent', () => {
  test('年度・項目名の完全一致で見つかる', () => {
    const e = findScheduleEvent(SAMPLE, '令和8年度（2026年度）', '合格者発表');
    expect(e?.startDate).toBe('2026-03-11');
  });
  test('見つからなければundefined', () => {
    expect(findScheduleEvent(SAMPLE, '令和9年度（2027年度）', '合格者発表')).toBeUndefined();
  });
});

describe('buildExamScheduleIcs（T-Y12段階3）', () => {
  test('VCALENDAR枠と最新年度分のVEVENTを持つ', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trim().endsWith('END:VCALENDAR')).toBe(true);
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(3);
    expect((ics.match(/END:VEVENT/g) || []).length).toBe(3);
  });

  test('単日イベントはDTEND=翌日（終日イベントは排他）', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260226');
    expect(ics).toContain('DTEND;VALUE=DATE:20260227');
  });

  test('期間イベントはDTEND=終了日の翌日', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260205');
    expect(ics).toContain('DTEND;VALUE=DATE:20260210');
  });

  test('SUMMARYに県名と項目名、DESCRIPTIONに出典が入る（Y-0: 1データ点=1出典）', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics).toContain('SUMMARY:【茨城県】一般入学学力検査');
    expect(ics).toContain('出典: 入学者選抜の日程（茨城県教育委員会）（令和8年度（2026年度））');
  });

  test('noteがある場合はDESCRIPTIONに含まれる', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics).toContain('DESCRIPTION:9:00 / 出典:');
  });

  test('不正な日付のイベントは安全側で除外される（検証不能な日付を配信しない）', () => {
    const withBadDate: PrefectureExamScheduleFile = {
      prefectureCode: 'test',
      years: [
        {
          ...SAMPLE.years[0],
          events: [
            { label: '不正データ', startDate: 'invalid-date' },
            { label: '正常データ', startDate: '2026-03-11' },
          ],
        },
      ],
    };
    const ics = buildExamScheduleIcs(withBadDate, 'テスト県');
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(1);
    expect(ics).toContain('正常データ');
    expect(ics).not.toContain('不正データ');
  });

  test('UIDは県コード・年度・indexで一意', () => {
    const ics = buildExamScheduleIcs(SAMPLE, '茨城県');
    expect(ics).toContain('UID:examsched-ibaraki-令和8年度（2026年度）-0@my-naishin.com');
    expect(ics).toContain('UID:examsched-ibaraki-令和8年度（2026年度）-1@my-naishin.com');
    expect(ics).toContain('UID:examsched-ibaraki-令和8年度（2026年度）-2@my-naishin.com');
  });
});
