// 高知県: 「令和8年度A日程及びB日程における面接内容一覧表」等の一覧表群（高知県教育委員会公式
// ページ`pref.kochi.lg.jp/doc/r8_koukounyushi_main/`「令和8年度高知県公立高等学校入学者選抜
// における検査項目等一覧表」PDF・全5頁）。高知県の入試は「A日程」「B日程」の2回選抜方式
// （A日程で定員を満たせばB日程は実施しない）。
//
// 一次ソース: `pref.kochi.lg.jp/doc/r8_koukounyushi_main/file_contents/r8_kensa_koumoku.pdf`
// （2026-09-17 curl+pdftoppm(150dpi)でビジョン確認。pdftotextはToUnicode CMap欠落で文字化け
// する既知パターン）。頁1-2=面接内容一覧表（全日制/多部制単位制/定時制）、頁3-4=実技検査の
// 概要一覧表（A/B日程）、頁5=傾斜配点実施校一覧表・成人特別選抜の概要一覧表。
//
// ★今回は頁1「全日制の課程」の面接内容一覧表(表の行数は32行=分校2件を含む・schoolNameとしては30校)64レコードのみ収録。
// 多部制単位制(頁2上)・定時制(頁2下)・実技検査の概要(頁3-4)・成人特別選抜の概要(頁5下)は
// 未収録(coverageNote参照)。selectionCategoryは「A日程」「B日程」の2区分。interviewRequired
// は全レコードtrue(個人面接の実施が明記されているため)。傾斜配点実施校3校(高知丸の内=音楽科・
// 高知小津=理数科・高知商業=社会マネジメント科)は頁5の「傾斜配点実施校一覧表」の内容を該当
// レコードのnoteに転記した(ratioTypeフィールドは学校全体でなく特定学科のみに適用されるため
// 誤解を避けるためnoteに記載しratioTypeは不使用とした)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KOCHI_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kochi',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '頁1「全日制の課程」の面接内容一覧表(表の行数は32行=分校2件を含む・schoolNameとしては30校)64レコードのみ収録。多部制単位制(中芸・高知北の昼間部/夜間部)・定時制(11校)・実技検査の概要一覧表(岡豊・高知丸の内・高知国際・高知商業の一部学科)・成人特別選抜の概要一覧表(定時制/多部制12校)は未収録',
  source: {
    url: 'https://www.pref.kochi.lg.jp/doc/r8_koukounyushi_main/file_contents/r8_kensa_koumoku.pdf',
    docTitle: '令和8年度高知県公立高等学校入学者選抜における検査項目等一覧表',
    lastChecked: '2026-09-17',
  },
  schools: [
    { schoolName: '室戸', department: '総合学科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '室戸', department: '総合学科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '安芸', department: '普通科・機械土木科(機械専攻・土木専攻)・ビジネス科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '安芸', department: '普通科・機械土木科(機械専攻・土木専攻)・ビジネス科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '城山', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '城山', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '山田', department: '普通科・グローバル探究科・ビジネス探究科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '山田', department: '普通科・グローバル探究科・ビジネス探究科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '嶺北', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '嶺北', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知農業', department: '農業総合科・畜産総合科・森林総合科・環境土木科・食品ビジネス科・生活総合科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知農業', department: '農業総合科・畜産総合科・森林総合科・環境土木科・食品ビジネス科・生活総合科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知東工業', department: '機械科・機械生産システム科・電子科・電子機械科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知東工業', department: '機械科・機械生産システム科・電子科・電子機械科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接8分間(A日程6分間より長い)' },
    { schoolName: '岡豊', department: '普通科・普通科(芸術コース・体育コース)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間。芸術コース(音楽/美術/書道分野)・体育コースは面接に加え実技検査も実施(概要は今回未収録)' },
    { schoolName: '岡豊', department: '普通科・普通科(芸術コース・体育コース)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。芸術コース・体育コースは面接に加え実技検査も実施(概要は今回未収録)' },
    { schoolName: '高知東', department: '総合学科・看護科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知東', department: '総合学科・看護科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知工業', department: '機械科・電気科・情報技術科・工業化学科・土木科・建築科・総合デザイン科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知工業', department: '機械科・電気科・情報技術科・工業化学科・土木科・建築科・総合デザイン科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知追手前', department: '普通科(本校)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知追手前', department: '普通科(本校)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知追手前', department: '普通科(吾北分校)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知追手前', department: '普通科(吾北分校)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知丸の内', department: '普通科・音楽科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間。★傾斜配点実施(頁5一覧表): 音楽科は調査書の音楽が2倍。音楽科は面接に加え実技検査(聴音・独唱/独奏等)も実施(概要は今回未収録)' },
    { schoolName: '高知丸の内', department: '普通科・音楽科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。★傾斜配点実施(頁5一覧表): 音楽科は調査書の音楽が2倍' },
    { schoolName: '高知小津', department: '普通科・理数科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間。★傾斜配点実施(頁5一覧表): 理数科は学力検査の数学・理科が1.5倍' },
    { schoolName: '高知小津', department: '普通科・理数科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。★傾斜配点実施(頁5一覧表): 理数科は学力検査の数学・理科が1.5倍' },
    { schoolName: '高知国際', department: '普通科・グローバル科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間。グローバル科(探究コース/DPコース)は面接に加え英語・日本語による口頭試問も実施(概要は今回未収録)' },
    { schoolName: '高知国際', department: '普通科・グローバル科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。グローバル科は口頭試問も実施' },
    { schoolName: '伊野商業', department: 'キャリアビジネス科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '伊野商業', department: 'キャリアビジネス科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '春野', department: '総合学科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '春野', department: '総合学科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高岡', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接7分間' },
    { schoolName: '高岡', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接7分間' },
    { schoolName: '高知海洋', department: '海洋学科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接8分間' },
    { schoolName: '高知海洋', department: '海洋学科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接8分間' },
    { schoolName: '須崎総合', department: '普通科・機械系学科(機械専攻・造船専攻)・電気情報系学科(電気専攻・電子情報専攻)・システム工学系学科(機械制御専攻・住環境専攻)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '須崎総合', department: '普通科・機械系学科(機械専攻・造船専攻)・電気情報系学科(電気専攻・電子情報専攻)・システム工学系学科(機械制御専攻・住環境専攻)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間(A日程6分間より長い・表中最大の日程差)' },
    { schoolName: '佐川', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '佐川', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '窪川', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '窪川', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '樽原', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接8分間' },
    { schoolName: '樽原', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接8分間' },
    { schoolName: '四万十', department: '普通科・普通科(自然環境コース)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '四万十', department: '普通科・普通科(自然環境コース)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '大方', department: '普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接10分間(表中で最長時間の1つ)' },
    { schoolName: '大方', department: '普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間' },
    { schoolName: '幡多農業', department: '園芸システム科・アグリサイエンス科・グリーン環境科・生活コーディネート科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '幡多農業', department: '園芸システム科・アグリサイエンス科・グリーン環境科・生活コーディネート科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接7分間(A日程6分間より長い)' },
    { schoolName: '中村', department: '普通科(本校)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '中村', department: '普通科(本校)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '中村', department: '普通科(西土佐分校)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '中村', department: '普通科(西土佐分校)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '宿毛工業', department: '機械科(機械専攻・自動車専攻)・建設科(土木専攻・建築専攻)・電気科・情報技術科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '宿毛工業', department: '機械科(機械専攻・自動車専攻)・建設科(土木専攻・建築専攻)・電気科・情報技術科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '宿毛', department: '総合学科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '宿毛', department: '総合学科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '清水', department: '普通科(未来共創科)', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '清水', department: '普通科(未来共創科)', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知商業', department: '総合マネジメント科・社会マネジメント科・情報マネジメント科・スポーツマネジメント科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接5分間(表中最短)。★傾斜配点実施(頁5一覧表): 社会マネジメント科は学力検査の英語が1.5倍' },
    { schoolName: '高知商業', department: '総合マネジメント科・社会マネジメント科・情報マネジメント科・スポーツマネジメント科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接5分間。★傾斜配点実施(頁5一覧表): 社会マネジメント科は学力検査の英語が1.5倍' },
  ],
};
