// 都道府県別内申点計算方法
// 出典: https://alpha-katekyo.jp/tips/tips286/

export interface PrefectureVariant {
  code: string;
  name: string;
  targetGrades: number[];
  gradeMultipliers: Record<number, number>;
  maxScore: number;
  description: string;
}

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
  // 簡易計算採用県（実選抜の換算式と異なる）か。true の県は二段表記で実選抜換算満点を併記する。
  simplifiedCalc?: boolean;
  // 実選抜換算での満点（maxScore＝ツール内部値と異なる場合のみ）。透明性のための二段表記。
  actualMaxScore?: number;
  // 10段階評価対応 (高知県など)
  supports10PointScale?: boolean;
  // 情報源URL（教育委員会等の公式ページ）
  sourceUrl?: string;
  // 2つ目の情報源URL
  sourceUrl2?: string;
  // 情報源の表示名
  sourceTitle?: string;
  // 最終確認日 (YYYY-MM-DD形式)
  lastVerified?: string;
  // 対象年度
  fiscalYear?: string;
  // 学校により満点・学年倍率そのものが変わる県向けのパターン定義（例: 奈良県の2026年3月制度改定）。
  // 存在する場合、variants[0] が標準パターンとしてベースの targetGrades/gradeMultipliers/maxScore/description と一致する。
  variants?: PrefectureVariant[];
  // 逆算計算設定
  reverseCalc?: {
    // 合計満点（内申点換算後＋当日点）
    totalMaxScore: number;
    // 当日点満点
    examMaxScore: number;
    // デフォルト配点比率
    defaultRatio: {
      naishin: number;
      exam: number;
    };
    // 計算タイプ
    calcType: 'standard' | 'osaka' | 'tokyo' | 'kanagawa' | 'chiba' | 'saitama';
    // 内申点換算係数（大阪府など）
    naishinMultiplier?: number;
    // K値（千葉県など）
    kValue?: number;
    // S値係数（神奈川県など）
    sValueCoefficients?: {
      academic: number;
      practical: number;
    };
    // 大阪府のタイプ別設定
    osakaTypes?: Array<{
      code: string;
      name: string;
      ratio: number;
      description: string;
      examMultiplier: number;
      naishinMultiplier: number;
    }>;
    // 東京都固有の設定
    tokyoSettings?: {
      esatjMaxScore: number; // ESAT-Jスピーキングテストの満点
      academicSubjects: number; // 主要5教科
      practicalSubjects: number; // 実技4教科
      practicalMultiplier: number; // 実技教科の倍率
      naishinConversion: {
        academicMultiplier: number; // 主要教科の内申点倍率
        practicalMultiplier: number; // 実技教科の内申点倍率
        totalMultiplier: number; // 65点満点→300点満点への換算係数
      };
    };
    // 神奈川県固有の設定
    kanagawaSettings?: {
      gradeMultipliers: {
        grade2: number; // 中2の倍率
        grade3: number; // 中3の倍率
      };
      sValueExplanation: string; // S値の計算式説明
    };
    // 注記（ユーザーへの補足情報）
    note?: string;
  };
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
    sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/',
    sourceUrl2: 'https://www.do-con.com/nyushi/judge.html',
    sourceTitle: '北海道教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/nyuushi.html',
    sourceUrl2: 'https://jyuke-labo.com/koukoujyukentaisaku/aomori/',
    sourceTitle: '青森県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
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
    maxScore: 660,
    description: '5教科×2倍、実技4教科×3倍、学年比1:2:3（660点満点）',
    note: 'この計算は660点満点ですが、実際の選抜では440点満点に換算される場合があります。',
    sourceUrl: 'https://www.pref.iwate.jp/kyouikubunka/kyouiku/gakkou/senbatsu/1091420.html',
    sourceUrl2: 'https://jyuke-labo.com/koukoujyukentaisaku/iwate/',
    sourceTitle: '岩手県教育委員会 入学者選抜実施概要',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.miyagi.jp/site/sub-jigyou/list680.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/04/feature/1273766_2678.html',
    sourceTitle: '宮城県教育委員会 入試・入学関連',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.akita.lg.jp/pages/archive/91551',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/05/naishin/',
    sourceTitle: '秋田県 公立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/06/feature/1273769_3744.html',
    sourceTitle: '山形県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/709972.pdf',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/07/feature/1273769_3744.html',
    sourceTitle: '福島県 県立高等学校入学者選抜実施要綱',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/youkou2026/',
    sourceUrl2: 'https://jyuke-labo.com/koukoujyukentaisaku/ibaraki/',
    sourceTitle: '茨城県教育委員会 入学者選抜実施要項',
    lastVerified: '2026-07-16',
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
    maxScore: 135,
    description: '中1〜中3を135点満点で計算',
    note: 'この計算は135点満点ですが、高校により500点満点などに換算されます。',
    sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/20250910185058.pdf',
    sourceUrl2: 'https://jyuke-labo.com/koukoujyukentaisaku/tochigi/',
    sourceTitle: '栃木県教育委員会 入学者選抜実施細則',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.gunma.jp/site/kyouiku/715449.html',
    sourceUrl2: 'https://jyuke-labo.com/koukoujyukentaisaku/gunma/',
    sourceTitle: '群馬県教育委員会 入学者選抜実施要項',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jissiyoukou.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/11/feature/0011.html',
    sourceTitle: '埼玉県教育委員会 入試情報',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 50, exam: 50 },
      calcType: 'saitama',
      note: '標準的な1:1:2モデルを採用。一部進学校では1:1:3など異なる場合あり'
    }
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
    sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8jissiyoko.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/12/feature/0012.html',
    sourceTitle: '千葉県教育委員会 入試情報',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/13/feature/0013.html',
    sourceTitle: '東京都教育委員会「令和8年度入学者選抜実施要綱」',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1020,
      examMaxScore: 1000,
      defaultRatio: { naishin: 70, exam: 30 },
      calcType: 'tokyo',
      // 東京都固有の設定
      tokyoSettings: {
        esatjMaxScore: 20, // ESAT-Jスピーキングテストの満点
        academicSubjects: 5, // 主要5教科
        practicalSubjects: 4, // 実技4教科
        practicalMultiplier: 2, // 実技教科の倍率
        naishinConversion: {
          academicMultiplier: 1, // 主要教科の内申点倍率
          practicalMultiplier: 2, // 実技教科の内申点倍率
          totalMultiplier: 300 / 65 // 65点満点→300点満点への換算係数
        }
      }
    }
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
    sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/14/feature/0014.html',
    sourceTitle: '神奈川県教育委員会 入試情報',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/15/naishin/',
    sourceTitle: '新潟県 公立高等学校入学者選抜要項',
    lastVerified: '2026-07-16',
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
    maxScore: 135,
    description: '中2(45点)＋中3×2倍(90点)（135点満点）',
    note: 'この計算は135点満点ですが、特別活動等の15点が加算され、150点満点となる場合があります。',
    sourceUrl: 'https://www.pref.toyama.jp/300201/kyouiku/kenritsukoukou/08senbatsu.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/16/naishin/',
    sourceTitle: '富山県 県立高等学校入学者選抜',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.ishikawa.lg.jp/kyoiku/gakkou/senbatu/documents/r8bosyuyoko.pdf',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/17/naishin/',
    sourceTitle: '石川県教育委員会 公立高等学校入学者募集要綱',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/18/naishin/',
    sourceTitle: '福井県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.pref.yamanashi.jp/kyouiku-kikaku/nyuusi/nyusitop.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/19/naishin/',
    sourceTitle: '山梨県 高校入試情報',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/r8konyushi.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/20/naishin/',
    sourceTitle: '長野県教育委員会 公立高等学校入学者選抜情報',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.gifu.lg.jp/site/edu/61428.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/21/naishin/',
    sourceTitle: '岐阜県 県立高等学校入学者選抜',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.shizuoka.jp/kodomokyoiku/school/kyoiku/1003764/1003891/index.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/22/feature/0022.html',
    sourceTitle: '静岡県 公立高等学校入学者選抜関係資料',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/23/feature/0023.html',
    sourceTitle: '愛知県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
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
    sourceUrl: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200379.htm',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/24/naishin/',
    sourceTitle: '三重県 県立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.pref.shiga.lg.jp/edu/nyuushi/high/senbatsu/105597.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/25/naishin/',
    sourceTitle: '滋賀県教育委員会 県立高等学校入学者選抜',
    lastVerified: '2026-07-16',
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
    sourceUrl: 'https://www.kyoto-be.ne.jp/koukyou/cms/?p=6024',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/26/feature/0026.html',
    sourceTitle: '京都府教育委員会 公立高等学校入学者選抜',
    lastVerified: '2026-07-16',
    fiscalYear: '2026'
  },
  {
    code: 'osaka',
    name: '大阪府',
    region: '近畿',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 2, 2: 2, 3: 6 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 450,
    description: '中1・中2は2倍、中3は6倍（450点満点）',
    sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/27/feature/0027.html',
    sourceTitle: '大阪府教育庁 入試情報',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 900,
      examMaxScore: 450,
      defaultRatio: { naishin: 50, exam: 50 },
      calcType: 'osaka',
      naishinMultiplier: 1, // 450点満点をそのまま使用
      osakaTypes: [
        { code: 'I', name: 'タイプⅠ', ratio: 30, description: '学力7：内申点3', examMultiplier: 1.0, naishinMultiplier: 0.6 },
        { code: 'II', name: 'タイプⅡ', ratio: 40, description: '学力6：内申点4', examMultiplier: 1.0, naishinMultiplier: 0.8 },
        { code: 'III', name: 'タイプⅢ', ratio: 50, description: '学力5：内申点5', examMultiplier: 1.0, naishinMultiplier: 1.0 },
        { code: 'IV', name: 'タイプⅣ', ratio: 60, description: '学力4：内申点6', examMultiplier: 1.0, naishinMultiplier: 1.2 },
        { code: 'V', name: 'タイプⅤ', ratio: 70, description: '学力3：内申点7', examMultiplier: 1.0, naishinMultiplier: 1.4 }
      ]
    }
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
    description: '5教科×4倍、実技4教科×7.5倍（250点満点）',
    sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/28/feature/0028.html',
    sourceTitle: '兵庫県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
    fiscalYear: '2026'
  },
  {
    code: 'nara',
    name: '奈良県',
    region: '近畿',
    // 2026年3月17日発表の制度改定（令和8年度〜）: 中1・中2は「主体的に学習に取り組む態度」の
    // 9教科3段階評価（各27点）＋中3は9教科5段階評定×2倍（90点）が標準（パターン①＝144点満点）。
    // 学校により②234点・③198点・④180点（中1・中2は加えない代わり中3をさらに2倍）の4パターンに分かれる。
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 0.6, 2: 0.6, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 144,
    description: '中1・中2は「主体的に学習に取り組む態度」9教科3段階（各27点）＋中3は9教科5段階×2倍（90点）＝標準144点満点',
    note: '2026年3月17日発表の制度改定により、令和8年度から中1・中2の評価方法が「主体的に学習に取り組む態度」の3段階評価に変わりました（旧制度の中1除外・135点満点とは別物です）。学校により標準の144点満点のほか、②234点（中3をさらに2倍）、③198点（中1・中2を2倍）、④180点（中1・中2は加えず中3をさらに2倍）の4パターンに分かれます。志望校がどのパターンかは募集要項で必ず確認してください。',
    variants: [
      {
        code: 'pattern1',
        name: 'パターン①（標準）',
        targetGrades: [1, 2, 3],
        gradeMultipliers: { 1: 0.6, 2: 0.6, 3: 2 },
        maxScore: 144,
        description: '中1・中2「主体的に学習に取り組む態度」各27点（3段階×9教科）＋中3評定×2倍90点＝144点満点'
      },
      {
        code: 'pattern2',
        name: 'パターン②',
        targetGrades: [1, 2, 3],
        gradeMultipliers: { 1: 0.6, 2: 0.6, 3: 4 },
        maxScore: 234,
        description: '中1・中2は標準と同じ各27点、中3をさらに2倍（180点）にして合計234点満点'
      },
      {
        code: 'pattern3',
        name: 'パターン③',
        targetGrades: [1, 2, 3],
        gradeMultipliers: { 1: 1.2, 2: 1.2, 3: 2 },
        maxScore: 198,
        description: '中1・中2をそれぞれ2倍（各54点）にし、中3は標準通り90点で合計198点満点'
      },
      {
        code: 'pattern4',
        name: 'パターン④',
        targetGrades: [3],
        gradeMultipliers: { 1: 0, 2: 0, 3: 4 },
        maxScore: 180,
        description: '中1・中2の点数は調査書成績に加えず、中3をさらに2倍（180点）のみで判定'
      }
    ],
    sourceUrl: 'https://www.pref.nara.lg.jp/n167/66542.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/29/naishin/',
    sourceTitle: '奈良県 高校入試（入学者選抜）',
    lastVerified: '2026-07-17',
    fiscalYear: '2026'
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
    description: '中1・中2＋中3×2倍（180点満点）',
    sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00220765.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/30/naishin/',
    sourceTitle: '和歌山県教育委員会 県立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    maxScore: 65,
    description: '中3のみ、実技4教科×2倍（65点満点）',
    note: '高校により2倍(130点)や3倍(195点)などに換算されます。',
    sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/31/naishin/',
    sourceTitle: '鳥取県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
  },
  {
    code: 'shimane',
    name: '島根県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 1,
    practicalMultiplier: 1,
    maxScore: 180,
    description: '学年比1:1:2で換算（180点満点）',
    note: 'この計算は180点満点ですが、実際の選抜では51点満点に換算され、さらに特別活動の9点が加算され60点満点となります。',
    sourceUrl: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/32/naishin/',
    sourceTitle: '島根県 高校入学者選抜関連情報',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
  },
  {
    code: 'okayama',
    name: '岡山県',
    region: '中国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    actualMaxScore: 200,
    simplifiedCalc: true,
    description: '5教科×1倍、実技4教科×2倍を3学年分（195点満点）',
    note: '実際の計算はより複雑で、中1・中2各45点、中3が110点の合計200点満点となるのが一般的です。このツールでは簡易計算をしています（実選抜換算では200点満点）。',
    sourceUrl: 'https://www.pref.okayama.jp/site/16/913706.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/33/naishin/',
    sourceTitle: '岡山県 県立高等学校の入学者選抜',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '学年比1:1:3（225点満点）',
    sourceUrl: 'https://www.pref.hiroshima.lg.jp/site/kyouiku/07senior-2nd-r07-nyuushi-r07-kou-r07-youkou-r07kou-youkou.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/34/feature/0034.html',
    sourceTitle: '広島県教育委員会 公立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.yamaguchi.lg.jp/site/kyouiku/310448.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/35/naishin/',
    sourceTitle: '山口県 公立高等学校入学者選抜実施大綱',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '実技4教科×2倍（各学年65点×3＝195点満点）',
    sourceUrl: 'https://www.pref.tokushima.lg.jp/file/attachment/937096.pdf',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/36/naishin/',
    sourceTitle: '徳島県教育委員会 公立高等学校生徒募集選抜要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
  },
  {
    code: 'kagawa',
    name: '香川県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 2,
    practicalMultiplier: 4,
    maxScore: 390,
    actualMaxScore: 220,
    simplifiedCalc: true,
    description: '5教科×2倍、実技4教科×4倍を3学年分（390点満点）',
    note: '実際の計算はより複雑で、中1・中2は各45点、中3は130点の合計220点満点となるのが一般的です。このツールでは簡易計算をしています（実選抜換算では220点満点）。',
    sourceUrl: 'https://www.pref.kagawa.lg.jp/kenkyoui/kokokyoiku/nyushi/chugaku-koko/examination02.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/37/naishin/',
    sourceTitle: '香川県教育委員会 公立高校入試',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://ehime-kyoiku.esnet.ed.jp/koukou/nyuusi/r08nyuusi',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/38/naishin/',
    sourceTitle: '愛媛県教育委員会 県立学校入学者選抜等関連情報',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
  },
  {
    code: 'kochi',
    name: '高知県',
    region: '四国',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 1 },
    coreMultiplier: 1,
    practicalMultiplier: 2,
    maxScore: 195,
    description: '実技4教科×2倍（195点満点）',
    supports10PointScale: true,
    note: 'この計算は5段階評価での195点満点です。実際の中3評定は10段階評価であり、その場合260点満点となります。',
    sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r8_koukounyushi_main/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/39/naishin/',
    sourceTitle: '高知県 公立高等学校入学者選抜',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    note: '一部高校で傾斜配点あり',
    sourceUrl: 'https://www.pref.fukuoka.lg.jp/kyouiku/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/article/40/feature/0040.html',
    sourceTitle: '福岡県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard',
      note: '一部高校で傾斜配点あり'
    }
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
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.saga.lg.jp/kyouiku/kiji003115881/index.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/41/naishin/',
    sourceTitle: '佐賀県 県立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.nagasaki.jp/doc/page-746842.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/42/naishin/',
    sourceTitle: '長崎県 公立高等学校入学者選抜実施要領',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '中1・中2＋中3×2倍（180点満点）',
    sourceUrl: 'https://www.pref.kumamoto.jp/site/kyouiku/244675.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/43/naishin/',
    sourceTitle: '熊本県 県立高等学校入学者選抜要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
  },
  {
    code: 'oita',
    name: '大分県',
    region: '九州・沖縄',
    targetGrades: [1, 2, 3],
    gradeMultipliers: { 1: 1, 2: 1, 3: 2 },
    coreMultiplier: 2,
    practicalMultiplier: 4,
    maxScore: 520,
    actualMaxScore: 260,
    simplifiedCalc: true,
    description: '中3は5教科×2倍、実技4教科×4倍（520点満点）',
    note: 'この計算は520点満点ですが、実際の計算はより複雑で260点満点となるのが一般的です。このツールでは簡易計算をしています（実選抜換算では260点満点）。',
    sourceUrl: 'https://www.pref.oita.jp/site/kyoiku/r08koukounyushi.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/44/naishin/',
    sourceTitle: '大分県 県立高等学校入学者選抜実施要項',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    description: '中1〜中3の9教科×5段階（135点満点）',
    sourceUrl: 'https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20250618193442.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/45/naishin/',
    sourceTitle: '宮崎県 県立高等学校生徒募集（入学者選抜）',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    note: '学力検査・面接との比率は非公表で、高校ごとに傾斜配点が行われます。合否における内申点の実質的な重みは志望校の募集要項でご確認ください。',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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
    note: '実技が全体の約9割',
    sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/46/naishin/',
    sourceTitle: '鹿児島県教育委員会 入学者選抜',
    lastVerified: '2026-04-22',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard',
      note: '実技が全体の約9割'
    }
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
    description: '実技4教科×1.5倍（各学年55点×3＝165点満点）',
    sourceUrl: 'https://www.pref.okinawa.lg.jp/kyoiku/gakko/1008883/1008887/1035054.html',
    sourceUrl2: 'https://czemi.benesse.ne.jp/open/nyushi/exam/47/naishin/',
    sourceTitle: '沖縄県 県立高等学校入試関連情報',
    lastVerified: '2026-07-16',
    fiscalYear: '2026',
    reverseCalc: {
      totalMaxScore: 1000,
      examMaxScore: 500,
      defaultRatio: { naishin: 40, exam: 60 },
      calcType: 'standard'
    }
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

// variants（学校によって満点・学年倍率そのものが変わる県）を指定パターンに解決する。
// variants がない県ではそのまま返す。variantCode 未指定/不一致時は先頭（標準パターン）を採用。
export function resolvePrefectureConfig(prefecture: PrefectureConfig, variantCode?: string): PrefectureConfig {
  if (!prefecture.variants || prefecture.variants.length === 0) return prefecture;
  const variant = prefecture.variants.find(v => v.code === variantCode) ?? prefecture.variants[0];
  return {
    ...prefecture,
    targetGrades: variant.targetGrades,
    gradeMultipliers: variant.gradeMultipliers,
    maxScore: variant.maxScore,
    description: variant.description
  };
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
