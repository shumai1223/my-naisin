'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';

const TIMER_PRESETS = [
  { label: '5分', seconds: 5 * 60, icon: Zap, color: 'from-green-400 to-emerald-500' },
  { label: '15分', seconds: 15 * 60, icon: Brain, color: 'from-blue-400 to-indigo-500' },
  { label: '25分', seconds: 25 * 60, icon: Timer, color: 'from-purple-400 to-violet-500' },
  { label: '休憩5分', seconds: 5 * 60, icon: Coffee, color: 'from-amber-400 to-orange-500', isBreak: true },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 text-white relative overflow-hidden">
        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 backdrop-blur-sm z-10"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-lg font-bold">お疲れ様！</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Timer className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">⏱️ クイック勉強タイマー</h3>
              <p className="text-sm text-white/80">集中して勉強しよう！</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/80">累計勉強時間</div>
            <div className="text-lg font-bold">{formatTotalTime(totalTime)}</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {selectedPreset === null ? (
          <>
            {/* Preset selection */}
            <div className="grid grid-cols-2 gap-3">
              {TIMER_PRESETS.map((preset, index) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={index}
                    onClick={() => startTimer(index)}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${preset.color} text-white hover:shadow-lg transition-all hover:scale-[1.02]`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-bold">{preset.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 text-center text-xs text-slate-500">
              タイマーを選んでスタート！ポモドーロ法で効率的に勉強しよう
            </div>
          </>
        ) : (
          <>
            {/* Timer display */}
            <div className="relative mb-4">
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full bg-gradient-to-r ${TIMER_PRESETS[selectedPreset].color} rounded-full`}
                />
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-5xl font-black text-slate-800 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {TIMER_PRESETS[selectedPreset].label}
                {TIMER_PRESETS[selectedPreset].isBreak && ' (休憩中)'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
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
                onClick={resetTimer}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                リセット
              </button>
            </div>
          </>
        )}

        {/* Tips */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border border-indigo-200">
          <p className="text-xs text-indigo-700 text-center">
            💡 25分勉強→5分休憩のポモドーロ法で集中力UP！
          </p>
        </div>
      </div>
    </motion.div>
  );
}
