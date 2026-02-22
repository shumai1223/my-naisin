'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getPrefectureByCode } from '@/lib/prefectures';

interface NextActionButtonsProps {
  prefectureCode: string;
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
}

export function NextActionButtons({ prefectureCode, scores, totalScore, maxScore }: NextActionButtonsProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  // 教科別の伸び代を計算
  const calculateSubjectImprovement = () => {
    const subjects = [
      { name: '国語', key: 'japanese', current: scores.japanese || 3 },
      { name: '数学', key: 'math', current: scores.math || 3 },
      { name: '英語', key: 'english', current: scores.english || 3 },
      { name: '理科', key: 'science', current: scores.science || 3 },
      { name: '社会', key: 'social', current: scores.social || 3 },
      { name: '音楽', key: 'music', current: scores.music || 3 },
      { name: '美術', key: 'art', current: scores.art || 3 },
      { name: '保健体育', key: 'pe', current: scores.pe || 3 },
      { name: '技術家庭', key: 'tech', current: scores.tech || 3 },
    ];

    // 実技教科が2倍の県を判定
    const isPracticalDoubled = prefecture?.practicalMultiplier === 2;
    
    return subjects
      .map(subject => {
        const maxScore = 5;
        const improvement = maxScore - subject.current;
        const value = isPracticalDoubled && ['music', 'art', 'pe', 'tech'].includes(subject.key) 
          ? improvement * 2 
          : improvement;
        
        return {
          ...subject,
          improvement,
          value,
          efficiency: isPracticalDoubled && ['music', 'art', 'pe', 'tech'].includes(subject.key) ? 'high' : 'normal'
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const subjectImprovements = calculateSubjectImprovement();
  
  // 県の注意点を取得
  const getPrefectureNotes = () => {
    const notes: Record<string, string[]> = {
      tokyo: [
        '実技4教科は2倍換算で計算されます',
        'ESAT-J（英語スピーキング）が加算されます',
        '換算内申は65点満点→300点満点に換算'
      ],
      kanagawa: [
        'S値方式で判定されます（中2・中3比率）',
        '特色検査を実施する学校があります',
        '学校ごとに内申:学力比率が異なります'
      ],
      osaka: [
        'タイプⅠ〜Ⅴで配点比率が異なります',
        '内申点は10倍に換算されます',
        '専門学科・総合学科は別ルールです'
      ],
      chiba: [
        'K値方式で計算されます',
        '中3のみの評定合計が対象です',
        '学校ごとにK値が異なります'
      ],
      saitama: [
        '標準的な9教科5段階評価です',
        '中3のみの成績が対象です',
        '特色検査を実施する学校があります'
      ]
    };

    return notes[prefectureCode] || [
      '9教科5段階評価で計算されます',
      '中3の成績が主に対象です',
      '学校ごとに独自のルールがあります'
    ];
  };

  const prefectureNotes = getPrefectureNotes();

  return (
    <div className="space-y-4">
      {/* アクションボタン */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* 逆算へ */}
        <Link href={`/reverse?pref=${prefectureCode}&current=${totalScore}`}>
          <Button 
            variant="primary" 
            className="w-full h-14 text-base font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            leftIcon={<Target className="h-5 w-5" />}
          >
            志望校配点で逆算する
          </Button>
        </Link>

        {/* 教科別伸び代ランキング */}
        <div className="group relative">
          <Button 
            variant="secondary" 
            className="w-full h-14 text-base font-bold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            leftIcon={<TrendingUp className="h-5 w-5" />}
          >
            どの教科を上げると効率いい？
          </Button>
          
          {/* ホバー時に表示するランキング */}
          <div className="absolute top-full left-0 right-0 z-50 mt-2 hidden group-hover:block">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 max-h-64 overflow-y-auto">
              <h4 className="font-bold text-slate-800 mb-3 text-sm">教科別の伸び代ランキング</h4>
              <div className="space-y-2">
                {subjectImprovements.slice(0, 5).map((subject, index) => (
                  <div key={subject.key} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">{subject.name}</span>
                      {subject.efficiency === 'high' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">2倍</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">+{subject.improvement}</div>
                      <div className="text-xs text-slate-500">({subject.value}点分)</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                {prefecture?.practicalMultiplier === 2 
                  ? '実技4教科は2倍換算のため効率が高いです'
                  : 'すべての教科が同じ配点です'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 県の注意点 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 mb-2 text-sm">この県の注意点</h4>
            <ul className="space-y-1 text-sm text-amber-700">
              {prefectureNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
