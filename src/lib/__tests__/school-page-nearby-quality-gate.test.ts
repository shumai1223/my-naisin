/**
 * 学校ページ(Λ-2)の「1ページの下限品質」不変条件（③近隣校リンク3本以上）の回帰ガード。
 *
 * 2026-08-02発見：`school-page-wave-readiness.ts`でwave2候補41県を機械採点したところ、
 * うち39県は一次資料に`area`(学区)が存在せず、旧`selectNearbySchools`はarea不在の学校に
 * 対して常に空配列を返していた＝これらの県をindex解禁すると全ページで近隣校リンクが0本になり、
 * 品質下限([[fable5-fullaccel-backlog-2026-07]]のΛ-2行)に違反したまま出荷するところだった。
 * `selectNearbySchools`に同一県内・倍率が近い順のフォールバックを追加して解消済み。
 * このテストは同種の回帰を機械的に検知する：学校が2校以上ある県では、
 * 全ての学校が最低1件の近隣校リンクを持つことを全県横断で固定する。
 */
import { PREFECTURES } from '../prefectures';
import { getPrefectureSchoolPageData } from '../school-page-lookup';
import { selectNearbySchools } from '../school-page-data';

describe('学校ページの近隣校リンク下限品質(全県横断)', () => {
  const prefectureCodes = PREFECTURES.map((p) => p.code);

  test.each(prefectureCodes)('%s: 学校2校以上なら全校が近隣校リンクを1件以上持つ', (code) => {
    const data = getPrefectureSchoolPageData(code);
    if (!data || data.schools.length < 2) return; // データ未整備/1校のみの県は対象外

    const emptyResults = data.schools.filter(
      (school) => selectNearbySchools(school, data.schools, 3).schools.length === 0
    );
    expect(emptyResults.map((s) => s.schoolCode)).toEqual([]);
  });
});
