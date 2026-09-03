/**
 * 兵庫県 公立高等学校 入学者選抜日程（T-Y12・9県目）。
 *
 * 一次ソース: 兵庫県教育委員会「令和9年度兵庫県公立高等学校入学者選抜の日程及び
 * 県立芦屋国際中等教育学校入学者選考の日程」
 * https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2026/01/R9-senbatsunittei.pdf
 * （掲載元ページ: https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/2026）
 *
 * ⚠️kanagawa/hokkaidoと同様、令和8年度分のページは既に「志願状況報告」等の集計速報に
 * 置き換わっており、確定日程としての一次公表は令和9年度（2027年度）分になっていた
 * （2026-09-04時点でWebFetch確認）。よって本県も令和9年度分から収録する。
 * PDFは1ページのみでToUnicode欠落があったがビジョン解析で全文読み取り可能だった。
 *
 * 学力検査（3/11）・合格発表（3/18）はWebSearchで独立した二次情報源（リセマム等）と
 * 突合し完全一致を確認済み（2026-09-04）。
 *
 * 兵庫県は「推薦入学・特色選抜・連携型入学者選抜・外国人生徒にかかわる特別枠選抜・多部制2月選抜」
 * （適性検査・面接等）と「学力検査」（3月選抜）の2トラックに分かれる。他の選抜区分
 * （多部制3月選抜A・通信制課程・定時制再募集・県立芦屋国際中等教育学校）は対象生徒数が
 * 少なくスコープ外とし、主要な2トラックのみ収録する。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const HYOGO_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'hyogo',
  years: [
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2026/01/R9-senbatsunittei.pdf',
      docTitle: '令和9年度兵庫県公立高等学校入学者選抜の日程及び県立芦屋国際中等教育学校入学者選考の日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '推薦入学・特色選抜等 適性検査，面接等', startDate: '2027-02-16', endDate: '2027-02-17', note: '2/17は一部の学校のみ実施' },
        { label: '推薦入学・特色選抜等 合否結果発表', startDate: '2027-02-22' },
        { label: '学力検査', startDate: '2027-03-11' },
        { label: '学力検査 合否結果発表', startDate: '2027-03-18' },
      ],
    },
  ],
};
