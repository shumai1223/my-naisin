'use client';

import * as React from 'react';
import { Mail, Send, MessageCircle, Github, Bug, Info, Check, Home, ChevronRight } from '@/components/icons';
import Link from 'next/link';

import { CONTACT_EMAIL, submitContact, openMailtoFallback } from '@/lib/contact';

type FormType = 'general' | 'bug';

export default function ContactPage() {
  const [formType, setFormType] = React.useState<FormType>('general');
  const [submitted, setSubmitted] = React.useState(false);
  // Webhook配信できず mailto フォールバックした場合 true（完了画面の文言を切り替える）
  const [mailtoMode, setMailtoMode] = React.useState(false);
  const [bugDetails, setBugDetails] = React.useState({
    device: '',
    browser: '',
    description: '',
    steps: '',
    email: ''
  });

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const message = String(formData.get('message') || '');

    const result = await submitContact({ type: 'general', name, email, message });

    if (result.ok && result.delivered) {
      setMailtoMode(false);
      setSubmitted(true);
      return;
    }
    if (result.error) {
      alert(result.error);
      return;
    }
    // 配信先未設定／ネットワーク失敗 → メールアプリで確実に届ける
    openMailtoFallback(
      `【My Naishin お問い合わせ】${name || '匿名'}`,
      `お名前: ${name}\nメール: ${email}\n\n${message}`
    );
    setMailtoMode(true);
    setSubmitted(true);
  };

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submitContact({
      type: 'bug',
      email: bugDetails.email,
      device: bugDetails.device,
      browser: bugDetails.browser,
      description: bugDetails.description,
      steps: bugDetails.steps,
    });

    if (result.ok && result.delivered) {
      setMailtoMode(false);
      setSubmitted(true);
      return;
    }
    if (result.error) {
      alert(result.error);
      return;
    }
    openMailtoFallback(
      '【My Naishin 不具合報告】',
      `端末: ${bugDetails.device}\nブラウザ: ${bugDetails.browser}\n返信先: ${bugDetails.email}\n\n` +
        `不具合の内容:\n${bugDetails.description}\n\n再現手順:\n${bugDetails.steps}`
    );
    setMailtoMode(true);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        {/* パンくず */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">お問い合わせ</span>
        </nav>

        {/* ページの頭 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">お問い合わせ</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            {/* Form Type Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => { setFormType('general'); setSubmitted(false); setMailtoMode(false); }}
                aria-pressed={formType === 'general'}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded border px-4 py-3 text-sm font-bold transition-colors ${
                  formType === 'general'
                    ? 'border-brand-700 bg-brand-50 text-brand-700'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                お問い合わせ
              </button>
              <button
                type="button"
                onClick={() => { setFormType('bug'); setSubmitted(false); setMailtoMode(false); }}
                aria-pressed={formType === 'bug'}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded border px-4 py-3 text-sm font-bold transition-colors ${
                  formType === 'bug'
                    ? 'border-brand-700 bg-brand-50 text-brand-700'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bug className="h-4 w-4" />
                不具合報告
              </button>
            </div>

            {submitted ? (
              <div role="status" className="rounded-lg border border-slate-200 bg-brand-50 p-5">
                {mailtoMode ? (
                  <>
                    <p className="font-bold text-slate-900">メールアプリを開きました</p>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">
                      入力内容を下書きしました。<strong>そのまま送信</strong>してください。<br />
                      メールアプリが開かない場合は、お手数ですが
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">{CONTACT_EMAIL}</a>
                      まで直接お送りください。
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2 font-bold text-slate-900">
                      <Check className="h-5 w-5 shrink-0 text-brand-700" />
                      送信が完了しました
                    </p>
                    <p className="mt-1 text-base leading-[1.8] text-slate-900">
                      {formType === 'bug' ? '不具合報告' : 'お問い合わせ'}ありがとうございます。<br />
                      内容を確認次第、対応いたします。
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setMailtoMode(false); }}
                  className="mt-3 inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : formType === 'general' ? (
              /* General Contact Form */
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-general-name" className="mb-1 block text-sm font-bold text-slate-900">
                    お名前（ニックネーム可）
                  </label>
                  <input
                    id="contact-general-name"
                    type="text"
                    name="name"
                    required
                    className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="例: たろう"
                  />
                </div>

                <div>
                  <label htmlFor="contact-general-email" className="mb-1 block text-sm font-bold text-slate-900">
                    メールアドレス
                  </label>
                  <input
                    id="contact-general-email"
                    type="email"
                    name="email"
                    required
                    className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-general-message" className="mb-1 block text-sm font-bold text-slate-900">
                    お問い合わせ内容
                  </label>
                  <textarea
                    id="contact-general-message"
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="ご質問・ご要望をお書きください"
                  />
                </div>

                <button
                  type="submit"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
                >
                  <Send className="h-4 w-4" />
                  送信する
                </button>
              </form>
            ) : (
              /* Bug Report Form */
              <form onSubmit={handleBugSubmit} className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-brand-50 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
                    <p className="text-sm leading-[1.8] text-slate-900">
                      不具合を報告する際は、できるだけ詳しく状況を教えていただけると助かります。
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-bug-device" className="mb-1 block text-sm font-bold text-slate-900">
                      使用端末
                    </label>
                    <select
                      id="contact-bug-device"
                      required
                      value={bugDetails.device}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, device: e.target.value }))}
                      className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
                    >
                      <option value="">選択してください</option>
                      <option value="iphone">iPhone</option>
                      <option value="android">Android</option>
                      <option value="ipad">iPad</option>
                      <option value="windows">Windows PC</option>
                      <option value="mac">Mac</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-bug-browser" className="mb-1 block text-sm font-bold text-slate-900">
                      ブラウザ
                    </label>
                    <select
                      id="contact-bug-browser"
                      required
                      value={bugDetails.browser}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, browser: e.target.value }))}
                      className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
                    >
                      <option value="">選択してください</option>
                      <option value="chrome">Chrome</option>
                      <option value="safari">Safari</option>
                      <option value="firefox">Firefox</option>
                      <option value="edge">Edge</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-bug-description" className="mb-1 block text-sm font-bold text-slate-900">
                    不具合の内容 <span className="text-red-700">*</span>
                  </label>
                  <textarea
                    id="contact-bug-description"
                    required
                    rows={3}
                    value={bugDetails.description}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="何がおかしいですか？（例: 計算結果が表示されない）"
                  />
                </div>

                <div>
                  <label htmlFor="contact-bug-steps" className="mb-1 block text-sm font-bold text-slate-900">
                    再現手順（任意）
                  </label>
                  <textarea
                    id="contact-bug-steps"
                    rows={3}
                    value={bugDetails.steps}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, steps: e.target.value }))}
                    className="w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="1. ○○をクリック&#10;2. △△を入力&#10;3. エラーが発生"
                  />
                </div>

                <div>
                  <label htmlFor="contact-bug-email" className="mb-1 block text-sm font-bold text-slate-900">
                    メールアドレス（任意・返信希望の場合）
                  </label>
                  <input
                    id="contact-bug-email"
                    type="email"
                    value={bugDetails.email}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
                    placeholder="example@email.com"
                  />
                </div>

                <button
                  type="submit"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
                >
                  <Bug className="h-4 w-4" />
                  不具合を報告する
                </button>
              </form>
            )}
          </div>

          {/* Other Contact Methods */}
          <div className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">その他の連絡方法</h2>

              <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex min-h-[44px] items-center gap-3 py-3 transition-colors hover:bg-brand-50"
                >
                  <Mail className="h-5 w-5 shrink-0 text-brand-700" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900">メール</div>
                    <div className="truncate text-sm text-slate-600">{CONTACT_EMAIL}</div>
                  </div>
                </a>
                <a
                  href="https://github.com/shumai1223/my-naisin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center gap-3 py-3 transition-colors hover:bg-brand-50"
                >
                  <Github className="h-5 w-5 shrink-0 text-brand-700" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">GitHub</div>
                    <div className="text-sm text-slate-600">Issue報告はこちら</div>
                  </div>
                </a>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
              <dl className="mt-3 space-y-4">
                <div>
                  <dt className="text-base font-bold text-slate-900">
                    <span className="mr-2 text-slate-600">Q:</span>
                    計算結果が学校と違う場合は？
                  </dt>
                  <dd className="mt-1 text-sm text-slate-600">
                    → 地域・学校で計算方法が異なります。目安としてご利用ください。
                  </dd>
                </div>
                <div>
                  <dt className="text-base font-bold text-slate-900">
                    <span className="mr-2 text-slate-600">Q:</span>
                    データは保存される？
                  </dt>
                  <dd className="mt-1 text-sm text-slate-600">
                    → ブラウザ内のみ。サーバーには送信されません。
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
