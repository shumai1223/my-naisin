/**
 * 内申点・高校入試の用語辞典データ（S-9・用語個別ページエンジン）。
 *
 * 従来は src/app/glossary/GlossaryClient.tsx にインライン定義され、/glossary（一覧ページ）
 * からしかアクセスできなかった（O-3で実証済みの「s値とは」101imp/pos9.1のような単一用語検索は
 * 一覧ページでは上位表示されにくい）。ここへ切り出して単一ソース化し、/glossary/[term]の
 * 個別ページ（generateStaticParamsで機械生成）と一覧ページの両方から同じデータを参照する。
 *
 * 新規データは一切追加していない（description/example/note/relatedPrefecturesは
 * 既存の手書きコンテンツをそのまま移設）。FAQは既存フィールドをQ&A形式に再構成するだけの
 * 決定論的な変換（buildGlossaryTermFaqs）＝捏造ゼロ。
 */

export interface GlossaryLink {
  label: string;
  href: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  reading: string;
  description: string;
  example: string;
  note: string;
  relatedPrefectures?: string;
  links?: GlossaryLink[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'su-naishin',
    term: '素内申（すないしん）',
    reading: 'すないしん',
    description: '9教科の5段階評定をそのまま合計した点数。倍率や傾斜配点を一切かけない、最もシンプルな内申点の表現方法です。',
    example: '全教科オール3の場合：3×9＝27点（45点満点）',
    note: '素内申はあくまで基本値であり、実際の入試では都道府県ごとの換算方法が適用されます。',
    relatedPrefectures: '全国共通の概念。ただし入試で「素内申のまま使う」県（埼玉・千葉など）と「換算する」県（東京・神奈川など）があります。',
    links: [
      { label: '都道府県別の計算方法を比較', href: '/blog/naishin-guide' },
      { label: '内申点を計算する', href: '/' },
    ],
  },
  {
    id: 'kansan-naishin',
    term: '換算内申（かんさんないしん）',
    reading: 'かんさんないしん',
    description: '素内申に対して、実技教科の倍率や学年ごとの重み付けを適用した後の点数。都道府県によって計算方法が異なります。',
    example: '東京都の場合：5教科はそのまま＋実技4教科×2倍＝65点満点。オール5なら 25＋(20×2)＝65点。',
    note: '「換算内申」という名称は主に東京都で使われます。他県では「評定合計」「調査書点」など呼び方が異なることがあります。',
    relatedPrefectures: '東京都（65点満点）、神奈川県（135点満点）、大阪府（450点満点）など、県により換算方法が大きく異なります。',
    links: [
      { label: '東京都の内申点を計算', href: '/tokyo/naishin' },
      { label: '神奈川県の内申点を計算', href: '/kanagawa/naishin' },
      { label: '大阪府の内申点を計算', href: '/osaka/naishin' },
    ],
  },
  {
    id: 'chousasho-ten',
    term: '調査書点（ちょうさしょてん）',
    reading: 'ちょうさしょてん',
    description: '入試本番で使用される、内申点を入試配点に換算した点数。総合点に占める「内申点の持ち点」にあたります。',
    example: '東京都立一般入試の場合：換算内申（65点満点）を300点満点に変換。換算内申50点なら調査書点＝50÷65×300≒230点。',
    note: '調査書点の満点は高校・方式によって異なります。配点比率（内申:学力）も確認が必要です。',
    relatedPrefectures: '東京都（300点満点）、神奈川県（学校ごとに比率が異なる）など。',
    links: [
      { label: '志望校から逆算する', href: '/reverse' },
      { label: '東京都の内申点を計算', href: '/tokyo/naishin' },
    ],
  },
  {
    id: 'k-chi',
    term: 'K値（けーち）',
    reading: 'けーち',
    description: '千葉県の公立高校入試で使用される、内申点と学力検査の総合評価指標。算式Kにより算出されます。',
    example: 'K＝ a×(内申点合計) ＋ b×(学力検査合計) という形式で、a・bの値は高校・検査ごとに異なります。',
    note: '千葉県独自の用語です。令和8年度以降の制度変更にも注意が必要です。最新情報は千葉県教育委員会で確認してください。',
    relatedPrefectures: '千葉県のみ。',
    links: [
      { label: '千葉県の内申点を計算', href: '/chiba/naishin' },
    ],
  },
  {
    id: 'kanten-hyouka',
    term: '観点別評価（かんてんべつひょうか）',
    reading: 'かんてんべつひょうか',
    description: '各教科の成績を「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の3観点で評価する仕組み。この3観点の評価を総合して5段階の評定が決まります。',
    example: '数学で「知識・技能：A」「思考・判断・表現：B」「主体的に学習に取り組む態度：A」→ 評定4、のように総合判断。',
    note: '2021年度から全国の中学校で3観点に統一されました。「主体的に〜」はテストだけでなく、提出物・授業態度・振り返りなども含まれます。',
    relatedPrefectures: '全国共通。ただし、観点別評価の通知表記載方法は学校によって異なります。',
    links: [
      { label: '内申点を上げる方法15選', href: '/blog/improve-grades-from-all-3' },
    ],
  },
  {
    id: 's-chi',
    term: 'S値（えすち）/ S1値・S2値',
    reading: 'えすち',
    description: '神奈川県の公立高校入試で使われる総合得点。S1値は1次選考（内申＋学力検査＋面接）、S2値は2次選考（学力検査＋面接）で使用されます。',
    example: 'S1 ＝ a×(内申) ＋ b×(学力検査) ＋ c×(面接) ＋ d×(特色検査)。a〜dの比率は学校ごとに異なります（合計10、各2以上）。',
    note: '比率は学校・学科ごとに異なります（2:8〜8:2）。特色検査がある学校では最大5が加算されます。',
    relatedPrefectures: '神奈川県のみ。',
    links: [
      { label: '神奈川県の内申点を計算', href: '/kanagawa/naishin' },
      { label: '神奈川県で逆算する', href: '/reverse?pref=kanagawa' },
    ],
  },
  {
    id: 'a-chi',
    term: 'A値（えーち）/ a値',
    reading: 'えーち',
    description: '神奈川県の内申点に関する指標。A＝中2の9教科評定合計＋中3の9教科評定合計×2（135点満点）。a値はAを100点満点に換算した値です。',
    example: '中2がオール4（36点）、中3がオール4（36点）の場合：A＝36＋36×2＝108点、a値＝108÷135×100＝80点。',
    note: 'a値は100点満点に正規化されるため、他の受験生との比較に使いやすい指標です。',
    relatedPrefectures: '神奈川県のみ。',
    links: [
      { label: '神奈川県の内申点を計算', href: '/kanagawa/naishin' },
    ],
  },
  {
    id: 'hyoutei',
    term: '評定（ひょうてい）',
    reading: 'ひょうてい',
    description: '各教科について1〜5の5段階（一部地域は1〜10の10段階）で付けられる成績評価。通知表の数字そのものです。',
    example: '英語の評定が「4」であれば、5段階中4の評価。内申点計算の基本単位になります。',
    note: '評定は絶対評価で付けられます（2002年度以降）。以前の相対評価とは異なり、クラスの人数割合に縛られません。',
    relatedPrefectures: '全国共通。高知県など一部は10段階評定を使用する場合もあります。',
    links: [
      { label: '都道府県別の計算方法を比較', href: '/blog/naishin-guide' },
      { label: '都道府県一覧', href: '/prefectures' },
    ],
  },
  {
    id: 'keisha-haiten',
    term: '傾斜配点（けいしゃはいてん）',
    reading: 'けいしゃはいてん',
    description: '特定の教科の内申点に倍率をかけて計算する方式。実技教科を重視する地域や、特定の教科を重視する高校で採用されます。',
    example: '東京都では実技4教科を2倍で計算（5教科×5点＋4教科×5点×2＝65点満点）。',
    note: '倍率は都道府県・高校によって異なります。「実技が苦手だから不利」とは限らず、得意教科の倍率が高い県を理解することが重要です。',
    relatedPrefectures: '東京都（実技2倍）、岩手県（5教科2倍・実技3倍）、北海道（学年に倍率）など。',
    links: [
      { label: '東京都の内申点を計算', href: '/tokyo/naishin' },
      { label: '実技4教科の内申点対策', href: '/blog/practical-subjects-naishin-strategy' },
    ],
  },
  {
    id: 'tokuiro-kensa',
    term: '特色検査（とくしょくけんさ）',
    reading: 'とくしょくけんさ',
    description: '神奈川県の一部の高校で実施される追加試験。教科横断的な思考力・判断力・表現力を問う問題や、実技・プレゼンテーションなどが出題されます。',
    example: '横浜翠嵐、湘南、柏陽などの進学校で実施。S値の比率に最大5が追加されます。',
    note: '特色検査の有無・内容は高校ごとに異なります。実施校は神奈川県教育委員会の発表で確認してください。',
    relatedPrefectures: '神奈川県のみ。',
    links: [
      { label: '神奈川県の内申点を計算', href: '/kanagawa/naishin' },
      { label: '神奈川県で逆算する', href: '/reverse?pref=kanagawa' },
    ],
  },
  {
    id: 'esat-j',
    term: 'ESAT-J（いーさっとじぇー）',
    reading: 'いーさっとじぇー',
    description: '東京都の中学校英語スピーキングテスト（English Speaking Achievement Test for Junior high school students）。都立高校入試の得点に加算されます。',
    example: '都立一般入試：内申300点＋学力検査700点＋ESAT-J 20点＝1020点満点。',
    note: 'ESAT-Jの結果は6段階のグレードで評価され、最大20点が加算されます。',
    relatedPrefectures: '東京都のみ。',
    links: [
      { label: '東京都の内申点を計算', href: '/tokyo/naishin' },
      { label: '東京都で逆算する', href: '/reverse?pref=tokyo' },
    ],
  },
];

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.id === id);
}

/** 用語名から「（読み）」部分を除いた見出し用の短い表記。 */
export function shortTermLabel(term: GlossaryTerm): string {
  return term.term.split('（')[0];
}

export interface GlossaryTermFaq {
  question: string;
  answer: string;
}

/**
 * 用語データ（description/example/note/relatedPrefectures）をQ&A形式へ機械変換する。
 * 新しい事実は追加しない＝既存の手書きコンテンツの再構成のみ（捏造ゼロ）。
 */
export function buildGlossaryTermFaqs(t: GlossaryTerm): GlossaryTermFaq[] {
  const label = shortTermLabel(t);
  const faqs: GlossaryTermFaq[] = [
    { question: `${label}とは何ですか？`, answer: t.description },
    { question: `${label}の具体例を教えてください`, answer: t.example },
  ];
  if (t.relatedPrefectures) {
    faqs.push({ question: `${label}は都道府県によって違いますか？`, answer: t.relatedPrefectures });
  }
  faqs.push({ question: `${label}を扱ううえでの注意点は？`, answer: t.note });
  return faqs;
}
