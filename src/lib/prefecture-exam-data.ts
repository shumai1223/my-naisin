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
      note: '第1次選考: 内申4:学力4:面接2、第2次選考は学校により異なる',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html',
  },
  {
    prefectureCode: 'osaka',
    generalExam: {
      naishinRatio: 40,
      examRatio: 60,
      examMaxScore: 450,
      totalMaxScore: 900,
      subjects: 5,
      note: '一般入学者選抜: タイプI(内申:学力=3:7)、タイプII(5:5)、タイプIII(7:3)',
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
      note: '学校選択問題実施校あり。内申点は1年:2年:3年=1:1:3',
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
    sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/index.html',
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
      naishinRatio: 50,
      examRatio: 50,
      examMaxScore: 300,
      totalMaxScore: 600,
      subjects: 5,
      note: '内申点300点+学力検査300点=600点満点',
    },
    lastVerified: '2026-01-30',
    sourceUrl: 'https://www.pref.fukuoka.lg.jp/contents/koukou-nyushi.html',
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
    sourceUrl: 'https://www.kyoto-be.ne.jp/kyoto-be/cms/?page_id=247',
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
