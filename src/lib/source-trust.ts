/**
 * 出典の信頼度判定（E-E-A-T）— 純関数のみ。
 *
 * DDレポートC-2の最後の一押し：一次照合済みの県（教委/県公式ドメイン）と
 * 未照合の県（教育メディアで補完中）を UI で非対称に表示することで、
 * 「14県だけ手抜き」ではなく「誠実な段階的検証」として読ませる。
 *
 * 一次主義の本質は「URLを教委ドメインにすること」ではなく「実際に一次資料を照合したこと」。
 * よって sourceUrl が教委/県公式ドメインかどうかで“照合済み”を判定する。
 */

/**
 * 教育委員会・県公式のドメイン（pref.*.jp / *.lg.jp / *.ed.jp / *.go.jp / metro.tokyo）。
 * kyoto-be.ne.jp は京都府教育委員会の公式ドメイン（.ne.jpだが公的機関）で、
 * 2026-07-16の全県一次化で primary に採用したため明示的に許可する。
 */
const OFFICIAL_DOMAIN = /(\.lg\.jp|\.go\.jp|\.ed\.jp|pref\.[a-z]+\.jp|metro\.tokyo|kyoto-be\.ne\.jp)/;

/** sourceUrl が教委/県公式（＝一次資料を直接指す）か。 */
export function isOfficialSourceUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return OFFICIAL_DOMAIN.test(url);
}

export type SourceTrust = 'official' | 'provisional' | 'none';

/** 県の出典状態：official=一次照合済み / provisional=教育メディアで補完中 / none=出典なし。 */
export function sourceTrustOf(prefecture: { sourceUrl?: string }): SourceTrust {
  if (!prefecture.sourceUrl) return 'none';
  return isOfficialSourceUrl(prefecture.sourceUrl) ? 'official' : 'provisional';
}

export interface SourceTrustLabel {
  /** リンク末尾に出すバッジ文言。 */
  badge: string;
  /** 補足の一文（provisional のときに誠実さを担保）。 */
  note?: string;
}

/** 表示用ラベル。official は「（公式）」、provisional は「（一次照合中・教育メディアで補完）」。 */
export function sourceTrustLabel(prefecture: { name?: string; sourceUrl?: string }): SourceTrustLabel | null {
  const trust = sourceTrustOf(prefecture);
  if (trust === 'none') return null;
  if (trust === 'official') {
    return { badge: '公式' };
  }
  return {
    badge: '一次照合中',
    note: `${prefecture.name ?? 'この都道府県'}は現在、教育情報サイトの内容をもとに掲載し、教育委員会の一次資料との照合を順次進めています。最新・正確な情報は各教育委員会の公式サイトでご確認ください。`,
  };
}
