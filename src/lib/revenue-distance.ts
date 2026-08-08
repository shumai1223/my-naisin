/**
 * 掛-5（収益距離・2026-08-08 👤指示で新設）: 各ページから最も近い「収益面」まで
 * 最短何クリックかを機械的に算出するための共通ライブラリ。
 *
 * 収益面 = 高CPAオファーを持つ面（hiyou／suisen-nyuushi／hogosha(parent-lp)／mendan／
 * juku-shindan／保護者LINE導線／各面のParentLeadCTA）。距離1=そのページに収益CTAが
 * 直接ある（＝収益面自身、またはCTAコンポーネントを埋め込んでいるページ）、距離2=1クリック先、
 * 距離∞=そこから辿り着けない（[[fable5-fullaccel-backlog-2026-07]]の掛-5定義に準拠）。
 *
 * 依存関係の閉包はpage.tsxが直接／間接に読み込むローカルimport（@/・相対）をmaxDepthまで
 * たどって結合ソースを作り、その中から収益CTAマーカーとhrefリンクを抽出する（子コンポーネント
 * 経由で埋め込まれたCTA・リンクも正しく検知するため）。動的ルート（[code]等）やテンプレート
 * リテラルで補間されたhrefは[[internal-link-graph]]の既存の被リンク検知と同じ既知の限界として
 * 対象外（静的な文字列hrefのみを対象とする）。
 */
import fs from 'fs';
import path from 'path';
import { walkPageFiles } from '@/lib/internal-link-graph';

/** 明示的に収益面と定義されたルート（掛-5定義: hiyou/suisen-nyuushi/hogosha(parent-lp)/mendan/juku-shindan）。 */
export const REVENUE_MARKER_ROUTES = ['/hiyou', '/suisen-nyuushi', '/hogosha', '/mendan', '/juku-shindan'];

/** ページ（またはその依存閉包）に存在すれば「収益CTAが直接ある」とみなすコンポーネント名。 */
export const REVENUE_CTA_COMPONENT_NAMES = [
  'ParentLeadCTA',
  'ParentLeadCTAExperiment',
  'ParentLeadCTAPositionSlot',
  'HogoshaLeadCTA',
  'StickyConvertBar',
  'ExitIntentLineModal',
];

/** ソース文字列中の静的な内部ルートhref（href="/xxx" / href={'/xxx'} 等）を抽出する。動的補間は対象外。 */
export function extractInternalRouteLinks(source: string): string[] {
  const routes = new Set<string>();
  const re = /href=\{?[`'"](\/[^`'"]*)[`'"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const withoutQuery = m[1].split('?')[0].split('#')[0];
    const normalized = withoutQuery.length > 1 ? withoutQuery.replace(/\/$/, '') : withoutQuery;
    if (normalized) routes.add(normalized);
  }
  return [...routes];
}

/** ソース文字列に収益CTAコンポーネントのJSXタグが含まれるか。 */
export function fileHasRevenueCtaMarker(source: string): boolean {
  return REVENUE_CTA_COMPONENT_NAMES.some((name) => new RegExp(`<${name}[\\s/>]`).test(source));
}

/**
 * 有向グラフ（route→outboundルート配列）上で、revenueRoutes集合への最短距離をBFSで求める
 * 純粋関数。revenueRoutes自身の距離は1（掛-5定義: 距離1=CTAが直接ある）。到達不能はInfinity。
 * 逆辺グラフを収益ノードから広げることで「各ページの出リンクを辿った最短到達距離」と等価になる。
 */
export function computeDistancesFromGraph(
  adjacency: Record<string, string[]>,
  revenueRoutes: Iterable<string>
): Record<string, number> {
  const reverse: Record<string, string[]> = {};
  for (const [from, tos] of Object.entries(adjacency)) {
    for (const to of tos) {
      (reverse[to] ??= []).push(from);
    }
  }
  const dist: Record<string, number> = {};
  const queue: string[] = [];
  for (const r of revenueRoutes) {
    if (!(r in dist)) {
      dist[r] = 1;
      queue.push(r);
    }
  }
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const p of reverse[cur] ?? []) {
      if (!(p in dist)) {
        dist[p] = dist[cur] + 1;
        queue.push(p);
      }
    }
  }
  return dist;
}

/**
 * page.tsxのファイルパス→ルートテンプレート文字列。[[internal-link-graph]]の`pageFileToRoute`とは
 * 異なり、動的セグメント（`[code]`等）を`null`で除外せずそのままリテラルに残す（例:
 * `/pref/[code]/school/[schoolCode]`）。掛-5の目的は「そのページ*型*が収益面から何クリックか」を
 * 測ることであり、Λ-2の3,500校ページのような動的ルートこそ収益距離の主戦場のため除外できない。
 */
