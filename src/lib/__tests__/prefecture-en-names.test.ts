/**
 * 都道府県コード→英語表記(X-20 Phase2)の契約テスト。
 * 標準的なローマ字表記の変換のみを検証し、新規の一次データ・推測値は扱わない。
 */
import { PREFECTURES } from '../prefectures';
import { getPrefectureEnName, getRegionEnName, hasCompleteEnNameCoverage } from '../prefecture-en-names';

describe('getPrefectureEnName', () => {
  test('北海道・東京都・大阪府・京都府は例外表記', () => {
    expect(getPrefectureEnName('hokkaido')).toBe('Hokkaido');
    expect(getPrefectureEnName('tokyo')).toBe('Tokyo');
    expect(getPrefectureEnName('osaka')).toBe('Osaka Prefecture');
    expect(getPrefectureEnName('kyoto')).toBe('Kyoto Prefecture');
  });

  test('その他の県は"X Prefecture"で統一', () => {
    expect(getPrefectureEnName('kanagawa')).toBe('Kanagawa Prefecture');
    expect(getPrefectureEnName('fukuoka')).toBe('Fukuoka Prefecture');
    expect(getPrefectureEnName('okinawa')).toBe('Okinawa Prefecture');
  });

  test('未知のコードはnull', () => {
    expect(getPrefectureEnName('narnia')).toBeNull();
  });

  test('全47都道府県コードが英語名マップに漏れなく存在する(prefectures.tsとの整合)', () => {
    expect(hasCompleteEnNameCoverage()).toBe(true);
    for (const p of PREFECTURES) {
      expect(getPrefectureEnName(p.code)).not.toBeNull();
    }
  });
});

describe('getRegionEnName', () => {
  test('7区分すべてが英訳される', () => {
    expect(getRegionEnName('北海道・東北')).toBe('Hokkaido & Tohoku');
    expect(getRegionEnName('関東')).toBe('Kanto');
    expect(getRegionEnName('中部')).toBe('Chubu');
    expect(getRegionEnName('近畿')).toBe('Kinki (Kansai)');
    expect(getRegionEnName('中国')).toBe('Chugoku');
    expect(getRegionEnName('四国')).toBe('Shikoku');
    expect(getRegionEnName('九州・沖縄')).toBe('Kyushu & Okinawa');
  });

  test('未知の区分文字列は元の値をそのまま返す(フォールバック)', () => {
    expect(getRegionEnName('未知の地域')).toBe('未知の地域');
  });

  test('prefectures.tsに実在する全regionが変換対象になっている(未翻訳の取りこぼし検知)', () => {
    const regions = new Set(PREFECTURES.map((p) => p.region));
    for (const region of regions) {
      const translated = getRegionEnName(region);
      expect(translated).not.toBe(region); // フォールバック(未翻訳)でないことを確認
    }
  });
});
