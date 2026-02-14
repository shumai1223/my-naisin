import { redirect } from 'next/navigation';

interface PrefectureReversePageProps {
  params: {
    prefecture: string;
  };
}

export default function PrefectureReversePage({ params }: PrefectureReversePageProps) {
  const pref = params.prefecture?.toLowerCase() ?? '';
  redirect(`/reverse?pref=${pref}`);
}
