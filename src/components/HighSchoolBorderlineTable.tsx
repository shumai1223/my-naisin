import { 
  Trophy, 
  Target, 
  Info, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { PREFECTURE_HIGH_SCHOOL_DATA } from '@/lib/prefecture-high-school-data';

interface HighSchoolBorderlineTableProps {
  prefectureCode: string;
  prefectureName: string;
}

export function HighSchoolBorderlineTable({ prefectureCode, prefectureName }: HighSchoolBorderlineTableProps) {
  const data = PREFECTURE_HIGH_SCHOOL_DATA[prefectureCode];
  
  if (!data || data.topHighSchools.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Info className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">{prefectureName}の高校データは現在更新中です</h3>
        <p className="mt-2 text-sm text-slate-500">最新の入試結果を元に、順次データを追加しています。しばらくお待ちください。</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* 導入 */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-200">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {prefectureName}主要高校の合格ボーダーライン
          </h2>
        </div>
        
        <p className="text-slate-600 leading-relaxed">
          {prefectureName}の公立高校入試における、主要校の合格目標ライン（ボーダー）の一覧です。
          内申点と当日点のバランスを確認し、志望校選びの参考にしてください。
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-100/50 w-fit px-3 py-1.5 rounded-full">
          <Award className="h-3.5 w-3.5" />
          2026年度（令和8年度）入試結果・追跡調査に基づくデータ
        </div>
      </div>

      {/* テーブル本体 */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">順位</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">高校名・学科</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">目標内申</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">目標当日点</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">出典</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topHighSchools.map((school, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                      school.rank === 1 ? 'bg-amber-100 text-amber-700' :
                      school.rank === 2 ? 'bg-slate-100 text-slate-600' :
                      school.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {school.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{school.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{school.department}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700 border border-emerald-100">
                      <Target className="h-3.5 w-3.5" />
                      {school.avgNaishin}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-black text-blue-700 border border-blue-100">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {school.avgScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
                      {school.source}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 制度解説カード */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
            <Info className="h-5 w-5 text-blue-500" />
            この県の配点ルール
          </h3>
          <ul className="space-y-3">
            {data.rules.uniqueRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-blue-400" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-indigo-900">
            <Target className="h-5 w-5 text-indigo-600" />
            逆転合格のアドバイス
          </h3>
          <div className="text-sm text-indigo-800 leading-relaxed">
            <p>{prefectureName}では、{data.rules.targetGrades}が内申対象となります。</p>
            <p className="mt-2">
              内申点が目標に届かない場合は、当日点でカバーできる「当日点重視」の高校を選ぶ戦略が有効です。
              特に、実技教科の倍率が{data.rules.practicalMultiplier}倍となっているため、副教科の成績アップが最も効率的な逆転方法となります。
            </p>
          </div>
        </div>
      </div>

      {/* 出典と注意書き */}
      <div className="rounded-xl bg-slate-100 p-4 text-[10px] text-slate-500 leading-relaxed font-medium">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="h-3 w-3" />
          データ引用・信頼性について
        </div>
        <p>
          ※本データは、各進学塾の追跡調査結果および教育委員会公開資料を元に、当サイト運営チームが独自に算出した目標値です。
          合格を保証するものではありません。実際の入試難易度は年度ごとの倍率や問題難易度によって変動します。
          最新の募集要項および進路指導の先生によるアドバイスを必ず優先してください。
        </p>
      </div>
    </section>
  );
}
