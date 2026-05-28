import { BlogPost } from '@/lib/blog/types';
import { POST_FAQS } from '@/lib/blog/faqs';
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
// all-3-high-school-options（旧版）は all-3-high-school-options-2026-update へ 301 redirect 済み（next.config.mjs）。
// 旧URLが Google にインデックスされ続けるカニバリ防止のため、サイト内の一覧からは外す。
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

// New posts
import { post as naishinSimulatorCompleteGuide2026 } from '@/lib/blog/posts/2026-naishin-simulator-complete-guide';
import { post as all3HighSchoolOptions2026Update } from '@/lib/blog/posts/all-3-high-school-options-2026-update';
import { generatePrefectureBlogPosts } from '@/lib/blog/prefecture-blog-generator';
import { post as toritsuNyushi2026KanzenGuide } from '@/lib/blog/posts/toritsu-nyushi-2026-kanzen-guide';
import { post as practicalSubjectsAll5Strategy2026Update } from '@/lib/blog/posts/practical-subjects-all-5-strategy-2026-update';
import { post as whatIsNaishinten } from '@/lib/blog/posts/what-is-naishinten';
import { post as summerVacationGoldenRatio } from '@/lib/blog/posts/summer-vacation-review-preview-golden-ratio';
import { post as hensachiKoukouIchiran2026 } from '@/lib/blog/posts/hensachi-koukou-ichiran-2026';
import { post as hyoteiHeikin40HighSchool } from '@/lib/blog/posts/hyotei-heikin-4-0-high-school';
import { post as hyoteiHeikin35HighSchool } from '@/lib/blog/posts/hyotei-heikin-3-5-high-school';
import { post as hyoteiHeikin45HighSchool } from '@/lib/blog/posts/hyotei-heikin-4-5-high-school';
import { post as naishinten27HighSchool } from '@/lib/blog/posts/naishinten-27-high-school';
import { post as naishinten30HighSchool } from '@/lib/blog/posts/naishinten-30-high-school';
import { post as parentHyoteiHeikinSuisenGuide } from '@/lib/blog/posts/parent-hyotei-heikin-suisen-guide';

// Articles whose date should be refreshed (old 2025-05-01 articles)
const FRESHEN_DATE = '2026-05-11';
const SLUGS_TO_FRESHEN = new Set([
  'jitsugi-kyoka-prefecture-comparison',
  'naishinten-average-score',
  'practical-subjects-tips',
  'naishin-target-grades-by-prefecture',
]);

function enrichPost(post: BlogPost): BlogPost {
  const faqs = POST_FAQS[post.slug];
  const refreshed = SLUGS_TO_FRESHEN.has(post.slug)
    ? { ...post, lastUpdated: FRESHEN_DATE }
    : post;
  return faqs && faqs.length > 0
    ? { ...refreshed, faqs: refreshed.faqs && refreshed.faqs.length > 0 ? refreshed.faqs : faqs }
    : refreshed;
}

const HAND_WRITTEN_POSTS: BlogPost[] = [
  parentHyoteiHeikinSuisenGuide,
  hyoteiHeikin45HighSchool,
  hyoteiHeikin40HighSchool,
  hyoteiHeikin35HighSchool,
  naishinten27HighSchool,
  naishinten30HighSchool,
  hensachiKoukouIchiran2026,
  summerVacationGoldenRatio,
  toritsuNyushi2026KanzenGuide,
  naishinSimulatorCompleteGuide2026,
  all3HighSchoolOptions2026Update,
  practicalSubjectsAll5Strategy2026Update,
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
  naishintenNotEnoughStrategies,
  naishintenFromJunior1,
  teikiTestAndNaishinten,
  teishutsubutsuJugyouTaidoGuide,
  futoukouNaishintenHighSchool,
  naishintenHighSchoolExamSystem,
  whatIsNaishinten,
];

// 47都道府県の内申点計算ガイドを自動生成（手書き記事と重複するスラッグは除外）
const GENERATED_PREFECTURE_POSTS: BlogPost[] = generatePrefectureBlogPosts();

export const BLOG_POSTS: BlogPost[] = [
  ...HAND_WRITTEN_POSTS,
  ...GENERATED_PREFECTURE_POSTS,
].map(enrichPost);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
