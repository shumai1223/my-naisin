import { normalizeSchoolNameForMatch, matchSchoolNameToCode, matchSchoolNames } from '../school-name-match';
import type { SchoolRecord } from '../school-master';

describe('normalizeSchoolNameForMatch', () => {
  test('都立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('東京都立日比谷高等学校')).toBe('日比谷');
  });

  test('府立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('大阪府立東淀川高等学校')).toBe('東淀川');
  });

  test('県立+高校（短縮表記）を除去する', () => {
    expect(normalizeSchoolNameForMatch('神奈川県立横浜翠嵐高校')).toBe('横浜翠嵐');
  });

  test('市立+高等学校を除去する', () => {
    expect(normalizeSchoolNameForMatch('横浜市立東高等学校')).toBe('東');
  });

  test('接頭辞・接尾辞が無い名称はそのまま', () => {
    expect(normalizeSchoolNameForMatch('日比谷')).toBe('日比谷');
  });

  // 2026-08-02判明: miyagi/nagano/hokkaidoのschool-master正式名称は「立」を伴わない
  // (例: 東京都立〜 ではなく 宮城県〜)。裸の都/道/府/県もフォールバックで剥がせることを確認する。
  test('「立」を伴わない県名接頭辞(宮城県)を除去する', () => {
    expect(normalizeSchoolNameForMatch('宮城県仙台第二高等学校')).toBe('仙台第二');
  });

  test('「立」を伴わない県名接頭辞(長野県)を除去する', () => {
    expect(normalizeSchoolNameForMatch('長野県長野高等学校')).toBe('長野');
  });

  test('「立」を伴わない道名接頭辞(北海道)を除去する', () => {
    expect(normalizeSchoolNameForMatch('北海道札幌西高等学校')).toBe('札幌西');
  });

  test('「立」付き表記は従来どおり優先してマッチする(裸の県への誤短縮防止)', () => {
    expect(normalizeSchoolNameForMatch('神奈川県立横浜翠嵐高等学校')).toBe('横浜翠嵐');
  });

  // 2026-08-02判明・修正: 「京都府」は都道府県名の内部に別の型文字("都")を含む唯一の例。
  // 正規表現の文字クラスで裸の都/道/府/県を1文字フォールバックにすると、"府立"に到達する前に
  // "都"だけで誤って早期一致し正規化が壊れる(この事故で一度リグレッションした)。
  test('「京都府」は内部に"都"を含むが正しく府立を1単位として除去する(誤短縮の回帰防止)', () => {
    expect(normalizeSchoolNameForMatch('京都府立山城高等学校')).toBe('山城');
  });

  test('京都市立の学校も引き続き正しく除去する', () => {
    expect(normalizeSchoolNameForMatch('京都市立紫野高等学校')).toBe('紫野');
  });

  // 2026-08-02判明: 分校は「本校名+高等学校+分校名」の順で「高等学校」が末尾でなく中間に来る。
  test('分校名(本校名+高等学校+分校名)は中間の「高等学校」も除去する', () => {
    expect(normalizeSchoolNameForMatch('長野県篠ノ井高等学校犀峡校')).toBe('篠ノ井犀峡校');
  });

  test('分校名(戸隠分校のような「分校」表記)でも同様に除去する', () => {
    expect(normalizeSchoolNameForMatch('長野県長野吉田高等学校戸隠分校')).toBe('長野吉田戸隠分校');
  });
});

function rec(code: string, name: string): SchoolRecord {
  return { code, name, address: '', postalCode: '', branch: false };
}

