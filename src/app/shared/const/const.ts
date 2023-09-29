import { ElementType, LangInfo, TYPE_GENSHINDB_LANG, TYPE_SYS_LANG, TYPE_TESSERACT_LANG, WeaponType } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

interface PROPS_INFO {
  fullName: string,
  i18nList: string[],
  isPercent: boolean,
}

const props_all_map_func = (list: string[]): PROPS_INFO => {
  const fullName = list.join(Const.CONCATENATION_TAG)
  const i18nCatalogProps = 'PROPS.'
  const i18nCatalogTag = 'TAG.'
  const i18nLeftBrackets = 'TAG.LEFT_BRACKETS'
  const i18nRightBrackets = 'TAG.RIGHT_BRACKETS'
  const i18nList: string[] = [i18nCatalogProps + list[0]]
  for(let i = 1; i < list.length; ++i) {
    i18nList.push(i18nLeftBrackets)
    i18nList.push(i18nCatalogTag + list[i])
    i18nList.push(i18nRightBrackets)
  }
  return {
    fullName,
    i18nList,
    isPercent: Const.PROPS_ALL_DATA_PERCENT.includes(fullName)
  }
}

export class Const {
  //*********************************
  //        ローカルストレージ
  //*********************************
  static readonly STORAGE_LANG = 'lang';

  //*********************************
  //           连接符
  //*********************************
  //タグ
  static readonly CONCATENATION_TAG = "_";

  //*********************************
  //             言語
  //*********************************
  static readonly LAN_CHS = "cn_sim";
  static readonly LAN_CHT = "cn_tra";
  static readonly LAN_EN = "en";
  static readonly LAN_JP = "jp";

  static readonly CULTURELANG_MAP: Map<string, TYPE_SYS_LANG> = new Map([
    ['ja', Const.LAN_JP],
    ['ja-JP', Const.LAN_JP],
    ['jp-JP', Const.LAN_JP],
    ['zh', Const.LAN_CHS],
    ['zh-Hans', Const.LAN_CHS],
    ['zh-CN', Const.LAN_CHS],
    ['zh-Hant', Const.LAN_CHT],
    ['zh-HK', Const.LAN_CHT],
    ['zh-TW', Const.LAN_CHT],
  ])

  static readonly LIST_LANG: LangInfo[] = [
    { code: 'cn_sim', displayName: '中文(简)' },
    { code: 'cn_tra', displayName: '中文(繁)' },
    { code: 'en', displayName: 'English' },
    { code: 'jp', displayName: '日本語' },
  ];

  static readonly MAP_TESSERACT_LANG: Record<TYPE_SYS_LANG, TYPE_TESSERACT_LANG> = {
    cn_sim: 'chi_sim',
    cn_tra: 'chi_tra',
    en: 'eng',
    jp: 'jpn',
  };

  static readonly MAP_GENSHINDB_LANG: Record<TYPE_SYS_LANG, TYPE_GENSHINDB_LANG> = {
    cn_sim: 'ChineseSimplified',
    cn_tra: 'ChineseTraditional',
    en: 'English',
    jp: 'Japanese',
  };

  static readonly MAP_MANUAL_FILE: Record<TYPE_SYS_LANG, string> = {
    cn_sim: 'manual/README_CH_SIM.md',
    cn_tra: 'manual/README_CH_TRA.md',
    en: 'manual/README.md',
    jp: 'manual/README_JP.md',
  };

  static DEFAULT_LANG: TYPE_SYS_LANG = environment.defaultLang as TYPE_SYS_LANG;

  //*********************************
  //          クッキーキー
  //*********************************
  static readonly ID_CAPTURE_ELEMENT = 'toCaptureElement';

  //*********************************
  //            メニュー
  //*********************************
  static readonly MENU_CHARACTER = 'character';

  //*********************************
  //            スキルなど
  //*********************************
  static readonly NAME_SKILLS = 'skills';
  static readonly NAME_SKILLS_NORMAL = 'normal';
  static readonly NAME_SKILLS_SKILL = 'skill';
  static readonly NAME_SKILLS_ELEMENTAL_BURST = 'elementalBurst';
  static readonly NAME_SKILLS_OTHER = 'other';
  static readonly NAME_SKILLS_PROUD = 'proudSkills';
  static readonly NAME_CONSTELLATION = 'constellation';
  static readonly NAME_EFFECT = 'effect';
  static readonly NAME_SET = 'set';

  static readonly NAME_CONSTELLATION_1 = "0";
  static readonly NAME_CONSTELLATION_2 = "1";
  static readonly NAME_CONSTELLATION_3 = "2";
  static readonly NAME_CONSTELLATION_4 = "3";
  static readonly NAME_CONSTELLATION_5 = "4";
  static readonly NAME_CONSTELLATION_6 = "5";

  static readonly NAME_TALENT_DEFAULT_LEVEL = "01";
  static readonly NAME_NO_LEVEL = "";

  static readonly ELEMENT_CRYO = "CRYO";
  static readonly ELEMENT_ANEMO = "ANEMO";
  static readonly ELEMENT_PHYSICAL = "PHYSICAL";
  static readonly ELEMENT_ELECTRO = "ELECTRO";
  static readonly ELEMENT_GEO = "GEO";
  static readonly ELEMENT_PYRO = "PYRO";
  static readonly ELEMENT_HYDRO = "HYDRO";
  static readonly ELEMENT_DENDRO = "DENDRO";
  static readonly ELEMENT_VAPORIZE = "VAPORIZE";
  static readonly ELEMENT_MELT = "MELT";
  static readonly ELEMENT_OVERLOADED = "OVERLOADED";
  static readonly ELEMENT_BURNING = "BURNING";
  static readonly ELEMENT_ELECTROCHARGED = "ELECTROCHARGED";
  static readonly ELEMENT_SUPERCONDUCT = "SUPERCONDUCT";
  static readonly ELEMENT_SWIRL = "SWIRL";
  static readonly ELEMENT_DESTRUCTION = "DESTRUCTION";
  static readonly ELEMENT_SHIELD = "SHIELD";
  static readonly ELEMENT_NONE = "NONE";

  static readonly ELEMENT_COLOR_MAP: Record<string, string> = {
    "CRYO": "#96dfff",
    "ANEMO": "#afe9d8",
    "PHYSICAL": "#fafafa",
    "ELECTRO": "#f6c2f7",
    "GEO": "#ffe6a5",
    "PYRO": "#ee8989",
    "HYDRO": "#90c7ff",
    "DENDRO": "#7cde8c",
  }

  static readonly ELEMENT_COLOR_NONE = "#cccccc";
  static readonly SKILL_ICON_GRADIENT = [
    'radial-gradient(circle, #5d5d5d 50%, ',
    ' 60%,  rgba(0,0,0,0.3) 65%)'
  ]
  static readonly SHIELD_BG_GRADIENT = [
    'radial-gradient(145deg, ',
    ' 60%,  rgba(0,0,0,0.3) 65%)'
  ]

  static readonly QUALITY_ORANGE_BG = "linear-gradient(145deg, rgba(149,106,67,1) 12%, rgba(222,147,81,1) 86%)"
  static readonly QUALITY_ORANGE_SP_BG = "linear-gradient(145deg, rgba(172,80,84,1) 12%, rgba(219,76,86,1) 86%)"
  static readonly QUALITY_PURPLE_BG = "linear-gradient(145deg, rgba(101,96,140,1) 12%, rgba(151,118,197,1) 86%)"
  static readonly QUALITY_TEMP_BG = "linear-gradient(145deg, rgba(74,74,74,1) 12%, rgba(130,130,130,1) 86%)"

  static readonly QUALITY_BG_SUFFIX = "_BG";

  static readonly ELEMENT_LIST: ElementType[] = [2, 3, 4, 5, 6, 7, 8];
  static readonly ELEMENT_SVG_PATH: Map<ElementType, string> = new Map([
    [2, "assets/icons/element/pyro.svg"],
    [3, "assets/icons/element/hydro.svg"],
    [4, "assets/icons/element/anemo.svg"],
    [5, "assets/icons/element/cryo.svg"],
    [6, "assets/icons/element/geo.svg"],
    [7, "assets/icons/element/electro.svg"],
    [8, "assets/icons/element/dendro.svg"],
  ])

  static readonly WEAPON_TYPE_LIST: WeaponType[] = ["WEAPON_SWORD_ONE_HAND", "WEAPON_CATALYST", "WEAPON_CLAYMORE", "WEAPON_BOW", "WEAPON_POLE"];
  static readonly WEAPON_TYPE_SVG_PATH: Map<WeaponType, string> = new Map([
    ["WEAPON_SWORD_ONE_HAND", "assets/icons/weapon/WEAPON_SWORD_ONE_HAND.png"],
    ["WEAPON_CATALYST", "assets/icons/weapon/WEAPON_CATALYST.png"],
    ["WEAPON_CLAYMORE", "assets/icons/weapon/WEAPON_CLAYMORE.png"],
    ["WEAPON_BOW", "assets/icons/weapon/WEAPON_BOW.png"],
    ["WEAPON_POLE", "assets/icons/weapon/WEAPON_POLE.png"],
  ])

  static readonly IMG_ON_ERROR = "assets/icons/UI_Temp.png";

  static readonly IMG_RES_404_REG = /\/404.png$/;
  static readonly IMG_RES_404_HEIGHT = 400;
  static readonly IMG_RES_404_WIDTH = 400;

  static readonly MIN_WEAPON_SMELTING = "1";
  static readonly MAX_WEAPON_SMELTING = "5";

  static readonly SHIELD_SPECIAL_ELEMENT_ABS_RATE = 2.5;
  static readonly SHIELD_GEO_ELEMENT_ABS_RATE = 1.5;

