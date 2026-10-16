'use client';

import { useState } from 'react';
import { Send, CheckCircle } from '@/components/icons';

import { CONTACT_EMAIL, submitContact, openMailtoFallback } from '@/lib/contact';

interface ErrorReportFormProps {
  prefectureCode: string;
  prefectureName: string;
}

export function ErrorReportForm({ prefectureCode, prefectureName }: ErrorReportFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Webhook配信できず mailto フォールバックした場合 true
  const [mailtoMode, setMailtoMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const subject = `[誤り報告] ${prefectureName}（${prefectureCode}）: ${formData.get('type')}`;
    const detail = (formData.get('detail') as string) || '';
    const email = (formData.get('email') as string) || '';

    try {
      const result = await submitContact({ type: 'error-report', subject, message: detail, email });

      if (result.ok && result.delivered) {
        setMailtoMode(false);
      } else if (result.error) {
        alert(result.error);
        return;
      } else {
        // 配信先未設定／失敗 → メールアプリで確実に届ける
        openMailtoFallback(subject, `${detail}\n\n返信先: ${email || '(なし)'}`);
        setMailtoMode(true);
      }
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-[17px] font-bold text-slate-900">
          <CheckCircle className="h-5 w-5 shrink-0 text-brand-700" />
          ご報告ありがとうございます
        </h3>
        {mailtoMode ? (
          <p className="mt-2 text-sm leading-[1.8] text-slate-900">
            メールアプリに内容を下書きしました。<strong>そのまま送信</strong>してください。<br />
            開かない場合は <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">{CONTACT_EMAIL}</a> までお願いします。
          </p>
        ) : (
          <p className="mt-2 text-sm leading-[1.8] text-slate-900">
            内容を確認し、必要に応じて修正いたします。
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="text-[17px] font-bold text-slate-900">情報の誤りを報告する</h3>

      <p className="mt-2 text-sm leading-[1.8] text-slate-900">
        {prefectureName}の内申点情報について、誤りや古い情報を見つけましたか？ご報告をお願いします。
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="error-report-type" className="mb-1 block text-sm font-bold text-slate-900">
            報告内容 <span className="text-red-700">*</span>
          </label>
          <select
            id="error-report-type"
            name="type"
            required
            className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
          >
            <option value="">選択してください</option>
            <option value="calculation">計算式が間違っている</option>
            <option value="score">満点や配点が間違っている</option>
            <option value="rule">制度説明が古い・間違っている</option>
            <option value="source">公式資料のリンクが切れている</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div>
          <label htmlFor="error-report-detail" className="mb-1 block text-sm font-bold text-slate-900">
            詳細 <span className="text-red-700">*</span>
          </label>
          <textarea
            id="error-report-detail"
            name="detail"
            required
            rows={3}
            placeholder="具体的な誤り内容や、正しい情報をご記入ください"
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        <div>
          <label htmlFor="error-report-email" className="mb-1 block text-sm font-bold text-slate-900">
            メールアドレス（任意）
          </label>
          <input
            id="error-report-email"
            type="email"
            name="email"
            placeholder="確認が必要な場合にご連絡します"
            className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              送信中...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              送信する
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-sm leading-[1.8] text-slate-600">
        ※ ご報告いただいた内容は、サイトの品質向上のために使用いたします。
      </p>
    </div>
  );
}
