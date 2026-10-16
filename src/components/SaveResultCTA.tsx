'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Check,
  Loader2,
  Download,
  Send,
  ChevronRight,
} from '@/components/icons';

import { EVENTS, track } from '@/lib/track';
import { lineAddUrl, LINE_UNFRIEND_HELP_TEXT, type LineAudience } from '@/lib/line';
import { LIST_BENEFITS } from '@/lib/broadcast-templates';
import { isValidEmail, openLeadMailtoFallback, submitLead, type LeadPayload, type LeadSource } from '@/lib/lead';
import { buildLeadMagnet, defaultMetricLabel } from '@/lib/lead-magnet';
import { metricLabelToStatsMetric } from '@/lib/stats-aggregation';
import { useExperiment } from '@/components/ab/useExperiment';

/** lead-copy-2026 のアーム（[[experiments]]）。安定参照のためモジュールレベルに置く。 */
const LEAD_COPY_ARMS = [{ id: 'control' as const }, { id: 'reward' as const }];
/** lead-magnet-action-plan-2026（ZZ-2b・リードマグネットv2）のアーム。 */
const ACTION_PLAN_ARMS = [{ id: 'control' as const }, { id: 'action-plan-v2' as const }];
/** T-2（LINE登録導線A/B・[[experiments]]）。安定参照のためモジュールレベルに置く。 */
const LINE_COPY_ARMS = [{ id: 'control' as const }, { id: 'benefit' as const }];
const LINE_POSITION_ARMS = [{ id: 'control' as const }, { id: 'email-first' as const }];
const LINE_TIMING_ARMS = [{ id: 'control' as const }, { id: 'delayed' as const }];
const LINE_TIMING_DELAY_MS = 1200;

