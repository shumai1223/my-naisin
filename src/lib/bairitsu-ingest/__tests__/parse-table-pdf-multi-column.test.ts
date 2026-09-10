import { type PdfPageGeometry } from '../parse-table-pdf';
import { TOKUSHIMA_COMPETITION_RATES } from '@/data/competition-rates/tokushima';
import tokushimaR8Geometry from '../__fixtures__/tokushima-r8-geometry.json';
import { parseTokushima } from '../parsers/tokushima';

/**
 * T-Y11B 段階2-b: 「1ページに複数の表が左右に並ぶ県」向け組み立て（tokushima型）の検証テスト。
 * ibaraki型・tochigi型・akita型のいずれとも異なる第4のパターン: 全日制が左右2段組
 * （+定時制1段は対象外）で、各段が独立にibaraki型の「学校名遅延（結合セル中央配置）」を
 * 起こす。フィクスチャは令和8年度公表PDF（全1ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（2026-09-02取得・実データそのもの）。
 *
 * ⚠️**この県だけは「順序も含めた完全一致」を検証基準にしない**。既存データの並び順を精査した
 * 結果、LEFT/MIDDLE2段の物理的な読み順が単純な規則に従っておらず（例:
 * 阿南光の4学科のうち3学科は早い位置に、残り1学科だけ離れた位置に収録されている）、
 * 当時の転記自体がvision解析＋個別検証を要する非機械的な作業だったと判断したため
 * （詳細は`ops/tasks/T-Y11B-bairitsu-ingest-parsers.md`参照）。検証は
 * **学校×学科×数値の集合として一致するか**で行う。
 *
 * ⚠️2026-09-10訂正: かつてここに「那賀/海部の1件は幾何学的に一意に決定できない曖昧ケースで
 * WebSearch裏取りにより補正する」という記述があったが、段階台帳17県目調査（独立3資料＋R5〜R7の
 * 3年度分の一貫した大小関係との突き合わせ）により、**そのWebSearch裏取りの結論自体が誤りで、
 * パーサの生の幾何学的パース結果（那賀=quota30・海部=quota47）の方が正しかった**と判明した。
 * `parsers/tokushima.ts`の`applyKnownAmbiguityCorrection`補正は削除し、`competition-rates/
 * tokushima.ts`側を訂正済み（詳細は同ファイルのヘッダコメント参照）。
 *
 * ⚠️2026-09-06(T-Y11E E-1/E-6): パース本体は`../parsers/tokushima.ts`の`parseTokushima()`へ純関数
 * として抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
function recordKey(r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

describe('bairitsu-ingest parse-table-pdf 複数列組ページ (tokushima R8 実データ検証)', () => {
  const parsed = parseTokushima([tokushimaR8Geometry as PdfPageGeometry]);

  const expectedR8Records = TOKUSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（69件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(69);
  });

  test('レコードの集合が既存データと完全一致する（順不同・理由は本ファイル冒頭コメント参照）', () => {
    const parsedKeys = new Set(parsed.map(recordKey));
    const expectedKeys = new Set(expectedR8Records.map(recordKey));
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('グランドトータルが公式「全日制計」行と一致する（4,165 / 4,160）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    const official = TOKUSHIMA_COMPETITION_RATES.officialSubtotals[0];
    expect(sumQuota).toBe(official.quota);
    expect(sumApplicants).toBe(official.finalApplicants);
  });

  test('罫線が無い表の先頭行・末尾行が欠落しない（城東・富岡西の実例）', () => {
    // T-Y11F §5順序#8でpage/rowIndex（出典ロケータ用）が追加されたため、それ以外のフィールドで比較する
    const joto = parsed.find((r) => r.schoolName === '城東' && r.department === '普通');
    expect({ schoolName: joto?.schoolName, department: joto?.department, quota: joto?.quota, finalApplicants: joto?.finalApplicants, finalRate: joto?.finalRate }).toEqual({
      schoolName: '城東', department: '普通', quota: 251, finalApplicants: 243, finalRate: 0.97,
    });
    const tominishi = parsed.find((r) => r.schoolName === '富岡西' && r.department === '理数');
    expect({ schoolName: tominishi?.schoolName, department: tominishi?.department, quota: tominishi?.quota, finalApplicants: tominishi?.finalApplicants, finalRate: tominishi?.finalRate }).toEqual({
      schoolName: '富岡西', department: '理数', quota: 30, finalApplicants: 18, finalRate: 0.6,
    });
  });
});
