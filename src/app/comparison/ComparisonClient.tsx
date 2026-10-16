'use client';

import { useState } from 'react';
import { CheckCircle, ChevronRight, Home } from '@/components/icons';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';

export default function ComparisonClient() {
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* パンくず */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">都道府県比較</span>
          </nav>

          {/* ページの頭 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              都道府県内申点制度比較
            </h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              進学先の候補となる都道府県の内申点制度を比較・検討。
              あなたに合った進路選択をサポートします。
            </p>
          </header>

          {/* 都道府県選択 */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              比較したい都道府県を選択（最大4県）
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {prefectures.map(prefecture => (
                <button
                  key={prefecture.code}
                  onClick={() => togglePrefecture(prefecture.code)}
                  aria-pressed={selectedPrefectures.includes(prefecture.code)}
                  className={`min-h-[44px] rounded border p-3 text-left transition-colors ${
                    selectedPrefectures.includes(prefecture.code)
                      ? 'border-brand-700 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>
                      <span className="block font-bold text-slate-900">{prefecture.name}</span>
                      <span className="block text-sm text-slate-600">{prefecture.maxScore}点満点</span>
                    </span>
                    {selectedPrefectures.includes(prefecture.code) && (
                      <CheckCircle className="h-5 w-5 shrink-0 text-brand-700" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {selectedPrefectures.length > 0 && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  {selectedPrefectures.length}県を選択中
                </p>
                <button
                  onClick={clearSelection}
                  className="min-h-[44px] rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
                >
                  選択をクリア
                </button>
              </div>
            )}
          </section>

          {/* 高インテント志望校層への PR: 比較着手時に表示 */}

          {/* 比較結果 */}
          {selectedPrefectureData.length >= 2 && (
            <section className="mb-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">比較結果</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setComparisonMode('basic')}
                    aria-pressed={comparisonMode === 'basic'}
                    className={`min-h-[44px] rounded border px-4 py-2 text-sm font-bold transition-colors ${
                      comparisonMode === 'basic'
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    基本比較
                  </button>
                  <button
                    onClick={() => setComparisonMode('detailed')}
                    aria-pressed={comparisonMode === 'detailed'}
                    className={`min-h-[44px] rounded border px-4 py-2 text-sm font-bold transition-colors ${
                      comparisonMode === 'detailed'
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    詳細比較
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-900">
                        項目
                      </th>
                      {selectedPrefectureData.map(prefecture => (
                        <th key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-slate-900">
                          {prefecture.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* 基本情報 */}
                    <tr>
                      <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                        満点
                      </th>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-900">
                          {prefecture.maxScore}点
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                        対象学年
                      </th>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-900">
                          中{prefecture.targetGrades.join('・')}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                        実技倍率
                      </th>
                      {selectedPrefectureData.map(prefecture => (
                        <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-900">
                          {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                        </td>
                      ))}
                    </tr>

                    {comparisonMode === 'detailed' && (
                      <>
                        <tr>
                          <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                            主要教科倍率
                          </th>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-900">
                              {prefecture.coreMultiplier > 1 ? `${prefecture.coreMultiplier}倍` : '等倍'}
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                            学年倍率
                          </th>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-slate-900">
                              {Object.entries(prefecture.gradeMultipliers)
                                .filter(([_, multiplier]) => multiplier > 0)
                                .map(([grade, multiplier]) => `中${grade}×${multiplier}`)
                                .join(', ') || '-'}
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <th scope="row" className="whitespace-nowrap px-4 py-3 text-left text-sm font-bold text-slate-600">
                            地域
                          </th>
                          {selectedPrefectureData.map(prefecture => (
                            <td key={prefecture.code} className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-900">
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
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                次のアクション
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedPrefectureData.map(prefecture => (
                  <Link
                    key={prefecture.code}
                    href={`/${prefecture.code}/naishin`}
                    className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-brand-50"
                  >
                    <h3 className="text-[17px] font-bold text-brand-700 underline underline-offset-2">{prefecture.name}の詳細</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      内申点計算ツールで具体的な点数を確認
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 使い方ガイド */}
          {selectedPrefectureData.length === 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                使い方ガイド
              </h2>
              <ol className="space-y-2 text-base leading-[1.8] text-slate-900">
                <li>1. 比較したい都道府県を最大4県まで選択</li>
                <li>2. 「基本比較」または「詳細比較」モードを選択</li>
                <li>3. 満点、対象学年、実技倍率などを比較</li>
                <li>4. 気になる都道府県の詳細ページで計算</li>
              </ol>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
