'use client';

import * as React from 'react';

import type { Scores, ResultData } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';

interface StudyAdviceProps {
  scores: Scores;
  result: ResultData;
}

interface AdviceItem {
  title: string;
  description: string;
  detail?: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'tip';
}

// Study tips database
const STUDY_TIPS = {
  general: [
    { title: 'ポモドーロ・テクニック', desc: '25分集中→5分休憩のサイクルで効率UP' },
    { title: '睡眠をしっかりとる', desc: '7-8時間の睡眠で記憶が定着します' },
    { title: '朝型学習のすすめ', desc: '朝は集中力が高く、暗記に最適な時間帯' },
    { title: '教えることで学ぶ', desc: '友達に説明すると理解が深まります' },
    { title: '復習のゴールデンタイム', desc: '学んだその日のうちに復習すると記憶定着率UP' },
    { title: 'ミニゴール設定', desc: '「英単語20個」など小さな目標で達成感を積み上げよう' },
    { title: 'アウトプット学習', desc: '問題を解く→説明するを繰り返すと理解が一気に深まる' },
    { title: 'ごほうびルール', desc: '目標達成後に小さなごほうびを設定してやる気を維持' },
    { title: '1日の作戦タイム', desc: '朝5分で「今日やること3つ」を決めると迷いが減る' },
    { title: '毎日5分の積み上げ', desc: '短くても毎日続けると記憶が定着しやすい' },
    { title: 'できたことメモ', desc: '達成できたことを1行記録すると自己肯定感が上がる' },
    { title: '教科書の言い換え', desc: '用語を自分の言葉で説明できると理解度が上がる' },
    { title: '間違いノートを作る', desc: '同じミスを繰り返さないために、間違えた問題を記録' },
    { title: '週末振り返り', desc: '土日に1週間の学習を振り返ると定着率が上がる' },
    { title: '得意科目から始める', desc: '得意科目で勢いをつけてから苦手に挑戦' },
    { title: '立って音読', desc: '眠い時は立って音読すると目が覚める' },
    { title: '小テストに力を入れる', desc: '小テストを全力で取ると内申点に直結' },
    { title: '1教科集中週間', desc: '1週間1教科に集中すると効率的に伸びる' },
  ],
  motivation: [
    '小さな目標を立てて、達成する喜びを積み重ねよう',
    '「できない」ではなく「まだできない」と考えよう',
    '比べるのは昨日の自分だけ。少しずつ前に進もう',
    '失敗は成功のもと。間違いから学ぶことが大切',
    '休憩も勉強の一部。メリハリをつけて頑張ろう',
    '今日の1%の努力が半年後の大きな差になる',
    'やる気は行動のあとにやってくる。まず5分始めよう',
    'できたことリストを増やすと自信は伸びる',
    '焦らず昨日より1問多く解ければ十分',
    '習慣は才能を超える。続けた人だけが伸びる',
    'ミスは伸びるサイン。気づいた時点で前進している',
    '完璧を狙うより「続ける」ことが大切',
    '短い時間でも積み重ねれば大きな力になる',
    '自分のペースで進めばいい。止まらなければ少しずつ伸びる',
    '今この瞬間が、未来の自分を作っている',
    '努力は裏切らない。続けた先に結果がある',
    '苦手は伸びしろ。克服すれば大きな武器になる',
    '1日1歩でも365日で365歩進める',
    '諦めずに続けることが力になる',
    '今日の頑張りが明日の自信になる',
  ],
  actionTips: [
    { title: '提出物チェック', desc: '今週の提出物を確認して、期限2日前に仕上げよう' },
    { title: '質問リスト作成', desc: '授業で分からなかった点を3つ書き出して先生に質問' },
    { title: 'ノート見直し', desc: '今日の授業ノートを5分で見直して記憶を定着' },
    { title: 'ワーク1ページ', desc: '苦手科目のワークを1ページだけ解いてみよう' },
    { title: '単語10個暗記', desc: '英単語や用語を10個だけ覚えて寝よう' },
    { title: '計算ドリル5問', desc: '計算力維持のために毎日5問だけ解く習慣を' },
  ],
};