  //*********************************
  //           　属性
  //*********************************
  //特殊BUFFに変えるための仮想属性（固定1）
  static readonly PROP_FIX_NUMBER_1 = "FIX_NUMBER_1";
  //聖遺物海染硨磲治療量
  static readonly PROP_OTHER_OCEAN_HUED_HEALING = "OCEAN_HUED_HEALING";
  //レベル
  static readonly PROP_LEVEL = "LEVEL";
  //生命力ベース
  static readonly PROP_HP_BASE = "HP_BASE";
  //攻撃力ベース
  static readonly PROP_ATTACK_BASE = "ATTACK_BASE";
  //防御力ベース
  static readonly PROP_DEFENSE_BASE = "DEFENSE_BASE";
  //元素爆発エネルギー
  static readonly PROP_ELEMENTAL_BURST_ENERGY = "ELEMENTAL_BURST_ENERGY";
  //生命力
  static readonly PROP_HP = "HP";
  //攻撃力
  static readonly PROP_ATTACK = "ATTACK";
  //防御力
  static readonly PROP_DEFENSE = "DEFENSE";
  //生命力数値アップ
  static readonly PROP_VAL_HP = "HP_VAL_UP";
  //攻撃力数値アップ
  static readonly PROP_VAL_ATTACK = "ATTACK_VAL_UP";
  //防御力数値アップ
  static readonly PROP_VAL_DEFENSE = "DEFENSE_VAL_UP";
  //生命力アップ
  static readonly PROP_HP_UP = "HP_UP";
  //攻撃力アップ
  static readonly PROP_ATTACK_UP = "ATTACK_UP";
  //防御力アップ
  static readonly PROP_DEFENSE_UP = "DEFENSE_UP";
  //会心率
  static readonly PROP_CRIT_RATE = "CRIT_RATE";
  //会心ダメージ
  static readonly PROP_CRIT_DMG = "CRIT_DMG";
  //元素チャージ効率
  static readonly PROP_ENERGY_RECHARGE = "ENERGY_RECHARGE";
  //与える治療効果
  static readonly PROP_HEALING_BONUS = "HEALING_BONUS";
  //受ける治療効果
  static readonly PROP_REVERSE_HEALING_BONUS = "REVERSE_HEALING_BONUS";
  //元素熟知
  static readonly PROP_ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY";
  //氷元素ダメージ
  static readonly PROP_DMG_BONUS_CRYO = "DMG_BONUS_CRYO";
  //風元素ダメージ
  static readonly PROP_DMG_BONUS_ANEMO = "DMG_BONUS_ANEMO";
  //物理ダメージ
  static readonly PROP_DMG_BONUS_PHYSICAL = "DMG_BONUS_PHYSICAL";
  //雷元素ダメージ
  static readonly PROP_DMG_BONUS_ELECTRO = "DMG_BONUS_ELECTRO";
  //岩元素ダメージ
  static readonly PROP_DMG_BONUS_GEO = "DMG_BONUS_GEO";
  //火元素ダメージ
  static readonly PROP_DMG_BONUS_PYRO = "DMG_BONUS_PYRO";
  //水元素ダメージ
  static readonly PROP_DMG_BONUS_HYDRO = "DMG_BONUS_HYDRO";
  //草元素ダメージ
  static readonly PROP_DMG_BONUS_DENDRO = "DMG_BONUS_DENDRO";
  //全ダメージ
  static readonly PROP_DMG_BONUS_ALL = "DMG_BONUS_ALL";
  //基本攻撃ダメージ
  static readonly PROP_DMG_BONUS_NORMAL = "DMG_BONUS_NORMAL";
  //重撃ダメージ
  static readonly PROP_DMG_BONUS_CHARGED = "DMG_BONUS_CHARGED";
  //落下攻撃ダメージ
  static readonly PROP_DMG_BONUS_PLUNGING = "DMG_BONUS_PLUNGING";
  //元素スキルダメージ
  static readonly PROP_DMG_BONUS_SKILL = "DMG_BONUS_SKILL";
  //元素爆発ダメージ
  static readonly PROP_DMG_BONUS_ELEMENTAL_BURST = "DMG_BONUS_ELEMENTAL_BURST";
  //武器ダメージ
  static readonly PROP_DMG_BONUS_WEAPON = "DMG_BONUS_WEAPON";
  //その他ダメージ
  static readonly PROP_DMG_BONUS_OTHER = "DMG_BONUS_OTHER";
  //聖遺物セットダメージ
  static readonly PROP_DMG_BONUS_SET = "DMG_BONUS_SET";
  //基本治療
  static readonly PROP_HEALING_BONUS_NORMAL = "HEALING_BONUS_NORMAL";
  //元素スキル治療
  static readonly PROP_HEALING_BONUS_SKILL = "HEALING_BONUS_SKILL";
  //元素爆発治療
  static readonly PROP_HEALING_BONUS_ELEMENTAL_BURST = "HEALING_BONUS_ELEMENTAL_BURST";
  //武器治療
  static readonly PROP_HEALING_BONUS_WEAPON = "HEALING_BONUS_WEAPON";
  //その他治療
  static readonly PROP_HEALING_BONUS_OTHER = "HEALING_BONUS_OTHER";
  //聖遺物セット治療
  static readonly PROP_HEALING_BONUS_SET = "HEALING_BONUS_SET";
  //基本シールド
  static readonly PROP_SHIELD_BONUS_NORMAL = "SHIELD_BONUS_NORMAL";
  //元素スキルシールド
  static readonly PROP_SHIELD_BONUS_SKILL = "SHIELD_BONUS_SKILL";
  //元素爆発シールド
  static readonly PROP_SHIELD_BONUS_ELEMENTAL_BURST = "SHIELD_BONUS_ELEMENTAL_BURST";
  //武器シールド
  static readonly PROP_SHIELD_BONUS_WEAPON = "SHIELD_BONUS_WEAPON";
  //その他シールド
  static readonly PROP_SHIELD_BONUS_OTHER = "SHIELD_BONUS_OTHER";
  //聖遺物セットシールド
  static readonly PROP_SHIELD_BONUS_SET = "SHIELD_BONUS_SET";

  //氷元素耐性
  static readonly PROP_DMG_ANTI_CRYO = "DMG_ANTI_CRYO";
  //風元素耐性
  static readonly PROP_DMG_ANTI_ANEMO = "DMG_ANTI_ANEMO";
  //物理耐性
  static readonly PROP_DMG_ANTI_PHYSICAL = "DMG_ANTI_PHYSICAL";
  //雷元素耐性
  static readonly PROP_DMG_ANTI_ELECTRO = "DMG_ANTI_ELECTRO";
  //岩元素耐性
  static readonly PROP_DMG_ANTI_GEO = "DMG_ANTI_GEO";
  //火元素耐性
  static readonly PROP_DMG_ANTI_PYRO = "DMG_ANTI_PYRO";
  //水元素耐性
  static readonly PROP_DMG_ANTI_HYDRO = "DMG_ANTI_HYDRO";
  //草元素耐性
  static readonly PROP_DMG_ANTI_DENDRO = "DMG_ANTI_DENDRO";

  //氷元素耐性マイナス
  static readonly PROP_DMG_ANTI_CRYO_MINUS = "DMG_ANTI_CRYO_MINUS";
  //風元素耐性マイナス
  static readonly PROP_DMG_ANTI_ANEMO_MINUS = "DMG_ANTI_ANEMO_MINUS";
  //物理耐性マイナス
  static readonly PROP_DMG_ANTI_PHYSICAL_MINUS = "DMG_ANTI_PHYSICAL_MINUS";
  //雷元素耐性マイナス
  static readonly PROP_DMG_ANTI_ELECTRO_MINUS = "DMG_ANTI_ELECTRO_MINUS";
  //岩元素耐性マイナス
  static readonly PROP_DMG_ANTI_GEO_MINUS = "DMG_ANTI_GEO_MINUS";
  //火元素耐性マイナス
  static readonly PROP_DMG_ANTI_PYRO_MINUS = "DMG_ANTI_PYRO_MINUS";
  //水元素耐性マイナス
  static readonly PROP_DMG_ANTI_HYDRO_MINUS = "DMG_ANTI_HYDRO_MINUS";
  //草元素耐性マイナス
  static readonly PROP_DMG_ANTI_DENDRO_MINUS = "DMG_ANTI_DENDRO_MINUS";
  //全元素耐性マイナス
  static readonly PROP_DMG_ANTI_ALL_MINUS = "DMG_ANTI_ALL_MINUS";

  //氷元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_CRYO = "DMG_RATE_UP_CRYO";
  //風元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_ANEMO = "DMG_RATE_UP_ANEMO";
  //物理ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_PHYSICAL = "DMG_RATE_UP_PHYSICAL";
  //雷元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_ELECTRO = "DMG_RATE_UP_ELECTRO";
  //岩元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_GEO = "DMG_RATE_UP_GEO";
  //火元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_PYRO = "DMG_RATE_UP_PYRO";
  //水元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_HYDRO = "DMG_RATE_UP_HYDRO";
  //草元素ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_DENDRO = "DMG_RATE_UP_DENDRO";
  //全ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_ALL = "DMG_RATE_UP_ALL";
  //基本攻撃ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_NORMAL = "DMG_RATE_UP_NORMAL";
  //重撃ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_CHARGED = "DMG_RATE_UP_CHARGED";
  //落下攻撃ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_PLUNGING = "DMG_RATE_UP_PLUNGING";
  //元素スキルダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_SKILL = "DMG_RATE_UP_SKILL";
  //元素爆発ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_ELEMENTAL_BURST = "DMG_RATE_UP_ELEMENTAL_BURST";
  //武器ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_WEAPON = "DMG_RATE_UP_WEAPON";
  //その他ダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_OTHER = "DMG_RATE_UP_OTHER";
  //聖遺物セットダメージ倍率アップ値
  static readonly PROP_DMG_RATE_UP_SET = "DMG_RATE_UP_SET";
  //元素スキル治療倍率アップ値
  static readonly PROP_HEALING_RATE_UP_SKILL = "HEALING_RATE_UP_SKILL";
  //元素爆発治療倍率アップ値
  static readonly PROP_HEALING_RATE_UP_ELEMENTAL_BURST = "HEALING_RATE_UP_ELEMENTAL_BURST";

  //氷元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_CRYO = "DMG_RATE_MULTI_CRYO";
  //風元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_ANEMO = "DMG_RATE_MULTI_ANEMO";
  //物理ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_PHYSICAL = "DMG_RATE_MULTI_PHYSICAL";
  //雷元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_ELECTRO = "DMG_RATE_MULTI_ELECTRO";
  //岩元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_GEO = "DMG_RATE_MULTI_GEO";
  //火元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_PYRO = "DMG_RATE_MULTI_PYRO";
  //水元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_HYDRO = "DMG_RATE_MULTI_HYDRO";
  //草元素ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_DENDRO = "DMG_RATE_MULTI_DENDRO";
  //全ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_ALL = "DMG_RATE_MULTI_ALL";
  //基本攻撃ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_NORMAL = "DMG_RATE_MULTI_NORMAL";
  //重撃ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_CHARGED = "DMG_RATE_MULTI_CHARGED";
  //落下攻撃ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_PLUNGING = "DMG_RATE_MULTI_PLUNGING";
  //元素スキルダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_SKILL = "DMG_RATE_MULTI_SKILL";
  //元素爆発ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_ELEMENTAL_BURST = "DMG_RATE_MULTI_ELEMENTAL_BURST";
  //武器ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_WEAPON = "DMG_RATE_MULTI_WEAPON";
  //その他ダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_OTHER = "DMG_RATE_MULTI_OTHER";
  //聖遺物セットダメージ倍率乗算値
  static readonly PROP_DMG_RATE_MULTI_SET = "DMG_RATE_MULTI_SET";
  //元素スキル治療倍率乗算値
  static readonly PROP_HEALING_RATE_MULTI_SKILL = "HEALING_RATE_MULTI_SKILL";
  //元素爆発治療倍率乗算値
  static readonly PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST = "HEALING_RATE_MULTI_ELEMENTAL_BURST";

  //氷元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_CRYO = "DMG_VAL_UP_CRYO";
  //風元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_ANEMO = "DMG_VAL_UP_ANEMO";
  //物理ダメージアップ値
  static readonly PROP_DMG_VAL_UP_PHYSICAL = "DMG_VAL_UP_PHYSICAL";
  //雷元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_ELECTRO = "DMG_VAL_UP_ELECTRO";
  //岩元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_GEO = "DMG_VAL_UP_GEO";
  //火元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_PYRO = "DMG_VAL_UP_PYRO";
  //水元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_HYDRO = "DMG_VAL_UP_HYDRO";
  //草元素ダメージアップ値
  static readonly PROP_DMG_VAL_UP_DENDRO = "DMG_VAL_UP_DENDRO";
  //全ダメージアップ値
  static readonly PROP_DMG_VAL_UP_ALL = "DMG_VAL_UP_ALL";
  //基本攻撃ダメージアップ値
  static readonly PROP_DMG_VAL_UP_NORMAL = "DMG_VAL_UP_NORMAL";
  //重撃ダメージアップ値
  static readonly PROP_DMG_VAL_UP_CHARGED = "DMG_VAL_UP_CHARGED";
  //落下攻撃ダメージアップ値
  static readonly PROP_DMG_VAL_UP_PLUNGING = "DMG_VAL_UP_PLUNGING";
  //元素スキルダメージアップ値
  static readonly PROP_DMG_VAL_UP_SKILL = "DMG_VAL_UP_SKILL";
  //元素爆発ダメージアップ値
  static readonly PROP_DMG_VAL_UP_ELEMENTAL_BURST = "DMG_VAL_UP_ELEMENTAL_BURST";
  //武器ダメージアップ値
  static readonly PROP_DMG_VAL_UP_WEAPON = "DMG_VAL_UP_WEAPON";
  //その他ダメージアップ値
  static readonly PROP_DMG_VAL_UP_OTHER = "DMG_VAL_UP_OTHER";
  //聖遺物セットダメージアップ値
  static readonly PROP_DMG_VAL_UP_SET = "DMG_VAL_UP_SET";
  //元素スキル治療アップ値
  static readonly PROP_HEALING_VAL_UP_SKILL = "HEALING_VAL_UP_SKILL";
  //元素爆発治療アップ値
  static readonly PROP_HEALING_VAL_UP_ELEMENTAL_BURST = "HEALING_VAL_UP_ELEMENTAL_BURST";

