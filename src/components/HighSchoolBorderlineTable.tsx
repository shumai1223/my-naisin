import { Info } from '@/components/icons';
import { classifyHighSchoolSourceTier, PREFECTURE_HIGH_SCHOOL_DATA } from '@/lib/prefecture-high-school-data';

interface HighSchoolBorderlineTableProps {
  prefectureCode: string;
  prefectureName: string;
}

export function HighSchoolBorderlineTable({ prefectureCode, prefectureName }: HighSchoolBorderlineTableProps) {
  const data = PREFECTURE_HIGH_SCHOOL_DATA[prefectureCode];

  if (!data || data.topHighSchools.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <h3 className="text-[17px] font-bold text-slate-900">{prefectureName}の高校データは現在更新中です</h3>
        <p className="mt-2 text-sm text-slate-600">最新の入試結果を元に、順次データを追加しています。しばらくお待ちください。</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* 導入（見出し→メタ行→結論の段落） */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {prefectureName}主要高校の合格ボーダーライン
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          2026年度（令和8年度）入試結果・追跡調査に基づくデータ
        </p>
        <p className="mt-3 text-base leading-[1.8] text-slate-900">
          {prefectureName}の公立高校入試における、主要校の合格目標ライン（ボーダー）の一覧です。
          内申点と当日点のバランスを確認し、志望校選びの参考にしてください。
        </p>
      </div>

      {/* 出典バッジはスマホ幅(390px)だと横スクロールしないと見えない列にある。
          2026-08-08 Cowork実地監査: 数字だけ見えて「非公式・参考情報」の但し書きが
          隠れるのは最悪の並びと指摘されたため、表の直上に独立した1行として常時表示する。 */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        以下の数値は塾・受験情報サイトの推定です（教育委員会の公表値ではありません）
      </div>

      {/* テーブル本体 */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-900">
                <th className="px-4 py-3 text-xs font-bold text-slate-600">順位</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600">高校名・学科</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600">目標内申</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600">目標当日点</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600">出典</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.topHighSchools.map((school, i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold tabular-nums text-slate-900">
                    {school.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{school.name}</div>
                    <div className="text-xs text-slate-600">{school.department}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                    {school.avgNaishin}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                    {school.avgScore}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <div className="inline-block rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                        {school.source}
                      </div>
                      {classifyHighSchoolSourceTier(school.source) === 'secondary' && (
                        <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900">
                          非公式・参考情報
                        </span>
                      )}
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
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-[17px] font-bold text-slate-900">
            この県の配点ルール
          </h3>
          <ul className="space-y-2">
            {data.rules.uniqueRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-slate-900">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
          <h3 className="mb-3 text-[17px] font-bold text-slate-900">
            内申点が足りない場合のアドバイス
          </h3>
          <div className="text-sm leading-relaxed text-slate-900">
            <p>{prefectureName}では、{data.rules.targetGrades}が内申対象となります。</p>
            <p className="mt-2">
              内申点が目標に届かない場合は、当日点でカバーできる「当日点重視」の高校を選ぶ戦略が有効です。
              特に、実技教科の倍率が{data.rules.practicalMultiplier}倍となっているため、副教科の成績アップが有効な方法の一つとなります。
            </p>
          </div>
        </div>
      </div>

      {/* 出典と注意書き */}
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-relaxed text-slate-600">
        <div className="mb-2 font-bold text-slate-900">
          データ引用・信頼性について
        </div>
        <p>
          ※本データは、各進学塾・受験情報サイトが公開する追跡調査結果（表内「非公式・参考情報」表示のとおり、
          教育委員会が公表する一次資料そのものではありません）を元に、当サイト運営チームが独自に算出した目標値です。
          合格を保証するものではありません。実際の入試難易度は年度ごとの倍率や問題難易度によって変動します。
          最新の募集要項および進路指導の先生によるアドバイスを必ず優先してください。
        </p>
      </div>
    </section>
  );
}
