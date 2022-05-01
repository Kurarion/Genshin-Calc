export declare type TYPE_SYS_LANG = 'cn_sim' | 'cn_tra' | 'en' | 'jp';
export declare type TYPE_TESSERACT_LANG = 'chi_sim' | 'chi_tra' | 'eng' | 'jpn';
export declare type TYPE_GENSHINDB_LANG = 'ChineseSimplified' | 'ChineseTraditional' | 'English' | 'Japanese';

/** メニューインタフェース */
export interface MenuInfo {
  name: string;
  link: string;
}

/** 言語インタフェース */
export interface LangInfo {
  code: TYPE_SYS_LANG;
  displayName: string;
}
