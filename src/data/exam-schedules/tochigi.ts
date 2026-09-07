/**
 * 栃木県 公立高等学校 入学者選抜日程（T-Y12・25県目）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度栃木県立高等学校入学者選抜関係諸日程」
 * （日程一覧版PDF・1頁）
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/r08shonittei.pdf
 *
 * このPDFはpdftotextではToUnicode欠落で数字しか抽出できなかったが、ビジョン解析（フォント
 * 欠落エラーが出たものの本文自体は正常にレンダリングされた）で全項目を一次ソースから直接
 * 確認できた。全日制課程（特色選抜・一般選抜）のみを収録し、定時制課程（フレックス特別選抜・
 * 一般選抜）・通信制課程は別トラックのため対象外。
 *
 * 一般選抜の学力検査(3/5)・合格者発表(3/11)はWebSearchで得た独立した二次情報源（学習塾サイト）
 * と完全一致を確認済み（2026-09-04）。
 *
 * ⚠️令和9年度分（T-Y11F §5順序#2）: R9で選抜制度が変更されている。R8は「特色選抜」
 * 「一般選抜」が出願期間から別トラックの独立した選抜だったが、R9は「1 全日制課程及び
 * 定時制課程」という単一の日程表に統合され、出願期間・出願変更期間・受検票交付期間・
 * 本検査（学力検査＋学校独自検査等）・追検査・合格者発表・再募集を全課程共通の日程で
 * 実施する（学校独自検査等の内訳＝特色選抜志願者は学校独自検査、定時制一般選抜志願者は
 * 面接等、を備考欄で区別するのみで日程自体は共通）。一次ソース:
 * 「令和9(2027)年度栃木県立高等学校入学者選抜関係諸日程」
 * https://www.pref.tochigi.lg.jp/m04/r09/documents/20260310102013.pdf
 * このPDFもR8と同型のToUnicode欠落があり、pdftoppm 200dpi+Read toolのビジョン解析で
 * p1（全日制・定時制共通日程）を直接転記した。p2は通信制課程の日程でありR8の対象外
 * 方針を踏襲し収録しない。
 */
import type { PrefectureExamScheduleFile } from '@/lib/exam-schedule';

export const TOCHIGI_EXAM_SCHEDULE: PrefectureExamScheduleFile = {
  prefectureCode: 'tochigi',
  years: [
    {
      fiscalYear: '令和8年度（2026年度）',
      sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r08shonittei.pdf',
      docTitle: '令和8（2026）年度栃木県立高等学校入学者選抜関係諸日程',
      fetchedAt: '2026-09-04',
      events: [
        { label: '特色選抜 願書等提出期間', startDate: '2026-01-29', endDate: '2026-01-30' },
        { label: '特色選抜 面接等', startDate: '2026-02-05', endDate: '2026-02-06', note: '一日で行う学校は2/5に実施' },
        { label: '特色選抜 合格者内定', startDate: '2026-02-12' },
        { label: '一般選抜 願書等提出期間', startDate: '2026-02-18', endDate: '2026-02-19' },
        { label: '一般選抜 出願変更期間', startDate: '2026-02-24', endDate: '2026-02-25' },
        { label: '一般選抜 受検票交付期間', startDate: '2026-02-26', endDate: '2026-02-27' },
        { label: '一般選抜 学力検査', startDate: '2026-03-05' },
        { label: '一般選抜 合格者発表', startDate: '2026-03-11' },
      ],
    },
    {
      fiscalYear: '令和9年度（2027年度）',
      sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r09/documents/20260310102013.pdf',
      docTitle: '令和9(2027)年度栃木県立高等学校入学者選抜関係諸日程',
      fetchedAt: '2026-09-08',
      events: [
        { label: '出願期間', startDate: '2027-01-29', endDate: '2027-02-08' },
        { label: '出願変更期間', startDate: '2027-02-10', endDate: '2027-02-12', note: '2/10と2/12の2日間（2/11は含まない）' },
        { label: '受検票交付期間', startDate: '2027-02-19', endDate: '2027-02-23' },
        { label: '本検査 学力検査', startDate: '2027-02-24' },
        { label: '本検査 学校独自検査等', startDate: '2027-02-25', endDate: '2027-02-26', note: '特色選抜を一日で行う学校は2/25のみ実施' },
        { label: '追検査 学力検査', startDate: '2027-03-08' },
        { label: '追検査 学校独自検査等', startDate: '2027-03-09' },
        { label: '合格者発表', startDate: '2027-03-12' },
        { label: '再募集 出願期間', startDate: '2027-03-12', endDate: '2027-03-15' },
        { label: '再募集 面接及び作文', startDate: '2027-03-17' },
        { label: '再募集 合格者発表', startDate: '2027-03-18' },
      ],
    },
  ],
};
