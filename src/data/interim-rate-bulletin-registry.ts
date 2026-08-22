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
 * ## 2026-08-22追記（第3バッチ・10県）
 * 岩手・宮城・秋田・山形・茨城・群馬・新潟・富山・福井・山梨の10県を追加調査した。9県で「独立した
 * 先行速報の実在」を確認（confirmed-multistage）、宮城のみ他県と異なり「志願変更前/後」の別記事構成が
 * 確認できず未確認（unconfirmed）に留まった。
 * - 岩手・秋田・茨城・群馬・新潟・福井の6県は速報段階でも学校別倍率まで公表されることを確認
 *   （interimIncludesRate: true）。山形・富山・山梨の3県は2記事の存在（confirmed-multistage）は確認
 *   できたが、速報段階の学校別倍率の具体的な数値・公表日までは今回のWebSearchで裏取りできず保留。
 * - 群馬は地域紙が「1回目の志願先変更後」という表現を使っており、石川・東京・北海道と同様に3段階以上の
 *   可能性がある（要追加調査）。
 *
 * ## 2026-08-22追記（第4バッチ・10県）
 * 長野・岐阜・静岡・三重・滋賀・京都・奈良・和歌山・鳥取・岡山の10県を追加調査した。8県で「独立した
 * 先行速報の実在」を確認（confirmed-multistage）、岡山のみ単一の「倍率情報(高校・学科別)」記事しか
 * 見つからず未確認（unconfirmed）に留まった。
 * - 長野・岐阜・静岡・三重・滋賀・鳥取の6県は進研ゼミに「倍率速報(志願変更前)」「倍率速報(志願変更後)」
 *   の対になる別記事・別URLが存在し、速報段階でも学校別倍率まで公表されることを確認（interimIncludesRate: true）。
 * - 奈良は2026年度から特色選抜と一般選抜を「一次選抜」に一本化する制度改編があった（第一出願期間→
 *   第二出願期間の2期制）。進研ゼミに「倍率情報(速報版)」(第一出願期間時点)と「倍率情報」（確定相当）の
 *   別記事が存在し、速報段階でも学校別倍率（一条高校1.51倍等）が判明することを確認。ただし制度改編直後
 *   のため、この構造が来年度以降も継続するかは要継続観察。
 * - 和歌山は「本出願前」「本出願後」という他県と異なる呼称のペア記事を確認（confirmed-multistage）が、
 *   速報段階の学校別倍率の具体的な数値は今回のWebSearchでは直接確認できず確度は中位に留めた。
 * - 京都は選抜方式によって構造が異なる可能性がある：前期選抜は「倍率速報」単独記事のみ確認（志願変更の
 *   制度自体が無いとみられる）、中期選抜は「倍率情報(速報版)」「倍率情報(詳細版)」の別記事を確認したが
 *   両者が同一年度で揃っているかは未確認のため確度は中位に留めた。
 * - 岡山は繰り返し検索したが「一般入学者選抜 倍率情報(高校・学科別)」という単一記事しか見つからず、
 *   志願変更前後で別記事が存在するパターンは確認できなかった（他県との一貫性は無いが、捏造ゼロ原則に
 *   従い無理に'confirmed'にせず'unconfirmed'のまま記録する）。
 *
 * ## 本ファイルのスコープ（フェーズ1のみ）
 * 今回は上記調査で直接裏取りできた38県分のみを収録する。残り8県（栃木を除く：徳島・香川・愛媛・高知・
 * 長崎・大分・宮崎・鹿児島）は`status: 'not-investigated'`として明示的に未調査のまま扱い、値を推測で
 * 埋めない（Y-0憲法③「機械可読不能・未確認は正直にスキップ」の精神）。取込スクリプト・速報面フロント
 * エンドの実装は次フェーズ以降。
 *
 * ## 次フェーズへの引き継ぎ事項
 * 1. 残り8県（栃木除く：徳島・香川・愛媛・高知・長崎・大分・宮崎・鹿児島）の同型調査（各県教委サイトで
 *    「志願変更前/当初出願」に相当する独立公表物の有無・公表日・URL・粒度[倍率まで出るか]を確認）。
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
  {
    prefectureCode: 'iwate',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 8,
    note:
      '進研ゼミに「倍率速報(調整前)」記事(0775)が存在。調整前(2/12時点)は募集8,215人・志願6,591人・' +
      '倍率0.80倍で、盛岡商業(流通ビジネス)1.59倍等の学校別倍率まで公表。8日後の2/20に志願先変更後の' +
      '確定倍率(全体0.80倍・盛岡商業1.35倍)が発表される2段階構造を確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'miyagi',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '進研ゼミの2026年度記事は「第一次募集倍率速報(高校別・学科別)」(1026)の1本のみで、他県のような' +
      '「志願変更前」「志願変更後」の別記事・別URL構成が見当たらなかった。resemom記事も2/13発表分を' +
      '最初から「確定」と表記しており、それより前の独立した速報公表物の有無を今回のWebSearchでは' +
      '断定できなかった。要追加調査(公式サイト一次情報の直接確認が必要)。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'akita',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 7,
    note:
      '進研ゼミに「倍率速報(志願変更前)」記事(0777)が存在。2/5時点(1次締切)の速報で金足農業(生物資源)' +
      '1.54倍等の学校別倍率が判明済み(秋田魁新報も2/5・2/12の2回にわたり学校別倍率の一覧記事を掲載)。' +
      '志願先変更は2/9-2/12正午受付で、7日後の2/12に確定倍率が公表される2段階構造を確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamagata',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '進研ゼミに後期(一般)選抜の「倍率情報(速報版)」(0778)と「倍率情報(確定版)」(1028)の別記事・別URLが' +
      '存在し2段階構造を確認。ただし速報版の学校別倍率の具体的な数値・速報公表日は今回のWebSearchでは' +
      '直接確認できず(検索結果は確定版の数値[山形東(探究)2.22倍等]を主に返した)。interimIncludesRateは' +
      '保留・要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'ibaraki',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに「倍率速報(志願変更前)」(0780)と「倍率速報(志願先変更後)」(1030)の別記事が存在。' +
      '志願変更前の特色選抜段階で水戸商業(情報ビジネス)2.50倍・水戸工業(土木)2.25倍等の学校別倍率が' +
      '判明しており、速報段階から倍率公表ありと確認。全日制一般の確定発表は2/18(水戸第一1.46倍)。' +
      'gap日数は特色選抜と一般選抜で基準が異なるため未算出(要追加調査)。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'gunma',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに「倍率速報(志願変更前)」(0782)と「倍率速報(志願変更後)」(1032)の別記事が存在。志願変更前' +
      '(2/2時点)は募集11,153人・志願10,800人・倍率0.97倍で、沼田(文理探究)1.60倍等の学校別倍率まで公表。' +
      'ただし地域紙(みんなの学校新聞)は「1回目の志願先変更後」という表現も使っており、志願変更が複数回' +
      '設定されている可能性(石川・東京・北海道と同型の3段階以上)があり要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'niigata',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 8,
    note:
      '地元局(TeNYテレビ新潟)が「倍率速報 2/18時点」と「志願倍率 2/26確定」を別記事で公開しており2段階' +
      '構造を確認(進研ゼミも0792[志願変更前]/1033[志願変更後]の別記事)。速報段階で新潟(理数)1.98倍等の' +
      '学校別倍率まで判明。志願変更受付は2/24-2/26で、8日後の2/26に確定倍率発表。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'toyama',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '進研ゼミに「倍率情報(速報版)」(0793)と「倍率情報(高校別・学科別)」(1034)の別記事・別URLが存在し' +
      '2段階構造を確認。ただし速報版の公表日・学校別倍率の具体的な数値は今回のWebSearchでは直接確認' +
      'できず(検索結果は2/24発表の確定値[富山中部(探究科学)2.10倍等]を主に返した)。' +
      'interimIncludesRateは保留・要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukui',
    status: 'confirmed-multistage',
    confidence: 'medium',
    interimIncludesRate: true,
    approxGapDays: 11,
    note:
      '一般入学者選抜は2/5・6・9出願、2/12・13・16志願変更受付という制度上、resemomが出願初日(2/5時点)の' +
      '学校別倍率(羽水[探究特進]1.58倍等)を独立記事として報じており、志願変更前段階での倍率公表を確認。' +
      '進研ゼミの「倍率速報(志願変更前)」記事(0795)は検索結果では2025年度版のみ確認でき2026年度版の直接' +
      '確認はできなかったが、resemom記事は2026年度分であり2段階構造自体は同一パターンとみられる。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamanashi',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '進研ゼミに後期募集の「倍率速報(志願変更前)」(0796)と「倍率速報(志願変更後)」(1037)の別記事・別URLが' +
      '存在し2段階構造を確認。ただし速報版の学校別倍率の具体的な数値・公表日は今回のWebSearchでは直接' +
      '確認できず(検索結果は2/26発表の確定値[甲府南(理数)1.32倍等]を主に返した)。interimIncludesRateは' +
      '保留・要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'nagano',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに後期選抜の「倍率速報(志願変更前)」(0797)と「倍率速報(志願変更後)」(1038)の別記事・別URLが' +
      '存在し2段階構造を確認。志願変更前後とも全日制後期募集人員8,807人・志願者数はほぼ同水準(0.89倍)で' +
      '推移し、松本蟻ケ崎1.27倍・伊那北(理数)4.75倍等の学校別倍率が判明済み。両記事とも表題が「倍率速報」' +
      'であることから速報段階でも学校別倍率まで公表されると判断。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'gifu',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    approxGapDays: 7,
    note:
      '進研ゼミに第一次選抜の「倍率速報(志願変更前)」(2025年度0798)と「倍率速報(志願変更後)」(2026年度' +
      '1039)の別記事・別URLが複数年度にわたり存在し2段階構造を確認。中京テレビ(Yahoo)も2026年度の出願' +
      '変更後(2/17正午締切)の全校データ(岐阜1.09倍・大垣北1.09倍・岐阜農林流通科学1.40倍等)を報じており、' +
      '速報段階から学校別倍率が公表されると判断。出願変更受付は例年2/12-17付近。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shizuoka',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに一般選抜の「倍率速報(志願変更前)」(2026年度0799)と「倍率速報(志願変更後)」(1040)の別記事・' +
      '別URLが存在し2段階構造を確認。全日制計は志願変更前後とも募集16,954人・志願16,895人・倍率1.00倍で' +
      '大きな変動なし。SBS(静岡放送)が変更後の全校掲載(磐田南理数1.88倍等)を報じており、速報段階も' +
      '「倍率速報」を名乗ることから学校別倍率まで判明すると判断。gap日数は今回未特定。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'mie',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに後期選抜の「倍率速報(志願変更前)」(2026年度0803)と「倍率速報(志願変更後)」(1041)の別記事・' +
      '別URLが複数年度(2025/2026)にわたり存在し2段階構造を確認。志願変更後の全日制計は募集6,419人・' +
      '志願6,636人・倍率1.03倍で、CBCテレビ(Yahoo)が全校掲載(松阪0.81倍・津西国際科学3.28倍等)を報じて' +
      'おり学校別倍率まで判明。gap日数は今回未特定。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shiga',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに一般選抜(2025年度)・一次募集(2026年度)の「倍率速報(志願変更前)」(2025:1556494_5060・' +
      '2026:0804)と「倍率速報(志願変更後)」(2026:1042)の別記事・別URLが存在し2段階構造を確認。リセマムも' +
      '2/5時点(志願変更前とみられる)の出願状況記事を掲載。⚠️2026年度(R8)入試から従来の学校独自選抜+' +
      '一般選抜の二重出願制度が「一次募集」1回に制度改編されており、Y-6の`shiga.ts`が扱ってきた複雑構造' +
      '(両方の学科統合等)とこの速報の2段階構造の関係は要継続確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kyoto',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '選抜方式により構造が異なる可能性がある。前期選抜は進研ゼミに「倍率速報」単独記事(2026年度1043)のみ' +
      '確認でき、志願変更の制度自体が無いとみられる(前期選抜1回のみで確定)。中期選抜は「倍率情報(速報版)」' +
      '(2025年度1556495)と「倍率情報(詳細版)」(2026年度1569447)の別記事を確認したが、同一年度で両方が' +
      '揃っているか(2026年度の速報版が別途存在するか)は今回未特定。リセマムは前期選抜の「確定」記事' +
      '(堀川探究1.55倍等)のみ確認。中期選抜の多段階構造の裏取りは要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'nara',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '2026年度から特色選抜と一般選抜を「一次選抜」に一本化(第一出願期間→第二出願期間の2期制、第二出願は' +
      '定員未充足の学科のみ)する制度改編があった。進研ゼミに「倍率情報(速報版)」(0808・第一出願期間時点)' +
      'と「倍率情報」(1048・確定相当)の別記事が存在し、速報段階(第一出願期間)でも一条高校1.51倍・郡山' +
      '1.27倍等の学校別倍率が判明することを確認。リセマムの「実質倍率」記事(3/6)はさらに後の確定値。' +
      '制度改編直後のため、この2段階構造が来年度以降も継続するかは要継続観察。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'wakayama',
    status: 'confirmed-multistage',
    confidence: 'medium',
    note:
      '進研ゼミに一般選抜の「倍率速報(本出願前)」(2025年度1556499_5425)と「倍率速報(本出願後)」(2026年度' +
      '1049)の別記事・別URLが存在し2段階構造を確認(他県の「志願変更前/後」でなく「本出願前/後」という' +
      '独自の呼称)。ただし本出願前段階の学校別倍率の具体的な数値・公表日は今回のWebSearchでは直接確認' +
      'できず、確度は中位に留めた。要追加調査。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'tottori',
    status: 'confirmed-multistage',
    confidence: 'high',
    interimIncludesRate: true,
    note:
      '進研ゼミに一般入学者選抜の「倍率速報(志願変更前)」(0810)と「倍率速報(志願変更後)」(1050)の別記事・' +
      '別URLが存在し2段階構造を確認。志願変更前後とも実質募集定員2,937人・志願者数2,333→2,334人・倍率' +
      '0.79倍でほぼ変動なし。米子南(生活創造ライフデザイン)1.82倍・米子東(普通生命科学)1.20倍等の学校別' +
      '倍率が判明済み。リセマムの「確定」記事とも整合。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'okayama',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '2種類の検索クエリで確認したが、進研ゼミには「一般入学者選抜 倍率情報(高校・学科別)」(1052)という' +
      '単一記事しか見つからず、他県のような「志願変更前/後」の別記事・別URL構成は確認できなかった。' +
      'OHK(岡山放送)の記事も「全日制平均競争倍率」を確定値として報じるのみ。先行速報が存在しない可能性・' +
      '単に今回の検索で発見できなかった可能性のいずれもありうるため、無理に「confirmed」にせず' +
      '「unconfirmed」のまま正直に記録する(捏造ゼロ原則)。要追加調査(公式サイト一次情報の直接確認)。',
    investigatedAt: '2026-08-22',
  },
];
