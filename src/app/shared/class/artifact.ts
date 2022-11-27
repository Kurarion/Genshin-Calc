import { TYPE_SYS_LANG } from "src/app/shared/shared.module";

//*********************************
//            画像情報
//*********************************
export interface ArtifactImages {
    icon: string;
}

export interface ArtifactSetAddProp {
    //名前
    propType: string;
    //記述
    value: number;
}

export interface ArtifactSetAffixs {
    //名前
    name: Record<TYPE_SYS_LANG, string>;
    //記述
    desc: Record<TYPE_SYS_LANG, string>;
    //効果
    addProps: ArtifactSetAddProp[];
    //レベル
    level: number;
    //パラメータリスト
    paramList: number[];
    //レベルなしのスキルパラメータインデックス
    paramValidIndexs: number[];
}

//*********************************
//           聖遺物セット
//*********************************
export interface artifactSet {
    //ID
    setId: number;
    //名前
    setName: Record<TYPE_SYS_LANG, string>;
    //セット効果
    setAffixs: ArtifactSetAffixs[];
    //*********************************
    //            リソース
    //*********************************
    //画像
    images: ArtifactImages;
}

//*********************************
//     聖遺物コンポーネントデータ
//*********************************
export interface artifactStatus {
    //生命値
    hp?: number;
    //攻撃値
    attack?: number;
    //防御値
    defense?: number;
    //生命力アップ
    hp_up?: number;
    //攻撃力アップ
    attack_up?: number;
    //防御力アップ
    defense_up?: number;
    //会心率
    crit_rate?: number;
    //会心ダメージ
    crit_dmg?: number;
    //元素チャージ効率
    energy_recharge?: number;
    //与える治療効果
    healing_bonus?: number;
    //元素熟知
    elemental_mastery?: number;
    //氷元素ダメージ
    dmg_bonus_cryo?: number;
    //風元素ダメージ
    dmg_bonus_anemo?: number;
    //物理ダメージ
    dmg_bonus_physical?: number;
    //雷元素ダメージ
    dmg_bonus_electro?: number;
    //岩元素ダメージ
    dmg_bonus_geo?: number;
    //火元素ダメージ
    dmg_bonus_pyro?: number;
    //水元素ダメージ
    dmg_bonus_hydro?: number;
    //草元素ダメージ
    dmg_bonus_dendro?: number;
}

//*********************************
//        聖遺物コンポーネント
//*********************************
export interface artifactPartData {
    main: artifactStatus;
    sub1: artifactStatus;
    sub2: artifactStatus;
    sub3: artifactStatus;
    sub4: artifactStatus;
}

//*********************************
//             聖遺物
//*********************************
export interface artifact {
    //セット情報
    setInfo: artifactSet;
    //各部分データ
    flower: artifactPartData;
    plume: artifactPartData;
    sands: artifactPartData;
    goblet: artifactPartData;
    circlet: artifactPartData;
}