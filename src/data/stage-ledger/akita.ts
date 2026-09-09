import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 秋田県 段階台帳（T-Y11F §5順序#7・27県目・全日制78レコードで完結）。
 *
 * 一次ソース: 秋田県教育委員会「令和8年度秋田県公立高等学校入学者選抜１次募集 志願者数
 * （最終志願）」（公－２・令和8年2月27日公表・全2ページ）＋「令和8年度秋田県公立高等学校
 * 入学者選抜１次募集 合格者数」（公－２・令和8年3月13日公表・全2ページ）の2資料。
 * https://www.pref.akita.lg.jp/pages/archive/93860
 *
 * ⚠️両PDFともpdftotextでCJKラベルが全欠落する埋め込みフォントのためpdftoppm 200dpi +
 * ビジョン読み取りで転記した。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/akita.ts`（同一の「志願者数
 * （最終志願）」資料・総志願者列を典拠）のR8レコード78件をそのまま再利用した（quota・
 * applicantsConfirmedとも本資料と既存パイプラインが完全同一の一次資料・同一時点のため）。
 * testTakersConfirmed・finalPassersは合格者数資料（3/13公表）の「特色選抜」「一般選抜」の
 * 2トラック別の受検者数列・合格者数列をそれぞれ合算して新規に転記した。
 *
 * ⚠️秋田県は「特色選抜」（推薦相当）と「一般選抜」を同一募集定員に対して2段階で実施し、
 * 資料の脚注（注1「一般選抜志願者数は特色選抜を併願している者を除いた人数」）が示す通り、
 * applicantsConfirmed（総志願者＝特色選抜志願者＋一般選抜〈併願を除く〉志願者の純計＝
 * 各生徒を1回だけ数える）と、testTakersConfirmed（特色選抜受検者数＋一般選抜受検者数の
 * 単純合算）は**設計上、数える対象が異なる**。特色選抜に落ちた生徒がそのまま一般選抜を
 * 受検するため、testTakersConfirmedがapplicantsConfirmedを上回る学科が78件中14件ある
 * （最大例: 秋田南・普通科は総志願者168人に対し受検者数合計179人＝特色選抜不合格者が
 * 一般選抜に回った差分と推測される）。これは転記ミスではなく秋田県の2段階選抜制度に
 * 固有の構造であり、finalPassersがtestTakersConfirmedを上回るケース（4件・大館桂桜「機械科」
 * 24>23、大館国際情報学院「国際情報科」43>40、湯沢翔北「普通科」35>34・「工業技術科」51>49）
 * とあわせて、いずれも学科計では2資料の県計行と完全一致することを機械集計で確認済み。
 *
 * 4系列すべての機械集計（quota6,268／applicantsConfirmed5,237／testTakersConfirmed5,247／
 * finalPassers4,944）が、志願者数資料の「県合計」行（quota6,268・総志願者5,237）と
 * 合格者数資料の「県合計」行（受検者数1,027+4,220=5,247・合格者数948+3,996=4,944）の
 * 両方に独立に完全一致した（初回転記で一致・再修正なし）。分校2件（大曲農業(太田分校)・
 * 湯沢翔北(雄勝校)）は既存パイプラインの表記方針を継承。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const AKITA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'akita',
  sources: [
    {
      url: 'https://www.pref.akita.lg.jp/pages/archive/93860',
      docTitle: '秋田県教育委員会 令和8年度秋田県公立高等学校入学者選抜１次募集 志願者数（最終志願）（公－２）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
    {
      url: 'https://www.pref.akita.lg.jp/pages/archive/93860',
      docTitle: '秋田県教育委員会 令和8年度秋田県公立高等学校入学者選抜１次募集 合格者数（公－２）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（43校・分校2件を含む実質44エントリ・78レコードを完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制78レコードを完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/akita.ts`（同一資料典拠）を再利用し、testTakersConfirmed・finalPassersは合格者数資料（3/13公表）の特色選抜・一般選抜2トラックの受検者数列・合格者数列を合算して新規転記した。秋田県は特色選抜落選者が一般選抜へ回るため、applicantsConfirmed（純計）よりtestTakersConfirmed（2トラック合算）が大きくなる学科が78件中14件ある（転記ミスではなく制度構造）。finalPassers>testTakersConfirmedも4件あるが学科計では両資料の県計行と完全一致する。4系列すべての機械集計（quota6,268/applicantsConfirmed5,237/testTakersConfirmed5,247/finalPassers4,944）が両資料の「県合計」行と独立に完全一致した。',
  },
  officialSubtotals: [
    { label: '県合計', quota: 6268, applicantsConfirmed: 5237, testTakersConfirmed: 5247, finalPassers: 4944 },
  ],
  records: [
    { schoolName: '鹿角', department: '普通科', quota: 175, applicantsConfirmed: 148, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '鹿角', department: '産業工学科', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 17, finalPassers: 16 },
    { schoolName: '大館鳳鳴', department: '普通・理数科', quota: 210, applicantsConfirmed: 174, testTakersConfirmed: 173, finalPassers: 173 },
    { schoolName: '大館桂桜', department: '普通・生活科学科', quota: 75, applicantsConfirmed: 77, testTakersConfirmed: 77, finalPassers: 75 },
    { schoolName: '大館桂桜', department: '機械科', quota: 35, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 24 },
    { schoolName: '大館桂桜', department: '電気科', quota: 35, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '大館桂桜', department: '土木・建築科', quota: 35, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '大館国際情報学院', department: '普通科', quota: 49, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 49 },
    { schoolName: '大館国際情報学院', department: '国際情報科', quota: 53, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 43 },
    { schoolName: '秋田北鷹', department: '普通科', quota: 120, applicantsConfirmed: 76, testTakersConfirmed: 76, finalPassers: 76 },
    { schoolName: '秋田北鷹', department: '生物資源科', quota: 35, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '秋田北鷹', department: '緑地環境科', quota: 35, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 21 },
    { schoolName: '能代', department: '普通・理数科', quota: 195, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 136 },
    { schoolName: '能代松陽', department: '普通・国際コミュニケーション科', quota: 115, applicantsConfirmed: 114, testTakersConfirmed: 113, finalPassers: 113 },
    { schoolName: '能代松陽', department: '情報ビジネス科', quota: 70, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '能代科学技術', department: '機械・電気・建設科', quota: 105, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 44 },
    { schoolName: '能代科学技術', department: '生物資源・生活福祉科', quota: 70, applicantsConfirmed: 34, testTakersConfirmed: 32, finalPassers: 30 },
    { schoolName: '五城目', department: '普通科', quota: 80, applicantsConfirmed: 15, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '男鹿海洋', department: '海洋科', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '男鹿海洋', department: '食品科学科', quota: 35, applicantsConfirmed: 14, testTakersConfirmed: 12, finalPassers: 11 },
    { schoolName: '男鹿工業', department: '機械科', quota: 35, applicantsConfirmed: 30, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '男鹿工業', department: '電気電子科', quota: 35, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '秋田西', department: '普通科', quota: 160, applicantsConfirmed: 144, testTakersConfirmed: 140, finalPassers: 139 },
    { schoolName: '金足農業', department: '生物資源科', quota: 35, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 35 },
    { schoolName: '金足農業', department: '環境土木科', quota: 35, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 35 },
    { schoolName: '金足農業', department: '食品流通科', quota: 35, applicantsConfirmed: 40, testTakersConfirmed: 42, finalPassers: 35 },
    { schoolName: '金足農業', department: '造園緑地科', quota: 35, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 35 },
    { schoolName: '金足農業', department: '生活科学科', quota: 35, applicantsConfirmed: 41, testTakersConfirmed: 39, finalPassers: 35 },
    { schoolName: '秋田', department: '普通・理数科', quota: 263, applicantsConfirmed: 280, testTakersConfirmed: 281, finalPassers: 263 },
    { schoolName: '秋田北', department: '普通科', quota: 210, applicantsConfirmed: 226, testTakersConfirmed: 227, finalPassers: 210 },
    { schoolName: '秋田南', department: '普通科', quota: 133, applicantsConfirmed: 168, testTakersConfirmed: 179, finalPassers: 133 },
    { schoolName: '秋田中央', department: '普通科', quota: 210, applicantsConfirmed: 244, testTakersConfirmed: 251, finalPassers: 210 },
    { schoolName: '新屋', department: '普通科', quota: 160, applicantsConfirmed: 185, testTakersConfirmed: 183, finalPassers: 160 },
    { schoolName: '秋田工業', department: '機械科', quota: 70, applicantsConfirmed: 70, testTakersConfirmed: 71, finalPassers: 66 },
    { schoolName: '秋田工業', department: '電気エネルギー科', quota: 35, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 30 },
    { schoolName: '秋田工業', department: '土木科', quota: 35, applicantsConfirmed: 39, testTakersConfirmed: 41, finalPassers: 35 },
    { schoolName: '秋田工業', department: '建築科', quota: 35, applicantsConfirmed: 42, testTakersConfirmed: 39, finalPassers: 35 },
    { schoolName: '秋田工業', department: '工業化学科', quota: 35, applicantsConfirmed: 39, testTakersConfirmed: 37, finalPassers: 35 },
    { schoolName: '秋田商業', department: '商業科', quota: 210, applicantsConfirmed: 230, testTakersConfirmed: 240, finalPassers: 210 },
    { schoolName: '御所野学院', department: '普通科', quota: 56, applicantsConfirmed: 39, testTakersConfirmed: 37, finalPassers: 35 },
    { schoolName: '本荘', department: '普通科', quota: 200, applicantsConfirmed: 178, testTakersConfirmed: 178, finalPassers: 178 },
    { schoolName: '由利', department: '普通・理数・国際科', quota: 150, applicantsConfirmed: 152, testTakersConfirmed: 152, finalPassers: 150 },
    { schoolName: '由利工業', department: '機械科', quota: 35, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '由利工業', department: '電気科', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '由利工業', department: '環境システム科', quota: 35, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '由利工業', department: '建築科', quota: 35, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '矢島', department: '普通科', quota: 60, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '西目', department: '総合学科', quota: 120, applicantsConfirmed: 71, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '仁賀保', department: '普通科', quota: 70, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '仁賀保', department: '情報メディア科', quota: 35, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '西仙北', department: '普通科', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '大曲農業', department: '農業科学科', quota: 70, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 70 },
    { schoolName: '大曲農業', department: '食品科学科', quota: 35, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 35 },
    { schoolName: '大曲農業', department: '園芸科学科', quota: 35, applicantsConfirmed: 17, testTakersConfirmed: 18, finalPassers: 17 },
    { schoolName: '大曲農業', department: '生活科学科', quota: 35, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '大曲農業(太田分校)', department: '普通科', quota: 35, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '大曲', department: '普通科', quota: 160, applicantsConfirmed: 189, testTakersConfirmed: 189, finalPassers: 160 },
    { schoolName: '大曲', department: '商業科', quota: 35, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 35 },
    { schoolName: '大曲工業', department: '機械科', quota: 35, applicantsConfirmed: 28, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '大曲工業', department: '電気科', quota: 70, applicantsConfirmed: 58, testTakersConfirmed: 63, finalPassers: 57 },
    { schoolName: '大曲工業', department: '土木・建築科', quota: 35, applicantsConfirmed: 36, testTakersConfirmed: 38, finalPassers: 33 },
    { schoolName: '角館', department: '普通科', quota: 200, applicantsConfirmed: 117, testTakersConfirmed: 117, finalPassers: 117 },
    { schoolName: '六郷', department: '普通・福祉科', quota: 75, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '横手', department: '普通・理数科', quota: 210, applicantsConfirmed: 218, testTakersConfirmed: 218, finalPassers: 210 },
    { schoolName: '横手城南', department: '普通科', quota: 140, applicantsConfirmed: 128, testTakersConfirmed: 128, finalPassers: 128 },
    { schoolName: '横手清陵学院', department: '普通科', quota: 57, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 43 },
    { schoolName: '横手清陵学院', department: '総合技術科', quota: 57, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '平成', department: '普通科', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '平成', department: '総合ビジネス科', quota: 35, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '雄物川', department: '普通科', quota: 70, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '増田', department: '総合学科', quota: 70, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '増田', department: '農業科学科', quota: 35, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '湯沢', department: '普通・理数科', quota: 175, applicantsConfirmed: 147, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '湯沢翔北', department: '普通科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 35 },
    { schoolName: '湯沢翔北', department: '総合ビジネス科', quota: 70, applicantsConfirmed: 74, testTakersConfirmed: 77, finalPassers: 70 },
    { schoolName: '湯沢翔北', department: '工業技術科', quota: 70, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 51 },
    { schoolName: '湯沢翔北(雄勝校)', department: '普通科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '羽後', department: '普通科', quota: 70, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 23 },
  ],
};
