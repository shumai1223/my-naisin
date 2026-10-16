'use client';

import * as React from 'react';
import { RefreshCw, Heart, Share2 } from '@/components/icons';

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
  // Initialize with first quote, then update to today's quote on client to avoid hydration mismatch
  const [quote, setQuote] = React.useState(QUOTES[0]);
  const [liked, setLiked] = React.useState(false);
  const [showRefresh, setShowRefresh] = React.useState(false);

  React.useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

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
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-900">今日の名言</span>
          <div className="flex items-center">
            <button
              onClick={() => setLiked(!liked)}
              aria-label="いいね"
              aria-pressed={liked}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded transition-colors duration-100 hover:bg-slate-100 ${liked ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Heart className="h-5 w-5" weight={liked ? 'fill' : 'regular'} />
            </button>
            <button
              onClick={shareQuote}
              aria-label="この名言を共有"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-slate-600 transition-colors duration-100 hover:bg-slate-100 hover:text-slate-900"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={refreshQuote}
              aria-label="別の名言を表示"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-slate-600 transition-colors duration-100 hover:bg-slate-100 hover:text-slate-900"
            >
              <RefreshCw className={`h-5 w-5 transition-transform duration-150 ${showRefresh ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-base leading-[1.8] text-slate-900">
          {quote.text}
        </p>

        <div className="mt-2 text-right">
          <span className="text-sm text-slate-600">— {quote.author}</span>
        </div>
      </div>
    </div>
  );
}
