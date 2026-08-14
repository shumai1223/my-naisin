/**
 * site-in-a-box(R-4/ZZ-7a)の純データ・純関数層の契約テスト。
 * MANIFESTの各pathは実際にこのリポジトリからコピーされる対象であり、リネーム/削除されると
 * scaffold-site.tsが静かに壊れる(コピー元が存在しないファイルを参照し続ける)ため、
 * 実ファイルシステムと突合する不変条件を持たせる。
 */
import * as fs from 'fs';
import * as path from 'path';
import { MANIFEST, buildSkeletonFiles } from '../scaffold-site-manifest';

const REPO_ROOT = path.resolve(__dirname, '../../../');

describe('MANIFEST', () => {
  it('全エントリのpathがリポジトリ内に実在する(コピー元が消えていない)', () => {
    for (const entry of MANIFEST) {
      const abs = path.join(REPO_ROOT, entry.path);
      expect(fs.existsSync(abs)).toBe(true);
    }
  });

  it('pathに重複が無い', () => {
    const paths = MANIFEST.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('todoは全エントリで空文字でない', () => {
    for (const entry of MANIFEST) {
      expect(entry.todo.trim().length).toBeGreaterThan(0);
    }
  });

  it('genericAsIsはboolean型', () => {
    for (const entry of MANIFEST) {
      expect(typeof entry.genericAsIs).toBe('boolean');
    }
  });
});

describe('buildSkeletonFiles', () => {
  const files = buildSkeletonFiles('test-site');

  it('生成ファイルのpathに重複が無い', () => {
    const paths = files.map((f) => f.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('package.jsonは妥当なJSONで、siteNameがnameフィールドに反映される', () => {
    const pkg = files.find((f) => f.path === 'package.json');
    expect(pkg).toBeDefined();
    const parsed = JSON.parse(pkg!.content);
    expect(parsed.name).toBe('test-site');
    expect(parsed.scripts.test).toBe('jest');
    expect(parsed.scripts.typecheck).toBe('tsc --noEmit');
  });

  it('layout.tsxとpage.tsxにsiteNameが反映される', () => {
    const layout = files.find((f) => f.path === 'src/app/layout.tsx');
    const page = files.find((f) => f.path === 'src/app/page.tsx');
    expect(layout!.content).toContain('test-site');
    expect(page!.content).toContain('test-site');
  });

  it('siteNameを変えると生成内容も追従する(ハードコードされていない)', () => {
    const other = buildSkeletonFiles('another-site-name');
    const pkg = JSON.parse(other.find((f) => f.path === 'package.json')!.content);
    expect(pkg.name).toBe('another-site-name');
    expect(pkg.name).not.toBe('test-site');
  });

  it('.gitignoreにnode_modules/と.next/が含まれる(生成物を誤ってコミットしない)', () => {
    const gitignore = files.find((f) => f.path === '.gitignore');
    expect(gitignore!.content).toContain('node_modules/');
    expect(gitignore!.content).toContain('.next/');
  });
});
