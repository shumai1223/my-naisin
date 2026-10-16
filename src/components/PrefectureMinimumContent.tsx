import { ExternalLink } from '@/components/icons';
import { getPrefectureByCode } from '@/lib/prefectures';
import { getPrefectureTraps } from '@/lib/prefecture-traps';
import { PREFECTURE_SOURCES } from '@/lib/prefecture-sources';
import { getPrefectureGuide, generateDynamicFAQ, VERIFIED_PITFALLS_PREFECTURE_CODES } from '@/lib/prefecture-guides';
import { TrustInfo } from '@/components/TrustInfo';

interface PrefectureMinimumContentProps {
  prefectureCode: string;
}

export function PrefectureMinimumContent({ prefectureCode }: PrefectureMinimumContentProps) {
  const prefecture = getPrefectureByCode(prefectureCode);

  if (!prefecture) return null;
  const officialUrl = getPrefectureOfficialUrl(prefectureCode);

  // 計算例のパターン（実際の計算ロジックを使用）
  const calculateExampleScore = (grade: number) => {
    let total = 0;
    for (const gradeNum of prefecture.targetGrades) {
      const multiplier = prefecture.gradeMultipliers[gradeNum] || 1;
      // 主要5教科の素点
      const coreRawScore = 5 * grade * prefecture.coreMultiplier;
      // 実技4教科の素点
      const practicalRawScore = 4 * grade * prefecture.practicalMultiplier;
      // 学年倍率を適用
      const gradeWeightedScore = (coreRawScore + practicalRawScore) * multiplier;
      total += gradeWeightedScore;
    }
    return Math.round(total);
  };

  const calculationExamples = [
    {
      title: 'オール3の場合',
      description: `対象学年すべてが評定3の場合の内申点`,
      score: calculateExampleScore(3),
      improvement: '主要5教科を4に上げることで向上'
    },
    {
      title: 'オール4の場合',
      description: `対象学年すべてが評定4の場合の内申点`,
      score: calculateExampleScore(4),
      improvement: '主要5教科を5に上げることで向上'
    }
  ];

  // 県別の罠（2026-08-01: 手動キュレーション(topicタグ付き分のみ)を優先し、動的生成で補完する。
  // 詳細はgetPrefectureTraps(prefecture-traps.ts)のコメント参照。
  const traps = getPrefectureTraps(prefecture);

  // 詳細な根拠データ
  const sources = PREFECTURE_SOURCES[prefectureCode as keyof typeof PREFECTURE_SOURCES] || [];

  // FAQ（動的生成を優先）
  const guide = getPrefectureGuide(prefectureCode);
  const dynamicFAQ = generateDynamicFAQ(prefectureCode, prefecture);
  const faq = dynamicFAQ; // 常に動的生成を使用

  // 詳しい解説（2026-08-01: 事実確認済みの県のみ表示。prefecture-guides.tsのコメント参照）。
  const showPitfallsGuide = VERIFIED_PITFALLS_PREFECTURE_CODES.has(prefectureCode);

  return (
    <>
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h3 className="mb-3 text-[17px] font-bold text-slate-900">
            {prefecture.name}の基本情報
          </h3>

          <dl className="grid gap-x-8 border-t border-slate-200 md:grid-cols-2">
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
              <dt className="text-sm text-slate-600">対象学年</dt>
              <dd className="text-right text-base font-bold tabular-nums text-slate-900">
                {prefecture.targetGrades.length === 1
                  ? `中${prefecture.targetGrades[0]}のみ`
                  : `中${prefecture.targetGrades.join('・')}`}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
              <dt className="text-sm text-slate-600">全教科係数</dt>
              <dd className="text-right text-base font-bold tabular-nums text-slate-900">
                {prefecture.coreMultiplier > 1
                  ? `×${prefecture.coreMultiplier}倍`
                  : '等倍'}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
              <dt className="text-sm text-slate-600">実技傾斜</dt>
              <dd className="text-right text-base font-bold tabular-nums text-slate-900">
                {prefecture.practicalMultiplier > prefecture.coreMultiplier
                  ? `あり（${prefecture.practicalMultiplier}倍）`
                  : 'なし'}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
              <dt className="text-sm text-slate-600">満点</dt>
              <dd className="text-right text-base font-bold tabular-nums text-slate-900">{prefecture.maxScore}点</dd>
            </div>
          </dl>
        </div>

        {/* 計算例 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h3 className="mb-3 text-[17px] font-bold text-slate-900">
            計算例
          </h3>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {calculationExamples.map((example, index) => (
              <div key={index} className="py-4">
                <h4 className="text-base font-bold text-slate-900">{example.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{example.description}</p>
                <p className="mt-2 text-xl font-bold tabular-nums text-brand-700">{example.score}点 / {prefecture.maxScore}点満点</p>
                <p className="mt-2 text-sm text-slate-600">{example.improvement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* この県の罠 */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 md:p-6">
          <h3 className="mb-3 text-[17px] font-bold text-amber-900">
            {prefecture.name}の注意点
          </h3>

          <ul className="divide-y divide-amber-200">
            {traps.map((trap, index) => (
              <li key={index} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-amber-900">{trap.title}</h4>
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${
                      trap.impact === 'high'
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : trap.impact === 'medium'
                          ? 'border-amber-300 bg-white text-amber-900'
                          : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {trap.impact === 'high' ? '影響度 大' : trap.impact === 'medium' ? '影響度 中' : '影響度 小'}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-[1.8] text-amber-900">{trap.description}</p>
                <p className="mt-2 text-sm leading-[1.8] text-amber-900">
                  <strong>対策：</strong>{trap.solution}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 詳しい解説（事実確認済みの県のみ・prefecture-guides.tsのpitfalls） */}
        {showPitfallsGuide && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">
              {guide.pitfalls.title}
            </h3>
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {guide.pitfalls.items.map((item, index) => (
                <li
                  key={index}
                  className="py-3 text-base leading-[1.8] text-slate-900"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </ul>
          </div>
        )}

        {/* FAQ */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h3 className="mb-3 text-[17px] font-bold text-slate-900">
            よくある質問
          </h3>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((item, index) => (
              <div key={index} className="py-4">
                <h4 className="text-base font-bold text-slate-900">{item.question}</h4>
                <p className="mt-2 text-base leading-[1.8] text-slate-900">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {sources.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">
              公式資料（根拠）
            </h3>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 hover:bg-brand-100"
                >
                  <div className="flex items-start gap-3">
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-brand-700 underline underline-offset-2">{source.pdfTitle}</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-slate-900">
                          <strong>該当箇所：</strong>{source.pageNumber}「{source.sectionName}」
                        </p>
                        <p className="text-sm text-slate-600">{source.description}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">最終確認: {source.lastChecked}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 信頼性情報 */}
        <TrustInfo
          sources={sources.map(source => ({
            name: source.pdfTitle || `${prefecture.name}教育委員会`,
            url: source.sourceUrl,
            lastVerified: source.lastChecked,
            description: `${source.pageNumber}「${source.sectionName}」`
          }))}
          lastUpdated={new Date().toLocaleDateString('ja-JP')}
          prefectureName={prefecture.name}
        />
      </div>
    </>
  );
}

function getPrefectureOfficialUrl(code: string): string {
  const urls: Record<string, string> = {
    tokyo: 'https://www.kyoiku.metro.tokyo.lg.jp/',
    kanagawa: 'https://www.pref.kanagawa.jp/',
    osaka: 'https://www.pref.osaka.lg.jp/',
    aichi: 'https://www.pref.aichi.jp/',
    fukuoka: 'https://www.pref.fukuoka.lg.jp/',
    hokkaido: 'https://www.pref.hokkaido.lg.jp/',
  };
  return urls[code] || 'https://www.mext.go.jp/';
}
