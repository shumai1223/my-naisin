/**
 * GSCクエリマイニング（TIER L-1）。
 *
 * 「表示回数はあるのに専用ページが無いクエリ」を機械的に抽出する第一段フィルタ。
 * ここで残った候補は自動で面化しない — 決定論的に答えられる（既存エンジンで
 * 正しい値を計算/参照できる）ものだけを人間または次周のループが選んで面化する
 * （エンジンで答えられない=捏造リスクがあるものは対象外、が正しい運用）。
 *
 * 判定は「トピックキーワードを含むか」の粗いヒューリスティックであり厳密ではない
 * （偽陰性=見逃しはコスト低いが、偽陽性=誤って"カバー済み"扱いは機会損失になるため
 * キーワードは広めに保つ）。
 */

import { PREFECTURES } from '@/lib/prefectures';

export interface GscQueryRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface MiningCandidate {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

/** 既存の専用ページ群がカバーしているトピック語（都道府県名は自動で追加）。 */
export const PAGE_TOPIC_KEYWORDS: string[] = [
  '偏差値',
  '内申点',
  '内申',
  '評定平均',
  '評定',
  '総合得点',
  'S値',
  '学費',
  '教育費',
  '進学費用',
  '受験料',
  '倍率',
  '家庭教師',
  '調査書',
  '総合型選抜',
  '推薦入試',
  '推薦',
  '評価基準',
  '不登校',
  '保護者',
  '塾',
  '面談',
  '受験スケジュール',
  '出願',
  '併願',
  '実技',
  '副教科',
  '奨学金',
  '就学支援金',
  '用語集',
  '順位',
  '満点換算',
  '模試',
  'もぎ',
];

function buildTopicIndex(extra: string[] = []): string[] {
  const prefectureNames = PREFECTURES.flatMap((p) => [p.name, p.name.replace(/[都道府県]$/, '')]);
  return [...PAGE_TOPIC_KEYWORDS, ...prefectureNames, ...extra];
}

/** クエリが既存の専用ページのトピックに含まれるか（粗い部分一致）。 */
export function isTopicCovered(query: string, topics: string[] = buildTopicIndex()): boolean {
  return topics.some((kw) => kw.length > 0 && query.includes(kw));
}

export interface MiningOptions {
  minImpressions?: number;
  minPosition?: number;
  limit?: number;
  extraTopics?: string[];
}

/**
 * 「表示回数>=50 かつ 掲載順位>8（=8位より下＝1ページ目未満）かつ 専用面トピック外」
 * のクエリを表示回数降順で抽出する。
 */
export function findUncoveredOpportunityQueries(
  rows: GscQueryRow[],
  options: MiningOptions = {},
): MiningCandidate[] {
  const { minImpressions = 50, minPosition = 8, limit = 30, extraTopics = [] } = options;
  const topics = buildTopicIndex(extraTopics);

  return rows
    .filter((r) => r.impressions >= minImpressions && r.position > minPosition)
    .filter((r) => !isTopicCovered(r.keys[0] ?? '', topics))
    .map((r) => ({
      query: r.keys[0] ?? '',
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);
}

export function formatMiningCandidatesMarkdown(candidates: MiningCandidate[]): string {
  if (candidates.length === 0) return '_該当なし（専用ページ外の高機会クエリは検出されず）_\n';
  const lines = [
    '| クエリ | 表示 | click | CTR | 順位 |',
    '|---|--:|--:|--:|--:|',
    ...candidates.map(
      (c) =>
        `| ${c.query} | ${c.impressions} | ${c.clicks} | ${(c.ctr * 100).toFixed(1)}% | ${c.position.toFixed(1)} |`,
    ),
  ];
  return lines.join('\n') + '\n';
}