  //氷元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_CRYO = "DMG_CRIT_RATE_UP_CRYO";
  //風元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_ANEMO = "DMG_CRIT_RATE_UP_ANEMO";
  //物理ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_PHYSICAL = "DMG_CRIT_RATE_UP_PHYSICAL";
  //雷元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_ELECTRO = "DMG_CRIT_RATE_UP_ELECTRO";
  //岩元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_GEO = "DMG_CRIT_RATE_UP_GEO";
  //火元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_PYRO = "DMG_CRIT_RATE_UP_PYRO";
  //水元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_HYDRO = "DMG_CRIT_RATE_UP_HYDRO";
  //草元素ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_DENDRO = "DMG_CRIT_RATE_UP_DENDRO";
  //全ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_ALL = "DMG_CRIT_RATE_UP_ALL";
  //基本攻撃ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_NORMAL = "DMG_CRIT_RATE_UP_NORMAL";
  //重撃ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_CHARGED = "DMG_CRIT_RATE_UP_CHARGED";
  //落下攻撃ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_PLUNGING = "DMG_CRIT_RATE_UP_PLUNGING";
  //元素スキルダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_SKILL = "DMG_CRIT_RATE_UP_SKILL";
  //元素爆発ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST = "DMG_CRIT_RATE_UP_ELEMENTAL_BURST";
  //武器ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_WEAPON = "DMG_CRIT_RATE_UP_WEAPON";
  //その他ダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_OTHER = "DMG_CRIT_RATE_UP_OTHER";
  //聖遺物セットダメージ会心率アップ値
  static readonly PROP_DMG_CRIT_RATE_UP_SET = "DMG_CRIT_RATE_UP_SET";

  //氷元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_CRYO = "DMG_CRIT_DMG_UP_CRYO";
  //風元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_ANEMO = "DMG_CRIT_DMG_UP_ANEMO";
  //物理ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_PHYSICAL = "DMG_CRIT_DMG_UP_PHYSICAL";
  //雷元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_ELECTRO = "DMG_CRIT_DMG_UP_ELECTRO";
  //岩元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_GEO = "DMG_CRIT_DMG_UP_GEO";
  //火元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_PYRO = "DMG_CRIT_DMG_UP_PYRO";
  //水元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_HYDRO = "DMG_CRIT_DMG_UP_HYDRO";
  //草元素ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_DENDRO = "DMG_CRIT_DMG_UP_DENDRO";
  //全ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_ALL = "DMG_CRIT_DMG_UP_ALL";
  //基本攻撃ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_NORMAL = "DMG_CRIT_DMG_UP_NORMAL";
  //重撃ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_CHARGED = "DMG_CRIT_DMG_UP_CHARGED";
  //落下攻撃ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_PLUNGING = "DMG_CRIT_DMG_UP_PLUNGING";
  //元素スキルダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_SKILL = "DMG_CRIT_DMG_UP_SKILL";
  //元素爆発ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST = "DMG_CRIT_DMG_UP_ELEMENTAL_BURST";
  //武器ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_WEAPON = "DMG_CRIT_DMG_UP_WEAPON";
  //その他ダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_OTHER = "DMG_CRIT_DMG_UP_OTHER";
  //聖遺物セットダメージ会心ダメージアップ値
  static readonly PROP_DMG_CRIT_DMG_UP_SET = "DMG_CRIT_DMG_UP_SET";

  //元素(増幅）（全）
  static readonly PROP_DMG_ELEMENT_UP = "DMG_ELEMENT_UP";
  //元素(増幅）（蒸発）
  static readonly PROP_DMG_ELEMENT_VAPORIZE_UP = "DMG_ELEMENT_VAPORIZE_UP";
  //元素(増幅）（溶解）
  static readonly PROP_DMG_ELEMENT_MELT_UP = "DMG_ELEMENT_MELT_UP";
  //元素(増幅）（過負荷）
  static readonly PROP_DMG_ELEMENT_OVERLOADED_UP = "DMG_ELEMENT_OVERLOADED_UP";
  //元素(増幅）（燃焼）
  static readonly PROP_DMG_ELEMENT_BURNING_UP = "DMG_ELEMENT_BURNING_UP";
  //元素(増幅）（感電）
  static readonly PROP_DMG_ELEMENT_ELECTROCHARGED_UP = "DMG_ELEMENT_ELECTROCHARGED_UP";
  //元素(増幅）（超電導）
  static readonly PROP_DMG_ELEMENT_SUPERCONDUCT_UP = "DMG_ELEMENT_SUPERCONDUCT_UP";
  //元素(増幅）（拡散）
  static readonly PROP_DMG_ELEMENT_SWIRL_UP = "DMG_ELEMENT_SWIRL_UP";
  //元素(増幅）（氷砕き）
  static readonly PROP_DMG_ELEMENT_DESTRUCTION_UP = "DMG_ELEMENT_DESTRUCTION_UP";
  //元素(増幅）（結晶）
  static readonly PROP_DMG_ELEMENT_SHIELD_UP = "DMG_ELEMENT_SHIELD_UP";
  //元素(増幅）（開花）
  static readonly PROP_DMG_ELEMENT_RUPTURE_UP = "DMG_ELEMENT_RUPTURE_UP";
  // //元素(増幅）（開花）（倍率）
  // static readonly PROP_DMG_ELEMENT_RUPTURE_RATE_UP = "DMG_ELEMENT_RUPTURE_RATE_UP";
  //元素(増幅）（列開花）
  static readonly PROP_DMG_ELEMENT_BURGEON_UP = "DMG_ELEMENT_BURGEON_UP";
  //元素(増幅）（超開花）
  static readonly PROP_DMG_ELEMENT_HYPERBLOOM_UP = "DMG_ELEMENT_HYPERBLOOM_UP";
  //元素(増幅）（超激化）
  static readonly PROP_DMG_ELEMENT_AGGRAVATE_UP = "DMG_ELEMENT_AGGRAVATE_UP";
  //元素(増幅）（拡激化）
  static readonly PROP_DMG_ELEMENT_SPREAD_UP = "DMG_ELEMENT_SPREAD_UP";

  //敵防御（基礎）
  static readonly PROP_DMG_ENEMY_DEFENSE_BASE = "DMG_ENEMY_DEFENSE_BASE";
  //敵防御
  static readonly PROP_DMG_ENEMY_DEFENSE = "DMG_ENEMY_DEFENSE";
  //敵防御マイナス
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN = "DMG_ENEMY_DEFENSE_DOWN";
  //敵防御マイナス(基本攻撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL = "DMG_ENEMY_DEFENSE_DOWN_NORMAL";
  //敵防御マイナス(重撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED = "DMG_ENEMY_DEFENSE_DOWN_CHARGED";
  //敵防御マイナス(落下攻撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING = "DMG_ENEMY_DEFENSE_DOWN_PLUNGING";
  //敵防御マイナス(元素スキル）
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL = "DMG_ENEMY_DEFENSE_DOWN_SKILL";
  //敵防御マイナス(元素爆発）
  static readonly PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST = "DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST";
  //敵防御無視
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE = "DMG_ENEMY_DEFENSE_IGNORE";
  //敵防御無視(基本攻撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL = "DMG_ENEMY_DEFENSE_IGNORE_NORMAL";
  //敵防御無視(重撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED = "DMG_ENEMY_DEFENSE_IGNORE_CHARGED";
  //敵防御無視(落下攻撃）
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING = "DMG_ENEMY_DEFENSE_IGNORE_PLUNGING";
  //敵防御無視(元素スキル）
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL = "DMG_ENEMY_DEFENSE_IGNORE_SKILL";
  //敵防御無視(元素爆発）
  static readonly PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST = "DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST";



  //耐性(増幅）
  //static readonly PROP_DMG_VAL_ENEMY_ANTI_DMG = "DMG_VAL_ENEMY_ANTI_DMG";

  //ダメージ値結果
  //static readonly PROP_DMG_VAL_FINAL = "DMG_VAL_FINAL";

  //*********************************
  //           スキルタグ
  //*********************************
  static readonly PORP_TAG_RAIDEN_ITTOU = "RAIDEN_ITTOU";
  static readonly PORP_TAG_RAIDEN_ISSHIN = "RAIDEN_ISSHIN";
  static readonly PORP_TAG_EULA_KOUKEN = "EULA_KOUKEN";
  static readonly PORP_TAG_CYNO_BOLT = "CYNO_BOLT";
  static readonly PORP_TAG_CYNO_Q = "CYNO_Q";
  static readonly PORP_TAG_NILOU_MOON = "NILOU_MOON";
  static readonly PORP_TAG_NAHIDA_TRI_KARMA = "NAHIDA_TRI_KARMA";
  static readonly PORP_TAG_LAYLA_SHOOTING_STAR = "LAYLA_SHOOTING_STAR";
  static readonly PORP_TAG_FISCHL_OZ = "FISCHL_OZ";
  static readonly PORP_TAG_ALHAITHAM_MIRROR = "ALHAITHAM_MIRROR";
  static readonly PORP_TAG_DEHYA_FIELD = "DEHYA_FIELD";
  static readonly PORP_TAG_LYNEY_GRIN_MALKIN = "LYNEY_GRIN_MALKIN";
  static readonly PORP_TAG_FREMINET_FROST = "FREMINET_FROST";
  static readonly PORP_TAG_FREMINET_SHATTERING_PRESSURE = "FREMINET_SHATTERING_PRESSURE";
  static readonly PORP_TAG_TRAVELER_TORRENT_SURGE = "TRAVELER_TORRENT_SURGE";
  static readonly PORP_TAG_TRAVELER_DEWDROP = "TRAVELER_DEWDROP";
  static readonly PORP_TAG_WRIOTHESLEY_REBUKE = "WRIOTHESLEY_REBUKE";
  static readonly PORP_TAG_NEUVILLETTE_EQUITABLE_JUDGMENT = "NEUVILLETTE_EQUITABLE_JUDGMENT";

  static readonly PROPS_TAG_LIST = [
    Const.PORP_TAG_RAIDEN_ITTOU,
    Const.PORP_TAG_RAIDEN_ISSHIN,
    Const.PORP_TAG_EULA_KOUKEN,
    Const.PORP_TAG_CYNO_BOLT,
    Const.PORP_TAG_CYNO_Q,
    Const.PORP_TAG_NILOU_MOON,
    Const.PORP_TAG_NAHIDA_TRI_KARMA,
    Const.PORP_TAG_LAYLA_SHOOTING_STAR,
    Const.PORP_TAG_FISCHL_OZ,
    Const.PORP_TAG_ALHAITHAM_MIRROR,
    Const.PORP_TAG_DEHYA_FIELD,
    Const.PORP_TAG_LYNEY_GRIN_MALKIN,
    Const.PORP_TAG_FREMINET_FROST,
    Const.PORP_TAG_FREMINET_SHATTERING_PRESSURE,
    Const.PORP_TAG_TRAVELER_TORRENT_SURGE,
    Const.PORP_TAG_TRAVELER_DEWDROP,
    Const.PORP_TAG_WRIOTHESLEY_REBUKE,
    Const.PORP_TAG_NEUVILLETTE_EQUITABLE_JUDGMENT,
  ]

