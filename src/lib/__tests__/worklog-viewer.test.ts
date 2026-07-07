/**
 * worklogビューア（I-6）の純粋パース関数テスト。
 * scripts/worklog.mjsが実際に生成するフォーマット（# YYYY-MM-DD worklog見出し＋HH:MM行）を固定する。
 */
import { parseWorklogMarkdown, parseWorklogEntries } from '../worklog-viewer';

const SAMPLE = `# 2026-07-07 worklog

11:17 ▶開始 A-6（満点変換独立URL）
11:25 A-6: 満点変換つき偏差値計算を新設。tsc0/jest717。commit 5fa1a38
`;

describe('parseWorklogMarkdown', () => {
  it('見出し行からタイトルを取り出す', () => {
    const parsed = parseWorklogMarkdown('2026-07-07', SAMPLE);
    expect(parsed.title).toBe('2026-07-07 worklog');
    expect(parsed.date).toBe('2026-07-07');
  });

  it('HH:MM行をtime付きで拾い、1日の中は新しい順（最新が先頭）にする', () => {
    const parsed = parseWorklogMarkdown('2026-07-07', SAMPLE);
    expect(parsed.lines).toHaveLength(2);
    expect(parsed.lines[0].time).toBe('11:25');
    expect(parsed.lines[1]).toEqual({ time: '11:17', text: '▶開始 A-6（満点変換独立URL）' });
  });

  it('空行は無視する', () => {
    const parsed = parseWorklogMarkdown('2026-07-07', SAMPLE);
    expect(parsed.lines.every((l) => l.text.length > 0)).toBe(true);
  });

  it('見出しが無いコンテンツはdateをタイトルのフォールバックにする', () => {
    const parsed = parseWorklogMarkdown('2026-07-01', '11:00 テスト\n');
    expect(parsed.title).toBe('2026-07-01');
  });

  it('HH:MM形式でない行もtext全体として拾う（time:null）', () => {
    const parsed = parseWorklogMarkdown('2026-07-07', '# t\n\n備考のみの行\n');
    expect(parsed.lines).toEqual([{ time: null, text: '備考のみの行' }]);
  });
});

describe('parseWorklogEntries', () => {
  it('複数日を最新日降順にソートしてパースする（入力が昇順でも矯正する）', () => {
    const entries = [
      { date: '2026-07-06', content: '# 2026-07-06 worklog\n\n09:00 old\n' },
      { date: '2026-07-07', content: '# 2026-07-07 worklog\n\n10:00 new\n' },
    ];
    const parsed = parseWorklogEntries(entries);
    expect(parsed.map((p) => p.date)).toEqual(['2026-07-07', '2026-07-06']);
  });

  it('空配列は空配列を返す', () => {
    expect(parseWorklogEntries([])).toEqual([]);
  });
});
