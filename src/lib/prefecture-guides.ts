// 都道府県別ガイドデータ（データ駆動設計）

export interface PrefectureGuide {
  summary3lines: {
    target: string;
    practical: string;
    maxScore: string;
  };
  examples: {
    all3: string;
    all4: string;
    practicalPlus1: string;
  };
  pitfalls: {
    title: string;
    items: string[];
  };
  faq: {
    question: string;
    answer: string;
  }[];
  sources: {
    name: string;
    url: string;
    lastVerified: string;
    notes: string;
  }[];
  related: {
    title: string;
    url: string;
  }[];
}

export const prefectureGuides: Record<string, PrefectureGuide> = {
  tokyo: {
    summary3lines: {
      target: '中3のみが対象（集中対策が必要）',
      practical: '2倍（実技得意な人有利）',
      maxScore: '65点（効率的な得点アップが可能）'
    },
    examples: {
      all3: '39点 / 65点満点',
      all4: '52点 / 65点満点',
      practicalPlus1: '43点（+4点）'
    },
    pitfalls: {
      title: '東京都の注意点',
      items: [
        '実技4教科（音楽・美術・保体・技家）は評定が2倍で計算される',
        '中3の成績のみが対象（中1・中2は含まれない）',
        '都立一般入試では内申点300点＋学力検査700点＋ESAT-J 20点＝1020点満点',
        '推薦入試では内申点の比重が高い（学校により異なる）',
        'ESAT-J（英語スピーキングテスト）の結果も加算される'
      ]
    },
    faq: [
      {
        question: '東京都の内申点は何点満点ですか？',
        answer: '東京都の内申点（換算内申）は65点満点です。5教科×5点＝25点、実技4教科×5点×2倍＝40点の合計です。ただし、学校・コースによって計算方法が異なる場合がありますので、必ず志望校の募集要項でご確認ください。'
      },
      {
        question: '東京都はいつの成績が内申点になりますか？',
        answer: '東京都は中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。これは中3の学習成果を重視するための制度です。'
      },
      {
        question: '東京都の実技教科が2倍になるのはなぜですか？',
        answer: '実技教科は授業時間が少ないため、学力検査（入試当日のテスト）では測れない能力を評価する目的で2倍の配点になっています。音楽・美術・保健体育・技術家庭の4教科が対象です。'
      },
      {
        question: 'ESAT-Jとは何ですか？',
        answer: 'ESAT-J（イーサットジェイ）は東京都立高校入試で導入された英語スピーキングテストです。結果は20点満点で加算され、内申点300点＋学力検査700点＋ESAT-J 20点＝1020点満点で合否判定されます。ただし、ESAT-Jを実施しない学校・コースもありますので、志望校の募集要項でご確認ください。'
      }
    ],
    sources: [
      {
        name: '東京都教育委員会',
        url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/index.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度東京都立高等学校入学者選抜実施要綱 第3章第2節「調査書の取扱い」'
      }
    ],
    related: [
      { title: '東京都の内申点計算ツール', url: '/tokyo/naishin' },
      { title: '東京都から逆算する', url: '/reverse?pref=tokyo' },
      { title: '換算内申と素内申の違い', url: '/blog/naishin-vs-raw' }
    ]
  },
  
  kanagawa: {
    summary3lines: {
      target: '中2・中3が対象（早めの対策が有利）',
      practical: '等倍（バランス型が有利）',
      maxScore: '135点（高得点戦略が必要）'
    },
    examples: {
      all3: '90点 / 135点満点',
      all4: '120点 / 135点満点',
      practicalPlus1: '94点（+4点）'
    },
    pitfalls: {
      title: '神奈川県の注意点',
      items: [
        '中2と中3の成績が対象（中1は含まれない）',
        '中3の成績は2倍で計算される',
        'S値（学力検査）・A値（内申点）・特色検査の比率は学校ごとに異なる',
        '面接が全校で実施される',
        '特色検査を実施する高校では追加の対策が必要'
      ]
    },
    faq: [
      {
        question: '神奈川県の内申点は何点満点ですか？',
        answer: '神奈川県の内申点は135点満点です。中2の9教科×5点＝45点、中3の9教科×5点×2倍＝90点の合計です。'
      },
      {
        question: '神奈川県はいつの成績が内申点になりますか？',
        answer: '神奈川県は中学2年生と3年生の成績が対象です。中3の成績は2倍で計算されます。中1の成績は含まれません。'
      },
      {
        question: '神奈川県のS値・A値とは何ですか？',
        answer: 'S値は学力検査の得点、A値は内申点を指します。S値とA値の比率は学校によって異なり、例えば「S値:A値＝6:4」のように設定されています。'
      },
      {
        question: '神奈川県の特色検査とは何ですか？',
        answer: '特色検査は一部の高校で実施される追加の検査です。教科横断型の問題や自己表現、実技などが課されます。内申点・学力検査に加えて評価されます。'
      }
    ],
    sources: [
      {
        name: '神奈川県教育委員会',
        url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度神奈川県立高等学校入学者選抜実施要綱 第2章「選抜方法」'
      }
    ],
    related: [
      { title: '神奈川県の内申点計算ツール', url: '/kanagawa/naishin' },
      { title: '神奈川県から逆算する', url: '/reverse?pref=kanagawa' },
      { title: 'S値・A値の解説', url: '/blog/s-value-a-value' }
    ]
  },

  aichi: {
    summary3lines: {
      target: '中3のみが対象（集中対策が必要）',
      practical: '等倍（実技も他教科と同じ扱い）',
      maxScore: '90点（全教科×2倍換算）'
    },
    examples: {
      all3: '54点 / 90点満点',
      all4: '72点 / 90点満点',
      practicalPlus1: '56点（+2点）'
    },
    pitfalls: {
      title: '愛知県の注意点',
      items: [
        '中3の9教科×5段階×2倍で計算（90点満点）',
        '全教科が同じ扱い（実技教科も等倍）',
        '中1・中2の成績は含まれない',
        '特色選抜では別の評価基準がある場合あり',
        '推薦入試では内申点の比重が高い'
      ]
    },
    faq: [
      {
        question: '愛知県の内申点は何点満点ですか？',
        answer: '愛知県の内申点は90点満点です。中学3年生の9教科×5段階×2倍で計算されます。全教科が同じ扱いで、実技教科も他の教科と同じく2倍で計算されます。'
      },
      {
        question: '愛知県はいつの成績が内申点になりますか？',
        answer: '愛知県は中学3年生の成績のみが対象です。中1・中2の成績は含まれません。中3の成績が2倍で換算されるため、中3の学習が非常に重要です。'
      },
      {
        question: '愛知県の実技教科はどう扱われますか？',
        answer: '愛知県では実技4教科も他の5教科と同じ扱いです。全教科が2倍で計算されるため、実技教科も2倍になります。「実技だけ傾斜配点」というわけではありません。'
      },
      {
        question: '愛知県で内申点を上げるコツは？',
        answer: '中3の成績が2倍で計算されるため、中3の全教科で安定した評定を目指すことが重要です。特定の教科に偏らず、バランスの良い成績を目指しましょう。'
      }
    ],
    sources: [
      {
        name: '愛知県教育委員会',
        url: 'https://www.pref.aichi.jp/kensei/koukou/nyuugaku.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度愛知県立高等学校入学者選抜実施要綱 第3章「調査書の取扱い」'
      }
    ],
    related: [
      { title: '愛知県の内申点計算ツール', url: '/aichi/naishin' },
      { title: '愛知県から逆算する', url: '/reverse?pref=aichi' },
      { title: '内申点の基本を学ぶ', url: '/blog/naishin-guide' }
    ]
  },

  osaka: {
    summary3lines: {
      target: '中1〜中3が対象（早めの対策が有利）',
      practical: '等倍（バランス型が有利）',
      maxScore: '450点（高得点戦略が必要）'
    },
    examples: {
      all3: '270点 / 450点満点',
      all4: '360点 / 450点満点',
      practicalPlus1: '274点（+4点）'
    },
    pitfalls: {
      title: '大阪府の注意点',
      items: [
        '中1〜中3の3年間の成績が対象',
        '学年比率は1:2:6（中3が3倍）',
        '実技4教科も5教科と同じ扱い',
        'チャレンジテストの結果が評定に影響する可能性',
        '文理学科・普通科などでボーダーが大きく異なる'
      ]
    },
    faq: [
      {
        question: '大阪府の内申点は何点満点ですか？',
        answer: '大阪府の内申点は450点満点です。中1（45点）＋中2（45点×2）＋中3（45点×6）＝450点として計算されます。'
      },
      {
        question: '大阪府はいつの成績が内申点になりますか？',
        answer: '大阪府は中学1年生から3年生までの3年間の成績が対象です。学年比率は1:2:6で、中3の成績が最も重視されます。'
      },
      {
        question: '大阪府のチャレンジテストとは何ですか？',
        answer: 'チャレンジテストは大阪府独自の統一テストで、中1〜中3で実施されます。このテストの結果が学校の評定（内申点）の目安として使われることがあります。'
      },
      {
        question: '大阪府で内申点を上げるコツは？',
        answer: '中3の成績が6倍で計算されるため、中3の成績向上が最も効果的です。また、チャレンジテストで好成績を取ると評定アップにつながる可能性があります。'
      }
    ],
    sources: [
      {
        name: '大阪府教育委員会',
        url: 'https://www.osaka-c.ed.jp/nyuushi/',
        lastVerified: '2026年1月30日',
        notes: '令和8年度大阪府立高等学校入学者選抜実施要綱 第3章「選抜方法」'
      }
    ],
    related: [
      { title: '大阪府の内申点計算ツール', url: '/osaka/naishin' },
      { title: '大阪府から逆算する', url: '/reverse?pref=osaka' },
      { title: 'チャレンジテストの解説', url: '/blog/challenge-test' }
    ]
  }
};

