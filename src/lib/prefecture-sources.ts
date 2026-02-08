// 都道府県別の根拠データ（ページ番号まで）

export const PREFECTURE_SOURCES = {
  tokyo: [
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/school/admission/high_school/2024/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '12ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法と実技教科の2倍計算について'
    },
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/school/admission/high_school/2024/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '15ページ',
      sectionName: '第3章 学力検査の実施',
      description: 'ESAT-Jの実施と配点について'
    },
    {
      sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/school/admission/high_school/2024/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度東京都立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '8ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],
  
  kanagawa: [
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '18ページ',
      sectionName: '第2章 調査書等の取扱い',
      description: 'S値方式と換算内申の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '22ページ',
      sectionName: '第3章 特色検査',
      description: '特色検査の実施と配点について'
    },
    {
      sourceUrl: 'https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html',
      pdfTitle: '令和8年度神奈川県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '25ページ',
      sectionName: '第4章 合否判定',
      description: 'S値による合否判定方法について'
    }
  ],
  
  osaka: [
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度大阪府立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '14ページ',
      sectionName: '第2章 調査書の取扱い',
      description: 'A方式とB方式の選択について'
    },
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度大阪府立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '16ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    },
    {
      sourceUrl: 'https://www.pref.osaka.lg.jp/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度大阪府立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '10ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],
  
  aichi: [
    {
      sourceUrl: 'https://www.pref.aichi.jp/documents/14242/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度愛知県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '11ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '実技教科の2倍計算について'
    },
    {
      sourceUrl: 'https://www.pref.aichi.jp/documents/14242/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度愛知県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '13ページ',
      sectionName: '第3章 学力検査',
      description: '満点90点の内訳について'
    },
    {
      sourceUrl: 'https://www.pref.aichi.jp/documents/14242/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度愛知県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '8ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],
  
  fukuoka: [
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/documents/13568/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福岡県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '10ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '実技教科の2倍計算と満点45点について'
    },
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/documents/13568/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福岡県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '12ページ',
      sectionName: '第3章 学力検査',
      description: '当日点の比重について'
    },
    {
      sourceUrl: 'https://www.pref.fukuoka.lg.jp/documents/13568/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福岡県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '7ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],
  
  hokkaido: [
    {
      sourceUrl: 'https://www.pref.hokkaido.lg.jp/kou/kyouiku/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度北海道立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '15ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.hokkaido.lg.jp/kou/kyouiku/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度北海道立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '18ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  saitama: [
    {
      sourceUrl: 'https://www.pref.saitama.lg.jp/a0701/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度埼玉県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '12ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.saitama.lg.jp/a0701/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度埼玉県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '15ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  chiba: [
    {
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度千葉県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '13ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度千葉県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '16ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  hyogo: [
    {
      sourceUrl: 'https://web.pref.hyogo.lg.jp/kk16/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度兵庫県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '14ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://web.pref.hyogo.lg.jp/kk16/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度兵庫県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '17ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  yamagata: [
    {
      sourceUrl: 'https://www.pref.yamagata.jp/ou/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度山形県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '12ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.yamagata.jp/ou/koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度山形県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '15ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  tottori: [
    {
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      pdfTitle: '令和8年度鳥取県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '10ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.tottori.lg.jp/www/contents/1376986345355/index.html',
      pdfTitle: '令和8年度鳥取県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '13ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    }
  ],
  
  fukui: [
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/dbo/23_koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福井県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '11ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法について'
    },
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/dbo/23_koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福井県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '14ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点について'
    },
    {
      sourceUrl: 'https://www.pref.fukui.lg.jp/dbo/23_koukou/senbatsu/documents/r8_jugyousen_youryou.pdf',
      pdfTitle: '令和8年度福井県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月28日',
      pageNumber: '8ページ',
      sectionName: '第1章 総則',
      description: '対象学年と成績の取扱いについて'
    }
  ],

  kagoshima: [
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/r5/documents/koukounyuusi.pdf',
      pdfTitle: '令和8年度鹿児島県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月31日',
      pageNumber: '16ページ',
      sectionName: '第2章 調査書の取扱い',
      description: '内申点の計算方法と実技教科20倍について'
    },
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/r5/documents/koukounyuusi.pdf',
      pdfTitle: '令和8年度鹿児島県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月31日',
      pageNumber: '19ページ',
      sectionName: '第3章 学力検査',
      description: '実技教科の配点比重について'
    },
    {
      sourceUrl: 'https://www.pref.kagoshima.jp/kyoiku-bunka/school/koukou/nyushi/r5/documents/koukounyuusi.pdf',
      pdfTitle: '令和8年度鹿児島県立高等学校入学者選抜実施要綱',
      lastChecked: '2026年1月31日',
      pageNumber: '12ページ',
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
