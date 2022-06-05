import { LangInfo, TYPE_GENSHINDB_LANG, TYPE_SYS_LANG, TYPE_TESSERACT_LANG } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

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
  //           　属性
  //*********************************
  //レベル
  static readonly PROP_LEVEL = "LEVEL";
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

  //冰元素耐性
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
  //元素スキル治療倍率アップ値
  static readonly PROP_HEALING_RATE_UP_SKILL = "HEALING_RATE_UP_SKILL";
  //元素爆発治療倍率アップ値
  static readonly PROP_HEALING_RATE_UP_ELEMENTAL_BURST = "HEALING_RATE_UP_ELEMENTAL_BURST";

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
  //元素スキル治療アップ値
  static readonly PROP_HEALING_VAL_UP_SKILL = "HEALING_VAL_UP_SKILL";
  //元素爆発治療アップ値
  static readonly PROP_HEALING_VAL_UP_ELEMENTAL_BURST = "HEALING_VAL_UP_ELEMENTAL_BURST";

  //元素(増幅)
  static readonly PROP_DMG_VAL_ELEMENT_UP = "DMG_VAL_ELEMENT_UP";

  //敵防御(増幅)
  static readonly PROP_DMG_VAL_ENEMY_DEFENSE = "DMG_VAL_ENEMY_DEFENSE";

  //耐性(増幅)
  static readonly PROP_DMG_VAL_ENEMY_ANTI_DMG = "DMG_VAL_ENEMY_ANTI_DMG";

  //ダメージ値結果
  static readonly PROP_DMG_VAL_FINAL = "DMG_VAL_FINAL";


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
  ];
  //サブ属性リスト（敵）
  static readonly PROPS_ENEMY_SUB = Const.PROPS_CHARA_WEAPON_SUB.concat([
    Const.PROP_DMG_ANTI_CRYO,
    Const.PROP_DMG_ANTI_ANEMO,
    Const.PROP_DMG_ANTI_PHYSICAL,
    Const.PROP_DMG_ANTI_ELECTRO,
    Const.PROP_DMG_ANTI_GEO,
    Const.PROP_DMG_ANTI_PYRO,
    Const.PROP_DMG_ANTI_HYDRO,
    Const.PROP_DMG_ANTI_DENDRO,
  ]);
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
  ];
  //パーセント属性リスト（敵）
  static readonly PROPS_ENEMY_PERCENT = Const.PROPS_CHARA_WEAPON_PERCENT.concat([
    Const.PROP_DMG_ANTI_CRYO,
    Const.PROP_DMG_ANTI_ANEMO,
    Const.PROP_DMG_ANTI_PHYSICAL,
    Const.PROP_DMG_ANTI_ELECTRO,
    Const.PROP_DMG_ANTI_GEO,
    Const.PROP_DMG_ANTI_PYRO,
    Const.PROP_DMG_ANTI_HYDRO,
    Const.PROP_DMG_ANTI_DENDRO,
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

}
