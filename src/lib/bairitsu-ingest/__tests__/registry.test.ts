import { getPrefectureParser, PREFECTURE_PARSER_REGISTRY } from '../registry';
import type { PdfPageGeometry } from '../parse-table-pdf';
import toyamaR8Geometry from '../__fixtures__/toyama-r8-geometry.json';
import aomoriR8Geometry from '../__fixtures__/aomori-r8-geometry.json';
import iwateR8Geometry from '../__fixtures__/iwate-r8-geometry.json';
import { TOYAMA_COMPETITION_RATES } from '@/data/competition-rates/toyama';
import { AOMORI_COMPETITION_RATES } from '@/data/competition-rates/aomori';
import { IWATE_COMPETITION_RATES } from '@/data/competition-rates/iwate';

/**
 * T-Y11E E-1: レジストリの不変条件テスト。
 * 「県コード → パーサ関数」が実際に引けて、既存の手作業データと一致する出力を返すことを
 * 機械的に固定する（`ops/tasks/T-Y11E-r9-harvest-pipeline.md`のE-1節）。
 */
describe('bairitsu-ingest registry（T-Y11E E-1）', () => {
  it('未登録の県コードはundefinedを返す（例外を投げない）', () => {
    expect(getPrefectureParser('存在しない県コード')).toBeUndefined();
  });

  it('toyamaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('toyama');
    expect(parser).toBeDefined();
    const parsed = parser!(toyamaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = TOYAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    expect(parsed).toEqual(
      expectedR8Records.map((e) => ({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      }))
    );
  });

  it('aomoriのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('aomori');
    expect(parser).toBeDefined();
    const parsed = parser!(aomoriR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = AOMORI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    expect(parsed).toEqual(
      expectedR8Records.map((e) => ({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      }))
    );
  });

  it('iwateのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('iwate');
    expect(parser).toBeDefined();
    const parsed = parser!(iwateR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = IWATE_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    expect(parsed).toEqual(
      expectedR8Records.map((e) => ({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      }))
    );
  });

  it('レジストリに登録済みの県コード一覧は現時点でtoyama/aomori/iwateのみ（1県ずつ移設する方針・追加時はここも更新）', () => {
    expect(Object.keys(PREFECTURE_PARSER_REGISTRY)).toEqual(['toyama', 'aomori', 'iwate']);
  });
});
