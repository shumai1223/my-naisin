// 人気県の高校別プリセットデータ（上位20校）

export const SCHOOL_PRESETS = {
  tokyo: [
    {
      name: '日比谷高校',
      type: '進学校',
      ratio: { naishin: 2, gakuryoku: 8 },
      description: '東京都を代表する進学校、当日点重視',
      examMax: 700,
      features: ['特色検査なし', 'ESAT-Jあり', '競争率非常に高い']
    },
    {
      name: '西高校',
      type: '進学校',
      ratio: { naishin: 2, gakuryoku: 8 },
      description: '伝統的な進学校、当日点重視',
      examMax: 700,
      features: ['特色検査なし', 'ESAT-Jあり', '競争率非常に高い']
    },
    {
      name: '国立高校',
      type: '進学校',
      ratio: { naishin: 2, gakuryoku: 8 },
      description: '国際教育に強い進学校',
      examMax: 700,
      features: ['特色検査あり', 'ESAT-Jあり', '国際バカロレア']
    },
    {
      name: '小山台高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: 'バランス型の進学校',
      examMax: 700,
      features: ['特色検査なし', 'ESAT-Jあり']
    },
    {
      name: '竹早高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '女子進学校、教育系に強い',
      examMax: 700,
      features: ['特色検査なし', 'ESAT-Jあり', '女子校']
    }
  ],
  
  kanagawa: [
    {
      name: '湘南高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '神奈川県を代表する進学校',
      examMax: 500,
      features: ['特色検査あり', 'S値方式', '競争率非常に高い']
    },
    {
      name: '柏陽高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '伝統的な進学校',
      examMax: 500,
      features: ['特色検査あり', 'S値方式', '競争率非常に高い']
    },
    {
      name: '厚木高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '理系に強い進学校',
      examMax: 500,
      features: ['特色検査あり', 'S値方式', 'SSH指定']
    },
    {
      name: '横浜翠嵐高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '総合進学校',
      examMax: 500,
      features: ['特色検査あり', 'S値方式']
    },
    {
      name: '多摩高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '多摩地区の進学校',
      examMax: 500,
      features: ['特色検査あり', 'S値方式']
    }
  ],
  
  osaka: [
    {
      name: '大阪府立大手前高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: 'B方式（当日重視）の進学校',
      examMax: 500,
      features: ['B方式', '競争率非常に高い']
    },
    {
      name: '大阪府立北野高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '伝統的な進学校',
      examMax: 500,
      features: ['A方式', '競争率非常に高い']
    },
    {
      name: '大阪府立茨木高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '北摂地区の進学校',
      examMax: 500,
      features: ['A方式', '競争率高い']
    },
    {
      name: '大阪府立三国高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: 'バランス型の進学校',
      examMax: 500,
      features: ['A方式']
    },
    {
      name: '大阪府立高津高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '南大阪の進学校',
      examMax: 500,
      features: ['A方式']
    }
  ],
  
  aichi: [
    {
      name: '愛知県立時習館高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '愛知県を代表する進学校',
      examMax: 500,
      features: ['競争率非常に高い', 'SSH指定']
    },
    {
      name: '愛知県立刈谷高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '伝統的な進学校',
      examMax: 500,
      features: ['競争率非常に高い']
    },
    {
      name: '愛知県立一宮高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '西三河の進学校',
      examMax: 500,
      features: ['競争率高い']
    },
    {
      name: '愛知県立旭丘高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '名古屋市の進学校',
      examMax: 500,
      features: ['競争率高い']
    },
    {
      name: '愛知県立岡崎高校',
      type: '進学校',
      ratio: { naishin: 4, gakuryoku: 6 },
      description: '西三河の進学校',
      examMax: 500,
      features: ['競争率高い']
    }
  ],
  
  fukuoka: [
    {
      name: '福岡県立福岡高校',
      type: '進学校',
      ratio: { naishin: 2, gakuryoku: 8 },
      description: '福岡県を代表する進学校',
      examMax: 500,
      features: ['競争率非常に高い', 'SSH指定']
    },
    {
      name: '福岡県立修猷館高校',
      type: '進学校',
      ratio: { naishin: 2, gakuryoku: 8 },
      description: '伝統的な進学校',
      examMax: 500,
      features: ['競争率非常に高い']
    },
    {
      name: '福岡県立東筑高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '東福岡の進学校',
      examMax: 500,
      features: ['競争率非常に高い']
    },
    {
      name: '福岡県立小倉高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '北九州の進学校',
      examMax: 500,
      features: ['競争率高い']
    },
    {
      name: '福岡県立明善高校',
      type: '進学校',
      ratio: { naishin: 3, gakuryoku: 7 },
      description: '北九州の進学校',
      examMax: 500,
      features: ['競争率高い']
    }
  ]
};

export type SchoolPreset = {
  name: string;
  type: string;
  ratio: { naishin: number; gakuryoku: number };
  description: string;
  examMax: number;
  features: string[];
};

export type SchoolPresets = Record<string, SchoolPreset[]>;
