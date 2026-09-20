// gen.mjs(令和8年度)から gen-r9.mjs(令和9年度)を作る。R9の学校別PDF(sch/)の「選抜の方法及び割合」を各行に付与し、日程・募集人員・県外の差分を反映する。
import fs from 'fs';
const src = fs.readFileSync('../yamagata-transcription/gen.mjs', 'utf8');
let g = src;
const rep = (o, n) => { if (!g.includes(o)) throw new Error('nf: ' + o.slice(0, 50)); g = g.split(o).join(n); };
rep("import { D } from './data.mjs';", "import { D } from '../yamagata-transcription/data.mjs';\nimport { R9 } from './r9info.mjs';");
rep("const dir = path.dirname(fileURLToPath(import.meta.url));", "const dir = path.dirname(fileURLToPath(import.meta.url));\nfor (const e of D) { const r = R9(e); if (r) Object.assign(e, r.patch, { r9ratio: r.ratio }); }");
rep("const day = e.day === 'A' ? 'A日程(令和8年1月20日)' : 'B日程(令和8年2月3日)';", "const day = e.day === 'A' ? 'A日程(令和9年1月19日)' : 'B日程(令和9年2月2日)';");
rep("県外志願者受入れ:${e.outF ? 'あり(○)' : '", "前期選抜の検査ごとの配点割合(令和9年度・学校別概要PDF):${e.r9ratio}。※検査時間・字数・人数等の詳細は令和8年度の検査方法詳細PDFの値(令和9年度版の詳細は未公表)。県外志願者受入れ:${e.outF ? 'あり(○)' : '");
rep("令和8年度山形県公立高等学校入学者選抜における前期(特色)選抜及び後期(一般)選抜の概要。", "令和9年度山形県公立高等学校入学者選抜における前期(特色)選抜及び後期(一般)選抜の概要(2026-09-20に令和8年度版から差し替え。差分は ops/baselines/yamagata-r9/・検査日程は令和9年1/19(A)・2/2(B))。");
rep("fiscalYear: '令和8年度（2026年度）'", "fiscalYear: '令和9年度（2027年度）'");
rep("url: 'https://www.pref.yamagata.jp/documents/42443/r8senbatsugaikyo.pdf',\n    docTitle: '令和8年度山形県公立高等学校入学者選抜における前期（特色）選抜及び後期（一般）選抜の概要（山形県教育局高校教育課）',", "url: 'https://www.pref.yamagata.jp/documents/49031/r9gaiyou2.pdf',\n    docTitle: '令和9年度山形県公立高等学校入学者選抜における前期（特色）選抜及び後期（一般）選抜の概要（令和8年8月18日更新・山形県教育局高校教育課）',");
rep("検査日程のAは令和8年1月20日・Bは2月3日。", "検査日程のAは令和9年1月19日・Bは令和9年2月2日。前期選抜の検査時間・字数等の詳細は令和8年度の検査方法詳細PDFの値を残している(令和9年度版の詳細PDFは未公表・学校別PDFには検査ごとの配点割合のみ記載)。");
rep("src/data/school-selection-methods/yamagata.ts'", "src/data/school-selection-methods/yamagata.ts'");
fs.writeFileSync('gen-r9.mjs', g.split("'../../../src/data").join("'../../../src/data"));
console.log('gen-r9.mjs written');
