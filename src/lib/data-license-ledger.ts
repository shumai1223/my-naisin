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
    sourceHost: '.lg.jp（令和6年度分のみ商用第三者ソース）',
    ...UNKNOWN(
      '未確認。加えてsourceIndexバックフィル(2026-08-12)により判明: 令和6年度分191件' +
        '(98校)は県教委原本が取得不能だったため育伸社(ikushin.co.jp)の代替PDFを唯一の' +
        'ソースとして採用しており商用第三者由来。令和7年度分170件は公式PDF(Wayback経由)。' +
        '令和8年度分191件は48校99件が英進館記事を学科別内訳の主典拠とし、残り42校+市組合立' +
        '8校92件は公式PDFが主典拠(英進館は裏取りのみ)。A-2実装時は最低限、令和6年度分191件を' +
        'fiscalYearで除外すること(sourceIndex:8が該当)'
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
    redistribution: 'ok',
    evidence:
      '岐阜県教育委員会高校教育課からGmail回答（2026-08-07）: 「当課の高校入試関連ページに、貴サイトの' +
      'リンク等を掲載することはいたしかねます」＝被リンクは不可（mie/ishikawa等と同型）。' +
      '【2026-08-17追記・OK確定】👤が2026-08-13に「応募状況（募集人員・応募者数・応募倍率）データを' +
      '出典明記のうえ掲載してよいか」と再質問メールを送信、2026-08-17に「当課にて公表している資料を' +
      '使用される場合は、直下リンク先で公表しております資料をお使いください' +
      '（https://www.pref.gifu.lg.jp/site/edu/491657.html）。出典等の表記については、ご提示いただいた' +
      '内容で差し支えございません」と明確な許諾回答を得た（Gmailスレッド19fda9a1168afd76）。' +
      '被リンクは不可だが応募状況データの再配布は明示的に許諾されたため、A-2実装時はこの県のレコードに' +
      '出典URL（上記リンク）を必ず付与する条件で志願状況・募集人員・応募倍率を収録してよい',
    verifiedAt: '2026-08-17',
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
      '三重県教育委員会高校教育課からGmail回答（2026-08-06）: 「出典を明記のうえ紹介いただくことは' +
      '差し支えございません。ただし個人が運営するホームページへのリンクを掲載することはできません」。' +
      '被リンクは不可だが、出典明記のうえでの引用・紹介は明示的に許諾されている。' +
      '【2026-08-17追記・確度が上がった】👤が2026-08-13に「応募状況（募集人員・応募者数・応募倍率）の' +
      'データを出典明記のうえ掲載してよいか」と再質問メールを送信、2026-08-17に「県立高等学校入学者選抜の' +
      '志願状況、募集人数、合格者数等のデータにつきましては、本課ホームページで公開していますので、' +
      '出典を明示の上、貴ホームページに掲載していただいて差し支えございません」と明確な追加回答を得た' +
      '（Gmailスレッド19fe9131ed975d6d）。当初の「紹介」の曖昧さが解消され、具体的なデータ項目名を' +
      '挙げたうえでの掲載許諾となったため、A-2実装時はこの県のレコードに出典URLを必ず付与する条件で' +
      '志願状況・募集人数・合格者数を収録してよい',
    verifiedAt: '2026-08-17',
  },
  toyama: { prefecture: 'toyama', sourceHost: '.lg.jp', ...UNKNOWN() },
  ishikawa: {
    prefecture: 'ishikawa',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '石川県教育委員会学校指導課からGmail回答あり（2026-08-07）だが内容は「学校指導課の関連' +
        'ページからサイト「My Naishin」への参照についてですが、課内で協議して不可となりました」' +
        '＝mie/wakayamaと同型の被リンク可否の回答のみで、再配布（引用・データ商品への収録）' +
        '可否には言及していない。再配布の可否は別途確認が必要（要再確認）'
    ),
  },
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
  okinawa: {
    prefecture: 'okinawa',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '沖縄県教育委員会県立学校教育課からGmail回答（2026-08-24 09:22・スレッド1a03126277ffefe6）: ' +
      '「公表データの転載および当課ウェブサイトへのリンク設定につきましては、差し支えございません。' +
      'ご提示いただいた通り、出典（資料名およびURL）を明記のうえ、ご活用いただけますと幸いです」。' +
      '「応募状況」（募集人員・志願者数・倍率等）データの再配布・引用を出典明記条件で明確に許諾。' +
      'gifu/mieと異なり被リンクも明示的にOKだった（唯一の完全許諾県）。「公表データの更新やURLの' +
      '変更等が予告なく行われる場合がある」旨の留保あり＝A-2実装時は出典URLの定期疎通確認が必要。' +
      'A-2実装時はこの県のレコードに出典URLを必ず付与する条件で応募状況データを収録してよい',
    verifiedAt: '2026-08-24',
  },
  yamanashi: { prefecture: 'yamanashi', sourceHost: '.lg.jp', ...UNKNOWN() },
  nara: { prefecture: 'nara', sourceHost: '.lg.jp', ...UNKNOWN() },
  akita: { prefecture: 'akita', sourceHost: '.lg.jp', ...UNKNOWN() },
  aomori: { prefecture: 'aomori', sourceHost: '.lg.jp', ...UNKNOWN() },
  iwate: { prefecture: 'iwate', sourceHost: '.lg.jp', ...UNKNOWN() },
  kyoto: { prefecture: 'kyoto', sourceHost: '.lg.jp（実質公的）', ...UNKNOWN() },
  yamagata: { prefecture: 'yamagata', sourceHost: '.lg.jp', ...UNKNOWN() },
  aichi: {
    prefecture: 'aichi',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '愛知県教育委員会高等学校教育課からGmail回答あり（2026-08-13）だが内容は「外部サイト等を' +
        '紹介することはしておりません」＝gifuと同型の被リンク可否の回答のみで、再配布（引用・' +
        'データ商品への収録）可否には言及していない。再配布の可否は別途確認が必要（要再確認）'
    ),
  },
  wakayama: {
    prefecture: 'wakayama',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '和歌山県教育庁県立学校教育課からGmail回答あり（2026-08-12 16:49）だが内容は「本県においては' +
        '公的団体のページ以外へのリンクは原則として行っておらず...個人が運営されているホームページ' +
        '等へのリンクを挿入することは、公平性や中立性の観点から困難」＝mie/ishikawaと同型の被リンク' +
        '可否の回答のみで、再配布（引用・データ商品への収録）可否には言及していない。' +
        '再配布の可否は別途確認が必要（要再確認）'
    ),
  },
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
