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
import { PREFECTURES } from '@/lib/prefectures';

/** 市区町村立の接頭辞（設置者名は都道府県名リストで判定できないため、従来どおり総称パターンで除去）。 */
const MUNICIPAL_PREFIX_PATTERN = /^.+?(市立|区立|町立|村立|組合立)/;

/**
 * 都道府県名（例:'東京都'・'京都府'・'宮城県'）を長い順に並べたもの。
 * 接頭辞除去で「都道府県フルネームの完全一致」だけを候補にするために使う（下記参照）。
 */
const PREFECTURE_NAMES_BY_LENGTH_DESC = [...new Set(PREFECTURES.map((p) => p.name))].sort((a, b) => b.length - a.length);

/**
 * 設置者接頭辞（都道府県立・市立等）を除去する。
 * **2026-08-02判明・修正**: school-master(Y-1・MEXT学校コード一覧)の正式名称は、都道府県によって
 * 「宮城県仙台第二高等学校」「北海道札幌西高等学校」のように**「立」を伴わない**表記を採用する
 * ケースがある（miyagi/nagano/hokkaidoで実データ確認）。当初は正規表現に裸の`都|道|府|県`を
 * 1文字フォールバックとして追加したが、**「京都府」のように都道府県名の内部に別の都道府県型
 * 文字を含むケース（「京都」の"都"）で、"府立"に到達する前に"都"だけで誤って短く一致してしまい
 * kyotoの正規化が全滅する事故を引き起こした**（match率87%→0%）。安全な修正は、正規表現の
 * 文字クラスではなく、**実在する47都道府県名の完全一致リスト**（長い順）を先頭から順に試すこと
 * （「京都府」は「京都府」自体が47都道府県名の1つとしてリストにあるため、部分的な"都"に
 * 惑わされず正しく1つの単位として一致する）。
 *
 * 都道府県立の学校は「除去した1形だけ」が正解だが、市区町村立の学校は**3つの流儀が実在する**
 * （2026-08-02判明・2回に分けて発見）:
 *  ①除去する流儀（kyoto市立紫野高等学校→'紫野'）
 *  ②市名＋市立を残す流儀（hiroshima市立基町高等学校→'広島市立基町'）
 *  ③市名を省き「市立」だけ残す流儀（niigata新潟市立万代高等学校→'市立万代'・aichi名古屋市立向陽
 *    高等学校→'市立向陽'。県内の市立高校がほぼ単一市に集中している県で、文脈上市名が自明なため
 *    省略されると見られる）
 * どの流儀かはcompetition-ratesのPDF側の慣習に依存し県ごとに異なるため、正規化を1形に決め打ちせず
 * **3つの候補すべて**を返し、突合側でいずれか一致すれば採用する（あいまい一致ではなく「複数の
 * 確定候補のいずれかへの完全一致」であることに注意）。
 *
 * **2026-08-29判明・修正（T-S1残り19件の根本原因）**: ①除去形は、市名を含む同一地名の県立校
 * （例:'千葉県立千葉高等学校'）が実在する場合、その県立校自身の正規化形（'千葉'）と文字列として
 * 完全一致してしまう。競争率データ側は市立校を①のような短縮形では実際には一度も表記しない
 * （常に②か③相当のフルネーム/「市立」付きで区別している。chiba/hyogo/gunma/saitama/hiroshima/
 * kanagawa/ishikawa/nagano/gifu/wakayamaの19件で実データ確認済み）ため、①はあくまで「他の候補で
 * 一致しなかった場合の弱い候補（weak）」として扱い、②③相当の「確定候補（strong）」より優先度を
 * 下げる。①自体はkyoto市立紫野等で実際に必要な表記（他候補が無く①でしか一致しない）なので削除は
 * せず、strong 0件の時のみ weak を試すフォールバック方式にする（呼び出し側のmatchSchoolNameToCode参照）。
 */
