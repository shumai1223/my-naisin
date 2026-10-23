/**
 * T-PV2 A-3: 新年度（令和9年度）の倍率を取り込む前の「1コマンド検算」の純関数群。
 *
 * 予行（ops/baselines/t-pv2-rehearsal-2026-10-23.md）で、既存の検算（validate-parsed-records）は
 * 基準を「現行ファイル＝前年度」から読むため、新年度のPDFでは正しいデータでも必ずNGになると分かった（F1）。
 * ここでは基準を「新しいPDF本文の合計行」に置き換える。
 *
 * 4つの確認（どれか1つでも落ちたら ok:false。fail-closed）:
 *   1. total-line      機械集計（募集人員・志願者数）の2数値が、PDF本文の「合計」「総計」を含む同じ行に現れる
 *   2. refused         掲載を断られた県ではない（isPublicationRefused）
 *   3. pack-license    新年度の納品ファイルがある県は、有償提供の許諾済み県（PACK_SALES_APPROVED）だけ
 *   4. title-year      データを載せていない県の公開面に「令和9年度」の語を書いていない
 * 前年件数との乖離は警告のみ（学校の統廃合で正当に変わるため、NGにはしない）。
 */

export interface VerifySums {
  quota: number;
  finalApplicants: number;
}

export interface TotalLineMatch {
  line: string;
  lineNo: number;
}

/** 行内の整数（カンマ区切り可）を取り出す。小数（倍率など）は対象外。 */
function integersIn(line: string): number[] {
  const out: number[] = [];
  const re = /(?<![\d.])(\d{1,3}(?:,\d{3})+|\d+)(?![\d]|\.\d)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) out.push(Number(m[1].replace(/,/g, '')));
  return out;
}

/**
 * PDF本文（pdftotext -layout の出力）から、機械集計の2数値が同じ行に現れる「合計」行を探す。
 * 行のラベルは「合計」「総計」を含むものに限る（学校別の「計」行との偶然の一致を避ける）。
 * 全角スペース・全角数字は半角に直してから見る。
 */
export function findTotalLineMatch(pdfText: string, sums: VerifySums): TotalLineMatch | null {
  const lines = pdfText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const normalized = lines[i]
      .replace(/[０-９，]/g, (c) => (c === '，' ? ',' : String.fromCharCode(c.charCodeAt(0) - 0xfee0)))
      .replace(/　/g, ' ');
    if (!/合\s*計|総\s*計/.test(normalized)) continue;
    const nums = integersIn(normalized);
    if (nums.includes(sums.quota) && nums.includes(sums.finalApplicants)) {
      return { line: lines[i].trim().replace(/\s+/g, ' '), lineNo: i + 1 };
    }
  }
  return null;
}

export function sumRows(rows: ReadonlyArray<VerifySums>): VerifySums {
  return rows.reduce(
    (acc, r) => ({ quota: acc.quota + r.quota, finalApplicants: acc.finalApplicants + r.finalApplicants }),
    { quota: 0, finalApplicants: 0 }
  );
}

/** 納品ファイル名 `R9-<県>-<kakutei|sokuho>-<日付>.csv` から県コードを取り出す（該当しなければnull）。 */
export function prefectureOfDeliveryFile(fileName: string, yearPrefix: string): string | null {
  const m = fileName.match(new RegExp(`^${yearPrefix}-([a-z]+)-(?:kakutei|sokuho)-.*\\.(?:csv|json|txt)$`));
  return m ? m[1] : null;
}

export interface VerifyCheck {
  name: 'total-line' | 'refused' | 'pack-license' | 'title-year' | 'rate-convention';
  ok: boolean;
  detail: string;
}

