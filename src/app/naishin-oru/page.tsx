import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Calculator } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { SITE_URL } from '@/lib/naishin-dataset';
import { ORU_GRADES, ORU_GRADE_LABEL } from '@/lib/naishin-oru-content';

export const metadata: Metadata = {
  title: 'オール3・オール4・オール5の内申点は何点？【都道府県別計算例】 | My Naishin',
  description:
    '9教科すべての評定が3・4・5だったときの内申点を、都道府県ごとの計算方式で実際に計算した例をまとめました。満点・換算内申の目安をすぐに確認できます。',
  alternates: { canonical: `${SITE_URL}/naishin-oru` },
};

export default function NaishinOruHubPage() {
  const url = `${SITE_URL}/naishin-oru`;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'オール3・4・5の内申点は何点？', url },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">オール3・4・5の内申点は何点？</span>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              オール3・オール4・オール5の内申点は何点？
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              9教科すべての評定が同じ数字だった場合の内申点を、都道府県ごとの計算方式（学年別倍率・実技教科の重み付け）で実際に計算した例をまとめました。都道府県によって満点も計算式も異なるため、同じ「オール3」でも点数や満点に対する割合は変わります。
            </p>
          </header>

          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            {ORU_GRADES.map((grade) => (
              <Link
                key={grade}
                href={`/naishin-oru/${grade}`}
                className="flex flex-col items-center rounded-2xl border-2 border-blue-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"
              >
                <span className="text-2xl font-bold text-blue-700">{ORU_GRADE_LABEL[grade]}</span>
                <span className="mt-1 text-xs text-slate-500">の内申点を都道府県別に見る</span>
              </Link>
            ))}
          </section>

          <section className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">自分の実際の内申点を計算する</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              9教科すべてが同じ評定とは限りません。教科ごとの実際の評定を入力すれば、正確な内申点をその場で計算できます。
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4" />
              自分の内申点を計算する（47都道府県）
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
