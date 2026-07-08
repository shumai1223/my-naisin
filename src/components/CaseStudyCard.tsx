import type { LucideIcon } from 'lucide-react';
import { Quote } from 'lucide-react';

export type CaseStudyOrganizationType = 'school' | 'juku' | 'developer' | 'media';

export interface CaseStudyData {
  /** 組織種別（school=学校・juku=塾/家庭教師・developer=開発者/SaaS・media=教育メディア）。 */
  organizationType: CaseStudyOrganizationType;
  /** 組織名（実名掲載の許諾を得てから入力する。匿名希望の場合は「○○塾様（地域：関東）」等の形式）。 */
  organizationLabel: string;
  /** 活用方法の一言（例: 「学校サイトに埋め込みウィジェットを設置」）。 */
  useCaseSummary: string;
  /** 導入の決め手・効果についての引用（本人の言葉をそのまま。要約・誇張しない）。 */
  quote: string;
  /** 引用元の役職・立場（例: 「進路指導主任」「塾長」）。任意。 */
  quoteAttribution?: string;
  /** 掲載許諾を得た日付（YYYY-MM-DD）。捏造防止のため、許諾が確認できるまでコンポーネントを使用しない。 */
  consentConfirmedAt: string;
}

const ORG_TYPE_LABEL: Record<CaseStudyOrganizationType, string> = {
  school: '学校・教育機関',
  juku: '塾・家庭教師',
  developer: '開発者・SaaS',
  media: '教育メディア',
};

/**
 * 導入事例カード（TIER P-5）。
 *
 * 実際の導入事例が確認でき、掲載許諾（consentConfirmedAt）を得たデータのみで使用する。
 * 2026-07-09時点で実導入事例は0件のため、このコンポーネントはどのページにも組み込まれていない
 * （組み込むと「事例がある」という誤った印象を与える＝捏造に相当するため）。
 * 実事例が出た際は、docs/case-study-interview-questions.md の質問票で取材し、
 * このコンポーネントに実データを渡すだけで即座に公開できる（P-5の「型」）。
 */
export function CaseStudyCard({ data, icon: Icon, className = '' }: { data: CaseStudyData; icon?: LucideIcon; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-3 flex items-center gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <div className="text-sm font-bold text-slate-800">{data.organizationLabel}</div>
          <div className="text-xs text-slate-500">{ORG_TYPE_LABEL[data.organizationType]} ／ {data.useCaseSummary}</div>
        </div>
      </div>
      <blockquote className="flex gap-2 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <Quote className="h-4 w-4 shrink-0 text-slate-300" />
        <span>{data.quote}</span>
      </blockquote>
      {data.quoteAttribution && (
        <p className="mt-2 text-right text-xs text-slate-500">— {data.quoteAttribution}</p>
      )}
    </div>
  );
}
