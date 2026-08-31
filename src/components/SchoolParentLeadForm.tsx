'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, Loader2, Check } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { isValidEmail, openLeadMailtoFallback, submitLead, type LeadPayload } from '@/lib/lead';
import {
  SCHOOL_LEAD_AUDIENCE_LABEL,
  SCHOOL_LEAD_JUKU_OPTIN_DEFAULT,
  SCHOOL_LEAD_JUKU_OPTIN_LABEL,
  SCHOOL_LEAD_PURPOSE_NOTICE,
} from '@/lib/school-lead-consent';

interface SchoolParentLeadFormProps {
  prefectureCode: string;
  prefectureName?: string;
  schoolName?: string;
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'fallback' | 'error';

/**
 * 学校ページ用・保護者向けリードフォーム（T-N1-N4 C10-2）。
 *
 * SaveResultCTA（結果画面用・LINE/成績カード等の互恵性フル装備）とは別系統の、
 * 学校ページ専用の最小フォーム。目的は2つ：
 *  1) 通常の受験情報配信への同意登録（他のCTAと同じ /api/lead 経路）。
 *  2) 任意で「学習塾への提供」にオプトイン（デフォルトOFF）。
 *     [[takerate-souyaku-internalization]]の送客内製化に向けた同意の貯蓄で、
 *     実際に塾へメールアドレスを渡す処理はここでは行わない（別途👤ゲート）。
 *
 * C7ガードレール:
 *  - 氏名・電話・住所は取らない（emailのみ）。
 *  - 塾への提供チェックボックスは既定OFF。チェックしなくてもフォーム自体は使える。
 *  - 「保護者の方へ」と明示し、利用目的・提供先の区分・停止方法をフォーム直下に明記する。
 */
export function SchoolParentLeadForm({ prefectureCode, prefectureName, schoolName, className = '' }: SchoolParentLeadFormProps) {
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [jukuOptin, setJukuOptin] = React.useState<boolean>(SCHOOL_LEAD_JUKU_OPTIN_DEFAULT);
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const payload: LeadPayload = React.useMemo(
    () => ({
      email,
      consent,
      source: 'school-lead',
      prefectureCode,
      prefectureName,
      note: schoolName ? `${schoolName}のページから登録` : undefined,
      jukuOptin,
    }),
    [email, consent, prefectureCode, prefectureName, schoolName, jukuOptin]
  );

  // Webhook未配信（fallback）になったら、運営者へ届くようメールアプリを自動で開く（SaveResultCTAと同方針）。
  React.useEffect(() => {
    if (status === 'fallback') openLeadMailtoFallback(payload);
    // payload を依存に入れると毎回開いてしまうため status のみを監視する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    track(EVENTS.FORM_START, { source: 'school-lead', pref: prefectureCode });
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
    track('lead_submit', { source: 'school-lead', pref: prefectureCode, juku_optin: jukuOptin });

    const result = await submitLead(payload);

    if (result.ok && result.delivered) {
      setStatus('success');
      track('lead_submit_success', { source: 'school-lead', pref: prefectureCode, delivered: true });
      return;
    }
    if (result.ok && !result.delivered) {
      setStatus('fallback');
      track('lead_submit_success', { source: 'school-lead', pref: prefectureCode, delivered: false });
      return;
    }

    setStatus('error');
    setError(result.error || '送信に失敗しました。少し時間をおいて再度お試しください。');
  }

  const done = status === 'success' || status === 'fallback';

  return (
    <section className={`rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-5 shadow-sm md:p-6 ${className}`}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
        {SCHOOL_LEAD_AUDIENCE_LABEL}
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-900 md:text-lg">
        この学校の入試情報を無料で受け取る
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">
        入試日程・内申点対策の情報をメールでお届けします。配信はいつでも解除できます。
      </p>

      {done ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-bold">
            <Check className="h-4 w-4" />
            登録ありがとうございます
          </div>
          {status === 'fallback' && (
            <>
              <p className="mt-2">確実にお届けするため、メールアプリが開きます。そのまま送信してください。</p>
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
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
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
              placeholder="保護者の方のメールアドレス"
              aria-label="メールアドレス"
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  送信中…
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  無料で受け取る
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
              受験情報の受け取りに同意します（
              <Link href="/privacy" className="font-semibold text-slate-600 underline">
                プライバシーポリシー
              </Link>
              ）。配信はいつでも解除できます。
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-slate-500">
            <input
              type="checkbox"
              checked={jukuOptin}
              onChange={(e) => setJukuOptin(e.target.checked)}
              aria-label="学習塾への提供に同意する（任意）"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>{SCHOOL_LEAD_JUKU_OPTIN_LABEL}</span>
          </label>

          <p className="text-[11px] leading-relaxed text-slate-400">
            {SCHOOL_LEAD_PURPOSE_NOTICE}
            {' '}
            <Link href="/contact" className="underline">
              お問い合わせ
            </Link>
            はこちら。
          </p>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        </form>
      )}
    </section>
  );
}
