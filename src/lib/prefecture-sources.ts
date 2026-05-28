// 都道府県別の根拠データ（ページ番号まで）

export const PREFECTURE_SOURCES = {
  tokyo: [
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱・同細目について',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱（公式公開ページ）',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法と実技教科の2倍計算について'
    },
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱・同細目について',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱（公式公開ページ）',
      sectionName: '第3章 学力検査の実施',
      description: 'ESAT-Jの実施と配点について'
    },
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/exam/release20250925_r8yoko.html',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱・同細目について',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱（公式公開ページ）',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  kanagawa: [
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年4月22日',
      pageNumber: '18ページ',
      sectionName: '第2章 調査書等の取扱い',
      description: 'S値方式と換算内申の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年4月22日',
      pageNumber: '22ページ',
      sectionName: '第3章 特色検査',
      description: '特色検査の実施と配点について'
    },
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年4月22日',
      pageNumber: '25ページ',
      sectionName: '第4章 合否判定',
      description: 'S値による合否判定方法について'
    }
  ],

  osaka: [
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
      pdfTitle: '令和8年度公立高等学校入学者選抜等について（大阪府教育庁）',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱掲載ページ',
      sectionName: '第2章 調査書の取扱い',
      description: 'A方式とB方式の選択について'
    },
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
      pdfTitle: '令和8年度公立高等学校入学者選抜等について（大阪府教育庁）',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱掲載ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    },
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/o180040/kotogakko/gakuji-g3/r08_kokosenbatsu.html',
      pdfTitle: '令和8年度公立高等学校入学者選抜等について（大阪府教育庁）',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱掲載ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  aichi: [
    {
      sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
      pdfTitle: '令和8年度愛知県公立高等学校入学者選抜について（愛知県）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '調査書点（内申点）の算出'
    },
    {
      sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
      pdfTitle: '令和8年度愛知県公立高等学校入学者選抜について（愛知県）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '満点90点の内訳について'
    },
    {
      sourceUrl: 'https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html',
      pdfTitle: '令和8年度愛知県公立高等学校入学者選抜について（愛知県）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  fukuoka: [
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/kyouiku/',
      pdfTitle: '福岡県教育委員会（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '実技教科の2倍計算と満点45点について'
    },
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/kyouiku/',
      pdfTitle: '福岡県教育委員会（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '当日点の比重について'
    },
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/kyouiku/',
      pdfTitle: '福岡県教育委員会（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  hokkaido: [
    {
      sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/',
      pdfTitle: '北海道教育庁学校教育局高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.dokyoi.pref.hokkaido.lg.jp/hk/kki/',
      pdfTitle: '北海道教育庁学校教育局高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],

  saitama: [
    {
      sourceUrl: 'https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jissiyoukou.html',
      pdfTitle: '令和8年度埼玉県公立高等学校入学者選抜実施要綱・選抜要領',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱（公式公開ページ）',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jissiyoukou.html',
      pdfTitle: '令和8年度埼玉県公立高等学校入学者選抜実施要綱・選抜要領',
      lastChecked: '2026年5月28日',
      pageNumber: '実施要綱（公式公開ページ）',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],

  chiba: [
    {
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html',
      pdfTitle: '高等学校入学者選抜情報',
      lastChecked: '2026年4月22日',
      pageNumber: '公式サイト',
      sectionName: '入試情報トップ',
      description: '千葉県の高等学校入学者選抜に関する公式情報'
    },
    {
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/r8jissiyoko.html',
      pdfTitle: '令和8年度千葉県公立高等学校入学者選抜実施要項',
      lastChecked: '2026年4月22日',
      pageNumber: '公式掲載ページ',
      sectionName: '実施要項',
      description: '内申点の計算方法について'
    }
  ],

  hyogo: [
    {
      sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/',
      pdfTitle: '兵庫県教育委員会高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.hyogo-c.ed.jp/~koko-bo/',
      pdfTitle: '兵庫県教育委員会高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],

  yamagata: [
    {
      sourceUrl: 'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
      pdfTitle: '令和8年度山形県公立高等学校入学者選抜実施要項',
      lastChecked: '2026年5月28日',
      pageNumber: '該当ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.yamagata.jp/documents/42443/r8kouritsukoutougakkounyuugakusyasennbatsujissiyoukou.pdf',
      pdfTitle: '令和8年度山形県公立高等学校入学者選抜実施要項',
      lastChecked: '2026年5月28日',
      pageNumber: '該当ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],

  tottori: [
    {
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      pdfTitle: '令和8年度鳥取県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年4月22日',
      pageNumber: '10ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      pdfTitle: '令和8年度鳥取県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年4月22日',
      pageNumber: '13ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],

  fukui: [
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/',
      pdfTitle: '福井県教育庁高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/',
      pdfTitle: '福井県教育庁高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    },
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/',
      pdfTitle: '福井県教育庁高校教育課（公立高校入試情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  kagoshima: [
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/',
      pdfTitle: '鹿児島県公立高等学校入学者選抜（公式情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法と実技教科20倍について'
    },
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/',
      pdfTitle: '鹿児島県公立高等学校入学者選抜（公式情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点比重について'
    },
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/',
      pdfTitle: '鹿児島県公立高等学校入学者選抜（公式情報ハブ）',
      lastChecked: '2026年5月28日',
      pageNumber: '公式サイト',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ]
};

export type PrefectureSource = {
  sourceUrl: string;
  pdfTitle: string;
  lastChecked: string;
  pageNumber: string;
  sectionName: string;
  description: string;
};

export type PrefectureSources = Record<string, PrefectureSource[]>;
