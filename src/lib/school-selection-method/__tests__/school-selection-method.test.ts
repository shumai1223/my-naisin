import {
  getSchoolSelectionMethod,
  findSchoolSelectionRecord,
  prefecturesByStatus,
} from '@/lib/school-selection-method';
import { SCHOOL_SELECTION_METHOD_BY_PREFECTURE } from '@/data/school-selection-methods';

describe('T-Y14 学校・学科別入学者選抜の評価方法', () => {
  it('getSchoolSelectionMethodは未登録県にundefinedを返す', () => {
    expect(getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'akita')).toBeUndefined();
  });

  it('prefecturesByStatusはstructuredでosakaを含む', () => {
    expect(prefecturesByStatus(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'structured')).toContain('osaka');
  });

  it('osaka: 東淀川(一般)は学力検査問題BBB・倍率タイプIIを持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '東淀川',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'B', suugaku: 'B', eigo: 'B' });
    expect(record?.ratioType).toBe('II');
  });

  it('osaka: 東(一般)は倍率タイプIを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '東', '一般');
    expect(record?.ratioType).toBe('I');
  });

  it('osaka: 桜宮(一般)は倍率タイプIIIを持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '桜宮',
      '一般'
    );
    expect(record?.ratioType).toBe('III');
  });

  it('osaka: 清水谷(一般)は国語Cを含む学力検査問題タイプを持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '清水谷',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'B', eigo: 'B' });
    expect(record?.ratioType).toBe('I');
  });

  it('osaka: 池田(一般)は国数英すべてC問題を持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '池田',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'C', eigo: 'C' });
  });

  it('osaka: 阿武野(一般)は数学・英語にA問題を持つ(A問題の初出)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '阿武野',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'B', suugaku: 'A', eigo: 'A' });
  });

  it('osaka: 門真西(一般)は倍率タイプIVを持つ(初出)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '門真西',
      '一般'
    );
    expect(record?.ratioType).toBe('IV');
  });

  it('osaka: 野崎(一般)は国数英すべてA問題を持つ(初出)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '野崎',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
  });

  it('osaka: 東大阪市立日新(一般)は普通科・商業科・英語科を併設する市立高校', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '東大阪市立日新',
      '一般'
    );
    expect(record?.ratioType).toBe('III');
  });

  it('osaka: 東淀工業(農業/工業区分ではなく工業に関する学科・一般)はAAA問題を持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '東淀工業',
      '一般'
    );
    expect(record?.department).toBe('工業に関する学科');
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
  });

  it('osaka: 堺市立堺(工業に関する学科・一般)は4創造科を持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '堺市立堺',
      '一般'
    );
    expect(record?.department).toBe('工業に関する学科');
    expect(record?.ratioType).toBe('II');
  });

  it('osaka: 選抜区分「特別」の工芸科は未収録(findSchoolSelectionRecordはnull)', () => {
    expect(
      findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '工芸', '一般')
    ).toBeNull();
  });

  it('osaka: 住吉商業(商業に関する学科・一般)は3コースを持ちAAA問題', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '住吉商業',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
    expect(record?.ratioType).toBe('IV');
  });

  it('osaka: 住吉(総合科学科・一般)はCBC問題を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '住吉', '一般');
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'B', eigo: 'C' });
  });

  it('osaka: schoolsは98校を収録している(工業・商業・グローバルビジネス科・食物文化科を完全収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka');
    expect(record?.schools?.length).toBe(98);
  });

  it('findSchoolSelectionRecordは未収録校にnullを返す', () => {
    expect(
      findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '未収録高校', '一般')
    ).toBeNull();
  });

  it('findSchoolSelectionRecordは未登録県にnullを返す', () => {
    expect(
      findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'akita', '秋田高校', '一般')
    ).toBeNull();
  });

  it('登録済みレコードは全てfiscalYear・source.url・source.lastCheckedを持つ（Y-0: 1データ点1出典）', () => {
    for (const record of Object.values(SCHOOL_SELECTION_METHOD_BY_PREFECTURE)) {
      expect(record?.fiscalYear.length).toBeGreaterThan(0);
      expect(record?.source.url.startsWith('https://')).toBe(true);
      expect(record?.source.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('structuredレコードのschoolsは1件以上を持つ', () => {
    for (const record of Object.values(SCHOOL_SELECTION_METHOD_BY_PREFECTURE)) {
      if (record?.status === 'structured') {
        expect(record.schools?.length).toBeGreaterThan(0);
      }
    }
  });
});
