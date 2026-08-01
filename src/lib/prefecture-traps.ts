// 都道府県別の罠・注意点データ（県固有3〜7個）
//
// **重要（2026-08-01）**: このPREFECTURE_TRAPSは長らく`PrefectureMinimumContent.tsx`で
// 読み込まれるだけで実際には描画に使われていない死んだコードだった（`const traps = dynamicTraps`
// で常に上書き）。復活させるにあたり内容の再検証を行ったところ、東京都の「満点が比較的高い」
// （満点65点は実際には全国でも低い部類=誤り）と「特色検査の有無」（"特色検査"は神奈川県の
// 制度名で東京都には無い用語=おそらく他県からのコピペ由来の誤り）の2件が事実誤りと判明し削除した。
// `topic`フィールドを持つエントリのみがgenerateDynamicTrapsの同トピック分と重複除去されて
// 表示される（getPrefectureTraps参照）。topicが無いエントリ（tokyo/kanagawa以外の10県）は
// まだ内容の再検証が済んでいないため、意図的に非表示のまま据え置く（1県ずつ検証してから
// 解禁する方針）。神奈川県は2026-08-01に再検証し、「特色検査の影響」の未検証だった割合
// （約半数）を削除、「2次選考の存在」（一部学校で面接・作文）を事実誤り（第2次選考は
// 全校対象・判定材料は「主体的に学習に取り組む態度」の観点別評価）と判明し訂正、
// 「主体的態度の評価」は訂正後の内容と重複するため削除した。

import { PrefectureConfig } from './prefectures';

/**
 * 'unique'=動的生成と重複しない検証済み固有トピック（重複除去の対象にはしないが表示は許可する）。
 * それ以外はgenerateDynamicTrapsの対応するトピックと重複除去される。
 */
export type TrapTopic = 'grade-scope' | 'practical-weight' | 'max-score' | 'multiplier' | 'unique';

