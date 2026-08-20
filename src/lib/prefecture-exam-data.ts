// 都道府県別入試配点データ
// 内申点と当日点の比率、満点などを管理

export interface ExamRatioConfig {
  prefectureCode: string;
  // 一般入試の配点
  generalExam: {
    naishinRatio: number; // 内申点の比率 (%)
    examRatio: number; // 当日点の比率 (%)
    examMaxScore: number; // 当日点の満点
    totalMaxScore: number; // 総合点の満点（目安）
    subjects: number; // 当日点の教科数
    note?: string;
  };
  // 推薦入試の配点（ある場合）
  recommendedExam?: {
    naishinRatio: number;
    examRatio: number;
    examMaxScore: number;
    note?: string;
  };
  // 最終確認日
  lastVerified: string;
  // 情報源
  sourceUrl?: string;
}

export const EXAM_RATIO_DATA: ExamRatioConfig[] = [
  {
    prefectureCode: 'tokyo',
    generalExam: {
      naishinRatio: 30,
      examRatio: 70,
      examMaxScore: 500,
      totalMaxScore: 1000,
      subjects: 5,
      note: '換算内申300点満点＋学力検査700点満点＝1000点満点',
    },
    recommendedExam: {
      naishinRatio: 50,
      examRatio: 50,
      examMaxScore: 500,
      note: '推薦入試は面接・小論文等を含む',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/',
  },
  {
    prefectureCode: 'kanagawa',
    generalExam: {
      naishinRatio: 40,
      examRatio: 60,
      examMaxScore: 500,
      totalMaxScore: 1000,
      subjects: 5,
      note: '第1次選考(定員90%): 内申と学力検査の比率(合計10)は学校ごとに3:7〜7:3の5種、特色検査実施校は加算あり。第2次選考(定員10%)は内申点不使用で学力検査と「主体的に学習に取り組む態度」の観点別評価を合算。面接は令和6(2024)年度から共通選抜の必須検査でなくなり、一部の特色検査実施校のみで実施。',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/nyusenseidogaiyou.html',
  },
  {
    prefectureCode: 'osaka',
    generalExam: {
      naishinRatio: 40,
      examRatio: 60,
      examMaxScore: 450,
      totalMaxScore: 900,
      subjects: 5,
      note: '一般入学者選抜: 内申:学力の比率(合計10)をタイプI(3:7・学力重視)〜タイプV(7:3・内申重視)の5段階から高校ごとに選択。標準はタイプIII(5:5)。',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/',
  },
  {
    prefectureCode: 'saitama',
    generalExam: {
      naishinRatio: 40,
      examRatio: 60,
      examMaxScore: 500,
      totalMaxScore: 940,
      subjects: 5,
      note: '学校選択問題実施校あり。内申点の学年比は標準1:1:2（180点満点）だが、高校により1:1:3・1:2:3などもある',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.saitama.lg.jp/f2208/r7nyuushi-jouhou.html',
  },
  {
    prefectureCode: 'chiba',
    generalExam: {
      naishinRatio: 45,
      examRatio: 55,
      examMaxScore: 500,
      totalMaxScore: 1000,
      subjects: 5,
      note: '2日間入試。調査書点(内申)+学力検査+学校設定検査',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html',
  },
  {
    prefectureCode: 'aichi',
    generalExam: {
      naishinRatio: 45,
      examRatio: 55,
      examMaxScore: 110,
      totalMaxScore: 200,
      subjects: 5,
      note: 'A・Bグループ2回受験可能。内申90点+学力110点=200点満点',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
  },
  {
    prefectureCode: 'fukuoka',
    generalExam: {
      naishinRatio: 13,
      examRatio: 87,
      examMaxScore: 300,
      totalMaxScore: 345,
      subjects: 5,
      note: '内申点45点（中3のみ・9教科×5段階）+学力検査300点=345点満点',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.fukuoka.lg.jp/site/kyouiku/08youkou.html',
  },
  {
    prefectureCode: 'hokkaido',
    generalExam: {
      naishinRatio: 50,
      examRatio: 50,
      examMaxScore: 300,
      totalMaxScore: 600,
      subjects: 5,
      note: '学校裁量問題実施校あり。個人調査書の評定+学力検査',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/koukounyuusenn.html',
  },
  {
    prefectureCode: 'hyogo',
    generalExam: {
      naishinRatio: 50,
      examRatio: 50,
      examMaxScore: 250,
      totalMaxScore: 500,
      subjects: 5,
      note: '内申点250点+学力検査250点=500点満点',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/02nyuushi/r7senbatsu.html',
  },
  {
    prefectureCode: 'kyoto',
    generalExam: {
      naishinRatio: 50,
      examRatio: 50,
      examMaxScore: 200,
      totalMaxScore: 400,
      subjects: 5,
      note: '前期選抜・中期選抜で配点が異なる',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.kyoto-be.ne.jp/koukyou/cms/?p=6024',
  },
];

export function getExamRatioByCode(prefectureCode: string): ExamRatioConfig | undefined {
  return EXAM_RATIO_DATA.find((d) => d.prefectureCode === prefectureCode);
}

// デフォルトの配点（データがない都道府県用）
export const DEFAULT_EXAM_RATIO: ExamRatioConfig['generalExam'] = {
  naishinRatio: 50,
  examRatio: 50,
  examMaxScore: 500,
  totalMaxScore: 1000,
  subjects: 5,
  note: '配点は学校により異なります。詳細は各都道府県教育委員会でご確認ください。',
};
