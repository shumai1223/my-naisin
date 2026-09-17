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

  it('aichi: 内海(普通・一般)は面接実施ありで校内順位タイプIを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aichi', '内海', '一般');
    expect(record?.interviewRequired).toBe(true);
  });

  it('aichi: 豊田南(普通・一般)は令和9年度Vへ変更(令和8年度はIII)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aichi', '豊田南', '一般');
    expect(record?.ratioType).toBe('V');
    expect(record?.note).toContain('III');
  });

  it('aichi: schoolsは199レコードを収録している(3〜4頁目=一般選抜全校を完全収録・公式集計198校1校舎とほぼ一致)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aichi');
    expect(record?.schools?.length).toBe(199);
  });

  it('ibaraki: 日立第一(普通・サイエンス・一般)は面接実施ありで比率80:20を持つ', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'ibaraki',
      '日立第一',
      '一般'
    );
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toBe('80:20');
  });

  it('ibaraki: 水戸農業(農業・一般)は比率50:50を持つ(工業系より調査書重視)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'ibaraki',
      '水戸農業',
      '一般',
      '農業'
    );
    expect(record?.ratioType).toBe('50:50');
  });

  it('ibaraki: 茨城東(普通・一般)は比率30:70で調査書重視が学力検査を上回る', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'ibaraki', '茨城東', '一般');
    expect(record?.ratioType).toBe('30:70');
  });

  it('ibaraki: 石下紫峰(普通・一般)は比率40:60で調査書重視', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'ibaraki', '石下紫峰', '一般');
    expect(record?.ratioType).toBe('40:60');
  });

  it('ibaraki: schoolsは149レコードを収録している(別表1・全日制課程を完全収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'ibaraki');
    expect(record?.schools?.length).toBe(149);
  });

  it('yamanashi: 北杜(普通科・前期A)は特色適性検査を含む比重を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi', '北杜', '前期A', '普通科');
    expect(record?.ratioType).toBe('調査書45:面接30:所見5:特色適性検査20');
  });

  it('yamanashi: 甲府南(理数科・前期B)は特技を含む6項目中5項目の比重を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi', '甲府南', '前期B', '理数科');
    expect(record?.ratioType).toBe('調査書40:面接5:所見5:特色適性検査40:特技10');
  });

  it('yamanashi: 前期募集には学力検査が無いためexamSubjectTypesを持つレコードは1件もない', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi');
    for (const school of record?.schools ?? []) {
      expect(school.examSubjectTypes).toBeUndefined();
    }
  });

  it('yamanashi: 笛吹(普通科・前期A)は5教科の評定2倍を持つが農業系(2)・前期Aは学年別傾斜を持つ(同一校でも学科で傾斜が異なる)', () => {
    const seimon = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi', '笛吹', '前期A', '普通科');
    const nougyou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi', '笛吹', '前期A', '農業系(2)');
    expect(seimon?.note).toContain('5教科の評定2倍');
    expect(nougyou?.note).toContain('第1学年:第2学年:第3学年=1:2:3');
  });

  it('yamanashi: 吉田(理数科)は面接時間の記載がないが選抜資料比重には面接15点が計上されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi', '吉田', '前期', '理数科');
    expect(record?.ratioType).toBe('調査書30:面接15:所見5:特色適性検査50');
  });

  it('yamanashi: schoolsは79レコードを収録している(全2頁26校を完全収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamanashi');
    expect(record?.schools?.length).toBe(79);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.has('甲府商業')).toBe(true);
    expect(schoolNames.size).toBe(26);
  });

  it('gunma: 前橋(普通科・総合型選抜)は学力検査重視の割合を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '前橋', '総合型選抜', '普通科');
    expect(record?.ratioType).toBe('学力検査81%:面接等6%:調査書14%');
  });

  it('gunma: 前橋南(普通科・特色型選抜①)は調査書重視の割合を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '前橋南', '特色型選抜①', '普通科');
    expect(record?.ratioType).toBe('学力検査20%:面接等10%:調査書70%');
  });

  it('gunma: 勢多農林(特色型選抜①)は面接等重視の割合を持つ(農業系学科の実技意欲面接)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '勢多農林',
      '特色型選抜①',
      '植物科学科・植物デザイン科(くくり募集)/動物科学科(資源動物・応用動物)/緑地土木科/食品科学科'
    );
    expect(record?.ratioType).toBe('学力検査25%:面接等40%:調査書35%');
  });

  it('gunma: 前橋工業(特色型選抜)は他校と逆順で第1次選抜となる例外校', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '前橋工業',
      '特色型選抜',
      '機械科・電子機械科・電気科・電子科・建築科・土木科'
    );
    expect(record?.ratioType).toBe('学力検査46%:面接等27%:調査書27%');
  });

  it('gunma: 榛名(特色型選抜)は面接の割合が学力検査を上回る', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '榛名', '特色型選抜', '普通科');
    expect(record?.ratioType).toBe('学力検査29%:面接35%:調査書35%');
  });

  it('gunma: 高崎商業(特色型選抜①)は面接等の配点が学力検査を大きく上回る', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '高崎商業',
      '特色型選抜①',
      'くくり募集(グローバルビジネス科・会計ビジネス科・情報ビジネス科・総合ビジネス科)'
    );
    expect(record?.ratioType).toBe('学力検査25%:面接等60%:調査書15%');
  });

  it('gunma: 桐生(理数科・特色型選抜①)は数学・理科を重点配点する教科別配点の例外', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '桐生', '特色型選抜①', '理数科');
    expect(record?.note).toContain('数学300');
  });

  it('gunma: 伊勢崎興陽(特色型選抜②)は面接等の配点が調査書の4倍で最終選抜が実質面接重視', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '伊勢崎興陽', '特色型選抜②', '総合学科');
    expect(record?.ratioType).toBe('学力検査33%:面接等53%:調査書13%');
  });

  it('gunma: 伊勢崎工業(特色型選抜②)は面接等重視の割合を持つ(部活動意欲の個人面接)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '伊勢崎工業', '特色型選抜②', '機械科・電子機械科・電気科・工業化学科');
    expect(record?.ratioType).toBe('学力検査31%:面接等44%:調査書25%');
  });

  it('gunma: 尾瀬(特色型選抜)は面接等の割合が学力検査・調査書を上回る(自然環境科ホームステイ選考)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '尾瀬', '特色型選抜', '普通科・自然環境科');
    expect(record?.ratioType).toBe('学力検査30%:面接等40%:調査書31%');
  });

  it('gunma: 藤岡中央(特色型選抜②)は面接等の配点が学力検査を上回る', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '藤岡中央',
      '特色型選抜②',
      'くくり募集(普通科・理数科)'
    );
    expect(record?.ratioType).toBe('学力検査20%:面接等30%:調査書50%');
  });

  it('gunma: 安中総合学園(特色型選抜①)は面接等が過半数を占める最も面接偏重の例', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '安中総合学園', '特色型選抜①', '総合学科');
    expect(record?.ratioType).toBe('学力検査10%:面接等50%:調査書40%');
  });

  it('gunma: 吾妻中央は4学科間で相互に第2志望を認める(普通科・生物生産科・環境工学科・福祉科)', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '吾妻中央',
      '総合型選抜',
      '普通科・生物生産科・環境工学科・福祉科'
    );
    expect(record?.note).toContain('4学科間で相互に第2志望');
  });

  it('gunma: 西邑楽(スポーツ科・特色型選抜①)は実技検査を含む4項目のratioTypeを持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '西邑楽', '特色型選抜①', 'スポーツ科');
    expect(record?.ratioType).toBe('学力検査28%:面接等8%:調査書8%:実技検査56%');
  });

  it('gunma: 前橋市立前橋(市立高校)は県立校と同じ枠組みで選抜方法が定義されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma', '前橋市立前橋', '総合型選抜', '普通科');
    expect(record?.note).toContain('前橋市立高校');
  });

  it('gunma: 利根商業(組合立)は普通科→総合/情報ビジネス科への第2志望を認める', () => {
    const record = findSchoolSelectionRecord(
      SCHOOL_SELECTION_METHOD_BY_PREFECTURE,
      'gunma',
      '利根商業',
      '総合型選抜',
      '普通科・総合ビジネス科・情報ビジネス科'
    );
    expect(record?.note).toContain('群馬県外から普通科10人');
  });

  it('gunma: 「I 全日制課程選抜」63校を完全収録している(全66レコード超・頁2〜68完結)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gunma');
    expect(record?.schools?.length).toBe(160);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.has('前橋市立前橋')).toBe(true);
    expect(schoolNames.has('高崎経済大学附属')).toBe(true);
    expect(schoolNames.has('桐生市立商業')).toBe(true);
    expect(schoolNames.has('太田市立太田')).toBe(true);
    expect(schoolNames.has('利根商業')).toBe(true);
  });

  it('nagano: 飯山(スポーツ科学・前期選抜)は面接なしで実技検査50%を含む割合を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '飯山', '前期選抜', 'スポーツ科学');
    expect(record?.interviewRequired).toBe(false);
    expect(record?.ratioType).toBe('調査書40%:学力検査10%:実技検査50%');
  });

  it('nagano: 長野西(国際教養・前期選抜)は作文30%を含む割合を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '長野西', '前期選抜', '国際教養');
    expect(record?.ratioType).toBe('調査書40%:面接20%:学力検査10%:作文30%');
  });

  it('nagano: 長野商業は商業(前期選抜①)と会計(前期選抜②)で異なる割合を持つ', () => {
    const kaikei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '長野商業', '前期選抜②', '会計');
    expect(kaikei?.ratioType).toBe('調査書60%:面接30%:学力検査10%');
  });

  it('nagano: schoolsは第1通学区(北信地区)20校38レコードを収録している(第2〜6通学区は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano');
    expect(record?.schools?.length).toBe(38);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(20);
    expect(record?.coverageNote).toContain('第1通学区');
  });

  it('miyagi: 白石(看護科・共通選抜)は学力検査7:調査書3の比重を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyagi', '白石', '共通選抜', '看護科');
    expect(record?.ratioType).toBe('学力検査7:調査書3');
    expect(record?.interviewRequired).toBe(false);
  });

  it('miyagi: 白石工業(機械科・特色選抜)は面接・実技・作文のいずれも実施しない', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyagi', '白石工業', '特色選抜', '機械科');
    expect(record?.interviewRequired).toBe(false);
    expect(record?.ratioType).toBe('調査書390点:学力検査500点');
  });

  it('miyagi: 白石工業(機械科・第二次募集)の面接は4段階評価(A〜D)で他校の3段階(A〜C)と異なる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyagi', '白石工業', '第二次募集', '機械科');
    expect(record?.ratioType).toContain('4段階評価');
  });

  it('miyagi: schoolsは3校21レコードを収録している(白石工業は全5学科分)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyagi');
    expect(record?.schools?.length).toBe(21);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(3);
    const shiraishiKogyoDepartments = new Set(
      record?.schools?.filter((s) => s.schoolName === '白石工業').map((s) => s.department)
    );
    expect(shiraishiKogyoDepartments.size).toBe(5);
  });

  it('miyagi: 白石工業(電気科・共通選抜)は機械科と同じ比重(6:4)だが募集定員は40人(機械科は80人)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyagi', '白石工業', '共通選抜', '電気科');
    expect(record?.ratioType).toBe('学力検査6:調査書4');
    expect(record?.note).toContain('40人');
  });

  it('kagoshima: 鹿児島中央(普通・推薦入試)は自己推薦・学校推薦とも実施し面接ありと記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '鹿児島中央', '推薦入試', '普通');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('自己推薦・学校推薦とも実施');
  });

  it('kagoshima: 鹿児島女子(5学科)は学科間で推薦入試・学力検査・第二次選抜とも第3志望まで併願可能', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '鹿児島女子', '推薦入試', 'ライフ・スポーツ');
    expect(record?.note).toContain('第3志望まで');
  });

  it('kagoshima: schoolsは全7学区67校155レコードを収録している(楠隼のみ推薦入試の実態不明で除外)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima');
    expect(record?.schools?.length).toBe(155);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(67);
    expect(schoolNames.has('楠隼')).toBe(false);
    expect(record?.coverageNote).toContain('大島');
  });

  it('kagoshima: 鹿屋農業(農業)は6学科間で学力検査・第二次選抜とも第2志望まで併願できる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '鹿屋農業', '推薦入試', '農業');
    expect(record?.note).toContain('6学科間');
    expect(record?.note).toContain('第2志望まで');
  });

  it('kagoshima: 喜界(普通)は連携型中高一貫教育校入学者選抜のため通常の推薦入試定員%の記載がない', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '喜界', '推薦入試', '普通');
    expect(record?.note).toContain('連携型中高一貫');
  });

  it('kagoshima: 薩南工業(機械)は4学科間で学力検査を第4志望まで併願できる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '薩南工業', '推薦入試', '機械');
    expect(record?.note).toContain('第4志望まで');
  });

  it('kagoshima: 加治木工業(機械)は6学科間で推薦入試・学力検査を第3志望まで、第二次選抜は全学科で併願できる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kagoshima', '加治木工業', '推薦入試', '機械');
    expect(record?.note).toContain('6学科間');
    expect(record?.note).toContain('全学科');
  });

  it('kochi: 高知小津(理数科)はB日程でも学力検査の数学・理科が1.5倍の傾斜配点と記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi', '高知小津', 'B日程');
    expect(record?.note).toContain('1.5倍');
  });

  it('kochi: 須崎総合はB日程の面接がA日程より長い(6分→10分・表中最大の日程差)', () => {
    const aNittei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi', '須崎総合', 'A日程');
    const bNittei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi', '須崎総合', 'B日程');
    expect(aNittei?.note).toContain('6分間');
    expect(bNittei?.note).toContain('10分間');
  });

  it('kochi: schoolsは全日制32行(分校2件含む)64レコードを収録している(他課程は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi');
    expect(record?.schools?.length).toBe(64);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(30);
    expect(record?.coverageNote).toContain('定時制');
  });

  it('okayama: 瀬戸(普通)は特別入学者選抜でホッケーを重視する実績として記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '瀬戸', '特別入学者選抜', '普通');
    expect(record?.note).toContain('ホッケー');
  });

  it('okayama: 高松農業(畜産科学)は特別入学者選抜でレスリングまたは陸上競技を重視する実績として記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '高松農業', '特別入学者選抜', '畜産科学');
    expect(record?.note).toContain('レスリング');
  });

  it('okayama: schoolsは頁1の8校28レコードを完全収録している(頁2〜7は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    expect(record?.schools?.length).toBe(28);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(8);
    expect(record?.coverageNote).toContain('岡山一宮');
  });

  it('okayama: 岡山一宮(理数)は特別入学者選抜で数学検定準2級以上又は英語検定準2級以上合格を重視する実績としている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山一宮', '特別入学者選抜', '理数');
    expect(record?.note).toContain('数学検定準2級');
  });

  it('okayama: 岡山城東は普通・国際教養分野・音楽分野の一般入学者選抜が結合セルで共通のため同一内容が複製されている', () => {
    const futsuu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山城東', '一般入学者選抜', '普通');
    const ongaku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山城東', '一般入学者選抜', '音楽分野');
    expect(futsuu?.ratioType).toBe(ongaku?.ratioType);
    expect(futsuu?.note).toContain('結合セル');
  });

  it('aomori: 青森(普通科)は特色化選抜で学力検査の国語・数学・英語を1.5倍にする傾斜配点を行う', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森', '特色化選抜', '普通科');
    expect(record?.note).toContain('1.5倍');
    expect(record?.ratioType).toBe('学力検査650点:調査書180点:面接20点(合計850点)');
  });

  it('aomori: 青森北(普通科)は一般選抜で第2志望がスポーツ科学科の受検者に実技検査を実施する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森北', '一般選抜', '普通科');
    expect(record?.note).toContain('スポーツ科学科');
  });

  it('aomori: schoolsは東青地区・西北五地区・中弘南黒地区・上十三地区の分割版を完全収録している(32校129レコード・他2地区は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori');
    expect(record?.schools?.length).toBe(129);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(32);
    expect(record?.coverageNote).toContain('東青地区');
    expect(record?.coverageNote).toContain('西北五地区');
    expect(record?.coverageNote).toContain('中弘南黒地区');
    expect(record?.coverageNote).toContain('上十三地区');
  });

  it('aomori: 三沢は全日制(普通科)と定時制単位制(普通科(定時制・単位制))の同名2校を別学科名で区別して収録している', () => {
    const zennichi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '三沢', '一般選抜', '普通科');
    const teiji = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '三沢', '一般選抜', '普通科(定時制・単位制)');
    expect(zennichi?.note).not.toContain('単位制');
    expect(teiji?.note).toContain('単位制');
  });

  it('aomori: 三本木農業恵拓(普通科)の調査書は1〜3学年で傾斜する珍しい配点方式(1倍・2倍・3倍)を採る', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '三本木農業恵拓', '特色化選抜', '普通科');
    expect(record?.note).toContain('3学年合計の3倍');
  });

  it('aomori: 黒石(情報デザイン科)は実技検査(手の描画)を実施する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '黒石', '一般選抜', '情報デザイン科');
    expect(record?.note).toContain('描画');
  });

  it('aomori: 柏木農業(全学科)は「全国からの生徒募集」導入校で学科別に求める生徒像を定義している', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '柏木農業', '一般選抜', '全学科');
    expect(record?.note).toContain('全国からの生徒募集');
    expect(record?.note).toContain('生物生産科');
  });

  it('aomori: 五所川原は全日制(全学科)と定時制(普通科)の2レコード系統を別学科名で区別して収録している', () => {
    const zennichi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '五所川原', '一般選抜', '全学科');
    const teiji = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '五所川原', '一般選抜', '普通科');
    expect(zennichi?.note).not.toContain('定時制');
    expect(teiji?.note).toContain('定時制');
  });

  it('aomori: 鰺ヶ沢(普通科)は「全国からの生徒募集」導入校と明記されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '鰺ヶ沢', '一般選抜', '普通科');
    expect(record?.note).toContain('全国からの生徒募集');
  });

  it('aomori: 北斗(普通科)は定時制課程で面接結果を特に重視すると明記されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '北斗', '一般選抜', '普通科');
    expect(record?.note).toContain('定時制課程');
    expect(record?.note).toContain('特に重視');
  });

  it('aomori: 青森南(グローバル探究科)の一般選抜はスピーチ形式の個人面接を実施する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '青森南', '一般選抜', 'グローバル探究科');
    expect(record?.note).toContain('スピーチ');
  });

  it('structuredレコードのschoolsは1件以上を持つ', () => {
    for (const record of Object.values(SCHOOL_SELECTION_METHOD_BY_PREFECTURE)) {
      if (record?.status === 'structured') {
        expect(record.schools?.length).toBeGreaterThan(0);
      }
    }
  });
});
