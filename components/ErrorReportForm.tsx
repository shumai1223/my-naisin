'use client';

import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle } from 'lucide-react';

interface ErrorReportFormProps {
  prefectureCode: string;
  prefectureName: string;
}

export function ErrorReportForm({ prefectureCode, prefectureName }: ErrorReportFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const reportData = {
      prefectureCode,
      prefectureName,
      type: formData.get('type') as string,
      detail: formData.get('detail') as string,
      email: formData.get('email') as string,
      timestamp: new Date().toISOString(),
    };

    // ここで実際の送信処理を実装（メール送信やスプレッドシート記録など）
    // 現在はconsole.logでデモ
    console.log('誤り報告:', reportData);
    
    // 送信完了をシミュレート
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-emerald-800">ご報告ありがとうございます</h3>
        <p className="mt-2 text-sm text-emerald-600">
          内容を確認し、必要に応じて修正いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-amber-800">情報の誤りを報告する</h3>
      </div>
      
      <p className="mb-4 text-sm text-amber-700">
        {prefectureName}の内申点情報について、誤りや古い情報を見つけましたか？ご報告をお願いします。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            報告内容 <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            詳細 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detail"
            required
            rows={3}
            placeholder="具体的な誤り内容や、正しい情報をご記入ください"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            メールアドレス（任意）
          </label>
          <input
            type="email"
            name="email"
            placeholder="確認が必要な場合にご連絡します"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <p className="mt-4 text-xs text-amber-600">
        ※ ご報告いただいた内容は、サイトの品質向上のために使用いたします。
      </p>
    </div>
  );
}
