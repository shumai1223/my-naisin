import { getSchoolTeijiRecords } from '../school-teiji-lookup';
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';

describe('getSchoolTeijiRecords（学校ページから定時制・通信制データを引く）', () => {
  it('定時制課程を持つ実在校（東京都立一橋高等学校）は該当レコードを返す', () => {
    const records = getSchoolTeijiRecords('tokyo', 'D113299901013');
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].schoolName).toBe('一橋');
    expect(records[0].trackType).toBe('定時制');
    expect(typeof records[0].quota).toBe('number');
    expect(typeof records[0].finalApplicants).toBe('number');
    expect(typeof records[0].finalRate).toBe('number');
  });

  it('複数学科を持つ実在校（東京都立新宿山吹高等学校の相当校）は複数レコードを返す', () => {
    // 新宿山吹は普通科1〜4部/情報科2・4部の2レコードを持つ（tokyo.ts参照）
    const master = SCHOOL_MASTER_BY_PREFECTURE.tokyo!;
    const shinjukuYamabuki = master.schools.find((s) => s.name.includes('新宿山吹'));
    expect(shinjukuYamabuki).toBeDefined();
    const records = getSchoolTeijiRecords('tokyo', shinjukuYamabuki!.code);
    expect(records.length).toBe(2);
  });

  it('全日制のみで定時制課程を持たない実在校（東京都立日比谷高等学校）は空配列を返す', () => {
    const records = getSchoolTeijiRecords('tokyo', 'D113299901022');
    expect(records).toEqual([]);
  });

  it('定時制データ未収集の都道府県（osaka）は空配列を返す（推測しない）', () => {
    const records = getSchoolTeijiRecords('osaka', 'anything');
    expect(records).toEqual([]);
  });

  it('存在しない都道府県コードは空配列を返す', () => {
    const records = getSchoolTeijiRecords('not-a-prefecture', 'anything');
    expect(records).toEqual([]);
  });
});
