/**
 * T-Y11B 段階2: 取り込みパーサのハイブリッド設計の第一歩（テキスト抽出品質の自動判定）。
 *
 * 着手前ゲート（`ops/tasks/T-Y11B-bairitsu-ingest-parsers.md`・2026-09-01実施）で、
 * ibaraki/nagano/kagoshimaの8県年を検証した結果、**8県年中6県年（75%）で`pdftotext`が
 * 日本語ラベル（学校名・学科名）を空欄のまま返す**（数値は抽出できる）という現象が判明した。
 * これは県ごと・年度ごとに不規則に発生し事前予測できないため、単純な正規表現パーサを
 * 前提にできない。
 *
 * このモジュールは「pdftotextの生出力を機械的に検査し、ビジョン解析へのフォールバックが
 * 必要かを判定する」という、ハイブリッド設計の最初の分岐点だけを純粋関数として切り出す。
 * PDF取得・pdftotext実行・pdftoppm+ビジョン解析そのものはこのモジュールのスコープ外
 * （I/Oを含まない・段階2の残りの作業として別途つなぎ込む）。
 */

export type TextExtractionQuality = 'usable' | 'needs-vision-fallback' | 'inconclusive';

export interface TextExtractionAssessment {
  quality: TextExtractionQuality;
  reason: string;
  /** 参考値: 全角文字（CJK統合漢字・ひらがな・カタカナ）の出現数。 */
  cjkCharCount: number;
  /** 参考値: 連続する数字列（3桁以上＝募集人員等の数値列とみなせる長さ）の出現数。 */
  numericRunCount: number;
}

/** CJK統合漢字・ひらがな・カタカナの範囲（学校名・学科名に使われる文字種）。 */
const CJK_RE = /[一-鿿぀-ゟ゠-ヿ]/g;
/** 3桁以上の連続する数字（募集人員・志願者数等、実際のデータ値として現実的な桁数）。 */
const NUMERIC_RUN_RE = /\d{3,}/g;

/**
 * pdftotext（または同等のテキスト層抽出）の生出力を評価する。
 *
 * 判定ロジック（掛-1/Y-6の実データで繰り返し観測されたパターンに基づく）:
 * - 数値列は複数あるのにCJK文字がほぼ無い →「数値のみ抽出可（学校名・学科名は空欄）」という
 *   ToUnicodeマッピング欠落の既知パターンと一致 → `needs-vision-fallback`
 * - 数値列・CJK文字ともに一定量ある → 学校名と数値が両方読めている可能性が高い → `usable`
 *   （最終判定は呼び出し側が既知の学校数・grand totalとの整合で行う。ここでは「読めていそう」まで）
 * - 数値列すらほとんど無い → 取得失敗・空ページ等の別の問題の可能性が高く、この関数の対象外
 *   → `inconclusive`（ビジョン解析の要否を機械的に判断できない。人間/AIが個別に確認する）
 */
export function assessPdfTextExtraction(rawText: string): TextExtractionAssessment {
  const cjkMatches = rawText.match(CJK_RE) ?? [];
  const numericMatches = rawText.match(NUMERIC_RUN_RE) ?? [];
  const cjkCharCount = cjkMatches.length;
  const numericRunCount = numericMatches.length;

  if (numericRunCount < 5) {
    return {
      quality: 'inconclusive',
      reason: `数値列が${numericRunCount}件しかなく、PDF取得自体の失敗や空ページの可能性がある（テキスト抽出品質の問題ではない）`,
      cjkCharCount,
      numericRunCount,
    };
  }

  // 学校名・学科名がまともに載っていれば、レコード数（=numericRunCountの数分の一程度）に対し
  // 相応のCJK文字数があるはず。実データ（gunma/okayama/tochigi/ibaraki-R8等の成功例）では
  // 1レコードあたり学校名+学科名で最低でも数文字のCJKがあり、numericRunCountの1/3を下回ることは
  // 無かった。閾値は既知の失敗パターン（CJK文字が実質0件）と成功パターンを明確に分離できる
  // よう安全側（低め）に設定した。
  const cjkRatio = cjkCharCount / numericRunCount;
  if (cjkRatio < 0.3) {
    return {
      quality: 'needs-vision-fallback',
      reason: `数値列${numericRunCount}件に対しCJK文字が${cjkCharCount}件と少なく、ibaraki/nagano/kagoshima等のR7で` +
        '実際に観測された「ToUnicodeマッピング欠落で学校名・学科名が空欄」パターンと一致する',
      cjkCharCount,
      numericRunCount,
    };
  }

  return {
    quality: 'usable',
    reason: `数値列${numericRunCount}件に対しCJK文字${cjkCharCount}件と十分にあり、学校名・学科名が読めている可能性が高い（最終確認はgrand total突合で行うこと）`,
    cjkCharCount,
    numericRunCount,
  };
}
