/**
 * 塾・家庭教師 診断ファネル（Build 2）の推薦エンジン＝決定論の純関数。
 *
 * 北極星（[[monetization-reality-2026-06]] / [[fable5-master-plan-2026-06]]）：
 *   稼ぐのは「保護者 × 無料リード（塾/家庭教師の無料体験）」。/juku-shindan は生徒/保護者の入力
 *   （県・学年・目標との差・希望形態・状況）から、live 在庫だけを使って1〜3件を決定論で推薦する。
 *   主張は検証可能な事実のみ（対応地域・形態・無料体験の有無）＝誇大表現ゼロ・捏造ゼロ。
 *
 * 設計：
 *  - 送客先は「塾ユニバース（JUKU_OFFERS）」に限定（FP/学資/通信教育資料など塾でないものは出さない）。
 *  - live のみ（pending の先回し枠は除外＝デッドリンクを出さない）／有料成約(paid)は保護者面ガードで除外。
 *  - 地域整合：対面塾は地盤地域が一致するときだけ（関西入力に森塾＝関東を出さない等）。
 *  - EV順（rankLiveOffersByEV の confirmedPer1000）を従属キーに使う＝新規承認が live になると
 *    自動で推薦が強くなる（IDのハードコードで序列を固定しない）。
 *  - window 非依存の純関数＝全入力組合せをユニットテストで総当たりできる（デッドリンク0の不変条件）。
 */

import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';
import { isParentSafeOffer, rankLiveOffersByEV } from '@/lib/affiliate-economics';
import { getPrefectureByCode } from '@/lib/prefectures';

export type JukuFormat = 'online' | 'in-person' | 'any';
export type JukuSituation = 'normal' | 'futoukou' | 'top';

export interface JukuMatchInput {
  /** 都道府県コード（対面塾の地域整合に使う）。 */
  prefectureCode?: string;
  /** 学年（1/2/3）。 */
  grade?: number;
  /** 目標までの差（正＝不足）。大きいほどコーチング/個別を上位に。 */
  gap?: number | null;
  /** 希望形態（対面/オンライン/どちらでも）。 */
  format?: JukuFormat;
  /** 状況（通常/不登校/難関志望）。 */
  situation?: JukuSituation;
}

interface JukuOfferMeta {
  id: AffiliateId;
  /** 全国オンライン対応（形態を選ばず体験できる）。 */
  online: boolean;
  /** 対面校舎の地盤地域（対面塾のみ・prefectures.ts の region 表記）。全国オンラインは undefined。 */
  region?: string;
  /** 難関志望に強い（学習コーチング等）。 */
  forTop?: boolean;
  /** 不登校に対応。 */
  forFutoukou?: boolean;
  /** 形態ラベル（結果カードの見出し・短く）。 */
  formatLabel: string;
  /** 検証可能な事実のみ（対応地域・形態・無料体験の有無）。誇大表現・合否の断定は書かない。 */
  fact: string;
}

/**
 * 塾ユニバース（診断で送客してよい塾/家庭教師/コーチングの live 候補）。
 * ここに載っていない案件（FP相談・学資保険・通信教育の資料請求・有料入会）は塾診断では推薦しない。
 * status:'pending' の枠を混ぜても matchJuku が isLiveAffiliate で弾くので安全（承認され次第 live で自動参加）。
 */
export const JUKU_OFFERS: JukuOfferMeta[] = [
  {
    id: 'sora-juku-text',
    online: true,
    formatLabel: 'オンライン個別指導',
    fact: '全国どこでもオンラインで受講できる個別指導／無料体験あり',
  },
  {
    id: 'atama-text',
    online: true,
    formatLabel: 'AI個別指導（オンライン）',
    fact: 'AIが弱点を分析して学習をつくる個別指導／全国オンライン／無料体験あり',
  },
  {
    id: 'moshimo-e-live',
    online: true,
    formatLabel: 'オンライン家庭教師',
    fact: '小中高に対応するオンライン家庭教師／全国対応／無料体験あり',
  },
  {
    id: 'moshimo-studycoach',
    online: true,
    forTop: true,
    formatLabel: '学習コーチング（オンライン）',
    fact: '現役の東大・難関大生による学習コーチング／オンライン／無料体験あり',
  },
  {
    id: 'moshimo-rewrite',
    online: true,
    forTop: true,
    formatLabel: '受験英語専門ゼミ（オンライン）',
    fact: '受験英語に特化したオンライン専門ゼミ／無料相談あり',
  },
  {
    id: 'moshimo-tintoru',
    online: true,
    forFutoukou: true,
    formatLabel: '不登校専門オンライン個別指導',
    fact: '不登校専門のオンライン個別指導／全国対応／無料体験あり',
  },
  {
    id: 'moshimo-classjapan',
    online: true,
    forFutoukou: true,
    formatLabel: '不登校オンラインフリースクール',
    fact: '不登校生向けのオンラインフリースクール／無料の資料請求あり',
  },
  {
    id: 'morijuku-text',
    online: false,
    region: '関東',
    formatLabel: '対面の個別指導（関東）',
    fact: '関東を中心に校舎が多い個別指導／無料体験授業あり',
  },
  {
    id: 'campus-text',
    online: false,
    region: '近畿',
    formatLabel: '対面の個別指導（関西）',
    fact: '関西を地盤とする個別指導／無料体験・資料請求あり',
  },
];

