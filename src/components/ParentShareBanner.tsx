'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Inbox, Target, Check, TrendingUp } from '@/components/icons';

import { EVENTS, track } from '@/lib/track';
import { beaconParentFunnelEvent } from '@/lib/parent-funnel-beacon';
import { parseParentShare, encodeSharePayload } from '@/lib/share';

/**
 * 橋②バトンの受け手側（決裁者＝保護者の着地ヒーロー）。
 *
 * 生徒が結果ページから共有した文脈付きリンク（/hogosha?from=share&...）で保護者が着地したとき、
 * 「お子さまの結果が届きました」を保護者の言葉で提示し、直下の保護者向けオファー（資料請求/無料体験）へ橋渡しする。
 * マウント時に parent_landing_view を一度だけ送り、ファネル（share_to_parent → parent_landing_view → affiliate_click → lead_submit）を閉じる。
 *
 * useSearchParams をこのコンポーネント内に閉じ込め、/hogosha は静的（SSG）のまま維持する。
 * 呼び出し側で <Suspense fallback={null}> に包むこと（Next 15 の要件）。
 *
 * TIER Σ-2（2026-08-02）: 「①子の結果 ②この点数の意味（全国/県内位置） ③次にやること ④費用の現実」の
 * ②が抜けていた（share.percentile/percentileScopeはshare.tsのペイロードに元々存在するが、この
 * コンポーネントは描画していなかった＝送り手側（SaveResultCTA経由）で計測済みのk-匿名性ガード後の
 * 実測値をそのまま転記するだけで新たな計算はしない・捏造ゼロ）。値が無い（未計測/n不足）ときは
 * セクションごと出さない。
 *
 * TIER Σ-5（2026-08-02）: 「親はあとで見る」を前提に、送信(sentAt)から着地までの経過時間を
 * D1へ記録する（即時CVだけ見ていると保護者導線の価値を過小評価するため）。sentAtは共有リンク生成時
 * （ParentShareLinkButton/ParentShareInvite）にDate.now()で埋め込まれる。古い共有リンク（sentAt無し）
 * は経過時間なしでイベントのみ記録する（後方互換）。
 */
export function ParentShareBanner() {
  const sp = useSearchParams();

  const share = React.useMemo(() => {
    const raw: Record<string, string> = {};
    sp.forEach((value, key) => {
      raw[key] = value;
    });
    return parseParentShare(raw);
  }, [sp]);

  React.useEffect(() => {
    if (!share.isShare) return;
    const hoursSinceSent =
      typeof share.sentAt === 'number' ? Math.max(0, (Date.now() - share.sentAt) / 3_600_000) : undefined;
    track(EVENTS.PARENT_LANDING_VIEW, {
      pref: share.prefectureCode ?? 'none',
      metric: share.metricLabel ?? '内申点',
      has_target: typeof share.target === 'number',
      ...(typeof share.gap === 'number' ? { gap: share.gap } : {}),
      ...(hoursSinceSent !== undefined ? { hours_since_sent: Math.round(hoursSinceSent) } : {}),
    });
    beaconParentFunnelEvent('parent_landing_view', { prefectureCode: share.prefectureCode, hoursSinceSent });
    // 着地時点で一度だけ。share は query 由来で実質不変なので二重発火しない。
  }, [share]);

  if (!share.isShare) return null;

  const { prefectureName, score, max, target, gap, label, grade, percentile, percentileScope } = share;
  const hasScore = typeof score === 'number';
  const hasGap = typeof gap === 'number';
  const met = hasGap && (gap as number) <= 0;
  const targetWord = label || '目標';
  const metric = share.metricLabel || '内申点';
  const gradeLead = typeof grade === 'number' ? `中${grade}の今からなら、まだ十分に間に合います。` : '';
  const hasPercentile = typeof percentile === 'number';
  const percentileScopeLabel = percentileScope === 'prefecture' ? (prefectureName ? `${prefectureName}内` : '県内') : '全国';

  // お子さまが共有した成績レポート画像（/api/card）。サーバー生成SVGなので確実に表示できる。
  // 2026-08-02（TIER Σ-4）: 満点の無い指標（偏差値等・maxが届かない共有経路）で「45」を
  // 決め打ちしていたのは捏造リスク（例: 偏差値68を「68/45」と誤表示しかねない）。
  // maxが実際に届いた場合のみカード画像を生成し、無ければ上のプレーンな数値表示のみに留める。
  const hasMax = typeof max === 'number';
  const cardSrc =
    hasScore && hasMax
      ? `/api/card?d=${encodeURIComponent(
          encodeSharePayload({
            score: score as number,
            max: max as number,
            target: typeof target === 'number' ? target : null,
            gap: typeof gap === 'number' ? gap : null,
            prefectureCode: share.prefectureCode,
            prefectureName,
            grade: typeof grade === 'number' ? grade : null,
            label,
            metricLabel: share.metricLabel,
          })
        )}`
      : null;

  return (
    <section className="mb-8 mt-4 overflow-hidden rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-700">
        <Inbox className="h-4 w-4" />
        お子さまから成績レポートが届きました
      </div>

      <h2 className="mb-3 text-xl font-bold leading-snug text-slate-900">
        {prefectureName ? `${prefectureName}の` : ''}{metric}の成績レポートが届きました
      </h2>

      {hasScore && (
        <dl className="mb-4 grid divide-y divide-slate-200 border-y border-slate-200 sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0">
          <div className="px-4 py-3">
            <dt className="text-xs text-slate-600">現在の{metric}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
              {score}
              {typeof max === 'number' && <span className="text-base font-bold text-slate-600">/{max}</span>}
            </dd>
          </div>

          {typeof target === 'number' && (
            <div className="px-4 py-3">
              <dt className="flex items-center gap-1 text-xs text-slate-600">
                {met ? <Check className="h-4 w-4 shrink-0" /> : <Target className="h-4 w-4 shrink-0" />}
                <span>{targetWord}（{target}）まで</span>
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                {met ? `目標を ${Math.abs(gap as number)}点 達成` : `あと ${gap}点`}
              </dd>
            </div>
          )}

          {/* ②この点数の意味（全国/県内位置）。k-匿名性ガード後の実測値のみ表示・未計測時は出さない。 */}
          {hasPercentile && (
            <div className="px-4 py-3">
              <dt className="flex items-center gap-1 text-xs text-slate-600">
                <TrendingUp className="h-4 w-4 shrink-0" />
                <span>{percentileScopeLabel}での位置</span>
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                上位 {Math.max(1, 100 - (percentile as number))}%相当
              </dd>
            </div>
          )}
        </dl>
      )}

      <p className="text-base leading-[1.8] text-slate-900">
        {met
          ? 'お子さまは目標ラインに到達しています。この力をキープし、さらに伸ばすために、ご家庭でできる対策を無料の資料で確認できます。'
          : `${gradeLead}ここから内申点・偏差値は「今からの伸ばし方」で大きく変わります。お子さまに合った対策を、まずは無料の資料・体験でご確認ください（費用はかかりません）。`}
      </p>

      {cardSrc && (
        <div className="mt-4 max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardSrc}
            alt={`${prefectureName ?? ''}${metric}の成績レポート`}
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}
    </section>
  );
}
