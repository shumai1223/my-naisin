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
      target: '<strong>中3のみ</strong>が対象（1・2年の成績は逆転可能！）',
      practical: '実技は<strong>2倍</strong>（合計65点満点のカギ）',
      maxScore: '換算内申65点（1点＝入試当日点4.6点分）'
    },
    examples: {
      all3: '39点（中堅校のボーダーライン）',
      all4: '52点（人気校・上位校の必須ライン）',
      practicalPlus1: '43点（実技1つで当日点約18点分の価値）'
    },
    pitfalls: {
      title: '東京都立入試の「2026年最新」注意点',
      items: [
        '<strong>ESAT-J（英語スピーキングテスト）</strong>が20点分加算。A判定(20点)とD判定(8点)では12点の差がつき、内申点並みの重みがあります。',
        '実技4教科は「評定×2」で計算。主要5教科で「5」を取るのと、実技で「4」から「5」に上げるのでは、後者の方が<strong>2倍効率的</strong>です。',
        '中3の2学期（12月）に出る調査書点がすべて。1・2学期の中間・期末テストの「合計」で決まるため、1学期からの積み重ねが必須です。',
        '上位校（日比谷・西・国立など）では「自校作成問題」が課され、内申点以上に「解く力」が試されます。',
        '「主体的に学習に取り組む態度」がC評価だと、テストが良くても「3」止まりになるケースが急増中。'
      ]
    },
    faq: [
      {
        question: '東京都の「換算内申」と「素内申」の違いは？',
        answer: '「素内申」は9教科の5段階評価を単純に足したもの（45点満点）。「換算内申」は実技4教科を2倍にして足したもの（65点満点）です。都立高校の一般入試では、この<strong>換算内申</strong>が合否判定に使われます。'
      },
      {
        question: '中1・中2の成績が悪いのですが、諦めるべき？',
        answer: 'いいえ！東京都立の一般入試は<strong>中学3年生の成績のみ</strong>を見ます。中1・中2がオール3でも、中3でオール4に上げれば、上位校を十分に狙えます。今からでも遅くありません。'
      },
      {
        question: 'ESAT-Jは受けないとどうなりますか？',
        answer: '不受験者の場合は「仮の点数」が算出されますが、原則として受験が推奨されています。私立専願の場合は不要なケースが多いですが、都立第一志望なら避けては通れない壁です。'
      }
    ],
    sources: [
      {
        name: '東京都教育委員会（入学者選抜）',
        url: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/',
        lastVerified: '2026年2月10日',
        notes: '令和8年度の最新実施要綱に基づき更新済み。'
      }
    ],
    related: [
      { title: '【東京版】換算内申の計算ツール', url: '/tokyo/naishin' },
      { title: '東京の「自校作成校」の内申目安', url: '/blog/tokyo-jikousakusei' },
      { title: 'ESAT-JでA判定を取る戦略', url: '/blog/esat-j-strategy' }
    ]
  },
  
  kanagawa: {
    summary3lines: {
      target: '<strong>中2・中3</strong>が対象（中2の3学期から勝負！）',
      practical: '等倍（ただし重点化校に注意）',
      maxScore: '135点満点（中3は2倍換算される）'
    },
    examples: {
      all3: '90点（中堅校の平均レベル）',
      all4: '120点（横浜翠嵐・湘南などのトップ校必須レベル）',
      practicalPlus1: '94点（中3で1つ上げると3点アップ）'
    },
    pitfalls: {
      title: '神奈川県入試の「独自ルール」と罠',
      items: [
        '<strong>面接の廃止</strong>：2024年度から原則廃止され、その分「内申」「当日点」「特色検査」の比重が上がりました。',
        '<strong>中3の成績は2倍</strong>：中2の45点満点 ＋ 中3の90点満点 ＝ 135点満点。中3での爆伸びが逆転の鍵です。',
        '<strong>特色検査の壁</strong>：横浜翠嵐や柏陽、希望ケ丘などの上位校では、教科横断型の「特色検査」が課されます。内申点が高くてもここで逆転されるケースが多発。',
        '<strong>S値の計算</strong>：学校ごとに「2:8:2」や「3:7:3」など、内申と当日点の比率が異なります。内申が低い人は「当日点重視」の学校を選ぶ戦略が有効。',
        '主体的態度のA判定が必須：観点別評価の「主体性」がB以下だと、5段階評価で「4」以上を取るのが極めて難しくなっています。'
      ]
    },
    faq: [
      {
        question: '神奈川県は中1の成績は関係ありませんか？',
        answer: '公立高校の一般入試に関しては、中1の成績は算出に含まれません。ただし、私立高校の推薦や併願優遇では中1・中2の成績を見られることが多いため、完全に無視するのは危険です。'
      },
      {
        question: '「重点化」とは何ですか？',
        answer: '特定の教科の評定を1.5倍や2倍にして計算する制度です。例えば「理数科なら数学と理科を2倍にする」など。自分の得意教科が重点化される高校を選ぶと有利になります。'
      },
      {
        question: '特色検査の対策はいつからすべき？',
        answer: '内申点が確定する中3の2学期以降に集中して行うのが一般的ですが、思考力問題に慣れるために中3の夏休みから少しずつ過去問に触れておくのがベストです。'
      }
    ],
    sources: [
      {
        name: '神奈川県教育委員会（公立高校入試）',
        url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen.html',
        lastVerified: '2026年2月10日',
        notes: '面接廃止後の新制度に対応した情報を掲載。'
      }
    ],
    related: [
      { title: '【神奈川版】S値シミュレーター', url: '/kanagawa/naishin' },
      { title: '特色検査で差がつくポイント', url: '/blog/kanagawa-tokushoku' },
      { title: '内申が足りない時の「当日重視」校選び', url: '/blog/kanagawa-s-value' }
    ]
  },

  osaka: {
    summary3lines: {
      target: '<strong>中1〜中3</strong>の3年間（1年からの積み重ねが必須）',
      practical: '等倍（全教科が同じ重み）',
      maxScore: '450点満点（比率は1:1:3と中3重視）'
    },
    examples: {
      all3: '270点（標準的な公立校ライン）',
      all4: '360点（文理学科を狙うなら最低ライン）',
      practicalPlus1: '276点（中3の1点アップは内申6点分）'
    },
    pitfalls: {
      title: '大阪府入試の「激戦」を生き抜く注意点',
      items: [
        '<strong>チャレンジテストの影響</strong>：府内統一の「チャレンジテスト」の結果により、各中学校の評定平均の範囲が制限されます。自分の頑張りだけでなく、学校全体のレベルも評定に関わります。',
        '<strong>英語外部検定（英検）</strong>：文理学科などの上位校では、英検2級で当日点80%、準1級で100%読み替えが適用。英検を持っていないと英語で絶望的な差をつけられることも。',
        '<strong>選抜タイプ（I〜III）</strong>：学校によって「内申点：当日点」の比率が「3:7」「5:5」「7:3」と分かれます。トップ校はほぼ「3:7」で、当日点勝負です。',
        '実技教科も等倍だが、3年分合算されると大きな差に。特に中3は「6倍」換算（45点×6＝270点分）されるため、中3の副教科は絶対に落とせません。',
        '「C問題」の難易度：英語・数学・国語で難易度別の問題（A・B・C）があり、上位校が採用するC問題は全国屈指の難易度です。'
      ]
    },
    faq: [
      {
        question: '大阪府は中1からサボれないって本当？',
        answer: '本当です。中1：中2：中3の比率は「1：1：3」で計算されます。中3が最も重いですが、中1・中2の成績も計180点分（450点満点中）含まれるため、早期の対策が非常に重要です。'
      },
      {
        question: '英検2級は絶対に必要ですか？',
        answer: '文理学科（北野・天王寺など）を目指すなら、<strong>必須</strong>と言えます。合格者の大半が英検2級以上を保持しており、持っていない場合は英語の試験で非常に高いリスクを背負うことになります。'
      },
      {
        question: 'チャレンジテストで点数が悪いと内申も下がる？',
        answer: '学校全体の平均点が低いと、その学校の「評定の付け方」が厳しく制限される仕組み（絶対評価の担保）があるため、間接的に影響する可能性があります。'
      }
    ],
    sources: [
      {
        name: '大阪府教育委員会（入試情報）',
        url: 'https://www.pref.osaka.lg.jp/kotogakko/gakuji-g3/',
        lastVerified: '2026年2月10日',
        notes: '英検読み替え制度、C問題採用校の最新リストを確認。'
      }
    ],
    related: [
      { title: '【大阪版】内申点計算（1:1:3対応）', url: '/osaka/naishin' },
      { title: '文理学科合格のための「英検」戦略', url: '/blog/osaka-eiken' },
      { title: 'チャレンジテストで内申を死守する方法', url: '/blog/osaka-challenge-test' }
    ]
  },

  saitama: {
    summary3lines: {
      target: '中1〜中3が対象（学年比1:1:2が標準）',
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
        '学区制があり、第1〜第13学区に分かっている'
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
  },
  
  aichi: {
    summary3lines: {
      target: '中3のみが対象（集中対策が必要）',
      practical: '等倍（全教科均等）',
      maxScore: '90点（1点の差が合否を分ける）'
    },
    examples: {
      all3: '54点（中堅校の標準ライン）',
      all4: '72点（旭丘・明和などのトップ校目安）',
      practicalPlus1: '56点（1教科アップで2点加算）'
    },
    pitfalls: {
      title: '愛知県入試の「高倍率」と注意点',
      items: [
        '<strong>中3の成績×2</strong>：1教科（5段階）が2倍され、9教科で90点満点。中1・中2は含まれないため、中3での逆転が可能です。',
        '<strong>A・Bグループ2回受験</strong>：公立高校を2校受験できる独自制度。内申点が足りなくても、実力相応校と挑戦校の組み合わせが可能です。',
        '<strong>校内順位の決定</strong>：当日点と内申点の合計で決まる「I・II・III型」の校内規定があり、進学校ほど当日点重視（II型・III型）になります。',
        '副教科も等倍ですが、満点が90点と低いため、副教科の「3」は「5」の人と4点差（当日点数点分）になります。',
        '特色選抜の拡大：一部の普通科でも特色選抜が導入され、内申点以外の活動実績も重視されるようになっています。'
      ]
    },
    faq: [
      {
        question: '愛知県は2校受けられるって本当？',
        answer: 'はい、AグループとBグループから1校ずつ、計2校の公立高校に出願できます。これにより、第一志望にチャレンジしつつ、第二志望で確実に合格を狙う戦略が立てられます。'
      },
      {
        question: '愛知県で内申30だとどこの高校に行ける？',
        answer: '内申30（換算60点）は中堅校への合格圏内です。ただし、名古屋市内の人気校では当日点での高い得点力が求められます。'
      },
      {
        question: '中1・中2の成績は全く見られない？',
        answer: '公立一般入試の点数計算には含まれません。しかし、推薦入試では3年間の活動実績が評価対象となります。'
      }
    ],
    sources: [
      {
        name: '愛知県教育委員会（高等学校入試）',
        url: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
        lastVerified: '2026年2月10日',
        notes: '令和8年度の新入試日程・制度に基づき更新。'
      }
    ],
    related: [
      { title: '【愛知版】内申点・校内順位計算', url: '/aichi/naishin' },
      { title: '愛知の「A・Bグループ」戦略ガイド', url: '/blog/aichi-ab-group' },
      { title: '内申30からの逆転合格術', url: '/blog/naishin-30-strategy' }
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


import { getPrefectureByCode } from './prefectures';


import { getPrefectureByCode } from './prefectures';

// ガイドデータを取得する関数
export function getPrefectureGuide(prefectureCode: string): PrefectureGuide {
  // すでに詳細データがある県はそれを返す
  if (prefectureGuides[prefectureCode]) {
    return prefectureGuides[prefectureCode];
  }

  // データがない県は、prefectures.tsの基本データを使って固有の文章を生成する
  const pref = getPrefectureByCode(prefectureCode);
  if (!pref) return defaultGuide;

  const targetText = pref.targetGrades.length === 1 
    ? `中${pref.targetGrades[0]}のみが対象（集中対策が必要！）` 
    : `中${pref.targetGrades.join('・')}が対象（学年ごとの比率に注意）`;
    
  const practicalText = pref.practicalMultiplier > 1 
    ? `実技は${pref.practicalMultiplier}倍（実技教科の重要度が極めて高い）` 
    : '実技は等倍（5教科と同じ重み、バランスが重要）';

  return {
    summary3lines: {
      target: targetText,
      practical: practicalText,
      maxScore: `${pref.maxScore}点満点（志望校のボーダーラインを確認しよう）`
    },
    examples: {
      all3: `${Math.floor(pref.maxScore * 0.6)}点 / ${pref.maxScore}点満点（中堅校の目安）`,
      all4: `${Math.floor(pref.maxScore * 0.8)}点 / ${pref.maxScore}点満点（上位校の目安）`,
      practicalPlus1: `実技を1つ上げると大きなアドバンテージに`
    },
    pitfalls: {
      title: `${pref.name}入試の注意点と戦略`,
      items: [
        `${pref.name}の公立高校入試では、${targetText}です。`,
        `特に注意すべきは副教科の扱いです。${practicalText}。`,
        `満点が${pref.maxScore}点であることを意識し、自分の現在地と志望校の差を正確に把握しましょう。`,
        `推薦入試や特色選抜では、一般入試と内申点の計算方法や配点が異なる場合があるため、必ず志望校の募集要項を確認してください。`,
        `最新の入試制度変更（面接の有無や独自検査など）については、${pref.name}教育委員会の公式発表を定期的にチェックすることが合格への第一歩です。`
      ]
    },
    faq: [
      {
        question: `${pref.name}の内申点は何点満点ですか？`,
        answer: `${pref.name}の内申点は${pref.maxScore}点満点です。志望校の合格ラインから逆算して、あと何点必要か把握しましょう。`
      },
      {
        question: `いつの成績が内申点に入りますか？`,
        answer: `${targetText}となっています。`
      },
      {
        question: `${pref.name}での実技教科の扱いは？`,
        answer: `${practicalText}。定期テストだけでなく、日々の提出物や授業態度も重要です。`
      }
    ],
    sources: [
      {
        name: `${pref.name}教育委員会`,
        url: '',
        lastVerified: '2026年4月8日',
        notes: `${pref.name}の公立高校入学者選抜に関する公式情報を参照してください。`
      }
    ],
    related: [
      { title: `${pref.name}の内申点計算ツール`, url: `/${pref.code}/naishin` },
      { title: `${pref.name}の志望校から逆算`, url: `/reverse?pref=${pref.code}` },
      { title: '内申点アップの基本戦略', url: '/blog/naishin-guide' }
    ]
  };
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
