import { Metadata } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ prefecture: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture: code } = await params;
  const prefecture = PREFECTURES.find(p => p.code === code);
  
  if (!prefecture) {
    return {
      title: '都道府県が見つかりません | My Naishin',
    };
  }

  const title = `${prefecture.name}の内申点計算ツール【${prefecture.maxScore}点満点】| My Naishin`;
  const description = `${prefecture.name}の内申点を自動計算。${prefecture.description} 計算式、注意点、よくある質問を詳しく解説。${prefecture.name}の高校入試対策に。`;
  const keywords = [
    prefecture.name,
    `${prefecture.name} 内申点`,
    `${prefecture.name} 内申点 計算`,
    `${prefecture.name} 高校入試`,
    `${prefecture.name} 内申`,
    '内申点計算',
    '高校受験',
    prefecture.region
  ];

  return {
    title,
    description,
    keywords,
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
    alternates: {
      canonical: `https://my-naishin.com/${code}/naishin`,
    },
  };
}

export async function generateStaticParams() {
  return PREFECTURES.map((prefecture) => ({
    prefecture: prefecture.code,
  }));
}

export default function PrefectureNaishinLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