  static readonly PROPS_TAG_MAP: Map<string, string[]> = new Map([
    ["10000052", [
      Const.PORP_TAG_RAIDEN_ITTOU,
      Const.PORP_TAG_RAIDEN_ISSHIN,
    ]],
    ["10000051", [
      Const.PORP_TAG_EULA_KOUKEN,
    ]],
    ["10000070", [
      Const.PORP_TAG_NILOU_MOON,
    ]],
    ["10000071", [
      Const.PORP_TAG_CYNO_BOLT,
      Const.PORP_TAG_CYNO_Q,
    ]],
    ["10000073", [
      Const.PORP_TAG_NAHIDA_TRI_KARMA,
    ]],
    ["10000074", [
      Const.PORP_TAG_LAYLA_SHOOTING_STAR,
    ]],
    ["10000031", [
      Const.PORP_TAG_FISCHL_OZ,
    ]],
    ["10000078", [
      Const.PORP_TAG_ALHAITHAM_MIRROR,
    ]],
    ["10000079", [
      Const.PORP_TAG_DEHYA_FIELD,
    ]],
    ["10000084", [
      Const.PORP_TAG_LYNEY_GRIN_MALKIN,
    ]],
    ["10000085", [
      Const.PORP_TAG_FREMINET_FROST,
      Const.PORP_TAG_FREMINET_SHATTERING_PRESSURE,
    ]],
    ["10000086", [
      Const.PORP_TAG_WRIOTHESLEY_REBUKE
    ]],
    ["10000087", [
      Const.PORP_TAG_NEUVILLETTE_EQUITABLE_JUDGMENT
    ]],
    ["10000005503", [
      Const.PORP_TAG_TRAVELER_TORRENT_SURGE,
      Const.PORP_TAG_TRAVELER_DEWDROP,
    ]],
    ["10000007703", [
      Const.PORP_TAG_FREMINET_FROST,
      Const.PORP_TAG_FREMINET_SHATTERING_PRESSURE,
    ]],
  ])

  static readonly PROPS_HAS_MIX_RATE: Set<string> = new Set([
    "10000073",
    "10000078",
    "10000079",
  ]);

  static readonly PROPS_ALL_BASE_SPACIAL = [
    [Const.PROP_DMG_VAL_UP_NORMAL, Const.PORP_TAG_CYNO_Q],
    [Const.PROP_DMG_VAL_UP_SKILL, Const.PORP_TAG_TRAVELER_TORRENT_SURGE],
    [Const.PROP_DMG_VAL_UP_SKILL, Const.PORP_TAG_TRAVELER_DEWDROP],
    [Const.PROP_DMG_VAL_UP_SKILL, Const.PORP_TAG_CYNO_BOLT],
    [Const.PROP_DMG_VAL_UP_SKILL, Const.PORP_TAG_LAYLA_SHOOTING_STAR],
  ]

