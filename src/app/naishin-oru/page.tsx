import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from '@/components/icons';

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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">オール3・4・5の内申点は何点？</span>
          </nav>

          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              オール3・オール4・オール5の内申点は何点？
            </h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              9教科すべての評定が同じ数字だった場合の内申点を、都道府県ごとの計算方式（学年別倍率・実技教科の重み付け）で実際に計算した例をまとめました。都道府県によって満点も計算式も異なるため、同じ「オール3」でも点数や満点に対する割合は変わります。
            </p>
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {ORU_GRADES.map((grade) => (
              <li key={grade}>
                <Link
                  href={`/naishin-oru/${grade}`}
                  className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:bg-brand-50"
                >
                  <span className="text-xl font-bold text-brand-700 underline underline-offset-2">{ORU_GRADE_LABEL[grade]}</span>
                  <span className="mt-1 text-sm text-slate-600">の内申点を都道府県別に見る</span>
                </Link>
              </li>
            ))}
          </ul>

          <section className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">自分の実際の内申点を計算する</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">
              9教科すべてが同じ評定とは限りません。教科ごとの実際の評定を入力すれば、正確な内申点をその場で計算できます。
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800"
            >
              自分の内申点を計算する（47都道府県）
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
