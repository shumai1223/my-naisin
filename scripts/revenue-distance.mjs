#!/usr/bin/env node
/**
 * 収益距離（Revenue Distance）算出 — PHASE 0 / ops/DISTANCE.md の一次データ生成器。
 *
 * 定義:
 *   収益距離 = そのページから最も近い「収益面」まで内部リンクを最短で何クリック辿るか。
 *   距離1 = そのページ自身に収益CTA（AffiliateAd / ParentLeadCTA系 / LINE登録CTA）がある
 *   距離2 = 1クリックで収益CTAのあるページに着く
 *   距離∞ = 内部リンクでは到達できない（孤児）
 *
 * 既存資産の再利用（ゼロから作らない）:
 *   src/lib/internal-link-graph.ts の walkSourceFiles / walkPageFiles / pageFileToRoute を import して使う。
 *   （scripts/link-graph-report.ts・scripts/check-orphans.mjs と同じ資産）
 *
 * ⚠️ 静的解析の限界（推測で埋めない・件数を必ず報告する）:
 *   - href={someVariable} のように href が識別子・関数呼び出しのものは行き先を特定できない → UNRESOLVED として計上
 *   - href={`/${p.code}/naishin`} は ${...} を * に潰し、動的ルート [param] とセグメント一致させて解決する
 *     （/[prefecture]/naishin に解決）。この「テンプレート解決」の件数も別途計上する
 *   - 解決できたが対応する page.tsx が無い（外部URL・#アンカー・301先など）は UNMATCHED として計上
 *
 * 実行: node_modules/.bin/tsx scripts/revenue-distance.mjs
 * 出力: ops/raw/revenue-distance.json
 */
import fs from 'fs';
import path from 'path';
// tsx 経由で .ts を .mjs から読むと静的 import では named export を解決できないため動的 import を使う。
const { walkSourceFiles, walkPageFiles, pageFileToRoute } = await import('../src/lib/internal-link-graph.ts');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app');
const SRC_DIR = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'ops', 'raw', 'revenue-distance.json');
const ROOT_LAYOUT = path.join(APP_DIR, 'layout.tsx');

