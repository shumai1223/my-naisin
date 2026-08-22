/**
 * 冬の倍率速報体制（Y-11）フェーズ1: 都道府県別「先行速報の公表構造」台帳。
 *
 * ## 背景
 * `src/data/competition-rates/`はいずれの都道府県も「志願変更後・確定」の最終出願状況のみを
 * 収録している（Y-6の設計どおり）。しかし出願期間中（1〜2月）には、教育委員会が**確定より前に
 * 「当初出願状況」「速報」等の呼称で1回以上の中間公表を行う**県が多いことが2026-08-22の調査
 * （8県サンプル）で判明した。Y-11は、この中間公表を当日〜翌日で自サイトに反映する運用体制を
 * 事前建設するタスクである。本ファイルはその第一段階＝「対象県の公表URL台帳」にあたる。
 *
 * ## 2026-08-22調査で確認した知見（8県サンプル・詳細はdocs/worklog/2026-08-22.md参照）
 * - 8県中6県で「独立した先行速報の実在」を確認（あり）、1県は推定止まり（佐賀）、1県は未確認（島根）。
 *   仮説「教委は当初出願状況(速報)→志願変更後(確定)の2段階以上で公表する」は強く支持された。
 * - ⚠️速報段階では**倍率(finalRate)が非公表で「出願者数のみ」のケースがある**（熊本の当初出願者数
 *   のみ資料が代表例）。速報面は「倍率」でなく「出願者数（前年同時期比）」中心の設計が必要な
 *   可能性が高い（安易に「速報倍率」を前面に出すと、教委非公表の値を独自計算する捏造リスクになる）。
 * - 県によって速報の粒度が異なる（学校別まで出る県／県計のみの県）。石川・東京は3段階以上の
 *   多段階構造で、単純な「速報→確定」の2値モデルでは設計しきれない。
 *
 * ## 本ファイルのスコープ（フェーズ1のみ）
 * 今回は上記調査で直接裏取りできた8県分のみを収録する。残り39県（栃木を除く）は`status:
 * 'not-investigated'`として明示的に未調査のまま扱い、値を推測で埋めない（Y-0憲法③「機械可読不能・
 * 未確認は正直にスキップ」の精神）。取込スクリプト・速報面フロントエンドの実装は次フェーズ以降。
 *
 * ## 次フェーズへの引き継ぎ事項
 * 1. 残り39県（栃木除く）の同型調査（各県教委サイトで「志願変更前/当初出願」に相当する独立公表物の
 *    有無・公表日・URL・粒度[倍率まで出るか]を確認）。
 * 2. 速報データの取込スクリプト設計（`interimIncludesRate: false`の県では倍率でなく出願者数の
 *    前年同時期比を表示する設計が必要）。
 * 3. 速報面フロントエンド（既存のcompetition-rates系ページと混同しないよう「未確定・参考値」である
 *    旨を明示するUI設計が必須）。
 * 4. DoD「速報取込のドライラン（過去年度データで模擬）成功」の実施。
 */

export type InterimBulletinStatus =
  | 'confirmed-multistage' // 独立した先行速報の実在を確認済み
  | 'presumed-multistage' // 制度上の日程から推定（直接のURL・公表日は未特定）
  | 'unconfirmed' // 今回の調査では先行速報の有無を確認できなかった
  | 'not-investigated'; // まだ調査していない

export interface InterimBulletinPrefectureEntry {
  prefectureCode: string;
  status: InterimBulletinStatus;
  /** 調査の確度。'not-investigated'の場合は省略。 */
  confidence?: 'high' | 'medium' | 'low';
  /** 速報段階で学校別の倍率(finalRate)まで公表されるか。出願者数のみの場合はfalse。不明はundefined。 */
  interimIncludesRate?: boolean;
  /** 速報公表から確定公表までの目安日数（判明している場合のみ）。 */
  approxGapDays?: number;
  /** 調査で得られた所見（日本語・自由記述）。 */
  note: string;
  /** この調査を行った日付。 */
  investigatedAt: string;
}

export const INTERIM_BULLETIN_REGISTRY: InterimBulletinPrefectureEntry[] = [
  {
    prefectureCode: 'kumamoto',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: false,
    approxGapDays: 5,
    note:
      '2026-08-22のkumamoto R5データ収集時に実地確認済み。「当初出願者数のみ」を含む資料が先行公表され、' +
      '5日後に「出願確定者数」を含む本命資料が公表される2段階構造。速報段階は倍率非公表（出願者数のみ）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukuoka',
    status: 'confirmed-multistage',
    confidence: 'high',
    note:
      '進研ゼミ等の三次情報サイトが「倍率速報(志願変更前)」と「確定」を別記事として扱っている。' +
      '確定版（志願変更受付後）は例年2月下旬公表。速報は数日〜1週間ほど先行するとみられるが、' +
      '速報段階の学校別粒度・倍率公表有無は未確認（要追加調査）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'ishikawa',
    status: 'confirmed-multistage',
    confidence: 'high',
    note:
      '出願期間（例年2/18-24頃）→志願変更期間（例年2/27-3/3頃）という制度上、複数時点（出願締切直後・' +
      '志願変更締切直後・さらにその後）で出願状況が公表される3段階以上の構造。単純な「速報→確定」の' +
      '2値モデルでは設計しきれず、追加調査で各段階の粒度・倍率公表有無を確認する必要がある。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'okinawa',
    status: 'confirmed-multistage',
    confidence: 'high',
    approxGapDays: 14,
    note:
      '「初回志願状況」と「最終志願状況」の2つの掲載日が明確に判明（例年2月上旬→2月中旬・約14日差）。' +
      '初回志願状況の学校別粒度・倍率公表有無は未確認（要追加調査）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamaguchi',
    status: 'confirmed-multistage',
    confidence: 'medium',
    approxGapDays: 13,
    note:
      '「1月30日時点における…志願状況調査」と「2月12日発表の学校・学科ごとの志願状況」という異なる' +
      '2つの公表物が存在（約13日差）。1月30日時点調査の倍率公表有無・学校別粒度は未確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'saga',
    status: 'presumed-multistage',
    confidence: 'low',
    note:
      '出願受付・志願変更受付の日程（出願2/16-17、志願変更2/20-24が例年パターン）から、出願受付直後と' +
      '志願変更後で別々に集計が公表される可能性が高いと推定したが、具体的な公表URL・実際の公表有無は' +
      '今回未特定。要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'tokyo',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '「応募状況（最終応募状況）」「受検状況」「分割後期募集関連の応募状況」等、複数の異なる公表物の' +
      '存在を確認。URL命名規則（`_ichiji_final`の"final"表記）が「最終でない応募状況」の存在を示唆するが、' +
      '直接のWebFetchでは404となり確認できず。石川県と同様に3段階以上の複雑な構造とみられる。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shimane',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '検索結果は「志願変更後」の確定版倍率速報記事のみがヒットし、それより前の独立公表物の有無は' +
      '今回のWebSearchでは確認できなかった。三次情報サイトの記事タイトル自体が「倍率速報(志願変更後)」と' +
      'なっており、これが唯一の主要公表物である可能性も残る。要追加調査。',
    investigatedAt: '2026-08-22',
  },
];
