// T-Y14 wakayama: 令和8年度和歌山県立高等学校入学者選抜選考基準(別表1・全7頁)を目視転記(pdftoppm 100dpi・画像表示を確認しながら)。
// 元PDF: https://www.pref.wakayama.lg.jp/prefg/500200/d00220765_d/fil/senkoukijun_beppyou1.pdf (県ページ https://www.pref.wakayama.lg.jp/prefg/500200/d00220765.html)
// 行: w(課程, 学校, 学科, 調査書割合%, 調査書傾斜評価, 学力検査割合%, 学力検査傾斜配点, 面接実技割合%|null, 面接実技内容|null, 備考)
// 割合の合計(調査書+学力検査+面接実技)が100%になることを check.mjs で検算する。null=空欄。頁番号は元資料の(その N)。
export const B1 = [];
const w = (course, school, dept, cho, choK, gaku, gakuK, itv, itvC, memo) => B1.push({ course, school, dept, cho, choK, gaku, gakuK, itv, itvC, memo: memo || '' });
const Z = '全日制';
// (その1)
w(Z, '橋本', '探究科', 40, null, 60, null, null, null);
w(Z, '紀北工業', '機械科', 40, null, 60, null, null, null);
w(Z, '紀北工業', '電気科', 40, null, 60, null, null, null);
w(Z, '紀北工業', 'システム化学科', 40, null, 60, null, null, null);
w(Z, '紀北農芸', '生産流通科', 40, null, 60, null, null, null);
w(Z, '紀北農芸', '施設園芸科', 40, null, 60, null, null, null);
w(Z, '紀北農芸', '環境工学科', 40, null, 60, null, null, null);
w(Z, '笠田', '普通科', 50, null, 50, null, null, null);
w(Z, '笠田', '商業科系', 50, null, 50, null, null, null, '笠田高等学校は総合ビジネス科及び情報処理科を「商業科系」とする');
// (その2)
w(Z, '粉河', '普通科系', 30, null, 70, null, null, null, '粉河高等学校は普通科及び理数科を「普通科系」とする');
w(Z, '那賀', '普通科', 30, null, 70, null, null, null);
w(Z, '那賀', '国際科', 30, null, 70, '国1.5・英1.5', null, null);
w(Z, '貴志川', '普通科', 50, null, 50, null, null, null);
w(Z, '和歌山北', '普通科(北校舎)', 50, null, 50, null, null, '※3', '※3 和歌山北高等学校スポーツ健康科学科を第2志望とする者は、スポーツ健康科学科が実施する面接・実技検査を受けること');
w(Z, '和歌山北', '普通科(西校舎)', 50, null, 50, null, null, '※3', '※3 和歌山北高等学校スポーツ健康科学科を第2志望とする者は、スポーツ健康科学科が実施する面接・実技検査を受けること');
w(Z, '和歌山北', 'スポーツ健康科学科', 30, null, 30, null, 40, '面・実');
w(Z, '和歌山', '総合学科', 50, null, 50, null, null, null);
w(Z, '向陽', '普通科', 30, null, 70, null, null, null);
// (その3)
w(Z, '桐蔭', '普通科', 30, null, 70, null, null, null);
w(Z, '和歌山東', '普通科', 40, null, 40, null, 20, '面');
w(Z, '星林', '普通科', 30, null, 70, '英1.5', null, null);
w(Z, '星林', '国際交流科', 30, null, 70, '英1.5', null, null);
for (const d of ['機械科', '電気科', '化学技術科', '建築科', '土木科', '産業デザイン科', '創造技術科']) w(Z, '和歌山工業', d, 40, null, 60, null, null, null);
w(Z, '和歌山商業', 'ビジネス創造科', 40, null, 60, null, null, null);
// (その4) 学校名欄の「( 美里分校 )」等は資料の表記のまま分校名として収録する
w(Z, '海南', '普通科系(海南校舎)', 30, null, 70, null, null, null, '海南高等学校は普通科(海南校舎)及び教養理学科を「普通科系(海南校舎)」とする');
w(Z, '海南', '普通科(大成校舎)', 50, null, 50, null, null, null);
w(Z, '美里分校', '普通科', 50, null, 50, null, null, null);
w(Z, '箕島', '普通科・情報経営科系', 50, null, 50, null, null, null, '箕島高等学校は普通科普通コース・普通科スポーツコース及び情報経営科を「普通科・情報経営科系」とする');
w(Z, '箕島', '機械科', 50, null, 50, null, null, null);
w(Z, '有田中央', '総合学科(総合)', 35, null, 35, null, 30, '面');
w(Z, '有田中央', '総合学科(福祉)', 30, null, 40, null, 30, '面');
w(Z, '清水分校', '普通科', 40, null, 60, null, null, null);
w(Z, '耐久', '普通科', 40, null, 60, null, null, null);
// (その5)
w(Z, '日高', '普通科', 30, null, 70, null, null, null);
w(Z, '中津分校', '普通科', 40, null, 60, null, null, null);
w(Z, '紀央館', '普通科', 30, null, 70, null, null, null);
w(Z, '紀央館', '工業技術科', 30, null, 70, null, null, null);
w(Z, '南部', '普通科', 50, null, 50, null, null, null);
w(Z, '南部', '食と農園科(園芸・加工流通)', 50, null, 50, null, null, null);
w(Z, '南部', '食と農園科(調理)', 50, null, 50, null, null, null);
w(Z, '龍神分校', '普通科', 50, null, 50, null, null, null);
w(Z, '田辺', '普通科', 30, null, 70, null, null, null);
w(Z, '田辺工業', '機械科', 50, null, 50, null, null, null);
w(Z, '田辺工業', '電気電子科', 50, null, 50, null, null, null);
w(Z, '田辺工業', '情報システム科', 50, null, 50, null, null, null);
// (その6)
w(Z, '神島', '普通科', 40, null, 60, null, null, null);
w(Z, '神島', '経営科学科', 40, null, 60, null, null, null);
w(Z, '熊野', '看護科', 40, null, 60, null, null, null);
w(Z, '熊野', '総合学科', 40, null, 60, null, null, null);
w(Z, '串本古座', '未来創造学科(宇宙探究)', 40, null, 60, null, null, null);
w(Z, '串本古座', '未来創造学科(地域探究・文理探究)', 40, null, 60, null, null, null);
w(Z, '新宮', '普通科', 30, null, 70, null, null, null);
w(Z, '新宮', '学彩探究科', 30, null, 70, null, null, null);
w(Z, '新宮', '総合学科', 40, null, 60, null, null, null);
// (その7・定時制) 昼夜で行が結合されている行(伊都中央・きのくに青雲・南紀)は昼間と夜間の両方に同じ割合を記録する
const T = '定時制';
for (const d of ['普通科(昼間)', '普通科(夜間)']) w(T, '伊都中央', d, 30, null, 40, null, 30, '面');
for (const d of ['普通科(昼間)', '普通科(夜間)', '情報会計科(夜間)']) w(T, 'きのくに青雲', d, 50, null, 50, null, null, null);
w(T, '和歌山工業', '機械電気科(夜間)', 50, null, 50, null, null, null);
w(T, '和歌山工業', '建築科(夜間)', 50, null, 50, null, null, null);
w(T, '耐久', '普通科(夜間)', 30, null, 30, null, 40, '面');
w(T, '日高', '普通科(夜間)', 30, null, 30, null, 40, '面');
for (const d of ['普通科(昼間)', '普通科(夜間)']) w(T, '南紀', d, 30, null, 30, null, 40, '面');
w(T, '新宮', '普通科(昼間)(新翔校舎)', 40, null, 40, null, 20, '面');
w(T, '新宮', '普通科(夜間)(新宮校舎)', 40, null, 40, null, 20, '面');
