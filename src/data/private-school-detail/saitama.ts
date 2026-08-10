/**
 * 埼玉県私立高等学校の募集定員データ(Λ-5第二段)。
 * 埼玉県学事課が公表する「令和8年度埼玉県私立高等学校入試要項」PDF(全日制50音順)から、全日制
 * 掲載校47校を収録(浦和明の星女子高等学校は「高校からの募集なし」と明記されスキップ台帳へ)。
 * 静岡県私学協会PDFと同型の1校1行明瞭な表形式で、コース別の数値がそのまま個別に読み取れる
 * (「内部進学◯人含む」の注記は募集人員に既に内数として含まれるため加算しない)。通信制のみ
 * 掲載の学校(大川学園/霞ヶ関/志学会/清和学園/松栄学園本校・分校2校/武蔵野星城/わせがく夢育)と
 * 全日制一覧に掲載が無かった創学舎高等学校は、全日制と通信制を跨いだ二重管理を避けるため
 * 今回は対象外としスキップ台帳へ理由付きで記録した(schools-private/saitama.tsの全58校を
 * schools+skippedで完全網羅)。
 *
 * 【掛-2(私立×多年度)追加・2026-08-10】現行の令和8年度ページと同一URLパターンの令和7年度版
 * (r7_koukounyuushiyoukou.pdf)は既に削除されていたが、WebSearchのスニペットから直接ファイル名を
 * 特定しWeb Archive経由(`/web/2025/<元URL>`形式)で取得した。全日制47校全てを令和8年度と再突合し、
 * **実際の変化を8件発見**: ①大妻嵐山高等学校は3コース(大妻進学80+総合進学80+特別進学20=180)から
 * 単一の「全コース」140名へ統合され定員が40名減少 ②城西大学付属川越高等学校は内進が100→85名に
 * 減少(校計260→245) ③本庄第一高等学校はS類型70+AI類型180+AII類型180=430名から50+150+150=350名へ
 * 大幅減少(-80) ④秀明英光高等学校は特別進学60→30・国際英語60→90とコース間で定員を再配分
 * (校計400は不変) ⑤昌平高等学校は特別進学315→290・選抜進学160→185と再配分(校計490は不変。
 * 令和7年度資料には「学則定員変更認可申請中」の注記あり) ⑥武南高等学校は選抜・進学367→351・
 * 中高一貫33→49と再配分(校計440は不変) ⑦星野高等学校はIII類特進選抜等280(女子)→160+医専30+
 * Global Frontier30、S類等370→430と再配分(校計650は不変) ⑧西武台高等学校はコース体系を
 * S/STEAM/選抜I/選抜II/進学/特進選抜からN-uni/E-uni/S-uni/A-uni/STEAM/特選・特進へ全面リブランド
 * (校計500は不変)。上記のうち①②③は念のため令和8年度の生PDFも再取得し直接突合済み。正智深谷・
 * 淑徳与野・埼玉栄の3校は学科名や内部進学の表記粒度が異なるのみで校計・実質構成は同一と確認した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const KAKE2_2025_SOURCE = {
  url: 'https://web.archive.org/web/2025/https://www.pref.saitama.lg.jp/documents/26360/r7_koukounyuushiyoukou.pdf',
  docTitle:
    '令和7年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(元ページ・PDFとも削除済みのためWeb Archive経由で取得)',
  fetchedAt: '2026-08-10',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_SAITAMA: PrivateSchoolDetailFile = {
  prefectureCode: 'saitama',
  schools: [
    {
      schoolCode: 'D111310900039',
      schoolName: '青山学院大学系属浦和ルーテル学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 75 },
      ],
      totalCapacity: 75,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321500021',
      schoolName: '秋草学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特選コース(女子)', capacity: 20 },
        { courseName: '普通科 選抜コース(女子)', capacity: 80 },
        { courseName: '普通科 AGコース(女子)', capacity: 100 },
        { courseName: '普通科 幼保コース(女子)', capacity: 60 },
      ],
      totalCapacity: 260,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310900020',
      schoolName: '浦和学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 国際類型', capacity: 30 },
        { courseName: '普通科 特進類型', capacity: 110 },
        { courseName: '普通科 進学類型', capacity: 660 },
      ],
      totalCapacity: 800,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310800012',
      schoolName: '浦和実業学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進選抜', capacity: 40 },
        { courseName: '普通科 特進', capacity: 80 },
        { courseName: '普通科 選抜α', capacity: 100 },
        { courseName: '普通科 選抜', capacity: 100 },
        { courseName: '普通科 進学', capacity: 120 },
        { courseName: '商業科 プログレス・キャリアアップ', capacity: 240 },
        { courseName: '普通科 一貫', capacity: 80 },
      ],
      totalCapacity: 760,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310700013',
      schoolName: '浦和麗明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特選コース(Ⅰ類・Ⅱ類・Ⅲ類)', capacity: 320 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322200040',
      schoolName: '叡明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進選抜コースⅠ類・Ⅱ類', capacity: 80 },
        { courseName: '普通科 特別進学コース', capacity: 180 },
        { courseName: '普通科 進学コース', capacity: 260 },
      ],
      totalCapacity: 520,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111334200018',
      schoolName: '大妻嵐山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 全コース(大妻進学・総合進学・特別進学、女子)', capacity: 140 },
      ],
      totalCapacity: 140,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310300017',
      schoolName: '大宮開成高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進選抜先進・特進選抜I類・特進選抜II類', capacity: 350 },
        { courseName: '普通科 中高一貫', capacity: 150 },
      ],
      totalCapacity: 500,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111311000018',
      schoolName: '開智高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 Tコース', capacity: 60 },
        { courseName: '普通科 S1コース', capacity: 120 },
        { courseName: '普通科 S2コース', capacity: 60 },
        { courseName: '普通科 内部進学', capacity: 300 },
      ],
      totalCapacity: 540,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321000026',
      schoolName: '開智未来高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 全クラス(T未来・S未来・開智)', capacity: 200 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321400013',
      schoolName: '春日部共栄高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 東大選抜コース', capacity: 30 },
        { courseName: '普通科 選抜コース', capacity: 70 },
        { courseName: '普通科 特進コースアルファ', capacity: 160 },
        { courseName: '普通科 特進コース', capacity: 120 },
        { courseName: '普通科 一貫コース', capacity: 120 },
      ],
      totalCapacity: 500,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100072',
      schoolName: '川越東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 理数コース(男子)', capacity: 80 },
        { courseName: '普通科 普通コース(男子)', capacity: 320 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322800026',
      schoolName: '慶應義塾志木高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(男子)', capacity: 250 },
      ],
      totalCapacity: 250,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111330100017',
      schoolName: '国際学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 アドバンス・セレクト', capacity: 80 },
        { courseName: '総合学科 選抜進学・進学', capacity: 120 },
        { courseName: '総合学科 食物調理', capacity: 40 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310100019',
      schoolName: '埼玉栄高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 アルファ選抜コース', capacity: 20 },
        { courseName: '普通科 アルファコース', capacity: 140 },
        { courseName: '普通科 Sコース', capacity: 200 },
        { courseName: '普通科 特進コース', capacity: 200 },
        { courseName: '保健体育科', capacity: 160 },
      ],
      totalCapacity: 720,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111332600018',
      schoolName: '埼玉平成高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 S特進', capacity: 30 },
        { courseName: '普通科 特進', capacity: 105 },
        { courseName: '普通科 進学(スーパーサッカー含む)', capacity: 215 },
      ],
      totalCapacity: 350,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111330100026',
      schoolName: '栄北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特類選抜', capacity: 100 },
        { courseName: '普通科 特類S', capacity: 100 },
        { courseName: '普通科 特類A', capacity: 120 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310400016',
      schoolName: '栄東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 東医・アルファ', capacity: 400 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322500010',
      schoolName: '狭山ヶ丘高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 I類(難関国立進学コース)', capacity: 40 },
        { courseName: '普通科 II類(特別進学コース)', capacity: 110 },
        { courseName: '普通科 III類(総合進学コース)', capacity: 110 },
        { courseName: '普通科 IV類(スポーツ・文化進学コース)', capacity: 40 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320900029',
      schoolName: '自由の森学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 210 },
      ],
      totalCapacity: 210,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100054',
      schoolName: '秀明高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 全コース(難関国公立大学進学・医学部進学・総合進学)', capacity: 120 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321900018',
      schoolName: '秀明英光高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学', capacity: 30 },
        { courseName: '普通科 国際英語', capacity: 90 },
        { courseName: '普通科 総合進学', capacity: 280 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310500015',
      schoolName: '淑徳与野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 T類', capacity: 40 },
        { courseName: '普通科 SS類', capacity: 40 },
        { courseName: '普通科 SA類', capacity: 40 },
        { courseName: '普通科 R類', capacity: 40 },
        { courseName: '普通科 MS類', capacity: 40 },
        { courseName: '普通科 内進T類', capacity: 40 },
        { courseName: '普通科 内進SS類', capacity: 40 },
        { courseName: '普通科 内進SA類', capacity: 40 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100045',
      schoolName: '城西大学付属川越高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別選抜(男子)', capacity: 40 },
        { courseName: '普通科 特進(男子)', capacity: 80 },
        { courseName: '普通科 進学(男子)', capacity: 40 },
        { courseName: '普通科 内進(男子)', capacity: 85 },
      ],
      totalCapacity: 245,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321800019',
      schoolName: '正智深谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別選抜', capacity: 30 },
        { courseName: '普通科 特別進学', capacity: 90 },
        { courseName: '普通科 選抜進学', capacity: 120 },
        { courseName: '普通科 総合進学', capacity: 120 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111346400010',
      schoolName: '昌平高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 IBコース', capacity: 15 },
        { courseName: '普通科 特別進学コース', capacity: 290 },
        { courseName: '普通科 選抜進学コース', capacity: 185 },
      ],
      totalCapacity: 490,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100063',
      schoolName: '城北埼玉高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 本科特進クラス(男子)', capacity: 60 },
        { courseName: '普通科 本科進学クラス(男子)', capacity: 140 },
        { courseName: '普通科 フロンティアコース(男子)', capacity: 40 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321500012',
      schoolName: '西武学園文理高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 全クラス(アカデミックチャレンジ・アカデミックマルチパス・デュアル・クリエイティブ・アート・スポーツ)', capacity: 300 },
        { courseName: '理数科 先端サイエンスクラス', capacity: 80 },
      ],
      totalCapacity: 380,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111323000022',
      schoolName: '西武台高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 N-uni', capacity: 60 },
        { courseName: '普通科 E-uni', capacity: 120 },
        { courseName: '普通科 S-uni', capacity: 200 },
        { courseName: '普通科 A-uni', capacity: 70 },
        { courseName: '普通科 STEAM', capacity: 30 },
        { courseName: '普通科 特選・特進', capacity: 20 },
      ],
      totalCapacity: 500,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320900010',
      schoolName: '聖望学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進', capacity: 120 },
        { courseName: '普通科 進学', capacity: 180 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321800028',
      schoolName: '東京成徳大学深谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 進学・進学選抜・特進S・中高一貫', capacity: 350 },
      ],
      totalCapacity: 350,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321200015',
      schoolName: '東京農業大学第三高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 I', capacity: 120 },
        { courseName: '普通科 II', capacity: 170 },
        { courseName: '普通科 III', capacity: 40 },
        { courseName: '普通科 中高一貫', capacity: 70 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100027',
      schoolName: '東邦音楽大学附属東邦第二高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '音楽科', capacity: 40 },
      ],
      totalCapacity: 40,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322200013',
      schoolName: '獨協埼玉高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 320 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321000017',
      schoolName: '花咲徳栄高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 アルファ', capacity: 140 },
        { courseName: '普通科 アドバンス', capacity: 300 },
        { courseName: '食育実践科', capacity: 80 },
      ],
      totalCapacity: 520,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322500038',
      schoolName: '東野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進コースI&Sクラス', capacity: 140 },
        { courseName: '普通科 進学コースAクラス', capacity: 210 },
      ],
      totalCapacity: 350,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322300012',
      schoolName: '武南高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進', capacity: 40 },
        { courseName: '普通科 選抜・進学', capacity: 351 },
        { courseName: '普通科 中高一貫', capacity: 49 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100036',
      schoolName: '星野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 III類特進選抜・文理特進・文理(女子)', capacity: 160 },
        { courseName: '普通科 医専', capacity: 30 },
        { courseName: '普通科 Global Frontier', capacity: 30 },
        { courseName: '普通科 S類特進選抜・アルファ選抜・ベータ', capacity: 430 },
      ],
      totalCapacity: 650,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322800017',
      schoolName: '細田学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進H理数', capacity: 40 },
        { courseName: '普通科 特進H', capacity: 40 },
        { courseName: '普通科 特進', capacity: 80 },
        { courseName: '普通科 選抜L', capacity: 120 },
        { courseName: '普通科 進学アルファ', capacity: 110 },
        { courseName: '普通科 中高一貫', capacity: 50 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321100016',
      schoolName: '本庄第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 S類型', capacity: 50 },
        { courseName: '普通科 AI類型(アドバンス・スタンダード)', capacity: 150 },
        { courseName: '普通科 AII類型', capacity: 150 },
      ],
      totalCapacity: 350,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321100025',
      schoolName: '本庄東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 選抜', capacity: 30 },
        { courseName: '普通科 特進', capacity: 180 },
        { courseName: '普通科 進学', capacity: 110 },
        { courseName: '普通科 一貫', capacity: 80 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111332700017',
      schoolName: '武蔵越生高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 S特進コース', capacity: 60 },
        { courseName: '普通科 選抜Iコース', capacity: 120 },
        { courseName: '普通科 選抜IIコース', capacity: 160 },
        { courseName: '普通科 アスリート選抜コース(男子)', capacity: 40 },
      ],
      totalCapacity: 380,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111322500029',
      schoolName: '武蔵野音楽大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '音楽科', capacity: 36 },
      ],
      totalCapacity: 36,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111320100018',
      schoolName: '山村学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別選抜SAコース', capacity: 40 },
        { courseName: '普通科 特別進学ELコース', capacity: 160 },
        { courseName: '普通科 総合進学GLコース', capacity: 240 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111323900014',
      schoolName: '山村国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進選抜・特別進学・総合進学', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111323000013',
      schoolName: '立教新座高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(男子)', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111321100034',
      schoolName: '早稲田大学本庄高等学院',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 320 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/26360/r8_koukounyuushiyoukou.pdf',
        docTitle: '令和8年度埼玉県私立高等学校入試要項(全日制)｜埼玉県学事課(学科(コース)別募集人員表)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D111310900039',
      schoolName: '青山学院大学系属浦和ルーテル学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 75 }],
      totalCapacity: 75,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321500021',
      schoolName: '秋草学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特選コース(女子)', capacity: 20 },
        { courseName: '普通科 選抜コース(女子)', capacity: 80 },
        { courseName: '普通科 AGコース(女子)', capacity: 100 },
        { courseName: '普通科 幼保コース(女子)', capacity: 60 },
      ],
      totalCapacity: 260,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111310900020',
      schoolName: '浦和学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 国際類型', capacity: 30 },
        { courseName: '普通科 特進類型', capacity: 110 },
        { courseName: '普通科 進学類型', capacity: 660 },
      ],
      totalCapacity: 800,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111310800012',
      schoolName: '浦和実業学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進選抜', capacity: 40 },
        { courseName: '普通科 特進', capacity: 80 },
        { courseName: '普通科 選抜α', capacity: 100 },
        { courseName: '普通科 選抜', capacity: 100 },
        { courseName: '普通科 進学', capacity: 120 },
        { courseName: '商業科 プログレス・キャリアアップ', capacity: 240 },
        { courseName: '普通科 一貫', capacity: 80 },
      ],
      totalCapacity: 760,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111310700013',
      schoolName: '浦和麗明高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 特選コース(Ⅰ類・Ⅱ類・Ⅲ類)', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322200040',
      schoolName: '叡明高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進選抜コースⅠ類・Ⅱ類', capacity: 80 },
        { courseName: '普通科 特別進学コース', capacity: 180 },
        { courseName: '普通科 進学コース', capacity: 260 },
      ],
      totalCapacity: 520,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111334200018',
      schoolName: '大妻嵐山高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 大妻進学(女子)', capacity: 80 },
        { courseName: '普通科 総合進学(女子)', capacity: 80 },
        { courseName: '普通科 特別進学(女子)', capacity: 20 },
      ],
      totalCapacity: 180,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度は3コースを「全コース」140名に統合し40名減少。令和8年度分もlive PDFで直接再確認済み)',
      },
    },
    {
      schoolCode: 'D111310300017',
      schoolName: '大宮開成高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進選抜先進・特進選抜I類・特進選抜II類', capacity: 350 },
        { courseName: '普通科 中高一貫', capacity: 150 },
      ],
      totalCapacity: 500,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111311000018',
      schoolName: '開智高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 Tコース', capacity: 60 },
        { courseName: '普通科 S1コース', capacity: 120 },
        { courseName: '普通科 S2コース', capacity: 60 },
        { courseName: '普通科 内部進学', capacity: 300 },
      ],
      totalCapacity: 540,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321000026',
      schoolName: '開智未来高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 全クラス(T未来・S未来・開智)', capacity: 200 }],
      totalCapacity: 200,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321400013',
      schoolName: '春日部共栄高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 東大選抜コース', capacity: 30 },
        { courseName: '普通科 選抜コース', capacity: 70 },
        { courseName: '普通科 特進コースアルファ', capacity: 160 },
        { courseName: '普通科 特進コース', capacity: 120 },
        { courseName: '普通科 一貫コース', capacity: 120 },
      ],
      totalCapacity: 500,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111320100072',
      schoolName: '川越東高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 理数コース(男子)', capacity: 80 },
        { courseName: '普通科 普通コース(男子)', capacity: 320 },
      ],
      totalCapacity: 400,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322800026',
      schoolName: '慶應義塾志木高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科(男子)', capacity: 250 }],
      totalCapacity: 250,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111330100017',
      schoolName: '国際学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 アドバンス・セレクト', capacity: 80 },
        { courseName: '総合学科 選抜進学・進学', capacity: 120 },
        { courseName: '総合学科 食物調理', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111310100019',
      schoolName: '埼玉栄高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 αコース', capacity: 160 },
        { courseName: '普通科 Sコース', capacity: 200 },
        { courseName: '普通科 特進コース', capacity: 200 },
        { courseName: '保健体育科', capacity: 160 },
      ],
      totalCapacity: 720,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle + '(令和8年度はαコース160をアルファ選抜20+アルファ140の2区分に細分表記。校計720は同一)',
      },
    },
    {
      schoolCode: 'D111332600018',
      schoolName: '埼玉平成高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 S特進', capacity: 30 },
        { courseName: '普通科 特進', capacity: 105 },
        { courseName: '普通科 進学(スーパーサッカー含む)', capacity: 215 },
      ],
      totalCapacity: 350,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111330100026',
      schoolName: '栄北高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特類選抜', capacity: 100 },
        { courseName: '普通科 特類S', capacity: 100 },
        { courseName: '普通科 特類A', capacity: 120 },
      ],
      totalCapacity: 320,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111310400016',
      schoolName: '栄東高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 東医・アルファ', capacity: 400 }],
      totalCapacity: 400,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322500010',
      schoolName: '狭山ヶ丘高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 I類(難関国立進学コース)', capacity: 40 },
        { courseName: '普通科 II類(特別進学コース)', capacity: 110 },
        { courseName: '普通科 III類(総合進学コース)', capacity: 110 },
        { courseName: '普通科 IV類(スポーツ・文化進学コース)', capacity: 40 },
      ],
      totalCapacity: 300,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111320900029',
      schoolName: '自由の森学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 210 }],
      totalCapacity: 210,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111320100054',
      schoolName: '秀明高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 全コース(難関国公立大学進学・医学部進学・総合進学)', capacity: 120 }],
      totalCapacity: 120,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321900018',
      schoolName: '秀明英光高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特別進学', capacity: 60 },
        { courseName: '普通科 国際英語', capacity: 60 },
        { courseName: '普通科 総合進学', capacity: 280 },
      ],
      totalCapacity: 400,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度は特別進学30・国際英語90に再配分。校計400は同一)',
      },
    },
    {
      schoolCode: 'D111310500015',
      schoolName: '淑徳与野高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 内進選抜(女子)', capacity: 120 },
        { courseName: '普通科 T類', capacity: 40 },
        { courseName: '普通科 SS類', capacity: 40 },
        { courseName: '普通科 SA類', capacity: 40 },
        { courseName: '普通科 R類', capacity: 40 },
        { courseName: '普通科 MS類', capacity: 40 },
      ],
      totalCapacity: 320,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度は内進選抜120を内進T類・内進SS類・内進SA類各40に細分表記。校計320は同一)',
      },
    },
    {
      schoolCode: 'D111320100045',
      schoolName: '城西大学付属川越高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特別選抜(男子)', capacity: 40 },
        { courseName: '普通科 特進(男子)', capacity: 80 },
        { courseName: '普通科 進学(男子)', capacity: 40 },
        { courseName: '普通科 内進(男子)', capacity: 100 },
      ],
      totalCapacity: 260,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle + '(内進が令和8年度は85名に減少・校計260→245。令和8年度分もlive PDFで直接再確認済み)',
      },
    },
    {
      schoolCode: 'D111321800019',
      schoolName: '正智深谷高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進Sコース', capacity: 30 },
        { courseName: '普通科 特進Hコース', capacity: 90 },
        { courseName: '普通科 選抜Iコース', capacity: 120 },
        { courseName: '普通科 進学Pコース', capacity: 120 },
      ],
      totalCapacity: 360,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度は「Sコース」→「特別選抜」・「Hコース」→「特別進学」・「選抜Iコース」→「選抜進学」・「進学Pコース」→「総合進学」に改称。校計360は同一)',
      },
    },
    {
      schoolCode: 'D111346400010',
      schoolName: '昌平高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 IB', capacity: 15 },
        { courseName: '普通科 特別進学', capacity: 315 },
        { courseName: '普通科 選抜進学', capacity: 160 },
      ],
      totalCapacity: 490,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(資料に「令和7年度学則定員変更認可申請中」の注記あり。令和8年度は特別進学290・選抜進学185に再配分。校計490は同一)',
      },
    },
    {
      schoolCode: 'D111320100063',
      schoolName: '城北埼玉高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 本科特進クラス(男子)', capacity: 60 },
        { courseName: '普通科 本科進学クラス(男子)', capacity: 140 },
        { courseName: '普通科 フロンティアコース(男子)', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321500012',
      schoolName: '西武学園文理高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 全クラス(アカデミックチャレンジ・アカデミックマルチパス・デュアル・クリエイティブ・アート・スポーツ)', capacity: 300 },
        { courseName: '理数科 先端サイエンスクラス', capacity: 80 },
      ],
      totalCapacity: 380,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111323000022',
      schoolName: '西武台高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進S', capacity: 80 },
        { courseName: '普通科 STEAM', capacity: 30 },
        { courseName: '普通科 選抜I', capacity: 120 },
        { courseName: '普通科 選抜II', capacity: 210 },
        { courseName: '普通科 進学', capacity: 40 },
        { courseName: '普通科 特進選抜・特進', capacity: 20 },
      ],
      totalCapacity: 500,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度はコース名を全面リブランド: 特進S/選抜I/選抜II/進学がN-uni/E-uni/S-uni/A-uniへ、STEAMと特進選抜・特進はそのまま維持。校計500は同一)',
      },
    },
    {
      schoolCode: 'D111320900010',
      schoolName: '聖望学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進', capacity: 120 },
        { courseName: '普通科 進学', capacity: 180 },
      ],
      totalCapacity: 300,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321800028',
      schoolName: '東京成徳大学深谷高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 進学・進学選抜・特進S・中高一貫', capacity: 350 }],
      totalCapacity: 350,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321200015',
      schoolName: '東京農業大学第三高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 I', capacity: 120 },
        { courseName: '普通科 II', capacity: 170 },
        { courseName: '普通科 III', capacity: 40 },
        { courseName: '普通科 中高一貫', capacity: 70 },
      ],
      totalCapacity: 400,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111320100027',
      schoolName: '東邦音楽大学附属東邦第二高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '音楽科', capacity: 40 }],
      totalCapacity: 40,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322200013',
      schoolName: '獨協埼玉高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321000017',
      schoolName: '花咲徳栄高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 アルファ', capacity: 140 },
        { courseName: '普通科 アドバンス', capacity: 300 },
        { courseName: '食育実践科', capacity: 80 },
      ],
      totalCapacity: 520,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322500038',
      schoolName: '東野高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進コースI&Sクラス', capacity: 140 },
        { courseName: '普通科 進学コースAクラス', capacity: 210 },
      ],
      totalCapacity: 350,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322300012',
      schoolName: '武南高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進', capacity: 40 },
        { courseName: '普通科 選抜・進学', capacity: 367 },
        { courseName: '普通科 中高一貫', capacity: 33 },
      ],
      totalCapacity: 440,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度は選抜・進学351・中高一貫49に再配分。校計440は同一)',
      },
    },
    {
      schoolCode: 'D111320100036',
      schoolName: '星野高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 III類特進選抜・文理特進・文理(女子)', capacity: 280 },
        { courseName: '普通科 S類特進選抜・α選抜・β', capacity: 370 },
      ],
      totalCapacity: 650,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度はIII類特進選抜等280を160+医専30+Global Frontier30に再編・S類等は370→430に増加。校計650は同一)',
      },
    },
    {
      schoolCode: 'D111322800017',
      schoolName: '細田学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特進H', capacity: 60 },
        { courseName: '普通科 特進', capacity: 90 },
        { courseName: '普通科 選抜GL', capacity: 120 },
        { courseName: '普通科 進学α', capacity: 110 },
        { courseName: '普通科 中高一貫', capacity: 60 },
      ],
      totalCapacity: 440,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle +
          '(令和8年度は特進Hを理数40+H40に分割・特進90→80・中高一貫60→50等コース間で再配分。校計440は同一)',
      },
    },
    {
      schoolCode: 'D111321100016',
      schoolName: '本庄第一高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 S類型', capacity: 70 },
        { courseName: '普通科 AI類型(アドバンス・スタンダード)', capacity: 180 },
        { courseName: '普通科 AII類型', capacity: 180 },
      ],
      totalCapacity: 430,
      source: {
        ...KAKE2_2025_SOURCE,
        docTitle:
          KAKE2_2025_SOURCE.docTitle + '(令和8年度は50/150/150へ大幅減少・校計430→350。令和8年度分もlive PDFで直接再確認済み)',
      },
    },
    {
      schoolCode: 'D111321100025',
      schoolName: '本庄東高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 選抜', capacity: 30 },
        { courseName: '普通科 特進', capacity: 180 },
        { courseName: '普通科 進学', capacity: 110 },
        { courseName: '普通科 一貫', capacity: 80 },
      ],
      totalCapacity: 400,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111332700017',
      schoolName: '武蔵越生高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 S特進コース', capacity: 60 },
        { courseName: '普通科 選抜Iコース', capacity: 120 },
        { courseName: '普通科 選抜IIコース', capacity: 160 },
        { courseName: '普通科 アスリート選抜コース(男子)', capacity: 40 },
      ],
      totalCapacity: 380,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111322500029',
      schoolName: '武蔵野音楽大学附属高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '音楽科', capacity: 36 }],
      totalCapacity: 36,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111320100018',
      schoolName: '山村学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科 特別選抜SAコース', capacity: 40 },
        { courseName: '普通科 特別進学ELコース', capacity: 160 },
        { courseName: '普通科 総合進学GLコース', capacity: 240 },
      ],
      totalCapacity: 440,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111323900014',
      schoolName: '山村国際高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科 特進選抜・特別進学・総合進学', capacity: 280 }],
      totalCapacity: 280,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111323000013',
      schoolName: '立教新座高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科(男子)', capacity: 280 }],
      totalCapacity: 280,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
    {
      schoolCode: 'D111321100034',
      schoolName: '早稲田大学本庄高等学院',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: { ...KAKE2_2025_SOURCE, docTitle: KAKE2_2025_SOURCE.docTitle + '(令和8年度と完全に同一)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D111310900011',
      schoolName: '浦和明の星女子高等学校',
      reason: '令和8年度埼玉県私立高等学校入試要項に「高校からの募集なし」と明記(完全中高一貫校のため高校段階での外部募集を行っていない)。',
    },
    {
      schoolCode: 'D111320100081',
      schoolName: '霞ヶ関高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(一般コース99名+特別コース66名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111346400029',
      schoolName: '志学会高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(普通コース80名+技能連携生コース60名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111332700026',
      schoolName: '清和学園高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(普通科80名+自動車科40名+調理科40名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111321400022',
      schoolName: '松栄学園高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(普通科360名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111310300026',
      schoolName: '松栄学園高等学校大宮分校',
      reason: '令和8年度埼玉県私立高等学校入試要項(全日制・通信制とも)に分校単位の募集定員記載が見当たらず確認できなかった。',
    },
    {
      schoolCode: 'D111322200031',
      schoolName: '松栄学園高等学校越谷レイクタウン分校',
      reason: '令和8年度埼玉県私立高等学校入試要項(全日制・通信制とも)に分校単位の募集定員記載が見当たらず確認できなかった。',
    },
    {
      schoolCode: 'D111322200022',
      schoolName: '武蔵野星城高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(登校コース140名+オンラインコース35名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111320900038',
      schoolName: '大川学園高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(総合コース80名+一般コース80名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111320900047',
      schoolName: 'わせがく夢育高等学校',
      reason: '全日制一覧には掲載が無く、通信制一覧のみに掲載(普通科590名)。全日制と通信制を跨いだ二重管理を避けるため今回は対象外。',
    },
    {
      schoolCode: 'D111321800037',
      schoolName: '創学舎高等学校',
      reason: '令和8年度埼玉県私立高等学校入試要項(全日制・通信制とも)に掲載が見当たらず募集定員を確認できなかった。',
    },
  ],
};
