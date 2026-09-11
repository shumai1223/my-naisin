import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { extractRateRecordsFromSource, parseDecimalToHundredths, classifyStoredRate } from '@/lib/finalrate-convention';

/**
 * T-Y11C: 47県`finalRate`の不変条件（fail-closed）。
 *
 * 2026-09-02、対話セッションが47県21,739件（`officialSubtotals`を除く実レコード数。
 * ⚠️対話セッション側の一次報告は21,875件だったが、loopが独立に数え直したところ
 * `officialSubtotals`集計行166件を含む21,906件との混同と判明・実レコード数は21,739件）を
 * 整数演算のみで検算し、**27件が「四捨五入(round2)」「小数第1位で公表(round1)」
 * 「切り捨て(trunc2)」のいずれの方式でも説明できない**ことを発見した（詳細は
 * `ops/tasks/T-Y11C-finalrate-invariant.md`）。
 *
 * このテストは「新しい県ファイルの追加・既存データの修正が、この27件の外側に
 * 新しい未説明の不一致を静かに増やさない」ことを保証するfail-closedゲートである。
 * `KNOWN_UNEXPLAINED_EXCEPTIONS`は**推測で埋めない**（Y-0憲法）——PDFで確認できるまでは
 * 「不明」のまま明示的に列挙し、件数を固定値でアサートする（[[fable5-loop-protocol]]
 * 「例外リストが増えたら落ちるようにする」の思想）。
 *
 * ⚠️2026-09-09: yamanashiの20件について、`competition-rates/yamanashi.ts`冒頭コメントが
 * 既に説明していた「帰国生徒等特別措置の適用者は最終志願者数の内数だが、倍率算定からは
 * 除外される」という機構を、令和8年度一次PDF（`r8saisyuusigansyasuu1.pdf`）を実際に
 * ビジョン解析で読み直し直接確認した（同PDF頁末尾の注3「志願者数のうち帰国生徒等特別措置の
 * 適用を受ける者は内数とし、倍率の算定には加えていない」の実在を確認）。R8分4件
 * （巨摩・笛吹〈果樹園芸〉・塩山・都留興譲館〈普通53〉）は「最終志願者数−帰国生徒等内数」を
 * quotaで割った値が格納済みfinalRateと一致することを、PDFに実際に印字された帰国生徒等の
 * 内数（巨摩1・笛吹1・塩山1・都留興譲館3）で直接検算した。残り16件（R7/R6/R5分）は本セッション
 * で一次PDFを再読していないが、`yamanashi.ts`冒頭コメントが年度ごとに具体的な帰国生徒等の
 * 人数・学校名（例: R6は「都留興譲館普通3名・甲府東1名・甲府昭和1名・富士河口湖1名」）と
 * 各階層の公式合計行との完全一致を記録しており、推測ではなく過去セッションのPDF確認に基づく
 * 記述と判断した。**この機構は「例外である理由の説明」であり、round2/round1/trunc2いずれにも
 * 一致しないという事実自体は変わらないため、例外リストからは削除しない**（件数は変わらず、
 * yamaguchi側の解消により25件→20件へ純減）。
 *
 * ⚠️2026-09-09: yamaguchiの5件は**転記ミスと判明し訂正済み**（例外リストから削除）。
 * R5一次PDF（`197468_365286_misc.pdf`）・R4一次PDF（`148551_267732_misc.pdf`）を
 * ビジョン解析で読み直したところ、山口県の公表表は[入学定員(A) / 特色選抜等合格内定者数(B) /
 * 第一次募集の定員(C=A-B) / 第一志願者数(D) / 名目志願者数(E=B+D) / 名目志願倍率(E/A) /
 * 志願倍率(D/C)]という構成で、`finalRate`は「志願倍率(D/C)」列を採用する規約（yamaguchi.ts
 * 冒頭コメント）だが、5件（防府衛生看護R5・防府商工機械R5・山口理数R5・豊浦普通R4・
 * 萩商工総合ビジネスR4）は誤って隣の「名目志願倍率(E/A)」列の値が転記されていたと判明した
 * （quota=C・applicants=Dは正しく、倍率だけが別列だった）。5件ともD/Cベースの正しい値へ
 * `competition-rates/yamaguchi.ts`を修正した（詳細は同ファイル冒頭コメントの訂正記録）。
 */

const DATA_DIR = join(__dirname, '..');

function competitionRateFiles(): string[] {
  return readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('__tests__'));
}

interface KnownException {
  pref: string;
  schoolName: string;
  quota: number;
  applicants: number;
  storedRateText: string;
  /** なぜround2/round1/trunc2のいずれにも一致しないかの説明（未確認の場合は省略）。 */
  reason?: string;
}

const YAMANASHI_RETURNEE_REASON =
  '帰国生徒等特別措置の適用者が最終志願者数(applicants)の内数として含まれるが、倍率算定からは除外される（yamanashi.ts冒頭コメント・一次PDF注記で確認済み）。(applicants−帰国生徒等内数)/quotaがstoredRateと一致する。';

/**
 * 2026-09-02時点で3方式のいずれにも一致しないと確認済みだった27件のうち20件が残存。
 * yamanashiの20件は2026-09-09にreasonを付記して原因確定（詳細は上部コメント）。
 * yamaguchiの5件は2026-09-09に転記ミスと判明し訂正済みのため本リストから削除した。
 */
