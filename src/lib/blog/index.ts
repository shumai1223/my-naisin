import { BlogPost } from '@/lib/blog/types';
import { post as naishinGuide } from '@/lib/blog/posts/naishin-guide';
import { post as improveGradesFromAll3 } from '@/lib/blog/posts/improve-grades-from-all-3';
import { post as naishinEvaluationCriteria3Points } from '@/lib/blog/posts/naishin-evaluation-criteria-3-points';
import { post as tokyoNaishinCalculationGuide } from '@/lib/blog/posts/tokyo-naishin-calculation-guide';
import { post as kanagawaNaishinCalculationGuide } from '@/lib/blog/posts/kanagawa-naishin-calculation-guide';
import { post as chibaNaishinCalculationGuide } from '@/lib/blog/posts/chiba-naishin-calculation-guide';
import { post as practicalSubjectsNaishinStrategy } from '@/lib/blog/posts/practical-subjects-naishin-strategy';
import { post as tokyoKansanNaishinGuide } from '@/lib/blog/posts/tokyo-kansan-naishin-guide';
import { post as practicalSubjectsTips } from '@/lib/blog/posts/practical-subjects-tips';
import { post as kansanNaishinVsSuNaishin } from '@/lib/blog/posts/kansan-naishin-vs-su-naishin';
import { post as jitsugiKyokaPrefectureComparison } from '@/lib/blog/posts/jitsugi-kyoka-prefecture-comparison';
import { post as naishinTargetGradesByPrefecture } from '@/lib/blog/posts/naishin-target-grades-by-prefecture';
import { post as fukukyokaBairitsuByPrefecture } from '@/lib/blog/posts/fukukyoka-bairitsu-by-prefecture';

import { post as naishintenAverageScore } from '@/lib/blog/posts/naishinten-average-score';
import { post as howToRaiseNaishinten } from '@/lib/blog/posts/how-to-raise-naishinten';
import { post as all3HighSchoolOptions } from '@/lib/blog/posts/all-3-high-school-options';
import { post as naishintenNotEnoughStrategies } from '@/lib/blog/posts/naishinten-not-enough-strategies';
import { post as naishintenFromJunior1 } from '@/lib/blog/posts/naishinten-from-junior-1';
import { post as teikiTestAndNaishinten } from '@/lib/blog/posts/teiki-test-and-naishinten';
import { post as teishutsubutsuJugyouTaidoGuide } from '@/lib/blog/posts/teishutsubutsu-jugyou-taido-guide';
import { post as futoukouNaishintenHighSchool } from '@/lib/blog/posts/futoukou-naishinten-high-school';
import { post as naishintenHighSchoolExamSystem } from '@/lib/blog/posts/naishinten-high-school-exam-system';
import { post as naishinReversalStrategy2026 } from '@/lib/blog/posts/2026-naishin-reversal-strategy';
import { post as parentSupportGuide2026 } from '@/lib/blog/posts/2026-parent-support-guide';
import { post as futoukouNaishintenReversal } from '@/lib/blog/posts/futoukou-naishinten-reversal';
import { post as practicalSubjectsAll5Strategy } from '@/lib/blog/posts/practical-subjects-all-5-strategy';
import { post as practicalSubjectsAll5Strategy2026 } from '@/lib/blog/posts/practical-subjects-all-5-strategy-2026';
import { post as aprilNaishinRecoveryPlan } from '@/lib/blog/posts/april-naishin-recovery-plan';
import { post as smartSmartphoneUsage } from '@/lib/blog/posts/smart-smartphone-usage-for-exams';
import { post as howToChooseHighSchool2026 } from '@/lib/blog/posts/how-to-choose-high-school-2026';
import { post as latestExamTrendsNaishin2026 } from '@/lib/blog/posts/2026-latest-exam-trends-naishin';
import { post as understandingJitsugikyokaGrading2026 } from '@/lib/blog/posts/understanding-jitsugikyoka-grading-2026';
import { post as newSemesterChecklist2026 } from '@/lib/blog/posts/2026-new-semester-naishin-checklist';

export const BLOG_POSTS: BlogPost[] = [
  newSemesterChecklist2026,
  latestExamTrendsNaishin2026,
  practicalSubjectsAll5Strategy2026,
  understandingJitsugikyokaGrading2026,
  smartSmartphoneUsage,
  howToChooseHighSchool2026,
  naishinReversalStrategy2026,
  parentSupportGuide2026,
  aprilNaishinRecoveryPlan,
  futoukouNaishintenReversal,
  practicalSubjectsAll5Strategy,
  naishinGuide,
  improveGradesFromAll3,
  naishinEvaluationCriteria3Points,
  tokyoNaishinCalculationGuide,
  kanagawaNaishinCalculationGuide,
  chibaNaishinCalculationGuide,
  practicalSubjectsNaishinStrategy,
  tokyoKansanNaishinGuide,
  practicalSubjectsTips,
  kansanNaishinVsSuNaishin,
  jitsugiKyokaPrefectureComparison,
  naishinTargetGradesByPrefecture,
  fukukyokaBairitsuByPrefecture,
  
  naishintenAverageScore,
  howToRaiseNaishinten,
  all3HighSchoolOptions,
  naishintenNotEnoughStrategies,
  naishintenFromJunior1,
  teikiTestAndNaishinten,
  teishutsubutsuJugyouTaidoGuide,
  futoukouNaishintenHighSchool,
  naishintenHighSchoolExamSystem,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
