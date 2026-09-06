import { getPrefectureParser, PREFECTURE_PARSER_REGISTRY } from '../registry';
import type { TottoriParsedRow } from '../parsers/tottori';
import type { PdfPageGeometry } from '../parse-table-pdf';
import toyamaR8Geometry from '../__fixtures__/toyama-r8-geometry.json';
import aomoriR8Geometry from '../__fixtures__/aomori-r8-geometry.json';
import iwateR8Geometry from '../__fixtures__/iwate-r8-geometry.json';
import fukuiR8Geometry from '../__fixtures__/fukui-r8-geometry.json';
import kagawaR8Geometry from '../__fixtures__/kagawa-r8-geometry.json';
import ehimeR8Geometry from '../__fixtures__/ehime-r8-geometry.json';
import chibaR8Geometry from '../__fixtures__/chiba-r8-geometry.json';
import yamanashiR8Geometry from '../__fixtures__/yamanashi-r8-geometry.json';
import miyagiR8Geometry from '../__fixtures__/miyagi-r8-geometry.json';
import nagasakiR8Geometry from '../__fixtures__/nagasaki-r8-geometry.json';
import saitamaR8Geometry from '../__fixtures__/saitama-r8-geometry.json';
import gunmaR8Geometry from '../__fixtures__/gunma-r8-geometry.json';
import shimaneR8Geometry from '../__fixtures__/shimane-r8-geometry.json';
import naraR8Geometry from '../__fixtures__/nara-r8-geometry.json';
import kyotoR8Geometry from '../__fixtures__/kyoto-r8-geometry.json';
import hiroshimaR8Geometry from '../__fixtures__/hiroshima-r8-geometry.json';
import wakayamaR8Geometry from '../__fixtures__/wakayama-r8-geometry.json';
import okinawaR8Geometry from '../__fixtures__/okinawa-r8-geometry.json';
import gifuR8Geometry from '../__fixtures__/gifu-r8-geometry.json';
import niigataR8Geometry from '../__fixtures__/niigata-r8-geometry.json';
import sagaR8Geometry from '../__fixtures__/saga-r8-geometry.json';
import tottoriR8Geometry from '../__fixtures__/tottori-r8-geometry.json';
import kagoshimaR8Geometry from '../__fixtures__/kagoshima-r8-geometry.json';
import shizuokaR8Geometry from '../__fixtures__/shizuoka-r8-geometry.json';
import oitaR8Geometry from '../__fixtures__/oita-r8-geometry.json';
import kumamotoR8Geometry from '../__fixtures__/kumamoto-r8-geometry.json';
import shigaR8Geometry from '../__fixtures__/shiga-r8-geometry.json';
import kochiR8Geometry from '../__fixtures__/kochi-r8-geometry.json';
import yamagataR8Geometry from '../__fixtures__/yamagata-r8-geometry.json';
import fukuokaR8Geometry from '../__fixtures__/fukuoka-r8-geometry.json';
import { TOYAMA_COMPETITION_RATES } from '@/data/competition-rates/toyama';
import { AOMORI_COMPETITION_RATES } from '@/data/competition-rates/aomori';
import { IWATE_COMPETITION_RATES } from '@/data/competition-rates/iwate';
import { FUKUI_COMPETITION_RATES } from '@/data/competition-rates/fukui';
import { KAGAWA_COMPETITION_RATES } from '@/data/competition-rates/kagawa';
import { EHIME_COMPETITION_RATES } from '@/data/competition-rates/ehime';
import { CHIBA_COMPETITION_RATES } from '@/data/competition-rates/chiba';
import { YAMANASHI_COMPETITION_RATES } from '@/data/competition-rates/yamanashi';
import { MIYAGI_COMPETITION_RATES } from '@/data/competition-rates/miyagi';
import { NAGASAKI_COMPETITION_RATES } from '@/data/competition-rates/nagasaki';
import { SAITAMA_COMPETITION_RATES } from '@/data/competition-rates/saitama';
import { GUNMA_COMPETITION_RATES } from '@/data/competition-rates/gunma';
import { SHIMANE_COMPETITION_RATES } from '@/data/competition-rates/shimane';
import { NARA_COMPETITION_RATES } from '@/data/competition-rates/nara';
import { KYOTO_COMPETITION_RATES } from '@/data/competition-rates/kyoto';
import { HIROSHIMA_COMPETITION_RATES } from '@/data/competition-rates/hiroshima';
import { WAKAYAMA_COMPETITION_RATES } from '@/data/competition-rates/wakayama';
import { OKINAWA_COMPETITION_RATES } from '@/data/competition-rates/okinawa';
import { GIFU_COMPETITION_RATES } from '@/data/competition-rates/gifu';
import { NIIGATA_COMPETITION_RATES } from '@/data/competition-rates/niigata';
import { SAGA_COMPETITION_RATES } from '@/data/competition-rates/saga';
import { TOTTORI_COMPETITION_RATES } from '@/data/competition-rates/tottori';
import { KAGOSHIMA_COMPETITION_RATES } from '@/data/competition-rates/kagoshima';
import { SHIZUOKA_COMPETITION_RATES } from '@/data/competition-rates/shizuoka';
import { OITA_COMPETITION_RATES } from '@/data/competition-rates/oita';
import { KUMAMOTO_COMPETITION_RATES } from '@/data/competition-rates/kumamoto';
import { SHIGA_COMPETITION_RATES } from '@/data/competition-rates/shiga';
import { KOCHI_COMPETITION_RATES } from '@/data/competition-rates/kochi';
import { YAMAGATA_COMPETITION_RATES } from '@/data/competition-rates/yamagata';
import { FUKUOKA_COMPETITION_RATES } from '@/data/competition-rates/fukuoka';

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

  it('fukuiのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('fukui');
    expect(parser).toBeDefined();
    const parsed = parser!(fukuiR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = FUKUI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('kagawaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('kagawa');
    expect(parser).toBeDefined();
    const parsed = parser!(kagawaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = KAGAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('ehimeのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('ehime');
    expect(parser).toBeDefined();
    const parsed = parser!(ehimeR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = EHIME_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('chibaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('chiba');
    expect(parser).toBeDefined();
    const parsed = parser!(chibaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = CHIBA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('yamanashiのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('yamanashi');
    expect(parser).toBeDefined();
    const parsed = parser!(yamanashiR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = YAMANASHI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('miyagiのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('miyagi');
    expect(parser).toBeDefined();
    const parsed = parser!(miyagiR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = MIYAGI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('nagasakiのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('nagasaki');
    expect(parser).toBeDefined();
    const parsed = parser!(nagasakiR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = NAGASAKI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('saitamaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('saitama');
    expect(parser).toBeDefined();
    const parsed = parser!(saitamaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = SAITAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('gunmaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('gunma');
    expect(parser).toBeDefined();
    const parsed = parser!(gunmaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = GUNMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('shimaneのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('shimane');
    expect(parser).toBeDefined();
    const parsed = parser!(shimaneR8Geometry as unknown as PdfPageGeometry[]);
    const expectedR8Records = SHIMANE_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('naraのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('nara');
    expect(parser).toBeDefined();
    const parsed = parser!(naraR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = NARA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('kyotoのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('kyoto');
    expect(parser).toBeDefined();
    const parsed = parser!(kyotoR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = KYOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('hiroshimaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('hiroshima');
    expect(parser).toBeDefined();
    const parsed = parser!(hiroshimaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = HIROSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('wakayamaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('wakayama');
    expect(parser).toBeDefined();
    const parsed = parser!(wakayamaR8Geometry as unknown as PdfPageGeometry[]);
    const expectedR8Records = WAKAYAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('okinawaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('okinawa');
    expect(parser).toBeDefined();
    const parsed = parser!(okinawaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = OKINAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('gifuのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('gifu');
    expect(parser).toBeDefined();
    const parsed = parser!(gifuR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = GIFU_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('niigataのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('niigata');
    expect(parser).toBeDefined();
    const parsed = parser!(niigataR8Geometry as unknown as PdfPageGeometry[]);
    const expectedR8Records = NIIGATA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('sagaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('saga');
    expect(parser).toBeDefined();
    const parsed = parser!(sagaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = SAGA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('tottoriのパーサが登録されており、既存の手作業データと完全一致する結果を返す（areaフィールド含む）', () => {
    const parser = getPrefectureParser('tottori');
    expect(parser).toBeDefined();
    const parsed = parser!(tottoriR8Geometry as PdfPageGeometry[]) as unknown as TottoriParsedRow[];
    const expectedR8Records = TOTTORI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    expect(parsed).toEqual(
      expectedR8Records.map((e) => ({
        schoolName: e.schoolName,
        area: e.area,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      }))
    );
  });

  it('kagoshimaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('kagoshima');
    expect(parser).toBeDefined();
    const parsed = parser!(kagoshimaR8Geometry as unknown as PdfPageGeometry[]);
    const expectedR8Records = KAGOSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('shizuokaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('shizuoka');
    expect(parser).toBeDefined();
    const parsed = parser!(shizuokaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = SHIZUOKA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('oitaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('oita');
    expect(parser).toBeDefined();
    const parsed = parser!(oitaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = OITA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('kumamotoのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('kumamoto');
    expect(parser).toBeDefined();
    const parsed = parser!(kumamotoR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = KUMAMOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('shigaのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('shiga');
    expect(parser).toBeDefined();
    const parsed = parser!(shigaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = SHIGA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('kochiのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('kochi');
    expect(parser).toBeDefined();
    const parsed = parser!(kochiR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = KOCHI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('yamagataのパーサが登録されており、既存の手作業データと完全一致する結果を返す', () => {
    const parser = getPrefectureParser('yamagata');
    expect(parser).toBeDefined();
    const parsed = parser!(yamagataR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = YAMAGATA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
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

  it('fukuokaのパーサが登録されており、既存の手作業データと多重集合一致する結果を返す（既知のデータ誤記1件を除く・編集履歴により順序は一致しないため順不同比較）', () => {
    const parser = getPrefectureParser('fukuoka');
    expect(parser).toBeDefined();
    const parsed = parser!(fukuokaR8Geometry as PdfPageGeometry[]);
    const expectedR8Records = FUKUOKA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);
    const KNOWN_DATA_TYPO = new Set(['八幡|200|216|1.08']);
    const nonDepartmentKeyOf = (r: { schoolName: string; quota: number; finalApplicants: number; finalRate: number }) =>
      `${r.schoolName}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
    const keyOf = (r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }) =>
      `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
    const parsedKeys = parsed.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    const expectedKeys = expectedR8Records.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    expect(parsedKeys).toEqual(expectedKeys);
  });

  it('レジストリに登録済みの県コード一覧は現時点でtoyama/aomori/iwate/fukui/kagawa/ehime/chiba/yamanashi/miyagi/nagasaki/saitama/gunma/shimane/nara/kyoto/hiroshima/wakayama/okinawa/gifu/niigata/saga/tottori/kagoshima/shizuoka/oita/kumamoto/shiga/kochi/yamagata/fukuokaのみ（1県ずつ移設する方針・追加時はここも更新）', () => {
    expect(Object.keys(PREFECTURE_PARSER_REGISTRY)).toEqual(['toyama', 'aomori', 'iwate', 'fukui', 'kagawa', 'ehime', 'chiba', 'yamanashi', 'miyagi', 'nagasaki', 'saitama', 'gunma', 'shimane', 'nara', 'kyoto', 'hiroshima', 'wakayama', 'okinawa', 'gifu', 'niigata', 'saga', 'tottori', 'kagoshima', 'shizuoka', 'oita', 'kumamoto', 'shiga', 'kochi', 'yamagata', 'fukuoka']);
  });
});
