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
 * ## 2026-08-22追記（第2バッチ・10県）
 * 千葉・埼玉・神奈川・愛知・大阪・兵庫・広島・福島・北海道・青森の10県を追加調査した。9県で
 * 「独立した先行速報の実在」を確認（confirmed-multistage）、青森のみ未確認（unconfirmed）に留まった。
 * - 千葉・埼玉・愛知・大阪・兵庫・広島・福島・北海道の8県は、県教委サイトまたは進研ゼミ(czemi.benesse.ne.jp)
 *   に「志願変更前」「志願変更後」等の別記事・別URLが存在し、**速報段階でも学校別倍率まで公表される**
 *   ことを確認できた（第1弾で見つかった「速報は出願者数のみ」というパターンより、倍率まで出るパターンの
 *   方が多数派だと分かった）。
 * - 北海道は道教委が出願状況を**計4回**発表する構造（当初出願→志願変更期間→志願変更後→再出願後）で、
 *   石川・東京と同様に単純な2段階モデルでは設計しきれない多段階県であることを確認。
 * - 神奈川は2段階構造自体は確認できたが、速報段階での学校別倍率公表の有無は確度不足で保留。
 * - 青森は県教委サイトの出願状況ページが年度ごとに単一URLのみで、他県のような「変更前/確定」の別URL
 *   構成が見当たらず、先行速報の実在を断定できなかった（要追加調査）。
 *
 * ## 本ファイルのスコープ（フェーズ1のみ）
 * 今回は上記調査で直接裏取りできた18県分のみを収録する。残り29県（栃木を除く）は`status:
 * 'not-investigated'`として明示的に未調査のまま扱い、値を推測で埋めない（Y-0憲法③「機械可読不能・
 * 未確認は正直にスキップ」の精神）。取込スクリプト・速報面フロントエンドの実装は次フェーズ以降。
 *
 * ## 次フェーズへの引き継ぎ事項
 * 1. 残り29県（栃木除く）の同型調査（各県教委サイトで「志願変更前/当初出願」に相当する独立公表物の
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
  {
    prefectureCode: 'chiba',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 15,
    note:
      '県教委サイトに「入学志願状況の詳細資料」(r8siganitiran.html・志願変更前)と「入学志願者確定数」' +
      '(r8kakuteiitiran.html・志願変更後)という別URL・別ページの2公表物が存在。進研ゼミも「倍率速報' +
      '(志願変更前)」として2/5時点の学校別倍率(例: 県立船橋理数科2.23倍)を報じており、速報段階で' +
      '学校別倍率まで公表されることを確認。確定発表は例年2月下旬。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'saitama',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 2,
    note:
      '県教委サイトに「志願先変更1日目終了時点」の志願者数資料(2/18頃)と、その後の「入学志願確定者数」' +
      'ニュース(news2026022002・2/20発表)が別掲載。進研ゼミも「倍率速報(確定前)」と「倍率速報' +
      '(入学志願者確定数)」を別記事化しており、速報段階でも倍率が公表される。3段階以上(当初出願→' +
      '志願先変更1日目→確定)の可能性もあり要追加確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kanagawa',
    status: 'confirmed-multistage',
    confidence: 'medium',
    approxGapDays: 9,
    note:
      '1/29(共通選抜出願締切)時点の募集人員・志願者数の速報と、2/7(志願変更締切)後の確定数' +
      '(募集39,431・志願43,821・倍率1.11倍)が別々に公表される2段階構造を確認。ただし1/29時点の速報で' +
      '学校別倍率まで公表されるかは検索結果からは断定できず(interimIncludesRateは保留)。神奈川全県模試' +
      '(伸学工房)等の三次情報サイトが独自に速報を集計している可能性もあり、公式一次情報での学校別粒度は' +
      '要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'aichi',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 8,
    note:
      '進研ゼミに「倍率速報(志願変更前)」と「最終倍率速報(志願変更後)」の別記事が存在(2024年度分は' +
      '1556491_4914.html、2026年度分の変更後版は0802.html)し、複数年度にわたって同じ2段階公表パターンが' +
      '継続していることを確認。制度上、志願変更は2/17の1回のみで学力検査2/25なので、変更前公表は' +
      '例年2月中旬とみられる。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'osaka',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 3,
    note:
      '府教委サイトに「2/14締切時」の志願者数と「2/17締切時(最終)」の志願者数が同一ページ内の別表として' +
      '掲載される構造を複数年度(r05〜r08)で確認。育伸社PDFも倍率算出方法つきで両時点のデータを掲載して' +
      'おり、速報段階でも学校別倍率まで判明する。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hyogo',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 7,
    note:
      '進研ゼミに「倍率速報(志願変更前)」(0807)と「倍率速報(志願変更後)」(1047)の別記事が存在。' +
      'リセマムも2/27時点(志願変更前とみられる)の学校別倍率(長田0.99倍等)を報じており、速報段階で' +
      '学校別倍率まで公表されることを確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hiroshima',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 10,
    note:
      '進研ゼミに「一次選抜 倍率速報(志願変更前)」記事が存在し、2/9時点で学校別倍率(市立基町1.62倍等)を' +
      '公表。志願変更は2/12〜2/18正午で受付されるため、確定版はその後(例年2月下旬〜3月上旬)。gapは' +
      '推定値で要精緻化。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukushima',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 7,
    note:
      '県教委が前期選抜・連携型選抜の「志願状況(一次)」を2/6発表、「出願先変更後」の志願状況を2/13発表と、' +
      '公式に2段階の発表日を明記(福島県高校入試.com等の集約サイトでも同一の発表構造を確認)。一次段階でも' +
      '特色選抜0.74倍・一般選抜0.92倍等の倍率が判明しており、速報段階から倍率公表ありと確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hokkaido',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 17,
    note:
      '道教委は出願状況を計4回発表する構造(1/26当初出願→1/29-2/2志願変更期間→2/12志願変更後→再出願後)で' +
      'あることを複数の三次情報サイト(進学教室FiveSchools等)で確認。他県より段階数が多い点は石川・東京と' +
      '同型。2/12時点で札幌西1.4倍等の学校別倍率が判明しており、中間段階でも倍率公表ありと確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'aomori',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '県教委サイトの出願状況ページは年度ごとに単一URL(shutsugansyasuu20XX_koukou.html)のみで、千葉・' +
      '埼玉のような「変更前」「確定」の別URL構成は確認できなかった。検索結果は「出願変更後(2/17締切後)に' +
      '発表」という記述のみで、それ以前の独立した速報公表物の有無は今回未確認。進研ゼミの「倍率情報' +
      '(速報版)」と「倍率情報(高校別・学科別)」という別記事(0774/1024)は時期でなく粒度の違いの可能性も' +
      'あり、先行速報の実在は断定できない。要追加調査。',
    investigatedAt: '2026-08-22',
  },
];
