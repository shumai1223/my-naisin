import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 山形県 段階台帳（T-Y11F §5順序#7・19県目・全日制90レコードで完結）。
 *
 * 一次ソース: 山形県教育委員会「令和8年度山形県公立高等学校入学者選抜 受検者数・合格者数」
 * （令和8年3月17日・全4頁〈全日制2頁＋定時制1頁＋総括1頁〉）。
 * https://www.pref.yamagata.jp/documents/42443/0317jukennshashiganbairitu.pdf
 *
 * ⚠️他県との設計上の違い（既存パイプラインを再利用しない・完全独立収録）: 既存パイプライン
 * `competition-rates/yamagata.ts`は「後期（一般）選抜のみ」を対象にquota=募集人員（入学定員から
 * 前期選抜等内定者数を控除済み）・applicants=後期選抜志願者数のみを収録する設計だが、本台帳が
 * 典拠とする資料は前期(特色)選抜・連携型・併設型を含む**全トラック合算後の最終値**（quota=入学
 * 定員そのもの・受検者等の数＝入学志願者等の数−取消欠席者数・合格者等の数＝合格者数＋併設型
 * 入学予定者数）という別定義のため、既存パイプラインとは再利用できない（両者は概念が異なり、
 * 例えば山形東「普通」は既存パイプラインquota152・applicants69だが本資料はquota160・
 * applicantsConfirmed77で一致しない）。そのため本県のみ既存パイプラインを参照せず、単一資料から
 * 4フィールドすべてを独立に転記した（新潟県で確立した「意図的に既存と異なる設計」の再適用）。
 *
 * quota・applicantsConfirmed・testTakersConfirmed・finalPassersの90レコード全数の機械集計
 * （6,520／5,088／5,072／4,971）が、資料本文の「全日制公立合計」行（入学定員6,520・入学志願者等
 * 5,088・受検者等5,072・合格者等4,971）と4系列すべて完全一致した（初回転記で一致・再修正なし）。
 * レコード数90は既存パイプラインの「90レコード」と偶然一致するが、内容（quota等の値）は上記の
 * 通り別物である。
 *
 * ⚠️既知の14件: finalPassersがtestTakersConfirmedを上回るのは、資料自身の定義注記
 * 「合格者等の数＝合格者数＋併設型中学校から併設型高等学校への入学予定者数」の通り、併設型中学校
 * を持つ学校（山形東・山形中央・寒河江・長井・鶴岡工業・酒田光陵・山形市立商業等）で、併設型中学
 * からの入学予定者は学力検査を受検しないため受検者数に含まれず合格者数のみに加算されるという、
 * 資料が明記する仕組みによるもの（他県の「学科間再配分」とは異なり原因が判明している）。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const YAMAGATA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'yamagata',
  sources: [
    {
      url: 'https://www.pref.yamagata.jp/documents/42443/0317jukennshashiganbairitu.pdf',
      docTitle: '山形県教育委員会 令和8年度山形県公立高等学校入学者選抜 受検者数・合格者数',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（県立38校＋市立1校の90レコードを完全収録・前期(特色)+後期(一般)等の全トラック合算値）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制39校（県立38+市立1）90レコードを完全収録。既存パイプライン`competition-rates/yamagata.ts`は「後期（一般）選抜のみ」を対象とする別定義（quota=募集人員=入学定員から前期選抜等内定者数を控除済み）のため再利用せず、本台帳は単一資料（quota=入学定員そのもの・受検者等=入学志願者等−取消欠席者数・合格者等=合格者数+併設型入学予定者数という全トラック合算の定義）から4フィールドすべてを独立に転記した。4系列すべての機械集計（6,520／5,088／5,072／4,971）が資料本文の「全日制公立合計」行と完全一致した。finalPassersがtestTakersConfirmedを上回る14件は資料自身の定義注記どおり併設型中学校からの入学予定者（学力検査を受検しない）が合格者数のみに加算されるためと判明している。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制公立合計', quota: 6520, applicantsConfirmed: 5088, testTakersConfirmed: 5072, finalPassers: 4971 },
  ],
  records: [
    { schoolName: '山形東', department: '普通', quota: 160, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 161 },
    { schoolName: '山形東', department: '探究(理数探究,国際探究)', quota: 80, applicantsConfirmed: 173, testTakersConfirmed: 173, finalPassers: 80 },
    { schoolName: '山形南', department: '普通', quota: 200, applicantsConfirmed: 212, testTakersConfirmed: 211, finalPassers: 202 },
    { schoolName: '山形南', department: '理数', quota: 40, applicantsConfirmed: 64, testTakersConfirmed: 64, finalPassers: 40 },
    { schoolName: '山形西', department: '普通', quota: 200, applicantsConfirmed: 200, testTakersConfirmed: 200, finalPassers: 200 },
    { schoolName: '山形北', department: '普通', quota: 160, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 151 },
    { schoolName: '山形北', department: '音楽', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '山形工業', department: '機械技術', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '山形工業', department: '電気電子', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '山形工業', department: '情報技術', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '山形工業', department: '建築', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '山形工業', department: '土木・化学', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 40 },
    { schoolName: '山形中央', department: '普通', quota: 160, applicantsConfirmed: 133, testTakersConfirmed: 133, finalPassers: 135 },
    { schoolName: '山形中央', department: '体育(スポーツ)', quota: 80, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 80 },
    { schoolName: '上山明新館', department: '普通', quota: 160, applicantsConfirmed: 94, testTakersConfirmed: 93, finalPassers: 93 },
    { schoolName: '上山明新館', department: '農業(食料生産)', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '上山明新館', department: '商業(情報経営)', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '天童', department: '総合', quota: 120, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '山辺', department: '家庭(食物)', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '山辺', department: '家庭(福祉)', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '山辺', department: '看護(看護)', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '寒河江', department: '普通(一般コース)', quota: 160, applicantsConfirmed: 127, testTakersConfirmed: 127, finalPassers: 147 },
    { schoolName: '寒河江', department: '普通(探究コース)', quota: 40, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 40 },
    { schoolName: '寒河江工業', department: 'メカニカルエンジニア', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '寒河江工業', department: 'ロボットエンジニア', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '寒河江工業', department: 'ITエンジニア', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '谷地', department: '普通', quota: 80, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '左沢', department: '総合', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '村山産業', department: '農業(農業経営)', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '村山産業', department: '農業(みどり活用)', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '村山産業', department: '工業(機械)', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '村山産業', department: '工業(電子情報)', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '村山産業', department: '商業(流通ビジネス)', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '東桜学館', department: '普通', quota: 200, applicantsConfirmed: 178, testTakersConfirmed: 178, finalPassers: 178 },
    { schoolName: '北村山', department: '総合', quota: 120, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '新庄志誠館', department: '普通', quota: 120, applicantsConfirmed: 95, testTakersConfirmed: 94, finalPassers: 94 },
    { schoolName: '新庄志誠館', department: '探究(理数探究,国際探究)', quota: 80, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '新庄志誠館最上校', department: '普通', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '新庄神室産業', department: '農業(食料生産)', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '新庄神室産業', department: '農業(農産活用)', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '新庄神室産業', department: '工業(機械電気)', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '新庄神室産業', department: '工業(環境デザイン)', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '新庄神室産業', department: '商業(ビジネス創造)', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '新庄神室産業金山校', department: '普通', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '新庄神室産業真室川校', department: '普通', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '米沢興譲館', department: '普通', quota: 120, applicantsConfirmed: 125, testTakersConfirmed: 125, finalPassers: 122 },
    { schoolName: '米沢興譲館', department: '探究(理数探究,国際探究)', quota: 80, applicantsConfirmed: 78, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '米沢東', department: '普通', quota: 160, applicantsConfirmed: 142, testTakersConfirmed: 142, finalPassers: 142 },
    { schoolName: '米沢鶴城', department: '工業(機械加工,機械制御)', quota: 80, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '米沢鶴城', department: '工業(電気情報)', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '米沢鶴城', department: '工業(建築,環境工学)', quota: 80, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 50 },
    { schoolName: '米沢鶴城', department: '商業(総合ビジネス,会計情報)', quota: 80, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 76 },
    { schoolName: '置賜農業', department: '農業(食料生産経営)', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '置賜農業', department: '農業(農業資源活用)', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '南陽', department: '普通', quota: 160, applicantsConfirmed: 95, testTakersConfirmed: 94, finalPassers: 94 },
    { schoolName: '高畠', department: '総合', quota: 80, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '長井', department: '普通(一般コース)', quota: 160, applicantsConfirmed: 91, testTakersConfirmed: 91, finalPassers: 97 },
    { schoolName: '長井', department: '普通(探究コース)', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40 },
    { schoolName: '長井工業', department: '機械', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '長井工業', department: '電子', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '長井工業', department: '福祉環境', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '荒砥', department: '総合', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '小国', department: '普通', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '致道館', department: '普通', quota: 200, applicantsConfirmed: 179, testTakersConfirmed: 179, finalPassers: 179 },
    { schoolName: '致道館', department: '理数', quota: 80, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 49 },
    { schoolName: '鶴岡工業', department: '機械', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 38 },
    { schoolName: '鶴岡工業', department: '電気電子', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 23 },
    { schoolName: '鶴岡工業', department: '情報通信', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '鶴岡工業', department: '建築', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '鶴岡工業', department: '環境化学', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 25 },
    { schoolName: '鶴岡中央', department: '普通', quota: 120, applicantsConfirmed: 105, testTakersConfirmed: 105, finalPassers: 105 },
    { schoolName: '鶴岡中央', department: '総合', quota: 120, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 112 },
    { schoolName: '加茂水産', department: '水産', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '庄内農業', department: '農業(食料生産)', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '庄内農業', department: '農業(食品科学)', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '庄内総合', department: '総合', quota: 80, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '酒田東', department: '普通', quota: 120, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '酒田東', department: '探究(理数探究,国際探究)', quota: 80, applicantsConfirmed: 75, testTakersConfirmed: 75, finalPassers: 75 },
    { schoolName: '酒田西', department: '普通', quota: 120, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 99 },
    { schoolName: '酒田光陵', department: '普通', quota: 80, applicantsConfirmed: 84, testTakersConfirmed: 84, finalPassers: 80 },
    { schoolName: '酒田光陵', department: '工業(機械制御)', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '酒田光陵', department: '工業(電気電子)', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 30 },
    { schoolName: '酒田光陵', department: '工業(環境技術)', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 36 },
    { schoolName: '酒田光陵', department: '商業(ビジネス流通)', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 36 },
    { schoolName: '酒田光陵', department: '商業(ビジネス会計)', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 23 },
    { schoolName: '酒田光陵', department: '情報', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '遊佐', department: '総合', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '山形市立商業', department: '商業(総合ビジネス)', quota: 160, applicantsConfirmed: 211, testTakersConfirmed: 211, finalPassers: 160 },
    { schoolName: '山形市立商業', department: '商業(情報)', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 41 },
    { schoolName: '山形市立商業', department: '商業(経済)', quota: 80, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 80 },
  ],
};