// デフォルトガイド（データがない県用）
export const defaultGuide: PrefectureGuide = {
  summary3lines: {
    target: '中1〜中3が対象（早めの対策が有利）',
    practical: '等倍（バランス型が有利）',
    maxScore: '135点（効率的な得点アップが可能）'
  },
  examples: {
    all3: '90点 / 135点満点',
    all4: '120点 / 135点満点',
    practicalPlus1: '94点（+4点）'
  },
  pitfalls: {
    title: 'この県の注意点',
    items: [
      '計算方法や配点は高校によって異なる場合があります',
      '最新の情報は各都道府県教育委員会の公式サイトでご確認ください',
      '特色選抜や推薦入試では別の計算方法が使われることがあります'
    ]
  },
  faq: [
    {
      question: 'この県の内申点は何点満点ですか？',
      answer: '都道府県や計算方式によって異なります。上記の「計算方法の概要」をご確認ください。'
    },
    {
      question: '内申点を上げるにはどうすればいいですか？',
      answer: '定期テストで高得点を取る、提出物を期限内に丁寧に仕上げる、授業に積極的に参加する、の3つが基本です。'
    },
    {
      question: '実技教科の内申点は重要ですか？',
      answer: '多くの都道府県で実技教科の評定は重要です。特に実技教科に傾斜配点がある県では、実技教科で1点上げると大きな効果があります。'
    }
  ],
  sources: [
    {
      name: '各都道府県教育委員会',
      url: '',
      lastVerified: '2026年1月30日',
      notes: '各県の入学者選抜要綱を参照'
    }
  ],
  related: [
    { title: '内申点計算ツール', url: '/' },
    { title: '志望校から逆算', url: '/reverse' },
    { title: '内申点ガイド', url: '/blog/naishin-guide' }
  ]
};

// ガイドデータを取得する関数
export function getPrefectureGuide(prefectureCode: string): PrefectureGuide {
  return prefectureGuides[prefectureCode] || defaultGuide;
}
