'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Calculator, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Info,
  ChevronDown,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import Script from 'next/script';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { DEFAULT_SCORES } from '@/lib/constants';
import { calculateMaxScore, calculateTotalScore, calculatePercent, getRankForPercent } from '@/lib/utils';
import { generatePitfalls, generateFAQ } from '@/lib/prefecture-helpers';
import { InputForm } from '@/components/Calculator/InputForm';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { RankCard } from '@/components/Result/RankCard';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import type { Scores, SubjectKey } from '@/lib/types';

// 県別の落とし穴・注意点データ
const PREFECTURE_PITFALLS: Record<string, { title: string; items: string[] }> = {
  tokyo: {
    title: '東京都の注意点',
    items: [
      '実技4教科（音楽・美術・保体・技家）は評定が2倍で計算される',
      '中3の成績のみが対象（中1・中2は含まれない）',
      '都立一般入試では内申点300点＋学力検査700点＋ESAT-J 20点＝1020点満点',
      '推薦入試では内申点の比重が高い（学校により異なる）',
      'ESAT-J（英語スピーキングテスト）の結果も加算される'
    ]
  },
  kanagawa: {
    title: '神奈川県の注意点',
    items: [
      '中2と中3の成績が対象（中1は含まれない）',
      '中3の成績は2倍で計算される',
      'S値（学力検査）・A値（内申点）・特色検査の比率は学校ごとに異なる',
      '面接が全校で実施される',
      '特色検査を実施する高校では追加の対策が必要'
    ]
  },
  saitama: {
    title: '埼玉県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '学年の比率は高校によって異なる（1:1:2、1:1:3、1:2:3など）',
      '加算点（部活動・生徒会活動など）がある高校も',
      '相関表を使った選抜方式',
      '第1次選抜・第2次選抜で配点が変わる場合あり'
    ]
  },
  chiba: {
    title: '千葉県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象（各学年45点×3＝135点満点）',
      'K値による換算で調査書点を算出',
      '2日間の入試（1日目：学力検査、2日目：学校設定検査）',
      '学校設定検査は高校ごとに内容が異なる',
      '前期・後期の区分はなくなり、一般入学者選抜に一本化'
    ]
  },
  osaka: {
    title: '大阪府の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '学年比率は1:1:3（中3が3倍）',
      '実技4教科も5教科と同じ扱い',
      'チャレンジテストの結果が評定に影響する可能性',
      '文理学科・普通科などでボーダーが大きく異なる'
    ]
  },
  fukuoka: {
    title: '福岡県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象（各学年45点×3＝135点満点）',
      '特色化選抜・推薦入学・一般入試で方式が異なる',
      '学区制があり、受験できる高校が限られる',
      '内申点と学力検査の比率は学校によって異なる',
      '調査書の「行動の記録」も評価対象'
    ]
  },
  hyogo: {
    title: '兵庫県の注意点',
    items: [
      '中3の成績のみが対象',
      '実技4教科は2.5倍で計算（250点満点）',
      '複数志願選抜では加算点制度あり',
      '学区再編により選択肢が広がった',
      '特色選抜・推薦入学では面接・小論文が課される'
    ]
  },
  hokkaido: {
    title: '北海道の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '学年比率は2:2:3（中1・中2は2倍、中3は3倍）',
      '315点満点と全国でも高い配点',
      '学区制があり、通学区域に制限がある',
      '裁量問題を出題する高校では難易度が上がる'
    ]
  },
  aichi: {
    title: '愛知県の注意点',
    items: [
      '中3の成績のみが対象（45点満点）',
      '内申点と学力検査の比率は「Ⅲ型」で3:5が多い',
      '2校受験可能（第1志望・第2志望）',
      '推薦選抜では内申点の比重が高い',
      '学校によって傾斜配点（特定教科を重視）がある'
    ]
  },
  kyoto: {
    title: '京都府の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '195点満点（実技4教科×2倍）',
      '前期選抜・中期選抜で方式が異なる',
      '通学圏により受験可能な高校が決まる',
      '報告書（調査書）の「特別活動の記録」も評価対象'
    ]
  },
  hiroshima: {
    title: '広島県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '130点満点（独自の換算方式）',
      '選抜Ⅰ（推薦）と選抜Ⅱ（一般）で配点が異なる',
      '自己表現カードの提出が必要',
      '学校によって面接・実技検査がある'
    ]
  },
  miyagi: {
    title: '宮城県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '実技4教科は2倍で計算（195点満点）',
      '前期選抜・後期選抜の2回の受験機会',
      '共通選抜・特色選抜で方式が異なる',
      '調査書の「行動の記録」も評価される'
    ]
  }
};

