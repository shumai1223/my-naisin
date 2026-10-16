interface PrefectureSearchIntentProps {
  prefectureCode: string;
  className?: string;
}

export function PrefectureSearchIntent({ prefectureCode, className = '' }: PrefectureSearchIntentProps) {
  // 都道府県名のマッピング
  const prefectureNames: Record<string, string> = {
    chiba: '千葉県',
    tokyo: '東京都',
    kanagawa: '神奈川県',
    osaka: '大阪府',
    saitama: '埼玉県',
    aichi: '愛知県',
    fukuoka: '福岡県',
    hyogo: '兵庫県',
    hokkaido: '北海道'
  };

  // 各都道府県の検索意図データ
  const searchIntents: Record<string, {
    commonMistakes: string[];
    targetGrades: string;
    reversalStrategy: string;
    specialNotes: string[];
  }> = {
    tokyo: {
      commonMistakes: [
        '「換算内申」と「素内申」を同じものだと思っている',
        '中1・中2の成績も入試に関係あると思っている（一般入試の場合）',
        '実技4教科が2倍換算なのを知らず、5教科ばかり勉強している',
        'ESAT-J（スピーキング）の20点分を無視して計算している'
      ],
      targetGrades: '都立一般入試は<strong>中学3年生の成績のみ</strong>が対象です。12月に出る「調査書点」で合否の3割（300/1000点）が決まります。',
      reversalStrategy: '実技4教科のどれか一つを「3→4」にするだけで、換算内申は2点上がります。これは当日点の約9点分に相当。5教科を必死に上げるより、副教科で稼ぐのが逆転の最短ルートです。',
      specialNotes: [
        'ESAT-Jの結果は、内申点・当日点とは別に20点満点で加算されます',
        '上位校（自校作成校）では、内申点以上に当日点（特に記述）で差がつきます'
      ]
    },
    kanagawa: {
      commonMistakes: [
        '内申点（135点満点）だけで合否が決まると思っている',
        '中2の成績が3分の1も占めていることを忘れている',
        '特色検査対策を後回しにしている',
        '「重点化」で特定の教科が2倍になるルールを知らない'
      ],
      targetGrades: '<strong>中2の成績(45点) ＋ 中3の成績(45点×2) ＝ 135点満点</strong>で計算します。中2の成績が確定している場合、中3でどれだけ上げる必要があるかを逆算するのが重要。',
      reversalStrategy: '神奈川は「第2次選考」という枠があり、定員の10%は<strong>内申点を一切見ない当日点勝負</strong>で決まります。内申が低くても当日400点以上取れる実力があれば逆転合格が可能です。',
      specialNotes: [
        '面接は2024年度から原則廃止されました',
        '学校ごとに「内申：当日点：特色」の比率（S値）が異なるため、自分の持ち点に有利な学校選びが必須です'
      ]
    },
    osaka: {
      commonMistakes: [
        '英検2級の「読み替え制度」の威力を知らない',
        '中1・中2の成績が既に合否に影響していることに気づいていない',
        '「タイプI〜V」の配点比率を自分の志望校で確認していない'
      ],
      targetGrades: '<strong>中1(1倍)：中2(1倍)：中3(3倍)</strong>の合計450点満点です。中1からの積み重ねが必須ですが、中3の配分が大きいため、最後まで逆転のチャンスはあります。',
      reversalStrategy: '文理学科などの上位校を目指すなら、<strong>英検2級取得</strong>が最大の逆転・安定化戦略です。当日点が80%保証されるため、内申が多少低くても英語で稼ぐ必要がなくなり、他教科に集中できます。',
      specialNotes: [
        'チャレンジテストの結果によって、学校全体の評定の出やすさが調整されます',
        'C問題（発展的）を採用する高校では、教科書レベルを超えた応用力が必要です'
      ]
    },
    aichi: {
      commonMistakes: [
        '「内申点（45点）」がそのまま使われると思っている（実際は2倍の90点満点）',
        '中1・中2の成績が一般入試に関係あると思っている',
        '当日点（110点満点）との合算方法を知らない'
      ],
      targetGrades: '<strong>中3の9教科×2 ＝ 90点満点</strong>です。中1・中2の成績は一般入試の点数には入りませんが、推薦入試では重視されます。',
      reversalStrategy: '愛知は当日点（110点）と内申点（90点）の合計で競いますが、学校によって「当日点重視」の校内規定があります。内申が低めなら、当日点重視（III型）の高校を戦略的に選びましょう。',
      specialNotes: [
        'A・Bグループの2校受験が可能。第一志望は強気に、第二志望は手堅く選ぶのが鉄則です',
        '全教科×2倍のため、実技教科の「3」を放置すると当日点数点分を損します'
      ]
    },
    chiba: {
      commonMistakes: [
        '中1からの成績がすべて均等に入るのを知らない',
        '「K値」の意味を理解していない',
        '実技教科を捨ててしまっている'
      ],
      targetGrades: '<strong>中1(45) ＋ 中2(45) ＋ 中3(45) ＝ 135点満点</strong>。3年間が均等に評価される全国でも珍しい県です。',
      reversalStrategy: '中1・中2で失敗した人は、<strong>K値が小さい（0.5など）</strong>高校を選びましょう。内申点の持ち点の差が半分に圧縮されるため、当日点での逆転が非常にしやすくなります。',
      specialNotes: [
        '2日目の「学校設定検査（自己表現など）」も点数化されるため、面接や作文の準備が不可欠です'
      ]
    },
    default: {
      commonMistakes: [
        '実技教科の配点を軽視している',
        '中1から中3までのどの学年が対象か把握していない',
        '公式資料を一度も見ていない'
      ],
      targetGrades: '多くの県で中3の成績が重視されますが、中1からの積み重ねを見る県も増えています。',
      reversalStrategy: '内申点が足りない場合、まずは「副教科（実技4教科）」で「4」以上を目指しましょう。多くの県で副教科は得点しやすく、かつ配点が高い傾向にあります。',
      specialNotes: [
        '最新の入試要綱は、必ず各都道府県の教育委員会公式サイトで確認してください'
      ]
    }
  };

  const intent = searchIntents[prefectureCode] || searchIntents.default;

  return (
    <div className={className}>
      <h3 className="text-[17px] font-bold text-slate-900">
        {prefectureNames[prefectureCode] || 'この県'}の入試のポイント
      </h3>
      <p className="mt-1 text-sm text-slate-600">受験生がつまずきやすい点と、逆転のヒント</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* よくある勘違い */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h4 className="mb-3 font-bold text-slate-900">よくある勘違い</h4>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
            {intent.commonMistakes.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ul>
        </div>

        {/* 逆転合格のヒント */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h4 className="mb-3 font-bold text-slate-900">逆転合格のヒント</h4>
          <p className="text-base leading-[1.8] text-slate-900">{intent.reversalStrategy}</p>
        </div>

        {/* いつの成績が使われるか */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h4 className="mb-3 font-bold text-slate-900">対象となる成績</h4>
          <div className="text-base leading-[1.8] text-slate-900" dangerouslySetInnerHTML={{ __html: intent.targetGrades }} />
        </div>

        {/* 特記事項 */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h4 className="mb-3 font-bold text-slate-900">2026年度の特記事項</h4>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
            {intent.specialNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        ※上記は2026年度（令和8年度）入試予測・要綱に基づいています。最終的な判断は各学校の募集要項をご確認ください。
      </p>
    </div>
  );
}
