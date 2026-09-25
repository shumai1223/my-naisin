/**
 * アフィリエイト広告は「親が来る場所」だけに置く（2026-09-25 👤裁定）。
 *
 * 背景: 計測開始(2026-06-18)から約3か月で、生徒向けページに93か所置いていたアフィリ（atama+・そら塾・
 * スタディサプリ等＝生徒本人が有料で使う物が中心）は、実クリック47件・確定0件（唯一の発生1件もキャンセル）。
 * 中学生は支払わないため構造的に成約しない。そこで生徒向けページからは外し、最も見られる位置はAdSenseに渡した。
 * 親が無料で申し込める物（資料請求・無料相談）は、親が来るページと保護者向けCTAの中にだけ残す。
 *
 * ⚠️ この一覧を増やすときは「そのページ（部品）を見に来るのは親か」を先に確かめること。
 *    生徒向けの計算機・偏差値・評定平均・学校ページ・トップ・ブログには戻さない。
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

/** アフィリエイトを置いてよいファイル（親が来る場所・保護者向けCTA部品）。 */
const ALLOWED = new Set(
  [
    'src/components/ParentLeadCTA.tsx', // 各ページの「保護者の方へ」枠（親向けの無料資料請求・無料体験）
    'src/components/FutoukouLeadCTA.tsx', // 不登校の保護者向け
    'src/components/JukuShindan/JukuShindanClient.tsx', // 塾選び診断（親が使う）
    'src/app/juku-hiyou/page.tsx', // 塾の費用（親が調べる）
    'src/app/mendan/page.tsx', // 三者面談の準備（家庭の方針の節に無料相談）
  ].map((p) => p.split('/').join(sep)),
);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === '__tests__' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

describe('アフィリエイト広告の置き場所（親が来る場所だけ）', () => {
  const files = walk(SRC).filter((f) => /<AffiliateAd\b/.test(readFileSync(f, 'utf8')));
  const rel = files.map((f) => relative(ROOT, f));

  it('許可リストの外に <AffiliateAd> が無い（生徒向けページに戻っていない）', () => {
    expect(rel.filter((f) => !ALLOWED.has(f)).sort()).toEqual([]);
  });

  it('許可リストのファイルは実在し、実際にアフィリを置いている（リストが腐っていない）', () => {
    expect([...ALLOWED].filter((f) => !rel.includes(f)).sort()).toEqual([]);
  });

  it('全体の設置数は少数に保たれている（2026-09-25時点で7か所）', () => {
    const count = files.reduce((n, f) => n + (readFileSync(f, 'utf8').match(/<AffiliateAd\b/g) ?? []).length, 0);
    expect(count).toBeLessThanOrEqual(10);
  });
});
