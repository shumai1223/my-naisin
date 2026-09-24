/**
 * @jest-environment node
 *
 * T-ADS1 AdSense 配置の不変条件（ops/tasks/T-ADS1-adsense-placement.md §3・§4）。
 *
 * 広告は「稼ぐ」より先に「壊さない」ことが契約:
 *  - 除外ルート（/embed・API・法務/運営・保護者フォーム等）には広告を出さない（他人のサイト・規約違反の面に出さない）
 *  - 1ページの手動枠は3つ以内（過剰配置＝ポリシー/体験/CLS違反の予防）
 *  - 広告は保護者リードCTA・保存CTAより必ず下（2026-07-04に審査対応でCTAを隠して自傷した前科の再発防止）
 *  - ユニットIDは管理画面で発行された本物（プレースホルダのままだと二重ガードで永久に出ない）
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import * as React from 'react';
import { AD_UNITS, adUnitAttributes } from '@/lib/ad-units';
import { AdUnit, isPlaceholderSlot } from '@/components/AdSlot';
import { splitHtmlForInArticleAds } from '@/lib/blog-ad-insert';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === '__tests__' || name === 'node_modules') continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(name) && !/\.test\./.test(name)) {
      out.push(p);
    }
  }
  return out;
}

const fileCache = new Map<string, string>();
function read(p: string): string {
  let c = fileCache.get(p);
  if (c === undefined) {
    c = readFileSync(p, 'utf8');
    fileCache.set(p, c);
  }
  return c;
}

/** '@/x/y' → 実ファイル（.tsx/.ts/index.tsx）。解決できなければ null（外部パッケージ・型のみ等）。 */
function resolveAlias(spec: string): string | null {
  if (!spec.startsWith('@/')) return null;
  const base = join(SRC, spec.slice(2));
  for (const cand of [base + '.tsx', base + '.ts', join(base, 'index.tsx'), join(base, 'index.ts')]) {
    if (existsSync(cand) && statSync(cand).isFile()) return cand;
  }
  return null;
}

function importsOf(p: string): string[] {
  const res: string[] = [];
  const re = /from\s+['"](@\/[^'"]+)['"]/g;
  const c = read(p);
  let m: RegExpExecArray | null;
  while ((m = re.exec(c)) !== null) {
    const r = resolveAlias(m[1]);
    if (r) res.push(r);
  }
  return res;
}

/** ファイルとその推移的な @/ import の集合。 */
function closure(entry: string): Set<string> {
  const seen = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const f = stack.pop() as string;
    if (seen.has(f)) continue;
    seen.add(f);
    for (const i of importsOf(f)) stack.push(i);
  }
  return seen;
}

/** 1ファイル内の <AdUnit の枠数。記事内広告(IN_ARTICLE)は最大2枠まで出る（blog-ad-insert.ts）ので重み2。 */
function slotWeight(src: string): number {
  let w = 0;
  const re = /<AdUnit\b[^>]*unit="([A-Z_]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) w += m[1] === 'IN_ARTICLE' ? 2 : 1;
  return w;
}

const allFiles = walk(SRC);
const pageFiles = allFiles.filter((f) => /[\\/]page\.tsx$/.test(f));

describe('AD_UNITS（管理画面で発行された本物のID）', () => {
  it('4ユニットとも実IDで、種類が管理画面の設定どおり', () => {
    expect(AD_UNITS.RESULT_BELOW).toMatchObject({ slot: '1489568761', kind: 'display' });
    expect(AD_UNITS.IN_CONTENT).toMatchObject({ slot: '4472981442', kind: 'display' });
    expect(AD_UNITS.IN_ARTICLE).toMatchObject({ slot: '5642592886', kind: 'in-article' });
    expect(AD_UNITS.PAGE_BOTTOM).toMatchObject({ slot: '3128110186', kind: 'multiplex' });
    for (const u of Object.values(AD_UNITS)) {
      expect(isPlaceholderSlot(u.slot)).toBe(false);
      expect(u.minHeight).toBeGreaterThan(0); // CLS対策の高さ予約
    }
    const slots = Object.values(AD_UNITS).map((u) => u.slot);
    expect(new Set(slots).size).toBe(slots.length);
  });

  it('<ins> の属性は管理画面のコードどおり（記事内・Multiplexに data-full-width-responsive を付けない）', () => {
    expect(adUnitAttributes('display')).toEqual({ format: 'auto', fullWidthResponsive: true });
    expect(adUnitAttributes('in-article')).toEqual({ format: 'fluid', layout: 'in-article' });
    expect(adUnitAttributes('multiplex')).toEqual({ format: 'autorelaxed' });
  });
});

