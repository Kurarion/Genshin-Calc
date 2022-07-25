
export interface EnkaInfos{
    playerInfo?: EnkaPlayer;
    avatarInfoList?: EnkaAvatar[];
}

//*********************************
//           プレイヤー情報
//*********************************
export interface EnkaPlayer {
    nickname?: string;
    level?: number;
    signature?: string;
    worldLevel?: number;
}

//*********************************
//            キャラ情報
//*********************************
export interface EnkaAvatar {
    //キャラＩＤ
    avatarId: number;
    //スキルＩＤ
    skillDepotId: number;
    //基本情報
    propMap: Record<string, EnkaProp>;
    //命の星座
    talentIdList?: number[];
    //スキルレベル
    skillLevelMap?: Record<string, number>;
    //スキルレベル（星座追加）
    proudSkillExtraLevelMap?: Record<string, number>;
    //聖遺物と武器
    equipList?: EnkaEquip[];
}

//*********************************
//           　その他
//*********************************
export interface EnkaEquip {
    itemId: number;
    //聖遺物
    reliquary?: EnkaReliquary;
    //武器
    weapon?: EnkaWeapon;
    //データ
    flat: EnkaFlat;
}

export interface EnkaReliquary {
    //レベル
    level: number;
}

export interface EnkaWeapon {
    //レベル
    level: number;
    //突破レベル
    promoteLevel: number;
    //武器精錬
    affixMap: Record<string, number>;
}

export interface EnkaFlat {
    //星級
    rankLevel: number;
    //メイン
    reliquaryMainstat?: EnkaFlatMainStat;
    //サブ
    reliquarySubstats?: EnkaFlatSubStat[];
    //武器
    weaponStats?: EnkaFlatSubStat[];
    //タイプ
    itemType: string;
    //アイコン
    icon: string;
    //装備タイプ
    equipType?: string;
}

export interface EnkaProp {
    type: string;
    val: string;
}

export interface EnkaFlatSubStat {
    //属性
    appendPropId: string;
    //値
    statValue: number;
}

export interface EnkaFlatMainStat {
    //属性
    mainPropId: string;
    //値
    statValue: number;
}