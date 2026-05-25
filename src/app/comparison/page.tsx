'use client';

import { useState } from 'react';
import { ArrowUpDown, MapPin, TrendingUp, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';

export default function ComparisonPage() {
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'basic' | 'detailed'>('basic');

  const prefectures = PREFECTURES;
  
  const selectedPrefectureData = selectedPrefectures
    .map(code => getPrefectureByCode(code))
    .filter((prefecture): prefecture is NonNullable<typeof prefecture> => prefecture !== undefined);

  const togglePrefecture = (code: string) => {
    setSelectedPrefectures(prev => 
      prev.includes(code) 
        ? prev.filter(p => p !== code)
        : [...prev, code].slice(0, 4) // 最大4県まで比較
    );
  };

  const clearSelection = () => {
    setSelectedPrefectures([]);
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'トップ', url: '/' },
          { name: '都道府県比較', url: '/comparison' }
        ]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* ヒーローセクション */}
          <section className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-800">
              都道府県内申点制度比較
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              進学先の候補となる都道府県の内申点制度を比較・検討。
              あなたに合った進路選択をサポートします。
            </p>
          </section>

          {/* 都道府県選択 */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              比較したい都道府県を選択（最大4県）
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {prefectures.map(prefecture => (
                <button
                  key={prefecture.code}
                  onClick={() => togglePrefecture(prefecture.code)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedPrefectures.includes(prefecture.code)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{prefecture.name}</h3>
                      <p className="text-sm text-slate-600">{prefecture.maxScore}点満点</p>
                    </div>
                    {selectedPrefectures.includes(prefecture.code) && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {selectedPrefectures.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {selectedPrefectures.length}県を選択中
                </p>
                <button
                  onClick={clearSelection}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  選択をクリア
                </button>
              </div>
            )}
          </section>

          {/* 高インテント志望校層への PR: 比較着手時に表示 */}
          {selectedPrefectureData.length >= 2 && (
            <section className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 shadow-sm">
              <div className="text-center">
                <div className="mb-2 text-sm font-bold text-slate-800">
                  進学先の選択肢を比べているなら、いまの実力チェックも
                </div>
                <div className="mb-3 text-xs text-slate-600">
                  複数県の制度を比較するレベルの志望校検討なら、難関校受験対策に強い通信教育で実力を伸ばす選択肢があります。
                </div>
                <div className="text-sm">
                  <AffiliateAd id="zkai-text-advanced" hideLabel />（PR）／
                  <AffiliateAd id="zkai-text-request" hideLabel />（PR）
                </div>
              </div>
            </section>
          )}

          {/* 比較結果 */}
          {selectedPrefectureData.length >= 2 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">比較結果</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setComparisonMode('basic')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      comparisonMode === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    基本比較
                  </button>
                  <button
                    onClick={() => setComparisonMode('detailed')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      comparisonMode === 'detailed'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    詳細比較
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full rounded-lg border border-slate-200 bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        項目
                      </th>
                      {selectedPrefectureData.map(prefecture => (
                        <th key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                          {prefecture.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 基本情報 */}
                    <tr className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                        満点
                      </td>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                          {prefecture.maxScore}点
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                        対象学年
                      </td>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                          中{prefecture.targetGrades.join('・')}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                        実技倍率
                      </td>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                          {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                        </td>
                      ))}
                    </tr>

                    {comparisonMode === 'detailed' && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                            主要教科倍率
                          </td>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                              {prefecture.coreMultiplier > 1 ? `${prefecture.coreMultiplier}倍` : '等倍'}
                            </td>
                          ))}
                        </tr>
                        
                        <tr className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                            学年倍率
                          </td>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                              {Object.entries(prefecture.gradeMultipliers)
                                .filter(([_, multiplier]) => multiplier > 0)
                                .map(([grade, multiplier]) => `中${grade}×${multiplier}`)
                                .join(', ') || '-'}
                            </td>
                          ))}
                        </tr>
                        
                        <tr className="hover:bg-slate-50">
                          <td className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                            地域
                          </td>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="border-b border-slate-200 px-4 py-3 text-center text-sm">
                              {prefecture.region}
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* アクション */}
          {selectedPrefectureData.length >= 2 && (
            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-4 text-lg font-bold text-blue-800">
                次のアクション
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedPrefectureData.map(prefecture => (
                  <Link
                    key={prefecture.code}
                    href={`/${prefecture.code}/naishin`}
                    className="rounded-lg border border-blue-200 bg-white p-4 transition-colors hover:bg-blue-50"
                  >
                    <h4 className="font-semibold text-blue-800">{prefecture.name}の詳細</h4>
                    <p className="mt-1 text-sm text-blue-600">
                      内申点計算ツールで具体的な点数を確認
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 使い方ガイド */}
          {selectedPrefectureData.length === 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Info className="h-5 w-5" />
                使い方ガイド
              </h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>1. 比較したい都道府県を最大4県まで選択</li>
                <li>2. 「基本比較」または「詳細比較」モードを選択</li>
                <li>3. 満点、対象学年、実技倍率などを比較</li>
                <li>4. 気になる都道府県の詳細ページで計算</li>
              </ol>
            </section>
          )}

          {/* ページ末尾の広告：教材・個別指導の選択肢 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-800">受験準備の学習リソース</h3>
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  地域ごとの内申制度の違いを把握したら、次は実際の学習に進みましょう。映像授業のスタディサプリは全教科の単元別講義で苦手を集中対策、ネット松陰塾は自宅でマンツーマンの個別指導が受けられます。
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <AffiliateAd id="shoin-banner" centered={false} />
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <AffiliateAd id="sapuri-banner-468" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