describe('AdUnit の描画（点火スイッチ）', () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    else process.env.NEXT_PUBLIC_ADSENSE_ENABLED = ORIGINAL;
  });

  it('env 未点火なら4ユニットとも何も描画しない（CLSも出ない）', () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    for (const unit of Object.keys(AD_UNITS) as (keyof typeof AD_UNITS)[]) {
      expect(renderToStaticMarkup(React.createElement(AdUnit, { unit }))).toBe('');
    }
  });

  it('点火後: ラベル・高さ予約・ユニット別の属性が出る', () => {
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = '1';
    const html = (unit: keyof typeof AD_UNITS) => renderToStaticMarkup(React.createElement(AdUnit, { unit }));

    const rb = html('RESULT_BELOW');
    expect(rb).toContain('スポンサーリンク');
    expect(rb).toContain('data-ad-slot="1489568761"');
    expect(rb).toContain('data-ad-format="auto"');
    expect(rb).toContain('data-full-width-responsive="true"');
    expect(rb).toContain('min-height:250px');
    expect(rb).not.toContain('data-ad-layout');

    const ia = html('IN_ARTICLE');
    expect(ia).toContain('data-ad-slot="5642592886"');
    expect(ia).toContain('data-ad-layout="in-article"');
    expect(ia).toContain('data-ad-format="fluid"');
    expect(ia).toContain('text-align:center');
    expect(ia).not.toContain('data-full-width-responsive');

    const pb = html('PAGE_BOTTOM');
    expect(pb).toContain('data-ad-slot="3128110186"');
    expect(pb).toContain('data-ad-format="autorelaxed"');
    expect(pb).not.toContain('data-full-width-responsive');
    expect(pb).toContain('print:hidden');
  });
});

