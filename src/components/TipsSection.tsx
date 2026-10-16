'use client';

import * as React from 'react';
import { ChevronDown } from '@/components/icons';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const TIPS = [
  {
    title: '目標設定のコツ',
    content: '現在の内申点から+5点を目標にするのがおすすめです。無理なく達成できる目標から始めましょう。'
  },
  {
    title: '内申点を上げるポイント',
    content: '提出物は期限厳守、授業態度も評価対象です。テストだけでなく日頃の積み重ねが大切です。'
  },
  {
    title: '苦手科目の攻略法',
    content: '苦手な1教科を集中的に伸ばすより、得意科目を5にキープしつつ3→4を目指すのが効率的です。'
  }
];

const FAQ = [
  {
    q: '内申点って何？',
    a: '中学校での成績を数値化したもの。高校入試の合否判定に使われます。5段階評価×9教科が基本ですが、都道府県によって計算方法が異なります。ページ上部の「都道府県を選択」からお住まいの地域を選んでください。'
  },
  {
    q: '東京都と他の地域で違うの？',
    a: 'はい。東京都は実技4教科を2倍で計算するため、満点が65点になります（代表例）。神奈川県は中2・中3の成績を使い135点満点、北海道は3年間の成績で315点満点など、地域ごとに大きく異なります。学校により異なる場合がありますので、ページ上部から都道府県を選択して詳細をご確認ください。'
  },
  {
    q: 'いつの成績が内申点になる？',
    a: '都道府県によって異なります。東京都は中3のみ（代表例）、神奈川県は中2〜3年、埼玉県は中1〜3年の成績が対象です。学校により異なる場合がありますので、ページ上部で都道府県を選択して対象学年を確認してください。'
  },
  {
    q: 'ランクはどう決まる？',
    a: 'Sランク(85%以上)、Aランク(70%以上)、Bランク(55%以上)、Cランク(55%未満)で判定しています（代表例）。これは目安であり、志望校によって必要な内申点は異なります。学校により異なる場合がありますので、必ず志望校の募集要項でご確認ください。'
  }
];

export function TipsSection() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-5 md:px-6">
          <h2 className="text-xl font-bold text-slate-900">内申点アップのヒント</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {TIPS.map((tip) => (
            <div key={tip.title} className="px-5 py-5 md:px-6">
              <h3 className="text-[17px] font-bold text-slate-900">{tip.title}</h3>
              <p className="mt-1 text-base leading-[1.8] text-slate-900">{tip.content}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-5 md:px-6">
          <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {FAQ.map((item, i) => (
            <div key={i} className="px-5 md:px-6">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex min-h-11 w-full items-center justify-between gap-3 py-4 text-left"
              >
                <span className="text-base font-bold text-slate-900">{item.q}</span>
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 text-slate-600', openFaq === i && 'rotate-180')}
                />
              </button>
              {openFaq === i && (
                <div className="pb-4 text-base leading-[1.8] text-slate-900">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
