// 京都府: 令和9年度京都府公立高等学校入学者選抜「前期選抜独自枠等募集要項」(前半・79頁)。
// 令和9年度から前期選抜のみに一本化され、学校ごとに「独自枠」(学校・学科の特色に応じた
// 検査)を設定できる制度になった(共通枠は別文書)。頁14-18「前期選抜独自枠の検査項目と
// 配点」が県内全校を1つの表にまとめた一覧表だが、「学校名」列が32行にまたがる結合
// セルのため、単純な中点分割では隣接校の行を取り違えるリスクがあった(詳細は
// `ops/baselines/t-y14-selection-method-survey-2026-09.md`のkyoto行)。
//
// 本ファイルは京都市・乙訓学区26校を2段階で収録する。
// ①最初の13校(山城〜東稜)は、一覧表(頁14-18・find_tables()でセルbbox検出→
// page.get_text(clip=bbox)で再抽出)と個別学校ページ(頁21〜51・1選抜型=1頁・各頁に
// 学校名が明記される曖昧性のない情報源)を独立に突合し、両者が完全一致することを確認した
// 学校（嵯峨野の「京都こすもす科」は個別ページで自然科学系統80人+文理科学系統240人の
// 内訳と選抜方法が直接確認できた）。
// ②残りの13校(洛水〜開建・頁52-77)は一覧表側の照合を経ず、個別学校ページのみを直接
// 転記した（一覧表そのものにこの範囲の学校名を含むページで一部フォント文字化けがあり、
// 個別ページの方が曖昧性が無く安全なため）。京都すばる(商業学科群・情報科学科が同一
// 選抜型で並記)・京都工学院(プロジェクト工学科がものづくり/まちづくりの2分野系統を
// 1つの選抜型でまとめて募集)のように1ページが複数の学科・系統を含む場合はnoteに内訳を
// 記載する。京都奏和(頁78)は単位制による定時制(昼間四部制)課程のため対象外。
//
// ③城陽学区8校(東宇治〜久御山)＋相楽学区3校(田辺〜南陽)＋北桑田(本校)＋亀岡＋南丹＋
// 園部＋農芸＋須知＋綾部(本校)＋綾部(東分校)＋福知山(本校)＋工業＋大江＋東舞鶴＋
// 西舞鶴は「前期選抜独自枠等募集要項（後半）.pdf」(`wp-content/uploads/2026/08/`配下・
// 全82頁)の頁1-55(印刷頁79-133)から収録。この文書は前半PDFの続き(印刷頁が連番)で、
// 印刷頁79(=東宇治)が物理的に前半の最終頁(79頁)を超えるため後半ファイルへ分割
// されている。この範囲は頁1校=1頁(まれに1校2-4頁)の個別ページのみで構成され、1頁の
// 学校名が本文中に明記される曖昧性ゼロの情報源のため一覧表との突合は不要だった。
// 京都八幡は北キャンパス(普通科総合選択制)と南キャンパス(介護福祉科・人間科学科)が
// 資料上も別ページ・別学科構成のため別学校として収録。京都八幡南キャンパスの
// 「各学科15人」・田辺の「デザイン科・機械科・電気科・自動車科 各学科15人」はいずれも
// 学科ごとにレコードを分割。綾部(東分校)の「農業科・園芸科 15人」は資料が2学科を1つの
// 数値でまとめて記載しているため、内訳不明のままdepartment名に「農業科・園芸科」と
// 併記し実際の分割は推定しない(Y-0)。北桑田美山分校(頁108・農業科/家政科)・福知山
// 三和分校(頁126-127・農業科/家政科)はいずれも定時制(昼間)課程のため清明・京都奏和
// と同様に対象外。工業の「機械系学科群/情報系学科群/電気工学科」は資料が学科群ごとに
// 個別の募集人員を明記しているためそのまま3レコードに収録。海洋の「海洋学科群」も
// 同様に3学科まとめて1つの募集人員(42人)のみ明記のため1レコードで収録。宮津天橋は
// 宮津学舎(普通科・建築科)と加悦谷学舎(普通科のみ・A/B2方式)を資料上も別学舎として
// 別学校に収録。次の峰山(頁139〜)以降は今回未収録。
//
// selectionCategoryは資料の「選抜方式、型」表記(A/A1/A2/B/C/D等)をそのまま使用。noteの
// 「独自枠募集人員」は当該型で独自枠から選抜される人数(学科全体の募集定員とは別の数値)。
// 配点の詳細な算出式(判定Ⅰ〜Ⅲ等の複雑な多段階選抜を持つ学校がある)までは転記せず、
// 学校・学科・選抜型・人数構造の転記にとどめる(ratioTypeは設定しない)。