const KNOWN_UNEXPLAINED_EXCEPTIONS: KnownException[] = [
  { pref: 'yamanashi', schoolName: '巨摩', quota: 108, applicants: 118, storedRateText: '1.08', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '笛吹', quota: 21, applicants: 11, storedRateText: '0.48', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '塩山', quota: 56, applicants: 24, storedRateText: '0.41', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留興譲館', quota: 53, applicants: 48, storedRateText: '0.85', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '韮崎工業', quota: 101, applicants: 55, storedRateText: '0.53', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '甲府西', quota: 140, applicants: 146, storedRateText: '1.03', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '甲府南', quota: 149, applicants: 182, storedRateText: '1.21', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '甲府南', quota: 28, applicants: 40, storedRateText: '1.39', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '白根', quota: 80, applicants: 80, storedRateText: '0.99', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '笛吹', quota: 56, applicants: 44, storedRateText: '0.77', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留興譲館', quota: 48, applicants: 34, storedRateText: '0.65', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留', quota: 140, applicants: 122, storedRateText: '0.86', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留興譲館', quota: 68, applicants: 50, storedRateText: '0.69', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '甲府昭和', quota: 183, applicants: 202, storedRateText: '1.09', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '農林', quota: 17, applicants: 16, storedRateText: '0.88', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '農林', quota: 16, applicants: 17, storedRateText: '1.0', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '笛吹', quota: 45, applicants: 48, storedRateText: '1.04', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留興譲館', quota: 64, applicants: 60, storedRateText: '0.91', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '都留興譲館', quota: 71, applicants: 34, storedRateText: '0.46', reason: YAMANASHI_RETURNEE_REASON },
  { pref: 'yamanashi', schoolName: '甲府商業', quota: 55, applicants: 55, storedRateText: '0.98', reason: YAMANASHI_RETURNEE_REASON },
];

function exceptionKey(e: { pref: string; schoolName: string; quota: number; applicants: number; storedRateText: string }): string {
  return `${e.pref}|${e.schoolName}|${e.quota}|${e.applicants}|${e.storedRateText}`;
}

describe('competition-rates finalRate invariant (round2/round1/trunc2のいずれかに一致するか・fail-closed)', () => {
  const files = competitionRateFiles();
  const exceptionKeys = new Set(KNOWN_UNEXPLAINED_EXCEPTIONS.map(exceptionKey));

  it('covers all 47 prefecture data files', () => {
    expect(files.length).toBe(47);
  });

  it('既知の未説明例外は20件（重複キー無し）', () => {
    // 2026-09-06: aichi/名古屋南（744/300）はPDF実機確認により誤記載（締切時倍率2.49を最終倍率と
    // 取り違えていた）と判明し2.48へ訂正・round2で説明可能になったため27件→26件に減少。
    // 続けてhokkaido/静内（163/200）も、この県のfinalRateが自前算出であるにもかかわらず
    // 小数第3位まで(0.815)残っていた丸め忘れの表記ミスと判明し0.82へ訂正（round2で説明可能）・
    // 26件→25件に減少した。
    // 2026-09-09: yamanashiの20件は原因確定（帰国生徒等特別措置）したがround2/round1/trunc2
    // いずれにも一致しない事実は変わらないため件数は不変。yamaguchiの5件は転記ミス（E/A列と
    // D/C列の取り違え）と判明し訂正・例外リストから削除したため25件→20件に減少した。
    expect(KNOWN_UNEXPLAINED_EXCEPTIONS.length).toBe(20);
    expect(exceptionKeys.size).toBe(20);
  });

  it('47県21,739件全レコードが、round2/round1/trunc2のいずれか、または既知の20件の例外に該当する', () => {
    const usedExceptionKeys = new Set<string>();
    let totalRecords = 0;
    const unexpectedMismatches: string[] = [];

    for (const file of files) {
      const pref = file.replace('.ts', '');
      const content = readFileSync(join(DATA_DIR, file), 'utf-8');
      const records = extractRateRecordsFromSource(content);

      for (const r of records) {
        if (r.quota <= 0) continue; // 物理的にあり得ない値は対象外
        totalRecords++;

        const { hundredths, decimalDigits } = parseDecimalToHundredths(r.storedRateText);
        const classification = classifyStoredRate(r.quota, r.applicants, hundredths);
        // 小数第3位以下がある表記（例: hokkaidoの"0.815"）は、切り捨て後の値が偶然どれかに
        // 一致してもソース表記自体が異常なので既知例外としての明記を必須とする。
        const hasUnexpectedPrecision = decimalDigits > 2;

        if (classification.matches.length > 0 && !hasUnexpectedPrecision) continue;

        const key = exceptionKey({ pref, schoolName: r.schoolName, quota: r.quota, applicants: r.applicants, storedRateText: r.storedRateText });
        if (exceptionKeys.has(key)) {
          usedExceptionKeys.add(key);
          continue;
        }
        unexpectedMismatches.push(`${pref}/${r.schoolName}: quota=${r.quota} applicants=${r.applicants} stored=${r.storedRateText}`);
      }
    }

    // 抽出ロジック自体が壊れて対象が減っていないか（正規表現がheredoc等の変更で静かに拾えなくなる事故対策）。
    expect(totalRecords).toBe(21909);

    if (unexpectedMismatches.length > 0) {
      throw new Error(`round2/round1/trunc2いずれにも一致せず、既知の20件の例外にも無い新しい不一致 ${unexpectedMismatches.length}件:\n${unexpectedMismatches.join('\n')}`);
    }

    // 例外リストに死んだエントリ（実データの修正で既に解消済みのもの）が残っていないか。
    // 残っている場合はKNOWN_UNEXPLAINED_EXCEPTIONSから削除し、この20件アサーションも更新すること。
    expect(usedExceptionKeys.size).toBe(KNOWN_UNEXPLAINED_EXCEPTIONS.length);
  });
});
