import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * T-Y11 A-3: 「定時制・通信制はスコープ外」は47県全ファイルに共通する暗黙の前提だった
 * （2026-09-01調査で確認: 47県全てのヘッダコメントに「全日制の外側の別課程のためスコープ外」
 * 相当の文言が既に存在していた）。この規約はこれまでどのファイルにも構造化されておらず、
 * 新しい県を追加する際に明記し忘れても誰も気づけない状態だった。
 *
 * この規約を明文の不変条件テストへ格上げする（LOOP_CONTRACT §3-4「数値を持つ型を作ったら
 * 不変条件テストを同時に書く」と同じ思想を、prose上の設計判断にも適用）。
 * 新規に県ファイルを追加・改修する際、定時制／通信制の扱いについて一言も触れていなければ
 * このテストが落ちる＝スコープ判断を明示することを機械的に強制する。
 */

const DATA_DIR = join(__dirname, '..');

function competitionRateFiles(): string[] {
  return readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('__tests__'));
}

const SCOPE_MENTION_RE = /定時制|通信制/;
const EXCLUSION_LANGUAGE_RE = /スコープ外|対象外|除外/;

describe('competition-rates scope-exclusion invariant (定時制/通信制の扱いを必ず明記する)', () => {
  const files = competitionRateFiles();

  it('covers all 47 prefectures (guards against silently adding/removing a file without updating this test)', () => {
    expect(files.length).toBe(47);
  });

  it.each(files)('%s documents whether 定時制/通信制 is in or out of scope', (file) => {
    const content = readFileSync(join(DATA_DIR, file), 'utf-8');
    const mentionsScope = SCOPE_MENTION_RE.test(content);
    const explainsExclusion = EXCLUSION_LANGUAGE_RE.test(content);
    // 「定時制」という語が一度も出てこないファイルはスコープ判断そのものが書かれていない
    // ＝新規追加時にこの判断を忘れた可能性が高い。実データがあるなら除外語で説明されているはず。
    expect(mentionsScope).toBe(true);
    expect(explainsExclusion).toBe(true);
  });
});
