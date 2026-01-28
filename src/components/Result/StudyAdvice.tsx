'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Clock, 
  BookOpen, 
  Target,
  Brain,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  Star,
  TrendingUp,
  Zap,
  Coffee,
  Moon,
  Sun,
  Heart,
  MessageCircle,
  Sparkles,
  Trophy,
  AlertCircle
} from 'lucide-react';

import type { Scores, ResultData } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';

interface StudyAdviceProps {
  scores: Scores;
  result: ResultData;
}

interface AdviceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  detail?: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'tip';
}

// Study tips database
const STUDY_TIPS = {
  general: [
    { icon: Clock, title: 'ポモドーロ・テクニック', desc: '25分集中→5分休憩のサイクルで効率UP！' },
    { icon: Moon, title: '睡眠は最高の勉強法', desc: '7-8時間の睡眠で記憶が定着します' },
    { icon: Coffee, title: '朝型学習のすすめ', desc: '朝は集中力が高く、暗記に最適な時間帯' },
    { icon: MessageCircle, title: '教えることで学ぶ', desc: '友達に説明すると理解が深まります' },
    { icon: BookOpen, title: '復習のゴールデンタイム', desc: '学んだその日のうちに復習すると記憶定着率UP' },
    { icon: Target, title: 'ミニゴール設定', desc: '「英単語20個」など小さな目標で達成感を積み上げよう' },
    { icon: Brain, title: 'アウトプット学習', desc: '問題を解く→説明するを繰り返すと理解が一気に深まる' },
    { icon: Sparkles, title: 'ごほうびルール', desc: '目標達成後に小さなごほうびを設定してやる気を維持' },
    { icon: Sun, title: '1日の作戦タイム', desc: '朝5分で「今日やること3つ」を決めると迷いが減る' },
    { icon: Flame, title: '毎日5分の積み上げ', desc: '短くても毎日続けると記憶が定着しやすい' },
    { icon: Heart, title: 'できたことメモ', desc: '達成できたことを1行記録すると自己肯定感が上がる' },
    { icon: BookOpen, title: '教科書の言い換え', desc: '用語を自分の言葉で説明できると理解度が上がる' },
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
    '完璧を狙うより「続ける」ことが最強',
    '短い時間でも積み重ねれば大きな力になる',
    '自分のペースで進めばいい。止まらなければ必ず伸びる',
  ],
};

