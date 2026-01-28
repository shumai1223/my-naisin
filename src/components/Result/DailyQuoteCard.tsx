'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, RefreshCw, Heart, Share2 } from 'lucide-react';

const QUOTES = [
  { text: '努力した者が全て報われるとは限らない。しかし、成功した者は皆すべからく努力している。', author: 'ベートーヴェン' },
  { text: '今日できることを明日に延ばすな。', author: 'ベンジャミン・フランクリン' },
  { text: '小さなことを積み重ねることが、とんでもないところへ行くただ一つの道。', author: 'イチロー' },
  { text: '失敗を恐れるな。失敗しない人は何も新しいことに挑戦しない人だ。', author: 'アルベルト・アインシュタイン' },
  { text: '夢を見ることができれば、それを実現することができる。', author: 'ウォルト・ディズニー' },
  { text: '継続は力なり。', author: '日本のことわざ' },
  { text: '才能とは、自分自身を、自分の力を信じることだ。', author: 'ゴーリキー' },
  { text: '今日の一歩は、明日の千歩につながる。', author: '不明' },
  { text: '困難の中に、機会がある。', author: 'アルベルト・アインシュタイン' },
  { text: '成功の秘訣は、成功するまで諦めないことだ。', author: 'エジソン' },
  { text: '最も暗い夜も、必ず明けて朝が来る。', author: 'シェイクスピア' },
  { text: '人生で最も大切なことは、決して諦めないこと。', author: 'ニック・ブイチチ' },
  { text: '行動は、全ての成功の基礎的な鍵である。', author: 'パブロ・ピカソ' },
  { text: '自分を信じなさい。そうすれば、どう生きるかがわかる。', author: 'ゲーテ' },
  { text: '知識は力なり。', author: 'フランシス・ベーコン' },
  { text: '勉強とは自分の無知を徐々に発見していくことである。', author: 'ウィル・デュラント' },
  { text: '教育とは、学校で習ったことをすべて忘れた後に残るものである。', author: 'アインシュタイン' },
  { text: '賢者は歴史から学び、愚者は経験から学ぶ。', author: 'ビスマルク' },
  { text: '人は教えることによって、もっともよく学ぶ。', author: 'セネカ' },
  { text: '千里の道も一歩から。', author: '老子' },
];

function getDailyQuote(): typeof QUOTES[0] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

export function DailyQuoteCard() {
  const [quote, setQuote] = React.useState(getDailyQuote());
  const [liked, setLiked] = React.useState(false);
  const [showRefresh, setShowRefresh] = React.useState(false);

  const refreshQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
    setShowRefresh(true);
    setTimeout(() => setShowRefresh(false), 300);
  };

  const shareQuote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '今日の名言',
          text: `「${quote.text}」- ${quote.author}`,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Quote className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">💭 今日の名言</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full transition-all ${liked ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-100'}`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={shareQuote}
              className="p-2 rounded-full text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-all"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={refreshQuote}
              className="p-2 rounded-full text-slate-400 hover:text-violet-500 hover:bg-slate-100 transition-all"
            >
              <RefreshCw className={`h-4 w-4 transition-transform ${showRefresh ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -left-1 -top-2 text-4xl text-violet-200 font-serif">"</div>
          <p className="text-sm text-slate-700 leading-relaxed pl-4 pr-2 italic">
            {quote.text}
          </p>
          <div className="absolute -right-1 bottom-0 text-4xl text-violet-200 font-serif rotate-180">"</div>
        </motion.div>

        <div className="mt-3 text-right">
          <span className="text-xs text-slate-500">— {quote.author}</span>
        </div>
      </div>
    </motion.div>
  );
}
