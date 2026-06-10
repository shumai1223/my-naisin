/**
 * 公開データAPI（/api/naishin・/api/naishin/{code}・/api/mcp・/developers）の契約テスト。
 *
 * naishin-dataset.ts の純関数群が「唯一の正準ソース」であり、各ルートはその薄いラッパー。
 * よってここでビルダーの形（スキーマ）を固定すれば、API契約の回帰を防げる。
 */

import {
  buildDatasetIndex,
  buildPrefectureDetail,
  buildResourceList,
  readResourceByUri,
  calculateNaishin,
  DATASET_META,
  DATASET_DISTRIBUTION,
} from '../naishin-dataset';
import { calculateTotalScore } from '../utils';
import type { SubjectKey } from '../types';

describe('buildDatasetIndex（/api/naishin 契約）', () => {
  const index = buildDatasetIndex();

  test('47都道府県・metaのcountが一致', () => {
    expect(index.prefectures).toHaveLength(47);
    expect(index.meta.count).toBe(47);
  });

  test('ライセンスは出典明記必須・帰属が入る', () => {
    expect(DATASET_META.license.type).toBe('attribution-required');
    expect(DATASET_META.license.attribution).toContain('my-naishin.com');
  });

  test('各県が必須フィールドと正しいURL形を持つ', () => {
    for (const p of index.prefectures) {
      expect(p.code).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.region).toBeTruthy();
      expect(p.maxScore).toBeGreaterThan(0);
      expect(Array.isArray(p.targetGrades)).toBe(true);
      expect(p.toolUrl).toBe(`https://my-naishin.com/${p.code}/naishin`);
      expect(p.apiUrl).toBe(`https://my-naishin.com/api/naishin/${p.code}`);
    }
  });

  test('endpointsメタが揃う（新エンドポイント含む）', () => {
    expect(index.meta.endpoints.index).toContain('/api/naishin');
    expect(index.meta.endpoints.mcp).toContain('/api/mcp');
    expect(index.meta.endpoints.openapi).toContain('/api/openapi');
    expect(index.meta.endpoints.compare).toContain('/api/naishin/compare');
    expect(index.meta.endpoints.reverse).toContain('target');
  });
});

describe('buildPrefectureDetail（/api/naishin/{code} 契約）', () => {
  test('tokyo は計算式・計算例・目安校を含む', () => {
    const detail = buildPrefectureDetail('tokyo');
    expect(detail).not.toBeNull();
    expect(detail!.code).toBe('tokyo');
    expect(detail!.formula.summary).toBeTruthy();
    expect(detail!.formula.coreSubjects).toHaveLength(5);
    expect(detail!.formula.practicalSubjects).toHaveLength(4);
    // オール3/4/5の確定値
    expect(detail!.examples.map((e) => e.label)).toEqual(['オール3', 'オール4', 'オール5']);
    for (const ex of detail!.examples) {
      expect(ex.total).toBeLessThanOrEqual(ex.max);
      expect(ex.percent).toBeGreaterThanOrEqual(0);
      expect(ex.percent).toBeLessThanOrEqual(100);
    }
    expect(Array.isArray(detail!.targetSchools)).toBe(true);
  });

  test('存在しない県は null', () => {
    expect(buildPrefectureDetail('atlantis')).toBeNull();
  });
});

describe('calculateNaishin（計算API/MCP 契約・信頼の堀）', () => {
  test('範囲外入力はクランプし、警告とtotal整合を返す', () => {
    const res = calculateNaishin({
      prefectureCode: 'tokyo',
      scores: { math: 99, japanese: -3, english: 4.7 } as Partial<Record<SubjectKey, number>>,
    });
    expect(res).not.toBeNull();
    // 返却scoresは必ず1〜5の整数
    for (const v of Object.values(res!.scores)) {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    }
    // total は返却scoresと厳密整合（食い違いゼロ）
    expect(res!.total).toBe(calculateTotalScore(res!.scores, 'tokyo'));
    expect(res!.warning).toBeTruthy();
    expect(res!.adjustedInputs!.length).toBeGreaterThan(0);
  });

  test('存在しない県は null', () => {
    expect(calculateNaishin({ prefectureCode: 'nope', scores: {} })).toBeNull();
  });
});

describe('MCP resources（resources/list・resources/read 契約）', () => {
  test('47件のリソースが揃い、各uriが /api/naishin/ を指す', () => {
    const resources = buildResourceList();
    expect(resources).toHaveLength(47);
    for (const r of resources) {
      expect(r.uri).toContain('https://my-naishin.com/api/naishin/');
      expect(r.name).toBeTruthy();
      expect(r.mimeType).toBe('application/json');
    }
  });

  test('resources/read はuriから該当県の詳細JSONを返す', () => {
    const res = readResourceByUri('https://my-naishin.com/api/naishin/tokyo');
    expect(res).not.toBeNull();
    expect(res!.mimeType).toBe('application/json');
    const parsed = JSON.parse(res!.text) as { code: string };
    expect(parsed.code).toBe('tokyo');
  });

  test('存在しないuriは null', () => {
    expect(readResourceByUri('https://my-naishin.com/api/naishin/atlantis')).toBeNull();
  });
});

describe('DATASET_DISTRIBUTION（Dataset構造化の契約）', () => {
  test('DataDownload(JSON)が /api/naishin を指す', () => {
    expect(DATASET_DISTRIBUTION[0]['@type']).toBe('DataDownload');
    expect(DATASET_DISTRIBUTION[0].encodingFormat).toBe('application/json');
    expect(DATASET_DISTRIBUTION[0].contentUrl).toContain('/api/naishin');
  });

  test('OpenAPI仕様書もDataDownloadとして公開', () => {
    const openapi = DATASET_DISTRIBUTION.find((d) => d.contentUrl.includes('/api/openapi'));
    expect(openapi).toBeDefined();
    expect(openapi!['@type']).toBe('DataDownload');
  });
});
