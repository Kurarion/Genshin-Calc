import { TYPE_SYS_LANG } from "src/app/shared/shared.module";
import { WeaponPromotoLevelType, WeaponType } from "./type";

//*********************************
//            画像情報
//*********************************
export interface WeaponImages {
    //突破前
    icon: string;
    //突破後
    awakenicon: string;
}

//*********************************
//            属性情報
//*********************************
export interface WeaponStatus {
    //レベル
    level: number;
    //突破段階
    promoteLevel: WeaponPromotoLevelType;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
    //キャラ突破増加値
    specialized: number;
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
//          武器効果情報
//*********************************
export interface WeaponSkillAffix {
    //ID
    affixId: number;
    //武器ＩＤ
    id: number;
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //記述
    desc: Record<TYPE_SYS_LANG, string>;
    //レベル
    level: number;
    //パラメータ
    paramList: number[];
    //レベルなしのスキルパラメータインデックス
    paramValidIndexs: number[];
}

//*********************************
//            武器ベース
//*********************************
export interface weapon {

    //*********************************
    //            基本情報
    //*********************************
    //ID
    id: string;
    //ランクレベル
    rankLevel: number;
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //記述
    description: Record<TYPE_SYS_LANG, string>;
    //武器タイプ
    weaponType: WeaponType;
    //武器効果マップ
    skillAffixMap: Record<string, WeaponSkillAffix>;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images: WeaponImages;

    //*********************************
    //             その他
    //*********************************
    //レベル属性マップ
    levelMap: Record<string, WeaponStatus>;

}
