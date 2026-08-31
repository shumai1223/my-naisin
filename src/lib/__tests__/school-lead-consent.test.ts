import {
  SCHOOL_LEAD_AUDIENCE_LABEL,
  SCHOOL_LEAD_JUKU_OPTIN_DEFAULT,
  SCHOOL_LEAD_JUKU_OPTIN_LABEL,
  SCHOOL_LEAD_PURPOSE_NOTICE,
} from '../school-lead-consent';

describe('school-lead-consent（T-N1-N4 C10-2 保護者向けリードフォームの同意まわりの不変条件）', () => {
  test('塾への提供オプトインは既定でOFF（C7ガードレール）', () => {
    expect(SCHOOL_LEAD_JUKU_OPTIN_DEFAULT).toBe(false);
  });

  test('提供先（学習塾）を明示し、任意であることを明記している', () => {
    expect(SCHOOL_LEAD_JUKU_OPTIN_LABEL).toContain('学習塾');
    expect(SCHOOL_LEAD_JUKU_OPTIN_LABEL).toContain('任意');
    expect(SCHOOL_LEAD_JUKU_OPTIN_LABEL).toContain('お渡しします');
  });

  test('チェックを入れなくても情報の受け取りができることを明記している', () => {
    expect(SCHOOL_LEAD_JUKU_OPTIN_LABEL).toContain('チェックを入れなくても');
  });

  test('フォーム直下の文言に利用目的・提供先の区分・停止方法をすべて含む', () => {
    expect(SCHOOL_LEAD_PURPOSE_NOTICE).toContain('利用目的');
    expect(SCHOOL_LEAD_PURPOSE_NOTICE).toContain('提供先の区分');
    expect(SCHOOL_LEAD_PURPOSE_NOTICE).toContain('学習塾');
    expect(SCHOOL_LEAD_PURPOSE_NOTICE).toContain('停止方法');
  });

  test('保護者向けであることを明示するラベルを持つ', () => {
    expect(SCHOOL_LEAD_AUDIENCE_LABEL).toBe('保護者の方へ');
  });
});