describe('matchSchoolNameToCode', () => {
  const master: SchoolRecord[] = [
    rec('A1', '東京都立日比谷高等学校'),
    rec('A2', '東京都立三田高等学校'),
    rec('A3', '東京都立東高等学校'),
    rec('A4', '東京都立東久留米総合高等学校'),
  ];

  test('完全一致すれば学校コードを返す', () => {
    const result = matchSchoolNameToCode('日比谷', master);
    expect(result.matchedCode).toBe('A1');
    expect(result.reason).toBe('matched');
  });

  test('一致しない場合はno-match(nullを返し誤マッチしない)', () => {
    const result = matchSchoolNameToCode('存在しない高校', master);
    expect(result.matchedCode).toBeNull();
    expect(result.reason).toBe('no-match');
  });

  test('似た名称でも完全一致でなければマッチしない(東 vs 東久留米総合)', () => {
    const result = matchSchoolNameToCode('東', master);
    expect(result.matchedCode).toBe('A3');
    expect(result.reason).toBe('matched');
  });

  test('正規化後に複数校が同名になる場合はambiguousでnullを返す(分校等の誤紐付け防止)', () => {
    const ambiguousMaster: SchoolRecord[] = [
      rec('B1', '東京都立大森高等学校'),
      rec('B2', '東京都立大森西高等学校（分校）大森高等学校'), // 意図的に正規化後'東京都立大森高等学校（分校）大森'と別名になる想定
    ];
    // 明示的にambiguousケースを作る: 2校が全く同じ正規化結果を持つ場合
    const collidingMaster: SchoolRecord[] = [rec('C1', '東京都立大森高等学校'), rec('C2', '東京都立大森高校')];
    const result = matchSchoolNameToCode('大森', collidingMaster);
    expect(result.matchedCode).toBeNull();
    expect(result.reason).toBe('ambiguous');
    void ambiguousMaster; // 上のコメント用ダミー(未使用警告回避)
  });

  // 2026-08-02判明: hiroshima等では市立学校の短縮表記が「市立を残した形」("広島市立基町")で
  // 記録されており、市立を除去した形("基町")では一致しなかった(実データで8校のno-matchを確認)。
  // 県ごとにどちらの流儀か異なる(kyotoは除去・hiroshima/osaka/aichiは残す)ため、両方を候補にする。
  describe('市立学校の「市立を残す」流儀への対応(2026-08-02)', () => {
    const municipalMaster: SchoolRecord[] = [rec('D1', '広島市立基町高等学校')];

    test('市立を残した形("広島市立基町")でも一致する', () => {
      const result = matchSchoolNameToCode('広島市立基町', municipalMaster);
      expect(result.matchedCode).toBe('D1');
      expect(result.reason).toBe('matched');
    });

    test('市立を除去した形("基町")でも引き続き一致する(kyoto等の従来流儀を壊さない)', () => {
      const result = matchSchoolNameToCode('基町', municipalMaster);
      expect(result.matchedCode).toBe('D1');
      expect(result.reason).toBe('matched');
    });

    test('県立と市立で同名の学校が実在する場合は、どちらの表記で入力してもambiguousのまま(誤紐付け防止)', () => {
      const collidingMaster: SchoolRecord[] = [
        rec('E1', '広島県立広島工業高等学校'),
        rec('E2', '広島市立広島工業高等学校'),
      ];
      expect(matchSchoolNameToCode('広島工業', collidingMaster).reason).toBe('ambiguous');
    });
  });
});

describe('matchSchoolNames', () => {
  const master: SchoolRecord[] = [rec('A1', '東京都立日比谷高等学校'), rec('A2', '東京都立三田高等学校')];

  test('重複したschoolName(同一校の複数学科レコード)は1回だけ突合する', () => {
    const summary = matchSchoolNames(['日比谷', '日比谷', '三田'], master);
    expect(summary.results).toHaveLength(2);
    expect(summary.matchedCount).toBe(2);
    expect(summary.noMatchCount).toBe(0);
    expect(summary.ambiguousCount).toBe(0);
  });

  test('一致しない名称が混在する場合はnoMatchCountに反映される', () => {
    const summary = matchSchoolNames(['日比谷', '存在しない高校'], master);
    expect(summary.matchedCount).toBe(1);
    expect(summary.noMatchCount).toBe(1);
  });
});
