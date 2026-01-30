import { Metadata } from 'next';
import { PREFECTURES } from '@/lib/prefectures';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const prefecture = PREFECTURES.find(p => p.code === code);
  
  if (!prefecture) {
    return {
      title: '都道府県が見つかりません | My Naishin',
    };
  }

  const title = `${prefecture.name}の内申点計算方法 | My Naishin`;
  const description = `${prefecture.name}の内申点は${prefecture.maxScore}点満点。${prefecture.description} 計算方法と注意点を詳しく解説。`;

  return {
    title,
    description,
    keywords: [prefecture.name, '内申点', '計算方法', '高校入試', prefecture.region],
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'ja_JP',
      siteName: 'My Naishin - 内申点計算ツール',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  return PREFECTURES.map((prefecture) => ({
    code: prefecture.code,
  }));
}

export default function PrefectureLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