import type { PrefectureSchoolSelectionMethod } from '@/lib/school-selection-method';

export const KYOTO_SCHOOL_SELECTION_METHOD: PrefectureSchoolSelectionMethod = {
  prefectureCode: 'kyoto',
  fiscalYear: '令和9年度（2027年度）',
  status: 'structured',
  coverageNote:
    '「京都市・乙訓」学区26校(58レコード)＋「城陽」学区8校(18レコード)＋「相楽」学区3校(13レコード)＋北桑田(本校・2レコード)＋亀岡(4レコード)＋南丹(3レコード)＋園部(1レコード)＋農芸(1レコード)＋須知(3レコード)＋綾部(本校・2レコード)＋綾部(東分校・2レコード)＋福知山(本校・2レコード)＋工業(3レコード)＋大江(1レコード)＋東舞鶴(1レコード)＋西舞鶴(3レコード)＋海洋(1レコード)＋宮津天橋(宮津学舎・2レコード)＋宮津天橋(加悦谷学舎・2レコード)の計53校122レコードを収録。京都市・乙訓学区の山城〜東稜13校は一覧表(頁14-18)と個別学校ページ(頁21-51)の両方で行の帰属を突合できた学校、洛水〜開建13校は個別学校ページ(頁52-77)のみを直接転記(一覧表側の該当ページに文字化けがあったため)。城陽学区以降(東宇治〜宮津天橋加悦谷学舎)は後半PDF頁1-60(印刷頁79-138)の個別学校ページのみで構成され一覧表との突合は不要だった。結合セルの帰属が一意に確定できない他学区・峰山以降(丹後通学圏等)は今回見送り。清明高校(単位制による定時制・昼間二部)・京都奏和(単位制による定時制・昼間四部制)・北桑田美山分校・福知山三和分校(いずれも定時制・昼間課程)は本表の対象外(定時制は別掲)',
  source: {
    url: 'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2026/09/前期選抜独自枠等募集要項（1前半）.pdf',
    docTitle: '京都府教育委員会「令和9年度京都府公立高等学校入学者選抜 前期選抜独自枠等募集要項」前半(頁14-18・頁21-77)＋後半(https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2026/08/前期選抜独自枠等募集要項（後半）.pdf・頁1-60=印刷頁79-138)',
    lastChecked: '2026-09-23',
  },
  note:
    '「独自枠募集人員」は学科全体の募集定員(quota)のうち独自枠選抜に配分される人数。選抜型(A1/A2/B/C等)は同一学科内の複数日程・複数方式を示す資料の表記をそのまま転記。令和9年度から前期・中期選抜が「早期選抜」(独自枠/共通枠)に一本化された制度改定の影響を受けている',
  schools: [
    {
      schoolName: '京都府立山城高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員320人。独自枠募集人員112人',
    },
    {
      schoolName: '京都府立山城高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員320人。独自枠募集人員48人',
    },
    {
      schoolName: '京都府立山城高等学校',
      department: '文理総合科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鴨沂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員240人。独自枠募集人員96人',
    },
    {
      schoolName: '京都府立鴨沂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員240人。独自枠募集人員24人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員160人。独自枠募集人員56人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員160人。独自枠募集人員24人',
    },
    {
      schoolName: '京都府立洛北高等学校',
      department: '普通科（単位制）＜スポーツ総合専攻＞',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立北稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員100人',
    },
    {
      schoolName: '京都府立北稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員240人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立朱雀高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員200人。独自枠募集人員75人',
    },
    {
      schoolName: '京都府立朱雀高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員200人。独自枠募集人員25人',
    },
    {
      schoolName: '京都府立洛東高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員84人',
    },
    {
      schoolName: '京都府立洛東高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員240人。独自枠募集人員36人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A1方式',
      note: '学科募集定員160人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A2方式',
      note: '学科募集定員160人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: '普通科（単位制）＜スポーツ総合専攻＞',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '学科募集定員40人。独自枠募集人員40人',
    },
    {
      schoolName: '京都府立鳥羽高等学校',
      department: 'グローバル科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人。独自枠募集人員80人',
    },
    {
      schoolName: '京都府立嵯峨野高等学校',
      department: '京都こすもす科（自然科学系統）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人。判定Ⅰで自然科学系統80名を第1希望者から決定',
    },
    {
      schoolName: '京都府立嵯峨野高等学校',
      department: '京都こすもす科（文理科学系統）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。判定Ⅱ・判定Ⅲの2段階(各120名)で決定・共通枠の募集なし',
    },
    {
      schoolName: '京都府立北嵯峨高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人。独自枠募集人員92人',
    },
    {
      schoolName: '京都府立北嵯峨高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員280人。独自枠募集人員48人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人。独自枠募集人員84人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員280人。独自枠募集人員56人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '植物クリエイト科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立桂高等学校',
      department: '園芸ビジネス科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員40人。独自枠募集人員20人',
    },
    {
      schoolName: '京都府立洛西高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員240人。独自枠募集人員120人',
    },
    {
      schoolName: '京都府立桃山高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員280人',
    },
    {
      schoolName: '京都府立桃山高等学校',
      department: '自然科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員80人',
    },
    {
      schoolName: '京都府立東稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '学科募集定員200人。独自枠募集人員73人',
    },
    {
      schoolName: '京都府立東稜高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '学科募集定員200人。独自枠募集人員27人',
    },
    {
      schoolName: '京都府立洛水高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員56人',
    },
    {
      schoolName: '京都府立洛水高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員24人',
    },
    {
      schoolName: '京都府立京都すばる高等学校',
      department: '商業学科群（起業創造科・企画科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員70人',
    },
    {
      schoolName: '京都府立京都すばる高等学校',
      department: '商業学科群（起業創造科・企画科）',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員30人',
    },
    {
      schoolName: '京都府立京都すばる高等学校',
      department: '情報科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立向陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員100人',
    },
    {
      schoolName: '京都府立乙訓高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都府立乙訓高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立乙訓高等学校',
      department: 'スポーツ健康科学科',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立西乙訓高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都市立西京高等学校',
      department: 'エンタープライジング科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員144人',
    },
    {
      schoolName: '京都市立西京高等学校',
      department: 'エンタープライジング科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員16人',
    },
    {
      schoolName: '京都市立美術工芸高等学校',
      department: '美術工芸科',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員90人',
    },
    {
      schoolName: '京都市立京都堀川音楽高等学校',
      department: '音楽科（作曲専攻・声楽専攻・器楽専攻・楽理専攻）',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都市立京都工学院高等学校',
      department: 'プロジェクト工学科（ものづくり分野系統・まちづくり分野系統）',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: 'ものづくり分野系統97人・まちづくり分野系統65人(出願時に希望系統を選択)',
    },
    {
      schoolName: '京都市立京都工学院高等学校',
      department: 'プロジェクト工学科（ものづくり分野系統・まちづくり分野系統）',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: 'ものづくり分野系統11人・まちづくり分野系統7人(出願時に希望系統を選択)',
    },
    {
      schoolName: '京都市立京都工学院高等学校',
      department: 'フロンティア理数科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都市立堀川高等学校',
      department: '探究学科群（人間探究科・自然探究科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員230人',
    },
    {
      schoolName: '京都市立堀川高等学校',
      department: '探究学科群（人間探究科・自然探究科）',
      selectionCategory: '前期選抜独自枠 D方式',
      note: '独自枠募集人員10人',
    },
    {
      schoolName: '京都市立日吉ケ丘高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都市立日吉ケ丘高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都市立日吉ケ丘高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式3型',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都市立紫野高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員85人',
    },
    {
      schoolName: '京都市立紫野高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都市立紫野高等学校',
      department: 'アカデミア科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都市立開建高等学校',
      department: 'ルミノベーション科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員105人',
    },
    {
      schoolName: '京都市立開建高等学校',
      department: 'ルミノベーション科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立東宇治高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員30人',
    },
    {
      schoolName: '京都府立東宇治高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員90人',
    },
    {
      schoolName: '京都府立莵道高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員120人',
    },
    {
      schoolName: '京都府立城南菱創高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都府立城南菱創高等学校',
      department: '教養科学科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都府立城南菱創高等学校',
      department: '教養科学科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都府立城陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員84人',
    },
    {
      schoolName: '京都府立城陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員36人（Joyo Athlete Club指定部活動の実技検査を伴う枠）',
    },
    {
      schoolName: '京都府立西城陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員96人',
    },
    {
      schoolName: '京都府立西城陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員24人',
    },
    {
      schoolName: '京都府立西城陽高等学校',
      department: '普通科（スポーツ総合専攻）',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員40人（実技検査あり）',
    },
    {
      schoolName: '京都府立京都八幡高等学校（北キャンパス）',
      department: '普通科総合選択制',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員70人',
    },
    {
      schoolName: '京都府立京都八幡高等学校（北キャンパス）',
      department: '普通科総合選択制',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員10人（硬式野球部・レスリング部の実績を求める枠）',
    },
    {
      schoolName: '京都府立京都八幡高等学校（南キャンパス）',
      department: '介護福祉科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「介護福祉科・人間科学科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立京都八幡高等学校（南キャンパス）',
      department: '人間科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「介護福祉科・人間科学科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立久御山高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員70人',
    },
    {
      schoolName: '京都府立久御山高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員30人',
    },
    {
      schoolName: '京都府立久御山高等学校',
      department: '普通科（スポーツ総合専攻）',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員40人（実技検査あり）',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員20人（指定部活動の実績を求める枠）',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: 'デザイン科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「デザイン科・機械科・電気科・自動車科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '機械科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「デザイン科・機械科・電気科・自動車科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '電気科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「デザイン科・機械科・電気科・自動車科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立田辺高等学校',
      department: '自動車科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「デザイン科・機械科・電気科・自動車科 各学科15人」と併記）',
    },
    {
      schoolName: '京都府立木津高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員64人',
    },
    {
      schoolName: '京都府立木津高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員16人（指定部活動の実績を求める枠）',
    },
    {
      schoolName: '京都府立木津高等学校',
      department: 'システム園芸科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都府立木津高等学校',
      department: '情報企画科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都府立南陽高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都府立南陽高等学校',
      department: 'サイエンスリサーチ科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都府立北桑田高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員30人（うち京都市・乙訓通学圏枠12人を含む）',
    },
    {
      schoolName: '京都府立北桑田高等学校',
      department: '京都フォレスト科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立亀岡高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員75人',
    },
    {
      schoolName: '京都府立亀岡高等学校',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員25人（指定部活動の実績を求める枠）',
    },
    {
      schoolName: '京都府立亀岡高等学校',
      department: '普通科（美術・工芸専攻）（単位制）',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員30人（実技検査=鉛筆デッサンあり）',
    },
    {
      schoolName: '京都府立亀岡高等学校',
      department: '探究文理科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員20人',
    },
    {
      schoolName: '京都府立南丹高等学校',
      department: '総合学科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員34人',
    },
    {
      schoolName: '京都府立南丹高等学校',
      department: '総合学科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立南丹高等学校',
      department: '総合学科（単位制）',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員26人（指定部活動の実績を求める枠）',
    },
    {
      schoolName: '京都府立園部高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都府立農芸高等学校',
      department: '農業学科群（農業生産科・園芸技術科・環境創造科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員42人',
    },
    {
      schoolName: '京都府立須知高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立須知高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員15人（体育系指定部活動の実績を求める枠）',
    },
    {
      schoolName: '京都府立須知高等学校',
      department: '食品科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立綾部高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員90人',
    },
    {
      schoolName: '京都府立綾部高等学校',
      department: '普通科（スポーツ総合専攻）',
      selectionCategory: '前期選抜独自枠 C方式',
      note: '独自枠募集人員40人（実技検査あり）',
    },
    {
      schoolName: '京都府立綾部高等学校（東分校）',
      department: '農業科・園芸科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人（資料は「農業科・園芸科」を1つの数値でまとめて15人と記載）',
    },
    {
      schoolName: '京都府立綾部高等学校（東分校）',
      department: '農芸化学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員15人',
    },
    {
      schoolName: '京都府立福知山高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員80人',
    },
    {
      schoolName: '京都府立福知山高等学校',
      department: '文理科学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立工業高等学校',
      department: '機械系学科群（機械工学科・知能機械科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員32人',
    },
    {
      schoolName: '京都府立工業高等学校',
      department: '情報系学科群（電子情報科・情報工学科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員32人',
    },
    {
      schoolName: '京都府立工業高等学校',
      department: '電気工学科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員16人',
    },
    {
      schoolName: '京都府立大江高等学校',
      department: '地域創生科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員45人',
    },
    {
      schoolName: '京都府立東舞鶴高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都府立西舞鶴高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式1型',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立西舞鶴高等学校',
      department: '普通科',
      selectionCategory: '前期選抜独自枠 A方式2型',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立西舞鶴高等学校',
      department: '理数探究科',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員40人',
    },
    {
      schoolName: '京都府立海洋高等学校',
      department: '海洋学科群（海洋科学科・海洋工学科・海洋資源科）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員42人',
    },
    {
      schoolName: '京都府立宮津天橋高等学校（宮津学舎）',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員60人',
    },
    {
      schoolName: '京都府立宮津天橋高等学校（宮津学舎）',
      department: '建築科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員12人',
    },
    {
      schoolName: '京都府立宮津天橋高等学校（加悦谷学舎）',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 A方式',
      note: '独自枠募集人員24人',
    },
    {
      schoolName: '京都府立宮津天橋高等学校（加悦谷学舎）',
      department: '普通科（単位制）',
      selectionCategory: '前期選抜独自枠 B方式',
      note: '独自枠募集人員16人（体育系指定部活動の実績を求める枠）',
    },
  ],
};
