'use client';

/**
 * 塾ダッシュボードの内申点シミュレーター（Λ-8・Ω-8実行層・build-not-launch）。
 * 生徒の9教科評定を入力し、志望県を複数選んで内申点を横並び比較する。
 *
 * 独自の採点ロジックは一切持たない（捏造ゼロ）。既存の47都道府県計算エンジン
 * （calculateTotalScore等・juku-student-progress.tsのrecomputeNaishinForPrefectures経由）を
 * そのまま呼ぶだけ＝ホームページの計算機・API・MCPと常に同じ結果になる。
 * D1には触れない（保存済みスナップショットとは独立した「今すぐ試す」用の一時計算）。
 */
import { useMemo, useState } from 'react';
import { InputForm } from '@/components/Calculator/InputForm';
import { PREFECTURES } from '@/lib/prefectures';
import { DEFAULT_SCORES } from '@/lib/constants';
import type { Scores, SubjectKey } from '@/lib/types';
import { recomputeNaishinForPrefectures } from '@/lib/juku-student-progress';

const DEFAULT_SELECTED_CODES = ['tokyo', 'kanagawa', 'saitama', 'chiba'];

export function NaishinSimulator() {
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(DEFAULT_SELECTED_CODES);

  const handleScoreChange = (key: SubjectKey, nextValue: number) => {
    setScores((prev) => ({ ...prev, [key]: nextValue }));
  };

  const toggleCode = (code: string) => {
    setSelectedCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const results = useMemo(() => recomputeNaishinForPrefectures(scores, selectedCodes), [scores, selectedCodes]);
  // InputFormは表示用に単一のprefectureCodeを取るため参考表示にのみ使う
  // （実際の計算結果はresultsが県ごとに正しく個別算出する。表示バッジのみの影響）。
  const referenceCode = selectedCodes[0] ?? 'tokyo';

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-700">9教科の評定を入力</h2>
        <InputForm prefectureCode={referenceCode} scores={scores} onChange={handleScoreChange} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-700">比較する都道府県を選択（{selectedCodes.length}件）</h2>
        <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
          {PREFECTURES.map((p) => (
            <label key={p.code} className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedCodes.includes(p.code)}
                onChange={() => toggleCode(p.code)}
                className="h-3.5 w-3.5"
              />
              {p.name}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-700">内申点シミュレーション結果</h2>
        {results.length === 0 ? (
          <p className="text-sm text-slate-400">都道府県を1つ以上選んでください。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4">都道府県</th>
                  <th className="py-2 pr-4 text-right">内申点</th>
                  <th className="py-2 pr-4 text-right">満点</th>
                  <th className="py-2 text-right">割合</th>
                </tr>
              </thead>
              <tbody>
                {results
                  .slice()
                  .sort((a, b) => b.percent - a.percent)
                  .map((r) => (
                    <tr key={r.code} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-700">{r.name}</td>
                      <td className="py-2 pr-4 text-right text-slate-600">{r.total}</td>
                      <td className="py-2 pr-4 text-right text-slate-600">{r.max}</td>
                      <td className="py-2 text-right font-semibold text-slate-700">{r.percent}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
