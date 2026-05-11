'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  /** CSS selector of the element whose scroll progress is tracked. Defaults to the article body. */
  targetSelector?: string;
}

export function ReadingProgressBar({ targetSelector = 'article' }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = document.querySelector<HTMLElement>(targetSelector);
      if (!target) {
        setProgress(0);
        return;
      }
      const rect = target.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height - viewportH;
      // distance scrolled past the top of the article
      const scrolled = -rect.top;
      if (total <= 0) {
        setProgress(rect.top <= 0 ? 100 : 0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setProgress(ratio * 100);
    };

    update();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetSelector]);

  return (
    <div
      role="progressbar"
      aria-label="記事の読書進捗"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed top-0 left-0 right-0 z-40 h-1 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-100 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
