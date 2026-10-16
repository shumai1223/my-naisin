// ツール説明コンポーネント
import { AlertTriangle } from '@/components/icons';

interface ToolGuideProps {
  prefectureName: string;
  targetGrades: number[];
  maxScore: number;
  practicalMultiplier: number;
}

export function ToolGuide({ prefectureName, targetGrades, maxScore, practicalMultiplier }: ToolGuideProps) {
  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="text-[17px] font-bold text-slate-900">
        {prefectureName}内申点計算ツールの使い方
      </h3>

      <div className="mt-4 divide-y divide-slate-200">
        {/* 基本的な使い方 */}
        <div className="pb-5">
          <h4 className="mb-2 text-sm font-bold text-slate-900">基本的な使い方</h4>
          <ol className="space-y-1 text-base leading-[1.8] text-slate-900">
            <li>1. 9教科の評定をそれぞれ入力してください</li>
            <li>2. 自動的に{prefectureName}の計算方式で内申点が算出されます</li>
            <li>3. 満点{maxScore}点に対する割合とランクが表示されます</li>
            <li>4. 必要に応じて評定を調整して目標点を設定できます</li>
          </ol>
        </div>

        {/* 注意点 */}
        <div className="py-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            {prefectureName}特有の注意点
          </h4>
          <ul className="space-y-1 text-base leading-[1.8] text-slate-900">
            <li>• 対象学年：{targetGrades.length === 1 ? `中${targetGrades[0]}のみ` : `中${targetGrades.join('・')}`}</li>
            <li>• 満点：{maxScore}点</li>
            <li>• 実技教科：{practicalMultiplier > 1 ? `${practicalMultiplier}倍で計算` : '等倍'}</li>
            <li>• 入試方式によっては異なる計算方法がある場合があります</li>
          </ul>
        </div>

        {/* よくある間違い */}
        <div className="py-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            よくある間違い
          </h4>
          <ul className="space-y-1 text-base leading-[1.8] text-slate-900">
            <li>• 中間試験の成績を入力する場合があります（学校・地域によります）</li>
            <li>• 5段階評価以外の値を入力する（1〜5で入力）</li>
            <li>• 他の県の計算方式で考える（県ごとに異なります）</li>
            <li>• 提出物や授業態度を考慮しすぎる（評定に含まれている場合が多い）</li>
          </ul>
        </div>

        {/* 活用方法 */}
        <div className="pt-5">
          <h4 className="mb-2 text-sm font-bold text-slate-900">さらなる活用方法</h4>
          <ul className="space-y-1 text-base leading-[1.8] text-slate-900">
            <li>• 「逆算ツール」で志望校に必要な当日点を確認</li>
            <li>• 「他県比較」で進学先の計算方式を理解</li>
            <li>• 「成績推移グラフ」で学習効果を可視化</li>
            <li>• 「目標設定機能」で具体的な学習プランを立てる</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