interface SaveResultCTAProps {
  /** 設置場所（セグメント用） */
  source: LeadSource;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  /** 満点。指定すると登録成功後に「成績カード（画像）」と保護者バトンを渡せる（A2/A5）。 */
  max?: number;
  /** 学年（1/2/3）。成績カード・セグメントの文脈に使う。 */
  grade?: number;
  /** 指標ラベル（偏差値/評定平均/総合得点 …）。未指定なら source から導出。 */
  metricLabel?: string;
  target?: number;
  gap?: number;
  /** 見出しの上書き（未指定なら文脈に応じた既定） */
  heading?: string;
  /** 補足文の上書き */
  body?: string;
  /** 名簿の対象（生徒/保護者）。保護者面では 'parent' を渡すと保護者用LINEアカウントへ分離。既定 'student'。 */
  audience?: LineAudience;
  className?: string;
  /** 見出しのレベル（既定 h3）。置かれるページの見出し階層に合わせて呼び出し側が選ぶ。 */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

type Status = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

/**
 * 堀A（名簿化）の中核：受験期の“使い捨てトラフィック”を、保護者・受験生の“資産（名簿）”に変える。
 *
 * 2つの受け皿：
 *  1) LINE公式アカウント友だち追加 … プッシュ可能で半永久に再収穫できる最強の名簿（PII保存不要）。
 *  2) メールでの受け取り登録 …… 会員化の入口。文脈（都道府県・内申・目標・ギャップ）付きで送られ、
 *     高インテントのセグメント名簿になる。配信は /api/lead → Webhook、未設定時は mailto で取りこぼし防止。
 *
 * これは“広告”ではなく“資産形成”なので AdSense審査の密度リスクには当たらない（審査用の非表示の対象にもしない）。
 */
export function SaveResultCTA({
  source,
  prefectureCode,
  prefectureName,
  score,
  max,
  grade,
  metricLabel,
  target,
  gap,
  heading,
  body,
  audience = 'student',
  className = '',
  headingLevel = 'h3',
}: SaveResultCTAProps) {
  const LINE_ADD_URL = lineAddUrl(audience);
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  // ZZ-2b：リードマグネットv2「県別・内申点アクションプラン」next stepのA/B。
  const actionPlanVariant = useExperiment('lead-magnet-action-plan-2026', ACTION_PLAN_ARMS);

  // ZZ-5a：結果カードv2「県内位置」。/api/stats/percentileの実測値をそのまま使う
  // （このコンポーネント側では一切計算しない＝捏造ゼロ・APIがk-匿名性ガード済み）。
  // 対応するstatsMetric（内申点/偏差値/総合得点）が無い指標（評定平均等）は取得しない。
  const resolvedMetricLabel = metricLabel ?? defaultMetricLabel(source);
  const statsMetric = metricLabelToStatsMetric(resolvedMetricLabel);
  const [percentileResult, setPercentileResult] = React.useState<{
    percentile: number | null;
    scope: 'prefecture' | 'national' | null;
  }>({ percentile: null, scope: null });
  React.useEffect(() => {
    if (!statsMetric || typeof score !== 'number' || !Number.isFinite(score)) return;
    let cancelled = false;
    const params = new URLSearchParams({ metric: statsMetric, value: String(score) });
    if (prefectureCode) params.set('prefecture', prefectureCode);
    fetch(`/api/stats/percentile?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.prefectureResult) {
          setPercentileResult({ percentile: data.prefectureResult.percentile, scope: 'prefecture' });
        } else if (data?.result) {
          setPercentileResult({ percentile: data.result.percentile, scope: 'national' });
        }
      })
      .catch(() => {
        /* 取得失敗はカードから立ち位置チップが消えるだけ・体験は継続 */
      });
    return () => {
      cancelled = true;
    };
  }, [statsMetric, score, prefectureCode]);

  // 登録の“即時の見返り”一式（成績カード・保護者バトン・次の一手）。score+max が揃えばカードを渡せる。
  const leadMagnet = React.useMemo(
    () =>
      buildLeadMagnet({
        source,
        prefectureCode,
        prefectureName,
        score,
        max,
        grade,
        target,
        gap,
        metricLabel,
        nextStepVariant: actionPlanVariant,
        percentile: percentileResult.percentile,
        percentileScope: percentileResult.scope,
      }),
    [source, prefectureCode, prefectureName, score, max, grade, target, gap, metricLabel, actionPlanVariant, percentileResult]
  );
  const hasCard = leadMagnet.cardPath !== null;

  // 名簿登録ボタンのコピーA/B（初の lead_submit 実験）。カードを渡せる面でだけ「見返り」文言にする（誇大表現の防止）。
  const copyVariant = useExperiment('lead-copy-2026', LEAD_COPY_ARMS);
  const submitLabel = copyVariant === 'reward' && hasCard ? '結果カードを無料でもらう' : '無料で受け取る';

  // T-2：結果画面LINE登録導線のコピー・位置・表示タイミングA/B（3本・[[experiments]]）。
  const lineCopyVariant = useExperiment('line-cta-copy-2026', LINE_COPY_ARMS);
  const linePositionVariant = useExperiment('line-cta-position-2026', LINE_POSITION_ARMS);
  const lineTimingVariant = useExperiment('line-cta-timing-2026', LINE_TIMING_ARMS);
  const lineSubtitle =
    lineCopyVariant === 'benefit' ? '内申点アップのコツを毎週LINEでお届け' : '友だち追加で受験情報をプッシュ通知';

  // timing='delayed'のときだけ、結果表示から一拍置いてLINEブロックを表示する（controlは常時表示・レイアウトシフト回避）。
  const [lineVisible, setLineVisible] = React.useState(lineTimingVariant !== 'delayed');
  React.useEffect(() => {
    if (lineTimingVariant !== 'delayed') {
      setLineVisible(true);
      return;
    }
    setLineVisible(false);
    const t = window.setTimeout(() => setLineVisible(true), LINE_TIMING_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [lineTimingVariant]);

  // 名簿フォームへの最初の入力で form_start を一度だけ。lead_submit との比で「入力したのに送らない」歩留まりを可視化。
  function onFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    track(EVENTS.FORM_START, { source, pref: prefectureCode ?? 'none' });
  }

  const payload: LeadPayload = React.useMemo(
    () => ({ email, consent, source, prefectureCode, prefectureName, score, target, gap }),
    [email, consent, source, prefectureCode, prefectureName, score, target, gap]
  );

  // Webhook未配信（fallback）になったら、運営者へ届くようメールアプリを自動で開く。
  React.useEffect(() => {
    if (status === 'fallback') openLeadMailtoFallback(payload);
    // payload を依存に入れると毎回開いてしまうため status のみを監視する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onLineClick() {
    track('line_friend_click', {
      source,
      pref: prefectureCode ?? 'none',
      gap: gap ?? 0,
      copy_variant: lineCopyVariant,
      position_variant: linePositionVariant,
      timing_variant: lineTimingVariant,
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('メールアドレスを正しく入力してください。');
      return;
    }
    if (!consent) {
      setError('受け取りへの同意にチェックしてください。');
      return;
    }

    setStatus('submitting');
    // variant を載せて GA4 で experiment_impression × lead_submit を突合（lead-copy-2026 の勝者判定）。
    track('lead_submit', { source, pref: prefectureCode ?? 'none', gap: gap ?? 0, variant: copyVariant });

    const result = await submitLead(payload);

    if (result.ok && result.delivered) {
      setStatus('success');
      track('lead_submit_success', { source, pref: prefectureCode ?? 'none', delivered: true });
      return;
    }

    if (result.ok && !result.delivered) {
      // Webhook未設定でも取りこぼさない：メールアプリで運営者宛に送る
      setStatus('fallback');
      track('lead_submit_success', { source, pref: prefectureCode ?? 'none', delivered: false });
      return;
    }

    setStatus('error');
    setError(result.error || '送信に失敗しました。少し時間をおいて再度お試しください。');
  }

  const done = status === 'success' || status === 'fallback';

  // 受け皿1：LINE（プッシュ可能な“溶けない名簿”）。T-2：コピー/表示タイミングA/Bをここで反映。
  // 2026-08-01 Cowork実地UXテストで発覚した誤タップ事故の是正: timing='delayed'アームは以前
  // lineVisible=falseの間このブロック自体をJSXから外す(mount/unmount)実装だったため、1.2秒後に
  // 突然要素が挿入され下流のParentWindowBridge/ParentCostBridge/ShindanEntryLinkが数十px押し下げ
  // られ、その瞬間のタップが無関係なリンクに命中する事故を招いていた。ラッパーは常時マウントして
  // 高さを予約し(AdSlot.tsxのCLS対策パターンを踏襲)、可視/不可視はopacity+pointer-eventsの
  // トランジションのみで切り替える(DOMの挿入・削除を伴わない=後続要素は一切動かない)。
  const lineBlock = LINE_ADD_URL && (
    <div
      aria-hidden={!lineVisible}
      className={`transition-opacity duration-200 motion-reduce:transition-none ${lineVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      {/* LINEボタンだけは LINE公式の緑（設計書の例外）。形は主ボタンと同じ。 */}
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLineClick}
        tabIndex={lineVisible ? 0 : -1}
        className="flex min-h-[44px] items-center justify-between gap-3 rounded bg-[#06C755] px-5 py-3 text-left text-white transition-colors hover:bg-[#05b34c]"
      >
        <span className="flex items-center gap-2.5">
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-base font-bold">LINEで受験情報を受け取る</span>
            <span className="block text-sm">{lineSubtitle}</span>
          </span>
        </span>
        <span className="rounded bg-white px-2 py-0.5 text-xs font-bold text-slate-900">無料</span>
      </a>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{LINE_UNFRIEND_HELP_TEXT}</p>
    </div>
  );

  // 受け皿2：メール（会員化の入口・文脈付きセグメント名簿）。
  const emailBlock = (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="text-sm font-bold text-slate-900">メールで受け取る</div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            onFormStart();
            setEmail(e.target.value);
          }}
          onFocus={onFormStart}
          placeholder="メールアドレス"
          aria-label="メールアドレス"
          className="min-h-[44px] flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              送信中…
            </>
          ) : (
            <>{submitLabel}</>
          )}
        </button>
      </div>

      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-brand-700"
        />
        <span>
          受験情報・内申対策の受け取りに同意します（
          <Link href="/privacy" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            プライバシーポリシー
          </Link>
          ）。配信はいつでも解除できます。
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
          {error}
        </p>
      )}
    </form>
  );

  // 登録成功後の“見返り”が表示されたら一度だけ計測（互恵性ファネルの分母）。
  React.useEffect(() => {
    if (done) {
      track(EVENTS.LEAD_MAGNET_VIEW, {
        source,
        pref: prefectureCode ?? 'none',
        has_card: hasCard,
        next: leadMagnet.nextStep.href,
        variant: actionPlanVariant,
      });
    }
    // done への遷移時に一度だけ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // ZZ-2d：保護者バトン/LINE導線への到達率の分母。result_view（結果セクション全体）とは別に、
  // このブロック自体が視界に入った回数を1マウント1回だけ計測する（IntersectionObserver・
  // CtaViewTracker/NationalPercentileRevealと同じ設計）。
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const reachTrackedRef = React.useRef(false);
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reachTrackedRef.current) {
            reachTrackedRef.current = true;
            track(EVENTS.SAVE_RESULT_CTA_VIEW, { source, pref: prefectureCode ?? 'none' });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [source, prefectureCode]);

  const onCardClick = () => track(EVENTS.LEAD_MAGNET_CARD, { source, pref: prefectureCode ?? 'none' });
  const onParentMagnetClick = () =>
    track(EVENTS.LEAD_MAGNET_PARENT, { source, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
  const onNextMagnetClick = () =>
    track(EVENTS.LEAD_MAGNET_NEXT, { source, pref: prefectureCode ?? 'none', to: leadMagnet.nextStep.href, variant: actionPlanVariant });

  // 見出しのレベルは呼び出し側が選ぶ（既定 h3）。見た目はレベルに依らず設計書の h2 / h3 の型。
  const Heading = headingLevel;
  const headingSize = headingLevel === 'h2' ? 'text-xl' : 'text-[17px]';

  return (
    <section
      ref={sectionRef}
      className={`rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6 ${className}`}
    >
      {/* 結果直下の主役（名簿CTA）。強調は薄い緑の面（bg-brand-50）だけで行う。 */}
      <div className="mb-3 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
        結果を保存・受け取る
      </div>

      <Heading className={`mb-2 ${headingSize} font-bold leading-snug text-slate-900`}>
        {heading ?? 'この結果と「あと何点」を、忘れないうちに受け取りませんか？'}
      </Heading>
      <p className="mb-5 text-base leading-[1.8] text-slate-900">
        {body ??
          '内申点アップのコツ・出願までのスケジュール・志望校の最新情報を、受験本番まで無料でお届けします。受け取り方法は2つ。いつでも解除できます。'}
      </p>

      {done ? (
        <div className="space-y-5">
          {/* 確認＋登録の見返りの見出し（何が手に入ったかを名指し） */}
          <div className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 shrink-0 text-brand-700" />
            <div className="text-base leading-[1.8] text-slate-900">
              <div className="font-bold">{leadMagnet.headline}</div>
              <p className="mt-1">{leadMagnet.subline}</p>
              {status === 'fallback' && (
                <>
                  <p className="mt-2">
                    確実にお届けするため、メールアプリが開きます。そのまま送信してください。
                  </p>
                  <button
                    type="button"
                    onClick={() => openLeadMailtoFallback(payload)}
                    className="mt-1 inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    メールアプリが開かない場合はこちら
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 見返り①：成績カード（画像）。score+max が揃ったときだけ。登録の互恵性の核。 */}
          {leadMagnet.cardPath && (
            <div className="border-t border-slate-200 pt-5">
              <div className="mb-2 text-sm font-bold text-slate-900">
                あなたの成績カードができました
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadMagnet.cardPath}
                alt="あなたの成績カード"
                className="w-full rounded-lg border border-slate-200"
                loading="lazy"
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  href={leadMagnet.cardPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onCardClick}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  <Download className="h-5 w-5 shrink-0" />
                  画像を保存する
                </a>
                {leadMagnet.parentSharePath && (
                  <Link
                    href={leadMagnet.parentSharePath}
                    onClick={onParentMagnetClick}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800"
                  >
                    <Send className="h-5 w-5 shrink-0" />
                    おうちの人に送る
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* 見返り②：次の一手（常に1つ）。広告ではなく役立つ内部ページへ＝満足度＋内部回遊（SEO）。 */}
          <Link
            href={leadMagnet.nextStep.href}
            onClick={onNextMagnetClick}
            className="group flex min-h-[44px] items-center justify-between gap-3 border-t border-slate-200 pt-5"
          >
            <div>
              <div className="text-base font-bold text-brand-700 underline underline-offset-2 group-hover:text-brand-800">{leadMagnet.nextStep.label}</div>
              <div className="mt-1 text-sm text-slate-600">{leadMagnet.nextStep.description}</div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-brand-700" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 追加する“理由”を具体化（友だち追加の動機づけ＝名簿velocityのKPI施策）。
              「受験情報」では曖昧なので、受け取れる中身を3つ明示する。 */}
          <ul className="grid gap-2 sm:grid-cols-3">
            {LIST_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-slate-900">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                {b}
              </li>
            ))}
          </ul>

          {/* T-2：位置A/B。既定はLINEが先（プッシュ可能な“溶けない名簿”を優先訴求）・email-firstアームは逆順。 */}
          {linePositionVariant === 'email-first' ? (
            <>
              {emailBlock}
              {lineBlock}
            </>
          ) : (
            <>
              {lineBlock}
              {emailBlock}
            </>
          )}

          <p className="text-xs text-slate-600">
            登録は無料。メールアドレスは受験情報の配信にのみ使用します。
          </p>
        </div>
      )}
    </section>
  );
}
