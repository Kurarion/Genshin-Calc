export declare type TYPE_SYS_LANG = 'cn_sim' | 'cn_tra' | 'en' | 'jp';
export declare type TYPE_TESSERACT_LANG = 'chi_sim' | 'chi_tra' | 'eng' | 'jpn';
export declare type TYPE_GENSHINDB_LANG = 'ChineseSimplified' | 'ChineseTraditional' | 'English' | 'Japanese';

export declare type TYPE_HTTP_RESPONSE_TYPE = 'json' | 'text' | 'arraybuffer' | 'blob';

export interface CharacterQueryParam {
  name?: string,
}

/** メニューインタフェース */
export interface MenuInfo {
  name: string;
  routerLink: string;
  queryParams: CharacterQueryParam;
}

/** 言語インタフェース */
export interface LangInfo {
  code: TYPE_SYS_LANG;
  displayName: string;
}
