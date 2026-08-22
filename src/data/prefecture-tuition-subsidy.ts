/**
 * Y-9: 就学支援金・自治体上乗せDB（お金クラスタ第二の鉱脈）フェーズα。
 *
 * ## 背景
 * `src/lib/education-cost`は文部科学省「子供の学習費調査」と国の高等学校等就学支援金制度
 * （全国一律）のみを扱う単一ソース設計。しかし多くの都道府県は、国の就学支援金だけでは
 * まかないきれない私立高校の授業料差額に対し、**都道府県独自の上乗せ・軽減補助制度**を持つ
 * （通称は県により「授業料軽減助成金」「授業料支援補助金」「学費支援制度」等さまざま）。
 * 本ファイルはこれを都道府県別に構造化する（2026-08-22・5バッチ（α10+第2〜4各10+第5・7）で全47都道府県完走）。
 *
 * ## スコープと除外
 * - 対象は「国の就学支援金に対する都道府県独自の上乗せ・追加の**給付型**補助」のみ。
 *   返還義務のある**貸付型**の奨学金制度（`type: 'loan'`）とは明確に区別する。
 * - 学校別・個人別の正確な受給額は扱わない（検証不能）。都道府県が公表する制度の枠組み・
 *   所得区分・金額のレンジのみを扱う（Y-0憲法「捏造ゼロ」）。
 * - 制度は年度で頻繁に改定される（2026年度は国の所得制限撤廃に伴い多くの県で制度移行期）。
 *   `lastChecked`日付を必ず入れ、断定できない金額は`subsidyAmountNote`に注記で留める。
 *
 * ## αバッチ（2026-08-22・10県）の知見
 * - **confirmed（5県・高〜中確度）**: 東京・大阪・神奈川・愛知・兵庫は都道府県公式サイトで
 *   独自制度の実在を直接確認できた。ただし東京・大阪・神奈川は公式ページ自体に具体的な金額
 *   （円/年）の記載がなく「詳細はPDFリーフレット参照」という案内のみだったため、
 *   `subsidyAmountNote`はページに書かれている範囲（所得制限の有無・支援の枠組み）に留めた。
 *   愛知は公式ページに学年別の金額表が直接記載されていたため具体的な数値を採用できた。
 *   兵庫は制度の実在自体は公式ページで確認できたが、所得区分別の具体的な金額は二次情報源
 *   （WebSearch要約）のみでの把握に留まり、一次ソースの直接確認ができなかったため
 *   `confidence: 'medium'`とし、金額はnoteで「未直接確認」と明記した。
 * - **unconfirmed（5県）**: 千葉・埼玉・福岡・北海道・静岡は、①制度が2026年度の国の所得制限
 *   撤廃に伴い縮小・廃止の過渡期にあるという情報が錯綜している（千葉・埼玉）、②検索結果が
 *   異なる制度（就学支援金の説明ページ・奨学給付金）を指しており独自上乗せ制度の一次ソースに
 *   到達できなかった（福岡・北海道・静岡）、のいずれかの理由で、無理に'confirmed'にせず
 *   正直に'unconfirmed'のまま残した。
 *
 * ## 第2バッチ（2026-08-22・10県: 青森・岩手・宮城・秋田・山形・福島・茨城・栃木・群馬・新潟）の知見
 * - **confirmed（3県）**: 山形・新潟は都道府県公式ページに具体的な金額・所得区分が直接記載されており
 *   高確度で確認できた（新潟は特に詳細＝定額軽減/第2子以降支援/全額軽減/施設整備費/入学金軽減の5区分）。
 *   栃木は「私立高等学校等授業料減免事業補助金」の実在・対象要件（市町村民税所得割非課税・生活保護・
 *   家計急変）・補助割合（学校法人の減免総額の10分の9を県が補助）を公式Q&Aページで確認できたが、
 *   円建ての具体的な金額は学校ごとの減免額次第で公式ページに記載が無いため`subsidyAmountNote`は
 *   割合表記に留めた。
 * - **unconfirmed（7県）**: 青森・岩手・宮城・秋田・福島・茨城は公式サイトを複数ページ直接確認したが、
 *   見つかったのは①国の就学支援金の説明ページ、②授業料以外の教育費を補助する「奨学のための給付金」、
 *   ③入学金のみを対象とした減免事業（青森・茨城）のいずれかで、**授業料そのものへの県独自上乗せ制度**の
 *   一次ソースには到達できなかった（WebSearch要約が独自の金額＝岩手「月額11,550円」等を提示したが、
 *   該当の公式ページを直接WebFetchすると記載が無く、裏取りできないため不採用とした＝αバッチと同じ
 *   「WebSearch要約は鵜呑みにしない」原則の継続適用）。群馬は「私立高等学校等授業料減免事業補助金」という
 *   制度名自体はpref.gunma.jpドメインの検索結果一覧（Googleインデックス）で確認できたが、直接URLが404で
 *   内容を確認できなかったため、制度名の実在は示唆されるが内容未確認のunconfirmedとした。
 * - **横展開の追加教訓**: 都道府県によって授業料軽減の制度設計が大きく2パターンに分かれると判明した。
 *   ①家庭に直接、所得区分別の定額を給付するパターン（山形・新潟型・愛知型）と、②学校法人が生徒に行う
 *   減免を都道府県が一定割合（例: 10分の9）で補填するパターン（栃木型）。後者は生徒側から見た金額が
 *   学校ごとに異なるため、円建ての具体的な`subsidyAmountNote`を書けないことがある（捏造にならないよう
 *   割合・仕組みで正直に記述する）。
 *
 * ## 第3バッチ（2026-08-22・10県: 富山・石川・福井・山梨・長野・岐阜・三重・滋賀・京都・奈良）の知見
 * - **confirmed（5県）**: 富山・福井・長野・京都は都道府県公式ページに具体的な金額（円）が直接記載されており
 *   高確度で確認できた。長野は栃木と同型の「学校法人補填型」（県から家庭へ直接支給せず、学校が行う軽減に県が
 *   補助する仕組み）と判明。奈良は制度の実在・対象要件（2026年度から所得制限撤廃）は公式ページで確認できたが、
 *   具体的な金額は別添PDF参照のみでページ本文に無く、confidence:mediumに留めた。
 * - **unconfirmed（5県）**: 石川・山梨・岐阜・三重・滋賀は、①公式ページはあるが対象経費（授業料か授業料以外か）
 *   や金額が不明（石川）、②授業料以外の教育費支援制度しか見つからない（山梨）、③WebSearch要約は具体的な
 *   制度名・金額を示すが一次ソースページに到達できない（岐阜）、④候補ページに授業料上乗せの記載が無い
 *   （三重）、⑤候補ページが軒並み404で内容確認不能（滋賀）、のいずれかの理由で正直にunconfirmedとした。
 * - **横展開の追加教訓**: 都道府県公式サイトの検索結果・WebSearch要約が示すURLは404になっていることが
 *   一定頻度である（今回は滋賀の2ページ・京都の最初の1ページで発生）。404の場合はサイト内検索や別の一次ページ
 *   経由での再探索を試みるが、時間内に見つからなければ無理をせずunconfirmedのまま次回に持ち越すこと。
 *
 * ## 第4バッチ（2026-08-22・10県: 和歌山・鳥取・島根・岡山・広島・山口・徳島・香川・愛媛・高知）の知見
 * - **confirmed（6県）**: 岡山・香川はconfidence:highで具体的な金額を公式ページで直接確認できた
 *   （岡山=納付金減免補助金制度・年収区分3段階で年額24,000〜60,000円。香川=入学金軽減補助50,000円
 *   [全日制]/15,000円[通信制]＋家計急変世帯支援補助金・最大月額28,000円）。島根は「月額授業料−就学支援金
 *   の額（38,100円）」という**差額全額補填型**（円建ての固定額でなく計算式）で確認、これは栃木・長野の
 *   「学校法人補填型」に近いが対象が家計急変・低所得世帯限定という違いがある。鳥取・広島・徳島は
 *   制度名（鳥取県私立高等学校等総合支援金制度／広島県授業料等軽減補助金制度／徳島県私立高等学校等
 *   授業料軽減事業補助金）の実在は公式ページで確認できたが、具体的な金額はいずれも「詳細はリーフレット
 *   （PDF）参照」の案内のみでページ本文に無く、confidence:mediumに留めた。
 * - **unconfirmed（4県）**: 和歌山は公式ページに国の就学支援金の説明のみで県独自の上乗せ制度の記載が
 *   見当たらなかった。山口は「私立高等学校授業料等減免制度」という名称のFAQページを発見したが、
 *   本文を精読すると実際の中身は**入学金減免のみ**（上限70,000円）で、授業料そのものへの県独自上乗せは
 *   確認できなかった（制度名に「授業料等」を含んでいても中身が入学金限定というパターンは今回初めて
 *   確認・今後の横展開でも名称だけで判断しない教訓）。愛媛・高知は候補ページ（私学文書課の学校一覧・
 *   私学大学支援課の業務案内）を直接確認したが、制度の具体的な金額・要件を記載した一次ページに
 *   到達できなかった。
 * - **横展開の追加教訓**: 制度名に「授業料等」を含んでいても実際は入学金のみが対象という県がある
 *   （山口）ため、制度名だけで`targetCourse`やスコープ適合を判断せず、必ず本文で対象費目
 *   （授業料そのものか、入学金か、授業料以外の生活費相当か）を確認すること。
 *
 * ## 第5バッチ（2026-08-22・7県: 大分・佐賀・長崎・熊本・宮崎・鹿児島・沖縄・フェーズ完走）の知見
 * - **confirmed（2県）**: 大分（私立高等学校授業料減免支援制度・4区分の月額が公式ページに直接記載）・
 *   鹿児島（私立高等学校授業料軽減費補助・生活保護/非課税/均等割のみの3区分の月額が公式ページに直接記載）
 *   はいずれもconfidence:highで確認できた。
 * - **unconfirmed（5県）**: 佐賀・熊本・宮崎・沖縄は公式ページを直接WebFetchしたが国の就学支援金制度の
 *   説明のみで、県独自の授業料上乗せ制度の記載が見つからなかった（各県の「奨学給付金」は授業料以外の
 *   教育費が対象のため別枠でスコープ外）。長崎は「私立高校の授業料等への補助制度について」という
 *   タイトル自体はスコープに合致する公式ページを発見したが、WebFetch・curl(iPhone UA)いずれで取得しても
 *   本文が空のカテゴリ一覧シェル（動的読み込み構成とみられる）で内容を確認できなかった。
 *
 * ## 本ファイルのスコープ（全47都道府県調査完了）
 * 栃木を含む全47都道府県について、5回のバッチ調査（10+10+10+10+7県）で完走した。confirmed 20県・
 * unconfirmed 27県（本文で確認できたのが金額の一次ソース未確認も含む）。主な制度設計パターンは
 * 3類型に分かれる: ①**家庭直接給付型**（山形・新潟・愛知・富山・福井・岡山・京都・大分・鹿児島等・
 * 所得区分別の定額を家庭へ直接支給） ②**学校法人補填型**（栃木・長野・徳島等・県が学校法人へ補填し
 * 生徒個人には直接支給しない・円建ての具体額を書けないことがある） ③**差額補填型**（島根等・
 * 授業料実費から就学支援金を差し引いた残額を計算式で補填）。加えて「制度名に『授業料等』を含んでいても
 * 実際は入学金のみが対象」（山口）という罠も確認済み。
 *
 * ## 次への引き継ぎ
 * 1. confidence:mediumの県（兵庫・奈良・鳥取・広島・徳島。金額がリーフレットPDF参照のみ）のPDF直接確認
 *    による確度向上。
 * 2. unconfirmedの27県の一次ソース再調査（群馬・岐阜・滋賀は制度名の手がかりが既にあるため正しいURLの
 *    再探索から。長崎は動的ページの子URL個別探索から）。
 * 3. 京都のB/C所得区分（590万〜910万円未満相当）の金額を追加確認する。
 * 4. `/kyouiku-hi`・`/shougakukin`群との結線（フロントエンド表示）。全県が出典付きで揃った今が着手の
 *    タイミング——ただしconfirmed県のみを表示しunconfirmed県は「未確認」と正直に示すUI設計が必須
 *    （Y-11の速報面プレビューと同様、捏造ゼロ原則をUI側でも担保する）。
 */

