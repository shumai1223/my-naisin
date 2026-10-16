'use client';

import Link from 'next/link';
import { ChevronRight } from '@/components/icons';

interface PrefecturePillarLinksProps {
  prefectureCode: string;
  prefectureName: string;
}

export function PrefecturePillarLinks({ prefectureCode, prefectureName }: PrefecturePillarLinksProps) {
  const pillarArticles = [
    {
      title: '内申点の基本',
      description: '内申点の計算方法と評価の3観点について詳しく解説',
      href: '/blog/naishin-guide',
      relevance: 'basic'
    },
    {
      title: '通知表の評価観点',
      description: '「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の評価基準',
      href: '/blog/hyoka-kanten',
      relevance: 'evaluation'
    },
    {
      title: '志望校から逆算',
      description: '目標点から必要な内申点と当日点を計算する方法',
      href: '/reverse',
      relevance: 'planning'
    },
    {
      title: '高校入試制度',
      description: '全国の高校入試制度と内申点の役割について',
      href: '/blog/koukou-nyuushi-seido',
      relevance: 'system'
    }
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="mb-2 text-[17px] font-bold text-slate-900">
        {prefectureName}の制度を詳しく理解する
      </h3>

      <div className="divide-y divide-slate-200">
        {pillarArticles.map((article, index) => (
          <Link
            key={index}
            href={article.href}
            className="flex min-h-[44px] items-center gap-3 py-3 hover:bg-brand-50"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-brand-700 underline underline-offset-2">{article.title}</h4>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{article.description}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  {article.relevance === 'basic' ? '基本' :
                   article.relevance === 'evaluation' ? '評価' :
                   article.relevance === 'planning' ? '計画' : '制度'}
                </span>
                <span className="text-xs text-slate-600">
                  {prefectureName}の内申点計算に役立つ
                </span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600" />
          </Link>
        ))}
      </div>

      <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-[1.8] text-slate-900">
        <strong>学習の順番：</strong>まず「内申点の基本」を理解し、次に「通知表の評価観点」を確認して、
        最後に「志望校から逆算」で具体的な目標を立てるのがおすすめです。
      </p>
    </div>
  );
}
