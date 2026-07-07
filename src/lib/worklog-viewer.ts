/**
 * worklogビューア（I-6）の表示ロジック（純粋関数・D1/fs非依存）。
 *
 * データ本体はビルド時に next.config.mjs が docs/worklog/*.md を読んで
 * src/generated/worklog-data.json へ焼き込む（Workersランタイムにはリポジトリの生ファイルが
 * 無いため、ページ側はfsを一切使わずこのJSONをstatic importするだけにする）。
 * ここは「その日次データをどう解釈して画面に出すか」だけを担当する。
 */

export interface WorklogDataEntry {
  /** 'YYYY-MM-DD'。 */
  date: string;
  /** docs/worklog/<date>.md の生テキスト全文。 */
  content: string;
}

export interface WorklogLine {
  /** 'HH:MM'。タイムスタンプ行でなければ null。 */
  time: string | null;
  text: string;
}

export interface ParsedWorklogDay {
  date: string;
  /** `# YYYY-MM-DD worklog` 見出し行から取り出したタイトル（無ければdateをそのまま使う）。 */
  title: string;
  lines: WorklogLine[];
}

const HEADING_RE = /^#\s+(.*)$/;
const TIMED_LINE_RE = /^(\d{2}:\d{2})\s+(.*)$/;

/** 1日ぶんのworklog markdownをタイトル＋行データにパースする。 */
export function parseWorklogMarkdown(date: string, content: string): ParsedWorklogDay {
  let title = date;
  const lines: WorklogLine[] = [];

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(HEADING_RE);
    if (heading) {
      title = heading[1].trim();
      continue;
    }

    const timed = line.match(TIMED_LINE_RE);
    if (timed) {
      lines.push({ time: timed[1], text: timed[2] });
    } else {
      lines.push({ time: null, text: line });
    }
  }

  return { date, title, lines };
}

/** worklog-data.jsonの全件を最新日降順でパースする（既にJSON側でソート済みだが二重に保証する）。 */
export function parseWorklogEntries(entries: WorklogDataEntry[]): ParsedWorklogDay[] {
  return [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((e) => parseWorklogMarkdown(e.date, e.content));
}
