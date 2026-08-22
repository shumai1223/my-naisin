/**
 * Y-9: 就学支援金・自治体上乗せDB（お金クラスタ第二の鉱脈）フェーズα。
 *
 * ## 背景
 * `src/lib/education-cost`は文部科学省「子供の学習費調査」と国の高等学校等就学支援金制度
 * （全国一律）のみを扱う単一ソース設計。しかし多くの都道府県は、国の就学支援金だけでは
 * まかないきれない私立高校の授業料差額に対し、**都道府県独自の上乗せ・軽減補助制度**を持つ
 * （通称は県により「授業料軽減助成金」「授業料支援補助金」「学費支援制度」等さまざま）。
 * 本ファイルはこれを都道府県別に構造化する第一段階（α・10県のみ）。
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
 * ## 次への引き継ぎ
 * 1. unconfirmedの5県（千葉・埼玉・福岡・北海道・静岡）の一次ソース再調査。
 * 2. confidence:mediumの兵庫の金額を一次ソース（PDFリーフレット等）で直接確認する。
 * 3. 残り37県への横展開（本ファイルの型・調査手法をそのまま踏襲できる）。
 * 4. `/kyouiku-hi`・`/shougakukin`群との結線（フロントエンド表示）は残り県数がある程度揃ってから。
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
];