/** 補助の型。給付（返還不要）と貸付（返還義務あり）を明確に区別する。 */
export type SubsidyType = 'grant' | 'loan';

/** 対象課程。 */
export type SubsidyTargetCourse = 'public' | 'private' | 'both';

/** 調査状況。Y-11の`InterimBulletinStatus`と同型の設計思想（未確認は正直にスキップ）。 */
export type TuitionSubsidyStatus = 'confirmed' | 'unconfirmed' | 'not-investigated';

export interface TuitionSubsidySource {
  url: string;
  docTitle: string;
  /** 最終確認日 YYYY-MM-DD。 */
  lastChecked: string;
}

export interface PrefectureTuitionSubsidyEntry {
  prefectureCode: string;
  status: TuitionSubsidyStatus;
  /** 調査の確度。'not-investigated'/'unconfirmed'の場合は省略可。 */
  confidence?: 'high' | 'medium' | 'low';
  /** 制度の正式名称（都道府県により呼称が異なる）。未確認の場合は省略。 */
  programName?: string;
  /** 給付型か貸付型か。未確認の場合は省略。 */
  type?: SubsidyType;
  targetCourse?: SubsidyTargetCourse;
  /** 所得要件・対象条件の概要（自由記述・断定できない場合はその旨を含める）。 */
  eligibilityNote?: string;
  /** 補助金額の概要（円の断定値でなく範囲・注記で扱う。公式ページに金額の記載が無い場合はその旨を明記）。 */
  subsidyAmountNote?: string;
  /** 一次ソース（都道府県公式サイト）。未確認の場合は省略。 */
  source?: TuitionSubsidySource;
  /** 調査で得られた所見・留保事項（自由記述）。 */
  note: string;
  /** この調査を行った日付。 */
  investigatedAt: string;
}

