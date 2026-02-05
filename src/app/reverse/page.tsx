"use client";

import * as React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { ChevronLeft, Home } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const ReverseCalculator = nextDynamic(
  () => import('@/components/Calculator/ReverseCalculator').then((mod) => mod.ReverseCalculator),
  { ssr: false }
);

export default function ReversePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <Header />

            <main className="px-4 pb-10 md:px-6">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
                  <Home className="h-4 w-4" />
                  ホーム
                </Link>
                <span>/</span>
                <span className="text-slate-700">志望校から逆算</span>
              </nav>

              <ReverseCalculator 
                onBack={() => window.location.href = '/'} 
              />
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
