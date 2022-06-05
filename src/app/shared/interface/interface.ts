export declare type TYPE_SYS_LANG = 'cn_sim' | 'cn_tra' | 'en' | 'jp';
export declare type TYPE_TESSERACT_LANG = 'chi_sim' | 'chi_tra' | 'eng' | 'jpn';
export declare type TYPE_GENSHINDB_LANG = 'ChineseSimplified' | 'ChineseTraditional' | 'English' | 'Japanese';

export declare type TYPE_HTTP_RESPONSE_TYPE = 'json' | 'text' | 'arraybuffer' | 'blob';

export interface CharacterQueryParam {
  index?: string | number,
}

/** メニューインタフェース */
export interface MenuInfo {
  names: Record<TYPE_SYS_LANG, string>;
  routerLink: string;
  queryParams: CharacterQueryParam;
}

/** 言語インタフェース */
export interface LangInfo {
  code: TYPE_SYS_LANG;
  displayName: string;
}

/** 補足データ */
export interface ExtraData {
  characters: Record<string, ExtraCharacter>;
  weapons: Record<string, ExtraWeapon>;
}

/** 補足データ - 1階 */
export interface ExtraCharacter {
  skills?: ExtraCharacterSkills;
  constellation?: Record<string, ExtraSkillInfo>;
}

export interface ExtraWeapon {
  effect?: ExtraSkillInfo[];
}

/** 補足データ - 2階 */
export interface ExtraCharacterSkills {
  normal: ExtraSkillInfo[];
  skill: ExtraSkillInfo[];
  elemental_burst: ExtraSkillInfo[];
  proudSkills: ExtraSkillInfo[][];
}

/** 補足データ - 3階 */
export interface ExtraSkillInfo {
  //パラメータインデックスリスト
  index?: number[];
  //計算
  damage?: ExtraSkillDamage;//ダメージ値
  buff?: ExtraSkillBuff;//バフ値
  healing?: ExtraSkillHealing;//治療値
  shield?: ExtraSkillShield;//シールド
}

/** 補足データ - 4階 */
export interface ExtraSkillDamage {
  //数値計算ベースインデックスリスト
  index?: number[];
  //数値計算ベース
  base?: string;
  //その他
  unOverride?: boolean; //元素オーバーライド可否
  elementType?: string; //元素タイプ
  attackType?: string; //攻撃タイプ
}

export interface ExtraSkillBuff {
  //数値計算ベースインデックスリスト
  index?: number[];
  //数値計算ベース
  base?: string;
  //目標
  target?: string;
  convertElement?: string;
  //チームに有効可否
  isGlobal?: boolean;
  //上限
  maxValIndex?: number[];
  maxValBase?: string;
  maxValConstIndex?: number[];
  //オーバーレイ上限
  settingType?: TYPE_BUFF_SETTING;
  maxNum?: number;
}

export interface ExtraSkillHealing {
  //数値計算ベースインデックスリスト
  index?: number[];
  constIndex?: number[];
  //数値計算ベース
  base?: string;
}

export interface ExtraSkillShield {
  //数値計算ベースインデックスリスト
  index?: number[];
  constIndex?: number[];
  //数値計算ベース
  base?: string;
}

/** 補足データ - 5階 */
export declare type TYPE_RELATION = 'x' | '+' | '-' | '/';
export declare type TYPE_BUFF_SETTING = 'switch-value' | 'slider' | 'switch';