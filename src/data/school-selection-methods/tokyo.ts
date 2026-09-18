// 東京都: 「令和８年度都立高等学校入学者選抜実施要綱」添付別表「１ 都立高等学校・
// 全日制課程（１）普通教育を主とする学科」（東京都教育委員会・2025年9月25日公表）。
// 学校ごとに「推薦に基づく選抜」「第一次募集」「第二次募集」の3区分が横並びの
// 列で構成される表形式。
//
// 一次ソース: 東京都教育委員会公式ページ
// (`www.kyoiku.metro.tokyo.lg.jp/information/press/2025/09/2025092502`)から
// リンクされるPDF(`www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/20250925_n2_10`・
// 「普通教育を主とする学科」・全7頁)。テキスト埋め込み型PDFだが列が極めて密な
// マトリクス表のため、pdftotext -layoutの結果だけでは列の対応関係が確定できず、
// pdftoppm(200dpi)で頁1を画像化しPythonでcrop()して拡大確認してから転記した
// ([[fable5-loop-protocol]]の密なマトリクス表の罠を踏まえた対応)。
//
// 全7頁のうち頁1(普通教育を主とする学科の一部・日比谷/三田/戸山/竹早の4校)12
// レコードのみ収録。頁1の残り学校・頁2-7(コース・エンカレッジスクール・進学重視型
// 単位制・単位制/専門教育を主とする学科・総合学科/海外帰国生徒等対象/定時制課程・
// 通信制課程)は今後の拡充対象(coverageNote参照)。文化・スポーツ等特別推薦・理数等
// 特別推薦は別資料(n2_16/n2_17)でこの資料の対象外。
//
// selectionCategoryは「推薦に基づく選抜」「第一次募集」「第二次募集」の3区分。
// ratioTypeの運用: 推薦は「推薦枠割合○%」、第一次・第二次募集は「学力検査○:調査書○
// (○点:○点)」+該当すればESAT-J加点を転記する。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const TOKYO_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'tokyo',
  fiscalYear: '令和8年度（2026年度）',
  status: 'structured',
  coverageNote:
    '全7頁のうち頁1(普通教育を主とする学科の一部・日比谷/三田/戸山/竹早の4校)12レコード(推薦に基づく選抜+第一次募集+第二次募集の3区分)のみ収録。頁1の残り学校・頁2-7(コース等/専門学科・総合学科/海外帰国生徒等対象/定時制・通信制)は今後の拡充対象。文化・スポーツ等特別推薦・理数等特別推薦は別資料でこの資料の対象外',
  source: {
    url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/20250925_n2_10',
    docTitle: '令和８年度都立高等学校入学者選抜実施要綱 別表１(１)普通教育を主とする学科',
    lastChecked: '2026-09-18',
  },
  schools: [
    {
      schoolName: '日比谷',
      department: '普通科',
      selectionCategory: '推薦に基づく選抜',
      interviewRequired: true,
      ratioType: '推薦枠割合20%',
      note: '文化・スポーツ等特別推薦の実施なし。調査書の観点別学習状況の評価は活用せず評定のみ活用。満点は調査書450点+個人面接200点+小論文250点(集団討論・実技検査・学校設定検査の実施なし)',
    },
    {
      schoolName: '日比谷',
      department: '普通科',
      selectionCategory: '第一次募集',
      interviewRequired: false,
      ratioType: '学力検査7:調査書3(700点:300点)+ESAT-J20点',
      note: '学力検査は国数英社理の5教科(国数英は自校作成問題)。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '日比谷',
      department: '普通科',
      selectionCategory: '第二次募集',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4(600点:400点)',
      note: '学力検査は国数英の3教科。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '三田',
      department: '普通科',
      selectionCategory: '推薦に基づく選抜',
      interviewRequired: true,
      ratioType: '推薦枠割合20%',
      note: '文化・スポーツ等特別推薦の実施なし。調査書の観点別学習状況の評価は活用せず評定のみ活用。満点は調査書100点+個人面接250点+小論文250点(日比谷と異なり個人面接の配点が調査書を上回る)。集団討論・実技検査・学校設定検査の実施なし',
    },
    {
      schoolName: '三田',
      department: '普通科',
      selectionCategory: '第一次募集',
      interviewRequired: false,
      ratioType: '学力検査7:調査書3(700点:300点)+ESAT-J20点',
      note: '学力検査は国数英社理の5教科。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '三田',
      department: '普通科',
      selectionCategory: '第二次募集',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4(600点:400点)',
      note: '学力検査は国数英の3教科。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '戸山',
      department: '普通科',
      selectionCategory: '推薦に基づく選抜',
      interviewRequired: true,
      ratioType: '推薦枠割合20%',
      note: '文化・スポーツ等特別推薦の実施なし。調査書の観点別学習状況の評価は活用せず評定のみ活用。満点は調査書450点+個人面接150点+小論文300点(異なる分野の課題を2題出題する点が他校と異なる)。集団討論・実技検査・学校設定検査の実施なし',
    },
    {
      schoolName: '戸山',
      department: '普通科',
      selectionCategory: '第一次募集',
      interviewRequired: false,
      ratioType: '学力検査7:調査書3(700点:300点)+ESAT-J20点',
      note: '学力検査は国数英社理の5教科(国数英は自校作成問題・日比谷と同型)。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '戸山',
      department: '普通科',
      selectionCategory: '第二次募集',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4(600点:400点)',
      note: '学力検査は国数英の3教科。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '竹早',
      department: '普通科',
      selectionCategory: '推薦に基づく選抜',
      interviewRequired: false,
      ratioType: '推薦枠割合20%',
      note: '文化・スポーツ等特別推薦の実施なし。調査書の観点別学習状況の評価は活用せず評定のみ活用。満点は調査書500点+小論文250点のみ(個人面接・集団討論・実技検査・学校設定検査はいずれも実施なし。日比谷等の面接実施校と異なるパターン)',
    },
    {
      schoolName: '竹早',
      department: '普通科',
      selectionCategory: '第一次募集',
      interviewRequired: false,
      ratioType: '学力検査7:調査書3(700点:300点)+ESAT-J20点',
      note: '学力検査は国数英社理の5教科。学力検査を実施する教科の評定は1倍・実施しない教科(社理)の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
    {
      schoolName: '竹早',
      department: '普通科',
      selectionCategory: '第二次募集',
      interviewRequired: false,
      ratioType: '学力検査6:調査書4(600点:400点)',
      note: '学力検査は国数英の3教科。学力検査を実施する教科の評定は1倍・実施しない教科の評定は2倍に換算。面接・小論文・実技検査の実施なし',
    },
  ],
};
