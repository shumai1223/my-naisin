'use client';

import * as React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Hexagon } from 'lucide-react';

import type { Scores, ScoreMode } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';

export interface RadarChartProps {
  scores: Scores;
  mode: ScoreMode;
}

export function RadarChart({ scores, mode }: RadarChartProps) {
  // Filter subjects based on mode
  const subjects = React.useMemo(() => {
    if (mode === 'tokyo') {
      // Tokyo mode: 5 main subjects get more weight
      return SUBJECTS;
    }
    return SUBJECTS;
  }, [mode]);

  // Prepare data for radar chart
  const chartData = React.useMemo(() => {
    return subjects.map((subject) => ({
      subject: subject.label,
      score: scores[subject.key],
      fullMark: 5,
    }));
  }, [subjects, scores]);

  // Calculate average score
  const averageScore = React.useMemo(() => {
    const total = subjects.reduce((sum, s) => sum + scores[s.key], 0);
    return (total / subjects.length).toFixed(1);
  }, [subjects, scores]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-bold text-slate-700">{data.subject}</p>
          <p className="text-lg font-bold text-blue-600">{data.score}<span className="text-xs text-slate-400">/5</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="relative border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
              <Hexagon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">教科バランス</h3>
              <p className="text-xs text-slate-500">Subject Balance Chart</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/80 px-4 py-2 shadow-sm">
            <div className="text-xs text-slate-500">平均</div>
            <div className="text-lg font-bold text-indigo-600">{averageScore}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative p-4">
        <div className="mx-auto h-[280px] w-full max-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <PolarGrid 
                stroke="#e2e8f0" 
                strokeWidth={1}
                gridType="polygon"
              />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ 
                  fill: '#475569', 
                  fontSize: 11, 
                  fontWeight: 600 
                }}
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 5]} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickCount={6}
                axisLine={false}
              />
              <Radar
                name="内申点"
                dataKey="score"
                stroke="url(#radarStroke)"
                fill="url(#radarGradient)"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: '#6366f1',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#6366f1',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <span className="text-xs font-medium text-slate-600">あなたの成績</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white" />
            <span className="text-xs font-medium text-slate-500">満点(5)</span>
          </div>
        </div>
      </div>

      {/* Bottom tip */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
        <p className="text-center text-xs text-slate-500">
          📊 バランスの取れた成績を目指しましょう！苦手科目を克服すると内申点が大きく伸びます
        </p>
      </div>
    </div>
  );
}
