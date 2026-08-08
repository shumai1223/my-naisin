'use client';

import * as React from 'react';

import { SUBJECTS } from '@/lib/constants';
import type { Scores, SubjectKey } from '@/lib/types';

import { SubjectSlider } from './SubjectSlider';

export interface InputFormProps {
  prefectureCode: string;
  scores: Scores;
  onChange: (key: SubjectKey, nextValue: number) => void;
  maxGrade?: number;
  initiallyTouched?: Partial<Record<SubjectKey, boolean>>;
}

/**
 * 2026-08-01 Cowork実地UXテストで指摘: 全教科の初期値が3のため、通知表どおり入力したつもりで
 * 変更し忘れた教科が見た目上区別できない事故が起きる（「未変更の教科が分かる表示を検討」）。
 * 各教科を一度でも操作した（onChangeが呼ばれた）かどうかをtouchedとして自己完結で保持し、
 * 未操作の教科にだけ「未確認」の視覚強調をSubjectSlider側で出す。value===初期値の比較ではなく
 * 実際の操作有無で判定するため、本当に評定3の教科をクイック選択等で明示的に確定した場合も
 * 正しく解消される（初期値と同じ値のまま=まだ触っていない、という誤検知を避ける設計）。
 *
 * 2026-08-08 👤裁定(loop-question-note): localStorage復元・URL引き継ぎで入った教科は
 * 「確認済み」として扱う(バッジを出さない)。親(HomeClient)が復元と同時に渡すinitiallyTouchedを
 * 一度だけtouchedへ合流させる。親の再マウントを伴わない復元(useEffect経由)に対応するため
 * useState初期値ではなくuseEffectで反映する。
 */
export function InputForm({ prefectureCode, scores, onChange, maxGrade = 5, initiallyTouched }: InputFormProps) {
  const [touched, setTouched] = React.useState<Partial<Record<SubjectKey, boolean>>>({});
  const appliedInitialTouchedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initiallyTouched || appliedInitialTouchedRef.current) return;
    appliedInitialTouchedRef.current = true;
    setTouched((prev) => ({ ...prev, ...initiallyTouched }));
  }, [initiallyTouched]);

  const handleChange = (key: SubjectKey, nextValue: number) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    onChange(key, nextValue);
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {SUBJECTS.map((subject) => (
        <SubjectSlider
          key={subject.key}
          subject={subject}
          prefectureCode={prefectureCode}
          value={scores[subject.key]}
          onChange={(next) => handleChange(subject.key, next)}
          maxGrade={maxGrade}
          isUnconfirmed={!touched[subject.key]}
        />
      ))}
    </div>
  );
}
