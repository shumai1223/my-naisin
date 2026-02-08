'use client';

import Link from 'next/link';
import { BookOpen, FileText, Target, GraduationCap, ChevronRight } from 'lucide-react';

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
      icon: <BookOpen className="h-4 w-4" />,
      relevance: 'basic'
    },
    {
      title: '通知表の評価観点',
      description: '「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の評価基準',
      href: '/blog/hyoka-kanten',
      icon: <FileText className="h-4 w-4" />,
      relevance: 'evaluation'
    },
    {
      title: '志望校から逆算',
      description: '目標点から必要な内申点と当日点を計算する方法',
      href: '/reverse',
      icon: <Target className="h-4 w-4" />,
      relevance: 'planning'
    },
    {
      title: '高校入試制度',
      description: '全国の高校入試制度と内申点の役割について',
      href: '/blog/koukou-nyuushi-seido',
      icon: <GraduationCap className="h-4 w-4" />,
      relevance: 'system'
    }
  ];

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-indigo-800">
        <BookOpen className="h-5 w-5" />
        {prefectureName}の制度を詳しく理解する
      </h3>
      
      <div className="space-y-3">
        {pillarArticles.map((article, index) => (
          <Link
            key={index}
            href={article.href}
            className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {article.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-indigo-800 text-sm">{article.title}</h4>
              <p className="mt-1 text-xs text-indigo-600 line-clamp-2">{article.description}</p>
              
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  article.relevance === 'basic' ? 'bg-blue-100 text-blue-700' :
                  article.relevance === 'evaluation' ? 'bg-green-100 text-green-700' :
                  article.relevance === 'planning' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {article.relevance === 'basic' ? '基本' :
                   article.relevance === 'evaluation' ? '評価' :
                   article.relevance === 'planning' ? '計画' : '制度'}
                </span>
                <span className="text-xs text-indigo-500">
                  {prefectureName}の内申点計算に役立つ
                </span>
              </div>
            </div>
            
            <ChevronRight className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          </Link>
        ))}
      </div>
      
      <div className="mt-4 rounded-lg border border-indigo-300 bg-indigo-100 p-3">
        <p className="text-xs text-indigo-700">
          <strong>学習の順番：</strong>まず「内申点の基本」を理解し、次に「通知表の評価観点」を確認して、
          最後に「志望校から逆算」で具体的な目標を立てるのがおすすめです。
        </p>
      </div>
    </div>
  );
}
