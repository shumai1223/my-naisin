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
// ★頁1「全日制の課程」の面接内容一覧表(表の行数は32行=分校2件を含む・schoolNameとしては30校)64レコードと、
// 頁2「多部制単位制」(中芸・高知北の昼間部/夜間部・6レコード)・「定時制の課程」(11校・B日程のみ・11レコード)を収録
// (2026-09-19 頁2を実画像で転記。多部制・定時制のdepartmentは全日制と区別するため「多部制単位制 昼間部・…」「定時制の課程・…」と表記)。
// 頁3-4「実技検査の概要一覧表」(A日程・B日程・全日制の課程)は岡豊(芸術/体育コース)・高知丸の内(音楽科)・
// 高知国際(探究/DPコース)・高知商業(スポーツマネジメント科)の6学科×A/Bの12レコードとして収録した
// (departmentは「…・実技検査」で面接レコードと区別・interviewRequiredは設定しない・note=検査内容の要約。
// 2026-09-19 実画像で転記。B日程の岡豊・体育コースは運動能力テストのみで運動競技種目テストの記載が無い)。
// 頁5下「成人特別選抜の概要一覧表」(定時制11校+多部制単位制夜間部2校のうち表に載る13校)は13レコード(selectionCategory「成人特別選抜」・
// 比率・面接時間・作文の字数/時間をnoteに転記。「比率」欄の意味の注記は資料に無くそのまま転記。2026-09-19 実画像で転記)。
// これで全5頁を完全収録した(残りの傾斜配点実施校一覧表=頁5上は既に収録済み)。selectionCategoryは「A日程」「B日程」の2区分。interviewRequired
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
    '頁1「全日制の課程」の面接内容一覧表(表の行数は32行=分校2件を含む・schoolNameとしては30校)64レコードと、多部制単位制(中芸・高知北の昼間部/夜間部・6レコード)・定時制(11校・B日程のみ11レコード)の面接内容(頁2)を収録。実技検査の概要一覧表(頁3-4・岡豊・高知丸の内・高知国際・高知商業の6学科×A/B日程=12レコード)も収録。成人特別選抜の概要一覧表(頁5下・定時制11校+多部制単位制夜間部2校=13レコード)も収録し、資料全5頁を完全収録(傾斜配点実施校一覧表=頁5上は3校のnoteに転記済み)',
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
    { schoolName: '中芸', department: '多部制単位制 昼間部・普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接10分間' },
    { schoolName: '中芸', department: '多部制単位制 昼間部・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間' },
    { schoolName: '中芸', department: '多部制単位制 夜間部・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '高知北', department: '多部制単位制 昼間部・普通科', selectionCategory: 'A日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知北', department: '多部制単位制 昼間部・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間' },
    { schoolName: '高知北', department: '多部制単位制 夜間部・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '室戸', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '山田', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '高知東工業', department: '定時制の課程・機械科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '高知工業', department: '定時制の課程・機械科・電気科・土木科・建築科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '高岡', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '須崎総合', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '佐川', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '大方', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接10分間。A日程は「−」(実施なし)' },
    { schoolName: '宿毛', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '清水', department: '定時制の課程・普通科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接6分間。A日程は「−」(実施なし)' },
    { schoolName: '高知商業', department: '定時制の課程・商業科', selectionCategory: 'B日程', interviewRequired: true, note: '個人面接7分間。A日程は「−」(実施なし)' },
    { schoolName: '岡豊', department: '普通科(芸術コース)・実技検査', selectionCategory: 'A日程', note: '(1)音楽分野: 実技検査に関する調査カードで選択した器楽(任意の曲1曲を無伴奏で独奏・演奏時間2分以上)または声楽(任意の曲1曲又は2曲を無伴奏で独唱・演奏時間の合計2分以上)。管楽器は吸水シート1枚及びビニール袋1枚を持参。(2)美術分野: 鉛筆によるデッサン(検査時間90分・画用紙四つ切りは本校で用意)。(3)書道分野: 指定した文字を楷書及び行書で半紙に毛筆で書く(検査時間50分・漢字4文字を楷書と行書で各1枚ずつ清書)' },
    { schoolName: '岡豊', department: '普通科(体育コース)・実技検査', selectionCategory: 'A日程', note: '次の2つの検査を行う。(1)運動能力テスト: 50m走(雨天時は体育館にて30m走)・ハンドボール投げ・反復横跳び・立ち幅跳びの4種目(服装は中学校又は義務教育学校の体操服・靴はグラウンドシューズと体育館シューズを持参)。(2)運動競技種目テスト: 本校が指定する運動競技種目(野球・サッカー・ソフトボール・バスケットボール・バレーボール・ハンドボール・ソフトテニス・テニス・バドミントン・卓球・柔道・剣道・陸上競技・ボクシング)のうちから1種目を選択して実施(各種目に必要な用具は各自持参)' },
    { schoolName: '高知丸の内', department: '音楽科・実技検査', selectionCategory: 'A日程', note: '聴音(簡単な旋律・ハ長調4分の4拍子8小節の書き取り)と専攻ごとの検査。(1)声楽専攻: 中学校教科書程度の独唱曲1曲を無伴奏で独唱。(2)ピアノ専攻: 任意の独奏曲1曲を演奏。(3)管・弦・打楽器専攻: 任意の独奏曲1曲を無伴奏で演奏(管・弦楽器は楽器を持参)。(4)クリエイティブ専攻(ICT機器を活用した音楽づくり等): 聴音は行わず音楽の諸要素の知覚・感受に関する表現(曲調を言葉で表現する内容)のみ' },
    { schoolName: '高知国際', department: 'グローバル科(探究コース)・実技検査', selectionCategory: 'A日程', note: '英語による口頭試問: 学校作成の100語程度の英文を黙読後、その内容について英語で口頭試問を行う' },
    { schoolName: '高知国際', department: 'グローバル科(DPコース)・実技検査', selectionCategory: 'A日程', note: '次の2つの検査を行う。(1)日本語による口頭試問: 面接終了後に別途、DP(国際バカロレア機構が提供するディプロマ・プログラム)教育全般や本校のDP教育に関する口頭試問を日本語で10分程度実施。(2)英語による口頭試問: 学校作成の100語程度の英文を黙読後、その内容について英語で口頭試問を行う' },
    { schoolName: '高知商業', department: 'スポーツマネジメント科・実技検査', selectionCategory: 'A日程', note: '学校が指定する運動競技種目のうちから1種目を選択し、その競技に関する運動能力・技術テストを行う' },
    { schoolName: '岡豊', department: '普通科(芸術コース)・実技検査', selectionCategory: 'B日程', note: '(1)音楽分野: 任意の曲(1曲)を無伴奏で独奏又は独唱(管楽器は吸水シート1枚及びビニール袋1枚を持参)。(2)美術分野: 鉛筆によるデッサン(検査時間90分・画用紙四つ切りは本校で用意)。(3)書道分野: 指定した文字を楷書及び行書で半紙に毛筆で書く(検査時間50分・漢字4文字を楷書と行書で各1枚ずつ清書)' },
    { schoolName: '岡豊', department: '普通科(体育コース)・実技検査', selectionCategory: 'B日程', note: '運動能力テスト: 50m走(雨天時は体育館にて30m走)・ハンドボール投げ・反復横跳び・立ち幅跳びの4種目(服装は中学校又は義務教育学校の体操服・靴はグラウンドシューズと体育館シューズを持参)。運動競技種目テストの記載はなし' },
    { schoolName: '高知丸の内', department: '音楽科・実技検査', selectionCategory: 'B日程', note: '聴音(簡単な旋律・ハ長調4分の4拍子8小節の書き取り)と専攻ごとの検査。(1)声楽専攻: 中学校教科書程度の独唱曲1曲を無伴奏で独唱。(2)ピアノ専攻: 任意の独奏曲1曲を演奏。(3)管・弦・打楽器専攻: 任意の独奏曲1曲を無伴奏で演奏(管・弦楽器は楽器を持参)。(4)クリエイティブ専攻(ICT機器を活用した音楽づくり等): 聴音は行わず音楽の諸要素の知覚・感受に関する表現(曲調を言葉で表現する内容)のみ' },
    { schoolName: '高知国際', department: 'グローバル科(探究コース)・実技検査', selectionCategory: 'B日程', note: '英語による口頭試問: 学校作成の100語程度の英文を黙読後、その内容について英語で口頭試問を行う' },
    { schoolName: '高知国際', department: 'グローバル科(DPコース)・実技検査', selectionCategory: 'B日程', note: '次の2つの検査を行う。(1)日本語による口頭試問: 面接終了後に別途、DP(国際バカロレア機構が提供するディプロマ・プログラム)教育全般や本校のDP教育に関する口頭試問を日本語で10分程度実施。(2)英語による口頭試問: 学校作成の100語程度の英文を黙読後、その内容について英語で口頭試問を行う' },
    { schoolName: '高知商業', department: 'スポーツマネジメント科・実技検査', selectionCategory: 'B日程', note: '学校が指定する運動競技種目のうちから1種目を選択し、その競技に関する運動能力・技術テストを行う' },
    { schoolName: '室戸', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・30分)' },
    { schoolName: '中芸', department: '多部制単位制夜間部・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・40分)' },
    { schoolName: '山田', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接6分間・作文(400字・30分)' },
    { schoolName: '高知東工業', department: '定時制・機械科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間(作文の記載なし)' },
    { schoolName: '高知工業', department: '定時制・機械科、電気科、土木科、建築科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=50%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・40分)' },
    { schoolName: '高知北', department: '多部制単位制夜間部・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・40分)' },
    { schoolName: '高岡', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間(作文の記載なし)' },
    { schoolName: '須崎総合', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(600字・50分)' },
    { schoolName: '佐川', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接7分間・作文(600字・40分)' },
    { schoolName: '大方', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間(作文の記載なし)' },
    { schoolName: '宿毛', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・30分)' },
    { schoolName: '清水', department: '定時制・普通科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接10分間・作文(400字・40分)' },
    { schoolName: '高知商業', department: '定時制・商業科', selectionCategory: '成人特別選抜', interviewRequired: true, note: '資料の「比率」欄=20%(意味の注記は資料に無い)。検査項目: 個人面接7分間・作文(400字・30分)' },
  ],
};
