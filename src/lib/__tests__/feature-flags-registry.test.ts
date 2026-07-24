/**
 * @jest-environment node
 *
 * 機能フラグ登録簿(ZZ-9c)の契約テスト。
 * 1) 登録済みの全フラグが「'1'のときだけtrue・それ以外は既定off」という不変条件を守ることを
 *    横断で検証する。
 * 2) src/配下を実際にgrepし、コード中に存在する`NEXT_PUBLIC_*_ENABLED`の集合と登録簿
 *    (FEATURE_FLAGS)の集合が完全一致することを検証する（新しい旗の登録漏れ・登録簿の死んだ
 *    エントリの両方を検知する＝page-registry.ts/D1_BACKUP_TABLESと同じ「登録簿+完全性」パターン）。
 */
import fs from 'fs';
import path from 'path';
import { FEATURE_FLAGS } from '../feature-flags-registry';

const SRC_ROOT = path.join(__dirname, '..', '..');

/** 「既定off」判定に使う共通バッテリー：'1'以外はすべてfalseになるべき値の集合。 */
const OFF_VALUES: (string | undefined)[] = [undefined, '', '0', 'true', 'false', 'yes', ' 1', '1 ', '01'];

describe('FEATURE_FLAGS（機能フラグ登録簿）', () => {
  test('登録簿が空でない', () => {
    expect(FEATURE_FLAGS.length).toBeGreaterThan(0);
  });

  test('envVarの命名規則(NEXT_PUBLIC_*_ENABLED)を全件満たす', () => {
    for (const flag of FEATURE_FLAGS) {
      expect(flag.envVar).toMatch(/^NEXT_PUBLIC_[A-Z0-9_]*_ENABLED$/);
    }
  });

  test.each(FEATURE_FLAGS.map((f) => [f.name, f] as const))(
    '%s: "1"のときだけtrue、それ以外(未設定・空・"0"・"true"・前後空白付き等)は既定off',
    (_name, flag) => {
      expect(flag.check('1')).toBe(true);
      for (const off of OFF_VALUES) {
        expect(flag.check(off)).toBe(false);
      }
    }
  );
});

/** src/配下の.ts/.tsxを再帰列挙する（node_modules/.next等は除外）。 */
function walkSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '__tests__') continue;
      walkSourceFiles(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

describe('FEATURE_FLAGS の完全性(コード中の実際の環境変数名との突合)', () => {
  test('src/配下に出現する全てのNEXT_PUBLIC_*_ENABLEDが登録簿に含まれる(登録漏れの検知)', () => {
    const pattern = /NEXT_PUBLIC_[A-Z0-9_]*_ENABLED/g;
    const foundInCode = new Set<string>();
    for (const file of walkSourceFiles(SRC_ROOT)) {
      const content = fs.readFileSync(file, 'utf8');
      for (const m of content.matchAll(pattern)) {
        foundInCode.add(m[0]);
      }
    }
    const registered = new Set(FEATURE_FLAGS.map((f) => f.envVar));
    const missing = [...foundInCode].filter((name) => !registered.has(name));
    expect(missing).toEqual([]);
  });

  test('登録簿のエントリは実際にコード中で参照されている(死んだ登録の検知)', () => {
    const pattern = /NEXT_PUBLIC_[A-Z0-9_]*_ENABLED/g;
    const foundInCode = new Set<string>();
    for (const file of walkSourceFiles(SRC_ROOT)) {
      const content = fs.readFileSync(file, 'utf8');
      for (const m of content.matchAll(pattern)) {
        foundInCode.add(m[0]);
      }
    }
    const stale = FEATURE_FLAGS.map((f) => f.envVar).filter((name) => !foundInCode.has(name));
    expect(stale).toEqual([]);
  });
});
