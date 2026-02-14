'use client';

import { useState } from 'react';
import { Calculator, BookOpen, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools = [
    {
      category: 'calculation',
      title: '内申点計算ツール',
      description: '都道府県別の正確な計算方式で内申点を算出',
      features: ['47都道府県対応', '実技倍率対応', '学年比対応', '逆算機能連携'],
      href: '/prefectures',
      icon: Calculator,
      color: 'blue'
    },
    {
      category: 'reverse',
      title: '逆算ツール',
      description: '志望校に合格するために必要な当日点を算出',
      features: ['志望校対応', '内申点入力', '当日点算出', '学習計画立案'],
      href: '/reverse',
      icon: Target,
      color: 'purple'
    },
    {
      category: 'comparison',
      title: '都道府県比較',
      description: '進学先の内申点制度を比較・検討',
      features: ['複数県比較', '制度比較', '特徴分析', '進路相談支援'],
      href: '/comparison',
      icon: TrendingUp,
      color: 'green'
    },
    {
      category: 'guide',
      title: '内申点ガイド',
      description: '内申点の仕組みから対策まで完全解説',
      features: ['基礎解説', '都道府県別詳細', 'よくある質問', '対策方法'],
      href: '/blog/naishin-guide',
      icon: BookOpen,
      color: 'orange'
    }
  ];

  const categories = [
    { id: 'all', name: 'すべてのツール' },
    { id: 'calculation', name: '計算ツール' },
    { id: 'reverse', name: '逆算ツール' },
    { id: 'comparison', name: '比較ツール' },
    { id: 'guide', name: 'ガイド' }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'トップ', url: '/' },
          { name: 'ツール一覧', url: '/tools' }
        ]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* ヒーローセクション */}
          <section className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-800">
              内申点対策ツール集
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              高校入試の内申点対策に必要なツールをすべて揃えました。
              計算から逆算、比較まで、あなたの受験成功をサポートします。
            </p>
          </section>

          {/* カテゴリーフィルター */}
          <section className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </section>

          {/* ツール一覧 */}
          <section className="mb-12">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`rounded-xl bg-${tool.color}-100 p-3`}>
                        <Icon className={`h-6 w-6 text-${tool.color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      ツールを使う
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 使い方ガイド */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-blue-800">
              ツールの使い方ガイド
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">
                  はじめての方へ
                </h3>
                <ol className="space-y-2 text-sm text-blue-600">
                  <li>1. まず「内申点ガイド」で基本を学ぶ</li>
                  <li>2. 「内申点計算ツール」で現在の点数を確認</li>
                  <li>3. 「逆算ツール」で目標を設定</li>
                  <li>4. 「都道府県比較」で進路を検討</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">
                  上級者向け
                </h3>
                <ol className="space-y-2 text-sm text-blue-600">
                  <li>1. 複数の進路候補を比較検討</li>
                  <li>2. 学年ごとの目標点を設定</li>
                  <li>3. 実技と主要教科のバランスを最適化</li>
                  <li>4. 志望校の入試方式に合わせた対策</li>
                </ol>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
