/**
 * click-fraud-detector.mjs — clicksテーブルの日別バーストがボット(referer/UA偽装)由来か
 * 統計的シグネチャで判定する共有ロジック。ops/THREATS.md 脅威13(TH-13・2026-08-20発見)の
 * 実測(08-13〜15・distinct ip比率0.98〜1・distinct user_agent8種類)を基準に設計。
 *
 * scripts/check-click-fraud-burst.mjs（手動/週次実行）と
 * src/scripts/daily-brief-health.ts（毎朝の自動ブリーフィング）の両方から使う単一の実装。
 *
 * ⚠️このファイルはjestのユニットテスト対象外（scripts/__tests__/scaffold-site.test.tsの
 * 冒頭コメントと同型の制約: ts-jestのCommonJS変換は素の.mjsのexport構文を直接importできない）。
 * 動作確認は①`node scripts/check-click-fraud-burst.mjs --days 30`を実行しTH-13実測(08-13/14/15の
 * 3日間のみ検知・distinct IP比率0.99〜1・distinct UA8)と一致することを確認する方法、②消費側
 * (`src/lib/daily-brief-health.ts`の`ClickFraudCheck`型を使うロジック)は`daily-brief-health.test.ts`
 * でカバーする方法、の2通りで代替している。
 */

// ⚠️2026-08-25の是正: 旧設定は minDailyClicks:50 だったため、08-16〜18・08-22の攻撃
// (1日7〜29件規模)を1件も検知できなかった。TH-13(1日134〜384件)だけを見て較正したのが誤り。
// 日単位の集計は「規模の大きい攻撃」しか捉えられない。小規模・低速な攻撃には
// 下の analyzeClickBursts()(バースト構造を見る・件数非依存)が主検知器になる。
export const CLICK_FRAUD_THRESHOLDS = {
  minDailyClicks: 15, // これ未満は偶然のばらつきが支配的なので日次判定の対象外
  minIpRatio: 0.85, // distinct_ip / total がこれ以上ならIPローテーション型を疑う
  maxDistinctUa: 12, // distinct_user_agent がこれ以下なら偽装UAの使い回しを疑う
};

// バースト検知の閾値。件数に依存しないため小規模な攻撃も捉えられる。
export const CLICK_BURST_THRESHOLDS = {
  // ⚠️2026-08-29の是正: 120秒では第3波(08-27〜)を1件も検知できなかった。
  // 第1波(08-13〜15)は8〜30秒間隔、第2波も同様だったが、第3波は**2〜15分間隔**まで
  // 速度を落としてきた。こちらが使っている窓に合わせて調整された可能性が高い。
  // 窓を広げるほど人間の再クリックを巻き込むリスクは上がるが、「全て別IP」という
  // 条件が同時に効くため誤検知は増えにくい（人間の再クリックはIPが同じ）。
  windowSeconds: 1800, // 30分
  minBurstSize: 3, // 窓を広げたぶん、最低件数を2→3に上げて偶然の同時刻を弾く
};

/**
 * ★2026-08-29追加: 「ブラウザが送らない形のreferer」を検知する。
 *
 * 第3波のbotは referer を **`https://my-naishin.com`（末尾スラッシュ無し・パス無し）**
 * にしていた。同一オリジンのナビゲーションでブラウザが送るのは必ず `https://my-naishin.com/`
 * または `https://my-naishin.com/<path>` であり、**オリジンだけの形は手書きの証拠**である。
 * （このサイトの Referrer-Policy は strict-origin-when-cross-origin ＝同一オリジンでは
 *   フルURLを送るため、正規の遷移でオリジンだけになることはない）
 *
 * @param {string|null|undefined} referer
 * @returns {boolean} true なら「ブラウザが送らない形」
 */
export function isImplausibleReferer(referer) {
  if (!referer) return false; // 空はここでは判定しない（正規のケースもある）
  // ⚠️末尾スラッシュを削って比較してはいけない。`https://my-naishin.com/`（スラッシュ付き）は
  // **トップページからの正規の遷移でブラウザが送る形**である。実際、初版で正規化したところ
  // UA29種・76件の人間クリックを誤検知した。**スラッシュが無い形だけが手書きの証拠。**
  const v = String(referer).trim();
  return v === 'https://my-naishin.com' || v === 'http://my-naishin.com';
}

/**
 * @param {{ d: string, ip_hash: string, user_agent: string }[]} rows
 * @returns {{ date: string, total: number, distinctIp: number, distinctUa: number, ipRatio: number, flagged: boolean }[]}
 *   日付昇順。flagged=trueの日がTH-13と同型のシグネチャに合致する疑わしい日。
 */
export function analyzeClickFraudByDay(rows) {
  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.d)) byDate.set(r.d, { total: 0, ips: new Set(), uas: new Set() });
    const bucket = byDate.get(r.d);
    bucket.total++;
    bucket.ips.add(r.ip_hash);
    bucket.uas.add(r.user_agent);
  }

  const { minDailyClicks, minIpRatio, maxDistinctUa } = CLICK_FRAUD_THRESHOLDS;
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, b]) => {
      const ipRatio = b.total > 0 ? b.ips.size / b.total : 0;
      const flagged = b.total >= minDailyClicks && ipRatio >= minIpRatio && b.uas.size <= maxDistinctUa;
      return { date, total: b.total, distinctIp: b.ips.size, distinctUa: b.uas.size, ipRatio, flagged };
    });
}