export const PREFECTURE_TUITION_SUBSIDY_REGISTRY: PrefectureTuitionSubsidyEntry[] = [
  {
    prefectureCode: 'tokyo',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校等授業料軽減助成金（都の制度）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '生徒・保護者ともに都内に住所を有すること（都外の私立高校に通学する場合・進学のため都外へ' +
      '転居した場合も対象）。所得制限なし（2026-08-22時点の公式ページに明記）。国の就学支援金とは' +
      '別制度で、別途申請が必要。',
    subsidyAmountNote:
      '公式ページには具体的な金額（円/年）の記載はなく、「国の高等学校等就学支援金等と合わせて' +
      '都内私立高校平均授業料相当額まで支援」とのみ記載。具体的な金額は東京都私学財団のリーフレットで' +
      '確認する必要がある（未転記＝捏造回避）。',
    source: {
      url: 'https://www.seikatubunka.metro.tokyo.lg.jp/shigaku/hogosha/seido/highschool/0000000055',
      docTitle: '東京都生活文化局「私立高等学校等授業料軽減助成金（都の制度）」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。所得制限撤廃・都独自制度である旨は明記されているが、金額はリーフレット参照。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'osaka',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校等授業料支援補助金制度（大阪府）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '対象は私立高等学校（全日制・定時制・通信制）・株式会社立高等学校・私立専修学校高等課程。' +
      '令和8年度（2026年度）から所得制限が撤廃され、すべての生徒が対象になったと公式ページに明記。',
    subsidyAmountNote:
      '公式ページ自体には具体的な金額（円/年）の記載はなく、詳細は「令和8年度以降の授業料支援制度' +
      'について」という別ページへの案内のみ（未転記＝捏造回避）。',
    source: {
      url: 'https://www.pref.osaka.lg.jp/o180160/shigaku/shigakumushouka/index.html',
      docTitle: '大阪府「私立高校生等に対する授業料等の支援について」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。国の就学支援金制度と府独自の授業料支援補助金制度の両方を案内するページ。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kanagawa',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立学校学費支援制度（学費補助金）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '対象校に在学する生徒で、生徒・保護者等ともに神奈川県内に住所を有すること。ただし' +
      '「国の就学支援金・高校生等/新修学支援・学び直し支援金の受給資格を有していない者」は' +
      '対象から除外される（国制度への上乗せという位置付け）。',
    subsidyAmountNote:
      '公式ページには具体的な円額の記載がなく「補助額は下記リーフレット等をご確認ください」との' +
      '案内のみ。国制度の対象区分によって補助額が変動する旨が示唆されているが、数値は未転記（捏造回避）。',
    source: {
      url: 'https://www.pref.kanagawa.jp/docs/v3e/jyosei/gakuhisien/gakuhihojyo.html',
      docTitle: '神奈川県「学費補助金について」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'aichi',
    status: 'confirmed',
    confidence: 'high',
    programName: '愛知県私立高等学校等授業料軽減補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '生徒・保護者等が愛知県内に住所を有すること（仕事の都合で県外在住の場合は特例の可能性あり）。' +
      '所得制限の明示的な記載はなく、保護者等の課税標準額・市町村民税調整控除額に応じて補助額が' +
      '段階的に設定される。',
    subsidyAmountNote:
      '公式ページに学年別の上限額が直接記載されている: 全日制1年生 最大445,200円/年・' +
      '2年生 最大435,600円/年・3年生 最大428,400円/年・通信制1〜2年生 最大297,000円/年・' +
      '専修学校高等課程1年生 最大416,400円/年（いずれも実際に支払った授業料額が上限）。' +
      '※この金額は国の就学支援金と県補助を合わせた上限額であり、県負担分のみの内訳は公式ページに' +
      '直接記載されていない点に注意。',
    source: {
      url: 'https://www.pref.aichi.jp/soshiki/shigaku/aichi-koukoujugyouryouhojo.html',
      docTitle: '愛知県「愛知県私立高等学校等授業料軽減補助金」',
      lastChecked: '2026-08-22',
    },
    note: 'αバッチ中で唯一、公式ページに具体的な金額表が直接記載されていた県。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hyogo',
    status: 'confirmed',
    confidence: 'medium',
    programName: '私立高等学校等生徒授業料軽減補助制度（兵庫県）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '保護者等全員が兵庫県内に在住し、兵庫県内または近隣府県の全日制私立高校（通信制除く）に' +
      '在学していること。国の就学支援金制度への県単独補助の上乗せという位置付け（公式ページ' +
      'pa15_000000008.htmlで制度の実在を確認済み）。',
    subsidyAmountNote:
      '所得区分別の具体的な金額（年収目安590万円未満は64,000円/年・590〜730万円未満は120,000円/年・' +
      '730〜910万円未満は60,000円/年・多子世帯は1万円加算、という情報あり）はWebSearch要約由来で、' +
      '一次ソース（制度専用ページ）への直接WebFetchが404で失敗したため独立確認できていない。' +
      '金額は未確認情報として扱い、次回セッションでPDFリーフレット等から直接裏取りすること。',
    source: {
      url: 'https://web.pref.hyogo.lg.jp/kk35/pa15_000000008.html',
      docTitle: '兵庫県「私立高等学校等就学支援金制度」（国制度中心・県単独補助への言及ページ）',
      lastChecked: '2026-08-22',
    },
    note:
      '制度の実在自体は公式ページで確認済みだが、具体的な所得区分別金額は二次情報源のみで' +
      '一次ソース直接確認ができておらず、confidence: mediumに留める。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'chiba',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '千葉県独自の「私立高等学校等授業料減免制度」が存在した記録はあるが、2026年度（令和8年度）の' +
      '国の就学支援金拡充に伴い制度が廃止され、経過措置（令和8年度新入生・在校生のみ令和10年度まで' +
      '継続）に移行するという二次情報がある一方、公式サイトで発見したページ（josei-kyuufukin.html）は' +
      '別制度（高校生等奨学給付金）を扱っており、独自上乗せ制度の一次ソースに未到達。制度の現況' +
      '（廃止済みか経過措置中か）自体が不確実なため、無理に確定させず未確認のまま扱う。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'saitama',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「埼玉県私立高等学校等父母負担軽減事業補助制度」という県独自制度の名称は確認できたが、' +
      '2026年度から国の支援上限額が県内私立高校平均授業料を上回るため、県の上乗せ支援（特に授業料' +
      '部分）が見直し・縮小・廃止の対象になり得るという情報が錯綜しており、2026年度時点での制度の' +
      '存続状況・金額を一次ソースで確定できなかった。埼玉県公式ページ(shiritsu-gakuhi.html)は' +
      '次回セッションで直接WebFetchして裏取りする必要がある。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukuoka',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「学校納付金軽減費（月額9,900円・高校によって異なる）」という県独自と思われる補助への言及が' +
      'あったが、この情報はWebSearch要約のみに基づき、一次ソース（福岡県庁公式ページ）での直接確認が' +
      'できていない。検索でヒットした公式ページ（sigaku-shugakushienkin.html等）は主に国の就学支援金の' +
      '説明であり、独自制度の詳細ページには未到達。次回セッションで福岡県私学振興・青少年育成局の' +
      'ページを直接WebFetchで確認する必要がある。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hokkaido',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      'WebSearch要約は「年収目安590万円未満の世帯に月額最大2,000円（年24,000円）の道独自上乗せ」と' +
      '主張したが、WebFetchで実際に開いたページ（dokyoi.pref.hokkaido.lg.jp/hk/kki/162174.html）は' +
      '「公立高等学校等の就学支援金についてのページ」であり、私立高校向けの制度は「北海道庁学事課の' +
      'ページ」への案内のみで一次ソースに到達できなかった。金額は未確認のまま採用しない（捏造回避）。' +
      '次回セッションは北海道庁生活文化局学事課の私立高校担当ページを直接特定すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shizuoka',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '静岡県公式サイトで発見できたのは「静岡県私立高等学校等奨学給付金」（低所得世帯向けの授業料以外の' +
      '教育費を支援する給付金・Y-9のスコープである「授業料の上乗せ補助」とは別制度）のページのみ。' +
      '授業料そのものへの県独自上乗せ補助制度の一次ソースには到達できなかった（WebSearch要約にあった' +
      '所得区分別金額は出典未確認のため不採用）。次回セッションで静岡県庁私学振興課の授業料補助ページを' +
      '直接特定すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamagata',
    status: 'confirmed',
    confidence: 'high',
    programName: '山形県独自の授業料軽減補助',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '山形県内の私立高等学校に在学する生徒（平成26年度以降入学者）。市町村民税の課税標準額に基づく' +
      '計算式で区分され、公式ページには具体的な所得区分名は記載されていない。',
    subsidyAmountNote:
      '公式ページに国の就学支援金と合算した月額が具体的に記載されている: 「月額34,000円（うち1,000円が' +
      '山形県独自の授業料軽減補助）」「月額22,000円（うち12,100円が山形県独自の授業料軽減補助）」の' +
      '2区分を確認。県独自分の手続きは別途申請が必要と明記。',
    source: {
      url: 'https://www.pref.yamagata.jp/020023/syuugakusienkin.html',
      docTitle: '山形県「山形県私立高等学校就学支援金制度について」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。県独自の上乗せ部分の金額が明記されている数少ない県。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'niigata',
    status: 'confirmed',
    confidence: 'high',
    programName: '新潟県私立高等学校等学費軽減事業補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '基準日に新潟県内に本校がある私立高等学校に在学し、生徒本人および保護者等全員が新潟県内に住所を' +
      '有すること。所得に応じて「定額軽減分」「第2子以降支援分」「全額軽減分」「施設整備費等一部軽減」' +
      '「入学金軽減」の複数区分に分かれる。',
    subsidyAmountNote:
      '公式ページに区分別の金額が具体的に記載: 定額軽減分(年収目安590万〜910万円相当)は全日制24,000円/' +
      '通信制18,000円、全額軽減分(年収目安350万円未満相当・生活保護)は全日制396,000円等から就学支援金' +
      'を控除した額、施設整備費等一部軽減・入学金軽減(年収目安270万円未満相当)はそれぞれ23,800円・' +
      '73,700円。第2子以降支援分は所得に応じ全日制142,800〜395,760円等。',
    source: {
      url: 'https://www.pref.niigata.lg.jp/sec/daigaku/1356778452895.html',
      docTitle: '新潟県「私立高校等への学費軽減制度概要」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。区分数が多く金額も明記されており今回調査した20県中最も詳細。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'tochigi',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校等授業料減免事業',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '保護者等の市町村民税所得割が非課税である場合、生活保護を受けている場合、または保護者が交通事故・' +
      '病気・失職等により収入が減少し授業料の納入が困難な状況にある場合。学校法人が個別に減免を行い、' +
      '県がその減免事業に補助する仕組み。',
    subsidyAmountNote:
      '円建ての具体的な金額は公式ページに記載されていない。「学校法人が行う授業料減免総額の10分の9の額」' +
      'を県が補助する割合表記のみで、生徒個人が受け取る実額は学校ごとの減免額次第（捏造回避のため' +
      '割合のまま記録）。',
    source: {
      url: 'https://www.pref.tochigi.lg.jp/b05/question/kyouiku/shiritsu/qa0105356.html',
      docTitle: '栃木県「私立高校の授業料の免除を受けたい」（Q&Aページ）',
      lastChecked: '2026-08-22',
    },
    note:
      '学校法人経由の減免を県が10分の9補助する「学校法人補填型」の制度。家庭直接給付型（山形・新潟）とは' +
      '設計が異なる点をnoteに明記。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'aomori',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（Aomori_syugakushien.html）をWebFetchで直接確認したが、県独自制度として記載があったのは' +
      '「就学支援費補助金（県）」のみで、これは授業料でなく**入学金**に対する支援（国の就学支援金受給資格者で' +
      '年収目安270万円未満・年額50,000円）だった。Y-9のスコープである授業料そのものへの県独自上乗せ制度は' +
      '確認できず、無理に確定させず未確認のまま扱う。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'iwate',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（1006750.html・1006751/1006752.html）を2つ直接WebFetchで確認したが、いずれも国の' +
      '就学支援金・高校生等臨時支援金の説明のみで、県独自の授業料上乗せ制度の記載は無かった。WebSearch要約は' +
      '「年収目安590万〜620万円未満の世帯に月額11,550円を上限に授業料減免」という具体的数値を提示したが、' +
      '該当する一次ソースに到達できず裏取りできないため不採用（捏造回避）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'miyagi',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（shuugakushienkin.html）をWebFetchで直接確認したが、国の就学支援金・高校生等新修学支援金・' +
      '学び直し支援金・専攻科支援金の4制度のみで県独自の上乗せ制度の記載は無かった。「私立学校授業料等軽減' +
      '特別事業補助金」というタイトルのページも発見したが、URL（saigai-151019hisai-genmen-s.html）から東日本' +
      '大震災の被災者向け特例制度である可能性が高く、現行の一般制度として扱ってよいか確認できないため今回は' +
      '未着手のまま未確認とした。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'akita',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '秋田県公式サイト（pref.akita.lg.jp）を複数検索したが、見つかったのは国の就学支援金の説明・低所得世帯' +
      '向け奨学給付金・「あきた私学魅力アップ支援事業費補助」（学校運営費補助・生徒個人への授業料上乗せでは' +
      'ない）のみで、授業料そのものへの生徒向け県独自上乗せ制度の一次ソースには到達できなかった。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukushima',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '福島県公式サイトを複数ページ（zaimu19/20/21.html・shigaku21.html・koukoukyoiku22.html）確認したが、' +
      'zaimu系ページは県立高校（公立）の授業料減免制度、shigaku21.htmlは私立**中学校**生徒向けの就学支援' +
      'ページで対象外だった。WebSearch要約は「授業料軽減を行っている私立高校等に県が補助」という一般論を' +
      '述べたが、具体的な制度名・金額を記載した一次ソースには到達できなかった。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'ibaraki',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '茨城県教育委員会サイト（kyoiku.pref.ibaraki.jp）の「私立学校向けの軽減制度」ページをWebFetchで直接' +
      '確認したが、記載されていたのは「私立高等学校等入学金減免事業」（入学金）・「私立中学校等授業料軽減' +
      '事業」（中学校）・「家計急変者への授業料軽減補助」（家計急変世帯限定）の3制度のみ。通常の所得区分に' +
      'よる私立**高校**の授業料そのものへの一般的な県独自上乗せ制度は確認できなかった。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'gunma',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「私立高等学校等授業料減免事業補助金」という制度名は、pref.gunma.jpドメインの検索結果一覧' +
      '（Google側のインデックスタイトル）で確認でき、群馬県私学・青少年課が学校法人の授業料減免事業に補助を' +
      '行う制度（栃木型に近い設計）である可能性が高い。しかし該当URL（pref.gunma.jp/03/a3510005.html）へ' +
      'の直接WebFetchが404で失敗し、内容（対象・補助割合等）を一次ソースで確認できなかった。次回セッションは' +
      'pref.gunma.jp/cate_list/ct00001498.html（私立学校等の一覧ページ）経由で現在の正しいURLを再探索すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'toyama',
    status: 'confirmed',
    confidence: 'high',
    programName: '富山県私立高等学校等授業料助成・入学時納付金助成（県単独上乗せ分）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '県内私立全日制高校に在学し、保護者等が富山県内に住所を有すること。年収目安590万〜910万円未満世帯、' +
      'または多子世帯（23歳未満の子3人以上扶養）・ひとり親世帯、年収目安270万円未満世帯（住民税所得割' +
      '非課税世帯）等、複数の所得区分に分かれる。家計急変世帯への支援言及もあり。',
    subsidyAmountNote:
      '公式ページに具体的金額が直接記載: 年収590万〜910万円未満世帯は授業料助成79,200円/年、同区分の' +
      '多子・ひとり親世帯は277,200円/年。入学時納付金助成は年収270万円未満世帯・年収910万円未満の多子/' +
      'ひとり親世帯に124,350円。',
    source: {
      url: 'https://www.pref.toyama.jp/1119/kurashi/kyouiku/gakkou/shuugakushien/kj00015295.html',
      docTitle: '富山県／高等学校等就学支援金制度について（私立）',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。複数の所得区分・世帯類型に応じた金額が具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'ishikawa',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「石川県教育費負担軽減奨学金（私立学校）」という制度をWebFetchで直接確認したが、対象経費が授業料か' +
      '授業料以外の教育費かがページに明記されておらず、具体的な補助金額の記載も無かったため、Y-9のスコープ' +
      '（授業料そのものへの上乗せ）に該当するか判定不可。「高等学校等就学支援金制度について（公立高等学校分）」' +
      'ページ（jyugyouryou.html）は公立向けのみで私立の県独自制度の記載は無かった。次回セッションは石川県' +
      '私学振興室の私立高校授業料専用ページを再探索すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'fukui',
    status: 'confirmed',
    confidence: 'high',
    programName: '福井県の学納金減免制度（私立高等学校等の授業料等の減免補助）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '福井県認可の私立高等学校・高等課程を有する私立専修学校の生徒（広域通信制高校は福井県在住が必要）。' +
      '年収目安270万円未満（住民税所得割非課税）・年収目安350万円未満（算定基準額51,300円未満）・' +
      '年収目安590万円未満（算定基準額154,500円未満）の3区分。',
    subsidyAmountNote:
      '公式ページに区分別の金額が直接記載: 270万円未満は年額90,000円（月額7,500円）・350万円未満は' +
      '年額45,000円（月額3,750円）・590万円未満は年額30,000円（月額2,500円）。',
    source: {
      url: 'https://www.pref.fukui.lg.jp/doc/daishi/syugakusien.html',
      docTitle: '福井県「私立高等学校等の授業料等の減免補助について（私立高等学校等就学支援事業補助金）」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。区分別の具体的な円額が明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamanashi',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（shigaku-kgk/shuugaku/koukousei.html）をWebFetchで直接確認したが、記載されていたのは' +
      '「入学金・入学準備サポート事業給付金」（授業料でなく入学金・制服等が対象）・「奨学給付金」（授業料以外の' +
      '教育費対象）・国の就学支援金/学び直し支援金のみで、授業料そのものへの県独自上乗せ制度は確認できなかった。' +
      'WebSearch要約は「世帯所得に応じ段階的支給」という一般論を述べたが、一次ソースに具体的な記載が無く不採用。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'nagano',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校授業料等軽減事業補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '長野県内の学校法人が設置する私立高等学校等（全日制・通信制）・私立中等教育学校後期課程・私立専修学校' +
      '高等課程に在籍。授業料軽減は「就学支援金の受給期間を満了した者」または「支給対象単位数が74単位を超えた' +
      '者」が対象。入学金軽減は保護者等の年収目安が約590万円（家計急変時は約910万円）未満かつ長野県内在住が' +
      '条件。',
    subsidyAmountNote:
      '栃木県と同型の「学校法人補填型」——県から家庭へ直接支給されるのではなく、学校が行う軽減に県が補助する' +
      '仕組み（公式ページに「県から直接、家庭へ補助金を支給することはありません」と明記）。授業料補助は' +
      '「授業料年額（上限337,200円）から就学支援金等を控除した額」、入学金補助は24,500円。',
    source: {
      url: 'https://www.pref.nagano.lg.jp/ken-manabi/20141029.html',
      docTitle: '長野県「私立高等学校授業料等軽減事業補助金」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。栃木型（学校法人補填型）と同系統の制度設計。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'gifu',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「岐阜県私立高等学校等授業料軽減補助金」という制度名・具体的金額（4人世帯年収271.6万円未満で1人め' +
      '142,600円・2人め152,000円）はWebSearch要約や国際学校サイトのPDF(gifu-kokusai.denpa.jp)経由でのみ' +
      '確認でき、pref.gifu.lg.jp上の一次ソースページに直接到達できなかった（見つかった公式ページはいずれも' +
      '奨学給付金＝授業料以外の教育費対象、または公立高校向けだった）。裏取り不十分のため不採用・unconfirmed。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'mie',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（common/04/ci600005829.htm・SIGAKU/HP/shigaku/83230021363_00003.htm）を2つWebFetchで' +
      '直接確認したが、記載されていたのは国の就学支援金・奨学給付金・県の入学金補助金（1/2・上限25,000円）' +
      'のみで、県独自の授業料上乗せ補助制度の記載は見つからなかった。WebSearch要約にあった「2024年度より' +
      '年収590万〜910万円未満世帯に12,000円/年」という数値は一次ソースで裏取りできず不採用（捏造回避）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shiga',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「私立高校生等の保護者負担軽減補助事業」「滋賀県私立学校特別修学補助金」という2つの候補ページ' +
      '（kyouiku/10988.html・kyouiku/315123.html）をWebFetchで直接確認しようとしたが、いずれも404で内容を' +
      '確認できなかった（URLが変更・削除された可能性）。WebSearch要約にあった「県独自の授業料補助金59,400円' +
      '(年額)上乗せ」という数値は一次ソースで裏取りできず不採用。次回セッションは滋賀県教育委員会の私立学校' +
      '担当ページを検索経由で再探索すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kyoto',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校あんしん修学支援事業（府制度）',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '保護者が京都府内に在住し、京都府認可の私立高等学校に在籍していること。判定式は' +
      '「地方税の課税標準額×6％−市町村民税の調整控除額」が154,500円未満であること。',
    subsidyAmountNote:
      '公式ページに世帯区分別の年額上限（国の就学支援金との合算額）が直接記載: 生活保護世帯980,000円・' +
      '年収目安590万円未満世帯650,000円・年収590万円以上かつ同時在学の兄弟姉妹がいる場合559,000円。' +
      'これ以外の中間所得区分の金額はこのページの抜粋からは確認できず、次回セッションでの追加確認対象とする。',
    source: {
      url: 'https://www.pref.kyoto.jp/bunkyo/1335331059139.html',
      docTitle: '京都府「私立高等学校に通学される場合の支援制度について」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。判定式・金額とも具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'nara',
    status: 'confirmed',
    confidence: 'medium',
    programName: '私立高等学校授業料等軽減補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '子どもが奈良県内の私立高等学校に在学し、保護者等が奈良県内に住所を有すること。高校生等就学支援金' +
      '（経過措置含む）または高校生等・新修学支援金の支給対象であること。令和8年度（2026年度）から所得制限を' +
      '撤廃したと公式ページに明記。',
    subsidyAmountNote:
      '公式ページ本文には所得区分別の具体的な円額の記載がなく、「対象校の授業料等一覧」という別添PDFを参照する' +
      '案内のみだったため、金額は未転記（捏造回避）。制度の実在・対象要件は一次ソースで確認済みのため' +
      'status:confirmedとするが、金額未確認のためconfidence:mediumに留める。',
    source: {
      url: 'https://www.pref.nara.lg.jp/n056/54792.html',
      docTitle: '奈良県「私立高等学校へ通う方への補助について」',
      lastChecked: '2026-08-22',
    },
    note:
      '制度の実在・対象要件（所得制限撤廃）は公式ページで確認済みだが、具体的な金額は別添PDF参照のみで' +
      'ページ本文に無く、次回セッションでPDFを直接確認すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'wakayama',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（gakkou/shigaku_futankeigen.html）をWebFetchで直接確認したが、記載されていたのは' +
      '国の就学支援金の説明のみで、和歌山県独自の授業料上乗せ・軽減補助制度の記載は見つからなかった' +
      '（奨学のための給付金は授業料以外の教育費が対象のため別枠・本ファイルのスコープ外）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'tottori',
    status: 'confirmed',
    confidence: 'medium',
    programName: '鳥取県私立高等学校等総合支援金制度',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote: '国の就学支援金受給者の一部を対象に上乗せ補助を行う制度（公式ページに明記）。',
    subsidyAmountNote:
      '公式ページ（私立学校等の授業料等支援制度（給付型）・309270.htm）には制度名と概要のみが記載され、' +
      '所得区分別の具体的な金額は「総合支援金制度概要リーフレット（PDF）」参照の案内のみでページ本文に' +
      '無いため、金額は未転記（捏造回避）。',
    source: {
      url: 'https://www.pref.tottori.lg.jp/309270.htm',
      docTitle: '鳥取県「私立学校等の授業料等支援制度（給付型）」',
      lastChecked: '2026-08-22',
    },
    note:
      '制度の実在は公式ページで確認済みだが、金額はリーフレットPDF参照のみでページ本文に無く、' +
      '次回セッションでPDFを直接確認すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'shimane',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立中学校・高等学校の授業料減免制度',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '家計急変以外の場合、市町村民税の課税標準額×6%−調整控除の額が0円となる世帯（年収目安270万円未満程度）。' +
      '家計急変時も同様の基準を適用。',
    subsidyAmountNote:
      '円建ての固定額ではなく、「月額授業料−就学支援金の額（38,100円）」＝授業料から国の就学支援金を' +
      '差し引いた残額の全額を県が減免する差額補填型の仕組み（公式ページに明記）。',
    source: {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/shiritu/shiritu/shigakugenmen.html',
      docTitle: '島根県「私立中学校・高等学校の授業料減免制度」',
      lastChecked: '2026-08-22',
    },
    note:
      '差額補填型（授業料実費−就学支援金の残額を全額減免）と公式ページで直接確認済み。栃木・長野の' +
      '「学校法人補填型」に近いが、対象を極めて低所得の世帯に絞る点が異なる。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'okayama',
    status: 'confirmed',
    confidence: 'high',
    programName: '私立高等学校納付金減免補助金制度',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '認定額（市町村民税課税標準額から算出）に応じ3区分。0円→年収目安270万円未満程度、' +
      '51,300円未満→270〜350万円未満程度、154,500円未満→350〜590万円未満程度。',
    subsidyAmountNote:
      '公式ページに区分別の金額が直接記載: 年収270万円未満程度の世帯は年額60,000円以内（月5,000円）、' +
      '270〜350万円未満程度は年額48,000円以内（月4,000円）、350〜590万円未満は年額24,000円以内（月2,000円）。',
    source: {
      url: 'https://www.pref.okayama.jp/page/detail-81814.html',
      docTitle: '岡山県「就学支援制度の概要」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。区分別の金額が具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'hiroshima',
    status: 'confirmed',
    confidence: 'medium',
    programName: '授業料等軽減補助金制度',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote: '県が国の就学支援金に上乗せして助成する制度であることは公式ページに明記されている。',
    subsidyAmountNote:
      '公式ページ本文には通常の高等学校（全日制等）向けの所得区分別の具体的な金額は記載されておらず、' +
      '「支給要件等の詳細はこちら（リーフレット）」というPDF参照の案内のみ。専攻科向けの金額（授業料全額' +
      '軽減41,100円等）は記載されているが、これは専攻科限定であり通常課程の金額として転記しない（捏造回避）。',
    source: {
      url: 'https://www.pref.hiroshima.lg.jp/soshiki/44/jugyouryoukeigen.html',
      docTitle: '広島県「令和８年度 私立高等学校等授業料等の負担軽減について」',
      lastChecked: '2026-08-22',
    },
    note:
      '制度の実在・上乗せの仕組みは公式ページで確認済みだが、通常課程向けの具体的な金額はリーフレットPDF' +
      '参照のみでページ本文に無く、次回セッションでPDFを直接確認すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'yamaguchi',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式FAQページ（faq.pref.yamaguchi.lg.jp/faq/detail.aspx?id=799）を本文全体まで精読したが、' +
      '「私立高等学校授業料等減免制度」という名称の制度は実際には**入学金減免のみ**（上限70,000円・' +
      '市町村民税所得割額合算85,500円未満が対象）で、授業料そのものへの県独自上乗せ制度は記載が無かった。' +
      'WebSearch要約が提示した「授業料の補助：生活保護世帯19,800円/年・590〜610万円世帯79,200円/年」という' +
      '数値は公式ページで裏取りできず不採用（捏造回避）。制度名に「授業料等」を含んでいても中身が入学金限定' +
      'という今回初めてのパターンを確認。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'tokushima',
    status: 'confirmed',
    confidence: 'medium',
    programName: '徳島県私立高等学校等授業料軽減事業補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '県内私立高校在学・保護者が徳島県内在住。学校が授業料を軽減する場合に県が学校の設置者へ補助金を' +
      '交付する仕組みであることが公式ページに明記されている（栃木・長野・島根と同型の学校経由の補填型）。',
    subsidyAmountNote:
      '公式ページには制度の仕組みのみが記載され、所得区分別の具体的な金額はPDFリンク参照の案内のみで' +
      'ページ本文に無いため、金額は未転記（捏造回避）。',
    source: {
      url: 'https://www.pref.tokushima.lg.jp/ippannokata/kyoiku/gakkokyoiku/2009021800079/',
      docTitle: '徳島県「私立高等学校等の授業料軽減補助事業について」',
      lastChecked: '2026-08-22',
    },
    note:
      '制度の実在・学校経由の補填の仕組みは公式ページで確認済みだが、具体的な金額はPDF参照のみで' +
      'ページ本文に無く、次回セッションでPDFを直接確認すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kagawa',
    status: 'confirmed',
    confidence: 'high',
    programName: '香川県私立高等学校入学金軽減補助・香川県私立中学校家計急変世帯支援補助金',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '入学金軽減補助: 市町村民税課税標準額が154,500円未満（年収目安590万円未満程度）。' +
      '家計急変世帯支援補助金: 家計急変により年収目安が約400万円未満相当まで減少し、資産保有額が700万円未満。',
    subsidyAmountNote:
      '入学金軽減補助: 全日制高校50,000円・通信制高校15,000円（入学金の減免）。家計急変世帯支援補助金: ' +
      '最大月額28,000円の授業料支援。いずれも公式ページに直接記載。なお恒常的な低〜中所得世帯向けの一般的な' +
      '授業料軽減補助（WebSearch要約にあった月額9,900円等）はこのページでは確認できず、別ページの可能性が' +
      'あるため今回は含めない（捏造回避）。',
    source: {
      url: 'https://www.pref.kagawa.lg.jp/somugakuji/sigaku/keigen/wm2lwo161129132815.html',
      docTitle: '香川県「私立高等学校等の授業料等の負担軽減について」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。入学金軽減・家計急変世帯支援とも金額が具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'ehime',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '私学文書課の学校一覧ページ（page/5107.html）をWebFetchで確認したが学校名簿情報のみで、' +
      '授業料補助制度に関する記載は無かった。奨学のための給付金（授業料以外が対象）以外に、県独自の' +
      '授業料上乗せ補助制度の一次ソースページには今回到達できなかった。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kochi',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「高知県私立学校授業料減免補助金交付要綱の一部改正について」（soshiki/140901/2021051500026.html）を' +
      'WebFetchで確認したが、私学・大学支援課の業務案内のみで制度名・対象要件・具体的な金額の記載は' +
      '無かった（交付要綱そのもののPDFに詳細がある可能性が高いが、今回はページ本文からの確認に留めた）。' +
      'WebSearch要約が提示した「350万円未満36,000円/年・590〜700万円未満97,200円/年」という数値は' +
      '公式ページ本文で裏取りできず不採用（捏造回避）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'oita',
    status: 'confirmed',
    confidence: 'high',
    programName: '大分県私立高等学校授業料減免支援制度',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '4区分: ①年収目安590万〜910万円未満世帯（高等学校等就学支援金の認定月額が9,900円） ' +
      '②住民税非課税世帯のうち授業料月額が33,000円を超える私立学校に在学 ③私立高等学校専攻科生' +
      '（多子世帯除く・道府県民税所得割額と市町村民税所得割額の合算額が85,000円以上257,500円未満） ' +
      '④天災その他不慮の災害等による家計急変世帯。',
    subsidyAmountNote:
      '公式ページに区分別の金額が直接記載: ①月額10,000円 ②月額2,000円 ③月額5,000円 ④月額10,000円。',
    source: {
      url: 'https://www.pref.oita.jp/soshiki/11830/syugakushienkin.html',
      docTitle: '大分県「私立高等学校等の授業料支援制度」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。区分別の月額が具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'saga',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（kiji00363113/index.html「【私立】高等学校等就学支援金制度」）をWebFetchで直接確認したが、' +
      '国の就学支援金制度の説明のみで、佐賀県独自の授業料上乗せ・軽減補助制度の記載は見つからなかった' +
      '（「佐賀県高校生等奨学給付金」は授業料以外の教育費が対象のため別枠・本ファイルのスコープ外）。' +
      'WebSearch要約にあった「入学金等補助制度」は入学金のみが対象とみられ授業料の上乗せとは別制度。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'nagasaki',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '「私立高校の授業料等への補助制度について」（pref.nagasaki.jp/bunrui/kanko-kyoiku-bunka/shochuko/jugyoryo/）' +
      'という長崎県公式ページのタイトル自体はY-9のスコープに合致するが、WebFetch・curl(iPhone UA)いずれで' +
      '取得してもページ本体が空のカテゴリ一覧シェル（動的読み込みで内容が別途取得される構成とみられる）で、' +
      '制度名・金額を本文から直接確認できなかった。WebSearch要約が提示した「生活保護世帯等は年額63,600円・' +
      '年収590〜720万円未満は年額79,200円」という数値は私立学校側サイト(kokoromirai.ed.jp)のPDF由来で' +
      '県公式一次ソースでの裏取りができていないため不採用（捏造回避）。次回セッションはこのページ配下の' +
      '子ページURLを個別に探索すること。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kumamoto',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（soshiki/11/50829.html「熊本県高等学校等就学支援金及び臨時支援金について」）をWebFetchで' +
      '直接確認したが、国の就学支援金・臨時支援金の説明のみで、熊本県独自の授業料上乗せ制度の記載は' +
      '見つからなかった（「熊本県奨学のための給付金」は教科書費等の授業料以外の教育費が対象のため別枠・' +
      '本ファイルのスコープ外）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'miyazaki',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（20230815143411.html「高等学校等就学支援金（私立高等学校等）について」）をWebFetchで' +
      '直接確認したが、国の就学支援金制度の説明のみで、宮崎県独自の授業料上乗せ制度の記載は見つからなかった' +
      '（「宮崎県私立高等学校等奨学給付金」は授業料以外の教育費が対象のため別枠・本ファイルのスコープ外）。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'kagoshima',
    status: 'confirmed',
    confidence: 'high',
    programName: '鹿児島県私立高等学校授業料軽減費補助',
    type: 'grant',
    targetCourse: 'private',
    eligibilityNote:
      '生活保護世帯・住民税非課税世帯・住民税均等割のみ課税世帯・養護施設等入所生徒の授業料負担者・' +
      '災害被害者のいずれかに該当すること。',
    subsidyAmountNote:
      '公式ページに区分別の月額が直接記載: 生活保護世帯8,000円/月・非課税世帯4,950円/月・均等割のみ' +
      '課税世帯4,950円/月。別枠の入学金軽減制度（非課税世帯等5,650円）も同ページに記載。',
    source: {
      url: 'https://www.pref.kagoshima.jp/ab04/kyoiku-bunka/school/shiritu/sigaku.html',
      docTitle: '鹿児島県「私立高等学校に在学する生徒に対する修学支援」',
      lastChecked: '2026-08-22',
    },
    note: 'WebFetchで公式ページを直接確認済み。区分別の月額が具体的に明記されている。',
    investigatedAt: '2026-08-22',
  },
  {
    prefectureCode: 'okinawa',
    status: 'unconfirmed',
    confidence: 'low',
    note:
      '公式ページ（1008850.html「高等学校等就学支援金・学び直し支援金（授業料無償）」）をWebFetchで直接' +
      '確認したが、対象は県立高等学校（公立）に限定されており、私立高校向けの沖縄県独自の上乗せ制度の' +
      '記載は見つからなかった（「奨学のための給付金」は授業料以外の教育費が対象のため別枠・本ファイルの' +
      'スコープ外）。',
    investigatedAt: '2026-08-22',
  },
];
