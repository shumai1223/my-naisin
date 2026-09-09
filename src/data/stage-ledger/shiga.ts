import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 滋賀県 段階台帳（T-Y11F §5順序#7・13県目・全日制61レコードで完結）。
 *
 * 一次ソース: 滋賀県教育委員会「令和8年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料」
 * （令和8年3月9日公表・全3頁〈全日制2頁＋定時制1頁〉）。
 * https://www.pref.shiga.lg.jp/documents/16947/5595441_1.pdf
 *
 * ⚠️CJK埋め込みフォントでpdftotextが機能しないため、pdftoppm 200dpi + ビジョン読み取りで転記した。
 *
 * ⚠️滋賀県は他県と異なり同一学校×学科に「学校独自型選抜」（自己推薦／中学校長推薦）と
 * 「一般型選抜」の2トラックが並存する（既存パイプライン`competition-rates/shiga.ts`の設計を
 * 継承）。段階台帳も既存パイプラインと同じく**一般型選抜のみ**を対象とし、募集人員は
 * 「学校独自型の入学許可予定者数を差し引いた確定募集人数」（資料内の括弧書きの人数）を採用。
 * 膳所・草津東・守山北・高島・米原の5校は複数学科（普通・理数等）に加え「両方の学科」
 * （どちらの学科でも合格しうる併願枠）を持つため、既存パイプラインと同じくこの3行を1レコードに
 * 合算した（quota=各学科の一般型募集人員の合計・applicantsConfirmed/testTakersConfirmedは
 * 各学科行+両方の学科行の合計・finalPassersは各学科行の入学許可予定者数の合計〈両方の学科行は
 * 入学許可予定者数が「-」で最終的に各学科の内数に吸収されるため加算不要〉）。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/shiga.ts`（一般型選抜のみを
 * 自己集計・quota6,016/applicants9,333が資料本文には印字されていないため既存パイプライン自身が
 * 「自己集計値」と明記）をそのまま再利用。61件全数のquota・applicantsConfirmedを資料本文から
 * 独立に再転記したところ、自己集計合計（quota6,016・applicants9,333）の両方と1件のズレもなく
 * 完全一致した——既存パイプラインとの相互裏取りに加え、既存パイプライン自身が「印字なし・
 * 自己集計」と申告していた数値を独立再現できたことによる二重の検証。
 *
 * testTakersConfirmed（学力検査受検者数）・finalPassers（入学許可予定者数）は本資料から新規転記
 * した。61件全数の機械集計はtestTakersConfirmed8,938・finalPassers6,000（本資料には一般型のみの
 * 合計行が無いためこちらも自己集計値。全選抜type合算の「計①」8,412等とは一致しない別概念）。
 *
 * 定時制課程・学校独自型選抜（自己推薦・中学校長推薦）は他県と同じ理由でスコープ外。
 */
export const SHIGA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'shiga',
  sources: [
    {
      url: 'https://www.pref.shiga.lg.jp/documents/16947/5595441_1.pdf',
      docTitle: '滋賀県教育委員会 令和8年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制・一般型選抜（44校61学科を完全収録）'],
    pendingDepartments: [
      '定時制の課程（他県と同じ理由で恒久的にスコープ外）',
      '学校独自型選抜（自己推薦・中学校長推薦。既存パイプラインと同じく一般型選抜のみを対象とする設計のため対象外）',
    ],
    note: '全日制44校61学科（一般型選抜のみ）を完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/shiga.ts`を再利用し、61件全数を資料本文から独立に再転記したところ既存パイプラインの自己集計合計（quota6,016・applicants9,333）と完全一致した。testTakersConfirmed・finalPassersは本資料から新規転記し、61件の機械集計はtestTakersConfirmed8,938・finalPassers6,000（本資料に一般型のみの合計行が無いため自己集計値）。膳所・草津東・守山北・高島・米原の5校は「両方の学科」併願枠を持ち、既存パイプラインと同じ規律で学科ごとの一般型行＋両方の学科行を1レコードに合算した（quota・applicantsConfirmed・testTakersConfirmedは3行合計、finalPassersは両方の学科行に入学許可予定者数の印字が無いため各学科行の合計のみ）。定時制課程・学校独自型選抜は恒久的にスコープ外。',
  },
  records: [
    { schoolName: '膳所', department: '普通・理数(一般型・両方の学科含む)', quota: 340, applicantsConfirmed: 474, testTakersConfirmed: 453, finalPassers: 341 },
    { schoolName: '堅田', department: '普通', quota: 144, applicantsConfirmed: 176, testTakersConfirmed: 151, finalPassers: 117 },
    { schoolName: '東大津', department: '普通', quota: 288, applicantsConfirmed: 365, testTakersConfirmed: 328, finalPassers: 288 },
    { schoolName: '北大津', department: '普通', quota: 72, applicantsConfirmed: 154, testTakersConfirmed: 136, finalPassers: 76 },
    { schoolName: '大津', department: '普通', quota: 168, applicantsConfirmed: 366, testTakersConfirmed: 344, finalPassers: 168 },
    { schoolName: '大津', department: '家庭科学', quota: 48, applicantsConfirmed: 80, testTakersConfirmed: 77, finalPassers: 48 },
    { schoolName: '石山', department: '普通', quota: 288, applicantsConfirmed: 406, testTakersConfirmed: 390, finalPassers: 288 },
    { schoolName: '瀬田工業', department: '機械', quota: 60, applicantsConfirmed: 133, testTakersConfirmed: 122, finalPassers: 61 },
    { schoolName: '瀬田工業', department: '電気', quota: 60, applicantsConfirmed: 119, testTakersConfirmed: 112, finalPassers: 64 },
    { schoolName: '瀬田工業', department: '化学工業', quota: 20, applicantsConfirmed: 45, testTakersConfirmed: 42, finalPassers: 25 },
    { schoolName: '大津商業', department: '総合ビジネス', quota: 100, applicantsConfirmed: 226, testTakersConfirmed: 218, finalPassers: 100 },
    { schoolName: '大津商業', department: '情報システム', quota: 40, applicantsConfirmed: 90, testTakersConfirmed: 85, finalPassers: 40 },
    { schoolName: '彦根東', department: '普通', quota: 304, applicantsConfirmed: 394, testTakersConfirmed: 382, finalPassers: 304 },
    { schoolName: '河瀬', department: '普通', quota: 96, applicantsConfirmed: 105, testTakersConfirmed: 102, finalPassers: 97 },
    { schoolName: '彦根工業', department: '機械', quota: 60, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 88 },
    { schoolName: '彦根工業', department: '電気', quota: 40, applicantsConfirmed: 78, testTakersConfirmed: 78, finalPassers: 46 },
    { schoolName: '彦根工業', department: '建設', quota: 20, applicantsConfirmed: 35, testTakersConfirmed: 33, finalPassers: 17 },
    { schoolName: '彦根翔西館', department: '総合', quota: 160, applicantsConfirmed: 374, testTakersConfirmed: 371, finalPassers: 162 },
    { schoolName: '長浜北', department: '普通', quota: 120, applicantsConfirmed: 204, testTakersConfirmed: 204, finalPassers: 111 },
    { schoolName: '虎姫', department: '普通', quota: 160, applicantsConfirmed: 207, testTakersConfirmed: 202, finalPassers: 169 },
    { schoolName: '伊香', department: '普通', quota: 48, applicantsConfirmed: 67, testTakersConfirmed: 65, finalPassers: 58 },
    { schoolName: '伊香', department: '森の探究', quota: 20, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 16 },
    { schoolName: '長浜農業', department: '農業', quota: 20, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 19 },
    { schoolName: '長浜農業', department: '食品', quota: 20, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 25 },
    { schoolName: '長浜農業', department: '園芸', quota: 20, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 23 },
    { schoolName: '長浜北星', department: '総合', quota: 140, applicantsConfirmed: 200, testTakersConfirmed: 200, finalPassers: 145 },
    { schoolName: '八幡', department: '普通', quota: 168, applicantsConfirmed: 291, testTakersConfirmed: 286, finalPassers: 183 },
    { schoolName: '八幡工業', department: '機械', quota: 40, applicantsConfirmed: 82, testTakersConfirmed: 81, finalPassers: 40 },
    { schoolName: '八幡工業', department: '電気', quota: 40, applicantsConfirmed: 80, testTakersConfirmed: 78, finalPassers: 39 },
    { schoolName: '八幡工業', department: '環境化学', quota: 20, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 24 },
    { schoolName: '八幡商業', department: '商業', quota: 80, applicantsConfirmed: 182, testTakersConfirmed: 175, finalPassers: 80 },
    { schoolName: '八幡商業', department: '国際経済', quota: 20, applicantsConfirmed: 31, testTakersConfirmed: 27, finalPassers: 16 },
    { schoolName: '八幡商業', department: '情報処理', quota: 20, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 21 },
    { schoolName: '草津東', department: '普通・体育(一般型・両方の学科含む)', quota: 212, applicantsConfirmed: 475, testTakersConfirmed: 448, finalPassers: 212 },
    { schoolName: '草津', department: '普通', quota: 180, applicantsConfirmed: 243, testTakersConfirmed: 223, finalPassers: 186 },
    { schoolName: '玉川', department: '普通', quota: 256, applicantsConfirmed: 317, testTakersConfirmed: 295, finalPassers: 244 },
    { schoolName: '湖南農業', department: '農業', quota: 40, applicantsConfirmed: 87, testTakersConfirmed: 80, finalPassers: 58 },
    { schoolName: '湖南農業', department: '食品', quota: 20, applicantsConfirmed: 40, testTakersConfirmed: 36, finalPassers: 30 },
    { schoolName: '湖南農業', department: '花緑', quota: 20, applicantsConfirmed: 54, testTakersConfirmed: 50, finalPassers: 27 },
    { schoolName: '守山', department: '普通', quota: 180, applicantsConfirmed: 226, testTakersConfirmed: 215, finalPassers: 180 },
    { schoolName: '守山北', department: '普通・みらい共創(一般型・両方の学科含む)', quota: 80, applicantsConfirmed: 122, testTakersConfirmed: 114, finalPassers: 76 },
    { schoolName: '栗東', department: '普通', quota: 80, applicantsConfirmed: 120, testTakersConfirmed: 116, finalPassers: 64 },
    { schoolName: '国際情報', department: '総合', quota: 120, applicantsConfirmed: 236, testTakersConfirmed: 229, finalPassers: 109 },
    { schoolName: '水口', department: '普通', quota: 130, applicantsConfirmed: 217, testTakersConfirmed: 214, finalPassers: 136 },
    { schoolName: '水口東', department: '普通', quota: 90, applicantsConfirmed: 88, testTakersConfirmed: 87, finalPassers: 69 },
    { schoolName: '甲南', department: '総合', quota: 60, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 77 },
    { schoolName: '信楽', department: '総合', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 26 },
    { schoolName: '野洲', department: '普通', quota: 80, applicantsConfirmed: 117, testTakersConfirmed: 111, finalPassers: 70 },
    { schoolName: '石部', department: '普通', quota: 60, applicantsConfirmed: 87, testTakersConfirmed: 85, finalPassers: 44 },
    { schoolName: '甲西', department: '普通', quota: 120, applicantsConfirmed: 215, testTakersConfirmed: 208, finalPassers: 120 },
    { schoolName: '高島', department: '普通・文理探究(一般型・両方の学科含む)', quota: 156, applicantsConfirmed: 189, testTakersConfirmed: 174, finalPassers: 161 },
    { schoolName: '安曇川', department: '総合', quota: 84, applicantsConfirmed: 69, testTakersConfirmed: 66, finalPassers: 62 },
    { schoolName: '八日市', department: '普通', quota: 252, applicantsConfirmed: 300, testTakersConfirmed: 294, finalPassers: 252 },
    { schoolName: '能登川', department: '普通', quota: 84, applicantsConfirmed: 116, testTakersConfirmed: 110, finalPassers: 76 },
    { schoolName: '八日市南', department: '農業', quota: 20, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 20 },
    { schoolName: '八日市南', department: '食品', quota: 20, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 27 },
    { schoolName: '八日市南', department: '花緑デザイン', quota: 20, applicantsConfirmed: 43, testTakersConfirmed: 42, finalPassers: 30 },
    { schoolName: '伊吹', department: '普通', quota: 60, applicantsConfirmed: 99, testTakersConfirmed: 98, finalPassers: 59 },
    { schoolName: '米原', department: '普通・理数(一般型・両方の学科含む)', quota: 168, applicantsConfirmed: 161, testTakersConfirmed: 157, finalPassers: 141 },
    { schoolName: '日野', department: '総合', quota: 80, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 90 },
    { schoolName: '愛知', department: '普通', quota: 60, applicantsConfirmed: 90, testTakersConfirmed: 90, finalPassers: 55 },
  ],
};
