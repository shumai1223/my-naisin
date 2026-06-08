'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, BellRing, Check, Loader2, ShieldCheck, Bookmark } from 'lucide-react';

import { track } from '@/lib/track';
import { isValidEmail, openLeadMailtoFallback, submitLead, type LeadPayload, type LeadSource } from '@/lib/lead';

interface SaveResultCTAProps {
  /** 設置場所（セグメント用） */
  source: LeadSource;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  target?: number;
  gap?: number;
  /** 見出しの上書き（未指定なら文脈に応じた既定） */
  heading?: string;
  /** 補足文の上書き */
  body?: string;
  className?: string;
}

// LINE公式アカウントの友だち追加URL（例: https://lin.ee/xxxxxxx）。
// Cloudflare の環境変数 NEXT_PUBLIC_LINE_ADD_URL を設定した瞬間に LINE導線が点灯する。
const LINE_ADD_URL = process.env.NEXT_PUBLIC_LINE_ADD_URL || '';

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
  target,
  gap,
  heading,
  body,
  className = '',
}: SaveResultCTAProps) {
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

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
    track('line_friend_click', { source, pref: prefectureCode ?? 'none', gap: gap ?? 0 });
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
    track('lead_submit', { source, pref: prefectureCode ?? 'none', gap: gap ?? 0 });

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
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </div>
          <div className="text-sm leading-relaxed text-emerald-900">
            <div className="font-bold">受け取り登録を受け付けました。</div>
            {status === 'fallback' ? (
              <>
                <p className="mt-1 text-emerald-800">
                  確実にお届けするため、メールアプリが開きます。そのまま送信してください。
                </p>
                <button
                  type="button"
                  onClick={() => openLeadMailtoFallback(payload)}
                  className="mt-2 text-xs font-semibold text-emerald-700 underline"
                >
                  メールアプリが開かない場合はこちら
                </button>
              </>
            ) : (
              <p className="mt-1 text-emerald-800">受験本番まで、内申対策と志望校情報をお届けします。</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 受け皿1：LINE（プッシュ可能な“溶けない名簿”） */}
          {LINE_ADD_URL && (
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
                  <span className="block text-xs text-white/85">友だち追加で受験情報をプッシュ通知</span>
                </span>
              </span>
              <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-bold">無料</span>
            </a>
          )}

          {/* 受け皿2：メール（会員化の入口・文脈付きセグメント名簿） */}
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
                onChange={(e) => setEmail(e.target.value)}
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
                受験情報・内申対策の受け取りに同意します（
                <Link href="/privacy" className="font-semibold text-slate-600 underline">
                  プライバシーポリシー
                </Link>
                ）。配信はいつでも解除できます。
              </span>
            </label>

            {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
          </form>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            登録は無料。メールアドレスは受験情報の配信にのみ使用します。
          </div>
        </div>
      )}
    </section>
  );
}
