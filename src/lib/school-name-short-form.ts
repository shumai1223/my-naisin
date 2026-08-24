/**
 * S3-3（ops/PROPOSALS.md・BAR.md V-6）: 学校名の短縮形生成。
 *
 * 実測（BAR.md §0-6）: GSCの実クエリは短縮形（例:「一宮商業高校」）が8,326クエリ/32,528表示/
 * 1,064クリックに対し、正式名（「〜高等学校」）はわずか998クエリ/1,392表示/14クリック
 * （表示で23倍・クリックで76倍）。一方このサイトの学校ページは`schools/*.ts`（文科省学校コード
 * マスター由来のmatchedFullName）をそのままtitle/h1に使っており、短縮形は0回しか出現しない。
 *
 * この関数は正式名（例:「愛知県立旭丘高等学校」）から都道府県・市区町村立の接頭辞（〜立）を
 * 除去し、「高等学校」を「高校」へ短縮した表示用文字列（例:「旭丘高校」）を生成する。
 * 既存の校名マッチング（school-name-match.ts・school-name-aliases.ts）とは別物で、
 * あちらは「入力表記の揺れをマスターへ正規化する」ため、こちらは「マスターの正式名から
 * 検索ユーザーが実際に打つ短縮形を導出する」ためのもの。
 *
 * 高等専門学校（高専）・中等教育学校は「高等学校」という連続した4文字を含まないため、
 * `includes('高等学校')`のガードだけで自然に対象外になる（誤短縮を防ぐ設計）。
 */

// 都道府県立/市区町村立/組合立などの接頭辞（末尾が「立」で終わる8文字以内のプレフィックス）。
const OWNERSHIP_PREFIX = /^[^立]{1,8}立/;

/**
 * 正式な学校名から短縮形を導出する。「高等学校」を含まない名称（高専・中等教育学校・
 * 判定不能なもの）や、短縮の結果が元と変わらない場合はnullを返す（誤った短縮形の掲載を防ぐ）。
 */
export function shortenSchoolName(fullName: string): string | null {
  if (!fullName.includes('高等学校')) return null;

  const withoutPrefix = fullName.replace(OWNERSHIP_PREFIX, '');
  const base = withoutPrefix.includes('高等学校') ? withoutPrefix : fullName;
  const short = base.replace('高等学校', '高校');

  if (short === fullName || short.length === 0) return null;
  return short;
}
