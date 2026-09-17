// 鹿児島県: 「令和8年度鹿児島県公立高等学校入学者選抜方法案内」（鹿児島県教育委員会・令和7年12月
// 5日修正版）。他県の多くが持つ「学力検査:調査書の比重」表とは異なり、本資料は学校・学科別の
// 推薦入試定員（募集定員に対する上限%・自己推薦/学校推薦の別）・学区外からの一定枠（%・人数）・
// 学科併願可能学科（推薦入試/学力検査/第二次選抜それぞれで併願できる学科）・くくり募集の有無・
// 帰国生徒等特別選抜の実施有無を学校・学科ごとに一覧化した表形式で、県内公立高校全69校の全日制
// 課程を1つの資料に集約している（他県のような多年度・数百頁のPDF分割は無い）。
//
// 一次ソース: 鹿児島県公式ページ「令和8年度鹿児島県公立高等学校入学者選抜方法案内等について」
// (`pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r8/r8nyuusiannai.html`)からリンク
// される本体PDF(`pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r8/documents/
// 124253_20251205110312-1.pdf`・全6頁・2026-09-17 curl+pdftoppm(150dpi)でビジョン確認)。
//
// ★T-Y14が本来対象とする「学力検査:調査書の比重」「学力検査問題の種類」は、本資料のQ&A(頁5・
// Q8)で「傾斜配点を実施している場合がある」と言及されるのみで、学校別の具体的な比重・配点は
// 本資料に含まれない(各校の生徒募集要項に個別掲載と推測されるが今回は未確認)。そのため本DBでは
// 代わりに「推薦選抜の実施有無と選抜方法概要」（T-Y14タスクファイルの対象データ項目4）として、
// 学校・学科別の推薦入試定員枠・学区外一定枠・学科併願制度を収録する。ratioTypeフィールドは
// 使用しない(比重データが無いため)。interviewRequiredは全レコードでtrue(頁5 Q1「学力検査を
// 実施せず、中学校3年間の学習や活動状況、面接、作文等を総合して選抜する制度」という鹿児島県
// 推薦入試の一般的な制度説明に基づく。個別校の実施有無を確認したものではない)。
//
// ★今回は7学区(鹿児島/南薩/北薩/姶良・伊佐/大隅/熊毛/大島)のうち「鹿児島学区」「南薩学区」
// 「北薩学区」「姶良・伊佐学区」の47校105レコードのみ収録。残り3学区(大隅/熊毛/大島)は
// 未収録（coverageNote参照）。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KAGOSHIMA_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kagoshima',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '全7学区(鹿児島/南薩/北薩/姶良・伊佐/大隅/熊毛/大島)のうち「鹿児島学区」18校38レコード+「南薩学区」10校20レコード+「北薩学区」9校22レコード+「姶良・伊佐学区」10校25レコード=47校105レコードのみ収録。残り3学区(大隅/熊毛/大島)は未収録。また本資料は推薦入試・学区外枠・学科併願・くくり募集・帰国生徒等特別選抜のみを扱い、学力検査:調査書の比重(傾斜配点)は対象外',
  source: {
    url: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r8/documents/124253_20251205110312-1.pdf',
    docTitle: '令和8年度鹿児島県公立高等学校入学者選抜方法案内（令和7年12月5日修正版）',
    lastChecked: '2026-09-17',
  },
  schools: [
    { schoolName: '鶴丸', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員320人・推薦入試定員10%以内(学校推薦のみ)。学区外からの一定枠は募集定員の10%(32人)' },
    { schoolName: '甲南', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員320人・推薦入試定員10%以内(学校推薦のみ)。学区外からの一定枠は募集定員の10%(32人)' },
    { schoolName: '鹿児島中央', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員320人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(32人)' },
    { schoolName: '錦江湾', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員160人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(16人)' },
    { schoolName: '錦江湾', department: '理数', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦のみ)。普通科と学力検査・第二次選抜で相互に併願可能' },
    { schoolName: '武岡台', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員240人・推薦入試定員10%以内(自己推薦のみ)。学区外からの一定枠は募集定員の10%(24人)。学力検査は情報科学科、第二次選抜は普通科(同一学科内継続)と併願可能な構造' },
    { schoolName: '武岡台', department: '情報科学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦のみ)。学力検査は普通科と併願可能' },
    { schoolName: '開陽', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員15%以内(自己推薦・学校推薦とも実施)。学力検査は福祉科と併願可能' },
    { schoolName: '開陽', department: '福祉', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員15%以内(自己推薦・学校推薦とも実施)。学力検査は普通科と併願可能' },
    { schoolName: '明桜館', department: '文理科学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。推薦入試・学力検査・第二次選抜いずれも商業科と併願可能' },
    { schoolName: '明桜館', department: '商業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。推薦入試・学力検査・第二次選抜いずれも文理科学科と併願可能' },
    { schoolName: '松陽', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員240人・推薦入試定員30%以内(注*1: 体育/書道/英語コース計20%・それ以外の一般10%。自己推薦は体育/書道/英語コースのみ実施)。学区外からの一定枠は募集定員の10%(24人)。第二次選抜は普通科内、学力検査は音楽科又は美術科と併願可能' },
    { schoolName: '松陽', department: '音楽', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員65%以内(自己推薦・学校推薦とも実施)。学力検査は普通科と併願可能' },
    { schoolName: '松陽', department: '美術', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員65%以内(自己推薦・学校推薦とも実施)。学力検査は普通科と併願可能' },
    { schoolName: '鹿児島東', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外一定枠・学科併願・帰国生徒等特別選抜のいずれも実施なし(表中で唯一)' },
    { schoolName: '鹿児島工業', department: '工業Ⅰ類', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員240人・推薦入試定員30%以内(自己推薦のみ)。推薦入試・学力検査は工業Ⅱ類と併願可能、第二次選抜は工業Ⅱ類4系分と併願可能' },
    { schoolName: '鹿児島工業', department: '工業Ⅱ類', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員30%以内(自己推薦のみ)。推薦入試・学力検査は工業Ⅰ類と併願可能、第二次選抜は工業Ⅰ類3系分と併願可能' },
    { schoolName: '鹿児島南', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員160人・推薦入試定員10%以内(学校推薦のみ)。学区外からの一定枠は募集定員の10%(16人)' },
    { schoolName: '鹿児島南', department: '商業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員25%以内(学校推薦のみ)。第二次選抜は情報処理科と併願可能' },
    { schoolName: '鹿児島南', department: '情報処理', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員20%以内(学校推薦のみ)。第二次選抜は商業科と併願可能' },
    { schoolName: '鹿児島南', department: '体育', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員80%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '吹上', department: '電気', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査は電気/電子機械/情報処理の3学科間で第3志望まで併願可能' },
    { schoolName: '吹上', department: '電子機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査は電気/電子機械/情報処理の3学科間で第3志望まで併願可能' },
    { schoolName: '吹上', department: '情報処理', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査は電気/電子機械/情報処理の3学科間で第3志望まで併願可能' },
    { schoolName: '伊集院', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員240人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(24人)' },
    { schoolName: '市来農芸', department: '農業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。推薦入試は農業/畜産/環境園芸の3学科間で第2志望まで、学力検査・第二次選抜も第2志望まで併願可能' },
    { schoolName: '市来農芸', department: '畜産', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2志望まで併願可能' },
    { schoolName: '市来農芸', department: '環境園芸', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2志望まで併願可能' },
    { schoolName: '串木野', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内。自己推薦・学校推薦の実施有無は表中に○の記載なし(未実施の可能性)' },
    { schoolName: '鹿児島玉龍', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員240人(注*2: うち鹿児島玉龍中学校からの入学者120人以内を含む)・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(24人)' },
    { schoolName: '鹿児島商業', department: 'ビジネスクリエイト', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員40%以内(自己推薦・学校推薦とも実施)。ビジネスクリエイト/情報イノベーション/アスリートスポーツの3学科間で推薦入試・学力検査・第二次選抜とも第3志望まで併願可能' },
    { schoolName: '鹿児島商業', department: '情報イノベーション', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員40%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島商業', department: 'アスリートスポーツ', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員80%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島女子', department: 'ファイナンシャルビジネス', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員50%以内(自己推薦・学校推薦とも実施)。5学科間で推薦入試・学力検査・第二次選抜とも第3志望まで併願可能' },
    { schoolName: '鹿児島女子', department: 'ビジネスデザイン', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員50%以内(自己推薦・学校推薦とも実施)。5学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島女子', department: 'スポーツビジネス', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員80%以内(自己推薦・学校推薦とも実施)。5学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島女子', department: 'ファッション・フードクリエイト', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員50%以内(自己推薦・学校推薦とも実施)。5学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島女子', department: 'ライフ・スポーツ', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員60%以内(自己推薦・学校推薦とも実施)。5学科間で第3志望まで併願可能' },
    { schoolName: '指宿', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '山川', department: '園芸工学・農業経済', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '山川', department: '生活情報', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '頴娃', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学力検査・第二次選抜は機械電気科と併願可能' },
    { schoolName: '頴娃', department: '機械電気', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査・第二次選抜は普通科と併願可能' },
    { schoolName: '枕崎', department: '総合学科', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '鹿児島水産', department: '海洋', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員20%以内(自己推薦・学校推薦とも実施)。学力検査は海洋/情報通信/食品工学の3学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島水産', department: '情報通信', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員20%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '鹿児島水産', department: '食品工学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員20%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '加世田', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '加世田常潤', department: '食農プロデュース', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ実施と表内で確認)。学力検査・第二次選抜は生活福祉科と併願可能' },
    { schoolName: '加世田常潤', department: '生活福祉', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦の別を示す○の記載が表内で判読困難だったため未記載・Y-0に基づき推測で埋めない)。学力検査・第二次選抜は食農プロデュース科と併願可能' },
    { schoolName: '川辺', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '薩南工業', department: '機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査は機械/建築/情報技術/生活科学の4学科間で第4志望まで併願可能(4学科間併願・志望数4は鹿児島学区・南薩学区の範囲内では最大)' },
    { schoolName: '薩南工業', department: '建築', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第4志望まで併願可能' },
    { schoolName: '薩南工業', department: '情報技術', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第4志望まで併願可能' },
    { schoolName: '薩南工業', department: '生活科学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第4志望まで併願可能' },
    { schoolName: '指宿商業', department: '商業マネジメント', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で学力検査を第3志望まで併願可能' },
    { schoolName: '指宿商業', department: '会計マネジメント', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '指宿商業', department: '情報マネジメント', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '川内', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員280人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(28人)' },
    { schoolName: '川内商工', department: '機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査は機械/電気/インテリア/商業の4学科間で第3志望まで併願可能' },
    { schoolName: '川内商工', department: '電気', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第3志望まで併願可能' },
    { schoolName: '川内商工', department: 'インテリア', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第3志望まで併願可能' },
    { schoolName: '川内商工', department: '商業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。4学科間で第3志望まで併願可能' },
    { schoolName: '川薩清修館', department: 'ビジネス会計', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査・第二次選抜は総合学科と併願可能' },
    { schoolName: '川薩清修館', department: '総合学科', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦のみ)。学力検査・第二次選抜はビジネス会計科と併願可能' },
    { schoolName: '薩摩中央', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員10%以内(学校推薦のみ)。学区外からの一定枠は募集定員の10%(4人)。学力検査は普通/生物生産/農業工学の3学科間で第2志望まで併願可能' },
    { schoolName: '薩摩中央', department: '生物生産', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2志望まで併願可能' },
    { schoolName: '薩摩中央', department: '農業工学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2志望まで併願可能' },
    { schoolName: '薩摩中央', department: '福祉', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学科併願は表内に記載なし' },
    { schoolName: '鶴翔', department: '農業科学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(学校推薦のみ)。学力検査は農業科学/食品技術/総合学科の3学科間で第3志望まで併願可能' },
    { schoolName: '鶴翔', department: '食品技術', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(学校推薦のみ)。3学科間で第3志望まで併願可能' },
    { schoolName: '鶴翔', department: '総合学科', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(学校推薦のみ)。3学科間で第3志望まで併願可能' },
    { schoolName: '野田女子', department: '食物', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査は生活文化科と併願可能' },
    { schoolName: '野田女子', department: '生活文化', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査は食物科と併願可能' },
    { schoolName: '野田女子', department: '衛生看護', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '出水', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '出水工業', department: '機械電気', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '出水工業', department: '建築', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '出水商業', department: '商業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。推薦入試・学力検査・第二次選抜いずれも情報処理科と併願可能' },
    { schoolName: '出水商業', department: '情報処理', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。推薦入試・学力検査・第二次選抜いずれも商業科と併願可能' },
    { schoolName: '大口', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)' },
    { schoolName: '伊佐農林', department: '農林技術', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(学校推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '伊佐農林', department: '生活情報', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(学校推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '霧島', department: '機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査・第二次選抜とも総合学科と併願可能' },
    { schoolName: '霧島', department: '総合学科', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査・第二次選抜とも機械科と併願可能' },
    { schoolName: '蒲生', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員10%以内(自己推薦のみ)。学力検査・第二次選抜とも情報処理科と併願可能' },
    { schoolName: '蒲生', department: '情報処理', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学力検査・第二次選抜とも普通科と併願可能' },
    { schoolName: '加治木', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員320人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(32人)' },
    { schoolName: '加治木工業', department: '機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦のみ)。機械/電気/電子/工業化学/建築/土木の6学科間で推薦入試・学力検査とも第3志望まで、第二次選抜は「全学科」で併願可能(表中最大規模の併願範囲)' },
    { schoolName: '加治木工業', department: '電気', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。6学科間で併願可能(詳細は機械科の記載を参照)' },
    { schoolName: '加治木工業', department: '電子', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。6学科間で併願可能(詳細は機械科の記載を参照)' },
    { schoolName: '加治木工業', department: '工業化学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。6学科間で併願可能(詳細は機械科の記載を参照)' },
    { schoolName: '加治木工業', department: '建築', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。6学科間で併願可能(詳細は機械科の記載を参照)' },
    { schoolName: '加治木工業', department: '土木', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。6学科間で併願可能(詳細は機械科の記載を参照)' },
    { schoolName: '隼人工業', department: 'インテリア', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査はインテリア/電子機械/情報技術の3学科間で第3志望まで併願可能' },
    { schoolName: '隼人工業', department: '電子機械', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '隼人工業', department: '情報技術', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第3志望まで併願可能' },
    { schoolName: '国分', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員280人・推薦入試定員10%以内(自己推薦・学校推薦とも実施)。学区外からの一定枠は募集定員の10%(28人)。学力検査・第二次選抜とも理数科と併願可能' },
    { schoolName: '国分', department: '理数', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。学力検査・第二次選抜とも普通科と併願可能' },
    { schoolName: '福山', department: '普通', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員10%以内(自己推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '福山', department: '商業', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦のみ)。学科併願は表内に記載なし' },
    { schoolName: '国分中央', department: '園芸工学', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。園芸工学/生活文化/ビジネス情報の3学科間で学力検査・第二次選抜とも第2希望まで併願可能' },
    { schoolName: '国分中央', department: '生活文化', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員80人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2希望まで併願可能' },
    { schoolName: '国分中央', department: 'ビジネス情報', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員120人・推薦入試定員30%以内(自己推薦・学校推薦とも実施)。3学科間で第2希望まで併願可能' },
    { schoolName: '国分中央', department: 'スポーツ健康', selectionCategory: '推薦入試', interviewRequired: true, note: '募集定員40人・推薦入試定員60%以内(自己推薦のみ)。学力検査・第二次選抜とも園芸工学科/生活文化科又はビジネス情報科のいずれか1学科と併願可能(志望順位の指定なし)' },
  ],
};
