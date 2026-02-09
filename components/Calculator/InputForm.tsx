'use client';

import { SUBJECTS } from '@/lib/constants';
import type { Scores, SubjectKey } from '@/lib/types';

import { SubjectSlider } from './SubjectSlider';

export interface InputFormProps {
  prefectureCode: string;
  scores: Scores;
  onChange: (key: SubjectKey, nextValue: number) => void;
  maxGrade?: number;
}

export function InputForm({ prefectureCode, scores, onChange, maxGrade = 5 }: InputFormProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {SUBJECTS.map((subject) => (
        <SubjectSlider
          key={subject.key}
          subject={subject}
          prefectureCode={prefectureCode}
          value={scores[subject.key]}
          onChange={(next) => onChange(subject.key, next)}
          maxGrade={maxGrade}
        />
      ))}
    </div>
  );
}