// Subject-specific advice (using correct keys: japanese, math, english, science, social, music, art, pe, tech)
const SUBJECT_ADVICE: Record<string, { weak: string; improve: string; strong: string }> = {
  japanese: {
    weak: '毎日10分の読書習慣をつけましょう。漫画でもOK！語彙力が自然とつきます',
    improve: '記述問題の練習を増やしましょう。自分の言葉で説明する力が点数に直結します',
    strong: '古文・漢文の深堀りや、文学作品の背景知識を増やすと更に伸びます',
  },
  math: {
    weak: '計算ミスをなくすことから始めましょう。基礎計算を毎日5問解く習慣を',
    improve: '公式を「なぜそうなるか」まで理解すると応用が効きます',
    strong: '発展問題や入試過去問にチャレンジ！思考力を鍛えましょう',
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
        icon: AlertCircle,
        title: `🚨 ${criticalSubjects[0].label}を最優先で対策！`,
        description: '1がついている科目は早急な対策が必要です',
        detail: SUBJECT_ADVICE[criticalSubjects[0].key]?.weak || '基礎から丁寧に復習しましょう',
        priority: 'critical',
      });
    }

    // High priority: Address weak subjects
    if (weakSubjects.length > 0 && weakSubjects[0].key !== criticalSubjects[0]?.key) {
      const subject = weakSubjects[0];
      advice.push({
        icon: Target,
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
          icon: Star,
          title: `${bestImprovable.label}で満点を狙う！`,
          description: 'あと1点で5！最も効率よく点数を伸ばせます',
          detail: SUBJECT_ADVICE[bestImprovable.key]?.improve || '応用問題にチャレンジしましょう',
          priority: 'medium',
        });
      } else if (scores[bestImprovable.key] === 3) {
        advice.push({
          icon: TrendingUp,
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
        icon: Trophy,
        title: 'トップを維持する秘訣',
        description: '素晴らしい成績です！この調子で維持しましょう',
        detail: '難関校の過去問や発展教材にチャレンジしてみては？',
        priority: 'low',
      });
    } else if (percent >= 70) {
      advice.push({
        icon: TrendingUp,
        title: 'あと少しで上位層！',
        description: '苦手科目を1つ克服するだけで大きく変わります',
        detail: '毎日30分の計画的な学習で確実にレベルアップできます',
        priority: 'medium',
      });
    } else if (percent >= 50) {
      advice.push({
        icon: Flame,
        title: '伸びしろ十分！',
        description: '基礎を固めれば大幅アップが期待できます',
        detail: '教科書の例題を完璧にすることから始めましょう',
        priority: 'medium',
      });
    } else {
      advice.push({
        icon: Zap,
        title: '今日から変わろう！',
        description: '1日15分から始めて、少しずつ習慣をつけましょう',
        detail: 'まずは得意になれそうな1教科に絞って集中しましょう',
        priority: 'high',
      });
    }

    // Strong subject advice
    if (strongSubjects.length > 0) {
      advice.push({
        icon: Sparkles,
        title: `得意な${strongSubjects[0].label}を活かす`,
        description: '得意科目の勉強法を他の科目にも応用しましょう',
        detail: SUBJECT_ADVICE[strongSubjects[0].key]?.strong || '更なる高みを目指しましょう',
        priority: 'tip',
      });
    }

    if (secondImprovable && secondImprovable.key !== bestImprovable?.key && secondImprovable.key !== weakSubjects[0]?.key) {
      advice.push({
        icon: ArrowUpRight,
        title: `${secondImprovable.label}を次の得点源に`,
        description: '安定して4を取れる科目を増やすと内申点が伸びやすい',
        detail: SUBJECT_ADVICE[secondImprovable.key]?.improve || '基本問題の取りこぼしを減らそう',
        priority: 'low',
      });
    }

    advice.push({
      icon: Brain,
      title: '1週間の学習ルーティンを作る',
      description: '曜日ごとに教科を固定すると迷わず続けられます',
      detail: '例：月・木は英語、火・金は数学、水は理社の整理',
      priority: 'tip',
    });

    // Random study tip
    const randomTip = STUDY_TIPS.general[Math.floor(Math.random() * STUDY_TIPS.general.length)];
    advice.push({
      icon: randomTip.icon,
      title: randomTip.title,
      description: randomTip.desc,
      priority: 'tip',
    });

    return advice.slice(0, 7);
  };

  const advice = generateAdvice();

  // Random motivation message
  const [motivation] = React.useState(
    STUDY_TIPS.motivation[Math.floor(Math.random() * STUDY_TIPS.motivation.length)]
  );

  const priorityConfig = {
    critical: { 
      bg: 'bg-gradient-to-r from-red-50 to-rose-50', 
      border: 'border-red-300',
      label: '最優先',
      labelBg: 'bg-red-500',
      icon: 'text-red-600'
    },
    high: { 
      bg: 'bg-gradient-to-r from-rose-50 to-orange-50', 
      border: 'border-rose-200',
      label: '重要',
      labelBg: 'bg-rose-500',
      icon: 'text-rose-600'
    },
    medium: { 
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
      border: 'border-amber-200',
      label: 'おすすめ',
      labelBg: 'bg-amber-500',
      icon: 'text-amber-600'
    },
    low: { 
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50', 
      border: 'border-emerald-200',
      label: '維持',
      labelBg: 'bg-emerald-500',
      icon: 'text-emerald-600'
    },
    tip: { 
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', 
      border: 'border-blue-200',
      label: 'ヒント',
      labelBg: 'bg-blue-500',
      icon: 'text-blue-600'
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold">💡 パーソナル学習アドバイス</h3>
            <p className="text-sm text-white/80">あなたの成績に合わせた具体的なアドバイス</p>
          </div>
        </div>
        
        {/* Motivation quote */}
        <div className="mt-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-300" />
            <p className="text-sm font-medium text-white/90">{motivation}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 border-b border-slate-100">
        <div className="border-r border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-rose-500">{weakSubjects.length}</div>
          <div className="text-[10px] font-medium text-slate-500">要改善</div>
          <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-rose-400" style={{ width: `${(weakSubjects.length / 9) * 100}%` }} />
          </div>
        </div>
        <div className="border-r border-slate-100 p-4 text-center">
          <div className="text-2xl font-black text-amber-500">{improvableSubjects.length}</div>
          <div className="text-[10px] font-medium text-slate-500">伸びしろ</div>
          <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${(improvableSubjects.length / 9) * 100}%` }} />
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-black text-emerald-500">{strongSubjects.length}</div>
          <div className="text-[10px] font-medium text-slate-500">得意科目</div>
          <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${(strongSubjects.length / 9) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Advice List */}
      <div className="p-5 space-y-3">
        {advice.map((item, index) => {
          const Icon = item.icon;
          const config = priorityConfig[item.priority];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className={`rounded-xl border ${config.border} ${config.bg} p-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm ${config.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{item.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${config.labelBg}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                  {item.detail && (
                    <p className="mt-2 text-xs text-slate-500 bg-white/50 rounded-lg px-3 py-2">
                      💡 {item.detail}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action prompt */}
      <div className="border-t border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>今日から1つでも実践してみよう！</span>
        </div>
      </div>
    </motion.div>
  );
}
