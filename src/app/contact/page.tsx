'use client';

import * as React from 'react';
import { Mail, ArrowLeft, Send, MessageCircle, Twitter, Github, Bug, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

type FormType = 'general' | 'bug';

export default function ContactPage() {
  const [formType, setFormType] = React.useState<FormType>('general');
  const [submitted, setSubmitted] = React.useState(false);
  const [bugDetails, setBugDetails] = React.useState({
    device: '',
    browser: '',
    description: '',
    steps: '',
    email: ''
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    console.log('Bug report:', bugDetails);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">お問い合わせ</h1>
            <p className="text-sm text-slate-500">Contact Us</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Form Type Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => { setFormType('general'); setSubmitted(false); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  formType === 'general'
                    ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                お問い合わせ
              </button>
              <button
                type="button"
                onClick={() => { setFormType('bug'); setSubmitted(false); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  formType === 'bug'
                    ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bug className="h-4 w-4" />
                不具合報告
              </button>
            </div>

            {submitted ? (
              <div className="rounded-xl bg-green-50 p-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-green-100">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-bold text-green-700">送信完了！</p>
                <p className="mt-1 text-sm text-green-600">
                  {formType === 'bug' ? '不具合報告' : 'お問い合わせ'}ありがとうございます。<br />
                  内容を確認次第、対応いたします。
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm text-green-600 underline hover:text-green-700"
                >
                  別のお問い合わせをする
                </button>
              </div>
            ) : formType === 'general' ? (
              /* General Contact Form */
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    お名前（ニックネーム可）
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                    placeholder="例: たろう"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    お問い合わせ内容
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                    placeholder="ご質問・ご要望をお書きください"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:shadow-violet-300"
                >
                  <Send className="h-4 w-4" />
                  送信する
                </button>
              </form>
            ) : (
              /* Bug Report Form */
              <form onSubmit={handleBugSubmit} className="space-y-4">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                    <p className="text-xs leading-relaxed text-rose-700">
                      不具合を報告する際は、できるだけ詳しく状況を教えていただけると助かります。
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      使用端末
                    </label>
                    <select
                      required
                      value={bugDetails.device}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, device: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
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
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      ブラウザ
                    </label>
                    <select
                      required
                      value={bugDetails.browser}
                      onChange={(e) => setBugDetails(prev => ({ ...prev, browser: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
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
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    不具合の内容 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bugDetails.description}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="何がおかしいですか？（例: 計算結果が表示されない）"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    再現手順（任意）
                  </label>
                  <textarea
                    rows={3}
                    value={bugDetails.steps}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, steps: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="1. ○○をクリック&#10;2. △△を入力&#10;3. エラーが発生"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    メールアドレス（任意・返信希望の場合）
                  </label>
                  <input
                    type="email"
                    value={bugDetails.email}
                    onChange={(e) => setBugDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="example@email.com"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 transition-all hover:shadow-lg hover:shadow-rose-300"
                >
                  <Bug className="h-4 w-4" />
                  不具合を報告する
                </button>
              </form>
            )}
          </div>

          {/* Other Contact Methods */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">その他の連絡方法</h2>
              
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-100">
                    <Twitter className="h-5 w-5 text-sky-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">Twitter / X</div>
                    <div className="text-xs text-slate-500">DMでもお気軽に</div>
                  </div>
                </a>

                <a 
                  href="#" 
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
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

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6">
              <h3 className="mb-2 text-sm font-bold text-slate-700">よくある質問</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2">
                  <span className="text-violet-500">Q:</span>
                  計算結果が学校と違う場合は？
                </li>
                <li className="pl-4 text-slate-500">
                  → 地域・学校で計算方法が異なります。目安としてご利用ください。
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-500">Q:</span>
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
