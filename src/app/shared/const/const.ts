import { LangInfo, TYPE_GENSHINDB_LANG, TYPE_SYS_LANG, TYPE_TESSERACT_LANG } from 'src/app/shared/shared.module';

export class Const {
  //*********************************
  //        ローカルストレージ
  //*********************************
  static readonly STORAGE_LANG = 'lang';

  //*********************************
  //             言語
  //*********************************
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

  static readonly QUERY_LANG: TYPE_SYS_LANG = 'cn_sim';

  //*********************************
  //          クッキーキー
  //*********************************
  static readonly ID_CAPTURE_ELEMENT = 'toCaptureElement';

  //*********************************
  //            メニュー
  //*********************************
  static readonly MENU_CHARACTER = 'character';

  //*********************************
  //           スペシャル
  //*********************************
  static readonly MAP_PROPS_SPECIALIZED: Record<string, string> = {
    "生命值": "HP_UP",
    "攻击力": "ATTACK_UP",
    "防御力": "DEFENSE_UP",
    "暴击率": "CRIT_RATE",
    "暴击伤害": "CRIT_DMG",
    "元素充能效率": "ENERGY_RECHARGE",
    "治疗加成": "HEALING_BONUS",
    // "受治疗加成": "REVERSE_HEALING_BONUS",
    "元素精通": "ELEMENTAL_MASTERY",
    "冰元素伤害加成": "DMG_BONUS_CRYO",
    "风元素伤害加成": "DMG_BONUS_ANEMO",
    "物理伤害加成": "DMG_BONUS_PHYSICAL",
    "雷元素伤害加成": "DMG_BONUS_ELECTRO",
    "岩元素伤害加成": "DMG_BONUS_GEO",
    "火元素伤害加成": "DMG_BONUS_PYRO",
    "水元素伤害加成": "DMG_BONUS_HYDRO",
    "草元素伤害加成": "DMG_BONUS_DENDRO",
    // "全增伤": "DMG_BONUS_ALL",
    // "普攻增伤": "DMG_BONUS_NORMAL",
    // "重击增伤": "DMG_BONUS_CHARGED",
    // "下落增伤": "DMG_BONUS_PLUNGING",
    // "元素战技增伤": "DMG_BONUS_SKILL",
    // "元素爆发增伤": "DMG_BONUS_ELEMENTAL_BURST",
  };


}
