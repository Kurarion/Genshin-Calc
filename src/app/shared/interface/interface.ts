import { ElementType, WeaponType } from "../shared.module";

export declare type TYPE_SYS_LANG = 'cn_sim' | 'cn_tra' | 'en' | 'jp';
export declare type TYPE_TESSERACT_LANG = 'chi_sim' | 'chi_tra' | 'eng' | 'jpn';
export declare type TYPE_GENSHINDB_LANG = 'ChineseSimplified' | 'ChineseTraditional' | 'English' | 'Japanese';

export declare type TYPE_HTTP_RESPONSE_TYPE = 'json' | 'text' | 'arraybuffer' | 'blob';

export interface CharacterQueryParam {
  index?: string | number,
}

/** メニューインタフェース */
export interface CharaInfo {
  index: string;
  names: Record<TYPE_SYS_LANG, string>;
  routerLink: string;
  queryParams: CharacterQueryParam;
  elementType?: string;
  isEnkaData?: boolean;
  iconImg?: string;
  elementTypeNumber?: ElementType;
  elementSvg?: string;
  bgImg?: string;
  weaponType?: WeaponType;
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
  artifact: Record<string, ExtraArtifact>;
}

/** 補足データ - 1階 */
export interface ExtraCharacter {
  skills?: ExtraCharacterSkills;
  constellation?: Record<string, ExtraSkillInfo[]>;
}

export interface ExtraWeapon {
  effect?: ExtraSkillInfo[];
}

export interface ExtraArtifact {
  set1?: ExtraSkillInfo[];
  set2?: ExtraSkillInfo[];
}

/** 補足データ - 2階 */
export interface ExtraCharacterSkills {
  normal: ExtraSkillInfo[];
  skill: ExtraSkillInfo[];
  other?: ExtraSkillInfo[];
  elementalBurst: ExtraSkillInfo[];
  proudSkills: ExtraSkillInfo[][];
}

/** 補足データ - 3階 */
export interface ExtraSkillInfo {
  //計算
  damage?: ExtraSkillDamage;//ダメージ値
  buffs?: ExtraSkillBuff[];//バフ値
  healing?: ExtraSkillHealing;//治療値
  shield?: ExtraSkillShield;//シールド
  product?: ExtraSkillProduct;//召喚物
}

/** 補足データ - 4階 */
export interface ExtraSkillDamage {
  //連携スキル
  originSkills?: TYPE_SKILL[];
  originIndexs?: number[];
  originRelations?: TYPE_RELATION[];
  //数値計算ベースインデックスリスト
  indexs?: number[];
  indexsAttach?: number[][];
  //カスタマー倍率
  customValues?: number[];
  //----------------------
  //数値計算ベース
  base?: string;
  baseAttach?: string[];
  //その他
  canOverride?: boolean; //元素オーバーライド可否
  elementBonusType?: string; //元素タイプ
  attackBonusType?: string; //攻撃タイプ
  //タグ
  tag?: string; //タグ
  //絶対ダメージ
  isAbsoluteDmg?: boolean;
}

export interface ExtraSkillBuff {
  //数値計算ベース
  index?: number;
  indexMultiValue?: number;
  indexAddValue?: number;
  calRelation?: TYPE_RELATION;
  priority?: number;
  finallyCal?: boolean;
  //元素付与
  overrideElement?: string;
  //数値計算ベースインデックスリスト
  constIndex?: number;
  constCalRelation?: TYPE_RELATION;
  //カスタマー倍率
  customValue?: number;
  //聖遺物二点セット用
  propIndex?: number;
  //----------------------
  //数値計算ベース
  base?: string;
  baseModifyValue?: number;
  baseModifyRelation?: TYPE_RELATION;
  //数値計算ベース２
  base2?: string;
  //目標
  target: string[];
  convertElement?: string;
  //チーム関連
  isAllTeam?: boolean;
  isOnlyForOther?: boolean;
  canOverlying?: boolean;
  calByOrigin?: boolean;
  canSecondaryTrans?: boolean;
  buffTag?: string;
  //上限
  maxValIndex?: number;
  maxValBase?: string;
  maxValConstIndex?: number;
  maxValValue?: number;
  //スライダー
  sliderMax?: number;
  sliderMin?: number;
  sliderInitialValue?: number;
  sliderStep?: number;
  //特殊スライダーインデックス
  sliderStartIndex?: number;
  //設定
  settingType?: TYPE_BUFF_SETTING;
  defaultEnable?: boolean;
  //限定武器タイプ
  weaponTypeLimit?: string[];
  //限定自身元素タイプ
  selfElementTypeLimit?: boolean;
  //マックススタックバフ（複数バフのみ適用）
  isMaximumStackBuff?: boolean;
  //説明
  desc?: string;
  title?: string;
}

export interface ExtraSkillHealing {
  //連携スキル
  originSkills?: TYPE_SKILL[];
  originIndexs?: number[];
  originRelations?: TYPE_RELATION[];
  originConstIndexs?: number[];
  originConstRelations?: TYPE_RELATION[];
  originInnerRelations?: TYPE_RELATION[];
  //数値計算ベースインデックスリスト
  index?: number;
  constIndex?: number;
  constCalRelation?: TYPE_RELATION;
  //カスタマー倍率
  customValue?: number;
  //数値計算ベース
  base?: string;
  healingBonusType?: string; //治療タイプ
}

export interface ExtraSkillShield {
  //連携スキル
  originSkills?: TYPE_SKILL[];
  originIndexs?: number[];
  originRelations?: TYPE_RELATION[];
  originConstIndexs?: number[];
  originConstRelations?: TYPE_RELATION[];
  originInnerRelations?: TYPE_RELATION[];
  //数値計算ベースインデックスリスト
  index?: number;
  constIndex?: number;
  constCalRelation?: TYPE_RELATION;
  //カスタマー倍率
  customValue?: number;
  //数値計算ベース
  base?: string;
  shieldBonusType?: string; //シールドタイプ
  //シールド元素タイプ
  shieldElementType?: string;
}

export interface ExtraSkillProduct {
  //数値計算ベースインデックスリスト
  index?: number;
  constIndex?: number;
  constCalRelation?: TYPE_RELATION;
  //カスタマー倍率
  customValue?: number;
  //数値計算ベース
  base?: string;
}

/** 補足データ - 5階 */
export declare type TYPE_SKILL = 'normal' | 'skill' | 'elementalBurst' | 'proudSkills';
export declare type TYPE_RELATION = '*' | '+' | '-' | '/';
export declare type TYPE_BUFF_SETTING = 'resident' | 'switch-value' | 'slider' | 'switch';