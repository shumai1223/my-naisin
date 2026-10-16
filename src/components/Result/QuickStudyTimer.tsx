'use client';

import * as React from 'react';
import { Play, Pause, RotateCcw } from '@/components/icons';

const TIMER_PRESETS = [
  { label: '5分', seconds: 5 * 60 },
  { label: '15分', seconds: 15 * 60 },
  { label: '25分', seconds: 25 * 60 },
  { label: '休憩5分', seconds: 5 * 60, isBreak: true },
];

const TOTAL_STUDY_KEY = 'my-naishin:total-study-time';

function getTotalStudyTime(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(TOTAL_STUDY_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function addStudyTime(seconds: number) {
  if (typeof window === 'undefined') return;
  try {
    const current = getTotalStudyTime();
    localStorage.setItem(TOTAL_STUDY_KEY, String(current + seconds));
  } catch {
    // ignore
  }
}

export function QuickStudyTimer() {
  const [selectedPreset, setSelectedPreset] = React.useState<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [totalTime, setTotalTime] = React.useState(0);
  const [showComplete, setShowComplete] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    setTotalTime(getTotalStudyTime());
  }, []);

  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            const elapsed = TIMER_PRESETS[selectedPreset!]?.seconds || 0;
            if (!TIMER_PRESETS[selectedPreset!]?.isBreak) {
              addStudyTime(elapsed);
              setTotalTime(getTotalStudyTime());
            }
            setShowComplete(true);
            setTimeout(() => setShowComplete(false), 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, selectedPreset]);

  const startTimer = (presetIndex: number) => {
    setSelectedPreset(presetIndex);
    setTimeLeft(TIMER_PRESETS[presetIndex].seconds);
    setIsRunning(true);
    startTimeRef.current = Date.now();
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Pause - save elapsed time
      const elapsed = TIMER_PRESETS[selectedPreset!]?.seconds - timeLeft;
      if (!TIMER_PRESETS[selectedPreset!]?.isBreak && elapsed > 60) {
        addStudyTime(elapsed);
        setTotalTime(getTotalStudyTime());
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelectedPreset(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const progress = selectedPreset !== null && TIMER_PRESETS[selectedPreset]
    ? ((TIMER_PRESETS[selectedPreset].seconds - timeLeft) / TIMER_PRESETS[selectedPreset].seconds) * 100
    : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">クイック勉強タイマー</h3>
          {/* タイマー終了時は3秒間だけ文言を切り替える（読み上げ対象） */}
          <p
            role="status"
            className={`mt-1 text-sm ${showComplete ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            {showComplete ? 'お疲れさまでした' : '集中して勉強しよう'}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-600">累計勉強時間</div>
          <div className="text-lg font-bold tabular-nums text-slate-900">{formatTotalTime(totalTime)}</div>
        </div>
      </div>

      <div className="mt-4">
        {selectedPreset === null ? (
          <>
            {/* Preset selection */}
            <div className="grid grid-cols-2 gap-3">
              {TIMER_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => startTimer(index)}
                  className="inline-flex min-h-11 items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-slate-600">
              タイマーを選ぶとスタートします。
            </p>
          </>
        ) : (
          <>
            {/* Timer display */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 text-center">
              <div className="font-mono text-5xl font-bold tabular-nums text-slate-900">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {TIMER_PRESETS[selectedPreset].label}
                {TIMER_PRESETS[selectedPreset].isBreak && ' (休憩中)'}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleTimer}
                className="inline-flex min-h-11 items-center gap-2 rounded bg-brand-700 px-6 py-3 text-base font-bold text-white hover:bg-brand-800"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5" />
                    一時停止
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    再開
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="inline-flex min-h-11 items-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
              >
                <RotateCcw className="h-4 w-4" />
                リセット
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <p className="text-sm font-bold text-slate-900">ポイント</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-900">
          25分勉強→5分休憩を繰り返す「ポモドーロ法」で、区切りをつけて勉強できます。
        </p>
      </div>
    </div>
  );
}
