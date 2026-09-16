// 千葉県: 県立高校全日制普通科は第1〜第9学区の9学区制。居住学区に加え隣接学区の高校にも
// 出願可能という「隣接学区特例」を持つ点が他県と異なる特徴。
//
// 一次ソース: 千葉県公式ページ「県立高校全日制普通科の通学区域の御案内」
// (`pref.chiba.lg.jp/kyouiku/seisaku/miryoku/gakku/index.html`・2026-09-17 WebFetch確認）。
// 「自分が住んでいる学区と、となりの学区にある高校を志願できます」「千葉女子高校と木更津東
// 高校は...県内のどこからでも志願できます」と明記。各学区の詳細ページ
// （`.../futsuu/dai[1-9]gakku.html`）が別途存在するが、市町村一覧は本ページのみで十分収録できた。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const CHIBA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'chiba',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'districted',
  districts: [
    { name: '第1学区', municipalities: ['千葉市'] },
    {
      name: '第2学区',
      municipalities: ['市川市', '船橋市', '松戸市', '習志野市', '八千代市', '浦安市'],
    },
    { name: '第3学区', municipalities: ['野田市', '柏市', '流山市', '我孫子市', '鎌ケ谷市'] },
    {
      name: '第4学区',
      municipalities: [
        '成田市',
        '佐倉市',
        '四街道市',
        '八街市',
        '印西市',
        '白井市',
        '富里市',
        '印旛郡全町',
      ],
    },
    { name: '第5学区', municipalities: ['銚子市', '旭市', '匝瑳市', '香取市', '香取郡全町'] },
    { name: '第6学区', municipalities: ['東金市', '山武市', '大網白里市', '山武郡全町'] },
    {
      name: '第7学区',
      municipalities: ['茂原市', '勝浦市', 'いすみ市', '長生郡全町村', '夷隅郡全町村'],
    },
    { name: '第8学区', municipalities: ['館山市', '鴨川市', '南房総市', '安房郡全町'] },
    { name: '第9学区', municipalities: ['木更津市', '市原市', '君津市', '富津市', '袖ケ浦市'] },
  ],
  outOfDistrictCondition:
    '居住学区に加え、隣接する学区の高校にも志願可能（「隣接学区特例」）。千葉女子高校・木更津東高校（いずれも女子校）は県内のどこからでも志願可能',
  source: {
    url: 'https://www.pref.chiba.lg.jp/kyouiku/seisaku/miryoku/gakku/index.html',
    docTitle: '千葉県「県立高校全日制普通科の通学区域の御案内」',
    lastChecked: '2026-09-17',
  },
};
