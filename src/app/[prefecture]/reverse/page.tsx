import { redirect } from 'next/navigation';

interface PrefectureReversePageProps {
  params: Promise<{
    prefecture: string;
  }>;
}

export default async function PrefectureReversePage({ params }: PrefectureReversePageProps) {
  const { prefecture } = await params;
  const pref = prefecture?.toLowerCase() ?? '';
  redirect(`/reverse?pref=${pref}`);
}