export const PREFECTURE_TRAPS = {
  tokyo: [
    {
      title: '実技4教科は2倍計算',
      description: '音楽・美術・保健体育・技術家庭の評定が2倍で計算されます。主要5教科と同じくらい重要です。',
      impact: 'high',
      solution: '実技教科の評定を4以上に保つことで、大幅な内申点向上が可能です。',
      topic: 'practical-weight'
    },
    {
      title: 'ESAT-Jの影響',
      description: '英語スピーキングテスト（ESAT-J）が20点満点で加算されます（総合得点1020点中）。私立・国立中学の生徒や、分割後期募集・第二次募集以降では活用されません。',
      impact: 'medium',
      solution: '自分の受検区分でESAT-Jが活用されるか確認し、対象であればスピーキング練習を始めましょう。',
      topic: 'unique'
    },
    {
      title: '中3のみが対象',
      description: '東京都立高校入試では中3の成績のみが対象です。中1・中2の成績は一切関係ありません。',
      impact: 'high',
      solution: '中3の2学期・3学期の成績が最も重要です。中3から本格的に対策を始めましょう。',
      topic: 'grade-scope'
    }
  ],

  // 2026-08-01: 神奈川県を再検証しtopicタグを付与（東京都に続く2県目）。
  // dynamicTrapsは神奈川県だとtargetGrades=[2,3]・practicalMultiplier=coreMultiplier=1・
  // maxScore=135のためgrade-scope/practical-weight/max-score/multiplierいずれの分岐にも
  // 該当せず0件を返す（つまり手動キュレーションが無いとこの県は注意点が空になっていた）。
  // 元の「特色検査の影響」（約半数の学校で実施）は割合の裏取りができなかったため数字を削除、
  // 「2次選考の存在」（一部学校で面接・作文）はWebSearchで裏取りしたところ**事実誤り**と判明
  // （第2次選考は全校・全受験生が対象で、判定材料は面接・作文ではなく中3の「主体的に学習に
  // 取り組む態度」の観点別評価。面接は2024年度から全校一律実施ではなくなり特色検査の一部校のみ）
  // ため、正しい内容に書き換えた。旧「主体的態度の評価」は書き換え後の内容と重複するため削除。
  kanagawa: [
    {
      title: 'S値方式の複雑さ',
      description: '内申点と当日点を標準化して合算するS値方式です。素点での比較ができません。',
      impact: 'high',
      solution: 'S値の計算方法を理解し、内申点と当日点のバランスを考える必要があります。',
      topic: 'unique'
    },
    {
      title: '特色検査の影響',
      description: '難関校を中心に18校が共通の特色検査を実施するほか、学科ごとに独自の特色検査を課す学校もあります。実施校では当日点に加算され、合否に大きく影響します。',
      impact: 'high',
      solution: '特色検査の有無で戦略が大きく変わります。志望校の検査内容を早期に確認しましょう。',
      topic: 'unique'
    },
    {
      title: '換算内申の係数',
      description: '内申点を100点満点に換算したうえで学校ごとに定める比率をかけてS値を算出します。この比率は学校・学科ごとに設定され、年度によって変わることがあります。',
      impact: 'medium',
      solution: '志望校が発表する最新の比率を確認し、それに基づいて目標内申点を設定しましょう。',
      topic: 'unique'
    },
    {
      title: '重点化の有無',
      description: '学校の判断で2教科以内・各2倍の範囲で学力検査の特定教科を重点化できます（例: 国際系学科の英語、体育系学科の体育）。',
      impact: 'medium',
      solution: '志望校の重点化有無を確認し、該当教科の学習を強化しましょう。',
      topic: 'unique'
    },
    {
      title: '第2次選考の判定基準',
      description: '募集人員の約90%は第1次選考（内申・学力検査・特色検査）で決まり、残り約10%を決める第2次選考は全校・全受験生が対象です。第2次選考では中3の「主体的に学習に取り組む態度」の観点別評価が判定材料に加わります。',
      impact: 'medium',
      solution: '第1次選考で不合格でも第2次選考のチャンスがあります。日頃の授業態度や提出物への取り組みも最後まで意識しましょう。',
      topic: 'unique'
    }
  ],

  osaka: [
    {
      title: 'A方式とB方式の選択',
      description: 'A方式（内申重視）とB方式（当日重視）の選択があります。学校によって採用方式が異なります。',
      impact: 'high',
      solution: '志望校の採用方式を確認し、それに合わせた学習戦略を立てましょう。'
    },
    {
      title: '実技教科の配点',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '3年間が対象',
      description: '中学1年生から3年生までの3年間の成績が対象です。早期からの対策が有利です。',
      impact: 'medium',
      solution: '早期から成績を安定させることが重要です。'
    },
    {
      title: 'S値ではない素点方式',
      description: '神奈川のようなS値方式ではなく、素点で合否判定します。',
      impact: 'low',
      solution: '素点での目標設定がしやすいですが、当日点の比重も高いです。'
    },
    {
      title: '私立併願の影響',
      description: '私立高校の併願者が多く、公立高校の競争率に影響を与えることがあります。',
      impact: 'low',
      solution: '私立併願の動向を把握し、戦略的に出願校を選びましょう。'
    }
  ],
  
  aichi: [
    {
      title: '全教科×2倍計算',
      description: '9教科すべての評定が2倍で計算されます。実技教科も他の教科と同じ扱いです。',
      impact: 'high',
      solution: '全教科で安定した評定を目指すことが重要です。特定の教科に偏らず、バランスの良い成績を目指しましょう。'
    },
    {
      title: '満点が90点と低め',
      description: '満点90点は全国でも低い部類です。1点の差が合否に大きく影響します。',
      impact: 'high',
      solution: '全教科で安定した評定を維持することが重要です。1教科の失敗が致命的になります。'
    },
    {
      title: '中3のみが対象',
      description: '中学3年生の成績のみが対象です。中3の成績が最も重要です。',
      impact: 'medium',
      solution: '中3の成績を安定させることが、合格への近道です。'
    },
    {
      title: '私立併願率が高い',
      description: '私立高校の併願者が非常に多く、公立高校の競争率が高くなる傾向があります。',
      impact: 'medium',
      solution: '私立併願の動向を把握し、戦略的に出願校を選びましょう。'
    },
    {
      title: '特色検査の導入',
      description: '一部の進学校で特色検査が導入され始めています。',
      impact: 'low',
      solution: '志望校の特色検査有無を確認し、必要であれば対策を始めましょう。'
    }
  ],
  
  fukuoka: [
    {
      title: '満点が45点と非常に低い',
      description: '満点45点は全国で最も低い部類です。1点の差が合否に致命的な影響を与えます。',
      impact: 'high',
      solution: '全教科で評定4以上を維持することが必須です。1教科の評定3が命取りになります。'
    },
    {
      title: '実技4教科は2倍計算',
      description: '音楽・美術・保健体育・技術家庭の評定が2倍で計算されます。',
      impact: 'high',
      solution: '実技教科の評定を4以上に保つことが、内申点確保の鍵です。'
    },
    {
      title: '当日点の比重が高い',
      description: '内申点の比重が低く、当日点の比重が高い傾向があります。',
      impact: 'medium',
      solution: '学力検査の対策を重視し、当日点で高得点を狙う戦略が有効です。'
    },
    {
      title: '3年間が対象',
      description: '中学1年生から3年生までの3年間の成績が対象です。早期からの対策が有利です。',
      impact: 'medium',
      solution: '早期から成績を安定させることが重要です。'
    },
    {
      title: '私立との併願動向',
      description: '私立高校の併願者数が公立高校の競争率に影響を与えます。',
      impact: 'low',
      solution: '県内の私立併願動向を把握し、戦略的に出願校を選びましょう。'
    }
  ],
  
  hokkaido: [
    {
      title: '実技教科の配点',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '地域差が大きい',
      description: '道内各地区で学校のレベルや競争率に大きな差があります。',
      impact: 'medium',
      solution: '志望校のある地域の特性を理解し、戦略を立てましょう。'
    },
    {
      title: '私立進学の影響',
      description: '札幌市内の私立進学校が多く、公立高校の競争率に影響を与えます。',
      impact: 'low',
      solution: '私立進学の動向を把握し、戦略的に出願校を選びましょう。'
    },
    {
      title: '特色検査の導入',
      description: '一部の進学校で特色検査が導入され始めています。',
      impact: 'low',
      solution: '志望校の特色検査有無を確認し、必要であれば対策を始めましょう。'
    }
  ],
  
  saitama: [
    {
      title: '実技教科の重要性',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '東京との競争',
      description: '東京都に近く、進学意識の高い生徒が多い傾向があります。',
      impact: 'medium',
      solution: '早期からの学習対策と、正確な情報収集が重要です。'
    },
    {
      title: '私立併願の動向',
      description: '私立高校の併願者が多く、公立高校の競争率に影響を与えます。',
      impact: 'low',
      solution: '私立併願の動向を把握し、戦略的に出願校を選びましょう。'
    }
  ],
  
  chiba: [
    {
      title: '実技教科の配点',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '東京とのアクセス',
      description: '東京都にアクセスが良く、進学意識の高い生徒が多い傾向があります。',
      impact: 'medium',
      solution: '早期からの学習対策と、正確な情報収集が重要です。'
    },
    {
      title: '私立との競争',
      description: '私立高校の進学者が多く、公立高校の競争率に影響を与えます。',
      impact: 'low',
      solution: '私立進学の動向を把握し、戦略的に出願校を選びましょう。'
    }
  ],
  
  hyogo: [
    {
      title: '実技教科の配点',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '兵庫進学校の競争',
      description: '神戸・長田・姫路東などの進学校競争率が高く、早期対策が必要です。',
      impact: 'medium',
      solution: '志望校のレベルを正確に把握し、適切な学習計画を立てましょう。'
    },
    {
      title: '私立進学の伝統',
      description: '私立進学校の伝統があり、公立高校の競争率に影響を与えます。',
      impact: 'low',
      solution: '私立進学の動向を把握し、戦略的に出願校を選びましょう。'
    }
  ],
  
  yamagata: [
    {
      title: '実技教科の重要性',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '内申点の比重',
      description: '内申点が合否判定に大きな影響を与えます。特に中3の成績が重要です。',
      impact: 'medium',
      solution: '中3の成績を安定させることが、合格への近道です。'
    },
    {
      title: '提出物の重要性',
      description: '実技が等倍でも、4教科で合計20点を占めます。提出物で落とすと痛いです。',
      impact: 'low',
      solution: '実技教科の提出物を期限内に丁寧に仕上げましょう。'
    }
  ],
  
  tottori: [
    {
      title: '実技教科の配点',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '内申点の比重',
      description: '内申点が合否判定に大きな影響を与えます。特に中3の成績が重要です。',
      impact: 'medium',
      solution: '中3の成績を安定させることが、合格への近道です。'
    },
    {
      title: '小規模校の特色',
      description: '小規模校が多く、特色のある教育を行っています。個別の指導が充実している場合があります。',
      impact: 'low',
      solution: '小規模校の特色を理解し、自分に合った学校を選びましょう。'
    }
  ],
  
  fukui: [
    {
      title: '実技教科の重要性',
      description: '実技4教科の配点が比較的高めです。主要5教科と同等の重要性があります。',
      impact: 'medium',
      solution: '実技教科の評定を4以上に保つことで、内申点の底上げが可能です。'
    },
    {
      title: '福井地区の競争',
      description: '福井市内の進学校競争率が高く、早期対策が必要です。',
      impact: 'medium',
      solution: '福井地区の進学校を志望する場合は、学習計画を早めに立てましょう。'
    },
    {
      title: '嶺北・嶺南の差',
      description: '嶺北・嶺南地区で教育環境や学校の特色に差があります。',
      impact: 'low',
      solution: '各地区の特色を理解し、自分に合った地域の学校を選びましょう。'
    }
  ]
};