const JUKU_OFFER_BY_ID: Partial<Record<AffiliateId, JukuOfferMeta>> = Object.fromEntries(
  JUKU_OFFERS.map((o) => [o.id, o])
);

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * 入力から live な塾/家庭教師を EV × 適合度の順で 1〜3 件、決定論で推薦する。
 * 返り値は必ず live・保護者面OK（非paid）・地域整合済みの AffiliateId 配列（デッドリンクを出さない）。
 * 全国オンラインの在庫が常に候補に残るため、どの入力でも 1 件以上を返す（フォールバックの空振り無し）。
 */
export function matchJuku(input: JukuMatchInput = {}): AffiliateId[] {
  const region = input.prefectureCode ? getPrefectureByCode(input.prefectureCode)?.region : undefined;
  const format: JukuFormat = input.format ?? 'any';
  const situation: JukuSituation = input.situation ?? 'normal';

  // EV順位（confirmedPer1000）を従属キーに。rankLiveOffersByEV は live のみを返す。
  const evRank = new Map(rankLiveOffersByEV().map((o) => [o.id, o.confirmedPer1000]));

  const cands: { id: AffiliateId; score: number; ev: number }[] = [];

  for (const m of JUKU_OFFERS) {
    if (!isLiveAffiliate(m.id)) continue; // pending除外＝デッドリンクを出さない
    if (!isParentSafeOffer(m.id)) continue; // 有料成約(paid)は保護者面に出さない

    // 状況の適合：不登校は不登校対応のみ／不登校以外は不登校専門枠を出さない（文脈違い・誠実さ）
    if (situation === 'futoukou' && !m.forFutoukou) continue;
    if (situation !== 'futoukou' && m.forFutoukou) continue;

    // 地域整合：対面塾は地盤地域が一致するときだけ／オンライン希望なら対面塾は出さない
    if (m.region) {
      if (m.region !== region) continue; // 例：関西入力に森塾（関東）を出さない
      if (format === 'online') continue;
    }

    let score = 0;
    if (situation === 'top' && m.forTop) score += 100;
    if (situation === 'futoukou' && m.forFutoukou) score += 100;
    if (format === 'in-person' && m.region) score += 60; // 対面希望×地盤塾を最優先
    if (format === 'online' && m.online) score += 30;
    if (format === 'any' && m.online) score += 10;
    if (isNum(input.gap) && input.gap >= 15 && m.forTop) score += 20; // 目標が遠いほどコーチングを押し上げ

    cands.push({ id: m.id, score, ev: evRank.get(m.id) ?? 0 });
  }

  cands.sort((a, b) => b.score - a.score || b.ev - a.ev);
  return cands.slice(0, 3).map((c) => c.id);
}

export interface JukuRecommendation {
  id: AffiliateId;
  /** 送客先プログラム名（AFFILIATES の name）。 */
  programName: string;
  formatLabel: string;
  /** 検証可能な事実のみ。 */
  fact: string;
}

/** ID から結果表示用の説明を作る（塾ユニバース外・非liveは null）。 */
export function describeJuku(id: AffiliateId): JukuRecommendation | null {
  const m = JUKU_OFFER_BY_ID[id];
  if (!m || !isLiveAffiliate(id)) return null;
  return {
    id,
    programName: AFFILIATES[id]?.name ?? id,
    formatLabel: m.formatLabel,
    fact: m.fact,
  };
}

/** 入力→推薦（表示用の説明つき）。matchJuku の結果を describeJuku で肉付けする。 */
export function recommendJuku(input: JukuMatchInput = {}): JukuRecommendation[] {
  return matchJuku(input)
    .map((id) => describeJuku(id))
    .filter((r): r is JukuRecommendation => r !== null);
}