describe('除外ルートには広告を出さない（他人のサイト・規約/運営・保護者フォーム・API）', () => {
  const EXCLUDED_DIRS = [
    'src/app/embed',
    'src/app/api',
    'src/app/developers',
    'src/app/nendomatsu-pack',
    'src/app/privacy',
    'src/app/terms',
    'src/app/tokushoho',
    'src/app/quality',
    'src/app/reliability',
    'src/app/disclaimer',
    'src/app/contact',
    'src/app/about',
    'src/app/admin',
    'src/app/juku',
    'src/app/partner',
    'src/app/partner-demo',
    'src/app/advisor',
    'src/app/go',
    'src/app/dashboard',
    'src/app/press',
    'src/app/hogosha',
    'src/app/mendan',
    'src/app/interim-bulletin-preview',
  ];

  it.each(EXCLUDED_DIRS)('%s は（推移的な import を含めて）AdUnit/AdSlot を使わない', (dir) => {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) return; // ルート自体が無ければ何も出ようがない
    const offenders: string[] = [];
    for (const f of walk(abs)) {
      for (const dep of closure(f)) {
        const src = read(dep);
        if (/<AdUnit\b|<AdSlot\b/.test(src) && !/[\\/]components[\\/]AdSlot\.tsx$/.test(dep)) {
          offenders.push(`${relative(ROOT, f)} → ${relative(ROOT, dep)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('保護者リードのフォーム面（SchoolParentLeadForm 等）の入力中の画面には広告を出さない', () => {
    for (const f of allFiles) {
      if (/[\\/]components[\\/](SchoolParentLeadForm|HogoshaLeadCTA|ParentLeadCTA|SaveResultCTA)\.tsx$/.test(f)) {
        expect(/<AdUnit\b|<AdSlot\b/.test(read(f))).toBe(false);
      }
    }
  });
});

describe('1ページあたりの手動枠は3つ以内', () => {
  const rows = pageFiles.map((p) => {
    let w = 0;
    for (const dep of closure(p)) {
      if (/[\\/]components[\\/]AdSlot\.tsx$/.test(dep)) continue; // コンポーネント自身のコメントは数えない
      w += slotWeight(read(dep));
    }
    return { page: relative(ROOT, p), weight: w };
  });

  it('広告を使っているページが存在する（検出ロジックの自己点検）', () => {
    expect(rows.filter((r) => r.weight > 0).length).toBeGreaterThanOrEqual(19);
  });

  it('どのページも合計3枠以内（記事内広告は最大2枠として数える）', () => {
    expect(rows.filter((r) => r.weight > 3)).toEqual([]);
  });
});

describe('広告は保護者CTA・保存CTAより必ず下（収益の主導線を押し下げない）', () => {
  const CTA_TAGS = ['<ParentLeadCTA', '<ParentLeadCTAExperiment', '<SaveResultCTA', '<GapToTarget', '<ParentCostBridge'];

  const filesWithAd = allFiles.filter((f) => /<AdUnit\b/.test(read(f)) && !/[\\/]components[\\/]AdSlot\.tsx$/.test(f));

  it('広告を置いたファイルがある', () => {
    expect(filesWithAd.length).toBeGreaterThan(20);
  });

  it('各ファイルで、最初の広告は最初のCTAより後ろにある（ブログ本文中の記事内広告のみ例外）', () => {
    const offenders: string[] = [];
    for (const f of filesWithAd) {
      // ブログは記事内広告(IN_ARTICLE)を本文の途中に置く仕様（T-ADS1 §3）で、末尾のCTAは本文を読み終えた後に出る。
      if (/[\\/]blog[\\/]\[slug\][\\/]page\.tsx$/.test(f)) continue;
      const src = read(f);
      const adIdx = src.search(/<AdUnit\b/);
      const ctaIdxs = CTA_TAGS.map((t) => src.indexOf(t)).filter((i) => i >= 0);
      if (ctaIdxs.length && adIdx < Math.min(...ctaIdxs)) offenders.push(relative(ROOT, f));
    }
    expect(offenders).toEqual([]);
  });

  it('結果連動フロー（*ResultFlow.tsx）では、広告は全てのCTAより後ろ・結果が出た後だけ描画する', () => {
    const flows = filesWithAd.filter((f) => /ResultFlow\.tsx$/.test(f));
    expect(flows.length).toBeGreaterThanOrEqual(13);
    for (const f of flows) {
      const src = read(f);
      const adIdx = src.search(/<AdUnit\b/);
      for (const t of CTA_TAGS) {
        const last = src.lastIndexOf(t);
        if (last >= 0) expect({ f: relative(ROOT, f), t, ok: adIdx > last }).toEqual({ f: relative(ROOT, f), t, ok: true });
      }
      // 結果が出る前（入力欄だけの状態）では出さない
      expect(/\{(has|result) && <AdUnit unit="RESULT_BELOW" \/>\}/.test(src)).toBe(true);
    }
  });

  it('学校ページ: 広告は倍率データ・保護者CTA・リードフォームより下', () => {
    const src = read(join(SRC, 'app/pref/[code]/school/[schoolCode]/page.tsx'));
    const ad = src.search(/<AdUnit\b/);
    for (const t of ['<SchoolPageParentBridge', '<SchoolPageConvertCTA', '<ParentLeadCTA', '<SchoolParentLeadForm']) {
      expect(ad).toBeGreaterThan(src.indexOf(t));
    }
    expect((src.match(/<AdUnit\b/g) ?? []).length).toBe(3);
  });
});

describe('ブログの記事内広告の挿入位置（blog-ad-insert）', () => {
  const intro = '<p>' + 'あ'.repeat(250) + '</p>';
  const sec = (n: number) => `<h2 id="s${n}">見出し${n}</h2><p>本文${n}</p>`;

  it('セグメントを連結すると元の本文に戻る（本文を書き換えない）', () => {
    const html = intro + sec(1) + sec(2) + sec(3) + sec(4);
    expect(splitHtmlForInArticleAds(html).join('')).toBe(html);
  });

  it('導入文の後・最初の見出しの前 と、そこから2つ先の見出しの前に入る（2枠）', () => {
    const html = intro + sec(1) + sec(2) + sec(3) + sec(4);
    const seg = splitHtmlForInArticleAds(html);
    expect(seg).toHaveLength(3);
    expect(seg[0]).toBe(intro);
    expect(seg[1]).toBe(sec(1) + sec(2));
    expect(seg[2]).toBe(sec(3) + sec(4));
  });

  it('見出しが少ない短い記事は1枠だけ・見出しが無ければ広告なし', () => {
    expect(splitHtmlForInArticleAds(intro + sec(1) + sec(2))).toHaveLength(2);
    expect(splitHtmlForInArticleAds(intro + '<p>見出しなし</p>')).toEqual([intro + '<p>見出しなし</p>']);
  });

  it('導入文が短く見出しが冒頭にある記事は、冒頭に広告を置かず次の見出しを使う', () => {
    const html = sec(1) + '<p>' + 'い'.repeat(250) + '</p>' + sec(2) + sec(3) + sec(4);
    const seg = splitHtmlForInArticleAds(html);
    expect(seg[0].startsWith('<h2 id="s1">')).toBe(true);
    expect(seg.join('')).toBe(html);
    expect(seg.length).toBeGreaterThanOrEqual(2);
    expect(seg[1].startsWith('<h2 id="s2">')).toBe(true);
  });

  it('実在する全記事で連結すると元に戻り、広告は最大2枠', () => {
    const dir = join(SRC, 'lib/blog/posts');
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.ts')) continue;
      const src = readFileSync(join(dir, name), 'utf8');
      const seg = splitHtmlForInArticleAds(src);
      expect(seg.join('')).toBe(src);
      expect(seg.length).toBeLessThanOrEqual(3);
    }
  });
});
