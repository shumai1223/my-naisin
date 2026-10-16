import { ArrowLeft, ExternalLink } from '@/components/icons';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';
import { LINE_UNFRIEND_HELP_TEXT } from '@/lib/line';

export default function PrivacyPage() {
  const lastUpdated = '2026年10月17日';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        {/* Back link */}
        <Link
          href="/"
          className="mb-2 inline-flex min-h-[44px] items-center gap-2 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          トップに戻る
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">プライバシーポリシー</h1>
          <p className="mt-2 text-sm text-slate-600">Privacy Policy ／ 最終更新日: {lastUpdated}</p>
        </header>

        {/* Summary Box */}
        <section className="mb-8 rounded-lg border border-slate-200 bg-brand-50 p-5">
          <h2 className="mb-3 text-xl font-bold text-slate-900">プライバシーポリシーの要約</h2>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
            <li><strong>ツール利用時：</strong>個人情報を収集しません（端末内のみ保存）</li>
            <li><strong>お問い合わせ・受け取り登録時：</strong>返信・配信のためメールアドレス等を取得します（任意）</li>
            <li><strong>広告：</strong>アフィリエイト広告と、Google AdSenseによる広告を掲載しています。閲覧履歴に基づく広告（パーソナライズ広告）は、Cookie同意画面で「すべて許可」を選んだ場合だけ求めます（Googleの広告設定でもオフにできます）</li>
            <li><strong>データ利用：</strong>Google等のサービスが利用データを収集・分析します</li>
          </ul>
        </section>

        {/* Content */}
        <div className="space-y-10 rounded-lg border border-slate-200 bg-white p-5 md:p-8">

          {/* はじめに */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">1. はじめに</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              {APP_NAME}（以下「当サイト」）は、ユーザーのプライバシーを最大限に尊重し、
              個人情報の保護に全力で努めています。本プライバシーポリシーでは、当サイトが取得する情報、
              その取り扱い方法、ユーザーの権利、およびデータ保護に関する当サイトの取り組みについて
              詳細に説明いたします。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              当サイトをご利用になる前に、本プライバシーポリシーを注意深くお読みください。
              当サイトを利用された場合は、本ポリシーに記載されたすべての条項に同意いただいたものとみなされます。
              本ポリシーに同意いただけない場合は、当サイトのご利用をお控えください。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              当サイトは、日本国内の法令および国際的なプライバシー保護の基準に準拠し、
              透明性のある情報管理を行うことをお約束いたします。
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>対象：</strong>中学生・高校生（主に13歳以上。中学1年生には12歳の方もいます）
              </p>
              <p className="mt-1 text-sm leading-[1.8] text-slate-600">
                13歳未満の方は保護者の同意のもとご利用ください。
              </p>
            </div>
          </section>

          {/* 収集する情報 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">2. 収集する情報</h2>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                ツール利用時は個人情報を収集しません（端末内のみ保存）
              </p>
              <p className="mt-1 text-sm leading-[1.8] text-slate-600">
                ※ お問い合わせ時のみ、返信のためメールアドレス等を取得します（詳細は2.2参照）
              </p>
            </div>
            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.1 ツール利用時の情報</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              内申点計算ツールをご利用の際、入力された成績データはお使いのブラウザの
              ローカルストレージにのみ保存され、当サイトのサーバーに送信されることは一切ありません
              （結果の共有リンクを作る場合、アクセス解析、匿名統計への協力を選んだ場合を除きます。詳しくは2.3・2.5・5.1をご覧ください）。
              個人を特定できる情報（氏名、住所、電話番号等）を収集することはありません。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.2 お問い合わせ時の情報</h3>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>お問い合わせフォームをご利用の場合：</strong>返信のためにメールアドレス等の個人情報を取得します。
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li><strong>取得項目：</strong>お名前（ニックネーム可）、メールアドレス、お問い合わせ内容</li>
                <li><strong>利用目的：</strong>お問い合わせへの回答・対応のみ</li>
                <li><strong>保管期間：</strong>対応完了後6ヶ月間（法的要請がある場合を除く）</li>
                <li><strong>削除方法：</strong>削除をご希望の場合はお問い合わせください</li>
              </ul>
            </div>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              ユーザーが「記録を保存」機能をONにした場合、成績の履歴（保存日時・任意のメモ）も
              同様にお使いの端末内にのみ保存されます。この履歴データは最大30件まで保存され、
              古いデータから自動的に削除されます。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.3 自動的に収集される情報</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトでは、サービス向上のために以下の情報を自動的に収集する場合があります：
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>ブラウザの種類およびバージョン</li>
              <li>オペレーティングシステムの種類</li>
              <li>アクセス日時およびページ閲覧履歴</li>
              <li>リファラー（参照元URL）</li>
              <li>IPアドレス（アクセス解析では匿名化処理を行います。広告配信では下記のとおりGoogleに送信されます）</li>
            </ul>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              これらの情報は、アクセス解析ツール（Google Analytics等）を通じて収集され、
              サイトの改善およびユーザー体験の向上のためにのみ使用されます。
              個人を特定するために使用されることはありません。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              このほか、計算を完了したときなどに、利用状況を知るための記録（計算が完了したこと、計算結果の数値、
              都道府県、ボタンのクリックなど）が、Google LLCのGoogle Analyticsに送信されることがあります。
              氏名・メールアドレスは含まれません。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              また、Google AdSenseの広告を表示する際に、IPアドレス・閲覧しているページのURL・
              端末やブラウザの情報・Cookie等の識別子などがGoogleに送信されます（詳しくは「5. 広告」をご覧ください）。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.4 受験情報の受け取り登録（任意）</h3>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>「結果を保存・受け取る」機能をご利用の場合：</strong>受験情報・内申対策のお届けのため、
                メールアドレスを取得します。登録は完全に任意で、ツールの利用に登録は必要ありません。
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li><strong>取得項目：</strong>メールアドレス、登録時の文脈情報（選択中の都道府県・内申点・目標・差。任意）</li>
                <li><strong>利用目的：</strong>受験情報・内申対策・志望校情報の配信のみ（同意した場合に限る）</li>
                <li><strong>配信解除：</strong>各配信またはお問い合わせからいつでも解除できます</li>
                <li><strong>第三者提供：</strong>本人の同意なく第三者へ提供・販売することはありません</li>
                <li><strong>LINEでの受け取り：</strong>LINE公式アカウントを友だち追加された場合、LINEヤフー株式会社のプライバシーポリシーも適用されます。{LINE_UNFRIEND_HELP_TEXT}</li>
              </ul>
            </div>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.5 匿名統計への協力（任意）</h3>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>「匿名で統計に協力する」にチェックを入れた場合：</strong>計算結果（内申点・偏差値・総合得点等の数値のみ）を、
                氏名・メールアドレス・IPアドレス等を一切含まない形で送信し、全国の傾向を示す統計データ（
                <Link href="/stats" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">全国統計データページ</Link>
                ）の作成に利用します。
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li><strong>取得項目：</strong>指標の種類（内申点／偏差値／総合得点）、数値、都道府県コード（任意）のみ。個人を特定できる情報は一切含みません</li>
                <li><strong>利用目的：</strong>全国の匿名集計統計データの作成・公開（サンプルサイズが一定件数未満の項目は非公開）</li>
                <li><strong>同意の撤回：</strong>チェックを外すことでいつでも協力を停止できます（過去に送信済みのデータは個人と紐づいていないため個別の削除はできません）</li>
                <li><strong>第三者提供：</strong>集計済みの統計データとしてAPI・CSV形式で一般公開しますが、個人を特定できる情報は含まれません</li>
              </ul>
            </div>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">2.6 開発者向けAPI利用・有償プランのお申し込み</h3>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>APIキーを発行する場合：</strong>ラベル（任意の管理用メモ）・メールアドレス（任意）を
                当サイトのデータベースに保存します。
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li><strong>取得項目：</strong>ラベル、メールアドレス（いずれも任意入力）</li>
                <li><strong>利用目的：</strong>発行済みキーの管理、無料プランから有償プランへの移行状況の把握、重要なお知らせの送付</li>
                <li><strong>削除方法：</strong>削除をご希望の場合はお問い合わせください</li>
              </ul>
              <p className="mt-3 text-sm leading-[1.8] text-slate-900">
                <strong>Pro／Business／Enterpriseプランをお申し込みの場合：</strong>決済はStripe社の
                決済ページ（Stripe Checkout）で行われます。お支払い情報・メールアドレスはStripe社が
                管理し、当サイトのサーバーには保存しません。当サイトからStripe社へは、選択いただいた
                プラン種別と、利用規約への同意時刻のみを記録用に送信します。
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li><strong>Stripe社への送信項目：</strong>プラン種別、利用規約への同意時刻、（入力した場合）メールアドレス</li>
                <li><strong>第三者提供：</strong>Stripe社のプライバシーポリシーが別途適用されます</li>
              </ul>
            </div>
          </section>

          {/* ローカルストレージ */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">3. ローカルストレージの使用</h2>
            <p className="mb-3 text-base leading-[1.8] text-slate-900">
              当サイトでは、ユーザーの利便性向上のためにブラウザのローカルストレージ機能を使用しています。
              ローカルストレージとは、お使いのブラウザにデータを保存する技術であり、
              保存されたデータは当サイトのサーバーに送信されることはありません。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">3.1 保存される情報の種類</h3>
            <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>成績データ：</strong>入力した各教科の評定値（ページを閉じても復元可能）
              </li>
              <li>
                <strong>都道府県選択：</strong>選択した都道府県の計算方式（全国47都道府県対応）
              </li>
              <li>
                <strong>成績履歴：</strong>保存機能ONの場合、過去の計算結果（保存日時・任意のメモを含む、最大30件）
              </li>
              <li>
                <strong>Cookie同意状態：</strong>Cookie使用への同意有無
              </li>
              <li>
                <strong>保存機能の設定：</strong>記録保存機能のON/OFF状態
              </li>
            </ul>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">3.2 データの保持期間</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              ローカルストレージに保存されたデータは、ユーザーがブラウザのデータを削除するか、
              当サイトの設定からデータを削除するまで保持されます。成績履歴は最大30件まで保存され、
              それを超える場合は古いデータから自動的に削除されます。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">3.3 データの削除方法</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              ローカルストレージに保存されたデータは、以下の方法で削除できます：
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>ブラウザの設定から「閲覧履歴データの削除」を実行</li>
              <li>ブラウザの開発者ツールからローカルストレージを手動で削除</li>
              <li>当サイトの「記録を保存」機能をOFFにする（履歴のみ削除対象外）</li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-[1.8] text-amber-900">
                <strong>ご注意：</strong>ブラウザの設定変更、キャッシュのクリア、プライベートブラウジングモードの使用、
                または端末の変更により、保存されたデータが消失する場合があります。
                重要なデータは別途記録しておくことをお勧めいたします。
              </p>
            </div>
          </section>

          {/* Cookieの使用 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">4. Cookie（クッキー）の使用について</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              Cookie（クッキー）とは、ウェブサイトがお使いのブラウザに保存する小さなテキストファイルです。
              当サイトでは、サービスの提供・改善のために必要なCookie、任意の分析Cookie、および広告配信（Google AdSense）のためのCookieを使用しています。
            </p>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">4.1 使用するCookieの種類</h3>

            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                <h4 className="flex items-baseline gap-2 text-base font-bold text-slate-900">
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-normal text-slate-700">必須</span>
                  必須Cookie（ファーストパーティ）
                </h4>
                <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                  サイトの基本機能に必要なCookieです。Cookie同意の設定状態や、記録保存機能のON/OFF状態を
                  記憶するために使用します。また、表示文言を比べるテストのために、端末を見分ける番号（Cookie名 mn_ab_cid、保存期間1年）を保存します。
                  これらのCookieを無効にすると、サイトが正常に動作しない場合があります。
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                <h4 className="flex items-baseline gap-2 text-base font-bold text-slate-900">
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-normal text-slate-700">任意</span>
                  分析Cookie（サードパーティ）
                </h4>
                <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                  Google Analytics等のアクセス解析ツールが使用するCookieです。サイトの利用状況を匿名で収集し、
                  サービス改善に役立てます。収集されるデータには、ページビュー数、滞在時間、参照元などが含まれます。
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                <h4 className="flex items-baseline gap-2 text-base font-bold text-slate-900">
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-normal text-slate-700">広告</span>
                  広告Cookie（サードパーティ）
                </h4>
                <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                  Google AdSenseを通じて、Googleおよび広告配信パートナーが使用するCookieです。広告の配信・表示回数の制限・集計などのために使われます。
                  Cookie同意画面で「すべて許可」を選んだ場合に限り、ユーザーのこれまでのアクセス情報に基づく広告（パーソナライズ広告）の表示にも使われます。
                  「必須のみ許可」を選んだ場合（または、まだ選んでいない場合）は、パーソナライズしない広告を求めますが、広告の表示にともなって、上記の目的のCookieは使われることがあります。
                  アフィリエイト広告（ASP）の計測については「5.」をご覧ください。
                </p>
              </div>
            </div>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">4.2 Cookieの管理方法</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              ユーザーは以下の方法でCookieを管理できます：
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>当サイトのCookie設定：</strong>サイト初回訪問時に表示されるCookie同意画面で設定を選択。選び直したいときは、ページ下部の「Cookie設定」から（この設定で変わるのは、アクセス解析のCookieと、広告のパーソナライズです。広告そのものは、この選択にかかわらず表示されます）
              </li>
              <li>
                <strong>ブラウザ設定：</strong>各ブラウザの設定画面からCookieの受け入れ・拒否を設定
              </li>
              <li>
                <strong>オプトアウト：</strong>各サービス提供元のオプトアウトページを利用（広告のパーソナライズを止める方法は「5.2」をご覧ください）
              </li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-[1.8] text-amber-900">
                <strong>ご注意：</strong>必須Cookie以外を無効にしても、当サイトの基本機能はご利用いただけます。
                ただし、一部の機能や表示が制限される場合があります。
              </p>
            </div>
          </section>

          {/* 広告（アフィリエイト）について。
              2026-08-11: 記述が実態と食い違っていたため全面的に書き直した。
              旧文は「将来的に広告を掲載する場合があります」「現在、広告は掲載しておりません」だったが、
              実際には src/lib/affiliates.ts の live 案件（A8.net / もしもアフィリエイト / ACCESS TRADE）が
              稼働しており、AffiliateAd.tsx のトラッキングピクセルが外部ドメインへリクエストを発生させている。
              「掲載していない」と書き続けることは、このサイトの拠り所である「公表値のみ・捏造ゼロ」に反する。
              2026-10-16: Google AdSense は 2026-09-25 から稼働している（layout.tsx で adsbygoogle.js を全ページに読み込み。
              Cookie同意画面の選択にかかわらず読み込まれるが、2026-10-17に「すべて許可」のときだけパーソナライズ広告を求めるよう連動させた
              ＝lib/adsense-consent.ts・AdSenseScript.tsx）。「利用していません」「パーソナライズ広告は配信していません」
              という記述が事実と違っていたため、AdSenseを利用していることと、利用者ができる設定（Google広告設定）を明記した。 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">5. 広告（Google AdSense・アフィリエイト）と第三者Cookieについて</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトは、運営費をまかなうために広告を掲載しています。広告は「アフィリエイト広告」と
              「Google AdSenseによる広告」の2種類です。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              アフィリエイト広告は、塾・通信教育・家庭教師・ファイナンシャルプランナーの無料相談など、
              当サイトの内容に関連するサービスの紹介リンクです。
              リンク経由でお申し込みがあった場合、広告主から当サイトに紹介料が支払われることがあります。
              紹介料の有無によって、計算結果や順位・評価を変えることはありません。
            </p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm font-bold leading-[1.8] text-slate-900">利用しているサービスと外部への送信</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8] text-slate-900">
                <li>
                  広告配信サービス：<strong>Google AdSense</strong>（Google LLC）。広告の配信・表示に利用しています
                  （詳しくは「5.1 Google AdSenseについて」）。
                </li>
                <li>
                  利用しているASP（広告仲介事業者）：A8.net（株式会社ファンコミュニケーションズ）、
                  もしもアフィリエイト（株式会社もしも）、ACCESS TRADE（株式会社インタースペース）
                </li>
                <li>
                  広告リンクをクリックすると、当サイトの計測用URL（/go）を経由して広告主のサイトへ移動します。
                  その際、どの広告がクリックされたかを当サイト内に記録します（氏名・メールアドレス等は含みません）。
                </li>
                <li>
                  一部の広告では、ASPが提供する計測用の画像（トラッキングピクセル）を読み込むため、
                  広告を表示したページのURL・IPアドレス・端末やブラウザの情報などが、各ASPに送信されます。
                  目的は、広告の表示と、お申し込み（成果）の計測・成果報酬の確定です。
                </li>
                <li>各ASPのCookie・個人情報の取り扱いは、それぞれの事業者のプライバシーポリシーが適用されます。</li>
                <li>Amazonアソシエイトは<strong>利用していません</strong>。</li>
              </ul>
            </div>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">5.1 Google AdSenseについて</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトは、第三者配信の広告サービス「Google AdSense」を利用しています。
              広告は、本文の途中、画面の端（スマホでは上下に固定表示されることがあります。PCでは左右に出ることがあります）、
              ページを移動するときの全画面表示などで表示されます。
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                Googleなどの第三者配信事業者は、Cookieを使用して、ユーザーが当サイトや他のサイトに過去にアクセスした際の情報に基づいて広告を配信することがあります。
                Googleが広告Cookieを使用することにより、Googleやそのパートナーは、当サイトや他のサイトへのアクセス情報に基づく広告をユーザーに表示できます。
              </li>
              <li>
                <strong>当サイトでは、こうしたパーソナライズ広告を求めるのは、Cookie同意画面で「すべて許可」を選んだ場合だけです。</strong>
                「必須のみ許可」を選んだ場合や、まだ選んでいない場合は、Googleにパーソナライズしない広告（非パーソナライズ広告）を求めます。
                選んだ内容は、お使いのブラウザに保存されます。
                なお、パーソナライズしない広告でも、広告の表示回数の制限・集計などのために、CookieなどがGoogleによって使われることがあります。
                選び直したいときは、ページ下部の「Cookie設定」を押してください（広告への反映は、ページを読み込み直したときからです）。
                なお、欧州経済領域・英国・スイスからのアクセスでは、Googleの要件により、「すべて許可」を選んでもパーソナライズ広告が配信されないことがあります。
              </li>
              <li>
                広告の配信にあたり、IPアドレス・閲覧しているページのURL・端末やブラウザの情報・Cookie等の識別子などがGoogleに送信されます。
                URLに内申点・目標点などの数値が含まれるページ（結果の共有リンク、計算結果を引き継ぐリンクなど）を開いた場合は、
                その数値を含むURLもGoogleに送信されます（氏名・メールアドレスは含まれません）。
                当サイトのサーバーに保存したメールアドレス・お問い合わせ内容・LINEの登録内容などを、広告のためにGoogleへ渡すことはありません。
              </li>
              <li>
                Google AdSenseの広告はGoogleが決めて配信します。当サイトが、個人の年齢や閲覧履歴にもとづいて広告を選ぶことはありません。
                なお、「塾診断」では、利用者ご自身が入力した条件（学年・地域・希望の受け方など）に合う塾を、アフィリエイト広告（PR）として表示します。
                アフィリエイト広告は保護者の方が見るページに、そのページの内容・都道府県・時期に合わせて載せており、
                表示文言を比べるテストのために、端末ごとに表示を変えることがあります。
              </li>
              <li>
                Googleによるデータの取り扱いは、
                <a
                  href="https://policies.google.com/technologies/partner-sites?hl=ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  Googleのサービスを使用するサイトやアプリからのデータの使用
                  <ExternalLink className="ml-1 inline h-4 w-4 align-text-bottom" />
                </a>
                に説明されています。
              </li>
            </ul>

            <h3 className="mb-2 mt-6 text-[17px] font-bold leading-snug text-slate-900">5.2 広告に関わる通信やパーソナライズを止めたい場合</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              広告のパーソナライズや、広告に関わる通信・Cookieを減らしたい場合は、次の方法があります：
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                Cookie同意画面で「必須のみ許可」を選ぶ（パーソナライズしない広告を求めます。広告は表示されます）。
                まだ選んでいない間も、パーソナライズしない広告を求めています。
                一度選んだ内容は、ページ下部の「Cookie設定」から選び直せます
              </li>
              <li>
                Googleの
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  広告設定
                  <ExternalLink className="ml-1 inline h-4 w-4 align-text-bottom" />
                </a>
                で、パーソナライズ広告をオフにする（広告は表示されますが、アクセス履歴に基づかない広告になります）。
                第三者配信事業者によるパーソナライズ広告のためのCookieの使用は、米国の業界団体のツールである
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  aboutads.info
                  <ExternalLink className="ml-1 inline h-4 w-4 align-text-bottom" />
                </a>
                でも停止できます
              </li>
              <li>ブラウザの設定で「サードパーティCookie」を無効にする</li>
              <li>広告ブロック拡張機能を使う（当サイトの計算機は広告をブロックした状態でも通常どおり動作します）</li>
              <li>アフィリエイト広告のリンクをクリックしない（クリックしなければ広告主・ASPへの遷移は発生しません）</li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-[1.8] text-amber-900">
                <strong>ご注意：</strong>Cookie同意画面の選択は、Google Analytics（「必須のみ許可」ではCookieを使わなくなります。
                Cookieを使わない簡易的な通信がGoogleに送られることがあります）と、Google AdSenseのパーソナライズ
                （「すべて許可」のときだけ求めます）に反映されます。広告そのものは、どちらを選んでも表示されます。
                広告Cookieを無効にしても、当サイトの基本機能はご利用いただけます。ただし、広告の関連性が低下する場合があります。
              </p>
            </div>

            {/* 子ども向け扱いに関する注意 */}
            <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm font-bold leading-[1.8] text-slate-900">5.3 13歳未満の方へ</p>
              <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                当サイトは中学生・高校生（主に13歳以上。中学1年生には12歳の方もいます）を主な利用者として想定しています。
                13歳未満の方への広告のパーソナライズには、Googleのポリシー上も制限があります。
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-[1.8] text-slate-900">
                <li>
                  <strong>年齢を特定する情報を取得しない：</strong>氏名・学校名・生年月日などは取得しません
                  （学年は、塾診断や共有リンクで利用者ご自身が選んだ場合に使うことがあります）
                </li>
                <li>
                  <strong>保護者同意の注意喚起：</strong>13歳未満のお子様がご利用される場合は、保護者の方の同意と監督をお願いします。
                  当サイトは、Cookie同意画面で「すべて許可」を選ばない限りパーソナライズ広告を求めません。
                  お子様がご利用になるときは「必須のみ許可」を選ぶか、Googleの広告設定でパーソナライズ広告をオフにしてください（方法は「5.2」をご覧ください）
                </li>
                <li>
                  <strong>広告の選択：</strong>Google AdSenseの広告はGoogleが決めて配信します。当サイトが、個人の年齢や閲覧履歴にもとづいて広告を選ぶことはありません
                </li>
              </ul>
              <p className="mt-3 text-sm leading-[1.8] text-slate-900">
                <strong>運営者の姿勢：</strong>個人運営として、子どものプライバシー保護を優先し、取得する個人情報を必要最小限にとどめます。
              </p>
            </div>
          </section>

          {/* アクセス解析 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">6. アクセス解析ツールについて</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトでは、サービス向上およびユーザー体験の改善を目的として、
              Googleアナリティクス（GA4・Google LLC提供）を導入しています。
              このツールはトラフィックデータを収集するためにCookieを使用しますが、
              このデータは匿名で収集され、個人を特定するものではありません。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              収集される情報には、ページビュー数、セッション時間、使用デバイス、地理的位置（国・地域レベル）、
              参照元URLなどが含まれます。これらの情報は、サイトのコンテンツ改善、
              ユーザビリティの向上、およびサービス品質の維持に活用されます。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              Googleアナリティクスによるデータ収集を無効にするには、
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Googleアナリティクス オプトアウト アドオン
                <ExternalLink className="ml-1 inline h-4 w-4 align-text-bottom" />
              </a>
              をブラウザにインストールしてください。
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>広告について：</strong>アフィリエイト広告（塾・通信教育・FP無料相談等の紹介リンク）と、Google AdSenseによる広告を掲載しています。Google AdSenseでは、Googleなどの第三者配信事業者がCookieを使って、過去のアクセス情報に基づく広告を表示することがあります（当サイトは、Cookie同意画面で「すべて許可」を選んだ場合だけ、そうした広告を求めます）。Amazonアソシエイトは利用していません。詳しくは「5. 広告（Google AdSense・アフィリエイト）と第三者Cookieについて」をご覧ください。
              </p>
            </div>
          </section>

          {/* 未成年者のプライバシー */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">7. 未成年者のプライバシーについて</h2>
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                当サイトは主に中学生・高校生を対象としたサービスです。
                18歳未満の方は、保護者の同意を得た上でご利用ください。
              </p>
            </div>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              当サイトは、未成年者のプライバシー保護を特に重視しています。
              13歳未満のお子様から意図的に個人情報を収集することはありません。
              当サイトは個人を特定できる情報を直接収集しませんが、アクセス解析および広告配信において
              Cookieが使用される場合があります。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              保護者の方へ：お子様が当サイトを利用する際は、本プライバシーポリシーの内容を
              ご確認いただき、Cookieの使用について適切にご判断ください。
              ご不明な点やご懸念がございましたら、お問い合わせページよりご連絡ください。
            </p>
          </section>

          {/* ユーザーの権利 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">8. ユーザーの権利</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              ユーザーは、ご自身のデータに関して以下の権利を有しています：
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>アクセス権：</strong>お使いの端末に保存されているデータを確認する権利
              </li>
              <li>
                <strong>削除権：</strong>ブラウザ設定からローカルストレージのデータを削除する権利
              </li>
              <li>
                <strong>オプトアウト権：</strong>Cookie同意画面で「必須のみ許可」を選択し、分析Cookieとパーソナライズ広告を拒否する権利（パーソナライズ広告は、Googleの広告設定でも無効にできます）
              </li>
              <li>
                <strong>情報提供を受ける権利：</strong>データの取り扱いについて説明を求める権利
              </li>
            </ul>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              これらの権利の行使に関するご質問は、お問い合わせページよりご連絡ください。
            </p>
          </section>

          {/* プライバシーポリシーの変更 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">9. プライバシーポリシーの変更について</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトは、法令の改正、サービス内容の変更、その他の理由により、
              必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のポリシーは、本ページに掲載した時点より効力を生じるものとします。
            </p>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              重要な変更がある場合は、サイト上での告知等により、ユーザーにお知らせするよう努めます。
              定期的に本ページをご確認いただくことをお勧めいたします。
            </p>

            {/* 子ども向けポリシーの変更について */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm font-bold leading-[1.8] text-slate-900">子ども向けポリシーの優先的な変更</p>
              <p className="mt-2 text-sm leading-[1.8] text-slate-900">
                子どものプライバシー保護に関する法律やガイドラインが変更された場合、
                その他の変更に優先して本ポリシーを更新し、速やかに告知いたします。
              </p>
            </div>
          </section>

          {/* お問い合わせ */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900">10. お問い合わせ</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              本プライバシーポリシーに関するご質問、ご意見、苦情、またはデータに関するリクエストは、
              以下の方法でお問い合わせください：
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
              <p className="text-sm leading-[1.8] text-slate-900">
                <strong>お問い合わせフォーム：</strong>
                <Link href="/contact" className="ml-1 inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  お問い合わせページ
                </Link>
              </p>
              <p className="mt-1 text-sm leading-[1.8] text-slate-600">
                ※ お問い合わせへの回答には、通常3〜5営業日程度お時間をいただく場合がございます。
              </p>
            </div>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              プライバシーに関するお問い合わせの際は、具体的な内容と、可能であれば関連する状況を
              詳しくお知らせください。迅速かつ適切に対応させていただきます。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
