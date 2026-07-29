import { buildHealthSection, injectHealthSection, type EventHealthCounts } from '../daily-brief-health';

const ALL_POSITIVE: EventHealthCounts = { cta_view: 120, lead_submit: 3, line_friend_click: 8, affiliate_click: 45 };
const ONE_ZERO: EventHealthCounts = { cta_view: 120, lead_submit: 0, line_friend_click: 8, affiliate_click: 45 };

describe('buildHealthSection', () => {
  it('全イベントが正の場合は🟢正常と表示する', () => {
    const section = buildHealthSection(ALL_POSITIVE, '2026-07-28');
    expect(section).toContain('🟢 正常');
    expect(section).not.toContain('🔴');
    expect(section).toContain('`cta_view`: 120件');
  });

  it('いずれか1件でも0件なら🔴要確認と表示し、ゼロ件に警告マークを付ける', () => {
    const section = buildHealthSection(ONE_ZERO, '2026-07-28');
    expect(section).toContain('🔴 要確認');
    expect(section).toContain('`lead_submit`: 0件 ⚠️ゼロ');
    expect(section).not.toContain('`cta_view`: 120件 ⚠️ゼロ');
  });

  it('日付ラベルを見出しと本文の両方に埋め込む', () => {
    const section = buildHealthSection(ALL_POSITIVE, '2026-08-01');
    expect(section).toContain('2026-08-01時点');
    expect(section).toContain('前日2026-08-01のGA4実測');
  });
});

describe('injectHealthSection', () => {
  const sectionBody = 'BODY_PLACEHOLDER';

  it('マーカーが無い場合、最初のH1見出しの直後に新規挿入する', () => {
    const original = '# 朝ブリーフィング\n\n本文1行目\n';
    const result = injectHealthSection(original, sectionBody);
    const lines = result.split('\n');
    expect(lines[0]).toBe('# 朝ブリーフィング');
    expect(result).toContain('<!-- LAMBDA1_HEALTH_START -->\nBODY_PLACEHOLDER<!-- LAMBDA1_HEALTH_END -->');
    expect(result.indexOf('LAMBDA1_HEALTH_START')).toBeLessThan(result.indexOf('本文1行目'));
  });

  it('既存マーカーがある場合、その区間だけを置換し前後の本文を保持する', () => {
    const original = [
      '# 朝ブリーフィング',
      '',
      '<!-- LAMBDA1_HEALTH_START -->',
      'OLD_BODY',
      '<!-- LAMBDA1_HEALTH_END -->',
      '',
      '## 他のセクション',
      '既存の内容は保持される',
    ].join('\n');
    const result = injectHealthSection(original, 'NEW_BODY');
    expect(result).toContain('NEW_BODY');
    expect(result).not.toContain('OLD_BODY');
    expect(result).toContain('## 他のセクション');
    expect(result).toContain('既存の内容は保持される');
  });

  it('見出しが全く無いファイルでも冒頭に挿入して壊れない', () => {
    const original = '本文のみでH1が無いファイル\n';
    const result = injectHealthSection(original, sectionBody);
    expect(result).toContain('BODY_PLACEHOLDER');
    expect(result).toContain('本文のみでH1が無いファイル');
  });

  it('2回連続で呼んでも冪等（3重挿入されない）', () => {
    const original = '# 朝ブリーフィング\n\n本文\n';
    const once = injectHealthSection(original, 'BODY_A');
    const twice = injectHealthSection(once, 'BODY_B');
    expect(twice.match(/LAMBDA1_HEALTH_START/g)).toHaveLength(1);
    expect(twice).toContain('BODY_B');
    expect(twice).not.toContain('BODY_A');
  });
});
