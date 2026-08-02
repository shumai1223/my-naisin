/**
 * 橋②（生徒→保護者バトン）の純関数群。
 *
 * 北極星：集客＝生徒 / 決裁＝保護者 の権限ズレを越える唯一の動線が「結果の共有」。
 * 共有が“画像だけ”だと決裁者（保護者）はオファー（資料請求/無料体験）に一度も触れない＝送客が途切れる。
 * そこで共有リンクは必ず「保護者最適化ページ（/hogosha）」へ、結果の文脈（県・点・目標・差）を載せて飛ばす。
 *
 * ここはすべて window 非依存の純関数（サーバー/クライアント両方で同じ結果・ユニットテスト可能）。
 *  - buildParentSharePath / buildParentShareUrl … 送り手側（生徒）が渡すURLを組む
 *  - buildParentShareMessage …………………………… ネイティブ共有/LINEに添える本文
 *  - parseParentShare ……………………………………… 受け手側（/hogosha）でクエリを安全に復元
 */

export interface ParentShareContext {
  prefectureCode?: string;
  prefectureName?: string;
  /** 現在の内申点 */
  score: number;
  /** 満点 */
  max: number;
  /** 目標内申点（未設定なら null/undefined） */
  target?: number | null;
  /** 目標までの差（正＝不足 / 0以下＝到達・超え） */
  gap?: number | null;
  /** 目標ラベル（例:「横浜翠嵐の目安」「あなたの目標」） */
  label?: string;
  /** 学年（1/2/3）。文脈見出し（「中3の今からなら」等）に使う。 */
  grade?: number | null;
  /** 指標名（既定は内申点。総合得点ツール等から共有する場合に「総合得点」等を渡す）。 */
  metricLabel?: string;
  /**
   * 匿名統計に基づく立ち位置（ZZ-5a・結果カードv2）。/api/stats/percentileがk-匿名性ガード後に
   * 返した実測パーセンタイル（0-100・n充足時のみ存在＝呼び出し側でinsufficientDataを見て渡す）。
   * 捏造ゼロ：このフィールドは常にAPIレスポンスの値をそのまま転記するだけで、独自に計算しない。
   */
  percentile?: number | null;
  /** percentileの集計範囲。'prefecture'（県内）を優先し、無ければ'national'（全国）。 */
  percentileScope?: 'prefecture' | 'national' | null;
  /**
   * 送信時刻（unix ms・TIER Σ-5）。生徒が「送る」を押した瞬間の Date.now() を呼び出し側が埋める
   * （本関数群自体はDate非依存の純関数のまま維持するため、時刻の取得は副作用のある呼び出し元の責務）。
   * 保護者が「あとで見る」場合の遅延着地（送信から24-72時間後の再訪等）をD1で追うために使う。
   */
  sentAt?: number | null;
}

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/* ────────────────────────────────────────────────────────────────────────
 * base64url の compact payload（?d=...）
 *
 * 個別クエリ（pref/score/...）と等価だが、1パラメータに畳めるので短縮リンク・OG・
 * 計測タグに載せやすい。UTF-8安全（県名/ラベルの日本語OK）で server/Workers/browser 共通。
 * decode は壊れた入力でも例外を投げず null を返す（信頼の堀＝外部入力を信用しない）。
 * ──────────────────────────────────────────────────────────────────────── */
function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 =
    typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// UTF-8 ⇄ bytes（browser/Workers は TextEncoder、無い環境=jsdom等は Buffer にフォールバック）。
function utf8ToBytes(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
  return Uint8Array.from(Buffer.from(s, 'utf8'));
}

function bytesToUtf8(bytes: Uint8Array): string {
  if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(bytes);
  return Buffer.from(bytes).toString('utf8');
}

/** sentAt（unix ms）の妥当範囲。2020-01-01〜2035-01-01の外は壊れた/悪意ある値として捨てる。 */
const SENT_AT_MIN_MS = 1_577_836_800_000; // 2020-01-01T00:00:00Z
const SENT_AT_MAX_MS = 2_051_222_400_000; // 2035-01-01T00:00:00Z

/** 共有文脈を base64url のJSONに畳む（?d= 用）。 */
export function encodeSharePayload(ctx: ParentShareContext): string {
  const obj: Record<string, string | number> = {
    s: Math.round(ctx.score),
    m: Math.round(ctx.max),
  };
  if (ctx.prefectureCode) obj.p = ctx.prefectureCode;
  if (ctx.prefectureName) obj.pn = ctx.prefectureName;
  if (isNum(ctx.target)) obj.t = Math.round(ctx.target);
  if (isNum(ctx.gap)) obj.g = Math.round(ctx.gap);
  if (ctx.label) obj.l = ctx.label.slice(0, 40);
  if (isNum(ctx.grade)) obj.gr = Math.round(ctx.grade);
  if (ctx.metricLabel) obj.ml = ctx.metricLabel.slice(0, 16);
  if (isNum(ctx.percentile)) obj.pc = Math.round(ctx.percentile);
  if (ctx.percentileScope === 'prefecture' || ctx.percentileScope === 'national') {
    obj.ps = ctx.percentileScope === 'prefecture' ? 'p' : 'n';
  }
  if (isNum(ctx.sentAt)) obj.sa = Math.round(ctx.sentAt);
  return bytesToBase64Url(utf8ToBytes(JSON.stringify(obj)));
}

