// 香川県: 県立高校の全日制普通科・理数科（小豆島中央高等学校を除く）は第1学区・第2学区の2学区制。
// 小豆島中央高等学校、及び普通科・理数科以外の学科（専門学科等）、定時制課程、通信制課程は
// 学区の定めなく県内全域から出願可能。
//
// 一次ソース: 香川県教育委員会公式ページ「香川県立高等学校の学区制」
// (`pref.kagawa.lg.jp/kenkyoui/kokokyoiku/nyushi/chugaku-koko/examination02_1.html`・
// 2026-09-17 WebFetch確認)。

import type { PrefectureSchoolDistrict } from '@/lib/school-district';

export const KAGAWA_SCHOOL_DISTRICT: PrefectureSchoolDistrict = {
  prefectureCode: 'kagawa',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  systemType: 'districted',
  districts: [
    {
      name: '第1学区',
      municipalities: ['高松市', 'さぬき市', '東かがわ市', '小豆郡', '木田郡', '香川郡'],
    },
    {
      name: '第2学区',
      municipalities: ['丸亀市', '坂出市', '善通寺市', '観音寺市', '三豊市', '綾歌郡', '仲多度郡'],
    },
  ],
  outOfDistrictCondition:
    '学区制が適用されるのは全日制の普通科・理数科のみ(小豆島中央高等学校は学区制の対象外で県内全域から出願可能)。令和5年度入試から、自己推薦選抜に限り他学区からの出願が可能になり、他学区からの合格者数の上限は入学定員の5%と定められた。普通科・理数科以外の学科(専門学科等)、定時制課程、通信制課程は学区の定めなく県内全域から出願可能。全国募集に出願する場合も学区の制限はない',
  source: {
    url: 'https://www.pref.kagawa.lg.jp/kenkyoui/kokokyoiku/nyushi/chugaku-koko/examination02_1.html',
    docTitle: '香川県教育委員会「香川県立高等学校の学区制」',
    lastChecked: '2026-09-17',
  },
};
