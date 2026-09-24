/**
 * ブログ本文への記事内広告（IN_ARTICLE）の挿入位置を決める純粋関数（T-ADS1）。
 *
 * 契約（ops/tasks/T-ADS1 §3）:
 *  - 1枠目 = 導入文の後・最初の見出し(<h2)の前
 *  - 2枠目 = 本文の中ほど（1枠目の見出しから2つ先の <h2 の前）。短い記事は省略
 *  - 本文の先頭には置かない（導入文が短い＝最初の <h2 が冒頭近くなら、次の <h2 を1枠目にする）
 * 広告は本文HTMLの途中に差し込むだけで、本文自体は一切書き換えない（セグメントを連結すると元の本文に戻る）。
 */
const MIN_INTRO_CHARS = 200;

/** 本文HTMLを広告挿入位置で分割する。戻り値 length-1 = 広告の枚数（最大2）。広告が入らない記事は元の1要素のみ。 */
export function splitHtmlForInArticleAds(html: string): string[] {
  const h2Positions: number[] = [];
  const re = /<h2[\s>]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) h2Positions.push(m.index);

  const firstIdx = h2Positions.findIndex((pos) => pos >= MIN_INTRO_CHARS);
  if (firstIdx === -1) return [html];

  const cuts = [h2Positions[firstIdx]];
  const secondPos = h2Positions[firstIdx + 2];
  if (secondPos !== undefined) cuts.push(secondPos);

  const segments: string[] = [];
  let prev = 0;
  for (const cut of cuts) {
    segments.push(html.slice(prev, cut));
    prev = cut;
  }
  segments.push(html.slice(prev));
  return segments;
}
