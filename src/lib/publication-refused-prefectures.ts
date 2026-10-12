/**
 * 応募状況データ（募集人員・応募者数・倍率）の掲載を県から断られた県。
 *
 * ここに載せた県は、倍率系データの公開用エクスポート（学校ページ・sitemap・API・MCP）から外す。
 * 生データのファイル（`src/data/*\/<県>.ts`）は消さない。再び許諾が出たとき、ここから外すだけで戻せる。
 *
 * - wakayama: 2026-09-04 和歌山県教育庁学校教育局県立学校教育課のGmail回答
 *   「本県の著作物であることから、出典等を明記した場合においても掲載はご遠慮いただいています。
 *   ただし、本県教育委員会ホームページのリンクを貼っていただくなどについては問題はございません」。
 *   根拠は `data-license-ledger.ts` の wakayama（redistribution: 'ng'）。
 *   2026-10-12 👤が非公開を決定。
 */
export const PUBLICATION_REFUSED_PREFECTURES: ReadonlySet<string> = new Set(['wakayama']);

export function isPublicationRefused(prefectureCode: string): boolean {
  return PUBLICATION_REFUSED_PREFECTURES.has(prefectureCode);
}

/** 県コードをキーにした公開用マップから、掲載を断られた県を取り除く。 */
export function omitPublicationRefused<T>(byPrefecture: Partial<Record<string, T>>): Partial<Record<string, T>> {
  return Object.fromEntries(
    Object.entries(byPrefecture).filter(([code]) => !PUBLICATION_REFUSED_PREFECTURES.has(code))
  ) as Partial<Record<string, T>>;
}
