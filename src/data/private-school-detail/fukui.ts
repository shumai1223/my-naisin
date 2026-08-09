/**
 * 福井県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * 【2026-08-09追記】旧版では主要3校の募集要項PDFが12〜16頁の総合冊子形式であることを理由に
 * 全校スキップとしていたが、これは「poppler(pdftoppm)未導入」という誤った前提に基づく判断
 * だった（実際にはpdftoppm自体はMiKTeXバンドル経由で導入済みだが、CJKフォント埋め込みPDFの
 * ラスタライズに失敗するケースがある）。PyMuPDF(`import fitz`)による直接レンダリングで全頁
 * 問題なく読み取れることが判明したため、北陸/福井工業大学附属福井/啓新の3校を今回追加収録
 * する（滋賀/富山の掛-2作業で確立した手法を第一段の本体収集に逆輸入）。残る5校は下記の
 * 個別理由により引き続きスキップ。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_FUKUI: PrivateSchoolDetailFile = {
  prefectureCode: 'fukui',
  schools: [
    {
      schoolCode: 'D118310000013',
      schoolName: '北陸高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 普通コース', capacity: 140 },
        { courseName: '普通科 進学コース', capacity: 105 },
        { courseName: '普通科 特別進学コース', capacity: 233 },
        { courseName: '商業科 情報処理コース', capacity: 70 },
      ],
      totalCapacity: 548,
      source: {
        url: 'https://www.hokuriku.ed.jp/themes/hokuriku2017/files/r8/application.pdf',
        docTitle: '令和8年度生徒募集要項｜北陸高等学校(学科・コース、募集人員、入試種別の表)',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000031',
      schoolName: '福井工業大学附属福井高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '特別進学科(スーパー特進コース・特進コース一括募集)', capacity: 140 },
        { courseName: '進学科 進学コースⅠ類', capacity: 90 },
        { courseName: '進学科 進学コースⅡ類(情報・デザイン・体育分野)', capacity: 190 },
        { courseName: '衛生看護科', capacity: 30 },
      ],
      totalCapacity: 450,
      source: {
        url: 'https://fukui-ut-fukui-h.ed.jp/themes/fukui_h2024/images/for-examinee/top/file_guidelines-r8.pdf',
        docTitle:
          '令和8年度生徒募集要項｜福井工業大学附属福井高等学校(募集学科・コース・分野、入試種別、募集定員の表。特別進学科の選抜一貫コースは中高連携の連絡入学のため定員表に人数記載なし=対象外)',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000040',
      schoolName: '啓新高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学コース', capacity: 30 },
        { courseName: '普通科 進学コース・普通コース(合算募集)', capacity: 168 },
        { courseName: '普通科 アスリートコース', capacity: 40 },
        { courseName: '調理科', capacity: 32 },
        { courseName: 'ファッションデザイン科', capacity: 30 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://www.keishin.ed.jp/pdf/client/boshuyoko.pdf',
        docTitle:
          '令和8年度(2026年度)生徒募集要項｜啓新高等学校(募集学科・コース、募集定員、入試種別の表。進学コースと普通コースは合算定員168名のみ公表で内訳非公開)',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000068',
      schoolName: '敦賀気比高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 230,
      source: {
        url: 'https://tsurugakehi.ed.jp/wp/wp-content/uploads/2025/10/%EF%BC%92%EF%BC%90%EF%BC%92%EF%BC%96%EF%BC%88R8%EF%BC%89%E7%94%9F%E5%BE%92%E5%8B%9F%E9%9B%86%E8%A6%81.pdf',
        docTitle:
          '令和8年度生徒募集要項｜敦賀気比高等学校(募集定員=普通科230名。進学コース内は探究/一般/中国語/技能開発の4専攻に分かれるが「一般専攻を除きそれぞれの専攻には定員を設けてある」とあるのみで専攻別の具体的人数は非公開のためcourses=[]。定員には付属中学校からの内部進学者を含む)',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      reason: '公式サイトに教員募集要項は見つかったが生徒募集の定員情報は確認できず、募集要項PDFの直接URLも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D118310000059',
      schoolName: '敦賀国際令和高等学校',
      reason:
        'WebSearchで「入学希望者数不足のため次年度以降の生徒募集を停止する」旨の過去の学校発表(2022年1月)が見つかり、現在の募集状況自体に不確実性があるため、公表値のみ原則により断定を避け見送り(廃校ではなく学校コード自体はMEXT現存扱いのため参照台帳には残す)。',
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
