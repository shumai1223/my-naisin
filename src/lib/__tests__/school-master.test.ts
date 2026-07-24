import {
  parseMextRow,
  isPublicActiveHighSchool,
  extractPrefectureNumber,
  buildPrefectureNumberMap,
  toSchoolRecord,
  findDuplicateCodes,
  type RawMextRow,
  type SchoolMasterFile,
} from '../school-master';

const VALID_ROW_COLS = [
  'D101210100013',
  'D1(高校)',
  '01(北海道)',
  '2(公)',
  '1(本)',
  '北海道札幌西高等学校',
  '北海道札幌市中央区宮の森４条８丁目１',
  '0640954',
  '2020-12-22',
  '',
  '015512',
  '',
];

describe('parseMextRow', () => {
  it('12列の正しい行をRawMextRowへ変換する', () => {
    const row = parseMextRow(VALID_ROW_COLS);
    expect(row).not.toBeNull();
    expect(row?.schoolCode).toBe('D101210100013');
    expect(row?.schoolType).toBe('D1(高校)');
    expect(row?.name).toBe('北海道札幌西高等学校');
  });

  it('列数が12でない行はnull（壊れた行を握りつぶさない）', () => {
    expect(parseMextRow(['a', 'b'])).toBeNull();
    expect(parseMextRow([...VALID_ROW_COLS, 'extra'])).toBeNull();
  });
});

describe('isPublicActiveHighSchool', () => {
  const base = parseMextRow(VALID_ROW_COLS) as RawMextRow;

  it('公立・高校・現存(廃止日なし)ならtrue', () => {
    expect(isPublicActiveHighSchool(base)).toBe(true);
  });

  it('私立(3私)はfalse', () => {
    expect(isPublicActiveHighSchool({ ...base, establishment: '3(私)' })).toBe(false);
  });

  it('国立(1国)はfalse', () => {
    expect(isPublicActiveHighSchool({ ...base, establishment: '1(国)' })).toBe(false);
  });

  it('高校以外(小学校等)はfalse', () => {
    expect(isPublicActiveHighSchool({ ...base, schoolType: 'B1(小学校)' })).toBe(false);
  });

  it('廃止年月日が入っている(廃校)場合はfalse', () => {
    expect(isPublicActiveHighSchool({ ...base, attributeAbolishDate: '2023-05-01' })).toBe(false);
  });
});

describe('extractPrefectureNumber', () => {
  it('先頭2桁を取り出す', () => {
    expect(extractPrefectureNumber('01(北海道)')).toBe('01');
    expect(extractPrefectureNumber('47(沖縄)')).toBe('47');
  });

  it('数字で始まらない場合はnull', () => {
    expect(extractPrefectureNumber('北海道')).toBeNull();
  });
});

describe('buildPrefectureNumberMap', () => {
  it('配列の並び順から01始まりの対応表を作る', () => {
    const map = buildPrefectureNumberMap(['hokkaido', 'aomori', 'iwate']);
    expect(map).toEqual({ '01': 'hokkaido', '02': 'aomori', '03': 'iwate' });
  });

  it('47件フルセットで先頭・末尾が正しい', () => {
    const codes = Array.from({ length: 47 }, (_, i) => `pref${i + 1}`);
    const map = buildPrefectureNumberMap(codes);
    expect(map['01']).toBe('pref1');
    expect(map['47']).toBe('pref47');
  });
});

describe('toSchoolRecord', () => {
  it('本校(1本)はbranch=false', () => {
    const row = parseMextRow(VALID_ROW_COLS) as RawMextRow;
    expect(toSchoolRecord(row)).toEqual({
      code: 'D101210100013',
      name: '北海道札幌西高等学校',
      address: '北海道札幌市中央区宮の森４条８丁目１',
      postalCode: '0640954',
      branch: false,
    });
  });

  it('分校(2分)はbranch=true', () => {
    const row = { ...(parseMextRow(VALID_ROW_COLS) as RawMextRow), branchFlag: '2(分)' };
    expect(toSchoolRecord(row).branch).toBe(true);
  });
});

describe('findDuplicateCodes', () => {
  const source = { url: 'https://example.com', docTitle: 'test', edition: 'test', fetchedAt: '2026-07-24' };

  it('重複が無ければ空配列', () => {
    const files: SchoolMasterFile[] = [
      { prefectureCode: 'a', source, schools: [{ code: 'X1', name: '', address: '', postalCode: '', branch: false }] },
      { prefectureCode: 'b', source, schools: [{ code: 'X2', name: '', address: '', postalCode: '', branch: false }] },
    ];
    expect(findDuplicateCodes(files)).toEqual([]);
  });

  it('県をまたいだ重複コードも検出する', () => {
    const files: SchoolMasterFile[] = [
      { prefectureCode: 'a', source, schools: [{ code: 'DUP', name: '', address: '', postalCode: '', branch: false }] },
      { prefectureCode: 'b', source, schools: [{ code: 'DUP', name: '', address: '', postalCode: '', branch: false }] },
    ];
    expect(findDuplicateCodes(files)).toEqual(['DUP']);
  });
});
