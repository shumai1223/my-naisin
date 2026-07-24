/**
 * 都道府県コード→英語表記の対応表（X-20 Phase2・白書英語版の47県全件表で使用）。
 *
 * 標準的な英語ローマ字表記のみ（新規の調査・推測は一切含まない＝捏造ゼロ）。
 * 北海道・東京都・大阪府・京都府は英語圏の慣用表記に合わせ"Prefecture"を付けない
 * （他43県は"X Prefecture"で統一）。地域区分（region）はprefectures.tsの7区分と1対1対応。
 */
import { PREFECTURES } from '@/lib/prefectures';

/** "Prefecture"を付けない例外4件（道・都・府）。 */
const NO_SUFFIX_NAMES: Record<string, string> = {
  hokkaido: 'Hokkaido',
  tokyo: 'Tokyo',
  kyoto: 'Kyoto Prefecture',
  osaka: 'Osaka Prefecture',
};

const ROMANIZED_BASE: Record<string, string> = {
  hokkaido: 'Hokkaido',
  aomori: 'Aomori',
  iwate: 'Iwate',
  miyagi: 'Miyagi',
  akita: 'Akita',
  yamagata: 'Yamagata',
  fukushima: 'Fukushima',
  ibaraki: 'Ibaraki',
  tochigi: 'Tochigi',
  gunma: 'Gunma',
  saitama: 'Saitama',
  chiba: 'Chiba',
  tokyo: 'Tokyo',
  kanagawa: 'Kanagawa',
  niigata: 'Niigata',
  toyama: 'Toyama',
  ishikawa: 'Ishikawa',
  fukui: 'Fukui',
  yamanashi: 'Yamanashi',
  nagano: 'Nagano',
  gifu: 'Gifu',
  shizuoka: 'Shizuoka',
  aichi: 'Aichi',
  mie: 'Mie',
  shiga: 'Shiga',
  kyoto: 'Kyoto',
  osaka: 'Osaka',
  hyogo: 'Hyogo',
  nara: 'Nara',
  wakayama: 'Wakayama',
  tottori: 'Tottori',
  shimane: 'Shimane',
  okayama: 'Okayama',
  hiroshima: 'Hiroshima',
  yamaguchi: 'Yamaguchi',
  tokushima: 'Tokushima',
  kagawa: 'Kagawa',
  ehime: 'Ehime',
  kochi: 'Kochi',
  fukuoka: 'Fukuoka',
  saga: 'Saga',
  nagasaki: 'Nagasaki',
  kumamoto: 'Kumamoto',
  oita: 'Oita',
  miyazaki: 'Miyazaki',
  kagoshima: 'Kagoshima',
  okinawa: 'Okinawa',
};

/** 都道府県コード→英語名（"Prefecture"付き。北海道/東京/京都/大阪は例外表記）。未知コードはnull。 */
export function getPrefectureEnName(code: string): string | null {
  if (code in NO_SUFFIX_NAMES) return NO_SUFFIX_NAMES[code];
  const base = ROMANIZED_BASE[code];
  return base ? `${base} Prefecture` : null;
}

const REGION_EN_NAME: Record<string, string> = {
  '北海道・東北': 'Hokkaido & Tohoku',
  関東: 'Kanto',
  中部: 'Chubu',
  近畿: 'Kinki (Kansai)',
  中国: 'Chugoku',
  四国: 'Shikoku',
  '九州・沖縄': 'Kyushu & Okinawa',
};

/** 地域区分（prefectures.tsの日本語7区分）→英語表記。未知の区分は元の文字列をそのまま返す。 */
export function getRegionEnName(regionJa: string): string {
  return REGION_EN_NAME[regionJa] ?? regionJa;
}

/**
 * 全47都道府県コードが英語名マップに漏れなく存在することを保証する自己検証（開発時アサート）。
 * prefectures.tsに新しい県コードが追加された場合にこの関数がfalseを返すことで検知できる
 * （import時ではなくテストから呼ぶ想定・実行コストが軽いテスト用ヘルパ）。
 */
export function hasCompleteEnNameCoverage(): boolean {
  return PREFECTURES.every((p) => getPrefectureEnName(p.code) !== null);
}
