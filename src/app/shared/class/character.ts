import { TYPE_SYS_LANG } from "src/app/shared/shared.module";
import { CharPromotoLevelType, CharQualityType, ElementType, WeaponType } from "./type";

//*********************************
//            画像情報
//*********************************
export interface CharImages {
    background: string;
    icon: string;
}

export interface SkillImages {
    icon: string;
}

export interface OhterInfo {
    birthMonth: number;
    birthDay: number;
    backgroundText: Record<TYPE_SYS_LANG, string>;
    constellationName: Record<TYPE_SYS_LANG, string>;
    tiltleName: Record<TYPE_SYS_LANG, string>;
    detailText: Record<TYPE_SYS_LANG, string>;
    elementText: Record<TYPE_SYS_LANG, string>;
    assoc: string;
    elementType: ElementType;
}

//*********************************
//            属性情報
//*********************************
export interface CharStatus {
    //レベル
    level: number;
    //突破段階
    promoteLevel: CharPromotoLevelType;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
    // //キャラ突破増加値
    // specialized: number;
    //生命力アップ
    hp_up: number;
    //攻撃力アップ
    attack_up: number;
    //防御力アップ
    defense_up: number;
    //会心率
    crit_rate: number;
    //会心ダメージ
    crit_dmg: number;
    //元素チャージ効率
    energy_recharge: number;
    //与える治療効果
    healing_bonus: number;
    //受ける治療効果
    reverse_healing_bonus: number;
    //元素熟知
    elemental_mastery: number;
    //氷元素ダメージ
    dmg_bonus_cryo: number;
    //風元素ダメージ
    dmg_bonus_anemo: number;
    //物理ダメージ
    dmg_bonus_physical: number;
    //雷元素ダメージ
    dmg_bonus_electro: number;
    //岩元素ダメージ
    dmg_bonus_geo: number;
    //火元素ダメージ
    dmg_bonus_pyro: number;
    //水元素ダメージ
    dmg_bonus_hydro: number;
    //草元素ダメージ
    dmg_bonus_dendro: number;
    //全ダメージ
    dmg_bonus_all: number;
    //基本攻撃ダメージ
    dmg_bonus_normal: number;
    //重撃ダメージ
    dmg_bonus_charged: number;
    //落下攻撃ダメージ
    dmg_bonus_plunging: number;
    //元素スキルダメージ
    dmg_bonus_skill: number;
    //元素爆発ダメージ
    dmg_bonus_elemental_burst: number;
}

//*********************************
//            スキル情報
//*********************************
export interface CharSkillDescObject {
    desc: string;
    valuePropIndexs: number[];
    prefix: string;
    middles: string[];
    suffix: string;
    isPercent: boolean[];
}

export interface CharSkill {
    //ID
    id: number;
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //記述
    desc: Record<TYPE_SYS_LANG, string>;
    //アイコン
    icon: string;
    //記述パラメータ
    paramDescList: Record<TYPE_SYS_LANG, string[]>;
    //パラメータ
    paramMap: Record<string, number[]>;
    //計算後の記述パラメータ
    paramDescSplitedList: Record<TYPE_SYS_LANG, CharSkillDescObject[]>;
    //レベルなしのスキルパラメータインデックス
    paramValidIndexs: number[];
    //スキルID
    proudSkillGroupId: number;
    //*********************************
    //            リソース
    //*********************************
    //画像
    images: SkillImages;
}

export interface CharSkills {
    //ID
    id: number;
    //普通攻撃
    normal: CharSkill;
    //元素戦技
    skill: CharSkill;
    //その他
    other: CharSkill;
    //元素爆発
    elementalBurst: CharSkill;
    //タレント
    proudSkills: CharSkill[];
    //星座
    talents: CharSkill[];
}

//*********************************
//        キャラクターベース
//*********************************
export interface character {

    //*********************************
    //            基本情報
    //*********************************
    //ID
    id: number;
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //レアリティー
    qualityType: CharQualityType;
    //記述
    desc: Record<TYPE_SYS_LANG, string>;
    //武器タイプ
    weaponType: WeaponType;
    //その他の情報
    info: OhterInfo;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images: CharImages;

    //*********************************
    //             その他
    //*********************************
    //レベル属性マップ
    levelMap: Record<string, CharStatus>;
    //スキル
    skills: CharSkills;

}
