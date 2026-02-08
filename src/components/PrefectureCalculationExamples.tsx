'use client';

import { generatePrefectureExamples, generateDetailedCalculation } from '@/lib/prefecture-examples';

interface PrefectureCalculationExamplesProps {
  prefectureCode: string;
}

export function PrefectureCalculationExamples({ prefectureCode }: PrefectureCalculationExamplesProps) {
  const examples = generatePrefectureExamples(prefectureCode);
  const detailed = generateDetailedCalculation(prefectureCode);

  if (!examples || !detailed) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-800">計算例</h3>
      
      {/* 簡単な計算例 */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-semibold text-blue-800">オール3の場合</h4>
          <div className="text-2xl font-bold text-blue-600">{examples.all3.display}</div>
          <div className="mt-1 text-sm text-blue-600">{examples.all3.percent}%</div>
        </div>
        
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="mb-2 font-semibold text-emerald-800">オール4の場合</h4>
          <div className="text-2xl font-bold text-emerald-600">{examples.all4.display}</div>
          <div className="mt-1 text-sm text-emerald-600">{examples.all4.percent}%</div>
        </div>
      </div>

      {/* 詳細な計算過程 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h4 className="mb-3 font-semibold text-amber-800">詳細な計算過程</h4>
        <div className="space-y-3">
          {detailed.breakdown.map((item, index) => (
            <div key={index} className="border-l-4 border-amber-400 pl-4">
              <div className="mb-2 font-medium text-amber-700">
                中{item.grade}年生（倍率: {item.multiplier}倍）
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>オール3: 5教科={item.all3.core}点 + 実技4教科={item.all3.practical}点 = {item.all3.total}点</span>
                </div>
                <div className="flex justify-between">
                  <span>オール4: 5教科={item.all4.core}点 + 実技4教科={item.all4.practical}点 = {item.all4.total}点</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t-2 border-amber-300 pt-3">
            <div className="font-semibold text-amber-800">
              合計: オール3={examples.all3.total}点 / オール4={examples.all4.total}点（{detailed.prefecture.maxScore}点満点）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
