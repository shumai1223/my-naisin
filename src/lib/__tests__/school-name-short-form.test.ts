import { shortenSchoolName } from '@/lib/school-name-short-form';

describe('shortenSchoolName', () => {
  it('strips a 県立 prefix and shortens 高等学校 to 高校', () => {
    expect(shortenSchoolName('愛知県立旭丘高等学校')).toBe('旭丘高校');
  });

  it('strips a 市立 prefix', () => {
    expect(shortenSchoolName('名古屋市立中央高等学校')).toBe('中央高校');
  });

  it('handles a multi-character city name before 市立', () => {
    expect(shortenSchoolName('豊橋市立豊橋高等学校')).toBe('豊橋高校');
  });

  it('shortens a private-style name with no ownership prefix', () => {
    expect(shortenSchoolName('同朋高等学校')).toBe('同朋高校');
  });

  it('shortens the suffix even when a branch-campus name follows it', () => {
    expect(shortenSchoolName('愛知県立新城有教館高等学校作手校舎')).toBe('新城有教館高校作手校舎');
  });

  it('returns null for names without 高等学校 (e.g. 高等専門学校/中等教育学校)', () => {
    expect(shortenSchoolName('愛知県立岡崎工業高等専門学校')).toBeNull();
    expect(shortenSchoolName('東京都立白鴎高等学校附属中等教育学校')).not.toBeNull();
    expect(shortenSchoolName('市立札幌開成中等教育学校')).toBeNull();
  });

  it('returns null when the input has no 高等学校 substring at all', () => {
    expect(shortenSchoolName('愛知県立旭丘高校')).toBeNull();
    expect(shortenSchoolName('')).toBeNull();
  });
});