// 県別FAQ
const PREFECTURE_FAQ: Record<string, { question: string; answer: string }[]> = {
  tokyo: [
    {
      question: '東京都の内申点は何点満点ですか？',
      answer: '東京都の内申点（換算内申）は65点満点です。5教科×5点＝25点、実技4教科×5点×2倍＝40点の合計です。'
    },
    {
      question: '東京都はいつの成績が内申点になりますか？',
      answer: '東京都は中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。'
    },
    {
      question: '東京都の実技教科が2倍になるのはなぜですか？',
      answer: '実技教科は授業時間が少ないため、学力検査（入試当日のテスト）では測れない能力を評価する目的で2倍の配点になっています。'
    },
    {
      question: 'ESAT-Jとは何ですか？',
      answer: 'ESAT-J（イーサットジェイ）は東京都立高校入試で導入された英語スピーキングテストです。結果は20点満点で加算され、内申点300点＋学力検査700点＋ESAT-J 20点＝1020点満点で合否判定されます。'
    }
  ],
  kanagawa: [
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
  osaka: [
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
  saitama: [
    {
      question: '埼玉県の内申点は何点満点ですか？',
      answer: '埼玉県の内申点は高校によって異なりますが、一般的には180点満点（学年比1:1:2の場合）です。高校によって1:1:3や1:2:3の配点もあります。'
    },
    {
      question: '埼玉県はいつの成績が内申点になりますか？',
      answer: '埼玉県は中学1年生から3年生までの3年間すべての成績が対象です。学年ごとの比率は高校によって異なります。'
    },
    {
      question: '埼玉県の相関表とは何ですか？',
      answer: '相関表は内申点と学力検査の結果を組み合わせて選抜する方法です。縦軸に内申点、横軸に学力検査の点数を取り、合格ラインを判定します。'
    },
    {
      question: '埼玉県の加算点とは何ですか？',
      answer: '加算点は、部活動や生徒会活動、検定取得などの実績に対して与えられる追加点です。高校によって加算の有無や点数が異なります。'
    }
  ],
  chiba: [
    {
      question: '千葉県の内申点は何点満点ですか？',
      answer: '千葉県の内申点は135点満点です。中1〜中3の各学年で9教科×5点＝45点、合計135点となります。'
    },
    {
      question: '千葉県のK値とは何ですか？',
      answer: 'K値は内申点の重み付け係数で、0.5〜2の範囲で高校ごとに設定されています。K値が高い高校ほど内申点が重視されます。'
    },
    {
      question: '千葉県の学校設定検査とは何ですか？',
      answer: '学校設定検査は2日目に実施される高校独自の検査です。面接、作文、自己表現、適性検査など、学校によって内容が異なります。'
    },
    {
      question: '千葉県で内申点を上げるコツは？',
      answer: '中1から内申点が対象になるため、早い段階からの対策が重要です。特に中1の成績が悪いと挽回が難しくなります。'
    }
  ],
  aichi: [
    {
      question: '愛知県の内申点は何点満点ですか？',
      answer: '愛知県の内申点は90点満点です。中学3年生の9教科×5点×2倍で計算されます。'
    },
    {
      question: '愛知県はいつの成績が内申点になりますか？',
      answer: '愛知県は中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。'
    },
    {
      question: '愛知県のⅠ型・Ⅱ型・Ⅲ型とは何ですか？',
      answer: '内申点と学力検査の配点比率を表します。Ⅰ型は内申:学力=5:5、Ⅱ型は4:6、Ⅲ型は3:7です。多くの高校がⅢ型を採用しています。'
    },
    {
      question: '愛知県は2校受験できる？',
      answer: 'はい、愛知県では公立高校を2校まで受験できます。第1志望と第2志望を出願し、両方の結果で合否が決まります。'
    }
  ],
  hokkaido: [
    {
      question: '北海道の内申点は何点満点ですか？',
      answer: '北海道の内申点は315点満点です。中1（45点×2）＋中2（45点×2）＋中3（45点×3）＝315点で計算されます。'
    },
    {
      question: '北海道はいつの成績が内申点になりますか？',
      answer: '北海道は中学1年生から3年生までの3年間の成績が対象です。学年比率は2:2:3で、中3が最も重視されます。'
    },
    {
      question: '北海道の裁量問題とは何ですか？',
      answer: '裁量問題は一部の進学校で出題される難易度の高い問題です。標準問題より応用力が求められ、高得点を取るのが難しくなります。'
    },
    {
      question: '北海道で内申点を上げるコツは？',
      answer: '中1から内申点が対象になるため、早い時期からの対策が重要です。315点満点と配点が高いため、1点の差が大きく影響します。'
    }
  ],
  hyogo: [
    {
      question: '兵庫県の内申点は何点満点ですか？',
      answer: '兵庫県の内申点は250点満点です。5教科×5点×2＝50点、実技4教科×5点×2×2.5＝100点の合計に換算係数をかけて計算します。'
    },
    {
      question: '兵庫県はいつの成績が内申点になりますか？',
      answer: '兵庫県は中学3年生の成績のみが内申点として使われます。中1・中2の成績は含まれません。'
    },
    {
      question: '兵庫県の複数志願選抜とは何ですか？',
      answer: '複数志願選抜は、第1志望と第2志望の2校に出願できる制度です。第1志望校には加算点が付くため有利になります。'
    },
    {
      question: '兵庫県で実技教科が重要な理由は？',
      answer: '兵庫県では実技4教科が2.5倍で計算されるため、実技教科の配点比率が非常に高いです。実技で5を取ると大きなアドバンテージになります。'
    }
  ],
  fukuoka: [
    {
      question: '福岡県の内申点は何点満点ですか？',
      answer: '福岡県の内申点は45点満点です。中学3年生の9教科×5点で計算されます。'
    },
    {
      question: '福岡県はいつの成績が内申点になりますか？',
      answer: '福岡県は中学1年生から3年生までの3年間の成績が対象です。各学年の比率は均等です。'
    },
    {
      question: '福岡県の学区制とは何ですか？',
      answer: '福岡県は学区制があり、住んでいる地域によって受験できる公立高校が限られます。第1学区〜第13学区に分かれています。'
    },
    {
      question: '福岡県の特色化選抜とは何ですか？',
      answer: '特色化選抜は、スポーツや芸術などの特技を持つ生徒を対象とした推薦入試です。内申点に加えて実技や面接で評価されます。'
    }
  ]
};

// デフォルトの注意点
const DEFAULT_PITFALLS = {
  title: 'この県の注意点',
  items: [
    '計算方法や配点は高校によって異なる場合があります',
    '最新の情報は各都道府県教育委員会の公式サイトでご確認ください',
    '特色選抜や推薦入試では別の計算方法が使われることがあります'
  ]
};

// デフォルトFAQ
const DEFAULT_FAQ = [
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
];

export default function PrefectureNaishinPage() {
  const params = useParams();
  const prefectureCode = params.prefecture as string;
  const prefecture = getPrefectureByCode(prefectureCode);

  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [showResult, setShowResult] = React.useState(false);

  if (!prefecture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">都道府県が見つかりません</h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            トップページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const pitfalls = generatePitfalls(prefectureCode);
  const faqItems = generateFAQ(prefectureCode);

  const max = calculateMaxScore(prefectureCode);
  const total = calculateTotalScore(scores, prefectureCode);
  const percent = calculatePercent(total, max);
  const rank = getRankForPercent(percent);

  const handleScoreChange = (subject: SubjectKey, value: number) => {
    setScores(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const handleCalculate = () => {
    setShowResult(true);
    if (typeof window !== 'undefined') {
      if (prefectureCode === 'kanagawa') {
        window.localStorage.setItem('my-naishin:kanagawa-A', String(total));
      }
      if (prefectureCode === 'tokyo') {
        window.localStorage.setItem('my-naishin:tokyo-kanso', String(total));
      }
    }
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // 計算式の説明を生成
  const getFormulaExplanation = () => {
    const parts: string[] = [];
    
    prefecture.targetGrades.forEach(grade => {
      const multiplier = prefecture.gradeMultipliers[grade];
      if (multiplier > 0) {
        parts.push(`中${grade}${multiplier > 1 ? `×${multiplier}` : ''}`);
      }
    });

    let formula = parts.join(' ＋ ');
    
    if (prefecture.practicalMultiplier > 1) {
      formula += `（実技${prefecture.practicalMultiplier}倍）`;
    }

    return formula;
  };

  // FAQ構造化データ (JSON-LD)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: prefecture.name, url: `https://my-naishin.com/${prefectureCode}/naishin` }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}の内申点計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  {prefecture.name}の内申点計算ツール
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {prefecture.region} | 2026年度入試対応（令和8年度入学者選抜）
                </p>
              </div>
            </div>
            
            {/* メインページへの誘導バナー */}
            <div className="mt-6 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    <strong>より詳細な分析をご希望の方は</strong>、メインページで成績推移グラフ・教科別分析・目標設定などの機能をご利用いただけます
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex-shrink-0 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  メインページへ
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="space-y-6">
            {/* 概要カード */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Info className="h-5 w-5 text-blue-500" />
                {prefecture.name}の計算方法
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {prefecture.description}
              </p>
              
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">{prefecture.maxScore}点</div>
                  <div className="mt-1 text-xs text-blue-600">満点</div>
                </div>
                <div className="rounded-xl bg-indigo-50 p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-700">
                    中{prefecture.targetGrades.join('・')}
                  </div>
                  <div className="mt-1 text-xs text-indigo-600">対象学年</div>
                </div>
                <div className="rounded-xl bg-purple-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                  </div>
                  <div className="mt-1 text-xs text-purple-600">実技教科</div>
                </div>
              </div>

              {prefecture.note && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                  <strong>補足：</strong> {prefecture.note}
                </div>
              )}
            </section>

            {/* 計算式 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Calculator className="h-5 w-5 text-emerald-500" />
                計算式
              </h2>
              <div className="rounded-xl bg-slate-50 p-4">
                <code className="text-lg font-mono font-semibold text-slate-700">
                  {getFormulaExplanation()} ＝ {prefecture.maxScore}点満点
                </code>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong>5教科：</strong>国語・数学・英語・理科・社会（各5点満点）</p>
                <p><strong>実技4教科：</strong>音楽・美術・保健体育・技術家庭（各5点満点{prefecture.practicalMultiplier > 1 ? `、${prefecture.practicalMultiplier}倍で計算` : ''}）</p>
              </div>
            </section>

            {/* 埋め込み計算ツール */}
            <section className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {prefecture.name}の内申点を計算する
                  </h2>
                  <p className="text-sm text-slate-500">
                    下記に成績を入力すると、{prefecture.maxScore}点満点で計算されます
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <InputForm
                  prefectureCode={prefectureCode}
                  scores={scores}
                  onChange={handleScoreChange}
                  maxGrade={5}
                />
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleCalculate}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                  >
                    内申点を計算する
                  </button>
                </div>
              </div>

              {/* 計算結果 */}
              {showResult && (
                <div id="result" className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-center text-lg font-bold text-slate-800">
                    🎉 あなたの{prefecture.name}での内申点
                  </h3>
                  <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
                    <ScoreGauge percent={percent} total={total} max={max} />
                    <div className="text-center md:text-left">
                      <div className="text-4xl font-bold text-blue-600">{total}点</div>
                      <div className="text-sm text-slate-500">/ {max}点満点（達成率 {percent}%）</div>
                      <div className="mt-2">
                        <RankCard result={{ prefectureCode, total, max, percent, rank }} />
                      </div>
                    </div>
                  </div>

                  {prefectureCode === 'kanagawa' && (
                    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <div className="text-sm font-bold text-indigo-700">A（評定合計）と a値</div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                        <span>A（評定合計）: <strong>{total}点</strong></span>
                        <span>a値（100点換算）: <strong>{Math.round((total / max) * 100)}点</strong></span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">a値はAを100点満点に換算した値です。</p>
                    </div>
                  )}
                  
                  {/* 逆算機能への誘導 */}
                  <div className="mt-6 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                        🎯
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 font-bold text-slate-800">志望校から逆算する</h4>
                        <p className="mb-3 text-sm leading-relaxed text-slate-600">
                          「この高校に受かるには内申点が何点必要？」「今の内申点だと本番で何点取ればいい？」
                          そんな疑問を解決する逆算機能をご利用いただけます。
                        </p>
                        <Link
                          href={prefectureCode === 'tokyo' ? '/reverse?pref=tokyo' : prefectureCode === 'kanagawa' ? '/reverse?pref=kanagawa' : '/reverse'}
                          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                        >
                          {prefectureCode === 'tokyo' ? '🎯 必要当日点を算出する' : '🎯 志望校から逆算する'}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-6 w-6 flex-shrink-0 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="mb-2 font-bold text-slate-800">さらに詳しい分析をご希望の方へ</h4>
                        <p className="mb-3 text-sm leading-relaxed text-slate-600">
                          メインページでは、成績推移グラフ、教科別の詳細分析、目標設定機能、勉強タイマーなど、より充実した機能をご利用いただけます。
                        </p>
                        <Link
                          href="/"
                          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                        >
                          <Calculator className="h-4 w-4" />
                          詳細な分析・計算はこちら
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* その県だけの詳細情報 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <BookOpen className="h-5 w-5 text-blue-500" />
                {prefecture.name}ならではの内申ポイント
              </h2>

              {/* 固定テンプレ：3行要約 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200">
                <h3 className="mb-3 font-bold text-blue-800 flex items-center gap-2">
                  <span className="text-lg">📝</span> {prefecture.name}の内申ポイント3行要約
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span><strong>対象学年：</strong>中{prefecture.targetGrades.join('・')}が対象{prefecture.targetGrades.length === 1 ? '（注：集中対策が必要）' : '（早めの対策が有利）'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span><strong>実技倍率：</strong>{prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍（実技得意な人有利）` : '等倍（バランス型が有利）'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span><strong>満点：</strong>{prefecture.maxScore}点{prefecture.maxScore >= 200 ? '（高得点戦略が必要）' : '（効率的な得点アップが可能）'}</span>
                  </div>
                </div>
              </div>

              {/* 固定テンプレ：計算例 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-200">
                <h3 className="mb-3 font-bold text-green-800 flex items-center gap-2">
                  <span className="text-lg">🧮</span> よくある成績パターンの計算例
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-white p-3 border border-green-300">
                    <div className="font-semibold text-green-700">オール3の場合</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {(() => {
                        const all3Scores = Object.keys(DEFAULT_SCORES).reduce((acc, key) => ({
                          ...acc,
                          [key]: 3
                        }), {} as Scores);
                        const total = calculateTotalScore(all3Scores, prefectureCode);
                        return `${total}点 / ${prefecture.maxScore}点満点`;
                      })()}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-green-300">
                    <div className="font-semibold text-green-700">オール4の場合</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {(() => {
                        const all4Scores = Object.keys(DEFAULT_SCORES).reduce((acc, key) => ({
                          ...acc,
                          [key]: 4
                        }), {} as Scores);
                        const total = calculateTotalScore(all4Scores, prefectureCode);
                        return `${total}点 / ${prefecture.maxScore}点満点`;
                      })()}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-green-300">
                    <div className="font-semibold text-green-700">実技だけ+1</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {(() => {
                        const baseScores = Object.keys(DEFAULT_SCORES).reduce((acc, key) => ({
                          ...acc,
                          [key]: 3
                        }), {} as Scores);
                        // 実技教科だけ+1
                        const jitsugiSubjects = ['music', 'art', 'pe', 'tech'] as const;
                        type JitsugiSubject = typeof jitsugiSubjects[number];
                        jitsugiSubjects.forEach((subject) => {
                          baseScores[subject] = 4;
                        });
                        const total = calculateTotalScore(baseScores, prefectureCode);
                        const baseTotal = calculateTotalScore(Object.keys(DEFAULT_SCORES).reduce((acc, key) => ({
                          ...acc,
                          [key]: 3
                        }), {} as Scores), prefectureCode);
                        const increase = total - baseTotal;
                        return `${total}点（+${increase}点）`;
                      })()}
                    </div>
                  </div>
                </div>
                {prefecture.practicalMultiplier > 1 && (
                  <div className="mt-3 p-2 bg-green-100 rounded-lg text-xs text-green-700">
                    <strong>ポイント：</strong>実技教科が{prefecture.practicalMultiplier}倍なので、実技で1点上げると通常の{prefecture.practicalMultiplier}倍の効果があります！
                  </div>
                )}
              </div>

              {/* 固定テンプレ：公式資料情報 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 border border-amber-200">
                <h3 className="mb-3 font-bold text-amber-800 flex items-center gap-2">
                  <span className="text-lg">📋</span> 公式資料の確認ポイント
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600">📄</span>
                    <span><strong>資料名：</strong>{prefecture.name}教育委員会「令和8年度入学者選抜要項」</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600">🔍</span>
                    <span><strong>確認ページ：</strong>「調査書点の算出方法」または「内申点の取扱い」の項目</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600">✅</span>
                    <span><strong>チェック項目：</strong>満点数・実技倍率・対象学年・学校ごとの注意事項</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600">⚠️</span>
                    <span><strong>注意：</strong>学校・コースによって計算方法が異なる場合があります</span>
                  </div>
                </div>
              </div>
              
              {/* 東京都の詳細情報 */}
              {prefectureCode === 'tokyo' && (
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-800">🎯 東京都の内申ポイント</h4>
                    <p className="text-slate-600">
                      東京都の内申は、まず「素内申（9教科の合計＝45点満点）」と、一般入試で使う「換算内申」を分けて考えるのがコツです。換算内申は、学力検査を行う教科の評定を1倍、学力検査を行わない教科の評定を2倍として合計します。都立の一般的な5教科入試では満点が65点（＝5教科25点＋実技4教科40点）になり、実技4教科の影響が大きくなります。
                    </p>
                    <p className="mt-2 text-slate-600">
                      例えばオール3なら換算内申は39点、オール4なら52点です（5教科＋実技4教科×2）。また都立高校（全日制の多く）では、学力検査700点＋調査書点300点に加えて、英語スピーキングテスト（ESAT-J）を20点として扱う学校があり、合計の枠組みを知っておくと「逆算」がやりやすくなります。
                    </p>
                    <p className="mt-2 text-slate-600">
                      公式資料を見るときは「調査書点の満点（65など）」と「評定の扱い（1倍/2倍）」の行を最初に探すのがおすすめです。
                    </p>
                  </div>
                </div>
              )}

              {/* 神奈川県の詳細情報 */}
              {prefectureCode === 'kanagawa' && (
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-800">🎯 神奈川県の内申ポイント</h4>
                    <p className="text-slate-600">
                      神奈川県は「中3が2倍」と覚えると一気に整理できます。公式の計算では、学習の記録（評定）は 中2の9教科合計＋中3の9教科合計×2（135点満点）をまず作り、これを100点満点に換算した値を使います。さらに学力検査（合計点を100点満点に換算）や、学校によっては特色検査（100点満点に換算）が加わり、学校ごとの比率で合計値S1（一次選考）を出します。
                    </p>
                    <p className="mt-2 text-slate-600">
                      また二次選考では「主体的に学習に取り組む態度」の評価も使われ、A=3点/B=2点/C=1点として合計（27点満点）を100点に換算します。
                    </p>
                    <p className="mt-2 text-slate-600">
                      よくネットで言う「A値・S値」は、この公式計算（a,b,c,d,S1/S2）を分かりやすく呼び替えた表現だと思ってOKです。自分の志望校が特色検査を実施するか、比率（内申:当日点:特色）が何かを、県の「選考基準」PDFで確認するのが最短ルートです。
                    </p>
                  </div>
                </div>
              )}

              {/* 大阪府の詳細情報 */}
              {prefectureCode === 'osaka' && (
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-800">🎯 大阪府の内申ポイント</h4>
                    <p className="text-slate-600">
                      大阪府の内申（調査書の評定）は「中3が一番重い」方式です。代表的な形だと、各教科の評定を（中3×3＋中2×1＋中1×1）で合計して25点満点にします（＝学年の重みは実質1:1:3）。
                    </p>
                    <p className="mt-2 text-slate-600">
                      さらに入試の総合点は「学力検査の合計点」と「調査書評定の合計点」に対して、高校が選び教育委員会が決めた倍率（タイプ）をそれぞれ掛けて合計する、という考え方が基本です。
                    </p>
                    <p className="mt-2 text-slate-600">
                      そしてチャレンジテストは「個人の内申を点数で決めるもの」ではなく、学校間で評定のつけ方に差が出すぎないように、府内統一ルールの検証に使われます（評定平均の範囲など）。ここを誤解されやすいので、県別ページでハッキリ書くと信頼が上がります。
                    </p>
                    <p className="mt-2 text-slate-600">
                      文理学科か普通科かで対策の重点は変わりますが、まずは「自分の志望校の倍率タイプ」と「調査書評定の作り方」を公式PDFで確認するのが最短です。
                    </p>
                  </div>
                </div>
              )}

              {/* その他の都道府県の汎用情報 */}
              {!['tokyo', 'kanagawa', 'osaka'].includes(prefectureCode) && (
                <div className="space-y-4 text-sm text-slate-700">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-800">🎯 {prefecture.name}の内申ポイント</h4>
                    <p className="text-slate-600">
                      この県の内申は、①どの学年の評定を使うか（中3だけ／中2も使う など）と、②実技教科の扱い（倍率があるか）、③当日点との比率（何：何）を押さえると迷いません。まずは県教育委員会の公式PDF（募集案内・実施要項など）で、「選考」「比率」「調査書点（内申点）」「換算」の語を探し、満点と計算式を確認します。
                    </p>
                    <p className="mt-2 text-slate-600">
                      公式資料は年度で更新されることがあるため、このページでは参照元リンクと最終確認日もあわせて掲載しています。分からない点があれば、入力例（オール3/4など）で一度計算して、結果が直感とズレないか確認すると安全です。
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* 注意点・落とし穴 */}
            <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {pitfalls.title}
              </h2>
              <ul className="space-y-3">
                {pitfalls.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ - 構造化データ対応 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                {prefecture.name}の内申点に関するよくある質問
              </h2>
              <div className="space-y-2">
                {faqItems.map((item, index) => (
                  <details
                    key={index}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 transition-colors"
                  >
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                      Q. {item.question}
                    </summary>
                    <div className="border-t border-slate-100 px-4 pb-4 pt-2">
                      <p className="text-sm leading-relaxed text-slate-600">A. {item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* 公式資料リンク */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                公式資料・情報源
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {prefecture.sourceUrl ? (
                  <a
                    href={prefecture.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {prefecture.sourceTitle || `${prefecture.name}教育委員会`}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500">
                    公式リンク：確認中
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                  <Calendar className="h-4 w-4" />
                  最終確認: {prefecture.lastVerified || '未確認'}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                ※ 制度は年度によって変更される場合があります。最新情報は上記公式サイトでご確認ください。
              </p>
            </section>

            {/* 関連リンク（県名入り） */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-800">{prefecture.name}の関連コンテンツ</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/reverse?pref=${prefectureCode}`}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">{prefecture.name}：内申と当日点の逆算</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/blog/naishinten-calculation-by-prefecture"
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">{prefecture.name}：他県との計算方法を比較</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/blog/jitsugi-kyoka-prefecture-comparison"
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">{prefecture.name}：副教科{prefecture.practicalMultiplier > 1 ? `は${prefecture.practicalMultiplier}倍で有利` : 'は等倍'}？</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/glossary"
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">用語辞典（素内申・換算内申・K値など）</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/prefectures"
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">他の都道府県の内申点計算を見る</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-slate-700">内申点シミュレーター（フル機能版）</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </section>

            {/* SEO用テキスト */}
            <p className="text-xs leading-relaxed text-slate-400">
              {prefecture.name}の内申点計算ツール「My Naishin」では、{prefecture.name}の高校入試で使用される内申点（{prefecture.maxScore}点満点）を簡単に計算できます。
              {prefecture.targetGrades.length === 1 
                ? `${prefecture.name}では中${prefecture.targetGrades[0]}の成績のみが対象です。`
                : `${prefecture.name}では中${prefecture.targetGrades.join('・')}の成績が対象となります。`}
              {prefecture.practicalMultiplier > 1 && `実技4教科は${prefecture.practicalMultiplier}倍で計算されます。`}
              最新の入試情報は{prefecture.name}教育委員会の公式サイトでご確認ください。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
