/**
 * 地域模試（Vもぎ・Wもぎ・北辰テスト・五ツ木模試・新教研）の一般公開情報に基づく概要データ。
 *
 * ⚠️ 特定校の合格ボーダー・偏差値換算表は一切含めない（信頼の堀・捏造ゼロ）。
 * 運営会社・対象地域・沿革など、各社の公式サイト等で一般に公開されている情報のみを扱う。
 * 「模試どうしの換算」は運営元が公表していないため、当サイトでも数値換算表は作らない。
 *
 * scheduleRounds は各社公式サイトで実在確認できた日程のみを掲載する（W-3・2026-07-17実施の再調査）。
 * 公式サイトが年間表を公開していない/機械可読に取得できなかった場合は scheduleNote に理由を明記し、
 * 日付を推測・断定しない（過去年度のキャッシュページを誤って現年度として載せる事故を防ぐため、
 * ページ内の言及と現在日付の整合性を確認した上で採用している）。
 */

export interface MockExamScheduleRound {
  round: string;
  date: string;
}

export interface MockExamInfo {
  key: string;
  name: string;
  operator: string;
  regions: string[];
  grade: string;
  summary: string;
  scheduleSourceUrl: string;
  scheduleVerifiedDate: string;
  scheduleRounds?: MockExamScheduleRound[];
  scheduleNote?: string;
}

export const MOCK_EXAMS: MockExamInfo[] = [
  {
    key: 'v-mogi',
    name: 'Vもぎ（V模擬）',
    operator: '株式会社進学研究会',
    regions: ['東京都', '千葉県'],
    grade: '主に中学3年生（都立・私立高校を目指す受験生向け）',
    summary: '都立高校の入試を意識した構成で知られる模擬試験。年間を通じて複数回実施され、8月以降は本番の出題形式に近い回もあります。',
    scheduleSourceUrl: 'https://www.shinken.co.jp/vmogi/order/once',
    scheduleVerifiedDate: '2026-07-17',
    scheduleRounds: [
      { round: '都立Vもぎ', date: '6月7日(日)・7月12日(日)' },
      { round: '県立Vもぎ', date: '6月7日(日)・7月12日(日)' },
      { round: '都立そっくりもぎ', date: '8月30日〜1月17日の日曜日（全14回）' },
      { round: '県立そっくりもぎ', date: '8月30日〜1月10日の日曜日（全9回）' },
      { round: '私立Vもぎ', date: '9月13日・10月4日・11月1日・12月6日' },
      { round: '都立自校作成対策もぎ', date: '10月18日・11月15日・12月13日・1月10日' },
    ],
  },
  {
    key: 'w-mogi',
    name: 'Wもぎ（W合格もぎ）',
    operator: '新教育研究協会',
    regions: ['東京都', '神奈川県'],
    grade: '主に中学3年生（都立・県立・私立高校を目指す受験生向け）',
    summary: '問題構成・配点・解答用紙のレイアウトなど、入試本番に近い形式で実施される模擬試験として知られています。',
    scheduleSourceUrl: 'https://www.schoolguide.ne.jp/mogisiken/schedule/',
    scheduleVerifiedDate: '2026-07-17',
    scheduleNote:
      '公式サイトの「年間開催予定と出題範囲」ページはJavaScript描画のため機械的な日程一覧の取得ができませんでした。都立もぎ・都立そっくりテスト・神奈川県入試そっくりもぎ等の種類は確認できましたが、具体的な日付は公式サイトで直接ご確認ください。',
  },
  {
    key: 'hokushin',
    name: '北辰テスト',
    operator: '北辰図書株式会社',
    regions: ['埼玉県'],
    grade: '中学1〜3年生（学年別の回が用意されている）',
    summary: '1952年開始、70年以上の歴史を持つ埼玉県の模擬試験。県内では中学3年生の多くが一度は受験するとされ、私立高校の「確約」（入試前の合格見込みのやり取り）にも関わる、埼玉県の高校受験で特に重要度の高い模試です。',
    scheduleSourceUrl: 'https://www.hokushin-t.jp/test/info/information.html',
    scheduleVerifiedDate: '2026-07-17',
    scheduleRounds: [{ round: '中3第3回', date: '7月19日(日)' }],
    scheduleNote:
      '公式サイトの最新情報ページで確認できた直近回のみ掲載しています。2026年度は中3が年8回・中2が年2回・中1が年1回実施予定（2027年1月に第8回）とアナウンスされていますが、全回の日付一覧は公式サイトの「年間予定表」で直接ご確認ください（過去年度の告知ページとの混同を避けるため、日付未確認の回は掲載していません）。',
  },
  {
    key: 'itsuki',
    name: '五ツ木模試（五ツ木・駸々堂模試）',
    operator: '五ツ木書房',
    regions: ['大阪府', '兵庫県', '京都府', '奈良県', '和歌山県'],
    grade: '中学1〜3年生（学年別の回が用意されている）',
    summary: '関西エリアで広く実施されている公開会場模試。関西の公立・私立高校を目指す受験生に幅広く利用されています。',
    scheduleSourceUrl: 'https://www.itsuki-s.co.jp/test/guide/schedule/',
    scheduleVerifiedDate: '2026-07-17',
    scheduleRounds: [
      { round: '第1回', date: '5月17日(日)' },
      { round: '第2回', date: '6月14日(日)' },
      { round: '第3回', date: '7月12日(日)' },
      { round: '第4回', date: '9月13日(日)' },
      { round: '第5回', date: '10月11日(日)' },
      { round: '第6回', date: '11月8日(日)' },
      { round: '第7回（特別回）', date: '12月13日(日)' },
      { round: '第8回（直前回）', date: '1月24日(日)' },
    ],
    scheduleNote: '中学3年生向けの日程です。中学1・2年生向けは別日程で実施されます（公式サイトをご確認ください）。',
  },
  {
    key: 'shinkyoken',
    name: '新教研（新教研テスト）',
    operator: '新教研',
    regions: ['茨城県'],
    grade: '中学1〜3年生（学校単位・塾単位での実施が中心）',
    summary: '茨城県の最新の入試傾向に沿って作成される模擬試験。学校や塾を通じて団体受験する形式が中心です。',
    scheduleSourceUrl: 'https://www.shinkyoken.co.jp/schedule/',
    scheduleVerifiedDate: '2026-07-17',
    scheduleRounds: [
      { round: '第1回', date: '3月21日〜4月5日' },
      { round: '第2回', date: '6月6日〜6月14日' },
      { round: '第3回', date: '8月15日〜8月30日' },
      { round: '第4回', date: '9月26日〜10月4日' },
      { round: '第5回', date: '10月24日〜11月1日' },
      { round: '第6回', date: '11月28日〜12月6日' },
      { round: '第7回', date: '12月26日〜1月10日' },
      { round: '第8回', date: '1月16日〜1月24日' },
    ],
    scheduleNote: '中学3年生向けの日程です（塾内実施のため受験期間として幅があります）。中学1・2年生は第6回までの実施です。',
  },
];
