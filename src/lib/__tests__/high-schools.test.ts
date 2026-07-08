/**
 * 高校ページDBの骨格（TIER R-3・build-not-launch）の型・バリデーション契約テスト。
 */
import { isValidHighSchoolEntry, getVerifiedAdmissionSystemForSchool } from '../high-schools';
import { PREFECTURES } from '../prefectures';
import { VERIFIED_TOTAL_SCORE_CODES } from '../total-score/registry';

const validPrefCode = PREFECTURES[0].code;

describe('isValidHighSchoolEntry', () => {
  it('妥当な入力はvalid:true', () => {
    const result = isValidHighSchoolEntry({
      prefectureCode: validPrefCode,
      name: 'テスト高等学校',
      schoolType: 'public',
      sourceUrl: 'https://example-board-of-education.example.jp/school/test',
    });
    expect(result.valid).toBe(true);
  });

  it('sourceCheckedAtを含めても妥当なら valid:true', () => {
    const result = isValidHighSchoolEntry({
      prefectureCode: validPrefCode,
      name: 'テスト高等学校',
      schoolType: 'private',
      sourceUrl: 'https://school.example.jp',
      sourceCheckedAt: '2026-07-09',
    });
    expect(result.valid).toBe(true);
  });

  it('未検証の都道府県コードはvalid:false', () => {
    const result = isValidHighSchoolEntry({
      prefectureCode: 'atlantis',
      name: 'テスト高等学校',
      schoolType: 'public',
      sourceUrl: 'https://example.jp',
    });
    expect(result.valid).toBe(false);
  });

  it('学校名が空・長すぎはvalid:false', () => {
    expect(
      isValidHighSchoolEntry({ prefectureCode: validPrefCode, name: '', schoolType: 'public', sourceUrl: 'https://example.jp' }).valid
    ).toBe(false);
    expect(
      isValidHighSchoolEntry({
        prefectureCode: validPrefCode,
        name: 'あ'.repeat(101),
        schoolType: 'public',
        sourceUrl: 'https://example.jp',
      }).valid
    ).toBe(false);
  });

  it('schoolTypeが不正はvalid:false', () => {
    const result = isValidHighSchoolEntry({
      prefectureCode: validPrefCode,
      name: 'テスト高等学校',
      schoolType: 'charter',
      sourceUrl: 'https://example.jp',
    });
    expect(result.valid).toBe(false);
  });

  it('sourceUrlが無い・http(s)以外はvalid:false（公開データのみの方針を強制）', () => {
    expect(
      isValidHighSchoolEntry({ prefectureCode: validPrefCode, name: 'テスト高等学校', schoolType: 'public' }).valid
    ).toBe(false);
    expect(
      isValidHighSchoolEntry({
        prefectureCode: validPrefCode,
        name: 'テスト高等学校',
        schoolType: 'public',
        sourceUrl: 'ftp://example.jp',
      }).valid
    ).toBe(false);
  });

  it('sourceCheckedAtの形式が不正はvalid:false', () => {
    const result = isValidHighSchoolEntry({
      prefectureCode: validPrefCode,
      name: 'テスト高等学校',
      schoolType: 'public',
      sourceUrl: 'https://example.jp',
      sourceCheckedAt: '2026/07/09',
    });
    expect(result.valid).toBe(false);
  });

  it('objectでない入力はvalid:false', () => {
    expect(isValidHighSchoolEntry(null).valid).toBe(false);
    expect(isValidHighSchoolEntry('string').valid).toBe(false);
  });
});

describe('getVerifiedAdmissionSystemForSchool', () => {
  it('検証済み県の総合得点方式が引ける', () => {
    const code = VERIFIED_TOTAL_SCORE_CODES[0];
    const system = getVerifiedAdmissionSystemForSchool(code);
    expect(system).not.toBeNull();
  });

  it('未検証の県はnull', () => {
    expect(getVerifiedAdmissionSystemForSchool('atlantis')).toBeNull();
  });
});
