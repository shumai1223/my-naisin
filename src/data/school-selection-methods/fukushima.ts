// 福島県: 「令和８年度福島県立高等学校入学者選抜における各高等学校の選抜方法一覧
// （令和７年１１月作成）」（福島県教育委員会）。学校ごとに1〜数頁の構成で、
// アドミッション・ポリシー（narrative）に続き【前期選抜】特色選抜・一般選抜・
// 【後期選抜】の3区分（連携型選抜・外国人生徒等に係る特別枠選抜を実施する学校は
// 別途その区分も掲載）が表形式で記載されている。
//
// 一次ソース: 福島県教育委員会公式ページ
// (`www.pref.fukushima.lg.jp/site/edu/r8koukounyushi.html`)からリンクされる
// 一括PDF(`www.pref.fukushima.lg.jp/uploaded/attachment/714999.pdf`・全192頁)。
// ★注意: WebFetchの要約は初回`fukushima.fcs.ed.jp`（福島市立学校ポータル＝別組織）
// という誤ったドメインを提示した。生HTML(`curl`)でページ内の実際のリンクを確認し、
// 正しいドメイン(`www.pref.fukushima.lg.jp`)であることを裏取り済み
// ([[fable5-loop-protocol]]の類似組織混同パターンと同型)。
// テキスト埋め込み型PDF(pdftotext -layoutで正確に抽出可能・OCR不要)。
//
// 全192頁のうち頁1-2(福島・普通科)・頁3-4(橘・普通科)の2校6レコードのみ収録。
// 連携型選抜実施校(修明/南会津/ふたば未来学園/相馬総合)・外国人生徒等に係る
// 特別枠選抜実施校(福島北/福島南/あさか開成/光南/会津学鳳/いわき総合/相馬総合)の
// リストに両校とも含まれないため、この2校は前期(特色選抜・一般選抜)+後期選抜の
// 3区分のみで完結する。残り約90校は今後の拡充対象(coverageNote参照)。
//
// ratioTypeの運用: 特色選抜・一般選抜は「学力検査○点:調査書○点(内訳)」、後期選抜は
// 「調査書○点:面接○点/評価方法:小論文○点」の形でコロン区切り転記する。一般選抜の
// 「学力検査と調査書の成績の比重」欄が「同等」「学力検査の成績を3倍する」等の記述式の
// 場合はそのままratioTypeへ転記する。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const FUKUSHIMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'fukushima',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '全192頁(1校1〜3頁)のうち頁1-2(福島・普通科)・頁3-4(橘・普通科)の2校6レコード(前期選抜の特色選抜・一般選抜+後期選抜の3区分)のみ収録。両校とも連携型選抜・外国人生徒等に係る特別枠選抜の実施校リストに含まれないため対象外。残り約90校は今後の拡充対象',
  source: {
    url: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/714999.pdf',
    docTitle: '令和８年度福島県立高等学校入学者選抜における各高等学校の選抜方法一覧（令和７年１１月作成）',
    lastChecked: '2026-09-18',
  },
  schools: [
    {
      schoolName: '福島',
      department: '普通科',
      selectionCategory: '特色選抜',
      interviewRequired: true,
      ratioType: '学力検査250点:調査書250点(うち音楽・美術・保健体育・技術家庭の4教科を2倍傾斜配点した195点+特別活動等・長所特技等55点)',
      note: '募集定員枠5%程度。学力検査は5教科・傾斜配点なしで満点250点。特色選抜志願理由書は本人が志望動機・抱負・部活動実績等を記入(点数化の記載なし)。特色面接は個人面接で段階評価。特色検査は実施しない。選抜資料の満点は全体500点',
    },
    {
      schoolName: '福島',
      department: '普通科',
      selectionCategory: '一般選抜',
      interviewRequired: false,
      ratioType: '学力検査と調査書の成績の比重=同等',
      note: '募集定員280人。学力検査は5教科・傾斜配点なしで満点250点。調査書は195点+特別活動等・長所特技等55点で合計250点満点。一般面接は実施しない',
    },
    {
      schoolName: '福島',
      department: '普通科',
      selectionCategory: '後期選抜',
      interviewRequired: true,
      ratioType: '調査書190点:面接30点:小論文120点',
      note: '調査書は各教科の学習の記録135点+特別活動等・長所特技等55点で合計190点満点。面接は個人面接(数学に関する学習活動の成果を問う内容を含む)で30点満点に点数化。小論文はある資料を読み設問に対する意見等をまとめる形式で120点満点',
    },
    {
      schoolName: '橘',
      department: '普通科',
      selectionCategory: '特色選抜',
      interviewRequired: true,
      ratioType: '学力検査250点:調査書250点(うち各教科の学習の記録135点+特別活動等・長所特技等115点)',
      note: '募集定員枠5%程度。学力検査は5教科・各教科50点満点で合計250点(傾斜配点なし)。特色選抜志願理由書は本人が志望動機・抱負・部活動実績等を記入。特色面接は個人面接で段階評価(入学目的・学ぶ意欲・表現力をみる)。特色検査は実施しない。選抜資料の満点は全体500点',
    },
    {
      schoolName: '橘',
      department: '普通科',
      selectionCategory: '一般選抜',
      interviewRequired: false,
      ratioType: '学力検査の成績を3倍する',
      note: '募集定員280人。学力検査は5教科・各教科50点満点で合計250点(傾斜配点なし)。調査書は195点満点で、特別活動等・長所特技等・部活動等の実績は点数化しないが内容を精査する。一般面接は実施しない',
    },
    {
      schoolName: '橘',
      department: '普通科',
      selectionCategory: '後期選抜',
      interviewRequired: true,
      ratioType: '調査書160点:面接(段階評価):小論文40点',
      note: '調査書は各教科の学習の記録135点+特別活動等・長所特技等25点で合計160点満点。面接は個人面接(国語・社会・数学・理科・外国語の学習活動の成果を問う内容を含む)で段階評価。小論文は課題文を読み設問に答える形式で40点満点',
    },
  ],
};
