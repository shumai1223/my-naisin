/**
 * T-S13A A-1: 47都道府県の利用条件台帳。
 *
 * 各県のcompetition-ratesデータについて「再配布してよいか」を一次ソース（各県の利用規約・
 * 著作権表示・問い合わせ回答）で確認し記録する。**⚠️A-1が緑になるまでA-2（配布API）以降を
 * 1行も出さない**（`ops/tasks/T-S13A-databank-product.md`の「⛔実装順序」）。
 *
 * 判断できない県は`unknown`にして商品から外す（C8 fail-closed）。47県揃わなくてよい。
 * kill_criteria: `redistribution: 'ok'`が10県未満なら商品として成立しないため中止し👤に報告。
 */

export type RedistributionStatus = 'ok' | 'ng' | 'unknown';

export interface DataLicenseLedgerEntry {
  prefecture: string;
  /** 引用元URLのホスト分類。`.lg.jp`/`.go.jp`/`.ed.jp`/商用/その他。 */
  sourceHost: string;
  redistribution: RedistributionStatus;
  /** そう判断した根拠（利用規約の該当文言・問い合わせ回答の要旨）。unknownの場合は「未確認」等。 */
  evidence: string;
  /** 確認日（YYYY-MM-DD、月までしか判明していない場合はYYYY-MM）。unknownはnull。 */
  verifiedAt: string | null;
}

const UNKNOWN = (evidence = '未確認（A-1未着手・次に着手するセッションが一次ソースを確認する）'): Omit<DataLicenseLedgerEntry, 'prefecture' | 'sourceHost'> => ({
  redistribution: 'unknown',
  evidence,
  verifiedAt: null,
});

/**
 * 47都道府県の台帳。**デフォルトは全県`unknown`**（C8 fail-closed）。
 * 一次ソースで確認できた県のみ個別に上書きする（確認した順に追記していく想定・T-C1と同型の
 * 1県ずつの調査労働）。
 */
