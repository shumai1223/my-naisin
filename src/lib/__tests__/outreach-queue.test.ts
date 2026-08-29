import fs from 'node:fs';
import path from 'node:path';
import { sortQueueByPriority, summarizeQueue, queueReviewTierOf, type QueueEntry } from '../outreach-queue';
import { getPrefectureByCode } from '../prefectures';

function makeEntry(overrides: Partial<QueueEntry>): QueueEntry {
  return {
    id: 'e1',
    org: 'テスト組織',
    lane: 'kyoiku-i',
    channel: 'email',
    status: 'queued',
    sourceDoc: 'docs/test.md',
    addedAt: '2026-08-02',
    ...overrides,
  };
}

describe('sortQueueByPriority', () => {
  it('channel優先(line>email>form)で並べる', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'form' }),
      makeEntry({ id: 'b', channel: 'line' }),
      makeEntry({ id: 'c', channel: 'email' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('同一channel内はlane優先(kyoiku-i>b2b-saas>chihoshi>npo>mutual-link)で並べる', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'email', lane: 'mutual-link' }),
      makeEntry({ id: 'b', channel: 'email', lane: 'kyoiku-i' }),
      makeEntry({ id: 'c', channel: 'email', lane: 'chihoshi' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('excludedは除外する', () => {
    const entries = [
      makeEntry({ id: 'a', status: 'excluded' }),
      makeEntry({ id: 'b', status: 'queued' }),
    ];
    expect(sortQueueByPriority(entries).map((e) => e.id)).toEqual(['b']);
  });
});

describe('summarizeQueue', () => {
  it('queued/excludedとchannel/laneの内訳を集計する', () => {
    const entries = [
      makeEntry({ id: 'a', channel: 'email', lane: 'kyoiku-i' }),
      makeEntry({ id: 'b', channel: 'form', lane: 'chihoshi' }),
      makeEntry({ id: 'c', status: 'excluded' }),
    ];
    const s = summarizeQueue(entries);
    expect(s.total).toBe(3);
    expect(s.excludedCount).toBe(1);
    expect(s.queuedByChannel).toEqual({ line: 0, email: 1, form: 1 });
    expect(s.queuedByLane).toEqual({ 'kyoiku-i': 1, chihoshi: 1 });
  });
});

describe('queueReviewTierOf', () => {
  it('kyoiku-i/chihoshiはfull-review既定', () => {
    expect(queueReviewTierOf({ lane: 'kyoiku-i' })).toBe('full-review');
    expect(queueReviewTierOf({ lane: 'chihoshi' })).toBe('full-review');
  });

  it('npo/mutual-linkはspot-check既定', () => {
    expect(queueReviewTierOf({ lane: 'npo' })).toBe('spot-check');
    expect(queueReviewTierOf({ lane: 'mutual-link' })).toBe('spot-check');
  });

  it('個別reviewTier指定があればそちらを優先', () => {
    expect(queueReviewTierOf({ lane: 'npo', reviewTier: 'full-review' })).toBe('full-review');
  });
});

describe('data/outreach-queue.json（X\'-1・実データ整合性）', () => {
  const raw = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'outreach-queue.json'), 'utf8')
  ) as { asOf: string; entries: QueueEntry[] };

  it('idが全件ユニーク', () => {
    const ids = raw.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('queuedの全件がcontactを持つ(送り先未確定のまま送信キューに入れない)', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued')) {
      expect(e.contact).toBeTruthy();
    }
  });

  it('excludedの全件がexcludeReasonを持つ(理由なき除外を許さない)', () => {
    for (const e of raw.entries.filter((e) => e.status === 'excluded')) {
      expect(e.excludeReason).toBeTruthy();
    }
  });

  it('email channelのcontactはメールアドレス形式', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued' && e.channel === 'email')) {
      expect(e.contact).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  it('form channelのcontactはhttps URL', () => {
    for (const e of raw.entries.filter((e) => e.status === 'queued' && e.channel === 'form')) {
      expect(e.contact).toMatch(/^https:\/\//);
    }
  });

  it('137件がqueued(教委13[email3+form10]+メディアemail9+メディアform5+個人塾line4+npo4+EdTech校務支援8+本文既存済み94の昇格)', () => {
    // 2026-08-13: 教委email26件は8/6に送信済みでledger側(kyoiku-*-0806)に記録済みの重複だったため
    // queueから削除(outreach-queue.tsの設計「送信済みはledgerへ移しqueueから除外する」に合わせた)。
    // 残る教委emailはlane9-*(政令市3件)のみ・教委formの10件は未送信のため変更なし。
    // 2026-08-14: lane9-nit(日本図書教材協会)に本文を書きcandidateからqueuedへ昇格(業界団体経由の紹介依頼の型を検証)。
    // 2026-08-14: 校務支援システムレーンで発見した8件(教科書協会+校務支援システム7社)に本文を書きqueuedへ昇格。
    // 2026-08-14: 同夜に本文まで書きながらstatus='candidate'のまま残っていた14件+6件(計20件)をT-C2の設計に沿いqueuedへ昇格
    // (直近のWebFetch再検証を根拠)。edtech-yournet-schpass/edtech-broadmedia-renaissanceのcontactがhttp://だった
    // ため昇格時にhttps://へ修正。
    // 2026-08-14: さらに11件(cert-kanken-group等)をWebFetch再確認のうえqueuedへ昇格。
    // 2026-08-14朝: b2b-saasレーンの残り77件を再走査し5件(media-kyoiku-kohosha/media-sanpou/
    // edtech-succeed-gakunaijuku/edtech-gmomedia-coeteco-manager/juku-johnan-edubiz)をWebFetch再確認のうえqueuedへ昇格。
    // 同時に2件(edtech-afrel-legoeducation/juku-yozemi-teacher-site)を「営業目的お断り」の明記を確認しexcludedへ。
    // 2026-08-14続き: さらに5件(edtech-studyplus-for-school/juku-eikoh-media/edtech-manabilinkplus-sumarepo/
    // edtech-igs-aigrow/edtech-feelnote-hamagakuen)をWebFetch再確認のうえqueuedへ昇格(76→81)。
    // 2026-08-14続き2: career-miraikyoiku-sdgsquestを昇格(81→82)。juku-shuei-yobiko-ir(IR専用と判明)・
    // edtech-ryobi-koushien(フリーメール拒否と判明)の2件をexcludedへ。
    // 2026-08-14続き3: juku-sprix-ir(IRは複数区分の1つに過ぎない一般問い合わせフォームと確認)を昇格(82→83)。
    // 続けてemail channelの残candidate21件(既にevidenceで直接WebFetch確認済みのアドレス)を一括昇格(83→104)。
    // 2026-08-14続き4: formチャネル7件(edtech-gakugei/edtech-digitalknowledge/gakusan-shimizushoin/
    // gakusan-meijishoin/moshi-gakuyu-mie/lane1-shijuku-net/lane2-yamakawa)をWebFetch再確認のうえ昇格(104→111)。
    // 2026-08-14続き5: さらに10件(lane2-nichieisha/lane3-koenokyoikusha/lane3-kogaku-pub/lane3-tomonokai/
    // lane3-freemind/lane4-viling/lane4-shinrokikaku/lane4-tao-tenjin/lane4-mingaku/lane1-tottorishijuku)を
    // WebFetch再確認のうえ昇格(111→121)。
    // 2026-08-14続き6: lane3-schoolpress/lane1-kyoto-shijukurenmeiを昇格(121→123)。
    // 2026-08-14続き7: 判定不能だった3件をトップページ経由の再確認で昇格(lane1-aomoriken-juku/
    // lane1-kmkk/lane1-toyama-edu・123→126)。
    // 2026-08-14続き8: T-C2 C2-3のゲート(b2b-saas尽きた後に3-5件個別試作)に従いnpoレーンから
    // 進路指導・キャリア教育・テスト理論の3学会(lane9-shinroshido/lane9-jssce/lane9-jartest)に
    // 研究協力・データ引用フレーミングの個別本文を書き昇格(126→129・営業文面ではなく情報提供文面)。
    // 2026-08-14続き9: 新規candidate edtech-litalico-koto-gakuin(株式会社LITALICO・通信制高校
    // サポート校運営)を発見・本文作成のうえ昇格(129→130)。
    // 2026-08-14続き10: 通信制高校の運営会社視点でさらに2件発見・追加(edtech-humanhd-campus-koto/
    // edtech-ikubunkan-id-gakuen・130→132)。
    // 2026-08-14続き11: 08-13にexcludedだったexcluded-clark-soshigakuenを再調査し、前回見落としていた
    // 『取材・撮影』『その他』の一般フォームを発見・queuedへ復活(132→133)。
    // 2026-08-14続き12: 同様にexcluded-wizas-daiichigakuen(08-13時点でIRフォームが404だった)を
    // 再調査しサイトリニューアル後の正しいURL(ir.with-us.co.jp/contact/)を発見・queuedへ復活(133→134)。
    // 2026-08-14続き13: 新規candidate media-valxl-studyh(株式会社バレクセル・高校受験情報サイト
    // 「スタディ」運営)を発見・本文作成のうえ昇格(134→135)。
    // 2026-08-14続き14: 新規candidate media-impress-kodomotoit(株式会社インプレス・教育ICTメディア
    // 「こどもとIT」)を発見・本文作成のうえ昇格(135→136)。
    // 2026-08-14続き15: 新規candidate media-clisk-tsuushinsei-navi(株式会社クリスク・通信制高校ナビ/
    // 不登校サポートナビ運営)を発見・本文作成のうえ昇格(136→137)。
    // 2026-08-14続き16: b2b-saas残candidateのうちform channel・本文ありの9件をWebFetch再確認の上
    // queuedへ昇格(chuoh-kyouiku/nativecamp/umedai-sdgs-awards/suzukisoft/iizuna-shoten/
    // okayama-kangaerukai/ichishin-press/private-education-org/smartrador・137→146)。
    // 2026-08-14続き17: Gmail受信箱のフォーム送信確認メール5件(nativecamp/kawaijuku-keinet-plus/
    // gmomedia-coeteco-manager/johnan-edubiz/eikoh-media)を検知し、queueに未反映のまま実際は送信済み
    // だったと判明。ledgerへstatus:'awaiting'で移設しqueueから削除(146→142・queued4件減)。
    // 2026-08-14続き18: 同様にedtech-feelnote-hamagakuenの送信確認メールを検知しledgerへ移設
    // (142→141)。
    // 2026-08-14続き19: 同様にjuku-sprix-ir(株式会社スプリックス)の送信確認メールを検知し
    // ledgerへ移設(141→140)。
    // 2026-08-14続き20: edtech-faboc-jukumail(ファボック)をクエリパラメータ無しのURL
    // (contactus.php?cate_id=5 → contactus.php)で再確認し有効な自由記述欄を確認、queuedへ昇格
    // (140→141)。
    // 2026-08-14続き21: Cowork第3弾(30社・ops/cowork/COWORK-RESULT-03.md)の実測を反映。
    // 送信済み8件(edtech-afrel-legoeducation/edtech-studyplus-for-school/
    // edtech-manabilinkplus-sumarepo/edtech-igs-aigrow/edtech-suzukisoft/edtech-gakugei/
    // edtech-digitalknowledge/moshi-gakuyu-mie)をledgerへstatus:'awaiting'で移設しqueueから削除。
    // スキップ7件(edtech-faboc-jukumail/edtech-techmatrix-tsumugino/juku-ichishin-press/
    // edtech-codetakt/edtech-surala/edtech-manabipocket/lane2-tokyo-horei、うちqueued3件)を
    // excludedへ(残り3件は既存excludedと重複)。queued141→131(-10)。
    // 2026-08-14続き22: 本文確認済みの3件(edtech-teachersmarket/gakusan-nihonkyozai/
    // gakusan-akatsuki-kyoiku)をqueuedへ昇格(131→134)。
    // 2026-08-15: mediaレーン(lane5-*)の教育専門メディア13件(日本教育新聞社/時事通信社『内外教育』/
    // 教育家庭新聞社/学事出版/教育新聞社/小学館/朝日中高生新聞/プレジデントFamily/こどもまなび☆ラボ/
    // 日経xwoman/中学受験情報局/塾ジャーナル/全私学新聞)に個別本文を書きqueuedへ昇格(134→147)。
    // いずれも2026-08-12にWebFetchで直接確認済みのcontact/evidenceを再利用(新規サイト訪問なし)。
    // 2026-08-15続き: kyoiku-iレーンの独立行政法人2件(国立教育政策研究所図書館/教職員支援機構総合窓口)に
    // npo3件パイロットと同型の「情報提供・データ引用」フレーミングで本文を書きqueuedへ昇格(147→149)。
    // 2026-08-15続き2: 東京大学大学院教育学研究科(庶務チーム・組織名義窓口)を新規candidate追加のうえ
    // queuedへ(149→150)。LOOP_CONTRACT§3-6で「教員個人メールのみでC7抵触」と記録されていた⏸要設計案件を、
    // 研究科代表窓口経由の間接打診に設計変更して解消した初回試行。
    // 2026-08-15続き3: lane1-najukuren(奈良県学習塾連盟)のcontactをhttp→httpsへ修正しqueuedへ(150→151)。
    // WebFetchのShift-JIS文字化けで再確認不能だったが、curl(--ssl-no-revoke)でhttps版のHTTPヘッダが
    // http版と完全に同一のContent-Length/Last-Modifiedを返すことを確認し、同一ファイルの提供と判断した。
    // 2026-08-15続き4: 8/6送信済み・8/14追撃送信済みだがqueueに残存していたmedia-*9件(地方紙5件+
    // 私塾界/ICT教育ニュース/ReseEd/リセマム)をoutreach-ledger.jsonへ遡及反映のうえqueueから削除(151→142)。
    // 2026-08-15続き5: 8/12送信済みでledgerには既に正しく記録済みだったlane9-*-koko3件(横浜/名古屋/福岡市
    // 教委)がqueueにのみ重複して残存していたのを削除(142→139)。
    // 2026-08-16: 大学研究室横展開4校(広島/早稲田IASE/京都)はcandidateのまま(本文未着手)だったが、
    // その後lane9の学会candidate11件(email)+1件(jset・form)に本文を執筆しqueuedへ昇格(139→151)。
    // 2026-08-16続き: kyoiku-iレーンの都道府県教委リンク依頼型10件(hokkaido/kanagawa/gunma/okayama/
    // fukushima/niigata/hiroshima/yamaguchi/ehime/kumamoto)を、LOOP_CONTRACT§3-6で既に4/4全滅と
    // 判定済みの型と同型のため送信対象から除外(151→141)。
    // 2026-08-16続き2: 家庭教師/通信教育レーンexcluded4件追加(candidateには影響せずqueued数不変)。
    // その後、大学研究室candidate3件(広島/早稲田IASE/京都)に本文を執筆しqueuedへ昇格(141→144・
    // 1晩上限10-15件の範囲内で本日2バッチ目、当日合計15件)。
    // 2026-08-17: Gmail実測(in:sent)で3件の送信完了を確認したためqueueから削除しoutreach-ledger.jsonへ反映
    // (juku-tkg-press=送信済み・lane9-jscs-curriculum=送信済み・edtech-tfabworks=ハードバウンスで打ち切り、144→141)。
    // 2026-08-17続き: T-C2下書き上限リセット後、lane9の学会・校長会12件(email8+form4)に本文を執筆しqueuedへ昇格(141→153)。
    // 2026-08-17続き2: 同夜2バッチ目としてlane9の学会6件(email4+form2)に本文を執筆しqueuedへ昇格(153→159・
    // 本日のGmail下書き作成数は合計12件で1晩10-15件上限内)。
    // 2026-08-17続き3: b2b-saas/lane4の校務支援システム・出願システム系candidate5件(全件form channelの
    // ためGmail下書き上限の対象外)に本文を執筆しqueuedへ昇格(159→164)。
    // 2026-08-17続き4: b2b-saas/lane4・lane2の残candidate6件(全件form channel)に本文を執筆しqueuedへ昇格
    // (164→170)。formPurpose='unknown'の2件(beein-syutsugan/atsystem-ckip・学校法人名必須欄で非学校の
    // 送信者が弾かれるリスクあり)と大学向け製品のjip-saksak(高校生向けサイトとの適合度が弱い)は見送り。
    // 2026-08-17続き5: npo/lane9・lane8のcandidate6件(全件form channel)に本文を執筆しqueuedへ昇格(170→176)。
    // formPurpose='purpose-restricted'のzensho(検定合格者発表専用フォーム)は見送り。
    // 2026-08-17続き6: npo/lane8・lane9の残candidate6件(全件form channel)に本文を執筆しqueuedへ昇格(176→182)。
    // 2026-08-17続き7: npo/lane9(みんなのコード)・lane7大学教育学部2件(和歌山大/琉球大)に新規本文執筆、
    // lane1-npo-jzk(本文執筆済みだがstatus昇格漏れだった1件)を追加でqueuedへ昇格(182→186)。
    // 2026-08-17続き8: b2b-saas残candidateからlane2-presto/学びの森/日本標準に新規本文執筆、
    // career-mynavi-koshien-teacher(本文執筆済みだがstatus昇格漏れだった1件)を追加でqueuedへ昇格(186→190)。
    // 2026-08-17続き9: npo/lane9残り学会4件+kyoiku-i(教育大学広報)1件に新規本文執筆しqueuedへ昇格(190→195)。
    // 2026-08-17続き10: edtech-terraport-campusentryを対象製品Campus ENTRY(大学向け)からCan'dy series
    // (私立中高向け生徒募集支援)へevidence/subject/bodyを差し替えてqueuedへ昇格(195→196)。
    // 2026-08-17続き11: lane2-shinkyo-pub(一般社団法人信州教育出版社・2026-08-11時点の
    // lane2残り約13社リストで未処理のまま残っていた1社)を新規検証のうえqueuedへ昇格(196→197)。
    // 2026-08-18: 08-18 00時のリセット後、本文執筆済みcandidateから5件(edtech-crop-oneread・
    // lane9-jslis・lane9-jsme・media-shijyukukai・npo-bunkagakushu)にGmail下書きを作成し
    // queuedへ昇格(197→202)。ドメイン多様性を確保(as.bunken.co.jp/ml.gakkai.ne.jp等の
    // 運営代行クラスタは今回意図的に避けた)。
    // 2026-08-18続き: 同日2バッチ目としてlane9-jaeis・lane9-jsfee・lane8-tottori-kyobun・
    // edtech-systechits-majorschool・lane7-shinshu-uの5件を追加でqueuedへ昇格(202→207・
    // 本日合計10件で1晩10-15件上限のほぼ上限)。
    // 2026-08-18続き2: 上記コメント(08-17 3件目・4件目)で既に「見送り」裁定済みだったlane9-zensho/
    // edtech-beein-syutsugan/edtech-atsystem-ckipの3件が、JSON側ではstatus:'candidate'のまま
    // excludedに未反映で残存していた(00:44に本文執筆事故として一度検知したがexcluded化までは
    // 未実施だった)ため、excludeReason付きで正式にexcludedへ確定(queuedには影響せず207のまま)。
    // 2026-08-18続き3: lane9-kobunren(全国高等学校文化連盟・form channel)は本文執筆済みでcandidateの
    // まま昇格漏れだった1件をqueuedへ昇格(207→208・form channelのためGmail下書き上限の対象外)。
    // 2026-08-19: T-C2上限リセット後、本文執筆済みcandidate66件から12件(edtech-frompage-ocans/lane9-nasem/
    // lane9-jsrecce/lane8-nagasaki-kyoikukai/lane8-yamaguchi-kyoikukai/npo-terakoya-houjousha/lane9-jash/
    // lane9-geoedu/lane9-jssace/lane9-zentoku/lane9-zenkojoken/lane7-jaue)をGmail下書き化しqueuedへ昇格(208→220・
    // as.bunken.co.jp/kokusaibunken.jp/u-gakugei.ac.jp等の運営代行クラスタは各1件のみに抑え分散)。
    // 2026-08-20: アカウント乗っ取り懸念(08-19停止)解除後、本文執筆済みcandidate54件(全件evidence/verifiedAt
    // 済み)から12件(lane9-jsdp/lane9-iesj/lane9-kodomogakkai/lane9-jtsj/lane9-jass/lane9-jale/lane9-yougo/
    // lane9-jmes/lane9-katei-ed/lane9-zenshokai/lane9-jasdd/lane9-jacdp)をGmail下書き化しqueuedへ昇格(220→232)。
    // 2026-08-20続き: gmail_search復旧により、返信が確認できたが未反映だったedtech-systemd-schoolengine
    // (declined・容量不足のため見送り)をoutreach-ledger.jsonへ移しqueueから削除(232→231)。
    // 2026-08-20続き2: lane5-president-family(プレジデント社)がハードバウンス(Relay access denied)と
    // 判明したためoutreach-ledger.jsonへstatus:'closed'で移しqueueから削除(231→230)。
    // 2026-08-21: 0時リセット後、lane7大学3件(chiba-u-education/kobe-u/ocha-u)をGmail下書き化しqueuedへ
    // 昇格(230→233・本日はS13-A A-1の11件と合わせて計14件下書きのため上限内で終了)。
    // 2026-08-21続き: outreach-ledger.jsonのGmail in:sent実測により、2026-08-15〜08-19の間に実送信済み
    // だったにもかかわらずledger未反映だった62件をledgerへ移しqueueから削除(233→171)。うち15件
    // (lane9-jsdp等・lane7大学3件を含む)はmessageId記録があってもgmail_threadで実際にはlabelIds='DRAFT'
    // のまま未送信と判明したためqueuedに残置(この15件は233→171の差分62件には含まれない)。
    // 2026-08-21続き2: 上記反映作業が08-19 22:17台の第2波送信9件(jaue/zenkojoken/zentoku/jssace/
    // geoedu/jash/terakoya-houjousha/yamaguchi-kyoikukai/nagasaki-kyoikukai)とedtech-frompage-ocans
    // (21:52台送信)の計10件を見落としていたと判明し追加反映(171→161)。
    // 2026-08-21続き3: in:sent newer_than:8dで全件突合の再チェックを行い、lane9-jsrecce(日本保育学会)・
    // lane9-nasem(日本教育方法学会)の2件がさらに見落としと判明し追加反映(161→159)。
    // 2026-08-22: 0時リセット後、本文執筆済みcandidate39件から13件(lane9-jasep/lane9-zenkokukateika/
    // lane9-anzenkyoiku/lane9-shitsukyo/edtech-mined-programming/edtech-ictedu-family/
    // lane9-gakugei-kouhou/lane7-naruto-kyoiku/lane7-kyokyo-u/lane7-shizuoka-u-education/
    // lane7-yamanashi-u-education/lane8-toyama-kyoshokuin/lane8-tokushima-kyogo)をGmail下書き化し
    // queuedへ昇格(159→172・大学教育学部/教職員互助会/学会/edtech企業に分散し同一ドメインクラスタへの
    // 集中を回避)。
    // 2026-08-23: 0時リセット後、本文執筆済みcandidate26件から13件(kyoiku-i教育大学広報/総務系4件
    // [osaka-kyoiku/hyogo-kyoiku/ynu/hokkyodai]・npo教職員互助会等4件[yamanashi-shigaku/
    // niigata-kyoshokuin/ibaraki-kyoshokuin/aomori-kyoshokuin]・npo大学教育学部5件
    // [okayama/kagoshima/niigata/mie/shiga])をGmail下書き化しqueuedへ昇格(172→185・全件が
    // 別ドメインのため同一運営代行事務局への集中なし)。
    // 2026-08-23続き: 本日のGmail下書き上限(10-15件)は上記バッチで到達済み(次リセットは08-24 0:00)の
    // ため、本文執筆済みだが未昇格のcandidate13件(lane7大学: nara-kyoiku-u/utsunomiya-u-education/
    // kanazawa-u-education/fukui-u-education/tottori-u-education/ehime-u-education/
    // kumamoto-u-education/oita-u-education/miyazaki-u-education/tsukuba-tech-u/geidai-u/
    // nara-wu-u/saga-u)をGmail下書き作成は行わず(上限を超えないため)status のみqueuedへ昇格
    // (185→198・org/id重複チェック0件)。実際のGmail下書き化は次回リセット後に行う。
    // 2026-08-23さらに続き: 本日新規追加した5件(lane7-hirosaki-u-education/gifu-u-education/
    // yamaguchi-u-education/lane3-manabi-aid/shinnihon-shuppansha)も同様に本文執筆済み・
    // Gmail下書きは未作成のままqueuedへ昇格(198→203)。さらにOneRead(edtech-crop-oneread)・
    // Solvvy株式会社(edtech-solvvy-myclass)の持ち越し2件も新規発見・本文執筆済みでqueued追加(203→205)。
    // 2026-08-23夜: lane8サブタスク1の残り11県未着手分を消化。神奈川(kyo-fukushi.or.jp・会員番号は
    // 任意項目)・愛知(gojokai@fukuri.pref.aichi.jp・組織名義メール確認済み)の2件がcandidateとして
    // 合格し本文執筆済みでqueued追加(205→207)。栃木/群馬/東京/石川/福井/長野/山口/熊本の8県は
    // 電話のみ・独立サイトなし・会員限定ゲートありのいずれかでexcluded。
    // 2026-08-24: 全国家庭科教育協会(lane9-zenkokukateika)が8/23送信・8/24返信を受け
    // outreach-ledger.jsonへ移設されqueueから削除(207→206)。
    // 2026-08-24 23:15: 大学教育学部等lane7の15件(👤による下書き一括送信)がin:sent実測で確認でき
    // outreach-ledger.jsonへ移設されqueueから削除(206→191)。
    // 2026-08-29: outreach-ledger.jsonとのorg完全一致監査で、2026-08-27のCowork第4-6弾で実際には
    // 送信済み(ledgerにOL-08xx等として記録済み)なのにqueue側がqueuedのまま更新漏れだった27件を発見。
    // 放置すると将来のセッションが既送信先へ二重に下書き/フォーム送信するリスクがあったため
    // queueから削除(191→164)。
    // 2026-08-30: T-N1-N4 N3-1で「新規発見」として追加した株式会社ブロッサム九州
    // (moshi-blossoms-kyushu)は、実際にはoutreach-ledger.jsonへ既に2026-08-16送信・
    // 08-29追撃済みで移設済みのidと完全一致する重複だったと判明(gmail_searchで実送信履歴を
    // 発見・queueへのdraft作成前に検知できたため実害なし)。queueから削除し164のまま維持。
    expect(raw.entries.filter((e) => e.status === 'queued')).toHaveLength(164);
  });

  it('line channelは個人塾4件のみ・reviewTierはmutual-link既定spot-checkだがプラスジムのみ個別full-review', () => {
    const lineEntries = raw.entries.filter((e) => e.status === 'queued' && e.channel === 'line');
    expect(lineEntries).toHaveLength(4);
    for (const e of lineEntries) expect(e.lane).toBe('mutual-link');
    const plusgym = lineEntries.find((e) => e.id === 'mutual-link-plusgym-line');
    expect(plusgym?.reviewTier).toBe('full-review');
  });

  it('formPurposeを持つ場合は許容値のみ(accepts-b2b/purpose-restricted/unknown)', () => {
    const allowed = new Set(['accepts-b2b', 'purpose-restricted', 'unknown']);
    for (const e of raw.entries.filter((e) => e.formPurpose !== undefined)) {
      expect(allowed.has(e.formPurpose as string)).toBe(true);
    }
  });

  it('formPurposeはchannel===\'form\'のエントリにのみ付与する', () => {
    for (const e of raw.entries.filter((e) => e.formPurpose !== undefined)) {
      expect(e.channel).toBe('form');
    }
  });

  it('本文中の/pref/<code>リンクは実在する都道府県コードのみ参照する(リンク切れ防止)', () => {
    const brokenRefs: string[] = [];
    for (const e of raw.entries) {
      if (!e.body) continue;
      const matches = e.body.matchAll(/\/pref\/([a-z]+)/g);
      for (const m of matches) {
        const code = m[1];
        if (!getPrefectureByCode(code)) {
          brokenRefs.push(`${e.id}: /pref/${code}`);
        }
      }
    }
    expect(brokenRefs).toEqual([]);
  });

  it('queued(下書き未作成)のorgはdata/outreach-ledger.jsonに送信済みとして記録されていない' +
    '(2026-08-29: Cowork送信後にqueue側の削除漏れで27件が二重登録寸前だった事故の再発防止)', () => {
    const ledgerRaw = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'outreach-ledger.json'), 'utf8')
    ) as { entries: Array<{ org: string }> } | Array<{ org: string }>;
    const ledgerEntries = Array.isArray(ledgerRaw) ? ledgerRaw : ledgerRaw.entries;
    const ledgerOrgs = new Set(ledgerEntries.map((e) => e.org));

    const queuedNoDraft = raw.entries.filter((e) => e.status === 'queued' && !e.draftId);
    const alreadySent = queuedNoDraft.filter((e) => ledgerOrgs.has(e.org)).map((e) => e.id);
    expect(alreadySent).toEqual([]);
  });
});