export interface VerifyNewYearInput {
  prefectureCode: string;
  rows: ReadonlyArray<VerifySums & { finalRate: number; schoolName: string; department: string }>;
  pdfText: string;
  isRefused: (code: string) => boolean;
  /** 新年度の納品ファイル名の一覧（ops/deliverables/nendomatsu-pack-deliveries）。 */
  deliveryFileNames: string[];
  deliveryYearPrefix: string; // 例 'R9'
  packSalesApproved: ReadonlySet<string>;
  /** 公開面（src/app/pref・school-page系lib）に「令和9年度」を書いているファイル（許可リスト除外後）。 */
  filesWithNewYearLabel: string[];
  /** 新年度のデータを公開面に載せている県（オーバーレイ登録済み）。title-yearの判定に使う。 */
  prefecturesWithNewYearData: ReadonlySet<string>;
  /** finalRateを3方式で説明できない行（validateParsedRecordsのfinalrate-convention）。空なら合格。 */
  rateConventionIssue: string | null;
  previousRecordCount?: number;
}

export interface VerifyNewYearResult {
  ok: boolean;
  checks: VerifyCheck[];
  warnings: string[];
  sums: VerifySums;
  matchedLine: TotalLineMatch | null;
}

export function verifyNewYear(input: VerifyNewYearInput): VerifyNewYearResult {
  const sums = sumRows(input.rows);
  const matchedLine = input.rows.length > 0 ? findTotalLineMatch(input.pdfText, sums) : null;
  const checks: VerifyCheck[] = [];

  checks.push({
    name: 'total-line',
    ok: matchedLine !== null,
    detail:
      input.rows.length === 0
        ? 'パース結果が0件'
        : matchedLine
          ? `機械集計(募集${sums.quota}/志願${sums.finalApplicants})が資料${matchedLine.lineNo}行目に一致: ${matchedLine.line}`
          : `機械集計(募集${sums.quota}/志願${sums.finalApplicants})を同時に含む「合計」行が資料に無い`,
  });

  checks.push({
    name: 'rate-convention',
    ok: input.rateConventionIssue === null,
    detail: input.rateConventionIssue ?? '全行のfinalRateが既知の3方式(round2/round1/trunc2)で説明できる',
  });

  const refused = input.isRefused(input.prefectureCode);
  checks.push({
    name: 'refused',
    ok: !refused,
    detail: refused ? `${input.prefectureCode}は掲載を断られた県（公開面・出力に出さない）` : `${input.prefectureCode}は掲載拒否県ではない`,
  });

  const deliveredPrefs = new Set<string>();
  for (const f of input.deliveryFileNames) {
    const p = prefectureOfDeliveryFile(f, input.deliveryYearPrefix);
    if (p) deliveredPrefs.add(p);
  }
  const unlicensed = [...deliveredPrefs].filter((p) => !input.packSalesApproved.has(p) || input.isRefused(p));
  checks.push({
    name: 'pack-license',
    ok: unlicensed.length === 0,
    detail:
      unlicensed.length === 0
        ? `新年度の納品ファイル${deliveredPrefs.size}県分は全て有償提供の許諾済み県`
        : `許諾のない県の納品ファイルがある: ${unlicensed.join(', ')}`,
  });

  // 公開面に「令和9年度」を書いてよいのは、データを載せた県の経路だけ。
  // 現時点では県単位で出し分ける実装が無いので、書いているファイルが1つでもあり、かつこの県が未登録なら落とす。
  const titleOk = input.filesWithNewYearLabel.length === 0 || input.prefecturesWithNewYearData.has(input.prefectureCode);
  checks.push({
    name: 'title-year',
    ok: titleOk,
    detail: titleOk
      ? input.filesWithNewYearLabel.length === 0
        ? '公開面（県ページ・学校ページ系）に「令和9年度」の記述なし'
        : `${input.prefectureCode}は新年度データ登録済み`
      : `新年度データ未登録の県に「令和9年度」が出うる記述: ${input.filesWithNewYearLabel.join(', ')}`,
  });

  const warnings: string[] = [];
  if (input.previousRecordCount !== undefined && input.previousRecordCount > 0) {
    const ratio = Math.abs(input.rows.length - input.previousRecordCount) / input.previousRecordCount;
    if (ratio > 0.1) {
      warnings.push(
        `件数が前年から${Math.round(ratio * 100)}%変動（前年${input.previousRecordCount}件→今年${input.rows.length}件）。学校再編か、定時制ページの混入・抽出漏れを確認`
      );
    }
  }

  return { ok: checks.every((c) => c.ok), checks, warnings, sums, matchedLine };
}
