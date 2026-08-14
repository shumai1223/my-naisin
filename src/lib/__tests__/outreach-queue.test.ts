import fs from 'node:fs';
import path from 'node:path';
import { sortQueueByPriority, summarizeQueue, queueReviewTierOf, type QueueEntry } from '../outreach-queue';

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
    expect(raw.entries.filter((e) => e.status === 'queued')).toHaveLength(150);
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
});
