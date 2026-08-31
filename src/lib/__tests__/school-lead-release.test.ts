import { SCHOOL_LEAD_FORM_RELEASE_DATE, isSchoolLeadFormReleased } from '../school-lead-release';

describe('school-lead-release（C10-2の日付ゲート・[[loop-question-note]]のデプロイ順計画）', () => {
  test('公開日は2026-09-19（C10-1投入から2週間後）', () => {
    expect(SCHOOL_LEAD_FORM_RELEASE_DATE).toBe('2026-09-19');
  });

  test('公開日より前は非公開', () => {
    expect(isSchoolLeadFormReleased(new Date('2026-09-18T23:59:59+09:00'))).toBe(false);
    expect(isSchoolLeadFormReleased(new Date('2026-08-31T00:00:00+09:00'))).toBe(false);
  });

  test('公開日当日・以降は公開', () => {
    expect(isSchoolLeadFormReleased(new Date('2026-09-19T00:00:00+09:00'))).toBe(true);
    expect(isSchoolLeadFormReleased(new Date('2026-10-01T00:00:00+09:00'))).toBe(true);
  });
});
