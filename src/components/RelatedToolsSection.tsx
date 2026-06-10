import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  href: string;
  title: string;
  desc?: string;
  /** 外部（姉妹サイト等）。新規タブで開く。 */
  external?: boolean;
}

interface RelatedToolsSectionProps {
  heading?: string;
  links: RelatedLink[];
  className?: string;
}

/**
 * 「次の一手 / 関連ツール」共通ブロック（内部リンク・情報設計 §7）。
 * 評価（リンクジュース）を換金面・稼ぎ頭へ流すためのハブ。各ページで使い回せる純presentational。
 */
export function RelatedToolsSection({ heading = '次の一手・関連ツール', links, className = '' }: RelatedToolsSectionProps) {
  if (links.length === 0) return null;
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${className}`}>
      <h2 className="mb-4 text-base font-bold text-slate-800">{heading}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400 transition-transform group-hover:translate-x-0.5" />
              <span>
                <span className="block text-sm font-bold text-slate-800">{l.title}</span>
                {l.desc && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{l.desc}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
