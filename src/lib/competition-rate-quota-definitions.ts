/**
 * T-Y11 A-3: 「quotaフィールドが実際に何を指すか」を県ごとに明文化する手作業台帳。
 *
 * `CompetitionRateRecord.quota`は全県共通の1フィールドだが、その中身（募集人員なのか
 * 入学許可予定者数なのか）は県の資料構成によって異なり、**選ぶ基準は「その県が公表する
 * 倍率の分母と一致させること」**（推測ではなく各県ファイルのヘッダコメントに既に理由が
 * 明記されている）。この台帳は新規調査ではなく、既存の記述を1箇所に集めて構造化するだけ。
 *
 * `data-license-ledger.ts`/`competition-rate-publication-notes.ts`と同型の
 * 「デフォルトはunknown・確認できた県から埋める」設計。47県揃わなくてよい（C8 fail-closed）。
 */

export interface QuotaDefinitionEntry {
  /** そのプレフェクチャの資料でquotaに採用している列が何を指すか。 */
  quotaMeans: string;
  /** その列を採用した理由。 */
  rationale: string;
  /** どのファイルのどの記述から転記したか。 */
  evidence: string;
}

export const QUOTA_DEFINITIONS: Partial<Record<string, QuotaDefinitionEntry>> = {
  saitama: {
    quotaMeans: '入学許可予定者数(A)。募集人員の（）内の転編入学者数を差し引いた後、実際に一般選抜で競われる枠',
    rationale: '公表倍率が「志願確定者数(B)÷入学許可予定者数(A)」のため、quotaを分母のAに合わせた',
    evidence: 'saitama.tsヘッダコメント既存記載',
  },
  chiba: {
    quotaMeans: '募集人員(B)。名目定員(A)から併設型中高一貫校（千葉高・東葛飾高）の内部進学者定員を差し引いた、実際に一般選抜で競われる枠',
    rationale: '「東京都で募集人員を採用したのと同じ設計方針」と明記（東京都と揃えた）',
    evidence: 'chiba.tsヘッダコメント既存記載',
  },
  tokyo: {
    quotaMeans: '募集人員',
    rationale: 'tokyo.ts自体には明示的な定義文の一次記述が見当たらず、chiba.tsが「東京都で募集人員を採用したのと同じ設計方針」と言及している内容を出典として間接的に記録する（次にtokyo.tsへ触れる回で一次記述を探し裏取りすること）',
    evidence: 'chiba.tsヘッダコメント内の言及（tokyo.ts本体からの直接引用ではない）',
  },
};
