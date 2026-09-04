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
   * ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): 従来ここには「既存データに4件の転記ミスが
   * ある」ことを示す`KNOWN_DATA_ERRORS`除外リストがあった（大宮科学技術・電気工学科の
   * quota/三郷工業技術・電気科のquota+finalRate/越谷総合技術の学科名/越谷北→越谷南の
   * 学校名）。全4件とも一次ソースの証拠（PDF原本の印字内容・grand total照合・年次一貫性）に
   * 基づき`saitama.ts`側を訂正したため、`expectedR8Records`(=既存データ)と`parsed`(=PDF
   * 再パース結果)が完全一致するようになった。除外ロジックは不要になったため削除し、
   * 「順序も含めて完全一致」の単一テストへ統合する。訂正の詳細根拠は
   * `ops/tasks/T-Y11D-saitama-4-corrections.md`と`saitama.ts`該当レコードのコメントを参照。
   */

  test('R8のレコード件数が既存データと一致する（241件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(241);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
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
