import { TYPE_SYS_LANG } from "src/app/shared/shared.module";
import { EnemyType } from "./type";

//*********************************
//            画像情報
//*********************************
export interface EnemyImages {
    icon: string;
}

//*********************************
//            属性情報
//*********************************
export interface EnemyStatus {
    //レベル
    level: number;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
    //冰元素耐性
    dmg_anti_cryo: number;
    //風元素耐性
    dmg_anti_anemo: number;
    //物理耐性
    dmg_anti_physical: number;
    //雷元素耐性
    dmg_anti_electro: number;
    //岩元素耐性
    dmg_anti_geo: number;
    //火元素耐性
    dmg_anti_pyro: number;
    //水元素耐性
    dmg_anti_hydro: number;
    //草元素耐性
    dmg_anti_dendro: number;
}

//*********************************
//        モンスターベース
//*********************************
export interface enemy {

    //*********************************
    //            基本情報
    //*********************************
    //ID
    id: string;
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //モンスターコード名
    monsterName: string;
    //タイプ
    type: EnemyType;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images: EnemyImages;

    //*********************************
    //             その他
    //*********************************
    //レベル属性マップ
    levelMap: Record<string, EnemyStatus>;

}
