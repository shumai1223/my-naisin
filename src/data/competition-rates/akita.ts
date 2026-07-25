/**
 * 秋田県 公立高等学校 倍率パイプラインα（Y-6・31県目・全日制完全達成）。
 *
 * 一次ソース: 秋田県教育委員会「令和8年度秋田県公立高等学校入学者選抜１次募集 志願者数
 * （志願先変更後）」（公－２・令和8年2月12日発表・全2ページ）。
 *
 * 列は[募集定員（＝本ファイルのquota）/ 特色選抜募集人員 / 一般選抜募集人員 / 志願者数（特色選抜・
 * 一般選抜（併願を除く）・総志願者）/ 志願倍率（特色選抜・総志願者）/ 昨年度最終志願倍率]。秋田県は
 * 特色選抜と一般選抜が同一の募集定員を共有し、総志願者（＝特色選抜＋一般選抜（併願を除く）。＝
 * applicants）に対する志願倍率（総志願者列。＝finalRate）を採用した（印字済み値をそのまま転記）。
 * 注1「一般選抜志願者数は特色選抜を併願している者を除いた人数」・注2「総志願者数は特色選抜志願者数
 * と一般選抜（併願を除く）志願者数の計」との整合を確認済み。
 *
 * ⚠️大曲農業の太田分校・湯沢翔北の雄勝校は独立した学校番号を持たない分校のため、schoolNameに
 * 「(太田分校)」「(雄勝校)」を付記して親学校と区別できるようにした。
 *
 * 機械集計（quota6,268・applicants5,237、43校（分校2件を含む実質44エントリ）78レコード）が
 * 「県合計」行（募集定員6,268・総志願者5,237・志願倍率0.84）と初回転記で完全一致した（再修正なし）。
 * 定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const AKITA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'akita',
  sources: [
    {
      url: 'https://www.pref.akita.lg.jp/uploads/public/archive_0000093860_00/20260212_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86%E3%80%80%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%88%E5%BF%97%E9%A1%98%E5%85%88%E5%A4%89%E6%9B%B4%E5%BE%8C%EF%BC%89%EF%BC%88%E5%85%AC%E2%80%95%EF%BC%92%EF%BC%89.pdf',
      docTitle: '秋田県教育委員会 令和8年度秋田県公立高等学校入学者選抜１次募集 志願者数（志願先変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（43校78レコード。分校2件=大曲農業太田分校・湯沢翔北雄勝校を含む）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「県合計」行（募集定員6,268・総志願者5,237・志願倍率0.84）と機械集計が完全一致した（初回転記で一致・再修正なし）。',
  },
  officialSubtotals: [{ label: '県合計', schoolCount: 44, quota: 6268, finalApplicants: 5237, finalRate: 0.84 }],
  records: [
    { schoolName: '鹿角', department: '普通科', quota: 175, finalApplicants: 148, finalRate: 0.85 },
    { schoolName: '鹿角', department: '産業工学科', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '大館鳳鳴', department: '普通・理数科', quota: 210, finalApplicants: 174, finalRate: 0.83 },
    { schoolName: '大館桂桜', department: '普通・生活科学科', quota: 75, finalApplicants: 77, finalRate: 1.03 },
    { schoolName: '大館桂桜', department: '機械科', quota: 35, finalApplicants: 23, finalRate: 0.66 },
    { schoolName: '大館桂桜', department: '電気科', quota: 35, finalApplicants: 19, finalRate: 0.54 },
    { schoolName: '大館桂桜', department: '土木・建築科', quota: 35, finalApplicants: 28, finalRate: 0.8 },
    { schoolName: '大館国際情報学院', department: '普通科', quota: 49, finalApplicants: 54, finalRate: 1.1 },
    { schoolName: '大館国際情報学院', department: '国際情報科', quota: 53, finalApplicants: 40, finalRate: 0.75 },
    { schoolName: '秋田北鷹', department: '普通科', quota: 120, finalApplicants: 76, finalRate: 0.63 },
    { schoolName: '秋田北鷹', department: '生物資源科', quota: 35, finalApplicants: 32, finalRate: 0.91 },
    { schoolName: '秋田北鷹', department: '緑地環境科', quota: 35, finalApplicants: 24, finalRate: 0.69 },
    { schoolName: '能代', department: '普通・理数科', quota: 195, finalApplicants: 139, finalRate: 0.71 },
    { schoolName: '能代松陽', department: '普通・国際コミュニケーション科', quota: 115, finalApplicants: 114, finalRate: 0.99 },
    { schoolName: '能代松陽', department: '情報ビジネス科', quota: 70, finalApplicants: 58, finalRate: 0.83 },
    { schoolName: '能代科学技術', department: '機械・電気・建設科', quota: 105, finalApplicants: 44, finalRate: 0.42 },
    { schoolName: '能代科学技術', department: '生物資源・生活福祉科', quota: 70, finalApplicants: 34, finalRate: 0.49 },
    { schoolName: '五城目', department: '普通科', quota: 80, finalApplicants: 15, finalRate: 0.19 },
    { schoolName: '男鹿海洋', department: '海洋科', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '男鹿海洋', department: '食品科学科', quota: 35, finalApplicants: 14, finalRate: 0.4 },
    { schoolName: '男鹿工業', department: '機械科', quota: 35, finalApplicants: 30, finalRate: 0.86 },
    { schoolName: '男鹿工業', department: '電気電子科', quota: 35, finalApplicants: 16, finalRate: 0.46 },
    { schoolName: '秋田西', department: '普通科', quota: 160, finalApplicants: 144, finalRate: 0.9 },
    { schoolName: '金足農業', department: '生物資源科', quota: 35, finalApplicants: 45, finalRate: 1.29 },
    { schoolName: '金足農業', department: '環境土木科', quota: 35, finalApplicants: 37, finalRate: 1.06 },
    { schoolName: '金足農業', department: '食品流通科', quota: 35, finalApplicants: 40, finalRate: 1.14 },
    { schoolName: '金足農業', department: '造園緑地科', quota: 35, finalApplicants: 40, finalRate: 1.14 },
    { schoolName: '金足農業', department: '生活科学科', quota: 35, finalApplicants: 41, finalRate: 1.17 },
    { schoolName: '秋田', department: '普通・理数科', quota: 263, finalApplicants: 280, finalRate: 1.06 },
    { schoolName: '秋田北', department: '普通科', quota: 210, finalApplicants: 226, finalRate: 1.08 },
    { schoolName: '秋田南', department: '普通科', quota: 133, finalApplicants: 168, finalRate: 1.26 },
    { schoolName: '秋田中央', department: '普通科', quota: 210, finalApplicants: 244, finalRate: 1.16 },
    { schoolName: '新屋', department: '普通科', quota: 160, finalApplicants: 185, finalRate: 1.16 },
    { schoolName: '秋田工業', department: '機械科', quota: 70, finalApplicants: 70, finalRate: 1.0 },
    { schoolName: '秋田工業', department: '電気エネルギー科', quota: 35, finalApplicants: 32, finalRate: 0.91 },
    { schoolName: '秋田工業', department: '土木科', quota: 35, finalApplicants: 39, finalRate: 1.11 },
    { schoolName: '秋田工業', department: '建築科', quota: 35, finalApplicants: 42, finalRate: 1.2 },
    { schoolName: '秋田工業', department: '工業化学科', quota: 35, finalApplicants: 39, finalRate: 1.11 },
    { schoolName: '秋田商業', department: '商業科', quota: 210, finalApplicants: 230, finalRate: 1.1 },
    { schoolName: '御所野学院', department: '普通科', quota: 56, finalApplicants: 39, finalRate: 0.7 },
    { schoolName: '本荘', department: '普通科', quota: 200, finalApplicants: 178, finalRate: 0.89 },
    { schoolName: '由利', department: '普通・理数・国際科', quota: 150, finalApplicants: 152, finalRate: 1.01 },
    { schoolName: '由利工業', department: '機械科', quota: 35, finalApplicants: 30, finalRate: 0.86 },
    { schoolName: '由利工業', department: '電気科', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '由利工業', department: '環境システム科', quota: 35, finalApplicants: 23, finalRate: 0.66 },
    { schoolName: '由利工業', department: '建築科', quota: 35, finalApplicants: 32, finalRate: 0.91 },
    { schoolName: '矢島', department: '普通科', quota: 60, finalApplicants: 13, finalRate: 0.22 },
    { schoolName: '西目', department: '総合学科', quota: 120, finalApplicants: 71, finalRate: 0.59 },
    { schoolName: '仁賀保', department: '普通科', quota: 70, finalApplicants: 11, finalRate: 0.16 },
    { schoolName: '仁賀保', department: '情報メディア科', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '西仙北', department: '普通科', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '大曲農業', department: '農業科学科', quota: 70, finalApplicants: 71, finalRate: 1.01 },
    { schoolName: '大曲農業', department: '食品科学科', quota: 35, finalApplicants: 37, finalRate: 1.06 },
    { schoolName: '大曲農業', department: '園芸科学科', quota: 35, finalApplicants: 17, finalRate: 0.49 },
    { schoolName: '大曲農業', department: '生活科学科', quota: 35, finalApplicants: 23, finalRate: 0.66 },
    { schoolName: '大曲農業(太田分校)', department: '普通科', quota: 35, finalApplicants: 6, finalRate: 0.17 },
    { schoolName: '大曲', department: '普通科', quota: 160, finalApplicants: 189, finalRate: 1.18 },
    { schoolName: '大曲', department: '商業科', quota: 35, finalApplicants: 44, finalRate: 1.26 },
    { schoolName: '大曲工業', department: '機械科', quota: 35, finalApplicants: 28, finalRate: 0.8 },
    { schoolName: '大曲工業', department: '電気科', quota: 70, finalApplicants: 58, finalRate: 0.83 },
    { schoolName: '大曲工業', department: '土木・建築科', quota: 35, finalApplicants: 36, finalRate: 1.03 },
    { schoolName: '角館', department: '普通科', quota: 200, finalApplicants: 117, finalRate: 0.59 },
    { schoolName: '六郷', department: '普通・福祉科', quota: 75, finalApplicants: 28, finalRate: 0.37 },
    { schoolName: '横手', department: '普通・理数科', quota: 210, finalApplicants: 218, finalRate: 1.04 },
    { schoolName: '横手城南', department: '普通科', quota: 140, finalApplicants: 128, finalRate: 0.91 },
    { schoolName: '横手清陵学院', department: '普通科', quota: 57, finalApplicants: 43, finalRate: 0.75 },
    { schoolName: '横手清陵学院', department: '総合技術科', quota: 57, finalApplicants: 41, finalRate: 0.72 },
    { schoolName: '平成', department: '普通科', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '平成', department: '総合ビジネス科', quota: 35, finalApplicants: 29, finalRate: 0.83 },
    { schoolName: '雄物川', department: '普通科', quota: 70, finalApplicants: 16, finalRate: 0.23 },
    { schoolName: '増田', department: '総合学科', quota: 70, finalApplicants: 42, finalRate: 0.6 },
    { schoolName: '増田', department: '農業科学科', quota: 35, finalApplicants: 16, finalRate: 0.46 },
    { schoolName: '湯沢', department: '普通・理数科', quota: 175, finalApplicants: 147, finalRate: 0.84 },
    { schoolName: '湯沢翔北', department: '普通科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '湯沢翔北', department: '総合ビジネス科', quota: 70, finalApplicants: 74, finalRate: 1.06 },
    { schoolName: '湯沢翔北', department: '工業技術科', quota: 70, finalApplicants: 49, finalRate: 0.7 },
    { schoolName: '湯沢翔北(雄勝校)', department: '普通科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '羽後', department: '普通科', quota: 70, finalApplicants: 25, finalRate: 0.36 },
  ],
};