// ── 1. ルートテンプレートの列挙 ───────────────────────────────────────────────
/** page.tsx → ルートテンプレート（[param] は残す・(group) は落とす・/api は除外）。 */
function pageFileToRouteTemplate(file) {
  let rel = path.relative(APP_DIR, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  rel = rel.split('/').filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/');
  const route = '/' + rel;
  if (route.startsWith('/api')) return null;
  return route === '/' ? '/' : route.replace(/\/$/, '');
}

const pageFiles = walkPageFiles(APP_DIR);
const routes = []; // { route, file, isDynamic, staticRoute }
for (const f of pageFiles) {
  const tpl = pageFileToRouteTemplate(f);
  if (!tpl) continue;
  routes.push({ route: tpl, file: f, isDynamic: tpl.includes('['), staticRoute: pageFileToRoute(APP_DIR, f) });
}
const routeByTpl = new Map(routes.map((r) => [r.route, r]));

// ── 2. モジュール解決（import グラフ） ────────────────────────────────────────
const NON_NAVIGATIONAL = ['page-registry.ts', 'sitemap.ts', 'robots.ts'];
const EXT_TRIES = ['', '.tsx', '.ts', '.mjs', '.js', '/index.tsx', '/index.ts'];

function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(SRC_DIR, spec.slice(2));
  else if (spec.startsWith('./') || spec.startsWith('../')) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // node_modules / next / react 等
  for (const ext of EXT_TRIES) {
    const cand = base + ext;
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
}

const fileCache = new Map();
function read(f) {
  if (!fileCache.has(f)) fileCache.set(f, fs.readFileSync(f, 'utf8'));
  return fileCache.get(f);
}

const importCache = new Map();
function importsOf(f) {
  if (importCache.has(f)) return importCache.get(f);
  const src = read(f);
  const specs = new Set();
  for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) specs.add(m[1]);
  for (const m of src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.add(m[1]);
  const out = [];
  for (const s of specs) {
    const r = resolveImport(f, s);
    if (r && !NON_NAVIGATIONAL.includes(path.basename(r))) out.push(r);
  }
  importCache.set(f, out);
  return out;
}

/** ページの祖先 layout.tsx（app ルーティング準拠）。 */
function ancestorLayouts(pageFile) {
  const out = [];
  let dir = path.dirname(pageFile);
  for (;;) {
    const l = path.join(dir, 'layout.tsx');
    if (fs.existsSync(l)) out.push(l);
    if (path.resolve(dir) === path.resolve(APP_DIR)) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return out;
}

/** ページの描画ツリー（推移的 import 閉包）。includeRootLayout=false で全ページ共通のグローバル装飾を外す。 */
function componentTree(pageFile, includeRootLayout) {
  const seeds = [pageFile, ...ancestorLayouts(pageFile).filter((l) => includeRootLayout || path.resolve(l) !== path.resolve(ROOT_LAYOUT))];
  const seen = new Set();
  const stack = [...seeds];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    for (const n of importsOf(f)) if (!seen.has(n)) stack.push(n);
  }
  return [...seen];
}

// ── 3. 収益CTAの検出（JSX 使用箇所ベース＝定義ファイルの誤検出を避ける） ───────
const AFF_MARKERS = [
  /<AffiliateAd\b/, /<ParentLeadCTA\b/, /<ParentLeadCTAExperiment\b/, /<ParentLeadCTAPositionSlot\b/,
  /<HogoshaLeadCTA\b/, /<FutoukouLeadCTA\b/, /<SidebarAd\b/, /<SponsorSlot\b/,
];
const LINE_MARKER = /lineAddUrl\s*\(/;

/** ParentLeadCTA 系の使用箇所から placement / affiliateId を抜く（オファー階級の判定用）。 */
const PLC_RE = /<ParentLeadCTA(?:Experiment|PositionSlot)?\b((?:[^<>]|\n)*?)\/?>/g;
const STANDALONE_AD_RE = /<AffiliateAd\b((?:[^<>]|\n)*?)\/?>/g;

function ctaOf(tree) {
  let aff = false, line = false;
  const affFiles = [], lineFiles = [], instances = [], standaloneAds = [];
  for (const f of tree) {
    const src = read(f);
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    if (AFF_MARKERS.some((re) => re.test(src))) { aff = true; affFiles.push(rel); }
    if (LINE_MARKER.test(src)) { line = true; lineFiles.push(rel); }
    for (const m of src.matchAll(PLC_RE)) {
      const a = m[1];
      instances.push({
        file: rel + ':' + (src.slice(0, m.index).split('\n').length),
        placement: (/placement="([^"]+)"/.exec(a) ?? [])[1] ?? null,
        affiliateId: (/affiliateId="([^"]+)"/.exec(a) ?? [])[1] ?? null,
      });
    }
    for (const m of src.matchAll(STANDALONE_AD_RE)) {
      const a = m[1];
      standaloneAds.push({
        file: rel + ':' + (src.slice(0, m.index).split('\n').length),
        id: (/\bid="([^"]+)"/.exec(a) ?? [])[1] ?? null,
        placement: (/\bplacement="([^"]+)"/.exec(a) ?? [])[1] ?? (/viewPlacement="([^"]+)"/.exec(a) ?? [])[1] ?? null,
      });
    }
  }
  return { aff, line, affFiles, lineFiles, instances, standaloneAds };
}

// ── 4. 発リンクの抽出 ────────────────────────────────────────────────────────
const stats = { hrefTotal: 0, hrefLiteral: 0, hrefTemplate: 0, hrefUnresolved: 0, hrefExternal: 0, hrefAnchorOnly: 0 };