// 都道府県データから動的に注意点を生成する関数
export function generateDynamicTraps(prefecture: PrefectureConfig): PrefectureTrap[] {
  const traps: PrefectureTrap[] = [];

  // 対象学年に関する注意点
  if (prefecture.targetGrades.length === 1 && prefecture.targetGrades[0] === 3) {
    traps.push({
      title: '中3のみが対象',
      description: '中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。',
      impact: 'high' as const,
      solution: '中3の成績が最も重要です。中3から本格的に対策を始めましょう。',
      topic: 'grade-scope'
    });
  } else if (prefecture.targetGrades.length === 3) {
    traps.push({
      title: '3年間が対象',
      description: '中学1年生から3年生までの3年間の成績が対象です。早期からの対策が有利です。',
      impact: 'medium' as const,
      solution: '中1からコツコツと成績を積み上げることが、合格への近道です。',
      topic: 'grade-scope'
    });
  }

  // 実技教科の傾斜に関する注意点
  if (prefecture.practicalMultiplier > prefecture.coreMultiplier) {
    traps.push({
      title: '実技教科が傾斜配点',
      description: `実技4教科は${prefecture.practicalMultiplier}倍で計算され、主要5教科より重要です。`,
      impact: 'high' as const,
      solution: '実技教科の評定を4以上に保つことで、大幅な内申点向上が可能です。',
      topic: 'practical-weight'
    });
  }

  // 満点に関する注意点
  if (prefecture.maxScore <= 50) {
    traps.push({
      title: '1点差が大きい',
      description: `満点${prefecture.maxScore}点は比較的低く、1点の差が合否に大きく影響します。`,
      impact: 'medium' as const,
      solution: '全教科で安定した評定を目指し、失点を最小限に抑えましょう。',
      topic: 'max-score'
    });
  } else if (prefecture.maxScore >= 400) {
    traps.push({
      title: '高得点戦略が必要',
      description: `満点${prefecture.maxScore}点は比較的高く、効率的な得点アップが重要です。`,
      impact: 'medium' as const,
      solution: '得意教科で高評定を取りつつ、苦手教科を減らす戦略が有効です。',
      topic: 'max-score'
    });
  }

  // 特殊な倍率に関する注意点
  if (prefecture.coreMultiplier !== 1 || prefecture.practicalMultiplier !== 1) {
    traps.push({
      title: '特殊な倍率設定',
      description: `5教科×${prefecture.coreMultiplier}倍、実技4教科×${prefecture.practicalMultiplier}倍の計算です。`,
      impact: 'medium' as const,
      solution: '倍率の仕組みを理解し、戦略的に成績を上げましょう。',
      topic: 'multiplier'
    });
  }

  // 鹿児島県固有の注意点（2026-08-01・外部の教育系ブロガー朝森氏からのフィードバックを受けて追加）。
  // 調査書の配点上は実技4教科が全体の約9割を占める設計だが、地元の教育関係者からは難関校を
  // 中心に学力検査の得点が合否により強く影響しているとの指摘がある（塾関係者の証言ベースの
  // 一情報源であり教育委員会の公式見解ではない）。「実技を優先すれば内申点が大きく伸びる」という
  // 数値上の見え方だけが独り歩きしないよう、上の「実技教科が傾斜配点」トラップに続けて明示する。
  if (prefecture.code === 'kagoshima') {
    traps.push({
      title: '配点上の実技傾斜と実際の選抜運用は一致しないとの指摘がある',
      description: '調査書の配点だけを見ると実技4教科の比重が非常に大きく設計されていますが、難関校を中心に学力検査の得点の方が合否に強く影響しているとの指摘が一部の教育関係者からあります（教育委員会の公式見解ではなく、地元事情に詳しい第三者の見立てです）。',
      impact: 'medium' as const,
      solution: '「実技教科を伸ばせば内申点が大きく上がる」という数値上の見え方だけで戦略を決めず、志望校の実際の選抜傾向（学力検査重視かどうか）も学校説明会や在校生の情報で確認しましょう。',
    });
  }

  return traps;
}

