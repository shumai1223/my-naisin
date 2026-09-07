/**
 * T-Y11F F-2: 47都道府県の「年度をまたいで生き続ける公表ハブページ」の台帳。
 *
 * A-2（`competition-rate-watch.ts`）はR8の一次資料URLをそのまま見張っており、22県は
 * URLに年度が埋まる・残りもCMS添付IDが年度依存のため、R9が別URLで出た瞬間に永久検知不能
 * になる設計上の穴がある。このファイルが見張るのは対象と別の資料──**URLが変わらず、
 * 中身（新しい年度へのリンク）だけが更新されるハブページ**──で、`hubUrl`のHTMLを
 * `scripts/bairitsu-ingest/watch-hubs.mjs`が定期的に読み、新規リンクを検知する。
 *
 * ⚠️ `hubUrl`が判明しない県は`null`のまま置く（Y-0: 推測でURLを作らない）。
 *    2026-09-07時点でHEAD/GETによる実在確認まで済んでいるのは
 *    chiba/saitama/kagoshima/miyagi の4県のみ（F-2初回スコープ）。
 * ⚠️ `r8Evidence`は`ops/raw/bairitsu-r8-source-urls.json`（既存・A-2/E-1で検証済み）から
 *    機械転記した参考情報であり、ハブとは無関係にA-2が既に監視している。
 */

export type HubKind = 'index' | 'year-page' | 'unknown';

export interface PublicationHub {
  prefecture: string;
  /** 年度をまたいで生き続ける一覧ページのURL。判明していなければnull（推測禁止）。 */
  hubUrl: string | null;
  hubKind: HubKind;
  /** 参考情報: A-2が監視しているR8の一次資料URL（ops/raw/bairitsu-r8-source-urls.jsonから転記）。 */
  r8Evidence: string;
  /** ハブ経由で既に発見済みのR9資料URL。未発見はnull。 */
  r9Url: string | null;
  /** hubUrl/r9Urlを実在確認した日（HEAD/GETで200を確認した日）。未確認はnull。 */
  lastVerifiedAt: string | null;
}

export const PUBLICATION_HUBS: PublicationHub[] = [
  {
    prefecture: 'aichi',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.aichi.jp/uploaded/attachment/600212.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'akita',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence:
      'https://www.pref.akita.lg.jp/uploads/public/archive_0000093860_00/20260212_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86%E3%80%80%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%88%E5%BF%97%E9%A1%98%E5%85%88%E5%A4%89%E6%9B%B4%E5%BE%8C%EF%BC%89%EF%BC%88%E5%85%AC%E2%80%95%EF%BC%92%EF%BC%89.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'aomori',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R8senbatsu_syutsugan-zennitisei.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'chiba',
    hubUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html',
    hubKind: 'index',
    r8Evidence: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/r8kakuteiippan.pdf',
    r9Url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r9/index.html',
    lastVerifiedAt: '2026-09-07',
  },
  {
    prefecture: 'ehime',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://ehime-kyoiku.esnet.ed.jp/file/2314',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'fukui',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08ippan_d/fil/R8henko3.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'fukuoka',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.fukuoka.lg.jp/site/kyouiku/nyushi8.html',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'fukushima',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/735188.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'gifu',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.gifu.lg.jp/uploaded/attachment/485854.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'gunma',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.gunma.jp/uploaded/attachment/689968.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'hiroshima',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/655351.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'hokkaido',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'hyogo',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2026/03/【確定】修正_03-R8_３月選抜志願者数.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'ibaraki',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/shigansha20260218.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'ishikawa',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260224.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'iwate',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/094/015/r8_sigansya_tyouseigo.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'kagawa',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.kagawa.lg.jp/documents/15096/syutugan8-3-2.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'kagoshima',
    hubUrl: 'http://www.pref.kagoshima.jp/ba01/koukou02.html',
    hubKind: 'index',
    r8Evidence: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/126595_20260304191737-1.pdf',
    r9Url: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r4/r9nittei.html',
    lastVerifiedAt: '2026-09-07',
  },
  {
    prefecture: 'kanagawa',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'kochi',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_henkougo0205.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'kumamoto',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.kumamoto.jp/uploaded/life/259416_786982_misc.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'kyoto',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence:
      'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/05/%E4%BB%A4%E5%92%8C%EF%BC%98%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%9C%9F%E9%81%B8%E6%8A%9C-%E5%BA%83%E5%A0%B1%E8%B3%87%E6%96%99%EF%BC%88%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%89.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'mie',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.mie.lg.jp/common/content/001243656.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'miyagi',
    hubUrl: 'https://www.pref.miyagi.jp/site/sub-jigyou/kyo-nyushi.html',
    hubKind: 'index',
    r8Evidence: 'https://www.pref.miyagi.jp/documents/63612/0213_r8kouritukoukou_nyuugakusyasenbatsu_gakuryokukensa.pdf',
    r9Url: 'https://www.pref.miyagi.jp/site/sub-jigyou/kyo-r9nyushi.html',
    lastVerifiedAt: '2026-09-07',
  },
  {
    prefecture: 'miyazaki',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.miyazaki.lg.jp/documents/99874/99874_20260224160129-1.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'nagano',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/20260305web-teisei.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'nagasaki',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.nagasaki.jp/uploads/2026/02/1770615354.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'nara',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.nara.lg.jp/documents/5981/r8_itijisennbatu_dainisyutugannkikann_syutugannsyasuu.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'niigata',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'oita',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.oita.jp/uploaded/attachment/2261572.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'okayama',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.okayama.jp/uploaded/life/1054600_10219046_misc.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'okinawa',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/038/168/r07saisyu.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'osaka',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'saga',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.saga.lg.jp/kyouiku/kiji003118261/3_118261_381978_up_jpwwphq6.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'saitama',
    hubUrl: 'https://www.pref.saitama.lg.jp/f2208/nyuushi.html',
    hubKind: 'index',
    r8Evidence: 'https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf',
    r9Url: 'https://www.pref.saitama.lg.jp/f2208/nyushi/r9nyushijyoho.html',
    lastVerifiedAt: '2026-09-07',
  },
  {
    prefecture: 'shiga',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.shiga.lg.jp/file/attachment/5591236.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'shimane',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence:
      'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_henkougoitiran_teisei.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'shizuoka',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'tochigi',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'tokushima',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://nyuushi.tokushima-ec.ed.jp/file/975',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'tokyo',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182440-757',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'tottori',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.tottori.lg.jp/secure/1418417/R08_ippan_saisyuu_shigansya.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'toyama',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.toyama.jp/documents/47208/080224.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'wakayama',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08honsyutugan.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'yamagata',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.yamagata.jp/documents/42443/r8koukiippannsigannjoukyouhp.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'yamaguchi',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.yamaguchi.lg.jp/uploaded/life/338005_649954_misc.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
  {
    prefecture: 'yamanashi',
    hubUrl: null,
    hubKind: 'unknown',
    r8Evidence: 'https://www.pref.yamanashi.jp/documents/7061/r8saisyuusigansyasuu1.pdf',
    r9Url: null,
    lastVerifiedAt: null,
  },
];