function pageFileToRouteTemplate(appDir: string, file: string): string | null {
  let rel = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  rel = rel
    .split('/')
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
    .join('/');
  if (rel.startsWith('api') || rel === 'api') return null;
  const route = '/' + rel;
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

function resolveImportPath(importPath: string, fromFile: string, srcDir: string): string | null {
  let base: string;
  if (importPath.startsWith('@/')) {
    base = path.join(srcDir, importPath.slice(2));
  } else if (importPath.startsWith('.')) {
    base = path.join(path.dirname(fromFile), importPath);
  } else {
    return null;
  }
  const candidates = [base + '.tsx', base + '.ts', path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const IMPORT_FROM_RE = /from\s+['"]([^'"]+)['"]/g;

/**
 * entryFileが直接／間接に読み込むローカルファイル（@/・相対importのみ、外部パッケージは辿らない）を
 * maxDepthまでBFSし、訪問した全ファイルのソースを結合して返す。sourceCacheは呼び出し間でfs読み込みを
 * 使い回すための共有キャッシュ（378ページ分を計算する際の重複読み込みを防ぐ）。
 */
export function collectDependencyClosureSource(
  entryFile: string,
  srcDir: string,
  maxDepth: number,
  sourceCache: Map<string, string> = new Map()
): string {
  const visited = new Set<string>();
  const queue: Array<{ file: string; depth: number }> = [{ file: entryFile, depth: 0 }];
  const chunks: string[] = [];

  while (queue.length > 0) {
    const { file, depth } = queue.shift()!;
    if (visited.has(file)) continue;
    visited.add(file);

    let source = sourceCache.get(file);
    if (source === undefined) {
      try {
        source = fs.readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      sourceCache.set(file, source);
    }
    chunks.push(source);

    if (depth >= maxDepth) continue;
    let m: RegExpExecArray | null;
    IMPORT_FROM_RE.lastIndex = 0;
    while ((m = IMPORT_FROM_RE.exec(source))) {
      const resolved = resolveImportPath(m[1], file, srcDir);
      if (resolved && !visited.has(resolved)) {
        queue.push({ file: resolved, depth: depth + 1 });
      }
    }
  }
  return chunks.join('\n');
}

export interface RevenueDistanceEntry {
  route: string;
  distance: number;
  hasDirectCta: boolean;
  outboundLinks: string[];
}

/** ページ依存閉包の探索深さ。ResultFlow系の合成コンポーネントは3〜4階層が典型のため余裕を見て6に設定。 */
const DEFAULT_MAX_DEPTH = 6;

/**
 * appDir配下の全page.tsxについて収益距離を計算する（掛-5第1周の中核）。GSC実測値は含まない
 * （別途mcp__gsc__gsc_queryの結果と`route`キーで突合すること）。
 */
export function computeSiteRevenueDistances(appDir: string, srcDir: string): RevenueDistanceEntry[] {
  const pageFiles = walkPageFiles(appDir);
  const routeToFile = new Map<string, string>();
  for (const file of pageFiles) {
    const route = pageFileToRouteTemplate(appDir, file);
    if (route) routeToFile.set(route, file);
  }
  const knownRoutes = new Set(routeToFile.keys());
  const sourceCache = new Map<string, string>();

  const adjacency: Record<string, string[]> = {};
  const hasCta = new Set<string>();

  for (const [route, file] of routeToFile) {
    const closureSource = collectDependencyClosureSource(file, srcDir, DEFAULT_MAX_DEPTH, sourceCache);
    const links = extractInternalRouteLinks(closureSource).filter((r) => knownRoutes.has(r) && r !== route);
    adjacency[route] = links;
    if (REVENUE_MARKER_ROUTES.includes(route) || fileHasRevenueCtaMarker(closureSource)) {
      hasCta.add(route);
    }
  }

  const distances = computeDistancesFromGraph(adjacency, hasCta);

  return [...routeToFile.keys()]
    .map((route) => ({
      route,
      distance: distances[route] ?? Infinity,
      hasDirectCta: hasCta.has(route),
      outboundLinks: adjacency[route] ?? [],
    }))
    .sort((a, b) => a.route.localeCompare(b.route));
}

/** 中央値（Infinityを含む配列にも対応・偶数件は下側を採用）。 */
export function medianDistance(entries: RevenueDistanceEntry[]): number {
  if (entries.length === 0) return Infinity;
  const sorted = [...entries.map((e) => e.distance)].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}
