'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Mail,
  BellRing,
  Check,
  Loader2,
  ShieldCheck,
  Bookmark,
  Download,
  Send,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { lineAddUrl, type LineAudience } from '@/lib/line';
import { LIST_BENEFITS } from '@/lib/broadcast-templates';
import { isValidEmail, openLeadMailtoFallback, submitLead, type LeadPayload, type LeadSource } from '@/lib/lead';
import { buildLeadMagnet } from '@/lib/lead-magnet';
import { useExperiment } from '@/components/ab/useExperiment';

/** lead-copy-2026 のアーム（[[experiments]]）。安定参照のためモジュールレベルに置く。 */
const LEAD_COPY_ARMS = [{ id: 'control' as const }, { id: 'reward' as const }];
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
 * これは“広告”ではなく“資産形成”なので AdSense審査の密度リスクには当たらない（auditHideしない）。
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
}: SaveResultCTAProps) {
  const LINE_ADD_URL = lineAddUrl(audience);
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  // 登録の“即時の見返り”一式（成績カード・保護者バトン・次の一手）。score+max が揃えばカードを渡せる。
  const leadMagnet = React.useMemo(
    () => buildLeadMagnet({ source, prefectureCode, prefectureName, score, max, grade, target, gap, metricLabel }),
    [source, prefectureCode, prefectureName, score, max, grade, target, gap, metricLabel]
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
  const lineBlock = LINE_ADD_URL && lineVisible && (
    <a
      href={LINE_ADD_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onLineClick}
      className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#06C755] bg-[#06C755] px-5 py-3.5 text-left text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
    >
      <span className="flex items-center gap-2.5">
        <MessageCircle className="h-5 w-5" />
        <span>
          <span className="block text-sm font-bold">LINEで受け取る・進路相談する</span>
          <span className="block text-xs text-white/85">{lineSubtitle}</span>
        </span>
      </span>
      <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-bold">無料</span>
    </a>
  );

  // 受け皿2：メール（会員化の入口・文脈付きセグメント名簿）。
  const emailBlock = (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <Mail className="h-3.5 w-3.5 text-sky-600" />
        メールで受け取る
      </div>
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
          className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              送信中…
            </>
          ) : (
            <>
              <BellRing className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </button>
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-slate-500">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <span>
          受験情報・内申対策の受け取りに同意します（
          <Link href="/privacy" className="font-semibold text-slate-600 underline">
            プライバシーポリシー
          </Link>
          ）。配信はいつでも解除できます。
        </span>
      </label>

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
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
      });
    }
    // done への遷移時に一度だけ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const onCardClick = () => track(EVENTS.LEAD_MAGNET_CARD, { source, pref: prefectureCode ?? 'none' });
  const onParentMagnetClick = () =>
    track(EVENTS.LEAD_MAGNET_PARENT, { source, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
  const onNextMagnetClick = () =>
    track(EVENTS.LEAD_MAGNET_NEXT, { source, pref: prefectureCode ?? 'none', to: leadMagnet.nextStep.href });

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
        <Bookmark className="h-3.5 w-3.5" />
        結果を保存・受け取る
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        {heading ?? 'この結果と「あと何点」を、忘れないうちに受け取りませんか？'}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        {body ??
          '内申点アップのコツ・出願までのスケジュール・志望校の最新情報を、受験本番まで無料でお届けします。受け取り方法は2つ。いつでも解除できます。'}
      </p>

      {done ? (
        <div className="space-y-4">
          {/* 確認＋登録の見返りの見出し（何が手に入ったかを名指し） */}
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="h-4 w-4" />
            </div>
            <div className="text-sm leading-relaxed text-emerald-900">
              <div className="font-bold">{leadMagnet.headline}</div>
              <p className="mt-1 text-emerald-800">{leadMagnet.subline}</p>
              {status === 'fallback' && (
                <>
                  <p className="mt-2 text-emerald-800">
                    確実にお届けするため、メールアプリが開きます。そのまま送信してください。
                  </p>
                  <button
                    type="button"
                    onClick={() => openLeadMailtoFallback(payload)}
                    className="mt-1 text-xs font-semibold text-emerald-700 underline"
                  >
                    メールアプリが開かない場合はこちら
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 見返り①：成績カード（画像）。score+max が揃ったときだけ。登録の互恵性の核。 */}
          {leadMagnet.cardPath && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                あなたの成績カードができました
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadMagnet.cardPath}
                alt="あなたの成績カード"
                className="w-full rounded-xl border border-slate-100 shadow-sm"
                loading="lazy"
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a
                  href={leadMagnet.cardPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onCardClick}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-700 transition-all hover:border-sky-400 hover:bg-sky-50 active:scale-[0.99]"
                >
                  <Download className="h-4 w-4" />
                  画像を保存する
                </a>
                {leadMagnet.parentSharePath && (
                  <Link
                    href={leadMagnet.parentSharePath}
                    onClick={onParentMagnetClick}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.99]"
                  >
                    <Send className="h-4 w-4" />
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
            className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 px-5 py-4 transition-all hover:border-sky-400 hover:shadow-md"
          >
            <div>
              <div className="text-sm font-bold text-sky-900">{leadMagnet.nextStep.label}</div>
              <div className="mt-0.5 text-xs text-sky-700">{leadMagnet.nextStep.description}</div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-sky-500 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 追加する“理由”を具体化（友だち追加の動機づけ＝名簿velocityのKPI施策）。
              「受験情報」では曖昧なので、受け取れる中身を3つ明示する。 */}
          <ul className="grid gap-1.5 sm:grid-cols-3">
            {LIST_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-1.5 rounded-lg bg-white/70 px-2.5 py-2 text-xs font-medium text-slate-600 ring-1 ring-sky-100">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
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

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            登録は無料。メールアドレスは受験情報の配信にのみ使用します。
          </div>
        </div>
      )}
    </section>
  );
}
