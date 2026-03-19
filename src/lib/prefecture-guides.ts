// 都道府県別ガイドデータ（データ駆動設計）

import { PrefectureConfig } from './prefectures';

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

  saitama: {
    summary3lines: {
      target: '中1〜中3が対象（学年比1:1:2）',
      practical: '等倍（全教科均等評価）',
      maxScore: '180点（中3の比重が高い）'
    },
    examples: {
      all3: '108点 / 180点満点',
      all4: '144点 / 180点満点',
      practicalPlus1: '112点（+4点）'
    },
    pitfalls: {
      title: '埼玉県の注意点',
      items: [
        '中1〜中3の3年間の成績が対象（学年比1:1:2が標準）',
        '高校によって学年比率が異なる（1:1:3や1:2:3もあり）',
        '実技4教科も5教科と同じ扱い（等倍）',
        '学校選択問題実施校では数学・英語の難易度が高い',
        '加算点制度があり、部活動や資格検定が評価される場合がある'
      ]
    },
    faq: [
      {
        question: '埼玉県の内申点は何点満点ですか？',
        answer: '埼玉県の内申点は標準的に180点満点です。中1（45点）＋中2（45点）＋中3（45点×2）＝180点として計算されます。ただし、高校によって学年比率が異なり、1:1:3の場合は225点満点になります。'
      },
      {
        question: '埼玉県はいつの成績が内申点になりますか？',
        answer: '埼玉県は中学1年生から3年生までの3年間の成績が対象です。標準的な学年比率は1:1:2で、中3の成績が2倍で計算されます。中1から安定した成績を保つことが重要です。'
      },
      {
        question: '埼玉県の学校選択問題とは何ですか？',
        answer: '学校選択問題は、一部の進学校で実施される難易度の高い数学・英語の入試問題です。通常の学力検査問題より応用問題が多く、上位校を目指す受験生向けの制度です。'
      },
      {
        question: '埼玉県で内申点を上げるコツは？',
        answer: '中3の成績が2倍で計算されるため、中3での成績アップが最も効果的です。また、加算点制度があるため、部活動の実績や英検・漢検などの資格取得も評価に加わる可能性があります。'
      }
    ],
    sources: [
      {
        name: '埼玉県教育委員会',
        url: 'https://www.pref.saitama.lg.jp/f2208/nyuushi.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度埼玉県公立高等学校入学者選抜実施要綱 第3章「選抜方法」'
      }
    ],
    related: [
      { title: '埼玉県の内申点計算ツール', url: '/saitama/naishin' },
      { title: '埼玉県から逆算する', url: '/reverse?pref=saitama' },
      { title: '内申点の基本を学ぶ', url: '/blog/naishin-guide' }
    ]
  },

  chiba: {
    summary3lines: {
      target: '中1〜中3が対象（3年間均等）',
      practical: '等倍（バランス型が有利）',
      maxScore: '135点（K値で換算される場合あり）'
    },
    examples: {
      all3: '81点 / 135点満点',
      all4: '108点 / 135点満点',
      practicalPlus1: '85点（+4点）'
    },
    pitfalls: {
      title: '千葉県の注意点',
      items: [
        '中1〜中3の3年間の成績が均等に評価される',
        '全教科が等倍（実技教科も5教科と同じ扱い）',
        'K値（0.5〜2）による換算がある高校がある',
        '2日間の入試日程で実施される',
        '自己表現（面接・作文等）が全校で実施される'
      ]
    },
    faq: [
      {
        question: '千葉県の内申点は何点満点ですか？',
        answer: '千葉県の内申点は135点満点です。中1〜中3の9教科×5段階＝45点×3年間＝135点として計算されます。全教科が等倍で、実技教科の傾斜配点はありません。'
      },
      {
        question: '千葉県はいつの成績が内申点になりますか？',
        answer: '千葉県は中学1年生から3年生までの3年間の成績が均等に評価されます。中1の成績も中3と同じ重みがあるため、中1から安定した成績を維持することが重要です。'
      },
      {
        question: '千葉県のK値とは何ですか？',
        answer: 'K値は高校ごとに設定される内申点の換算係数です。K値が1.0より大きい高校は内申点重視、小さい高校は学力検査重視の傾向があります。K値は0.5〜2の範囲で設定されます。'
      },
      {
        question: '千葉県で内申点を上げるコツは？',
        answer: '3年間均等に評価されるため、中1からの積み重ねが重要です。特に中1で苦手教科を作らないことがポイント。また、自己表現対策も並行して進めましょう。'
      }
    ],
    sources: [
      {
        name: '千葉県教育委員会',
        url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度千葉県公立高等学校入学者選抜実施要綱 第2章「選抜方法」'
      }
    ],
    related: [
      { title: '千葉県の内申点計算ツール', url: '/chiba/naishin' },
      { title: '千葉県から逆算する', url: '/reverse?pref=chiba' },
      { title: 'K値の解説', url: '/blog/k-value' }
    ]
  },

  hokkaido: {
    summary3lines: {
      target: '中1〜中3が対象（中3は3倍）',
      practical: '等倍（全教科同じ扱い）',
      maxScore: '315点（学年傾斜が大きい）'
    },
    examples: {
      all3: '189点 / 315点満点',
      all4: '252点 / 315点満点',
      practicalPlus1: '193点（+4点）'
    },
    pitfalls: {
      title: '北海道の注意点',
      items: [
        '中1は2倍、中2は2倍、中3は3倍で計算される（315点満点）',
        '全教科が等倍（実技教科の傾斜配点なし）',
        '学区制があり、通学区域による制限がある',
        '裁量問題（応用問題）を出題する高校がある',
        '推薦入試では面接・自己推薦書が重要'
      ]
    },
    faq: [
      {
        question: '北海道の内申点は何点満点ですか？',
        answer: '北海道の内申点は315点満点です。中1（45点×2）＋中2（45点×2）＋中3（45点×3）＝315点として計算されます。中3の成績が最も重視される配点です。'
      },
      {
        question: '北海道はいつの成績が内申点になりますか？',
        answer: '北海道は中学1年生から3年生までの3年間の成績が対象です。中1・中2は2倍、中3は3倍で計算されるため、学年が上がるにつれて重みが増します。'
      },
      {
        question: '北海道の学区制とは何ですか？',
        answer: '北海道には通学区域の制限があり、原則として居住する学区内の高校に出願します。ただし、学区外からの受験が認められる場合もあります。詳細は北海道教育委員会の公式情報でご確認ください。'
      },
      {
        question: '北海道で内申点を上げるコツは？',
        answer: '中3の成績が3倍で計算されるため、中3での成績向上が最も効果的です。とはいえ中1・中2も2倍で計算されるため、早期からの対策も重要です。'
      }
    ],
    sources: [
      {
        name: '北海道教育委員会',
        url: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/gks/koukounyuusenn.html',
        lastVerified: '2026年1月30日',
        notes: '令和8年度北海道立高等学校入学者選抜実施要綱 第3章「調査書の取扱い」'
      }
    ],
    related: [
      { title: '北海道の内申点計算ツール', url: '/hokkaido/naishin' },
      { title: '北海道から逆算する', url: '/reverse?pref=hokkaido' },
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
  },

  fukuoka: {
    summary3lines: {
      target: '中3のみが対象（集中対策が必要）',
      practical: '等倍（全教科同じ扱い）',
      maxScore: '45点（シンプルな計算方式）'
    },
    examples: {
      all3: '27点 / 45点満点',
      all4: '36点 / 45点満点',
      practicalPlus1: '31点（+4点）'
    },
    pitfalls: {
      title: '福岡県の注意点',
      items: [
        '中3の成績のみが対象（中1・中2は含まれない）',
        '全教科が等倍で計算される（45点満点）',
        '一部の高校では特定教科に傾斜配点がある場合がある',
        '特色化選抜では面接・作文・実技などが課される',
        '学区制があり、第1〜第13学区に分かれている'
      ]
    },
    faq: [
      {
        question: '福岡県の内申点は何点満点ですか？',
        answer: '福岡県の内申点は45点満点です。中学3年生の9教科×5段階＝45点として計算されます。全教科が等倍で、シンプルな計算方式です。'
      },
      {
        question: '福岡県はいつの成績が内申点になりますか？',
        answer: '福岡県は中学3年生の成績のみが対象です。中1・中2の成績は内申点には含まれません。中3の成績に集中して対策することが重要です。'
      },
      {
        question: '福岡県の学区制はどうなっていますか？',
        answer: '福岡県は第1〜第13学区に分かれており、原則として居住する学区内の高校に出願します。ただし、一部の学科や高校では学区外からの受験も可能です。'
      },
      {
        question: '福岡県で内申点を上げるコツは？',
        answer: '中3の成績のみが対象のため、中3での集中的な成績向上が最も効果的です。全教科が等倍なので、苦手教科を克服して全体の底上げを図りましょう。'
      }
    ],
    sources: [
      {
        name: '福岡県教育委員会',
        url: 'https://www.pref.fukuoka.lg.jp/contents/kennittei.html',
        lastVerified: '2026年1月31日',
        notes: '令和8年度福岡県立高等学校入学者選抜実施要綱 第2章「選抜方法」'
      }
    ],
    related: [
      { title: '福岡県の内申点計算ツール', url: '/fukuoka/naishin' },
      { title: '福岡県から逆算する', url: '/reverse?pref=fukuoka' },
      { title: '内申点の基本を学ぶ', url: '/blog/naishin-guide' }
    ]
  },

  hyogo: {
    summary3lines: {
      target: '中3のみが対象（集中対策が必要）',
      practical: '7.5倍（実技教科が極めて重要）',
      maxScore: '250点（実技教科の影響が大きい）'
    },
    examples: {
      all3: '150点 / 250点満点',
      all4: '200点 / 250点満点',
      practicalPlus1: '157.5点（+7.5点）'
    },
    pitfalls: {
      title: '兵庫県の注意点',
      items: [
        '中3の成績のみが対象',
        '5教科は4倍、実技4教科は7.5倍で計算される（250点満点）',
        '実技教科の倍率が全国トップクラスに高い',
        '実技教科1点アップが5教科の約2倍の効果がある',
        '複数志願選抜制度により、第2志望も出願可能'
      ]
    },
    faq: [
      {
        question: '兵庫県の内申点は何点満点ですか？',
        answer: '兵庫県の内申点は250点満点です。5教科×5段階×4倍＝100点、実技4教科×5段階×7.5倍＝150点の合計です。実技教科が全体の60%を占める独特の配点です。'
      },
      {
        question: '兵庫県はいつの成績が内申点になりますか？',
        answer: '兵庫県は中学3年生の成績のみが対象です。中1・中2の成績は内申点には含まれません。中3の成績に集中して対策することが重要です。'
      },
      {
        question: '兵庫県で実技教科が重要なのはなぜですか？',
        answer: '兵庫県では実技4教科が7.5倍で計算されるため、実技教科1点アップは5教科の約2倍の効果があります。実技教科で高評定を取ることが、内申点アップの最も効率的な方法です。'
      },
      {
        question: '兵庫県の複数志願選抜とは何ですか？',
        answer: '複数志願選抜は、第1志望と第2志望の2校に出願できる制度です。第1志望校には加算点（25点）が付与されるため、第1志望で有利になります。'
      }
    ],
    sources: [
      {
        name: '兵庫県教育委員会',
        url: 'https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/',
        lastVerified: '2026年1月31日',
        notes: '令和8年度兵庫県立高等学校入学者選抜実施要綱 第3章「選抜方法」'
      }
    ],
    related: [
      { title: '兵庫県の内申点計算ツール', url: '/hyogo/naishin' },
      { title: '兵庫県から逆算する', url: '/reverse?pref=hyogo' },
      { title: '実技教科の重要性', url: '/blog/practical-subjects' }
    ]
  },

  hiroshima: {
    summary3lines: {
      target: '中1〜中3が対象（学年比1:1:3）',
      practical: '等倍（全教科同じ扱い）',
      maxScore: '225点（中3の比重が高い）'
    },
    examples: {
      all3: '135点 / 225点満点',
      all4: '180点 / 225点満点',
      practicalPlus1: '139点（+4点）'
    },
    pitfalls: {
      title: '広島県の注意点',
      items: [
        '中1〜中3の3年間の成績が対象（学年比1:1:3）',
        '全教科が等倍（実技教科の傾斜配点なし）',
        '中3の成績が3倍で計算されるため中3が重要',
        '自己表現が全校で実施される',
        '選抜Ⅰ（推薦）と選抜Ⅱ（一般）で評価方法が異なる'
      ]
    },
    faq: [
      {
        question: '広島県の内申点は何点満点ですか？',
        answer: '広島県の内申点は225点満点です。中1（45点）＋中2（45点）＋中3（45点×3）＝225点として計算されます。中3の成績が3倍で計算される配点です。'
      },
      {
        question: '広島県はいつの成績が内申点になりますか？',
        answer: '広島県は中学1年生から3年生までの3年間の成績が対象です。学年比率は1:1:3で、中3の成績が最も重視されます。'
      },
      {
        question: '広島県の自己表現とは何ですか？',
        answer: '自己表現は広島県独自の入試制度で、全校で実施されます。自分の得意なことや中学校での活動について、口頭やパフォーマンスで表現する試験です。'
      },
      {
        question: '広島県で内申点を上げるコツは？',
        answer: '中3の成績が3倍で計算されるため、中3での成績向上が最も効果的です。ただし中1・中2の成績も計上されるため、早めの対策も重要です。自己表現の準備も並行して進めましょう。'
      }
    ],
    sources: [
      {
        name: '広島県教育委員会',
        url: 'https://www.pref.hiroshima.lg.jp/site/kyouiku/08senior-2nd-r8-nyuushi-r8-kou-r8-kou-mokuji-r8-kou-mokuji.html',
        lastVerified: '2026年1月31日',
        notes: '令和8年度広島県立高等学校入学者選抜実施要綱 第3章「選抜方法」'
      }
    ],
    related: [
      { title: '広島県の内申点計算ツール', url: '/hiroshima/naishin' },
      { title: '広島県から逆算する', url: '/reverse?pref=hiroshima' },
      { title: '内申点の基本を学ぶ', url: '/blog/naishin-guide' }
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
      answer: 'この県の内申点は135点満点です。中1〜中3の9教科×5段階で計算されます。'
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

// 都道府県データから動的にFAQを生成する関数
export function generateDynamicFAQ(prefectureCode: string, prefecture: PrefectureConfig): { question: string; answer: string }[] {
  const targetGradesText = prefecture.targetGrades.length === 1 
    ? `中${prefecture.targetGrades[0]}のみ` 
    : `中${prefecture.targetGrades.join('・')}`;

  const multiplierText = prefecture.coreMultiplier === 1 && prefecture.practicalMultiplier === 1
    ? '等倍'
    : prefecture.coreMultiplier !== prefecture.practicalMultiplier
    ? `5教科×${prefecture.coreMultiplier}倍、実技4教科×${prefecture.practicalMultiplier}倍`
    : `全教科×${prefecture.coreMultiplier}倍`;

  return [
    {
      question: `${prefecture.name}の内申点は何点満点ですか？`,
      answer: `${prefecture.name}の内申点は${prefecture.maxScore}点満点です。${targetGradesText}が対象で、${multiplierText}で計算されます。`
    },
    {
      question: `${prefecture.name}はいつの成績が内申点になりますか？`,
      answer: `${prefecture.name}は${targetGradesText}の成績が対象です。${prefecture.targetGrades.length === 1 ? '集中した対策が効果的です。' : '早期からの対策が有利です。'}`
    },
    {
      question: `${prefecture.name}の実技教科はどう扱われますか？`,
      answer: `${prefecture.name}では実技4教科は${prefecture.practicalMultiplier === 1 ? '他の教科と同じ扱いです。' : `${prefecture.practicalMultiplier}倍で計算され、特に重要です。`}`
    }
  ];
}
