/**
 * 島根県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/shimane.ts（第一段・機械生成の参照台帳）10校全てを調査したが、
 * 確度の高い募集定員(数値)を確認できなかった。
 *
 * 【重要な発見】島根県教育委員会が公表する「高等学校・特別支援学校(高等部)学科・
 * 学校紹介」冊子(私立高等学校一覧・P87-98)は、全日制の各校について「設置学科・学級数」
 * (例:開星高等学校=普通科5〜6学級)のみを記載し、募集定員(人数)そのものは掲載していない
 * 珍しいパターンを発見した(通信制課程の学校のみ「入学定員」を人数で明記=例:明誠高等学校
 * 通信制課程420名・立正大学淞南高等学校通信制課程80名だが、これらは全日制とは別区分・
 * 別学科であり、参照台帳の学校コードが指す全日制本体の募集定員には使えない)。
 * 各校公式サイトの募集要項PDF(例:開星高等学校2027年度入試生徒募集要項)も出願資格・
 * 日程・特待制度は詳細だが募集定員(人数)の記載が無いことを確認した。
 * 学級数から40名等の標準学級定員を掛けて独自推定することはY-0憲法(公表値のみ・
 * 独自推定禁止)に反するため行わず、10校全てを正直にスキップ台帳へ計上する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const REASON =
  '教委公表の学校紹介冊子は学級数のみ記載し募集定員(人数)を明記せず、学校公式サイトの募集要項PDFにも募集定員の記載が無いため確度の高い数値を確認できなかった(学級数からの人数換算は独自推定となるため行わない)';

export const PRIVATE_SCHOOL_DETAIL_SHIMANE: PrivateSchoolDetailFile = {
  prefectureCode: 'shimane',
  schools: [],
  skipped: [
    { schoolCode: 'D132320100380', schoolName: '開星高等学校', reason: REASON },
    { schoolCode: 'D132320100399', schoolName: '立正大学淞南高等学校', reason: REASON },
    { schoolCode: 'D132320100406', schoolName: '松徳学院高等学校', reason: REASON },
    { schoolCode: 'D132320100415', schoolName: '松江西高等学校', reason: REASON },
    { schoolCode: 'D132320300422', schoolName: '出雲北陵高等学校', reason: REASON },
    { schoolCode: 'D132320300431', schoolName: '出雲西高等学校', reason: REASON },
    { schoolCode: 'D132320400467', schoolName: '明誠高等学校', reason: REASON },
    { schoolCode: 'D132320400476', schoolName: '益田東高等学校', reason: REASON },
    { schoolCode: 'D132320700446', schoolName: '石見智翠館高等学校', reason: REASON },
    { schoolCode: 'D132320700455', schoolName: 'キリスト教愛真高等学校', reason: REASON },
  ],
};
