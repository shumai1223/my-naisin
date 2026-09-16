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

  it('osaka: 工芸の全日制美術科(選抜区分「特別」)は未収録だが定時制総合学科(選抜区分「一般」)は収録済み', () => {
    expect(
      findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '工芸', '特別')
    ).toBeNull();
    expect(
      findSchoolSelectionRecord(
        SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
        'osaka',
        '工芸',
        '一般',
        '定時制の課程(総合学科)'
      )
    ).not.toBeNull();
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

  it('osaka: 千里(総合科学科・一般)はCCC問題を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '千里', '一般');
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'C', eigo: 'C' });
  });

  it('osaka: 北野(文理学科・一般)はCCC問題・倍率タイプIを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '北野', '一般');
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'C', eigo: 'C' });
    expect(record?.ratioType).toBe('I');
  });

  it('osaka: 文理学科10校は全てCCC問題・倍率タイプIで統一されている', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka');
    const bunriSchools = record?.schools?.filter((s) => s.department === '文理学科') ?? [];
    expect(bunriSchools.length).toBe(10);
    for (const s of bunriSchools) {
      expect(s.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'C', eigo: 'C' });
      expect(s.ratioType).toBe('I');
    }
  });

  it('osaka: 桜和(教育文理学科・一般)はCBB問題・倍率タイプIIを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '桜和', '一般');
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'B', eigo: 'B' });
    expect(record?.ratioType).toBe('II');
  });

  it('osaka: 枚岡樟風(総合学科・一般)はAAA問題・倍率タイプIVを持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '枚岡樟風',
      '一般'
    );
    expect(record?.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
    expect(record?.ratioType).toBe('IV');
  });

  it('osaka: 大手前は全日制(文理学科・CCC/I)と定時制(定時制の課程(普通科)・AAA/III)で別レコードを持つ', () => {
    const zenjitsu = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '大手前',
      '一般',
      '文理学科'
    );
    const teijisei = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '大手前',
      '一般',
      '定時制の課程(普通科)'
    );
    expect(zenjitsu?.examSubjectTypes).toEqual({ kokugo: 'C', suugaku: 'C', eigo: 'C' });
    expect(zenjitsu?.ratioType).toBe('I');
    expect(teijisei?.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
    expect(teijisei?.ratioType).toBe('III');
  });

  it('osaka: department省略時のfindSchoolSelectionRecordは最初に見つかった1件を返す(大手前は文理学科が先)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka', '大手前', '一般');
    expect(record?.department).toBe('文理学科');
  });

  it('osaka: 定時制の課程は全校がAAA問題・倍率タイプIIIで統一されている', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka');
    const teijiseiSchools =
      record?.schools?.filter((s) => s.department.startsWith('定時制の課程')) ?? [];
    expect(teijiseiSchools.length).toBe(18);
    for (const s of teijiseiSchools) {
      expect(s.examSubjectTypes).toEqual({ kokugo: 'A', suugaku: 'A', eigo: 'A' });
      expect(s.ratioType).toBe('III');
    }
  });

  it('osaka: 堺市立堺(定時制の課程(工業・商業に関する学科))は工業・商業両方の内容を1レコードに統合', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'osaka',
      '堺市立堺',
      '一般',
      '定時制の課程(工業・商業に関する学科)'
    );
    expect(record?.ratioType).toBe('III');
  });

  it('osaka: schoolsは144校を収録している(定時制の課程14校を追加)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'osaka');
    expect(record?.schools?.length).toBe(144);
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

  it('aichi: 守山(普通・一般)は面接実施ありで校内順位タイプIを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aichi', '守山', '一般');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toBe('I');
  });

  it('aichi: 旭丘(普通・一般)は面接なしで校内順位タイプVを持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'aichi',
      '旭丘',
      '一般',
      '普通'
    );
    expect(record?.interviewRequired).toBe(false);
    expect(record?.ratioType).toBe('V');
  });

  it('aichi: 旭丘(美術・一般)は普通科とは異なる校内順位タイプIを持つ(同一校名別学科)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'aichi',
      '旭丘',
      '一般',
      '美術'
    );
    expect(record?.ratioType).toBe('I');
  });

  it('structuredレコードのschoolsは1件以上を持つ', () => {
    for (const record of Object.values(SCHOOL_SELECTION_METHOD_BY_PREFECTURE)) {
      if (record?.status === 'structured') {
        expect(record.schools?.length).toBeGreaterThan(0);
      }
    }
  });
});
