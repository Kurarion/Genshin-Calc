import { genshindb, TYPE_SYS_LANG, Const } from "src/app/shared/shared.module";

export interface CharImagesType {
    card: string;
    portrait: string;
    icon: string;
    sideicon: string;
    cover1: string;
    cover2: string;
    'hoyolab-avatar': string;
}

export interface CharCreateOption {
    matchAliases?: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface CharListOption {
    // matchCategories: boolean,
    // queryLanguages?: TYPE_SYS_LANG,
    resultLanguage?: TYPE_SYS_LANG,
}

export interface CharStatus {
    //*********************************
    //            属性情報
    //*********************************
    //レベル
    level: number;
    //突破段階
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    //生命値
    hp: number;
    //攻撃値
    attack: number;
    //防御値
    defense: number;
    //キャラ突破増加値
    specialized: number;
}

//キャラクターベース
export class character {

    //*********************************
    //            基本情報
    //*********************************
    //名前
    name!: string;
    fullname!: string;
    //レアリティー
    rarity!: number;
    //元素タイプ
    element!: string;
    //所属
    association!: string;
    //出身
    region!: string;
    //星座名
    constellation!: string;
    //武器タイプ
    weapontype!: string;
    //突破属性
    substat!: string;

    //*********************************
    //            リソース
    //*********************************
    //画像
    images!: CharImagesType;

    //*********************************
    //             その他
    //*********************************
    //レベル基本属性クエリメソッド
    stats!: (level: string | number, option?: "+") => CharStatus;

    //コンストラクタ
    constructor(data: any) {
        ({
            name: this.name,
            fullname: this.fullname,
            rarity: this.rarity,
            element: this.element,
            association: this.association,
            region: this.region,
            constellation: this.constellation,
            weapontype: this.weapontype,
            substat: this.substat,
            images: this.images,
            stats: this.stats,
        } = data);
    }
}
