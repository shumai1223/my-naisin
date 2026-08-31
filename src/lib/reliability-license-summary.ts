import { DATA_LICENSE_LEDGER } from './data-license-ledger';
import { PREFECTURES } from './prefectures';

/**
 * T-C9: /reliability に公開する「応募状況データの再配布・引用許諾」の一覧。
 *
 * DATA_LICENSE_LEDGER（T-S13A A-1台帳）のevidenceフィールドはA-2実装時の注意点等の内部メモを
 * 含み公開向けの文章ではないため、'ok'県のみ公開用の一文をここで別途保持する（個人名は含めない）。
 * PUBLIC_LICENSE_SUMMARYに無い'ok'県が現れた場合はgetLicensedPrefectureSummaries()が例外を投げる
 * （data-license-ledger.test.tsと同じfail-closed思想＝新しいokを黙って見落とさない）。
 */
const PUBLIC_LICENSE_SUMMARY: Record<string, { text: string; backlink: boolean }> = {
  gifu: { text: '応募状況データの出典明記のうえでの掲載を許諾。当課ウェブサイトへのリンク掲載は不可。', backlink: false },
  mie: { text: '応募状況データの出典明記のうえでの掲載を許諾。個人運営サイトへのリンク掲載は不可。', backlink: false },
  okinawa: { text: '応募状況データの転載、および県教育委員会ウェブサイトへのリンク設定の両方を許諾。', backlink: true },
  ibaraki: { text: '応募状況データの出典明記のうえでの掲載を許諾。', backlink: false },
  akita: { text: '応募状況データの出典明記のうえでの掲載を許諾。当課公式サイトへの参照掲載は不可。', backlink: false },
  ishikawa: { text: '応募状況データの出典明記のうえでの掲載を許諾。当課ウェブサイトへのリンク掲載は不可。', backlink: false },
};

export interface LicensedPrefectureSummary {
  code: string;
  name: string;
  verifiedAt: string | null;
  text: string;
  backlink: boolean;
}

export function getLicensedPrefectureSummaries(): LicensedPrefectureSummary[] {
  return Object.values(DATA_LICENSE_LEDGER)
    .filter((e) => e.redistribution === 'ok')
    .map((e) => {
      const pref = PREFECTURES.find((p) => p.code === e.prefecture);
      const summary = PUBLIC_LICENSE_SUMMARY[e.prefecture];
      if (!summary) {
        throw new Error(
          `PUBLIC_LICENSE_SUMMARYに'${e.prefecture}'の公開用要約が未登録です（DATA_LICENSE_LEDGERで新たにokになった県は、この辞書にも要約を追記してください）。`,
        );
      }
      return {
        code: e.prefecture,
        name: pref?.name ?? e.prefecture,
        verifiedAt: e.verifiedAt,
        ...summary,
      };
    })
    .sort((a, b) => (a.verifiedAt ?? '').localeCompare(b.verifiedAt ?? ''));
}
