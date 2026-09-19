import fs from 'fs';
const src='../nara-transcription/';
// data.mjs
let d=fs.readFileSync(src+'data.mjs','utf8');
const rep=(s,a,b,label)=>{ if(!s.includes(a)) throw new Error('未検出: '+(label||a.slice(0,50))); return s.split(a).join(b); };
d=rep(d,"'市立全日制', '5', 250, 0, 0, 0, 0, 250, '①', '', 144, 20, 10);","'市立全日制', '5', 250, 0, 0, 0, 0, 250, '①', '', 144);","一条");
d=d.replace(/令和8年度奈良県立高等学校入学者選抜概要/,'令和9年度奈良県立高等学校入学者選抜概要');
d=d.replace(/を目視転記。?/,'(令和8年度版の転記)を令和9年度版(ops/baselines/nara-r9)と突合して更新した。奈良市立一条の合格人数枠(20名・10点)は令和9年度版で「―」。');
fs.writeFileSync('data.mjs',d);
// data2.mjs
let e=fs.readFileSync(src+'data2.mjs','utf8');
let cnt=0;
e=e.split('\n').map(l=>{ if(!/^n\(/.test(l))return l; const m=l.match(/^(n\('[^']*', \[[^\]]*\], (?:[A-Za-z_]+|'[^']*'), \d+, )(\d+)(, '.*)$/); if(!m) throw new Error('n行の形式不一致: '+l.slice(0,80)); cnt++; return m[1]+'0'+m[3]; }).join('\n');
e=rep(e,"n('奈良北', ['普通科', '数理情報科'], Z, 270,","n('奈良北', ['普通科', '数理情報科'], Z, 300,","奈良北");
fs.writeFileSync('data2.mjs',e);
console.log('n-lines updated',cnt);

