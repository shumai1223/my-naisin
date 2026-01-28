'use client';

import { SUBJECTS } from '@/lib/constants';
import type { ScoreMode, Scores, SubjectKey } from '@/lib/types';

import { SubjectSlider } from './SubjectSlider';

export interface InputFormProps {
  mode: ScoreMode;
  scores: Scores;
  onChange: (key: SubjectKey, nextValue: number) => void;
}

export function InputForm({ mode, scores, onChange }: InputFormProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {SUBJECTS.map((subject) => (
        <SubjectSlider
          key={subject.key}
          subject={subject}
          mode={mode}
          value={scores[subject.key]}
          onChange={(next) => onChange(subject.key, next)}
        />
      ))}
    </div>
  );
}
