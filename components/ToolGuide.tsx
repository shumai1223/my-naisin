// ツール説明コンポーネント
import { Info, AlertTriangle, BookOpen, Target } from 'lucide-react';

interface ToolGuideProps {
  prefectureName: string;
  targetGrades: number[];
  maxScore: number;
  practicalMultiplier: number;
}

export function ToolGuide({ prefectureName, targetGrades, maxScore, practicalMultiplier }: ToolGuideProps) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm mb-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
        <BookOpen className="h-5 w-5" />
        {prefectureName}内申点計算ツールの使い方
      </h3>
      
      <div className="space-y-4">
        {/* 基本的な使い方 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Info className="h-4 w-4" />
            基本的な使い方
          </h4>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <ol className="space-y-2 text-sm text-blue-700">
              <li>1. 9教科の評定をそれぞれ入力してください</li>
              <li>2. 自動的に{prefectureName}の計算方式で内申点が算出されます</li>
              <li>3. 満点{maxScore}点に対する割合とランクが表示されます</li>
              <li>4. 必要に応じて評定を調整して目標点を設定できます</li>
            </ol>
          </div>
        </div>

        {/* 注意点 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            {prefectureName}特有の注意点
          </h4>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• 対象学年：{targetGrades.length === 1 ? `中${targetGrades[0]}のみ` : `中${targetGrades.join('・')}`}</li>
              <li>• 満点：{maxScore}点</li>
              <li>• 実技教科：{practicalMultiplier > 1 ? `${practicalMultiplier}倍で計算` : '等倍'}</li>
              <li>• 入試方式によっては異なる計算方法がある場合があります</li>
            </ul>
          </div>
        </div>

        {/* よくある間違い */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            よくある間違い
          </h4>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <ul className="space-y-1 text-sm text-red-700">
              <li>• 中間試験の成績を入力する（期末試験のみ対象）</li>
              <li>• 5段階評価以外の値を入力する（1〜5で入力）</li>
              <li>• 他の県の計算方式で考える（県ごとに異なります）</li>
              <li>• 提出物や授業態度を考慮しすぎる（評定に含まれている場合が多い）</li>
            </ul>
          </div>
        </div>

        {/* 活用方法 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
            <Target className="h-4 w-4" />
            さらなる活用方法
          </h4>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <ul className="space-y-1 text-sm text-green-700">
              <li>• 「逆算ツール」で志望校に必要な当日点を確認</li>
              <li>• 「他県比較」で進学先の計算方式を理解</li>
              <li>• 「成績推移グラフ」で学習効果を可視化</li>
              <li>• 「目標設定機能」で具体的な学習プランを立てる</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
