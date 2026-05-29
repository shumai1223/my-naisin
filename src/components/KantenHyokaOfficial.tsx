import { ExternalLink, ShieldCheck, BookOpenCheck } from 'lucide-react';

/**
 * 観点別評価（3観点）と評定の公式な仕組みを、文部科学省の一次情報を出典として解説する権威コンテンツ。
 *
 * 目的：
 *  - 最大母数キーワード「内申点 計算」を扱うトップページに、独自性のある一次情報ベースの解説を置き、
 *    E-E-A-T（特に Authoritativeness / Trust）を補強する。
 *  - 文科省（mext.go.jp）への正当な外部リンクで、テーマの権威性をGoogleに示す。
 *
 * 重要：本文は文科省「指導要録の改善等について（通知）平成31年3月29日」等の一次情報に基づく。
 * 観点別評価（A/B/C）から評定（5段階）への全国統一の換算式は通知に規定されていないため、
 * 固定換算を断言せず「学校・教育委員会が定める」と正確に記載している（捏造防止）。
 */
export function KantenHyokaOfficial() {
  const KANTEN = [
    {
      name: '知識・技能',
      pillar: '「知識及び技能」の習得',
      desc: '用語・公式・基礎事項を理解し、それを使いこなせるか。定期テストのうち基礎〜標準問題で主に測られます。',
    },
    {
      name: '思考・判断・表現',
      pillar: '「思考力，判断力，表現力等」の育成',
      desc: '知識を活用して課題を解決し、根拠を示して説明・記述できるか。応用問題・記述問題・レポートで評価されます。',
    },
    {
      name: '主体的に学習に取り組む態度',
      pillar: '「学びに向かう力，人間性等」の涵養',
      desc: '粘り強く取り組み、自らの学習を調整しようとしているか。振り返りシート・提出物・授業での取り組みから評価されます。',
    },
  ];

  return (
    <section
      aria-labelledby="kanten-hyoka-heading"
      className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-6 md:p-8"
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
        <ShieldCheck className="h-3 w-3" />
        文部科学省 一次情報にもとづく解説
      </div>
      <h2 id="kanten-hyoka-heading" className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900">
        <BookOpenCheck className="h-5 w-5 text-emerald-600" />
        内申点の土台「観点別評価（3観点）」と評定の関係
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-slate-700">
        内申点（調査書点）のもとになる通知表の「評定（5〜1）」は、各教科を
        <strong>3つの観点</strong>で評価した結果を総括して決められます。これは
        2017・2018年改訂の学習指導要領にもとづき、文部科学省が全国共通の枠組みとして定めたものです。
        観点別評価（A・B・C＝学習状況を<strong>分析的</strong>に捉える）と評定（5段階＝<strong>総括的</strong>に捉える）は、
        互いを補い合う関係にあるとされています。
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {KANTEN.map((k, i) => (
          <div key={k.name} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">
                {i + 1}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{k.name}</h3>
            </div>
            <div className="mb-1 text-[11px] font-bold text-emerald-700">{k.pillar}</div>
            <p className="text-xs leading-relaxed text-slate-600">{k.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
        <p className="text-xs leading-relaxed text-amber-900">
          <strong>ポイント：</strong>3観点（A・B・C）から評定（5・4・3・2・1）への
          <strong>換算方法に全国統一のルールはありません</strong>。
          各学校・各教育委員会が定めた基準で総括されるため、「3観点すべてA＝必ず5」とは限りません。
          だからこそ、提出物・授業態度（＝主体的に学習に取り組む態度）まで含めた総合的な対策が内申点アップの近道です。
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
        <a
          href="https://www.mext.go.jp/b_menu/hakusho/nc/1415169.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          文科省「指導要録の改善等について（通知）平成31年3月29日」
        </a>
        <a
          href="https://www.mext.go.jp/a_menu/shotou/new-cs/qa/1421956.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          文科省「学習評価に関するQ&A」
        </a>
      </div>
    </section>
  );
}
