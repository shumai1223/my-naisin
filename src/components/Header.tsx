import Link from 'next/link';

import { APP_NAME, APP_NAME_JA } from '@/lib/constants';

const NAV: { href: string; label: string }[] = [
  { href: '/', label: '内申点を計算' },
  { href: '/prefectures', label: '都道府県' },
  { href: '/koukou-hiyou', label: '高校の費用' },
  { href: '/blog', label: 'コラム' },
  { href: '/quality', label: 'データと出典' },
  { href: '/about', label: '運営について' },
];

/**
 * サイトの上部。バナーやヒーローは置かない（デザインシステム「やさしい学習帳」）。
 * titleTag='h1' はトップページが <h1> にサイト名を使うための指定。
 */
export function Header({ titleTag = 'p' }: { titleTag?: 'h1' | 'p' } = {}) {
  const TitleTag = titleTag;
  return (
    <header className="border-b border-slate-200 bg-white print:hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 md:px-6">
        <TitleTag className="text-lg font-bold leading-tight text-brand-800">
          <Link href="/" className="hover:underline hover:underline-offset-2">
            {APP_NAME}
            <span className="mx-2 text-slate-400">|</span>
            <span className="text-slate-700">{APP_NAME_JA}</span>
          </Link>
        </TitleTag>
        <nav aria-label="主なページ" className="-mx-2 flex w-full gap-0.5 overflow-x-auto md:ml-auto md:w-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-brand-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
