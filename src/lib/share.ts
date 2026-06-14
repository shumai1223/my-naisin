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
    };
  } catch {
    return null;
  }
}

/** 共有リンクのパス（/hogosha?from=share&...）。決裁者を保護者ページへ、文脈付きで運ぶ。 */
export function buildParentSharePath(ctx: ParentShareContext): string {
  const q = new URLSearchParams();
  q.set('from', 'share');
  if (ctx.prefectureCode) q.set('pref', ctx.prefectureCode);
  if (ctx.prefectureName) q.set('pn', ctx.prefectureName);
  q.set('score', String(Math.round(ctx.score)));
  q.set('max', String(Math.round(ctx.max)));
  if (isNum(ctx.target)) q.set('target', String(Math.round(ctx.target)));
  if (isNum(ctx.gap)) q.set('gap', String(Math.round(ctx.gap)));
  if (isNum(ctx.grade)) q.set('grade', String(Math.round(ctx.grade)));
  if (ctx.label) q.set('label', ctx.label);
  if (ctx.metricLabel) q.set('ml', ctx.metricLabel);
  return `/hogosha?${q.toString()}`;
}

/** 絶対URL版（共有シート/コピー用）。origin は末尾スラッシュ無しを想定。 */
export function buildParentShareUrl(origin: string, ctx: ParentShareContext): string {
  const base = origin.replace(/\/$/, '');
  return `${base}${buildParentSharePath(ctx)}`;
}

/**
 * 共有に添える本文（自慢ではなく「相談したい」動機に寄せる＝保護者が開く理由を作る）。
 * 目標の有無・到達/未達でメッセージを出し分ける。
 */
export function buildParentShareMessage(ctx: Pick<ParentShareContext, 'target' | 'gap' | 'label'>): string {
  if (isNum(ctx.gap) && ctx.gap > 0) {
    const where = ctx.label ? `${ctx.label}` : '目標';
    return `内申点の成績レポートを送ります。${where}まであと${Math.round(ctx.gap)}点。受験のこと、おうちの人に相談したくて。`;
  }
  if (isNum(ctx.gap) && ctx.gap <= 0 && isNum(ctx.target)) {
    return '内申点の成績レポートを送ります。今のところ目標に届いてた！この調子で続けたいから見てね。';
  }
  return '内申点の成績レポートを送ります。受験のこと、一緒に考えてほしくて。';
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
  };
}
