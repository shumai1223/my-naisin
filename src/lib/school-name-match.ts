/**
 * 学校名(短縮表記)→学校コードの突合（Λ-2着手前提の欠落ピース）。
 *
 * `competition-rates/*.ts`（Y-2・Y-6）の`schoolName`は教委資料の慣用短縮表記
 * （例:'日比谷'）だが、`schools/*.ts`（Y-1・school-master.ts）の`name`は正式名称
 * （例:'東京都立日比谷高等学校'）。個別学校ページ(Λ-2)を建設するには、この2つを
 * 学校コードで結びつける必要があるが、その突合ロジックがこれまで一度も実装されて
 * いなかった（2026-07-31のΛ-2着手前調査で発見・[[fable5-fullaccel-backlog-2026-07]]参照）。
 *
 * 設計方針（Y-0憲法の精神を突合にも適用）：
 *  - **完全一致のみ**採用する。あいまい一致・部分一致・編集距離は使わない
 *    （誤った学校に生徒データを紐付けるリスクを取らない＝捏造ゼロと同じ理由）。
 *  - 正規化は「都道府県立/市立等の設置者接頭辞」と「高等学校/高校の接尾辞」の除去のみ。
 *    これ以外の表記ゆれ（旧字体・異体字等）は正規化せず、不一致のまま正直に返す。
 *  - 同一の正規化済み名称が複数の学校コードにマッチする場合（分校等）は**あいまいと
 *    判定しnullを返す**（間違った学校に紐付けるより、紐付けないほうが安全）。
 */
import type { SchoolRecord } from '@/lib/school-master';

/** 設置者接頭辞（都道府県立・市立等）。長い候補から先に試すこと（誤短縮防止）。 */
const ESTABLISHMENT_PREFIX_PATTERN = /^.+?(都立|道立|府立|県立|市立|区立|町立|村立|組合立)/;

/** 学校種別の接尾辞。長い候補から先に試すこと（'高等学校'を先に剥がさないと'高校'が残らない等の事故を防ぐ）。 */
const SCHOOL_TYPE_SUFFIX_PATTERN = /(高等学校|高校)$/;

/**
 * 学校の正式名称を突合用に正規化する（純粋関数）。
 * 例: '東京都立日比谷高等学校' → '日比谷'。設置者接頭辞・学校種別接尾辞のみを除去し、
 * それ以外の表記はそのまま保持する（過剰な正規化で誤マッチを起こさないため）。
 */
export function normalizeSchoolNameForMatch(fullName: string): string {
  let result = fullName.trim();
  result = result.replace(ESTABLISHMENT_PREFIX_PATTERN, '');
  result = result.replace(SCHOOL_TYPE_SUFFIX_PATTERN, '');
  return result.trim();
}

export interface SchoolCodeMatchResult {
  /** competition-ratesのschoolName（突合対象の短縮表記）。 */
  inputName: string;
  /** 一意に一致した場合のみ非null。あいまい・不一致はnull。 */
  matchedCode: string | null;
  /** 一致した場合の正式名称（表示・ログ用）。 */
  matchedFullName: string | null;
  /** 不一致・あいまいの理由（matchedCodeがnullの場合のみ意味を持つ）。 */
  reason: 'matched' | 'no-match' | 'ambiguous';
}

/**
 * 1つの学校名(短縮表記)を、対象都道府県の学校マスター(SchoolRecord[])と突合する。
 * 完全一致のみ採用。0件なら'no-match'、2件以上なら'ambiguous'として、
 * いずれもmatchedCode=nullで返す（誤った紐付けをしない）。
 */
export function matchSchoolNameToCode(schoolName: string, masterRecords: SchoolRecord[]): SchoolCodeMatchResult {
  const target = schoolName.trim();
  const candidates = masterRecords.filter((r) => normalizeSchoolNameForMatch(r.name) === target);

  if (candidates.length === 0) {
    return { inputName: schoolName, matchedCode: null, matchedFullName: null, reason: 'no-match' };
  }
  if (candidates.length > 1) {
    return { inputName: schoolName, matchedCode: null, matchedFullName: null, reason: 'ambiguous' };
  }
  return { inputName: schoolName, matchedCode: candidates[0].code, matchedFullName: candidates[0].name, reason: 'matched' };
}

export interface SchoolNameMatchSummary {
  results: SchoolCodeMatchResult[];
  matchedCount: number;
  noMatchCount: number;
  ambiguousCount: number;
}

/**
 * 複数の学校名(重複を含みうる。同一校が学科ごとに複数レコードを持つため)をまとめて突合する。
 * 同じschoolNameは1回だけ照合する（重複した学科レコード分を何度も突合しない）。
 */
export function matchSchoolNames(schoolNames: string[], masterRecords: SchoolRecord[]): SchoolNameMatchSummary {
  const uniqueNames = [...new Set(schoolNames.map((n) => n.trim()))];
  const results = uniqueNames.map((name) => matchSchoolNameToCode(name, masterRecords));
  return {
    results,
    matchedCount: results.filter((r) => r.reason === 'matched').length,
    noMatchCount: results.filter((r) => r.reason === 'no-match').length,
    ambiguousCount: results.filter((r) => r.reason === 'ambiguous').length,
  };
}
