# このディレクトリは放棄済み（2026-09-23確認）

`parse.py`/`mkrecs.py`/`tokubetsu*.py`はT-Y14 saga一般選抜のR9更新を試みた2026-09-21セッションの
試作スクリプト。**この試作は使われていない**。実際のsaga.ts更新は別ディレクトリ
`ops/baselines/saga-transcription/`（data.mjs/data2.mjs/data3.mjs/gen.mjs）での手動transcriptionで
行われ、commit `c3a890a`（令和9年度版更新）・`6c1c52a`（特別選抜追加）としてすでに完了・push済み。

2026-09-23のセッションがworklogの古い記述（「一般選抜が複数学科の結合表で未対応」）を鵜呑みにして
このディレクトリを再調査したが、`src/data/school-selection-methods/saga.ts`のgit logを見て
完了済みと判明した。**教訓: worklogの「次回候補」記述は着手前に必ず対象ファイルのgit log/現在の
中身で裏取りすること**（[[feedback-verify-data-via-files-not-lib-comments]]と同型）。
