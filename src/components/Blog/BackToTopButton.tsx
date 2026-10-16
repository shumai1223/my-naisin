'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from '@/components/icons';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="ページ先頭へ戻る"
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center justify-center rounded border border-slate-300 bg-white p-3 text-slate-700 transition-[opacity,visibility,background-color] duration-150 hover:bg-brand-50 hover:text-brand-800 motion-reduce:transition-none ${
        visible ? 'opacity-100' : 'invisible opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
