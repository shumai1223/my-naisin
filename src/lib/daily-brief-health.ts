/**
 * Λ-1: 朝ブリーフィング（docs/daily-brief.md）への収益導線生存監視。
 *
 * なぜ: 24時間稼働のloopは、収益導線を壊すコード変更をしても誰も気づかないまま
 * 数日間サイレント破損が走るリスクがある（前科=AdSense審査用auditHideが保護者リード
 * CTAを全非表示にしていた自傷・[[session-2026-07-04-affiliate-ev-optimization]]）。
 * 前日の主要4イベント（cta_view/lead_submit/line_friend_click/affiliate_click）を
 * 毎朝ブリーフィングの最上段に出し、いずれか0件なら赤で警告する。
 */

export interface EventHealthCounts {
  cta_view: number;
  lead_submit: number;
  line_friend_click: number;
  affiliate_click: number;
}

export const HEALTH_EVENT_NAMES: (keyof EventHealthCounts)[] = [
  'cta_view',
  'lead_submit',
  'line_friend_click',
  'affiliate_click',
];

/** 実測件数から生存監視セクションのMarkdownを組み立てる（GA4等の外部APIに依存しない純関数）。 */
export function buildHealthSection(counts: EventHealthCounts, dateLabel: string): string {
  const anyZero = HEALTH_EVENT_NAMES.some((name) => counts[name] === 0);
  const status = anyZero ? '🔴 要確認（いずれかが前日ゼロ）' : '🟢 正常';
  const lines = HEALTH_EVENT_NAMES.map((name) => {
    const v = counts[name];
    return `- \`${name}\`: ${v.toLocaleString('en-US')}件${v === 0 ? ' ⚠️ゼロ' : ''}`;
  });
  return [
    `## ⚡収益導線の生存監視（自動・${dateLabel}時点・Λ-1）`,
    '',
    `**${status}**（前日${dateLabel}のGA4実測。サイレント破損の早期検知が目的）`,
    '',
    ...lines,
    '',
  ].join('\n');
}

const SECTION_START = '<!-- LAMBDA1_HEALTH_START -->';
const SECTION_END = '<!-- LAMBDA1_HEALTH_END -->';

/**
 * docs/daily-brief.mdの本文へ生存監視セクションを冪等に挿入・更新する。
 * 既存のマーカーコメントがあれば置換、無ければ最初の見出し(`# `)の直後に新規挿入する。
 */
export function injectHealthSection(fileContent: string, sectionBody: string): string {
  const wrapped = `${SECTION_START}\n${sectionBody}${SECTION_END}`;
  if (fileContent.includes(SECTION_START) && fileContent.includes(SECTION_END)) {
    const startIdx = fileContent.indexOf(SECTION_START);
    const endIdx = fileContent.indexOf(SECTION_END) + SECTION_END.length;
    return fileContent.slice(0, startIdx) + wrapped + fileContent.slice(endIdx);
  }
  const lines = fileContent.split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  if (titleIdx === -1) return `${wrapped}\n\n${fileContent}`;
  lines.splice(titleIdx + 1, 0, '', wrapped);
  return lines.join('\n');
}
