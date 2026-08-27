/**
 * @jest-environment node
 *
 * T-C8: 「生徒の成績を受け取らない」設計をAPIのリクエストスキーマそのもので証明する。
 *
 * 公開データ/計算API（学習成績の状況・内申点・偏差値・総合得点・倍率・教育費・学校データ・
 * 匿名統計・MCP）は、個人を特定できるフィールドを受け取るスキーマを一切持たない。
 * 「送らない運用」ではなく「送れない設計」であることを、実ファイルの走査で機械的に固定する。
 *
 * 対象外（意図的に個人情報を扱う別目的のエンドポイント。T-C8の主張の対象ではない）:
 * - /api/keys（開発者登録用の任意email・生徒の成績データではない）
 * - /api/contact・/api/lead・/api/parent-funnel・/api/student-funnel（保護者の同意に基づく
 *   リード獲得フォーム。連絡先を受け取ること自体が目的で別カテゴリ）
 * - /api/juku-*（塾提携・レビュー機能。運営者間のやり取りで別カテゴリ）
 * - /api/admin/*・/api/billing/*・/api/stripe/*・/api/resend/*（内部管理・決済・webhook）
 * - /api/newsletter/*・/api/push/*・/api/unsubscribe・/api/calendar・/api/card・
 *   /api/status・/api/version・/api/openapi（非計算・インフラ系）
 */
import fs from 'fs';
import path from 'path';

const API_ROOT = path.join(__dirname, '..');

/** T-C8の主張対象＝公開データ/計算API一覧。 */
const CALCULATION_API_FILES = [
  'gakushu-seiseki/route.ts',
  'hensachi/route.ts',
  'hensachi/percentile-table/route.ts',
  'naishin/route.ts',
  'naishin/[code]/route.ts',
  'naishin/compare/route.ts',
  'naishin/csv/route.ts',
  'total-score/route.ts',
  'total-score/[code]/route.ts',
  'bairitsu/route.ts',
  'education-cost/route.ts',
  'education-cost/path-to-university/route.ts',
  'schools/[pref]/route.ts',
  'stats/csv/route.ts',
  'stats/distribution/route.ts',
  'stats/percentile/route.ts',
  'stats/submit/route.ts',
  'mcp/route.ts',
];

// 氏名・学籍番号・学校名・生年月日等、個人を特定し得るフィールド名（英字識別子）。
// 大文字小文字を区別せず、キー名として使われていないかを走査する。
const FORBIDDEN_FIELD_PATTERNS = [
  /\bstudentName\b/i,
  /\bfullName\b/i,
  /\bschoolName\b/i,
  /\bstudentId\b/i,
  /\bgakuseki\b/i,
  /\bbirthDate\b/i,
  /\bbirthday\b/i,
  /\bdateOfBirth\b/i,
  /\bdob\b/i,
  /\bstudentEmail\b/i,
  /\bparentName\b/i,
  // 単独の"name"はcode/system.nameのような一般名詞にも使われるため対象外
  // （生徒個人名を指す複合語のみを禁止パターンにする＝誤検知回避）。
];

describe('T-C8: 公開データ/計算APIのリクエストスキーマに個人特定フィールドが無い', () => {
  it('対象ファイルがすべて実在する（除外漏れ・パス変更の検知）', () => {
    for (const rel of CALCULATION_API_FILES) {
      expect(fs.existsSync(path.join(API_ROOT, rel))).toBe(true);
    }
  });

  it.each(CALCULATION_API_FILES)('%s: 個人特定フィールド名を受け取るスキーマが無い', (rel) => {
    const content = fs.readFileSync(path.join(API_ROOT, rel), 'utf8');
    for (const pattern of FORBIDDEN_FIELD_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  /**
   * `logApiHit(...)` 呼び出し内の最初の `{` から、波括弧の深さを数えて対応する `}` までを
   * 切り出す（正規表現の`[^{}]*`だとネストした`{}`（例: 三項演算子内のスプレッド）で
   * 誤って何も一致せずチェックを素通りさせてしまう＝2026-08-28に実際に発生した誤検知漏れの再発防止）。
   */
  function extractBalancedObjectLiterals(callText: string): string[] {
    const literals: string[] = [];
    let i = callText.indexOf('{');
    while (i !== -1) {
      let depth = 0;
      let j = i;
      for (; j < callText.length; j++) {
        if (callText[j] === '{') depth++;
        else if (callText[j] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      literals.push(callText.slice(i, j + 1));
      i = callText.indexOf('{', j + 1);
    }
    return literals;
  }

  it.each(CALCULATION_API_FILES)('%s: logApiHitの追加ログに生スコア・生徒データを含まない（安全なキーのみ）', (rel) => {
    const content = fs.readFileSync(path.join(API_ROOT, rel), 'utf8');
    const SAFE_LOG_KEYS = new Set(['tier', 'code', 'pref', 'codes', 'method', 'tool']);
    const calls = [...content.matchAll(/logApiHit\([^;]*?\)\s*;/gs)];
    let checkedAtLeastOneObject = false;
    for (const call of calls) {
      const objects = extractBalancedObjectLiterals(call[0]);
      for (const obj of objects) {
        checkedAtLeastOneObject = true;
        // トップレベルのkey:のみ拾う（ネストした`{ tool: ... }`もkey名自体は同じ安全リストで判定してよい）
        const keys = [...obj.matchAll(/(\w+)\s*:/g)].map((m) => m[1]);
        for (const key of keys) {
          expect(SAFE_LOG_KEYS.has(key)).toBe(true);
        }
      }
    }
    // このファイルにlogApiHitへのオブジェクト引数が1つも無かった場合、それ自体を明示的に確認する
    // （抽出ロジックが壊れて何も検査していないだけ、という状態を区別するため）。
    if (calls.length > 0) {
      const hasAnyObjectArg = calls.some((c) => c[0].includes('{'));
      expect(checkedAtLeastOneObject).toBe(hasAnyObjectArg);
    }
  });
});
