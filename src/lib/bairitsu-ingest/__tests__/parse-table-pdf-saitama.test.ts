import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { SAITAMA_COMPETITION_RATES } from '@/data/competition-rates/saitama';
import saitamaR8Geometry from '../__fixtures__/saitama-r8-geometry.json';

/**
 * T-Y11B 段階2-b: saitama(埼玉県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）。
 * chibaと同様「1行=1学校×1学科」だが、列数がchibaより多い（性別・募集人員(内数の転編入者数
 * 込み)・入学許可予定者数(A)・確定志願者数(B)・倍率(B/A)・2/10時点比較の3列、の計10列）。
 * 既存データのA列（入学許可予定者数＝募集人員から転編入者数を差し引いた実質枠）をquota、
 * B列（志願確定者数）をfinalApplicantsとして採用する設計（ヘッダコメント記載通り）。
 *
 * ⚠️小計/合計行（「普通科計」「農業科計」「全日制 普通・専門・総合学科計」等）は、学科名の
 * ラベルが学校名列にはみ出し、末尾の「計」の文字だけが性別列の位置（x0≈247.4）に単独で
 * 印字される特異なレイアウト。学科名列自体は空欄になるため`department`が空文字になり
 * 通常は`assembleSimpleTableRows`の`!department`チェックで自然に除外されるが、**県全体の
 * 合計行（「全日制 普通・専門・総合学科計」）だけは学校名ラベルの文字幅が学校名列の境界
 * (x<145)を超えて学科名列にまではみ出し、学科名列に「学科」等の断片が入ってしまい
 * 除外されない**（会計科等の実在学科名にも「計」の字が含まれるため、単純な文字列
 * マッチでは判定できない）。よって性別列の位置(x0≈245〜256)に「計」の文字が単独で
 * 出現する行を、抽出前の生の行データの段階で丸ごと除外する（実在の学科名の「計」は
 * 常に学科名列(x145〜245)の内側に出現し性別列位置には現れないため、位置ベースの判定は
 * 安全）。
 *
 * フィクスチャは令和8年度公表PDF（`r8shigankakutei0219.pdf`・全9頁のうち全日制の本体表
 * 8頁分[page index 0-7]）を`extract-pdf-geometry.py`で抽出した文字座標データ。9頁目
 * [page index 8]は「定時制」のためスコープ外（chiba/tokyo/kanagawa/saitamaのR7掛-1追記と
 * 同じ設計判断）。
 */
const SAITAMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [0, 145, 245, 360, 395, 422, 460],
  // 列: 学校名,学科・コース・系,性別+募集人員(内数の転編入者数込み・未使用),
  //     入学許可予定者数(A=quota),確定志願者数(B=finalApplicants),倍率(B/A=finalRate)
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (saitama R8 実データ検証)', () => {
  const geometries = saitamaR8Geometry as PdfPageGeometry[];

  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0)
      // ⚠️小計/合計行の判定: 性別列の位置(x0≈245〜256)に「計」の文字が単独で出現する行を除外する。
      .filter((row) => !row.chars.some((c) => c.c === '計' && c.x0 >= 244 && c.x0 <= 256))
      .map((row) => extractRowFields(row.chars, SAITAMA_LAYOUT))
  );

  // ⚠️市立高校の学校名には脚注記号「〇」が接頭辞として付与される（「○印は、市立高等学校」）。
  // 既存データはこの記号を含めない学校名で収録している。
  const parsedRaw = assembleSimpleTableRows(
    allRowFields.map((f) => ({ ...f, schoolName: f.schoolName.replace(/^[〇○]/, '') })),
    {}
  );

  // ⚠️伊奈学園総合の「普通科」は普通・スポーツ科学・芸術の3コースの合算値（PDF脚注に明記）。
  // 既存データは学科名に「（普通・スポーツ科学・芸術の合算）」という注記を追加している
  // （PDF本文の生テキストには無い注記のため、既存データを根拠にした個別補正で対応する）。
  const parsed = parsedRaw.map((r) => {
    if (r.schoolName === '伊奈学園総合' && r.department === '普通科') {
      return { ...r, department: '普通科（普通・スポーツ科学・芸術の合算）' };
    }
    return r;
  });

  const expectedR8Records = SAITAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  /**
   * ⚠️既存データに2件、quota(入学許可予定者数A)の転記ミスが見つかった。両方とも
   * パーサの誤りではなく既存データ側の誤りだと、各レコード自身のfinalRateとの整合性、および
   * grand total reconciliationの2系統で証明できる（finalrate-invariant.test.tsの
   * KNOWN_UNEXPLAINED_EXCEPTIONSと同型の扱い。既存データは書き換えず・パーサの出力も歪めず、
   * 既知の不一致として個別に除外して検証する）。
   *
   * ①大宮科学技術・電気工学科: 既存データ`quota:39`。PDF原本の該当セルには転編入者数の
   *   （）内数表記が無く、入学許可予定者数(A)欄には明確に「40」と印字されている（隣接する
   *   ロボット工学科の行は同じ募集人員でも「40(1)」→A=39という転編入調整があるため見た目が
   *   近く、コピペ起因の転記ミスと推測される）。既存データ自身のfinalRate=0.58は
   *   roundHalfUpScaled規約で23/40=0.575→0.58と一致する（23/39=0.5897→0.59であり不一致）。
   *   機械集計のgrand total（quota合計）もこの1件をquota=40とした場合のみPDFの34,603と
   *   完全一致する（quota=39のままだと34,602で1ズレる）。
   * ②三郷工業技術・電気科: 既存データ`quota:40`。PDF原本は逆に「40(1)」の転編入調整が
   *   あり、入学許可予定者数(A)は「39」・印字済み倍率(B÷A)は「0.82」（32÷39=0.8205→0.82）。
   *   既存データのfinalRate=0.8は32÷40=0.8ちょうどであり、PDFに印字された0.82とは
   *   食い違う（PDF自身の印字済み倍率と既存データが一致しない＝既存データ側の転記ミス）。
   * ③越谷総合技術・食物デザイン科: 既存データの学科名`食物デザイン科`はPDF原本に存在しない
   *   （PDF原本は「食物調理科」と印字。数値(quota40・applicants42・rate1.05)は完全一致）。
   *   直前の行が同校「服飾デザイン科」であるため、隣接行の学科名からの転記時の
   *   コピペ汚染と推測される。R7/R6/R5の同校同欄は全て「食物調理科」であり、R8だけが
   *   例外的に「デザイン科」表記になっていることからも、R8のみの単発の転記ミスと判断できる。
   * ④外国語科・越谷北/越谷南: 既存データはこのレコードの学校名を`越谷北`として収録し、
   *   ファイル冒頭のコメントにも「外国語科は『越谷南』（R7）↔『越谷北』（R8）のように
   *   学校間で開設が移動している」という趣旨の注記がある。しかし本テストが取得したPDF
   *   （既存データと**全く同一のURL** `documents/268192/r8shigankakutei0219.pdf`）を
   *   文字座標レベルで確認したところ、該当行は明確に「越谷南外国語科」（quota40・
   *   applicants52・rate1.30＝既存データの数値と完全一致）と印字されている。数値は
   *   完全一致するため学科の実体は同一レコードであり、南/北という対になる1文字だけが
   *   食い違っている（人為的な転記時の左右取り違えの典型例と推測される）。他の3件のような
   *   自己整合的な数値証拠（倍率の丸め・grand total）は無いため確度はやや低いが、
   *   同一URLの原本を直接確認した結果として記録する。
   */
  const KNOWN_DATA_ERRORS: Array<{ schoolName: string; department: string }> = [
    { schoolName: '大宮科学技術', department: '電気工学科' },
    { schoolName: '三郷工業技術', department: '電気科' },
    { schoolName: '越谷総合技術', department: '食物デザイン科' },
    { schoolName: '越谷北', department: '外国語科' },
  ];
  const knownErrorIndexes = KNOWN_DATA_ERRORS.map((e) => expectedR8Records.findIndex((r) => r.schoolName === e.schoolName && r.department === e.department));

  test('R8のレコード件数が既存データと一致する（241件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(241);
  });

  test('4件の既知の不一致が今も存在し、PDF原本（既存データと同一URL）の印字済み内容との突合結果を確認する', () => {
    for (const idx of knownErrorIndexes) expect(idx).toBeGreaterThanOrEqual(0);
    const [oomiyaIdx, misatoIdx, koshigayaIdx, kosigayaKitaIdx] = knownErrorIndexes;
    expect(expectedR8Records[oomiyaIdx]?.quota).toBe(39);
    expect(parsed[oomiyaIdx]?.quota).toBe(40);
    expect(expectedR8Records[misatoIdx]?.quota).toBe(40);
    expect(parsed[misatoIdx]?.quota).toBe(39);
    expect(parsed[misatoIdx]?.finalRate).toBe(0.82);
    expect(expectedR8Records[koshigayaIdx]?.department).toBe('食物デザイン科');
    expect(parsed[koshigayaIdx]?.department).toBe('食物調理科');
    expect(parsed[koshigayaIdx]?.quota).toBe(expectedR8Records[koshigayaIdx]?.quota);
    expect(parsed[koshigayaIdx]?.finalApplicants).toBe(expectedR8Records[koshigayaIdx]?.finalApplicants);
    expect(parsed[kosigayaKitaIdx]?.schoolName).toBe('越谷南');
    expect(parsed[kosigayaKitaIdx]?.quota).toBe(expectedR8Records[kosigayaKitaIdx]?.quota);
    expect(parsed[kosigayaKitaIdx]?.finalApplicants).toBe(expectedR8Records[kosigayaKitaIdx]?.finalApplicants);
    expect(parsed[kosigayaKitaIdx]?.finalRate).toBe(expectedR8Records[kosigayaKitaIdx]?.finalRate);
  });

  test('レコード単位で既存データと完全一致する（順序も含む・既知の不一致4件を除く）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      if (knownErrorIndexes.includes(i)) continue;
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('「普通科計」「専門学科計」「全日制 普通・専門・総合学科計」等の小計/合計行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 34603)).toBe(false);
    expect(parsed.some((r) => r.quota === 25517)).toBe(false);
  });

  test('機械集計のグランドトータルが「全日制 普通・専門・総合学科計」行（quota34,603・applicants35,976）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(34603);
    expect(sumApplicants).toBe(35976);
  });
});