// Subject-specific advice (using correct keys: japanese, math, english, science, social, music, art, pe, tech)
const SUBJECT_ADVICE: Record<string, { weak: string; improve: string; strong: string }> = {
  japanese: {
    weak: '毎日10分の読書習慣をつけましょう。漫画でもOKです。語彙力が自然とつきます',
    improve: '記述問題の練習を増やしましょう。自分の言葉で説明する力が点数に直結します',
    strong: '古文・漢文の深堀りや、文学作品の背景知識を増やすと更に伸びます',
  },
  math: {
    weak: '計算ミスをなくすことから始めましょう。基礎計算を毎日5問解く習慣を',
    improve: '公式を「なぜそうなるか」まで理解すると応用が効きます',
    strong: '発展問題や入試過去問にチャレンジしましょう。思考力を鍛えましょう',
  },
  english: {
    weak: '単語を毎日5個ずつ覚えましょう。アプリを活用すると効率的です',
    improve: 'リスニングを毎日15分。洋楽や海外ドラマも効果的です',
    strong: '英作文の練習を増やしましょう。自分の意見を英語で書く力が差をつけます',
  },
  science: {
    weak: '図や表を使って視覚的に理解しましょう。実験の動画を見るのも効果的',
    improve: '「なぜそうなるか」を常に考える癖をつけましょう',
    strong: '発展的な実験や観察に挑戦。科学雑誌を読むのもおすすめです',
  },
  social: {
    weak: '歴史の流れを漫画で学ぶのがおすすめ。まずは大きな流れを掴みましょう',
    improve: '地図や年表を活用して、場所と時間の関係を整理しましょう',
    strong: '時事問題にも目を向けて、現代との繋がりを考えましょう',
  },
  music: {
    weak: 'まずは好きな曲を分析してみましょう。楽しみながら学ぶのが一番',
    improve: '楽典の基礎をしっかり押さえると、実技も理論も伸びます',
    strong: '様々なジャンルの音楽に触れて、表現の幅を広げましょう',
  },
  art: {
    weak: '身近なものをスケッチする習慣をつけましょう。上手さより観察力が大切',
    improve: '美術館やギャラリーで本物の作品に触れると感性が磨かれます',
    strong: '自分だけの表現スタイルを追求しましょう',
  },
  pe: {
    weak: '実技は毎日少しずつ。YouTubeの解説動画で正しいフォームを学びましょう',
    improve: 'ルールや戦術を理解すると、実技の点数も上がります',
    strong: '新しいスポーツにも挑戦して、運動能力の幅を広げましょう',
  },
  tech: {
    weak: '身の回りの製品がどう作られているか興味を持つことから始めましょう',
    improve: '実際に手を動かして作る経験を増やしましょう',
    strong: 'プログラミングやものづくりコンテストに挑戦してみては？',
  },
};

