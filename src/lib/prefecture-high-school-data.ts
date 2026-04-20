/**
 * My Naishin - 全国47都道府県 公立高校入試ボーダーラインデータ
 * 2025年度（令和7年度）入試対応
 * データソース：教育委員会公式資料、進学塾公開データ、OPENLANE等
 */
 
export interface HighSchoolData {
  rank: number;
  name: string;
  department: string;
  avgNaishin?: number;
  avgScore?: number;
  totalScore?: number;
  notes?: string;
  source: string;
}
 
export interface PrefectureRules {
  targetGrades: string;
  practicalMultiplier: number | string;
  maxScore: number;
  scoreRatio: string;
  hasRecommendation: boolean;
  hasInterview: boolean;
  uniqueRules: string[];
}
 
export interface PrefectureData {
  code: string;
  name: string;
  region: string;
  rules: PrefectureRules;
  topHighSchools: HighSchoolData[];
  blogContentIdeas: string[];
}
 
export const PREFECTURE_HIGH_SCHOOL_DATA: Record<string, PrefectureData> = {
  // 東京都
  tokyo: {
    code: "13",
    name: "東京都",
    region: "関東",
    rules: {
      targetGrades: "中学3年生のみ",
      practicalMultiplier: 2,
      maxScore: 300,
      scoreRatio: "7:3（学力検査700点：調査書300点）",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "ESAT-J（英語スピーキングテスト）20点加算で総合1020点満点",
        "実技4教科が2倍になる換算内申制度",
        "令和8年度（2026年度）から面接廃止",
        "分割募集廃止、第一次募集一本化"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "日比谷高校",
        department: "普通科",
        avgNaishin: 62,
        avgScore: 455,
        totalScore: 900,
        notes: "都内トップ校。実技も含めてほぼオール5同然",
        source: "塾選/都立合格ナビ 2025年度"
      },
      {
        rank: 2,
        name: "西高校",
        department: "普通科",
        avgNaishin: 61,
        avgScore: 450,
        totalScore: 880,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 3,
        name: "国立高校",
        department: "普通科",
        avgNaishin: 61,
        avgScore: 445,
        totalScore: 870,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 4,
        name: "戸山高校",
        department: "普通科",
        avgNaishin: 60,
        avgScore: 440,
        totalScore: 860,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 5,
        name: "青山高校",
        department: "普通科",
        avgNaishin: 59,
        avgScore: 435,
        totalScore: 850,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 6,
        name: "新宿高校",
        department: "普通科",
        avgNaishin: 57,
        avgScore: 425,
        totalScore: 830,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 7,
        name: "国分寺高校",
        department: "普通科",
        avgNaishin: 57,
        avgScore: 420,
        totalScore: 820,
        source: "都立合格ナビ 2025年度"
      },
      {
        rank: 8,
        name: "墨田川高校",
        department: "普通科",
        avgNaishin: 56,
        avgScore: 415,
        totalScore: 810,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "江戸川高校",
        department: "普通科",
        avgNaishin: 55,
        avgScore: 410,
        totalScore: 800,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "立川高校",
        department: "普通科",
        avgNaishin: 55,
        avgScore: 405,
        totalScore: 790,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "東京都は『実技2倍』で副教科が命：音楽・美術・技術・保健体育の対策法",
      "ESAT-J（英語スピーキングテスト）の20点差：スピーキング対策で逆転できる理由",
      "2026年度から面接廃止→内申の重要性がさらに上昇",
      "換算内申65点満点の仕組みを完全解説",
      "東京都立トップ校の合格ボーダーライン：日比谷・西・国立を狙うために"
    ]
  },
 
  // 神奈川県
  kanagawa: {
    code: "14",
    name: "神奈川県",
    region: "関東",
    rules: {
      targetGrades: "中学2年生（1倍）と中学3年生（2倍）の合計",
      practicalMultiplier: "原則等倍（重点化で加重可）",
      maxScore: 135,
      scoreRatio: "学校ごとに異なる（3:7:3など）",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "令和6年度から面接廃止（2024年度から）",
        "中2の成績も評価対象に含まれる（早期対策が必須）",
        "特色検査実施校が複数存在",
        "学校ごとの重点化制度（英数理を2倍など）",
        "2025年度全県合格者平均286.1点（500点満点）"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "横浜翠嵐高校",
        department: "普通科",
        avgNaishin: 138,
        avgScore: 440,
        totalScore: 885,
        notes: "内申：学力：特色＝3:7:3 特色検査あり",
        source: "ステップ 2025年度"
      },
      {
        rank: 2,
        name: "湘南高校",
        department: "普通科",
        avgNaishin: 135,
        avgScore: 430,
        totalScore: 875,
        notes: "内申：学力：特色＝4:6:2",
        source: "ステップ 2025年度"
      },
      {
        rank: 3,
        name: "柏陽高校",
        department: "普通科",
        avgNaishin: 132,
        avgScore: 425,
        totalScore: 865,
        notes: "内申：学力：特色＝3:7:2",
        source: "ステップ 2025年度"
      },
      {
        rank: 4,
        name: "横浜サイエンスフロンティア高校",
        department: "理数科",
        avgNaishin: 130,
        avgScore: 420,
        totalScore: 855,
        notes: "英数理を調査書で2倍（重点化）",
        source: "ステップ 2025年度"
      },
      {
        rank: 5,
        name: "厚木高校",
        department: "普通科",
        avgNaishin: 128,
        avgScore: 415,
        totalScore: 845,
        notes: "内申：学力：特色＝4:6:2",
        source: "ステップ 2025年度"
      },
      {
        rank: 6,
        name: "希望ケ丘高校",
        department: "普通科",
        avgNaishin: 125,
        avgScore: 380,
        totalScore: 800,
        source: "オフスペース 2025年度"
      },
      {
        rank: 7,
        name: "平塚江南高校",
        department: "普通科",
        avgNaishin: 123,
        avgScore: 375,
        totalScore: 795,
        source: "オフスペース 2025年度"
      },
      {
        rank: 8,
        name: "小田原高校",
        department: "普通科",
        avgNaishin: 120,
        avgScore: 370,
        totalScore: 785,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "茅ケ崎北陵高校",
        department: "普通科",
        avgNaishin: 118,
        avgScore: 365,
        totalScore: 775,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "相模大野高校",
        department: "普通科",
        avgNaishin: 115,
        avgScore: 360,
        totalScore: 765,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "神奈川県は『中2から内申が入る』：中学2年生からの成績戦略が合否を決める",
      "135点満点の仕組み：中2と中3で異なる重み付けの完全解説",
      "2025年度全県平均286.1点の意味：難易度上昇トレンドを読む",
      "特色検査実施校の戦略：横浜翠嵐・湘南など進学指導重点校の選び方",
      "面接廃止でどう変わった？内申と学力検査の比重を徹底分析"
    ]
  },
 
  // 大阪府
  osaka: {
    code: "27",
    name: "大阪府",
    region: "近畿",
    rules: {
      targetGrades: "中学1年：2年：3年＝1：1：3の比率",
      practicalMultiplier: "等倍（ただしタイプにより実質的には変動）",
      maxScore: 450,
      scoreRatio: "タイプにより異なる（タイプⅠは当日630：内申270）",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "5つの選抜タイプ（Ⅰ～Ⅴ）から各校が選択",
        "文理学科設置校はほぼすべてタイプⅠ採用",
        "タイプⅠの内申比率は0.6倍に圧縮",
        "当日630点の高難度問題を出題する学校が多い",
        "2025年度トップ校は430/450以上の内申が必須"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "北野高校",
        department: "文理学科",
        avgNaishin: 440,
        avgScore: 410,
        totalScore: 950,
        notes: "タイプⅠ採用。当日点410点以上が合格の目安",
        source: "大阪公立高校入試 2025年度"
      },
      {
        rank: 2,
        name: "天王寺高校",
        department: "文理学科",
        avgNaishin: 435,
        avgScore: 400,
        totalScore: 935,
        notes: "文理学科。内申435は450点中で約96%",
        source: "大阪公立高校入試 2025年度"
      },
      {
        rank: 3,
        name: "茨木高校",
        department: "文理学科",
        avgNaishin: 435,
        avgScore: 390,
        totalScore: 925,
        notes: "タイプⅠ採用",
        source: "大阪公立高校入試 2025年度"
      },
      {
        rank: 4,
        name: "三国丘高校",
        department: "文理学科",
        avgNaishin: 430,
        avgScore: 385,
        totalScore: 915,
        source: "大阪公立高校入試 2025年度"
      },
      {
        rank: 5,
        name: "大手前高校",
        department: "文理学科",
        avgNaishin: 430,
        avgScore: 380,
        totalScore: 910,
        source: "大阪公立高校入試 2025年度"
      },
      {
        rank: 6,
        name: "豊中高校",
        department: "普通科",
        avgNaishin: 425,
        avgScore: 375,
        totalScore: 900,
        notes: "普通科ではタイプが異なる可能性",
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "高津高校",
        department: "普通科",
        avgNaishin: 420,
        avgScore: 370,
        totalScore: 890,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "和泉高校",
        department: "普通科",
        avgNaishin: 415,
        avgScore: 365,
        totalScore: 880,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "池田高校",
        department: "普通科",
        avgNaishin: 410,
        avgScore: 360,
        totalScore: 870,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "寝屋川高校",
        department: "普通科",
        avgNaishin: 405,
        avgScore: 355,
        totalScore: 860,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "大阪府『5つのタイプ』完全解説：自分の志望校はどのタイプ？",
      "文理学科とは何か：北野・天王寺・茨木の当日点の高さを読む",
      "タイプⅠで内申が『0.6倍』に圧縮される理由と対策",
      "1年：1年：3の配点比率を活かした逆転戦略",
      "大阪府立高校の当日得点が難しい理由：630点満点の秘密"
    ]
  },
 
  // 愛知県
  aichi: {
    code: "23",
    name: "愛知県",
    region: "中部",
    rules: {
      targetGrades: "中学全学年が対象（複合選抜制度）",
      practicalMultiplier: "等倍",
      maxScore: 110,
      scoreRatio: "3つの選抜方式から選択（内申×2+当日など）",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "A・Bグループから1校ずつ受検可能な複合選抜制",
        "方式Ⅰ：内申×2+当日",
        "方式Ⅲ：内申×2+当日×1.5",
        "方式Ⅴ：内申×2+当日×2（当日点重視）",
        "最難関校はほぼ方式Ⅴで当日点100点近く要求"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "旭丘高校",
        department: "普通科",
        avgNaishin: 42,
        avgScore: 98,
        totalScore: 282,
        notes: "方式Ⅴ採用。当日点98/110点要求",
        source: "さくら個別指導学院 2025年度"
      },
      {
        rank: 2,
        name: "明和高校",
        department: "普通科",
        avgNaishin: 42,
        avgScore: 95,
        totalScore: 274,
        notes: "方式Ⅴ採用",
        source: "さくら個別指導学院 2025年度"
      },
      {
        rank: 3,
        name: "菊里高校",
        department: "普通科",
        avgNaishin: 41,
        avgScore: 92,
        totalScore: 266,
        notes: "方式Ⅴ採用",
        source: "さくら個別指導学院 2025年度"
      },
      {
        rank: 4,
        name: "瑞陵高校",
        department: "普通科",
        avgNaishin: 41,
        avgScore: 91,
        totalScore: 266,
        source: "さくら個別指導学院 2025年度"
      },
      {
        rank: 5,
        name: "千種高校",
        department: "普通科",
        avgNaishin: 40,
        avgScore: 89,
        totalScore: 258,
        source: "さくら個別指導学院 2025年度"
      },
      {
        rank: 6,
        name: "刈谷高校",
        department: "普通科",
        avgNaishin: 39,
        avgScore: 86,
        totalScore: 250,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "豊田西高校",
        department: "普通科",
        avgNaishin: 38,
        avgScore: 84,
        totalScore: 244,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "松蔭高校",
        department: "普通科",
        avgNaishin: 37,
        avgScore: 82,
        totalScore: 238,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "熱田高校",
        department: "普通科",
        avgNaishin: 36,
        avgScore: 80,
        totalScore: 232,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "天白高校",
        department: "普通科",
        avgNaishin: 35,
        avgScore: 78,
        totalScore: 226,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "愛知県『複合選抜』の仕組み：AグループとBグループの同時受検が可能な理由",
      "『内申×2+当日×2』の方式Ⅴとは何か：旭丘・明和の高難度問題を解く",
      "当日点110点満点の110点中98点以上が求められる理由",
      "愛知県の当日点重視は東京都と何が違うのか",
      "複合選抜で『2回のチャンス』を活かすための志望校選び"
    ]
  },
 
  // 福岡県
  fukuoka: {
    code: "40",
    name: "福岡県",
    region: "九州",
    rules: {
      targetGrades: "中学3年生のみ",
      practicalMultiplier: "等倍",
      maxScore: 45,
      scoreRatio: "当日点300点：内申点45点を同等に扱う学校が多い",
      hasRecommendation: true,
      hasInterview: true,
      uniqueRules: [
        "全13学区制を維持（地域により受験可能校が限定される）",
        "学力検査300点満点（共通問題）",
        "調査書点は中3評定45点満点",
        "2025年度トップ3校（修猷館・福岡・筑紫丘）は内申40点以上、当日点260点以上が最低ライン",
        "学区制により地域差が顕著"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "修猷館高校",
        department: "普通科",
        avgNaishin: 42,
        avgScore: 261,
        totalScore: 565,
        notes: "福岡の御三家筆頭。九州でも有数の難関校",
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 2,
        name: "福岡高校",
        department: "普通科",
        avgNaishin: 41,
        avgScore: 260,
        totalScore: 563,
        notes: "福岡県内でも競争が激しい",
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 3,
        name: "筑紫丘高校",
        department: "普通科",
        avgNaishin: 40,
        avgScore: 255,
        totalScore: 558,
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 4,
        name: "東筑高校",
        department: "普通科",
        avgNaishin: 39,
        avgScore: 226,
        totalScore: 508,
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 5,
        name: "小倉高校",
        department: "普通科",
        avgNaishin: 38,
        avgScore: 225,
        totalScore: 506,
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 6,
        name: "八幡高校",
        department: "理科",
        avgNaishin: 36,
        avgScore: 234,
        totalScore: 498,
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 7,
        name: "京都高校",
        department: "普通科",
        avgNaishin: 35,
        avgScore: 224,
        totalScore: 495,
        source: "福岡合格判定 2025年度"
      },
      {
        rank: 8,
        name: "新宮高校",
        department: "普通科",
        avgNaishin: 34,
        avgScore: 220,
        totalScore: 487,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "宗像高校",
        department: "普通科",
        avgNaishin: 33,
        avgScore: 215,
        totalScore: 478,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "福津高校",
        department: "普通科",
        avgNaishin: 32,
        avgScore: 210,
        totalScore: 469,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "福岡県の『学区制』の仕組み：全13学区で受験可能校が決まる理由",
      "修猷館・福岡・筑紫丘『御三家』の合格ボーダーラインを徹底解説",
      "内申45点満点の意味：他県との違いを比較",
      "福岡県は『学区制と情報戦』：地域による合格難易度の大きな差",
      "福岡県トップ校を狙う際の『地理的有利不利』を考える"
    ]
  },
 
  // 埼玉県
  saitama: {
    code: "11",
    name: "埼玉県",
    region: "関東",
    rules: {
      targetGrades: "中学1年：2年：3年＝1：1：2（または1:1:3）",
      practicalMultiplier: "等倍",
      maxScore: 135,
      scoreRatio: "当日点：調査書点＝4:6～5:5",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "学年比率により3年次の成績がより重要",
        "上位校で『学校選択問題』（数学・英語）を採用",
        "各校が加重配点（K値）を設定可能",
        "面接・作文・実技検査を課す学校が多い",
        "前期選抜と後期選抜の2段階制"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "浦和高校",
        department: "普通科",
        avgNaishin: 128,
        avgScore: 440,
        totalScore: 880,
        notes: "学校選択問題採用。K値が高い可能性",
        source: "埼玉県公立高校進学情報 2025年度"
      },
      {
        rank: 2,
        name: "浦和第一女子高校",
        department: "普通科",
        avgNaishin: 126,
        avgScore: 435,
        totalScore: 875,
        source: "埼玉県公立高校進学情報 2025年度"
      },
      {
        rank: 3,
        name: "大宮高校",
        department: "普通科",
        avgNaishin: 125,
        avgScore: 430,
        totalScore: 870,
        source: "埼玉県公立高校進学情報 2025年度"
      },
      {
        rank: 4,
        name: "春日部高校",
        department: "普通科",
        avgNaishin: 122,
        avgScore: 420,
        totalScore: 855,
        source: "推計 2025年度"
      },
      {
        rank: 5,
        name: "越谷北高校",
        department: "普通科",
        avgNaishin: 120,
        avgScore: 415,
        totalScore: 850,
        source: "推計 2025年度"
      },
      {
        rank: 6,
        name: "所沢北高校",
        department: "普通科",
        avgNaishin: 118,
        avgScore: 410,
        totalScore: 840,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "川越高校",
        department: "普通科",
        avgNaishin: 116,
        avgScore: 405,
        totalScore: 830,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "和光国際高校",
        department: "外国語科",
        avgNaishin: 114,
        avgScore: 400,
        totalScore: 820,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "市立浦和高校",
        department: "普通科",
        avgNaishin: 112,
        avgScore: 395,
        totalScore: 810,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "川口北高校",
        department: "普通科",
        avgNaishin: 110,
        avgScore: 390,
        totalScore: 800,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "埼玉県の『学年比率』：中3の成績が最も重要な理由",
      "『学校選択問題』とは何か：浦和・浦和一女の難度が高い理由",
      "『K値』（加重配点）の仕組み：各校が調査書をどう評価しているか",
      "埼玉県の前期・後期選抜制度：2回のチャンスをどう活かす",
      "埼玉県は『調査書重視傾向』：当日点が低くても内申で逆転する可能性"
    ]
  },
 
  // 千葉県
  chiba: {
    code: "12",
    name: "千葉県",
    region: "関東",
    rules: {
      targetGrades: "中学1年～3年まですべての評定が対象",
      practicalMultiplier: "等倍",
      maxScore: 135,
      scoreRatio: "学力検査500点：調査書135点",
      hasRecommendation: true,
      hasInterview: false,
      uniqueRules: [
        "2021年度より前期・後期選抜を一本化",
        "各高校が『加重配点（K値）』を設定可能",
        "『学校設定検査』（面接・作文・プレゼン等）を課す学校多数",
        "実質的な内申重視度を学校ごとに調整可能",
        "調査書と学力検査の比率が学校によって大きく異なる"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "東葛飾高校",
        department: "普通科",
        avgNaishin: 130,
        avgScore: 445,
        totalScore: 880,
        notes: "学校設定検査あり。加重配点が高い可能性",
        source: "千葉県公立高校入試情報 2025年度"
      },
      {
        rank: 2,
        name: "佐倉高校",
        department: "普通科",
        avgNaishin: 128,
        avgScore: 440,
        totalScore: 875,
        source: "千葉県公立高校入試情報 2025年度"
      },
      {
        rank: 3,
        name: "千葉高校",
        department: "普通科",
        avgNaishin: 127,
        avgScore: 435,
        totalScore: 870,
        source: "千葉県公立高校入試情報 2025年度"
      },
      {
        rank: 4,
        name: "長生高校",
        department: "普通科",
        avgNaishin: 125,
        avgScore: 430,
        totalScore: 865,
        source: "推計 2025年度"
      },
      {
        rank: 5,
        name: "成田国際高校",
        department: "普通科",
        avgNaishin: 123,
        avgScore: 425,
        totalScore: 860,
        source: "推計 2025年度"
      },
      {
        rank: 6,
        name: "千葉東高校",
        department: "普通科",
        avgNaishin: 120,
        avgScore: 420,
        totalScore: 850,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "柏高校",
        department: "普通科",
        avgNaishin: 118,
        avgScore: 415,
        totalScore: 840,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "木更津高校",
        department: "普通科",
        avgNaishin: 116,
        avgScore: 410,
        totalScore: 830,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "土気高校",
        department: "普通科",
        avgNaishin: 114,
        avgScore: 405,
        totalScore: 820,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "君津高校",
        department: "普通科",
        avgNaishin: 112,
        avgScore: 400,
        totalScore: 810,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "千葉県『前期・後期廃止』の意味：一本化されたシステムの仕組み",
      "『学校設定検査』とは何か：面接・作文・プレゼンテーションの配点",
      "千葉県は『加重配点制度』で学校ごとに内申重視度が異なる理由",
      "中1からの評定がすべて対象：早期対策が必須な千葉県の戦略",
      "千葉県トップ校（東葛飾・佐倉・千葉高）の合格ボーダー完全ガイド"
    ]
  },
 
  // 兵庫県
  hyogo: {
    code: "28",
    name: "兵庫県",
    region: "近畿",
    rules: {
      targetGrades: "中学3年生のみ（評定のみ対象）",
      practicalMultiplier: 7.5,
      maxScore: 250,
      scoreRatio: "学力検査250点：調査書点250点",
      hasRecommendation: true,
      hasInterview: true,
      uniqueRules: [
        "実技教科の倍率が7.5倍という全国で最高レベル",
        "主要5教科の評定が4倍、実技4教科が7.5倍",
        "実技1教科の『1』の差が学力検査の約15点分に相当",
        "2025年度国語平均点が前年比22.4点上昇という異例の事態",
        "トップ校のボーダーが前年比20～30点押し上げられた"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "長田高校",
        department: "普通科",
        avgNaishin: 241,
        avgScore: 449,
        totalScore: 890,
        notes: "兵庫県トップ校。実技教科がほぼオール5",
        source: "OPENLANE 2025年度"
      },
      {
        rank: 2,
        name: "神戸高校",
        department: "普通科",
        avgNaishin: 234,
        avgScore: 437,
        totalScore: 871,
        source: "OPENLANE 2025年度"
      },
      {
        rank: 3,
        name: "兵庫高校",
        department: "普通科",
        avgNaishin: 234,
        avgScore: 428,
        totalScore: 862,
        source: "OPENLANE 2025年度"
      },
      {
        rank: 4,
        name: "市立西宮高校",
        department: "普通科",
        avgNaishin: 235,
        avgScore: 430,
        totalScore: 865,
        notes: "2025年度実績は異例の高難度",
        source: "推計 2025年度"
      },
      {
        rank: 5,
        name: "尼崎稲園高校",
        department: "普通科",
        avgNaishin: 230,
        avgScore: 415,
        totalScore: 845,
        source: "推計 2025年度"
      },
      {
        rank: 6,
        name: "加古川東高校",
        department: "普通科",
        avgNaishin: 228,
        avgScore: 410,
        totalScore: 838,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "姫路西高校",
        department: "普通科",
        avgNaishin: 225,
        avgScore: 405,
        totalScore: 830,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "明石北高校",
        department: "普通科",
        avgNaishin: 222,
        avgScore: 400,
        totalScore: 822,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "三田高校",
        department: "普通科",
        avgNaishin: 220,
        avgScore: 395,
        totalScore: 815,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "伊丹北高校",
        department: "普通科",
        avgNaishin: 218,
        avgScore: 390,
        totalScore: 808,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "兵庫県『実技教科7.5倍』の衝撃：副教科対策が合否の鍵",
      "実技1教科の『1の差』＝当日点15点分の意味を完全解説",
      "2025年度国語平均点が前年比22.4点上昇した理由と対策",
      "長田高校の合格者平均241点の内訳：実技教科の重要性",
      "兵庫県で『逆転合格』が難しい理由：実技倍率の高さを考える"
    ]
  },
 
  // 京都府
  kyoto: {
    code: "26",
    name: "京都府",
    region: "近畿",
    rules: {
      targetGrades: "中学1年：2年：3年＝1：1：3の比率",
      practicalMultiplier: 2,
      maxScore: 195,
      scoreRatio: "調査書点195点：学力検査点200点",
      hasRecommendation: true,
      hasInterview: true,
      uniqueRules: [
        "副教科の評定が2倍になる傾斜配点制度",
        "堀川・西京・嵯峨野の特例校では独自問題で調査書の比率が低い",
        "3年次の成績が195点の大部分を占める",
        "推薦入試と特色選抜で多様な選抜制度",
        "一般選抜では調査書と学力検査をほぼ同等に扱う"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "堀川高校",
        department: "探究学科",
        avgNaishin: 180,
        avgScore: 185,
        totalScore: 545,
        notes: "特例校。独自の難易度の高い問題を出題",
        source: "京都府高校入試情報 2025年度"
      },
      {
        rank: 2,
        name: "西京高校",
        department: "エンタープライジング科",
        avgNaishin: 175,
        avgScore: 180,
        totalScore: 535,
        notes: "特例校。調査書の比率が低い",
        source: "京都府高校入試情報 2025年度"
      },
      {
        rank: 3,
        name: "嵯峨野高校",
        department: "探究学科",
        avgNaishin: 170,
        avgScore: 175,
        totalScore: 525,
        notes: "特例校",
        source: "京都府高校入試情報 2025年度"
      },
      {
        rank: 4,
        name: "洛北高校",
        department: "普通科",
        avgNaishin: 165,
        avgScore: 170,
        totalScore: 510,
        source: "推計 2025年度"
      },
      {
        rank: 5,
        name: "鴨沂高校",
        department: "普通科",
        avgNaishin: 160,
        avgScore: 165,
        totalScore: 495,
        source: "推計 2025年度"
      },
      {
        rank: 6,
        name: "城南菱創高校",
        department: "普通科",
        avgNaishin: 155,
        avgScore: 160,
        totalScore: 480,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "桃山高校",
        department: "普通科",
        avgNaishin: 150,
        avgScore: 155,
        totalScore: 465,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "山城高校",
        department: "普通科",
        avgNaishin: 148,
        avgScore: 150,
        totalScore: 458,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "莵道高校",
        department: "普通科",
        avgNaishin: 145,
        avgScore: 145,
        totalScore: 450,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "南陽高校",
        department: "普通科",
        avgNaishin: 142,
        avgScore: 140,
        totalScore: 442,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "京都府『副教科2倍』制度：実技教科で点数を稼ぐ戦略",
      "堀川・西京・嵯峨野『特例校』とは何か：トップ校の別格扱い",
      "1年：1年：3の配点比率：3年次がいかに重要か",
      "京都府は『調査書と学力検査が同等』：どちらかで逆転可能？",
      "京都府のトップ校ボーダーライン完全分析"
    ]
  },
 
  // 北海道
  hokkaido: {
    code: "01",
    name: "北海道",
    region: "北海道",
    rules: {
      targetGrades: "中学全学年（A～Mの13段階ランク制度）",
      practicalMultiplier: "等倍",
      maxScore: 315,
      scoreRatio: "当日点：内申点の比率が複数パターン存在（10:0～5:5）",
      hasRecommendation: true,
      hasInterview: true,
      uniqueRules: [
        "独自の『内申ランク』制度（A～Mの13段階）",
        "オール5で315点（Aランク）になる",
        "選抜枠により当日点：内申点の比率が10:0～5:5まで複数存在",
        "札幌南・札幌北などトップ校では Aランクでも当日点400点以上必須",
        "全14学区の学区制を運用"
      ]
    },
    topHighSchools: [
      {
        rank: 1,
        name: "札幌南高校",
        department: "普通科",
        avgNaishin: 310,
        avgScore: 410,
        totalScore: 875,
        notes: "Aランク（ほぼオール5）でも当日点400点以上必須",
        source: "北海道高校入試情報 2025年度"
      },
      {
        rank: 2,
        name: "札幌北高校",
        department: "普通科",
        avgNaishin: 308,
        avgScore: 405,
        totalScore: 870,
        source: "北海道高校入試情報 2025年度"
      },
      {
        rank: 3,
        name: "札幌西高校",
        department: "普通科",
        avgNaishin: 305,
        avgScore: 400,
        totalScore: 860,
        source: "推計 2025年度"
      },
      {
        rank: 4,
        name: "旭川東高校",
        department: "普通科",
        avgNaishin: 300,
        avgScore: 395,
        totalScore: 845,
        source: "推計 2025年度"
      },
      {
        rank: 5,
        name: "函館中部高校",
        department: "普通科",
        avgNaishin: 298,
        avgScore: 390,
        totalScore: 840,
        source: "推計 2025年度"
      },
      {
        rank: 6,
        name: "釧路湖陵高校",
        department: "普通科",
        avgNaishin: 295,
        avgScore: 385,
        totalScore: 830,
        source: "推計 2025年度"
      },
      {
        rank: 7,
        name: "帯広柏葉高校",
        department: "普通科",
        avgNaishin: 290,
        avgScore: 380,
        totalScore: 820,
        source: "推計 2025年度"
      },
      {
        rank: 8,
        name: "苫小牧東高校",
        department: "普通科",
        avgNaishin: 285,
        avgScore: 375,
        totalScore: 810,
        source: "推計 2025年度"
      },
      {
        rank: 9,
        name: "小樽潮陵高校",
        department: "普通科",
        avgNaishin: 280,
        avgScore: 370,
        totalScore: 800,
        source: "推計 2025年度"
      },
      {
        rank: 10,
        name: "岩見沢東高校",
        department: "普通科",
        avgNaishin: 275,
        avgScore: 365,
        totalScore: 790,
        source: "推計 2025年度"
      }
    ],
    blogContentIdeas: [
      "北海道『内申ランク制度（A～M）』の仕組み：15段階の序列化",
      "Aランク＝オール5の意味：他県との比較",
      "札幌南・札幌北は Aランクでも当日400点以上必須の理由",
      "北海道『当日重視の選抜枠』と『内申重視の枠』の使い分け",
      "北海道の学区制と地域格差：本州との入試難易度の違い"
    ]
  }
};
