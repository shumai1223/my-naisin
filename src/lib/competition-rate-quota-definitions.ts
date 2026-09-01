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
  aichi: {
    quotaMeans: '一般選抜等募集人員',
    rationale: '公表倍率（最終倍率）の分母が募集人員のため、quotaをこれに合わせた',
    evidence: 'aichi.tsヘッダコメント既存記載（列は[募集人員(=quota) / 第1志望者数 / 第2志望者数 / 志願者総数 / 最終倍率]）',
  },
  akita: {
    quotaMeans: '募集定員',
    rationale: '特色選抜募集人員・一般選抜募集人員の内訳を含む「募集定員」列を公表倍率の分母として採用',
    evidence: 'akita.tsヘッダコメント既存記載',
  },
  aomori: {
    quotaMeans: '入学者選抜募集人員（附属中等からの内部進学者等を控除した実質枠）',
    rationale: '入学者募集人員そのものではなく、実際に一般選抜で競われる枠を分母に合わせた',
    evidence: 'aomori.tsヘッダコメント既存記載',
  },
  ehime: {
    quotaMeans: '定員(A)。入学志願者数(B)には特色入学確約者数が既に含まれる',
    rationale: '公表倍率(B/A)の分母がAのため',
    evidence: 'ehime.tsヘッダコメント既存記載（列は[定員(A) / 入学志願者数(B) / 特色（内数） / 倍率(B/A)]）',
  },
  fukui: {
    quotaMeans: '一般選抜募集人員(C=A-B)。入学定員(A)から推薦・特色等合格者数(B)を差し引いた実質枠',
    rationale: '公表倍率の分母がCのため',
    evidence: 'fukui.tsヘッダコメント既存記載',
  },
  fukuoka: {
    quotaMeans: '募集人員の「全体」列（特色化上限目安・推薦程度の内訳を含む総枠）',
    rationale: '「一般」列は特色化・推薦内定者を除いた残席で定義が異なり不採用。「全体」列を分母とする公表倍率と一致',
    evidence: 'fukuoka.tsヘッダコメント既存記載（育伸社県全体版PDF）',
  },
  fukushima: {
    quotaMeans: '後期選抜募集定員（＝募集定員－前期選抜内定者数。資料に直接印字済み）',
    rationale: '前期選抜控除後の実質枠が資料上そのままquota列として印字されているため、逆算不要でそのまま採用',
    evidence: 'fukushima.tsヘッダコメント既存記載',
  },
  gifu: {
    quotaMeans: '各学科(群)本体行の募集人員（独自検査Ⅰ/Ⅱ・連携型選抜の内訳行は本体行に既に合算済みの内数のため除外）',
    rationale: 'PDF冒頭注記「募集人員・出願者数には独自検査を含む選抜及び連携型選抜の募集人員・出願者数を含む」に従い本体行のみ採用',
    evidence: 'gifu.tsヘッダコメント既存記載',
  },
  gunma: {
    quotaMeans: 'B列（列名は本体側コメント参照。D/A=公表倍率の分母Bに合わせた）',
    rationale: '公表倍率(D/A)の実際の分母がB列であることを機械集計で確認',
    evidence: 'gunma.tsヘッダコメント既存記載（本ファイルのquota=B・finalApplicants=C・finalRate=C/B）',
  },
  hiroshima: {
    quotaMeans: '全日制本校・分校の総定員（「うち調整」＝学校裁量枠等の内数列は対象外）',
    rationale: '総定員・総志願者数のみを採用し、内訳枠は他県のⅠ/Ⅱ/Ⅲ型内訳と同様に除外',
    evidence: 'hiroshima.tsヘッダコメント既存記載',
  },
  hokkaido: {
    quotaMeans: '募集人員（第1次募集）',
    rationale: '出願者数（第1次）と対をなす分母として採用（他県のΛ-4 hokkaidoエントリと同じ設計）',
    evidence: 'hokkaido.tsヘッダコメント既存記載',
  },
  hyogo: {
    quotaMeans: '定員（「全日制127校 計」行に印字された定員列）',
    rationale: '公表倍率（定員21,150・確定志願者20,567・倍率0.97）の分母と一致することを機械集計で確認',
    evidence: 'hyogo.tsヘッダコメント既存記載',
  },
  ibaraki: {
    quotaMeans: '募集定員(a)',
    rationale: '倍率(b/a)の分母がaのため。特色選抜の内数(c/d)は既にa/bに含まれ別途加算しない',
    evidence: 'ibaraki.tsヘッダコメント既存記載',
  },
  ishikawa: {
    quotaMeans: '一般入学枠(C=A-B)。内定者数（推薦・連携型・併設型等）を入学者募集人員(A)から控除',
    rationale: '公表倍率の分母がCのため',
    evidence: 'ishikawa.tsヘッダコメント既存記載',
  },
  iwate: {
    quotaMeans: '（特色入学者選抜を除く）募集定員。いわて留学合格者数・連携型志願者数等を控除済み',
    rationale: '実際に一般選抜で競われる枠を分母に合わせた（他県と同型の設計）',
    evidence: 'iwate.tsヘッダコメント既存記載',
  },
  kagawa: {
    quotaMeans: '入学定員（差引後）。入学定員（合計）から自己推薦選抜合格者等数（内数）を控除',
    rationale: '公表倍率（競争率）の分母と一致させた',
    evidence: 'kagawa.tsヘッダコメント既存記載',
  },
  kagoshima: {
    quotaMeans: '学力検査定員（＝募集定員－推薦等内定者数）',
    rationale: '「全日制合計」行（学力検査定員10,349・最終出願者数7,948・倍率0.77）と機械集計が一致',
    evidence: 'kagoshima.tsヘッダコメント既存記載',
  },
  kanagawa: {
    quotaMeans: '一般募集共通選抜の募集定員（志願変更では変わらない固定値）',
    rationale: '東京都の「最終応募状況」を採るのと同じ設計方針。全レコード合計quota=39,431を機械検証済み',
    evidence: 'kanagawa.tsヘッダコメント既存記載',
  },
  kochi: {
    quotaMeans: '実際の募集定員（注1に別途併記される数値。名目定員とは別）',
    rationale: 'R6/R7/R8で同型の表記が続く公式の実質募集枠を採用',
    evidence: 'kochi.tsヘッダコメント既存記載',
  },
  kumamoto: {
    quotaMeans: '後期(一般)募集人員',
    rationale: '前期(特色)選抜等合格内定者数(B)を控除済みの後期一般枠を分母として採用',
    evidence: 'kumamoto.tsヘッダコメント既存記載',
  },
  kyoto: {
    quotaMeans: '中期選抜の募集人員（列C）',
    rationale: '倍率（D/C）の分母がCのため。前期選抜は既に合格確定済みの別プロセスで対象外',
    evidence: 'kyoto.tsヘッダコメント既存記載',
  },
  mie: {
    quotaMeans: '後期選抜募集人数（＝入学定員－前期内定者数）',
    rationale: '前期選抜で既に合格が確定した枠を除いた、後期選抜で実際に競われる枠を分母に採用',
    evidence: 'mie.tsヘッダコメント既存記載',
  },
  miyagi: {
    quotaMeans: '募集定員（第一次募集）',
    rationale: '第一次募集出願志願者数・同倍率と対をなす分母として採用',
    evidence: 'miyagi.tsヘッダコメント既存記載',
  },
  miyazaki: {
    quotaMeans: '一般入学募集人員（＝定員－推薦入学内定者数、附属中進学予定者等も控除済みの調整済み印字値）',
    rationale: '資料に既に調整済みの数値がそのまま印字されており追加計算は不要だった',
    evidence: 'miyazaki.tsヘッダコメント既存記載',
  },
  nagano: {
    quotaMeans: '募集人員（4通学区の地区別合計・くくり募集は連結学科名の単一レコードとして扱う）',
    rationale: '全県計（8,807／7,795／0.89）および4通学区の合計行の両方と機械集計が完全一致することを確認',
    evidence: 'nagano.tsヘッダコメント既存記載',
  },
  nagasaki: {
    quotaMeans: '一般選抜定員',
    rationale: '特別選抜等合格者数を控除した一般選抜の実質枠を分母として採用（志願変更制度自体が存在しない県のため単一値）',
    evidence: 'nagasaki.tsヘッダコメント既存記載',
  },
  nara: {
    quotaMeans: '募集人員（第一出願期間）',
    rationale: '報道記事が引用する倍率（例:「1.27倍」）の分母と一致することを確認',
    evidence: 'nara.tsヘッダコメント既存記載',
  },
  niigata: {
    quotaMeans: '一般選抜募集人数(A)',
    rationale: '一般選抜志願者数(B)と対をなす分母として採用',
    evidence: 'niigata.tsヘッダコメント既存記載',
  },
  oita: {
    quotaMeans: '募集人員（入学定員から控除済み）',
    rationale: '入学定員そのものではなく実質募集枠を分母に採用。quota=0の学科（芸術緑丘・美術科等）は他県と同じ除外ルールを適用',
    evidence: 'oita.tsヘッダコメント既存記載',
  },
  okayama: {
    quotaMeans: '一般入学募集人員(A-B)',
    rationale: '公表比率 C/(A-B) の分母(A-B)に合わせた。quota=0の学科（全員特別入学枠）は収録対象外',
    evidence: 'okayama.tsヘッダコメント既存記載',
  },
  okinawa: {
    quotaMeans: '募集人員（＝定員－併設型進学予定者）',
    rationale: '併設型中高一貫校の内部進学枠を控除した実質募集枠を分母として採用',
    evidence: 'okinawa.tsヘッダコメント既存記載',
  },
  osaka: {
    quotaMeans: '学科ごとの公式値A（xlsx解析で分解）',
    rationale: '学科単位で公式に印字されている定員値をそのまま採用',
    evidence: 'osaka.tsヘッダコメント既存記載',
  },
  saga: {
    quotaMeans: '一般選抜募集人員(c)',
    rationale: '募集定員(a)ではなく一般選抜として実際に競われるc列を分母として採用（志願者数変更後の確定版を使用）',
    evidence: 'saga.tsヘッダコメント既存記載',
  },
  shiga: {
    quotaMeans: '一般型選抜の募集人数（学校独自型選抜の内数を控除した括弧書き印字値）',
    rationale: '資料上「(304)」等の括弧書きで既に控除済みの数値が印字されているためそのまま採用',
    evidence: 'shiga.tsヘッダコメント既存記載',
  },
  shimane: {
    quotaMeans: '一般選抜募集定員（列i、年度により列l等に相当）',
    rationale: '対募集定員競争率（列p）の分母と一致する列を機械的に同定して採用',
    evidence: 'shimane.tsヘッダコメント既存記載',
  },
  shizuoka: {
    quotaMeans: '学科単位の総募集定員（最上位行。Ⅰ/Ⅱ枠等の内訳行は総定員の一部で対象外）',
    rationale: '内訳行を合算すると総定員と一致しないため、インデント無しの最上位行のみを1レコードとして採用',
    evidence: 'shizuoka.tsヘッダコメント既存記載',
  },
  tochigi: {
    quotaMeans: '一般選抜定員',
    rationale: '推薦選抜のみで定員が充足し一般選抜定員=0の学科（一般入学者選抜非実施）はquota>0の原則により対象外',
    evidence: 'tochigi.tsヘッダコメント既存記載',
  },
  tokushima: {
    quotaMeans: '募集人員',
    rationale: '最も単純な[募集人員 / 出願者数 / 倍率]の3列構成のうち募集人員を分母として採用。quota=0の学科（非実施年）は対象外',
    evidence: 'tokushima.tsヘッダコメント既存記載',
  },
  tottori: {
    quotaMeans: '実質募集定員（名目の募集定員から控除済み）',
    rationale: '名目定員ではなく実質枠を分母として採用',
    evidence: 'tottori.tsヘッダコメント既存記載',
  },
  toyama: {
    quotaMeans: '推薦内定者数等を除いた募集人数(A-B)',
    rationale: '募集定員(A)から推薦入学内定者数及び全国募集合格者数(B)を控除した実質枠を分母として採用',
    evidence: 'toyama.tsヘッダコメント既存記載',
  },
  wakayama: {
    quotaMeans: '本出願倍率の分母A（定員から特色化選抜合格内定者数を控除済みの値がそのまま印字）',
    rationale: '資料上既に控除済みの印字値をそのまま採用',
    evidence: 'wakayama.tsヘッダコメント既存記載',
  },
  yamagata: {
    quotaMeans: '募集人員（＝入学定員からその内定者数を控除済み）',
    rationale: '資料上既に調整済みの印字値をそのまま採用',
    evidence: 'yamagata.tsヘッダコメント既存記載',
  },
  yamaguchi: {
    quotaMeans: '第一次募集の定員(C=A-B)。入学定員(A)から特色選抜等合格内定者数(B)を控除',
    rationale: '公表倍率の分母がCのため。予備調査版（出願期間開始前）ではなく出願締切後の確定値を採用',
    evidence: 'yamaguchi.tsヘッダコメント既存記載',
  },
  yamanashi: {
    quotaMeans: '後期募集人員',
    rationale: '最終志願者数と対をなす分母として採用（志願変更後の最終確定値）',
    evidence: 'yamanashi.tsヘッダコメント既存記載',
  },
};
