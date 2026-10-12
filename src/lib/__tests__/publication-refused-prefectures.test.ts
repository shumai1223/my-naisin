import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { COMPETITION_RATE_HISTORY_BY_PREFECTURE } from '@/data/competition-rate-history';
import { TEIJI_COMPETITION_RATE_BY_PREFECTURE } from '@/data/teiji-competition-rates';
import { STAGE_LEDGER_BY_PREFECTURE } from '@/data/stage-ledger';
import { DATA_LICENSE_LEDGER } from '../data-license-ledger';
import { getPrefectureSchoolPageData, INDEXED_SCHOOL_PAGE_PREFECTURE_CODES } from '../school-page-lookup';
import { isPublicationRefused, PUBLICATION_REFUSED_PREFECTURES } from '../publication-refused-prefectures';

describe('掲載を断られた県（応募状況データの非公開）', () => {
  it('台帳でredistribution=ngの県は、すべて非公開リストに入っている（掲載の許諾が無いのに公開が残る事故を防ぐ）', () => {
    const ng = Object.values(DATA_LICENSE_LEDGER).filter((e) => e.redistribution === 'ng').map((e) => e.prefecture);
    for (const code of ng) expect(isPublicationRefused(code)).toBe(true);
  });

  it.each([...PUBLICATION_REFUSED_PREFECTURES])('%s は公開用の倍率データ・学校ページ・sitemapから外れている', (code) => {
    expect(COMPETITION_RATE_BY_PREFECTURE[code]).toBeUndefined();
    expect(COMPETITION_RATE_HISTORY_BY_PREFECTURE[code]).toBeUndefined();
    expect(TEIJI_COMPETITION_RATE_BY_PREFECTURE[code]).toBeUndefined();
    expect(STAGE_LEDGER_BY_PREFECTURE[code]).toBeUndefined();
    expect(getPrefectureSchoolPageData(code)).toBeNull();
    expect(INDEXED_SCHOOL_PAGE_PREFECTURE_CODES).not.toContain(code);
  });
});