import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ | My Naishin',
  description:
    'My Naishinへのお問い合わせフォーム。不具合報告、情報の誤りに関するご指摘、ご質問などはこちらからご連絡ください。',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'お問い合わせ | My Naishin',
    description: 'My Naishinへのお問い合わせフォーム。不具合報告・ご質問はこちら。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  alternates: {
    canonical: 'https://my-naishin.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="sr-only" aria-hidden="true">
        <h2>My Naishin お問い合わせについて</h2>
        <p>
          My Naishinは、全国47都道府県の内申点計算に対応した無料ツールです。
          お問い合わせフォームでは、以下の内容を受け付けております。
        </p>
        <ul>
          <li>内申点計算ツールの不具合報告</li>
          <li>都道府県別の計算方法に関する情報の誤りのご指摘</li>
          <li>新機能のリクエストやご提案</li>
          <li>その他サービスに関するご質問</li>
        </ul>
        <p>
          不具合報告の場合は、ご利用の端末・ブラウザ情報、再現手順をお知らせいただけると迅速に対応できます。
          いただいたお問い合わせには、通常3営業日以内に返信いたします。
        </p>
      </section>
    </>
  );
}