export const DATA_LICENSE_LEDGER: Record<string, DataLicenseLedgerEntry> = {
  tokyo: { prefecture: 'tokyo', sourceHost: '.lg.jp', ...UNKNOWN() },
  kanagawa: { prefecture: 'kanagawa', sourceHost: '.lg.jp', ...UNKNOWN() },
  osaka: { prefecture: 'osaka', sourceHost: '.lg.jp', ...UNKNOWN() },
  chiba: { prefecture: 'chiba', sourceHost: '.lg.jp', ...UNKNOWN() },
  saitama: { prefecture: 'saitama', sourceHost: '.lg.jp', ...UNKNOWN() },
  fukuoka: {
    prefecture: 'fukuoka',
    sourceHost: '.lg.jp（一部レコードに商用第三者ソース混在の疑い）',
    ...UNKNOWN(
      '未確認。加えてA-0-5未解決（育伸社・英進館由来の疑いがあるレコードの切り分けが済むまで、' +
        'このredistribution判定を"ok"にしても実際の配布対象から当該レコードを除外する必要がある）'
    ),
  },
  hyogo: { prefecture: 'hyogo', sourceHost: '.lg.jp', ...UNKNOWN() },
  shizuoka: { prefecture: 'shizuoka', sourceHost: '.lg.jp', ...UNKNOWN() },
  hiroshima: { prefecture: 'hiroshima', sourceHost: '.lg.jp', ...UNKNOWN() },
  kumamoto: { prefecture: 'kumamoto', sourceHost: '.lg.jp', ...UNKNOWN() },
  miyagi: { prefecture: 'miyagi', sourceHost: '.lg.jp', ...UNKNOWN() },
  gifu: {
    prefecture: 'gifu',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '岐阜県高校教育課からGmail回答あり（2026-08）だが内容は「当課の高校入試関連ページに、' +
        '貴サイトのリンク等を掲載することはいたしかねます」＝被リンク可否の回答のみで、' +
        '再配布（引用・データ商品への収録）可否には言及していない。再配布の可否は別途確認が必要（要再確認）'
    ),
  },
  okayama: { prefecture: 'okayama', sourceHost: '.lg.jp（実質公的・県立高校共同サイト）', ...UNKNOWN() },
  tochigi: { prefecture: 'tochigi', sourceHost: '.lg.jp', ...UNKNOWN() },
  gunma: { prefecture: 'gunma', sourceHost: '.lg.jp', ...UNKNOWN() },
  nagano: { prefecture: 'nagano', sourceHost: '.lg.jp', ...UNKNOWN() },
  ibaraki: { prefecture: 'ibaraki', sourceHost: '.lg.jp', ...UNKNOWN() },
  mie: {
    prefecture: 'mie',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '三重県教育委員会高校教育課からGmail回答（2026-08）: 「出典を明記のうえ紹介いただくことは' +
      '差し支えございません。ただし個人が運営するホームページへのリンクを掲載することはできません」。' +
      '被リンクは不可だが、出典明記のうえでの引用・紹介は明示的に許諾されている。' +
      '⚠️「紹介」であり「再配布」という語の直接使用ではないため、CSV/API配布への適用は' +
      '出典表記を必須条件として扱うこと（A-2実装時、この県のレコードには出典URLを必ず付与する）',
    verifiedAt: '2026-08',
  },
  toyama: { prefecture: 'toyama', sourceHost: '.lg.jp', ...UNKNOWN() },
  ishikawa: { prefecture: 'ishikawa', sourceHost: '.lg.jp', ...UNKNOWN() },
  fukui: { prefecture: 'fukui', sourceHost: '.lg.jp', ...UNKNOWN() },
  ehime: { prefecture: 'ehime', sourceHost: '.lg.jp', ...UNKNOWN() },
  tokushima: { prefecture: 'tokushima', sourceHost: '.lg.jp', ...UNKNOWN() },
  kagawa: { prefecture: 'kagawa', sourceHost: '.lg.jp', ...UNKNOWN() },
  saga: { prefecture: 'saga', sourceHost: '.lg.jp', ...UNKNOWN() },
  nagasaki: { prefecture: 'nagasaki', sourceHost: '.lg.jp', ...UNKNOWN() },
  oita: { prefecture: 'oita', sourceHost: '.lg.jp', ...UNKNOWN() },
  tottori: { prefecture: 'tottori', sourceHost: '.lg.jp', ...UNKNOWN() },
  kochi: { prefecture: 'kochi', sourceHost: '.lg.jp', ...UNKNOWN() },
  miyazaki: { prefecture: 'miyazaki', sourceHost: '.lg.jp', ...UNKNOWN() },
  yamaguchi: { prefecture: 'yamaguchi', sourceHost: '.lg.jp', ...UNKNOWN() },
  kagoshima: { prefecture: 'kagoshima', sourceHost: '.lg.jp', ...UNKNOWN() },
  niigata: { prefecture: 'niigata', sourceHost: '.lg.jp', ...UNKNOWN() },
  okinawa: { prefecture: 'okinawa', sourceHost: '.lg.jp', ...UNKNOWN() },
  yamanashi: { prefecture: 'yamanashi', sourceHost: '.lg.jp', ...UNKNOWN() },
  nara: { prefecture: 'nara', sourceHost: '.lg.jp', ...UNKNOWN() },
  akita: { prefecture: 'akita', sourceHost: '.lg.jp', ...UNKNOWN() },
  aomori: { prefecture: 'aomori', sourceHost: '.lg.jp', ...UNKNOWN() },
  iwate: { prefecture: 'iwate', sourceHost: '.lg.jp', ...UNKNOWN() },
  kyoto: { prefecture: 'kyoto', sourceHost: '.lg.jp（実質公的）', ...UNKNOWN() },
  yamagata: { prefecture: 'yamagata', sourceHost: '.lg.jp', ...UNKNOWN() },
  aichi: { prefecture: 'aichi', sourceHost: '.lg.jp', ...UNKNOWN() },
  wakayama: { prefecture: 'wakayama', sourceHost: '.lg.jp', ...UNKNOWN() },
  shimane: { prefecture: 'shimane', sourceHost: '.lg.jp', ...UNKNOWN() },
  shiga: { prefecture: 'shiga', sourceHost: '.lg.jp', ...UNKNOWN() },
  fukushima: { prefecture: 'fukushima', sourceHost: '.lg.jp', ...UNKNOWN() },
  hokkaido: { prefecture: 'hokkaido', sourceHost: '.lg.jp', ...UNKNOWN() },
};

/** `redistribution: 'ok'`の県コード一覧。A-2（配布API）はこれ以外を出さない。 */
export function redistributableOkPrefectures(): string[] {
  return Object.values(DATA_LICENSE_LEDGER)
    .filter((e) => e.redistribution === 'ok')
    .map((e) => e.prefecture);
}
