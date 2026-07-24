/**
 * 大阪府 公立高等学校 倍率パイプラインα（Y-2・先行8県の3県目）。
 *
 * 一次ソース: 大阪府教育委員会「令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）
 * の志願者数（令和8年3月6日午後2時（締切数））」
 * https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_shigansha.html
 * https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx
 * 公表日: 令和8年3月7日
 *
 * ⚠️2026-07-24の前回試行でPDF版をRead toolのビジョン解析で転記した際、複数の実害ある誤りが
 * 発生した（①「桜塚」1校を丸ごと転記漏れ ②「豊島」の志願者数を隣接校の値と取り違え
 * ③「北千里」の募集人員を誤読）。これらはofficialSubtotalsとの合計突合＋単体整合性チェック
 * （quota×rate≈applicants）で検出したが原因を特定しきれず、一旦commitせず撤退した。
 * 今回はxlsx版を**新規npm依存ゼロ**でNode標準のzlib（DEFLATE展開）のみを使い、ZIP central
 * directory・sharedStrings.xml・sheet XMLを自前パースして読み取り、OCR誤読の可能性を完全に
 * 排除した（xlsxはテキストがそのままXMLに格納されているため誤読の余地がない）。
 *
 * 大阪府の資料構造は「①第1志望者数」列と「学校全体の志願者数(B)」列を持つ。複数学科設置校では
 * 他学科への第2志望で合格しうるため、公式競争率は学校全体のB/Aで計算される。しかし①は学科
 * ごとに個別記載され、生徒1人の第1志望は必ず1学科のみに帰属するため「B=Σ①（全学科分）」が
 * 成立する（東高校で普通271+理数99+英語23=393=Bを実測で確認済み）。これにより学科粒度への
 * 分解が可能: quota=A（学科ごとの公式値）・finalApplicants=①（学科ごとの公式値）・
 * finalRateはこの2値からの計算値（大阪府資料は学科別の倍率を印字しないため）。
 *
 * ✅表1〜表6すべてを収録（全日制の課程を対象とする資料全体）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const OSAKA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'osaka',
  sources: [
    {
      url: 'https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx',
      docTitle:
        '大阪府教育委員会 令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和8年3月6日午後2時（締切数））表1〜6全体',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '表1 普通科（単位制を除く）を設置する高等学校（専門学科併置校を含む）',
      '表2 普通科（単位制）を設置する高等学校',
      '表3 文理探究科を設置する高等学校',
      '表4 専門学科のみを設置する高等学校（工業・商業・総合科学・文理学科等）',
      '表5 総合学科（クリエイティブスクールを除く）を設置する高等学校',
      '表6 総合学科（クリエイティブスクール）を設置する高等学校',
    ],
    pendingDepartments: [],
    note: '一般入学者選抜（全日制の課程）の資料全体（表1〜6）を完全収録。定時制・通信制・特別選抜等はこの資料の対象外。',
  },
  officialSubtotals: [
    { label: '表1 普通科合計', quota: 17787, finalApplicants: 18335, finalRate: 1.03 },
    { label: '表1 専門学科合計', quota: 804, finalApplicants: 659, finalRate: 0.82 },
    { label: '表1 合計', quota: 18591, finalApplicants: 18994, finalRate: 1.02 },
    { label: '表2 合計', quota: 1000, finalApplicants: 1008, finalRate: 1.01 },
    { label: '表3 合計', quota: 560, finalApplicants: 791, finalRate: 1.41 },
    { label: '表4 合計', quota: 8286, finalApplicants: 9298, finalRate: 1.12 },
    { label: '表5 総合学科合計', quota: 3136, finalApplicants: 3070, finalRate: 0.98 },
    { label: '表5 専門学科合計', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { label: '表5 合計', quota: 3176, finalApplicants: 3118, finalRate: 0.98 },
    { label: '表6 合計', quota: 234, finalApplicants: 213, finalRate: 0.91 },
    {
      label: '全体合計（表1+表2+表3+表4+表5+表6）',
      quota: 31847,
      finalApplicants: 33422,
      finalRate: 1.05,
    },
  ],
  records: [
    // ===== 表1: 普通科（単位制を除く）設置校 =====
    { schoolName: '東淀川', department: '普通科', quota: 264, finalApplicants: 328, finalRate: 1.24 },
    { schoolName: '旭', department: '普通科', quota: 240, finalApplicants: 245, finalRate: 1.02 },
    { schoolName: '旭', department: '国際文化科', quota: 77, finalApplicants: 70, finalRate: 0.91 },
    { schoolName: '桜宮', department: '普通科', quota: 120, finalApplicants: 132, finalRate: 1.1 },
    { schoolName: '東', department: '普通科', quota: 200, finalApplicants: 271, finalRate: 1.36 },
    { schoolName: '東', department: '理数科', quota: 80, finalApplicants: 99, finalRate: 1.24 },
    { schoolName: '東', department: '英語科', quota: 36, finalApplicants: 23, finalRate: 0.64 },
    { schoolName: '汎愛', department: '普通科', quota: 160, finalApplicants: 167, finalRate: 1.04 },
    { schoolName: '清水谷', department: '普通科', quota: 280, finalApplicants: 319, finalRate: 1.14 },
    { schoolName: '夕陽丘', department: '普通科', quota: 280, finalApplicants: 317, finalRate: 1.13 },
    { schoolName: '港', department: '普通科', quota: 280, finalApplicants: 302, finalRate: 1.08 },
    { schoolName: '阿倍野', department: '普通科', quota: 320, finalApplicants: 384, finalRate: 1.2 },
    { schoolName: '東住吉', department: '普通科', quota: 280, finalApplicants: 339, finalRate: 1.21 },
    { schoolName: '阪南', department: '普通科', quota: 280, finalApplicants: 247, finalRate: 0.88 },
    { schoolName: '池田', department: '普通科', quota: 360, finalApplicants: 359, finalRate: 1.0 },
    { schoolName: '渋谷', department: '普通科', quota: 240, finalApplicants: 232, finalRate: 0.97 },
    { schoolName: '桜塚', department: '普通科', quota: 360, finalApplicants: 419, finalRate: 1.16 },
    { schoolName: '豊島', department: '普通科', quota: 280, finalApplicants: 276, finalRate: 0.99 },
    { schoolName: '刀根山', department: '普通科', quota: 360, finalApplicants: 426, finalRate: 1.18 },
    { schoolName: '箕面', department: '普通科', quota: 280, finalApplicants: 298, finalRate: 1.06 },
    { schoolName: '箕面', department: 'グローバル科', quota: 72, finalApplicants: 126, finalRate: 1.75 },
    { schoolName: '茨木西', department: '普通科', quota: 240, finalApplicants: 238, finalRate: 0.99 },
    { schoolName: '北摂つばさ', department: '普通科', quota: 200, finalApplicants: 125, finalRate: 0.63 },
    { schoolName: '吹田', department: '普通科', quota: 240, finalApplicants: 223, finalRate: 0.93 },
    { schoolName: '吹田東', department: '普通科', quota: 320, finalApplicants: 383, finalRate: 1.2 },
    { schoolName: '北千里', department: '普通科', quota: 320, finalApplicants: 415, finalRate: 1.3 },
    { schoolName: '山田', department: '普通科', quota: 360, finalApplicants: 412, finalRate: 1.14 },
    { schoolName: '三島', department: '普通科', quota: 360, finalApplicants: 456, finalRate: 1.27 },
    { schoolName: '高槻北', department: '普通科', quota: 280, finalApplicants: 244, finalRate: 0.87 },
    { schoolName: '芥川', department: '普通科', quota: 280, finalApplicants: 273, finalRate: 0.98 },
    { schoolName: '阿武野', department: '普通科', quota: 240, finalApplicants: 243, finalRate: 1.01 },
    { schoolName: '大冠', department: '普通科', quota: 280, finalApplicants: 280, finalRate: 1.0 },
    { schoolName: '摂津', department: '普通科', quota: 160, finalApplicants: 180, finalRate: 1.13 },
    { schoolName: '寝屋川', department: '普通科', quota: 320, finalApplicants: 398, finalRate: 1.24 },
    { schoolName: '西寝屋川', department: '普通科', quota: 240, finalApplicants: 107, finalRate: 0.45 },
    { schoolName: '北かわち皐が丘', department: '普通科', quota: 240, finalApplicants: 195, finalRate: 0.81 },
    { schoolName: '枚方', department: '普通科', quota: 240, finalApplicants: 300, finalRate: 1.25 },
    { schoolName: '枚方', department: '国際文化科', quota: 77, finalApplicants: 40, finalRate: 0.52 },
    { schoolName: '長尾', department: '普通科', quota: 160, finalApplicants: 90, finalRate: 0.56 },
    { schoolName: '牧野', department: '普通科', quota: 280, finalApplicants: 284, finalRate: 1.01 },
    { schoolName: '香里丘', department: '普通科', quota: 240, finalApplicants: 295, finalRate: 1.23 },
    { schoolName: '枚方津田', department: '普通科', quota: 240, finalApplicants: 199, finalRate: 0.83 },
    { schoolName: 'いちりつ', department: '普通科', quota: 200, finalApplicants: 228, finalRate: 1.14 },
    { schoolName: 'いちりつ', department: '理数科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: 'いちりつ', department: '英語科', quota: 39, finalApplicants: 25, finalRate: 0.64 },
    { schoolName: '守口東', department: '普通科', quota: 240, finalApplicants: 195, finalRate: 0.81 },
    { schoolName: '門真西', department: '普通科', quota: 160, finalApplicants: 69, finalRate: 0.43 },
    { schoolName: '野崎', department: '普通科', quota: 160, finalApplicants: 101, finalRate: 0.63 },
    { schoolName: '緑風冠', department: '普通科', quota: 240, finalApplicants: 219, finalRate: 0.91 },
    { schoolName: '交野', department: '普通科', quota: 240, finalApplicants: 223, finalRate: 0.93 },
    { schoolName: '布施', department: '普通科', quota: 320, finalApplicants: 354, finalRate: 1.11 },
    { schoolName: '花園', department: '普通科', quota: 240, finalApplicants: 316, finalRate: 1.32 },
    { schoolName: '花園', department: '国際文化科', quota: 77, finalApplicants: 65, finalRate: 0.84 },
    { schoolName: 'みどり清朋', department: '普通科', quota: 240, finalApplicants: 235, finalRate: 0.98 },
    { schoolName: '山本', department: '普通科', quota: 280, finalApplicants: 302, finalRate: 1.08 },
    { schoolName: '八尾', department: '普通科', quota: 280, finalApplicants: 308, finalRate: 1.1 },
    { schoolName: '八尾翠翔', department: '普通科', quota: 200, finalApplicants: 204, finalRate: 1.02 },
    { schoolName: '大塚', department: '普通科', quota: 160, finalApplicants: 110, finalRate: 0.69 },
    { schoolName: '河南', department: '普通科', quota: 280, finalApplicants: 263, finalRate: 0.94 },
    { schoolName: '富田林', department: '普通科', quota: 123, finalApplicants: 151, finalRate: 1.23 },
    { schoolName: '金剛', department: '普通科', quota: 240, finalApplicants: 241, finalRate: 1.0 },
    { schoolName: '懐風館', department: '普通科', quota: 120, finalApplicants: 50, finalRate: 0.42 },
    { schoolName: '長野', department: '普通科', quota: 160, finalApplicants: 134, finalRate: 0.84 },
    { schoolName: '長野', department: '国際文化科', quota: 77, finalApplicants: 13, finalRate: 0.17 },
    { schoolName: '藤井寺', department: '普通科', quota: 240, finalApplicants: 254, finalRate: 1.06 },
    { schoolName: '登美丘', department: '普通科', quota: 280, finalApplicants: 283, finalRate: 1.01 },
    { schoolName: '泉陽', department: '普通科', quota: 320, finalApplicants: 412, finalRate: 1.29 },
    { schoolName: '金岡', department: '普通科', quota: 240, finalApplicants: 242, finalRate: 1.01 },
    { schoolName: '東百舌鳥', department: '普通科', quota: 240, finalApplicants: 253, finalRate: 1.05 },
    { schoolName: '堺西', department: '普通科', quota: 240, finalApplicants: 243, finalRate: 1.01 },
    { schoolName: '堺上', department: '普通科', quota: 240, finalApplicants: 237, finalRate: 0.99 },
    { schoolName: '泉大津', department: '普通科', quota: 240, finalApplicants: 233, finalRate: 0.97 },
    { schoolName: '信太', department: '普通科', quota: 240, finalApplicants: 221, finalRate: 0.92 },
    { schoolName: '高石', department: '普通科', quota: 280, finalApplicants: 298, finalRate: 1.06 },
    { schoolName: '和泉', department: '普通科', quota: 240, finalApplicants: 278, finalRate: 1.16 },
    { schoolName: '和泉', department: 'グローバル科', quota: 78, finalApplicants: 73, finalRate: 0.94 },
    { schoolName: '久米田', department: '普通科', quota: 280, finalApplicants: 284, finalRate: 1.01 },
    { schoolName: '佐野', department: '普通科', quota: 200, finalApplicants: 270, finalRate: 1.35 },
    { schoolName: '佐野', department: '国際文化科', quota: 73, finalApplicants: 39, finalRate: 0.53 },
    { schoolName: '日根野', department: '普通科', quota: 240, finalApplicants: 257, finalRate: 1.07 },
    { schoolName: '貝塚南', department: '普通科', quota: 240, finalApplicants: 220, finalRate: 0.92 },
    { schoolName: 'りんくう翔南', department: '普通科', quota: 160, finalApplicants: 121, finalRate: 0.76 },
    { schoolName: '東大阪市立日新', department: '普通科', quota: 160, finalApplicants: 125, finalRate: 0.78 },
    { schoolName: '東大阪市立日新', department: '商業科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '東大阪市立日新', department: '英語科', quota: 38, finalApplicants: 19, finalRate: 0.5 },

    // ===== 表2: 普通科（単位制）設置校 =====
    { schoolName: '市岡', department: '普通科（単位制）', quota: 280, finalApplicants: 318, finalRate: 1.14 },
    { schoolName: '大阪府教育センター附属', department: '普通科（単位制）', quota: 240, finalApplicants: 248, finalRate: 1.03 },
    { schoolName: '槻の木', department: '普通科（単位制）', quota: 240, finalApplicants: 221, finalRate: 0.92 },
    { schoolName: '鳳', department: '普通科（単位制）', quota: 240, finalApplicants: 221, finalRate: 0.92 },

    // ===== 表3: 文理探究科設置校 =====
    { schoolName: '春日丘', department: '文理探究科', quota: 320, finalApplicants: 530, finalRate: 1.66 },
    { schoolName: '狭山', department: '文理探究科', quota: 240, finalApplicants: 261, finalRate: 1.09 },

    // ===== 表4: 専門学科のみ設置校 =====
    { schoolName: '園芸', department: 'フラワーファクトリ科', quota: 80, finalApplicants: 77, finalRate: 0.96 },
    { schoolName: '園芸', department: '環境緑化科', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '園芸', department: 'バイオサイエンス科', quota: 80, finalApplicants: 51, finalRate: 0.64 },
    { schoolName: '農芸', department: 'ハイテク農芸科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '農芸', department: '資源動物科', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '農芸', department: '食品加工科', quota: 80, finalApplicants: 77, finalRate: 0.96 },
    { schoolName: '東淀工業', department: '機械工学科', quota: 70, finalApplicants: 68, finalRate: 0.97 },
    { schoolName: '東淀工業', department: '電気工学科', quota: 35, finalApplicants: 32, finalRate: 0.91 },
    { schoolName: '東淀工業', department: '理工学科', quota: 35, finalApplicants: 0, finalRate: 0 },
    { schoolName: '淀川工科', department: '機械・電気・メカトロニクス科', quota: 175, finalApplicants: 166, finalRate: 0.95 },
    { schoolName: '淀川工科', department: '工学系大学進学専科', quota: 35, finalApplicants: 27, finalRate: 0.77 },
    { schoolName: '都島工業', department: '機械・機械電気科', quota: 70, finalApplicants: 77, finalRate: 1.1 },
    { schoolName: '都島工業', department: '電気電子工学科', quota: 70, finalApplicants: 61, finalRate: 0.87 },
    { schoolName: '都島工業', department: '建築・都市工学科', quota: 105, finalApplicants: 115, finalRate: 1.1 },
    { schoolName: '都島工業', department: '理数工学科', quota: 35, finalApplicants: 31, finalRate: 0.89 },
    { schoolName: '泉尾工業', department: '機械科', quota: 35, finalApplicants: 24, finalRate: 0.69 },
    { schoolName: '泉尾工業', department: '電気科', quota: 35, finalApplicants: 28, finalRate: 0.8 },
    { schoolName: '泉尾工業', department: '工業化学・セラミック科', quota: 35, finalApplicants: 18, finalRate: 0.51 },
    { schoolName: '泉尾工業', department: 'ファッション工学科', quota: 35, finalApplicants: 22, finalRate: 0.63 },
    { schoolName: '今宮工科', department: '機械・電気・建築・デザイン科', quota: 210, finalApplicants: 205, finalRate: 0.98 },
    { schoolName: '今宮工科', department: '工学系大学進学専科', quota: 35, finalApplicants: 27, finalRate: 0.77 },
    { schoolName: '茨木工科', department: '機械・電気・環境化学システム科', quota: 105, finalApplicants: 108, finalRate: 1.03 },
    { schoolName: '茨木工科', department: '工学系大学進学専科', quota: 35, finalApplicants: 4, finalRate: 0.11 },
    { schoolName: '東大阪みらい工科', department: '機械工学・電気情報工学・都市住宅科', quota: 210, finalApplicants: 208, finalRate: 0.99 },
    { schoolName: '東大阪みらい工科', department: '工学系大学進学専科', quota: 35, finalApplicants: 9, finalRate: 0.26 },
    { schoolName: '藤井寺工科', department: '機械・電気・メカトロニクス科', quota: 175, finalApplicants: 175, finalRate: 1.0 },
    { schoolName: '堺工科', department: '機械・電気・環境化学システム科', quota: 210, finalApplicants: 181, finalRate: 0.86 },
    { schoolName: '堺工科', department: '工学系大学進学専科', quota: 35, finalApplicants: 3, finalRate: 0.09 },
    { schoolName: '佐野工科', department: '機械・電気・産業創造科', quota: 210, finalApplicants: 198, finalRate: 0.94 },
    { schoolName: '堺市立堺', department: '機械材料創造科', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '堺市立堺', department: '建築インテリア創造科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '堺市立堺', department: 'マネジメント創造科', quota: 80, finalApplicants: 67, finalRate: 0.84 },
    { schoolName: '堺市立堺', department: 'サイエンス創造科', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '淀商業', department: '商業科', quota: 160, finalApplicants: 117, finalRate: 0.73 },
    { schoolName: '淀商業', department: '福祉ボランティア科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '鶴見商業', department: '商業科', quota: 160, finalApplicants: 148, finalRate: 0.93 },
    { schoolName: '住吉商業', department: '商業科', quota: 160, finalApplicants: 119, finalRate: 0.74 },
    { schoolName: '岸和田市立産業', department: '商業科', quota: 160, finalApplicants: 154, finalRate: 0.96 },
    { schoolName: '岸和田市立産業', department: '情報科', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '大阪ビジネスフロンティア', department: 'グローバルビジネス科', quota: 240, finalApplicants: 259, finalRate: 1.08 },
    { schoolName: '住吉', department: '総合科学科', quota: 155, finalApplicants: 193, finalRate: 1.25 },
    { schoolName: '住吉', department: '国際文化科', quota: 157, finalApplicants: 224, finalRate: 1.43 },
    { schoolName: '千里', department: '総合科学科', quota: 155, finalApplicants: 187, finalRate: 1.21 },
    { schoolName: '千里', department: '国際文化科', quota: 157, finalApplicants: 184, finalRate: 1.17 },
    { schoolName: '泉北', department: '総合科学科', quota: 117, finalApplicants: 151, finalRate: 1.29 },
    { schoolName: '泉北', department: '国際文化科', quota: 155, finalApplicants: 168, finalRate: 1.08 },
    { schoolName: '北野', department: '文理学科', quota: 360, finalApplicants: 452, finalRate: 1.26 },
    { schoolName: '大手前', department: '文理学科', quota: 360, finalApplicants: 476, finalRate: 1.32 },
    { schoolName: '高津', department: '文理学科', quota: 360, finalApplicants: 501, finalRate: 1.39 },
    { schoolName: '天王寺', department: '文理学科', quota: 360, finalApplicants: 419, finalRate: 1.16 },
    { schoolName: '豊中', department: '文理学科', quota: 360, finalApplicants: 644, finalRate: 1.79 },
    { schoolName: '茨木', department: '文理学科', quota: 320, finalApplicants: 446, finalRate: 1.39 },
    { schoolName: '四條畷', department: '文理学科', quota: 360, finalApplicants: 486, finalRate: 1.35 },
    { schoolName: '生野', department: '文理学科', quota: 360, finalApplicants: 466, finalRate: 1.29 },
    { schoolName: '三国丘', department: '文理学科', quota: 320, finalApplicants: 423, finalRate: 1.32 },
    { schoolName: '岸和田', department: '文理学科', quota: 320, finalApplicants: 373, finalRate: 1.17 },
    { schoolName: '桜和', department: '教育文理学科', quota: 240, finalApplicants: 265, finalRate: 1.1 },

    // ===== 表5: 総合学科（クリエイティブスクールを除く）設置校 =====
    { schoolName: '柴島', department: '総合学科', quota: 240, finalApplicants: 309, finalRate: 1.29 },
    { schoolName: '咲くやこの花', department: '食物文化科', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '咲くやこの花', department: '総合学科', quota: 80, finalApplicants: 98, finalRate: 1.23 },
    { schoolName: '今宮', department: '総合学科', quota: 240, finalApplicants: 308, finalRate: 1.28 },
    { schoolName: '千里青雲', department: '総合学科', quota: 240, finalApplicants: 272, finalRate: 1.13 },
    { schoolName: '福井', department: '総合学科', quota: 144, finalApplicants: 75, finalRate: 0.52 },
    { schoolName: '枚方なぎさ', department: '総合学科', quota: 240, finalApplicants: 222, finalRate: 0.93 },
    { schoolName: '芦間', department: '総合学科', quota: 240, finalApplicants: 224, finalRate: 0.93 },
    { schoolName: '門真なみはや', department: '総合学科', quota: 224, finalApplicants: 246, finalRate: 1.1 },
    { schoolName: '枚岡樟風', department: '総合学科', quota: 160, finalApplicants: 97, finalRate: 0.61 },
    { schoolName: '八尾北', department: '総合学科', quota: 224, finalApplicants: 216, finalRate: 0.96 },
    { schoolName: '松原', department: '総合学科', quota: 240, finalApplicants: 178, finalRate: 0.74 },
    { schoolName: '堺東', department: '総合学科', quota: 240, finalApplicants: 249, finalRate: 1.04 },
    { schoolName: '成美', department: '総合学科', quota: 144, finalApplicants: 92, finalRate: 0.64 },
    { schoolName: '伯太', department: '総合学科', quota: 240, finalApplicants: 234, finalRate: 0.98 },
    { schoolName: '貝塚', department: '総合学科', quota: 240, finalApplicants: 250, finalRate: 1.04 },

    // ===== 表6: 総合学科（クリエイティブスクール）設置校 =====
    { schoolName: '東住吉総合', department: '総合学科（クリエイティブスクール）', quota: 234, finalApplicants: 213, finalRate: 0.91 },
  ],
};
