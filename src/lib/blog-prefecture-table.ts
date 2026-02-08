import { PREFECTURES } from './prefectures';

// コラム記事用の都道府県テーブルをデータ駆動で生成
export const generatePrefectureTable = () => {
  const majorPrefectures = ['osaka', 'aichi', 'kanagawa', 'saitama', 'chiba', 'hokkaido', 'fukuoka', 'tokyo', 'hyogo', 'miyagi'];
  
  const tableRows = majorPrefectures
    .map(code => {
      const pref = PREFECTURES.find(p => p.code === code);
      if (!pref) return '';
      
      return `<tr><td>${pref.name}</td><td>${pref.description}</td><td>${pref.maxScore}点</td><td>${pref.note || '-'}</td></tr>`;
    })
    .filter(row => row !== '')
    .join('\n');

  return `<table>
<tr><th>都道府県</th><th>計算方式</th><th>満点</th><th>備考</th></tr>
${tableRows}
</table>`;
};

// 主要都道府県のデータを取得
export const getMajorPrefectureData = () => {
  const majorPrefectures = ['osaka', 'aichi', 'kanagawa', 'saitama', 'chiba', 'hokkaido', 'fukuoka', 'tokyo', 'hyogo', 'miyagi'];
  
  return majorPrefectures
    .map(code => {
      const pref = PREFECTURES.find(p => p.code === code);
      if (!pref) return null;
      
      return {
        code: pref.code,
        name: pref.name,
        description: pref.description,
        maxScore: pref.maxScore,
        note: pref.note || '-'
      };
    })
    .filter(Boolean);
};
