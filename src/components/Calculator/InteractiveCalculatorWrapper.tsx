"use client";

import dynamic from 'next/dynamic';

const InteractiveCalculator = dynamic(() => 
  import('@/components/Calculator/InteractiveCalculator').then(mod => mod.InteractiveCalculator), 
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">計算ツールを読み込んでいます...</p>
      </div>
    )
  }
);

export default InteractiveCalculator;