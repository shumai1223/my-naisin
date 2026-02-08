// 逆算ツール用の比率プリセットデータ

export const RATIO_PRESETS = {
  tokyo: [
    {
      name: '都立共通（標準）',
      description: '一般的な都立高校の標準的な比率',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '都立進学校',
      description: '日比谷・西・国立などの進学校向け',
      ratio: { naishin: 2, gakuryoku: 8 },
      note: '当日点の比重が高い進学校向け'
    },
    {
      name: '都立中堅校',
      description: '都立の中堅校向け',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '内申点の比重がやや高い中堅校向け'
    }
  ],
  
  kanagawa: [
    {
      name: '神奈川共通（標準）',
      description: '一般的な神奈川県立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '神奈川進学校',
      description: '湘南・柏陽・厚木などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    },
    {
      name: '神奈川特色検査校',
      description: '特色検査を実施する学校向け',
      ratio: { naishin: 3, gakuryoku: 5, tokushoku: 2 },
      note: '特色検査を含む配分（S値換算後）'
    },
    {
      name: '神奈川中堅校',
      description: '神奈川県立の中堅校向け',
      ratio: { naishin: 5, gakuryoku: 5 },
      note: '内申点と当日点が同等の中堅校向け'
    }
  ],
  
  osaka: [
    {
      name: '大阪A方式',
      description: '内申重視のA方式',
      ratio: { naishin: 6, gakuryoku: 4 },
      note: '内申点の比重が高いA方式'
    },
    {
      name: '大阪B方式',
      description: '当日重視のB方式',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高いB方式'
    },
    {
      name: '大阪共通（標準）',
      description: '大阪府立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: 'A方式・B方式の中間的な配分'
    }
  ],
  
  aichi: [
    {
      name: '愛知共通（標準）',
      description: '一般的な愛知県立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '愛知進学校',
      description: '時習館・刈谷・一宮などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    },
    {
      name: '愛知中堅校',
      description: '愛知県立の中堅校向け',
      ratio: { naishin: 5, gakuryoku: 5 },
      note: '内申点と当日点が同等の中堅校向け'
    }
  ],
  
  fukuoka: [
    {
      name: '福岡共通（標準）',
      description: '一般的な福岡県立高校の標準的な比率',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い標準的な配分'
    },
    {
      name: '福岡進学校',
      description: '福岡・修猷館・東筑などの進学校向け',
      ratio: { naishin: 2, gakuryoku: 8 },
      note: '当日点の比重が非常に高い進学校向け'
    },
    {
      name: '福岡中堅校',
      description: '福岡県立の中堅校向け',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: 'バランスの取れた中堅校向け'
    }
  ],
  
  hokkaido: [
    {
      name: '北海道共通（標準）',
      description: '一般的な北海道立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '北海道進学校',
      description: '札幌南・札幌西・旭丘などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    }
  ],
  
  saitama: [
    {
      name: '埼玉共通（標準）',
      description: '一般的な埼玉県立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '埼玉進学校',
      description: '浦和・大宮・熊谷などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    }
  ],
  
  chiba: [
    {
      name: '千葉共通（標準）',
      description: '一般的な千葉県立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '千葉進学校',
      description: '千葉・東葛飾・船橋などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    }
  ],
  
  hyogo: [
    {
      name: '兵庫共通（標準）',
      description: '一般的な兵庫県立高校の標準的な比率',
      ratio: { naishin: 4, gakuryoku: 6 },
      note: '全日制普通科の標準的な配分'
    },
    {
      name: '兵庫進学校',
      description: '神戸・長田・姫路東などの進学校向け',
      ratio: { naishin: 3, gakuryoku: 7 },
      note: '当日点の比重が高い進学校向け'
    }
  ]
};

export type RatioPreset = {
  name: string;
  description: string;
  ratio: { naishin: number; gakuryoku: number; tokushoku?: number };
  note: string;
};

export type RatioPresets = Record<string, RatioPreset[]>;
