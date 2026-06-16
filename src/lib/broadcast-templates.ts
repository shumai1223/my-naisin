/**
 * 名簿（堀A）の「配信する中身」＝LINE/メールに与える“商品”の単一ソース。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：名簿velocity がKPI。だが「受験情報を配信」では曖昧で
 * 友だち追加の動機が弱い（追加動機ゼロ問題）。受け取れる中身を具体化し、SaveResultCTA・歓迎メール・
 * 退出モーダル・将来の一斉配信（ステップ/季節）で同じ約束を使い回す＝矛盾なく信頼を積む。
 *
 * 数値・断定的な期日は持たない（県ごとに異なり年度で変わるため＝捏造ゼロ）。
 * 「いつ・何を届けるか」の枠組みだけを定義し、実日程は配信時に各県教委の一次情報で確認する運用。
 */

/** 名簿で受け取れるもの（追加する“理由”）。SaveResultCTA / 歓迎メールで共有。 */
export const LIST_BENEFITS: string[] = [
  '出願1ヶ月前のリマインド',
  '月1の内申アップ チェックリスト',
  '志望校の最新ボーダー速報',
];

/** 配信のトリガー種別。 */
export type BroadcastTrigger =
  | 'welcome' // 登録直後
  | 'monthly-checklist' // 毎月（内申アップの行動）
  | 'deadline-reminder' // 出願・模試の節目
  | 'season-spring' // 4-5月：新学年の内申仕込み
  | 'season-summer' // 7-8月：三者面談・夏の底上げ
  | 'season-autumn' // 10-11月：内申確定前の追い込み
  | 'season-winter'; // 1-2月：直前期・出願

export interface BroadcastTemplate {
  trigger: BroadcastTrigger;
  /** 配信の狙い（運用メモ）。 */
  intent: string;
  subject: string;
  /** 本文（プレーン。配信時にHTML化／パーソナライズ）。{pref} 等の差し込みは配信側で置換。 */
  body: string;
  /** 自然な再送客先（無料リード）。lead-config の面と対応。 */
  cta: { label: string; path: string };
}

/**
 * 季節・ステップ配信テンプレ集（ESP/LINE配信が点火したら配信ジョブがここを参照）。
 * 各テンプレは「価値→行動→無料リード」の順で、押し売りにならない再送客にする。
 */
export const BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    trigger: 'monthly-checklist',
    intent: '毎月の行動喚起。内申は日々の積み重ねで決まるので「今月やること」を1枚で。',
    subject: '【今月の内申アップ チェックリスト】提出物・小テスト・授業態度',
    body: '内申点は定期テストだけでなく、提出物の期限・小テスト・授業中の発言で決まります。今月のチェック：①提出物の期限を家族で共有 ②苦手教科を1つ決めて先取り ③テスト2週間前から計画。現在地は内申点計算ツールでいつでも確認できます。',
    cta: { label: '内申点を計算して現在地を見る', path: '/' },
  },
  {
    trigger: 'deadline-reminder',
    intent: '出願・模試の節目。期日そのものは各県で異なるため「確認を促す」トーン。',
    subject: '【まもなく出願シーズン】志望校との差を今のうちに確認',
    body: '出願までに「あと何点必要か」を把握しておくと、直前で慌てません。志望校の合格ラインから必要な当日点を逆算し、足りない分の対策を早めに。費用面の備えも今のうちに見える化しておくと安心です。',
    cta: { label: '志望校から必要な点数を逆算する', path: '/reverse' },
  },
  {
    trigger: 'season-spring',
    intent: '4-5月：新学年で内申の仕込み直し。底（学習意欲）から立ち上げる。',
    subject: '【新学年スタート】内申は最初の学期が肝心',
    body: '新学年の最初の通知表は、その後の評定の基準になりがちです。最初の定期テストと提出物で良い流れを作りましょう。お住まいの地域の内申方式（実技の倍率・対象学年）を確認して、効率よく上げる教科を見極めるのがコツです。',
    cta: { label: '都道府県別の内申方式を確認する', path: '/prefectures' },
  },
  {
    trigger: 'season-summer',
    intent: '7-8月：三者面談と夏の底上げ。保護者の関与が高まる時期。',
    subject: '【三者面談の前に】お子さまの現在地を数値で整理',
    body: '面談は限られた時間です。内申点・偏差値・志望校との差を事前に把握しておくと、先生に的確に相談できます。夏は塾の無料体験で「今の学力で何が足りないか」を見える化する好機。費用は比較してから決めましょう。',
    cta: { label: '三者面談の準備チェックリストを見る', path: '/mendan' },
  },
  {
    trigger: 'season-autumn',
    intent: '10-11月：内申確定前の追い込み。最後に動かせる学期。',
    subject: '【内申が固まる前に】最後の追い込みでできること',
    body: '多くの地域で、入試に使う内申は2学期（後期）までの成績が大きく影響します。今が最後に内申を動かせる時期。提出物の取りこぼしゼロ・苦手教科の底上げで、1〜2ポイントの差が合否を分けることもあります。',
    cta: { label: '内申点と「あと何点」を確認する', path: '/' },
  },
  {
    trigger: 'season-winter',
    intent: '1-2月：直前期・出願。お金と当日点の最終確認。',
    subject: '【直前期】出願と当日点、最後の確認',
    body: '出願校は確定しましたか。当日点で必要な得点と、進学にかかるお金の見通しを最後に確認しておきましょう。私立併願や進学先によって費用は大きく変わります。就学支援金・教育費の目安は無料で確認できます。',
    cta: { label: '高校〜大学の教育費・支援を確認する', path: '/hiyou' },
  },
];

/** トリガーからテンプレを引く（配信ジョブ用）。 */
export function getBroadcastTemplate(trigger: BroadcastTrigger): BroadcastTemplate | undefined {
  return BROADCAST_TEMPLATES.find((t) => t.trigger === trigger);
}
