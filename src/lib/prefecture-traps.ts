// 都道府県別の罠・注意点データ（県固有3〜7個）

import { PrefectureConfig } from './prefectures';

export const PREFECTURE_TRAPS = {
  tokyo: [
    {
      title: '実技4教科は2倍計算',
      description: '音楽・美術・保健体育・技術家庭の評定が2倍で計算されます。主要5教科と同じくらい重要です。',
      impact: 'high',
      solution: '実技教科の評定を4以上に保つことで、大幅な内申点向上が可能です。'
    },
    {
      title: 'ESAT-Jの影響',
      description: '英語スピーキングテスト（ESAT-J）が20点満点で加算される場合があります。実施しない学校・コースもあります。',
      impact: 'medium',
      solution: '志望校のESAT-J実施有無を確認し、必要であればスピーキング練習を始めましょう。'
    },
    {
      title: '中3のみが対象',
      description: '東京都立高校入試では中3の成績のみが対象です。中1・中2の成績は一切関係ありません。',
      impact: 'high',
      solution: '中3の2学期・3学期の成績が最も重要です。中3から本格的に対策を始めましょう。'
    },
    {
      title: '満点が比較的高い',
      description: '満点65点は全国でも高い部類です。実技4教科が2倍計算されるため、他県と比較すると内申点の比重が高い傾向があります。',
      impact: 'medium',
      solution: '当日点の比重も高いので、内申点と学力検査のバランスが重要です。'
    },
    {
      title: '特色検査の有無',
      description: '一部の学校で特色検査が実施されます。当日点に加算される場合があります。',
      impact: 'low',
      solution: '志望校の特色検査有無を確認し、必要であれば対策講座を受講しましょう。'
    }
  ],
  
  kanagawa: [
    {
      title: 'S値方式の複雑さ',
      description: '内申点と当日点を標準化して合算するS値方式です。素点での比較ができません。',
      impact: 'high',
      solution: 'S値の計算方法を理解し、内申点と当日点のバランスを考える必要があります。'
    },
    {
      title: '特色検査の影響',
      description: '約半数の学校で特色検査が実施されます。当日点に加算され、合否に大きく影響します。',
      impact: 'high',
      solution: '特色検査の有無で戦略が大きく変わります。志望校の検査内容を早期に確認しましょう。'
    },
    {
      title: '換算内申の係数',
      description: '素内申に係数をかけて換算内申を計算します。この係数が年度によって変動することがあります。',
      impact: 'medium',
      solution: '最新の係数を確認し、それに基づいて目標内申点を設定しましょう。'
    },
    {
      title: '重点化の有無',
      description: '一部学校で特定教科の得点を重点化（倍率を高く）する場合があります。',
      impact: 'medium',
      solution: '志望校の重点化有無を確認し、該当教科の学習を強化しましょう。'
    },
    {
      title: '2次選考の存在',
      description: '一部学校で2次選考（面接・作文など）が実施されます。',
      impact: 'low',
      solution: '2次選考の有無と内容を確認し、必要であれば対策を始めましょう。'
    },
    {
      title: '主体的態度の評価',
      description: '学習指導要領の改定により、「主体的に学習に取り組む態度」の評価が重視されています。',
      impact: 'medium',
      solution: '授業への参加意欲や課題提出率を高めることが重要です。'
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
      title: '均等配分の対象学年',
      description: '中1・中2・中3の成績が均等配分で対象です。学年間の成績差が少ないのが理想です。',
      impact: 'medium',
      solution: '早期から成績を安定させることが重要です。中1からの対策が必要です。'
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
      title: '実技4教科は2倍計算',
      description: '音楽・美術・保健体育・技術家庭の評定が2倍で計算されます。主要5教科と同等の重要性です。',
      impact: 'high',
      solution: '実技教科の評定を4以上に保つことで、大幅な内申点向上が可能です。'
    },
    {
      title: '満点が90点と低め',
      description: '満点90点は全国でも低い部類です。1点の差が合否に大きく影響します。',
      impact: 'high',
      solution: '全教科で安定した評定を維持することが重要です。1教科の失敗が致命的になります。'
    },
    {
      title: '中1・中2・中3の均等配分',
      description: '3年間の成績が均等配分で対象です。学年間の成績差が少ないのが理想です。',
      impact: 'medium',
      solution: '早期から成績を安定させることが重要です。中1からの対策が必要です。'
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
      title: '中1・中2・中3の均等配分',
      description: '3年間の成績が均等配分で対象です。',
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
export function generateDynamicTraps(prefecture: PrefectureConfig): { title: string; description: string; impact: 'high' | 'medium' | 'low'; solution: string }[] {
  const traps: { title: string; description: string; impact: 'high' | 'medium' | 'low'; solution: string }[] = [];
  
  // 対象学年に関する注意点
  if (prefecture.targetGrades.length === 1 && prefecture.targetGrades[0] === 3) {
    traps.push({
      title: '中3のみが対象',
      description: '中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。',
      impact: 'high' as const,
      solution: '中3の成績が最も重要です。中3から本格的に対策を始めましょう。'
    });
  } else if (prefecture.targetGrades.length === 3) {
    traps.push({
      title: '3年間が対象',
      description: '中学1年生から3年生までの3年間の成績が対象です。早期からの対策が有利です。',
      impact: 'medium' as const,
      solution: '中1からコツコツと成績を積み上げることが、合格への近道です。'
    });
  }
  
  // 実技教科の傾斜に関する注意点
  if (prefecture.practicalMultiplier > prefecture.coreMultiplier) {
    traps.push({
      title: '実技教科が傾斜配点',
      description: `実技4教科は${prefecture.practicalMultiplier}倍で計算され、主要5教科より重要です。`,
      impact: 'high' as const,
      solution: '実技教科の評定を4以上に保つことで、大幅な内申点向上が可能です。'
    });
  }
  
  // 満点に関する注意点
  if (prefecture.maxScore <= 50) {
    traps.push({
      title: '1点差が大きい',
      description: `満点${prefecture.maxScore}点は比較的低く、1点の差が合否に大きく影響します。`,
      impact: 'medium' as const,
      solution: '全教科で安定した評定を目指し、失点を最小限に抑えましょう。'
    });
  } else if (prefecture.maxScore >= 400) {
    traps.push({
      title: '高得点戦略が必要',
      description: `満点${prefecture.maxScore}点は比較的高く、効率的な得点アップが重要です。`,
      impact: 'medium' as const,
      solution: '得意教科で高評定を取りつつ、苦手教科を減らす戦略が有効です。'
    });
  }
  
  // 特殊な倍率に関する注意点
  if (prefecture.coreMultiplier !== 1 || prefecture.practicalMultiplier !== 1) {
    traps.push({
      title: '特殊な倍率設定',
      description: `5教科×${prefecture.coreMultiplier}倍、実技4教科×${prefecture.practicalMultiplier}倍の計算です。`,
      impact: 'medium' as const,
      solution: '倍率の仕組みを理解し、戦略的に成績を上げましょう。'
    });
  }
  
  return traps;
}

export type PrefectureTrap = {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
};

export type PrefectureTraps = Record<string, PrefectureTrap[]>;
