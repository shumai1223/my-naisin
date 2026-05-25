"use client";

import dynamic from 'next/dynamic';
import Loader from '@/components/ui/Loader';

const InteractiveCalculator = dynamic(() =>
  import('@/components/Calculator/InteractiveCalculator').then(mod => mod.InteractiveCalculator),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Loader variant="inline" message="計算ツールを読み込んでいます..." />
      </div>
    )
  }
);

export default InteractiveCalculator;
