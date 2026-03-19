import { notFound, permanentRedirect } from 'next/navigation';
import { getPrefectureByCode } from '@/lib/prefectures';

interface PrefectureIndexPageProps {
  params: Promise<{
    prefecture: string;
  }>;
}

export default async function PrefectureIndexPage({ params }: PrefectureIndexPageProps) {
  const { prefecture } = await params;
  const code = prefecture?.toLowerCase() ?? '';

  const pref = getPrefectureByCode(code);
  if (!pref) {
    notFound();
  }

  permanentRedirect(`/${code}/naishin`);
}