/**
 * バースト検知 — 同一 affiliate_id への短時間の連続クリックが「毎回別IP」から来ていたら
 * プロキシ回転型のクリック不正と判定する。
 *
 * なぜこれが効くか（2026-08-25に実データで確認した判別根拠）:
 *   人間が同じ広告を8〜30秒間隔で複数回踏むことはあり得るが、**そのIPは同じ**である。
 *   別IPから同じ広告へ秒単位で連続クリックが入るのは、住宅用プロキシプールを
 *   回している自動化クライアントしか起こしえない。実測でこの署名は114件見つかり、
 *   同一IPが別々の案件を1分弱かけて踏む「本物の回遊」とは明確に分離できた。
 *
 * 日次集計(analyzeClickFraudByDay)との役割分担:
 *   日次 = 規模の大きい攻撃を面で捉える / バースト = 規模に関係なく構造で捉える。
 *   08-16〜18の攻撃は1日7〜29件で日次では閾値に届かず、バーストでのみ検知できた。
 *
 * @param {{ id?: number|string, created_at: string, ip_hash: string, affiliate_id: string }[]} rows
 * @returns {{ bursts: {affiliateId: string, startedAt: string, size: number, ids: (number|string)[]}[], flaggedIds: Set<number|string>, byDate: Map<string, number> }}
 */
export function analyzeClickBursts(rows) {
  const { windowSeconds, minBurstSize } = CLICK_BURST_THRESHOLDS;
  const windowMs = windowSeconds * 1000;

  const byAffiliate = new Map();
  for (const r of rows) {
    const key = r.affiliate_id ?? '';
    if (!byAffiliate.has(key)) byAffiliate.set(key, []);
    byAffiliate.get(key).push(r);
  }

  const bursts = [];
  const flaggedIds = new Set();
  const byDate = new Map();

  for (const [affiliateId, list] of byAffiliate) {
    list.sort((a, b) => (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0));
    let i = 0;
    while (i < list.length) {
      const start = Date.parse(list[i].created_at.replace(' ', 'T') + 'Z');
      let j = i;
      while (j + 1 < list.length && Date.parse(list[j + 1].created_at.replace(' ', 'T') + 'Z') - start <= windowMs) j++;
      const group = list.slice(i, j + 1);
      const ips = new Set(group.map((r) => r.ip_hash));
      // 全て別IP ＝ プロキシ回転。1つでも同じIPが混ざれば人間の再クリックとして見逃す（偽陽性を避ける）。
      if (group.length >= minBurstSize && ips.size === group.length) {
        bursts.push({ affiliateId, startedAt: group[0].created_at, size: group.length, ids: group.map((r) => r.id) });
        for (const r of group) {
          flaggedIds.add(r.id);
          const d = String(r.created_at).slice(0, 10);
          byDate.set(d, (byDate.get(d) ?? 0) + 1);
        }
      }
      i = j + 1;
    }
  }

  bursts.sort((a, b) => (a.startedAt < b.startedAt ? -1 : a.startedAt > b.startedAt ? 1 : 0));
  return { bursts, flaggedIds, byDate };
}

const MOBILE_UA_RE = /Mobile|iPhone|Android/i;

export const MOBILE_RATIO_THRESHOLDS = {
  // これ未満の日はサンプルが少なくブレが支配的なので判定を見送る（オオカミ少年化を避ける）。
  minDailyClicksForMobileCheck: 10,
  // サイト全体はモバイル約74-80%（GSC実測）。50%を下回る日はデスクトップに偏りすぎており疑う。
  minExpectedMobileRatio: 0.5,
};

/**
 * ★2026-08-30追加(T-M2 M2-4): 日別のモバイル比率を集計し、実トラフィックの水準（GSC実測で
 * 約80%）から著しく下回った日を警告する。`src/lib/click-ratio-audit.ts`のhuman分類限定チェック
 * （偽装ヘッダ型ボットのすり抜け検知・サンプル数が少なく閾値0.30）とは目的が異なり、こちらは
 * 「デスクトップに偏った日は無条件に疑う」という日次の粗いスクリーニング（loop-question-note
 * 2026-08-29「検知器の自己点検」の指示どおり）。全クリック（bot判定前の生データ）を対象にする点も
 * click-ratio-audit.tsとの違い（あちらはclassifyClickでhumanと判定された後の内訳を見る）。
 *
 * @param {{ d: string, user_agent: string }[]} rows
 * @returns {{ date: string, total: number, mobile: number, mobileRatio: number, flagged: boolean }[]}
 *   日付昇順。flagged=trueの日がモバイル比率50%未満（最低件数に満たない日は判定を見送りflagged=false）。
 */
export function analyzeMobileRatioByDay(rows) {
  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.d)) byDate.set(r.d, { total: 0, mobile: 0 });
    const bucket = byDate.get(r.d);
    bucket.total++;
    if (MOBILE_UA_RE.test(r.user_agent ?? '')) bucket.mobile++;
  }

  const { minDailyClicksForMobileCheck, minExpectedMobileRatio } = MOBILE_RATIO_THRESHOLDS;
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, b]) => {
      const mobileRatio = b.total > 0 ? b.mobile / b.total : 0;
      const flagged = b.total >= minDailyClicksForMobileCheck && mobileRatio < minExpectedMobileRatio;
      return { date, total: b.total, mobile: b.mobile, mobileRatio, flagged };
    });
}