export function StudyAdvice({ scores, result }: StudyAdviceProps) {
  // Random indices populated on client only to avoid hydration mismatch
  const [randomIndices, setRandomIndices] = React.useState<{
    actionTip: number;
    generalTip: number;
    secondGeneralTip: number;
    motivation: number;
  } | null>(null);

  React.useEffect(() => {
    setRandomIndices({
      actionTip: Math.floor(Math.random() * STUDY_TIPS.actionTips.length),
      generalTip: Math.floor(Math.random() * STUDY_TIPS.general.length),
      secondGeneralTip: Math.floor(Math.random() * STUDY_TIPS.general.length),
      motivation: Math.floor(Math.random() * STUDY_TIPS.motivation.length),
    });
  }, []);

  // Safely get percent
  const percent = Math.floor(result?.percent || 0);

  // Find weak subjects (score < 3)
  const weakSubjects = SUBJECTS.filter(s => scores[s.key] < 3);
  // Find subjects that can improve (score 3-4)
  const improvableSubjects = SUBJECTS.filter(s => scores[s.key] >= 3 && scores[s.key] < 5);
  // Find strong subjects (score 5)
  const strongSubjects = SUBJECTS.filter(s => scores[s.key] === 5);

  // Find the worst subject for priority advice
  const worstSubject = SUBJECTS.reduce((min, s) =>
    scores[s.key] < scores[min.key] ? s : min
  , SUBJECTS[0]);

  const improvableTargets = [...improvableSubjects].sort((a, b) => scores[b.key] - scores[a.key]);
  const bestImprovable = improvableTargets[0];
  const secondImprovable = improvableTargets[1];

  const generateAdvice = (): AdviceItem[] => {
    const advice: AdviceItem[] = [];

    // Critical: If there are subjects with score 1
    const criticalSubjects = SUBJECTS.filter(s => scores[s.key] === 1);
    if (criticalSubjects.length > 0) {
      advice.push({
        title: `${criticalSubjects[0].label}を最優先で対策`,
        description: '1がついている科目は早急な対策が必要です',
        detail: SUBJECT_ADVICE[criticalSubjects[0].key]?.weak || '基礎から丁寧に復習しましょう',
        priority: 'critical',
      });
    }

    // High priority: Address weak subjects
    if (weakSubjects.length > 0 && weakSubjects[0].key !== criticalSubjects[0]?.key) {
      const subject = weakSubjects[0];
      advice.push({
        title: `${subject.label}の基礎固め`,
        description: `まずは${subject.label}を平均レベルまで引き上げましょう`,
        detail: SUBJECT_ADVICE[subject.key]?.weak || '基礎問題を繰り返し解きましょう',
        priority: 'high',
      });
    }

    // Medium priority: Subjects that can reach 5 or move from 3 to 4
    if (bestImprovable) {
      if (scores[bestImprovable.key] >= 4) {
        advice.push({
          title: `${bestImprovable.label}で満点を狙う`,
          description: 'あと1点で5です。最も効率よく点数を伸ばせます',
          detail: SUBJECT_ADVICE[bestImprovable.key]?.improve || '応用問題にチャレンジしましょう',
          priority: 'medium',
        });
      } else if (scores[bestImprovable.key] === 3) {
        advice.push({
          title: `${bestImprovable.label}を4へ引き上げる`,
          description: '基礎が固まっているので、あと一歩で評定UP',
          detail: SUBJECT_ADVICE[bestImprovable.key]?.improve || '解き直しと原因分析で伸びます',
          priority: 'medium',
        });
      }
    }

    // Advice based on overall performance
    if (percent >= 90) {
      advice.push({
        title: 'トップを維持する秘訣',
        description: '達成率は90%以上です。この調子で維持しましょう',
        detail: '難関校の過去問や発展教材にチャレンジしてみては？',
        priority: 'low',
      });
    } else if (percent >= 70) {
      advice.push({
        title: 'あと少しで上位層',
        description: '苦手科目を1つ克服するだけで大きく変わります',
        detail: '毎日30分の計画的な学習で着実にレベルアップできます',
        priority: 'medium',
      });
    } else if (percent >= 50) {
      advice.push({
        title: '伸びしろ十分',
        description: '基礎を固めれば大幅アップが期待できます',
        detail: '教科書の例題を解けるようにすることから始めましょう',
        priority: 'medium',
      });
    } else {
      advice.push({
        title: '今日から変わろう',
        description: '1日15分から始めて、少しずつ習慣をつけましょう',
        detail: 'まずは得意になれそうな1教科に絞って集中しましょう',
        priority: 'high',
      });
    }

    // Strong subject advice
    if (strongSubjects.length > 0) {
      advice.push({
        title: `得意な${strongSubjects[0].label}を活かす`,
        description: '得意科目の勉強法を他の科目にも応用しましょう',
        detail: SUBJECT_ADVICE[strongSubjects[0].key]?.strong || '更なる高みを目指しましょう',
        priority: 'tip',
      });
    }

    if (secondImprovable && secondImprovable.key !== bestImprovable?.key && secondImprovable.key !== weakSubjects[0]?.key) {
      advice.push({
        title: `${secondImprovable.label}を次の得点源に`,
        description: '安定して4を取れる科目を増やすと内申点が伸びやすい',
        detail: SUBJECT_ADVICE[secondImprovable.key]?.improve || '基本問題の取りこぼしを減らそう',
        priority: 'low',
      });
    }

    advice.push({
      title: '1週間の学習ルーティンを作る',
      description: '曜日ごとに教科を固定すると迷わず続けられます',
      detail: '例：月・木は英語、火・金は数学、水は理社の整理',
      priority: 'tip',
    });

    // Add action tip (only after client mount to avoid hydration mismatch)
    if (randomIndices) {
      const actionTip = STUDY_TIPS.actionTips[randomIndices.actionTip];
      advice.push({
        title: `今日のアクション：${actionTip.title}`,
        description: actionTip.desc,
        priority: 'tip',
      });
    }

    // Add multiple weak subject advice if there are many
    if (weakSubjects.length >= 2) {
      const secondWeak = weakSubjects[1];
      advice.push({
        title: `${secondWeak.label}も要注意`,
        description: '複数の苦手科目がある場合は、1つずつ順番に克服しよう',
        detail: SUBJECT_ADVICE[secondWeak.key]?.weak || '基礎から丁寧に取り組みましょう',
        priority: 'high',
      });
    }

    // Add strong subject leverage advice
    if (strongSubjects.length >= 2) {
      advice.push({
        title: `得意科目が${strongSubjects.length}つ`,
        description: '得意科目の勉強法を他教科にも応用してみよう',
        detail: '同じ学習パターンで苦手科目も攻略できるかも',
        priority: 'low',
      });
    }

    // Random study tips (only after client mount to avoid hydration mismatch)
    if (randomIndices) {
      const randomTip = STUDY_TIPS.general[randomIndices.generalTip];
      advice.push({
        title: randomTip.title,
        description: randomTip.desc,
        priority: 'tip',
      });

      const secondTip = STUDY_TIPS.general[randomIndices.secondGeneralTip];
      if (secondTip.title !== randomTip.title) {
        advice.push({
          title: secondTip.title,
          description: secondTip.desc,
          priority: 'tip',
        });
      }
    }

    return advice.slice(0, 10);
  };

  const advice = generateAdvice();

  // Random motivation message (defaults to first item, randomized on client mount)
  const motivation = randomIndices
    ? STUDY_TIPS.motivation[randomIndices.motivation]
    : STUDY_TIPS.motivation[0];

  // 優先度の見せ方: 文字ラベル＋四角いタグ。色は 危険=赤・注意=琥珀 だけ、それ以外は灰の枠線
  const priorityConfig = {
    critical: {
      label: '最優先',
      tag: 'border-red-200 bg-red-50 text-red-800',
    },
    high: {
      label: '重要',
      tag: 'border-amber-200 bg-amber-50 text-amber-900',
    },
    medium: {
      label: 'おすすめ',
      tag: 'border-slate-200 bg-white text-slate-700',
    },
    low: {
      label: '維持',
      tag: 'border-slate-200 bg-white text-slate-700',
    },
    tip: {
      label: 'ヒント',
      tag: 'border-slate-200 bg-white text-slate-700',
    },
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Header */}
      <div className="p-5">
        <h3 className="text-[17px] font-bold text-slate-900">パーソナル学習アドバイス</h3>
        <p className="mt-1 text-sm text-slate-600">あなたの成績に合わせた具体的なアドバイス</p>

        {/* Motivation quote */}
        <p className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-relaxed text-slate-900">
          {motivation}
        </p>
      </div>

      {/* Summary Stats */}
      <dl className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
        <div className="p-4 text-center">
          <dt className="text-xs text-slate-600">要改善</dt>
          <dd className="mt-1">
            <span className="block text-2xl font-bold tabular-nums text-slate-900">{weakSubjects.length}</span>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-brand-700" style={{ width: `${(weakSubjects.length / 9) * 100}%` }} />
            </div>
          </dd>
        </div>
        <div className="p-4 text-center">
          <dt className="text-xs text-slate-600">伸びしろ</dt>
          <dd className="mt-1">
            <span className="block text-2xl font-bold tabular-nums text-slate-900">{improvableSubjects.length}</span>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-brand-700" style={{ width: `${(improvableSubjects.length / 9) * 100}%` }} />
            </div>
          </dd>
        </div>
        <div className="p-4 text-center">
          <dt className="text-xs text-slate-600">得意科目</dt>
          <dd className="mt-1">
            <span className="block text-2xl font-bold tabular-nums text-slate-900">{strongSubjects.length}</span>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-brand-700" style={{ width: `${(strongSubjects.length / 9) * 100}%` }} />
            </div>
          </dd>
        </div>
      </dl>

      {/* Advice List */}
      <ul className="divide-y divide-slate-200 px-5">
        {advice.map((item, index) => {
          const config = priorityConfig[item.priority];
          return (
            <li key={index} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-slate-900">{item.title}</span>
                <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${config.tag}`}>
                  {config.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-900">{item.description}</p>
              {item.detail && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <span className="mr-2 font-bold text-slate-900">ポイント</span>
                  {item.detail}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Action prompt */}
      <div className="border-t border-slate-200 p-4 text-sm text-slate-600">
        今日から1つでも実践してみよう
      </div>
    </div>
  );
}