function stripEstablishmentPrefixVariants(fullName: string): { strong: string[]; weak: string[] } {
  for (const prefName of PREFECTURE_NAMES_BY_LENGTH_DESC) {
    if (fullName.startsWith(prefName + '立')) return { strong: [fullName.slice(prefName.length + 1)], weak: [] };
  }
  for (const prefName of PREFECTURE_NAMES_BY_LENGTH_DESC) {
    if (fullName.startsWith(prefName)) return { strong: [fullName.slice(prefName.length)], weak: [] };
  }
  const municipalMatch = fullName.match(MUNICIPAL_PREFIX_PATTERN);
  if (municipalMatch) {
    const establisherType = municipalMatch[1]; // '市立'|'区立'|'町立'|'村立'|'組合立'
    return {
      strong: [
        fullName, // ②市名+市立を残す
        establisherType + fullName.slice(municipalMatch[0].length), // ③市名を省き「市立」だけ残す
      ],
      weak: [fullName.slice(municipalMatch[0].length)], // ①除去（同名県立校と衝突しうる弱い候補）
    };
  }
  return { strong: [fullName], weak: [] };
}

/**
 * 学校種別トークン。長い候補から先に試すこと（'高等学校'を先に剥がさないと'高校'が残らない等の事故を防ぐ）。
 * **2026-08-02判明**: 分校（例:'長野県篠ノ井高等学校犀峡校'）は「高等学校」が末尾ではなく
 * 本校名と分校名の**間**に埋め込まれる（本校名+高等学校+分校名、例:'篠ノ井'+'高等学校'+'犀峡校'）。
 * competition-ratesの短縮表記側は分校名を残したまま「高等学校」だけを省く（例:'篠ノ井犀峡校'）ため、
 * 末尾アンカー($)の除去だけでは分校が一律no-matchになっていた（nagano実データで2件確認）。
 * 「高等学校」「高校」という4-2文字のトークンは学校の正式名称の他の部分に偶然出現することは
 * 現実的に無い（設置者種別を表す固定語のため）ので、**出現位置を問わず全て**除去する。
 */
const SCHOOL_TYPE_TOKEN_PATTERN = /(高等学校|高校)/g;

/** 本校名と分校・校舎・学舎名を分離する正規表現（'高等学校'/'高校'の直後が分校名の開始位置）。 */
const SCHOOL_TYPE_TOKEN_SPLIT_PATTERN = /^(.+?)(高等学校|高校)(.*)$/;

/** 分校・校舎・学舎の呼称につく末尾の型トークン（短縮形の生成に使う）。 */
const BRANCH_LABEL_TRAILING_PATTERN = /(分校|学舎|校舎|校)$/;

/**
 * 分校・校舎の全角/半角括弧表記（2026-08-02判明）に対応した追加候補を返す（純粋関数）。
 * competition-ratesの分校表記はY-1(school-master)の正式名称と別の慣習を使う県が複数ある:
 *  - mie/kyoto: '本校名（分校・校舎の正式suffix）'（例:'南伊勢（度会校舎）'←'南伊勢高等学校　度会校舎'）
 *  - ehime/kyoto: '本校名（分校名のみ・「分校」を省略）'（例:'松山南（砥部）'←'…砥部分校'）
 *  - ehime: 分校が無い本校側は'本校名（本校）'という対の表記を使う（例:'松山南（本校）'）
 *  - kochi/yamaguchi: 本校名を省き分校名（'分校'を含む/含まない両方）のみで表記
 *    （例:'吾北'←'高知追手前高等学校吾北分校'・'坂上分校'←'岩国高等学校坂上分校'）
 *  - tokushima: '本校名・分校名（"校"を省略した短縮形）'（例:'富岡東・羽ノ浦'←'…羽ノ浦校'）
 * いずれも本校名・分校名の対応関係はY-1側の正式名称から一意に読み取れる表記ゆれであり、
 * 異なる学校を誤って同一視するリスクは無い（あいまい一致にはならず、単に候補が増えるだけ）。
 */
