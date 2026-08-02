import Link from 'next/link';
import { BookOpen, ExternalLink, ChevronRight } from 'lucide-react';

import type { PrefectureConfig } from '@/lib/prefectures';

interface SchoolPageNaishinNoteProps {
  schoolName: string;
  prefecture: PrefectureConfig;
}

/**
 * 学校ページ（Λ-2）の「学校名 内申点」検索意図に本文で応える節＝主食②-3。
 *
 * 学校別のボーダー推定は永久にしない（Y-0）ため、答えるのは「学校固有の推定内申点」ではなく
 * 「その学校を受けるなら従うことになる、県の内申点制度の要点」。prefectures.ts の
 * 検証済みデータ（満点・対象学年・学年比重・出典）のみを使い、捏造ゼロを維持する。
 *
 * 同一県内の学校ページ間でこの節の本文はほぼ共通になる（県の制度は1つのため）。
 * ページの主役はあくまで学校固有の倍率（上部のセクション）で、この節はその補助情報という
 * 位置づけに留め、FAQ/罠解説等の重量コンテンツ（PrefectureMinimumContent）は複製しない
 * （3,500ページ規模でのスケールドコンテンツ判定リスクを避けるため）。
 */
export function SchoolPageNaishinNote({ schoolName, prefecture }: SchoolPageNaishinNoteProps) {
  const gradeLabel =
    prefecture.targetGrades.length === 1
      ? `中${prefecture.targetGrades[0]}のみ`
      : `中${prefecture.targetGrades.join('・')}`;

  const multiplierEntries = prefecture.targetGrades.map((g) => [g, prefecture.gradeMultipliers[g] ?? 1] as const);
  const hasVaryingMultipliers = new Set(multiplierEntries.map(([, m]) => m)).size > 1;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-800">
        <BookOpen className="h-5 w-5 shrink-0 text-blue-500" />
        {schoolName}を目指す場合の内申点のしくみ
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        {prefecture.name}の公立高校は、どの学校を受けるかにかかわらず県内共通の方式で内申点を計算します。
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">対象学年</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{gradeLabel}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">内申点の満点</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{prefecture.maxScore}点</div>
        </div>
      </div>

      {hasVaryingMultipliers && (
        <div className="mt-3 rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">学年別の比重</div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
            {multiplierEntries.map(([grade, mult]) => (
              <span key={grade}>
                中{grade}: ×{mult}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{prefecture.description}</p>

      <Link
        href={`/${prefecture.code}/naishin`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
      >
        {prefecture.name}の内申点を計算する
        <ChevronRight className="h-4 w-4 shrink-0" />
      </Link>

      {prefecture.sourceUrl && (
        <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-400">
          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
          出典:{' '}
          <a href={prefecture.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
            {prefecture.sourceTitle ?? `${prefecture.name}教育委員会`}
          </a>
          {prefecture.lastVerified && `（最終確認: ${prefecture.lastVerified}）`}
        </p>
      )}
    </section>
  );
}
