'use client';

/**
 * 匿名統計オプトインUI（TIER N-1）。
 *
 * ⚠️ このコンポーネントは意図的にどのページにもマウントしていない（build-not-launch）。
 * 理由: 現時点で送信先API（N-3・/api/stats/*相当）・集計スキーマ（N-2・D1 migration）が
 * いずれも未実装のため、ここで同意しても実際には何も収集・送信されない。実体の無い同意を
 * ユーザーに求める見せかけの機能を公開しないため、N-2（D1 migration適用・👤監督付き）と
 * N-3（集計API実装）が揃った時点で初めて結果画面へ組み込む。状態管理自体は
 * src/lib/stats-consent.ts に実装済みでテスト済み＝結線するだけで機能する状態で待機している。
 */
import { useEffect, useState } from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';

import { readStatsConsent, grantStatsConsent, revokeStatsConsent } from '@/lib/stats-consent';

export function StatsOptIn({ className = '' }: { className?: string }) {
  const [granted, setGranted] = useState(false);
  const [consentedAt, setConsentedAt] = useState<string | null>(null);

  useEffect(() => {
    const state = readStatsConsent();
    setGranted(state.granted);
    setConsentedAt(state.consentedAt);
  }, []);

  const handleToggle = () => {
    if (granted) {
      const state = revokeStatsConsent();
      setGranted(state.granted);
      setConsentedAt(state.consentedAt);
    } else {
      const state = grantStatsConsent();
      setGranted(state.granted);
      setConsentedAt(state.consentedAt);
    }
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={granted}
          onChange={handleToggle}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            匿名で統計に協力する（任意）
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-500">
            氏名等は一切含まれない計算結果（内申点・偏差値等の数値のみ）を、全国の傾向を示す統計データの作成に役立てます。個人を特定できる情報は収集しません。この同意はいつでも撤回できます。
          </span>
        </span>
      </label>
      {granted && consentedAt && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          {new Date(consentedAt).toLocaleDateString('ja-JP')}に同意済み
        </p>
      )}
    </div>
  );
}
