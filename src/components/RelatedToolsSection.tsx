import Link from 'next/link';

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
    <section className={`rounded-lg border border-slate-200 bg-white p-5 md:p-6 ${className}`}>
      <h2 className="mb-2 text-xl font-bold text-slate-900">{heading}</h2>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href} className="border-t border-slate-200">
            <Link
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group block min-h-[44px] py-3"
            >
              <span className="block text-base font-bold text-brand-700 underline underline-offset-2 group-hover:text-brand-800">{l.title}</span>
              {l.desc && <span className="mt-1 block text-sm leading-relaxed text-slate-600">{l.desc}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
