import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, AlertTriangle } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SITE_URL } from '@/lib/naishin-dataset';
import {
  ORU_GRADES,
  ORU_GRADE_LABEL,
  ORU_HIGHLIGHT_CODES,
  getOruExamples,
  parseOruGrade,
  type OruGrade,
} from '@/lib/naishin-oru-content';

interface PageProps {
  params: Promise<{ grade: string }>;
}

export function generateStaticParams() {
  return ORU_GRADES.map((g) => ({ grade: String(g) }));
}

function buildFaq(grade: OruGrade, examples: ReturnType<typeof getOruExamples>) {
  const tokyo = examples.find((e) => e.code === 'tokyo');
  const kanagawa = examples.find((e) => e.code === 'kanagawa');
  const label = ORU_GRADE_LABEL[grade];
  return [
    {
      question: `${label}の内申点は何点ですか？`,
      answer: `都道府県ごとに満点・計算方式（学年別の重み付けや実技教科の倍率）が異なるため、全国共通の1つの答えはありません。例えば東京都の計算方式では${label}は${tokyo?.score ?? '-'}点満点${tokyo?.maxScore ?? '-'}点中、神奈川県の計算方式では${kanagawa?.score ?? '-'}点満点${kanagawa?.maxScore ?? '-'}点中になります。自分の都道府県の正確な数字は、下の一覧または内申点計算ツールで確認してください。`,
    },
    {
      question: `${label}なら、行ける高校は決まりますか？`,
      answer:
        '内申点は合否を決める要素の1つですが、それだけでは決まりません。多くの都道府県では入試当日の学力検査の得点と組み合わせて合否が判定され、学校ごとの合格基準（ボーダー）は年度・倍率によって毎年変動します。特定の学校名で「この内申点なら合格できる」と断定できる一次情報は公表されていないため、このページでは掲載していません。志望校の正確な合格基準は、その高校や都道府県教育委員会が公表する入試情報を必ず確認してください。',
    },
    {
      question: '換算内申とは何ですか？',
      answer:
        '「換算内申」は、9教科の評定をそのまま合計するのではなく、都道府県が定める計算方式（実技教科を重視する倍率や、学年ごとの重み付けなど）で置き換えた内申点のことです。同じ評定でも都道府県によって換算後の点数・満点が異なります。',
    },
    {
      question: `${label}から内申点を上げるには？`,
      answer:
        '9教科すべてを同時に伸ばすのは大変ですが、内申点は日々の提出物・授業態度・定期テストの積み重ねで決まるため、今日からの行動で変えられます。学年別にやるべきことを整理したページも用意しています。',
    },
    ...(grade === 3
      ? [
          {
            question: 'オール3（内申27）で私立高校に行けますか？',
            answer:
              '公立高校とは別に、私立高校では内申点の基準を満たすと合格の可能性が大きく上がる「併願優遇」「確約」といった制度を設けている学校が多くあります。内申27（9科）や内申15（5科）を基準値に置く中堅私立高校は珍しくなく、公立が第一志望でも滑り止めとして検討する価値があります。ただし基準や制度は学校・年度によって異なり、特定の学校名を断定して挙げることはできないため、詳しい制度解説は「オール3で行ける高校一覧の記事」で確認してください。',
          },
        ]
      : []),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade: gradeParam } = await params;
  const grade = parseOruGrade(gradeParam);
  if (!grade) return {};
  const label = ORU_GRADE_LABEL[grade];
  // grade=3(オール3)は「オール3で行ける高校」実測クエリ(週数千imp)の受け皿。
  // 学校名は断定しない方針を保ったまま、検索意図(高校の探し方)に title で正面対応する。
  const isOru3 = grade === 3;
  const title = isOru3
    ? `オール3で行ける高校の探し方｜内申点は何点になる？【47都道府県】 | My Naishin`
    : `${label}の内申点は何点？【47都道府県の計算例】 | My Naishin`;
  const description = isOru3
    ? `「オール3で行ける高校」を探す前に、まず内申点が実際に何点になるかを47都道府県の計算方式で確認できます。学校ごとの合格基準は年度で変動するため断定はせず、正確な内申点の計算結果と志望校選びの考え方を解説します。`
    : `9教科すべての評定が${grade}だったときの内申点を、47都道府県の計算方式で実際に計算しました。都道府県ごとの満点・換算内申の目安がすぐにわかります。`;
  const url = `${SITE_URL}/naishin-oru/${grade}`;
  return {
    title,
    description,
    keywords: isOru3
      ? [`オール3 行ける高校`, `オール3 内申点`, `オール3 換算内申`, `オール3 高校`, `内申点 オール3`]
      : [`${label} 内申点`, `${label} 換算内申`, `${label} 内申点 何点`, `内申点 ${label}`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  };
}

export default async function NaishinOruGradePage({ params }: PageProps) {
  const { grade: gradeParam } = await params;
  const grade = parseOruGrade(gradeParam);
  if (!grade) notFound();

  const label = ORU_GRADE_LABEL[grade];
  const url = `${SITE_URL}/naishin-oru/${grade}`;
  const examples = getOruExamples(grade);
  const highlighted = ORU_HIGHLIGHT_CODES.map((code) => examples.find((e) => e.code === code)).filter(
    (e): e is (typeof examples)[number] => Boolean(e)
  );
  const faqItems = buildFaq(grade, examples).map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: 'オール3・4・5の内申点は何点？', url: `${SITE_URL}/naishin-oru` },
          { name: `${label}の内申点`, url },
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-oru" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">オール3・4・5の内申点は何点？</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">{label}</span>
          </nav>

          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">{label}の内申点は何点になる？</h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              9教科すべての評定が{grade}だった場合の内申点を、都道府県ごとの計算方式で実際に計算した一覧です。都道府県によって満点も計算式（学年別の重み付け・実技教科の倍率）も異なるため、同じ{label}でも点数と満点に対する割合は変わります。
            </p>
          </header>

          <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              「{label}で行ける高校」を検索する方が多いですが、学校ごとの合格基準（ボーダー）は年度・倍率で毎年変動し、公表されている一次情報がないため、このページで特定の学校名は挙げていません。ここで確認できるのは「{label}の内申点が実際に何点になるか」という計算結果のみです。志望校の正確な合格基準は、その高校や都道府県教育委員会の入試情報で確認してください。
              {grade === 3 && (
                <>
                  {' '}
                  地域ごとの偏差値レンジの目安（学校名の断定なし）は
                  <Link href="/blog/all-3-high-school-options-2026-update" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    オール3で行ける高校一覧の記事
                  </Link>
                  でも紹介しています。私立高校の併願優遇については、学校の公式サイトで内申基準を確認できた例を
                  <Link href="/heigan-yuugu/tokyo" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    東京都の併願優遇 公式基準まとめ
                  </Link>
                  で紹介しています。
                </>
              )}
            </p>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">
              主要都道府県の{label}の内申点
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 text-left font-bold">都道府県</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">{label}の内申点</th>
                    <th scope="col" className="py-2 text-right font-bold">満点に対する割合</th>
                  </tr>
                </thead>
                <tbody>
                  {highlighted.map((e) => (
                    <tr key={e.code} className="border-b border-slate-200 last:border-0">
                      <td className="pr-3">
                        <Link href={`/${e.code}/naishin`} className="inline-flex min-h-[44px] items-center font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                          {e.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums text-slate-900">
                        {e.score}点 / {e.maxScore}点満点
                      </td>
                      <td className="py-2 text-right tabular-nums text-slate-900">{e.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <details className="mt-10 rounded-lg border border-slate-200 bg-white">
            <summary className="min-h-[44px] cursor-pointer px-5 py-3 text-base font-bold text-slate-900 md:px-6">47都道府県すべての{label}の内申点を見る</summary>
            <div className="overflow-x-auto px-5 pb-5 md:px-6 md:pb-6">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-xs text-slate-600">
                    <th scope="col" className="py-2 pr-3 text-left font-bold">都道府県</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">{label}の内申点</th>
                    <th scope="col" className="py-2 text-right font-bold">満点に対する割合</th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((e) => (
                    <tr key={e.code} className="border-b border-slate-200 last:border-0">
                      <td className="pr-3">
                        <Link href={`/${e.code}/naishin`} className="inline-flex min-h-[44px] items-center font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                          {e.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums text-slate-900">
                        {e.score}点 / {e.maxScore}点満点
                      </td>
                      <td className="py-2 text-right tabular-nums text-slate-900">{e.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <section className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">9教科すべてが{grade}とは限らない方へ</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">
              実際は教科ごとに評定が違うことがほとんどです。教科ごとの評定を入力すれば、あなたの正確な内申点をその場で計算できます。
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800"
            >
              自分の内申点を計算する（47都道府県）
            </Link>
          </section>

          <div className="mt-10">
            <ParentLeadCTA
              placement="naishin-up"
              heading={`${label}前後から、志望校との距離を正しく把握しませんか`}
              body="内申点だけでなく、当日の学力検査との組み合わせで合否は決まります。今からできる対策を、オンライン個別指導の無料体験で具体的に確認できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              {faqItems.map((f) => (
                <div key={f.question} className="py-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Q. {f.question}</h3>
                  <p className="mt-1 text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">他の評定パターンを見る</h2>
            <ul className="mt-2 divide-y divide-slate-200">
              {ORU_GRADES.filter((g) => g !== grade).map((g) => (
                <li key={g}>
                  <Link
                    href={`/naishin-oru/${g}`}
                    className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    {ORU_GRADE_LABEL[g]}
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/naishin-age-kata"
                  className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  内申点の上げ方（学年別）へ
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