/** ファイル1本から内部リンク候補（'/...' 形）を抽出。戻り値は {targets:Set, unresolved:number} */
function extractHrefs(file) {
  const src = read(file);
  const targets = new Set();
  let unresolved = 0;
  // href="..." / href='...'
  for (const m of src.matchAll(/href=(?:"([^"]*)"|'([^']*)')/g)) {
    stats.hrefTotal++;
    classify(m[1] ?? m[2], targets, false);
  }
  // href={'...'} href={"..."} href={`...`}
  for (const m of src.matchAll(/href=\{\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)\s*\}/g)) {
    stats.hrefTotal++;
    const v = m[1] ?? m[2] ?? m[3];
    classify(v, targets, m[3] !== undefined && v.includes('${'));
  }
  // href={ 何か式 } → 行き先不明
  for (const m of src.matchAll(/href=\{\s*(?!['"`])/g)) {
    stats.hrefTotal++; stats.hrefUnresolved++; unresolved++;
    void m;
  }
  // オブジェクトリテラル形 { href: '/x', title: ... }（/tools・RelatedToolsSection 等のリンク配列）
  for (const m of src.matchAll(/href:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)/g)) {
    stats.hrefTotal++;
    classify(m[1] ?? m[2] ?? m[3], targets, false);
  }
  // router.push('/x') / redirect('/x')
  for (const m of src.matchAll(/(?:router\.push|redirect)\(\s*['"`]([^'"`]+)['"`]/g)) {
    stats.hrefTotal++; classify(m[1], targets, false);
  }
  return { targets, unresolved };
}

function classify(raw, targets, isTemplate) {
  if (!raw) { stats.hrefUnresolved++; return; }
  if (raw.startsWith('#')) { stats.hrefAnchorOnly++; return; }
  if (/^(https?:|mailto:|tel:|\/\/)/.test(raw)) { stats.hrefExternal++; return; }
  if (!raw.startsWith('/')) { stats.hrefUnresolved++; return; }
  let p = raw.split('#')[0].split('?')[0];
  if (p.includes('${')) {
    stats.hrefTemplate++;
    p = p.replace(/\$\{[^}]*\}/g, '*');
  } else {
    stats.hrefLiteral++;
    void isTemplate;
  }
  p = p.replace(/\/+$/, '') || '/';
  targets.add(p);
}

/** リンク文字列（'*' を含みうる）→ ルートテンプレート集合（複数マッチしうる）。 */
function matchRoutes(linkPath) {
  if (routeByTpl.has(linkPath)) return [linkPath];
  const segs = linkPath === '/' ? [] : linkPath.slice(1).split('/');
  const hits = [];
  for (const r of routes) {
    const rsegs = r.route === '/' ? [] : r.route.slice(1).split('/');
    if (rsegs.length !== segs.length) continue;
    let ok = true;
    for (let i = 0; i < segs.length; i++) {
      const a = segs[i], b = rsegs[i];
      if (b.startsWith('[')) continue;           // 動的セグメントは何にでも一致
      if (a === '*') { ok = false; break; }      // 具体セグメントに * は当てない（過剰一致を避ける）
      if (a !== b) { ok = false; break; }
    }
    if (ok) hits.push(r.route);
  }
  return hits;
}

// ── 5. グラフ構築 ────────────────────────────────────────────────────────────
function buildGraph(includeRootLayout) {
  const nodes = new Map(); // route -> { cta, out:Set<route>, unresolved, unmatched:Set }
  for (const r of routes) {
    const tree = componentTree(r.file, includeRootLayout);
    const cta = ctaOf(tree);
    const out = new Set();
    let unresolved = 0;
    const unmatched = new Set();
    for (const f of tree) {
      const { targets, unresolved: u } = extractHrefs(f);
      unresolved += u;
      for (const t of targets) {
        const hits = matchRoutes(t);
        if (hits.length === 0) unmatched.add(t);
        for (const h of hits) if (h !== r.route) out.add(h);
      }
    }
    nodes.set(r.route, { route: r.route, cta, out, unresolved, unmatched: [...unmatched], treeSize: tree.length });
  }
  return nodes;
}

/** 収益面集合から逆BFSで hops を求め、距離 = hops+1 を返す。 */
function distances(nodes, isRevenue) {
  const rev = new Map(); // route -> Set<route> 逆辺
  for (const [r, n] of nodes) { void r; for (const o of n.out) { if (!rev.has(o)) rev.set(o, new Set()); rev.get(o).add(n.route); } }
  const hops = new Map();
  const q = [];
  for (const [r, n] of nodes) if (isRevenue(n)) { hops.set(r, 0); q.push(r); }
  for (let i = 0; i < q.length; i++) {
    const cur = q[i];
    for (const p of rev.get(cur) ?? []) if (!hops.has(p)) { hops.set(p, hops.get(cur) + 1); q.push(p); }
  }
  const d = new Map();
  for (const r of nodes.keys()) d.set(r, hops.has(r) ? hops.get(r) + 1 : Infinity);
  return d;
}

// ── 6. GSC の611ページをルートテンプレートに写像 ──────────────────────────────
const gsc = JSON.parse(fs.readFileSync(path.join(ROOT, 'ops', 'raw', 'gsc-pages-28d.json'), 'utf8'));
function urlToPath(u) {
  const p = u.replace(/^https?:\/\/[^/]+/, '');
  return (p.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/');
}

// ── 実行 ────────────────────────────────────────────────────────────────────
const graphCtx = buildGraph(false);   // 文脈のみ（全ページ共通のグローバル装飾を除外）
const statsCtx = { ...stats };
Object.keys(stats).forEach((k) => { stats[k] = 0; });
const graphGlob = buildGraph(true);   // ルートlayout（Header/Footer/StickyBar/ExitModal）込み
const statsGlob = { ...stats };

const variants = {};
for (const [name, g] of [['ctx', graphCtx], ['glob', graphGlob]]) {
  variants[name] = {
    all: distances(g, (n) => n.cta.aff || n.cta.line),
    aff: distances(g, (n) => n.cta.aff),
  };
}

const gscRows = gsc.rows.map((row) => {
  const p = urlToPath(row.page);
  const hits = matchRoutes(p);
  const tpl = hits.length ? (routeByTpl.has(p) ? p : hits[0]) : null;
  return { url: row.page, path: p, template: tpl, clicks: row.clicks, impressions: row.impressions, position: row.position };
});

function pack(g, dAll, dAff) {
  const out = {};
  for (const [r, n] of g) {
    out[r] = {
      distanceAll: dAll.get(r) === Infinity ? null : dAll.get(r),
      distanceAff: dAff.get(r) === Infinity ? null : dAff.get(r),
      hasAffiliateCta: n.cta.aff,
      hasLineCta: n.cta.line,
      outDegree: n.out.size,
      out: [...n.out].sort(),
      unresolvedHrefs: n.unresolved,
      unmatchedTargets: n.unmatched.sort(),
      treeFiles: n.treeSize,
      parentLeadCtaInstances: n.cta.instances,
      standaloneAffiliateAds: n.cta.standaloneAds,
    };
  }
  return out;
}

// ブログ記事1本ごとの発リンク（question 6 用）
const POSTS_DIR = path.join(SRC_DIR, 'lib', 'blog', 'posts');
const postLinks = {};
if (fs.existsSync(POSTS_DIR)) {
  for (const f of fs.readdirSync(POSTS_DIR).filter((x) => x.endsWith('.ts'))) {
    const full = path.join(POSTS_DIR, f);
    const { targets, unresolved } = extractHrefs(full);
    const resolved = [...targets].flatMap((t) => matchRoutes(t));
    postLinks[f.replace(/\.ts$/, '')] = {
      internalTargets: [...targets].sort(),
      resolvedRoutes: [...new Set(resolved)].sort(),
      unresolvedHrefs: unresolved,
    };
  }
}

// /blog/[slug] は 51本の記事ファイルが1本の page.tsx から全部 import される（src/lib/blog/index.ts）ため、
// テンプレート単位の out はこの51本の和集合になり「1記事あたりの到達先」を過大評価する。
// 記事本文を除いた「全記事に共通で載るリンク」を別に出す（question 6 用）。
const blogPage = path.join(APP_DIR, 'blog', '[slug]', 'page.tsx');
let blogShared = null;
if (fs.existsSync(blogPage)) {
  const tree = componentTree(blogPage, false).filter((f) => !f.replace(/\\/g, '/').includes('/src/lib/blog/posts/'));
  const t = new Set();
  let unresolved = 0;
  for (const f of tree) {
    const e = extractHrefs(f);
    unresolved += e.unresolved;
    for (const x of e.targets) for (const h of matchRoutes(x)) t.add(h);
  }
  blogShared = { routes: [...t].sort(), unresolvedHrefs: unresolved, treeFiles: tree.length };
}

const result = {
  generatedAt: new Date().toISOString(),
  method: {
    reused: 'src/lib/internal-link-graph.ts (walkSourceFiles/walkPageFiles/pageFileToRoute)',
    revenueCtaMarkers: { affiliate: AFF_MARKERS.map(String), line: String(LINE_MARKER) },
    variants: {
      ctx: 'src/app/layout.tsx（Header/Footer/StickyConvertBar/ExitIntentLineModal）を各ページのツリーから除外＝文脈リンクのみ',
      glob: 'ルートlayout込み＝グローバルフッター等も1クリックとして数える',
    },
  },
  parseStats: { ctx: statsCtx, glob: statsGlob },
  routeCount: routes.length,
  routes: {
    ctx: pack(graphCtx, variants.ctx.all, variants.ctx.aff),
    glob: pack(graphGlob, variants.glob.all, variants.glob.aff),
  },
  gsc: gscRows.map((r) => ({
    ...r,
    dCtxAll: r.template ? (variants.ctx.all.get(r.template) === Infinity ? null : variants.ctx.all.get(r.template)) : undefined,
    dCtxAff: r.template ? (variants.ctx.aff.get(r.template) === Infinity ? null : variants.ctx.aff.get(r.template)) : undefined,
    dGlobAll: r.template ? (variants.glob.all.get(r.template) === Infinity ? null : variants.glob.all.get(r.template)) : undefined,
  })),
  blogPostLinks: postLinks,
  blogSharedOut: blogShared,
  walkSourceFilesCount: walkSourceFiles(SRC_DIR).length,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf8');
console.log('routes:', routes.length);
console.log('gsc rows:', gscRows.length, 'unmapped:', gscRows.filter((r) => !r.template).length);
console.log('parseStats ctx:', statsCtx);
console.log('wrote', OUT);
