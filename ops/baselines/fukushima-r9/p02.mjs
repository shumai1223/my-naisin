import { patch } from './patchlib.mjs';
const D = ['商業科・情報ビジネス科', '商業科・経営ビジネス科', '商業科・会計ビジネス科'];
const list = [];
for (const dept of D) {
  list.push({ school: '福島商業', dept, cat: '一般選抜', subs: [
    ['interviewRequired: true,', 'interviewRequired: false,'],
    ['一般面接は個人面接で段階評価。特色選抜との併願者は特色面接をもって一般面接の実施とみなす', '一般面接は実施しない(令和9年度版。令和8年度版は個人面接を実施していた)'],
  ]});
  list.push({ school: '福島商業', dept, cat: '後期選抜', subs: [['あるテーマについて600字以内で', 'あるテーマについて400字〜600字で']] });
}
list.push({ school: '福島商業', dept: '商業科・情報ビジネス科', cat: '特色選抜', subs: [['選抜資料の満点はA型610点', '志願してほしい生徒像に③経済産業省認定の情報処理技術者試験等の資格取得に積極的に挑戦する者が加わる(令和9年度版)。選抜資料の満点はA型610点']] });
patch(list);
