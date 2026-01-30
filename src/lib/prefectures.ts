// 都道府県別内申点計算方法
// 出典: https://alpha-katekyo.jp/tips/tips286/

export interface PrefectureConfig {
  code: string;
  name: string;
  region: string;
  // 対象学年 (1, 2, 3 の配列)
  targetGrades: number[];
  // 学年別の倍率 { 1: 倍率, 2: 倍率, 3: 倍率 }
  gradeMultipliers: Record<number, number>;
  // 5教科の倍率
  coreMultiplier: number;
  // 実技4教科の倍率
  practicalMultiplier: number;
  // 満点
  maxScore: number;
  // 説明文
  description: string;
  // 備考
  note?: string;
  // 10段階評価対応 (高知県など)
  supports10PointScale?: boolean;
  // 情報源URL（教育委員会等の公式ページ）
  sourceUrl?: string;
  // 情報源の表示名
  sourceTitle?: string;
  // 最終確認日 (YYYY-MM-DD形式)
  lastVerified?: string;
  // 対象年度
  fiscalYear?: string;
}

export const PREFECTURES: PrefectureConfig[] = [
  // 北海道・東北
  {
    code: 'hokkaido',
    name: '北海道',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 2, 2: 2, 3: 3 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 315,
    description: '中1・中2は2倍、中3は3倍（315点満点）',
    sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/koukounyuusenn.html',
    sourceTitle: '北海道教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'aomori',
    name: '青森県',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/senbatsu2025.html',
    sourceTitle: '青森県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'iwate',
    name: '岩手県',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 2, 3: 3 },
    coreMultiplier: 2,
    practicalMultiplier: 3,
    maxScore: 440,
    description: '5教科×2倍、実技4教科×3倍、学年比1:2:3（440点満点）',
    note: '660点×2/3で換算',
    sourceUrl: 'https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/index.html',
    sourceTitle: '岩手県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'miyagi',
    name: '宮城県',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '5教科×1倍、実技4教科×2倍（195点満点）',
    sourceUrl: 'https://www.pref.miyagi.jp/soshiki/koukyou/kakomon-ko-nyushi.html',
    sourceTitle: '宮城県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'akita',
    name: '秋田県',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '実技4教科は2倍（各学年65点×3＝195点満点）',
    sourceUrl: 'https://www.pref.akita.lg.jp/pages/genre/15415',
    sourceTitle: '秋田県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'yamagata',
    name: '山形県',
    region: '北海道・東北',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    sourceUrl: 'https://www.pref.yamagata.jp/700013/koko/20240214r7nyuugakusyasennbatu.html',
    sourceTitle: '山形県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'fukushima',
    name: '福島県',
    region: '北海道・東北',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '実技4教科は2倍（195点満点）',
    sourceUrl: 'https://www.pref.fukushima.lg.jp/site/edu/r7koukounyushi.html',
    sourceTitle: '福島県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  // 関東
  {
    code: 'ibaraki',
    name: '茨城県',
    region: '関東',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/',
    sourceTitle: '茨城県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'tochigi',
    name: '栃木県',
    region: '関東',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 500,
    description: '中1〜中3を500点満点に換算',
    note: '学校により配点が異なる',
    sourceUrl: 'https://www.pref.tochigi.lg.jp/kyouiku/gakkoukyouiku/nyuugakusenkou/index.html',
    sourceTitle: '栃木県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'gunma',
    name: '群馬県',
    region: '関東',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.gunma.jp/site/kyouiku/list66-367.html',
    sourceTitle: '群馬県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'saitama',
    name: '埼玉県',
    region: '関東',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 180,
    description: '学年比1:1:2で換算（180点満点が一般的）',
    note: '高校により1:1:3、1:2:3などもあり',
    sourceUrl: 'https://www.pref.saitama.lg.jp/f2208/nyuushi.html',
    sourceTitle: '埼玉県教育委員会 入試情報',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'chiba',
    name: '千葉県',
    region: '関東',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    note: 'K値（0.5〜2）で換算する高校もあり',
    sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/index.html',
    sourceTitle: '千葉県教育委員会 入試情報',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'tokyo',
    name: '東京都',
    region: '関東',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 65,
    description: '中3のみ：5教科×1倍＋実技4教科×2倍（65点満点）',
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/',
    sourceTitle: '東京都教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'kanagawa',
    name: '神奈川県',
    region: '関東',
    targetGrades: [2, 3],
    gradeMultipliers: { 1: 0, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中2＋中3×2倍（135点満点）',
    sourceUrl: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html',
    sourceTitle: '神奈川県教育委員会 入試情報',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  // 中部
  {
    code: 'niigata',
    name: '新潟県',
    region: '中部',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.niigata.lg.jp/sec/kotogakko/nyugakushasenbatsu.html',
    sourceTitle: '新潟県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'toyama',
    name: '富山県',
    region: '中部',
    targetGrades: [2, 3],
    gradeMultipliers: { 1: 0, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 150,
    description: '中2(45点)＋中3×2倍(90点)＋活動15点（150点満点）',
    sourceUrl: 'https://www.pref.toyama.jp/300201/kyouiku/kenritsukoukou/07senbatsu.html',
    sourceTitle: '富山県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'ishikawa',
    name: '石川県',
    region: '中部',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/senbatu.html',
    sourceTitle: '石川県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'fukui',
    name: '福井県',
    region: '中部',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7nyugaku.html',
    sourceTitle: '福井県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'yamanashi',
    name: '山梨県',
    region: '中部',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 2,
    practicalMultiplier: 3,
    maxScore: 330,
    description: '5教科×2倍、実技4教科×3倍（330点満点）',
    note: '特別活動等で+30点',
    sourceUrl: 'https://www.pref.yamanashi.jp/kyouiku-kikaku/nyuusi/saishinnonyuusijouhou.html',
    sourceTitle: '山梨県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'nagano',
    name: '長野県',
    region: '中部',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    sourceUrl: 'https://www.pref.nagano.lg.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '長野県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'gifu',
    name: '岐阜県',
    region: '中部',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 180,
    description: '中1・中2＋中3×2倍（180点満点）',
    sourceUrl: 'https://www.pref.gifu.lg.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '岐阜県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'shizuoka',
    name: '静岡県',
    region: '中部',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    sourceUrl: 'https://www.pref.shizuoka.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '静岡県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'aichi',
    name: '愛知県',
    region: '中部',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 90,
    description: '中3の9教科×5段階×2倍（90点満点）',
    sourceUrl: 'https://www.pref.aichi.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '愛知県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  // 近畿
  {
    code: 'mie',
    name: '三重県',
    region: '近畿',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    sourceUrl: 'https://www.pref.mie.lg.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '三重県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'shiga',
    name: '滋賀県',
    region: '近畿',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.shiga.lg.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '滋賀県教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'kyoto',
    name: '京都府',
    region: '近畿',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '中期選抜：実技4教科×2倍（195点満点）',
    note: '前期選抜は135点満点',
    sourceUrl: 'https://www.pref.kyoto.jp/kensei/koukou/nyuugaku.html',
    sourceTitle: '京都府教育委員会 入学者選抜',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'osaka',
    name: '大阪府',
    region: '近畿',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 3 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 450,
    description: '学年比1:1:3（450点満点）',
    sourceUrl: 'https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/',
    sourceTitle: '大阪府教育庁 入試情報',
    lastVerified: '2026-01-30',
    fiscalYear: '2026'
  },
  {
    code: 'hyogo',
    name: '兵庫県',
    region: '近畿',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 4,
    practicalMultiplier: 7.5,
    maxScore: 250,
    description: '5教科×4倍、実技4教科×7.5倍（250点満点）'
  },
  {
    code: 'nara',
    name: '奈良県',
    region: '近畿',
    targetGrades: [2, 3],
    gradeMultipliers: { 1: 0, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中2(45点)＋中3×2倍(90点)（135点満点）'
  },
  {
    code: 'wakayama',
    name: '和歌山県',
    region: '近畿',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 180,
    description: '中1・中2＋中3×2倍（180点満点）'
  },
  // 中国
  {
    code: 'tottori',
    name: '鳥取県',
    region: '中国',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 130,
    description: '中3のみ、実技4教科×2倍（130/195/260点満点）',
    note: '高校により倍率が異なる'
  },
  {
    code: 'shimane',
    name: '島根県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 60,
    description: '180点を51点に換算＋特別活動9点（60点満点）'
  },
  {
    code: 'okayama',
    name: '岡山県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 200,
    description: '中1・中2各45点、中3(実技重視)110点（200点満点）'
  },
  {
    code: 'hiroshima',
    name: '広島県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 3 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 225,
    description: '学年比1:1:3（225点満点）'
  },
  {
    code: 'yamaguchi',
    name: '山口県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）'
  },
  // 四国
  {
    code: 'tokushima',
    name: '徳島県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '実技4教科×2倍（各学年65点×3＝195点満点）'
  },
  {
    code: 'kagawa',
    name: '香川県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 2,
    practicalMultiplier: 4,
    maxScore: 220,
    description: '中3は5教科×2倍、実技4教科×4倍（220点満点）',
    note: '中1・中2は各45点'
  },
  {
    code: 'ehime',
    name: '愛媛県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）'
  },
  {
    code: 'kochi',
    name: '高知県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 260,
    description: '中3は10段階評価、実技4教科×2倍（260点満点）',
    supports10PointScale: true,
    note: '中3のみ10段階評価'
  },
  // 九州・沖縄
  {
    code: 'fukuoka',
    name: '福岡県',
    region: '九州・沖縄',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 45,
    description: '中3の成績のみ（45点満点）',
    note: '一部高校で傾斜配点あり'
  },
  {
    code: 'saga',
    name: '佐賀県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）'
  },
  {
    code: 'nagasaki',
    name: '長崎県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）'
  },
  {
    code: 'kumamoto',
    name: '熊本県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 180,
    description: '中1・中2＋中3×2倍（180点満点）'
  },
  {
    code: 'oita',
    name: '大分県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 2,
    practicalMultiplier: 4,
    maxScore: 260,
    description: '中3は5教科×2倍、実技4教科×4倍（260点満点）',
    note: '中1・中2は実技2倍で各65点'
  },
  {
    code: 'miyazaki',
    name: '宮崎県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 135,
    description: '中1〜中3の9教科×5段階（135点満点）'
  },
  {
    code: 'kagoshima',
    name: '鹿児島県',
    region: '九州・沖縄',
    targetGrades: [3],
    gradeMultipliers: { 1: 0, 2: 0, 3: 1 },
    coreMultiplier: 2,
    practicalMultiplier: 20,
    maxScore: 450,
    description: '5教科×2倍、実技4教科×20倍（450点満点）',
    note: '実技が全体の約9割'
  },
  {
    code: 'okinawa',
    name: '沖縄県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 1.5,
    maxScore: 165,
    description: '実技4教科×1.5倍（各学年55点×3＝165点満点）'
  }
];

// 地域でグループ化
export const REGIONS = [
  '北海道・東北',
  '関東',
  '中部',
  '近畿',
  '中国',
  '四国',
  '九州・沖縄'
] as const;

export type RegionName = typeof REGIONS[number];

export function getPrefecturesByRegion(region: RegionName): PrefectureConfig[] {
  return PREFECTURES.filter(p => p.region === region);
}

export function getPrefectureByCode(code: string): PrefectureConfig | undefined {
  return PREFECTURES.find(p => p.code === code);
}

// 簡易計算モード（中3のみ、1学年分）
export function calculateSimpleScore(
  scores: Record<string, number>,
  prefecture: PrefectureConfig,
  use10PointScale: boolean = false
): number {
  const coreSubjects = ['japanese', 'math', 'english', 'science', 'social'];
  const practicalSubjects = ['music', 'art', 'pe', 'tech'];
  
  let total = 0;
  
  // 5教科
  for (const key of coreSubjects) {
    const score = scores[key] ?? 3;
    total += score * prefecture.coreMultiplier;
  }
  
  // 実技4教科
  for (const key of practicalSubjects) {
    const score = scores[key] ?? 3;
    total += score * prefecture.practicalMultiplier;
  }
  
  return total;
}

// デフォルトは東京都
export const DEFAULT_PREFECTURE_CODE = 'tokyo';