function campusNotationVariants(nameAfterPrefixStrip: string): string[] {
  const match = nameAfterPrefixStrip.match(SCHOOL_TYPE_TOKEN_SPLIT_PATTERN);
  if (!match) return [];
  const base = match[1];
  const suffix = match[3].trim();
  if (suffix.length === 0) {
    return [`${base}（本校）`, `${base}(本校)`];
  }
  const variants = [`${base}（${suffix}）`, `${base}(${suffix})`, suffix];
  const shortSuffix = suffix.replace(BRANCH_LABEL_TRAILING_PATTERN, '');
  if (shortSuffix.length > 0 && shortSuffix !== suffix) {
    variants.push(`${base}（${shortSuffix}）`, `${base}(${shortSuffix})`, `${base}・${shortSuffix}`, shortSuffix);
  }
  return variants;
}

/**
 * 学校の正式名称から、突合対象になりうる正規化候補を strong（確定候補）/ weak（同名の県立校と
 * 衝突しうる弱い候補=①除去形のみ）に分けて返す（純粋関数）。都道府県立はstrongのみ。
 * 市区町村立は②③相当がstrong、①除去形がweak。分校・校舎を持つ学校はさらに
 * campusNotationVariantsで括弧・中点表記の候補も加える（元のstrong/weakの区分を維持）。
 */
function candidateNormalizedNames(fullName: string): { strong: string[]; weak: string[] } {
  const trimmed = fullName.trim();
  const { strong: strongBase, weak: weakBase } = stripEstablishmentPrefixVariants(trimmed);
  const stripType = (v: string) => v.replace(SCHOOL_TYPE_TOKEN_PATTERN, '').trim();
  const strong = [...new Set([...strongBase.map(stripType), ...strongBase.flatMap((v) => campusNotationVariants(v))])];
  const weak = [...new Set([...weakBase.map(stripType), ...weakBase.flatMap((v) => campusNotationVariants(v))])];
  return { strong, weak };
}

/**
 * 学校の正式名称を突合用に正規化する（純粋関数）。
 * 例: '東京都立日比谷高等学校' → '日比谷'。設置者接頭辞・学校種別トークンのみを除去し、
 * それ以外の表記はそのまま保持する（過剰な正規化で誤マッチを起こさないため）。
 * 市区町村立の場合は①除去形（weak・従来の先頭候補と同じ表示形）を返す。両方を試したい場合は
 * matchSchoolNameToCode/matchSchoolNamesを使うこと（内部でcandidateNormalizedNamesを使う）。
 */
export function normalizeSchoolNameForMatch(fullName: string): string {
  const { strong, weak } = candidateNormalizedNames(fullName);
  return weak[0] ?? strong[0];
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
 *
 * **2026-08-29判明・修正**: まずstrong候補（確定候補）のみで突合する。strongで1件に確定すれば
 * それを採用（同名の県立校と市立校の①除去形が衝突するケースでも、strong側は県立校しか
 * ヒットしないため安全に確定できる）。strongで0件の場合のみweak候補（①除去形）にフォールバック
 * する（kyoto市立紫野等、①でしか一致しない実在の表記を壊さないため）。strong側で複数一致・
 * weak側で複数一致した場合はいずれもambiguousのまま（誤った紐付けをしない設計は維持）。
 */
export function matchSchoolNameToCode(schoolName: string, masterRecords: SchoolRecord[]): SchoolCodeMatchResult {
  const target = schoolName.trim();
  const withCandidates = masterRecords.map((r) => ({ r, c: candidateNormalizedNames(r.name) }));

  const strongMatches = withCandidates.filter(({ c }) => c.strong.includes(target));
  if (strongMatches.length === 1) {
    const m = strongMatches[0].r;
    return { inputName: schoolName, matchedCode: m.code, matchedFullName: m.name, reason: 'matched' };
  }
  if (strongMatches.length > 1) {
    return { inputName: schoolName, matchedCode: null, matchedFullName: null, reason: 'ambiguous' };
  }

  const weakMatches = withCandidates.filter(({ c }) => c.weak.includes(target));
  if (weakMatches.length === 0) {
    return { inputName: schoolName, matchedCode: null, matchedFullName: null, reason: 'no-match' };
  }
  if (weakMatches.length > 1) {
    return { inputName: schoolName, matchedCode: null, matchedFullName: null, reason: 'ambiguous' };
  }
  const m = weakMatches[0].r;
  return { inputName: schoolName, matchedCode: m.code, matchedFullName: m.name, reason: 'matched' };
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
