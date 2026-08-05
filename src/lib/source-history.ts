// 47都道府県教育委員会の一次ソース確認履歴（X-14・∞継続型の変更履歴トラッキング基盤）。
//
// prefectures.ts が保持するのは「現在の」sourceUrl/sourceTitle/lastVerifiedのみで、
// 過去の変遷を追えない。本ファイルは「いつ・どの一次ソースを・どう確認したか」の
// 履歴を積み上げるための唯一の場所。
//
// 過去のスナップショットを創作することは捏造にあたるため、各都道府県の最初のエントリは
// prefectures.ts の既存 lastVerified フィールドから機械的に生成する（＝実際に確認済みの日付
// そのもの）。それ以降のエントリは、制度変更を確認する・再検証する等の実際の作業が発生した
// 都度、MANUAL_HISTORY に手動で追記していく（ここに架空の日付・架空の変更内容を追加しない）。
import { PREFECTURES } from './prefectures';

export interface SourceSnapshot {
  date: string;
  sourceUrl: string;
  sourceTitle: string;
  note: string;
}

// 実際に確認・変更を検知した際にのみ追記する（日付・内容の捏造禁止）。
const MANUAL_HISTORY: Record<string, SourceSnapshot[]> = {
  aichi: [
    {
      date: '2026-07-23',
      sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
      sourceTitle:
        '愛知県教育委員会・名古屋市教育委員会・豊橋市教育委員会「調査書情報の変更点」（令和8年4月発行）',
      note: '令和9(2027)年度入試から調査書の「性別」「行動の記録」「出欠の記録」を削除。内申点の算出に使う「学習の記録（評定）」欄・計算方法自体には変更なしと確認（/nyushi-seido-henkouにも掲載）',
    },
  ],
  saitama: [
    {
      date: '2026-07-23',
      sourceUrl: 'https://www.pref.saitama.lg.jp/documents/258788/news2024092601.pdf',
      sourceTitle: '埼玉県教育委員会「令和9年度埼玉県公立高等学校入学者選抜実施基本方針」（令和6年9月26日）',
      note: '令和9(2027)年度入試から調査書の記載事項を「各教科の学習の記録（9教科5段階の評定）」を基本とする形に整理（特別活動等の記録・出欠の記録等を削除）。全受検生対象の面接・自己評価資料を新設。内申点の算出に使う評定（9教科5段階）・学年比率選択（1:1:1/1:1:2/1:1:3）の仕組み自体には変更なしと確認（/nyushi-seido-henkouにも掲載）',
    },
  ],
  kagoshima: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/',
      sourceTitle: '鹿児島県教育委員会 入学者選抜（令和8年度県立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。白書2026・英語版で「全国最大の実技傾斜」として言及している最重要データのため特に慎重に確認。中3の評定のみを対象とし、5教科(国数英理社)を2倍(5段階×2倍×5教科=50点満点)・実技4教科(音楽・美術・保健体育・技術家庭)を20倍(5段階×20倍×4教科=400点満点)で合算する450点満点の内申点計算方式(学力検査も450点満点)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値は既存記載(coreMultiplier 2・practicalMultiplier 20・maxScore 450)と完全一致',
    },
  ],
  fukuoka: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/kyouiku/',
      sourceTitle: '福岡県教育委員会 入学者選抜（令和8年度福岡県立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象(9教科×5段階=45点満点)とし学力検査点300点満点と合算する内申点計算方式(一部高校で傾斜配点あり)を、教育系情報サイトでクロスチェックし、変更が無いことを確認した。数値は既存記載(targetGrades [3]・maxScore 45)と完全一致',
    },
  ],
  tottori: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      sourceTitle: '鳥取県教育委員会 入学者選抜（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象とし実技4教科を2倍にする基本65点満点の内申点計算方式(9教科×5段階+実技加重)を、教育系情報サイトでクロスチェックし、変更が無いことを確認した。志望校ごとに更に2〜4倍の追加倍率をかけ130/195/260点等へ換算する仕組み(既存noteフィールドに明記済み)も一致。学力検査:調査書の比率は2:8〜8:2の範囲で高校ごとに設定。数値は既存記載(practicalMultiplier 2・maxScore 65)と完全一致',
    },
  ],
  fukui: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08youkou.html',
      sourceTitle: '福井県教育委員会「令和8年度福井県立高等学校入学者選抜に関する実施要項」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象(9教科×5段階=45点満点)とし学力検査点500点満点と合算する内申点計算方式を、教育系情報サイトでクロスチェックし、45点満点という配点自体に変更が無いことを確認した。数値は既存記載(targetGrades [3]・maxScore 45)と完全一致',
    },
  ],
  yamagata: [
    {
      date: '2026-07-24',
      sourceUrl:
        'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
      sourceTitle: '山形県教育委員会「令和8年度山形県公立高等学校入学者選抜実施要項」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3の評定のみを対象(9教科×5段階=45点満点)とする内申点計算方式(調査書と学力検査の比率は3:7〜7:3の中から高校が選択)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値は既存記載(targetGrades [3]・maxScore 45)と完全一致',
    },
  ],
  aomori: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/nyuushi.html',
      sourceTitle: '青森県教育委員会 入学者選抜（令和8年度県立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。一般選抜では中1・中2・中3の評定合計(各45点満点)を均等(倍率無し)に合算する135点満点の内申点計算方式(学力検査は5教科500点満点)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:1/2:1/3:1・maxScore 135)と完全一致',
    },
  ],
  hokkaido: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/',
      sourceTitle: '北海道教育委員会 入学者選抜（令和8年度道立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中1・中2の評定合計(各45点満点)をそれぞれ2倍・中3の評定合計(45点満点)を3倍にして合算する内申点計算方式(90+90+135=315点満点)を、教育系情報サイトで独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:2/2:2/3:3・maxScore 315)と完全一致',
    },
  ],
  kanagawa: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      sourceTitle: '神奈川県教育委員会 入試情報（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中2・中3の2学年のみが対象で、中2の評定合計(45点満点)をそのまま・中3の評定合計を2倍(90点満点)にして合算した135点満点の内申点計算方式(S値=内申点135満点+学力検査500満点をそれぞれ100点換算し志望校ごとの比率2:8〜8:2で合算)を、教育系情報サイト複数(ステップ/栄光ゼミナール/塾選ジャーナル/湘南ゼミナール)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(targetGrades [2,3]・gradeMultipliers 2:1/3:2・maxScore 135)と完全一致',
    },
  ],
  tokyo: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
      sourceTitle: '東京都教育委員会「令和8年度入学者選抜実施要綱」',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3のみが対象で、5教科の評定合計をそのまま・実技4教科の評定合計を2倍にして合算した65点満点の換算内申(学力検査700点+調査書300点+ESAT-J20点=総合1020点満点のうち300点分に換算)という計算方式を、教育系情報サイト複数(栄光ゼミナール/進研ゼミ/都立高のトリセツ等)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(coreMultiplier 1・practicalMultiplier 2・maxScore 65・reverseCalc.totalMaxScore 1020)と完全一致',
    },
  ],
  hyogo: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/',
      sourceTitle: '兵庫県教育委員会 入学者選抜（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。中3のみが対象で、主要5教科の評定合計(25点満点)を4倍・実技4教科の評定合計(20点満点)を7.5倍し、調査書点250点満点(学力検査250点満点と合わせ総合500点満点)とする計算方式を、教育系情報サイト複数で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(coreMultiplier 4・practicalMultiplier 7.5・maxScore 250)と完全一致',
    },
  ],
  osaka: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
      sourceTitle: '大阪府教育庁 入試情報（令和8年度公立高等学校入学者選抜）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-04-22で最古グループ)により選定・再検証。一般入学者選抜で中1・中2の評定を2倍(各90点満点)・中3の評定を6倍(270点満点)とし合計450点満点とする計算方式を、教育系情報サイト複数(進研ゼミ/塾ジャーナル系)で独立にクロスチェックし、変更が無いことを確認した。数値・比率は既存記載(gradeMultipliers 1:2/2:2/3:6・maxScore 450)と完全一致',
    },
  ],
  ehime: [
    {
      date: '2026-07-26',
      sourceUrl: 'https://ehime-kyoiku.esnet.ed.jp/koukou/nyuusi/r08nyuusi',
      sourceTitle: '愛媛県教育委員会 県立学校入学者選抜等関連情報',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16グループ)により選定・再検証。中1・中2・中3の評定を均等に合算する135点満点の内申点計算方式(実技傾斜なし・学力検査500点満点)を、教育系情報サイト複数(アルファ家庭教師/塾選/愛大研等)で独立にクロスチェックし、変更が無いことを確認した。数値は既存記載(gradeMultipliers全学年1・practicalMultiplier 1・maxScore 135)と完全一致',
    },
  ],
  ibaraki: [
    {
      date: '2026-07-26',
      sourceUrl: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/youkou2026/',
      sourceTitle: '茨城県教育委員会 入学者選抜実施要項',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16グループ)により選定・再検証。中1・中2・中3の評定を均等に合算する135点満点の内申点計算方式(実技傾斜なし)を、教育系情報サイト複数(進研ゼミ/塾ラボ/いばらき受験ナビ)で独立にクロスチェックし、変更が無いことを確認した。数値は既存記載(gradeMultipliers全学年1・practicalMultiplier 1・maxScore 135)と完全一致',
    },
  ],
  okayama: [
    {
      date: '2026-07-26',
      sourceUrl: 'https://www.pref.okayama.jp/site/16/913706.html',
      sourceTitle: '岡山県 県立高等学校の入学者選抜',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16グループ)により選定・再検証。既存記載が自ら「簡易計算」と明記している通り、実際は中1・中2各45点+中3が110点(主要5教科×2倍=50点+実技4教科×3倍=60点)の合計200点満点(学力検査350点満点)という、単純な学年×教科倍率では表現しきれない構造であることを教育系情報サイト複数(塾選/エデュネッツ/KSB)で改めて確認した。ツール側の簡易表現(gradeMultipliers全学年1・practicalMultiplier 2・maxScore 195/actualMaxScore 200)・既存noteの注記内容ともに変更不要と判断',
    },
  ],
  chiba: [
    {
      date: '2026-07-24',
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/r8kaizenten.html',
      sourceTitle: '千葉県教育委員会「千葉県公立高等学校入学者選抜の改善点について」',
      note: '令和9(2027)年度入試から、学力検査の国語「話すこと・聞くこと」領域の出題方法が変更（従来の放送による聞き取り検査→話し合いの場面等を設定した文章による出題）。調査書関連の改善（総合的な学習の時間の記録・出欠の記録・行動の記録(第3学年)・総合所見の4項目削除）は令和8(2026)年度入試から既に実施済みで、確認時点(2026-07-24)ではもう「予告」段階ではなく施行済み。K値・内申点の算出方法自体（K値による傾斜配点方式）には変更ありと明記された記述は見当たらず、確認できたのは上記の学力検査出題方法・調査書記載事項の変更のみ',
    },
  ],
  okinawa: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuku-online.com/blog/jj-okinawa/',
      sourceTitle: '沖縄県内申点計算方法のまとめ記事（学習塾ベンガル記事群の要約含む・2026年度入試版）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。中1〜中3の3年間すべて対象・5教科(国数英理社)そのまま+実技4教科(音楽・美術・保健体育・技術家庭)を1.5倍・1学年55点満点×3年=165点満点の計算方式を、独立した教育系情報サイト2件(WebSearch要約+jyuku-online.comの詳細配点内訳)でクロスチェックし変更が無いことを確認した。数値は既存記載(targetGrades[1,2,3]・gradeMultipliers全学年1・coreMultiplier1・practicalMultiplier1.5・maxScore165)と完全一致',
    },
  ],
  iwate: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/iwate/',
      sourceTitle: '受験ラボ「岩手県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。**計算に使う中核数値(targetGrades[1,2,3]・gradeMultipliers{1,2,3}・coreMultiplier2・practicalMultiplier3・maxScore660)自体は複数ソースで660点満点という総量が一致し変更なしと確認できた**。一方、noteフィールドに記載の「実際の選抜では440点満点に換算される場合がある」という圧縮後の点数については、WebSearch要約が「2025年度入試より500点に圧縮」と述べる一方、jyuke-labo.comは「270点×2/3で440点満点」という既存noteと異なる計算過程(9教科合計×学年比のみ・実技倍率の記述なし)を示しており、2次情報源間で440/500が食い違い、算出根拠の記述も相互に整合しない。このnoteフィールドは実際の計算エンジン(coreMultiplier等)には使われない補足情報であり、着手前の状態から変更していないため実害はないが、圧縮後点数の真値は今回のセッションでは確定できなかった。捏造ゼロ原則により440→500等への書き換えは行わず現状維持のまま、次に手が空いた際に岩手県教育委員会の地区別実施概要PDF(盛岡地区等)を直接確認することを推奨する。',
    },
  ],
  gifu: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/gifu/',
      sourceTitle: '受験ラボ「岐阜県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・gradeMultipliers{1,2,3の中3のみ2倍}・coreMultiplier1・practicalMultiplier1・maxScore180=中1中2各45点+中3×2倍90点)を、WebSearch要約(複数サイト集約)とjyuke-labo.comの2ソースでクロスチェックし変更が無いことを確認した。**途中でnaishinten.com(内申点自動計算ツールサイト)が「全学年等倍・135点満点(中3の2倍なし)」という既存記載と相反する情報を返したため一時保留したが**、WebSearch要約・jyuke-labo.comの計3ソースが揃って180点/中3×2倍を支持しており多数決でnaishinten.com側を採用しない判断とした。naishinten.comは他県ページでも参照される汎用ツールサイトのため、別の県の再検証時にこのサイトの記載と既存データが食い違った場合は同様に多数ソースでの裏取りを優先すること。',
    },
  ],
  miyazaki: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://www.edu-netz.com/admission-information2026/miyazaki-info-r8',
      sourceTitle: '対話式進学塾1対1ネッツ「宮崎県の高校入試情報2026(令和8年度)」＋WebSearch要約',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・全学年等倍・coreMultiplier1・practicalMultiplier1・maxScore135=9教科×5段階×3学年、学力検査等との比率は非公表で学校ごとに傾斜配点)を、WebSearch要約とedu-netz.comの2独立ソースでクロスチェックし変更が無いことを確認した(実際の配点は学校により70〜300点と幅がある旨も既存noteと整合)。',
    },
  ],
  miyagi: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/miyagi/',
      sourceTitle: '受験ラボ「宮城県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・全学年等倍・coreMultiplier1・practicalMultiplier2・maxScore195=5教科そのまま+実技4教科×2倍・各学年65点×3=195点満点、共通選抜のスコープ)を、WebSearch要約とjyuke-labo.comの2独立ソースでクロスチェックし変更が無いことを確認した。特色選抜は高校ごとに0.25〜4.0倍の独自換算率を用いる別制度である旨も両ソースで一致（既存の「共通選抜195点固定・特色選抜は各校独自換算率」という理解と整合）。',
    },
  ],
  kyoto: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://www.kobetsukan.jp/blog/48qptwexgcu/',
      sourceTitle: 'アップ教育企画「京都府公立高校入試［中期選抜］の内申点の計算方法」＋WebSearch要約',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(中期選抜スコープ・targetGrades[1,2,3]・全学年等倍・coreMultiplier1・practicalMultiplier2・maxScore195=各学年65点×3)を、WebSearch要約とkobetsukan.jpの2独立ソースでクロスチェックし変更が無いことを確認した。noteフィールドの「前期選抜は135点満点」は今回参照した2ソースいずれも前期選抜に言及が無く独立再確認はできなかったが、否定する記述も無いため現状維持（前期選抜の値自体は今回変更していない）。',
    },
  ],
  kumamoto: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/kumamoto/',
      sourceTitle: '受験ラボ「熊本県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・gradeMultipliers{1,2,3の中3のみ2倍}・実技倍率なし・maxScore180=中1中2各45点+中3×2倍90点)を、WebSearch要約・axis-kobetsu.jp(180点満点のみ確認)・jyuke-labo.com(学年別詳細内訳)の3ソースでクロスチェックし変更が無いことを確認した。',
    },
  ],
  gunma: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://www.wasedazemi.com/column/entrance-exam/gunma-naishinten/',
      sourceTitle: 'W早稲田ゼミ「群馬県の公立高校受験で必要な内申点の計算方法」＋WebSearch要約',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・全学年等倍・実技倍率なし・maxScore135=中1〜中3の9教科×5段階を単純合算)を、WebSearch要約とwasedazemi.comの2独立ソースでクロスチェックし変更が無いことを確認した(「3年間オール5であれば満点135点」という記述で完全一致)。2024年度からの前期後期選抜廃止(特色型/総合型への再編)は選抜方式の変更であり、内申点の算出方法自体には影響していないことも両ソースで確認できた。',
    },
  ],
  hiroshima: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://www.edu-netz.com/admission-information2026/hiroshima-info-r8',
      sourceTitle: '対話式進学塾1対1ネッツ「広島県の高校入試情報2026(令和8年度)」＋WebSearch要約',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(targetGrades[1,2,3]・gradeMultipliers{1,2,3の中3のみ3倍}・実技倍率なし・maxScore225=中1中2各45点+中3×3倍135点)を、WebSearch要約とedu-netz.comの2独立ソースでクロスチェックし変更が無いことを確認した(45+45+135=225で完全一致)。副次的な発見: 一般枠は傾斜配点なしだが、基町高校等一部の特色枠選抜校では学校独自に副教科2倍の傾斜を課すケースがあると判明。ただしこれは学校単位の例外でありprefectures.tsの県レベル基準値の設計方針(学校別の独自傾斜は対象外)とは矛盾しないため変更不要と判断。',
    },
  ],
  kagawa: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/kagawa/',
      sourceTitle: '受験ラボ「香川県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載は「簡易計算(coreMultiplier2・practicalMultiplier4を3学年均等適用=390点満点)・note欄に実選抜の真の計算(中1中2は倍率なしの各45点+中3のみ5教科×2倍+実技4教科×4倍=130点で合計220点満点)」という2段構造。今回、WebSearch要約とjyuke-labo.comの2独立ソースでこの「中1中2は倍率なし・中3のみ2倍/4倍で220点満点」という実選抜側の計算方式を直接クロスチェックし、既存note記載と完全一致(45+45+100+80=220)することを確認した。simplifiedCalc=trueの設計上の妥協(3学年に一律で2倍/4倍をかけた390点という簡易表示)自体は変更不要と判断。',
    },
  ],
  kochi: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://jyuke-labo.com/koukoujyukentaisaku/kouchi/',
      sourceTitle: '受験ラボ「高知県高校入試情報」＋WebSearch要約（複数教育系サイトの記述比較）',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(5段階換算195点満点・practicalMultiplier2・note欄に「中3の実際の評定は10段階評価で260点満点」)を、WebSearch要約とjyuke-labo.comの2独立ソースでクロスチェックし変更が無いことを確認した。jyuke-labo.comは中1中2各65点(5段階)+中3130点(10段階)=真の260点満点という同じ構造を独立に報告しており、既存noteの「10段階評価で260点満点」という記述と整合。',
    },
  ],
  saga: [
    {
      date: '2026-08-05',
      sourceUrl: 'https://www.edu-netz.com/admission-information2026/saga-info-r8',
      sourceTitle: '対話式進学塾1対1ネッツ「佐賀県の高校入試情報2026(令和8年度)」＋WebSearch要約',
      note: 'ZZ-9b再検証優先度キュー(最終確認日2026-07-16で最古グループ)により選定・再検証。既存記載(全学年等倍・実技倍率なし・9教科×5段階×3年=135点満点)を、WebSearch要約とedu-netz.comの2独立ソースでクロスチェックし変更が無いことを確認した(「中1 45点・中2 45点・中3 45点=135点満点」で完全一致)。2028年度からの選抜制度改革(特別選抜廃止+一般選抜一本化・本セッション今朝のX-30調査で発見済み)は未施行かつ選抜方式のみの変更であり、内申点算出方法自体には影響しないことを確認。',
    },
  ],
};

export function getSourceHistory(code: string): SourceSnapshot[] {
  const pref = PREFECTURES.find((p) => p.code === code);
  if (!pref?.sourceUrl || !pref.sourceTitle || !pref.lastVerified) return [];

  const baseline: SourceSnapshot = {
    date: pref.lastVerified,
    sourceUrl: pref.sourceUrl,
    sourceTitle: pref.sourceTitle,
    note: 'このアーカイブの起点となる最初の確認記録',
  };

  const manual = MANUAL_HISTORY[code] ?? [];
  return [baseline, ...manual].sort((a, b) => a.date.localeCompare(b.date));
}

export interface PrefectureSourceHistory {
  code: string;
  name: string;
  region: string;
  history: SourceSnapshot[];
}

export function getAllSourceHistories(): PrefectureSourceHistory[] {
  return PREFECTURES.map((p) => ({
    code: p.code,
    name: p.name,
    region: p.region,
    history: getSourceHistory(p.code),
  })).filter((entry) => entry.history.length > 0);
}
