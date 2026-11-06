/**
 * @jest-environment node
 */
import assignmentFile from '@/data/school-serp-experiment-2026-11.json';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { INDEXED_SCHOOL_PAGE_PREFECTURE_CODES, getPrefectureSchoolPageData } from '@/lib/school-page-lookup';
import { isPublicationRefused } from '@/lib/publication-refused-prefectures';
import {
  buildSchoolSerpText,
  extractReiwaLabel,
  getSchoolSerpArm,
  type SchoolSerpArm,
} from '@/lib/school-serp-experiment';

const BASE = {
  displayName: '鎌倉高等学校（鎌倉高校）',
  prefectureName: '神奈川県',
  overallRate: 1.23,
  totalQuota: 320,
  totalApplicants: 394,
  fiscalLabel: '令和8年度',
};

/** 実験導入前の page.tsx の文言（1文字も変えないことを固定する）。 */
const LEGACY_TITLE = `${BASE.displayName}の入試倍率・募集人員 | My Naishin`;
const LEGACY_DESCRIPTION = `${BASE.displayName}(${BASE.prefectureName})の今季入試倍率${BASE.overallRate}倍・募集人員${BASE.totalQuota}名・応募者数${BASE.totalApplicants}名。教育委員会公表の一次データに基づく。`;

describe('buildSchoolSerpText', () => {
  it('割り当てなし(null)とA群は、実験導入前と1文字も違わない', () => {
    for (const arm of [null, 'A'] as const) {
      const t = buildSchoolSerpText({ ...BASE, arm });
      expect(t.title).toBe(LEGACY_TITLE);
      expect(t.description).toBe(LEGACY_DESCRIPTION);
    }
  });

  it('B群: titleに収録年度が入り、校名と「倍率」が残る。descriptionは現行のまま', () => {
    const t = buildSchoolSerpText({ ...BASE, arm: 'B' });
    expect(t.title).toBe('鎌倉高等学校（鎌倉高校）の入試倍率（令和8年度）・募集人員 | My Naishin');
    expect(t.title).toContain(BASE.displayName);
    expect(t.title).toContain('倍率');
    expect(t.description).toBe(LEGACY_DESCRIPTION);
  });

  it('B群でも、年度が読み取れないときは現行のtitleにする（年度を推測しない）', () => {
    const t = buildSchoolSerpText({ ...BASE, arm: 'B', fiscalLabel: null });
    expect(t.title).toBe(LEGACY_TITLE);
  });

  it('C群: descriptionから倍率の数値が消え、titleは現行のまま', () => {
    const t = buildSchoolSerpText({ ...BASE, arm: 'C' });
    expect(t.title).toBe(LEGACY_TITLE);
    expect(t.description).not.toContain(String(BASE.overallRate));
    expect(t.description).not.toContain('今季');
    expect(t.description).toContain(BASE.displayName);
    expect(t.description).toContain('倍率');
  });
});

describe('extractReiwaLabel', () => {
  it('「令和8年度（2026年度）」から「令和8年度」を取り出す', () => {
    expect(extractReiwaLabel('令和8年度（2026年度）')).toBe('令和8年度');
    expect(extractReiwaLabel('令和10年度')).toBe('令和10年度');
  });
  it('読み取れないときは null', () => {
    expect(extractReiwaLabel(undefined)).toBeNull();
    expect(extractReiwaLabel('2026年度')).toBeNull();
  });
});

describe('割り当て表 school-serp-experiment-2026-11.json', () => {
  const entries = Object.entries(assignmentFile.assignment as Record<string, SchoolSerpArm>);

  it('3群がほぼ同数で、群の値は A/B/C のみ', () => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
    for (const [, arm] of entries) {
      expect(['A', 'B', 'C']).toContain(arm);
      counts[arm]++;
    }
    expect(entries.length).toBe(assignmentFile.eligibleSchools);
    expect(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))).toBeLessThanOrEqual(2);
  });

  it('index済みの県だけで、掲載を断られた県を含まない', () => {
    for (const [key] of entries) {
      const code = key.split('/')[0];
      expect(INDEXED_SCHOOL_PAGE_PREFECTURE_CODES).toContain(code);
      expect(isPublicationRefused(code)).toBe(false);
    }
  });

  it('全ての割り当てが実在する学校ページに対応し、getSchoolSerpArmで引ける', () => {
    const byPref = new Map<string, Set<string>>();
    for (const [key, arm] of entries) {
      const [code, schoolCode] = key.split('/');
      if (!byPref.has(code)) {
        const data = getPrefectureSchoolPageData(code);
        byPref.set(code, new Set((data?.schools ?? []).map((s) => s.schoolCode)));
      }
      expect(byPref.get(code)!.has(schoolCode)).toBe(true);
      expect(getSchoolSerpArm(code, schoolCode)).toBe(arm);
    }
  });

  it('割り当てのない学校は null（現行のまま）', () => {
    expect(getSchoolSerpArm('tokyo', 'does-not-exist')).toBeNull();
  });

  it('B群の学校は、収録年度が読み取れる（読み取れないとBが現行と同じになり実験が空振りする）', () => {
    for (const [key, arm] of entries) {
      if (arm !== 'B') continue;
      const code = key.split('/')[0];
      const label = extractReiwaLabel(COMPETITION_RATE_BY_PREFECTURE[code]?.sources[0]?.fiscalYear);
      expect(label).not.toBeNull();
    }
  });
});
