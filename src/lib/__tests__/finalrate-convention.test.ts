import {
  roundHalfUpScaled,
  truncScaled,
  isRoundingBoundary,
  parseDecimalToHundredths,
  classifyStoredRate,
  extractRateRecordsFromSource,
} from '../finalrate-convention';

describe('finalrate-convention 純関数（BigInt整数演算のみ）', () => {
  describe('miyagiで実際に見つかった浮動小数点丸めバグの境界値（204/160=1.275）', () => {
    test('roundHalfUpScaledは128を返す（Number((204/160).toFixed(2))は誤って127を返す既知のバグ）', () => {
      expect(roundHalfUpScaled(204, 160, 2)).toBe(128n);
      // 検算ロジック自体がtoFixedのバグを踏んでいないことの回帰ガード
      expect(Number((204 / 160).toFixed(2))).toBe(1.27);
    });

    test('isRoundingBoundaryはtrueを返す', () => {
      expect(isRoundingBoundary(204, 160, 2)).toBe(true);
    });

    test('classifyStoredRateは訂正後の1.28(=128)をround2として一致判定する', () => {
      const result = classifyStoredRate(160, 204, 128n);
      expect(result.matches).toContain('round2');
      expect(result.isBoundary).toBe(true);
    });

    test('訂正前の誤ったstored値1.27(=127)はround2と一致しないがtrunc2と一致する', () => {
      const result = classifyStoredRate(160, 204, 127n);
      expect(result.matches).not.toContain('round2');
      expect(result.matches).toContain('trunc2');
    });
  });

  describe('truncScaled', () => {
    test('切り捨てで整数値を返す（160分の204→127）', () => {
      expect(truncScaled(204, 160, 2)).toBe(127n);
    });
  });

  describe('parseDecimalToHundredths（テキストのまま変換・parseFloatを経由しない）', () => {
    test('通常の2桁小数', () => {
      expect(parseDecimalToHundredths('1.28')).toEqual({ hundredths: 128n, decimalDigits: 2 });
    });
    test('1桁小数（yamaguchi型・県が小数第1位で公表）', () => {
      expect(parseDecimalToHundredths('1.2')).toEqual({ hundredths: 120n, decimalDigits: 1 });
    });
    test('整数（小数点なし）', () => {
      expect(parseDecimalToHundredths('1')).toEqual({ hundredths: 100n, decimalDigits: 0 });
    });
    test('3桁小数（hokkaidoの0.815のような異物データを検出する）', () => {
      expect(parseDecimalToHundredths('0.815')).toEqual({ hundredths: 81n, decimalDigits: 3 });
    });
  });

  describe('classifyStoredRate: 3方式のいずれとも一致しない真の異常値', () => {
    test('aichi 744/300=2.48だが格納値2.49はround2/round1/trunc2のいずれとも一致しない', () => {
      const result = classifyStoredRate(300, 744, 249n);
      expect(result.matches).toEqual([]);
    });
  });

  describe('extractRateRecordsFromSource', () => {
    test('schoolName/department/quota/finalApplicants/finalRateの標準順序を抽出する', () => {
      const src = `records: [\n  { schoolName: '前橋', department: '普通', quota: 280, finalApplicants: 314, finalRate: 1.12 },\n]`;
      expect(extractRateRecordsFromSource(src)).toEqual([{ schoolName: '前橋', quota: 280, applicants: 314, storedRateText: '1.12' }]);
    });

    test('area等の追加フィールドが挟まる順序（kanagawa/tokyo/nagano/tottori型）も抽出する', () => {
      const src = `{ schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 381, finalRate: 1.2 },`;
      expect(extractRateRecordsFromSource(src)).toEqual([{ schoolName: '鶴見', quota: 318, applicants: 381, storedRateText: '1.2' }]);
    });

    test('officialSubtotals（label/schoolCountを持つ集計行）は抽出しない', () => {
      const src = `officialSubtotals: [{ label: '合計', schoolCount: 156, quota: 30789, finalApplicants: 53196, finalRate: 1.73 }],`;
      expect(extractRateRecordsFromSource(src)).toEqual([]);
    });

    test('末尾にsourceIndex等の追加フィールドがあっても抽出する', () => {
      const src = `{ schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 520, finalRate: 2.06, sourceIndex: 0 },`;
      expect(extractRateRecordsFromSource(src)).toEqual([{ schoolName: '日比谷', quota: 253, applicants: 520, storedRateText: '2.06' }]);
    });
  });
});