/** ?d= を安全に復元（壊れた入力は null）。 */
export function decodeSharePayload(d: string | undefined): ParsedParentShare | null {
  if (!d) return null;
  try {
    const json = bytesToUtf8(base64UrlToBytes(d));
    const o = JSON.parse(json) as Record<string, unknown>;
    if (typeof o !== 'object' || o === null) return null;
    const clampInt = (v: unknown, min: number, max: number): number | undefined => {
      const n = Number(v);
      if (!Number.isFinite(n)) return undefined;
      return Math.min(max, Math.max(min, Math.round(n)));
    };
    const str = (v: unknown): string | undefined =>
      typeof v === 'string' && v.trim() ? v.trim() : undefined;
    return {
      isShare: true,
      prefectureCode: str(o.p),
      prefectureName: str(o.pn),
      score: clampInt(o.s, 0, 2000),
      max: clampInt(o.m, 0, 2000),
      target: clampInt(o.t, 0, 2000),
      gap: clampInt(o.g, -2000, 2000),
      grade: clampInt(o.gr, 1, 3),
      label: str(o.l)?.slice(0, 40),
      metricLabel: str(o.ml)?.slice(0, 16),
      percentile: clampInt(o.pc, 0, 100),
      percentileScope: o.ps === 'p' ? 'prefecture' : o.ps === 'n' ? 'national' : undefined,
      sentAt: clampInt(o.sa, SENT_AT_MIN_MS, SENT_AT_MAX_MS),
    };
  } catch {
    return null;
  }
}

/**
 * 共有リンクのパス（/hogosha?from=share&...）。決裁者を保護者ページへ、文脈付きで運ぶ。
 * max は満点の無い指標（偏差値等）では省略できる（Omit型を受け付ける・2026-08-02 TIER Σ-4修正）。
 * 従来は max を必須扱いで無条件に q.set していたため、満点の無い呼び出し元（ParentShareInvite の
 * 素の共有パス）が本関数を使うと NaN が紛れ込むおそれがあった＝他フィールドと同じ isNum ガードに揃えた。
 */
export function buildParentSharePath(ctx: Omit<ParentShareContext, 'max'> & { max?: number | null }): string {
  const q = new URLSearchParams();
  q.set('from', 'share');
  if (ctx.prefectureCode) q.set('pref', ctx.prefectureCode);
  if (ctx.prefectureName) q.set('pn', ctx.prefectureName);
  q.set('score', String(Math.round(ctx.score)));
  if (isNum(ctx.max)) q.set('max', String(Math.round(ctx.max)));
  if (isNum(ctx.target)) q.set('target', String(Math.round(ctx.target)));
  if (isNum(ctx.gap)) q.set('gap', String(Math.round(ctx.gap)));
  if (isNum(ctx.grade)) q.set('grade', String(Math.round(ctx.grade)));
  if (ctx.label) q.set('label', ctx.label);
  if (ctx.metricLabel) q.set('ml', ctx.metricLabel);
  if (isNum(ctx.percentile)) q.set('pc', String(Math.round(ctx.percentile)));
  if (ctx.percentileScope === 'prefecture' || ctx.percentileScope === 'national') q.set('ps', ctx.percentileScope === 'prefecture' ? 'p' : 'n');
  if (isNum(ctx.sentAt)) q.set('ts', String(Math.round(ctx.sentAt)));
  return `/hogosha?${q.toString()}`;
}

/** 絶対URL版（共有シート/コピー用）。origin は末尾スラッシュ無しを想定。 */
export function buildParentShareUrl(origin: string, ctx: Omit<ParentShareContext, 'max'> & { max?: number | null }): string {
  const base = origin.replace(/\/$/, '');
  return `${base}${buildParentSharePath(ctx)}`;
}

/**
 * 「送りたくなる理由」のフレーム（TIER Σ-4・2026-08-02）。
 *  - control: 既存の目標差分フレーム（①目標達成の可視化）。
 *  - social-proof: ②第三者の裏付けの代替（「学校の先生に聞く前に、まず数字で確認した」という
 *    客観データが後ろ盾になる伝え方。実在しない教師の発言を捏造しない＝あくまで代替であることを明示）。
 *  - value-exchange: ③親に見せると得すること（塾代の相場・就学支援金の対象かも一緒に確認できる）。
 * 夏はサンプルが少なくA/B判定をしない方針（[[Λ+4]]の教訓）のため、ここでは候補を用意して
 * useExperiment経由で母数を稼ぐだけに留め、判定は秋以降に行う。
 */
