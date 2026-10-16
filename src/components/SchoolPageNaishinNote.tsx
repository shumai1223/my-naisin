import Link from 'next/link';
import { ChevronRight } from '@/components/icons';

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
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">{schoolName}を目指す場合の内申点のしくみ</h2>
      <p className="mt-2 text-sm leading-[1.7] text-slate-600">
        {prefecture.name}の公立高校は、どの学校を受けるかにかかわらず県内共通の方式で内申点を計算します。
      </p>

      <dl className="mt-4 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="px-4 py-3">
          <dt className="text-xs text-slate-600">対象学年</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{gradeLabel}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-xs text-slate-600">内申点の満点</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{prefecture.maxScore}点</dd>
        </div>
      </dl>

      {hasVaryingMultipliers && (
        <dl className="border-b border-slate-200 px-4 py-3">
          <dt className="text-xs text-slate-600">学年別の比重</dt>
          <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-base font-bold tabular-nums text-slate-900">
            {multiplierEntries.map(([grade, mult]) => (
              <span key={grade}>
                中{grade}: ×{mult}
              </span>
            ))}
          </dd>
        </dl>
      )}

      <p className="mt-4 text-base leading-[1.8] text-slate-900">{prefecture.description}</p>

      <Link
        href={`/${prefecture.code}/naishin`}
        className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-base font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
      >
        {prefecture.name}の内申点を計算する
        <ChevronRight className="h-4 w-4 shrink-0" />
      </Link>

      {prefecture.sourceUrl && (
        <p className="mt-2 border-t border-slate-200 pt-3 text-sm text-slate-600">
          出典:{' '}
          <a
            href={prefecture.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            {prefecture.sourceTitle ?? `${prefecture.name}教育委員会`}
          </a>
          {prefecture.lastVerified && `（最終確認: ${prefecture.lastVerified}）`}
        </p>
      )}
    </section>
  );
}