  static readonly PROPS_ALL_BASE_SPACIAL_PERCENT = [
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_FREMINET_SHATTERING_PRESSURE],
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_NILOU_MOON],
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_NAHIDA_TRI_KARMA],
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_LAYLA_SHOOTING_STAR],
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_ALHAITHAM_MIRROR],
    [Const.PROP_DMG_BONUS_SKILL, Const.PORP_TAG_DEHYA_FIELD],
    [Const.PROP_DMG_RATE_UP_CHARGED, Const.PORP_TAG_WRIOTHESLEY_REBUKE],
    [Const.PROP_DMG_RATE_UP_CHARGED, Const.PORP_TAG_LYNEY_GRIN_MALKIN],
    [Const.PROP_DMG_RATE_MULTI_CHARGED, Const.PORP_TAG_NEUVILLETTE_EQUITABLE_JUDGMENT],
    [Const.PROP_DMG_RATE_UP_SKILL, Const.PORP_TAG_FREMINET_FROST],
    [Const.PROP_DMG_RATE_UP_SKILL, Const.PORP_TAG_FISCHL_OZ],
    [Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST, Const.PORP_TAG_RAIDEN_ITTOU],
    [Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST, Const.PORP_TAG_RAIDEN_ISSHIN],
    [Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST, Const.PORP_TAG_EULA_KOUKEN],
    [Const.PROP_DMG_CRIT_RATE_UP_CHARGED, Const.PORP_TAG_WRIOTHESLEY_REBUKE],
    [Const.PROP_DMG_CRIT_RATE_UP_SKILL, Const.PORP_TAG_FREMINET_SHATTERING_PRESSURE],
    [Const.PROP_DMG_CRIT_RATE_UP_SKILL, Const.PORP_TAG_NAHIDA_TRI_KARMA],
    [Const.PROP_DMG_CRIT_DMG_UP_CHARGED, Const.PORP_TAG_WRIOTHESLEY_REBUKE],
    [Const.PROP_DMG_CRIT_DMG_UP_CHARGED, Const.PORP_TAG_NEUVILLETTE_EQUITABLE_JUDGMENT],
  ]

  //*********************************
  //           属性リスト
  //*********************************

  //マップ
  static readonly MAP_ELEMENT: Map<string, string> = new Map([
    [Const.ELEMENT_CRYO, Const.PROP_DMG_BONUS_CRYO],
    [Const.ELEMENT_ANEMO, Const.PROP_DMG_BONUS_ANEMO],
    [Const.ELEMENT_PHYSICAL, Const.PROP_DMG_BONUS_PHYSICAL],
    [Const.ELEMENT_ELECTRO, Const.PROP_DMG_BONUS_ELECTRO],
    [Const.ELEMENT_GEO, Const.PROP_DMG_BONUS_GEO],
    [Const.ELEMENT_PYRO, Const.PROP_DMG_BONUS_PYRO],
    [Const.ELEMENT_HYDRO, Const.PROP_DMG_BONUS_HYDRO],
    [Const.ELEMENT_DENDRO, Const.PROP_DMG_BONUS_DENDRO],
  ]);

  static readonly MAP_ELEMENT_REVERSE: Map<string, string> = new Map([
    [Const.PROP_DMG_BONUS_CRYO, Const.ELEMENT_CRYO],
    [Const.PROP_DMG_BONUS_ANEMO, Const.ELEMENT_ANEMO],
    [Const.PROP_DMG_BONUS_PHYSICAL, Const.ELEMENT_PHYSICAL],
    [Const.PROP_DMG_BONUS_ELECTRO, Const.ELEMENT_ELECTRO],
    [Const.PROP_DMG_BONUS_GEO, Const.ELEMENT_GEO],
    [Const.PROP_DMG_BONUS_PYRO, Const.ELEMENT_PYRO],
    [Const.PROP_DMG_BONUS_HYDRO, Const.ELEMENT_HYDRO],
    [Const.PROP_DMG_BONUS_DENDRO, Const.ELEMENT_DENDRO],
  ]);

  //ベース属性リスト（キャラ、敵）
  static readonly PROPS_CHARA_ENEMY_BASE = [
    Const.PROP_LEVEL,
    Const.PROP_HP,
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
  ];
  //ベース属性リスト（武器）
  static readonly PROPS_WEAPON_BASE = [
    Const.PROP_LEVEL,
    Const.PROP_ATTACK,
  ];
  //サブ属性リスト（キャラ、武器）
  static readonly PROPS_CHARA_WEAPON_SUB = [
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_HEALING_BONUS,
    Const.PROP_REVERSE_HEALING_BONUS,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_DMG_BONUS_ALL,
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
  ];
  //敵耐性
  static readonly PROPS_ENEMY_ANTI = [
    Const.PROP_DMG_ANTI_CRYO,
    Const.PROP_DMG_ANTI_ANEMO,
    Const.PROP_DMG_ANTI_PHYSICAL,
    Const.PROP_DMG_ANTI_ELECTRO,
    Const.PROP_DMG_ANTI_GEO,
    Const.PROP_DMG_ANTI_PYRO,
    Const.PROP_DMG_ANTI_HYDRO,
    Const.PROP_DMG_ANTI_DENDRO,
  ]
  //敵防御
  static readonly PROPS_ENEMY_DEFENSE = [
    Const.PROP_DMG_ENEMY_DEFENSE_BASE,
  ]
  //サブ属性リスト（敵）
  static readonly PROPS_ENEMY_SUB = Const.PROPS_CHARA_WEAPON_SUB.concat(
    Const.PROPS_ENEMY_ANTI,
  );
  //パーセント属性リスト（キャラ、武器）
  static readonly PROPS_CHARA_WEAPON_PERCENT = [
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_HEALING_BONUS,
    Const.PROP_REVERSE_HEALING_BONUS,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_DMG_BONUS_ALL,
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
  ];
  //パーセント属性リスト（敵）
  static readonly PROPS_ENEMY_PERCENT = Const.PROPS_CHARA_WEAPON_PERCENT.concat(
    Const.PROPS_ENEMY_ANTI,
  );
  //計算用リスト
  static readonly PROPS_ALL_BASE = [
    Const.PROP_LEVEL,
    Const.PROP_HP_BASE,
    Const.PROP_ATTACK_BASE,
    Const.PROP_DEFENSE_BASE,
    Const.PROP_ELEMENTAL_BURST_ENERGY,
    // Const.PROP_HP,
    // Const.PROP_ATTACK,
    // Const.PROP_DEFENSE,
    Const.PROP_VAL_HP,
    Const.PROP_VAL_ATTACK,
    Const.PROP_VAL_DEFENSE,
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_HEALING_BONUS,
    Const.PROP_REVERSE_HEALING_BONUS,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_DMG_BONUS_ALL,
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
    // Const.PROP_DMG_ANTI_CRYO,
    // Const.PROP_DMG_ANTI_ANEMO,
    // Const.PROP_DMG_ANTI_PHYSICAL,
    // Const.PROP_DMG_ANTI_ELECTRO,
    // Const.PROP_DMG_ANTI_GEO,
    // Const.PROP_DMG_ANTI_PYRO,
    // Const.PROP_DMG_ANTI_HYDRO,
    // Const.PROP_DMG_ANTI_DENDRO,
    Const.PROP_DMG_ANTI_CRYO_MINUS,
    Const.PROP_DMG_ANTI_ANEMO_MINUS,
    Const.PROP_DMG_ANTI_PHYSICAL_MINUS,
    Const.PROP_DMG_ANTI_ELECTRO_MINUS,
    Const.PROP_DMG_ANTI_GEO_MINUS,
    Const.PROP_DMG_ANTI_PYRO_MINUS,
    Const.PROP_DMG_ANTI_HYDRO_MINUS,
    Const.PROP_DMG_ANTI_DENDRO_MINUS,
    Const.PROP_DMG_ANTI_ALL_MINUS,
    Const.PROP_DMG_RATE_UP_CRYO,
    Const.PROP_DMG_RATE_UP_ANEMO,
    Const.PROP_DMG_RATE_UP_PHYSICAL,
    Const.PROP_DMG_RATE_UP_ELECTRO,
    Const.PROP_DMG_RATE_UP_GEO,
    Const.PROP_DMG_RATE_UP_PYRO,
    Const.PROP_DMG_RATE_UP_HYDRO,
    Const.PROP_DMG_RATE_UP_DENDRO,
    Const.PROP_DMG_RATE_UP_ALL,
    Const.PROP_DMG_RATE_UP_NORMAL,
    Const.PROP_DMG_RATE_UP_CHARGED,
    Const.PROP_DMG_RATE_UP_PLUNGING,
    Const.PROP_DMG_RATE_UP_SKILL,
    Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_UP_WEAPON,
    Const.PROP_DMG_RATE_UP_OTHER,
    Const.PROP_DMG_RATE_UP_SET,
    Const.PROP_HEALING_RATE_UP_SKILL,
    Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_CRYO,
    Const.PROP_DMG_RATE_MULTI_ANEMO,
    Const.PROP_DMG_RATE_MULTI_PHYSICAL,
    Const.PROP_DMG_RATE_MULTI_ELECTRO,
    Const.PROP_DMG_RATE_MULTI_GEO,
    Const.PROP_DMG_RATE_MULTI_PYRO,
    Const.PROP_DMG_RATE_MULTI_HYDRO,
    Const.PROP_DMG_RATE_MULTI_DENDRO,
    Const.PROP_DMG_RATE_MULTI_ALL,
    Const.PROP_DMG_RATE_MULTI_NORMAL,
    Const.PROP_DMG_RATE_MULTI_CHARGED,
    Const.PROP_DMG_RATE_MULTI_PLUNGING,
    Const.PROP_DMG_RATE_MULTI_SKILL,
    Const.PROP_DMG_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_WEAPON,
    Const.PROP_DMG_RATE_MULTI_OTHER,
    Const.PROP_DMG_RATE_MULTI_SET,
    Const.PROP_HEALING_RATE_MULTI_SKILL,
    Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_NORMAL,
    Const.PROP_HEALING_BONUS_SKILL,
    Const.PROP_HEALING_BONUS_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_WEAPON,
    Const.PROP_HEALING_BONUS_OTHER,
    Const.PROP_HEALING_BONUS_SET,
    Const.PROP_SHIELD_BONUS_NORMAL,
    Const.PROP_SHIELD_BONUS_SKILL,
    Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST,
    Const.PROP_SHIELD_BONUS_WEAPON,
    Const.PROP_SHIELD_BONUS_OTHER,
    Const.PROP_SHIELD_BONUS_SET,
    Const.PROP_DMG_VAL_UP_CRYO,
    Const.PROP_DMG_VAL_UP_ANEMO,
    Const.PROP_DMG_VAL_UP_PHYSICAL,
    Const.PROP_DMG_VAL_UP_ELECTRO,
    Const.PROP_DMG_VAL_UP_GEO,
    Const.PROP_DMG_VAL_UP_PYRO,
    Const.PROP_DMG_VAL_UP_HYDRO,
    Const.PROP_DMG_VAL_UP_DENDRO,
    Const.PROP_DMG_VAL_UP_ALL,
    Const.PROP_DMG_VAL_UP_NORMAL,
    Const.PROP_DMG_VAL_UP_CHARGED,
    Const.PROP_DMG_VAL_UP_PLUNGING,
    Const.PROP_DMG_VAL_UP_SKILL,
    Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_VAL_UP_WEAPON,
    Const.PROP_DMG_VAL_UP_OTHER,
    Const.PROP_DMG_VAL_UP_SET,
    Const.PROP_HEALING_VAL_UP_SKILL,
    Const.PROP_HEALING_VAL_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_RATE_UP_CRYO,
    Const.PROP_DMG_CRIT_RATE_UP_ANEMO,
    Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_RATE_UP_ELECTRO,
    Const.PROP_DMG_CRIT_RATE_UP_GEO,
    Const.PROP_DMG_CRIT_RATE_UP_PYRO,
    Const.PROP_DMG_CRIT_RATE_UP_HYDRO,
    Const.PROP_DMG_CRIT_RATE_UP_DENDRO,
    Const.PROP_DMG_CRIT_RATE_UP_ALL,
    Const.PROP_DMG_CRIT_RATE_UP_NORMAL,
    Const.PROP_DMG_CRIT_RATE_UP_CHARGED,
    Const.PROP_DMG_CRIT_RATE_UP_PLUNGING,
    Const.PROP_DMG_CRIT_RATE_UP_SKILL,
    Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_RATE_UP_WEAPON,
    Const.PROP_DMG_CRIT_RATE_UP_OTHER,
    Const.PROP_DMG_CRIT_RATE_UP_SET,
    Const.PROP_DMG_CRIT_DMG_UP_CRYO,
    Const.PROP_DMG_CRIT_DMG_UP_ANEMO,
    Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_DMG_UP_ELECTRO,
    Const.PROP_DMG_CRIT_DMG_UP_GEO,
    Const.PROP_DMG_CRIT_DMG_UP_PYRO,
    Const.PROP_DMG_CRIT_DMG_UP_HYDRO,
    Const.PROP_DMG_CRIT_DMG_UP_DENDRO,
    Const.PROP_DMG_CRIT_DMG_UP_ALL,
    Const.PROP_DMG_CRIT_DMG_UP_NORMAL,
    Const.PROP_DMG_CRIT_DMG_UP_CHARGED,
    Const.PROP_DMG_CRIT_DMG_UP_PLUNGING,
    Const.PROP_DMG_CRIT_DMG_UP_SKILL,
    Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_DMG_UP_WEAPON,
    Const.PROP_DMG_CRIT_DMG_UP_OTHER,
    Const.PROP_DMG_CRIT_DMG_UP_SET,
    Const.PROP_DMG_ELEMENT_UP,
    Const.PROP_DMG_ELEMENT_VAPORIZE_UP,
    Const.PROP_DMG_ELEMENT_MELT_UP,
    Const.PROP_DMG_ELEMENT_OVERLOADED_UP,
    Const.PROP_DMG_ELEMENT_BURNING_UP,
    Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP,
    Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP,
    Const.PROP_DMG_ELEMENT_SWIRL_UP,
    Const.PROP_DMG_ELEMENT_DESTRUCTION_UP,
    Const.PROP_DMG_ELEMENT_SHIELD_UP,
    Const.PROP_DMG_ELEMENT_RUPTURE_UP,
    // Const.PROP_DMG_ELEMENT_RUPTURE_RATE_UP,
    Const.PROP_DMG_ELEMENT_BURGEON_UP,
    Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP,
    Const.PROP_DMG_ELEMENT_AGGRAVATE_UP,
    Const.PROP_DMG_ELEMENT_SPREAD_UP,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST,
    Const.PROP_OTHER_OCEAN_HUED_HEALING,
    // Const.PROP_DMG_ENEMY_DEFENSE_BASE,
  ].concat(Const.PROPS_ALL_BASE_SPACIAL_PERCENT.concat(Const.PROPS_ALL_BASE_SPACIAL).map((val: string[]) => {
    return val.join(Const.CONCATENATION_TAG)
  }));
  //計算後データ属性リスト（パーセント）
  static readonly PROPS_ALL_DATA_PERCENT = [
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_HEALING_BONUS,
    Const.PROP_REVERSE_HEALING_BONUS,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_DMG_BONUS_ALL,
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
    Const.PROP_DMG_ANTI_CRYO,
    Const.PROP_DMG_ANTI_ANEMO,
    Const.PROP_DMG_ANTI_PHYSICAL,
    Const.PROP_DMG_ANTI_ELECTRO,
    Const.PROP_DMG_ANTI_GEO,
    Const.PROP_DMG_ANTI_PYRO,
    Const.PROP_DMG_ANTI_HYDRO,
    Const.PROP_DMG_ANTI_DENDRO,
    Const.PROP_DMG_ANTI_CRYO_MINUS,
    Const.PROP_DMG_ANTI_ANEMO_MINUS,
    Const.PROP_DMG_ANTI_PHYSICAL_MINUS,
    Const.PROP_DMG_ANTI_ELECTRO_MINUS,
    Const.PROP_DMG_ANTI_GEO_MINUS,
    Const.PROP_DMG_ANTI_PYRO_MINUS,
    Const.PROP_DMG_ANTI_HYDRO_MINUS,
    Const.PROP_DMG_ANTI_DENDRO_MINUS,
    Const.PROP_DMG_ANTI_ALL_MINUS,
    Const.PROP_DMG_RATE_UP_CRYO,
    Const.PROP_DMG_RATE_UP_ANEMO,
    Const.PROP_DMG_RATE_UP_PHYSICAL,
    Const.PROP_DMG_RATE_UP_ELECTRO,
    Const.PROP_DMG_RATE_UP_GEO,
    Const.PROP_DMG_RATE_UP_PYRO,
    Const.PROP_DMG_RATE_UP_HYDRO,
    Const.PROP_DMG_RATE_UP_DENDRO,
    Const.PROP_DMG_RATE_UP_ALL,
    Const.PROP_DMG_RATE_UP_NORMAL,
    Const.PROP_DMG_RATE_UP_CHARGED,
    Const.PROP_DMG_RATE_UP_PLUNGING,
    Const.PROP_DMG_RATE_UP_SKILL,
    Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_UP_WEAPON,
    Const.PROP_DMG_RATE_UP_OTHER,
    Const.PROP_DMG_RATE_UP_SET,
    Const.PROP_HEALING_RATE_UP_SKILL,
    Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_CRYO,
    Const.PROP_DMG_RATE_MULTI_ANEMO,
    Const.PROP_DMG_RATE_MULTI_PHYSICAL,
    Const.PROP_DMG_RATE_MULTI_ELECTRO,
    Const.PROP_DMG_RATE_MULTI_GEO,
    Const.PROP_DMG_RATE_MULTI_PYRO,
    Const.PROP_DMG_RATE_MULTI_HYDRO,
    Const.PROP_DMG_RATE_MULTI_DENDRO,
    Const.PROP_DMG_RATE_MULTI_ALL,
    Const.PROP_DMG_RATE_MULTI_NORMAL,
    Const.PROP_DMG_RATE_MULTI_CHARGED,
    Const.PROP_DMG_RATE_MULTI_PLUNGING,
    Const.PROP_DMG_RATE_MULTI_SKILL,
    Const.PROP_DMG_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_WEAPON,
    Const.PROP_DMG_RATE_MULTI_OTHER,
    Const.PROP_DMG_RATE_MULTI_SET,
    Const.PROP_HEALING_RATE_MULTI_SKILL,
    Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_NORMAL,
    Const.PROP_HEALING_BONUS_SKILL,
    Const.PROP_HEALING_BONUS_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_WEAPON,
    Const.PROP_HEALING_BONUS_OTHER,
    Const.PROP_HEALING_BONUS_SET,
    Const.PROP_SHIELD_BONUS_NORMAL,
    Const.PROP_SHIELD_BONUS_SKILL,
    Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST,
    Const.PROP_SHIELD_BONUS_WEAPON,
    Const.PROP_SHIELD_BONUS_OTHER,
    Const.PROP_SHIELD_BONUS_SET,
    Const.PROP_DMG_CRIT_RATE_UP_CRYO,
    Const.PROP_DMG_CRIT_RATE_UP_ANEMO,
    Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_RATE_UP_ELECTRO,
    Const.PROP_DMG_CRIT_RATE_UP_GEO,
    Const.PROP_DMG_CRIT_RATE_UP_PYRO,
    Const.PROP_DMG_CRIT_RATE_UP_HYDRO,
    Const.PROP_DMG_CRIT_RATE_UP_DENDRO,
    Const.PROP_DMG_CRIT_RATE_UP_ALL,
    Const.PROP_DMG_CRIT_RATE_UP_NORMAL,
    Const.PROP_DMG_CRIT_RATE_UP_CHARGED,
    Const.PROP_DMG_CRIT_RATE_UP_PLUNGING,
    Const.PROP_DMG_CRIT_RATE_UP_SKILL,
    Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_RATE_UP_WEAPON,
    Const.PROP_DMG_CRIT_RATE_UP_OTHER,
    Const.PROP_DMG_CRIT_RATE_UP_SET,
    Const.PROP_DMG_CRIT_DMG_UP_CRYO,
    Const.PROP_DMG_CRIT_DMG_UP_ANEMO,
    Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_DMG_UP_ELECTRO,
    Const.PROP_DMG_CRIT_DMG_UP_GEO,
    Const.PROP_DMG_CRIT_DMG_UP_PYRO,
    Const.PROP_DMG_CRIT_DMG_UP_HYDRO,
    Const.PROP_DMG_CRIT_DMG_UP_DENDRO,
    Const.PROP_DMG_CRIT_DMG_UP_ALL,
    Const.PROP_DMG_CRIT_DMG_UP_NORMAL,
    Const.PROP_DMG_CRIT_DMG_UP_CHARGED,
    Const.PROP_DMG_CRIT_DMG_UP_PLUNGING,
    Const.PROP_DMG_CRIT_DMG_UP_SKILL,
    Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_DMG_UP_WEAPON,
    Const.PROP_DMG_CRIT_DMG_UP_OTHER,
    Const.PROP_DMG_CRIT_DMG_UP_SET,
    Const.PROP_DMG_ELEMENT_UP,
    Const.PROP_DMG_ELEMENT_VAPORIZE_UP,
    Const.PROP_DMG_ELEMENT_MELT_UP,
    Const.PROP_DMG_ELEMENT_OVERLOADED_UP,
    Const.PROP_DMG_ELEMENT_BURNING_UP,
    Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP,
    Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP,
    Const.PROP_DMG_ELEMENT_SWIRL_UP,
    Const.PROP_DMG_ELEMENT_DESTRUCTION_UP,
    Const.PROP_DMG_ELEMENT_SHIELD_UP,
    Const.PROP_DMG_ELEMENT_RUPTURE_UP,
    // Const.PROP_DMG_ELEMENT_RUPTURE_RATE_UP,
    Const.PROP_DMG_ELEMENT_BURGEON_UP,
    Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP,
    Const.PROP_DMG_ELEMENT_AGGRAVATE_UP,
    Const.PROP_DMG_ELEMENT_SPREAD_UP,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST,
  ].concat(Const.PROPS_ALL_BASE_SPACIAL_PERCENT.map((val: string[]) => {
    return val.join(Const.CONCATENATION_TAG)
  }));
  //計算後データ属性リスト
  static readonly PROPS_ALL_DATA: PROPS_INFO[] = [
    [Const.PROP_HP],
    [Const.PROP_ATTACK],
    [Const.PROP_DEFENSE],
    [Const.PROP_VAL_HP],
    [Const.PROP_VAL_ATTACK],
    [Const.PROP_VAL_DEFENSE],
    [Const.PROP_HP_UP],
    [Const.PROP_ATTACK_UP],
    [Const.PROP_DEFENSE_UP],
    [Const.PROP_CRIT_RATE],
    [Const.PROP_CRIT_DMG],
    [Const.PROP_ENERGY_RECHARGE],
    [Const.PROP_HEALING_BONUS],
    [Const.PROP_REVERSE_HEALING_BONUS],
    [Const.PROP_ELEMENTAL_MASTERY],
    [Const.PROP_DMG_BONUS_CRYO],
    [Const.PROP_DMG_BONUS_ANEMO],
    [Const.PROP_DMG_BONUS_PHYSICAL],
    [Const.PROP_DMG_BONUS_ELECTRO],
    [Const.PROP_DMG_BONUS_GEO],
    [Const.PROP_DMG_BONUS_PYRO],
    [Const.PROP_DMG_BONUS_HYDRO],
    [Const.PROP_DMG_BONUS_DENDRO],
    [Const.PROP_DMG_BONUS_ALL],
    [Const.PROP_DMG_BONUS_NORMAL],
    [Const.PROP_DMG_BONUS_CHARGED],
    [Const.PROP_DMG_BONUS_PLUNGING],
    [Const.PROP_DMG_BONUS_SKILL],
    [Const.PROP_DMG_BONUS_ELEMENTAL_BURST],
    [Const.PROP_DMG_BONUS_WEAPON],
    [Const.PROP_DMG_BONUS_OTHER],
    [Const.PROP_DMG_BONUS_SET],
    // [Const.PROP_DMG_ANTI_CRYO],
    // [Const.PROP_DMG_ANTI_ANEMO],
    // [Const.PROP_DMG_ANTI_PHYSICAL],
    // [Const.PROP_DMG_ANTI_ELECTRO],
    // [Const.PROP_DMG_ANTI_GEO],
    // [Const.PROP_DMG_ANTI_PYRO],
    // [Const.PROP_DMG_ANTI_HYDRO],
    // [Const.PROP_DMG_ANTI_DENDRO],
    [Const.PROP_DMG_ANTI_CRYO_MINUS],
    [Const.PROP_DMG_ANTI_ANEMO_MINUS],
    [Const.PROP_DMG_ANTI_PHYSICAL_MINUS],
    [Const.PROP_DMG_ANTI_ELECTRO_MINUS],
    [Const.PROP_DMG_ANTI_GEO_MINUS],
    [Const.PROP_DMG_ANTI_PYRO_MINUS],
    [Const.PROP_DMG_ANTI_HYDRO_MINUS],
    [Const.PROP_DMG_ANTI_DENDRO_MINUS],
    [Const.PROP_DMG_ANTI_ALL_MINUS],
    [Const.PROP_DMG_RATE_UP_CRYO],
    [Const.PROP_DMG_RATE_UP_ANEMO],
    [Const.PROP_DMG_RATE_UP_PHYSICAL],
    [Const.PROP_DMG_RATE_UP_ELECTRO],
    [Const.PROP_DMG_RATE_UP_GEO],
    [Const.PROP_DMG_RATE_UP_PYRO],
    [Const.PROP_DMG_RATE_UP_HYDRO],
    [Const.PROP_DMG_RATE_UP_DENDRO],
    [Const.PROP_DMG_RATE_UP_ALL],
    [Const.PROP_DMG_RATE_UP_NORMAL],
    [Const.PROP_DMG_RATE_UP_CHARGED],
    [Const.PROP_DMG_RATE_UP_PLUNGING],
    [Const.PROP_DMG_RATE_UP_SKILL],
    [Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_RATE_UP_WEAPON],
    [Const.PROP_DMG_RATE_UP_OTHER],
    [Const.PROP_DMG_RATE_UP_SET],
    [Const.PROP_HEALING_RATE_UP_SKILL],
    [Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_RATE_MULTI_CRYO],
    [Const.PROP_DMG_RATE_MULTI_ANEMO],
    [Const.PROP_DMG_RATE_MULTI_PHYSICAL],
    [Const.PROP_DMG_RATE_MULTI_ELECTRO],
    [Const.PROP_DMG_RATE_MULTI_GEO],
    [Const.PROP_DMG_RATE_MULTI_PYRO],
    [Const.PROP_DMG_RATE_MULTI_HYDRO],
    [Const.PROP_DMG_RATE_MULTI_DENDRO],
    [Const.PROP_DMG_RATE_MULTI_ALL],
    [Const.PROP_DMG_RATE_MULTI_NORMAL],
    [Const.PROP_DMG_RATE_MULTI_CHARGED],
    [Const.PROP_DMG_RATE_MULTI_PLUNGING],
    [Const.PROP_DMG_RATE_MULTI_SKILL],
    [Const.PROP_DMG_RATE_MULTI_ELEMENTAL_BURST],
    [Const.PROP_DMG_RATE_MULTI_WEAPON],
    [Const.PROP_DMG_RATE_MULTI_OTHER],
    [Const.PROP_DMG_RATE_MULTI_SET],
    [Const.PROP_HEALING_RATE_MULTI_SKILL],
    [Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST],
    [Const.PROP_HEALING_BONUS_NORMAL],
    [Const.PROP_HEALING_BONUS_SKILL],
    [Const.PROP_HEALING_BONUS_ELEMENTAL_BURST],
    [Const.PROP_HEALING_BONUS_WEAPON],
    [Const.PROP_HEALING_BONUS_OTHER],
    [Const.PROP_HEALING_BONUS_SET],
    [Const.PROP_SHIELD_BONUS_NORMAL],
    [Const.PROP_SHIELD_BONUS_SKILL],
    [Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST],
    [Const.PROP_SHIELD_BONUS_WEAPON],
    [Const.PROP_SHIELD_BONUS_OTHER],
    [Const.PROP_SHIELD_BONUS_SET],
    [Const.PROP_DMG_VAL_UP_CRYO],
    [Const.PROP_DMG_VAL_UP_ANEMO],
    [Const.PROP_DMG_VAL_UP_PHYSICAL],
    [Const.PROP_DMG_VAL_UP_ELECTRO],
    [Const.PROP_DMG_VAL_UP_GEO],
    [Const.PROP_DMG_VAL_UP_PYRO],
    [Const.PROP_DMG_VAL_UP_HYDRO],
    [Const.PROP_DMG_VAL_UP_DENDRO],
    [Const.PROP_DMG_VAL_UP_ALL],
    [Const.PROP_DMG_VAL_UP_NORMAL],
    [Const.PROP_DMG_VAL_UP_CHARGED],
    [Const.PROP_DMG_VAL_UP_PLUNGING],
    [Const.PROP_DMG_VAL_UP_SKILL],
    [Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_VAL_UP_WEAPON],
    [Const.PROP_DMG_VAL_UP_OTHER],
    [Const.PROP_DMG_VAL_UP_SET],
    [Const.PROP_HEALING_VAL_UP_SKILL],
    [Const.PROP_HEALING_VAL_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_CRIT_RATE_UP_CRYO],
    [Const.PROP_DMG_CRIT_RATE_UP_ANEMO],
    [Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL],
    [Const.PROP_DMG_CRIT_RATE_UP_ELECTRO],
    [Const.PROP_DMG_CRIT_RATE_UP_GEO],
    [Const.PROP_DMG_CRIT_RATE_UP_PYRO],
    [Const.PROP_DMG_CRIT_RATE_UP_HYDRO],
    [Const.PROP_DMG_CRIT_RATE_UP_DENDRO],
    [Const.PROP_DMG_CRIT_RATE_UP_ALL],
    [Const.PROP_DMG_CRIT_RATE_UP_NORMAL],
    [Const.PROP_DMG_CRIT_RATE_UP_CHARGED],
    [Const.PROP_DMG_CRIT_RATE_UP_PLUNGING],
    [Const.PROP_DMG_CRIT_RATE_UP_SKILL],
    [Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_CRIT_RATE_UP_WEAPON],
    [Const.PROP_DMG_CRIT_RATE_UP_OTHER],
    [Const.PROP_DMG_CRIT_RATE_UP_SET],
    [Const.PROP_DMG_CRIT_DMG_UP_CRYO],
    [Const.PROP_DMG_CRIT_DMG_UP_ANEMO],
    [Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL],
    [Const.PROP_DMG_CRIT_DMG_UP_ELECTRO],
    [Const.PROP_DMG_CRIT_DMG_UP_GEO],
    [Const.PROP_DMG_CRIT_DMG_UP_PYRO],
    [Const.PROP_DMG_CRIT_DMG_UP_HYDRO],
    [Const.PROP_DMG_CRIT_DMG_UP_DENDRO],
    [Const.PROP_DMG_CRIT_DMG_UP_ALL],
    [Const.PROP_DMG_CRIT_DMG_UP_NORMAL],
    [Const.PROP_DMG_CRIT_DMG_UP_CHARGED],
    [Const.PROP_DMG_CRIT_DMG_UP_PLUNGING],
    [Const.PROP_DMG_CRIT_DMG_UP_SKILL],
    [Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST],
    [Const.PROP_DMG_CRIT_DMG_UP_WEAPON],
    [Const.PROP_DMG_CRIT_DMG_UP_OTHER],
    [Const.PROP_DMG_CRIT_DMG_UP_SET],
    [Const.PROP_DMG_ELEMENT_UP],
    [Const.PROP_DMG_ELEMENT_VAPORIZE_UP],
    [Const.PROP_DMG_ELEMENT_MELT_UP],
    [Const.PROP_DMG_ELEMENT_OVERLOADED_UP],
    [Const.PROP_DMG_ELEMENT_BURNING_UP],
    [Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP],
    [Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP],
    [Const.PROP_DMG_ELEMENT_SWIRL_UP],
    [Const.PROP_DMG_ELEMENT_DESTRUCTION_UP],
    [Const.PROP_DMG_ELEMENT_SHIELD_UP],
    [Const.PROP_DMG_ELEMENT_RUPTURE_UP],
    // [Const.PROP_DMG_ELEMENT_RUPTURE_RATE_UP],
    [Const.PROP_DMG_ELEMENT_BURGEON_UP],
    [Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP],
    [Const.PROP_DMG_ELEMENT_AGGRAVATE_UP],
    [Const.PROP_DMG_ELEMENT_SPREAD_UP],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL],
    [Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL],
    [Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST],
    [Const.PROP_OTHER_OCEAN_HUED_HEALING],
  ]
    .concat(Const.PROPS_ALL_BASE_SPACIAL_PERCENT, Const.PROPS_ALL_BASE_SPACIAL)
    .map(props_all_map_func);
  //計算するリスト
  static readonly PROPS_TO_CAL = [
    Const.PROP_HP,
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
    Const.PROP_DMG_ENEMY_DEFENSE,
  ];

  // //全属性リスト
  // static readonly PROPS_ALL = Const.PROPS_ALL_BASE.concat(
  //   Const.PROPS_ENEMY_ANTI,
  //   Const.PROPS_ENEMY_DEFENSE,
  //   Const.PROPS_TO_CAL
  // );

  //聖遺物属性マップ
  static readonly MAP_ARTIFACE_PROP: Record<string, string> = {
    "FIGHT_PROP_HP": Const.PROP_HP,
    "FIGHT_PROP_ATTACK": Const.PROP_ATTACK,
    "FIGHT_PROP_DEFENSE": Const.PROP_DEFENSE,
    "FIGHT_PROP_HP_PERCENT": Const.PROP_HP_UP,
    "FIGHT_PROP_ATTACK_PERCENT": Const.PROP_ATTACK_UP,
    "FIGHT_PROP_DEFENSE_PERCENT": Const.PROP_DEFENSE_UP,
    "FIGHT_PROP_CRITICAL": Const.PROP_CRIT_RATE,
    "FIGHT_PROP_CRITICAL_HURT": Const.PROP_CRIT_DMG,
    "FIGHT_PROP_ICE_ADD_HURT": Const.PROP_DMG_BONUS_CRYO,
    "FIGHT_PROP_WIND_ADD_HURT": Const.PROP_DMG_BONUS_ANEMO,
    "FIGHT_PROP_PHYSICAL_ADD_HURT": Const.PROP_DMG_BONUS_PHYSICAL,
    "FIGHT_PROP_ELEC_ADD_HURT": Const.PROP_DMG_BONUS_ELECTRO,
    "FIGHT_PROP_ROCK_ADD_HURT": Const.PROP_DMG_BONUS_GEO,
    "FIGHT_PROP_FIRE_ADD_HURT": Const.PROP_DMG_BONUS_PYRO,
    "FIGHT_PROP_WATER_ADD_HURT": Const.PROP_DMG_BONUS_HYDRO,
    "FIGHT_PROP_GRASS_ADD_HURT": Const.PROP_DMG_BONUS_DENDRO,
    "FIGHT_PROP_CHARGE_EFFICIENCY": Const.PROP_ENERGY_RECHARGE,
    "FIGHT_PROP_ELEMENT_MASTERY": Const.PROP_ELEMENTAL_MASTERY,
    "FIGHT_PROP_HEAL_ADD": Const.PROP_HEALING_BONUS,
  }

  static readonly PROPS_ARTIFACT_FLOWER = [
    Const.PROP_HP,
  ]
  static readonly PROPS_ARTIFACT_PLUME = [
    Const.PROP_ATTACK,
  ]
  static readonly PROPS_ARTIFACT_SANDS = [
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_HP_UP,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_ELEMENTAL_MASTERY,
  ]
  static readonly PROPS_ARTIFACT_GOBLET = [
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_HP_UP,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_ELEMENTAL_MASTERY,
  ]
  static readonly PROPS_ARTIFACT_CIRCLET = [
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_HP_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_HEALING_BONUS,
  ]
  static readonly PROPS_ARTIFACT_SUB = [
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
    Const.PROP_HP,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_HP_UP,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
  ]
  static readonly ARTIFACT_FLOWER = "FLOWER";
  static readonly ARTIFACT_PLUME = "PLUME";
  static readonly ARTIFACT_SANDS = "SANDS";
  static readonly ARTIFACT_GOBLET = "GOBLET";
  static readonly ARTIFACT_CIRCLET = "CIRCLET";
  static readonly ARTIFACT_MAIN = "MAIN";
  static readonly ARTIFACT_SUB1 = "SUB1";
  static readonly ARTIFACT_SUB2 = "SUB2";
  static readonly ARTIFACT_SUB3 = "SUB3";
  static readonly ARTIFACT_SUB4 = "SUB4";

  static readonly PROPS_OTHER = [
    Const.PROP_VAL_HP,
    Const.PROP_VAL_ATTACK,
    Const.PROP_VAL_DEFENSE,
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_HEALING_BONUS,
    Const.PROP_REVERSE_HEALING_BONUS,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
    Const.PROP_DMG_BONUS_ALL,
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
    // Const.PROP_DMG_ANTI_CRYO,
    // Const.PROP_DMG_ANTI_ANEMO,
    // Const.PROP_DMG_ANTI_PHYSICAL,
    // Const.PROP_DMG_ANTI_ELECTRO,
    // Const.PROP_DMG_ANTI_GEO,
    // Const.PROP_DMG_ANTI_PYRO,
    // Const.PROP_DMG_ANTI_HYDRO,
    // Const.PROP_DMG_ANTI_DENDRO,
    Const.PROP_DMG_ANTI_CRYO_MINUS,
    Const.PROP_DMG_ANTI_ANEMO_MINUS,
    Const.PROP_DMG_ANTI_PHYSICAL_MINUS,
    Const.PROP_DMG_ANTI_ELECTRO_MINUS,
    Const.PROP_DMG_ANTI_GEO_MINUS,
    Const.PROP_DMG_ANTI_PYRO_MINUS,
    Const.PROP_DMG_ANTI_HYDRO_MINUS,
    Const.PROP_DMG_ANTI_DENDRO_MINUS,
    Const.PROP_DMG_ANTI_ALL_MINUS,
    Const.PROP_DMG_RATE_UP_CRYO,
    Const.PROP_DMG_RATE_UP_ANEMO,
    Const.PROP_DMG_RATE_UP_PHYSICAL,
    Const.PROP_DMG_RATE_UP_ELECTRO,
    Const.PROP_DMG_RATE_UP_GEO,
    Const.PROP_DMG_RATE_UP_PYRO,
    Const.PROP_DMG_RATE_UP_HYDRO,
    Const.PROP_DMG_RATE_UP_DENDRO,
    Const.PROP_DMG_RATE_UP_ALL,
    Const.PROP_DMG_RATE_UP_NORMAL,
    Const.PROP_DMG_RATE_UP_CHARGED,
    Const.PROP_DMG_RATE_UP_PLUNGING,
    Const.PROP_DMG_RATE_UP_SKILL,
    Const.PROP_DMG_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_UP_WEAPON,
    Const.PROP_DMG_RATE_UP_OTHER,
    Const.PROP_DMG_RATE_UP_SET,
    Const.PROP_HEALING_RATE_UP_SKILL,
    Const.PROP_HEALING_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_CRYO,
    Const.PROP_DMG_RATE_MULTI_ANEMO,
    Const.PROP_DMG_RATE_MULTI_PHYSICAL,
    Const.PROP_DMG_RATE_MULTI_ELECTRO,
    Const.PROP_DMG_RATE_MULTI_GEO,
    Const.PROP_DMG_RATE_MULTI_PYRO,
    Const.PROP_DMG_RATE_MULTI_HYDRO,
    Const.PROP_DMG_RATE_MULTI_DENDRO,
    Const.PROP_DMG_RATE_MULTI_ALL,
    Const.PROP_DMG_RATE_MULTI_NORMAL,
    Const.PROP_DMG_RATE_MULTI_CHARGED,
    Const.PROP_DMG_RATE_MULTI_PLUNGING,
    Const.PROP_DMG_RATE_MULTI_SKILL,
    Const.PROP_DMG_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_DMG_RATE_MULTI_WEAPON,
    Const.PROP_DMG_RATE_MULTI_OTHER,
    Const.PROP_DMG_RATE_MULTI_SET,
    Const.PROP_HEALING_RATE_MULTI_SKILL,
    Const.PROP_HEALING_RATE_MULTI_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_NORMAL,
    Const.PROP_HEALING_BONUS_SKILL,
    Const.PROP_HEALING_BONUS_ELEMENTAL_BURST,
    Const.PROP_HEALING_BONUS_WEAPON,
    Const.PROP_HEALING_BONUS_OTHER,
    Const.PROP_HEALING_BONUS_SET,
    Const.PROP_SHIELD_BONUS_NORMAL,
    Const.PROP_SHIELD_BONUS_SKILL,
    Const.PROP_SHIELD_BONUS_ELEMENTAL_BURST,
    Const.PROP_SHIELD_BONUS_WEAPON,
    Const.PROP_SHIELD_BONUS_OTHER,
    Const.PROP_SHIELD_BONUS_SET,
    Const.PROP_DMG_VAL_UP_CRYO,
    Const.PROP_DMG_VAL_UP_ANEMO,
    Const.PROP_DMG_VAL_UP_PHYSICAL,
    Const.PROP_DMG_VAL_UP_ELECTRO,
    Const.PROP_DMG_VAL_UP_GEO,
    Const.PROP_DMG_VAL_UP_PYRO,
    Const.PROP_DMG_VAL_UP_HYDRO,
    Const.PROP_DMG_VAL_UP_DENDRO,
    Const.PROP_DMG_VAL_UP_ALL,
    Const.PROP_DMG_VAL_UP_NORMAL,
    Const.PROP_DMG_VAL_UP_CHARGED,
    Const.PROP_DMG_VAL_UP_PLUNGING,
    Const.PROP_DMG_VAL_UP_SKILL,
    Const.PROP_DMG_VAL_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_VAL_UP_WEAPON,
    Const.PROP_DMG_VAL_UP_OTHER,
    Const.PROP_DMG_VAL_UP_SET,
    Const.PROP_HEALING_VAL_UP_SKILL,
    Const.PROP_HEALING_VAL_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_RATE_UP_CRYO,
    Const.PROP_DMG_CRIT_RATE_UP_ANEMO,
    Const.PROP_DMG_CRIT_RATE_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_RATE_UP_ELECTRO,
    Const.PROP_DMG_CRIT_RATE_UP_GEO,
    Const.PROP_DMG_CRIT_RATE_UP_PYRO,
    Const.PROP_DMG_CRIT_RATE_UP_HYDRO,
    Const.PROP_DMG_CRIT_RATE_UP_DENDRO,
    Const.PROP_DMG_CRIT_RATE_UP_ALL,
    Const.PROP_DMG_CRIT_RATE_UP_NORMAL,
    Const.PROP_DMG_CRIT_RATE_UP_CHARGED,
    Const.PROP_DMG_CRIT_RATE_UP_PLUNGING,
    Const.PROP_DMG_CRIT_RATE_UP_SKILL,
    Const.PROP_DMG_CRIT_RATE_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_RATE_UP_WEAPON,
    Const.PROP_DMG_CRIT_RATE_UP_OTHER,
    Const.PROP_DMG_CRIT_RATE_UP_SET,
    Const.PROP_DMG_CRIT_DMG_UP_CRYO,
    Const.PROP_DMG_CRIT_DMG_UP_ANEMO,
    Const.PROP_DMG_CRIT_DMG_UP_PHYSICAL,
    Const.PROP_DMG_CRIT_DMG_UP_ELECTRO,
    Const.PROP_DMG_CRIT_DMG_UP_GEO,
    Const.PROP_DMG_CRIT_DMG_UP_PYRO,
    Const.PROP_DMG_CRIT_DMG_UP_HYDRO,
    Const.PROP_DMG_CRIT_DMG_UP_DENDRO,
    Const.PROP_DMG_CRIT_DMG_UP_ALL,
    Const.PROP_DMG_CRIT_DMG_UP_NORMAL,
    Const.PROP_DMG_CRIT_DMG_UP_CHARGED,
    Const.PROP_DMG_CRIT_DMG_UP_PLUNGING,
    Const.PROP_DMG_CRIT_DMG_UP_SKILL,
    Const.PROP_DMG_CRIT_DMG_UP_ELEMENTAL_BURST,
    Const.PROP_DMG_CRIT_DMG_UP_WEAPON,
    Const.PROP_DMG_CRIT_DMG_UP_OTHER,
    Const.PROP_DMG_CRIT_DMG_UP_SET,
    Const.PROP_DMG_ELEMENT_UP,
    Const.PROP_DMG_ELEMENT_VAPORIZE_UP,
    Const.PROP_DMG_ELEMENT_MELT_UP,
    Const.PROP_DMG_ELEMENT_OVERLOADED_UP,
    Const.PROP_DMG_ELEMENT_BURNING_UP,
    Const.PROP_DMG_ELEMENT_ELECTROCHARGED_UP,
    Const.PROP_DMG_ELEMENT_SUPERCONDUCT_UP,
    Const.PROP_DMG_ELEMENT_SWIRL_UP,
    Const.PROP_DMG_ELEMENT_DESTRUCTION_UP,
    Const.PROP_DMG_ELEMENT_SHIELD_UP,
    Const.PROP_DMG_ELEMENT_RUPTURE_UP,
    // Const.PROP_DMG_ELEMENT_RUPTURE_RATE_UP,
    Const.PROP_DMG_ELEMENT_BURGEON_UP,
    Const.PROP_DMG_ELEMENT_HYPERBLOOM_UP,
    Const.PROP_DMG_ELEMENT_AGGRAVATE_UP,
    Const.PROP_DMG_ELEMENT_SPREAD_UP,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_DOWN_ELEMENTAL_BURST,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_NORMAL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_CHARGED,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_PLUNGING,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_SKILL,
    Const.PROP_DMG_ENEMY_DEFENSE_IGNORE_ELEMENTAL_BURST,
  ]

  static readonly PROPS_ELEMENTS = [
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    // Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
  ]

  //聖遺物全属性
  static readonly PROPS_CHIP_ALL = [
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_HP,
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
  ]

  //聖遺物属性全属性
  static readonly PROPS_CHIP_ELEMENT_ALL = [
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
  ]

  //聖遺物（パーセント）
  static readonly PROPS_CHIP_PERCENT = [
    Const.PROP_HP_UP,
    Const.PROP_ATTACK_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
  ]

  //聖遺物（小数）
  static readonly PROPS_CHIP_DECIMAL = [
    Const.PROP_HP,
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
    Const.PROP_ELEMENTAL_MASTERY,
  ]

  //最適化用サブ属性リスト
  static readonly PROPS_OPTIMAL_ARTIFACT_SUB = [
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ATTACK_UP,
    Const.PROP_HP_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_ENERGY_RECHARGE,
    // Const.PROP_ATTACK,
    // Const.PROP_HP,
    // Const.PROP_DEFENSE,
  ]

  //最適化用サブ属性リスト（固定値含め）
  static readonly PROPS_OPTIMAL_ARTIFACT_ALL_SUB = [
    Const.PROP_CRIT_RATE,
    Const.PROP_CRIT_DMG,
    Const.PROP_ATTACK_UP,
    Const.PROP_HP_UP,
    Const.PROP_DEFENSE_UP,
    Const.PROP_ELEMENTAL_MASTERY,
    Const.PROP_ENERGY_RECHARGE,
    Const.PROP_ATTACK,
    Const.PROP_HP,
    Const.PROP_DEFENSE,
  ]

  //最適化用ダメージベースリスト
  static readonly PROPS_OPTIMAL_DAMAGE_BASE_LIST = [
    Const.PROP_HP,
    Const.PROP_ATTACK,
    Const.PROP_DEFENSE,
    Const.PROP_ELEMENTAL_MASTERY,
  ]

  //最適化用元素タイプリスト
  static readonly PROPS_OPTIMAL_ELEMENT_TYPE_LIST = [
    Const.PROP_DMG_BONUS_CRYO,
    Const.PROP_DMG_BONUS_ANEMO,
    Const.PROP_DMG_BONUS_PHYSICAL,
    Const.PROP_DMG_BONUS_ELECTRO,
    Const.PROP_DMG_BONUS_GEO,
    Const.PROP_DMG_BONUS_PYRO,
    Const.PROP_DMG_BONUS_HYDRO,
    Const.PROP_DMG_BONUS_DENDRO,
  ]

  //最適化用攻撃タイプリスト
  static readonly PROPS_OPTIMAL_ATTACK_TYPE_LIST = [
    Const.PROP_DMG_BONUS_NORMAL,
    Const.PROP_DMG_BONUS_CHARGED,
    Const.PROP_DMG_BONUS_PLUNGING,
    Const.PROP_DMG_BONUS_SKILL,
    Const.PROP_DMG_BONUS_ELEMENTAL_BURST,
    Const.PROP_DMG_BONUS_WEAPON,
    Const.PROP_DMG_BONUS_OTHER,
    Const.PROP_DMG_BONUS_SET,
  ]

  //最適化用ダメージタイプリストマップ
  static readonly PROPS_OPTIMAL_DAMAGE_TYPE_LIST_MAP: Map<string, string[]> = new Map([
    [Const.PROP_DMG_BONUS_CRYO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "originMeltDmg",
      "cirtMeltDmg",
      "expectMeltDmg",
      "superconductDmg",
    ]],
    [Const.PROP_DMG_BONUS_ANEMO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "swirlCryoDmg",
      "swirlElectroDmg",
      "swirlElectroAggravateDmg",
      "swirlPyroDmg",
      "swirlHydroDmg",
    ]],
    [Const.PROP_DMG_BONUS_PHYSICAL, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "destructionDmg",
    ]],
    [Const.PROP_DMG_BONUS_ELECTRO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "originAggravateDmg",
      "cirtAggravateDmg",
      "expectAggravateDmg",
      "overloadedDmg",
      "electroChargedDmg",
      "superconductDmg",
      "hyperbloomDmg",
    ]],
    [Const.PROP_DMG_BONUS_GEO, [
      "originDmg",
      "critDmg",
      "expectDmg",
    ]],
    [Const.PROP_DMG_BONUS_PYRO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "originVaporizeDmg",
      "cirtVaporizeDmg",
      "expectVaporizeDmg",
      "originMeltDmg",
      "cirtMeltDmg",
      "expectMeltDmg",
      "overloadedDmg",
      "burningDmg",
      "burgeonDmg",
    ]],
    [Const.PROP_DMG_BONUS_HYDRO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "originVaporizeDmg",
      "cirtVaporizeDmg",
      "expectVaporizeDmg",
      "electroChargedDmg",
      "ruptureDmg",
    ]],
    [Const.PROP_DMG_BONUS_DENDRO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "originSpreadDmg",
      "cirtSpreadDmg",
      "expectSpreadDmg",
      "burningDmg",
      "ruptureDmg",
    ]],
  ]);
  //ダメージタイプ（絶対値）リストマップ
  static readonly PROPS_OPTIMAL_DAMAGE_TYPE_LIST_ABS_MAP: Map<string, string[]> = new Map([
    [Const.PROP_DMG_BONUS_CRYO, [
      "originDmg",
      "superconductDmg",
    ]],
    [Const.PROP_DMG_BONUS_ANEMO, [
      "originDmg",
      "swirlCryoDmg",
      "swirlElectroDmg",
      "swirlElectroAggravateDmg",
      "swirlPyroDmg",
      "swirlHydroDmg",
    ]],
    [Const.PROP_DMG_BONUS_PHYSICAL, [
      "originDmg",
    ]],
    [Const.PROP_DMG_BONUS_ELECTRO, [
      "originDmg",
      "critDmg",
      "expectDmg",
      "overloadedDmg",
      "electroChargedDmg",
      "superconductDmg",
      "hyperbloomDmg",
    ]],
    [Const.PROP_DMG_BONUS_GEO, [
      "originDmg",
    ]],
    [Const.PROP_DMG_BONUS_PYRO, [
      "originDmg",
      "overloadedDmg",
      "burningDmg",
      "burgeonDmg",
    ]],
    [Const.PROP_DMG_BONUS_HYDRO, [
      "originDmg",
      "electroChargedDmg",
      "ruptureDmg",
    ]],
    [Const.PROP_DMG_BONUS_DENDRO, [
      "originDmg",
      "burningDmg",
      "ruptureDmg",
    ]],
  ]);

  //*********************************
  //           原神データ
  //*********************************

  //キャラレベルデータ
  static readonly SAVE_CHARACTER = "SAVE_CHARACTER";
  //キャラ武器データ
  static readonly SAVE_CHARACTER_WEAPON = "SAVE_CHARACTER_WEAPON";
  //敵データ
  static readonly SAVE_MONSTER = "SAVE_MONSTER";
  //追加データ
  static readonly SAVE_EXTRA = "SAVE_EXTRA";
  //聖遺物データ
  static readonly SAVE_ARTIFACT = "SAVE_ARTIFACT";
  //その他データ
  static readonly SAVE_OTHER = "SAVE_OTHER";
  //Enkaデータ
  static readonly SAVE_ENKA = "SAVE_ENKA";
  //チームデータ
  static readonly SAVE_TEAM = "SAVE_TEAM";
  //システム設定データ
  static readonly SAVE_SYS_SETTING = "SAVE_SYS_SETTING";
  //DOSデータ
  static readonly SAVE_DPS = "SAVE_DPS";

  //*********************************
  //           原神その他データ
  //*********************************

  //旅人さん（男）
  static readonly PLAYER_BOY = "10000005";
  //旅人さん（女）
  static readonly PLAYER_GIRL = "10000007";

  static readonly PLAYER_BOY_ELEMENT: Record<string, string> = {
    "502": "PYRO",  //旅人さん（火）
    "503": "HYDRO",  //旅人さん（水）
    "504": "ANEMO",  //旅人さん（風）
    "505": "CRYO",  //旅人さん（氷）
    "506": "GEO",  //旅人さん（岩）
    "507": "ELECTRO",  //旅人さん（雷）
    "508": "DENDRO" //旅人さん（草）
  }

  static readonly PLAYER_GIRL_ELEMENT: Record<string, string> = {
    "702": "PYRO",  //旅人さん（火）
    "703": "HYDRO",  //旅人さん（水）
    "704": "ANEMO",  //旅人さん（風）
    "705": "CRYO",  //旅人さん（氷）
    "706": "GEO",  //旅人さん（岩）
    "707": "ELECTRO",  //旅人さん（雷）
    "708": "DENDRO" //旅人さん（草）
  }

  static readonly PLAYER_BOY_CRYO = "505";  //旅人さん（氷）
  static readonly PLAYER_BOY_ANEMO = "504";  //旅人さん（風）
  static readonly PLAYER_BOY_ELECTRO = "507";  //旅人さん（雷）
  static readonly PLAYER_BOY_GEO = "506";  //旅人さん（岩）
  static readonly PLAYER_BOY_PYRO = "502";  //旅人さん（火）
  static readonly PLAYER_BOY_HYDRO = "503";  //旅人さん（水）
  static readonly PLAYER_BOY_DENDRO = "508";  //旅人さん（草）

  static readonly PLAYER_GIRL_CRYO = "705";  //旅人さん（氷）
  static readonly PLAYER_GIRL_ANEMO = "704";  //旅人さん（風）
  static readonly PLAYER_GIRL_ELECTRO = "707";  //旅人さん（雷）
  static readonly PLAYER_GIRL_GEO = "706";  //旅人さん（岩）
  static readonly PLAYER_GIRL_PYRO = "702";  //旅人さん（火）
  static readonly PLAYER_GIRL_HYDRO = "703";  //旅人さん（水）
  static readonly PLAYER_GIRL_DENDRO = "708";  //旅人さん（草）

  static readonly ELEMENT_TYPE_MAP: Map<ElementType, string> = new Map([
    [2, "PYRO"],
    [3, "HYDRO"],
    [4, "ANEMO"],
    [5, "CRYO"],
    [6, "GEO"],
    [7, "ELECTRO"],
    [8, "DENDRO"],
  ])

  static readonly ELEMENT_BONUS_TYPE_MAP: Map<string, string> = new Map([
    ["DMG_BONUS_CRYO", "CRYO"],
    ["DMG_BONUS_ANEMO", "ANEMO"],
    ["DMG_BONUS_ELECTRO", "ELECTRO"],
    ["DMG_BONUS_GEO", "GEO"],
    ["DMG_BONUS_PYRO", "PYRO"],
    ["DMG_BONUS_HYDRO", "HYDRO"],
    ["DMG_BONUS_DENDRO", "DENDRO"],
    ["DMG_BONUS_PHYSICAL", "PHYSICAL"],
  ])

  //*********************************
  //           共通符
  //*********************************
  //全キャラキー
  static readonly ALL_CHARACTER_KEY = "";
  //全属性キー
  static readonly ALL_PROPS_KEY = "ALL";
  //属性キー実際の値
  static readonly SUFFIX_ACTUAL_KEY = "_ACTUAL";
  //属性キー（文字列）
  static readonly SUFFIX_KEY_STR = "_STR";
  //チップ
  static readonly CONCATENATION_CHIP = "_";
}
