/**
 * 福井県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/fukui.ts（第一段・機械生成の参照台帳）8校を調査したが、
 * 今回はいずれも確度の高い最新年度の定員を確認できず全校スキップ台帳へ計上する。
 * 主因: 主要5校の募集要項PDFがいずれも12〜16頁の総合冊子（WEB出願手引き等を含む）で、
 * この環境（poppler-utils未導入）ではpages指定読み取りができず内容確認に至らなかった
 * （鳥取県のような単純な定員表単体PDFではなく、長大な冊子形式が多い県だったため）。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_FUKUI: PrivateSchoolDetailFile = {
  prefectureCode: 'fukui',
  schools: [],
  skipped: [
    {
      schoolCode: 'D118310000013',
      schoolName: '北陸高等学校',
      reason:
        '募集要項PDF(https://www.hokuriku.ed.jp/themes/hokuriku2017/files/r8/application.pdf)への直接URLは特定できたが全16頁でこの環境のpoppler未導入制約により読み取れず見送り。',
    },
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      reason: '公式サイトに教員募集要項は見つかったが生徒募集の定員情報は確認できず、募集要項PDFの直接URLも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D118310000031',
      schoolName: '福井工業大学附属福井高等学校',
      reason:
        '募集要項PDF(fukui-ut-fukui-h.ed.jp/themes/fukui_h2024/images/for-examinee/top/file_guidelines-r8.pdf)への直接URLは特定できたが全16頁でこの環境のpoppler未導入制約により読み取れず見送り。コース名(特別進学科/進学科3類型/衛生看護科)はページ本文から確認済みだが定員数は不明。',
    },
    {
      schoolCode: 'D118310000040',
      schoolName: '啓新高等学校',
      reason:
        '募集要項PDF(https://www.keishin.ed.jp/pdf/client/boshuyoko.pdf)への直接URLは特定できたが全12頁でこの環境のpoppler未導入制約により読み取れず見送り。',
    },
    {
      schoolCode: 'D118310000059',
      schoolName: '敦賀国際令和高等学校',
      reason:
        'WebSearchで「入学希望者数不足のため次年度以降の生徒募集を停止する」旨の過去の学校発表(2022年1月)が見つかり、現在の募集状況自体に不確実性があるため、公表値のみ原則により断定を避け見送り(廃校ではなく学校コード自体はMEXT現存扱いのため参照台帳には残す)。',
    },
    {
      schoolCode: 'D118310000068',
      schoolName: '敦賀気比高等学校',
      reason:
        '募集要項PDF(tsurugakehi.ed.jp)への直接URLは特定できたが全16頁でこの環境のpoppler未導入制約により読み取れず、WebSearch要約の「230名」は単一ソースかつ他の検索結果(コース構成)と整合が取れず不採用としたため見送り。',
    },
    {
      schoolCode: 'D118310000077',
      schoolName: '福井南高等学校',
      reason:
        '公式サイトの入学希望ページに掲載されているのは令和6年度の値(推薦64名程度・一般16名程度)のみで、令和8年度の確証が取れなかったため見送り。同校は昼間定時制(単位制)という特殊な課程のため募集の性質も通常の全日制と異なる点に留意。',
    },
    {
      schoolCode: 'D118310000086',
      schoolName: 'ＡＯＩＫＥ高等学校',
      reason:
        '同校は広域通信制高校で募集定員360名(全国募集・福井県内需要のみを表す数値ではない)という情報をWebSearchで確認したが、単一ソースで学校公式ページでの直接確認が取れず、かつ全日制校と性質が異なるため今回は見送り。',
    },
  ],
};
