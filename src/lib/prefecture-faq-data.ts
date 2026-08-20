// 2026-08-17: PrefectureFAQコンポーネントに直書きされていた回答文言(大阪/埼玉/愛知で
// 対象学年・倍率の誤記3件を実際に発見・修正)をlib層のプレーンデータへ分離し、
// prefectures.tsとの数値突合を機械テストできるようにした(prefecture-pitfalls-dataと同型の対策)。

export type FAQIconKey = 'calendar' | 'alert' | 'help' | 'book';

export interface PrefectureFAQQuestion {
  question: string;
  answer: string;
  icon: FAQIconKey;
  priority: 'high' | 'medium' | 'low';
}

export interface PrefectureFAQEntry {
  commonQuestions: PrefectureFAQQuestion[];
  specificNotes: string[];
}

export const PREFECTURE_FAQ_DATA: Record<string, PrefectureFAQEntry> = {
  chiba: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '千葉県の場合、中1〜中3の3年間の評定合計が対象です。全学年の合計値にK値をかけて調査書点を計算します。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: 'K値とは何ですか？',
        answer: 'K値は学校ごとに設定される内申点の重み付け係数です。0.5〜2.0の範囲で、学校によって異なります。',
        icon: 'help',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '千葉県では実技教科は1倍換算が基本です。5教科と同じ比重で計算されます。',
        icon: 'book',
        priority: 'medium'
      }
    ],
    specificNotes: [
      '全学年（中1〜中3）の評定合計にK値を乗じて計算します',
      'K値1.5が標準的な学校が多いですが、必ず確認が必要です'
    ]
  },
  tokyo: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '東京都の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: '実技4教科は本当に2倍ですか？',
        answer: 'はい、東京都では実技4教科（音楽・美術・保健体育・技術家庭）は2倍で換算されます。65点満点→300点満点になります。',
        icon: 'alert',
        priority: 'high'
      },
      {
        question: 'ESAT-Jとは何ですか？',
        answer: 'ESAT-Jは英語スピーキングテストです。20点満点で、当日の学力検査とは別に加算されます。',
        icon: 'help',
        priority: 'medium'
      }
    ],
    specificNotes: [
      '換算内申は300点満点が基本です',
      'ESAT-Jは免除可能な場合があります'
    ]
  },
  kanagawa: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '神奈川県の場合、中2と中3の両方の成績が対象です。中2は1倍、中3は2倍で計算されます。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: 'S値とは何ですか？',
        answer: 'S値は神奈川県独自の内申点計算方法です。中2・中3の評定を比率f:gで重み付けして100点満点に換算します。',
        icon: 'help',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '神奈川県では実技教科は等倍が基本ですが、学校によっては重点化（2倍など）を行う場合があります。',
        icon: 'book',
        priority: 'high'
      }
    ],
    specificNotes: [
      'f:gは合計10、各2以上の整数が基本です',
      '学校ごとに実技教科の重点化が異なる場合があります'
    ]
  },
  osaka: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '大阪府の場合、中1〜中3の3年間すべての成績が対象です。学年比は1:1:3で、中3の成績が最も重視されます。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: 'タイプⅠ〜Ⅴの違いは？',
        answer: '学校の種類ではなく、内申点と学力検査の比率（合計10）を表す5段階です。タイプⅠ（内申3：学力7）が最も学力重視、タイプⅢ（内申5：学力5）が標準、タイプⅤ（内申7：学力3）が最も内申重視です。どの高校がどのタイプを採用しているかは各校の募集要項で確認できます。',
        icon: 'help',
        priority: 'high'
      },
      {
        question: '内申点は本当に450点満点ですか？',
        answer: 'はい、大阪府は中1〜中3全学年が対象で、学年比は1:1:3（中1×2倍・中2×2倍・中3×6倍）です。9教科評定合計45点満点×3学年をこの比率で換算すると450点満点になります。',
        icon: 'alert',
        priority: 'high'
      }
    ],
    specificNotes: [
      'タイプⅢ（内申5：学力5）が標準的な比率とされています',
      '当日点は500点満点が基本です'
    ]
  },
  saitama: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '埼玉県の場合、中1〜中3の3年間すべての成績が対象です。学年比は1:1:2が標準で、中3の成績が2倍で計算されます（高校により1:1:3、1:2:3などの場合もあります）。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '埼玉県では実技教科は1倍換算が基本です。5教科と同じ比重で計算されます。',
        icon: 'book',
        priority: 'medium'
      },
      {
        question: '特殊な計算はありますか？',
        answer: '埼玉県は標準的な計算方法が多いですが、一部の学校で特色検査を実施しています。',
        icon: 'help',
        priority: 'low'
      }
    ],
    specificNotes: [
      'ほとんどの学校が標準的な計算です',
      '学校ごとの確認が重要です'
    ]
  },
  aichi: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '愛知県の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '愛知県では実技教科も主要5教科も同じ倍率（傾斜なし）で計算されます。9教科評定合計45点満点を2倍した90点満点の「評定得点」が校内順位の計算に使われます。',
        icon: 'book',
        priority: 'medium'
      },
      {
        question: '名古屋市立と県立で違いは？',
        answer: '名古屋市立高校は独自の計算方法を採用している場合があります。必ず確認が必要です。',
        icon: 'help',
        priority: 'medium'
      }
    ],
    specificNotes: [
      '名古屋市立と県立で計算方法が異なる場合があります',
      '特色検査を実施する学校があります'
    ]
  },
  hokkaido: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '北海道の場合、中1〜中3の3年間が対象ですが、学年ごとに重み付けが異なります。中1×2、中2×2、中3×3で計算します。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: '学年ごとの倍率は？',
        answer: '中1と中2は2倍、中3は3倍の重み付けです。中3の成績が最も重要になります。',
        icon: 'help',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '北海道では実技教科も主要5教科と同じ倍率が適用されます。',
        icon: 'book',
        priority: 'medium'
      }
    ],
    specificNotes: [
      '学年ごとの重み付けが特徴的（中1×2、中2×2、中3×3）',
      '合計315点満点の計算になります'
    ]
  },
  default: {
    commonQuestions: [
      {
        question: 'どの学期の成績が対象になりますか？',
        answer: '多くの都道府県の場合、中3のみの成績が対象です。中1・中2の成績は直接影響しません。',
        icon: 'calendar',
        priority: 'high'
      },
      {
        question: '実技教科の倍率は？',
        answer: '都道府県によりますが、1倍〜3倍の範囲で設定されている場合が多いです。',
        icon: 'book',
        priority: 'medium'
      },
      {
        question: '特殊な計算はありますか？',
        answer: '都道府県によって独自の計算方法があります。必ず公式資料で確認してください。',
        icon: 'help',
        priority: 'medium'
      }
    ],
    specificNotes: [
      '学校ごとの確認が重要です',
      '公式資料の確認を推奨します'
    ]
  }
};