export type ShareMessageFrame = 'control' | 'social-proof' | 'value-exchange';

/**
 * 共有に添える本文（自慢ではなく「相談したい」動機に寄せる＝保護者が開く理由を作る）。
 * control（既定）は目標の有無・到達/未達でメッセージを出し分ける（①目標達成の可視化）。
 * metricLabel未指定時は「内申点」を既定表記にする（既存の呼び出し元との後方互換）。
 */
export function buildParentShareMessage(
  ctx: Pick<ParentShareContext, 'target' | 'gap' | 'label' | 'metricLabel'>,
  frame: ShareMessageFrame = 'control'
): string {
  const metric = ctx.metricLabel || '内申点';

  if (frame === 'social-proof') {
    return `${metric}の成績レポートを送ります。学校の先生に聞く前に、まず自分で数字を確認してみたので見てほしくて。`;
  }
  if (frame === 'value-exchange') {
    return `${metric}の結果と一緒に、塾代の相場や就学支援金の対象かどうかも確認できるページを送ります。`;
  }

  if (isNum(ctx.gap) && ctx.gap > 0) {
    const where = ctx.label ? `${ctx.label}` : '目標';
    return `${metric}の成績レポートを送ります。${where}まであと${Math.round(ctx.gap)}点。受験のこと、おうちの人に相談したくて。`;
  }
  if (isNum(ctx.gap) && ctx.gap <= 0 && isNum(ctx.target)) {
    return `${metric}の成績レポートを送ります。今のところ目標に届いてた！この調子で続けたいから見てね。`;
  }
  return `${metric}の成績レポートを送ります。受験のこと、一緒に考えてほしくて。`;
}

export interface ParsedParentShare {
  isShare: boolean;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  max?: number;
  target?: number;
  gap?: number;
  grade?: number;
  label?: string;
  metricLabel?: string;
  percentile?: number;
  percentileScope?: 'prefecture' | 'national';
  /** 送信時刻（unix ms・TIER Σ-5）。着地時に経過時間を計算し遅延着地を捕捉するために使う。 */
  sentAt?: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function firstStr(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  if (typeof s !== 'string') return undefined;
  const t = s.trim();
  return t ? t : undefined;
}

/** 範囲安全な整数化（外部から任意の値が来るクエリを必ずクランプ＝信頼の堀）。 */
function safeInt(v: string | string[] | undefined, min: number, max: number): number | undefined {
  const s = firstStr(v);
  if (s === undefined) return undefined;
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** /hogosha 側でクエリを安全に復元。score/max/target は 0〜2000、gap は ±2000 にクランプ。 */
export function parseParentShare(params: RawParams): ParsedParentShare {
  // compact payload(?d=)を先に復元し、個別クエリがあればそれを優先（上書き）する。
  const decoded = decodeSharePayload(firstStr(params.d));
  const isShare = firstStr(params.from) === 'share' || decoded !== null;
  if (!isShare) return { isShare: false };

  const label = firstStr(params.label);
  const pick = <T,>(explicit: T | undefined, fallback: T | undefined): T | undefined =>
    explicit !== undefined ? explicit : fallback;

  return {
    isShare: true,
    prefectureCode: pick(firstStr(params.pref), decoded?.prefectureCode),
    prefectureName: pick(firstStr(params.pn), decoded?.prefectureName),
    score: pick(safeInt(params.score, 0, 2000), decoded?.score),
    max: pick(safeInt(params.max, 0, 2000), decoded?.max),
    target: pick(safeInt(params.target, 0, 2000), decoded?.target),
    gap: pick(safeInt(params.gap, -2000, 2000), decoded?.gap),
    grade: pick(safeInt(params.grade, 1, 3), decoded?.grade),
    // 表示用ラベルは長さを抑える（誤・悪意入力の肥大防止）
    label: pick(label ? label.slice(0, 40) : undefined, decoded?.label),
    metricLabel: pick(firstStr(params.ml)?.slice(0, 16), decoded?.metricLabel),
    percentile: pick(safeInt(params.pc, 0, 100), decoded?.percentile),
    percentileScope: pick(
      firstStr(params.ps) === 'p' ? 'prefecture' : firstStr(params.ps) === 'n' ? 'national' : undefined,
      decoded?.percentileScope
    ),
    sentAt: pick(safeInt(params.ts, SENT_AT_MIN_MS, SENT_AT_MAX_MS), decoded?.sentAt),
  };
}
