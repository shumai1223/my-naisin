import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ChevronRight, Home, AlertCircle, ExternalLink, Info } from 'lucide-react';

import { getPrefectureAlternativeTracks, ALTERNATIVE_TRACK_PREFECTURE_CODES } from '@/lib/teiji-tsushin-options';
import { PREFECTURES } from '@/lib/prefectures';
import { selectLeadOffer } from '@/lib/lead-config';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebPageSchema } from '@/components/StructuredData/WebPageSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

const BASE = 'https://my-naishin.com';

// T-P1 P1-4: データがある都道府県だけを静的生成する（Y-0憲法・薄いページの量産を避けるため
// ALTERNATIVE_TRACK_PREFECTURE_CODESに無い県はページ自体を作らない）。
export function generateStaticParams() {
  return ALTERNATIVE_TRACK_PREFECTURE_CODES.map((code) => ({ prefecture: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefecture } = await params;
  const data = getPrefectureAlternativeTracks(prefecture);
  const pref = PREFECTURES.find((p) => p.code === prefecture);
  if (!data || !pref) return { title: '定時制・通信制の選択肢 | My Naishin' };

  const title = `${pref.name}の定時制・通信制高校一覧｜募集人員・倍率（公表値） | My Naishin`;
  const description = `${pref.name}教育委員会が公表した定時制・通信制課程${data.schoolCount}校の募集人員・出願者数・倍率をそのまま掲載。全日制以外にも公表されている選抜枠があることを、制度の説明としてまとめています。`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${pref.code}/teiji-tsushin` },
  };
}

export default async function PrefectureTeijiTsushinPage({ params }: PageProps) {
  const { prefecture } = await params;
  const data = getPrefectureAlternativeTracks(prefecture);
  const pref = PREFECTURES.find((p) => p.code === prefecture);
  if (!data || !pref) notFound();

  const url = `${BASE}/${pref.code}/teiji-tsushin`;
  const offer = selectLeadOffer({ prefectureCode: pref.code, placement: 'prefecture' });
  const teijiSchools = data.schools.filter((s) => s.trackType === '定時制');
  const tsushinSchools = data.schools.filter((s) => s.trackType === '通信制');
  const latestSource = data.sources[data.sources.length - 1];

  return (
    <>
      <WebPageSchema
        title={`${pref.name}の定時制・通信制高校一覧`}
        description={`${pref.name}教育委員会が公表した定時制・通信制課程の募集人員・出願者数・倍率をそのまま掲載。`}
        url={url}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: pref.name, url: `${BASE}/${pref.code}` },
          { name: '定時制・通信制', url },
        ]}
      />
      <DatasetSchema
        name={`${pref.name}の定時制・通信制高校`}
        description={`${pref.name}の公立高校 定時制・通信制課程の学校名・学科・募集人員・出願者数・倍率（${latestSource.fiscalYear}）。${latestSource.docTitle}に基づく。`}
        url={url}
        variableMeasured={['募集人員', '出願者数', '倍率']}
        dateModified={latestSource.fetchedAt}
        citation={latestSource.url}
        keywords={[pref.name, '定時制', '通信制', '倍率', '公立高校入試']}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${pref.code}`} className="hover:text-blue-600">
              {pref.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">定時制・通信制</span>
          </nav>

          {/* Header */}
          <header className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-xl">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {pref.name}の定時制・通信制高校一覧
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              全日制以外にも、{pref.name}教育委員会が公表している選抜区分があります。制度として
              どういう枠があるかを、募集人員・出願者数・倍率とあわせてそのまま掲載しています。
            </p>
          </header>

          {/* ガードレール注記（P1-0：あなたはここへ行くべきとは書かない・不安を煽らない） */}
          <div className="mb-8 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              このページは{pref.name}教育委員会が公表した資料に基づく<strong>制度の説明</strong>です。
              「この枠を選ぶべき」という判断や優劣は示していません。定時制・通信制はどちらも卒業すれば全日制と同じ高卒資格が得られる、公表された制度上の選択肢です。
              進路の判断は、在籍校の先生・各教育委員会の最新情報とあわせてご検討ください。
            </p>
          </div>

          {data.coverageStatus === 'partial' && (
            <div className="mb-8 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-xs leading-relaxed text-slate-600">{data.coverageNote}</p>
            </div>
          )}

          {teijiSchools.length > 0 && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-800">定時制課程（{teijiSchools.length}件）</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-3 font-medium">学校名</th>
                      <th className="py-2 pr-3 font-medium">学科</th>
                      <th className="py-2 pr-3 text-right font-medium">募集人員</th>
                      <th className="py-2 pr-3 text-right font-medium">出願者数</th>
                      <th className="py-2 text-right font-medium">倍率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teijiSchools.map((s, i) => (
                      <tr key={`${s.schoolName}-${s.department}-${i}`} className="border-b border-slate-100">
                        <td className="py-2 pr-3 font-bold text-slate-800">{s.schoolName}</td>
                        <td className="py-2 pr-3 text-slate-600">{s.department}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{s.quota}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{s.finalApplicants}</td>
                        <td className="py-2 text-right font-bold text-slate-800">{s.finalRate.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tsushinSchools.length > 0 && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-800">通信制課程（{tsushinSchools.length}件）</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-3 font-medium">学校名</th>
                      <th className="py-2 pr-3 font-medium">学科</th>
                      <th className="py-2 pr-3 text-right font-medium">募集人員</th>
                      <th className="py-2 pr-3 text-right font-medium">出願者数</th>
                      <th className="py-2 text-right font-medium">倍率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tsushinSchools.map((s, i) => (
                      <tr key={`${s.schoolName}-${s.department}-${i}`} className="border-b border-slate-100">
                        <td className="py-2 pr-3 font-bold text-slate-800">{s.schoolName}</td>
                        <td className="py-2 pr-3 text-slate-600">{s.department}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{s.quota}</td>
                        <td className="py-2 pr-3 text-right text-slate-600">{s.finalApplicants}</td>
                        <td className="py-2 text-right font-bold text-slate-800">{s.finalRate.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 通信制・定時制とは何かという一般的な説明への誘導（重複を避けるため相互リンクのみ） */}
          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            定時制・通信制・サポート校・フリースクールの違いや選び方は
            <Link href="/futoukou/tsugaku" className="mx-1 font-bold text-teal-700 underline">
              通信制高校・フリースクールという選択肢
            </Link>
            で解説しています。
          </div>

          {/* 保護者向けリード */}
          <ParentLeadCTA
            className="mt-2"
            placement="prefecture"
            prefectureCode={pref.code}
            heading={offer.heading}
            body={offer.body}
            affiliateId={offer.affiliateId}
            ctaText={offer.ctaText}
            note={offer.note}
          />

          {/* 出典 */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-800">
                本ページの数値は{pref.name}教育委員会が公表した資料に基づく参考情報です。年度によって
                募集人員・実施校が変わる場合があります。最新の情報は
                <a href={latestSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-bold text-amber-900 underline">
                  {pref.name}教育委員会の公式情報
                  <ExternalLink className="h-3 w-3" />
                </a>
                でご確認ください（確認日：{latestSource.fetchedAt}）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