export type PrefectureTrap = {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
  /** 動的生成トラップとの重複除去に使うトピック（手動キュレーション側のみ・任意）。 */
  topic?: TrapTopic;
};

export type PrefectureTraps = Record<string, PrefectureTrap[]>;

/**
 * 表示用の注意点一覧を組み立てる（手動キュレーション優先・動的生成で補完）。
 *
 * `topic`タグを持つ手動キュレーション分をすべて採用し、動的生成分は同じtopicが手動側に
 * 既に無いものだけを追加する（同一トピックの重複表示を防ぐ）。`topic`タグが無い手動
 * キュレーション分（再検証未実施の11県）は採用しない＝これまで通り動的生成のみが表示される
 * （2026-08-01: 東京都・神奈川県を再検証・topicタグ付けを実施。他県は今後1県ずつ検証してから解禁する）。
 */
export function getPrefectureTraps(prefecture: PrefectureConfig): PrefectureTrap[] {
  const curated = (PREFECTURE_TRAPS[prefecture.code as keyof typeof PREFECTURE_TRAPS] ?? []) as PrefectureTrap[];
  const curatedWithTopic = curated.filter((t): t is PrefectureTrap & { topic: TrapTopic } => Boolean(t.topic));
  // 'unique'は動的生成と重複しない検証済みトピックのため、重複除去の対象(coveredTopics)には含めない。
  const coveredTopics: Set<TrapTopic> = new Set(curatedWithTopic.map((t) => t.topic).filter((topic) => topic !== 'unique'));

  const dynamic = generateDynamicTraps(prefecture).filter((t) => !t.topic || !coveredTopics.has(t.topic));

  return [...curatedWithTopic, ...dynamic];
}
