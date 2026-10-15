'use client';

import * as React from 'react';
import { Mail, ArrowLeft, Send, MessageCircle, Github, Bug, AlertCircle } from '@/components/icons';
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
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-slate-500">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">お問い合わせ</h1>
            <p className="text-sm text-slate-500">Contact Us</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            {/* Form Type Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => { setFormType('general'); setSubmitted(false); setMailtoMode(false); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm transition-all ${
                  formType === 'general'
                    ? 'bg-slate-100 text-slate-700 ring-2 ring-slate-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                お問い合わせ
              </button>
              <button
                type="button"
                onClick={() => { setFormType('bug'); setSubmitted(false); setMailtoMode(false); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm transition-all ${
                  formType === 'bug'
                    ? 'bg-red-100 text-red-700 ring-2 ring-red-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bug className="h-4 w-4" />
                不具合報告
              </button>
            </div>

            {submitted ? (
              <div className="rounded-lg bg-brand-50 p-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-100">
                  <Send className="h-6 w-6 text-brand-600" />
                </div>
                {mailtoMode ? (
                  <>
                    <p className="font-bold text-brand-700">メールアプリを開きました 📩</p>
                    <p className="mt-1 text-sm text-brand-600">
                      入力内容を下書きしました。<strong>そのまま送信</strong>してください。<br />
                      メールアプリが開かない場合は、お手数ですが
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline">{CONTACT_EMAIL}</a>
                      まで直接お送りください。
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-brand-700">送信完了！</p>
                    <p className="mt-1 text-sm text-brand-600">
                      {formType === 'bug' ? '不具合報告' : 'お問い合わせ'}ありがとうございます。<br />
                      内容を確認次第、対応いたします。
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setMailtoMode(false); }}
                  className="mt-4 text-sm text-brand-600 underline hover:text-brand-700"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : formType === 'general' ? (
              /* General Contact Form */
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-general-name" className="mb-1 block text-xs text-slate-600">
                    お名前（ニックネーム可）
                  </label>
                  <input
                    id="contact-general-name"
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                    placeholder="例: たろう"
                  />
                </div>

                <div>
                  <label htmlFor="contact-general-email" className="mb-1 block text-xs text-slate-600">
                    メールアドレス
                  </label>
                  <input
                    id="contact-general-email"
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-600">
                    お問い合わせ内容
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                    placeholder="ご質問・ご要望をお書きください"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-500 px-6 py-3 text-sm font-bold text-white transition-all"
                >
                  <Send className="h-4 w-4" />
                  送信する
                </button>
              </form>
            ) : (
              /* Bug Report Form */
              <form onSubmit={handleBugSubmit} className="space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <p className="text-xs leading-relaxed text-red-700">
                      不具合を報告する際は、できるだけ詳しく状況を教えていただけると助かります。
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-bug-device" className="mb-1 block text-xs text-slate-600">
                      使用端末
                    </label>
                    <select
                      id="contact-bug-device"
                      required
                      value={bugDetails.device}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, device: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
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
                    <label htmlFor="contact-bug-browser" className="mb-1 block text-xs text-slate-600">
                      ブラウザ
                    </label>
                    <select
                      id="contact-bug-browser"
                      required
                      value={bugDetails.browser}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, browser: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
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
                  <label className="mb-1 block text-xs text-slate-600">
                    不具合の内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bugDetails.description}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="何がおかしいですか？（例: 計算結果が表示されない）"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-600">
                    再現手順（任意）
                  </label>
                  <textarea
                    rows={3}
                    value={bugDetails.steps}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, steps: e.target.value }))}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="1. ○○をクリック&#10;2. △△を入力&#10;3. エラーが発生"
                  />
                </div>

                <div>
                  <label htmlFor="contact-bug-email" className="mb-1 block text-xs text-slate-600">
                    メールアドレス（任意・返信希望の場合）
                  </label>
                  <input
                    id="contact-bug-email"
                    type="email"
                    value={bugDetails.email}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="example@email.com"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-sm font-bold text-white transition-all"
                >
                  <Bug className="h-4 w-4" />
                  不具合を報告する
                </button>
              </form>
            )}
          </div>

          {/* Other Contact Methods */}
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-800">その他の連絡方法</h2>
              
              <div className="space-y-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
                    <Mail className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-700">メール</div>
                    <div className="truncate text-xs text-slate-500">{CONTACT_EMAIL}</div>
                  </div>
                </a>
                <a
                  href="https://github.com/shumai1223/my-naisin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200">
                    <Github className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">GitHub</div>
                    <div className="text-xs text-slate-500">Issue報告はこちら</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-2 text-sm font-bold text-slate-700">よくある質問</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2">
                  <span className="text-slate-500">Q:</span>
                  計算結果が学校と違う場合は？
                </li>
                <li className="pl-4 text-slate-500">
                  → 地域・学校で計算方法が異なります。目安としてご利用ください。
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-500">Q:</span>
                  データは保存される？
                </li>
                <li className="pl-4 text-slate-500">
                  → ブラウザ内のみ。サーバーには送信されません。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
