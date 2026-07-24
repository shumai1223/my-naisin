import { parseCsv } from '../csv-parse';

describe('parseCsv', () => {
  it('単純なCSVを行×列に分解する', () => {
    expect(parseCsv('a,b,c\n1,2,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('ダブルクォート内のカンマはフィールド区切りとして扱わない', () => {
    expect(parseCsv('a,"b,c",d')).toEqual([['a', 'b,c', 'd']]);
  });

  it('ダブルクォート内の改行は行区切りとして扱わない', () => {
    expect(parseCsv('a,"b\nc",d')).toEqual([['a', 'b\nc', 'd']]);
  });

  it('二重ダブルクォート("")はエスケープされた1個のダブルクォートになる', () => {
    expect(parseCsv('a,"say ""hi""",c')).toEqual([['a', 'say "hi"', 'c']]);
  });

  it('\\r\\n改行も\\n改行も同様に扱う', () => {
    expect(parseCsv('a,b\r\nc,d')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('末尾に改行が無い最終行も取りこぼさない', () => {
    expect(parseCsv('a,b\nc,d')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('空文字列は空配列を返す', () => {
    expect(parseCsv('')).toEqual([]);
  });

  it('実データに近い例: クォート内に改行とカンマが両方ある行', () => {
    const text = 'code,name,note\nX1,"長崎町立高田学園","高田郷２２０７番地（百合野校舎），\n高田郷１９１２番地１（さくら野校舎）"';
    const rows = parseCsv(text);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toEqual(['X1', '長崎町立高田学園', '高田郷２２０７番地（百合野校舎），\n高田郷１９１２番地１（さくら野校舎）']);
  });
});
