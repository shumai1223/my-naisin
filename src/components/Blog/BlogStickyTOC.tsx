'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogStickyTOCProps {
  /** CSS selector for the article content root (default: ".blog-content") */
  rootSelector?: string;
}

export function BlogStickyTOC({ rootSelector = '.blog-content' }: BlogStickyTOCProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const headings = Array.from(
      root.querySelectorAll<HTMLElement>('h2[id], h3[id]'),
    ).filter((h) => h.id && h.textContent);

    const parsed: TocItem[] = headings.map((h) => ({
      id: h.id,
      text: (h.textContent || '').trim(),
      level: h.tagName === 'H2' ? 2 : 3,
    }));

    setItems(parsed);

    if (parsed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top of viewport that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: [0, 1],
      },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [rootSelector]);

  if (items.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    if (typeof history !== 'undefined') {
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <aside
      aria-label="目次"
      className="hidden xl:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      <div className="rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
          <List className="h-4 w-4 text-blue-500" />
          <h2 className="text-sm font-bold text-gray-800">目次</h2>
        </div>
        <nav>
          <ul className="space-y-1 text-sm">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={`block rounded-md py-1.5 px-2 leading-snug transition-colors ${
                      item.level === 3 ? 'pl-5 text-xs' : ''
                    } ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
