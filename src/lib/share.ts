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
}

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
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
  if (ctx.label) q.set('label', ctx.label);
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
    return `内申点を計算したよ。${where}まであと${Math.round(ctx.gap)}点。受験のこと、おうちの人に相談したくて送りました。`;
  }
  if (isNum(ctx.gap) && ctx.gap <= 0 && isNum(ctx.target)) {
    return '内申点を計算したよ。今のところ目標に届いてた！この調子で続けたいから見てね。';
  }
  return '内申点を計算したよ。受験のこと、一緒に考えてほしくて送りました。';
}

export interface ParsedParentShare {
  isShare: boolean;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  max?: number;
  target?: number;
  gap?: number;
  label?: string;
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
  const isShare = firstStr(params.from) === 'share';
  if (!isShare) return { isShare: false };

  const label = firstStr(params.label);
  return {
    isShare: true,
    prefectureCode: firstStr(params.pref),
    prefectureName: firstStr(params.pn),
    score: safeInt(params.score, 0, 2000),
    max: safeInt(params.max, 0, 2000),
    target: safeInt(params.target, 0, 2000),
    gap: safeInt(params.gap, -2000, 2000),
    // 表示用ラベルは長さを抑える（誤・悪意入力の肥大防止）
    label: label ? label.slice(0, 40) : undefined,
  };
}
