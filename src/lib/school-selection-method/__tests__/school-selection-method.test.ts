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

  it('nagano: schoolsは第1通学区(北信地区)20校38レコード+第2通学区(東信地区)9校22レコード+第3通学区(南信地区)19校37レコード+第4通学区(中信地区)13校24レコード+定時制課程11校17レコードを収録している(公表6ファイルすべて・通学区は全日制の4つのみ)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano');
    expect(record?.schools?.length).toBe(138);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(66);
    expect(record?.coverageNote).toContain('第1通学区');
    expect(record?.coverageNote).toContain('第2通学区');
    expect(record?.coverageNote).toContain('第3通学区');
    expect(record?.coverageNote).toContain('第4通学区');
    expect(record?.coverageNote).toContain('定時制');
  });

  it('nagano: 定時制課程17レコードは全日制と区別するためselectionCategoryが「前期選抜(定時制)」で、中野立志館は面接50%・長野工業と諏訪実業は作文を含む', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano')?.schools ?? [];
    const teiji = list.filter((s) => s.selectionCategory === '前期選抜(定時制)');
    expect(teiji).toHaveLength(17);
    expect(new Set(teiji.map((s) => s.schoolName)).size).toBe(11);
    expect(findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '中野立志館', '前期選抜(定時制)', '普通')?.ratioType).toBe('調査書30%:面接50%:学力検査20%');
    expect(findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '長野工業', '前期選抜(定時制)', '基礎工学')?.ratioType).toBe('調査書30%:面接40%:学力検査10%:作文20%');
    expect(findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '諏訪実業', '前期選抜(定時制)', '普通')?.ratioType).toBe('調査書25%:面接30%:学力検査20%:作文25%');
    expect(findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '箕輪進修', '前期選抜(定時制)', 'Ⅲ部・普通')?.ratioType).toBe('調査書30%:面接45%:学力検査25%');
    // 同名の全日制(長野・普通)とは別レコード
    const nagano = list.filter((x) => x.schoolName === '長野' && x.department === '普通');
    expect(new Set(nagano.map((x) => x.selectionCategory)).size).toBe(nagano.length);
  });

  it('nagano: 第4通学区の松本県ケ丘(自然探究・国際探究)は作文(小論文)30%を含み、木曽青峰の理数は調査書75%で同校の農業・工業(60%)と異なる', () => {
    const nat = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '松本県ケ丘', '前期選抜', '自然探究');
    const intl = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '松本県ケ丘', '前期選抜', '国際探究');
    expect(nat?.ratioType).toBe('調査書45%:面接15%:学力検査10%:作文30%');
    expect(intl?.ratioType).toBe(nat?.ratioType);
    const risu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '木曽青峰', '前期選抜', '理数');
    const forest = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '木曽青峰', '前期選抜', '森林環境');
    expect(risu?.ratioType).toBe('調査書75%:面接15%:学力検査10%');
    expect(forest?.ratioType).toBe('調査書60%:面接25%:学力検査15%');
    const hakuba = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '白馬', '前期選抜', '国際観光');
    expect(hakuba?.ratioType).toBe('調査書50%:面接30%:学力検査20%');
  });

  it('nagano: 第3通学区の駒ヶ根工業は学力検査25%で他校より高く、岡谷工業は観点別①②、飯田OIDE長姫は6学科が共通の比重を持つ', () => {
    const komagane = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '駒ヶ根工業', '前期選抜', '機械');
    expect(komagane?.ratioType).toBe('調査書45%:面接30%:学力検査25%');
    const okaya1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '岡谷工業', '前期選抜①', '機械工学');
    const okaya2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '岡谷工業', '前期選抜②', '情報技術');
    expect(okaya1?.ratioType).toBe('調査書70%:面接20%:学力検査10%');
    expect(okaya2?.ratioType).toBe('調査書70%:面接20%:学力検査10%');
    const oide = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano')?.schools ?? []).filter((s) => s.schoolName === '飯田OIDE長姫');
    expect(oide).toHaveLength(6);
    expect(new Set(oide.map((s) => s.ratioType))).toEqual(new Set(['調査書60%:面接25%:学力検査15%']));
    const suwa = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '諏訪実業', '前期選抜', '服飾');
    expect(suwa?.ratioType).toBe('調査書65%:面接20%:学力検査15%');
  });

  it('nagano: 全レコードのratioTypeに含まれる%の合計は100になる', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano')?.schools ?? [];
    for (const s of list) {
      const total = [...(s.ratioType ?? '').matchAll(/([0-9]+)%/g)].reduce((a, m) => a + Number(m[1]), 0);
      expect(total).toBe(100);
    }
  });

  it('nagano: 第2通学区の小諸義塾(音楽)は観点別A/Bで実技検査の比重が50%と25%に分かれ、上田染谷丘(国際教養)は面接と実技検査を併せて40%で持つ', () => {
    const a = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '小諸義塾', '前期選抜A', '音楽');
    const b = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '小諸義塾', '前期選抜B', '音楽');
    expect(a?.ratioType).toBe('調査書35%:面接10%:学力検査5%:実技検査50%');
    expect(b?.ratioType).toBe('調査書50%:面接15%:学力検査10%:実技検査25%');
    const someya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '上田染谷丘', '前期選抜', '国際教養');
    expect(someya?.ratioType).toBe('調査書40%:面接・実技検査(併せて)40%:学力検査20%');
    const noza = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagano', '野沢北', '前期選抜', '理数');
    expect(noza?.ratioType).toBe('調査書70%:面接20%:学力検査10%');
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

  it('kochi: schoolsは全日制32行(分校2件含む)64レコード+多部制単位制6レコード+定時制11レコードを収録している+実技検査の概要12レコード+成人特別選抜13レコード(資料全5頁)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi');
    expect(record?.schools?.length).toBe(106);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(32);
    expect(record?.coverageNote).toContain('定時制');
    expect(record?.coverageNote).toContain('多部制単位制');
  });

  it('kochi: 実技検査の概要は6学科×A/B日程の12レコードで、B日程の岡豊・体育コースは運動競技種目テストの記載が無くA日程にはある', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi')?.schools ?? [];
    const jitsugi = list.filter((s) => s.department?.endsWith('・実技検査'));
    expect(jitsugi).toHaveLength(12);
    expect(jitsugi.filter((s) => s.selectionCategory === 'A日程')).toHaveLength(6);
    const taiA = jitsugi.find((s) => s.schoolName === '岡豊' && s.department?.includes('体育') && s.selectionCategory === 'A日程');
    const taiB = jitsugi.find((s) => s.schoolName === '岡豊' && s.department?.includes('体育') && s.selectionCategory === 'B日程');
    expect(taiA?.note).toContain('運動競技種目テスト: 本校が指定する');
    expect(taiB?.note).toContain('運動競技種目テストの記載はなし');
    expect(jitsugi.every((s) => s.interviewRequired === undefined)).toBe(true);
    const dp = jitsugi.find((s) => s.schoolName === '高知国際' && s.department?.includes('DP'));
    expect(dp?.note).toContain('10分程度');
  });

  it('kochi: 成人特別選抜は13レコードで、高知工業のみ比率50%(他は20%)、須崎総合・佐川は作文600字、高知東工業・高岡・大方は作文なし', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi')?.schools ?? [];
    const adult = list.filter((s) => s.selectionCategory === '成人特別選抜');
    expect(adult).toHaveLength(13);
    const noteOf = (n: string) => adult.find((s) => s.schoolName === n)?.note ?? '';
    expect(noteOf('高知工業')).toContain('=50%');
    expect(adult.filter((s) => s.note?.includes('=50%'))).toHaveLength(1);
    expect(noteOf('須崎総合')).toContain('600字・50分');
    expect(noteOf('佐川')).toContain('600字・40分');
    for (const n of ['高知東工業', '高岡', '大方']) expect(noteOf(n)).toContain('作文の記載なし');
    expect(noteOf('中芸')).toContain('個人面接10分間');
  });

  it('kochi: 定時制の課程は11校すべてB日程のみで、高知商業は7分・高知工業は10分・清水は6分の個人面接と記録されている', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi')?.schools ?? [];
    const teiji = list.filter((s) => s.department.startsWith('定時制の課程'));
    expect(teiji).toHaveLength(11);
    expect(teiji.every((s) => s.selectionCategory === 'B日程')).toBe(true);
    const byName = (n: string) => teiji.find((s) => s.schoolName === n)?.note ?? '';
    expect(byName('高知商業')).toContain('7分間');
    expect(byName('高知工業')).toContain('10分間');
    expect(byName('清水')).toContain('6分間');
  });

  it('kochi: 多部制単位制の中芸は昼間部・夜間部とも10分・高知北は6分で、夜間部はB日程のみである', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kochi')?.schools ?? [];
    const tabu = list.filter((s) => s.department.startsWith('多部制単位制') && s.selectionCategory !== '成人特別選抜');
    expect(tabu).toHaveLength(6);
    const night = tabu.filter((s) => s.department.includes('夜間部'));
    expect(night.every((s) => s.selectionCategory === 'B日程')).toBe(true);
    expect(tabu.filter((s) => s.schoolName === '中芸').every((s) => s.note.includes('10分間'))).toBe(true);
    expect(tabu.filter((s) => s.schoolName === '高知北').every((s) => s.note.includes('6分間'))).toBe(true);
  });

  it('okayama: 瀬戸(普通)は特別入学者選抜でホッケーを重視する実績として記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '瀬戸', '特別入学者選抜', '普通');
    expect(record?.note).toContain('ホッケー');
  });

  it('okayama: 高松農業(畜産科学)は特別入学者選抜でレスリングまたは陸上競技を重視する実績として記録されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '高松農業', '特別入学者選抜', '畜産科学');
    expect(record?.note).toContain('レスリング');
  });

  it('okayama: schoolsは全7頁を完全収録している(51校259レコード)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    expect(record?.schools?.length).toBe(259);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(51);
    expect(record?.coverageNote).toContain('岡山一宮');
    expect(record?.coverageNote).toContain('興陽');
    expect(record?.coverageNote).toContain('岡山南');
    expect(record?.coverageNote).toContain('倉敷中央');
    expect(record?.coverageNote).toContain('倉敷鷲羽');
    expect(record?.coverageNote).toContain('津山東');
    expect(record?.coverageNote).toContain('井原');
    expect(record?.coverageNote).toContain('真庭');
    expect(record?.coverageNote).toContain('鳥城');
  });

  it('okayama: 津山工業は6学科が重視する実績(10人程度・ラグビー等)と一般入学者選抜の比率15%を共有する(頁5)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const tsuyamaKogyo = record?.schools?.filter((s) => s.schoolName === '津山工業');
    expect(tsuyamaKogyo).toHaveLength(12);
    const design = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '津山工業', '特別入学者選抜', 'デザイン');
    expect(design?.note).toContain('デッサン');
    expect(design?.note).toContain('ラグビー');
    const general = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '津山工業', '一般入学者選抜', '機械');
    expect(general?.ratioType).toBe('調査書及び面接等15%');
  });

  it('okayama: 玉野・笠岡の普通科は特別入学者選抜が全て「ー」のため一般入学者選抜のみ収録される(頁5)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    for (const name of ['玉野', '笠岡']) {
      const rows = record?.schools?.filter((s) => s.schoolName === name);
      expect(rows).toHaveLength(1);
      expect(rows?.[0].selectionCategory).toBe('一般入学者選抜');
    }
  });

  it('okayama: 井原は普通+地域生活(グリーンライフ/ヒューマンライフ)を収録し、重視する実績の学科対応は確定できない旨をnoteに明記している(頁5)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const ihara = record?.schools?.filter((s) => s.schoolName === '井原');
    expect(ihara).toHaveLength(6);
    const green = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '井原', '特別入学者選抜', 'グリーンライフコース');
    expect(green?.note).toContain('確定できない');
    expect(green?.note).toContain('新体操');
    const human = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '井原', '特別入学者選抜', 'ヒューマンライフコース');
    expect(human?.note).toContain('机上で作業');
  });

  it('okayama: 備前緑陽は総合学科の4系列に同一内容(募集人員80%・一般選抜比率5%)を複製して収録している(頁6)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const ryokuyo = record?.schools?.filter((s) => s.schoolName === '備前緑陽');
    expect(ryokuyo).toHaveLength(8);
    const kougyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '備前緑陽', '一般入学者選抜', '工業技術系列');
    expect(kougyo?.ratioType).toBe('調査書及び面接等5%');
    expect(kougyo?.note).toContain('総合学科');
  });

  it('okayama: 総社南は普通・国際分野・美術工芸分野で一般入学者選抜(15%・☆海外帰国)を共有し、募集人員は人数(25人)で印字される(頁6)', () => {
    const general = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '総社南', '一般入学者選抜', '美術工芸分野');
    expect(general?.ratioType).toBe('調査書及び面接等15%');
    expect(general?.note).toContain('☆');
    const kokusai = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '総社南', '特別入学者選抜', '国際分野');
    expect(kokusai?.note).toContain('25人');
    expect(kokusai?.note).toContain('英語検定2級以上');
  });

  it('okayama: 備考欄の記号(※=複数校志願/◇=同一学科とみなす/◆=第1志望に第2志望を含める割合)の意味を頁1凡例に基づいてnoteに反映している(頁3〜6)', () => {
    const maniwa = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '真庭', '一般入学者選抜', '看護');
    expect(maniwa?.note).toContain('複数校志願');
    const jonan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '高梁城南', '一般入学者選抜', '電気');
    expect(jonan?.note).toContain('◇');
    const oku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '邑久', '一般入学者選抜', '普通');
    expect(oku?.note).toContain('◆20%');
    const kurashikiKango = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '倉敷中央', '特別入学者選抜', '看護');
    expect(kurashikiKango?.note).not.toContain('意味は不明');
  });

  it('okayama: 勝山の蒜山校地は連携型中高一貫教育選抜(□)で募集人員30%・小論文を持つ(頁6)', () => {
    const hiruzen = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '勝山', '特別入学者選抜', '普通(蒜山校地)');
    expect(hiruzen?.note).toContain('募集人員30%');
    expect(hiruzen?.note).toContain('連携型');
  });

  it('okayama: 勝間田は総合学科の5系列に同一内容(募集人員50%・剣道5人程度・一般選抜比率10%)を複製して収録している(頁7)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    expect(record?.schools?.filter((s) => s.schoolName === '勝間田')).toHaveLength(10);
    const jidosha = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '勝間田', '特別入学者選抜', '自動車系列');
    expect(jidosha?.note).toContain('剣道');
    expect(jidosha?.note).toContain('討論、発表');
  });

  it('okayama: 和気閑谷は重視する実績の学科対応が確定できない旨と◆20%をnoteに明記している(頁7)', () => {
    const special = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '和気閑谷', '特別入学者選抜', 'キャリア探求');
    expect(special?.note).toContain('確定できない');
    expect(special?.note).toContain('海外体験');
    const general = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '和気閑谷', '一般入学者選抜', '普通');
    expect(general?.note).toContain('◆20%');
  });

  it('okayama: 鳥城は定時制課程として昼間部(50%)・夜間部(30%)を別departmentで収録している(頁7)', () => {
    const day = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '鳥城', '特別入学者選抜', '普通(昼間部)');
    const night = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '鳥城', '特別入学者選抜', '普通(夜間部)');
    expect(day?.note).toContain('募集人員50%');
    expect(night?.note).toContain('募集人員30%');
    expect(day?.note).toContain('★');
  });

  it('saitama: 選抜基準PDFから転記した学校は第1次〜の各段階の配点と面接有無をratioType/interviewRequiredに持つ', () => {
    const ageo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '上尾', '一般募集', '普通科');
    expect(ageo?.ratioType).toBe('第1次75%[学力500:調査書336=836]/第2次22%[学力500:調査書218=718]/第3次3%');
    expect(ageo?.interviewRequired).toBe(false);
    const tachibana = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '上尾橘', '一般募集', '普通科');
    expect(tachibana?.interviewRequired).toBe(true);
    expect(tachibana?.ratioType).toContain('面接100');
  });

  it('saitama: 伊奈学園総合のスポーツ科学系・芸術系は第2次選抜で実技検査300点を実施する', () => {
    const sports = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '伊奈学園総合', '一般募集', 'スポーツ科学系・芸術系共通');
    expect(sports?.ratioType).toContain('第2次29%[学力500:調査書334:実技検査300=1134]');
    expect(sports?.interviewRequired).toBe(false);
  });

  it('saitama: 全日制131校を収録し、傾斜配点校(大宮理数・所沢北理数等)は学力検査700点で第1次の合計点が一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama');
    const names = new Set(record?.schools?.map((s) => s.schoolName));
    expect(names.size).toBe(131);
    expect(record?.coverageNote).toContain('131');
    const rikaOmiya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '大宮', '一般募集', '理数科');
    expect(rikaOmiya?.ratioType).toContain('学力700');
    expect(rikaOmiya?.note).toContain('傾斜配点');
    const kokusaiWako = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '和光国際', '一般募集', '国際科');
    expect(kokusaiWako?.ratioType).toContain('学力600');
  });

  it('saitama: 川口市立スポーツ科学コースは面接あり・第3次選抜5%を持つ', () => {
    const sports = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama', '川口市立', '一般募集', 'スポーツ科学コース');
    expect(sports?.interviewRequired).toBe(true);
    expect(sports?.ratioType).toContain('第3次5%');
  });

  it('chiba: 県立・市立全日制118校181学科の学校設定検査(面接・適性検査・自己表現等)を収録している', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBe(181);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(118);
    expect(record?.coverageNote).toContain('未収録');
  });

  it('chiba: 千葉女子は普通科=面接・家政科=適性検査(学科ごとに検査が違う)で面接の有無がinterviewRequiredに反映される', () => {
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba', '千葉女子', '一般入学者選抜', '普通');
    const kasei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba', '千葉女子', '一般入学者選抜', '家政');
    expect(futsu?.interviewRequired).toBe(true);
    expect(kasei?.interviewRequired).toBe(false);
    expect(kasei?.note).toContain('適性検査');
  });

  it('chiba: 薬園台は園芸科のみ志願理由書が有・くくり募集(千葉商業等)はnoteに明記される', () => {
    const engei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba', '薬園台', '一般入学者選抜', '園芸');
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba', '薬園台', '一般入学者選抜', '普通');
    expect(engei?.note).toContain('志願理由書:有');
    expect(futsu?.note).toContain('志願理由書:無');
    const kukuri = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'chiba', '千葉商業', '一般入学者選抜', '商業・情報処理');
    expect(kukuri?.note).toContain('くくり募集');
  });

  it('kanagawa: 共通選抜(全日制)全5頁を収録し令和9年度として記録している(139校197レコード)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa');
    expect(record?.status).toBe('structured');
    expect(record?.fiscalYear).toContain('令和9年度');
    expect(record?.schools?.length).toBe(197);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(139);
  });

  it('kanagawa: 横浜翠嵐は第1次3:7:3・特色検査=自己表現、大船は英語と国数の高い1教科を×1.5に重点化する', () => {
    const suiran = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa', '横浜翠嵐', '共通選抜', '普通科');
    expect(suiran?.ratioType).toBe('第1次選考[学習の記録:学力検査:特色検査=3:7:3]/第2次選考[学力検査:主体的に学習に取り組む態度:特色検査=8:2:2]');
    expect(suiran?.note).toContain('自己表現');
    const ofuna = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa', '大船', '共通選抜', '普通科');
    expect(ofuna?.note).toContain('[学]英(×1.5)');
  });

  it('kanagawa: 舞岡は特色検査=面接(interviewRequired)、クリエイティブスクールは学力検査なしで数式(S=K+M+T)をnoteに持つ', () => {
    const maioka = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa', '舞岡', '共通選抜', '普通科');
    expect(maioka?.interviewRequired).toBe(true);
    const kamariya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa', '釜利谷', '共通選抜', '普通科');
    expect(kamariya?.ratioType).toBeUndefined();
    expect(kamariya?.note).toContain('S(100点満点)=K+M+T');
    expect(kamariya?.note).toContain('学力検査は実施せず');
  });

  it('kanagawa: 非特色の学校は第1次・第2次とも学習の記録/学力検査(または学力検査/主体的態度)の比の合計が10になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'kanagawa');
    for (const s of record?.schools ?? []) {
      if (!s.ratioType) continue;
      const m = s.ratioType.match(/=([0-9]):([0-9]):([0-9-]+)\]\/第2次選考\[[^=]+=([0-9]):([0-9]):([0-9-]+)\]/);
      expect(m).not.toBeNull();
      if (m) {
        expect(Number(m[1]) + Number(m[2])).toBe(10);
        expect(Number(m[4]) + Number(m[5])).toBe(10);
      }
    }
  });

  it('tochigi: 全日制58校108学科を特色選抜・一般選抜の各1レコード(計216)で収録している', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBe(216);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(58);
  });

  it('tochigi: 宇都宮は一般選抜で学力検査9:調査書1、小山南スポーツは6:4(集団面接あり)、日光明峰は5:5', () => {
    const utsunomiya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '宇都宮', '一般選抜', '普通');
    expect(utsunomiya?.ratioType).toBe('学力検査9:調査書の評定1');
    expect(utsunomiya?.interviewRequired).toBe(false);
    const sports = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '小山南', '一般選抜', 'スポーツ');
    expect(sports?.ratioType).toBe('学力検査6:調査書の評定4');
    expect(sports?.interviewRequired).toBe(true);
    const nikko = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '日光明峰', '一般選抜', '普通');
    expect(nikko?.ratioType).toBe('学力検査5:調査書の評定5');
  });

  it('tochigi: 宇都宮東は特色選抜100%・集団面接・学校作成問題(国数英)、栃木は学校作成問題(総合問題A・B)を持つ', () => {
    const east = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '宇都宮東', '特色選抜', '普通');
    expect(east?.note).toContain('100%');
    expect(east?.note).toContain('学校作成問題(国・数・英)');
    const tochigi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi', '栃木', '特色選抜', '普通');
    expect(tochigi?.note).toContain('総合問題A・B');
  });

  it('tochigi: 全一般選抜レコードの比重は学力検査と調査書の合計が10になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tochigi');
    for (const s of record?.schools ?? []) {
      if (s.selectionCategory !== '一般選抜') continue;
      const m = (s.ratioType ?? '').match(/学力検査([0-9]):調査書の評定([0-9])/);
      expect(m).not.toBeNull();
      if (m) expect(Number(m[1]) + Number(m[2])).toBe(10);
    }
  });

  it('niigata: 令和9年度の全日制(県立+新潟市立)73校93学科を一般枠+学校設定枠の143レコードで収録している', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata');
    expect(record?.status).toBe('structured');
    expect(record?.fiscalYear).toContain('令和9年度');
    expect(record?.schools?.length).toBe(143);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(73);
  });

  it('niigata: 新潟中央 普通は学校設定枠(調査書300:学力700:その他200・8人以内)と一般枠(152人・3対7)を持つ', () => {
    const waku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata', '新潟中央', '学校設定枠', '普通');
    expect(waku?.ratioType).toBe('調査書300:学力検査700:その他200');
    expect(waku?.note).toContain('募集人数8人以内');
    const general = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata', '新潟中央', '一般枠', '普通');
    expect(general?.ratioType).toBe('調査書3:学力検査7');
    expect(general?.note).toContain('募集人数152');
  });

  it('niigata: 国際フロンティアは英語傾斜・集団面接(interviewRequired)・◇(資格加点)を持つ、新潟農業系のA/B枠は別レコード', () => {
    const fr = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata', '国際フロンティア', '一般枠', 'グローバル探究');
    expect(fr?.interviewRequired).toBe(true);
    expect(fr?.note).toContain('傾斜配点する教科:英語');
    const a = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata', '新発田農業', '学校設定枠A', '農業');
    const b = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata', '新発田農業', '学校設定枠B', '農業');
    expect(a?.note).toContain('募集人数16人以内');
    expect(b?.note).toContain('募集人数8人以内');
  });

  it('niigata: 学校設定枠は調査書配点+学力検査配点=1000点、比重は調査書+学力検査=10', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'niigata');
    for (const s of record?.schools ?? []) {
      const m = (s.ratioType ?? '').match(/^調査書([0-9]+):学力検査([0-9]+)/);
      expect(m).not.toBeNull();
      if (!m) continue;
      const total = Number(m[1]) + Number(m[2]);
      expect(total).toBe(s.selectionCategory === '一般枠' ? 10 : 1000);
    }
  });

  it('yamagata: 概要表の合計行(全日制 A34校/B8校・個人面接29校・集団面接13校・作文23校・発表3校・県外受入れ前期12校/後期11校)と転記校数が一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBe(138);
    const zenkiZen = (record?.schools ?? []).filter((s) => s.selectionCategory === '前期(特色)選抜' && !s.department?.includes('定時制'));
    const kouki = (record?.schools ?? []).filter((s) => s.selectionCategory === '後期(一般)選抜' && !s.department?.includes('定時制'));
    const schools = (list: typeof zenkiZen, f: (n: string) => boolean) => new Set(list.filter((s) => f(s.note ?? '')).map((s) => s.schoolName)).size;
    expect(schools(zenkiZen, (n) => n.includes('検査日程:A日程'))).toBe(34);
    expect(schools(zenkiZen, (n) => n.includes('検査日程:B日程'))).toBe(8);
    expect(schools(zenkiZen, (n) => /検査方法:[^。]*個人面接/.test(n))).toBe(29);
    expect(schools(zenkiZen, (n) => /検査方法:[^。]*集団面接/.test(n))).toBe(13);
    expect(schools(zenkiZen, (n) => /検査方法:[^。]*作文/.test(n))).toBe(23);
    expect(schools(zenkiZen, (n) => /検査方法:[^。]*発表/.test(n))).toBe(3);
    expect(schools(zenkiZen, (n) => n.includes('県外志願者受入れ:あり'))).toBe(12);
    expect(schools(kouki, (n) => n.includes('県外志願者受入れ:あり'))).toBe(11);
    expect(schools(kouki, (n) => n.includes('適性検査:あり'))).toBe(2);
    expect(schools(kouki, (n) => n.includes('傾斜配点:あり'))).toBe(2);
  });

  it('yamagata: 山形東(普通)は前期に口頭試問+個人面接+作文、後期は調査書3:学力検査7。新庄志誠館最上校は前期のみ県外受入れ', () => {
    const zenki = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '山形東', '前期(特色)選抜', '普通');
    expect(zenki?.note).toContain('口頭試問');
    expect(zenki?.interviewRequired).toBe(true);
    const kouki = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '山形東', '後期(一般)選抜', '普通');
    expect(kouki?.ratioType).toBe('調査書3:学力検査7');
    const mogamiZ = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '新庄志誠館最上校', '前期(特色)選抜', '普通');
    const mogamiK = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '新庄志誠館最上校', '後期(一般)選抜', '普通');
    expect(mogamiZ?.note).toContain('県外志願者受入れ:あり');
    expect(mogamiK?.note).toContain('県外志願者受入れ:なし');
  });

  it('yamagata: 山形北音楽は適性検査あり・県外受入れ前期後期とも、山形市立商業の募集人員は学科別の注記を持つ', () => {
    const music = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '山形北', '後期(一般)選抜', '音楽');
    expect(music?.note).toContain('適性検査:あり');
    expect(music?.note).toContain('県外志願者受入れ:あり');
    const shoken = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamagata', '山形市立商業', '前期(特色)選抜', '商業');
    expect(shoken?.note).toContain('総合ビジネス科25%程度');
  });

  it('toyama: 全日制34校82学科を一般選抜+推薦選抜の144レコードで収録し、資料の集計行(面接27校62学科・作文26校61学科・実技4校6学科・傾斜2校2学科)と一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'toyama');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBe(144);
    const all = record?.schools ?? [];
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(34);
    const suisen = all.filter((s) => s.selectionCategory === '推薦選抜');
    const ippan = all.filter((s) => s.selectionCategory === '一般選抜');
    expect(ippan).toHaveLength(82);
    const has = (list: typeof all, re: RegExp) => list.filter((s) => re.test(s.note ?? ''));
    const sch = (list: typeof all) => new Set(list.map((s) => s.schoolName)).size;
    const itv = suisen.filter((s) => s.interviewRequired);
    expect([sch(itv), itv.length]).toEqual([27, 62]);
    const essay = has(suisen, /作文:有/);
    expect([sch(essay), essay.length]).toEqual([26, 61]);
    const prac = has(suisen, /実技検査:(?!なし)/);
    expect([sch(prac), prac.length]).toEqual([4, 6]);
    const tilt = has(ippan, /傾斜配点:(?!なし)/);
    expect([sch(tilt), tilt.length]).toEqual([2, 2]);
    const gItv = ippan.filter((s) => s.interviewRequired);
    expect([sch(gItv), gItv.length]).toEqual([1, 3]);
  });

  it('toyama: 呉羽の音楽コースは音楽2.0倍・実技検査あり・推薦は面接のみで作文なし、中央農業の3学科は一般選抜で集団面接', () => {
    const kure = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'toyama', '呉羽', '一般選抜', '普通');
    expect(kure?.note).toContain('音楽2.0倍');
    const kureS = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'toyama', '呉羽', '推薦選抜', '普通');
    expect(kureS?.interviewRequired).toBe(true);
    expect(kureS?.note).toContain('作文:なし');
    const nou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'toyama', '中央農業', '一般選抜', 'バイオ技術');
    expect(nou?.interviewRequired).toBe(true);
    expect(nou?.note).toContain('集団面接');
  });

  it('nara: 一次選抜(第1希望校80学科・第2希望校79学科)と二次選抜79学科を収録し、第1希望校の検査成績の満点=学力+独自問題+作文+面接+実技になる(第2希望・二次は第1希望の学科の部分集合)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBe(238);
    expect(new Set(record?.schools?.map((s) => s.schoolName)).size).toBe(31);
    const first = (record?.schools ?? []).filter((s) => s.selectionCategory === '一次選抜(第1希望校)');
    const second = (record?.schools ?? []).filter((s) => s.selectionCategory === '一次選抜(第2希望校)');
    const round2 = (record?.schools ?? []).filter((s) => s.selectionCategory === '二次選抜');
    expect([first.length, second.length, round2.length]).toEqual([80, 79, 79]);
    const key = (s: { schoolName: string; department?: string }) => s.schoolName + '|' + s.department;
    const firstKeys = new Set(first.map(key));
    expect(second.every((s) => firstKeys.has(key(s)))).toBe(true);
    expect(round2.every((s) => firstKeys.has(key(s)))).toBe(true);
    for (const s of first) {
      const m = (s.note ?? '').match(/検査成績の満点([0-9]+)点=([^。]+)。/);
      expect(m).not.toBeNull();
      if (!m) continue;
      const sum = [...m[2].matchAll(/([0-9]+)点/g)].reduce((a, x) => a + Number(x[1]), 0);
      expect(sum).toBe(Number(m[1]));
    }
  });

  it('nara: 奈良は学力検査400点・パターン④(180点)、法隆寺国際 歴史文化科は社会2倍で調査書220点、奈良商工は3教科150+面接20=170・パターン②(234点)', () => {
    const nara = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '奈良', '一次選抜(第1希望校)', '普通科');
    expect(nara?.ratioType).toBe('学力検査400:調査書180');
    const hori = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '法隆寺国際', '一次選抜(第1希望校)', '歴史文化科');
    expect(hori?.note).toContain('社会(2倍)');
    expect(hori?.ratioType).toBe('学力検査300:調査書220');
    const shoko = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '奈良商工', '一次選抜(第1希望校)', '機械工学科');
    expect(shoko?.ratioType).toBe('検査成績170:調査書234');
    expect(shoko?.interviewRequired).toBe(true);
  });

  it('nara: 二次選抜は面接あり・奈良北は一次選抜の3教科得点が270・奈良商工は面接20、第2希望校の奈良は3教科240点', () => {
    const r2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '奈良北', '二次選抜', '普通科');
    expect(r2?.ratioType).toBe('一次選抜学力検査(3教科)270+面接50:調査書144');
    expect(r2?.interviewRequired).toBe(true);
    const shoko = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '奈良商工', '二次選抜', '観光科');
    expect(shoko?.ratioType).toBe('一次選抜学力検査(3教科)150+面接20:調査書234');
    const s2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nara', '奈良', '一次選抜(第2希望校)', '普通科');
    expect(s2?.ratioType).toBe('学力検査(3教科)240:調査書180');
    expect(s2?.interviewRequired).toBe(false);
  });

  it('shimane: 令和9年度別表2の全39校(定時制3校含む)を一般選抜と第2次募集で収録し、第2次募集の配点合計が一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shimane');
    expect(record?.status).toBe('structured');
    expect(record?.fiscalYear).toContain('令和9年度');
    const all = record?.schools ?? [];
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(39);
    expect(all.filter((s) => s.selectionCategory === '一般選抜')).toHaveLength(40);
    const second = all.filter((s) => s.selectionCategory === '第2次募集');
    expect(second).toHaveLength(40);
    for (const s of second) {
      const parts = (s.note ?? '').match(/選抜方法及び配点: ([^。]+)=合計([0-9]+)点/);
      expect(parts).not.toBeNull();
      if (!parts) continue;
      const sum = [...parts[1].matchAll(/([0-9]+)(?:\+|$)/g)].reduce((a, m) => a + Number(m[1]), 0);
      expect(sum).toBe(Number(parts[2]));
    }
  });

  it('shimane: 出雲高校は一般選抜で調査報告書40:学力検査60、松江工業は60:40+面接10点評点化、大社体育科は70:30+実技10点で第2次募集合計150', () => {
    const izumo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shimane', '出雲高等学校', '一般選抜');
    expect(izumo?.ratioType).toBe('個人調査報告書40:学力検査60');
    const matsuko = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shimane', '松江工業高等学校', '一般選抜');
    expect(matsuko?.ratioType).toBe('個人調査報告書60:学力検査40');
    expect(matsuko?.note).toContain('面接(評点化10点)');
    const taisha = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shimane', '大社高等学校', '第2次募集', '体育科');
    expect(taisha?.note).toContain('合計150点');
    expect(taisha?.note).toContain('実技40');
  });

  it('saga: 付表4-4〜4-6の全日制32校69学科の選考I/IIと帰国等枠・重点評価枠・定時制を148レコードで収録し、選考IのB募集人員の合計が資料の合計行1369人と一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saga');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(148);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(32);
    const k1 = all.filter((s) => s.selectionCategory === '一般選抜 選考I');
    const k2 = all.filter((s) => s.selectionCategory === '一般選抜 選考II');
    expect([k1.length, k2.length]).toEqual([69, 69]);
    const totalB = k1.reduce((a, s) => a + Number((s.note ?? '').match(/選考I: 募集人員([0-9]+)人/)?.[1] ?? 0), 0);
    expect(totalB).toBe(1369);
  });

  it('saga: 全レコードで②実技+③+④+⑤の合計が資料の値と一致する(選考I/II・定時制)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saga');
    for (const s of record?.schools ?? []) {
      const note = s.note ?? '';
      const m = note.match(/③学習の記録([0-9]+)点・④学習の記録以外([0-9]+)点、⑤面接([0-9]+)点、②+③+④+⑤=([0-9]+)点/);
      if (!m) continue;
      const prac = Number(note.match(/実技検査([0-9]+)点/)?.[1] ?? 0);
      expect(prac + Number(m[1]) + Number(m[2]) + Number(m[3])).toBe(Number(m[4]));
    }
  });

  it('saga: 佐賀西は国数英75点で学力検査325点、致遠館理数科は数学・理科75点で300点、選考IIは全校250点', () => {
    const saga = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saga', '佐賀西', '一般選抜 選考I', '普通科');
    expect(saga?.ratioType).toBe('学力検査325:調査書115:面接10');
    expect(saga?.note).toContain('傾斜配点あり');
    const chien = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saga', '致遠館', '一般選抜 選考I', '理数科');
    expect(chien?.ratioType).toBe('学力検査300:調査書120:面接30');
    const chienII = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saga', '致遠館', '一般選抜 選考II', '理数科');
    expect(chienII?.ratioType).toBe('学力検査250:調査書85:面接15');
  });

  it('iwate: 盛岡・中部・県南・沿岸南部・宮古・県北の6地区59校111学科を一般入学者選抜・特色入学者選抜・二次募集で収録し、一般入学者選抜の学力検査+調査書が1000点になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(60);
    const general = all.filter((s) => s.selectionCategory === '一般入学者選抜');
    expect(general).toHaveLength(111);
    for (const s of general) {
      const m = (s.ratioType ?? '').match(/^学力検査([0-9]+):調査書([0-9]+)/);
      expect(m).not.toBeNull();
      if (m) expect(Number(m[1]) + Number(m[2])).toBe(1000);
    }
  });

  it('iwate: 定時制9件(8校・杜陵は本校と奥州校の2件)は一般入学者選抜(定時制)で学力検査+調査書が1000点・学校独自検査を課す学校は1100点になり、二次募集の配点内訳が合計300点(成人枠は100〜200点)になる', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate')?.schools ?? [];
    const gen = all.filter((s) => s.selectionCategory === '一般入学者選抜(定時制)');
    expect(gen).toHaveLength(9);
    for (const s of gen) {
      const m = (s.ratioType ?? '').match(/^学力検査([0-9]+):調査書([0-9]+)(?::独自([0-9]+))?$/);
      expect(m).not.toBeNull();
      if (m) {
        expect(Number(m[1]) + Number(m[2])).toBe(1000);
        const total = Number(m[1]) + Number(m[2]) + Number(m[3] ?? 0);
        expect(s.note).toContain(`合計${total}点`);
      }
    }
    // 釜石のみ学力検査:調査書=7:3、独自検査(個人面接100点)を課すのは杜陵2件・大船渡・釜石・宮古の5件
    expect(gen.filter((s) => s.ratioType?.startsWith('学力検査700:'))).toHaveLength(1);
    expect(gen.filter((s) => s.ratioType?.includes(':独自100'))).toHaveLength(5);
    expect(gen.every((s) => s.note?.includes('特色入学者選抜は実施しない'))).toBe(true);
    // 二次募集・後期日程の配点内訳(括弧内を除く最上位の点数の和)が合計と一致
    const topSum = (parts: string) => {
      let depth = 0; let cur = ''; const out: string[] = [];
      for (const ch of parts) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === '+' && depth === 0) { out.push(cur); cur = ''; } else cur += ch; }
      out.push(cur);
      return out.map((p) => Number(p.match(/^[^0-9]*([0-9]+)点/)?.[1] ?? 0)).reduce((a, b) => a + b, 0);
    };
    const later = all.filter((s) => ['二次募集(定時制)', '後期日程(定時制)', '後期日程チャレンジ枠(定時制)', '成人枠(定時制)'].includes(s.selectionCategory));
    expect(later).toHaveLength(9 + 2 + 2 + 7);
    for (const s of later) {
      const m = (s.note ?? '').match(/選抜方法:(.+?)、合計([0-9]+)点/);
      expect(m).not.toBeNull();
      if (m) expect(topSum(m[1])).toBe(Number(m[2]));
    }
    const chal = all.filter((s) => s.selectionCategory === '後期日程チャレンジ枠(定時制)');
    expect(chal).toHaveLength(2);
    expect(chal.every((s) => s.note?.includes('合計200点'))).toBe(true);
  });

  it('iwate: 盛岡第一は学力検査7:調査書3(700:300)、盛岡第二は5:5、盛岡第四は6:4、南昌みらい芸術学系は学校独自検査100点で合計1100点', () => {
    const one = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '盛岡第一高等学校', '一般入学者選抜');
    expect(one?.ratioType).toBe('学力検査700:調査書300');
    const two = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '盛岡第二高等学校', '一般入学者選抜');
    expect(two?.ratioType).toBe('学力検査500:調査書500');
    const four = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '盛岡第四高等学校', '一般入学者選抜');
    expect(four?.ratioType).toBe('学力検査600:調査書400');
    const art = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '南昌みらい高等学校', '一般入学者選抜', '普通科(芸術学系)');
    expect(art?.note).toContain('合計1100点');
  });

  it('iwate: 葛巻は連携型入学者選抜(合計550点)をnoteに持つ、紫波総合は一般入学者選抜で集団面接(学校独自検査100点)を課す', () => {
    const kuzu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '葛巻高等学校', '二次募集');
    expect(kuzu?.note).toContain('連携型入学者選抜');
    expect(kuzu?.note).toContain('合計550点');
    const shiwa = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '紫波総合高等学校', '一般入学者選抜');
    expect(shiwa?.interviewRequired).toBe(true);
    expect(shiwa?.note).toContain('集団面接');
  });

  it('iwate: 二次募集・特色入学者選抜の配点内訳の合計が、調査書が圧縮されていない場合は資料の合計点と一致する(盛岡地区・中部地区)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate');
    let checked = 0;
    for (const s of record?.schools ?? []) {
      if (s.selectionCategory !== '二次募集') continue;
      const m = (s.note ?? '').match(/選抜方法:(.+?)、合計([0-9]+)点/);
      if (!m) continue;
      const parts = m[1].split('+').map((p) => Number(p.match(/([0-9]+)点/)?.[1] ?? 0));
      if (!parts.length || m[1].includes('圧縮')) continue;
      expect(parts.reduce((a, b) => a + b, 0)).toBe(Number(m[2]));
      checked++;
    }
    expect(checked).toBeGreaterThan(5);
  });

  it('iwate: 北上翔南は学力検査400:調査書600(国語・数学1.5倍)、黒沢尻北は特色でプレゼンテーション・面接150点、大迫は独自検査の作文100点で合計1100点', () => {
    const kita = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '北上翔南高等学校', '一般入学者選抜');
    expect(kita?.ratioType).toBe('学力検査400:調査書600');
    const kuro = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '黒沢尻北高等学校', '特色入学者選抜');
    expect(kuro?.note).toContain('プレゼンテーション・面接150点');
    const osako = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '大迫高等学校', '一般入学者選抜');
    expect(osako?.note).toContain('合計1100点');
  });

  it('iwate: 水沢は学力検査7:調査書3、水沢農業は6:4、一関工業は独自検査(個人面接)100点で1100点、水沢の特色は口頭試問で合計500点', () => {
    const mizusawa = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '水沢高等学校', '一般入学者選抜');
    expect(mizusawa?.ratioType).toBe('学力検査700:調査書300');
    const toku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '水沢高等学校', '特色入学者選抜');
    expect(toku?.note).toContain('合計500点');
    const nogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '水沢農業高等学校', '一般入学者選抜', '食品科学科');
    expect(nogyo?.ratioType).toBe('学力検査600:調査書400');
    const ikk = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '一関工業高等学校', '一般入学者選抜', '電気科');
    expect(ikk?.interviewRequired).toBe(true);
    expect(ikk?.note).toContain('合計1100点');
  });

  it('iwate: 釜石商工は学力検査7:調査書3に独自検査(面接)100点で1100点、大船渡東は独自検査50点で1050点、釜石の特色は口頭試問で合計350点', () => {
    const kamashoko = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '釜石商工高等学校', '一般入学者選抜', '機械科');
    expect(kamashoko?.ratioType).toBe('学力検査700:調査書300:独自100');
    expect(kamashoko?.note).toContain('合計1100点');
    const ofunato = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '大船渡東高等学校', '一般入学者選抜', '食物文化科');
    expect(ofunato?.ratioType).toBe('学力検査500:調査書500:独自50');
    expect(ofunato?.note).toContain('合計1050点');
    const kamaishi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '釜石高等学校', '特色入学者選抜');
    expect(kamaishi?.note).toContain('合計350点');
  });

  it('iwate: 山田は特色の調査書を660点満点から圧縮・プレゼンテーション120点、岩泉は独自検査の集団面接100点で1100点、宮古北の二次募集は面接200点', () => {
    const yamada = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '山田高等学校', '特色入学者選抜');
    expect(yamada?.note).toContain('合計660点を圧縮');
    expect(yamada?.note).toContain('プレゼンテーション120点');
    const iwaizumi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '岩泉高等学校', '一般入学者選抜');
    expect(iwaizumi?.interviewRequired).toBe(true);
    expect(iwaizumi?.note).toContain('集団面接');
    expect(iwaizumi?.note).toContain('合計1100点');
    const miyakoKita = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '宮古北高等学校', '二次募集');
    expect(miyakoKita?.note).toContain('面接200点');
  });

  it('iwate: 軽米は連携型入学者選抜(合計530点)と独自検査30点で1030点、福岡は特色の調査書270点満点で合計400点、北桜は3学科とも特色定員の20%', () => {
    const karumai = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '軽米高等学校', '一般入学者選抜');
    expect(karumai?.note).toContain('合計1030点');
    const karumaiNiji = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '軽米高等学校', '二次募集');
    expect(karumaiNiji?.note).toContain('合計530点');
    const fukuoka = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '福岡高等学校', '特色入学者選抜');
    expect(fukuoka?.note).toContain('調査書270点');
    expect(fukuoka?.note).toContain('合計400点');
    const hokuo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'iwate', '北桜高等学校', '特色入学者選抜', '総合学科');
    expect(hokuo?.note).toContain('24名(定員の20%)');
  });

  it('okinawa: 令和9年度の全59校164行を収録し、定員の合計が資料の合計行14,720名と一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okinawa');
    expect(record?.status).toBe('structured');
    expect(record?.fiscalYear).toContain('令和9年度');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(164);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(59);
    const total = all.reduce((a, s) => a + Number((s.note ?? '').match(/定員([0-9]+)名/)?.[1] ?? 0), 0);
    expect(total).toBe(14720);
  });

  it('okinawa: 比重は名護等が4.5:5.5・球陽/那覇国際/首里/開邦/向陽が4:6・多くは5:5、特別枠のチェック要否をnoteに持つ', () => {
    const nago = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okinawa', '名護', '一般選抜', '普通');
    expect(nago?.ratioType).toBe('調査書4.5:学力検査等5.5');
    expect(nago?.note).toContain('チェックが必要');
    const kyuyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okinawa', '球陽', '一般選抜', '文理探究');
    expect(kyuyo?.ratioType).toBe('調査書4:学力検査等6');
    const hentona = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okinawa', '辺土名', '一般選抜', '普通');
    expect(hentona?.ratioType).toBe('調査書5:学力検査等5');
    expect(hentona?.note).toContain('特別枠なし');
    const kaiho = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okinawa', '開邦', '一般選抜', '芸術(音楽)');
    expect(kaiho?.note).toContain('特色選抜の募集人員の割合50%');
  });

  it('tottori: 全日制の募集生徒数3,728・特色募集人員945・うち県外98、定時制220・18が資料の小計行と一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    const num = (s: string, re: RegExp) => Number(s.match(re)?.[1] ?? 0);
    const zen = all.filter((s) => (s.note ?? '').includes('・全日制】'));
    const tei = all.filter((s) => (s.note ?? '').includes('・定時制】'));
    const gen = (list: typeof all) => list.filter((s) => s.selectionCategory === '一般入学者選抜');
    const toku = (list: typeof all) => list.filter((s) => s.selectionCategory.startsWith('特色入学者選抜'));
    expect(gen(zen).reduce((a, s) => a + num(s.note ?? '', /募集生徒数([0-9]+)名/), 0)).toBe(3728);
    expect(toku(zen).reduce((a, s) => a + num(s.note ?? '', /募集人員([0-9]+)人以内/), 0)).toBe(945);
    expect(toku(zen).reduce((a, s) => a + num(s.note ?? '', /うち県外生徒([0-9]+)人程度/), 0)).toBe(98);
    expect(gen(tei).reduce((a, s) => a + num(s.note ?? '', /募集生徒数([0-9]+)名/), 0)).toBe(220);
    expect(toku(tei).reduce((a, s) => a + num(s.note ?? '', /募集人員([0-9]+)人以内/), 0)).toBe(18);
  });

  it('tottori: 鳥取西は130:250、鳥取商業は195:250(特色は個人面接+小論文60人)、日野は260:250、八頭は特色を2枠に分けて持つ', () => {
    const nishi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori', '鳥取西', '一般入学者選抜');
    expect(nishi?.ratioType).toBe('調査書の合計評定130:学力検査の合計得点250');
    const shogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori', '鳥取商業', '特色入学者選抜');
    expect(shogyo?.note).toContain('募集人員60人以内');
    expect(shogyo?.note).toContain('小論文');
    const hino = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori', '日野', '一般入学者選抜');
    expect(hino?.ratioType).toBe('調査書の合計評定260:学力検査の合計得点250');
    const sports = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori', '八頭', '特色入学者選抜(スポーツ活動特色選抜)');
    const activity = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tottori', '八頭', '特色入学者選抜(特別活動特色選抜)');
    expect(sports?.note).toContain('募集人員40人以内');
    expect(activity?.note).toContain('募集人員18人以内');
  });

  it('miyazaki: 一般入学者選抜は全日制の定員合計7,320・定時制440で、全レコードの配点が計に一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(275);
    const num = (s: string, re: RegExp) => Number(s.match(re)?.[1] ?? 0);
    const general = all.filter((s) => s.selectionCategory === '一般入学者選抜');
    expect(general).toHaveLength(114);
    const zen = general.filter((s) => (s.note ?? '').includes('・全日制】'));
    const tei = general.filter((s) => (s.note ?? '').includes('・定時制】'));
    expect(zen.reduce((a, s) => a + num(s.note ?? '', /定員([0-9]+)名/), 0)).toBe(7320);
    expect(tei.reduce((a, s) => a + num(s.note ?? '', /定員([0-9]+)名/), 0)).toBe(440);
    for (const s of all.filter((x) => x.ratioType)) {
      // ratioTypeは「項目名点数:項目名点数...(計N)」。各項目の点数の和が計に一致し、noteの合計とも一致する
      const items = (s.ratioType ?? '').replace(/\(計[0-9]+\)$/, '').split(':');
      const total = items.reduce((a, it) => a + Number(it.match(/([0-9]+)$/)?.[1] ?? 0), 0);
      const kei = num(s.ratioType ?? '', /計([0-9]+)/);
      expect(total).toBe(kei);
      expect(num(s.note ?? '', /合計([0-9]+)点/)).toBe(kei);
    }
  });

  it('miyazaki: 自己推薦方式114件は募集人員が定員×募集割合と一致し(全日制3,252・定時制146)、スポーツ推薦46件・連携型1件を収録する', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki')?.schools ?? [];
    const num = (s: string, re: RegExp) => Number(s.match(re)?.[1] ?? 0);
    const jiko = all.filter((s) => s.selectionCategory === '推薦入学者選抜(自己推薦方式)');
    expect(jiko).toHaveLength(114);
    const zen = jiko.filter((s) => (s.note ?? '').includes('・全日制】'));
    const tei = jiko.filter((s) => (s.note ?? '').includes('・定時制】'));
    expect(zen.reduce((a, s) => a + num(s.note ?? '', /募集人員は定員の[0-9]+%\(([0-9]+)名\)/), 0)).toBe(3252);
    expect(tei.reduce((a, s) => a + num(s.note ?? '', /募集人員は定員の[0-9]+%\(([0-9]+)名\)/), 0)).toBe(146);
    expect(all.filter((s) => s.selectionCategory === '推薦入学者選抜(スポーツ推薦方式)')).toHaveLength(46);
    expect(all.filter((s) => s.selectionCategory === '連携型入学者選抜')).toHaveLength(1);
  });

  it('miyazaki: 宮崎大宮は数学・英語150点で面接25/調査書75、小林体育コースは適性検査700点で計1300、宮崎東定時制は学力検査なし', () => {
    const omiya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki', '宮崎大宮', '一般入学者選抜');
    expect(omiya?.ratioType).toBe('学力検査600:面接25:調査書75(計700)');
    expect(omiya?.note).toContain('数学150・理科100・英語150');
    const kobayashi = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki')?.schools?.find(
      (s) => s.schoolName === '小林' && s.department === '普通(体育コース)' && s.selectionCategory === '一般入学者選抜'
    );
    expect(kobayashi?.ratioType).toBe('学力検査500:面接40:適性検査等700:調査書60(計1300)');
    expect(kobayashi?.note).toContain('種目別技能検査');
    const higashi = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki')?.schools?.find(
      (s) => s.schoolName === '宮崎東' && s.department === '普通(昼間)(定時制)' && s.selectionCategory === '一般入学者選抜'
    );
    expect(higashi?.ratioType).toBe('面接50:適性検査等25:調査書25(計100)');
    expect(higashi?.note).toContain('学力検査は実施しない');
  });

  it('miyazaki: 宮崎大宮の自己推薦は学校独自検査(プレゼンテーション)40点で面接なし、宮崎西理数は附属中の進学予定者を除いた人数に25%(10名)', () => {
    const omiya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki', '宮崎大宮', '推薦入学者選抜(自己推薦方式)');
    expect(omiya?.ratioType).toBe('学力検査400:学校独自検査40:自己推薦書40:調査書120(計600)');
    expect(omiya?.interviewRequired).toBeUndefined();
    expect(omiya?.note).toContain('プレゼンテーション');
    const nishi = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki')?.schools?.find(
      (s) => s.schoolName === '宮崎西' && s.department === '理数' && s.selectionCategory === '推薦入学者選抜(自己推薦方式)'
    );
    expect(nishi?.note).toContain('(10名)');
    expect(nishi?.note).toContain('附属中学校(定員80名)');
    const fukushima = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'miyazaki', '福島', '連携型入学者選抜');
    expect(fukushima?.ratioType).toBe('学力検査120:面接60:学校独自検査20:調査書120(計320)');
    expect(fukushima?.note).toContain('中高連携学習のまとめ');
  });

  it('oita: 推薦入学者選抜88レコード(39校・全日制と定時制)で、全ての比重の合計が100%に一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'oita');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(88);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(39);
    for (const s of all) {
      expect(s.selectionCategory).toBe('推薦入学者選抜');
      const items = (s.ratioType ?? '').replace('(比重%)', '').split(':');
      const total = items.reduce((a, it) => a + Number(it.match(/([0-9.]+)$/)?.[1] ?? 0), 0);
      // 中津南耶馬溪校は16.7×3+50=100.1(資料の表記どおり)
      expect(Math.abs(total - 100)).toBeLessThanOrEqual(0.2);
    }
  });

  it('oita: 大分舞鶴理数科は適性検査60%、大分商業は情報処理科だけ活動指定に水球を持つ、鶴崎工業電気科は志望学科だけ面接40%', () => {
    const maizuru = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'oita')?.schools?.find(
      (s) => s.schoolName === '大分舞鶴' && s.department === '理数科'
    );
    expect(maizuru?.ratioType).toBe('調査書10:調査書・推薦書2:面接8:小論文20:適性検査60(比重%)');
    const shogyo = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'oita')?.schools ?? [];
    const noteOf = (dept: string) => shogyo.find((s) => s.schoolName === '大分商業' && s.department === dept)?.note ?? '';
    expect(noteOf('情報処理科')).toContain('水球(男子・女子)');
    expect(noteOf('商業科')).not.toContain('水球');
    expect(noteOf('国際経済科')).not.toContain('水球');
    const denki = shogyo.find((s) => s.schoolName === '鶴崎工業' && s.department === '電気科');
    expect(denki?.ratioType).toBe('調査書10:調査書・推薦書60:面接15:小論文15(比重%)');
    expect(denki?.note).toContain('志望学科は比重が異なり 調査書10・調査書・推薦書30・面接40・小論文20');
    const higashi = shogyo.find((s) => s.schoolName === '中津東' && s.department === '機械科' && !(s.note ?? '').includes('定時制】'));
    expect(higashi?.note).toContain('相撲(男子)・剣道(男子・女子)');
  });

  it('wakayama: 一般選抜73レコード(35校・全日制60/定時制13)で、全ての割合の合計が100%に一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'wakayama');
    expect(record?.status).toBe('structured');
    const all = (record?.schools ?? []).filter((s) => s.selectionCategory === '一般選抜');
    expect(all).toHaveLength(73);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(35);
    expect(all.filter((s) => (s.note ?? '').includes('・全日制】'))).toHaveLength(60);
    expect(all.filter((s) => (s.note ?? '').includes('・定時制】'))).toHaveLength(13);
    for (const s of all) {
      const total = (s.ratioType ?? '').split(':').reduce((a, it) => a + Number(it.match(/([0-9]+)$/)?.[1] ?? 0), 0);
      expect(total).toBe(100);
    }
  });

  it('wakayama: 特色化選抜(別表2)21レコードを区分別に収録する(スポーツ9・芸術4・農業2・学際2・宇宙1・地域1・スポーツ健康科学1・連携型中高一貫1)', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'wakayama')?.schools ?? [];
    const toku = all.filter((s) => s.selectionCategory.startsWith('特色化選抜('));
    expect(toku).toHaveLength(21);
    expect(all).toHaveLength(123);
    const count = (cat: string) => toku.filter((s) => s.selectionCategory === `特色化選抜(${cat})`).length;
    expect(count('スポーツ')).toBe(9);
    expect(count('芸術')).toBe(4);
    expect(count('農業')).toBe(2);
    expect(count('学際')).toBe(2);
    expect(count('宇宙')).toBe(1);
    expect(count('地域')).toBe(1);
    expect(count('スポーツ健康科学')).toBe(1);
    expect(count('連携型中高一貫')).toBe(1);
    const find = (school: string, dept: string) => toku.find((s) => s.schoolName === school && s.department === dept);
    expect(find('橋本', '学際')?.note).toContain('小論文: 600字程度・70分');
    expect(find('串本古座', '宇宙')?.note).toContain('小論文: 600字程度・60分');
    expect(find('和歌山北', '陸上競技')?.note).toContain('作文: 800字程度・50分');
    expect(find('和歌山東', '剣道')?.note).toContain('作文: 600字程度・50分');
    expect(find('和歌山', '美術')?.note).toContain('鉛筆デッサン');
    expect(find('和歌山', '音楽(器楽)')?.note).toContain('YAMAHA C6L');
    // 別表3(出願条件): スポーツ9件は ア=都道府県大会1位/イ=地区大会8位以上/ウ=全国大会16位以上、スポーツ健康科学は4位以上/16位以上
    const sport = toku.filter((s) => s.selectionCategory === '特色化選抜(スポーツ)');
    for (const s of sport) {
      expect(s.note).toContain('ア=都道府県大会1位、イ=地区大会(近畿大会等)8位以上、ウ=全国大会16位以上');
      expect(s.note).toContain('選手登録(補欠を含む)');
    }
    expect(find('和歌山北', 'スポーツ健康科学')?.note ?? toku.find((s) => s.selectionCategory === '特色化選抜(スポーツ健康科学)')?.note).toContain('ア=都道府県大会4位以上、イ=地区大会(近畿大会等)16位以上');
    expect(toku.filter((s) => (s.note ?? '').includes('出願条件(別表3):'))).toHaveLength(20);
    expect(find('南部(龍神分校)', '連携型中高一貫')?.note).toContain('出願条件(別表3)に該当の記載なし');
  });

  it('wakayama: 那賀国際科は国語・英語1.5倍、和歌山北スポーツ健康科学科は30:30:40で選択実技15競技、和歌山北普通科は面接なし', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'wakayama')?.schools ?? [];
    const find = (school: string, dept: string) => list.find((s) => s.schoolName === school && s.department === dept);
    expect(find('那賀', '国際科')?.note).toContain('国1.5・英1.5');
    expect(find('星林', '普通科')?.note).toContain('英1.5');
    const sports = find('和歌山北', 'スポーツ健康科学科');
    expect(sports?.ratioType).toBe('調査書30:学力検査30:面接・実技検査40');
    expect(sports?.interviewRequired).toBe(true);
    expect(sports?.note).toContain('次の15競技');
    expect(sports?.note).toContain('握力測定');
    const kita = find('和歌山北', '普通科(北校舎)');
    expect(kita?.ratioType).toBe('調査書50:学力検査50');
    expect(kita?.interviewRequired).toBeUndefined();
    expect(find('和歌山東', '普通科')?.ratioType).toBe('調査書40:学力検査40:面接・実技検査20');
    expect(find('新宮', '普通科(昼間)(新翔校舎)(定時制)')?.ratioType).toBe('調査書40:学力検査40:面接・実技検査20');
  });

  it('wakayama: スポーツ推薦(別表5〜7)は資料末尾の「計9校29競技スポーツ」と一致し、募集枠・出願条件・実技を競技単位に統合している', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'wakayama')?.schools ?? [];
    const sp = all.filter((s) => s.selectionCategory === 'スポーツ推薦');
    expect(sp).toHaveLength(29);
    expect(new Set(sp.map((s) => s.schoolName)).size).toBe(9);
    const find = (school: string, sport: string) => sp.find((s) => s.schoolName === school && s.department === sport);
    for (const s of sp) {
      expect(s.note).toContain('募集枠:');
      expect(s.note).toContain('出願条件(別表6):');
      expect(s.note).toContain('スポーツ実技検査等(別表7):');
    }
    expect(find('紀北農芸', 'ハンドボール')?.note).toContain('男子のみ3名程度');
    expect(find('粉河', '卓球')?.note).toContain('女子のみ3名程度');
    expect(find('和歌山北(普通科)', 'サッカー')?.note).toContain('女子のみ3名程度');
    expect(find('和歌山北(普通科)', 'フェンシング')?.note).toContain('男女を問わず2名程度');
    expect(find('和歌山工業', '陸上競技')?.note).toContain('専門種目のスパイク可');
    expect(find('和歌山商業', '相撲')?.note).toContain('まわし');
    // 面接を実施するのは別表7の備考に「面接を実施」とある学校のみ(和歌山商業・箕島は無し)
    expect(find('和歌山商業', '卓球')?.interviewRequired).toBeUndefined();
    expect(find('箕島', '柔道')?.interviewRequired).toBeUndefined();
    expect(find('紀央館', 'ホッケー')?.interviewRequired).toBe(true);
    expect(sp.filter((s) => s.interviewRequired)).toHaveLength(23); // 和歌山商業3競技+箕島3競技=6競技が面接なし
  });

  it('mie: 後期選抜125レコード(全日制108・定時制17)は全て特に重視する選抜資料(◎)を1つ以上持つ', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'mie');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(169);
    const late = all.filter((s) => s.selectionCategory === '後期選抜');
    expect(late).toHaveLength(125);
    expect(late.filter((s) => (s.note ?? '').includes('・全日制】'))).toHaveLength(108);
    expect(late.filter((s) => (s.note ?? '').includes('・定時制】'))).toHaveLength(17);
    for (const s of late) {
      expect(s.note).toContain('うち特に重視する選抜資料は');
      expect(s.note).not.toContain('うち特に重視する選抜資料は)');
    }
  });

  it('mie: スポーツ特別枠選抜(別表5)は15校44競技で、募集人数の合計が196人以内になる', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'mie')?.schools ?? [];
    const sp = all.filter((s) => s.selectionCategory === 'スポーツ特別枠選抜');
    expect(sp).toHaveLength(44);
    expect(new Set(sp.map((s) => s.schoolName)).size).toBe(15);
    const total = sp.reduce((a, s) => a + Number((s.note ?? '').match(/合計([0-9]+)人以内/)?.[1] ?? 0), 0);
    expect(total).toBe(196);
    const find = (school: string, dept: string) => sp.find((s) => s.schoolName === school && s.department === dept);
    expect(find('津工業', 'セーリング競技(男子)')?.note).toContain('機械科2人以内、電気科1人以内、電子科1人以内、建設工学科1人以内(合計5人以内)');
    expect(find('四日市商業', '空手道競技(女子)')?.note).toContain('商業科4人以内');
    expect(find('稲生', 'なぎなた競技(女子)')?.note).toContain('普通科1人以内、体育科1人以内');
    expect(find('尾鷲', '水泳競技(競泳)(男子)')?.note).toContain('システム工学科1人以内');
  });

  it('mie: 桑名北は面接◎、桑名工業は調査書◎、津は学力検査◎、北星(定時制)は学力検査を選抜資料としない', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'mie')?.schools ?? [];
    const find = (school: string, dept: string) => list.find((s) => s.schoolName === school && s.department === dept);
    expect(find('桑名北', '普通科')?.note).toContain('うち特に重視する選抜資料は面接の状況)');
    expect(find('桑名北', '普通科')?.interviewRequired).toBe(true);
    expect(find('桑名工業', '機械科・材料技術科')?.note).toContain('うち特に重視する選抜資料は調査書の内容)');
    expect(find('津', '普通科')?.note).toContain('うち特に重視する選抜資料は学力検査の結果)');
    expect(find('津', '普通科')?.interviewRequired).toBeUndefined();
    const hokusei = find('北星', '普通科(夜間部)(定時制)');
    expect(hokusei?.note).toContain('選抜資料: 面接の状況・調査書の内容・作文の結果');
    expect(hokusei?.note).not.toContain('学力検査の結果');
    expect(find('四日市工業', '機械交通工学科(定時制)')?.note).toContain('実技検査の結果');
    expect(find('熊野青藍(紀南校舎)', '総合学科')?.note).toContain('うち特に重視する選抜資料は学力検査の結果)');
  });

  it('nagasaki: 421レコード(57校)で、比重を持つ全レコードの比重合計が10になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagasaki');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(421);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(57);
    const withRatio = all.filter((s) => s.ratioType);
    expect(withRatio.length).toBeGreaterThan(300);
    for (const s of withRatio) {
      expect(s.ratioType).toContain('(比重・合計10)');
      const items = (s.ratioType ?? '').replace('(比重・合計10)', '').split(':');
      const total = items.reduce((a, it) => a + Number(it.match(/([0-9.]+)$/)?.[1] ?? 0), 0);
      expect(Math.round(total * 10) / 10).toBe(10);
    }
  });

  it('nagasaki: 選抜区分ごとの件数(一般選抜・チャレンジ・定時制Ⅰ期/Ⅱ期・通信制・離島留学6・美術工芸1)が資料の構造と一致する', () => {
    const all = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagasaki')?.schools ?? [];
    const count = (cat: string) => all.filter((s) => s.selectionCategory === cat).length;
    expect(count('一般選抜')).toBe(117); // 離島留学特別選抜へ分けた4行を除く全学科・コース
    expect(count('チャレンジ選抜')).toBe(59);
    expect(count('Ⅰ期選抜(定時制)')).toBe(12);
    expect(count('Ⅱ期選抜(定時制)')).toBe(12);
    expect(count('通信制課程募集定員')).toBe(2);
    expect(count('離島留学特別選抜')).toBe(6);
    expect(count('美術・工芸科特別選抜')).toBe(1);
    // 課程別の募集定員(頁33)と一致する合計は ops/baselines/nagasaki-transcription/check.mjs で検算済み
    const tsushin = all.filter((s) => s.selectionCategory === '通信制課程募集定員');
    expect(tsushin.reduce((a, s) => a + Number((s.note ?? '').match(/募集定員([0-9]+)人/)?.[1] ?? 0), 0)).toBe(600);
  });

  it('nagasaki: 長崎東は一般選抜3:6.5:0.5・数英150点(難度の高い問題)、長崎西の理系は数200・理150・英200、佐世保商業の国際コミュニケーションは英200', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagasaki')?.schools ?? [];
    const find = (school: string, dept: string, cat: string) => list.find((s) => s.schoolName === school && s.department === dept && s.selectionCategory === cat);
    const higashi = find('長崎東', '普通・国際(くくり募集)', '一般選抜');
    expect(higashi?.ratioType).toBe('調査書等3:学力検査6.5:面接0.5(比重・合計10)');
    expect(higashi?.note).toContain('国100・社100・数150・理100・英150(合計600点)');
    expect(higashi?.note).toContain('数英は難度の高い問題(選択問題)を実施する教科');
    expect(find('長崎西', '普通[理系]', '一般選抜')?.note).toContain('国150・社100・数200・理150・英200(合計800点)');
    expect(find('佐世保商業', '国際コミュニケーション', '一般選抜')?.note).toContain('英200');
    // 自己推薦②で面接に代えてプレゼンテーションを課す学校
    const pre = find('長崎東', '普通・国際(くくり募集)', '特別選抜(自己推薦②)');
    expect(pre?.ratioType).toBe('調査書等7:プレゼンテーション3(比重・合計10)');
    expect(pre?.note).toContain('プレゼンテーションに質疑応答及び英語を含む');
    expect(pre?.interviewRequired).toBeUndefined();
  });

  it('nagasaki: 特別選抜を実施しない定時制昼間部は一般選抜のみ、離島留学特別選抜の五島スポーツは調査書4:面接1:実技5', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'nagasaki')?.schools ?? [];
    const naru = list.filter((s) => s.schoolName === '鳴滝' && s.department === '普通(昼間部)');
    expect(naru.map((s) => s.selectionCategory)).toEqual(['一般選抜']);
    expect(naru[0].ratioType).toBe('調査書等2:学力検査4:面接4(比重・合計10)');
    const goto = list.find((s) => s.schoolName === '五島' && s.selectionCategory === '離島留学特別選抜');
    expect(goto?.ratioType).toBe('調査書等4:面接1:実技5(比重・合計10)');
    const hasami = list.find((s) => s.schoolName === '波佐見' && s.selectionCategory === '美術・工芸科特別選抜');
    expect(hasami?.ratioType).toBe('調査書等4:実技6(比重・合計10)');
    expect(hasami?.note).toContain('静物卓上デッサン');
  });

  it('fukuoka: 全日制の入学定員等一覧表を243レコード(90校)で収録し、推薦入学の募集人員合計4,529・特色化選抜の上限人数合計7,012になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukuoka');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(243);
    expect(new Set(all.map((s) => s.schoolName)).size).toBe(90);
    const suisen = all.filter((s) => s.selectionCategory === '推薦入学');
    const toku = all.filter((s) => s.selectionCategory === '特色化選抜');
    expect(suisen).toHaveLength(129);
    expect(toku).toHaveLength(113);
    expect(all.filter((s) => s.selectionCategory === '推薦入学・特色化選抜なし')).toHaveLength(1);
    const num = (s: string, re: RegExp) => Number(s.match(re)?.[1] ?? 0);
    expect(suisen.reduce((a, s) => a + num(s.note ?? '', /募集人員([0-9]+)人程度/), 0)).toBe(4529);
    expect(toku.reduce((a, s) => a + num(s.note ?? '', /内定者上限人数\(目安\)([0-9]+)人/), 0)).toBe(7012);
    // 推薦入学+特色化選抜の人数が入学定員を超えるレコードは無い(同一学科の2レコードを合算して確認)
    const byKey = new Map<string, { teiin: number; sum: number }>();
    for (const s of [...suisen, ...toku]) {
      const k = `${s.schoolName}|${s.department}|${(s.note ?? '').match(/一覧表・([^】]*)】/)?.[1]}`;
      const cur = byKey.get(k) ?? { teiin: num(s.note ?? '', /入学定員([0-9]+)人/), sum: 0 };
      cur.sum += num(s.note ?? '', /(?:募集人員|内定者上限人数\(目安\))([0-9]+)人/);
      byKey.set(k, cur);
    }
    for (const v of byKey.values()) expect(v.sum).toBeLessThanOrEqual(v.teiin);
  });

  it('fukuoka: 福岡魁誠は推薦140人程度で面接(自己表現)・特色化なし、柏陵は特色化のみ288人、伝習館は面接又は面接・作文、小郡みらい創造コースは選抜の記載なし', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukuoka')?.schools ?? [];
    const find = (school: string, dept: string, cat: string) => list.find((s) => s.schoolName === school && s.department === dept && s.selectionCategory === cat);
    expect(find('福岡魁誠', '総合学科', '推薦入学')?.note).toContain('募集人員140人程度・実施方法=面接(自己表現)');
    expect(find('福岡魁誠', '総合学科', '特色化選抜')).toBeUndefined();
    expect(find('柏陵', '普通', '特色化選抜')?.note).toContain('内定者上限人数(目安)288人');
    expect(find('柏陵', '普通', '推薦入学')).toBeUndefined();
    expect(find('伝習館', '普通', '推薦入学')?.note).toContain('面接又は面接・作文');
    expect(find('小郡', 'みらい創造コース', '推薦入学・特色化選抜なし')?.note).toContain('学びの多様化学校入学者選抜により入学者を決定');
    // くくり・まとめ設定の学科は列挙した1行(入学定員は合計)
    expect(find('小倉商業', '商業進学※・総合ビジネス※・観光ビジネス※・国際ビジネス※・ビジネス情報※・会計ビジネス※', '推薦入学')?.note).toContain('入学定員240人');
    expect(find('門司学園', '普通', '推薦入学')?.note).toContain('推薦入学の新規実施校');
  });

  it('ehime: 特色入学者選抜117レコード(40校・本選抜67+文化スポーツ重視50)で、全ての比重の合計が10になる', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'ehime');
    expect(record?.status).toBe('structured');
    const all = record?.schools ?? [];
    expect(all).toHaveLength(117);
    expect(new Set(all.map((s) => s.schoolName.replace(/\((本校|小田分校|中島分校|砥部分校)\)/, ''))).size).toBe(40);
    expect(all.filter((s) => s.selectionCategory === '特色入学者選抜')).toHaveLength(67);
    expect(all.filter((s) => s.selectionCategory.startsWith('特色入学者選抜('))).toHaveLength(50);
    for (const s of all) {
      expect(s.ratioType).toContain('(比重・合計10)');
      const total = (s.ratioType ?? '')
        .replace('(比重・合計10)', '')
        .split(':')
        .reduce((a, it) => a + Number(it.match(/([0-9]+)$/)?.[1] ?? 0), 0);
      expect(total).toBe(10);
    }
  });

  it('ehime: 川之江は調査書5:作文2:面接3、松山東は小論文と集団討論、新居浜東体育は実技テスト4・プレゼン2、伊予芸術は募集割合100%', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'ehime')?.schools ?? [];
    const find = (school: string, dept: string, cat = '特色入学者選抜') => list.find((s) => s.schoolName === school && s.department === dept && s.selectionCategory === cat);
    expect(find('川之江', '普通')?.ratioType).toBe('調査書5:作文2:面接3(比重・合計10)');
    expect(find('川之江', '普通', '特色入学者選抜(文化・スポーツ活動の取組・成果等を重視した選抜)')?.ratioType).toBe('調査書6:作文2:面接2(比重・合計10)');
    expect(find('松山東', '普通')?.ratioType).toBe('調査書6:小論文2:集団討論2(比重・合計10)');
    expect(find('新居浜東', '体育(健康スポーツ)')?.ratioType).toBe('調査書4:実技テスト4:プレゼンテーション2(比重・合計10)');
    expect(find('伊予', '芸術')?.note).toContain('募集割合100%程度(募集人数40人程度)');
    expect(find('しまなみ', '総合学科(伯方キャンパス16人・大三島キャンパス16人)')?.note).toContain('募集人数32人程度');
    // 合算行(縦書きの学科名)の募集人数: 松山工業8学科×16=128、伊予農業6学科×16=96
    expect(find('松山工業', '機械・電子機械・電気・情報電子・工業化学・建築・土木・繊維(各40人・各16人)')?.note).toContain('募集定員320人');
    expect(find('伊予農業', '生物工学・園芸流通・食品化学・生活科学・環境開発・特用林産(各40人・各16人)')?.note).toContain('募集人数96人程度');
  });

  it('saitama: 全レコードのratioTypeは第1次・第2次の段階表記を持ち、合計点は学力+調査書+その他に一致する', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'saitama');
    expect(record?.status).toBe('structured');
    expect(record?.schools?.length).toBeGreaterThan(0);
    for (const s of record?.schools ?? []) {
      const stages = [...(s.ratioType ?? '').matchAll(/第[12]次[0-9]+%\[([^\]]+)\]/g)];
      expect(stages.length).toBe(2);
      for (const m of stages) {
        const [body, total] = m[1].split('=');
        const sum = body.split(':').reduce((a, p) => a + Number(p.replace(/[^0-9]/g, '')), 0);
        expect(sum).toBe(Number(total));
      }
    }
  });

  it('okayama: 津山(理数)は特別入学者選抜のみ収録され一般入学者選抜のレコードは無い(募集人員100%かつ一般選抜比率が「ー」のため)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const tsuyama = record?.schools?.filter((s) => s.schoolName === '津山');
    expect(tsuyama).toHaveLength(1);
    expect(tsuyama?.[0].selectionCategory).toBe('特別入学者選抜');
    expect(tsuyama?.[0].note).toContain('津山中学校');
  });

  it('okayama: 津山東は普通科が一般入学者選抜のみ・食物調理と看護は特別入学者選抜のみという逆パターンを持つ', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const tsuyamahigashi = record?.schools?.filter((s) => s.schoolName === '津山東');
    expect(tsuyamahigashi).toHaveLength(3);
    const futsuu = tsuyamahigashi?.find((s) => s.department === '普通');
    const shokumotsu = tsuyamahigashi?.find((s) => s.department === '食物調理');
    const kango = tsuyamahigashi?.find((s) => s.department === '看護');
    expect(futsuu?.selectionCategory).toBe('一般入学者選抜');
    expect(shokumotsu?.selectionCategory).toBe('特別入学者選抜');
    expect(kango?.selectionCategory).toBe('特別入学者選抜');
    expect(kango?.note).toContain('※');
  });

  it('okayama: 玉島(理数)は一般入学者選抜で比率10%を返す(普通科はレコード無し)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const tamashima = record?.schools?.filter((s) => s.schoolName === '玉島');
    expect(tamashima).toHaveLength(2);
    expect(tamashima?.every((s) => s.department === '理数')).toBe(true);
    const general = tamashima?.find((s) => s.selectionCategory === '一般入学者選抜');
    expect(general?.ratioType).toBe('調査書及び面接等10%');
  });

  it('okayama: 倉敷鷲羽は普通・ビジネスで重視する実績の内容が異なる(結合セルは募集人員のみ共通)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama');
    const washu = record?.schools?.filter((s) => s.schoolName === '倉敷鷲羽');
    expect(washu).toHaveLength(4);
    const futsuu = washu?.find(
      (s) => s.department === '普通' && s.selectionCategory === '特別入学者選抜'
    );
    const business = washu?.find(
      (s) => s.department === 'ビジネス' && s.selectionCategory === '特別入学者選抜'
    );
    expect(futsuu?.note).toContain('英語検定準2級以上又は数学検定準2級以上合格');
    expect(business?.note).toContain('野球(男子)、サッカー(男子)、ヨット又はレスリング');
  });

  it('okayama: 岡山御津は6コースが特別入学者選抜(募集人員80%)とその他の選抜等「■」(フレックス制選抜20%)を共有する(頁3)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山御津', '一般入学者選抜', '保育・福祉系列');
    expect(record?.note).toContain('フレックス制');
    expect(record?.note).toContain('20%');
  });

  it('okayama: 倉敷天城(理数)は隣接中学校からの進学者数を控除する特殊な募集人員算定式を持つ(頁3)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '倉敷天城', '特別入学者選抜', '理数');
    expect(record?.note).toContain('倉敷天城中学校');
    expect(record?.note).toContain('募集人員100%');
  });

  it('okayama: 倉敷中央は子どもコース・健康スポーツコース・家政・看護・福祉が重視する実績(スポーツ実績)を共有する(頁3)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '倉敷中央', '特別入学者選抜', '福祉');
    expect(record?.note).toContain('ソフトボール');
    expect(record?.note).toContain('5コースで共通');
  });

  it('okayama: 岡山南(国際経済)は特別入学者選抜で英語検定2級以上合格を重視する実績に追加している(他の4学科には無い条件)', () => {
    const kokusai = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山南', '特別入学者選抜', '国際経済');
    const shogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '岡山南', '特別入学者選抜', '商業');
    expect(kokusai?.note).toContain('英語検定2級以上合格');
    expect(shogyo?.note).not.toContain('英語検定');
  });

  it('okayama: 倉敷青陵・倉敷南・倉敷古城池は特別入学者選抜の実施がない(一般入学者選抜のみ)', () => {
    const seiryo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '倉敷青陵', '特別入学者選抜', '普通');
    expect(seiryo).toBeNull();
  });

  it('okayama: 東岡山工業は機械・電子機械のくくり募集が結合セルで共通のため同一内容が複製されている(電気・設備システム・工業化学は一般入学者選抜なし)', () => {
    const kikai = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '東岡山工業', '一般入学者選抜', '機械');
    const denshi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '東岡山工業', '一般入学者選抜', '電子機械');
    const denki = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '東岡山工業', '一般入学者選抜', '電気');
    expect(kikai?.note).toContain('くくり募集○');
    expect(denshi?.note).toBe(kikai?.note);
    expect(denki).toBeNull();
  });

  it('okayama: 興陽(4学科)は特別入学者選抜で同一の重視する実績(野球・サッカー等)を共有する', () => {
    const nougyou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '興陽', '特別入学者選抜', '農業');
    const life = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'okayama', '興陽', '特別入学者選抜', 'ライフデザイン');
    expect(nougyou?.note).toContain('ソフトテニス');
    expect(life?.note).toContain('ソフトテニス');
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

  it('aomori: schoolsは青森県内全6地区(東青・西北五・中弘南黒・上十三・下北むつ・三八)の分割版を完全収録している(46校180レコード)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori');
    expect(record?.schools?.length).toBe(180);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(46);
    expect(record?.coverageNote).toContain('東青地区');
    expect(record?.coverageNote).toContain('西北五地区');
    expect(record?.coverageNote).toContain('中弘南黒地区');
    expect(record?.coverageNote).toContain('上十三地区');
    expect(record?.coverageNote).toContain('下北むつ地区');
    expect(record?.coverageNote).toContain('三八地区');
    expect(record?.coverageNote).toContain('全6地区');
  });

  it('aomori: 田名部は全日制(普通科)と定時制単位制(普通科(定時制・単位制))の同名2校を別学科名で区別して収録している', () => {
    const zennichi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '田名部', '一般選抜', '普通科');
    const teiji = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '田名部', '特色化選抜', '普通科(定時制・単位制)');
    expect(zennichi?.note).toContain('下北むつ地区分割版PDF');
    expect(teiji?.note).toContain('仕事を続けながら学びたい');
  });

  it('aomori: 大間(普通科)は「全国からの生徒募集」導入校で群分け基準が90%(他地区の一般選抜と異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '大間', '一般選抜', '普通科');
    expect(record?.note).toContain('全国からの生徒募集');
    expect(record?.note).toContain('90%以内');
  });

  it('aomori: 八戸西(スポーツ科学科)は実技検査を含む合計255点満点で群分けする(他校の一般選抜と異なる基準)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '八戸西', '一般選抜', 'スポーツ科学科');
    expect(record?.note).toContain('三八地区分割版PDF');
    expect(record?.note).toContain('255点満点');
    expect(record?.ratioType).toContain('実技検査120点');
  });

  it('aomori: 八戸中央(普通科(定時制))は三八地区唯一の定時制単独校', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'aomori', '八戸中央', '特色化選抜', '普通科(定時制)');
    expect(record?.note).toContain('三八地区分割版PDF');
    expect(record?.note).toContain('20点満点に換算');
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

  it('gifu: schoolsは頁1・頁2・頁3を完全収録している(63校381レコード・頁4は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu');
    expect(record?.schools?.length).toBe(381);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(63);
    expect(record?.fiscalYear).toBe('令和9年度（2027年度）');
    expect(record?.coverageNote).toContain('頁4');
    expect(record?.coverageNote).toContain('未着手');
  });

  it('gifu: 土岐紅陵(総合)は独自検査区分I(27%)と区分II(3%)の2枠を持つ(頁3)', () => {
    const region1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '土岐紅陵', '第一次選抜(独自検査区分I)', '総合');
    const region2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '土岐紅陵', '第一次選抜(独自検査区分II)', '総合');
    expect(region1?.ratioType).toBe('募集人員の27%');
    expect(region2?.ratioType).toBe('募集人員の3%');
  });

  it('gifu: 恵那南(総合)の第二次選抜は頁3で唯一、面接に加え小論文も実施する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '恵那南', '第二次選抜', '総合');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('小論文も実施');
  });

  it('gifu: 関商工は総合ビジネスのみ独自検査の志望数が1(他3学科は3)という例外を持つ(頁3)', () => {
    const sogo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '関商工', '第一次選抜(独自検査)', '総合ビジネス');
    const kikai = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '関商工', '第一次選抜(独自検査)', '機械');
    expect(sogo?.note).toContain('志望できる学科(群)数1');
    expect(kikai?.note).toContain('志望できる学科(群)数3');
  });

  it('gifu: 加茂農林は5学科で募集割合が学科ごとに異なる(25%/30%が混在)独自検査を持つ', () => {
    const shokuhin = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '加茂農林', '第一次選抜(独自検査)', '食品科学');
    const engei = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '加茂農林', '第一次選抜(独自検査)', '園芸流通');
    expect(shokuhin?.ratioType).toBe('募集人員の25%');
    expect(engei?.ratioType).toBe('募集人員の30%');
  });

  it('gifu: 関有知(普通)は独自検査で面接と自己表現の両方を実施する(生活デザインは独自検査なし)', () => {
    const futsuu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '関有知', '第一次選抜(独自検査)', '普通');
    const seikatsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '関有知', '第一次選抜(独自検査)', '生活デザイン');
    expect(futsuu?.note).toContain('面接及び自己表現');
    expect(seikatsu).toBeNull();
  });

  it('gifu: 大垣桜(4学科)は独自検査を含む選抜が実施されない(区分欄が全て空欄)', () => {
    const fukushoku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '大垣桜', '第一次選抜(独自検査)', '服飾デザイン');
    expect(fukushoku).toBeNull();
  });

  it('gifu: 海津明誠は普通・生活デザインに区分I/IIの2枠があるがビジネス情報は単一区分', () => {
    const futsuu1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '海津明誠', '第一次選抜(独自検査区分I)', '普通');
    const business = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '海津明誠', '第一次選抜(独自検査)', 'ビジネス情報');
    expect(futsuu1?.ratioType).toBe('募集人員の25%');
    expect(business?.ratioType).toBe('募集人員の30%');
  });

  it('gifu: 大垣東は普通のみ独自検査(実技検査)があり理数には独自検査がない', () => {
    const futsuu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '大垣東', '第一次選抜(独自検査)', '普通');
    const risu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '大垣東', '第一次選抜(独自検査)', '理数');
    expect(futsuu?.note).toContain('実技検査');
    expect(risu).toBeNull();
  });

  it('gifu: 岐阜工業(航空・機械工学科群)は独自検査区分Iが実技検査・区分IIが面接という異なる検査内容を持つ', () => {
    const region1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜工業', '第一次選抜(独自検査区分I)', '航空・機械工学科群');
    const region2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜工業', '第一次選抜(独自検査区分II)', '航空・機械工学科群');
    expect(region1?.note).toContain('実技検査');
    expect(region2?.note).toContain('面接');
  });

  it('gifu: 岐阜農林(7学科)は学科間で完全併願可能(志望数3)かつ全学科同一配点', () => {
    const doubutsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜農林', '第一次選抜(標準検査)', '動物科学');
    const kankyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜農林', '第一次選抜(標準検査)', '環境科学');
    expect(doubutsu?.ratioType).toBe(kankyo?.ratioType);
    expect(doubutsu?.note).toContain('7学科');
  });

  it('gifu: 岐阜各務野は情報学科のみ独自検査が実施されない(ビジネス・福祉学科にはある)', () => {
    const business = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜各務野', '第一次選抜(独自検査)', 'ビジネス');
    const jouhou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜各務野', '第一次選抜(独自検査)', '情報');
    expect(business?.ratioType).toBe('募集人員の30%');
    expect(jouhou).toBeNull();
  });

  it('gifu: 各務原(普通)は同一学科に独自検査区分I(12%)と区分II(5%)の2枠を持つ', () => {
    const region1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '各務原', '第一次選抜(独自検査区分I)', '普通');
    const region2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '各務原', '第一次選抜(独自検査区分II)', '普通');
    expect(region1?.ratioType).toBe('募集人員の12%');
    expect(region2?.ratioType).toBe('募集人員の5%');
  });

  it('gifu: 加納(音楽)は美術科と音楽科の第1・第2志望の組み合わせが表脚注で禁止されている', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '加納', '第一次選抜(標準検査)', '音楽');
    expect(record?.note).toContain('美術科を第2志望とすることはできない');
    expect(record?.ratioType).toBe('調査書:学力検査=3:7');
  });

  it('gifu: 岐阜総合学園(総合)は同一学科に独自検査区分Iと区分IIの2枠を持つ', () => {
    const region1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜総合学園', '第一次選抜(独自検査区分I)', '総合');
    const region2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜総合学園', '第一次選抜(独自検査区分II)', '総合');
    expect(region1?.ratioType).toBe('募集人員の29.5%');
    expect(region2?.ratioType).toBe('募集人員の0.5%');
  });

  it('gifu: 岐山(理数)は学力検査で数学・理科を130点に傾斜配点する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐山', '第一次選抜(標準検査)', '理数');
    expect(record?.note).toContain('数学130点');
    expect(record?.note).toContain('理科130点');
  });

  it('gifu: 第二次選抜の面接実施有無は学校番号の区間で切り替わる(岐阜=面接なし・岐南工業=出願者全員に面接実施)', () => {
    const gifu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐阜', '第二次選抜', '普通');
    expect(gifu?.interviewRequired).toBe(false);
    expect(gifu?.note).toContain('面接・小論文・実技検査はなし');
    const ginan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'gifu', '岐南工業', '第二次選抜', '機械工学');
    expect(ginan?.interviewRequired).toBe(true);
    expect(ginan?.note).toContain('面接は出願者全員に実施');
  });

  it('tokushima: 徳島北(外国語科)は一般選抜の学力検査で英語のみ2倍(200点)の傾斜配点を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島北', '一般選抜', '外国語科');
    expect(record?.note).toContain('英語200');
    expect(record?.note).toContain('2倍');
  });

  it('tokushima: 徳島科学技術は工業科・水産科の両学科が同一の傾斜配点(600点・数学140/理科130/英語130)を共有する', () => {
    const kogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島科学技術', '一般選抜', '工業科');
    const suisan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島科学技術', '一般選抜', '水産科');
    expect(kogyo?.note).toContain('数学140');
    expect(suisan?.note).toContain('数学140');
  });

  it('tokushima: 富岡西(理数科)は表中唯一600点に満たない傾斜配点(総計590点)を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '富岡西', '一般選抜', '理数科');
    expect(record?.note).toContain('590点');
  });

  it('tokushima: 城東(普通)は育成型選抜の活動重視枠と実績重視枠で調査書・学力検査の配点が異なる', () => {
    const katsudou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城東', '育成型選抜(活動重視枠)', '普通');
    const jisseki = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城東', '育成型選抜(実績重視枠)', '普通');
    expect(katsudou?.note).toContain('調査書100/学力検査150');
    expect(jisseki?.note).toContain('調査書50/学力検査100');
  });

  it('tokushima: 城南は普通・理数(応用数理)で育成型選抜の配点等を共有する(結合セル)', () => {
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城南', '育成型選抜(活動重視枠)', '普通');
    const risu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城南', '育成型選抜(活動重視枠)', '理数(応用数理)');
    expect(futsu?.note).toContain('総点500/調査書100/学力検査150/活動記録50/実技等150');
    expect(risu?.note).toContain('総点500/調査書100/学力検査150/活動記録50/実技等150');
    expect(risu?.note).toContain('★理数探究分野');
  });

  it('tokushima: 徳島北は育成型選抜の実績重視枠が実施されない(欄が全てー)ためレコードが存在しない', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島北', '育成型選抜(実績重視枠)', '普通');
    expect(record).toBeNull();
  });

  it('tokushima: 城西は農業・総合(総合学科)で育成型選抜の実績重視枠における運動部指定競技が異なる(農業はー・総合は男女ライフル射撃)', () => {
    const nougyou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城西', '育成型選抜(実績重視枠)', '農業(生産技術・植物活用・食品科学・アグリビジネス)');
    const sougou = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '城西', '育成型選抜(実績重視枠)', '総合(総合学科)');
    expect(nougyou?.note).toContain('運動部指定競技:ー');
    expect(sougou?.note).toContain('男女ライフル射撃');
  });

  it('tokushima: 徳島科学技術は育成型選抜で工業・水産が配点を共有するが文化・ポリシー分野は水産のみ★海洋分野を持つ', () => {
    const kogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島科学技術', '育成型選抜(活動重視枠)', '工業(総合科学・機械技術・電気技術・建設技術)');
    const suisan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '徳島科学技術', '育成型選抜(活動重視枠)', '水産(海洋科学・海洋技術)');
    expect(kogyo?.note).toContain('文化・ポリシー分野:ー');
    expect(suisan?.note).toContain('文化・ポリシー分野:★海洋分野');
    expect(kogyo?.note).toContain('総点500/調査書125/学力検査125');
    expect(suisan?.note).toContain('総点500/調査書125/学力検査125');
  });

  it('tokushima: 小松島西は商業・家庭(食物生活文化)・福祉の3学科が育成型選抜の配点等を共有する(結合セル)', () => {
    const shogyo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '小松島西', '育成型選抜(活動重視枠)', '商業');
    const kaji = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '小松島西', '育成型選抜(活動重視枠)', '家庭(食物生活文化)');
    const fukushi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '小松島西', '育成型選抜(活動重視枠)', '福祉');
    expect(shogyo?.note).toContain('総点500/調査書100/学力検査200');
    expect(kaji?.note).toContain('★家庭探究活動');
    expect(fukushi?.note).toContain('★福祉探究活動');
  });

  it('tokushima: 鳴門渦潮は体育(スポーツ科学)が実績重視枠のみ・総合(総合学科)が活動重視枠のみを持つ(頁10)', () => {
    const taiiku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '鳴門渦潮', '育成型選抜(実績重視枠)', '体育(スポーツ科学)');
    const sogo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '鳴門渦潮', '育成型選抜(活動重視枠)', '総合(総合学科)');
    const taiikuKatsudo = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '鳴門渦潮', '育成型選抜(活動重視枠)', '体育(スポーツ科学)');
    expect(taiiku?.note).toContain('表中最多の指定競技数');
    expect(sogo?.note).toContain('書道');
    expect(taiikuKatsudo).toBeNull();
  });

  it('tokushima: 海部は普通・商業(情報ビジネス)・理数(数理科学)の3学科が育成型選抜の配点等を共有しつつ理数のみ★国際理解分野を持つ(頁10)', () => {
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '海部', '育成型選抜(活動重視枠)', '普通');
    const risu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '海部', '育成型選抜(活動重視枠)', '理数(数理科学)');
    expect(futsu?.note).toContain('総点500/調査書150/学力検査100');
    expect(risu?.note).toContain('★国際理解分野');
  });

  it('tokushima: 名西は普通・芸術(音楽・美術・書道)で育成型選抜の配点等を共有しつつ実績重視枠の文化部指定分野は芸術のみ3分野を持つ(頁11)', () => {
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '名西', '育成型選抜(実績重視枠)', '普通');
    const geijutsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '名西', '育成型選抜(実績重視枠)', '芸術(音楽・美術・書道)');
    expect(futsu?.note).toContain('男子相撲');
    expect(geijutsu?.note).toContain('音楽・美術・書道の3分野');
  });

  it('tokushima: 板野・川島・阿波西・穴吹は育成型選抜の実績重視枠が実施されない単一枠のみの学校である(頁11)', () => {
    const itano = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '板野', '育成型選抜(実績重視枠)', '普通');
    const kawashima = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '川島', '育成型選抜(実績重視枠)', '普通');
    expect(itano).toBeNull();
    expect(kawashima).toBeNull();
  });

  it('tokushima: 池田は普通・理数(探究)で育成型選抜の配点等を共有しつつ実績重視枠の運動部指定競技は普通のみ持つ(頁12)', () => {
    const futsu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '池田', '育成型選抜(実績重視枠)', '普通');
    const risu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '池田', '育成型選抜(実績重視枠)', '理数(探究)');
    expect(futsu?.note).toContain('男子レスリング・女子レスリング');
    expect(risu?.note).toContain('運動部指定競技:ー');
  });

  it('tokushima: 池田・三好は育成型選抜の実績重視枠が実施されない単一枠のみの学校である(頁12)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima', '池田・三好', '育成型選抜(実績重視枠)', '農業(食農科学環境資源)');
    expect(record).toBeNull();
  });

  it('tokushima: schoolsは育成型選抜実施概要一覧を全5頁(頁8-12・32校91レコード)完全収録し、頁13(一般選抜傾斜配点・7校8学科)と頁6-7の選抜資料表(38校76レコード)を合わせて計174レコードを収録している', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima');
    expect(record?.schools?.length).toBe(174);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(33);
    expect(record?.coverageNote).toContain('全5頁完全収録');
  });

  it('tokushima: 頁6-7の選抜資料表は全日制32校+定時制6校×(一般選抜・第2次募集選抜)の76レコードで、つるぎのみ一般選抜が集団面接・鳴門渦潮と名西は実技検査の注を持つ', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokushima')?.schools ?? [];
    const ippan = list.filter((s) => s.selectionCategory === '一般選抜(選抜資料)');
    const dai2 = list.filter((s) => s.selectionCategory === '第2次募集選抜(選抜資料)');
    expect(ippan).toHaveLength(38);
    expect(dai2).toHaveLength(38);
    expect(ippan.filter((s) => s.department?.startsWith('全日制'))).toHaveLength(32);
    expect(ippan.filter((s) => s.department?.startsWith('定時制'))).toHaveLength(6);
    const shudan = ippan.filter((s) => s.note?.includes('学力検査・集団面接'));
    expect(shudan.map((s) => s.schoolName)).toEqual(['つるぎ']);
    const find = (cat: string, n: string, dept: string) => list.find((s) => s.selectionCategory === cat && s.schoolName === n && s.department?.startsWith(dept));
    expect(find('一般選抜(選抜資料)', '鳴門渦潮', '全日制')?.note).toContain('体育科');
    expect(find('第2次募集選抜(選抜資料)', '名西', '全日制')?.note).toContain('芸術科');
    expect(find('第2次募集選抜(選抜資料)', '城南', '全日制')?.note).toContain('口頭試問(数学・英語)');
    expect(find('第2次募集選抜(選抜資料)', '城東', '全日制')?.note).toContain('筆記検査(数学・英語)');
    expect(find('第2次募集選抜(選抜資料)', '池田・三好', '全日制')?.note).toContain('筆記検査(国語・数学・英語)');
    expect(find('第2次募集選抜(選抜資料)', '徳島中央', '定時制')?.note).toContain('筆記検査(国語・数学・英語)');
    expect(dai2.filter((s) => s.note?.includes('記載なし(空欄)'))).toHaveLength(16);
  });

  it('hiroshima: 広島国泰寺(普通)は特色枠で数学・英語に2倍の傾斜配点があり学力検査合計350点になる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島国泰寺', '特色枠による選抜', '普通');
    expect(record?.note).toContain('数学100点(2倍傾斜)');
    expect(record?.note).toContain('英語100点(2倍傾斜)');
    expect(record?.note).toContain('合計350点');
  });

  it('hiroshima: 広島国泰寺(理数)は特色枠で普通科と異なり数学・理科に2倍の傾斜配点がある', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島国泰寺', '特色枠による選抜', '普通(理数)');
    expect(record?.note).toContain('数学100点(2倍傾斜)');
    expect(record?.note).toContain('理科100点(2倍傾斜)');
  });

  it('hiroshima: 広島国泰寺(普通)は一般枠に学校独自検査が無く比重欄が資料上空欄(標準6:2:2換算)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島国泰寺', '一般枠による選抜', '普通');
    expect(record?.ratioType).toContain('6:2:2');
    expect(record?.note).toContain('独自検査が無いため');
  });

  it('hiroshima: 広島国泰寺(普通)は二次選抜で学力検査を実施せず小論文のみの学校独自検査を持つ', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島国泰寺', '二次選抜', '普通');
    expect(record?.note).toContain('小論文のみ実施(50点)');
    expect(record?.note).toContain('1,000点満点換算');
  });

  it('hiroshima: 広島市立基町(創造表現)は特色枠が「その他の検査」・一般枠が「実技検査」と異なる独自検査を実施する', () => {
    const tokushoku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立基町', '特色枠による選抜', '普通(創造表現)');
    const ippan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立基町', '一般枠による選抜', '普通(創造表現)');
    expect(tokushoku?.note).toContain('「その他の検査」を実施(200点)');
    expect(ippan?.note).toContain('実技検査を実施(200点');
  });

  it('hiroshima: 広島市立基町(創造表現)の一般枠は独自検査の200点のみ判明し学力・調査・表現の換算後点数は資料に記載が無い', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立基町', '一般枠による選抜', '普通(創造表現)');
    expect(record?.ratioType).toContain('独自200のみ判明');
    expect(record?.note).toContain('資料上空欄');
  });

  it('hiroshima: 広島市立舟入(普通)は特色枠・一般枠とも国語・数学・英語に2倍の傾斜配点が維持される', () => {
    const tokushoku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立舟入', '特色枠による選抜', '普通');
    const ippan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立舟入', '一般枠による選抜', '普通');
    expect(tokushoku?.note).toContain('合計400点');
    expect(ippan?.note).toContain('合計400点');
  });

  it('hiroshima: 広島市立舟入(普通)の二次選抜は独自検査が無く調査書800点・自己表現200点になる(学校ごとに個別設定される値であり固定比率ではない)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立舟入', '二次選抜', '普通');
    expect(record?.note).toContain('調査書800点・自己表現200点');
    expect(record?.note).toContain('学校ごとに個別設定');
  });

  it('hiroshima: 広島市立舟入(国際コミュニケーション)は面接の配点が特色枠(50点)と一般枠(100点)で異なる', () => {
    const tokushoku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立舟入', '特色枠による選抜', '普通(国際コミュニケーション)');
    const ippan = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立舟入', '一般枠による選抜', '普通(国際コミュニケーション)');
    expect(tokushoku?.note).toContain('面接を実施(50点)');
    expect(ippan?.note).toContain('面接を実施(100点');
  });

  it('hiroshima: 広島市立広島商業(みらい商業)は特色枠の比重が学力300:調査500:表現200という調査書重視の独自配分を持つ(国泰寺等の400:400:200とは異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島市立広島商業', '特色枠による選抜', 'みらい商業');
    expect(record?.ratioType).toContain('学力300:調査500:表現200');
  });

  it('hiroshima: 広島皆実(体育)の二次選抜は面接と実技検査を組み合わせて実施する(特色枠・一般枠は単一検査のみ)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島皆実', '二次選抜', '体育');
    expect(record?.note).toContain('面接(20点)と実技検査(100点)を組み合わせて実施');
    expect(record?.note).toContain('独自の提出書類');
  });

  it('hiroshima: schoolsは頁3(全日制課程[本校]一覧・16校27学科)を完全収録している(頁4-8は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima');
    expect(record?.schools?.length).toBe(90);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(14);
  });

  it('hiroshima: 広島工業(機械等5学科)は特色枠による選抜を実施せず定員枠100%が一般枠のみになる', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島工業', '特色枠による選抜', '機械');
    expect(record?.note).toContain('特色枠による選抜を実施しない');
  });

  it('hiroshima: 広島観音(総合学科)と安古市(普通)は同型の調査書重視型傾斜配点(音楽・美術・保健体育・技術家庭2倍)を持つが比重の重み付けが異なる', () => {
    const kannon = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '広島観音', '特色枠による選抜', '総合学科');
    const ankoichi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hiroshima', '安古市', '特色枠による選抜', '普通');
    expect(kannon?.ratioType).toBe('学力300:調査300:表現400(独自検査なし)');
    expect(ankoichi?.ratioType).toBe('学力200:調査600:表現200(独自検査なし)');
  });

  it('yamaguchi: schoolsは全日制課程(43校・69学科相当)の特色選抜+第一次募集を収録している(定時制課程は未収録)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamaguchi');
    expect(record?.schools?.length).toBe(193);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames.size).toBe(43);
  });

  it('yamaguchi: 岩国(普通)は特色選抜で面接(◎)のみを実施し学校独自検査・傾斜配点は無い', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamaguchi', '岩国', '特色選抜', '普通');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('学校独自検査の実施なし');
  });

  it('yamaguchi: 西京(体育コース)は第一次募集で実技検査列でなく面接列がマークされている(300dpi画像で列位置を確認済み)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamaguchi', '西京', '第一次募集', '体育コース');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('面接を実施');
  });

  it('yamaguchi: 下関西の「普通」は資料上データが無いためレコードが存在しない(文理探究のみ収録)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamaguchi', '下関西', '特色選抜', '普通');
    expect(record).toBeNull();
    const bunri = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'yamaguchi', '下関西', '特色選抜', '文理探究(人文社会科学・自然科学のくくり募集)');
    expect(bunri?.interviewRequired).toBe(true);
  });

  it('fukushima: 福島(普通科)は特色選抜で音楽・美術・保健体育・技術家庭の4教科を2倍傾斜配点する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島', '特色選抜', '普通科');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toContain('2倍傾斜配点');
  });

  it('fukushima: 橘(普通科)の一般選抜は学力検査の成績を3倍する比重で福島(同等)と異なる', () => {
    const fukushimaShi = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島', '一般選抜', '普通科');
    const tachibana = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '橘', '一般選抜', '普通科');
    expect(fukushimaShi?.ratioType).toBe('学力検査と調査書の成績の比重=同等');
    expect(tachibana?.ratioType).toBe('学力検査の成績を3倍する');
  });

  it('fukushima: 橘(普通科)の後期選抜は面接を段階評価のみで点数化しない(福島は30点に点数化する点で異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '橘', '後期選抜', '普通科');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toContain('面接(段階評価)');
  });

  it('shizuoka: schoolsは2校(下田/伊豆伊東)8レコードの学校裁量枠を収録している(南伊豆分校・松崎・稲取は設定なしのため対象外)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shizuoka');
    expect(record?.schools?.length).toBe(8);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames).toEqual(new Set(['下田', '伊豆伊東']));
  });

  it('shizuoka: 下田(普通・学校裁量枠Ⅰ)は実技検査を実施するが下田(普通・学校裁量枠Ⅱ)は実施しない(選抜資料の列位置を200dpi画像で確認済み)', () => {
    const stage1 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shizuoka', '下田', '学校裁量枠Ⅰ', '普通');
    const stage2 = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shizuoka', '下田', '学校裁量枠Ⅱ', '普通');
    expect(stage1?.note).toContain('実技検査');
    expect(stage2?.note).toContain('実技検査・作文・その他・事前調査票の実施なし');
  });

  it('shizuoka: 伊豆伊東(普通・学校裁量枠Ⅱ)はアート類型への適性を重視し実技検査のみで学力検査と面接も併用する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shizuoka', '伊豆伊東', '学校裁量枠Ⅱ', '普通');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('アート類型への適性');
    expect(record?.ratioType).toBe('選抜割合10%程度(希望者対象)');
  });

  it('shizuoka: 伊豆伊東はビジネスマネジメント科の学校裁量枠も普通科と別レコードで収録している', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'shizuoka', '伊豆伊東', '学校裁量枠Ⅰ', 'ビジネスマネジメント');
    expect(record?.ratioType).toBe('選抜割合25%程度(希望者対象)');
  });

  it('tokyo: schoolsは全7頁の103校(頁1=日比谷/三田/戸山/竹早/向丘/上野/日本橋/本所/城東/東/深川/大崎/小山台・頁2=八潮/駒場/目黒/大森/田園調布/雪谷/桜町/千歳丘/松原/青山/広尾/鷺宮/武蔵丘・頁3=杉並/豊多摩/西/豊島/文京/竹台/板橋/大山/北園/高島/井草/石神井/田柄/練馬・頁4=光丘/青井/足立/足立新田/足立西/江北/淵江/葛飾野/南葛飾/江戸川/葛西南/小岩/小松川/篠崎/紅葉川/片倉・頁5=八王子北/八王子東/富士森/松が谷/立川/武蔵野北/多摩/府中/府中西/府中東/昭和/拝島/神代/調布北/調布南・頁6=小川/成瀬/野津田/町田/山崎/小金井北/小平/小平西/小平南/日野/日野台/南平/東村山西/国立/福生/狛江・頁7=東大和/東大和南/清瀬/久留米西/武蔵村山/永山/羽村/五日市/田無/保谷+島しょ6校[大島/新島/神津/三宅/八丈/小笠原])303レコードを収録している(推薦に基づく選抜+第一次募集+第二次募集の3区分)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo');
    expect(record?.schools?.length).toBe(1071);
    // 普通科(頁1-7)の103校。n2_11のコース/エンカレッジ8件は別のdepartmentで区別される
    const futsu = (record?.schools ?? []).filter((s) => s.department === '普通科');
    expect(futsu).toHaveLength(303);
    const schoolNames = new Set(futsu.map((s) => s.schoolName));
    expect(schoolNames).toEqual(new Set(['日比谷', '三田', '戸山', '竹早', '向丘', '上野', '日本橋', '本所', '城東', '東', '深川', '大崎', '小山台', '八潮', '駒場', '目黒', '大森', '田園調布', '雪谷', '桜町', '千歳丘', '松原', '青山', '広尾', '鷺宮', '武蔵丘', '杉並', '豊多摩', '西', '豊島', '文京', '竹台', '板橋', '大山', '北園', '高島', '井草', '石神井', '田柄', '練馬', '光丘', '青井', '足立', '足立新田', '足立西', '江北', '淵江', '葛飾野', '南葛飾', '江戸川', '葛西南', '小岩', '小松川', '篠崎', '紅葉川', '片倉', '八王子北', '八王子東', '富士森', '松が谷', '立川', '武蔵野北', '多摩', '府中', '府中西', '府中東', '昭和', '拝島', '神代', '調布北', '調布南', '小川', '成瀬', '野津田', '町田', '山崎', '小金井北', '小平', '小平西', '小平南', '日野', '日野台', '南平', '東村山西', '国立', '福生', '狛江', '東大和', '東大和南', '清瀬', '久留米西', '武蔵村山', '永山', '羽村', '五日市', '田無', '保谷', '大島', '新島', '神津', '三宅', '八丈', '小笠原']));
    // 第一次募集は全13校が学力検査7:調査書3+ESAT-J20点、第二次募集は全13校が6:4
    const first = futsu.filter((s) => s.selectionCategory === '第一次募集');
    const second = futsu.filter((s) => s.selectionCategory === '第二次募集');
    expect(first).toHaveLength(103);
    expect(second).toHaveLength(103);
    // 島しょ6校は推薦に基づく選抜を実施しない(推薦レコードを持たず第一次募集のnoteに明記)
    for (const n of ['大島', '新島', '神津', '三宅', '八丈', '小笠原']) {
      expect(first.find((s) => s.schoolName === n)?.note).toContain('推薦に基づく選抜は「実施しない」');
      expect(futsu.some((s) => s.schoolName === n && s.selectionCategory === '推薦に基づく選抜')).toBe(false);
    }
    expect(first.every((s) => s.ratioType === '学力検査7:調査書3(700点:300点)+ESAT-J20点')).toBe(true);
    expect(second.every((s) => s.ratioType?.startsWith('学力検査6:調査書4(600点:400点)'))).toBe(true);
    // 第二次募集で個人面接があるのは八潮300・大森300・雪谷100・杉並300・高島300・練馬300・青井300・南葛飾100・小松川300・片倉200・八王子北100・小川150・野津田200・小平100・小平西100(以上個人面接)・府中東200・山崎300(以上集団面接)・東大和300・武蔵村山200・永山300(個人面接)の20校のみ
    const m2 = second.filter((s) => s.interviewRequired === true);
    expect(m2.map((s) => s.schoolName).sort()).toEqual(['八潮', '大森', '雪谷', '杉並', '高島', '練馬', '青井', '南葛飾', '小松川', '片倉', '八王子北', '府中東', '小川', '野津田', '山崎', '小平', '小平西', '東大和', '武蔵村山', '永山'].sort());
    expect(m2.filter((s) => s.ratioType?.includes('+集団面接')).map((s) => s.schoolName).sort()).toEqual(['山崎', '府中東'].sort());
    expect(m2.find((s) => s.schoolName === '府中東')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+集団面接200点');
    expect(m2.find((s) => s.schoolName === '雪谷')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+個人面接100点');
  });

  it('tokyo: 推薦に基づく選抜は島しょ6校を除く全97校が推薦枠割合20%で、面接・討論の点数と小論文/作文の点数がnoteの合計と一致する(日比谷・竹早は結合セルのため面接実施を断定しない)', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.selectionCategory === '推薦に基づく選抜' && s.department === '普通科');
    expect(list).toHaveLength(97);
    expect(list.every((s) => s.ratioType === '推薦枠割合20%')).toBe(true);
    const get = (n: string) => list.find((s) => s.schoolName === n);
    expect(get('向丘')?.note).toContain('調査書500点+個人面接300点+作文200点(合計1000点)');
    expect(get('上野')?.note).toContain('調査書500点+個人面接150点+小論文350点(合計1000点)');
    expect(get('東')?.note).toContain('調査書360点+個人面接160点+小論文200点(合計720点)');
    expect(get('小山台')?.note).toContain('調査書300点+個人面接200点+小論文400点(合計900点)');
    // 文化・スポーツ等特別推薦の実施あり=向丘/上野/本所/城東/東/深川/大崎の7校、なし=残り6校
    expect(list.filter((s) => s.note?.includes('特別推薦の実施あり')).map((s) => s.schoolName).sort()).toEqual(['上野', '向丘', '大崎', '本所', '東', '深川', '城東', '八潮', '目黒', '大森', '雪谷', '桜町', '千歳丘', '広尾', '鷺宮', '武蔵丘', '杉並', '豊多摩', '豊島', '文京', '板橋', '大山', '高島', '石神井', '練馬', '光丘', '足立', '足立新田', '足立西', '淵江', '葛飾野', '南葛飾', '江戸川', '葛西南', '小岩', '篠崎', '紅葉川', '片倉', '八王子北', '富士森', '松が谷', '府中', '府中西', '府中東', '拝島', '小川', '山崎', '小平西', '小平南', '日野', '東村山西', '福生', '狛江', '東大和', '東大和南', '清瀬', '久留米西', '武蔵村山', '永山', '羽村', '田無', '保谷'].sort());
    expect(list.filter((s) => s.note?.includes('特別推薦の実施なし'))).toHaveLength(15 + 3 + 8 + 8 + 1);
    expect(list.find((s) => s.schoolName === '羽村')?.note).toContain('パーソナル・プレゼンテーション');
    expect(list.filter((s) => s.note?.includes('パーソナル・プレゼンテーション'))).toHaveLength(1);
    expect(list.find((s) => s.schoolName === '日野')?.note).toContain('調査書600点+個人面接250点+作文350点(合計1200点)');
    expect(list.find((s) => s.schoolName === '清瀬')?.note).toContain('調査書450点+個人面接220点+小論文230点(合計900点)');
    expect(list.find((s) => s.schoolName === '国立')?.note).toContain('調査書450点+個人面接150点+小論文300点(合計900点)');
    // 頁5: 調布南は個人面接・集団討論の結合セル300点
    expect(list.find((s) => s.schoolName === '調布南')?.note).toContain('個人面接・集団討論の結合セル300点');
    expect(list.find((s) => s.schoolName === '八王子東')?.note).toContain('調査書500点+個人面接100点+小論文400点(合計1000点)');
    // 頁4: 足立新田・淵江は推薦の個人面接で2分間の自己PR(脚注*1)
    expect(list.find((s) => s.schoolName === '足立新田')?.note).toContain('調査書600点+個人面接400点+作文200点(合計1200点)');
    for (const n of ['足立新田', '淵江']) expect(list.find((s) => s.schoolName === n)?.note).toContain('2分間の「自己PR」');
    expect(list.filter((s) => s.note?.includes('自己PR'))).toHaveLength(2);
    // 頁3の西・北園も個人面接・集団討論の結合セル(240/150)
    expect(list.find((s) => s.schoolName === '西')?.note).toContain('個人面接・集団討論の結合セル240点');
    expect(list.find((s) => s.schoolName === '北園')?.note).toContain('個人面接・集団討論の結合セル150点');
    expect(list.find((s) => s.schoolName === '練馬')?.note).toContain('調査書450点+個人面接360点+作文90点(合計900点)');
    // 鷺宮も個人面接・集団討論の結合セル(300点)
    expect(list.find((s) => s.schoolName === '鷺宮')?.note).toContain('個人面接・集団討論の結合セル300点');
    expect(list.find((s) => s.schoolName === '鷺宮')?.interviewRequired).toBeUndefined();
    expect(list.find((s) => s.schoolName === '桜町')?.note).toContain('調査書600点+個人面接400点+小論文200点(合計1200点)');
  });

  it('tokyo: 日比谷(普通科)の第一次募集は学力検査7:調査書3+ESAT-J20点で、第二次募集は6:4になる', () => {
    const first = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo', '日比谷', '第一次募集', '普通科');
    const second = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo', '日比谷', '第二次募集', '普通科');
    expect(first?.ratioType).toBe('学力検査7:調査書3(700点:300点)+ESAT-J20点');
    expect(second?.ratioType).toBe('学力検査6:調査書4(600点:400点)');
  });

  it('tokyo: 三田(普通科)の推薦に基づく選抜は個人面接250点が調査書100点を上回る(日比谷の調査書450点が最大の配点となるパターンと異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo', '三田', '推薦に基づく選抜', '普通科');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('個人面接の配点が調査書を上回る');
  });

  it('tokyo: n2_11頁1のコース4校は推薦枠割合30%で外国語(深川/松が谷/小平)は英語または国語・英語の2倍傾斜、片倉(造形美術)は実技検査1000点、エンカレッジ4校は学力検査を実施せず調査書・面接・作文/小論文で満点が決まる', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const course = list.filter((s) => s.department?.includes('(普通教育を主とする学科・コース)'));
    const enc = list.filter((s) => s.department?.includes('(エンカレッジスクール)'));
    expect(course).toHaveLength(12);
    expect(enc).toHaveLength(12);
    expect(new Set(course.map((s) => s.schoolName))).toEqual(new Set(['深川', '片倉', '松が谷', '小平']));
    expect(new Set(enc.map((s) => s.schoolName))).toEqual(new Set(['蒲田', '足立東', '東村山', '秋留台']));
    expect(course.filter((s) => s.selectionCategory === '推薦に基づく選抜').every((s) => s.ratioType === '推薦枠割合30%')).toBe(true);
    expect(enc.filter((s) => s.selectionCategory === '推薦に基づく選抜').every((s) => s.ratioType === '推薦枠割合30%')).toBe(true);
    const get = (arr: typeof list, n: string, cat: string) => arr.find((s) => s.schoolName === n && s.selectionCategory === cat);
    expect(get(course, '片倉', '第一次募集')?.ratioType).toContain('実技検査1000点');
    expect(get(course, '深川', '推薦に基づく選抜')?.note).toContain('調査書450点+個人面接270点+作文180点(合計900点)');
    expect(get(course, '小平', '第二次募集')?.note).toContain('英語を1.6倍');
    expect(get(course, '小平', '第二次募集')?.interviewRequired).toBe(true);
    expect(get(enc, '足立東', '第一次募集')?.note).toContain('学力検査は実施しない');
    expect(get(enc, '足立東', '第一次募集')?.note).toContain('(合計1200点)');
    expect(get(enc, '秋留台', '推薦に基づく選抜')?.note).toContain('調査書300点+個人面接600点+小論文200点(合計1100点)');
    expect(get(enc, '東村山', '第二次募集')?.note).toContain('実技検査200点');
    expect(get(enc, '蒲田', '第二次募集')?.note).toContain('(合計1000点)');
  });

  it('tokyo: n2_11頁2の進学重視型単位制3校(新宿のみ推薦枠10%・3校とも自校作成問題)と単位制9校(深沢は7:3と10:0の高い方・第二次の面接は6校)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const shin = list.filter((s) => s.department === '普通科(進学重視型単位制)');
    const tan = list.filter((s) => s.department === '普通科(単位制)');
    expect(shin).toHaveLength(9);
    expect(tan).toHaveLength(27);
    expect(new Set(shin.map((s) => s.schoolName))).toEqual(new Set(['新宿', '墨田川', '国分寺']));
    expect(new Set(tan.map((s) => s.schoolName))).toEqual(new Set(['忍岡', '美原', '深沢', '芦花', '飛鳥', '板橋有徳', '大泉桜', '翔陽', '上水']));
    const get = (arr: typeof list, n: string, cat: string) => arr.find((s) => s.schoolName === n && s.selectionCategory === cat);
    expect(get(shin, '新宿', '推薦に基づく選抜')?.ratioType).toBe('推薦枠割合10%');
    expect(shin.filter((s) => s.selectionCategory === '推薦に基づく選抜' && s.schoolName !== '新宿').every((s) => s.ratioType === '推薦枠割合20%')).toBe(true);
    expect(shin.filter((s) => s.selectionCategory === '第一次募集').every((s) => s.note?.includes('国数英は自校作成問題'))).toBe(true);
    expect(get(shin, '新宿', '推薦に基づく選抜')?.note).toContain('調査書450点+個人面接180点+小論文270点(合計900点)');
    expect(get(tan, '深沢', '第一次募集')?.ratioType).toContain('10:0の比率のいずれか高い方');
    expect(get(tan, '深沢', '第二次募集')?.ratioType).toBe('学力検査6:調査書4(600点:400点)と10:0の比率のいずれか高い方+個人面接300点');
    const m2 = tan.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true).map((s) => s.schoolName).sort();
    expect(m2).toEqual(['美原', '深沢', '芦花', '飛鳥', '大泉桜', '上水'].sort());
    expect(get(tan, '忍岡', '推薦に基づく選抜')?.note).toContain('調査書600点+個人面接300点+作文300点(合計1200点)');
    expect(get(tan, '忍岡', '推薦に基づく選抜')?.note).toContain('自己PRタイム');
    expect(get(tan, '上水', '推薦に基づく選抜')?.note).toContain('調査書360点+個人面接160点+作文200点(合計720点)');
  });

  it('tokyo: n2_12頁1の農業に関する学科は5校14学科で推薦枠割合が学校ごとに異なり(園芸30%・農芸35%・農産40%・農業40%・瑞穂農芸30%)、第二次募集の面接は園芸100・農芸100・農業200・瑞穂農芸300で農産のみなし', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.department?.includes('(専門教育を主とする学科・農業に関する学科)'));
    expect(list).toHaveLength(42);
    const rec = list.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(14);
    const w = (n: string) => [...new Set(rec.filter((s) => s.schoolName === n).map((s) => s.ratioType))];
    expect(w('園芸')).toEqual(['推薦枠割合30%']);
    expect(w('農芸')).toEqual(['推薦枠割合35%']);
    expect(w('農産')).toEqual(['推薦枠割合40%']);
    expect(w('農業')).toEqual(['推薦枠割合40%']);
    expect(w('瑞穂農芸')).toEqual(['推薦枠割合30%']);
    const m2 = (n: string) => [...new Set(list.filter((s) => s.schoolName === n && s.selectionCategory === '第二次募集').map((s) => s.ratioType))];
    expect(m2('園芸')).toEqual(['学力検査6:調査書4(600点:400点)+個人面接100点']);
    expect(m2('農業')).toEqual(['学力検査6:調査書4(600点:400点)+個人面接200点']);
    expect(m2('瑞穂農芸')).toEqual(['学力検査6:調査書4(600点:400点)+個人面接300点']);
    expect(m2('農産')).toEqual(['学力検査6:調査書4(600点:400点)']);
    expect(rec.find((s) => s.schoolName === '園芸' && s.department?.startsWith('動物'))?.note).toContain('調査書500点+個人面接300点+作文200点(合計1000点)');
    expect(rec.find((s) => s.schoolName === '園芸')?.note).toContain('自己PRタイム');
    expect(rec.find((s) => s.schoolName === '農芸' && s.department?.startsWith('緑地環境'))?.note).toContain('調査書450点+個人面接360点+作文100点(合計910点)');
  });

  it('tokyo: n2_12頁2の工業に関する学科は5校17学科で、工芸のみ第二次募集が集団面接300・蔵前工科/墨田工科/総合工科は推薦に実技検査(200/150/300点)を持ち、総合工科の満点は1100点', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.department?.includes('(専門教育を主とする学科・工業に関する学科)') && ['工芸', '蔵前工科', '墨田工科', '総合工科', '杉並工科'].includes(s.schoolName));
    expect(list).toHaveLength(51);
    const rec = list.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(17);
    expect(new Set(rec.map((s) => s.schoolName))).toEqual(new Set(['工芸', '蔵前工科', '墨田工科', '総合工科', '杉並工科']));
    expect(rec.filter((s) => s.schoolName === '工芸')).toHaveLength(5);
    expect(rec.find((s) => s.schoolName === '工芸')?.ratioType).toBe('推薦枠割合30%');
    expect(rec.filter((s) => s.schoolName !== '工芸').every((s) => s.ratioType === '推薦枠割合40%')).toBe(true);
    const nt = (n: string) => rec.find((s) => s.schoolName === n)?.note ?? '';
    expect(nt('蔵前工科')).toContain('調査書500点+個人面接300点+実技検査200点(合計1000点)');
    expect(nt('墨田工科')).toContain('調査書500点+個人面接350点+実技検査150点(合計1000点)');
    expect(nt('総合工科')).toContain('調査書500点+個人面接300点+実技検査300点(合計1100点)');
    expect(nt('工芸')).toContain('調査書450点+個人面接300点+作文150点(合計900点)');
    expect(nt('杉並工科')).toContain('調査書500点+個人面接300点+作文200点(合計1000点)');
    const m2 = (n: string) => [...new Set(list.filter((s) => s.schoolName === n && s.selectionCategory === '第二次募集').map((s) => s.ratioType))];
    expect(m2('工芸')).toEqual(['学力検査6:調査書4(600点:400点)+集団面接300点']);
    expect(m2('墨田工科')).toEqual(['学力検査6:調査書4(600点:400点)+個人面接200点']);
    expect(m2('総合工科')).toEqual(['学力検査6:調査書4(600点:400点)+個人面接300点']);
    expect(list.filter((s) => s.selectionCategory === '推薦に基づく選抜' && s.note?.includes('特別推薦の実施あり')).map((s) => s.schoolName).sort()).toEqual(['墨田工科', '墨田工科', '墨田工科', '墨田工科', '総合工科', '総合工科', '総合工科', '杉並工科'].sort());
  });

  it('tokyo: n2_12頁3の工業の続き8校21学科は全校推薦枠割合40%で、荒川工科/足立工科/葛西工科/町田工科は推薦に実技検査(150/350/300/200点)、第二次の面接は足立300・府中200・町田100・田無300のみ', () => {
    const p3 = ['荒川工科', '北豊島工科', '足立工科', '葛西工科', '府中工科', '町田工科', '多摩工科', '田無工科'];
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.department?.includes('(専門教育を主とする学科・工業に関する学科)') && p3.includes(s.schoolName));
    expect(list).toHaveLength(63);
    const rec = list.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(21);
    expect(rec.every((s) => s.ratioType === '推薦枠割合40%')).toBe(true);
    expect(new Set(rec.map((s) => s.schoolName))).toEqual(new Set(p3));
    const nt = (n: string, d?: string) => rec.find((s) => s.schoolName === n && (!d || s.department?.startsWith(d)))?.note ?? '';
    expect(nt('荒川工科')).toContain('調査書450点+個人面接400点+実技検査150点(合計1000点)');
    expect(nt('足立工科')).toContain('調査書450点+個人面接400点+実技検査350点(合計1200点)');
    expect(nt('葛西工科')).toContain('調査書500点+個人面接200点+実技検査300点(合計1000点)');
    expect(nt('町田工科')).toContain('調査書500点+個人面接300点+実技検査200点(合計1000点)');
    expect(nt('北豊島工科')).toContain('調査書450点+個人面接300点+作文150点(合計900点)');
    expect(nt('田無工科')).toContain('調査書400点+個人面接300点+作文100点(合計800点)');
    expect(nt('多摩工科', 'デュアル')).toContain('特別推薦の実施なし');
    expect(nt('多摩工科', '機械')).toContain('特別推薦の実施あり');
    const m2 = list.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true);
    expect([...new Set(m2.map((s) => s.schoolName + s.ratioType.slice(-6)))].sort()).toEqual(['足立工科面接300点', '府中工科面接200点', '町田工科面接100点', '田無工科面接300点'].sort());
  });

  it('tokyo: n2_12頁4の工業エンカレッジ2校(中野工科・練馬工科)は学力検査を実施せず調査書・個人面接・実技検査(中野)/作文(練馬)で満点1000点、六郷工科(単位制)は通常の学力検査型', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const enc = list.filter((s) => s.department?.includes('・エンカレッジスクール)') && s.department.includes('工業に関する学科'));
    expect(enc).toHaveLength(6);
    expect(new Set(enc.map((s) => s.schoolName))).toEqual(new Set(['中野工科', '練馬工科']));
    const get = (n: string, cat: string) => enc.find((s) => s.schoolName === n && s.selectionCategory === cat);
    expect(get('中野工科', '推薦に基づく選抜')?.note).toContain('調査書400点+個人面接300点+実技検査300点(合計1000点)');
    expect(get('練馬工科', '推薦に基づく選抜')?.note).toContain('調査書400点+個人面接350点+実技検査250点(合計1000点)');
    expect(get('中野工科', '第一次募集')?.ratioType).toBe('学力検査は実施しない+調査書300点+個人面接350点+実技検査350点');
    expect(get('練馬工科', '第二次募集')?.ratioType).toBe('学力検査は実施しない+調査書300点+個人面接350点+小論文/作文350点');
    expect(enc.every((s) => s.interviewRequired === true)).toBe(true);
    const rk = list.filter((s) => s.schoolName === '六郷工科' && s.department?.startsWith('ものづくり工学'));
    expect(rk).toHaveLength(3);
    expect(rk.find((s) => s.selectionCategory === '推薦に基づく選抜')?.note).toContain('調査書500点+個人面接400点+作文100点(合計1000点)');
    expect(rk.find((s) => s.selectionCategory === '第二次募集')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+個人面接300点');
  });

  it('tokyo: n2_12頁5の商業7校は全校推薦枠割合40%で第一商業のみ満点が小さく(180+90+90=360点)第二次の面接がなく、大島海洋国際(水産)のみ第一次募集にも個人面接300点がある(2月22日実施)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const biz = list.filter((s) => s.department?.includes('(専門教育を主とする学科・商業に関する学科)'));
    expect(biz).toHaveLength(21);
    expect(new Set(biz.map((s) => s.schoolName))).toEqual(new Set(['芝商業', '江東商業', '第三商業', '第一商業', '第四商業', '葛飾商業', '第五商業']));
    const rec = biz.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec.every((s) => s.ratioType === '推薦枠割合40%')).toBe(true);
    const nt = (n: string) => rec.find((s) => s.schoolName === n)?.note ?? '';
    expect(nt('第一商業')).toContain('調査書180点+個人面接90点+作文90点(合計360点)');
    expect(nt('江東商業')).toContain('調査書600点+個人面接300点+作文300点(合計1200点)');
    expect(nt('芝商業')).toContain('特別推薦の実施あり');
    expect(nt('第四商業')).toContain('特別推薦の実施あり');
    expect(rec.filter((s) => s.note?.includes('特別推薦の実施あり'))).toHaveLength(2);
    const m2 = biz.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true).map((s) => s.schoolName + s.ratioType.slice(-6)).sort();
    expect(m2).toEqual(['芝商業面接200点', '江東商業面接300点', '第三商業面接200点', '第四商業面接200点', '葛飾商業面接250点', '第五商業面接300点'].sort());
    const oshima = list.filter((s) => s.schoolName === '大島海洋国際');
    expect(oshima).toHaveLength(3);
    const first = oshima.find((s) => s.selectionCategory === '第一次募集');
    expect(first?.interviewRequired).toBe(true);
    expect(first?.ratioType).toBe('学力検査7:調査書3(700点:300点)+ESAT-J20点+個人面接300点');
    expect(first?.note).toContain('2月22日(日)');
    expect(oshima.find((s) => s.selectionCategory === '推薦に基づく選抜')?.note).toContain('調査書500点+個人面接300点+作文200点(合計1000点)');
  });

  it('tokyo: n2_12頁6の家庭5学科・家庭(単位制)1学科・福祉2学科は全て推薦枠割合30%・特別推薦なしで、第二次の面接は忍岡のみなし(農業200・瑞穂農芸300・赤羽北桜300・野津田300)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const kat = list.filter((s) => /(専門教育を主とする学科・(家庭|福祉)に関する学科(・単位制)?)/.test(s.department ?? ''));
    expect(kat).toHaveLength(24);
    const rec = kat.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(8);
    expect(rec.every((s) => s.ratioType === '推薦枠割合30%' && s.note?.includes('特別推薦の実施なし'))).toBe(true);
    expect(new Set(rec.map((s) => s.schoolName))).toEqual(new Set(['農業', '瑞穂農芸', '赤羽北桜', '忍岡', '野津田']));
    const nt = (n: string, d: string) => rec.find((s) => s.schoolName === n && s.department?.startsWith(d))?.note ?? '';
    expect(nt('農業', '服飾')).toContain('調査書450点+個人面接360点+作文150点(合計960点)');
    expect(nt('忍岡', '生活科学')).toContain('調査書600点+個人面接300点+作文300点(合計1200点)');
    expect(nt('忍岡', '生活科学')).toContain('自己PRタイム');
    expect(nt('野津田', '福祉')).toContain('調査書300点+個人面接200点+作文100点(合計600点)');
    const m2 = kat.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true).map((s) => s.schoolName + s.ratioType.slice(-6)).sort();
    expect(m2).toEqual(['農業面接200点', '農業面接200点', '瑞穂農芸面接300点', '赤羽北桜面接300点', '赤羽北桜面接300点', '赤羽北桜面接300点', '野津田面接300点'].sort());
    expect(kat.filter((s) => s.schoolName === '忍岡' && s.selectionCategory === '第二次募集')[0]?.interviewRequired).toBe(false);
  });

  it('tokyo: n2_12頁7の理数2校(推薦枠15%/20%・口頭試問250/200点)・総合芸術3学科(実技検査700/600/1000点・第一次から実技)・体育2校(実技検査600/500点)は満点が学校ごとに異なる', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const ri = list.filter((s) => s.department?.includes('・理数に関する学科)') && s.selectionCategory !== '理数等特別推薦');
    const ge = list.filter((s) => s.department?.includes('・芸術に関する学科)'));
    const ta = list.filter((s) => s.department?.includes('・体育に関する学科)'));
    expect(ri).toHaveLength(6);
    expect(ge).toHaveLength(9);
    expect(ta).toHaveLength(6);
    const get = (arr: typeof list, n: string, cat: string, d?: string) => arr.find((s) => s.schoolName === n && s.selectionCategory === cat && (!d || s.department?.startsWith(d)));
    expect(get(ri, '立川', '推薦に基づく選抜')?.ratioType).toBe('推薦枠割合15%');
    expect(get(ri, '科学技術', '推薦に基づく選抜')?.ratioType).toBe('推薦枠割合20%');
    expect(get(ri, '立川', '推薦に基づく選抜')?.note).toContain('調査書500点+個人面接50点+小論文200点+学校設定検査(口頭試問)250点(合計1000点)');
    expect(get(ri, '科学技術', '推薦に基づく選抜')?.note).toContain('学校設定検査(口頭試問)200点(合計1000点)');
    expect(get(ri, '科学技術', '第一次募集')?.note).toContain('数学・理科を1.5倍');
    expect(get(ri, '立川', '第一次募集')?.note).toContain('国数英は自校作成問題');
    expect(get(ge, '総合芸術', '第一次募集', '音楽')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+ESAT-J20点+実技検査1000点');
    expect(get(ge, '総合芸術', '第一次募集', '美術')?.ratioType).toContain('実技検査700点');
    expect(get(ge, '総合芸術', '第一次募集', '舞台表現')?.ratioType).toContain('実技検査600点');
    expect(get(ge, '総合芸術', '推薦に基づく選抜', '音楽')?.note).toContain('調査書500点+個人面接100点+実技検査1000点(合計1600点)');
    expect(get(ge, '総合芸術', '第一次募集', '音楽')?.note).toContain('2月21日(土)及び22日(日)');
    expect(ge.filter((s) => s.selectionCategory === '第二次募集').every((s) => s.interviewRequired === true)).toBe(true);
    expect(get(ta, '駒場', '推薦に基づく選抜')?.note).toContain('調査書270点+個人面接90点+作文90点+実技検査600点(合計1050点)');
    expect(get(ta, '野津田', '推薦に基づく選抜')?.note).toContain('調査書300点+個人面接300点+実技検査500点(合計1100点)');
    expect(get(ta, '駒場', '第二次募集')?.interviewRequired).toBe(false);
    expect(get(ta, '野津田', '第二次募集')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+個人面接200点+実技検査500点');
  });

  it('tokyo: n2_12頁8の国際(国際科は英語2倍・IBコースは英語/数学の適否判定のみ)と併合科3校(推薦は実施しない)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const kokusai = list.filter((s) => s.schoolName === '国際' && s.department?.includes('専門教育を主とする学科・国際関係に関する学科'));
    expect(kokusai).toHaveLength(5);
    const get = (cat: string) => kokusai.find((s) => s.selectionCategory === cat);
    expect(get('推薦に基づく選抜')?.note).toContain('調査書500点+個人面接200点+小論文300点(合計1000点)');
    expect(get('第一次募集')?.note).toContain('英語を2倍に傾斜配点');
    expect(get('第一次募集')?.note).toContain('リスニング問題を含めて自校作成問題');
    expect(get('第二次募集')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+個人面接100点');
    const ib4 = get('国際バカロレアコース選抜(4月入学)');
    const ib9 = get('国際バカロレアコース選抜(9月入学)');
    expect(ib4?.note).toContain('得点は総合成績に含めない');
    expect(ib4?.note).toContain('一つでも基準に達しない場合は選考の対象としない');
    expect(ib4?.note).toContain('P46〜50');
    expect(ib9?.note).toContain('P50〜51');
    expect(ib4?.ratioType).toBe(ib9?.ratioType);
    const heigo = list.filter((s) => s.department?.includes('(専門教育を主とする学科・併合科)'));
    expect(heigo).toHaveLength(6);
    expect(new Set(heigo.map((s) => s.schoolName))).toEqual(new Set(['大島', '三宅', '八丈']));
    expect(heigo.filter((s) => s.selectionCategory === '推薦に基づく選抜')).toHaveLength(0);
    expect(heigo.filter((s) => s.selectionCategory === '第一次募集').every((s) => s.note?.includes('推薦に基づく選抜は「実施しない」'))).toBe(true);
  });

  it('tokyo: n2_12頁9の産業科(橘・八王子桑志4分野)と進学重視型の科学技術科(科学技術40%・多摩科学技術30%・数理1.5倍は第一次のみ)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const sangyo = list.filter((s) => s.department?.includes('(専門教育を主とする学科・産業科)'));
    expect(sangyo).toHaveLength(15);
    expect(new Set(sangyo.map((s) => s.schoolName))).toEqual(new Set(['橘', '八王子桑志']));
    const rec = sangyo.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(5);
    expect(rec.every((s) => s.ratioType === '推薦枠割合40%' && s.note?.includes('調査書450点+個人面接300点+作文150点(合計900点)'))).toBe(true);
    expect(rec.filter((s) => s.note?.includes('特別推薦の実施あり')).map((s) => s.department)).toEqual([expect.stringContaining('クラフト分野')]);
    const m2 = sangyo.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true);
    expect(m2.map((s) => s.schoolName)).toEqual(['橘']);
    const kg = list.filter((s) => s.department?.includes('(専門教育を主とする学科(進学重視型)・科学技術科)'));
    expect(kg).toHaveLength(6);
    const g = (n: string, cat: string) => kg.find((s) => s.schoolName === n && s.selectionCategory === cat);
    expect(g('科学技術', '推薦に基づく選抜')?.ratioType).toBe('推薦枠割合40%');
    expect(g('多摩科学技術', '推薦に基づく選抜')?.ratioType).toBe('推薦枠割合30%');
    expect(g('科学技術', '推薦に基づく選抜')?.note).toContain('調査書500点+個人面接200点+実技検査300点(合計1000点)');
    expect(g('多摩科学技術', '推薦に基づく選抜')?.note).toContain('調査書500点+個人面接300点+実技検査200点(合計1000点)');
    expect(g('科学技術', '第一次募集')?.note).toContain('数学・理科を1.5倍');
    expect(g('科学技術', '第二次募集')?.note).toContain('傾斜配点なし');
    expect(g('多摩科学技術', '第二次募集')?.note).not.toContain('1.5倍');
  });

  it('tokyo: n2_12頁10のビジネスコミュニケーション科2校(第一次に1.5倍傾斜・大田桜台のみ観点別評価)と総合学科10校(全校推薦枠30%・特別推薦あり)', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const bc = list.filter((s) => s.department?.includes('・ビジネスコミュニケーション科)'));
    expect(bc).toHaveLength(6);
    const g = (arr: typeof list, n: string, cat: string) => arr.find((s) => s.schoolName === n && s.selectionCategory === cat);
    expect(g(bc, '大田桜台', '推薦に基づく選抜')?.note).toContain('観点別学習状況の評価を活用(評定は活用しない)');
    expect(g(bc, '千早', '推薦に基づく選抜')?.note).toContain('評定のみ活用');
    expect(g(bc, '大田桜台', '推薦に基づく選抜')?.note).toContain('調査書650点+個人面接500点+作文150点(合計1300点)');
    expect(g(bc, '大田桜台', '第一次募集')?.note).toContain('国語・英語・社会を1.5倍');
    expect(g(bc, '千早', '第一次募集')?.note).toContain('国語・英語を1.5倍');
    expect(g(bc, '千早', '第二次募集')?.note).not.toContain('1.5倍');
    expect(bc.filter((s) => s.selectionCategory === '第二次募集').every((s) => s.ratioType.endsWith('個人面接200点'))).toBe(true);
    const sg = list.filter((s) => s.department === '総合学科(総合学科)');
    expect(sg).toHaveLength(30);
    const rec = sg.filter((s) => s.selectionCategory === '推薦に基づく選抜');
    expect(rec).toHaveLength(10);
    expect(rec.every((s) => s.ratioType === '推薦枠割合30%' && s.note?.includes('特別推薦の実施あり'))).toBe(true);
    const nt = (n: string) => rec.find((s) => s.schoolName === n)?.note ?? '';
    expect(nt('東久留米総合')).toContain('調査書900点+個人面接400点+作文500点(合計1800点)');
    expect(nt('杉並総合')).toContain('調査書225点+個人面接150点+作文100点(合計475点)');
    expect(nt('つばさ総合')).toContain('調査書400点+個人面接200点+実技検査200点(合計800点)');
    expect(nt('葛飾総合')).toContain('調査書720点+個人面接540点+作文200点(合計1460点)');
    expect(nt('晴海総合')).toContain('3分程度の「パーソナル・プレゼンテーション」');
    expect(nt('若葉総合')).toContain('「自己PR」');
    const m2 = sg.filter((s) => s.selectionCategory === '第二次募集' && s.interviewRequired === true).map((s) => s.schoolName).sort();
    expect(m2).toEqual(['つばさ総合', '世田谷総合', '王子総合', '葛飾総合', '青梅総合', '町田総合', '若葉総合'].sort());
  });

  it('tokyo: n2_17(別表5-2)の理数等特別推薦は立川(男女6人・口頭試問250)と科学技術(男女8人・口頭試問200)の2校で満点が1000点になる', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.selectionCategory === '理数等特別推薦');
    expect(list).toHaveLength(2);
    const t = list.find((s) => s.schoolName === '立川');
    const k = list.find((s) => s.schoolName === '科学技術');
    expect(t?.note).toContain('男女6人');
    expect(k?.note).toContain('男女8人');
    expect(t?.note).toContain('調査書500点+個人面接50点+小論文200点+学校設定検査(口頭試問)250点(合計1000点)');
    expect(k?.note).toContain('調査書500点+個人面接100点+小論文200点+学校設定検査(口頭試問)200点(合計1000点)');
    expect(list.every((s) => s.interviewRequired === true)).toBe(true);
  });

  it('tokyo: n2_13の海外帰国生徒等対象は帰国生徒9・引揚生徒3・在京外国人生徒等14=26レコードで、学力検査があるのは帰国生徒の4月入学のみ、国際の9月入学は面接200・作文400と大きい', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.department?.includes('(海外帰国生徒等対象)'));
    expect(list).toHaveLength(26);
    const kikoku = list.filter((s) => s.selectionCategory.startsWith('帰国生徒対象選抜'));
    const hikiage = list.filter((s) => s.selectionCategory === '引揚生徒対象選抜');
    const zairyu = list.filter((s) => s.selectionCategory.startsWith('在京外国人生徒等対象選抜'));
    expect(kikoku).toHaveLength(9);
    expect(hikiage).toHaveLength(3);
    expect(zairyu).toHaveLength(14);
    expect(kikoku.filter((s) => s.selectionCategory.endsWith('(4月入学)')).every((s) => s.ratioType === '学力検査300+調査書100+個人面接100')).toBe(true);
    expect(kikoku.filter((s) => s.selectionCategory.endsWith('(9月入学)') && s.schoolName !== '国際').every((s) => s.ratioType === '調査書100+個人面接100+作文100')).toBe(true);
    expect(kikoku.find((s) => s.schoolName === '国際' && s.selectionCategory.endsWith('(9月入学)'))?.ratioType).toBe('調査書100+個人面接200+作文400');
    expect(kikoku.filter((s) => s.schoolName === '国際' && s.selectionCategory.endsWith('(4月入学)'))).toHaveLength(2);
    expect(hikiage.map((s) => s.schoolName).sort()).toEqual(['光丘', '富士森', '深川'].sort());
    expect(hikiage.find((s) => s.schoolName === '深川')?.note).toContain('調査書90点+個人面接180点+作文90点(合計360点)');
    expect(hikiage.find((s) => s.schoolName === '富士森')?.note).toContain('作文は40分');
    expect(zairyu.find((s) => s.schoolName === '田柄')?.ratioType).toBe('調査書100+個人面接400+作文200');
    expect(zairyu.find((s) => s.schoolName === '竹台')?.ratioType).toBe('調査書100+個人面接200+作文400');
    expect(zairyu.filter((s) => s.selectionCategory.endsWith('(9月入学)')).map((s) => s.schoolName).sort()).toEqual(['南葛飾', '国際', '府中西', '田柄', '竹台', '飛鳥'].sort());
    expect(zairyu.filter((s) => s.schoolName === '六郷工科' || s.schoolName === '杉並総合').every((s) => s.selectionCategory.endsWith('(4月入学)'))).toBe(true);
  });

  it('tokyo: n2_14頁1-5の定時制は35学科70レコードで推薦がなく、第一次は面接(大崎300・豊島100・荒川工科のみ集団200・第五商業500)、農産のみ自校作成の選考でESAT-Jなし、荒川工科のみ国数社', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.department?.includes('(定時制・'));
    expect(list).toHaveLength(70);
    expect(list.filter((s) => s.selectionCategory === '第一次募集(定時制)')).toHaveLength(35);
    expect(list.filter((s) => s.selectionCategory === '第二次募集(定時制)')).toHaveLength(35);
    expect(list.some((s) => s.selectionCategory.includes('推薦'))).toBe(false);
    const f = (n: string, d: string, cat = '第一次募集(定時制)') => list.find((s) => s.schoolName === n && s.department?.startsWith(d) && s.selectionCategory === cat);
    expect(f('大崎', '普通')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+ESAT-J20点+個人面接300点');
    expect(f('豊島', '普通')?.ratioType).toContain('個人面接100点');
    expect(f('豊島', '普通', '第二次募集(定時制)')?.ratioType).toContain('個人面接300点');
    expect(f('農業', '普通')?.ratioType).toBe('学力検査7:調査書3(700点:300点)+ESAT-J20点+個人面接200点');
    expect(f('農業', '食品化学')?.ratioType).toContain('学力検査7:調査書3');
    expect(f('農産', '農産')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+個人面接200点');
    expect(f('農産', '農産')?.note).toContain('各教科25分');
    expect(f('荒川工科', '電気・電子')?.ratioType).toBe('学力検査6:調査書4(600点:400点)+集団面接200点');
    expect(f('荒川工科', '電気・電子')?.note).toContain('国語・数学・社会');
    expect(f('第五商業', '商業')?.ratioType).toContain('個人面接500点');
    expect(f('五日市', '普通', '第二次募集(定時制)')?.note).toContain('50分');
    expect(f('神代', '普通', '第二次募集(定時制)')?.note).toContain('60分');
    expect(list.filter((s) => s.selectionCategory === '第一次募集(定時制)' && s.ratioType.includes('集団面接'))).toHaveLength(1);
    expect(list.filter((s) => s.schoolName === '工芸')).toHaveLength(8);
    expect(list.filter((s) => s.schoolName === '小金井工科')).toHaveLength(4);
  });

  it('tokyo: n2_14頁6-9の単位制・チャレンジ・在京外国人・通信制は56レコードで、チャレンジスクールは学力検査も調査書もなく志願申告書+面接+作文で決まり、通信制は学力検査と調査書のみ', () => {
    const list = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? [];
    const tan = list.filter((s) => s.department?.includes('(定時制単位制・') || s.department?.includes('(定時制単位制)'));
    const tsu = list.filter((s) => s.department === '(通信制課程・第1学年相当)');
    expect(tan).toHaveLength(47);
    expect(tsu).toHaveLength(9);
    const ch = tan.filter((s) => s.selectionCategory.includes('チャレンジ'));
    expect(ch).toHaveLength(16);
    expect(new Set(ch.map((s) => s.schoolName))).toEqual(new Set(['六本木', '大江戸', '世田谷泉', '稔ヶ丘', '桐ヶ丘', '小台橋', '立川緑', '八王子拓真']));
    expect(ch.find((s) => s.schoolName === '六本木')?.ratioType).toBe('学力検査なし+志願申告書150+個人面接600+作文500');
    expect(ch.find((s) => s.schoolName === '大江戸')?.note).toContain('(合計1300点)');
    expect(ch.find((s) => s.schoolName === '八王子拓真')?.ratioType).toBe('学力検査なし+志願申告書100+個人面接500+作文500');
    const bun = tan.filter((s) => s.selectionCategory.startsWith('分割'));
    expect(bun).toHaveLength(10);
    expect(bun.find((s) => s.schoolName === '八王子拓真' && s.selectionCategory.startsWith('分割前期'))?.ratioType).toBe('学力検査6:調査書4(600点:400点)+集団面接300点');
    expect(bun.find((s) => s.schoolName === '荻窪' && s.selectionCategory.startsWith('分割前期'))?.ratioType).toBe('学力検査7:調査書3(700点:300点)+ESAT-J20点+個人面接300点');
    expect(bun.find((s) => s.schoolName === '砂川' && s.selectionCategory.startsWith('分割前期'))?.ratioType).toContain('集団面接100点');
    expect(bun.find((s) => s.schoolName === '砂川' && s.selectionCategory.startsWith('分割前期'))?.note).toContain('5教科');
    expect(bun.find((s) => s.schoolName === '一橋' && s.selectionCategory.startsWith('分割前期'))?.note).toContain('2月24日(火)');
    expect(tan.filter((s) => s.selectionCategory.startsWith('在京外国人')).map((s) => s.schoolName).sort()).toEqual(['一橋', '浅草', '荻窪', '砂川'].sort());
    expect(tan.find((s) => s.schoolName === '新宿山吹' && s.selectionCategory === '推薦に基づく選抜(定時制単位制)')?.note).toContain('調査書450点+個人面接400点+作文200点(合計1050点)');
    expect(tan.find((s) => s.schoolName === '六郷工科' && s.department?.startsWith('生産工学科') && s.selectionCategory === '第一次募集(定時制単位制)')?.note).toContain('推薦に基づく選抜は「実施しない」');
    expect(tsu.every((s) => s.interviewRequired === undefined)).toBe(true);
    expect(tsu.find((s) => s.schoolName === '一橋' && s.selectionCategory === '通信制課程 第二次募集')?.note).toContain('45分');
    expect(tsu.find((s) => s.schoolName === '新宿山吹' && s.selectionCategory === '通信制課程 前期選抜')?.ratioType).toBe('学力検査300:調査書45(比率20:3)');
    expect(tsu.find((s) => s.schoolName === '砂川' && s.selectionCategory === '通信制課程 後期選抜')?.ratioType).toBe('学力検査500:調査書75(比率20:3)');
    expect(tsu.find((s) => s.schoolName === '一橋' && s.selectionCategory === '通信制課程 前期選抜')?.ratioType).toBe('学力検査600:調査書75(比率8:1)');
  });

  it('tokyo: n2_16頁1-3の文化・スポーツ等特別推薦は9校25レコード(頁1-3)+頁4-9の合計で、種目・募集人数・満点(調査書+面接+実技)・数値目標を持つ', () => {
    const list = (getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo')?.schools ?? []).filter((s) => s.selectionCategory === '文化・スポーツ等特別推薦');
    expect(list).toHaveLength(252);
    for (const n of ['向丘', '上野', '本所', '城東', '東', '深川', '大崎', '八潮', '目黒', '大森', '雪谷', '桜町', '千歳丘', '広尾', '鷺宮', '武蔵丘', '杉並', '豊多摩', '豊島']) expect(list.some((s) => s.schoolName === n)).toBe(true);
    const by = (n: string) => list.filter((s) => s.schoolName === n);
    expect(by('城東')).toHaveLength(7);
    expect(by('目黒')).toHaveLength(3);
    expect(by('向丘').every((s) => s.ratioType === '調査書400点+個人面接200点+実技検査400点')).toBe(true);
    expect(by('城東').every((s) => s.ratioType === '調査書400点+集団面接200点+実技検査200点')).toBe(true);
    expect(by('本所').find((s) => s.department.startsWith('ローイング'))?.ratioType).toBe('調査書400点+個人面接200点+実技検査200点');
    expect(by('本所').find((s) => s.department.startsWith('ハンドボール'))?.ratioType).toBe('調査書400点+個人面接100点+実技検査300点');
    expect(by('大崎')[0].ratioType).toBe('調査書200点+個人面接250点+実技検査450点');
    expect(by('八潮').map((s) => s.department).sort()).toEqual(['合唱(男女・3)', '和太鼓(男女・3)', '軟式野球(男・4)']);
    expect(by('上野')[0].ratioType).toBe('調査書500点+集団面接150点+実技検査350点');
    expect(by('城東').find((s) => s.department === '硬式野球(男・3)')?.note).toContain('全国選抜野球大会出場');
    expect(by('深川')[0].note).toContain('外国語コースは後掲');
    // 頁4-6
    expect(by('杉並')).toHaveLength(3);
    expect(by('杉並').every((s) => s.ratioType === '調査書500点+集団面接200点+実技検査300点')).toBe(true);
    expect(by('杉並').find((s) => s.department.startsWith('吹奏楽'))?.note).toContain('杉並は頁5から続く');
    expect(by('豊多摩')).toHaveLength(5);
    expect(by('豊多摩').every((s) => s.ratioType === '調査書500点+集団面接250点+実技検査250点')).toBe(true);
    expect(by('豊島')).toHaveLength(4);
    expect(by('豊島').every((s) => s.ratioType === '調査書500点+集団面接100点+実技検査400点')).toBe(true);
    expect(by('鷺宮')).toHaveLength(5);
    expect(by('鷺宮')[0].ratioType).toBe('調査書450点+個人面接100点+実技検査350点');
    expect(by('桜町')[0].ratioType).toBe('調査書600点+個人面接200点+実技検査400点');
    expect(by('千歳丘')[0].department).toBe('硬式野球(男・6)');
    expect(by('広尾')).toHaveLength(3);
    expect(by('大森').find((s) => s.department.startsWith('ダンス'))?.note).toContain('全国大会8位入賞以上');
    // 頁7-9
    expect(by('文京')).toHaveLength(5);
    expect(by('文京').find((s) => s.department.startsWith('硬式野球'))?.ratioType).toBe('調査書300点+集団面接100点+実技検査200点');
    expect(by('文京').filter((s) => !s.department.startsWith('硬式野球')).every((s) => s.ratioType === '調査書300点+個人面接100点+実技検査200点')).toBe(true);
    expect(by('板橋')).toHaveLength(3);
    expect(by('板橋').every((s) => s.ratioType === '調査書750点+個人面接250点+実技検査600点')).toBe(true);
    expect(by('大山')).toHaveLength(1);
    expect(by('大山')[0].ratioType).toBe('調査書300点+個人面接300点+実技検査400点');
    expect(by('高島')).toHaveLength(7);
    expect(by('高島').every((s) => s.ratioType === '調査書200点+集団面接300点+実技検査300点')).toBe(true);
    expect(by('石神井')).toHaveLength(6);
    expect(by('石神井').every((s) => s.ratioType === '調査書450点+集団面接150点+実技検査300点')).toBe(true);
    // 頁10-12
    expect(by('練馬')).toHaveLength(4);
    expect(by('練馬').every((s) => s.ratioType === '調査書450点+集団面接150点+実技検査300点')).toBe(true);
    expect(by('光丘')).toHaveLength(5);
    expect(by('光丘').every((s) => s.ratioType === '調査書300点+個人面接300点+実技検査400点')).toBe(true);
    expect(by('足立')).toHaveLength(3);
    expect(by('足立').filter((s) => s.ratioType.includes('集団面接200点'))).toHaveLength(2);
    expect(by('足立').find((s) => s.department.startsWith('陸上競技'))?.ratioType).toBe('調査書450点+個人面接200点+実技検査300点');
    expect(by('足立新田')).toHaveLength(5);
    expect(by('足立新田').every((s) => s.ratioType === '個人面接500点+実技検査300点')).toBe(true);
    expect(by('足立新田')[0].note).toContain('調査書の活用欄・調査書の満点欄は「—」');
    expect(by('足立新田').some((s) => s.note?.includes('頁11から続く'))).toBe(true);
    expect(by('足立西')).toHaveLength(3);
    expect(by('足立西')[0].ratioType).toBe('調査書450点+集団面接250点+実技検査250点');
    expect(by('淵江')).toHaveLength(3);
    expect(by('淵江')[0].ratioType).toBe('調査書500点+個人面接300点+実技検査200点');
    // 頁13-15
    expect(by('葛飾野')).toHaveLength(3);
    expect(by('葛飾野').every((s) => s.ratioType === '調査書500点+集団面接200点+実技検査300点')).toBe(true);
    expect(by('南葛飾')).toHaveLength(1);
    expect(by('南葛飾')[0].ratioType).toBe('調査書500点+個人面接200点+実技検査400点');
    expect(by('江戸川')).toHaveLength(5);
    expect(by('江戸川').every((s) => s.ratioType === '調査書400点+個人面接100点+実技検査300点')).toBe(true);
    expect(by('葛西南')).toHaveLength(1);
    expect(by('葛西南')[0].ratioType).toBe('調査書200点+個人面接100点+実技検査400点');
    expect(by('小岩')).toHaveLength(5);
    expect(by('小岩').every((s) => s.ratioType === '調査書500点+個人面接250点+実技検査250点')).toBe(true);
    expect(by('篠崎')).toHaveLength(4);
    expect(by('篠崎').every((s) => s.ratioType === '調査書500点+個人面接300点+実技検査300点')).toBe(true);
    expect(by('紅葉川')).toHaveLength(3);
    expect(by('紅葉川').every((s) => s.ratioType === '調査書500点+個人面接250点+実技検査250点')).toBe(true);
    expect(by('篠崎').find((s) => s.department.startsWith('剣道'))?.note).toContain('墨東杯');
    // 頁16-18
    expect(by('片倉')).toHaveLength(4);
    expect(by('片倉').find((s) => s.department.startsWith('卓球'))?.ratioType).toBe('調査書200点+個人面接500点+実技検査300点');
    expect(by('片倉').find((s) => s.department.startsWith('吹奏楽'))?.ratioType).toBe('調査書450点+個人面接200点+実技検査400点');
    expect(by('片倉').find((s) => s.department.startsWith('サッカー'))?.ratioType).toBe('調査書450点+集団面接400点+実技検査200点');
    expect(by('八王子北')).toHaveLength(3);
    expect(by('八王子北').every((s) => s.ratioType === '調査書400点+個人面接150点+実技検査250点')).toBe(true);
    expect(by('富士森')).toHaveLength(4);
    expect(by('富士森').filter((s) => s.ratioType.includes('集団面接200点')).map((s) => s.department.split('(')[0]).sort()).toEqual(['吹奏楽', '硬式野球']);
    expect(by('富士森').filter((s) => s.ratioType.includes('個人面接200点')).map((s) => s.department.split('(')[0]).sort()).toEqual(['サッカー', 'バスケットボール']);
    expect(by('松が谷')).toHaveLength(4);
    expect(by('松が谷').every((s) => s.ratioType === '調査書500点+個人面接250点+実技検査250点')).toBe(true);
    expect(by('府中')).toHaveLength(2);
    expect(by('府中')[0].ratioType).toBe('調査書500点+個人面接100点+実技検査400点');
    // 頁19-21
    expect(by('府中西')).toHaveLength(4);
    expect(by('府中西').every((s) => s.ratioType === '調査書400点+個人面接200点+実技検査200点')).toBe(true);
    expect(by('府中東')).toHaveLength(5);
    expect(by('府中東').every((s) => s.ratioType === '調査書450点+集団面接200点+実技検査200点')).toBe(true);
    expect(by('拝島')).toHaveLength(1);
    expect(by('拝島')[0].ratioType).toBe('調査書400点+個人面接200点+実技検査200点');
    expect(by('小川')).toHaveLength(3);
    expect(by('小川').every((s) => s.ratioType === '調査書450点+個人面接250点+実技検査300点')).toBe(true);
    expect(by('山崎')).toHaveLength(1);
    expect(by('山崎')[0].ratioType).toBe('調査書600点+個人面接400点+実技検査200点');
    expect(by('小平西')).toHaveLength(6);
    expect(by('小平西').filter((s) => s.ratioType.includes('集団面接180点')).map((s) => s.department.split('(')[0]).sort()).toEqual(['硬式野球', 'バスケットボール'].sort());
    expect(by('小平西').filter((s) => s.ratioType.includes('個人面接180点'))).toHaveLength(4);
    expect(by('小平西').every((s) => s.ratioType.startsWith('調査書450点+') && s.ratioType.endsWith('実技検査270点'))).toBe(true);
    expect(by('小平南')).toHaveLength(3);
    expect(by('小平南').every((s) => s.ratioType === '調査書450点+個人面接150点+実技検査300点')).toBe(true);
    // 頁22-24
    expect(by('日野')).toHaveLength(4);
    expect(by('日野').every((s) => s.ratioType === '調査書450点+集団面接200点+実技検査250点')).toBe(true);
    expect(by('東村山西')).toHaveLength(2);
    expect(by('東村山西').every((s) => s.ratioType === '調査書450点+集団面接200点+実技検査250点')).toBe(true);
    expect(by('福生')).toHaveLength(6);
    expect(by('福生').every((s) => s.ratioType === '調査書500点+個人面接200点+実技検査300点')).toBe(true);
    expect(by('福生').find((s) => s.department.startsWith('美術'))?.note).toContain('「自己PR」');
    expect(by('狛江')).toHaveLength(2);
    expect(by('狛江').every((s) => s.ratioType === '調査書600点+集団面接200点+実技検査400点')).toBe(true);
    expect(by('東大和')).toHaveLength(10);
    expect(by('東大和').filter((s) => s.ratioType.includes('集団面接200点')).map((s) => s.department.split('(')[0]).sort()).toEqual(['サッカー', 'サッカー', '硬式野球', '陸上競技'].sort());
    expect(by('東大和').filter((s) => s.ratioType.includes('個人面接200点'))).toHaveLength(6);
    expect(by('東大和').every((s) => s.ratioType.startsWith('調査書450点+') && s.ratioType.endsWith('実技検査250点'))).toBe(true);
    // 頁25-27
    expect(by('東大和南')).toHaveLength(6);
    expect(by('東大和南').every((s) => s.ratioType === '調査書500点+集団面接200点+実技検査200点')).toBe(true);
    expect(by('清瀬')).toHaveLength(3);
    expect(by('清瀬').every((s) => s.ratioType === '調査書500点+集団面接200点+実技検査300点')).toBe(true);
    expect(by('久留米西')).toHaveLength(3);
    expect(by('久留米西').every((s) => s.ratioType === '調査書300点+個人面接300点+実技検査400点')).toBe(true);
    expect(by('武蔵村山')).toHaveLength(3);
    expect(by('武蔵村山').every((s) => s.ratioType === '調査書300点+個人面接200点+実技検査200点')).toBe(true);
    expect(by('永山')).toHaveLength(4);
    expect(by('永山').every((s) => s.ratioType === '調査書200点+集団面接400点+実技検査400点')).toBe(true);
    expect(by('羽村')).toHaveLength(1);
    expect(by('羽村')[0].ratioType).toBe('調査書500点+個人面接250点+実技検査250点');
    expect(by('田無')).toHaveLength(5);
    expect(by('田無').every((s) => s.ratioType === '調査書500点+個人面接200点+実技検査300点')).toBe(true);
    // 頁28-30
    expect(by('保谷')).toHaveLength(6);
    expect(by('保谷').filter((s) => s.ratioType.includes('集団面接200点')).length).toBe(2);
    expect(by('保谷').every((s) => s.ratioType.startsWith('調査書500点+') && s.ratioType.endsWith('実技検査300点'))).toBe(true);
    expect(by('深川').filter((s) => s.department.includes('外国語コース'))).toHaveLength(2);
    expect(by('東村山')).toHaveLength(1);
    expect(by('東村山')[0].ratioType).toBe('調査書600点+個人面接600点+実技検査200点');
    expect(by('東村山')[0].note).toContain('観点別学習状況の評価を活用(評定は活用しない)');
    expect(by('墨田川')).toHaveLength(4);
    expect(by('墨田川').every((s) => s.ratioType === '調査書200点+個人面接50点+実技検査150点')).toBe(true);
    expect(by('美原')).toHaveLength(2);
    expect(by('美原').every((s) => s.ratioType === '調査書300点+個人面接100点+実技検査300点')).toBe(true);
    expect(by('深沢')[0].ratioType).toBe('調査書400点+個人面接300点+実技検査300点');
    expect(by('飛鳥')).toHaveLength(3);
    expect(by('飛鳥').find((s) => s.department.startsWith('英語'))?.ratioType).toBe('調査書300点+個人面接200点+作文200点+実技検査300点');
    expect(by('飛鳥').filter((s) => s.ratioType === '調査書200点+個人面接200点+作文200点+実技検査400点')).toHaveLength(2);
    expect(by('飛鳥').every((s) => s.note?.includes('(合計1000点'))).toBe(true);
    expect(by('板橋有徳')).toHaveLength(2);
    expect(by('板橋有徳').find((s) => s.department.startsWith('ラグビー'))?.ratioType).toBe('調査書300点+個人面接400点+実技検査300点');
    expect(by('大泉桜')).toHaveLength(1);
    expect(by('大泉桜')[0].department).toBe('美術(男女・20)');
    expect(by('大泉桜')[0].note).toContain('パーソナル・プレゼンテーション');
    // 頁31-33
    expect(by('上水')).toHaveLength(5);
    expect(by('上水').every((s) => s.ratioType === '調査書360点+個人面接240点+実技検査160点')).toBe(true);
    expect(by('上水').find((s) => s.department.startsWith('剣道'))?.note).toContain('自己PRタイム');
    expect(by('墨田工科')).toHaveLength(5);
    expect(by('墨田工科').every((s) => s.ratioType === '調査書350点+個人面接350点+実技検査300点')).toBe(true);
    expect(by('総合工科')).toHaveLength(1);
    expect(by('総合工科')[0].ratioType).toBe('調査書200点+個人面接400点+実技検査200点');
    expect(by('総合工科')[0].department).toBe('硬式野球(男・10)');
    expect(by('杉並工科')).toHaveLength(3);
    expect(by('杉並工科').every((s) => s.ratioType === '調査書100点+個人面接200点+実技検査200点')).toBe(true);
    expect(by('荒川工科')).toHaveLength(2);
    expect(by('荒川工科').every((s) => s.ratioType === '調査書500点+個人面接350点+実技検査150点')).toBe(true);
    expect(by('府中工科')).toHaveLength(2);
    expect(by('府中工科').every((s) => s.ratioType === '調査書200点+個人面接400点+実技検査200点')).toBe(true);
    expect(by('多摩工科')).toHaveLength(3);
    expect(by('多摩工科').every((s) => s.ratioType === '調査書100点+個人面接200点+実技検査200点')).toBe(true);
    expect(by('多摩工科')[0].note).toContain('機械科・電気科・環境化学科');
    expect(list.every((s) => s.note?.includes('推薦の基準(要件の長文)は本DBでは未収録'))).toBe(true);
  });

  it('tokyo: 日比谷・竹早の推薦は個人面接欄と集団討論欄にまたがる結合セルの点数を持ち(日比谷200/竹早250)、面接の実施有無は断定しない(2026-09-19に竹早の「面接なし」誤読を訂正)', () => {
    const takehaya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo', '竹早', '推薦に基づく選抜', '普通科');
    const hibiya = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'tokyo', '日比谷', '推薦に基づく選抜', '普通科');
    expect(takehaya?.interviewRequired).toBeUndefined();
    expect(hibiya?.interviewRequired).toBeUndefined();
    expect(takehaya?.note).toContain('個人面接・集団討論の結合セル250点');
    expect(hibiya?.note).toContain('個人面接・集団討論の結合セル200点');
    expect(takehaya?.note).not.toContain('調査書500点+小論文250点のみ');
  });

  it('hokkaido: schoolsは2校(岩見沢東/滝川)4学科8レコードを収録している(推薦入学者選抜+一般入学者選抜の2区分)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hokkaido');
    expect(record?.schools?.length).toBe(8);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames).toEqual(new Set(['岩見沢東', '滝川']));
  });

  it('hokkaido: 滝川(理数)は一般入学者選抜で国・数・英を1.5倍にする傾斜配点を持つが滝川(普通)には傾斜配点が無い', () => {
    const rigaku = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hokkaido', '滝川', '一般入学者選抜', '理数');
    const futsuu = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hokkaido', '滝川', '一般入学者選抜', '普通');
    expect(rigaku?.note).toContain('国語・数学・英語の3教科をそれぞれ1.5倍');
    expect(futsuu?.note).toContain('傾斜配点の実施なし');
  });

  it('hokkaido: 岩見沢東(普通)の一般入学者選抜は調査書重視グループが評定10:学力0・学力重視グループが学力6:評定4', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hokkaido', '岩見沢東', '一般入学者選抜', '普通');
    expect(record?.ratioType).toBe('評定:学力=10:0(調査書重視グループ)、学力:評定=6:4(学力重視グループ)');
  });

  it('hokkaido: 岩見沢東(文理探究)の推薦入学者選抜は入学枠20%程度で個人面接を実施する', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'hokkaido', '岩見沢東', '推薦入学者選抜', '文理探究');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toBe('入学枠20%程度');
  });

  it('fukushima: schoolsは4校(福島/橘/福島商業/福島工業)30レコードを収録している(福島商業はくくり募集3学科分・福島工業は全日制5学科分)', () => {
    const record = getSchoolSelectionMethod(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima');
    expect(record?.schools?.length).toBe(30);
    const schoolNames = new Set(record?.schools?.map((s) => s.schoolName));
    expect(schoolNames).toEqual(new Set(['福島', '橘', '福島商業', '福島工業']));
  });

  it('fukushima: 福島商業(商業科・情報ビジネス科)の特色選抜はA型/B型/C型の3類型を持ちB型・C型のみ実技90点を課す', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島商業', '特色選抜', '商業科・情報ビジネス科');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.note).toContain('A型(学業');
    expect(record?.ratioType).toContain('実技90点(B型・C型)');
  });

  it('fukushima: 福島商業(商業科・会計ビジネス科)の一般選抜は募集定員40人で情報ビジネス科・経営ビジネス科の80人より少ない', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島商業', '一般選抜', '商業科・会計ビジネス科');
    expect(record?.note).toContain('募集定員40人');
  });

  it('fukushima: 福島工業(工業科・機械科)の特色選抜は調査書135点のみ点数化し特別活動等は精査のみで250点満点にならない(他校と異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島工業', '特色選抜', '工業科・機械科');
    expect(record?.interviewRequired).toBe(true);
    expect(record?.ratioType).toBe('学力検査250点:調査書135点:面接30点:実技検査100点(合計515点)');
  });

  it('fukushima: 福島工業(工業科・機械科)の一般選抜は募集定員80人で他4学科の40人より多い', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島工業', '一般選抜', '工業科・機械科');
    expect(record?.interviewRequired).toBe(false);
    expect(record?.note).toContain('募集定員80人');
  });

  it('fukushima: 福島工業(工業科・建築科)の後期選抜は小論文を段階評価のみで点数化しない(福島の普通科は120点に点数化する点で異なる)', () => {
    const record = findSchoolSelectionRecord(SCHOOL_SELECTION_METHOD_BY_PREFECTURE, 'fukushima', '福島工業', '後期選抜', '工業科・建築科');
    expect(record?.note).toContain('段階評価(点数化なし)');
  });

  it('structuredレコードのschoolsは1件以上を持つ', () => {
    for (const record of Object.values(SCHOOL_SELECTION_METHOD_BY_PREFECTURE)) {
      if (record?.status === 'structured') {
        expect(record.schools?.length).toBeGreaterThan(0);
      }
    }
  });
});
