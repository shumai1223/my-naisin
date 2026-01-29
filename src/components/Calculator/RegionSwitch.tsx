"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

interface RegionSwitchProps {
  prefectureCode: string;
  onChange?: (code: string) => void;
  className?: string;
}

/**
 * RegionSwitch (placeholder)
 * 現在のUIでは PrefectureSelector を直接使用しているため、このコンポーネントは
 * 互換性維持のためのスタブとして残しています。
 * - 東京方式(換算モード)は廃止済み
 * - 都道府県切替は PrefectureSelector で行います
 */
export function RegionSwitch({ prefectureCode, className }: RegionSwitchProps) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm " +
        (className ?? "")
      }
    >
      <MapPin className="h-4 w-4 text-slate-500" />
      <span>選択中: {prefectureCode}</span>
      <span className="text-xs text-slate-400">(切替は下の都道府県セレクターで)</span>
    </div>
  );
}
